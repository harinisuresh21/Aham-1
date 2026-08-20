import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({ className, type = 'text', label, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-sm font-medium text-brand-charcoal">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-11 w-full border border-brand-border bg-white px-3 py-2 text-sm text-brand-charcoal placeholder:text-brand-muted focus:outline-none focus:ring-1 focus:ring-brand-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
