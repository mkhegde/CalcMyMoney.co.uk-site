import React from 'react';
import { cn } from '@/lib/utils';

const widthClasses = {
  default: 'max-w-7xl',
  wide: 'max-w-6xl',
  narrow: 'max-w-4xl',
  snug: 'max-w-5xl',
  full: 'max-w-none',
};

const paddingXClasses = {
  default: 'px-4 sm:px-6 lg:px-8',
  compact: 'px-4 sm:px-6',
  wide: 'px-4 sm:px-8 lg:px-12',
  none: 'px-0',
};

const paddingYClasses = {
  none: 'py-0',
  xs: 'py-4',
  sm: 'py-6',
  md: 'py-8',
  lg: 'py-12',
  xl: 'py-16',
  '2xl': 'py-24',
};

const resolveClass = (preset, map) => {
  if (preset == null) return '';
  return map[preset] || preset;
};

export default function Container({
  as: Component = 'div',
  width = 'default',
  paddingX = 'default',
  paddingY = 'none',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'mx-auto w-full',
        resolveClass(width, widthClasses),
        resolveClass(paddingX, paddingXClasses),
        resolveClass(paddingY, paddingYClasses),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
