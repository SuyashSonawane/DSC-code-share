import { Component, OnInit } from "@angular/core";
import { PickerController } from "@ionic/angular";
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

@Component({
  selector: "app-mynotices",
  templateUrl: "./mynotices.page.html",
  styleUrls: ["./mynotices.page.scss"]
})
export class MynoticesPage implements OnInit {
  public Department = "Department";
  public Year = "Year";
  public title = "";
  public notice = "";
  public division = "";
  public category = "All";
  selectedImage: string;
  url;
  public images: Array<string> = [];
  public urls: Array<string> = [];
  counter: number;
  fileContent: any;
  fileType: string = null;
  currentUser;

  constructor(
    private pickerController: PickerController,
    private DataService: DataproviderService,
    private router: Router,
    private afs: AngularFirestore,
    private storage: AngularFireStorage,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private backPressService: BackPressService,
    private localStorageService: LocalStorageService
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
  async openPicker() {
    console.log(this.fileType);
    let opts = {
      buttons: [
        // {
        //   text: "Cancel",
        //   role: "cancel"
        // },
        {
          text: "Done",
          role: "dismiss"
        }
      ],
      columns: [
        {
          name: "Department",
          options: [
            { text: "MECH", value: "MECH" },
            { text: "COMP", value: "COMP" },
            { text: "IT", value: "IT" },
            { text: "ENTC", value: "ENTC" },
            { text: "CIVIL", value: "CIVIL" },
            { text: "FE", value: "FE" }
          ]
        },
        {
          name: "Year",
          options: [
            { text: "SE", value: "SE" },
            { text: "TE", value: "TE" },
            { text: "BE", value: "BE" }
          ]
        },
        {
          name: "Category",
          options: [
            { text: "Academics", value: "Academics" },
            { text: "Scholarship", value: "Scholarship" },
            { text: "All", value: "All" },
            { text: "News", value: "News" },
            { text: "Other", value: "Other" }
          ]
        }
      ]
    };
    let picker = await this.pickerController.create(opts);
    picker.present();
    picker.onDidDismiss().then(() => {
      picker.getColumn("Year").then(data => {
        let Data = data.options[data.selectedIndex].text;
        // console.log(Data);
        this.Year = Data;
      });
      picker.getColumn("Department").then(data => {
        let Data = data.options[data.selectedIndex].text;
        this.Department = Data;
        if (Data == "FE") this.Year = "Not Applicable";
      });
      picker.getColumn("Category").then(data => {
        let Data = data.options[data.selectedIndex].text;
        this.category = Data;
      });
    });
  }

  async submit() {
    const loading = await this.loadingController.create({
      message: "Uploading Notice  .."
    });
    await loading.present();
    if (this.fileType === "i") {
      this.counter = 0;
      this.images.forEach(image => {
        firebase
          .storage()
          .ref(`images/${this.Department}`)
          .child(this.afs.createId())
          .putString(image, "data_url")
          .then(snap => {
            snap.ref.getDownloadURL().then(url => {
              this.urls.push(url);
              this.counter++;
              if (this.counter === this.images.length) {
                this.DataService.addNotice(
                  this.notice,
                  this.title,
                  this.division,
                  this.Year,
                  this.Department,
                  this.category,
                  this.urls,
                  "image",
                  this.currentUser.displayName
                );
                loading.dismiss();
                this.Department = "Department";
                this.Year = "Year";
                this.title = "";
                this.notice = "";
                this.division = "";
                this.category = "All";
                this.router.navigate(["/"]);
              }
            });
          });
      });
    }
    if (this.fileType === "p") {
      firebase
        .storage()
        .ref(`pdf/${this.afs.createId()}`)
        .putString(this.fileContent, "data_url")
        .then(snap => {
          snap.ref.getDownloadURL().then(url => {
            this.DataService.addNotice(
              this.notice,
              this.title,
              this.division,
              this.Year,
              this.Department,
              this.category,
              url,
              "pdf",
              this.currentUser.displayName
            );
            loading.dismiss();
            this.Department = "Department";
            this.Year = "Year";
            this.title = "";
            this.notice = "";
            this.division = "";
            this.category = "All";
            this.router.navigate(["/"]);
          });
        });
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
      console.log(this.currentUser.displayName);
    });
  }
}
