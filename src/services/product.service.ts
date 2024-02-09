import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/iproduct';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  DB = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) { }
  getProducts() {
    return this.http.get<IProduct[]>(this.DB);
  }
  getProduct(id: number) {
    let url = `${this.DB}/${id}?_embed=reviews`;
    return this.http.get<IProduct>(url);
  }


  createProduct(data: {}) {
    return this.http.post<IProduct>(this.DB, data);
  }
  updateProduct(id: number, data: {}) {
    let url = `${this.DB}/${id}`;
    return this.http.put<IProduct>(url, data);
  }
  UpdateProductRatingAverage(id: number, ratingAverage: number) {
    return this.http.patch<IProduct>(`${this.DB}/${id}`, { "ratingAverage": ratingAverage })
  }
  updateProductQuantity(id: number, newQuantity: number) {
    let url = `${this.DB}/${id}`;
    return this.http.patch<IProduct>(url, { "quantity": newQuantity });
  }
  deleteProduct(id: number) {
    let url = `${this.DB}/${id}`;
    return this.http.delete<IProduct>(url);
  }

  getProductsOfCategory(categoryId: number) {
    let url = `${this.DB}?category=${categoryId}`;
    return this.http.get<IProduct[]>(url)
  }

  getProduct4(categoryId: number) {
    let url = `${this.DB}?category=${categoryId}&_page=1&_limit=4`;
    return this.http.get<IProduct[]>(url)
  }
  // getPaginateProduct(categoryId: number, itemsNum: number) {
  //   let url =`${this.DB}?category=${categoryId}&_page=1&_limit=${itemsNum}`;
  //   return this.http.get<IProduct[]>(url)
  // }
}
