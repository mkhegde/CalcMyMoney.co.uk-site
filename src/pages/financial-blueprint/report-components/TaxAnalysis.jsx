// src/pages/financial-blueprint/report-components/TaxAnalysis.jsx
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

const TaxAnalysis = ({ data }) => {
  if (!data) return null;

  const { summary, taxBand, nationalInsuranceBand, figures, recommendations } = data;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Taxation Overview</h2>
      <div className="rounded-lg bg-white shadow p-6">
        <p className="text-gray-700 text-sm">{summary}</p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-lg border p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800">Income Tax Band</h3>
            <p className="text-gray-600 mt-1">{taxBand}</p>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Region</dt>
                <dd className="font-medium text-gray-900">{figures?.region}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Personal Allowance</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(figures?.personalAllowance)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Taxable Income</dt>
                <dd className="font-medium text-gray-900">{formatCurrency(figures?.taxableIncomeAfterAllowance)}</dd>
              </div>
            </dl>
          </div>
          <div className="rounded-lg border p-4 bg-gray-50">
            <h3 className="font-semibold text-gray-800">National Insurance</h3>
            <p className="text-gray-600 mt-1">{nationalInsuranceBand}</p>
            <dl className="mt-3 space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Tax Band Reference</dt>
                <dd className="font-medium text-gray-900">{figures?.incomeTaxBand}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">NI Band Reference</dt>
                <dd className="font-medium text-gray-900">{figures?.nationalInsuranceBand}</dd>
              </div>
            </dl>
          </div>
        </div>

        {Array.isArray(recommendations) && recommendations.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700">Recommendations</h3>
            <ul className="mt-2 space-y-2 list-disc list-inside text-sm text-gray-600">
              {recommendations.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default TaxAnalysis;
