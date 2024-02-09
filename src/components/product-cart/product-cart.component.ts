import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../models/iproduct';
import { IproductBuyed } from '../../models/iproduct-buyed';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-cart.component.html',
  styleUrl: './product-cart.component.css',
})
export class ProductCartComponent {
  @Output() cartProductEvent = new EventEmitter<[IproductBuyed, string, number]>();
  @Input() product: IProduct = {} as IProduct;

  @Input() quantity: number = 0;
  displayItem = 'block';
  onMinus(id: number) {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1;
      this.cartProductEvent.emit([{ id: id, quantity: this.quantity }, 'minus', this.product.price]);
    }
  }
  onPlus(id: number) {
    if (this.quantity < this.product.quantity) {
      this.quantity = this.quantity + 1;
      this.cartProductEvent.emit([{ id: id, quantity: this.quantity }, 'plus', this.product.price]);
    }
  }
  onRemove(id: number) {
    // console.log([{ id: id, quantity: 0 }, this.quantity, this.product.price])
    let lastQuantity = this.quantity;
    this.quantity = 0;
    this.cartProductEvent.emit([{ id: id, quantity: lastQuantity }, 'delete', this.product.price]);
    this.displayItem = 'none';
  }
}
