import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductAPI } from '../../services/api';
import { ArrowRight, ArrowLeft } from 'lucide-react';

const SignatureProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await ProductAPI.getFeaturedProducts();
      if (res.success && res.data.length > 0) {
        setProducts(res.data);
      }
    };
    fetchProducts();
  }, []);

  const handleNext = () => {
    if (isAnimating || products.length <= 1) return;
    setIsAnimating(true);
    setAnimKey(prev => prev + 1);
    setCurrentIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500); 
  };

  const handlePrev = () => {
    if (isAnimating || products.length <= 1) return;
    setIsAnimating(true);
    setAnimKey(prev => prev + 1);
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  if (products.length === 0) {
    return (
      <section className="bg-[#F8F4EA] py-24 lg:py-[120px] min-h-[600px]"></section>
    );
  }

  const activeProduct = products[currentIndex];
  const isHeroImage = activeProduct.images[0].url.includes('hero-product');

  return (
    <section className="bg-[#F8F4EA] py-24 lg:py-[120px] overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-16 lg:mb-24 text-center lg:text-left">
          <h2 className="text-[#243D2B] font-serif text-[clamp(42px,5vw,64px)] leading-tight mb-4 tracking-tight">
            The AHAM Essentials
          </h2>
          <p className="text-[#243D2B]/70 font-sans text-lg lg:text-xl">
            Thoughtfully made for everyday rituals.
          </p>
        </div>

        {/* Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-24 items-center">
          
          {/* Left: Large Product Visual */}
          <div className="flex items-center justify-center relative w-full h-[300px] sm:h-[400px] lg:h-[560px] xl:h-[640px]">
            <div 
              key={`img-${animKey}`}
              className="absolute inset-0 flex items-center justify-center animate-product-enter"
            >
              <img 
                src={activeProduct.images[0].url} 
                alt={activeProduct.name}
                className={
                  isHeroImage 
                    ? "w-auto max-h-[85%] max-w-[85%] lg:max-w-[65%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.08)]" 
                    : "w-full h-full object-cover rounded-[2px]"
                }
              />
            </div>
          </div>

          {/* Right: Product Information */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            
            <div 
              key={`info-${animKey}`}
              className="animate-content-enter flex flex-col items-center lg:items-start"
            >
              {/* Category */}
              <span className="text-[11px] lg:text-[12px] font-bold uppercase tracking-widest text-[#71835B] mb-4">
                {activeProduct.category_id === 'cat-1' ? 'Turmeric' : activeProduct.category_id === 'cat-2' ? 'Oils' : activeProduct.category_id === 'cat-3' ? 'Honey' : 'Wellness'}
              </span>

              {/* Product Name */}
              <h3 className="font-serif text-[clamp(32px,4vw,48px)] leading-[1.05] text-[#243D2B] mb-5 lg:mb-6">
                {activeProduct.name}
              </h3>

              {/* Description */}
              <p className="text-[15px] lg:text-[16px] text-[#243D2B]/80 leading-[1.6] max-w-[420px] mb-8 font-sans">
                {activeProduct.description}
              </p>

              {/* Price */}
              <span className="text-[18px] lg:text-[20px] font-medium text-[#243D2B] mb-10 lg:mb-12">
                ₹{activeProduct.price}
              </span>

              {/* Action */}
              <Link 
                to={`/product/${activeProduct.slug}`}
                className="inline-flex items-center gap-2 text-[14px] lg:text-[15px] font-medium text-[#243D2B] hover:text-[#71835B] transition-colors border-b border-[#243D2B]/20 hover:border-[#71835B] pb-0.5 group mb-16 lg:mb-24"
              >
                View Product
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Navigation (01 / 03) */}
            <div className="flex items-center gap-6 text-[#243D2B]">
              <button 
                onClick={handlePrev}
                disabled={isAnimating || products.length <= 1}
                className="hover:text-[#71835B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Previous product"
              >
                <ArrowLeft size={20} strokeWidth={1.5} />
              </button>
              
              <span className="font-sans text-[13px] tracking-[0.2em] opacity-80">
                {String(currentIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
              </span>

              <button 
                onClick={handleNext}
                disabled={isAnimating || products.length <= 1}
                className="hover:text-[#71835B] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Next product"
              >
                <ArrowRight size={20} strokeWidth={1.5} />
              </button>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default SignatureProducts;
