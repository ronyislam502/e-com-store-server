import { model, Schema } from 'mongoose';
import { TCategory } from './category.interface';

const categorySchema = new Schema<TCategory>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      unique: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

categorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

export const Category = model<TCategory>('Category', categorySchema);
