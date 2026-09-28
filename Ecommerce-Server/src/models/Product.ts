import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  hindiName?: string;
  price: number;
  category: string;
  region: string;
  description: string;
  hindiDescription?: string;
  image: string;
  originalImage?: string;
  enhancedImage?: string;
  features?: string[];
  tags?: string[];
  compliance?: {
    isBgRemoved?: boolean;
    isWhiteBg?: boolean;
    complianceScore?: number;
    ondcReady?: boolean;
  };
  pricingBreakdown?: {
    materialCost?: number;
    laborHours?: number;
    fairWage?: number;
    profitMargin?: number;
  };
  syndication?: {
    ondc?: boolean;
    gem?: boolean;
    trifed?: boolean;
    b2b?: boolean;
  };
  artisan: string;
  artisanId?: mongoose.Types.ObjectId;
  rating: number;
  reviews: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema<IProduct> = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    hindiName: {
      type: String,
      trim: true,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive'],
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      trim: true,
    },
    region: {
      type: String,
      required: [true, 'Artisan region is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    hindiDescription: {
      type: String,
      default: '',
      trim: true,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    },
    originalImage: {
      type: String,
      default: '',
    },
    enhancedImage: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
    },
    compliance: {
      isBgRemoved: { type: Boolean, default: true },
      isWhiteBg: { type: Boolean, default: true },
      complianceScore: { type: Number, default: 100 },
      ondcReady: { type: Boolean, default: true },
    },
    pricingBreakdown: {
      materialCost: { type: Number, default: 0 },
      laborHours: { type: Number, default: 0 },
      fairWage: { type: Number, default: 0 },
      profitMargin: { type: Number, default: 0 },
    },
    syndication: {
      ondc: { type: Boolean, default: true },
      gem: { type: Boolean, default: true },
      trifed: { type: Boolean, default: true },
      b2b: { type: Boolean, default: true },
    },
    artisan: {
      type: String,
      default: 'Master Artisan',
      trim: true,
    },
    artisanId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      default: 10,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);

export default Product;
