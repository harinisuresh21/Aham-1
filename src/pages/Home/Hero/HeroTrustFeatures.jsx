import React from 'react';
import { Leaf, FlaskConical, ShieldCheck, Heart } from 'lucide-react';

const features = [
  { icon: Leaf, label: '100% Natural' },
  { icon: FlaskConical, label: 'No Additives' },
  { icon: ShieldCheck, label: 'Safe & Effective' },
  { icon: Heart, label: 'Trusted by 25k+' },
];

const HeroTrustFeatures = () => {
  return (
    <div className="grid grid-cols-2 sm:flex sm:flex-wrap lg:flex lg:flex-nowrap gap-2 sm:gap-2.5 lg:gap-3 w-full">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#243D2B]/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] shrink-0"
          >
            <div className="w-6 h-6 shrink-0 rounded-full bg-[#71835B]/15 flex items-center justify-center text-[#243D2B]">
              <Icon size={13} strokeWidth={2} />
            </div>
            <span className="text-[11px] sm:text-[12px] font-semibold text-[#1B3022] leading-tight whitespace-nowrap">
              {feature.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default HeroTrustFeatures;
