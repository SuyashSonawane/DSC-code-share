import { Component, OnInit } from "@angular/core";
import { PickerController, ToastController } from "@ionic/angular";
import { DataproviderService } from "../dataprovider.service";
import { AlertController } from "@ionic/angular";
import { Router } from "@angular/router";
import { LoadingController } from "@ionic/angular";
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType,
  Filesystem
} from "@capacitor/core";
import * as firebase from "firebase";
import { BackPressService } from "../back-press.service";
import { LocalStorageService } from "../local-storage.service";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";

@Component({
  selector: "app-mynotices",
  templateUrl: "./mynotices.page.html",
  styleUrls: ["./mynotices.page.scss"]
})
export class MynoticesPage implements OnInit {
  selectedImage: string;
  url;
  public images: Array<string> = [];
  public urls: Array<string> = [];
  counter: number;
  fileContent: any;
  fileType: string = null;
  currentUser;

  divBatches = [];
  uniqueDivBatches = [];

  constructor(
    private pickerController: PickerController,
    private DataService: DataproviderService,
    private router: Router,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private backPressService: BackPressService,
    private localStorageService: LocalStorageService,
    public toastController: ToastController
  ) {}

  ionViewDidEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }

  onFileChange(event) {
    let reader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      // console.log(file);
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.fileContent = reader.result;
      };
    }
  }

  errorMessages = {
    title: [{ type: "required", message: "Title is required" }],
    body: [{ type: "required", message: "Notice Body is required" }],
    category: [{ type: "required", message: "Category is required" }],
    divBatches: [
      { type: "required", message: "Atleast one batch must be selected!" }
    ]
  };

  addNoticeForm = new FormGroup({
    title: new FormControl("", Validators.required),
    body: new FormControl("", Validators.required),
    category: new FormControl("", Validators.required),
    // divBatches: new FormControl(""),
    fileType: new FormControl("", Validators.required)
  });

  onFileTypeChange() {
    this.fileType = this.addNoticeForm.value.fileType;
  }

  onDivChange = (event, div1, div2, div3) => {
    if (event.detail.checked) {
      div1.checked = true;
      div2.checked = true;
      div3.checked = true;
      this.divBatches.push(div1.el.name, div2.el.name, div3.el.name);
    } else {
      div1.checked = false;
      div2.checked = false;
      div3.checked = false;
      this.divBatches = this.divBatches.filter(item => item !== div1.el.name);
      this.divBatches = this.divBatches.filter(item => item !== div2.el.name);
      this.divBatches = this.divBatches.filter(item => item !== div3.el.name);
    }
  };

  onSubDivChange = (event, div, div1, div2) => {
    if (!event.detail.checked) {
      div.checked = false;
      this.divBatches = this.divBatches.filter(
        item => item !== event.target.name
      );
    } else {
      if (div1.checked && div2.checked) {
        div.checked = true;
      } else {
        this.divBatches.push(event.target.name);
      }
    }
  };

  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  getUnique(array) {
    var uniqueArray = [];

    // Loop through array values
    for (var value of array) {
      if (uniqueArray.indexOf(value) === -1) {
        uniqueArray.push(value);
      }
    }
    this.uniqueDivBatches = uniqueArray;
  }

  async onSubmit() {
    if (this.divBatches.length === 0) {
      this.presentToast(`Atleast one batch must be selected!`);
    } else {
      this.getUnique(this.divBatches);
      const loading = await this.loadingController.create({
        message: "Uploading Notice  .."
      });
      await loading.present();
      if (this.addNoticeForm.value.fileType === "i") {
        this.counter = 0;
        this.images.forEach(image => {
          firebase
            .storage()
            .ref(`images/${this.addNoticeForm.value.div}`)
            .child(this.afs.createId())
            .putString(image, "data_url")
            .then(snap => {
              snap.ref.getDownloadURL().then(url => {
                this.urls.push(url);
                this.counter++;
                if (this.counter === this.images.length) {
                  console.log(this.uniqueDivBatches);
                  this.DataService.addNotice(
                    this.addNoticeForm.value.title,
                    this.addNoticeForm.value.body,
                    this.uniqueDivBatches,
                    this.addNoticeForm.value.category,
                    this.urls,
                    "image",
                    this.currentUser.displayName
                  );
                  loading.dismiss();
                  this.router.navigate(["/"]);
                }
              });
            });
        });
      }
      if (this.addNoticeForm.value.fileType === "p") {
        firebase
          .storage()
          .ref(`pdf/${this.afs.createId()}`)
          .putString(this.fileContent, "data_url")
          .then(snap => {
            snap.ref.getDownloadURL().then(url => {
              this.DataService.addNotice(
                this.addNoticeForm.value.title,
                this.addNoticeForm.value.body,
                this.uniqueDivBatches,
                this.addNoticeForm.value.category,
                url,
                "pdf",
                this.currentUser.displayName
              );
              loading.dismiss();
              this.router.navigate(["/"]);
            });
          });
      }
    }
  }

  takePhoto() {
    if (Capacitor.isPluginAvailable("Camera")) {
      Plugins.Camera.getPhoto({
        quality: 20,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl
      })
        .then(image => {
          this.selectedImage = image.dataUrl;
          this.images.push(image.dataUrl);
        })
        .catch(err => console.log(err));
    }
  }
  async remove(index: number) {
    const alert = await this.alertController.create({
      header: "Alert",
      subHeader: "Delete Alert",
      message: "Are you sure to delete the image",
      buttons: [
        {
          text: "Yes",
          handler: () => {
            if (index > -1) {
              this.images.splice(index, 1);
            }
          }
        },
        {
          text: "No"
        }
      ]
    });
    await alert.present();
  }

  ngOnInit() {
    this.localStorageService.getLocalUser().then(val => {
      this.currentUser = JSON.parse(val).user;
    });
  }
}
