import { products } from '../data/products';
import { categories } from '../data/categories';
import { reviews } from '../data/reviews';

// This is a mock API service layer.
// Later, Developer 2 & 3 will replace these with real Axios/Fetch calls to FastAPI.

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const ProductAPI = {
  getProducts: async () => {
    await delay(500); // Simulate network latency
    return { success: true, data: products };
  },
  
  getProductBySlug: async (slug) => {
    await delay(300);
    const product = products.find(p => p.slug === slug);
    if (!product) return { success: false, message: "Product not found" };
    return { success: true, data: product };
  },

  getFeaturedProducts: async () => {
    await delay(300);
    return { success: true, data: products.filter(p => p.is_featured) };
  }
};

export const CategoryAPI = {
  getCategories: async () => {
    await delay(300);
    return { success: true, data: categories };
  }
};

export const ReviewAPI = {
  getProductReviews: async (productId) => {
    await delay(300);
    return { success: true, data: reviews.filter(r => r.product_id === productId) };
  }
};
