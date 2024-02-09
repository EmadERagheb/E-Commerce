import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { IProduct } from '../../models/iproduct';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserAuthService } from '../../services/user-auth.service';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { ReviewService } from '../../services/review.service';
import { IReview } from '../../models/ireview';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, RouterLink, NgbRating],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent implements OnChanges {
  @Input() product: IProduct = <IProduct>{};
  @Input() userWishList: number[] = [];
  wished: boolean = false;
  heart = 'fa-regular fa-heart ';

  constructor(
    private router: Router,
    private userService: UserService,
    private userAuth: UserAuthService,
  ) {
    console.log(this.userWishList);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userWishList = changes['userWishList'].currentValue;
    this.wished = this.userWishList.includes(this.product.id);
  }

  onWishList() {
    console.log(this.product.id, this.wished);
    if (!this.wished) {
      this.wished = true;
      this.userWishList.push(this.product.id);
    } else {
      this.wished = false;
      this.userWishList = this.userWishList.filter(
        (id) => id != this.product.id
      );
    }
    this.userAuth.getCurrentUser().subscribe((user) => {
      if (user) {
        this.userService
          .updateWishlistForUser(user.id, this.userWishList)
          .subscribe((user) => {
            this.userWishList = user.wishlist || [];
          });
      }
    });
  }

  refreshRoute() {
    const currentUrl =
      '/Category/' + this.product.category + '/' + this.product.id;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
