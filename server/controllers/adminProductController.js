import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

// In-memory fallback product store
let inMemoryProducts = [
  {
    _id: "prod-1",
    id: "prod-1",
    name: "Aham Natural Turmeric Powder",
    slug: "aham-natural-turmeric-powder",
    sku: "AHM-TUR-250",
    category_name: "Turmeric",
    description: "Sourced directly from organic farms in Erode, this premium turmeric powder retains its natural oils and 5.2%+ high curcumin content.",
    short_description: "Pure, high-curcumin natural turmeric powder with intact essential oils.",
    price: 399,
    compare_at_price: 499,
    cost_price: 180,
    stock_quantity: 100,
    low_stock_threshold: 10,
    unit: "g",
    weight: "250g",
    status: "PUBLISHED",
    is_active: true,
    is_featured: true,
    rating: 4.8,
    reviewCount: 124,
    tags: ["100% Organic", "FSSAI Certified", "Single Origin"],
    images: [{ url: "https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800", is_primary: true }],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: "prod-2",
    id: "prod-2",
    name: "Cold-Pressed Sesame Oil (Mara Chekku)",
    slug: "cold-pressed-sesame-oil",
    sku: "AHM-OIL-SES-500",
    category_name: "Traditional Oils",
    description: "Extracted using traditional wooden churners (Mara Chekku) running below 35°C. Unrefined, unbleached, and rich in natural antioxidants.",
    short_description: "Traditional wooden cold-pressed black sesame oil.",
    price: 450,
    compare_at_price: null,
    cost_price: 250,
    stock_quantity: 8,
    low_stock_threshold: 15,
    unit: "ml",
    weight: "500ml",
    status: "PUBLISHED",
    is_active: true,
    is_featured: true,
    rating: 4.9,
    reviewCount: 89,
    tags: ["100% Organic", "Cold Pressed", "FSSAI Certified"],
    images: [{ url: "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800", is_primary: true }],
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    _id: "prod-3",
    id: "prod-3",
    name: "Raw Wild Forest Honey",
    slug: "wild-forest-honey",
    sku: "AHM-HON-500",
    category_name: "Natural Food",
    description: "Raw, unfiltered nectar gathered from deep Western Ghats forest canopies. Contains natural pollen, enzymes, and zero added sugars.",
    short_description: "Pure, raw, unfiltered multifloral forest honey.",
    price: 650,
    compare_at_price: 750,
    cost_price: 350,
    stock_quantity: 0,
    low_stock_threshold: 10,
    unit: "g",
    weight: "500g",
    status: "PUBLISHED",
    is_active: true,
    is_featured: true,
    rating: 4.9,
    reviewCount: 42,
    tags: ["100% Organic", "Raw Honey", "FSSAI Certified"],
    images: [{ url: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800", is_primary: true }],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    _id: "prod-4",
    id: "prod-4",
    name: "Organic Black Pepper",
    slug: "organic-black-pepper",
    sku: "AHM-SP-PEP-100",
    category_name: "Spices",
    description: "Sun-dried whole black peppercorns grown organically in Wayanad hills.",
    short_description: "Premium sun-dried Wayanad black pepper.",
    price: 199,
    compare_at_price: null,
    cost_price: 90,
    stock_quantity: 45,
    low_stock_threshold: 10,
    unit: "g",
    weight: "100g",
    status: "PUBLISHED",
    is_active: true,
    is_featured: false,
    rating: 4.7,
    reviewCount: 31,
    tags: ["100% Organic", "Single Origin"],
    images: [{ url: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800", is_primary: true }],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

/**
 * @desc    Get paginated admin products with search, filter, and stock alert indicators
 * @route   GET /api/admin/products
 */
export const getAdminProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const { search, status, category, stockFilter, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    if (isMongoConnected()) {
      try {
        const query = {};
        if (search) {
          query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { sku: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
          ];
        }
        if (status && status !== 'ALL') query.status = status;
        if (category && category !== 'ALL') query.category_name = category;
        if (stockFilter === 'out_of_stock') {
          query.stock_quantity = 0;
        } else if (stockFilter === 'low_stock') {
          query.stock_quantity = { $gt: 0, $lte: 15 };
        }

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const count = await Product.countDocuments(query);
        if (count > 0) {
          const products = await Product.find(query).sort(sortOptions).skip((page - 1) * limit).limit(limit);
          return res.json({
            success: true,
            total: count,
            page,
            pages: Math.ceil(count / limit),
            limit,
            products,
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Product DB Warning]: Falling back to in-memory store:', dbErr.message);
      }
    }

    // In-memory filter logic
    let filtered = [...inMemoryProducts];

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }
    if (status && status !== 'ALL') {
      filtered = filtered.filter(p => p.status === status);
    }
    if (category && category !== 'ALL') {
      filtered = filtered.filter(p => p.category_name === category);
    }
    if (stockFilter === 'out_of_stock') {
      filtered = filtered.filter(p => p.stock_quantity === 0);
    } else if (stockFilter === 'low_stock') {
      filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity <= (p.low_stock_threshold || 15));
    }

    return res.json({
      success: true,
      total: filtered.length,
      page: 1,
      pages: 1,
      limit,
      products: filtered,
    });
  } catch (error) {
    console.error('getAdminProducts error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch admin products',
      error: error.message,
    });
  }
};

/**
 * @desc    Get single product by ID
 * @route   GET /api/admin/products/:id
 */
export const getAdminProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      const product = await Product.findById(id);
      if (product) return res.json({ success: true, product });
    }

    const product = inMemoryProducts.find(p => p._id === id || p.id === id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    return res.json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Error fetching product', error: error.message });
  }
};

/**
 * @desc    Create new product
 * @route   POST /api/admin/products
 */
export const createAdminProduct = async (req, res) => {
  try {
    const {
      name,
      slug,
      sku,
      category_name,
      description,
      short_description,
      price,
      compare_at_price,
      cost_price,
      stock_quantity,
      low_stock_threshold,
      unit,
      weight,
      images,
      tags,
      status,
      is_featured,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product title and price are required' });
    }

    const formattedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const formattedSku = (sku || `AHM-${Date.now().toString().slice(-6)}`).toUpperCase();

    const newProductData = {
      name,
      slug: formattedSlug,
      sku: formattedSku,
      category_name: category_name || 'General',
      description: description || '',
      short_description: short_description || '',
      price: Number(price) || 0,
      compare_at_price: compare_at_price ? Number(compare_at_price) : null,
      cost_price: Number(cost_price) || 0,
      stock_quantity: Math.max(0, Number(stock_quantity) || 0),
      low_stock_threshold: Number(low_stock_threshold) || 10,
      unit: unit || 'g',
      weight: weight || '',
      images: images && images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800', is_primary: true }],
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
      status: status || 'PUBLISHED',
      is_active: true,
      is_featured: !!is_featured,
      createdAt: new Date().toISOString(),
    };

    if (isMongoConnected()) {
      try {
        const product = await Product.create(newProductData);
        if (req.admin) {
          await recordAuditLog({
            admin: req.admin,
            action: 'CREATE_PRODUCT',
            resource: 'PRODUCTS',
            resourceId: product._id,
            details: { name: product.name, sku: product.sku, stock: product.stock_quantity },
            req,
          });
        }
        return res.status(201).json({
          success: true,
          message: 'Product created successfully',
          product,
        });
      } catch (dbErr) {
        console.warn('⚠️ [Product DB Warning]: Save failed, falling back to in-memory store:', dbErr.message);
      }
    }

    // In-memory create
    const inMemProduct = {
      _id: `prod-${Date.now()}`,
      id: `prod-${Date.now()}`,
      ...newProductData,
    };
    inMemoryProducts.unshift(inMemProduct);

    return res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: inMemProduct,
    });
  } catch (error) {
    console.error('createAdminProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create product',
      error: error.message,
    });
  }
};

