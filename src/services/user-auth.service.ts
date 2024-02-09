import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUser } from '../models/iuser';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable, map, retry } from 'rxjs';
import { LocalStrogeService } from './local-stroge.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UserAuthService {
  private isLogged: boolean;
  private loggSubject: BehaviorSubject<boolean>;
  constructor(
    private httpClient: HttpClient,
    private userLocalStorge: LocalStrogeService,
    private router: Router,
    private loc: Location
  ) {
    this.isLogged = false;
    this.loggSubject = new BehaviorSubject<boolean>(false);
  }
  getAllUsers(): Observable<IUser[]> {
    return this.httpClient.get<IUser[]>(`${environment.apiUrl}/users`);
  }

  // logIn(email: string, password: string, remmberMe: boolean = false) {
  //   this.getAllUsers().subscribe((data) => {
  //     let users: IUser[] = data;
  //     let userExists = users.find(
  //       (user) => user.email === email && user.password === password
  //     );
  //     if (userExists) {
  //       console.log(userExists);
  //       if (!this.isLogged) {
  //         this.isLogged = true;
  //         this.loggSubject.next(true);
  //       }
  //       if (remmberMe)
  //         this.userLocalStorge.setItemAtLocalStorge(
  //           'accessToken',
  //           userExists.accessToken,
  //           2629800000
  //         );
  //       else
  //         this.userLocalStorge.setItemAtSessionStorge(
  //           'accessToken',
  //           userExists.accessToken
  //         );
  //       this.loc.back();
  //     } else {
  //       console.log('Not Found');
  //       this.loc.go(this.loc.path());
  //     }
  //   });
  // }
  getCurrentUser(): Observable<IUser | undefined> {
    return this.getAllUsers().pipe(
      map((allUsers) => {
        const token =
          this.userLocalStorge.getItemFromLocalStorge('accessToken') ||
          this.userLocalStorge.getItemFromSessionStorge('accessToken');
        const currentUser = allUsers.find((user) => user.accessToken === token);
        this.setLoggedState = !!currentUser;
        return currentUser;
      })
    );
  }
  logOut() {
    if (this.isLogged) {
      this.isLogged = false;
      this.loggSubject.next(false);
      this.userLocalStorge.removeItemFromLocalStorage('accessToken');
      this.userLocalStorge.removerItemFromSessionStorage('accessToken');
      this.router.navigateByUrl('Home');
    }
  }

  getLoggedStateSubject() {
    return this.loggSubject.asObservable();
  }
  get LoggedState() {
    return this.isLogged;
  }
  set setLoggedState(value: boolean) {
    this.isLogged = value;
    this.loggSubject.next(value);
  }
}
