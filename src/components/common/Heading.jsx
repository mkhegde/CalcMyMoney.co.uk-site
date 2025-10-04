import React, { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const sizeClassMap = {
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
  h4: 'heading-4',
  lead: 'lead',
  caption: 'caption',
};

const defaultByElement = {
  h1: 'heading-1',
  h2: 'heading-2',
  h3: 'heading-3',
  h4: 'heading-4',
  h5: 'heading-4',
  h6: 'heading-4',
  p: 'lead',
  span: 'heading-4',
};

const weightClassMap = {
  regular: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const Heading = forwardRef(
  (
    {
      as: Component = 'h2',
      size,
      weight = 'semibold',
      underline = false,
      eyebrow,
      eyebrowProps,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedSize = sizeClassMap[size] || defaultByElement[Component] || 'heading-2';
    const resolvedWeight = weightClassMap[weight] || weightClassMap.semibold;
    const { className: eyebrowClassName, ...restEyebrowProps } = eyebrowProps || {};

    return (
      <Component
        ref={ref}
        className={cn(resolvedSize, resolvedWeight, underline && 'heading-underline', className)}
        {...props}
      >
        {eyebrow ? (
          <span className={cn('heading-eyebrow', eyebrowClassName)} {...restEyebrowProps}>
            {eyebrow}
          </span>
        ) : null}
        {children}
      </Component>
    );
  }
);

Heading.displayName = 'Heading';

export default Heading;
