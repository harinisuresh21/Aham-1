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

import { ToastProvider } from './context/ToastContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

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

              <Route path="/admin">
                <Route index element={<Dashboard />} />
                <Route path="products" element={<PlaceholderPage title="Admin Products" />} />
                <Route path="orders" element={<PlaceholderPage title="Admin Orders" />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </ToastProvider>
  );
}

export default App;
