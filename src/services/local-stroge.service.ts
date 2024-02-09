import { Injectable } from '@angular/core';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStrogeService {
  constructor() {}
  setItemAtLocalStorge(key: string, value: any, expireTime: number) {
    let now = new Date();
    let endTime = now.getTime();
    if (expireTime) {
      endTime += expireTime;
    }
    let item = {
      value: value,
      expiry: endTime,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  setItemAtSessionStorge(key: string, value: any) {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
  getItemFromSessionStorge(key: string): string {
    let token = sessionStorage.getItem(key) || '';//"2dfdfdf"
    return token.substring(1, token?.length - 1);
  }
  getItemFromLocalStorge(key: string) {
    let token = localStorage.getItem(key);
    if (token) return JSON.parse(token)['value'];
    else return null;
  }

  removeItemFromLocalStorage(key: string) {
    if (localStorage.getItem(key)) localStorage.removeItem(key);
  }
  removerItemFromSessionStorage(key: string) {
    if (sessionStorage.getItem(key)) sessionStorage.removeItem(key);
  }
}
