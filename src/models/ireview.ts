export interface IReview {
  id: number;
  user: number;
  productId: number;
  rating: number;
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}
