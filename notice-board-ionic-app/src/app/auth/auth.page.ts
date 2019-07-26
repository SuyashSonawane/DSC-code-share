import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { AngularFireAuth } from "@angular/fire/auth";
import { PickerController, MenuController, Platform } from "@ionic/angular";
import { UserService } from "../user.service";
import { DataproviderService } from "../dataprovider.service";
import { BackPressService } from "../back-press.service";

import { LoadingController } from "@ionic/angular";
import { NgForm, FormGroup } from "@angular/forms";
import { LocalStorageService } from "../local-storage.service";
@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  showUserSignupForm = false;
  isUserValidated = false;
  isNewUser;

  form: FormGroup;

  public department = "Department";
  public year = "Year";

  constructor(
    private authService: AuthService,
    private pickerController: PickerController,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private dataProvider: DataproviderService,
    private menuCtrl: MenuController,
    private backPressService: BackPressService,
    private loadingController: LoadingController,
    private localStorageService: LocalStorageService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidEnter() {
    // console.log("Auth did enter");
    this.backPressService.startBackPressListener();
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
    // this.backButtonSubscription.unsubscribe();
  }
  async ngOnInit() {
    
    // this.form = new FormGroup({
    //   rollNo,
    //   erpId,
    //   div
    // });

    const loading = await this.loadingController.create({
      message: "Authenticating User"
    });

    this.localStorageService.getIsUserValidated().then(res => {
      if (res.value === "true" && ) {
        this.showUserSignupForm = false;
        this.authService.signin();
        this.router.navigateByUrl("/notices/tabs/all");
      } else {
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
            loading.present();
            this.dataProvider
              .getUserObservable(user.uid) //event.authResult.user.uid
              .subscribe(data => {
                if (data) {
                  localData = data[0];
                  if (localData)
                    this.isUserValidated = localData.isUserValidated;
                  if (this.isUserValidated) {
                    this.showUserSignupForm = false;
                    loading.dismiss();
                    this.authService.signin();
                    this.router.navigateByUrl("/notices/tabs/all");
                  } else {
                    this.showUserSignupForm = true;
                    loading.dismiss();
                  }
                }
              });
            if (!this.isNewUser) {
              if (this.isUserValidated) {
                this.showUserSignupForm = false;
                loading.dismiss();
                this.authService.signin();
                this.router.navigateByUrl("/notices/tabs/all");
              } else {
                this.showUserSignupForm = true;
                loading.dismiss();
              }
            }
          } else {
            loading.dismiss();
            this.authService.signout();
            this.showUserSignupForm = false;
          }
        });
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

  authenticateUser(rollNo, erpId, division) {
    let newUser = {
      rollNumber: rollNo,
      erpId: erpId,
      division: division,
      department: this.department,
      year: this.year,
      isUserValidated: true
    };

    this.localStorageService.setIsUserValidated(true);

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

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const rollNo = form.value.rollNo;
    const erpId = form.value.erpId;
    const division = form.value.division;

    this.authenticateUser(rollNo, erpId, division);
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

      this.localStorageService.setIsUserValidated(false);

      this.dataProvider.addUser(newUser);
    } else {
      this.localStorageService.getIsUserValidated().then(res => {
        if (res.value === "false") {
          this.showUserSignupForm = true;
          this.isUserValidated = false;
        }
      });

      //
      // let localData;
      // this.dataProvider
      //   .getUserObservable(event.authResult.user.uid) //event.authResult.user.uid
      //   .subscribe(data => {
      //     localData = data;
      //     this.isUserValidated = localData.isUserValidated;
      //     this.showUserSignupForm = false;
      //   });
    }
  };

  errorCallback = event => {};

  changeAccount() {
    this.authService.signout();
    this.showUserSignupForm = false;
  }
}
