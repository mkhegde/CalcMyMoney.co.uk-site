import React from 'react';
import { cn } from '@/lib/utils';
import Container from './Container';

const sectionVariants = {
  plain: 'bg-transparent',
  muted: 'bg-muted/50',
  inset: 'bg-transparent',
};

const insetBaseClasses = 'rounded-3xl border border-border/60 bg-card shadow-sm';

export default function Section({
  as: Component = 'section',
  variant = 'plain',
  width = 'default',
  paddingX = 'default',
  spacing = 'lg',
  bleed = false,
  className,
  containerClassName,
  contentClassName,
  insetPadding = 'p-6 sm:p-8 md:p-10',
  children,
  ...props
}) {
  const sectionClassName = cn('w-full', sectionVariants[variant], className);

  if (bleed) {
    return (
      <Component className={sectionClassName} {...props}>
        {children}
      </Component>
    );
  }

  const containerPaddingY = spacing === false ? 'none' : spacing;

  const content =
    variant === 'inset' ? (
      <div className={cn(insetBaseClasses, insetPadding, contentClassName)}>{children}</div>
    ) : contentClassName ? (
      <div className={contentClassName}>{children}</div>
    ) : (
      children
    );

  return (
    <Component className={sectionClassName} {...props}>
      <Container
        width={width}
        paddingX={paddingX}
        paddingY={containerPaddingY}
        className={cn(variant === 'inset' ? 'py-0' : null, containerClassName)}
      >
        {content}
      </Container>
    </Component>
  );
}
