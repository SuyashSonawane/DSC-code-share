import { Component, OnInit } from "@angular/core";
import { AngularFireFunctions } from "@angular/fire/functions";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { BackPressService } from "../back-press.service";

@Component({
  selector: "app-instant-push",
  templateUrl: "./instant-push.page.html",
  styleUrls: ["./instant-push.page.scss"]
})
export class InstantPushPage implements OnInit {
  title = "";
  body = "";
  error: boolean = false;
  constructor(
    private func: AngularFireFunctions,
    public toastController: ToastController,
    private router: Router,
    private backPressService: BackPressService
  ) {}
  async submit() {
    if (this.title === "" || this.body === "") this.error = true;
    else {
      this.func.httpsCallable("instantpush")({
        body: this.body,
        title: this.title
      });
      const toast = await this.toastController.create({
        message: "Push Sent ",
        duration: 2000
      });
      toast.present();
      this.router.navigate(["/all"]);
    }
  }
  ngOnInit() {}

  ionViewWillEnter() {
    this.backPressService.stopBackPressListener();
  }

  ionViewWillLeave() {
    this.backPressService.startBackPressListener();
  }
}
