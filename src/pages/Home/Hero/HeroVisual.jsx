import React from 'react';
import productDesktop from '../../../assets/hero-product-desktop.png';
import productMobile from '../../../assets/hero-product-mobile.png';

const HeroVisual = () => {
  return (
    <div
      className="relative w-full h-full flex items-end justify-center md:items-center md:justify-end pointer-events-none overflow-visible"
      style={{ zIndex: 40 }}
    >
      <picture className="flex items-end justify-center md:items-center md:justify-center md:pl-0 lg:pl-10 h-full w-full overflow-visible">
        {/* Desktop and Tablet 768px+: use the new portrait desktop image */}
        <source media="(min-width: 768px)" srcSet={productDesktop} />

        <img
          src={productMobile}
          alt="AHAM Natural Turmeric and Wellness Products"
          className={[
            // --- MOBILE (Locked < 768px) ---
            'h-[340px] w-auto max-w-[85vw]',
            'sm:h-[400px]',

            // --- TABLET (768px - 1023px) ---
            'md:h-auto md:w-[clamp(300px,42vw,400px)]',

            // --- DESKTOP (1024px - 1279px) ---
            'lg:w-[clamp(380px,39vw,430px)]',

            // --- DESKTOP (1280px - 1535px) ---
            'xl:w-[clamp(410px,33vw,480px)]',

            // --- DESKTOP (1536px+) ---
            '2xl:w-[clamp(480px,28vw,560px)]',

            // Vertical Adjustments to overlap stone but avoid header
            'md:mt-4 lg:mt-8',

            // Horizontal shift to overlap center slightly
            'md:-ml-8 lg:-ml-12',

            // Shared
            'object-contain object-bottom md:object-center select-none',
            'drop-shadow-[0_20px_40px_rgba(0,0,0,0.12)]',
          ].join(' ')}
        />
      </picture>
    </div>
  );
};

export default HeroVisual;
