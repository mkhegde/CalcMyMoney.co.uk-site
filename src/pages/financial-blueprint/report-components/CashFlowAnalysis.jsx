// src/pages/financial-blueprint/report-components/CashFlowAnalysis.jsx
import React from 'react';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatCurrency = (value) => {
  if (value === null || value === undefined) {
    return '£0';
  }
  return currencyFormatter.format(Number(value));
};

const formatPercent = (value) => {
  if (value === null || value === undefined) {
    return '0%';
  }
  return percentageFormatter.format(Number(value));
};

const formatLabel = (label) => {
  if (!label) return '';
  const cleaned = label.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1');
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
};

const BreakdownTable = ({ title, breakdown }) => {
  if (!breakdown) return null;

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
      <dl className="space-y-2 text-sm">
        {Object.entries(breakdown).map(([key, amount]) => (
          <div key={key} className="flex justify-between">
            <dt className="text-gray-500">{formatLabel(key)}</dt>
            <dd className="font-medium text-gray-900">{formatCurrency(amount)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const CashFlowAnalysis = ({ data }) => {
  if (!data) return null;

  const { incomeSummary, expenseSummary, disposableIncome } = data;

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Cash Flow Analysis</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="rounded-lg bg-white shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700">Income Summary</h3>
            <p className="text-sm text-gray-500 mt-1">{incomeSummary?.commentary}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Gross Annual Income</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatCurrency(incomeSummary?.grossAnnualIncome)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Gross Monthly Income</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatCurrency(incomeSummary?.grossMonthlyIncome)}
                </dd>
              </div>
            </div>
          </div>
          <BreakdownTable title="Annual Income Breakdown" breakdown={incomeSummary?.annualBreakdown} />
          <BreakdownTable title="Monthly Income Breakdown" breakdown={incomeSummary?.monthlyBreakdown} />
        </div>

        <div className="space-y-4">
          <div className="rounded-lg bg-white shadow p-4">
            <h3 className="text-sm font-semibold text-gray-700">Expense Summary</h3>
            <p className="text-sm text-gray-500 mt-1">{expenseSummary?.commentary}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-gray-500">Monthly Expenses</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatCurrency(expenseSummary?.monthlyTotal)}
                </dd>
              </div>
              <div>
                <dt className="text-gray-500">Annual Expenses</dt>
                <dd className="text-lg font-semibold text-gray-900">
                  {formatCurrency(expenseSummary?.annualTotal)}
                </dd>
              </div>
            </div>
          </div>
          <BreakdownTable title="Expense Detail" breakdown={expenseSummary?.detail} />
        </div>
      </div>

      <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-6">
        <h3 className="text-lg font-semibold text-indigo-900">Disposable Income</h3>
        <p className="text-sm text-indigo-700 mt-1">{disposableIncome?.commentary}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <dt className="text-indigo-700">Monthly Surplus/Deficit</dt>
            <dd className="text-xl font-semibold text-indigo-900">
              {formatCurrency(disposableIncome?.monthly)}
            </dd>
          </div>
          <div>
            <dt className="text-indigo-700">Annual Surplus/Deficit</dt>
            <dd className="text-xl font-semibold text-indigo-900">
              {formatCurrency(disposableIncome?.annual)}
            </dd>
          </div>
          <div>
            <dt className="text-indigo-700">Savings Rate</dt>
            <dd className="text-xl font-semibold text-indigo-900">
              {formatPercent(disposableIncome?.savingsRate)}
            </dd>
          </div>
          <div>
            <dt className="text-indigo-700">Emergency Fund Coverage</dt>
            <dd className="text-xl font-semibold text-indigo-900">
              {Number(disposableIncome?.emergencyFundCoverageMonths || 0).toFixed(1)} months
            </dd>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CashFlowAnalysis;
