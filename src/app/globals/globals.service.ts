import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  userNameLogged: string;
  localStorageStore = 'currentUser';

  //server = 'https://apimowizz2ehh.azurewebsites.net/';  //To be used when API is in production
  server = 'https://192.168.1.105:45455/';  //To be used when API is in development mode and in local network server.
  //server = 'https://localhost:5001/';  // To be used when API is in development mode and without connection to any network

  constructor() {
  }

  setUser(userName: string) {
    this.userNameLogged = userName;
  }

  clearUser() {
    this.userNameLogged = undefined;
    this.removeUserDataFromLocalStorage();
  }

  storeUserDataInLocalStorage(userName, token) {
    localStorage.setItem(this.localStorageStore, JSON.stringify({
      app: 'MoWizz20',
      username: userName,
      token: token
    }));
  }

  removeUserDataFromLocalStorage() {
    localStorage.removeItem(this.localStorageStore);
  }

  getUserDataFromLocalStorage() {
    return JSON.parse(localStorage.getItem(this.localStorageStore));
  }

  getUserNameFromLocalStorage() {
    const me = this,
          userData = me.getUserDataFromLocalStorage();

    return userData ? userData.username : '';
  }

  getTokenFromLocalStorage() {
    const me = this,
          userData = me.getUserDataFromLocalStorage();

    return userData ? userData.token : '';
  }
}
