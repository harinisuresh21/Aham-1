import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, ShieldCheck, Droplet, Heart } from 'lucide-react';
import StatementImage from '../../assets/statement-image.png';

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
      className="bg-[#F8F4EA] w-full py-16 md:py-24 lg:py-[100px] overflow-hidden relative"
    >
      <div className="w-full max-w-[1400px] mx-auto px-5 sm:px-6 lg:px-[clamp(32px,5vw,80px)]">

        <div className="flex flex-col lg:grid lg:grid-cols-[1.1fr_0.9fr] xl:grid-cols-[1fr_1fr] gap-12 lg:gap-8 items-start lg:items-stretch min-h-auto lg:min-h-[600px] xl:min-h-[680px]">

          {/* Left Column: Content */}
          <div className="flex flex-col w-full max-w-none lg:max-w-[520px] pt-2 lg:pt-12 xl:pt-20 order-1">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-5 lg:mb-6 opacity-0 translate-y-4 transition-all duration-700 ease-out" data-animate>
              <span className="text-[10px] md:text-[11px] font-bold tracking-[0.15em] uppercase text-[#71845C]">
                THE AHAM PHILOSOPHY
              </span>
              <div className="h-[1px] w-8 md:w-12 bg-[#243D2B]/20"></div>
              <Leaf size={14} className="text-[#71845C]" />
            </div>

            {/* Heading */}
            <h2 className="font-serif leading-[1.0] text-[#243D2B] mb-5 lg:mb-8 tracking-[-0.01em] opacity-0 translate-y-4 transition-all duration-700 delay-100 ease-out text-[clamp(42px,11vw,56px)] md:text-[clamp(52px,6vw,68px)] lg:text-[72px]" data-animate>
              <span className="block mb-1">Rooted in Nature.</span>
              <span className="block text-[#71845C]">Guided by Tradition.</span>
            </h2>

            {/* Description */}
            <p className="text-[14.5px] md:text-[15px] lg:text-[16px] leading-[1.65] text-[#243D2B]/85 max-w-[440px] lg:max-w-full mb-8 lg:mb-10 font-sans opacity-0 translate-y-4 transition-all duration-700 delay-200 ease-out" data-animate>
              At AHAM, we believe wellness begins with what comes from the earth. We bring together carefully sourced ingredients, traditional knowledge and thoughtful formulations to create simple, meaningful products for everyday living.
            </p>

            {/* CTA */}
            <div className="opacity-0 translate-y-4 transition-all duration-700 delay-300 ease-out" data-animate>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-[14.5px] lg:text-[16px] font-semibold text-[#243D2B] hover:text-[#71845C] transition-colors group border-b-2 border-[#243D2B]/20 hover:border-[#71845C]/50 pb-1"
              >
                Discover Our Story
                <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
              </Link>
            </div>

            {/* Desktop Brand Values - Hidden on Mobile */}
            <div className="hidden lg:flex flex-row items-center gap-8 xl:gap-10 mt-auto pt-16 opacity-0 translate-y-4 transition-all duration-700 delay-400 ease-out" data-animate>
              {values.map((v, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border border-[#243D2B]/15 flex items-center justify-center bg-transparent text-[#243D2B]">
                    <v.icon size={20} strokeWidth={1.5} />
                  </div>
                  <span className="text-[#243D2B] text-[12px] font-medium text-center leading-tight max-w-[80px]">
                    {v.label}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column: Image Composition */}
          <div className="relative w-full order-2 mt-8 lg:mt-0 flex items-center justify-center">

            {/* Main Botanical Collage */}
            <div className="w-full max-w-[100%] md:max-w-[520px] lg:max-w-[620px] h-auto flex items-center justify-center opacity-0 transition-all duration-[1200ms] ease-out scale-[1.03]" data-animate-img>
              <img src={StatementImage} alt="AHAM Botanical Collage" className="w-full h-auto object-contain" />
            </div>

          </div>

          {/* Mobile Brand Values - Understated inline list */}
          <div className="lg:hidden order-3 w-full mt-4 flex flex-wrap justify-center items-center gap-x-2 gap-y-2 opacity-0 translate-y-4 transition-all duration-700 delay-400 ease-out" data-animate>
            {values.map((v, i) => (
              <React.Fragment key={i}>
                <span className="text-[#243D2B]/85 text-[11px] sm:text-[12px] font-semibold tracking-wide uppercase flex items-center gap-1.5">
                  <v.icon size={11} strokeWidth={2} className="text-[#71845C]" />
                  {v.label}
                </span>
                {i < values.length - 1 && (
                  <span className="text-[#243D2B]/30 text-[10px] mx-1">•</span>
                )}
              </React.Fragment>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BrandStatement;
