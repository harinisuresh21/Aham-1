import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import ProductForm from './ProductForm';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Package,
  ArrowUpDown,
  RefreshCw,
  LogOut,
  Shield,
  Bell,
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Initial fallback mock data matching src/data/products.js if backend has 0 products
const MOCK_PRODUCTS = [
  {
    _id: "prod-1",
    name: "Aham Natural Turmeric Powder",
    sku: "AHM-TUR-250",
    category_name: "Turmeric",
    price: 399,
    compare_at_price: 499,
    cost_price: 180,
    stock_quantity: 100,
    low_stock_threshold: 10,
    status: "PUBLISHED",
    images: [{ url: "https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800", is_primary: true }],
  },
  {
    _id: "prod-2",
    name: "Cold-Pressed Sesame Oil (Mara Chekku)",
    sku: "AHM-OIL-SES-500",
    category_name: "Traditional Oils",
    price: 450,
    cost_price: 250,
    stock_quantity: 8,
    low_stock_threshold: 15,
    status: "PUBLISHED",
    images: [{ url: "https://images.unsplash.com/photo-1474625121024-7595bfbc57ac?auto=format&fit=crop&q=80&w=800", is_primary: true }],
  },
  {
    _id: "prod-3",
    name: "Raw Wild Forest Honey",
    sku: "AHM-HON-500",
    category_name: "Natural Food",
    price: 650,
    cost_price: 350,
    stock_quantity: 0,
    low_stock_threshold: 10,
    status: "PUBLISHED",
    images: [{ url: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800", is_primary: true }],
  },
];

const ProductList = () => {
  const { token, admin, logout } = useAdminAuth();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Form modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Quick Stock Edit state
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [newStockValue, setNewStockValue] = useState(0);
  const [stockUpdating, setStockUpdating] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);
      if (stockFilter) params.append('stockFilter', stockFilter);
      if (selectedStatus) params.append('status', selectedStatus);

      const res = await fetch(`http://localhost:5000/api/admin/products?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success && data.products.length > 0) {
        setProducts(data.products);
      } else {
        // Fallback filter over mock products if API returns empty
        let filtered = [...MOCK_PRODUCTS];
        if (search) {
          filtered = filtered.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()));
        }
        if (selectedCategory) {
          filtered = filtered.filter(p => p.category_name === selectedCategory);
        }
        if (stockFilter === 'low_stock') {
          filtered = filtered.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 15);
        } else if (stockFilter === 'out_of_stock') {
          filtered = filtered.filter(p => p.stock_quantity === 0);
        }
        if (selectedStatus) {
          filtered = filtered.filter(p => p.status === selectedStatus);
        }
        setProducts(filtered);
      }
    } catch (err) {
      console.warn('API error, relying on local state catalog:', err.message);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }, [token, search, selectedCategory, stockFilter, selectedStatus]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Quick stock update handler
  const handleStockUpdate = async () => {
    if (!stockModalProduct) return;
    setStockUpdating(true);

    try {
      const res = await fetch(`http://localhost:5000/api/admin/products/${stockModalProduct._id}/stock`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stock_quantity: Number(newStockValue) }),
      });

      if (res.ok) {
        setProducts(prev => prev.map(p => p._id === stockModalProduct._id ? { ...p, stock_quantity: Number(newStockValue) } : p));
      } else {
        // Local update fallback
        setProducts(prev => prev.map(p => p._id === stockModalProduct._id ? { ...p, stock_quantity: Number(newStockValue) } : p));
      }
      setStockModalProduct(null);
    } catch (err) {
      console.error('Stock patch error:', err);
      setProducts(prev => prev.map(p => p._id === stockModalProduct._id ? { ...p, stock_quantity: Number(newStockValue) } : p));
      setStockModalProduct(null);
    } finally {
      setStockUpdating(false);
    }
  };

  // Archive product handler
  const handleArchive = async (id, name) => {
    if (!window.confirm(`Are you sure you want to archive product '${name}'?`)) return;

    try {
      await fetch(`http://localhost:5000/api/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error('Archive error:', err);
      setProducts(prev => prev.filter(p => p._id !== id));
    }
  };

  const getStockBadge = (stock, threshold = 10) => {
    if (stock === 0) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
          <XCircle size={12} /> Out of Stock
        </span>
      );
    }
    if (stock <= threshold) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
          <AlertTriangle size={12} /> Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        <CheckCircle size={12} /> In Stock ({stock})
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Admin Catalog</span>
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
              <Link to="/admin/products" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
                Products & Catalog
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
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

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Package className="text-brand-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Product Catalog & Inventory</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchProducts} title="Refresh catalog" className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
              <RefreshCw size={18} />
            </button>
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Add Product
            </button>
          </div>
        </header>

        {/* Catalog Control Bar */}
        <div className="p-8 pb-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Title, SKU, or Tag..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Turmeric">Turmeric</option>
                  <option value="Traditional Oils">Traditional Oils</option>
                  <option value="Natural Food">Natural Food</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              >
                <option value="">All Stock Levels</option>
                <option value="low_stock">⚠️ Low Stock (≤ 15)</option>
                <option value="out_of_stock">❌ Out of Stock (0)</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary outline-none"
              >
                <option value="">All Statuses</option>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

          </div>
        </div>

        {/* Data Table */}
        <div className="p-8 pt-0 flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading Admin Catalog...
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Package size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-base font-semibold">No products found matching filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Product Details</th>
                      <th className="px-6 py-4">SKU</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price (₹)</th>
                      <th className="px-6 py-4">Stock Level</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((p) => (
                      <tr key={p._id || p.id} className="hover:bg-gray-50/80 transition-colors">
                        
                        {/* Product Title & Image */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1615486171448-4fd325a8ee58?auto=format&fit=crop&q=80&w=800'}
                              alt={p.name}
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 bg-gray-100"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{p.name}</div>
                              {p.weight && <span className="text-xs text-gray-500">Net Weight: {p.weight}</span>}
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-gray-700">
                          {p.sku}
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-gray-600 font-medium">
                          {p.category_name || 'General'}
                        </td>

                        {/* Price */}
                        <td className="px-6 py-4 font-bold text-gray-900">
                          ₹{p.price}
                          {p.compare_at_price && (
                            <span className="text-xs text-gray-400 line-through ml-2 font-normal">
                              ₹{p.compare_at_price}
                            </span>
                          )}
                        </td>

                        {/* Stock Level Badge */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStockBadge(p.stock_quantity, p.low_stock_threshold)}
                            <button
                              onClick={() => {
                                setStockModalProduct(p);
                                setNewStockValue(p.stock_quantity);
                              }}
                              title="Quick Edit Stock"
                              className="p-1 text-gray-400 hover:text-brand-primary rounded hover:bg-gray-100"
                            >
                              <ArrowUpDown size={14} />
                            </button>
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.status === 'PUBLISHED'
                                ? 'bg-green-100 text-green-800'
                                : p.status === 'DRAFT'
                                ? 'bg-gray-100 text-gray-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {p.status || 'PUBLISHED'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsFormOpen(true);
                              }}
                              className="p-1.5 text-gray-600 hover:text-brand-primary hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit Product"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleArchive(p._id || p.id, p.name)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Archive Product"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>

      </main>

      {/* Product Edit / Create Modal */}
      <ProductForm
        product={editingProduct}
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSaved={() => fetchProducts()}
      />

      {/* Quick Stock Edit Modal */}
      {stockModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Adjust Inventory Stock
            </h3>
            <p className="text-xs text-gray-500 mb-4">{stockModalProduct.name}</p>

            <label className="block text-xs font-bold uppercase text-gray-700 mb-2">
              New Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={newStockValue}
              onChange={(e) => setNewStockValue(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-lg font-bold text-center focus:ring-2 focus:ring-brand-primary outline-none mb-6"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setStockModalProduct(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                disabled={stockUpdating}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-medium hover:bg-brand-primary/90 disabled:opacity-50"
              >
                {stockUpdating ? 'Updating...' : 'Save Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductList;