/**
 * @desc    Update product details
 * @route   PUT /api/admin/products/:id
 */
export const updateAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const product = await Product.findById(id);
        if (product) {
          Object.keys(updates).forEach((key) => {
            if (updates[key] !== undefined) product[key] = updates[key];
          });
          await product.save();
          return res.json({
            success: true,
            message: 'Product updated successfully',
            product,
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Product DB Warning]: Update failed, using in-memory store:', dbErr.message);
      }
    }

    // In-memory update
    const index = inMemoryProducts.findIndex(p => p._id === id || p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    inMemoryProducts[index] = {
      ...inMemoryProducts[index],
      ...updates,
      _id: inMemoryProducts[index]._id,
      id: inMemoryProducts[index].id,
    };

    return res.json({
      success: true,
      message: 'Product updated successfully',
      product: inMemoryProducts[index],
    });
  } catch (error) {
    console.error('updateAdminProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update product',
      error: error.message,
    });
  }
};

/**
 * @desc    Quick inline update stock quantity
 * @route   PATCH /api/admin/products/:id/stock
 */
export const updateStockQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock_quantity } = req.body;

    if (stock_quantity === undefined || isNaN(stock_quantity)) {
      return res.status(400).json({ success: false, message: 'Valid stock quantity required' });
    }

    const newStock = Math.max(0, Number(stock_quantity));

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const product = await Product.findById(id);
        if (product) {
          product.stock_quantity = newStock;
          await product.save();
          return res.json({
            success: true,
            message: `Stock updated to ${newStock} for ${product.name}`,
            product,
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Product DB Warning]: Stock update failed, using in-memory store:', dbErr.message);
      }
    }

    // In-memory stock patch
    const index = inMemoryProducts.findIndex(p => p._id === id || p.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    inMemoryProducts[index].stock_quantity = newStock;

    return res.json({
      success: true,
      message: `Stock updated to ${newStock} for ${inMemoryProducts[index].name}`,
      product: inMemoryProducts[index],
    });
  } catch (error) {
    console.error('updateStockQuantity error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update stock quantity',
      error: error.message,
    });
  }
};

/**
 * @desc    Delete/Archive product
 * @route   DELETE /api/admin/products/:id
 */
export const deleteAdminProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const product = await Product.findById(id);
        if (product) {
          product.status = 'ARCHIVED';
          product.is_active = false;
          await product.save();
          return res.json({
            success: true,
            message: `Product '${product.name}' archived successfully`,
          });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Product DB Warning]: Delete failed, using in-memory store:', dbErr.message);
      }
    }

    // In-memory delete/archive
    const index = inMemoryProducts.findIndex(p => p._id === id || p.id === id);
    if (index !== -1) {
      const name = inMemoryProducts[index].name;
      inMemoryProducts.splice(index, 1);
      return res.json({
        success: true,
        message: `Product '${name}' removed successfully`,
      });
    }

    return res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    console.error('deleteAdminProduct error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to archive product',
      error: error.message,
    });
  }
};
