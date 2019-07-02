import { Injectable } from "@angular/core";
import { UserData } from "./user.model";

@Injectable({
  providedIn: "root"
})
export class UserService {
  private userData: UserData;

  constructor() {}

  setUserData(
    displayName: string,
    email: string,
    uid: string,
    creationTime: string,
    lastSignInTime: string,
    isNewUser,
    photoUrl,
    phoneNumber
  ) {
    this.userData = {
      DisplayName: displayName,
      Email: email,
      Uid: uid,
      CreationTime: creationTime,
      LastSignInTime: lastSignInTime,
      IsNewUser: isNewUser,
      PhotoUrl: photoUrl,
      PhoneNumber: phoneNumber
    };
  }

  getUser() {
    return this.userData;
  }
}
