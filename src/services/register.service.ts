import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser';
import { HttpClient } from '@angular/common/http';
import { ICart } from '../models/icart';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  _url = `${environment.apiUrl}/users`;
  constructor(private _http: HttpClient) { }

  register(user: IUser) {
    return this._http.post<any>(this._url, user);
  }
  addCart(cart: ICart) {
   
    return this._http.post<any>(`${environment.apiUrl}/carts`, cart);
  }
}
