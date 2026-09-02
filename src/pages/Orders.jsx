import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { Package, ChevronRight, Truck, Clock } from 'lucide-react';

const Orders = () => {
  const orders = [
    {
      id: "AHM-10023",
      date: "Aug 15, 2026",
      total: 849,
      status: "OUT_FOR_DELIVERY",
      statusLabel: "Out for Delivery",
      items: 2,
      courier: "Blue Dart Express"
    },
    {
      id: "AHM-10018",
      date: "Jul 02, 2026",
      total: 540,
      status: "DELIVERED",
      statusLabel: "Delivered",
      items: 1,
      courier: "Delhivery"
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'OUT_FOR_DELIVERY':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'IN_TRANSIT':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'PROCESSING':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white border border-brand-border p-6 sticky top-24 shadow-sm">
              <nav className="space-y-1">
                <Link to="/profile" className="block px-4 py-3 text-brand-charcoal hover:bg-brand-cream/50 transition-colors border-l-2 border-transparent text-sm">
                  My Profile
                </Link>
                <Link to="/orders" className="block px-4 py-3 bg-brand-cream text-brand-primary font-medium border-l-2 border-brand-primary text-sm">
                  My Orders
                </Link>
                <Link to="/wishlist" className="block px-4 py-3 text-brand-charcoal hover:bg-brand-cream/50 transition-colors border-l-2 border-transparent text-sm">
                  My Wishlist
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white border border-brand-border p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-serif text-brand-primary">Order History</h2>
                  <p className="text-sm text-brand-muted mt-0.5">Track your packages and view past purchases</p>
                </div>
                <Link to="/track-order">
                  <Button size="sm" variant="outline" className="gap-1.5 text-xs">
                    <Truck size={14} /> Quick Tracker
                  </Button>
                </Link>
              </div>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div
                      key={order.id}
                      className="border border-brand-border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-primary transition-colors bg-brand-cream-light/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary flex-shrink-0">
                          <Package size={22} />
                        </div>
                        <div>
                          <p className="font-semibold text-brand-charcoal mb-0.5 text-base">Order #{order.id}</p>
                          <p className="text-xs text-brand-muted">
                            {order.date} • {order.items} {order.items > 1 ? 'items' : 'item'} • <strong className="text-brand-primary">₹{order.total}</strong>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                        <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full border ${getStatusBadgeClass(order.status)}`}>
                          {order.statusLabel || order.status}
                        </span>
                        <Link
                          to={`/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 bg-brand-primary text-white hover:bg-opacity-90 px-4 py-2 text-xs font-medium transition-colors rounded-sm shadow-sm"
                        >
                          <Truck size={14} /> Track Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-brand-muted mx-auto mb-4 opacity-50" />
                  <p className="text-lg text-brand-muted mb-6">You haven't placed any orders yet.</p>
                  <Link to="/products">
                    <Button>Start Shopping</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
};

export default Orders;
