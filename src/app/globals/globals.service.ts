import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalsService {

  isScreenMasked: boolean = false;
  userNameLogged: string;
  companyInUse: string;
  localStorageStore = 'currentUser';

  server = 'https://apimowizz2ehh.azurewebsites.net/';  //To be used when API is in production
  //server = 'https://192.168.1.105:45455/';  //To be used when API is in development mode and in local network server.
  //server = 'https://localhost:5001/';  // To be used when API is in development mode and without connection to any network

  constructor() {
  }

  maskScreen() {
    document.getElementById('screen-to-mask').style.opacity = '0.4';
    this.isScreenMasked = true;
  }

  unMaskScreen() {
    document.getElementById('screen-to-mask').style.opacity = '1.0';
    this.isScreenMasked = false;
  }

  setUser(userName: string) {
    this.userNameLogged = userName;
  }

  setCompany(company: string) {
    this.companyInUse = company;
  }

  getCompany() {
    if (!this.companyInUse) {
      this.companyInUse = this.getCompanyFromLocalStorage();
    }
    return this.companyInUse;
  }

  clearUser() {
    const me = this;

    me.userNameLogged = undefined;
    me.companyInUse = undefined;
    this.removeUserDataFromLocalStorage();
  }

  storeUserDataInLocalStorage(userName, company, token) {
    localStorage.setItem(this.localStorageStore, JSON.stringify({
      app: 'MoWizz20',
      username: userName,
      company: company,
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

  getCompanyFromLocalStorage() {
    const me = this,
          userData = me.getUserDataFromLocalStorage();

    return userData ? userData.company : '';
  }

  getTokenFromLocalStorage() {
    const me = this,
          userData = me.getUserDataFromLocalStorage();

    return userData ? userData.token : '';
  }
}
