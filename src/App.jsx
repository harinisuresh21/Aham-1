import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetails from './pages/Products/ProductDetails';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Dashboard from './admin/Dashboard';

// Mock views until actual pages are built
const PlaceholderPage = ({ title }) => (
  <div className="py-24 text-center">
    <h1 className="text-4xl font-serif text-brand-primary">{title}</h1>
    <p className="mt-4 text-brand-muted">This page is under construction.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:slug" element={<ProductDetails />} />
          <Route path="categories/:slug" element={<PlaceholderPage title="Category Details" />} />
          
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<PlaceholderPage title="Order Details" />} />
          
          <Route path="about" element={<PlaceholderPage title="Our Story" />} />
          <Route path="contact" element={<PlaceholderPage title="Contact Us" />} />
          <Route path="faq" element={<PlaceholderPage title="FAQ" />} />
        </Route>

        <Route path="/admin">
          <Route index element={<Dashboard />} />
          <Route path="products" element={<PlaceholderPage title="Admin Products" />} />
          <Route path="orders" element={<PlaceholderPage title="Admin Orders" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
