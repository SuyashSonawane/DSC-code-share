import { Component, OnInit } from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";

@Component({
  selector: "app-image-modal",
  templateUrl: "./image-modal.page.html",
  styleUrls: ["./image-modal.page.scss"]
})
export class ImageModalPage implements OnInit {
  img: any;
  sliderOpts = {
    zoom: {
      maxRatio: 3
    }
  };

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.img = this.navParams.get("img");
  }

  zoom(zoomIn: boolean) {}

  close() {
    this.modalCtrl.dismiss();
  }
}
