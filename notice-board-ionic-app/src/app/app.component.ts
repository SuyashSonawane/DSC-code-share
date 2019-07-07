import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { Platform } from "@ionic/angular";
import { AngularFireFunctions } from "@angular/fire/functions";
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

const { PushNotifications } = Plugins;

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
    private func: AngularFireFunctions
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
      if (
        (!this.platform.is("mobile") && this.platform.is("hybrid")) ||
        this.platform.is("desktop")
      ) {
        console.log("Initializing HomePage");

        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        // On succcess, we should be able to receive notifications
        PushNotifications.addListener(
          "registration",
          (token: PushNotificationToken) => {
            this.DataService.setToken(token.value);
            this.func
              .httpsCallable("unsubscribeFromTopic")({
                token: token.value,
                topic: "discount"
              })
              .subscribe();
            // alert("Push registration success, token: " + token.value);
          }
        );

        // Some issue with our setup and push will not work
        PushNotifications.addListener("registrationError", (error: any) => {
          alert("Error on registration: " + JSON.stringify(error));
        });

        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification: PushNotification) => {
            alert("Push received: " + JSON.stringify(notification));
          }
        );

        // Method called when tapping on a notification
        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification: PushNotificationActionPerformed) => {
            alert("Push action performed: " + JSON.stringify(notification));
          }
        );
      }
    });
  }

  onSignout() {
    this.authService.signout();
    this.router.navigateByUrl("/auth");
  }
}
