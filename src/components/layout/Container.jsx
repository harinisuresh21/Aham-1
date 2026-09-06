import React from 'react';
import { cn } from '../../utils/cn';

const Container = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[1280px] px-5 sm:px-6 md:px-8 lg:px-12",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Container;
