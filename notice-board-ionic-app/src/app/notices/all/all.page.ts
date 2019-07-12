import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";

@Component({
  selector: "app-all",
  templateUrl: "./all.page.html",
  styleUrls: ["./all.page.scss"]
})
export class AllPage implements OnInit {
  notices;

  constructor(
    private DataService: DataproviderService,
    private backPressService: BackPressService
  ) {}

  ngOnInit() {
    this.DataService.getNotices().subscribe(d => {
      this.notices = d;
      // //console.log(this.notices);
    });
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}
}
