import React from 'react';

export default function CalculatorWrapper({ children }) {
  return (
    <div className="non-printable bg-background py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-card-muted bg-card-muted p-8">{children}</div>
      </div>
    </div>
  );
}
