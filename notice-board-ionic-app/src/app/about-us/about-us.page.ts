import { Component, OnInit } from "@angular/core";
import { Plugins } from "@capacitor/core";

import { BackPressService } from "../back-press.service";

const { Browser } = Plugins;

@Component({
  selector: "app-about-us",
  templateUrl: "./about-us.page.html",
  styleUrls: ["./about-us.page.scss"]
})
export class AboutUsPage implements OnInit {
  constructor(private backPressService: BackPressService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
