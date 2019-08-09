import { Component } from "@angular/core";
import {
  FirebaseUISignInSuccessWithAuthResult,
  FirebaseUISignInFailure
} from "firebaseui-angular";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"]
})
export class HomePage {
  constructor(private afauth: AngularFireAuth, private afs: AngularFirestore) {}
  shouldShow: boolean = false;
  emailToggle: boolean = false;
  studentEmail: string = "";
  facultyEmail: string = "";
  successCallback(signInSuccessData: FirebaseUISignInSuccessWithAuthResult) {
    // console.log(signInSuccessData.authResult.user.uid);
    if (
      signInSuccessData.authResult.user.uid == `efVsxLyeIthrb50UqknxGxAmkSj2`
    ) {
      this.shouldShow = true;
    }
  }

  errorCallback(errorData: FirebaseUISignInFailure) {}
  ngOnInit() {
    this.afauth.auth.signOut();
    this.emailToggle = false;
  }
  addEmail() {
    if (!this.emailToggle && this.studentEmail != "") {
      this.afs
        .collection("allowStudents")
        .add({
          email: this.studentEmail
        })
        .then(() => {
          this.studentEmail = "";
          alert("Email Added");
        })
        .catch(err => {
          alert(err);
        });
    }
    if (this.emailToggle && this.facultyEmail != "") {
      this.afs
        .collection("allowAdmins")
        .add({
          email: this.facultyEmail
        })
        .then(() => {
          this.facultyEmail = "";
          alert("Email Added");
        })
        .catch(err => {
          alert(err);
        });
    }
  }
}
