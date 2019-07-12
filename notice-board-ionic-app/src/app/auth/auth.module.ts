import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { AuthPage } from "./auth.page";

import { FirebaseUIModule, firebase, firebaseui } from "firebaseui-angular";

const routes: Routes = [
  {
    path: "",
    component: AuthPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    FirebaseUIModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
