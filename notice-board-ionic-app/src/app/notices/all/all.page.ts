import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireFunctions } from "@angular/fire/functions";

import {
  Capacitor,
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from "@capacitor/core";

import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";
import { LocalStorageService } from "../../local-storage.service";
import { UserData } from "src/app/user.model";
import { LoadingController } from "@ionic/angular";

const { PushNotifications } = Plugins;

@Component({
  selector: "app-all",
  templateUrl: "./all.page.html",
  styleUrls: ["./all.page.scss"]
})
export class AllPage implements OnInit {
  notices;
  loadedUser: UserData;

  constructor(
    private DataService: DataproviderService,
    private router: Router,
    private backPressService: BackPressService,
    private func: AngularFireFunctions,
    private localStorageService: LocalStorageService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    // const loader1 = await this.loadingCtrl.create({
    //   message: "Checking if User is Validated"
    // });

    // loader1.present().then(() => {
    //   this.localStorageService
    //     .getLocalUser()
    //     .then(val => {
    //       this.loadedUser = JSON.parse(val).user;
    //       this.localStorageService
    //         .getIsUserValidated(this.loadedUser.email)
    //         .then(val => {
    //           if (val.value !== "true") {
    //             loader1.dismiss();
    //             this.router.navigateByUrl("/validate-user");
    //           }
    //         });
    //     })
    //     .catch(err => {
    //       loader1.dismiss();
    //       this.router.navigateByUrl("/validate-user");
    //       console.log("err");
    //     });
    // });

    this.DataService.getNotices().subscribe(d => {
      this.notices = d;
      console.log(d);
    });
    // console.log("Initializing HomePage");

    // Register with Apple / Google to receive push via APNS/FCM
    PushNotifications.register();

    // On succcess, we should be able to receive notifications
    PushNotifications.addListener(
      "registration",
      (token: PushNotificationToken) => {
        this.DataService.setToken(token.value);
        this.func
          .httpsCallable("subscribeToTopic")({
            token: token.value,
            topic: "all"
          })
          .subscribe(d => console.log(d));
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

  ionViewDidEnter() {}

  ionViewDidLeave() {}

  onNoticeClick = noticeId => {
    this.router.navigateByUrl(`/notices/tabs/all/${noticeId}`);
  };
}
