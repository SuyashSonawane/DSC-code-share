import { Component, OnInit } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";

import { LocalStorageService } from "../local-storage.service";
import { UserData } from "../user.model";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-validate-user",
  templateUrl: "./validate-user.page.html",
  styleUrls: ["./validate-user.page.scss"]
})
export class ValidateUserPage implements OnInit {
  loadedUser: UserData;

  constructor(
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.localStorageService.getLocalUser().then(val => {
      this.loadedUser = JSON.parse(val).user;
      this.localStorageService
        .setIsUserValidated(this.loadedUser.email, "true")
        .then(() => {
          this.authService.signin();
        });
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
