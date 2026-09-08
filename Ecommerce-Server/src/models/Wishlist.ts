import mongoose, { Document, Model, Schema } from 'mongoose';
import { IProduct } from './Product';

export interface IWishlist extends Document {
  userId: mongoose.Types.ObjectId;
  products: (mongoose.Types.ObjectId | IProduct)[];
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema: Schema<IWishlist> = new Schema<IWishlist>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Wishlist: Model<IWishlist> = mongoose.model<IWishlist>('Wishlist', wishlistSchema);

export default Wishlist;
