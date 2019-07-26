import { Injectable } from "@angular/core";
import { Plugins } from "@capacitor/core";

const { Storage } = Plugins;

@Injectable({
  providedIn: "root"
})
export class LocalStorageService {
  constructor() {}

  async setIsUserValidated(val: boolean) {
    await Storage.set({
      key: "user",
      value: `${val}`
    });
  }

  async getIsUserValidated() {
    const val = await Storage.get({ key: "user" });
    return val;
  }
}
