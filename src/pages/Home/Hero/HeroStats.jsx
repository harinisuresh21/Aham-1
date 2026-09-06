import React from 'react';
import { Package, Users, Star, Truck } from 'lucide-react';

const stats = [
  { icon: Package, value: '50+', label: 'Natural Products' },
  { icon: Users, value: '25K+', label: 'Happy Customers' },
  { icon: Star, value: '4.8/5', label: 'Average Rating' },
  { icon: Truck, value: 'Pan India', label: 'Fast Delivery' },
];

const HeroStats = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md rounded-[1.25rem] shadow-[0_4px_20px_rgb(0,0,0,0.03)] py-3 sm:py-3.5 px-5 md:px-8 mx-auto w-full lg:w-[84%] max-w-[1140px] border border-white/60">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-5 gap-x-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`flex items-center justify-start gap-3 ${index !== 0 ? 'lg:border-l lg:border-brand-border/40 lg:pl-8' : ''}`}>
              <div className="flex-shrink-0 text-brand-secondary">
                <Icon size={22} strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <p className="text-[17px] lg:text-[19px] font-bold text-brand-primary leading-tight">{stat.value}</p>
                <p className="text-[11px] lg:text-[13px] text-brand-charcoal/70 font-medium">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroStats;
