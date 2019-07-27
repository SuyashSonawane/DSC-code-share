import { Component, OnInit } from "@angular/core";

import { AngularFireAuth } from "@angular/fire/auth";

import { BackPressService } from "../back-press.service";
import { LocalStorageService } from "../local-storage.service";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.page.html",
  styleUrls: ["./settings.page.scss"]
})
export class SettingsPage implements OnInit {
  selectUrl;

  constructor(
    private backPressService: BackPressService,
    private afAuth: AngularFireAuth,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.localStorageService.getLocalUser().then(val => {
      let localString: string = JSON.parse(val).user.photoUrl;
      this.selectUrl = localString.charAt(localString.length - 5);
    });
  }

  urlSelected = () => {
    let localPhotoUrl = `../assets/icon/photoUrl${this.selectUrl}.png`;
    this.afAuth.auth.currentUser
      .updateProfile({
        photoURL: localPhotoUrl
      })
      .then(() => {
        this.localStorageService.getLocalUser().then(val => {
          let localUser: any = JSON.parse(val).user;
          localUser.photoUrl = localPhotoUrl;
          this.localStorageService.setLocalUser(localUser);
        });
      });
  };

  ionViewDidEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
