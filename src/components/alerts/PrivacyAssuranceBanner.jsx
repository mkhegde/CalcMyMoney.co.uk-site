import React from 'react';
import { ShieldCheck } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export function PrivacyAssuranceBanner({
  className,
  title = 'Your answers stay private',
  description = 'We never store your Money Blueprint responses on our servers. Everything stays on this device unless you choose to export or share it.',
  icon: Icon = ShieldCheck,
  children,
}) {
  return (
    <Alert
      className={cn(
        'border-primary/60 bg-primary/5 text-primary dark:border-primary/50 dark:bg-primary/10',
        className
      )}
    >
      {Icon ? <Icon aria-hidden="true" className="h-5 w-5 text-primary" /> : null}
      <div className="space-y-2">
        {title ? (
          <AlertTitle className="text-sm font-semibold text-primary">{title}</AlertTitle>
        ) : null}
        {(description || children) && (
          <AlertDescription className="space-y-2 text-sm leading-relaxed text-primary/90 dark:text-primary/80">
            {description ? <p>{description}</p> : null}
            {children}
          </AlertDescription>
        )}
      </div>
    </Alert>
  );
}

export default PrivacyAssuranceBanner;
