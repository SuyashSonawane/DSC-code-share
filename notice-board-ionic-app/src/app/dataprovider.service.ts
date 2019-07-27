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
  fcmToken;

  constructor(private afs: AngularFirestore) {}

  getCurrentUserData(uid) {
    return this.afs
      .collection("users", ref => {
        return ref.where("uId", "==", uid);
      })
      .valueChanges();
  }

  getNotices() {
    return this.afs
      .collection("notices", ref => {
        return ref.orderBy("ts", "desc");
      })
      .valueChanges();
  }

  getNoticeByData(noticeId) {
    return this.afs
      .collection("notices", ref => {
        return ref.where("noticeId", "==", noticeId);
      })
      .valueChanges();
  }

  addNotice(
    body,
    title,
    division,
    year,
    department,
    category,
    urls: Array<string>,
    type: string
  ) {
    let notice = {
      body,
      title,
      division,
      year,
      department,
      urls,
      author: "DEVS",
      category,
      ts: Date.now(),
      type
    };
    let localNoticeId;
    this.afs
      .collection("notices")
      .add(notice)
      .then(ref => {
        localNoticeId = ref.id;
      })
      .then(() => {
        this.afs
          .collection("notices")
          .doc(localNoticeId)
          .update({ noticeId: localNoticeId });
      })
      .catch(err => {
        console.log(err);
      });
  }

  setToken(t) {
    this.fcmToken = t;
  }

  getToken() {
    return this.fcmToken;
  }

  addUser(newUser) {
    let localDocId;
    return this.afs
      .collection("users")
      .add(newUser)
      .then(ref => {
        // console.log(ref.id);
        localDocId = ref.id;
      })
      .then(() => {
        this.afs
          .collection("users")
          .doc(localDocId)
          .update({ docId: localDocId });
      })
      .then(() => {
        return localDocId;
      })
      .catch(err => {
        console.log(err);
        return localDocId;
      });
  }

  updateUser(newuserData, passDocId) {
    return this.afs
      .collection("users")
      .doc(passDocId)
      .update(newuserData)
      .then(() => {
        return true;
      })
      .catch(err => {
        console.log(err);
        return false;
      });
  }

  getUserObservable(uid: string) {
    return this.afs
      .collection("users", ref => {
        return ref.where("uid", "==", uid);
      })
      .valueChanges();
  }

  getCategoryNotices(name) {
    return this.afs
      .collection("notices", ref => {
        return ref.where("category", "==", name).orderBy("ts", "desc");
      })
      .valueChanges();
  }
}
