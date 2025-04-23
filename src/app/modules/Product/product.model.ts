import { model, Schema } from 'mongoose';

import { ProductModel, TProduct } from './product.interface';

const productSchema = new Schema<TProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    category: {
      type: Schema.Types.ObjectId,
      required: [true, 'category is required'],
      ref: 'Category',
    },
    images: [
      {
        type: String,
        required: [true, 'images is required'],
        default: '',
      },
    ],
    brand: {
      type: String,
      required: [true, 'Brand is required'],
    },
    quantity: {
      type: Number,
      required: true,
    },
    isStock: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

productSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('findOne', function (next) {
  this.findOne({ isDeleted: { $ne: true } });
  next();
});

productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

productSchema.statics.isProductExists = async function (id: string) {
  const existingProduct = await Product.findOne({ id });

  return existingProduct;
};

export const Product = model<TProduct, ProductModel>('Product', productSchema);
