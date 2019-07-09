import { Component, OnInit } from "@angular/core";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.page.html",
  styleUrls: ["./detailed.page.scss"]
})
export class DetailedPage implements OnInit {
  constructor(private backPressService: BackPressService) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.backPressService.stopBackPressListener();
  }
}
