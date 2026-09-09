import React from 'react';
import { motion } from 'framer-motion';
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
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.85 + index * 0.1,
              ease: 'easeOut',
            }}
            whileHover={{
              scale: 1.04,
              backgroundColor: 'rgba(255, 255, 255, 1)',
              borderColor: 'rgba(36, 61, 43, 0.25)',
              transition: { duration: 0.2 },
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-white/95 backdrop-blur-md border border-[#243D2B]/10 shadow-[0_2px_8px_rgba(0,0,0,0.03)] shrink-0 cursor-default"
          >
            <div className="w-5 h-5 shrink-0 rounded-full bg-[#71835B]/15 flex items-center justify-center text-[#243D2B]">
              <Icon size={12} strokeWidth={2} />
            </div>
            <span className="text-[10px] sm:text-[11px] font-semibold text-[#243D2B] leading-tight whitespace-nowrap">
              {feature.label}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export default HeroTrustFeatures;
