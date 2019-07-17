import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseUISignInSuccessWithAuthResult } from "firebaseui-angular";
import { UserService } from "../user.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _userIsAuthenticated = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {}

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  signin() {
    this._userIsAuthenticated = true;
  }

  signout() {
    this.afAuth.auth.signOut().then(() => {
      this._userIsAuthenticated = false;
    });
  }
}
