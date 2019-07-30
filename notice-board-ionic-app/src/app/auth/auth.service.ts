import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";

import { LocalStorageService } from "../local-storage.service";
import { UserService } from "../user.service";
import { UserData } from "../user.model";
import { DataproviderService } from "../dataprovider.service";

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
    private userService: UserService,
    private dataProviderService: DataproviderService
  ) {}

  get isAuthenticated(): boolean {
    return this.userAuthStatus;
  }

  signin() {
    let localIsAdmin: boolean;
    let localIsStudent: boolean;
    this.checkUserAuth();
    this.localStorageService.getLocalUser().then(val => {
      if (val) {
        this.loadedUser = JSON.parse(val).user;
        this.localStorageService
          .getIsUserValidated(this.loadedUser.email)
          .then(ret => {
            if (JSON.parse(ret)) {
              if (JSON.parse(ret).value !== true) {
                this.localStorageService
                  .getIsAdmin(this.loadedUser.email)
                  .then(isAdminVal => {
                    if (isAdminVal) {
                      localIsAdmin = JSON.parse(isAdminVal).value;
                    }
                  })
                  .then(() => {
                    this.localStorageService
                      .getIsStudent(this.loadedUser.email)
                      .then(isStudentVal => {
                        if (isStudentVal) {
                          localIsStudent = JSON.parse(isStudentVal).value;
                        }
                      })
                      .then(() => {
                        if (localIsStudent) {
                          this.router.navigateByUrl("/validate-user");
                        } else if (localIsAdmin) {
                          this.router.navigateByUrl("/validate-admin");
                        } else {
                          this.signOutToInvalidatUserPage();
                        }
                      });
                  })
                  .catch(err => {});
              } else {
                this.router.navigateByUrl("/notices/tabs/all");
              }
            }
          });
      }
    });
  }

  signOutToInvalidatUserPage() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        let localEmail = user.email;
        let localUid = user.uid;
        this.afAuth.auth.currentUser
          .delete()
          .then(() => {
            this.dataProviderService
              .getCurrentUserData(localUid)
              .subscribe(subData => {
                let localUserData: any = subData[0];
                if (localUserData) {
                  if (localUserData.docId) {
                    this.dataProviderService.deleteCurrentUserData(
                      localUserData.docId
                    );
                  }
                }
              });
          })
          .then(() => {
            this.router.navigateByUrl("/invalid-user");
          })
          .catch(err => {
            console.log(`Error: ${err}`);
          });
      }
    });
  }

  signout() {
    this.afAuth.auth
      .signOut()
      .then(() => {
        this.localStorageService.deleteLocalUser();
      })
      .then(() => {
        this.checkUserAuth();
        this.router.navigateByUrl("/auth");
      })
      .catch(err => {});
  }

  deleteUser() {
    this.afAuth.auth.currentUser.delete();
  }
}
