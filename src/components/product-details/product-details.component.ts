import {
  Component,
  DoCheck,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { RouterLink } from '@angular/router';
import { ProductComponent } from '../product/product.component';
import { IProduct } from '../../models/iproduct';
import { CartService } from '../../services/cart.service';
import { CustomCartService } from '../../services/custom-cart-products.service';
import { IproductBuyed } from '../../models/iproduct-buyed';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { ICart } from '../../models/icart';
import { UserAuthService } from '../../services/user-auth.service';
import { LocalStrogeService } from '../../services/local-stroge.service';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/iuser';

//import { NgxImageZoomModule } from 'ngx-image-zoom';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [RouterLink, ProductComponent, NgbRating],
  providers: [],
  templateUrl: './product-details.component.html',
  template: ` <button (click)="incrementCounter()">Increment Counter</button> `,
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnChanges, DoCheck {
  private isFirstChange = true;
  // cartId = 1;
  productsInCart: IproductBuyed[] = [];
  productId = 0;
  logstate!: boolean;
  currentUser?: IUser;
  // currentUserName?:string;
  UserId!: number;
  counter: number = 0;
  @Input() product: IProduct = <IProduct>{};
  x: any;
  @Input() avgRating!: number;

  quantity!: number
  buttonContent = "Add to Cart"

  constructor(
    private CartCustomService: CustomCartService,
    private cartService: CartService,
    private productService: ProductService,
    private userAuthService: UserAuthService,
    private storge: LocalStrogeService,
    private userService: UserService
  ) {
    this.logstate = this.userAuthService.LoggedState;
    this.userAuthService.getAllUsers().subscribe((alluser) => {
      let token =
        this.storge.getItemFromLocalStorge('accessToken') ||
        this.storge.getItemFromSessionStorge('accessToken');
      this.currentUser = alluser.find((user) => user.accessToken == token);
      if (this.currentUser) {
        this.userAuthService.setLoggedState = true;
        this.UserId = this.currentUser.id; // Store the current user's id
        console.log(this.UserId);
      } else {
        this.userAuthService.setLoggedState = false;
        // this.UserId = ''; // Clear the current user's name if not logged in
      }
    });
  }
  ngDoCheck(): void {
    // throw new Error('Method not implemented.');
    // this.product=
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false;
      return;
    }
    this.productId = this.product.id;
    this.quantity = this.product.quantity;
  }
  AddToCart() {
    this.cartService.getCart(this.UserId).subscribe({
      next: (value) => {
        this.productsInCart = value.products || [];

        const existingProductIndex = this.productsInCart.findIndex(
          (product) => product.id === this.productId
        );

        if (existingProductIndex !== -1) {
          // Product exists, remove it
          this.productsInCart = this.productsInCart.filter(productBuyed => {
            return productBuyed.id != this.productId
          })
          this.buttonContent = "Add to Cart";
          this.showMessage('Removed from Cart');
        } else {
          // Product not found
          this.productsInCart.push({ id: this.productId, quantity: 1 });
          this.buttonContent = "Remove from Cart"
          this.showMessage('Added to cart');
        }

        // Save the updated cart after checking or adding the product
        this.CartCustomService.editCartProducts(
          this.UserId,
          this.productsInCart
        ).subscribe();
      },
      error: (err) => console.log(err),

    });


  }

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
  prodct = {
    imageCover: '',
    images: [],
  };

  fetchProduct(): void {
    this.prodct = {
      imageCover: this.prodct.imageCover,
      images: [
        this.prodct.images[0],
        this.prodct.images[1],
        this.prodct.images[2],
      ],
    };
  }

  updateImage(imageUrl: string): void {
    this.product.imageCover = imageUrl;
  }

  ngOnInit(): void {
    this.fetchProduct();
  }

  zoomOptions = {
    zoomFactor: 3,
    container: 'container-element',
  };
}
