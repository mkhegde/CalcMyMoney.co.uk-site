// src/pages/financial-blueprint/report-components/ReportSection.jsx
import React from 'react';

const joinClassNames = (...classes) => classes.filter(Boolean).join(' ');

const ReportSection = ({
  title,
  subtitle,
  action,
  children,
  className,
  cardClassName = 'p-6 space-y-4',
}) => {
  return (
    <section className={joinClassNames('space-y-4', className)}>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
        </div>
        {action ? <div className="text-sm font-medium text-gray-500">{action}</div> : null}
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className={cardClassName}>{children}</div>
      </div>
    </section>
  );
};

export default ReportSection;
