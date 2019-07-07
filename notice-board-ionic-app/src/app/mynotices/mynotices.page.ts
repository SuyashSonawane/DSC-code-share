import { Component, OnInit } from "@angular/core";
import { PickerController } from "@ionic/angular";
import { DataproviderService } from "../dataprovider.service";
import { Router } from "@angular/router";
import {
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  AngularFirestore
} from "@angular/fire/firestore";
import { AngularFireStorage } from "@angular/fire/storage";

import {
  Capacitor,
  Plugins,
  CameraSource,
  CameraResultType
} from "@capacitor/core";
import * as firebase from "firebase";

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

  constructor(
    private pickerController: PickerController,
    private DataService: DataproviderService,
    private router: Router,
    private afs: AngularFirestore,
    private storage: AngularFireStorage
  ) {}
  async openPicker() {
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

  submit() {
    this.DataService.addNotice(
      this.notice,
      this.title,
      this.division,
      this.Year,
      this.Department,
      this.category,
      this.url
    );
    this.Department = "Department";
    this.Year = "Year";
    this.title = "";
    this.notice = "";
    this.division = "";
    this.category = "All";
    this.router.navigate(["/"]);
  }

  takePhoto() {
    if (Capacitor.isPluginAvailable("Camera")) {
      Plugins.Camera.getPhoto({
        quality: 30,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl
      })
        .then(image => {
          this.selectedImage = image.dataUrl;
          firebase
            .storage()
            .ref("images")
            .child(this.afs.createId())
            .putString(image.dataUrl, "data_url")
            .then(snap => {
              snap.ref.getDownloadURL().then(url => {
                this.url = url;
              });
            });
        })
        .catch(err => console.log(err));
    }
  }

  ngOnInit() {}
}
