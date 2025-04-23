/* eslint-disable no-unused-vars */
import { Model, Types } from 'mongoose';

export type TProduct = {
  name: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  images: string[];
  brand: string;
  quantity: number;
  isStock: boolean;
  isDeleted: boolean;
};

export interface ProductModel extends Model<TProduct> {
  isProductExists(id: string): Promise<TProduct | null>;
}
