import React from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

function getStepStatus(index, currentIndex) {
  if (index < currentIndex) return 'complete';
  if (index === currentIndex) return 'current';
  return 'upcoming';
}

export function WizardStepper({
  steps,
  currentStepIndex = 0,
  visitedStepIds = [],
  onStepClick,
  className,
}) {
  if (!Array.isArray(steps) || steps.length === 0) {
    return null;
  }

  return (
    <ol
      className={cn(
        'grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:flex xl:flex-row xl:items-stretch xl:gap-4',
        className
      )}
    >
      {steps.map((step, index) => {
        const status = getStepStatus(index, currentStepIndex);
        const isVisited = Array.isArray(visitedStepIds) && visitedStepIds.includes(step.id);
        const isClickable = typeof onStepClick === 'function' && index < currentStepIndex && isVisited;

        return (
          <li key={step.id ?? index} className="flex-1">
            <button
              type="button"
              disabled={!isClickable}
              onClick={() => {
                if (isClickable) {
                  onStepClick(index, step);
                }
              }}
              className={cn(
                'group relative flex w-full items-start gap-4 rounded-xl border bg-card p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-default disabled:opacity-100',
                status === 'complete' &&
                  'border-emerald-300 bg-emerald-50/90 text-emerald-900 shadow-sm dark:border-emerald-500/50 dark:bg-emerald-500/10 dark:text-emerald-100',
                status === 'current' &&
                  'border-primary bg-primary/5 text-primary shadow-sm dark:bg-primary/10',
                status === 'upcoming' &&
                  'border-border bg-muted/30 text-muted-foreground transition hover:border-primary/40 hover:bg-muted/50 disabled:hover:border-border disabled:hover:bg-muted/30'
              )}
            >
              <span
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition',
                  status === 'complete' && 'border-emerald-500 bg-emerald-500 text-emerald-50 shadow-sm',
                  status === 'current' && 'border-primary bg-primary text-primary-foreground shadow-sm',
                  status === 'upcoming' && 'border-border bg-card text-muted-foreground'
                )}
              >
                {status === 'complete' ? <Check className="h-4 w-4" /> : index + 1}
              </span>

              <span className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold tracking-tight text-foreground">
                  {step.title || `Step ${index + 1}`}
                </span>
                {step.description ? (
                  <span className="mt-1 text-xs leading-snug text-muted-foreground">
                    {step.description}
                  </span>
                ) : null}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export default WizardStepper;
