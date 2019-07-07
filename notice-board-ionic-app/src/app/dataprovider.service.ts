import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
import { LoginUserData } from "./user.model";
@Injectable({
  providedIn: "root"
})
export class DataproviderService {
  noticeCollection: AngularFirestoreCollection<any>;
  notices: Observable<any>;
  fcmToken;

  constructor(private afs: AngularFirestore) {}
  getNotices() {
    return this.afs
      .collection("notices", ref => {
        return ref.orderBy("ts", "desc");
      })
      .valueChanges();
  }
  addNotice(body, title, division, year, department, category, url) {
    let notice = {
      body,
      title,
      division,
      year,
      department,
      image: url,
      thumbnail: url,
      author: "DEVS",
      category,
      ts: Date.now()
    };
    this.afs.collection("notices").add(notice);
  }
  setToken(t) {
    this.fcmToken = t;
  }
  getToken() {
    return this.fcmToken;
  }
  addUser() {
    this.afs.collection("users").add({ name: "asas" });
  }

  getCategoryNotices(name) {
    return this.afs
      .collection("notices", ref => {
        return ref.where("category", "==", name).orderBy("ts", "desc");
      })
      .valueChanges();
  }
}
