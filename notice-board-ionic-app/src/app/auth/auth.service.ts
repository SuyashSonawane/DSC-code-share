import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { FirebaseUISignInSuccessWithAuthResult } from "firebaseui-angular";
import { UserService } from "../user.service";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private _userIsAuthenticated = false;

  constructor(private afAuth: AngularFireAuth) {}

  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  signin() {
    this._userIsAuthenticated = true;
  }

  signout() {
    this.afAuth.auth.signOut();
    this._userIsAuthenticated = false;
  }
}
