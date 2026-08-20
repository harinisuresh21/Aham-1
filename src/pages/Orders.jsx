import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Package, ChevronRight } from 'lucide-react';

const Orders = () => {
  const orders = [
    {
      id: "AHM-10023",
      date: "Aug 15, 2026",
      total: 1299,
      status: "DELIVERED",
      items: 3
    },
    {
      id: "AHM-10018",
      date: "Jul 02, 2026",
      total: 450,
      status: "DELIVERED",
      items: 1
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-brand-cream-light py-12 lg:py-20 min-h-[calc(100vh-80px)]">
      <Container>
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Sidebar */}
          <div className="w-full lg:w-1/4">
            <div className="bg-white border border-brand-border p-6 sticky top-24">
              <nav className="space-y-1">
                <Link to="/profile" className="block px-4 py-3 text-brand-charcoal hover:bg-brand-cream/50 transition-colors border-l-2 border-transparent">
                  My Profile
                </Link>
                <Link to="/orders" className="block px-4 py-3 bg-brand-cream text-brand-primary font-medium border-l-2 border-brand-primary">
                  My Orders
                </Link>
                <Link to="#" className="block px-4 py-3 text-brand-charcoal hover:bg-brand-cream/50 transition-colors border-l-2 border-transparent">
                  Addresses
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4">
            
            <div className="bg-white border border-brand-border p-8">
              <h2 className="text-2xl font-serif text-brand-primary mb-6">Order History</h2>
              
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="border border-brand-border p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-primary transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-brand-cream rounded-full flex items-center justify-center text-brand-primary">
                          <Package size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-brand-charcoal mb-1">Order #{order.id}</p>
                          <p className="text-sm text-brand-muted">{order.date} • {order.items} {order.items > 1 ? 'items' : 'item'} • ₹{order.total}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                        <span className={`px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-full border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <Link to={`/orders/${order.id}`} className="text-brand-primary hover:text-brand-accent transition-colors flex items-center gap-1 text-sm font-medium">
                          View Details <ChevronRight size={16} />
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
