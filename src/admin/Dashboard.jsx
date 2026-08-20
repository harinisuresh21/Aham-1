import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Package, ShoppingBag, IndianRupee, Bell } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: "Total Orders", value: "1,240", icon: <ShoppingBag /> },
    { label: "Total Revenue (COD)", value: "₹4.5L", icon: <IndianRupee /> },
    { label: "Total Customers", value: "890", icon: <Users /> },
    { label: "Low Stock Products", value: "12", icon: <Package />, alert: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Admin Panel</span>
        </div>
        
        <nav className="flex-1 mt-6">
          <ul className="space-y-1">
            <li>
              <Link to="/admin" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white">
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
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="flex items-center gap-3 px-6 py-3 text-brand-cream/70 hover:bg-brand-primary/80 hover:text-white transition-colors border-l-4 border-transparent">
                Customers
              </Link>
            </li>
          </ul>
        </nav>
        
        <div className="p-6 border-t border-white/10">
          <button className="text-sm text-brand-cream/70 hover:text-white flex items-center gap-2">
            Log out
          </button>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-medium text-gray-800">Dashboard Overview</h1>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 bg-brand-primary rounded-full text-white flex items-center justify-center text-sm font-medium">
              A
            </div>
          </div>
        </header>
        
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-md ${stat.alert ? 'bg-red-50 text-red-600' : 'bg-brand-cream text-brand-primary'}`}>
                    {stat.icon}
                  </div>
                </div>
                <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            ))}
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-medium text-gray-900">Recent Orders (COD)</h2>
              <Link to="/admin/orders" className="text-sm text-brand-primary hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-6 py-3 font-medium">Order ID</th>
                    <th className="px-6 py-3 font-medium">Customer</th>
                    <th className="px-6 py-3 font-medium">Date</th>
                    <th className="px-6 py-3 font-medium">Amount</th>
                    <th className="px-6 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {[1,2,3,4,5].map(i => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">#AHM-1002{i}</td>
                      <td className="px-6 py-4 text-gray-600">User {i}</td>
                      <td className="px-6 py-4 text-gray-600">Aug 20, 2026</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">₹{450 * i}</td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
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
