import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Truck,
  User,
  MapPin,
  Clock,
  MessageSquare,
  IndianRupee,
  CheckCircle,
  AlertCircle,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { orderService } from '../../../services/orderService';

const OrderDetail = ({ order, isOpen, onClose, onOrderUpdated }) => {
  const { token } = useAdminAuth();

  const [selectedStatus, setSelectedStatus] = useState(order?.orderStatus || 'PENDING');
  const [statusNote, setStatusNote] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Fulfillment state
  const [carrier, setCarrier] = useState(order?.fulfillment?.carrier || 'Delhivery');
  const [trackingNumber, setTrackingNumber] = useState(order?.fulfillment?.trackingNumber || '');
  const [trackingUrl, setTrackingUrl] = useState(order?.fulfillment?.trackingUrl || '');
  const [updatingFulfillment, setUpdatingFulfillment] = useState(false);

  // Admin notes state
  const [newAdminNote, setNewAdminNote] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !order) return null;

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    setError('');
    setSuccessMsg('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${order._id || order.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: selectedStatus, note: statusNote }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update order status');
      }

      setSuccessMsg(`Order status updated to ${selectedStatus}`);
      orderService.updateOrderStatusLocal(order.orderNumber || order.id, selectedStatus, order.customer?.email, order.fulfillment);
      onOrderUpdated(data.order);
    } catch (err) {
      setError(err.message);
      // Fallback local update
      orderService.updateOrderStatusLocal(order.orderNumber || order.id, selectedStatus, order.customer?.email, order.fulfillment);
      onOrderUpdated({ ...order, orderStatus: selectedStatus });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleFulfillmentUpdate = async (e) => {
    e.preventDefault();
    setUpdatingFulfillment(true);
    setError('');
    setSuccessMsg('');

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${order._id || order.id}/fulfillment`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ carrier, trackingNumber, trackingUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update tracking');
      }

      setSuccessMsg('Carrier tracking details updated');
      onOrderUpdated(data.order);
    } catch (err) {
      setError(err.message);
      onOrderUpdated({
        ...order,
        fulfillment: { carrier, trackingNumber, trackingUrl },
      });
    } finally {
      setUpdatingFulfillment(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newAdminNote.trim()) return;
    setAddingNote(true);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const res = await fetch(`${API_URL}/api/admin/orders/${order._id || order.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ note: newAdminNote }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setNewAdminNote('');
        onOrderUpdated(data.order);
      }
    } catch (err) {
      console.error('Note add error:', err);
    } finally {
      setAddingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-200">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-brand-primary" size={22} />
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Order #{order.orderNumber || order.id}
              </h2>
              <span className="text-xs text-gray-500">
                Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'Aug 20, 2026'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg text-xs flex items-center gap-2">
              <CheckCircle size={16} /> {successMsg}
            </div>
          )}

          {/* Grid Layout: Customer & Status Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Customer Details */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                <User size={16} className="text-brand-primary" /> Customer Info
              </div>
              <div className="font-semibold text-gray-900">{order.customer?.name || 'Customer'}</div>
              <div className="text-xs text-gray-600">{order.customer?.email || 'customer@example.com'}</div>
              <div className="text-xs text-gray-600">{order.customer?.phone || '+91 9876543210'}</div>
            </div>

            {/* Shipping Address */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                <MapPin size={16} className="text-brand-primary" /> Shipping Address
              </div>
              <div className="text-xs text-gray-700 leading-relaxed">
                {order.shippingAddress?.street || '123 Organic Way'},<br />
                {order.shippingAddress?.city || 'Erode'}, {order.shippingAddress?.state || 'Tamil Nadu'} - {order.shippingAddress?.pincode || '638001'}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="font-bold text-gray-800 flex items-center gap-2 mb-2">
                <IndianRupee size={16} className="text-brand-primary" /> Payment Summary
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Method:</span>
                <span className="font-bold text-gray-800">{order.paymentMethod || 'COD'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500">Payment Status:</span>
                <span className="font-bold text-emerald-700">{order.paymentStatus || 'PENDING'}</span>
              </div>
              <div className="flex justify-between text-xs pt-1 border-t border-gray-200">
                <span className="text-gray-700 font-semibold">Total Amount:</span>
                <span className="font-extrabold text-gray-900 text-base">₹{order.totalAmount || order.price || 450}</span>
              </div>
            </div>

          </div>

          {/* Line Items Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 font-bold text-gray-800 border-b border-gray-200">
              Ordered Items
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50/50 text-gray-500 uppercase">
                <tr>
                  <th className="px-4 py-2">Item</th>
                  <th className="px-4 py-2">Price</th>
                  <th className="px-4 py-2">Qty</th>
                  <th className="px-4 py-2 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {(order.items && order.items.length > 0 ? order.items : [
                  { name: 'Aham Natural Turmeric Powder', price: 399, quantity: 1, sku: 'AHM-TUR-250' }
                ]).map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {item.name}
                      {item.sku && <span className="block text-[10px] text-gray-400 font-mono">SKU: {item.sku}</span>}
                    </td>
                    <td className="px-4 py-3">₹{item.price}</td>
                    <td className="px-4 py-3 font-semibold">{item.quantity}</td>
                    <td className="px-4 py-3 text-right font-bold">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fulfillment & Status Transition Forms */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Status Transition Control */}
            <form onSubmit={handleStatusUpdate} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="font-bold text-gray-800 flex items-center gap-2">
                <Clock size={16} className="text-brand-primary" /> Update Order Status
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Status State Machine</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                >
                  <option value="PENDING">PENDING (Awaiting Processing)</option>
                  <option value="PROCESSING">PROCESSING (Packing Item)</option>
                  <option value="SHIPPED">SHIPPED (Handed to Courier)</option>
                  <option value="DELIVERED">DELIVERED (Completed)</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Optional status transition remark..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="w-full py-2 bg-brand-primary text-white text-xs font-medium rounded-lg hover:bg-brand-primary/90 transition disabled:opacity-50"
              >
                {updatingStatus ? 'Updating Status...' : 'Apply Status Change'}
              </button>
            </form>

            {/* Courier Fulfillment Info */}
            <form onSubmit={handleFulfillmentUpdate} className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
              <div className="font-bold text-gray-800 flex items-center gap-2">
                <Truck size={16} className="text-brand-primary" /> Logistics & Courier Tracking
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    placeholder="Delhivery, BlueDart, XpressBees"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Tracking Number</label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="e.g. AHM-AWB-98712"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary outline-none bg-white font-mono"
                  />
                </div>
              </div>

              <div>
                <input
                  type="url"
                  value={trackingUrl}
                  onChange={(e) => setTrackingUrl(e.target.value)}
                  placeholder="https://track.delhivery.com/..."
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                />
              </div>

              <button
                type="submit"
                disabled={updatingFulfillment}
                className="w-full py-2 bg-gray-800 text-white text-xs font-medium rounded-lg hover:bg-gray-900 transition disabled:opacity-50 flex items-center justify-center gap-1"
              >
                <ExternalLink size={12} />
                {updatingFulfillment ? 'Saving Tracking...' : 'Save Logistics Tracking'}
              </button>
            </form>

          </div>

          {/* Internal Admin Notes */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <div className="font-bold text-gray-800 flex items-center gap-2">
              <MessageSquare size={16} className="text-brand-primary" /> Internal Admin Notes
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={newAdminNote}
                onChange={(e) => setNewAdminNote(e.target.value)}
                placeholder="Add private staff note (e.g. Customer requested gift wrapping)..."
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-brand-primary outline-none bg-white"
              />
              <button
                type="submit"
                disabled={addingNote || !newAdminNote.trim()}
                className="px-4 py-1.5 bg-brand-primary text-white text-xs font-medium rounded-lg hover:bg-brand-primary/90 disabled:opacity-50 flex items-center gap-1"
              >
                <Send size={12} /> Add Note
              </button>
            </form>

            <div className="space-y-2 max-h-32 overflow-y-auto pt-2">
              {(order.adminNotes || []).map((n, i) => (
                <div key={i} className="p-2 bg-white rounded-lg border border-gray-200 text-xs">
                  <div className="flex justify-between font-semibold text-gray-700 mb-0.5">
                    <span>{n.adminName}</span>
                    <span className="text-[10px] text-gray-400">{new Date(n.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-gray-600">{n.note}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;
