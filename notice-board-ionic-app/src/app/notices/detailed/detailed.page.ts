import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { BackPressService } from "../../back-press.service";
import { DataproviderService } from "../../dataprovider.service";
import { NavController, ModalController } from "@ionic/angular";
import { ImageModalPage } from "./image-modal/image-modal.page";

@Component({
  selector: "app-detailed",
  templateUrl: "./detailed.page.html",
  styleUrls: ["./detailed.page.scss"]
})
export class DetailedPage implements OnInit {
  selectedNotice;

  sliderOpts = {
    zoom: false,
    slidesPerView: 1,
    centeredSlides: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: true
    }
  };

  constructor(
    private backPressService: BackPressService,
    private dataService: DataproviderService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(ParamMap => {
      if (!ParamMap.has("noticeId")) {
        this.navCtrl.navigateBack("notices/tabs/all");
        return;
      }
      this.dataService
        .getNoticeByData(ParamMap.get("noticeId"))
        .subscribe(data => {
          this.selectedNotice = data[0];
          // console.log(this.selectedNotice);
        });
    });
  }

  ionViewDidEnter() {
    this.backPressService.stopBackPressListener();
  }

  openPreview = img => {
    this.modalCtrl
      .create({
        component: ImageModalPage,
        componentProps: {
          img: img
        }
      })
      .then(modal => modal.present());
  };
}
