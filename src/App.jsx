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
import Dashboard from './admin/Dashboard';
import AdminLogin from './admin/pages/Login';
import ProductList from './admin/pages/Products/ProductList';
import CategoryList from './admin/pages/Categories/CategoryList';
import OrderList from './admin/pages/Orders/OrderList';
import CustomerList from './admin/pages/Customers/CustomerList';
import CouponList from './admin/pages/Coupons/CouponList';
import AuditLogs from './admin/pages/AuditLogs';

import { ToastProvider } from './context/ToastContext';
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
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-success" element={<OrderSuccess />} />

                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="orders/:id" element={<TrackOrder />} />
                  <Route path="track-order" element={<TrackOrder />} />

                  <Route path="about" element={<About />} />
                  {/* <Route path="contact" element={<Contact />} /> */}
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
    </ToastProvider>
  );
}

export default App;
