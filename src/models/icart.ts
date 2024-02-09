import { IproductBuyed } from './iproduct-buyed';
export interface ICart {
  id: number;
  user: number;
  products: IproductBuyed[];
  totalPrice: number;
  ordered: boolean;
  createdAt?: string;
  updatedAt?: string;
}
