import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { LocalStorageService } from "../local-storage.service";
import { UserData } from "../user.model";
import { AuthService } from "../auth/auth.service";
import { DataproviderService } from "../dataprovider.service";
import { load } from "@angular/core/src/render3";
import { LoadingController } from "@ionic/angular";

@Component({
  selector: "app-validate-user",
  templateUrl: "./validate-user.page.html",
  styleUrls: ["./validate-user.page.scss"]
})
export class ValidateUserPage implements OnInit {
  loadedUser: UserData;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService,
    private dataProviderService: DataproviderService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {}

  async onSubmit() {
    const loader1 = await this.loadingCtrl.create({
      message: "Authenticating User"
    });

    loader1
      .present()
      .then(() => {
        this.localStorageService.getLocalUser().then(val => {
          this.loadedUser = JSON.parse(val).user;
          this.localStorageService
            .setIsUserValidated(this.loadedUser.email, true)
            .then(() => {
              // console.log(this.loadedUser);
              this.dataProviderService
                .getCurrentUserData(this.loadedUser.uId)
                .subscribe(data => {
                  let localData: any = data[0];
                  if (localData) {
                    this.dataProviderService.updateUser(
                      { isUserValidated: true },
                      localData.docId
                    );
                  }
                });
            })
            .then(() => {
              loader1.dismiss();
              this.authService.signin();
            });
        });
      })
      .catch(err => {
        loader1.dismiss();
      });
  }
}

// async openPicker() {
//   let opts = {
//     buttons: [
//       {
//         text: "Done",
//         role: "dismiss"
//       }
//     ],
//     columns: [
//       {
//         name: "Department",
//         options: [
//           { text: "MECH", value: "MECH" },
//           { text: "COMP", value: "COMP" },
//           { text: "IT", value: "IT" },
//           { text: "ENTC", value: "ENTC" },
//           { text: "CIVIL", value: "CIVIL" },
//           { text: "FE", value: "FE" }
//         ]
//       },
//       {
//         name: "Year",
//         options: [
//           { text: "SE", value: "SE" },
//           { text: "TE", value: "TE" },
//           { text: "BE", value: "BE" }
//         ]
//       }
//     ]
//   };
//   let picker = await this.pickerController.create(opts);
//   picker.present();
//   picker.onDidDismiss().then(() => {
//     picker.getColumn("Year").then(data => {
//       let Data = data.options[data.selectedIndex].text;
//       // console.log(Data);
//       this.year = Data;
//     });
//     picker.getColumn("Department").then(data => {
//       let Data = data.options[data.selectedIndex].text;
//       this.department = Data;
//       if (Data == "FE") this.year = "Not Applicable";
//     });
//   });
// }
