// src/pages/financial-blueprint/report-components/TaxAndCashflow.jsx
import React from 'react';
import ReportSection from './ReportSection';

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
  if (value === null || value === undefined || value === '') {
    return '£0';
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }
  return currencyFormatter.format(numericValue);
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') {
    return '0%';
  }
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }
  return percentageFormatter.format(numericValue);
};

const formatLabel = (label) => {
  if (!label) return '';
  return label
    .toString()
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

const KeyFigure = ({ label, value, helper, variant = 'default' }) => {
  const background =
    variant === 'highlight'
      ? 'bg-indigo-50 border-indigo-100 text-indigo-900'
      : 'bg-gray-50 border-gray-100 text-gray-900';
  return (
    <div className={`rounded-xl border p-4 ${background}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      {helper ? <p className="mt-1 text-xs text-gray-500">{helper}</p> : null}
    </div>
  );
};

const BreakdownList = ({ title, entries, formatter = formatCurrency }) => {
  if (!entries) return null;
  const entryArray = Array.isArray(entries)
    ? entries
    : Object.entries(entries).map(([key, value]) => ({ label: formatLabel(key), value }));

  if (entryArray.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      <dl className="mt-3 space-y-2 text-sm text-gray-600">
        {entryArray.map((entry, index) => (
          <div key={`${entry.label || entry.name || index}-${index}`} className="flex justify-between">
            <dt>{entry.label || entry.name || formatLabel(entry.key)}</dt>
            <dd className="font-medium text-gray-900">{formatter(entry.value)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const TaxAndCashflow = ({ data }) => {
  const taxData =
    data?.tax ||
    data?.taxation ||
    data?.taxAnalysis ||
    data?.taxSummary ||
    data?.taxInsights ||
    null;
  const cashflowData =
    data?.cashflow ||
    data?.cashFlow ||
    data?.cashFlowAnalysis ||
    data?.cashflowSummary ||
    data?.cashflowInsights ||
    null;

  const hasContent = taxData || cashflowData;

  if (!hasContent) {
    return (
      <ReportSection title="Tax & Cashflow Overview">
        <p className="text-sm text-gray-500">We&apos;ll surface tax and cashflow insights here once they&apos;re available.</p>
      </ReportSection>
    );
  }

  const combinedSummary = data?.summary || taxData?.summary || cashflowData?.summary;
  const disposableIncome = cashflowData?.disposableIncome || data?.disposableIncome;

  return (
    <ReportSection title="Tax & Cashflow Overview" subtitle="Understand how money flows through your household each year">
      {combinedSummary ? <p className="text-sm text-gray-600">{combinedSummary}</p> : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <KeyFigure
          label="Gross Annual Income"
          value={formatCurrency(cashflowData?.incomeSummary?.grossAnnualIncome)}
          helper={cashflowData?.incomeSummary?.commentary}
        />
        <KeyFigure
          label="Total Annual Expenses"
          value={formatCurrency(cashflowData?.expenseSummary?.annualTotal)}
          helper={cashflowData?.expenseSummary?.commentary}
        />
        <KeyFigure
          label="Estimated Tax Liability"
          value={formatCurrency(taxData?.figures?.totalTax || taxData?.totalTax)}
          helper={taxData?.summary}
          variant="highlight"
        />
      </div>

      {disposableIncome ? (
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50 p-6 text-indigo-900">
          <h3 className="text-sm font-semibold uppercase tracking-wide">Disposable Income</h3>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-4 text-sm">
            <div>
              <dt className="text-indigo-700">Monthly</dt>
              <dd className="text-xl font-semibold">{formatCurrency(disposableIncome.monthly)}</dd>
            </div>
            <div>
              <dt className="text-indigo-700">Annual</dt>
              <dd className="text-xl font-semibold">{formatCurrency(disposableIncome.annual)}</dd>
            </div>
            <div>
              <dt className="text-indigo-700">Savings Rate</dt>
              <dd className="text-xl font-semibold">{formatPercent(disposableIncome.savingsRate)}</dd>
            </div>
            <div>
              <dt className="text-indigo-700">Emergency Fund</dt>
              <dd className="text-xl font-semibold">
                {disposableIncome.emergencyFundCoverageMonths
                  ? `${Number(disposableIncome.emergencyFundCoverageMonths).toFixed(1)} months`
                  : 'Not provided'}
              </dd>
            </div>
          </div>
          {disposableIncome.commentary ? <p className="mt-3 text-sm">{disposableIncome.commentary}</p> : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <BreakdownList
            title="Income Breakdown"
            entries={cashflowData?.incomeSummary?.annualBreakdown || cashflowData?.incomeBreakdown}
          />
          <BreakdownList
            title="Expense Breakdown"
            entries={cashflowData?.expenseSummary?.detail || cashflowData?.expenseBreakdown}
          />
        </div>
        <div className="space-y-4">
          <BreakdownList
            title="Tax Figures"
            entries={taxData?.figures || taxData?.detail}
          />
          {Array.isArray(taxData?.recommendations) && taxData.recommendations.length > 0 ? (
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-900">
              <h3 className="text-sm font-semibold">Tax Planning Opportunities</h3>
              <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                {taxData.recommendations.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </ReportSection>
  );
};

export default TaxAndCashflow;
