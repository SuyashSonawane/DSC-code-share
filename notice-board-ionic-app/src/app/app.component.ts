import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Platform } from "@ionic/angular";
import {
  Capacitor,
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";
import { AuthService } from "./auth/auth.service";
import { UserService } from "./user.service";
import { UserData } from "./user.model";
import { DataproviderService } from "./dataprovider.service";
import { LocalStorageService } from "./local-storage.service";
import { doesNotReject } from "assert";

// Capacitor plugins

@Component({
  selector: "app-root",
  templateUrl: "app.component.html"
})
export class AppComponent {
  loadedUser: UserData;
  userPhotoUrl;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private userService: UserService,
    private DataService: DataproviderService,
    private localStorageService: LocalStorageService
  ) {
    this.initializeApp();
  }

  openMenu() {
    this.localStorageService
      .getLocalUser()
      .then(val => {
        this.loadedUser = JSON.parse(val).user;
        this.userPhotoUrl = this.loadedUser.photoUrl;
        if (this.userPhotoUrl == null) {
          this.userPhotoUrl =
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2nL1Aa6emsOzwXP2GCOh4Akz4u36yHOMuWuhnicHGcaCCF678";
        }
      })
      .catch(err => {
        this.loadedUser = {
          displayName: "John Doe",
          email: "johndoe@doe.com",
          uId: "johndoeuid1234567890",
          creationTime: "Tue 2019",
          lastSignInTime: "Wed 2019"
        };
        this.userPhotoUrl =
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2nL1Aa6emsOzwXP2GCOh4Akz4u36yHOMuWuhnicHGcaCCF678";
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  onSignout() {
    this.authService.signout();
    this.router.navigate(["/auth"]);
  }
}
