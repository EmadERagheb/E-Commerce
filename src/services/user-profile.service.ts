import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from '../models/iuser';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  DB = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  updateUser(id: number, data: {}): Observable<IUser> {
    let url = `${this.DB}/${id}`;
    return this.http.patch<IUser>(url, data);
  }

  changePassword(id: number, data: {}): Observable<any> {
    let url = `${this.DB}/${id}`;
    return this.http.patch(url, data);
  }
}
