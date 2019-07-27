import { Component, OnInit } from "@angular/core";

import { BackPressService } from "../back-press.service";

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
