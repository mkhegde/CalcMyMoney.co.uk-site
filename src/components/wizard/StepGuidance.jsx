import React from 'react';
import { Lightbulb } from 'lucide-react';

import { cn } from '@/lib/utils';

export default function StepGuidance({ title, points = [], icon: Icon = Lightbulb, className }) {
  if (!title && (!points || points.length === 0)) {
    return null;
  }

  return (
    <div
      className={cn(
        'rounded-2xl border border-primary/30 bg-primary/5 p-4 text-sm text-primary-foreground dark:border-primary/40 dark:bg-primary/10',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        <div className="space-y-2">
          {title ? <p className="font-semibold text-foreground">{title}</p> : null}
          {Array.isArray(points) && points.length > 0 ? (
            <ul className="space-y-1 text-muted-foreground">
              {points.map((point, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
