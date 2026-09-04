import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Package,
  ShoppingBag,
  IndianRupee,
  Bell,
  LogOut,
  Shield,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useAdminAuth } from './context/AdminAuthContext';

const Dashboard = () => {
  const { admin, token, logout } = useAdminAuth();

  const [metrics, setMetrics] = useState({
    totalOrders: 1240,
    totalRevenue: 450000,
    totalCustomers: 890,
    lowStockCount: 12,
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!token) return;
      try {
        const res = await fetch('http://localhost:5000/api/admin/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.success && data.metrics) {
          setMetrics((prev) => ({
            ...prev,
            totalOrders: data.metrics.totalOrders || prev.totalOrders,
            totalRevenue: data.metrics.totalRevenue || prev.totalRevenue,
            lowStockCount: data.metrics.lowStockCount || prev.lowStockCount,
          }));
        }
      } catch (err) {
        console.warn('Using fallback analytics dashboard metrics:', err.message);
      }
    };

    fetchAnalytics();
  }, [token]);

  const stats = [
    { label: "Total Orders", value: metrics.totalOrders.toLocaleString(), icon: <ShoppingBag /> },
    { label: "Total Revenue (COD & Online)", value: `₹${(metrics.totalRevenue / 100000).toFixed(1)}L`, icon: <IndianRupee /> },
    { label: "Total Customers", value: metrics.totalCustomers.toLocaleString(), icon: <Users /> },
    { label: "Low Stock Alert Products", value: metrics.lowStockCount.toString(), icon: <Package />, alert: metrics.lowStockCount > 0 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Executive Admin</span>
        </div>
        
        <nav className="flex-1 mt-6">
          <ul className="space-y-1">
            <li>
              <Link to="/admin" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
                Dashboard Overview
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Orders & Fulfillment
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Products & Inventory
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Category Taxonomy
              </Link>
            </li>
            <li>
              <Link to="/admin/coupons" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Coupons & Discounts
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Customer Directory
              </Link>
            </li>
            <li>
              <Link to="/admin/audit-logs" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Security Audit Logs
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
            title="Log out of Admin Panel"
            className="p-2 text-brand-cream/70 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-gray-800">Executive Control Center</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
            <div className="w-9 h-9 bg-brand-primary text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
              {admin?.name ? admin.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto space-y-8">
          
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.alert ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-brand-cream text-brand-primary'}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-gray-900">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Quick Module Access Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/admin/orders" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-primary transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                  <ShoppingBag size={20} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Order Fulfillment</h4>
              <p className="text-xs text-gray-500 mt-1">Manage order statuses, courier tracking links, and customer remarks.</p>
            </Link>

            <Link to="/admin/products" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-primary transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                  <Package size={20} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Product & Inventory</h4>
              <p className="text-xs text-gray-500 mt-1">Manage product catalog, quick stock adjustments, and SKU pricing.</p>
            </Link>

            <Link to="/admin/coupons" className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:border-brand-primary transition-all group">
              <div className="flex items-center justify-between mb-2">
                <div className="p-3 bg-purple-50 text-purple-700 rounded-lg">
                  <Tag size={20} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
              <h4 className="font-bold text-gray-900 text-base">Promotions Engine</h4>
              <p className="text-xs text-gray-500 mt-1">Configure discount codes, percentage rules, and usage limits.</p>
            </Link>
          </div>
          
          {/* Recent Orders Overview */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-bold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1">
                View All Orders <ArrowRight size={14} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-gray-900">#AHM-1002{i}</td>
                      <td className="px-6 py-4 text-gray-700 font-medium">Customer {i}</td>
                      <td className="px-6 py-4 text-gray-500 text-xs">Aug 20, 2026</td>
                      <td className="px-6 py-4 text-gray-900 font-extrabold">₹{450 * i}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-200">
                          PENDING
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default Dashboard;
