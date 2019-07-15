import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "../../dataprovider.service";
import { BackPressService } from "../../back-press.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-all",
  templateUrl: "./all.page.html",
  styleUrls: ["./all.page.scss"]
})
export class AllPage implements OnInit {
  notices;

  constructor(
    private DataService: DataproviderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.DataService.getNotices().subscribe(d => {
      this.notices = d;
      // //console.log(this.notices);
    });
  }

  ionViewDidEnter() {}

  ionViewDidLeave() {}

  onNoticeClick = noticeId => {
    this.router.navigateByUrl(`/notices/tabs/all/${noticeId}`);
  };
}
