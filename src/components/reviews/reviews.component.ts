import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { IReview } from '../../models/ireview';
import { NgbRating } from '@ng-bootstrap/ng-bootstrap';
import { IUser } from '../../models/iuser';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../services/review.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, catchError, map, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [NgbRating, HttpClientModule, CommonModule],
  templateUrl: './reviews.component.html',
  styleUrl: './reviews.component.css'
})
export class ReviewsComponent implements OnChanges{
  private isFirstChange = true;
  @Input() reviews: IReview[] = [];
  users: IUser[] = [];
  UsersInOrderReviews: IUser[] = [];
  usersIds: number[] = [];
  Ratings: number[] = [];
  @Input() avgRating!:number;
  reviewAndUser!:{"review":IReview,"user":any};
  ArrayOfReviewAndUser:{"review":IReview,"user":IUser}[]=[];

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private route: ActivatedRoute
  ) {}

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.isFirstChange) {
  //     this.isFirstChange = false;
  //     return;
  //   }

  //   this.reviews=this.reviews.reverse(); // the order of reviews from newest to oldest
  //   for (let review of this.reviews) {
  //     this.Ratings.push(review.rating);
  //     this.usersIds.push(review.user);
  //   }

  //   for (let userID of this.usersIds) {
  //     this.userService.getUser(userID).subscribe(user => {
  //       this.UsersInOrderReviews.push(user);
  //     });
  //   }
  //   this.avgRating = this.Ratings.reduce((accumulator, currentValue) => {
  //     return accumulator + currentValue;
  //   }, 0) / this.Ratings.length;
  // }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.isFirstChange) {
      this.isFirstChange = false;
      return;
    }
    this.reviews=this.reviews.reverse(); // Reverse the array

    console.log(this.reviews)
    for (let review of this.reviews) {
      this.Ratings.push(review.rating);
      this.usersIds.push(review.user);
    }
    let users = this.usersIds.map(value => `id=${value}`);
    let usersString = users.join('&');
    this.userService.getCustomUsers(usersString).subscribe({
      next: (res) => {
        this.users = res;
        for (let review of this.reviews) {
          if (this.usersIds.includes(review.user))
            this.UsersInOrderReviews.push(this.users.filter(user => user.id === review.user)[0]);
        }
        console.log(this.UsersInOrderReviews);

      }
    })

    this.avgRating = this.Ratings.reduce((accumulator, currentValue) => {

      return accumulator + currentValue;
    }, 0) / this.Ratings.length;
    console.log("Average Rating="+this.avgRating)

    //console.log(this.avgRating)
  }

}
