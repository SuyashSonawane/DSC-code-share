import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Plugins } from "@capacitor/core";

import { MenuController, LoadingController } from "@ionic/angular";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  FirebaseUISignInSuccessWithAuthResult,
  FirebaseUISignInFailure
} from "firebaseui-angular";

import { BackPressService } from "../back-press.service";
import { AuthService } from "./auth.service";
import { UserData } from "../user.model";
import { UserService } from "../user.service";
import { LocalStorageService } from "../local-storage.service";
import { DataproviderService } from "../dataprovider.service";

const { Storage } = Plugins;

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  showUserSignupForm = false;
  isUserValidated = false;
  isNewUser;

  constructor(
    private menuCtrl: MenuController,
    private backPressService: BackPressService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private dataProviderService: DataproviderService
  ) {}

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewDidEnter() {
    this.backPressService.startBackPressListener();
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(true);
  }

  async ngOnInit() {
    const loader1 = await this.loadingCtrl.create({
      message: "Authenticating User"
    });

    loader1.present().then(() => {
      this.localStorageService
        .getLocalUser()
        .then(user => {
          if (user) {
            this.authService.signin();
            loader1.dismiss();
          }
        })
        .then(() => {
          this.afAuth.authState.subscribe(user => {
            if (user) {
              const localUser: UserData = {
                displayName: user.displayName,
                email: user.email,
                uId: user.uid,
                creationTime: user.metadata.creationTime,
                lastSignInTime: user.metadata.lastSignInTime,
                phoneNumber: user.phoneNumber,
                photoUrl: user.photoURL
              };
              this.localStorageService.setLocalUser(localUser).then(() => {
                this.dataProviderService
                  .getCurrentUserData(localUser.uId)
                  .subscribe(data => {
                    let localData: any = data[0];
                    this.localStorageService
                      .setIsUserValidated(
                        localData.email,
                        localData.isUserValidated
                      )
                      .then(() => {
                        this.authService.signin();
                        loader1.dismiss();
                      });
                  });
              });
            } else {
              loader1.dismiss();
            }
          });
        })
        .catch(err => {
          this.afAuth.authState.subscribe(user => {
            if (user) {
              this.authService.signin();
              loader1.dismiss();
            } else {
              loader1.dismiss();
            }
          });
        });
    });
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    let user = signInSuccessData.authResult.user;
    const localUser: UserData = {
      displayName: user.displayName,
      email: user.email,
      uId: user.uid,
      creationTime: user.metadata.creationTime,
      lastSignInTime: user.metadata.lastSignInTime,
      phoneNumber: user.phoneNumber,
      photoUrl: user.photoURL
    };
    this.localStorageService.setLocalUser(localUser);

    this.authService.checkUserAuth();

    if (signInSuccessData.authResult.additionalUserInfo.isNewUser) {
      this.localStorageService.setIsUserValidated(
        signInSuccessData.authResult.user.email,
        "false"
      );

      this.dataProviderService.addUser(localUser);
    } else {
      // console.log(localUser.uId);
      this.dataProviderService
        .getCurrentUserData(localUser.uId)
        .subscribe(data => {
          let localData: any = data[0];
          // console.log(data[0]);
          this.localStorageService
            .setIsUserValidated(localData.email, localData.isUserValidated)
            .then(() => {
              // console.log(`not new user ${localData.isUserValidated}`);
              this.authService.signin();
            });
        });
    }
  }

  errorCallback(errorData: FirebaseUISignInFailure) {}
}
