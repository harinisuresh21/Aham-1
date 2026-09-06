import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, ArrowRight } from 'lucide-react';
import { categories } from '../../data/categories';
import desktopBg from '../../assets/section3-background-desktop.png';
import mobileBg from '../../assets/section3-background-mobile.png';
import Container from '../../components/layout/Container';

const Categories = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = sectionRef.current?.querySelectorAll('[data-animate]');

    if (mediaQuery.matches) {
      elements?.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.replace('opacity-0', 'opacity-100');
            entry.target.classList.replace('translate-y-4', 'translate-y-0');
            entry.target.classList.replace('translate-y-6', 'translate-y-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="bg-[#F5F0E4] w-full py-[48px] md:py-[64px] lg:py-[88px] overflow-hidden relative min-h-[650px] lg:min-h-[600px] flex items-center"
    >
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopBg} />
          <img 
            src={mobileBg} 
            alt="Botanical background" 
            className="w-full h-full object-cover object-center" 
          />
        </picture>
        {/* Very subtle gradient overlay to ensure text readability over the botanicals */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F5F0E4]/40 to-transparent lg:w-[60%] z-10"></div>
      </div>

      <Container className="relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center">
          
          {/* Left Column: Content */}
          <div className="flex flex-col w-full z-10 max-w-[540px]">
            
            {/* Eyebrow */}
            <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md mb-4 sm:mb-5 border border-[#243D2B]/15 shadow-sm opacity-0 translate-y-4 transition-all duration-700 ease-out" data-animate>
              <Leaf size={12} className="text-[#71835B]" />
              <span className="text-[#243D2B] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                SHOP BY ESSENCE
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-[clamp(36px,9vw,48px)] md:text-[clamp(42px,5vw,56px)] lg:text-[clamp(48px,4.5vw,60px)] font-serif leading-[1.05] mb-4 lg:mb-5 tracking-tight text-[#243D2B] font-semibold opacity-0 translate-y-4 transition-all duration-700 delay-100 ease-out" data-animate>
              <span className="block drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Wellness,</span>
              <span className="block text-[#47623F] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Rooted in Nature.</span>
            </h2>

            {/* Description */}
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#243D2B]/90 font-medium mb-6 lg:mb-8 w-full leading-[1.6] font-sans drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] opacity-0 translate-y-4 transition-all duration-700 delay-200 ease-out" data-animate>
              Explore thoughtfully crafted products inspired by nature, traditional Indian knowledge and everyday wellness rituals.
            </p>

            <div className="hidden lg:block opacity-0 translate-y-4 transition-all duration-700 delay-300 ease-out" data-animate>
               <Link 
                 to="/collections" 
                 className="group inline-flex items-center text-[12px] font-bold uppercase tracking-widest font-sans text-[#243D2B] hover:text-[#47623F] transition-colors"
               >
                 Explore All Products 
                 <ArrowRight size={14} className="ml-2 transform transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </div>

          {/* Right Column: Category List */}
          <div className="flex flex-col justify-center w-full mt-4 lg:mt-0 relative z-10">
            <div className="flex flex-col border-t border-[#243D2B]/15">
              {categories.map((category, index) => (
                <Link 
                  key={category.id}
                  to={`/categories/${category.slug}`}
                  className="group flex flex-row items-center py-5 sm:py-6 lg:py-8 border-b border-[#243D2B]/15 hover:border-[#47623F]/40 transition-colors duration-300 opacity-0 translate-y-4 transition-all duration-700 ease-out"
                  style={{ transitionDelay: `${300 + index * 100}ms` }}
                  data-animate
                >
                  <div className="w-10 sm:w-14 flex-shrink-0 text-[12px] sm:text-[13px] font-bold font-sans text-[#243D2B]/40 group-hover:text-[#47623F] transition-colors duration-300">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  <div className="flex-grow pr-4">
                    <h4 className="text-[20px] sm:text-[24px] lg:text-[28px] font-serif text-[#243D2B] mb-1 sm:mb-2 group-hover:translate-x-1 transition-transform duration-400 ease-out leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                      {category.name}
                    </h4>
                    <p className="text-[13px] sm:text-[14px] font-sans text-[#243D2B]/80 font-medium leading-relaxed max-w-sm group-hover:translate-x-1 transition-transform duration-400 delay-75 ease-out drop-shadow-[0_1px_1px_rgba(255,255,255,0.5)]">
                      {category.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 text-[#243D2B]/30 group-hover:text-[#47623F] group-hover:translate-x-1 transition-all duration-400 ease-out bg-white/50 backdrop-blur-sm p-2 rounded-full border border-white/40 shadow-sm">
                    <ArrowRight size={18} strokeWidth={1.5} />
                  </div>
                </Link>
              ))}
            </div>
            
            <div className="mt-8 lg:hidden opacity-0 translate-y-4 transition-all duration-700 ease-out" style={{ transitionDelay: '700ms' }} data-animate>
               <Link 
                 to="/collections" 
                 className="group inline-flex items-center text-[11px] font-bold uppercase tracking-widest font-sans text-[#243D2B] hover:text-[#47623F] transition-colors"
               >
                 Explore All Products 
                 <ArrowRight size={14} className="ml-2 transform transition-transform group-hover:translate-x-1" />
               </Link>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default Categories;
