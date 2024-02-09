import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { IOrder } from '../models/iorder';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };
  constructor(private http: HttpClient) {}
  DB = `${environment.apiUrl}/users`;
  getUsers() {
    return this.http.get<IUser[]>(this.DB);
  }
  getUser(id: number) {
    let url = `${this.DB}/${id}`;
    return this.http.get<IUser>(url);
  }
  getCustomUsers(usersIds: string) {
    let url = `${this.DB}?${usersIds}`;
    return this.http.get<IUser[]>(url);
  }
  createUser(data: {}) {
    return this.http.post<IUser>(this.DB, data);
  }
  updateWishlistForUser(
    userid: number,
    wishArray: number[]
  ): Observable<IUser> {
    return this.http.patch<IUser>(
      `${this.DB}/${userid}`,
      { wishlist: wishArray },
      this.options
    );
  }
  updateUser(id: number, data: {}) {
    let url = `${this.DB}/${id}`;
    return this.http.put<IUser>(url, data);
  }
  updateUserOrders(id: number, orders: IOrder[]) {
    let url = `${this.DB}/${id}`;
    return this.http.patch<IUser>(url, { orders: orders });
  }
  deleteUser(id: number) {
    let url = `${this.DB}/${id}`;
    return this.http.delete<IUser>(url);
  }
}
