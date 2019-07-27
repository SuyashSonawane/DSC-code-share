import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  async setIsUserValidated(email: string, val: boolean) {
    await Storage.set({
      key: "isUserValidated",
      value: JSON.stringify({
        email: email,
        value: val
      })
    });
  }

  async getIsUserValidated(email: string) {
    const ret = await Storage.get({ key: "isUserValidated" });
    return ret.value;
  }

  async setLocalUser(user) {
    await Storage.set({
      key: "user",
      value: JSON.stringify({ user })
    });
  }

  async getLocalUser() {
    const ret = await Storage.get({ key: "user" });
    return ret.value;
  }

  async deleteLocalUser() {
    await Storage.remove({ key: "user" });
  }
}
