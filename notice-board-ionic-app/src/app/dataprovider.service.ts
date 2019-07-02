import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from "@angular/fire/firestore";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class DataproviderService {
  noticeCollection: AngularFirestoreCollection<any>;
  notices: Observable<any>;

  constructor(private afs: AngularFirestore) {
    this.notices = this.afs.collection("notices").valueChanges();
  }
  getNotices() {
    return this.notices;
  }
  addNotice(body, title, division, year, department, category) {
    let notice = {
      body,
      title,
      division,
      year,
      department,
      image: `http://lorempixel.com/400/200/technics/?${Date.now()}`,
      thumbnail: `http://lorempixel.com/400/200/technics/?${Date.now()}`,
      author: "DEVS",
      category,
      ts: Date.now()
    };
    this.afs.collection("notices").add(notice);
  }
}
