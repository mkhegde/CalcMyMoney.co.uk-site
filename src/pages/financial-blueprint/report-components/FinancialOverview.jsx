// src/pages/financial-blueprint/report-components/FinancialOverview.jsx
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

const MetricCard = ({ title, value, description }) => (
  <div className="p-4 rounded-lg bg-white shadow">
    <div className="text-sm font-medium text-gray-500">{title}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {description ? <p className="mt-2 text-sm text-gray-600">{description}</p> : null}
  </div>
);

const formatLabel = (label) => {
  if (!label) return '';
  const cleaned = label.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const BreakdownList = ({ title, items }) => {
  if (!items || Object.keys(items).length === 0) {
    return null;
  }

  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-2">{title}</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
        {Object.entries(items).map(([key, amount]) => (
          <div key={key} className="flex justify-between">
            <dt className="text-gray-500">{formatLabel(key)}</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(amount)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const FinancialOverview = ({ data }) => {
  if (!data) return null;

  const { netWorth, assets, liabilities } = data;
  const assetBreakdown = assets?.breakdown || {};
  const liabilityBreakdown = liabilities?.breakdown || {};

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Financial Overview</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <MetricCard
          title="Net Worth"
          value={formatCurrency(netWorth?.value)}
          description={netWorth?.insight}
        />
        <MetricCard
          title="Total Assets"
          value={formatCurrency(assets?.total)}
          description={assets?.commentary}
        />
        <MetricCard
          title="Total Liabilities"
          value={formatCurrency(liabilities?.total)}
          description={liabilities?.commentary}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BreakdownList title="Asset Breakdown" items={assetBreakdown} />
        <BreakdownList title="Liability Breakdown" items={liabilityBreakdown} />
      </div>
    </section>
  );
};

export default FinancialOverview;
