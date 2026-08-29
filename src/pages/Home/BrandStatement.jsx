import React, { useEffect, useRef } from 'react';
import { Leaf, ShieldCheck, Droplet, Heart, Star } from 'lucide-react';
import StatementImage from '../../assets/section2-image1.png';

const values = [
  { icon: Leaf, label: 'Nature Inspired' },
  { icon: ShieldCheck, label: 'Rooted in Tradition' },
  { icon: Droplet, label: 'Carefully Sourced' },
  { icon: Heart, label: 'Thoughtfully Crafted' },
];

const BrandStatement = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const elements = sectionRef.current?.querySelectorAll('[data-animate]');
    const images = sectionRef.current?.querySelectorAll('[data-animate-img]');

    if (mediaQuery.matches) {
      elements?.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
      images?.forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target.hasAttribute('data-animate-img')) {
              entry.target.classList.replace('opacity-0', 'opacity-100');
              entry.target.classList.replace('scale-[1.03]', 'scale-100');
            } else {
              entry.target.classList.replace('opacity-0', 'opacity-100');
              entry.target.classList.replace('translate-y-4', 'translate-y-0');
              entry.target.classList.replace('translate-y-6', 'translate-y-0');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    elements?.forEach(el => observer.observe(el));
    images?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#F5F0E4] w-full py-[48px] md:py-[64px] lg:py-[88px] overflow-hidden relative"
    >
      <div className="w-full max-w-[1280px] mx-auto px-5 sm:px-6 md:px-8 lg:px-12">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 xl:gap-16 items-center relative">

          {/* Left Column: Content */}
          <div className="flex flex-col w-full z-10 max-w-[540px]">
            
            {/* Eyebrow */}
            <div className="inline-flex self-start items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md mb-4 sm:mb-5 border border-[#243D2B]/15 shadow-sm opacity-0 translate-y-4 transition-all duration-700 ease-out" data-animate>
              <Leaf size={12} className="text-[#71835B]" />
              <span className="text-[#1B3022] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
                THE AHAM PHILOSOPHY
              </span>
            </div>

            {/* Heading */}
            <h2 className="text-[clamp(36px,9vw,48px)] md:text-[clamp(42px,5vw,56px)] lg:text-[clamp(48px,4.5vw,60px)] font-serif leading-[1.05] mb-4 lg:mb-5 tracking-tight text-[#1B3022] font-semibold opacity-0 translate-y-4 transition-all duration-700 delay-100 ease-out" data-animate>
              <span className="block drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Rooted in Nature.</span>
              <span className="block text-[#47623F] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Guided by Tradition.</span>
            </h2>

            {/* Description */}
            <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#1E2D24] font-medium mb-6 lg:mb-8 w-full leading-[1.6] font-sans drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)] opacity-0 translate-y-4 transition-all duration-700 delay-200 ease-out" data-animate>
              At AHAM, we believe wellness begins with what comes from the earth. We bring together carefully sourced ingredients, traditional knowledge and thoughtful formulations to create simple, meaningful products for everyday living.
            </p>

            {/* Brand Values (Pill Grid/Wrap) */}
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 sm:gap-3 w-full opacity-0 translate-y-4 transition-all duration-700 delay-300 ease-out" data-animate>
              {values.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#243D2B]/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] shrink-0"
                >
                  <div className="w-6 h-6 shrink-0 rounded-full bg-[#71835B]/15 flex items-center justify-center text-[#243D2B]">
                    <v.icon size={13} strokeWidth={2} />
                  </div>
                  <span className="text-[11px] sm:text-[12px] font-semibold text-[#1B3022] leading-tight whitespace-nowrap">
                    {v.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Image Composition */}
          <div className="w-full flex items-center justify-center relative z-0 mt-6 lg:mt-0">
            <div className="relative w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[500px] h-auto mx-auto opacity-0 transition-all duration-[1200ms] ease-out scale-[1.03]" data-animate-img>
              
              {/* Soft blurred radial gradient glow behind */}
              <div className="absolute inset-0 bg-[#71835B]/25 blur-[80px] rounded-full w-[90%] h-[90%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-20"></div>

              {/* Layered Accent / Texture Box */}
              <div className="absolute -inset-3 sm:-inset-4 bg-[#E8E0CE] border border-[#243D2B]/5 rounded-[2rem] rotate-[3deg] shadow-inner -z-10 transition-transform duration-700 hover:rotate-[5deg]"></div>
              
              {/* Secondary Layered Accent */}
              <div className="absolute -inset-1.5 bg-white/40 border border-white/60 rounded-[2rem] -rotate-[2deg] backdrop-blur-sm -z-10"></div>

              {/* Main Image with drop shadow and rounded corners */}
              <img 
                src={StatementImage} 
                alt="AHAM Botanical Collage" 
                className="w-full h-auto object-cover rounded-[1.75rem] sm:rounded-[2rem] drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)] z-10 relative" 
              />

              {/* Floating Stat Card overlapping edge */}
              <div className="absolute -bottom-4 -left-3 sm:-left-6 bg-white/95 backdrop-blur-md rounded-[1.25rem] shadow-[0_8px_24px_rgb(0,0,0,0.06)] py-2.5 px-4 sm:py-3 sm:px-5 border border-white/70 flex items-center gap-3 z-20">
                <div className="w-9 h-9 shrink-0 rounded-full bg-[#71835B]/15 flex items-center justify-center text-[#243D2B]">
                  <Star size={16} strokeWidth={1.5} fill="currentColor" className="text-[#243D2B]" />
                </div>
                <div className="text-left">
                  <p className="text-[14px] sm:text-[16px] font-bold text-[#1B3022] leading-tight">4.9/5 Rating</p>
                  <p className="text-[11px] sm:text-[12px] text-[#1E2D24]/70 font-medium">Loved by thousands</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
