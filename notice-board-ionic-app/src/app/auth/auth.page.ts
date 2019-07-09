import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { PickerController, MenuController, Platform } from "@ionic/angular";
import { UserService } from "../user.service";
import { DataproviderService } from "../dataprovider.service";
import { BackPressService } from "../back-press.service";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  showUserSignupForm = false;
  isUserValidated = false;
  isNewUser;
  // backButtonSubscription;

  public department = "Department";
  public year = "Year";
  public rollno = "";
  public division = "";
  public erpId = "";

  constructor(
    private authService: AuthService,
    private pickerController: PickerController,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private dataProvider: DataproviderService,
    private menuCtrl: MenuController,
    // private platform: Platform,
    private backPressService: BackPressService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidEnter() {
    console.log("Auth did enter");
    this.backPressService.startBackPressListener();
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
    // this.backButtonSubscription.unsubscribe();
  }

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
        let localData;
        this.dataProvider
          .getUserObservable(user.uid) //event.authResult.user.uid
          .subscribe(data => {
            if (data) {
              localData = data[0];
              if (localData) this.isUserValidated = localData.isUserValidated;
              if (this.isUserValidated) {
                this.showUserSignupForm = false;
                this.authService.signin();
                this.router.navigateByUrl("/notices/tabs/all");
              } else {
                this.showUserSignupForm = true;
              }
            }
          });
        if (!this.isNewUser) {
          if (this.isUserValidated) {
            this.showUserSignupForm = false;
            this.authService.signin();
            this.router.navigateByUrl("/notices/tabs/all");
          } else {
            this.showUserSignupForm = true;
          }
        }
      } else {
        this.authService.signout();
        this.showUserSignupForm = false;
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
    if (this.rollno == "") {
      alert("Roll Number is mandatory");
    } else if (this.erpId == "") {
      alert("ErpId is mandatory");
    } else if (this.division == "") {
      alert("Division is mandatory");
    } else if (this.department == "Department") {
      alert("Department is mandatory");
    } else if (this.year == "Year") {
      alert("Year is mandatory");
    } else {
      let newUser = {
        rollNumber: this.rollno,
        erpId: this.erpId,
        division: this.division,
        department: this.department,
        year: this.year,
        isUserValidated: true
      };

      let localData;
      let passDocId;
      this.dataProvider
        .getUserObservable(this.userService.getUser().Uid)
        .subscribe(data => {
          localData = data[0];
          passDocId = localData.docId;
          this.dataProvider.updateUser(newUser, passDocId);
          this.authService.signin();
          this.router.navigateByUrl("/notices/tabs/all");
        });
    }
  }

  successCallback = event => {
    this.isNewUser = event.authResult.additionalUserInfo.isNewUser;
    if (this.isNewUser) {
      this.showUserSignupForm = true;

      let newUser = {
        email: event.authResult.user.email,
        uid: event.authResult.user.uid,
        displayName: event.authResult.user.displayName,
        isUserValidated: false
      };

      this.dataProvider.addUser(newUser);
    } else {
      this.showUserSignupForm = true;
      let localData;
      this.dataProvider
        .getUserObservable(event.authResult.user.uid) //event.authResult.user.uid
        .subscribe(data => {
          localData = data;
          this.isUserValidated = localData.isUserValidated;
          this.showUserSignupForm = false;
        });
    }
  };

  errorCallback = event => {};

  changeAccount() {
    this.authService.signout();
    this.showUserSignupForm = false;
  }
}
