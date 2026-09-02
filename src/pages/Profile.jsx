import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut, 
  Truck, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Plus, 
  Edit3, 
  Trash2, 
  Phone, 
  Mail, 
  ShieldCheck,
  ChevronRight,
  Search
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { products } from '../data/products';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders'); // 'dashboard' | 'orders' | 'addresses' | 'settings'
  const [orderSearch, setOrderSearch] = useState('');

  const toast = useToast();
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();

  // User State
  const [userProfile, setUserProfile] = useState({
    name: 'Priya Sundaram',
    email: 'priya.sundaram@example.com',
    phone: '+91 98765 43210',
    joinedDate: 'January 2025',
  });

  // Orders State
  const [ordersList] = useState([
    {
      id: 'AHM-10023',
      date: 'Aug 15, 2026',
      status: 'OUT_FOR_DELIVERY',
      statusLabel: 'Out for Delivery',
      paymentMethod: 'UPI / Google Pay',
      total: 849,
      itemCount: 2,
      items: [
        { product: products[0], qty: 1, price: 399 },
        { product: products[1], qty: 1, price: 450 },
      ],
    },
    {
      id: 'AHM-10018',
      date: 'Jul 02, 2026',
      status: 'DELIVERED',
      statusLabel: 'Delivered',
      paymentMethod: 'Cash on Delivery',
      total: 540,
      itemCount: 1,
      items: [
        { product: products[1], qty: 1, price: 450 },
      ],
    },
    {
      id: 'AHM-10009',
      date: 'May 18, 2026',
      status: 'DELIVERED',
      statusLabel: 'Delivered',
      paymentMethod: 'Credit Card',
      total: 1049,
      itemCount: 3,
      items: [
        { product: products[0], qty: 1, price: 399 },
        { product: products[2], qty: 1, price: 650 },
      ],
    },
  ]);

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      tag: 'Home (Default)',
      isDefault: true,
      name: 'Priya Sundaram',
      phone: '+91 98765 43210',
      line1: 'No. 42, 3rd Cross, 100ft Road',
      line2: 'Near Defence Colony Play Ground, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    {
      id: 'addr-2',
      tag: 'Office',
      isDefault: false,
      name: 'Priya Sundaram',
      phone: '+91 98765 43210',
      line1: 'Level 4, Eco-Tower, Silicon Valley Tech Park',
      line2: 'Outer Ring Road, Bellandur',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India',
    },
  ]);

  // New Address Form State
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    tag: 'Home',
    name: userProfile.name,
    phone: userProfile.phone,
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    isDefault: false,
  });

  const getStatusBadge = (status, label) => {
    switch (status) {
      case 'DELIVERED':
        return (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 border border-green-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            <CheckCircle2 size={12} /> {label || 'Delivered'}
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full animate-pulse">
            <Truck size={12} /> {label || 'Out for Delivery'}
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 border border-blue-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            <Clock size={12} /> {label || 'Processing'}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 border border-gray-300 text-xs font-semibold px-2.5 py-1 rounded-full">
            {label || status}
          </span>
        );
    }
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    toast.success('Your profile details have been updated successfully!', 'Profile Saved');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddressForm.line1 || !newAddressForm.city || !newAddressForm.postalCode) {
      toast.error('Please fill in all mandatory address fields.', 'Incomplete Form');
      return;
    }

    const created = {
      id: `addr-${Date.now()}`,
      ...newAddressForm,
    };

    if (created.isDefault) {
      setAddresses((prev) =>
        prev.map((a) => ({ ...a, isDefault: false, tag: a.tag.replace(' (Default)', '') }))
      );
    }

    setAddresses((prev) => [created, ...prev]);
    setShowAddAddressModal(false);
    setNewAddressForm({
      tag: 'Home',
      name: userProfile.name,
      phone: userProfile.phone,
      line1: '',
      line2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India',
      isDefault: false,
    });
    toast.success('New delivery address has been saved.', 'Address Added');
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.info('Address removed from saved list.', 'Address Removed');
  };

  const handleSetDefaultAddress = (id) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
        tag: a.id === id ? `${a.tag.replace(' (Default)', '')} (Default)` : a.tag.replace(' (Default)', ''),
      }))
    );
    toast.success('Default delivery address updated.', 'Default Set');
  };

  // Filtered Orders for search
  const filteredOrders = ordersList.filter((ord) => {
    if (!orderSearch.trim()) return true;
    const q = orderSearch.toLowerCase();
    return ord.id.toLowerCase().includes(q) || ord.statusLabel.toLowerCase().includes(q);
  });

  return (
    <div className="bg-brand-cream-light py-10 lg:py-16 min-h-screen">
      <Container>
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif text-brand-primary font-bold">
            Account Dashboard
          </h1>
          <p className="text-sm text-brand-muted mt-1">
            Manage your orders, addresses, wishlist, and personal profile preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
          
          {/* 1. Left Sidebar Navigation */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-brand-border shadow-sm sticky top-24 rounded-sm overflow-hidden">
              
              {/* User Avatar Card Header */}
              <div className="p-6 bg-brand-cream/50 border-b border-brand-border text-center">
                <div className="w-16 h-16 bg-brand-primary text-white rounded-full flex items-center justify-center text-2xl font-serif font-bold mx-auto mb-3 shadow-md">
                  {userProfile.name.charAt(0)}
                </div>
                <h3 className="font-serif text-lg font-bold text-brand-primary leading-tight">
                  {userProfile.name}
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">{userProfile.email}</p>
                <div className="inline-flex items-center gap-1 text-[11px] bg-brand-primary/10 text-brand-primary font-semibold px-2.5 py-0.5 rounded-full mt-2">
                  <ShieldCheck size={12} /> Verified Member
                </div>
              </div>

              {/* Navigation Menu Links */}
              <nav className="p-3 space-y-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-colors ${
                    activeTab === 'dashboard'
                      ? 'bg-brand-primary text-white font-semibold shadow-sm'
                      : 'text-brand-charcoal hover:bg-brand-cream'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <User size={18} /> Overview
                  </span>
                  <ChevronRight size={16} className={activeTab === 'dashboard' ? 'text-white' : 'text-brand-muted'} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-brand-primary text-white font-semibold shadow-sm'
                      : 'text-brand-charcoal hover:bg-brand-cream'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Package size={18} /> Order History
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-brand-cream text-brand-primary'
                    }`}
                  >
                    {ordersList.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-colors ${
                    activeTab === 'addresses'
                      ? 'bg-brand-primary text-white font-semibold shadow-sm'
                      : 'text-brand-charcoal hover:bg-brand-cream'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <MapPin size={18} /> Saved Addresses
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      activeTab === 'addresses' ? 'bg-white/20 text-white' : 'bg-brand-cream text-brand-primary'
                    }`}
                  >
                    {addresses.length}
                  </span>
                </button>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between px-4 py-3 rounded text-sm font-medium text-brand-charcoal hover:bg-brand-cream transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <Heart size={18} className="text-red-500" /> My Wishlist
                  </span>
                  <span className="text-xs bg-brand-cream text-brand-primary px-2 py-0.5 rounded-full font-bold">
                    {wishlistCount}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded text-sm font-medium transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-brand-primary text-white font-semibold shadow-sm'
                      : 'text-brand-charcoal hover:bg-brand-cream'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Settings size={18} /> Account Settings
                  </span>
                  <ChevronRight size={16} className={activeTab === 'settings' ? 'text-white' : 'text-brand-muted'} />
                </button>
              </nav>

              {/* Sign Out Button */}
              <div className="p-4 border-t border-brand-border bg-brand-cream-light/60">
                <button
                  type="button"
                  onClick={() => toast.info('You have safely signed out of your session.', 'Signed Out')}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:text-red-800 hover:bg-red-50 py-2.5 rounded transition-colors"
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </div>
            </div>
          </aside>

          {/* 2. Main Content Area */}
          <main className="flex-1 min-w-0">
            
            {/* TAB 1: DASHBOARD / OVERVIEW */}
            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                {/* Stats Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                        Total Orders
                      </span>
                      <Package size={20} className="text-brand-primary" />
                    </div>
                    <p className="text-3xl font-serif font-bold text-brand-primary">{ordersList.length}</p>
                    <p className="text-xs text-brand-muted mt-1">Lifetime purchases</p>
                  </div>

                  <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                        Active Wishlist
                      </span>
                      <Heart size={20} className="text-red-500" />
                    </div>
                    <p className="text-3xl font-serif font-bold text-brand-primary">{wishlistCount}</p>
                    <p className="text-xs text-brand-muted mt-1">Saved natural essentials</p>
                  </div>

                  <div className="bg-white border border-brand-border p-6 shadow-sm rounded-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-brand-muted">
                        Cart Items
                      </span>
                      <Truck size={20} className="text-brand-accent" />
                    </div>
                    <p className="text-3xl font-serif font-bold text-brand-primary">{cartCount}</p>
                    <p className="text-xs text-brand-muted mt-1">Ready for checkout</p>
                  </div>
                </div>

                {/* Recent Order Preview */}
                <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-brand-primary">Latest Order</h3>
                      <p className="text-xs text-brand-muted mt-0.5">Most recent package status</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
                    >
                      View All Orders <ChevronRight size={14} />
                    </button>
                  </div>

                  {ordersList.length > 0 && (
                    <div className="border border-brand-border p-5 rounded bg-brand-cream/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-base text-brand-charcoal">
                            Order #{ordersList[0].id}
                          </span>
                          {getStatusBadge(ordersList[0].status, ordersList[0].statusLabel)}
                        </div>
                        <p className="text-xs text-brand-muted">
                          Placed on {ordersList[0].date} • {ordersList[0].itemCount} items •{' '}
                          <strong className="text-brand-primary">₹{ordersList[0].total}</strong>
                        </p>
                      </div>

                      <Link to={`/orders/${ordersList[0].id}`}>
                        <Button size="sm" variant="accent" className="gap-1.5 shadow-sm text-xs font-semibold">
                          <Truck size={14} /> Track Package
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>

                {/* Primary Default Address Preview */}
                <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                  <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold text-brand-primary">Default Delivery Address</h3>
                      <p className="text-xs text-brand-muted mt-0.5">Primary destination for your shipments</p>
                    </div>
                    <button
                      onClick={() => setActiveTab('addresses')}
                      className="text-xs font-semibold text-brand-primary hover:underline"
                    >
                      Manage Addresses
                    </button>
                  </div>

                  {addresses.length > 0 && (
                    <div className="p-5 border border-brand-border rounded bg-brand-cream-light/60">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold bg-brand-primary text-white px-2.5 py-0.5 rounded">
                          {addresses[0].tag}
                        </span>
                        <span className="font-bold text-sm text-brand-charcoal">{addresses[0].name}</span>
                      </div>
                      <p className="text-sm text-brand-charcoal/80 leading-relaxed">
                        {addresses[0].line1}, {addresses[0].line2}
                      </p>
                      <p className="text-sm text-brand-charcoal/80 font-medium">
                        {addresses[0].city}, {addresses[0].state} - {addresses[0].postalCode}, {addresses[0].country}
                      </p>
                      <p className="text-xs text-brand-muted mt-2 pt-2 border-t border-brand-border/60 flex items-center gap-1.5">
                        <Phone size={13} className="text-brand-primary" /> {addresses[0].phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY TABLE */}
            {activeTab === 'orders' && (
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border mb-6">
                  <div>
                    <h2 className="text-2xl font-serif text-brand-primary font-bold">Past Orders</h2>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Review all completed, in-transit, and past purchases
                    </p>
                  </div>

                  {/* Order Search Filter */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search by Order ID..."
                      value={orderSearch}
                      onChange={(e) => setOrderSearch(e.target.value)}
                      className="w-full border border-brand-border bg-white px-3 py-2 pl-9 text-xs text-brand-charcoal focus:outline-none focus:ring-1 focus:ring-brand-primary rounded"
                    />
                    <Search size={14} className="absolute left-3 top-2.5 text-brand-muted" />
                  </div>
                </div>

                {filteredOrders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-brand-border bg-brand-cream/50 text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                          <th className="py-3.5 px-4">Order ID</th>
                          <th className="py-3.5 px-4">Date Placed</th>
                          <th className="py-3.5 px-4">Purchased Items</th>
                          <th className="py-3.5 px-4">Payment</th>
                          <th className="py-3.5 px-4">Total Amount</th>
                          <th className="py-3.5 px-4">Status</th>
                          <th className="py-3.5 px-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border text-sm">
                        {filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-brand-cream-light/50 transition-colors">
                            <td className="py-4 px-4 font-bold text-brand-primary">
                              #{order.id}
                            </td>
                            <td className="py-4 px-4 text-brand-muted text-xs whitespace-nowrap">
                              {order.date}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2 overflow-hidden">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="inline-block w-8 h-8 rounded-full border-2 border-white bg-brand-cream overflow-hidden shadow-xs flex-shrink-0"
                                      title={item.product?.name}
                                    >
                                      {item.product?.images?.[0]?.url ? (
                                        <img
                                          src={item.product.images[0].url}
                                          alt=""
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[9px] font-bold text-brand-muted">
                                          {idx + 1}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-brand-muted">
                                  {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-xs text-brand-charcoal whitespace-nowrap">
                              {order.paymentMethod}
                            </td>
                            <td className="py-4 px-4 font-bold text-brand-charcoal whitespace-nowrap">
                              ₹{order.total}
                            </td>
                            <td className="py-4 px-4 whitespace-nowrap">
                              {getStatusBadge(order.status, order.statusLabel)}
                            </td>
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <Link
                                to={`/orders/${order.id}`}
                                className="inline-flex items-center gap-1 text-xs font-semibold bg-brand-primary text-white hover:bg-opacity-90 px-3 py-1.5 rounded transition-colors shadow-xs"
                              >
                                <Truck size={12} /> Track
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package size={36} className="text-brand-muted mx-auto mb-3 opacity-40" />
                    <p className="text-base font-semibold text-brand-charcoal">No orders found</p>
                    <p className="text-xs text-brand-muted mt-1 mb-6">
                      {orderSearch ? 'Try clearing your search keyword' : 'You haven’t placed any orders yet'}
                    </p>
                    <Link to="/products">
                      <Button size="sm">Start Shopping</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-brand-border mb-6">
                  <div>
                    <h2 className="text-2xl font-serif text-brand-primary font-bold">Saved Addresses</h2>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Manage multiple delivery locations for quick, one-click checkouts
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setShowAddAddressModal(true)}
                    className="gap-1.5 self-start sm:self-auto"
                  >
                    <Plus size={15} /> Add New Address
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`p-6 border rounded-sm relative flex flex-col justify-between transition-all ${
                        addr.isDefault
                          ? 'border-brand-primary bg-brand-cream-light/60 shadow-xs'
                          : 'border-brand-border hover:border-brand-primary/60'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span
                            className={`text-xs font-bold px-2.5 py-0.5 rounded ${
                              addr.isDefault
                                ? 'bg-brand-primary text-white'
                                : 'bg-brand-cream text-brand-charcoal border border-brand-border'
                            }`}
                          >
                            {addr.tag}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-brand-muted hover:text-red-600 p-1 transition-colors"
                              title="Delete Address"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <h4 className="font-bold text-base text-brand-charcoal mb-1">{addr.name}</h4>
                        <p className="text-xs text-brand-charcoal/80 leading-relaxed">{addr.line1}</p>
                        {addr.line2 && (
                          <p className="text-xs text-brand-charcoal/80 leading-relaxed">{addr.line2}</p>
                        )}
                        <p className="text-xs font-semibold text-brand-charcoal mt-1">
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-xs text-brand-muted mt-2 flex items-center gap-1.5">
                          <Phone size={13} className="text-brand-primary" /> {addr.phone}
                        </p>
                      </div>

                      <div className="mt-4 pt-4 border-t border-brand-border/60 flex items-center justify-between">
                        {!addr.isDefault ? (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-xs text-brand-primary font-semibold hover:underline"
                          >
                            Set as Default
                          </button>
                        ) : (
                          <span className="text-xs text-green-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 size={13} /> Active Default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: ACCOUNT SETTINGS / PERSONAL INFORMATION */}
            {activeTab === 'settings' && (
              <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm rounded-sm">
                <div className="pb-6 border-b border-brand-border mb-6">
                  <h2 className="text-2xl font-serif text-brand-primary font-bold">Personal Information</h2>
                  <p className="text-xs text-brand-muted mt-0.5">
                    Update your contact credentials and account security
                  </p>
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6 max-w-xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Input
                      label="Full Name"
                      value={userProfile.name}
                      onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number"
                      type="tel"
                      value={userProfile.phone}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                      required
                    />
                  </div>

                  <Input
                    label="Email Address"
                    type="email"
                    value={userProfile.email}
                    disabled
                    className="bg-brand-cream/50 cursor-not-allowed"
                  />
                  <p className="text-xs text-brand-muted -mt-4">
                    Email address is tied to your login authentication and cannot be altered directly.
                  </p>

                  <div className="pt-4 border-t border-brand-border">
                    <Button type="submit">Save Profile Changes</Button>
                  </div>
                </form>
              </div>
            )}

          </main>
        </div>

        {/* Add New Address Modal */}
        {showAddAddressModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
              onClick={() => setShowAddAddressModal(false)}
            ></div>

            <div className="relative bg-white border border-brand-border w-full max-w-lg p-6 sm:p-8 rounded-sm shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-2xl font-serif font-bold text-brand-primary mb-4">
                Add New Delivery Address
              </h3>

              <form onSubmit={handleAddAddress} className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Address Label (e.g. Home, Office)"
                    value={newAddressForm.tag}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, tag: e.target.value })}
                    required
                  />
                  <Input
                    label="Recipient Full Name"
                    value={newAddressForm.name}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Contact Phone"
                    type="tel"
                    value={newAddressForm.phone}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, phone: e.target.value })}
                    required
                  />
                  <Input
                    label="Postal PIN Code"
                    value={newAddressForm.postalCode}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, postalCode: e.target.value })}
                    placeholder="6 digits"
                    required
                  />
                </div>

                <Input
                  label="Street Address / Flat / Building No."
                  value={newAddressForm.line1}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, line1: e.target.value })}
                  placeholder="House No., Building, Street"
                  required
                />

                <Input
                  label="Area / Landmark (Optional)"
                  value={newAddressForm.line2}
                  onChange={(e) => setNewAddressForm({ ...newAddressForm, line2: e.target.value })}
                  placeholder="Nearby landmark or colony"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    value={newAddressForm.city}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    required
                  />
                  <Input
                    label="State"
                    value={newAddressForm.state}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, state: e.target.value })}
                    placeholder="e.g. Karnataka"
                    required
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-2 select-none">
                  <input
                    type="checkbox"
                    checked={newAddressForm.isDefault}
                    onChange={(e) => setNewAddressForm({ ...newAddressForm, isDefault: e.target.checked })}
                    className="accent-brand-primary w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-brand-charcoal">
                    Set as default delivery address
                  </span>
                </label>

                <div className="flex justify-end gap-3 pt-4 border-t border-brand-border">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddAddressModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    Save Address
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Profile;
