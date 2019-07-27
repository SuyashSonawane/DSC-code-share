import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  async setIsUserValidated(email: string, val: string) {
    await Storage.set({
      key: email,
      value: val
    });
  }

  async getIsUserValidated(email: string) {
    const val = await Storage.get({ key: email });
    return val;
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
