import mongoose from 'mongoose';
import { Category } from '../models/Category.js';
import { recordAuditLog } from '../middleware/adminAuthMiddleware.js';

const isMongoConnected = () => mongoose.connection.readyState === 1;

let inMemoryCategories = [
  { _id: 'cat-1', id: 'cat-1', name: 'Turmeric', slug: 'turmeric', description: 'Single origin high curcumin turmeric powders', isActive: true, displayOrder: 1 },
  { _id: 'cat-2', id: 'cat-2', name: 'Traditional Oils', slug: 'traditional-oils', description: 'Mara Chekku cold pressed organic oils', isActive: true, displayOrder: 2 },
  { _id: 'cat-3', id: 'cat-3', name: 'Natural Food', slug: 'natural-food', description: 'Raw forest honey and traditional organic foods', isActive: true, displayOrder: 3 },
  { _id: 'cat-4', id: 'cat-4', name: 'Spices', slug: 'spices', description: 'Handpicked organic whole and ground spices', isActive: true, displayOrder: 4 },
];

export const getAdminCategories = async (req, res) => {
  try {
    if (isMongoConnected()) {
      try {
        const count = await Category.countDocuments();
        if (count > 0) {
          const categories = await Category.find().sort({ displayOrder: 1, name: 1 });
          return res.json({ success: true, count: categories.length, categories });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Category DB Warning]: Fallback to in-memory categories:', dbErr.message);
      }
    }

    return res.json({ success: true, count: inMemoryCategories.length, categories: inMemoryCategories });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch categories', error: error.message });
  }
};

export const createAdminCategory = async (req, res) => {
  try {
    const { name, slug, description, image, parentCategory, displayOrder, isActive } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    const formattedSlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const newCategoryData = {
      name,
      slug: formattedSlug,
      description: description || '',
      image: image || '',
      parentCategory: parentCategory || null,
      displayOrder: Number(displayOrder) || inMemoryCategories.length + 1,
      isActive: isActive !== undefined ? isActive : true,
    };

    if (isMongoConnected()) {
      try {
        const category = await Category.create(newCategoryData);
        return res.status(201).json({ success: true, message: 'Category created successfully', category });
      } catch (dbErr) {
        console.warn('⚠️ [Category DB Warning]: Fallback to in-memory create:', dbErr.message);
      }
    }

    const inMemCat = {
      _id: `cat-${Date.now()}`,
      id: `cat-${Date.now()}`,
      ...newCategoryData,
    };
    inMemoryCategories.push(inMemCat);

    return res.status(201).json({ success: true, message: 'Category created successfully', category: inMemCat });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to create category', error: error.message });
  }
};

export const updateAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        const category = await Category.findById(id);
        if (category) {
          Object.keys(updates).forEach(k => {
            if (updates[k] !== undefined) category[k] = updates[k];
          });
          await category.save();
          return res.json({ success: true, message: 'Category updated successfully', category });
        }
      } catch (dbErr) {
        console.warn('⚠️ [Category DB Warning]: Fallback to in-memory update:', dbErr.message);
      }
    }

    const index = inMemoryCategories.findIndex(c => c._id === id || c.id === id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    inMemoryCategories[index] = { ...inMemoryCategories[index], ...updates };
    return res.json({ success: true, message: 'Category updated successfully', category: inMemoryCategories[index] });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update category', error: error.message });
  }
};

export const deleteAdminCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected() && mongoose.isValidObjectId(id)) {
      try {
        await Category.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Category deleted successfully' });
      } catch (dbErr) {
        console.warn('⚠️ [Category DB Warning]: Fallback to in-memory delete:', dbErr.message);
      }
    }

    const index = inMemoryCategories.findIndex(c => c._id === id || c.id === id);
    if (index !== -1) {
      inMemoryCategories.splice(index, 1);
      return res.json({ success: true, message: 'Category deleted successfully' });
    }

    return res.status(404).json({ success: false, message: 'Category not found' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to delete category', error: error.message });
  }
};
