import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function WizardNavigation({
  isFirstStep = false,
  isLastStep = false,
  onPrevious,
  onNext,
  nextLabel = 'Next step',
  finishLabel = 'Finish',
  isNextDisabled = false,
  isBackDisabled = false,
  className,
  leftSlot,
  nextButtonProps,
  backButtonProps,
  children,
}) {
  const handlePrevious = React.useCallback(() => {
    if (typeof onPrevious === 'function') {
      onPrevious();
    }
  }, [onPrevious]);

  const handleNext = React.useCallback(() => {
    if (typeof onNext === 'function') {
      onNext();
    }
  }, [onNext]);

  const backDisabled = isFirstStep || isBackDisabled;
  const nextDisabled = isNextDisabled;

  const mergedBackProps = {
    ...(backButtonProps || {}),
    className: cn('min-w-[110px]', backButtonProps?.className),
    disabled: backDisabled || backButtonProps?.disabled,
    type: backButtonProps?.type || 'button',
  };

  const mergedNextProps = {
    ...(nextButtonProps || {}),
    className: cn('min-w-[150px] gap-2', nextButtonProps?.className),
    disabled: nextDisabled || nextButtonProps?.disabled,
    type: nextButtonProps?.type || 'button',
  };

  return (
    <div className={cn('mt-8 border-t border-border pt-4', className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {leftSlot || null}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePrevious} {...mergedBackProps}>
            Back
          </Button>
          <Button onClick={handleNext} {...mergedNextProps}>
            {isLastStep ? finishLabel : nextLabel}
          </Button>
        </div>
      </div>
      {children ? <div className="mt-4 text-sm text-muted-foreground">{children}</div> : null}
    </div>
  );
}

export default WizardNavigation;
