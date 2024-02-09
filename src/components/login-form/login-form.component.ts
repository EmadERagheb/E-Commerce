import { JsonPipe, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { IUser } from '../../models/iuser';
import { LocalStrogeService } from '../../services/local-stroge.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule, JsonPipe],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  loginForm: FormGroup;
  message: string;
  passwordInputType: string;
  constructor(
    private fb: FormBuilder,
    private userAuth: UserAuthService,
    private storge: LocalStrogeService,
    private loc: Location
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.required],
      remmberMe: [false],
      password: ['', Validators.required],
      showPassword: [false],
    });

    this.passwordInputType = 'password';
    this.message = '';
  }
  get formEmail() {
    return this.loginForm.controls['email'];
  }
  get formpassword() {
    return this.loginForm.controls['password'];
  }
  get formRemmberMe() {
    return this.loginForm.controls['remmberMe'];
  }
  get formShowPassword() {
    return this.loginForm.get('showPassword');
  }

  login() {
    if (this.loginForm.valid) {
      this.userAuth.getAllUsers().subscribe((data) => {
        let users: IUser[] = data;
        let userExists = users.find(
          (user) =>
            user.email === this.formEmail.value &&
            user.password === this.formpassword.value
        );
        if (userExists) {
          if (!this.userAuth.LoggedState) {
            this.userAuth.setLoggedState = true;
          }
          if (this.formRemmberMe.value)
            this.storge.setItemAtLocalStorge(
              'accessToken',
              userExists.accessToken,
              2629800000
            );
          else
            this.storge.setItemAtSessionStorge(
              'accessToken',
              userExists.accessToken
            );
          this.loc.back();
        } else {
          this.message = 'Invalid user name or password';
          this.formEmail.reset()
          this.formpassword.reset()
        }
      });
    }
  }
}
