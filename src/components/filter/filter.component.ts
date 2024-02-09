import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { IProduct } from '../../models/iproduct';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FilterAPIService } from '../../services/filter-api.service';
import { ProductsArrayComponent } from '../products-array/products-array.component';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { JsonPipe } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductComponent } from '../product/product.component';

@Component({
  selector: 'app-filter',
  standalone: true,
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
  imports: [
    MatSidenavModule,
    ProductsArrayComponent,
    MatCheckboxModule,
    JsonPipe,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    ProductComponent,
  ],
})
export class FilterComponent implements OnInit {
  productList!: IProduct[];
  filterProductList: IProduct[];
  form!: FormGroup;
  shearchWord!: string;
  minPrice!: number;
  minvalue!: number;
  maxPrice!: number;
  maxvalue!: number;
  categories!: { name: string; id: number }[];
  brandsNames!: string[];
  checkboxStates: { [key: string]: boolean } = {};
  checkCategoryBoxStates: { [key: string]: boolean } = {};
  constructor(
    private activeRouter: ActivatedRoute,
    private filterApi: FilterAPIService,
    private router: Router
  ) {
    this.activeRouter.params.subscribe((prams) => {
      this.shearchWord = prams['word'];
      this.router.navigateByUrl(`Search/${this.shearchWord}`);
      this.filterApi
        .getProductFromShearch(this.shearchWord)
        .subscribe((data) => {
          this.productList = data;
          this.filterProductList = this.productList;
          this.brandsNames = Array.from(
            new Set(this.filterProductList.map((p) => p.brand))
          );
          let categoriesIds: number[] = Array.from(
            new Set(this.productList.map((p) => p.category))
          );
          this.filterApi
            .getCategoriesNameByProductsIds(categoriesIds)
            .subscribe((data) => {
              this.categories = data.map((name, index) => {
                return { name, id: categoriesIds[index] };
              });
              console.log(this.categories);
              this.minPrice = Math.min(...this.productList.map((p) => p.price));
              this.minvalue = this.minPrice;
              this.maxPrice = Math.max(...this.productList.map((p) => p.price));
              this.maxvalue = this.maxPrice;
            });
        });
    });
    this.filterProductList = [];
  }
  ngOnInit(): void {}
  toggleCatCheckbox() {
    console.log('case category length ', this.categories.length);

    if (this.categories.length > 1) {
      console.log('case category bigger than 1');
      let checkedCatId = Object.keys(this.checkCategoryBoxStates).filter(
        (key) => this.checkCategoryBoxStates[key]
      );
      if (checkedCatId.length) {
        this.filterProductList = this.productList.filter((pro) =>
          checkedCatId.includes(pro.category.toString())
        );
        console.log(this.filterProductList);
      } else {
        console.log('case single cat');
        this.filterProductList = this.productList;
        // }
      }
    } else this.filterProductList = this.productList;
  }
  toggleCheckbox() {
    if (this.brandsNames.length > 1) {
      let brands: string[] = Object.keys(this.checkboxStates).filter(
        (key) => this.checkboxStates[key]
      );
      console.log(brands);
      if (brands.length) {
        this.filterProductList = this.filterProductList.filter((p) =>
          brands.includes(p.brand)
        );
      } else {
        console.log('no brand checked');
        this.toggleCatCheckbox();
      }
    }
  }

  updatePrice() {
    console.log(this.maxvalue, this.maxPrice, this.minvalue, this.minPrice);
    if (this.maxvalue != this.maxPrice || this.minvalue != this.minPrice) {
      console.log('insde price');
      this.filterProductList = this.filterProductList.filter(
        (p) => p.price <= this.maxvalue && p.price >= this.minvalue
      );
    } else {
      // this.toggleCheckbox();
      console.log(this.filterProductList);
    }
    console.log(this.filterProductList);
  }
  filter() {
    this.toggleCatCheckbox();
    this.toggleCheckbox();
    this.updatePrice();
  }
}
