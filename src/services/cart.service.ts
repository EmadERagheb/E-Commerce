import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICart } from '../models/icart';
import { environment } from '../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  DB=`${environment.apiUrl}/carts`;
  constructor(private http:HttpClient) { }

  getCarts()
  {
    return this.http.get<ICart[]>(this.DB);
  }
  getCart(id:number)
  {
    let url= `${this.DB}/${id}`;
    return this.http.get<ICart>(url);
  }
  createCart(data:{}){
    return this.http.post<ICart>(this.DB,data);
  }
  updateCart(id:number,data:{})
  {
    let url= `${this.DB}/${id}`;
    return this.http.put<ICart>(url,data);
  }
  deleteCart(id:number)
  {
    let url= `${this.DB}/${id}`;
    return this.http.delete<ICart>(url);
  }
  
  //to increment counter
  private counterSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public counter$: Observable<number> = this.counterSubject.asObservable();

  incrementCounter() {
    const counter = this.counterSubject.value + 1;
    this.counterSubject.next(counter);
  }


  // private cartItemsSubject: BehaviorSubject<ICart[]> = new BehaviorSubject<ICart[]>([]);
  // public cartItems$: Observable<ICart[]> = this.cartItemsSubject.asObservable();

  // get cartItemCount(): number {
  //   return this.cartItemsSubject.value.length;
  // }

  // addToCart(item: ICart) {
  //   const currentItems = this.cartItemsSubject.value;
  //   const updatedItems = [...currentItems, item];
  //   this.cartItemsSubject.next(updatedItems);
  // }


}
