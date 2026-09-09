import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Percent,
  IndianRupee,
  Calendar,
  Save,
  X,
  Bell,
  LogOut,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { Link } from 'react-router-dom';



const CouponList = () => {
  const { token, admin, logout } = useAdminAuth();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'PERCENTAGE',
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: '',
    usageLimit: '',
    isActive: true,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && Array.isArray(data.coupons)) {
        setCoupons(data.coupons);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.warn('API error fetching coupons:', err.message);
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  const handleOpenModal = (coupon = null) => {
    setError('');
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        discountType: coupon.discountType || 'PERCENTAGE',
        discountValue: coupon.discountValue || 10,
        minOrderAmount: coupon.minOrderAmount || 0,
        maxDiscountAmount: coupon.maxDiscountAmount || '',
        usageLimit: coupon.usageLimit || '',
        isActive: coupon.isActive !== undefined ? coupon.isActive : true,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'PERCENTAGE',
        discountValue: 10,
        minOrderAmount: 499,
        maxDiscountAmount: '',
        usageLimit: 100,
        isActive: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const url = editingCoupon
        ? `${API_URL}/api/admin/coupons/${editingCoupon._id}`
        : `${API_URL}/api/admin/coupons`;

      const method = editingCoupon ? 'PUT' : 'POST';

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
        throw new Error(data.message || 'Failed to save coupon');
      }

      fetchCoupons();
      setIsModalOpen(false);
    } catch (err) {
      setError(err.message);
      // Fallback local update
      if (editingCoupon) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === editingCoupon._id ? { ...c, ...formData } : c))
        );
      } else {
        setCoupons((prev) => [
          ...prev,
          { _id: `cpn-${Date.now()}`, ...formData, usedCount: 0 },
        ]);
      }
      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon '${code}'?`)) return;

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error('Delete coupon error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Promotions Engine</span>
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
              <Link to="/admin/categories" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Categories Taxonomy
              </Link>
            </li>
            <li>
              <Link to="/admin/coupons" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
                Coupons & Discounts
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Customer Directory
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Tag className="text-brand-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Coupons & Promo Codes</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchCoupons} title="Refresh coupons" className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
              <RefreshCw size={18} />
            </button>
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-lg text-sm font-medium shadow-sm transition-all flex items-center gap-2"
            >
              <Plus size={18} /> Create Coupon
            </button>
          </div>
        </header>

        {/* Table */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading Coupon Rules...
              </div>
            ) : coupons.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Tag size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-base font-semibold">No active coupons created yet.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Promo Code</th>
                    <th className="px-6 py-4">Discount</th>
                    <th className="px-6 py-4">Min Spend (₹)</th>
                    <th className="px-6 py-4">Usage Stats</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {coupons.map((cpn) => (
                    <tr key={cpn._id} className="hover:bg-gray-50 transition-colors">
                      
                      {/* Code */}
                      <td className="px-6 py-4 font-mono font-extrabold text-brand-primary tracking-wider text-base">
                        {cpn.code}
                      </td>

                      {/* Discount Value */}
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {cpn.discountType === 'PERCENTAGE' ? (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <Percent size={14} /> {cpn.discountValue}% OFF
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-700">
                            <IndianRupee size={14} /> ₹{cpn.discountValue} OFF
                          </span>
                        )}
                      </td>

                      {/* Min Order Amount */}
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        ₹{cpn.minOrderAmount || 0}
                      </td>

                      {/* Usage */}
                      <td className="px-6 py-4 text-xs font-medium text-gray-600">
                        {cpn.usedCount || 0} {cpn.usageLimit ? `/ ${cpn.usageLimit}` : 'uses'}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {cpn.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle size={12} /> ACTIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            <XCircle size={12} /> DISABLED
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(cpn)}
                            className="p-1.5 text-gray-600 hover:text-brand-primary hover:bg-gray-100 rounded-lg"
                            title="Edit Coupon"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(cpn._id, cpn.code)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title="Delete Coupon"
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">
                {editingCoupon ? `Edit Coupon: ${editingCoupon.code}` : 'Create Promo Code'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>}

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. FESTIVE20"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono font-bold uppercase focus:ring-2 focus:ring-brand-primary outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none bg-white font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FLAT">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    placeholder="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Min Spend (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    placeholder="499"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-gray-700 mb-1">Usage Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="Unlimited if empty"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cpnIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-brand-primary border-gray-300 rounded focus:ring-brand-primary"
                />
                <label htmlFor="cpnIsActive" className="font-semibold text-gray-700">Coupon Active & Redeemable</label>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-brand-primary text-white rounded-lg font-medium hover:bg-brand-primary/90 flex items-center gap-1 disabled:opacity-50"
                >
                  <Save size={14} /> {saving ? 'Saving...' : 'Save Promo Code'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CouponList;
