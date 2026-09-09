import React from 'react';
import { motion } from 'framer-motion';
import productDesktop from '../../../assets/hero-product-desktop.png';
import productMobile from '../../../assets/hero-product-mobile.png';

/**
 * Capsule Tub Fog Reveal Visual Component
 * 
 * - When page loads or refreshes, the capsule tub/bottle starts partially shrouded
 *   in a soft, organic white/cream rolling fog.
 * - Over 1.5 to 2s, the fog smoothly dissipates while the capsule tub scales up
 *   from soft blur into crisp focus (opacity: 0 -> 1, blur: 10px -> 0px, scale: 0.95 -> 1).
 * - Remains completely static, elegant, and grounded once revealed.
 */
const HeroVisual = () => {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center md:justify-end overflow-visible select-none"
      style={{ zIndex: 30 }}
    >
      {/* Soft Ambient Radiant Botanical Glow behind the bottle */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.4, scale: 1.1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        aria-hidden="true"
        className="absolute w-[380px] sm:w-[440px] lg:w-[480px] h-[380px] sm:h-[440px] lg:h-[480px] rounded-full bg-gradient-to-tr from-[#E5A93B]/25 via-[#C2A573]/20 to-transparent blur-3xl pointer-events-none -translate-y-4"
      />

      {/* Primary Bottle Staging Container */}
      <div className="relative flex items-center justify-center overflow-visible">
        {/* Subtle Ground Contact Shadow */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[70%] h-6 bg-[#1B3022]/20 rounded-full blur-md pointer-events-none -z-10"
        />

        {/* 1. Capsule Tub / Bottle Image (Smoothly scales & focuses from blur) */}
        <motion.div
          initial={{
            opacity: 0,
            filter: 'blur(10px)',
            scale: 0.95,
          }}
          animate={{
            opacity: 1,
            filter: 'blur(0px)',
            scale: 1,
          }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1], // Ultra-smooth natural entrance into crisp focus
          }}
          className="relative overflow-visible"
        >
          <picture className="flex items-end justify-center md:items-center md:justify-center md:pl-0 lg:pl-10 h-full w-full overflow-visible pointer-events-none">
            <source media="(min-width: 768px)" srcSet={productDesktop} />
            <img
              src={productMobile}
              alt="AHAM Natural Turmeric Capsules Bottle"
              className={[
                'h-[340px] w-auto max-w-[85vw]',
                'sm:h-[400px]',
                'md:h-auto md:w-[clamp(300px,42vw,400px)]',
                'lg:w-[clamp(380px,39vw,430px)]',
                'xl:w-[clamp(410px,33vw,480px)]',
                '2xl:w-[clamp(480px,28vw,560px)]',
                'md:mt-4 lg:mt-6 md:-ml-6 lg:-ml-10',
                'object-contain object-bottom md:object-center select-none',
                'drop-shadow-[0_20px_35px_rgba(0,0,0,0.14)]',
              ].join(' ')}
            />
          </picture>
        </motion.div>

        {/* 2. Layered Mist / Fog Shroud Overlay (Directly wrapping the capsule tub) */}
        {/* Fog Cloud 1: Foreground rolling mist veil across the bottle base */}
        <motion.div
          initial={{ opacity: 0.95, scale: 0.96, y: 10 }}
          animate={{
            opacity: [0.95, 0.8, 0],
            scale: [0.96, 1.08, 1.2],
            y: [10, -5, -20],
          }}
          transition={{
            times: [0, 0.45, 1],
            duration: 1.8,
            ease: [0.25, 1, 0.4, 1],
          }}
          aria-hidden="true"
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[125%] h-[65%] rounded-[45%] bg-gradient-to-t from-[#FDFAF5]/95 via-[#F8F2E6]/80 to-transparent blur-2xl pointer-events-none z-20"
        />

        {/* Fog Cloud 2: Left organic mist swirl drifting outward */}
        <motion.div
          initial={{ opacity: 0.85, x: 0, scale: 0.9 }}
          animate={{
            opacity: [0.85, 0.6, 0],
            x: [0, -25, -45],
            scale: [0.9, 1.1, 1.25],
          }}
          transition={{
            times: [0, 0.5, 1],
            duration: 1.7,
            ease: 'easeOut',
          }}
          aria-hidden="true"
          className="absolute top-1/4 -left-10 w-[70%] h-[60%] rounded-full bg-gradient-to-tr from-[#FDFAF5] via-[#EDE4D3]/70 to-transparent blur-xl pointer-events-none z-20"
        />

        {/* Fog Cloud 3: Right organic mist swirl drifting outward */}
        <motion.div
          initial={{ opacity: 0.85, x: 0, scale: 0.9 }}
          animate={{
            opacity: [0.85, 0.6, 0],
            x: [0, 25, 45],
            scale: [0.9, 1.1, 1.25],
          }}
          transition={{
            times: [0, 0.5, 1],
            duration: 1.7,
            ease: 'easeOut',
          }}
          aria-hidden="true"
          className="absolute top-1/3 -right-8 w-[65%] h-[55%] rounded-full bg-gradient-to-bl from-[#FDFAF5] via-[#EFE6D5]/70 to-transparent blur-xl pointer-events-none z-20"
        />

        {/* Fog Cloud 4: Soft herbal golden aura mist rising from center */}
        <motion.div
          initial={{ opacity: 0.7, scale: 0.85 }}
          animate={{
            opacity: [0.7, 0.4, 0],
            scale: [0.85, 1.15, 1.3],
          }}
          transition={{
            times: [0, 0.5, 1],
            duration: 1.9,
            ease: 'easeOut',
          }}
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[75%] rounded-full bg-gradient-to-r from-[#E5A93B]/20 via-[#FAF6ED]/70 to-[#C2A573]/15 blur-2xl pointer-events-none z-20"
        />

      </div>
    </div>
  );
};

export default HeroVisual;

