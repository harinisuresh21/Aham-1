import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import Button from '../../../components/ui/Button';
import HeroTrustFeatures from './HeroTrustFeatures';

const HeroContent = () => {
  return (
    <div className="relative z-20 w-full max-w-[520px] flex flex-col items-start lg:-mt-8">

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md mb-4 sm:mb-5 border border-[#243D2B]/15 shadow-sm">
        <Leaf size={12} className="text-[#71835B]" />
        <span className="text-[#1B3022] text-[10px] sm:text-[11px] font-bold tracking-widest uppercase">
          PURE BY NATURE • MADE FOR YOU
        </span>
      </div>

      {/* Headline */}
      <h1 className="text-[clamp(36px,9vw,48px)] md:text-[clamp(42px,5vw,56px)] lg:text-[clamp(48px,4.5vw,64px)] font-serif leading-[1.05] mb-4 lg:mb-5 tracking-tight text-[#1B3022] font-semibold">
        <span className="block drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Pure. Natural.</span>
        <span className="block text-[#47623F] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Made with Care.</span>
      </h1>

      {/* Concise Description */}
      <p className="text-[14px] sm:text-[15px] lg:text-[16px] text-[#1E2D24] font-medium mb-5 lg:mb-6 w-full lg:max-w-[440px] leading-[1.55] font-sans drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
        Crafted with traditional botanical wisdom and pure ingredients for simple everyday wellness.
      </p>

      {/* Trust Features */}
      <div className="mb-5 lg:mb-6 w-full">
        <HeroTrustFeatures />
      </div>

      {/* CTA Area */}
      <div className="flex flex-row flex-wrap items-center gap-3.5 sm:gap-4 lg:gap-5">
        <Link to="/products" className="shrink-0">
          <Button size="lg" className="px-7 sm:px-8 bg-[#243D2B] hover:bg-[#1B3022] text-white rounded-xl h-11 lg:h-[46px] text-[13px] sm:text-[14px] font-semibold tracking-wide shadow-md hover:shadow-lg transition-all">
            Shop Now
          </Button>
        </Link>
      </div>

    </div>
  );
};

export default HeroContent;
