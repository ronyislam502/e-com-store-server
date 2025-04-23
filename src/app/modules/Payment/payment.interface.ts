import { Types } from 'mongoose';

export type TPayment = {
  grandAmount: number;
  transactionId: string;
  user: Types.ObjectId;
};
