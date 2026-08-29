import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductAPI } from '../../services/api';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import desktopBg from '../../assets/section2-background-desktop.png';
import mobileBg from '../../assets/section2-background-mobile.png';
import product1Img from '../../assets/section2-product1.png';
import product2Img from '../../assets/section2-product2.png';
import product3Img from '../../assets/section2-product3.png';

// Visual tuning per product to ensure they occupy the same perceived space in the fixed stage.
const PRODUCT_CONFIG = {
  'prod-1': {
    image: product1Img,
    style: { transform: 'scale(1.05) translateY(5%)' }
  },
  'prod-2': {
    image: product2Img,
    style: { transform: 'scale(1.0) translateY(2%)' }
  },
  'prod-4': { 
    image: product3Img,
    style: { transform: 'scale(0.95) translateY(0%)' }
  }
};

const SignatureProducts = () => {
  const [products, setProducts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await ProductAPI.getFeaturedProducts();
      if (res.success && res.data.length > 0) {
        const featured = res.data.slice(0, 3).map(prod => {
          const config = PRODUCT_CONFIG[prod.id];
          return {
            ...prod,
            displayImage: config ? config.image : prod.images[0]?.url,
            customStyle: config ? config.style : { transform: 'scale(1) translateY(0)' }
          };
        });
        setProducts(featured);
      }
    };
    fetchProducts();
  }, []);

  const changeProduct = (direction) => {
    if (products.length <= 1) return;
    setCurrentIndex((prev) => {
      if (direction === 'next') return (prev + 1) % products.length;
      return (prev - 1 + products.length) % products.length;
    });
  };

  if (products.length === 0) {
    return <section className="py-24 lg:py-32 min-h-[560px] bg-[#F8F4EA]"></section>;
  }

  const activeProduct = products[currentIndex];

  return (
    <section className="relative w-full overflow-hidden flex flex-col justify-center min-h-[auto] py-12 lg:py-0 lg:h-[600px] xl:h-[640px]">
      
      {/* Background Images with subtle animation on product change */}
      <div className="absolute inset-0 z-0">
        <img 
          key={`desktop-${currentIndex}`}
          src={desktopBg} 
          className="hidden lg:block w-full h-full object-cover object-[center_35%]" 
          alt="AHAM Background" 
        />
        <img 
          key={`mobile-${currentIndex}`}
          src={mobileBg} 
          className="block lg:hidden w-full h-full object-cover object-bottom" 
          alt="AHAM Background" 
        />
      </div>
      
      {/* Content Container - Reduced max-width and adjusted padding to pull content away from edges/leaves */}
      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col items-center h-full">
        
        {/* Layout: Desktop 3-part / Tablet 2-row / Mobile Stack */}
        <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between w-full h-full gap-8 lg:gap-4 xl:gap-8 lg:pb-12 xl:pb-16">
          
          {/* LEFT COLUMN: Fixed Brand Story */}
          <div className="flex flex-col w-full lg:w-[280px] xl:w-[320px] shrink-0 pt-4 lg:pt-0 lg:pb-8 xl:pb-10 z-20">
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#71845C]">
                THE AHAM ESSENTIALS
              </span>
            </div>
            
            <h2 className="font-serif leading-[1.05] text-[#243D2B] mb-4 tracking-tight text-[34px] sm:text-[40px] lg:text-[42px] xl:text-[48px]">
              <span className="block">A Ritual of Purity.</span>
              <span className="block">A Touch of Tradition.</span>
            </h2>
            
            <p className="text-[14px] lg:text-[15px] leading-[1.6] text-[#243D2B]/80 font-sans max-w-[400px] lg:max-w-none">
              Thoughtfully made for everyday rituals. Discover our signature wellness products, crafted with natural ingredients and time-honored traditions.
            </p>
          </div>
          
          {/* CENTER COLUMN: Fixed Product Stage */}
          <div className="flex justify-center items-end shrink-0 relative w-full max-w-[320px] h-[320px] sm:max-w-[420px] sm:h-[420px] lg:max-w-[440px] lg:h-[460px] xl:max-w-[500px] xl:h-[500px] z-10">
            <div className="absolute inset-0 flex items-end justify-center">
               <img 
                 src={activeProduct.displayImage} 
                 alt={activeProduct.name}
                 className="w-full h-full object-contain"
                 style={activeProduct.customStyle}
               />
            </div>
          </div>
          
          {/* RIGHT COLUMN: Product Information & Nav */}
          {/* Pulled slightly inward, given a fixed height to prevent shift */}
          <div className="flex flex-col w-full lg:w-[300px] xl:w-[320px] shrink-0 min-h-[320px] lg:min-h-[280px] lg:pb-8 xl:pb-10 lg:pl-4 xl:pl-6 z-20">
            
            <div className="flex flex-col flex-grow">
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#B28A5D]">
                  {activeProduct.category_id === 'cat-1' ? 'TURMERIC' : activeProduct.category_id === 'cat-2' ? 'OILS' : activeProduct.category_id === 'cat-4' ? 'ASHWAGANDHA' : 'WELLNESS'}
                </span>
                <div className="h-[1px] w-5 bg-[#B28A5D]/30"></div>
              </div>
              
              <h3 className="font-serif text-[30px] sm:text-[34px] lg:text-[32px] xl:text-[36px] leading-[1.1] text-[#243D2B] mb-3">
                {activeProduct.name}
              </h3>
              
              <p className="text-[13px] sm:text-[14px] text-[#243D2B]/80 leading-[1.6] mb-5 font-sans max-w-[400px] lg:max-w-none">
                {activeProduct.description}
              </p>
              
              <div className="text-[20px] font-medium text-[#243D2B] mb-6 font-serif">
                ₹{activeProduct.price}
              </div>
              
              <div>
                <Link 
                  to={`/product/${activeProduct.slug}`}
                  className="inline-flex items-center gap-2 text-[13px] font-medium text-[#243D2B] hover:text-[#71845C] transition-colors group mb-8"
                >
                  View Product
                  <ArrowRight size={14} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </Link>
              </div>
            </div>
            
            {/* Fixed Navigation Controls at bottom */}
            <div className="flex items-center gap-5 text-[#243D2B] mt-auto">
              <button 
                onClick={() => changeProduct('prev')}
                disabled={products.length <= 1}
                className="w-9 h-9 rounded-full border border-[#243D2B]/20 flex items-center justify-center hover:bg-[#243D2B] hover:text-white hover:border-[#243D2B] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#243D2B]"
                aria-label="Previous product"
              >
                <ArrowLeft size={14} strokeWidth={1.5} />
              </button>
              
              <span className="font-sans text-[11px] tracking-[0.2em] font-medium opacity-80">
                {String(currentIndex + 1).padStart(2, '0')} / {String(products.length).padStart(2, '0')}
              </span>

              <button 
                onClick={() => changeProduct('next')}
                disabled={products.length <= 1}
                className="w-9 h-9 rounded-full border border-[#243D2B]/20 flex items-center justify-center hover:bg-[#243D2B] hover:text-white hover:border-[#243D2B] transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#243D2B]"
                aria-label="Next product"
              >
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>
            </div>
            
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default SignatureProducts;
