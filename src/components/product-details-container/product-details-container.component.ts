import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { BreadCrumbComponent } from '../bread-crumb/bread-crumb.component';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { HttpClientModule } from '@angular/common/http';
import { IProduct } from '../../models/iproduct';
import { ProductsArrayComponent } from '../products-array/products-array.component';

import { ReviewsComponent } from '../reviews/reviews.component';
import { ProductComponent } from '../product/product.component';
import { CreateReviewComponent } from '../create-review/create-review.component';
import { IUser } from '../../models/iuser';
import { IReview } from '../../models/ireview';
import { ReviewService } from '../../services/review.service';
import { Observable, catchError, map, of, switchMap } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { SpinnerComponent } from '../spinner/spinner.component';
import { UserAuthService } from '../../services/user-auth.service';


@Component({
  selector: 'app-product-details-container',
  standalone: true,

  imports: [ProductDetailsComponent,
    BreadCrumbComponent,
    HttpClientModule,
    ProductsArrayComponent,
    ReviewsComponent,
    ProductComponent,
    CreateReviewComponent,
    ProductDetailsComponent,
    SpinnerComponent
  ],

  providers: [ProductService],
  templateUrl: './product-details-container.component.html',
  styleUrl: './product-details-container.component.css'
})

export class ProductDetailsContainerComponent implements OnInit {
  productId!: number;
  currentProduct: IProduct = <IProduct>{};
  categoryProducts: IProduct[] = [];
  Products: IProduct[] = [];
  breadCrumbTitles: string[] = [];
  breadCrumbLinks: string[] = [];
  reviews: IReview[] = [];
  avgRating:number=0;
  Ratings: number[] = [];
  product!:IProduct;
  wishList:number[]=[];
  constructor(private reviewService:ReviewService,
    private route: ActivatedRoute,
    private productService: ProductService,
    private changeDetectorRef: ChangeDetectorRef ,
    private userAuth: UserAuthService
    ) {
    this.route.params.subscribe(params => {
      this.productId = +params['id'];
    })

    this.userAuth.getCurrentUser().subscribe(
      user=>{
              this.wishList=user?.wishlist||[]
            }
     )


  }
  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (value) => {
        this.reviews = value.reviews || []; // Assuming product includes reviews
        console.log(this.reviews);

        this.currentProduct = value;
        this.breadCrumbTitles = ['Home', value.name];
        this.breadCrumbLinks = ["/Home", `/Category/${this.currentProduct.category}/${this.currentProduct.id}`]
        // this.productService.getProductsOfCategory(value.category).subscribe({
        //   next: (products) => {
        //     this.categoryProducts = products.filter(product => product.id !== this.currentProduct.id)
        //   }
        // })
        this.productService.getProductsOfCategory(value.category).subscribe({
          next: (products) => {
            // Filter out the current product and take only the first 4
            this.categoryProducts = products
              .filter((product) => product.id !== this.currentProduct.id)
              .slice(0, 4); // Get the first 4 products
          }
        });
      }
    })

    this.reviewService.getReviews().subscribe({
      next:(data)=>{
        let reviews: IReview[] = data;
        console.log(reviews);

        for (let review of this.reviews) {
          reviews.filter( (product)=> product.productId == this.productId);
          this.Ratings.push(review.rating);
        }
        console.log(this.Ratings)
        this.avgRating = this.Ratings.reduce((sum, rating) => sum + rating, 0) / this.Ratings.length;
        console.log("Average Rating:", this.avgRating);
      }
    });

    this.productService.getProducts().subscribe({
      next:(value)=>{
        this.Products = value;
        for (let review of this.Products) {

        }
        // this.product.ratingAverage= this.avgRating;
        // console.log("Average Rating in json:", this.product.ratingAverage);
        this.productService.UpdateProductRatingAverage(this.productId,this.avgRating).subscribe({
          next:(value)=>{
            this.product = value;
            // this.product.ratingAverage= this.avgRating;
            // console.log("Average Rating in json:", this.product.ratingAverage);
            console.log(value);


          }
        })

      }
    })
  }
  // this.productService.getProducts().subscribe({
  //   next:(value)=>{
  //     this.Products = value;
  //     for (let Prod of this.Products) {
  //       this.productService.UpdateProductRatingAverage(Prod.id,this.avgRating).subscribe({
  //         next:(value)=>{
  //           this.product = value;
  //           // this.product.ratingAverage= this.avgRating;
  //           console.log("Average Rating in json:", this.product.ratingAverage);

  //         }
  //       })
  // }


  handleReviewCreated(createdReview: IReview[])
  {
    // Check if reviews are available
      this.reviews=createdReview;
      // this.changeDetectorRef.detectChanges(); // Trigger change detection

  }



}
