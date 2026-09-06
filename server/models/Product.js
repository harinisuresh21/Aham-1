import mongoose from 'mongoose';

const productImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    is_primary: { type: Boolean, default: false },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, 'SKU code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    category_id: {
      type: String,
    },
    category_name: {
      type: String,
    },
    description: {
      type: String,
      default: '',
    },
    short_description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Selling price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compare_at_price: {
      type: Number,
      default: null,
    },
    cost_price: {
      type: Number,
      default: 0,
    },
    stock_quantity: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    low_stock_threshold: {
      type: Number,
      default: 10,
    },
    unit: {
      type: String,
      default: 'g',
    },
    weight: {
      type: String,
      default: '',
    },
    images: [productImageSchema],
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'PUBLISHED',
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ slug: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ status: 1, stock_quantity: 1 });
productSchema.index({ category: 1 });

export const Product = mongoose.model('Product', productSchema);
