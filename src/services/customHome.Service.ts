import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProduct } from '../models/iproduct';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class customHomeService {
  url =`${environment.apiUrl}`
  constructor(private http: HttpClient) { }
  getProduct4(categoryId: number) {
    return this.http.get<IProduct[]>(`${this.url}/products?category=${categoryId}&_page=1&_limit=4`)
  }
}
