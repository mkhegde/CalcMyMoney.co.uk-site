// src/pages/financial-blueprint/report-components/RetirementSnapshot.jsx
import React from 'react';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return '£0';
  }
  return currencyFormatter.format(Number(value));
};

const RetirementSnapshot = ({ data }) => {
  if (!data) return null;

  const {
    readinessSummary,
    yearsToRetirement,
    projectedPensionPot,
    sustainableAnnualDrawdown,
    assumptions,
    nextSteps,
    partner,
  } = data;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Retirement Readiness</h2>
      <div className="rounded-lg bg-white shadow p-6 space-y-4">
        <p className="text-gray-700 text-sm">{readinessSummary}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="rounded-lg border p-4 bg-gray-50">
            <h3 className="text-gray-700 font-semibold">Years to Retirement</h3>
            <p className="text-2xl font-bold text-gray-900">{Number(yearsToRetirement ?? 0).toFixed(0)}</p>
            {partner?.yearsToRetirement !== undefined ? (
              <p className="text-xs text-gray-500 mt-1">
                Partner retirement horizon: {Number(partner.yearsToRetirement ?? 0).toFixed(0)} years
              </p>
            ) : null}
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h3 className="text-gray-700 font-semibold">Projected Pension Pot</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(projectedPensionPot)}</p>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h3 className="text-gray-700 font-semibold">Sustainable Drawdown</h3>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(sustainableAnnualDrawdown)}</p>
          </div>
        </div>

        {Array.isArray(assumptions) && assumptions.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Key Assumptions</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
              {assumptions.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}

        {Array.isArray(nextSteps) && nextSteps.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-gray-700">Next Steps</h3>
            <ul className="mt-2 space-y-1 text-sm text-gray-600 list-disc list-inside">
              {nextSteps.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default RetirementSnapshot;
