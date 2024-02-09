import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IUser } from '../../models/iuser';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ReviewService } from '../../services/review.service';
import { IReview } from '../../models/ireview';
import { NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { UserAuthService } from '../../services/user-auth.service';
import { LocalStrogeService } from '../../services/local-stroge.service';

@Component({
  selector: 'app-create-review',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbRatingModule,
  ],
  providers: [UserService, UserAuthService],
  templateUrl: './create-review.component.html',
  styleUrl: './create-review.component.css',
})
export class CreateReviewComponent implements OnInit {
  // @Input() userID!:number;
  userID!:number ; //static until the guard finish
  @Input() productID!: number;
  @Output() reviewCreated: EventEmitter<IReview[]> = new EventEmitter<
    IReview[]
  >();

  user!: IUser;
  myForm: FormGroup;
  @Output() newReview!: IReview;
  selectedRating: number = 1; // Initial value

  reviewsOfProduct: IReview[] = [];
  logstate!: boolean;
  currentUser?: IUser;
  currentUserName?: string;

  constructor(
    private userService: UserService,
    private reviewService: ReviewService,
    private route: ActivatedRoute,
    private userAuthService: UserAuthService,
    private storge: LocalStrogeService
  ) {
    this.route.params.subscribe((params) => {
      this.productID = params['id']; //get product id
    

      this.logstate = this.userAuthService.LoggedState;
      this.userAuthService.getAllUsers().subscribe((alluser) => {
        let token =
          this.storge.getItemFromLocalStorge('accessToken') ||
          this.storge.getItemFromSessionStorge('accessToken');
        this.currentUser = alluser.find((user) => user.accessToken == token);
        if (this.currentUser) {
          this.userAuthService.setLoggedState = true;
          this.currentUserName = this.currentUser.name; // Store the current user's name
          this.userID= this.currentUser.id;
        } else {
          this.userAuthService.setLoggedState = false;
          this.currentUserName = ''; // Clear the current user's name if not logged in
        

        }
      });
    });
    this.myForm = new FormGroup({
      comment: new FormControl(null, Validators.required),
    });
  }
  ngOnInit(): void {
    this.userService.getUser(this.userID).subscribe({
      next: (data) => {
        this.user = data;
    
      },
      error: () => console.log('error'),
    });
  }
  checkUser() {
    if (this.user === null) return;
  }
  send() {

    let comment = this.myForm.controls['comment'].value;
    let user = +this.userID;
    let productId = +this.productID;
    let rating = this.selectedRating;

    let newReview = { comment, user, productId, rating };

    this.reviewService.createReview(newReview).subscribe({
      next: (createdReview) => {
        this.reviewService.getReviewsOfProduct(this.productID).subscribe({
          next: (data: any) => {
            this.reviewsOfProduct = data;
          
            this.reviewCreated.emit(this.reviewsOfProduct); // Emit the new review
          },
        });
        this.myForm.reset();
        this.selectedRating = 1;
      },
    });

    
  }

  onRatingChange(newRating: number) {
    console.log('New rating:', newRating);
  }
}
