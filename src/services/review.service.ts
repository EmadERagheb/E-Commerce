import { Injectable } from '@angular/core';
import { IReview } from '../models/ireview';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {
  DB = `${environment.apiUrl}/reviews`;
  constructor(private http: HttpClient) {}

  getReviewsOfProduct(productID: number): Observable<IReview[]> {
    return this.http.get<IReview[]>(`${this.DB}?productId=${productID}`);
    // return this.http.get<IReview[]>(this.DB);
  }

  getReviews() {
    return this.http.get<IReview[]>(this.DB);
  }
  getReview(id: number) {
    let url = `${this.DB}/${id}`;
    return this.http.get<IReview>(url);
  }
  createReview(data: {}) {
    return this.http.post<IReview>(this.DB, data);
  }
  updateReview(id: number, data: {}) {
    let url = `${this.DB}/${id}`;
    return this.http.put<IReview>(url, data);
  }
  deleteReview(id: number) {
    let url = `${this.DB}/${id}`;
    return this.http.delete<IReview>(url);
  }
}
