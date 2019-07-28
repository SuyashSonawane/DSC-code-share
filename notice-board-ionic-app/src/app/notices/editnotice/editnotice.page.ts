import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "src/app/dataprovider.service";
import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { BackPressService } from "src/app/back-press.service";

@Component({
  selector: "app-editnotice",
  templateUrl: "./editnotice.page.html",
  styleUrls: ["./editnotice.page.scss"]
})
export class EditnoticePage implements OnInit {
  selectedNotice;

  constructor(
    private dataProviderService: DataproviderService,
    private activatedRoute: ActivatedRoute,
    private navCtrl: NavController,
    private backPressService: BackPressService
  ) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(ParamMap => {
      if (!ParamMap.has("noticeId")) {
        this.navCtrl.navigateBack("notices/tabs/all");
        return;
      }
      this.dataProviderService
        .getNoticeByData(ParamMap.get("noticeId"))
        .subscribe(data => {
          this.selectedNotice = data[0];
          // this._loading();
          // console.log(this.selectedNotice);
        });
    });
  }
  ionViewDidEnter() {
    this.backPressService.stopBackPressListener();
  }
}
