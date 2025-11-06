import React from 'react';
import { HelpCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ReportSection from './ReportSection';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  maximumFractionDigits: 1,
});

const formatCurrency = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 'Not provided';
  }
  return currencyFormatter.format(numericValue);
};

const formatPercent = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 'Not provided';
  }
  return percentFormatter.format(numericValue);
};

const formatMonths = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }
  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return 'Not provided';
  }
  if (numericValue === 0) {
    return '0 months';
  }
  return `${numericValue.toFixed(1)} months`;
};

const InfoBadge = ({ message }) => {
  if (!message) return null;
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label="More information"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-indigo-100 bg-indigo-50 text-indigo-600"
          >
            <HelpCircle className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs leading-snug">
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const MetricCard = ({ title, value, helperText, tooltip }) => (
  <div className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <span>{title}</span>
      <InfoBadge message={tooltip} />
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    {helperText ? <p className="text-xs text-gray-500">{helperText}</p> : null}
  </div>
);

const SectionHeading = ({ title }) => (
  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h3>
);

const QuantitativeAnalysis = ({ data }) => {
  if (!data) {
    return (
      <ReportSection
        title="Quantitative Analysis"
        subtitle="Key financial metrics generated from your responses"
      >
        <p className="text-sm text-gray-500">
          Quantitative insights will appear here once we have calculated your figures.
        </p>
      </ReportSection>
    );
  }

  const { income = {}, cashflow = {}, debt = {}, taxes = {}, retirement = {} } = data;

  const netMonthlyFallback =
    income.netMonthly !== undefined && income.netMonthly !== null
      ? income.netMonthly
      : income.netAnnual
      ? Number(income.netAnnual) / 12
      : null;

  const monthlySurplus = Number(cashflow.monthlySurplus ?? 0);
  const surplusLabel = monthlySurplus >= 0 ? 'Monthly Surplus' : 'Monthly Deficit';
  const surplusValue = monthlySurplus >= 0 ? monthlySurplus : Math.abs(monthlySurplus);

  const incomeChartData = [
    { name: 'Gross income', value: income.grossAnnual },
    { name: 'Net income', value: income.netAnnual },
    { name: 'Annual expenses', value: cashflow.annualExpenses },
  ];
  const hasChartData = incomeChartData.some((item) => Number.isFinite(Number(item.value)) && Number(item.value) !== 0);

  return (
    <ReportSection
      title="Quantitative Analysis"
      subtitle="Understand how your household finances stack up"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MetricCard
          title="Gross Income (Annual)"
          value={formatCurrency(income.grossAnnual)}
          tooltip="This is the total income you and your household earn before any spending or tax deductions."
          helperText="Includes salaries, benefits and other annualised income."
        />
        <MetricCard
          title="Net Income (Annual)"
          value={formatCurrency(income.netAnnual)}
          tooltip="Net income is calculated as gross income minus the expenses you provided in the survey."
          helperText="Represents funds left after covering your stated costs."
        />
        <MetricCard
          title="Gross Income (Monthly)"
          value={formatCurrency(income.grossMonthly)}
          tooltip="Gross monthly income is your household's total income divided by 12."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MetricCard
          title="Net Income (Monthly)"
          value={formatCurrency(netMonthlyFallback)}
          tooltip="Net monthly income reflects the disposable amount after your monthly expenses."
        />
        <MetricCard
          title={surplusLabel}
          value={formatCurrency(surplusValue)}
          tooltip="Monthly surplus or deficit compares your net income against the expenses you entered."
          helperText={
            cashflow.monthlySurplus !== undefined
              ? cashflow.monthlySurplus >= 0
                ? 'Positive values indicate available cash for goals or savings.'
                : 'Negative values indicate a shortfall versus your spending.'
              : undefined
          }
        />
        <MetricCard
          title="Savings Rate"
          value={formatPercent(cashflow.savingsRate)}
          tooltip="Savings rate is the portion of gross income left after expenses."
          helperText="Aim for 15%+ to build financial resilience."
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MetricCard
          title="Emergency Fund Coverage"
          value={formatMonths(cashflow.emergencyFundCoverageMonths)}
          tooltip="Calculated by dividing your cash savings by monthly expenses."
          helperText="A healthy buffer is 3-6 months of essential costs."
        />
        <MetricCard
          title="Total Liabilities"
          value={formatCurrency(debt.totalLiabilities)}
          tooltip="Sum of the debts you reported, including mortgages, loans and credit cards."
        />
        <MetricCard
          title="Debt-to-Income Ratio"
          value={formatPercent(debt.debtToIncomeRatio)}
          tooltip="Shows how your total debts compare with your annual gross income."
          helperText="Lenders prefer to see this figure below 1 (or 100%)."
        />
      </div>

      {hasChartData ? (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4 text-indigo-900">
          <SectionHeading title="Income vs Spending" />
          <p className="mt-1 text-xs text-indigo-700">
            This visual compares the annual income you reported with your stated annual spending.
          </p>
          <div className="mt-4 h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#c7d2fe" />
                <XAxis dataKey="name" stroke="#312e81" tick={{ fontSize: 12 }} />
                <YAxis stroke="#312e81" tickFormatter={(tick) => currencyFormatter.format(tick)} tick={{ fontSize: 12 }} />
                <RechartsTooltip
                  formatter={(value) => currencyFormatter.format(value)}
                  contentStyle={{ backgroundColor: '#EEF2FF', borderRadius: '0.5rem', borderColor: '#c7d2fe' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
          <SectionHeading title="Tax band summary" />
          <dl className="mt-3 grid grid-cols-1 gap-3 text-sm text-gray-600">
            <div className="flex items-start justify-between gap-4">
              <dt>Region</dt>
              <dd className="font-medium text-gray-900">{taxes.region || 'Not provided'}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt>Income tax band</dt>
              <dd className="font-medium text-gray-900">{taxes.incomeTaxBand || 'Not provided'}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt>National Insurance band</dt>
              <dd className="font-medium text-gray-900">{taxes.nationalInsuranceBand || 'Not provided'}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt>Personal allowance</dt>
              <dd className="font-medium text-gray-900">{formatCurrency(taxes.personalAllowance)}</dd>
            </div>
            <div className="flex items-start justify-between gap-4">
              <dt>Taxable income</dt>
              <dd className="font-medium text-gray-900">{formatCurrency(taxes.taxableIncomeAfterAllowance)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-xs text-gray-500">
            Tax figures reflect the allowances and income thresholds that applied to your location.
          </p>
        </div>
        <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
          <SectionHeading title="Projected retirement shortfall" />
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Projected pension pot</span>
              <span className="font-semibold">{formatCurrency(retirement.projectedPensionPot)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Sustainable annual drawdown</span>
              <span className="font-semibold">{formatCurrency(retirement.sustainableAnnualDrawdown)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Annual spending target</span>
              <span className="font-semibold">{formatCurrency(cashflow.annualExpenses)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span>Estimated annual shortfall</span>
              <span>{formatCurrency(retirement.retirementShortfallAnnual)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Monthly impact</span>
              <span className="font-semibold">{formatCurrency(retirement.retirementShortfallMonthly)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs">
            We compare your sustainable drawdown with the spending you reported to highlight any gap you may need to close before
            retiring.
          </p>
        </div>
      </div>
    </ReportSection>
  );
};

export default QuantitativeAnalysis;
