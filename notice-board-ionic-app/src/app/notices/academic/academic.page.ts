import { Component, OnInit } from "@angular/core";
import { DataproviderService } from "src/app/dataprovider.service";

@Component({
  selector: "app-academic",
  templateUrl: "./academic.page.html",
  styleUrls: ["./academic.page.scss"]
})
export class AcademicPage implements OnInit {
  notices: any;

  constructor(private DataService: DataproviderService) {}

  ngOnInit() {
    this.DataService.getCategoryNotices("Academics").subscribe(d => {
      this.notices = d;
      //console.log(this.notices);
    });
  }
}
