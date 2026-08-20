import React, { useEffect, useState } from 'react';
import Container from '../../components/layout/Container';
import SectionHeading from '../../components/ui/SectionHeading';
import ProductCard from '../../components/product/ProductCard';
import { ProductAPI } from '../../services/api';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await ProductAPI.getFeaturedProducts();
      if (res.success) {
        setProducts(res.data);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <Container>
        <SectionHeading 
          title="Curated for You" 
          subtitle="Our most beloved natural and traditional essentials, crafted with care."
          center
        />
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="animate-pulse flex flex-col h-[400px] bg-brand-cream/50 border border-brand-border"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};

export default FeaturedProducts;
