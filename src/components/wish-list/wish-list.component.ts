import { Component, ElementRef, OnInit } from '@angular/core';
import { IUser } from '../../models/iuser';
import { UserAuthService } from '../../services/user-auth.service';
import { LocalStrogeService } from '../../services/local-stroge.service';
import { IProduct } from '../../models/iproduct';
import { ProductService } from '../../services/product.service';
import { ProductsArrayComponent } from '../products-array/products-array.component';
import { CommonModule, CurrencyPipe, JsonPipe } from '@angular/common';
import { UserService } from '../../services/user.service';
import { CartService } from '../../services/cart.service';
import { IproductBuyed } from '../../models/iproduct-buyed';
import Swal from 'sweetalert2';
import { CustomCartService } from '../../services/custom-cart-products.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wish-list',
  standalone: true,
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css',
  imports: [ProductsArrayComponent, JsonPipe, CommonModule,RouterLink],
})
export class WishListComponent implements OnInit {
  logstate!: boolean;
  currentUser?: IUser;
  whistlist?: number[];
  wishedProducts: IProduct[] = [];
  productsInCart: IproductBuyed[] = [];
  buttonContent = 'Add to Cart';
  x: any;
  constructor(
    private cartCustomService: CustomCartService,
    private userAuthService: UserAuthService,
    private storge: LocalStrogeService,
    private prodAPi: ProductService,
    private userService: UserService,
    private cartService: CartService
  ) {
    this.logstate = this.userAuthService.LoggedState;

    this.userAuthService.getAllUsers().subscribe((alluser) => {
      let token =
        this.storge.getItemFromLocalStorge('accessToken') ||
        this.storge.getItemFromSessionStorge('accessToken');
      this.currentUser = alluser.find((user) => user.accessToken == token);
      this.whistlist = this.currentUser?.wishlist;

      if (this.currentUser) {
        this.userAuthService.setLoggedState = true;
        this.prodAPi.getProducts().subscribe((data) => {
          this.wishedProducts = data.filter((p) =>
            this.whistlist?.includes(p.id)
          );
          console.log(this.whistlist);
          console.log(this.wishedProducts);
        });
      } else this.userAuthService.setLoggedState = false;
    });
  }
  ngOnInit(): void {}
  removeFromWhishList(prdId: number) {
    this.whistlist = this.whistlist?.filter((id) => id != prdId) || [];

    this.userService
      .updateWishlistForUser(this.currentUser!.id, this.whistlist)
      .subscribe((data) => {
        this.prodAPi.getProducts().subscribe((data) => {
          this.wishedProducts = data.filter((p) =>
            this.whistlist?.includes(p.id)
          );
        });
      });
  }
  // AddToCart(prdId: number,index:ElementRef) {
  //   //To Be Implmented Later

  //   this.cartService.getCart(this.currentUser!.id).subscribe({
  //     next: (value) => {
  //       this.productsInCart = value.products || [];
  //       const existingProductIndex = this.productsInCart.findIndex(
  //         (product) => product.id === prdId
  //       );
  //       if (existingProductIndex !== -1) {
  //         this.productsInCart = this.productsInCart.filter((productBuyed) => {
  //           return productBuyed.id != prdId;
  //         });
  //         this.buttonContent = 'Add to Cart';
  //         this.showMessage('Removed from Cart');

  //       }else{
  //         this.productsInCart.push({id:prdId,quantity:1})
  //         this.buttonContent="Remove from Cart"
  //         this.showMessage('Added to cart');
  //       }
  //       this.cartCustomService.editCartProducts(this.currentUser!.id,this.productsInCart).subscribe()
  //     },
  //     error:(err)=>console.log(err)
  //   });
  // }
  showMessage(message: string): void {
    this.x = setTimeout(() => {
      Swal.fire({
        title: message,

        icon: 'success',
      });
      this.clearMessage();
    }, 500);
    // console.log('interval work');
  }
  clearMessage(): void {
    clearTimeout(this.x);
    // console.log('clear work');
  }
}
