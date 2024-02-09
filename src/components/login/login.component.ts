import { Component, DoCheck } from '@angular/core';
import {  ActivatedRoute, Router, RouterLink } from '@angular/router';
import {  CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent  implements  DoCheck {
gotoSinIn() {
this.router.navigateByUrl('Login')
}
gotoSignUp() {
  this.router.navigateByUrl('Login/Register')
}
 isLoginPage!:boolean
  constructor(private loc:Location,private router:Router,private activeRoute:ActivatedRoute){
 
    
    
  }
  ngDoCheck(): void {
    
    this.isLoginPage=this.loc.isCurrentPathEqualTo('/Login')
  }
}
