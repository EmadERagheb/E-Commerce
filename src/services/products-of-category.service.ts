import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/iproduct';

@Injectable({
  providedIn: 'root',
})
export class ProductsOfCategoryService {
  url = 'http://localhost:3000';
  constructor(private hhtp: HttpClient) {}

  getProductOfCategory(categoryId: number) {
    return this.hhtp.get<IProduct[]>(
      `${this.url}/products?category=${categoryId}&_page=1&_limit=50`
    );
  }

 
}
