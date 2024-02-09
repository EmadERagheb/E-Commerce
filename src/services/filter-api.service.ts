import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { IProduct } from '../models/iproduct';
import { environment } from '../environments/environment';
import { ICategory } from '../models/icategory';

@Injectable({
  providedIn: 'root',
})
export class FilterAPIService {
  constructor(private httpClient: HttpClient) {}
  getProductsByCategoryId(catId: number): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(
      `${environment.apiUrl}/products?category=${catId}`
    );
  }
  getProdcutsByBrandForCategory(
    catId: number,
    brand: string[]
  ): Observable<IProduct[]> {
    let brans: string = 'brand=' + brand.join('&brand=');
    return this.httpClient.get<IProduct[]>(
      `${environment.apiUrl}/products?category=${catId}&${brans}`
    );
  }
  getProductFromShearch(keyword: string): Observable<IProduct[]> {
    return this.httpClient.get<IProduct[]>(
      `${environment.apiUrl}/products?q=${keyword}`
    );
  }
  getProductNameFromShearch(keyword: string): Observable<string[]> {
    return this.httpClient.get<IProduct[]>(
      `${environment.apiUrl}/products?q=${keyword}`
    ).pipe(
      map(pro=>pro.map(p=>p.name))
    )
  }
  getCategoriesNameByProductsIds(ids:number[]):Observable<string[]>{
    // http://localhost:3000/categories?id=1&id=2
    let querstring='id='+ids.join('&id=')
   return this.httpClient.get<ICategory[]>(`${environment.apiUrl}/categories?${querstring}`)
    .pipe(map((categories)=>categories.map(cat=>cat.name))
    )
  }

}
