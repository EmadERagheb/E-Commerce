import { CommonSpecifications } from './common-specifications';
import { IReview } from './ireview';

export interface IProduct {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  quantity: number;
  imageCover: string;
  images: string[];
  category: number;
  ratingAverage?: number;
  ratingQuantity?: number;
  createdAt?: string;
  updatedAt?: string;
  CommonSpecifications: CommonSpecifications;
  reviews?: IReview[]
}
