import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IOrder } from '../../models/iorder';
import { HttpClientModule } from '@angular/common/http';
import { IProduct } from '../../models/iproduct';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent implements OnChanges {
  @Input() order: IOrder = {} as IOrder;
  products: IProduct[] = [];
  constructor(private productService: ProductService) {
  }
  ngOnChanges(changes: SimpleChanges): void {
    for (let product of this.order.products) {
      this.productService.getProduct(product.id).subscribe({
        next: (value) => {
          this.products.push(value);
          // console.log(this.products);
        },
        error: (err) => console.log(err)
      })
    }
  }

}
