import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Leaf, ArrowRight } from 'lucide-react';
import HeroTrustFeatures from './HeroTrustFeatures';

const HeroContent = () => {
  return (
    <div
      className="relative z-20 w-full max-w-[540px] flex flex-col items-start lg:-mt-6 select-none"
    >
      {/* 1. Badge */}
      <motion.div
        initial={{ opacity: 0, x: -35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md mb-4 sm:mb-5 border border-[#243D2B]/15 shadow-xs"
      >
        <Leaf size={13} className="text-[#71835B] animate-pulse" />
        <span className="text-[#1B3022] text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.18em] uppercase">
          PURE BY NATURE • MADE FOR YOU
        </span>
      </motion.div>

      {/* 2. Heading */}
      <motion.h1
        initial={{ opacity: 0, x: -45 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-[clamp(38px,8.5vw,52px)] md:text-[clamp(44px,5vw,60px)] lg:text-[clamp(50px,4.5vw,68px)] font-serif leading-[1.04] mb-4 lg:mb-5 tracking-tight text-[#1B3022] font-semibold"
      >
        <span className="block drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]">
          Pure. Natural.
        </span>
        <span className="block text-[#47623F] drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]">
          Made with Care.
        </span>
      </motion.h1>

      {/* 3. Concise Subtext */}
      <motion.p
        initial={{ opacity: 0, x: -35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.65, delay: 0.6, ease: 'easeOut' }}
        className="text-[14.5px] sm:text-[15.5px] lg:text-[16.5px] text-[#1E2D24] font-medium mb-5 lg:mb-6 w-full lg:max-w-[460px] leading-[1.58] font-sans drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]"
      >
        Crafted with traditional botanical wisdom and pure ingredients for simple everyday wellness.
      </motion.p>

      {/* 4. Trust Badges (4 Pills) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75, ease: 'easeOut' }}
        className="mb-6 lg:mb-7 w-full"
      >
        <HeroTrustFeatures />
      </motion.div>

      {/* 5. CTA Area: Primary Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0, ease: 'easeOut' }}
        className="flex flex-row flex-wrap items-center gap-3.5 sm:gap-4 lg:gap-5"
      >
        {/* Primary CTA Button with Scale-on-Hover */}
        <Link to="/products" className="shrink-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="group relative overflow-hidden px-8 sm:px-9 bg-gradient-to-r from-[#243D2B] via-[#2C422F] to-[#1B3022] hover:from-[#1B3022] hover:to-[#243D2B] text-white rounded-xl h-12 lg:h-[50px] text-[14px] sm:text-[15px] font-semibold tracking-wide shadow-lg shadow-[#243D2B]/20 hover:shadow-xl hover:shadow-[#243D2B]/30 flex items-center gap-2.5 cursor-pointer"
          >
            {/* Shimmer Light Streak on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

            <span>Shop Now</span>
            <ArrowRight size={16} className="text-[#C2A573] group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default HeroContent;
