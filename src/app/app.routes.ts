import { Routes } from '@angular/router';

import { ErrorPageComponent } from '../components/error-page/error-page.component';
import { CartComponent } from '../components/cart/cart.component';
import { ProfileComponent } from '../components/profile/profile.component';
import { MainLayoutComponent } from '../layouts/main-layout/main-layout.component';
import { HomeComponent } from '../components/home/home.component';
import { RegisterComponent } from '../components/register/register.component';
import { FilterComponent } from '../components/filter/filter.component';
import { CreateProductComponent } from '../components/create-product/create-product.component';
import { AboutUsComponent } from '../components/about-us/about-us.component';
import { ProductDetailsContainerComponent } from '../components/product-details-container/product-details-container.component';
import { ProductListComponent } from '../components/product-list/product-list.component';
import { UserProfileComponent } from '../components/user-profile/user-profile.component';
import { RegisterLayoutComponent } from '../layouts/register-layout/register-layout.component';
import { LoginFormComponent } from '../components/login-form/login-form.component';
import { PaymentComponent } from '../components/payment/payment.component';
import { SuccessPaymentComponent } from '../components/success-payment/success-payment.component';
import { loginGuard } from '../guards/login.guard';
import { logoutGuard } from '../guards/logout.guard';
import { WishListComponent } from '../components/wish-list/wish-list.component';
import { OrdersComponent } from '../components/orders/orders.component';
export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'Home', component: HomeComponent },
      { path: '', redirectTo: 'Home', pathMatch: 'full' },

      { path: 'category/:categoryId', component: ProductListComponent },
      {
        path: 'Category/:categoryId/:id',
        component: ProductDetailsContainerComponent,
      },
      { path: 'Profile', component: ProfileComponent }, //Add Guard

      { path: 'Myprofile', component: UserProfileComponent,canActivate: [loginGuard] },

      {
        path: 'Cart/:id',
        component: CartComponent,
        canActivate: [loginGuard]
      },
      {
        path: 'WishList',
        component: WishListComponent,
        canActivate: [loginGuard],
      },
      { path: 'Search/:word', component: FilterComponent },
      { path: 'AboutUs', component: AboutUsComponent },
      { path: 'Payment', component: PaymentComponent },
      { path: 'success', component: SuccessPaymentComponent },
      { path: 'Orders/:id', component: OrdersComponent, /*canActivate: [logoutGuard] */ }
    ],
  },
  {
    path: 'Login',
    component: RegisterLayoutComponent,
    canActivateChild:[logoutGuard],
    children: [
      { path: '', component: LoginFormComponent,  },
      {
        path: 'Register',
        component: RegisterComponent,
      },
    ],
  },
  { path: 'CreateProduct', component: CreateProductComponent },
  // { path: 'Profile', component: ProfileComponent }, //Add Guard
  { path: '**', component: ErrorPageComponent },
];
