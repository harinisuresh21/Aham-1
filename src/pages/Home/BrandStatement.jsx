import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import brandStatementImg from '../../assets/brand-statement.jpg';

const BrandStatement = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    // Respect user's motion preferences
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 } // Trigger when 15% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className="bg-[#F8F4EA] w-full py-24 lg:py-[120px] overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
        
        {/* CSS Grid for Desktop, Stack for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 xl:gap-24 items-center">
          
          {/* Left: Content Column */}
          <div className="flex flex-col items-start order-1 lg:order-1">
            <span 
              className={`text-[10px] font-bold tracking-widest uppercase text-[#71835B] mb-4 lg:mb-6 transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              THE AHAM PHILOSOPHY
            </span>

            <h2 
              className={`font-serif text-[clamp(40px,11vw,54px)] lg:text-[clamp(48px,5vw,72px)] leading-[1.0] text-[#243D2B] font-medium tracking-tight mb-6 lg:mb-8 transition-all duration-700 delay-100 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              <span className="block">Rooted in Nature.</span>
              <span className="block text-[#71835B]">Guided by Tradition.</span>
            </h2>

            <p 
              className={`text-[15px] lg:text-[18px] leading-[1.6] text-[#243D2B]/80 max-w-[480px] mb-8 lg:mb-10 font-sans transition-all duration-700 delay-200 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              At AHAM, we believe wellness begins with what comes from the earth. We bring together carefully sourced ingredients, traditional knowledge and thoughtful formulations to create simple, meaningful products for everyday living.
            </p>

            <Link 
              to="/about" 
              className={`inline-flex items-center gap-2 text-[14px] lg:text-[16px] font-medium text-[#243D2B] hover:text-[#71835B] transition-colors border-b border-[#243D2B]/20 hover:border-[#71835B] pb-0.5 group duration-700 delay-300 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Discover Our Story
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Right: Image Column */}
          <div className="w-full relative order-2 lg:order-2 overflow-hidden rounded-[2px] lg:rounded-sm">
            <div 
              className={`w-full relative h-[320px] sm:h-[380px] lg:h-[600px] overflow-hidden transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={brandStatementImg} 
                alt="Natural traditional ingredients" 
                className={`w-full h-full object-cover transition-transform duration-[800ms] ease-out hover:scale-[1.02] ${
                  isVisible ? 'scale-100' : 'scale-[1.03]'
                }`}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
