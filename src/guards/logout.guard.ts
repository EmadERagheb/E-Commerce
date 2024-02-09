import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { inject } from '@angular/core';

export const logoutGuard: CanActivateFn = (route, state) => {
  let token =
    localStorage.getItem('accessToken') ||
    sessionStorage.getItem('accessToken');
  if (!token) return true;
  else {
    inject(Router).navigate(['Home']);
    return false;
  }
};
