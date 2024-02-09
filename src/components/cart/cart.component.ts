import { Component, Input, NgModule, OnInit } from '@angular/core';
import { IProduct } from '../../models/iproduct';
import { CartService } from '../../services/cart.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CustomCartService } from '../../services/custom-cart-products.service';
import { ProductCartComponent } from '../product-cart/product-cart.component';
import { CommonModule } from '@angular/common';
import { IproductBuyed } from '../../models/iproduct-buyed';
import { UserAuthService } from '../../services/user-auth.service';
import { IUser } from '../../models/iuser';
import { LocalStrogeService } from '../../services/local-stroge.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [ProductCartComponent, CommonModule, RouterLink],
  providers: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  cartId: number = 0;
  productsBuyedArray: IproductBuyed[] = [];
  productsIds: number[] = [];
  productsQuantity: number[] = [];
  products: IProduct[] = [];
  totalPrice = 0;
  productsString!: string;
  logstate!: boolean;
  currentUser?: IUser;
  // currentUserName?:string;
  UserId!: number;

  constructor(
    private getProductsService: CustomCartService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private userAuthService: UserAuthService,
    private storge: LocalStrogeService,
    private userService: UserService
  ) {
    this.route.params.subscribe((params) => {
      this.cartId = params['id'];
    });
    this.logstate = this.userAuthService.LoggedState;
    this.userAuthService.getAllUsers().subscribe((alluser) => {
      let token =
        this.storge.getItemFromLocalStorge('accessToken') ||
        this.storge.getItemFromSessionStorge('accessToken');
      this.currentUser = alluser.find((user) => user.accessToken == token);
      if (this.currentUser) {
        this.userAuthService.setLoggedState = true;
        this.UserId = this.currentUser.id; // Store the current user's id
      
      } else {
        this.userAuthService.setLoggedState = false;
        // this.UserId = ''; // Clear the current user's name if not logged in
      }
    });
  }
  ngOnInit(): void {
    this.products = [];
    this.cartService.getCart(this.cartId).subscribe({
      next: (data) => {
       

        this.productsBuyedArray = data.products;
        for (let product of data.products) {
          this.productsIds.push(product.id);
          this.productsQuantity.push(product.quantity);
        }
        if (this.productsIds.length == 0) {
          this.productsIds.push(-1);
          let productss = this.productsIds.map((value) => `id=${value}`);
          this.productsString = productss.join('&');
        } else {
          let productss = this.productsIds.map((value) => `id=${value}`);
          this.productsString = productss.join('&');
        }
        this.getProductsService.getCartProducts(this.productsString).subscribe({
          next: (value) => {
            this.totalPrice = 0;
            this.products = value;
            for (let i = 0; i < this.products.length; i++) {
              this.totalPrice +=
                +this.products[i].price * +this.productsQuantity[i];
            }
            this.getProductsService
              .editCartTotalPrice(this.cartId, this.totalPrice)
              .subscribe();
            
          },
          error: (error) => console.log(error),
        });
      },
      error: (error) => console.log(error),
    });
  }
  onAction(value: [IproductBuyed, string, number]) {
    if (value[1] === 'delete') {
     
      this.productsBuyedArray = this.productsBuyedArray.filter(
        (item) => item.id !== value[0].id
      );
      this.getProductsService
        .editCartProducts(this.cartId, this.productsBuyedArray)
        .subscribe();
      this.totalPrice = this.totalPrice - value[0].quantity * value[2];
   
      this.getProductsService
        .editCartTotalPrice(this.cartId, this.totalPrice)
        .subscribe();
    } else {
      this.productsBuyedArray = this.productsBuyedArray.map((item) => {
        if (item.id === value[0].id) item.quantity = value[0].quantity;
        return item;
      });

      if (value[1] === 'plus') {
        this.totalPrice = this.totalPrice + value[2];
      } else {
        this.totalPrice = this.totalPrice - value[2];
      }
      
      this.getProductsService
        .editCartProducts(this.cartId, this.productsBuyedArray)
        .subscribe();
      this.getProductsService
        .editCartTotalPrice(this.cartId, this.totalPrice)
        .subscribe();
    }
  }
}
