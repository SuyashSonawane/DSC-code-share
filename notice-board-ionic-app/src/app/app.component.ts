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
    private DataService: DataproviderService
  ) {
    this.initializeApp();
  }

  openMenu() {
    this.loadedUser = this.userService.getUser();
    this.userPhotoUrl = this.loadedUser.PhotoUrl;
    if (this.userPhotoUrl == null) {
      this.userPhotoUrl =
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2nL1Aa6emsOzwXP2GCOh4Akz4u36yHOMuWuhnicHGcaCCF678";
    }
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
