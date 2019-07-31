import { Component, OnInit } from "@angular/core";
import { MenuController, NavController } from "@ionic/angular";
import { LocalStorageService } from "../local-storage.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-invalid-user",
  templateUrl: "./invalid-user.page.html",
  styleUrls: ["./invalid-user.page.scss"]
})
export class InvalidUserPage implements OnInit {
  loadedUserEmail: string;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.localStorageService
      .getLocalUser()
      .then(userData => {
        let localUserData: any = JSON.parse(userData).user;
        this.loadedUserEmail = localUserData.email;
      })
      .catch(err => {});
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLeave() {
    this.authService.signout();
  }

  changeAccount() {
    this.authService.signOutFromInvalidatUserPage().catch(() => {
      this.authService.signout();
    });
  }
}
