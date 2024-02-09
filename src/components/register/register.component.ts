import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { IUser } from '../../models/iuser';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RegisterService } from '../../services/register.service';
import { ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserAuthService } from '../../services/user-auth.service';
import { LocalStrogeService } from '../../services/local-stroge.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private jsonServerUrl = `${environment.apiUrl}/users`;

  @ViewChild('userForm', { static: false })
  userForm!: NgForm;

  matched: boolean = false;
  submitted = false;
  userIdCounter = Math.floor(Math.random() * 1000000000);
  userModel: IUser = {
    id: this.userIdCounter,
    accessToken: this.userIdCounter.toString(),
    name: '',
    email: '',
    phone: '',
    profilePic:
      'https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg',
    Address: '',
    gender: '',
    password: '',
    confirmPassword: '',
    wishlist: [],
    orders: []
  };
  cartModel = {
    id: this.userIdCounter,
    user: this.userIdCounter,
    products: [],
    totalPrice: 0,
    ordered: false,
  };
  constructor(
    private _registerService: RegisterService,
    private router: Router, // private _ngForm: NgForm
    private userAuth: UserAuthService,
    private storge: LocalStrogeService,
    private http: HttpClient
  ) {}

  passowrdMatch() {
    this.matched = this.userModel.password === this.userModel.confirmPassword;
  }
  onSubmit() {
    // Check if the email already exists in the server
    this.http
      .get(`${this.jsonServerUrl}?email=${this.userModel.email}`)
      .subscribe((result: any) => {
        if (result.length > 0) {
          alert('Email is already registered. Please use a different email.');
        } else {
          this.submitted = true;
          this._registerService.register(this.userModel).subscribe((data) => {
            this.router.navigateByUrl('Login');
          });
          this._registerService.addCart(this.cartModel).subscribe((data) => {
            console.log(data);
          });
        }
      });
  }
}
