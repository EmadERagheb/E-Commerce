import { HttpClientModule } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart.service';
import { IproductBuyed } from '../../models/iproduct-buyed';
import { ProductService } from '../../services/product.service';
import { UserService } from '../../services/user.service';
import { IOrder } from '../../models/iorder';
import { CustomCartService } from '../../services/custom-cart-products.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  price!: number;
  cartID!: number;
  productsBuyedArray: IproductBuyed[] = []
  Orders: IOrder[] = []
  @ViewChild('payment', { static: true }) payment!: ElementRef;
  constructor(private route: ActivatedRoute, private router: Router, private cartService: CartService, private productService: ProductService, private userService: UserService, private customCartService: CustomCartService) {
    this.route.queryParams.subscribe(params => {
      this.price = params['totalPrice'];
      this.cartID = params['ID'];
      // console.log((+this.price).toFixed(2).toString());
    })
  }
  ngOnInit(): void {
    // console.log(window.paypal);
    window.paypal.Buttons(
      {
        style: {
          layout: 'horizontal',
          color: 'blue',
          shape: 'rect',
          label: 'paypal',
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: (+this.price).toFixed(2).toString(),
                  currency_code: 'USD'
                }
              }
            ]
          })
        },



        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            //console.log(details);
            if (details.status === 'COMPLETED') {
              this.router.navigate(['success'], { queryParams: { transactionId: details.id }, queryParamsHandling: 'merge' });
              this.cartService.getCart(this.cartID).subscribe({
                next: (data) => {
                  //console.log(data);
                  this.productsBuyedArray = data.products;
                  for (let product of this.productsBuyedArray) {
                    this.productService.getProduct(product.id).subscribe({
                      next: (val) => {
                        let quantity = val.quantity;
                        if (quantity <= 0) {
                          quantity = 0;
                        }
                        else {
                          quantity = quantity - product.quantity
                        }
                        this.productService.updateProductQuantity(product.id, quantity).subscribe();
                      },
                      error: (err) => console.log(err)
                    })
                  }
                  this.userService.getUser(this.cartID).subscribe({
                    next: (val) => {
                      this.Orders = val.orders!;
                      this.Orders.push({ transactionID: details.id, date: new Date(), products: this.productsBuyedArray, totalPrice: this.price })
                      this.userService.updateUserOrders(this.cartID, this.Orders).subscribe();
                    }
                  })
                  this.customCartService.editCartProducts(data.id, []).subscribe();
                },
                error: (err) => console.log(err)
              })
            }
          });
        },



        onError: (error: any) => {
          console.log(error);
        }
      }
    ).render(this.payment.nativeElement)
  }
}
