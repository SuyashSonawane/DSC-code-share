import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { AuthService } from "./auth.service";
import { AngularFireAuth } from "@angular/fire/auth";

import { UserService } from "../user.service";
import {
  FirebaseUISignInFailure,
  FirebaseUISignInSuccessWithAuthResult
} from "firebaseui-angular";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"]
})
export class AuthPage implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private userService: UserService
  ) {}

  ngOnInit() {
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
        this.authService.signin();
        this.router.navigateByUrl("/notices/tabs/all");
      }
    });
  }

  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    const user = signInSuccessData.authResult.user;
    this.userService.setUserData(
      user.displayName,
      user.email,
      user.uid,
      user.metadata.creationTime,
      user.metadata.lastSignInTime,
      signInSuccessData.authResult.additionalUserInfo.isNewUser,
      user.photoURL,
      user.phoneNumber
    );
    this.authService.signin();
    this.router.navigateByUrl("/notices/tabs/all");
  }

  errorCallback(errorData: FirebaseUISignInFailure) {
    console.log("Failure", errorData);
  }
}
