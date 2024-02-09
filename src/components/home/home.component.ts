import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CarouselComponent } from '../carousel/carousel.component';
import { CategoriesComponent } from '../categories/categories.component';
import { IProduct } from '../../models/iproduct';
import { ProductsArrayComponent } from '../products-array/products-array.component';
import { Image } from '../../models/image';
import { ICategory } from '../../models/icategory';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { ProductComponent } from '../product/product.component';
import { UserAuthService } from '../../services/user-auth.service';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    CarouselComponent,
    CategoriesComponent,
    ProductsArrayComponent,
    ProductComponent,
    SpinnerComponent
  ],
  providers: [ProductService, CategoryService],
})
export class HomeComponent implements OnInit {
  images: Image[] = [
    {
      imgSrc: 'https://m.media-amazon.com/images/I/714qCf4ZqGL.SX3000.jpg',
      imgAlt: 'cover',
    },
  ];

  allCategories: ICategory[] = [];
  mobileCatg4: IProduct[] = [];
  smartWatch4: IProduct[] = [];
  laptops4: IProduct[] = [];
  wishList: number[] = []

  constructor(
    public productService: ProductService,
    public categoryServise: CategoryService,
    private userAuth: UserAuthService
  ) {
    this.userAuth.getCurrentUser().subscribe(user => {
      this.wishList = user?.wishlist || []
      console.log(this.wishList)
    }
    )
  }

  ngOnInit(): void {
    this.productService.getProduct4(1).subscribe({
      next: (value) => {
        this.mobileCatg4 = value;
      },
      error: (err) => console.log(err),
    });
    this.productService.getProduct4(2).subscribe({
      next: (value) => {
        this.smartWatch4 = value;
      },
      error: (err) => console.log(err),
    });
    this.productService.getProduct4(3).subscribe({
      next: (value) => {
        this.laptops4 = value;
      },
      error: (err) => console.log(err),
    });
    this.categoryServise.getCategories().subscribe({
      next: (value) => {
        this.allCategories = value;
        for (let category of this.allCategories)
          this.images.push({
            imgSrc: category.imageCover,
            imgAlt: category.name,
          });
      },
      error: (err) => console.log(err),
    });
  }
}
