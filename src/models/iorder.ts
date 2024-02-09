import { IproductBuyed } from "./iproduct-buyed";

export interface IOrder {
  transactionID: number,
  date: Date,
  products: IproductBuyed[],
  totalPrice: number
}
