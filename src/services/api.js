import { products } from '../data/products';
import { categories } from '../data/categories';
import { reviews as initialReviews } from '../data/reviews';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let dynamicReviews = [...initialReviews];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const ProductAPI = {
  getProducts: async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/products`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.products) && data.products.length > 0) {
        return { success: true, data: data.products };
      }
    } catch (e) {
      console.warn('API getProducts fallback:', e.message);
    }
    return { success: true, data: products };
  },

  getProductBySlug: async (slugOrId) => {
    const res = await ProductAPI.getProducts();
    const list = res.data || products;
    const product = list.find(
      (p) => p.slug === slugOrId || p._id === slugOrId || p.id === slugOrId
    );
    if (!product) return { success: false, message: 'Product not found' };
    return { success: true, data: product };
  },

  getProductById: async (id) => {
    const res = await ProductAPI.getProducts();
    const list = res.data || products;
    const product = list.find((p) => p._id === id || p.id === id || p.slug === id);
    if (!product) return { success: false, message: 'Product not found' };
    return { success: true, data: product };
  },

  getFeaturedProducts: async () => {
    const res = await ProductAPI.getProducts();
    const list = res.data || products;
    return { success: true, data: list.filter((p) => p.is_featured) };
  },

  getRelatedProducts: async (categoryId, currentId) => {
    const res = await ProductAPI.getProducts();
    const list = res.data || products;
    const related = list
      .filter(
        (p) =>
          (p.category_id === categoryId || p.category_name === categoryId) &&
          p._id !== currentId &&
          p.id !== currentId
      )
      .slice(0, 3);
    return {
      success: true,
      data: related.length > 0 ? related : list.filter((p) => p._id !== currentId && p.id !== currentId).slice(0, 3),
    };
  },
};

export const CategoryAPI = {
  getCategories: async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/categories`);
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.categories) && data.categories.length > 0) {
        return { success: true, data: data.categories };
      }
    } catch (e) {
      console.warn('API getCategories fallback:', e.message);
    }
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
