import React from 'react';
import { cn } from '../../utils/cn';

const SectionHeading = ({ title, subtitle, className, center = false }) => {
  return (
    <div className={cn("mb-12 max-w-3xl", center ? "mx-auto text-center" : "", className)}>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-brand-primary mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-brand-muted font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionHeading;
