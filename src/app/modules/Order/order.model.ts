import { model, Schema } from 'mongoose';
import { TOrder } from './order.interface';

const OrderSchema = new Schema<TOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    tax: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
    },
    grandAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed'],
      default: 'Pending',
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model<TOrder>('Order', OrderSchema);
