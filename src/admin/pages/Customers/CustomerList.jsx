import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import {
  Users,
  Search,
  RefreshCw,
  ShoppingBag,
  IndianRupee,
  Phone,
  Mail,
  Award,
  Bell,
  LogOut,
  Shield,
  Eye,
  X,
} from 'lucide-react';
import { Link } from 'react-router-dom';



const CustomerList = () => {
  const { token, admin, logout } = useAdminAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Detail Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_URL}/api/admin/customers?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (res.ok && data.success && Array.isArray(data.customers)) {
        setCustomers(data.customers);
      } else {
        setCustomers([]);
      }
    } catch (err) {
      console.warn('API error fetching customers:', err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [token, search]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const getTierBadge = (totalSpent) => {
    if (totalSpent >= 5000) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
          <Award size={12} className="text-amber-600" /> VIP CUSTOMER
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
        REGULAR
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Customer CRM</span>
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
              <Link to="/admin/coupons" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Coupons & Discounts
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
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

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <Users className="text-brand-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Customer Directory & Insights</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchCustomers} title="Refresh directory" className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
              <RefreshCw size={18} />
            </button>
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Search Bar */}
        <div className="p-8 pb-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customers by Name or Email..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none"
              />
            </div>
            <div className="text-xs text-gray-500 font-semibold">
              Total Customers: {customers.length}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="p-8 pt-0 flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading Customer Directory...
              </div>
            ) : customers.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Users size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-base font-semibold">No customers found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Contact Info</th>
                      <th className="px-6 py-4">Orders Count</th>
                      <th className="px-6 py-4">Lifetime Spend (₹)</th>
                      <th className="px-6 py-4">Customer Tier</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customers.map((c) => (
                      <tr key={c._id || c.email} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Name */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{c.name}</div>
                          <span className="text-[10px] text-gray-400">
                            Last Order: {c.lastOrderDate ? new Date(c.lastOrderDate).toLocaleDateString() : 'Recent'}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 text-xs space-y-1">
                          <div className="flex items-center gap-1.5 text-gray-700">
                            <Mail size={12} className="text-gray-400" /> {c.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-gray-500">
                            <Phone size={12} className="text-gray-400" /> {c.phone}
                          </div>
                        </td>

                        {/* Orders Count */}
                        <td className="px-6 py-4 font-bold text-gray-800">
                          <div className="flex items-center gap-1">
                            <ShoppingBag size={14} className="text-brand-primary" /> {c.ordersCount || 1} Orders
                          </div>
                        </td>

                        {/* Total Spent */}
                        <td className="px-6 py-4 font-extrabold text-gray-900">
                          ₹{c.totalSpent || 0}
                        </td>

                        {/* Tier */}
                        <td className="px-6 py-4">
                          {getTierBadge(c.totalSpent || 0)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => setSelectedCustomer(c)}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-brand-primary hover:text-white text-gray-700 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Eye size={14} /> Profile
                          </button>
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

      {/* Customer Drawer Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-4">
              <h3 className="text-base font-bold text-gray-900">Customer Profile</h3>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-brand-cream/30 p-4 rounded-xl border border-brand-accent/20">
                <h4 className="text-base font-bold text-brand-primary">{selectedCustomer.name}</h4>
                <p className="text-gray-600 mt-1">{selectedCustomer.email}</p>
                <p className="text-gray-600">{selectedCustomer.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-gray-500 uppercase text-[10px] font-bold">Total Orders</div>
                  <div className="text-lg font-bold text-gray-900 mt-1">{selectedCustomer.ordersCount || 1}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-gray-500 uppercase text-[10px] font-bold">Lifetime Value</div>
                  <div className="text-lg font-bold text-brand-primary mt-1">₹{selectedCustomer.totalSpent || 0}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg text-xs font-medium"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerList;
