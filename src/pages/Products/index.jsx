import React, { useState, useEffect } from 'react';
import Container from '../../components/layout/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import ProductCard from '../../components/product/ProductCard';
import Button from '../../components/ui/Button';
import { ProductAPI } from '../../services/api';
import { Search, SlidersHorizontal } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await ProductAPI.getProducts();
      if (res.success) {
        setProducts(res.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <div className="bg-white py-12 lg:py-20">
      <Container>
        <SectionHeading 
          title="All Products" 
          subtitle="Discover our complete collection of natural wellness essentials."
        />
        
        <div className="flex flex-col md:flex-row gap-8 mb-10 items-center justify-between border-b border-brand-border pb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="flex items-center gap-2 text-sm font-medium border border-brand-border px-4 py-2 hover:bg-brand-cream transition-colors">
              <SlidersHorizontal size={16} />
              Filter
            </button>
            <select className="text-sm font-medium border border-brand-border px-4 py-2 bg-transparent hover:bg-brand-cream transition-colors focus:outline-none">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest</option>
            </select>
          </div>
          
          <div className="relative w-full md:w-64">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full border border-brand-border px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-brand-muted" />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
              <div key={n} className="animate-pulse flex flex-col h-[400px] bg-brand-cream/50 border border-brand-border"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-lg text-brand-muted">No products found.</p>
          </div>
        )}
        
        <div className="mt-16 text-center">
          <Button variant="outline">Load More</Button>
        </div>
      </Container>
    </div>
  );
};

export default Products;
