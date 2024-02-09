import { Component, ElementRef, ViewChild } from '@angular/core';
import { UserProfileService } from '../../services/user-profile.service';
import { FormsModule } from '@angular/forms';
import { UserAuthService } from '../../services/user-auth.service';
import { IUser } from '../../models/iuser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [UserProfileService],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css',
})
export class UserProfileComponent {
  loggedUser!: IUser;
  constructor(
    private userService: UserProfileService,
    private userAuthService: UserAuthService
  ) {
    this.userAuthService.getCurrentUser().subscribe((data) => {
      if (data) this.loggedUser = data;
    });
  }
  @ViewChild('nameInput') nameInput!: ElementRef;
  @ViewChild('surnameInput') surnameInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('phoneInput') phoneInput!: ElementRef;
  @ViewChild('addressInput') addressInput!: ElementRef;
  @ViewChild('oldPasswordInput') oldPasswordInput!: ElementRef;
  @ViewChild('newPasswordInput') newPasswordInput!: ElementRef;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef;

  passwordChanged = false;
  wrongPassword = false;
  mismatchPassword = false;

  isNameEditing = false;
  isSurnameEditing = false;
  isEmailEditing = false;
  isPhoneEditing = false;
  isAddressEditing = false;

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  userInfoUpdatedSuccess = false;
  userInfoUpdatedFailure = false;

  toggleEdit(field: string) {
    if (field === 'name') {
      this.isNameEditing = true;
    } else if (field === 'surname') {
      this.isSurnameEditing = true;
    } else if (field === 'email') {
      this.isEmailEditing = true;
    } else if (field === 'phone') {
      this.isPhoneEditing = true;
    } else if (field === 'address') {
      this.isAddressEditing = true;
    }
  }

  togglePassword(type: string) {
    if (type === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (type === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (type === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  udateUserInfo() {
    const updatedUser: any = {};
    if (this.isNameEditing) {
      updatedUser.name = this.nameInput.nativeElement.value;
      this.isNameEditing = false;
    }
    if (this.isSurnameEditing) {
      updatedUser.surname = this.surnameInput.nativeElement.value;
      this.isSurnameEditing = false;
    }
    if (this.isEmailEditing) {
      updatedUser.email = this.emailInput.nativeElement.value;
      this.isEmailEditing = false;
    }
    if (this.isPhoneEditing) {
      updatedUser.phone = this.phoneInput.nativeElement.value;
      this.isPhoneEditing = false;
    }
    if (this.isAddressEditing) {
      updatedUser.address = this.addressInput.nativeElement.value;
      this.isAddressEditing = false;
    }

    this.userService.updateUser(this.loggedUser.id, updatedUser).subscribe({
      next: (data) => {
        this.loggedUser = data;
        this.userInfoUpdatedSuccess = true;
      },
      error: (err) => {
        console.log(err);
        this.userInfoUpdatedFailure = true;
      },
    });
    this.refreshRoute();
  }

  refreshRoute() {
    window.location.reload();
  }

  changePassword() {
    const oldPassword = this.oldPasswordInput.nativeElement.value;
    const newPassword = this.newPasswordInput.nativeElement.value;
    const confirmPassword = this.confirmPasswordInput.nativeElement.value;

    if (oldPassword !== this.loggedUser.password) {
      this.wrongPassword = true;
      console.log('Wrong Password');
    } else if (
      newPassword === confirmPassword &&
      oldPassword === this.loggedUser.password
    ) {
      this.userService
        .changePassword(this.loggedUser.id, {
          password: newPassword,
          confirmPassword: confirmPassword,
        })
        .subscribe({
          next: (data) => {
            this.loggedUser = data;
            this.passwordChanged = true;
            this.oldPasswordInput.nativeElement.value = '';
            this.newPasswordInput.nativeElement.value = '';
            this.confirmPasswordInput.nativeElement.value = '';
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.mismatchPassword = true;
      console.log('Passwords do not match');
    }
  }
}
