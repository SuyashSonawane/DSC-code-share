import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { PickerController } from "@ionic/angular";
import { UserService } from "../user.service";
import {
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult
} from "firebaseui-angular";
import { DataproviderService } from "../dataprovider.service";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  public department = "Department";
  public year = "Year";
  public name = "";
  public rollno = "";
  public division = "";
  public erpId = "";
  public email = "";
  public password = "";
  public confirm_password = "";

  constructor(
    private authService: AuthService,
    private pickerController: PickerController,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private dataProvider: DataproviderService
  ) {}

  ngOnInit() {
    this.afAuth.user.subscribe(data => {
      if (data) {
        const user = data;
        this.userService.setUserData(
          user.displayName,
          user.email,
          user.uid,
          user.metadata.creationTime,
          user.metadata.lastSignInTime,
          null,
          user.photoURL,
          user.phoneNumber
        );
        this.authService.signin();
        this.router.navigateByUrl("/notices/tabs/all");
      }
    });
  }

  async openPicker() {
    let opts = {
      buttons: [
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
        }
      ]
    };
    let picker = await this.pickerController.create(opts);
    picker.present();
    picker.onDidDismiss().then(() => {
      picker.getColumn("Year").then(data => {
        let Data = data.options[data.selectedIndex].text;
        // console.log(Data);
        this.year = Data;
      });
      picker.getColumn("Department").then(data => {
        let Data = data.options[data.selectedIndex].text;
        this.department = Data;
        if (Data == "FE") this.year = "Not Applicable";
      });
    });
  }

  submit() {
    // if (this.isUserValidated) this.isUserValidated = false;
    // else this.isUserValidated = true;
    // // this.user.name = this.name;
    // this.user.department = this.department;
    // this.user.div = this.division;
    // this.user.erpId = this.erpId;
    // this.user.rollno = this.rollno;
    // this.user.year = this.year;
    // this.dataProvider.addUser(this.user);
    this.authService.signin();
    this.router.navigateByUrl("/notices/tabs/all");
  }
}
