import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-payment',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './success-payment.component.html',
  styleUrl: './success-payment.component.css'
})
export class SuccessPaymentComponent implements OnInit {
  transition!: string
  constructor(private route: ActivatedRoute) {
  }
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.transition = params['transactionId']
    })
  }
}
