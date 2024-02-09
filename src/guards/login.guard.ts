import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
    let token =
   localStorage.getItem('accessToken') ||
   sessionStorage.getItem('accessToken');
if(token) return true
else
alert('Please log in First')
inject(Router).navigate(['Login'])
return false
 
};
