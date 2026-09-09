import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import TrackOrder from './pages/TrackOrder';
import OrderSuccess from './pages/OrderSuccess';
import About from './pages/About';
import Contact from './pages/Contact';
import Invoice from './pages/Invoice';
import Dashboard from './admin/Dashboard';
import AdminLogin from './admin/pages/Login';
import ProductList from './admin/pages/Products/ProductList';
import CategoryList from './admin/pages/Categories/CategoryList';
import OrderList from './admin/pages/Orders/OrderList';
import CustomerList from './admin/pages/Customers/CustomerList';
import CouponList from './admin/pages/Coupons/CouponList';
import AuditLogs from './admin/pages/AuditLogs';

import ProtectedRoute from './components/auth/ProtectedRoute';

import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import AdminProtectedRoute from './admin/components/AdminProtectedRoute';

// Mock views until actual pages are built
const PlaceholderPage = ({ title }) => (
  <div className="py-24 text-center">
    <h1 className="text-4xl font-serif text-brand-primary">{title}</h1>
    <p className="mt-4 text-brand-muted">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AdminAuthProvider>
              <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:slug" element={<ProductDetails />} />
                  <Route path="product/:id" element={<ProductDetails />} />
                  <Route path="categories/:slug" element={<PlaceholderPage title="Category Details" />} />

                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  
                  {/* Customer Protected Routes */}
                  <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                  <Route path="order-success" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
                  <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                  <Route path="orders/:id" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />
                  <Route path="track-order" element={<ProtectedRoute><TrackOrder /></ProtectedRoute>} />

                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="orders/:id/invoice" element={<Invoice />} />
                  <Route path="invoice/:id" element={<Invoice />} />
                  <Route path="invoice" element={<Invoice />} />

                  <Route path="about" element={<About />} />
                  <Route path="our-story" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="faq" element={<PlaceholderPage title="FAQ" />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                
                <Route path="/admin" element={<AdminProtectedRoute />}>
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<ProductList />} />
                  <Route path="categories" element={<CategoryList />} />
                  <Route path="orders" element={<OrderList />} />
                  <Route path="coupons" element={<CouponList />} />
                  <Route path="users" element={<CustomerList />} />
                  <Route path="audit-logs" element={<AuditLogs />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AdminAuthProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </ToastProvider>
  );
}

export default App;