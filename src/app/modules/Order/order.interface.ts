import { Types } from 'mongoose';

export type TOrder = {
  user: Types.ObjectId;
  products: { product: Types.ObjectId; quantity: number }[];
  tax: number;
  totalPrice: number;
  totalQuantity: number;
  grandAmount: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  transactionId: string;
};
