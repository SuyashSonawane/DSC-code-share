import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { IonicModule } from "@ionic/angular";

import { NoticesPage } from "./notices.page";
import { NoticesRoutingModule } from "./notices-routing.module";

@NgModule({
  imports: [CommonModule, IonicModule, NoticesRoutingModule],
  declarations: [NoticesPage]
})
export class NoticesPageModule {}
