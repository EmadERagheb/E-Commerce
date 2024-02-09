import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUser } from '../../models/iuser';
import { IOrder } from '../../models/iorder';
import { CommonModule } from '@angular/common';
import { OrderDetailsComponent } from '../order-details/order-details.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, OrderDetailsComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  userId!: number;
  user!: IUser;
  orders!: IOrder[];
  constructor(private route: ActivatedRoute, private userService: UserService) {
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
  }
  ngOnInit(): void {
    this.userService.getUser(this.userId).subscribe({
      next: (val) => {
        this.user = val;
        this.orders = val.orders!;
      }
    })
  }

}
