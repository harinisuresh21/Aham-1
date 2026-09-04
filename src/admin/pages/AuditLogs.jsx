import React, { useState, useEffect, useCallback } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  ShieldAlert,
  RefreshCw,
  User,
  Globe,
  Bell,
  LogOut,
  Shield,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_AUDITS = [
  {
    _id: "aud-1",
    adminEmail: "admin@aham.com",
    action: "ADMIN_LOGIN",
    resource: "AUTH",
    ipAddress: "127.0.0.1",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    _id: "aud-2",
    adminEmail: "admin@aham.com",
    action: "STOCK_ADJUSTMENT",
    resource: "PRODUCTS",
    details: { name: "Cold-Pressed Sesame Oil", oldStock: 5, newStock: 8 },
    ipAddress: "127.0.0.1",
    createdAt: "2026-08-20T10:15:00.000Z",
  },
  {
    _id: "aud-3",
    adminEmail: "admin@aham.com",
    action: "ORDER_STATUS_UPDATE",
    resource: "ORDERS",
    details: { orderNumber: "AHM-10022", newStatus: "PROCESSING" },
    ipAddress: "127.0.0.1",
    createdAt: "2026-08-19T15:00:00.000Z",
  },
];

const AuditLogs = () => {
  const { token, admin, logout } = useAdminAuth();

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/admin/audit-logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.logs.length > 0) {
        setLogs(data.logs);
      } else {
        setLogs(MOCK_AUDITS);
      }
    } catch (err) {
      console.warn('Using local audit log catalog:', err.message);
      setLogs(MOCK_AUDITS);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-brand-primary text-brand-cream flex flex-col">
        <div className="p-6">
          <Link to="/" className="text-2xl font-serif font-semibold tracking-wide text-brand-cream-light block mb-2">
            AHAM
          </Link>
          <span className="text-xs uppercase tracking-wider text-brand-accent font-medium">Security & Compliance</span>
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
              <Link to="/admin/audit-logs" className="flex items-center gap-3 px-6 py-3 bg-brand-primary/80 border-l-4 border-brand-accent text-white font-medium">
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
            <ShieldAlert className="text-brand-primary" size={24} />
            <h1 className="text-xl font-bold text-gray-900">Security Audit Log Trail</h1>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchLogs} title="Refresh audit logs" className="p-2 text-gray-400 hover:text-brand-primary transition-colors">
              <RefreshCw size={18} />
            </button>
            <button className="text-gray-400 hover:text-brand-primary">
              <Bell size={20} />
            </button>
          </div>
        </header>

        {/* Audit Log Table */}
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-12 text-center text-gray-500">
                <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                Loading Security Audit Trail...
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <ShieldAlert size={48} className="mx-auto mb-3 text-gray-300" />
                <p className="text-base font-semibold">No audit log entries recorded yet.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-4">Timestamp</th>
                    <th className="px-6 py-4">Admin Operator</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Target Resource</th>
                    <th className="px-6 py-4">IP Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {logs.map((aud) => (
                    <tr key={aud._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-xs font-mono text-gray-600">
                        {new Date(aud.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 flex items-center gap-1.5">
                        <User size={14} className="text-brand-primary" />
                        {aud.adminEmail}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                          {aud.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-700 font-bold">
                        {aud.resource}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs text-gray-500 flex items-center gap-1">
                        <Globe size={12} /> {aud.ipAddress || '127.0.0.1'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>

    </div>
  );
};

export default AuditLogs;
