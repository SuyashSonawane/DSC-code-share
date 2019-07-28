import { Component, OnInit } from "@angular/core";
import { LoadingController } from "@ionic/angular";
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl
} from "@angular/forms";

import { LocalStorageService } from "../local-storage.service";
import { UserData } from "../user.model";
import { AuthService } from "../auth/auth.service";
import { DataproviderService } from "../dataprovider.service";

import { RollNoValidator } from "./validators/rollNo.validator";
import { PhoneNoValidator } from "./validators/phoneNo.validator";
import { ErpIdValidator } from "./validators/erpId.validator";

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

  errorMessages = {
    rollNo: [
      { type: "required", message: "Roll Number is required" },
      { type: "validRollNo", message: "Invalid Roll No" }
    ],
    erpId: [
      { type: "required", message: "Erp Id is required" },
      { type: "validErpId", message: "Invalid Erp Id" }
    ],
    div: [{ type: "required", message: "Division is required" }],
    batch: [{ type: "required", message: "Batch is required" }],
    phoneNo: [
      { type: "required", message: "Phone Number is required" },
      { type: "validPhoneNo", message: "Invalid Phone Number" }
    ]
  };

  validateUserForm = new FormGroup({
    rollNo: new FormControl(
      "",
      Validators.compose([
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(8),
        RollNoValidator.validRollNo
      ])
    ),
    erpId: new FormControl(
      "",
      Validators.compose([Validators.required, ErpIdValidator.validErpId])
    ),
    div: new FormControl("", Validators.required),
    batch: new FormControl("", Validators.required),
    phoneNo: new FormControl(
      "",
      Validators.compose([Validators.required, PhoneNoValidator.validPhoneNo])
    )
  });

  async onSubmit() {
    console.log("Submit");

    //   const loader1 = await this.loadingCtrl.create({
    //     message: "Authenticating User"
    //   });

    //   loader1
    //     .present()
    //     .then(() => {
    //       this.localStorageService
    //         .getLocalUser()
    //         .then(val => {
    //           this.loadedUser = JSON.parse(val).user;
    //           this.localStorageService.setIsUserValidated(
    //             this.loadedUser.email,
    //             true
    //           );
    //         })
    //         .then(() => {
    //           this.dataProviderService
    //             .getCurrentUserData(this.loadedUser.uId)
    //             .subscribe(data => {
    //               let localData: any = data[0];
    //               if (localData) {
    //                 this.dataProviderService.updateUser(
    //                   { isUserValidated: true },
    //                   localData.docId
    //                 );
    //               }
    //             });
    //         });
    //     })
    //     .then(() => {
    //       loader1.dismiss();
    //       this.authService.signin();
    //     })
    //     .catch(err => {
    //       loader1.dismiss();
    //     });
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
