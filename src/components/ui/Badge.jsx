import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({ className, variant = 'default', children, ...props }) => {
  const variants = {
    default: 'bg-brand-cream border border-brand-border text-brand-charcoal',
    primary: 'bg-brand-primary text-white border-brand-primary',
    secondary: 'bg-brand-secondary text-white border-brand-secondary',
    accent: 'bg-brand-accent text-white border-brand-accent',
    outline: 'border border-brand-primary text-brand-primary',
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
