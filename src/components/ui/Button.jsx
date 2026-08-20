import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    primary: 'bg-brand-primary text-white hover:bg-opacity-90',
    secondary: 'bg-brand-secondary text-white hover:bg-opacity-90',
    outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary/10',
    ghost: 'text-brand-primary hover:bg-brand-primary/10',
    accent: 'bg-brand-accent text-white hover:bg-opacity-90',
  };

  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-8 text-base',
    lg: 'h-14 px-10 text-lg',
    icon: 'h-11 w-11',
  };

  return (
    <button
      ref={ref}
      disabled={isLoading || props.disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
