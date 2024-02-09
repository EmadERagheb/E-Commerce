import { Component } from '@angular/core';
import { FooterComponent } from '../../components/footer/footer.component';
import { RouterModule } from '@angular/router';
import { LoginComponent } from "../../components/login/login.component";

@Component({
    selector: 'app-register-layout',
    standalone: true,
    templateUrl: './register-layout.component.html',
    styleUrl: './register-layout.component.css',
    imports: [RouterModule, FooterComponent, LoginComponent]
})
export class RegisterLayoutComponent {}
