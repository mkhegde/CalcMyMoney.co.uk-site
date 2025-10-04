import React from 'react';
import { cn } from '@/lib/utils';

export default function CalculatorWrapper({ children, className = '' }) {
  return (
    <div className="non-printable bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn('rounded-lg border border-card-muted bg-card-muted p-8', className)}>
          {children}
        </div>
      </div>
    </div>
  );
}
