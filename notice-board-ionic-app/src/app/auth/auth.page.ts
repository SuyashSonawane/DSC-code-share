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
  isNewUser: boolean;

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
                    if (localData) {
                      this.localStorageService
                        .setIsUserValidated(
                          localData.email,
                          localData.isUserValidated
                        )
                        .then(() => {
                          loader1.dismiss();
                          this.authService.signin();
                        });
                    } else {
                      loader1.dismiss();
                      this.authService.signin();
                    }
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
    let localUser: UserData;

    if (signInSuccessData.authResult.additionalUserInfo.isNewUser) {
      this.isNewUser = true;
      localUser = {
        displayName: user.displayName,
        email: user.email,
        uId: user.uid,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        phoneNumber: user.phoneNumber
      };

      this.localStorageService.setLocalUser(localUser).then(() => {
        this.authService.checkUserAuth();

        this.localStorageService.setIsUserValidated(
          signInSuccessData.authResult.user.email,
          false
        );

        this.dataProviderService.addUser(localUser).then(docId => {
          if (docId) {
            this.dataProviderService
              .updateUser({ isUserValidated: false }, docId)
              .then(val => {
                // console.log("user updated");
                this.authService.signin();
              });
          }
        });
      });
    } else {
      this.isNewUser = false;
      localUser = {
        displayName: user.displayName,
        email: user.email,
        uId: user.uid,
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
        phoneNumber: user.phoneNumber,
        photoUrl: user.photoURL
      };

      this.localStorageService.setLocalUser(localUser).then(() => {
        this.authService.checkUserAuth();

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
      });
    }
  }

  errorCallback(errorData: FirebaseUISignInFailure) {}
}
