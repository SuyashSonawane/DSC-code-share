import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

import { LocalStorageService } from "../local-storage.service";
import { UserService } from "../user.service";
import { UserData } from "../user.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  userAuthStatus: boolean;
  loadedUser: UserData;

  checkUserAuth() {
    this.afAuth.authState.subscribe(data => {
      if (data) {
        this.userAuthStatus = true;
      } else {
        this.userAuthStatus = false;
      }
    });
  }

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private localStorageService: LocalStorageService,
    private userService: UserService
  ) {}

  get isAuthenticated(): boolean {
    return this.userAuthStatus;
  }

  signin() {
    this.checkUserAuth();
    this.localStorageService.getLocalUser().then(val => {
      this.loadedUser = JSON.parse(val).user;
      this.localStorageService
        .getIsUserValidated(this.loadedUser.email)
        .then(ret => {
          alert(ret);
          if (JSON.parse(ret).value !== true) {
            this.router.navigateByUrl("/validate-user");
          } else {
            this.router.navigateByUrl("/notices/tabs/all");
          }
        });
    });
  }

  signout() {
    this.afAuth.auth
      .signOut()
      .then(() => {
        this.localStorageService.deleteLocalUser().then(() => {
          this.checkUserAuth();
          this.router.navigateByUrl("/auth");
        });
      })
      .catch(err => {});
  }
}
