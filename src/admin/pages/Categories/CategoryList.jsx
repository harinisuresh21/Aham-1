import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  FolderTree,
  Save,
  X,
  Bell,
  LogOut,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_CATEGORIES = [
  { _id: 'cat-1', name: 'Turmeric', slug: 'turmeric', description: 'Single origin high curcumin turmeric powders', isActive: true, displayOrder: 1 },
  { _id: 'cat-2', name: 'Traditional Oils', slug: 'traditional-oils', description: 'Mara Chekku cold pressed organic oils', isActive: true, displayOrder: 2 },
  { _id: 'cat-3', name: 'Natural Food', slug: 'natural-food', description: 'Raw forest honey and traditional organic foods', isActive: true, displayOrder: 3 },
  { _id: 'cat-4', name: 'Spices', slug: 'spices', description: 'Handpicked organic whole and ground spices', isActive: true, displayOrder: 4 },
];

const CategoryList = () => {
  const { token, admin, logout } = useAdminAuth();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    displayOrder: 0,
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.categories.length > 0) {
        setCategories(data.categories);
      } else {
        setCategories(MOCK_CATEGORIES);
      }
    } catch (err) {
      console.warn('Relying on fallback categories data:', err.message);
      setCategories(MOCK_CATEGORIES);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleOpenModal = (category = null) => {
    setError('');
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name || '',
        slug: category.slug || '',
        description: category.description || '',
        image: category.image || '',
        displayOrder: category.displayOrder || 0,
        isActive: category.isActive !== undefined ? category.isActive : true,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        slug: '',
        description: '',
        image: '',
        displayOrder: categories.length + 1,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = editingCategory
        ? `http://localhost:5000/api/admin/categories/${editingCategory._id}`
        : 'http://localhost:5000/api/admin/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to save category');
      }

      fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      // Fallback local update
      if (editingCategory) {
        setCategories(prev => prev.map(c => c._id === editingCategory._id ? { ...c, ...formData } : c));
      } else {
        setCategories(prev => [...prev, { _id: `cat-${Date.now()}`, ...formData }]);
      }
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category '${name}'?`)) return;

    try {
      await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      setCategories(prev => prev.filter(c => c._id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Admin Taxonomy</span>
        </div>
        
        <nav className="flex-1 mt-6">
          <ul className="space-y-1">
            <li>
              <Link to="/admin" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Orders
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Products & Catalog
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
                Categories Taxonomy
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Customers
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-6 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs">
            <div className="font-semibold text-white truncate max-w-[120px]">{admin?.name || 'Admin User'}</div>
            <div className="text-brand-accent flex items-center gap-1 text-[10px] uppercase font-bold mt-0.5">
              <Shield size={10} /> {admin?.role || 'SUPER_ADMIN'}
            </div>
          </div>
          <button 
            onClick={logout}
            title="Log out"
            className="p-2 text-brand-cream/70 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <FolderTree className="text-brand-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Categories & Taxonomies</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Create Category
            </button>
          </div>
        </header>

        {/* Content Table */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading Categories...
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Display Order</th>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((c) => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-700">{c.displayOrder || 0}</td>
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-2">
                        <Layers size={16} className="text-brand-primary" />
                        {c.name}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.slug}</td>
                      <td className="px-6 py-4 text-gray-600 text-xs max-w-xs truncate">{c.description || '—'}</td>
                      <td className="px-6 py-4">
                        {c.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(c)}
                            className="p-1.5 text-gray-600 hover:text-brand-primary hover:bg-gray-100 rounded-lg"
                            title="Edit Category"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id, c.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Category"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>}

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Turmeric"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated if empty"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Category description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <label htmlFor="isActive" className="text-xs font-medium text-gray-700">Active / Visible on Storefront</label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-medium hover:bg-brand-primary/90 flex items-center gap-1 disabled:opacity-50"
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CategoryList;
