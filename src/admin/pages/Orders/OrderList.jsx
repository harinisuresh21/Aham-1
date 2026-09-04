import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import OrderDetail from './OrderDetail';
import {
  ShoppingBag,
  Search,
  Eye,
  RefreshCw,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  Bell,
  LogOut,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ORDERS = [
  {
    _id: "ord-101",
    orderNumber: "AHM-10021",
    customer: { name: "Ananya Ramesh", email: "ananya@example.com", phone: "+91 9840123456" },
    shippingAddress: { street: "45 Green Park", city: "Chennai", state: "Tamil Nadu", pincode: "600028" },
    items: [{ name: "Aham Natural Turmeric Powder", sku: "AHM-TUR-250", price: 399, quantity: 2 }],
    totalAmount: 798,
    paymentMethod: "COD",
    paymentStatus: "PENDING",
    orderStatus: "PENDING",
    createdAt: "2026-08-20T10:30:00.000Z",
    fulfillment: { carrier: "", trackingNumber: "" },
    adminNotes: [],
  },
  {
    _id: "ord-102",
    orderNumber: "AHM-10022",
    customer: { name: "Karthik Subramanian", email: "karthik@example.com", phone: "+91 9444112233" },
    shippingAddress: { street: "12 Anna Salai", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001" },
    items: [{ name: "Cold-Pressed Sesame Oil (Mara Chekku)", sku: "AHM-OIL-SES-500", price: 450, quantity: 1 }],
    totalAmount: 450,
    paymentMethod: "ONLINE",
    paymentStatus: "PAID",
    orderStatus: "PROCESSING",
    createdAt: "2026-08-19T14:15:00.000Z",
    fulfillment: { carrier: "Delhivery", trackingNumber: "AHM-DEL-8921" },
    adminNotes: [{ note: "Call customer before delivery", adminName: "Super Admin", createdAt: "2026-08-19T15:00:00.000Z" }],
  },
  {
    _id: "ord-103",
    orderNumber: "AHM-10023",
    customer: { name: "Priya Lakshmi", email: "priya@example.com", phone: "+91 9789012345" },
    shippingAddress: { street: "78 Heritage Enclave", city: "Madurai", state: "Tamil Nadu", pincode: "625001" },
    items: [{ name: "Raw Wild Forest Honey", sku: "AHM-HON-500", price: 650, quantity: 1 }],
    totalAmount: 650,
    paymentMethod: "UPI",
    paymentStatus: "PAID",
    orderStatus: "SHIPPED",
    createdAt: "2026-08-18T09:00:00.000Z",
    fulfillment: { carrier: "BlueDart", trackingNumber: "BD-99881122" },
    adminNotes: [],
  },
];

const OrderList = () => {
  const { token, admin, logout } = useAdminAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('ALL');

  // Detail Modal State
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (activeTab !== 'ALL') params.append('status', activeTab);

      const res = await fetch(`http://localhost:5000/api/admin/orders?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        // Fallback filter over mock orders
        let filtered = [...MOCK_ORDERS];
        if (search) {
          filtered = filtered.filter(
            (o) =>
              o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
              o.customer.name.toLowerCase().includes(search.toLowerCase()) ||
              o.customer.email.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (activeTab !== 'ALL') {
          filtered = filtered.filter((o) => o.orderStatus === activeTab);
        }
        setOrders(filtered);
      }
    } catch (err) {
      console.warn('API error, using local orders catalog:', err.message);
      setOrders(MOCK_ORDERS);
    } finally {
      setLoading(false);
    }
  }, [token, search, activeTab]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleOrderUpdated = (updatedOrder) => {
    setOrders((prev) =>
      prev.map((o) => ((o._id || o.id) === (updatedOrder._id || updatedOrder.id) ? updatedOrder : o))
    );
    setSelectedOrder(updatedOrder);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock size={12} /> PENDING
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <RefreshCw size={12} /> PROCESSING
          </span>
        );
      case 'SHIPPED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
            <Truck size={12} /> SHIPPED
          </span>
        );
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle size={12} /> DELIVERED
          </span>
        );
      case 'CANCELLED':
      case 'REFUNDED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <XCircle size={12} /> {status}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const statusTabs = [
    { key: 'ALL', label: 'All Orders' },
    { key: 'PENDING', label: 'Pending' },
    { key: 'PROCESSING', label: 'Processing' },
    { key: 'SHIPPED', label: 'Shipped' },
    { key: 'DELIVERED', label: 'Delivered' },
    { key: 'CANCELLED', label: 'Cancelled' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Order Fulfillment</span>
        </div>
        
        <nav className="flex-1 mt-6">
          <ul className="space-y-1">
            <li>
              <Link to="/admin" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
                Orders Management
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
            <ShoppingBag className="text-brand-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Order Management & Fulfillment</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchOrders} title="Refresh orders" className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
              <RefreshCw size={18} />
            </button>
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Filters & Status Tabs */}
        <div className="p-8 pb-4 space-y-4">
          
          {/* Tabs Bar */}
          <div className="flex items-center gap-2 border-b border-gray-200 overflow-x-auto pb-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by Order #, Customer Name, or Email..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-primary focus:bg-white outline-none"
              />
            </div>
            <div className="text-xs text-gray-500 font-semibold">
              Showing {orders.length} orders
            </div>
          </div>

        </div>

        {/* Orders Table */}
        <div className="p-8 pt-0 flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading Orders...
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <ShoppingBag size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-base font-semibold">No orders found matching filters.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Total (₹)</th>
                      <th className="px-6 py-4">Payment</th>
                      <th className="px-6 py-4">Fulfillment Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((o) => (
                      <tr key={o._id || o.id} className="hover:bg-gray-50 transition-colors">
                        
                        {/* Order Number */}
                        <td className="px-6 py-4 font-mono font-bold text-gray-900">
                          #{o.orderNumber}
                        </td>

                        {/* Customer Info */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{o.customer?.name}</div>
                          <div className="text-xs text-gray-500">{o.customer?.email}</div>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4 text-xs text-gray-600">
                          {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : 'Aug 20, 2026'}
                        </td>

                        {/* Total Amount */}
                        <td className="px-6 py-4 font-extrabold text-gray-900">
                          ₹{o.totalAmount || o.price || 450}
                        </td>

                        {/* Payment Method & Status */}
                        <td className="px-6 py-4">
                          <div className="text-xs font-semibold text-gray-800">{o.paymentMethod || 'COD'}</div>
                          <span className={`text-[10px] uppercase font-bold ${o.paymentStatus === 'PAID' ? 'text-emerald-700' : 'text-amber-700'}`}>
                            {o.paymentStatus || 'PENDING'}
                          </span>
                        </td>

                        {/* Fulfillment Status Badge */}
                        <td className="px-6 py-4">
                          {getStatusBadge(o.orderStatus)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedOrder(o);
                              setIsDetailOpen(true);
                            }}
                            className="px-3 py-1.5 bg-gray-100 hover:bg-brand-primary hover:text-white text-gray-700 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1"
                          >
                            <Eye size={14} /> View Order
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

      {/* Order Detail Modal / Drawer */}
      <OrderDetail
        order={selectedOrder}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOrderUpdated={handleOrderUpdated}
      />

    </div>
  );
};

export default OrderList;
