import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "src/app/dataprovider.service";

@Component({
  selector: "app-other",
  templateUrl: "./other.page.html",
  styleUrls: ["./other.page.scss"]
})
export class OtherPage implements OnInit {
  notices: unknown[];
  constructor(private DataService: DataproviderService) {}

  ngOnInit() {
    this.DataService.getCategoryNotices("Other").subscribe(d => {
      this.notices = d;
      //console.log(this.notices);
    });
  }
}
