import { Types } from 'mongoose';

export type TReview = {
  user: Types.ObjectId;
  feedback: string;
  rating: number;
};
