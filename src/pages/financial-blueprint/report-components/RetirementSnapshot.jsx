// src/pages/financial-blueprint/report-components/RetirementSnapshot.jsx
import React from 'react';
import ReportSection from './ReportSection';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return '£0';
  }
  return currencyFormatter.format(Number(value));
};

const RetirementSnapshot = ({ data }) => {
  if (!data) {
    return (
      <ReportSection title="Retirement Snapshot">
        <p className="text-sm text-gray-500">We&apos;ll calculate your retirement outlook once the data is ready.</p>
      </ReportSection>
    );
  }

  const {
    readinessSummary,
    yearsToRetirement,
    projectedPensionPot,
    sustainableAnnualDrawdown,
    assumptions,
    nextSteps,
    partner,
  } = data;

  const hasHeadlineFigures =
    yearsToRetirement !== undefined || projectedPensionPot !== undefined || sustainableAnnualDrawdown !== undefined;

  return (
    <ReportSection title="Retirement Snapshot" subtitle="A quick view of your readiness for life after work">
      {readinessSummary ? <p className="text-sm text-gray-600">{readinessSummary}</p> : null}

      {hasHeadlineFigures ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Years to Retirement</h3>
            <p className="text-2xl font-bold text-gray-900">
              {yearsToRetirement !== undefined ? Number(yearsToRetirement).toFixed(0) : '–'}
            </p>
            {partner?.yearsToRetirement !== undefined ? (
              <p className="mt-1 text-xs text-gray-500">
                Partner timeline: {Number(partner.yearsToRetirement).toFixed(0)} years
              </p>
            ) : null}
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Projected Pension Pot</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(projectedPensionPot)}</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-700">Sustainable Drawdown</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(sustainableAnnualDrawdown)}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500">We&apos;ll display your projected pension figures here when available.</p>
      )}

      {Array.isArray(assumptions) && assumptions.length > 0 ? (
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-700">Key Assumptions</h3>
          <ul className="mt-2 space-y-1 list-inside list-disc text-sm text-gray-600">
            {assumptions.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {Array.isArray(nextSteps) && nextSteps.length > 0 ? (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-900">
          <h3 className="text-sm font-semibold">Suggested Next Steps</h3>
          <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
            {nextSteps.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </ReportSection>
  );
};

export default RetirementSnapshot;
