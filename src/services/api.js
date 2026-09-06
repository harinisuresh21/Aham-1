import { products } from '../data/products';
import { categories } from '../data/categories';
import { reviews as initialReviews } from '../data/reviews';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let dynamicReviews = [...initialReviews];

export const ProductAPI = {
  getProducts: async () => {
    await delay(300);
    return { success: true, data: products };
  },

  getProductBySlug: async (slugOrId) => {
    await delay(200);
    const product = products.find(
      (p) => p.slug === slugOrId || p.id === slugOrId
    );
    if (!product) return { success: false, message: 'Product not found' };
    return { success: true, data: product };
  },

  getProductById: async (id) => {
    await delay(200);
    const product = products.find((p) => p.id === id || p.slug === id);
    if (!product) return { success: false, message: 'Product not found' };
    return { success: true, data: product };
  },

  getFeaturedProducts: async () => {
    await delay(200);
    return { success: true, data: products.filter((p) => p.is_featured) };
  },

  getRelatedProducts: async (categoryId, currentId) => {
    await delay(200);
    const related = products
      .filter((p) => p.category_id === categoryId && p.id !== currentId)
      .slice(0, 3);
    return {
      success: true,
      data: related.length > 0 ? related : products.filter((p) => p.id !== currentId).slice(0, 3),
    };
  },
};

export const CategoryAPI = {
  getCategories: async () => {
    await delay(200);
    return { success: true, data: categories };
  },
};

export const ReviewAPI = {
  getProductReviews: async (productId) => {
    await delay(200);
    const productReviews = dynamicReviews.filter(
      (r) => r.product_id === productId || r.productId === productId
    );
    return { success: true, data: productReviews };
  },

  addReview: async (review) => {
    await delay(300);
    const newRev = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...review,
    };
    dynamicReviews.unshift(newRev);
    return { success: true, data: newRev };
  },
};
