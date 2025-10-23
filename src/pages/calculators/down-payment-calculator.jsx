import React, { useMemo, useState } from 'react';
import { Calculator, Home, PiggyBank, Target, Clock } from 'lucide-react';

import StandardCalculatorLayout from '@/components/calculators/StandardCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Down Payment Calculator';
const pagePath = '/down-payment-calculator';
const canonicalUrl = `https://www.calcmymoney.co.uk${pagePath}`;
const keywords = getCalculatorKeywords('Down Payment Calculator');

const pageTitle = 'Down Payment Calculator | UK House Deposit Planner';

const metaDescription =
  'Plan your UK house deposit with our down payment calculator. Map savings, investment growth, and timelines so you can move into your new home sooner.';

const defaultInputs = {
  homePrice: '320,000',
  depositPercent: '15',
  monthlySaving: '900',
  lumpSum: '8,000',
  annualReturn: '3',
  timelineYears: '3',
};

const MAX_PROJECTION_MONTHS = 600;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const formatDuration = (months) => {
  if (!Number.isFinite(months) || months === Infinity) {
    return 'Not reached within 50 years';
  }
  if (months <= 0) return 'Already achieved';
  const totalMonths = Math.ceil(months);
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
  }
  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }
  return `${years} yr ${remainingMonths} mo`;
};

const downPaymentFaqs = [
  {
    question: 'How much deposit do UK lenders usually ask for?',
    answer:
      'Most lenders will consider a minimum 5% deposit, though 10% to 20% usually unlocks better rates and wider choice. Use the calculator to compare how different percentages affect your savings target.',
  },
  {
    question: 'Should I include fees in my deposit target?',
    answer:
      'Yes. Solicitors, surveys, removals, and potential stamp duty can add thousands. Add these costs to the property price or increase the deposit percentage so your final target covers everything.',
  },
  {
    question: 'How do investment returns affect my savings timeline?',
    answer:
      'Setting aside part of your deposit in savings or investments can grow the pot faster. Add an annual return to see the impact, but always balance growth plans with capital protection on money needed soon.',
  },
];


const relatedCalculators = [
  {
    name: 'Mortgage Affordability Calculator',
    url: '/mortgage-affordability-calculator',
    description: 'See how much you could borrow once your deposit is ready.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Break large savings goals into manageable monthly steps.',
  },
  {
    name: 'Mortgage Repayment Calculator',
    url: '/mortgage-repayment-calculator',
    description: 'Estimate monthly payments based on your planned deposit.',
  },
];

const computeDownPaymentPlan = ({
  homePrice,
  depositPercent,
  monthlySaving,
  lumpSum,
  annualReturn,
  timelineYears,
}) => {
  const propertyPrice = Math.max(homePrice, 0);
  const depositRate = Math.max(depositPercent, 0);
  const targetDeposit = propertyPrice * (depositRate / 100);

  if (propertyPrice <= 0 || depositRate <= 0) {
    return {
      valid: false,
      message: 'Enter your target property price and desired deposit percentage to begin planning.',
    };
  }

  const monthlyContribution = Math.max(monthlySaving, 0);
  const initialLumpSum = Math.max(lumpSum, 0);
  const monthlyRate = Math.max(annualReturn, 0) / 100 / 12;
  const monthsInPlan = Math.max(Math.round(timelineYears * 12), 0);

  let balance = initialLumpSum;
  let cumulativeContributions = initialLumpSum;

  const timeline = [
    {
      label: 'Start',
      month: 0,
      balance,
      contributions: cumulativeContributions,
    },
  ];

  for (let month = 1; month <= monthsInPlan; month += 1) {
    balance += monthlyContribution;
    cumulativeContributions += monthlyContribution;
    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }

    if (month % 12 === 0 || month === monthsInPlan) {
      timeline.push({
        label: `Year ${Math.ceil(month / 12)}`,
        month,
        balance,
        contributions: cumulativeContributions,
      });
    }
  }

  const growth = Math.max(balance - cumulativeContributions, 0);
  const percentageFunded = targetDeposit > 0 ? (balance / targetDeposit) * 100 : 0;
  const shortfall = Math.max(targetDeposit - balance, 0);

  let monthsToTarget = Infinity;
  let projectionBalance = initialLumpSum;

  for (let month = 1; month <= MAX_PROJECTION_MONTHS; month += 1) {
    projectionBalance += monthlyContribution;
    if (monthlyRate > 0) {
      projectionBalance *= 1 + monthlyRate;
    }
    if (projectionBalance >= targetDeposit) {
      monthsToTarget = month;
      break;
    }
  }

  const planHitsTarget = Number.isFinite(monthsToTarget) && monthsToTarget !== Infinity;

  const monthsForRequirement = Math.max(monthsInPlan, 1);
  const compoundFactor = Math.pow(1 + monthlyRate, monthsForRequirement);
  let requiredMonthly = 0;

  if (monthlyRate === 0) {
    requiredMonthly = Math.max((targetDeposit - initialLumpSum) / monthsForRequirement, 0);
  } else {
    const numerator = targetDeposit - initialLumpSum * compoundFactor;
    const denominator = (compoundFactor - 1) / monthlyRate;
    requiredMonthly = denominator > 0 ? Math.max(numerator / denominator, 0) : 0;
  }

  return {
    valid: true,
    targetDeposit,
    balance,
    cumulativeContributions,
    growth,
    percentageFunded,
    shortfall,
    monthsToTarget,
    planHitsTarget,
    requiredMonthly,
    monthlyContribution,
    monthlyRate,
    timeline,
  };
};

export default function DownPaymentCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const payload = {
      homePrice: sanitiseNumber(inputs.homePrice),
      depositPercent: sanitiseNumber(inputs.depositPercent),
      monthlySaving: sanitiseNumber(inputs.monthlySaving),
      lumpSum: sanitiseNumber(inputs.lumpSum),
      annualReturn: sanitiseNumber(inputs.annualReturn),
      timelineYears: sanitiseNumber(inputs.timelineYears),
    };
    const outcome = computeDownPaymentPlan(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      {
        name: 'Your contributions',
        value: results.cumulativeContributions,
        color: '#0ea5e9',
      },
      {
        name: 'Growth earned',
        value: results.growth,
        color: '#22c55e',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const summary = [
      ['Metric', 'Value'],
      ['Target deposit (£)', results.targetDeposit.toFixed(2)],
      ['Savings after timeline (£)', results.balance.toFixed(2)],
      ['Total contributions (£)', results.cumulativeContributions.toFixed(2)],
      ['Growth earned (£)', results.growth.toFixed(2)],
      ['Funded (%)', results.percentageFunded.toFixed(2)],
      ['Shortfall (£)', results.shortfall.toFixed(2)],
      ['Months to reach target', Number.isFinite(results.monthsToTarget) ? results.monthsToTarget : 'Not reached'],
      ['Current monthly saving (£)', results.monthlyContribution.toFixed(2)],
      ['Monthly saving required for timeline (£)', results.requiredMonthly.toFixed(2)],
    ];
    const timelineRows = results.timeline.length
      ? [
          [],
          ['Milestone', 'Month', 'Balance (£)', 'Contributions (£)'],
          ...results.timeline.map((entry) => [
            entry.label,
            entry.month,
            entry.balance.toFixed(2),
            entry.contributions.toFixed(2),
          ]),
        ]
      : [];
    return [...summary, ...timelineRows];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <StandardCalculatorLayout
      seo={{
        title: pageTitle,
        description: metaDescription,
        canonical: canonicalUrl,
        keywords,
      }}
      schemaConfig={{
        path: pagePath,
        name: CALCULATOR_NAME,
        description: metaDescription,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Mortgages & Property Calculators', url: '/calculators#mortgages-property' },
          { name: CALCULATOR_NAME, url: pagePath },
        ],
      }}
      icon={Home}
      title={CALCULATOR_NAME}
      description="Forecast your house deposit, measure progress, and adjust contributions to hit your moving date with confidence."
      intro={{
        title: 'Build momentum towards your keys',
        body:
          'Breaking the deposit into monthly milestones keeps motivation high. Revisit your plan after each pay rise, bonus, or cost saving and keep the timeline moving in your favour.',
      }}
      quote={{
        text: 'The best time to plant a tree was twenty years ago. The second-best time is now.',
        author: 'Chinese Proverb',
      }}
      faqs={downPaymentFaqs}
      relatedCalculators={relatedCalculators}
    >
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 bg-white text-slate-900 shadow-sm dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Savings inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="homePrice" className="text-sm font-medium">
                    Target property price (£)
                  </Label>
                  <Input
                    id="homePrice"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.homePrice}
                    onChange={handleInputChange('homePrice')}
                    placeholder="e.g., 320,000"
                  />
                </div>
                <div>
                  <Label htmlFor="depositPercent" className="text-sm font-medium">
                    Deposit percentage (%)
                  </Label>
                  <Input
                    id="depositPercent"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step="0.1"
                    value={inputs.depositPercent}
                    onChange={handleInputChange('depositPercent')}
                    placeholder="e.g., 15"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlySaving" className="text-sm font-medium">
                    Monthly savings (£)
                  </Label>
                  <Input
                    id="monthlySaving"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.monthlySaving}
                    onChange={handleInputChange('monthlySaving')}
                    placeholder="e.g., 900"
                  />
                </div>
                <div>
                  <Label htmlFor="lumpSum" className="text-sm font-medium">
                    Lump sum already saved (£)
                  </Label>
                  <Input
                    id="lumpSum"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.lumpSum}
                    onChange={handleInputChange('lumpSum')}
                    placeholder="e.g., 8,000"
                  />
                </div>
                <div>
                  <Label htmlFor="annualReturn" className="text-sm font-medium">
                    Expected annual return (%)
                  </Label>
                  <Input
                    id="annualReturn"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={inputs.annualReturn}
                    onChange={handleInputChange('annualReturn')}
                    placeholder="e.g., 3"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Use 0% for cash savings. For investments, choose a realistic long-term average.
                  </p>
                </div>
                <div>
                  <Label htmlFor="timelineYears" className="text-sm font-medium">
                    Savings timeline (years)
                  </Label>
                  <Input
                    id="timelineYears"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={inputs.timelineYears}
                    onChange={handleInputChange('timelineYears')}
                    placeholder="e.g., 3"
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Calculate
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

        {showResults ? (
          <div className="space-y-6">
              <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    <PiggyBank className="h-5 w-5" />
                    Deposit progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Target deposit
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.targetDeposit)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Saved after timeline
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.balance)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Funded
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {percentageFormatter.format(Math.min(results.percentageFunded, 999))}%
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Shortfall / surplus
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {results.shortfall > 0
                          ? `-${currencyFormatter.format(results.shortfall)}`
                          : `+${currencyFormatter.format(Math.abs(results.shortfall))}`}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Time to reach target
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {formatDuration(results.monthsToTarget)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        Based on current contributions.
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Monthly saving needed
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.requiredMonthly)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        To hit the goal within your chosen timeline.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 p-4">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                      <Target className="h-5 w-5" />
                      Contributions versus growth
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Deposit savings breakdown" />
                  </div>

                  {results.timeline.length ? (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-100">
                        <Clock className="h-5 w-5" />
                        Savings milestones
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-xs uppercase tracking-wide">
                            <tr>
                              <th className="px-3 py-2">Milestone</th>
                              <th className="px-3 py-2">Month</th>
                              <th className="px-3 py-2">Balance</th>
                              <th className="px-3 py-2">Total contributions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.timeline.map((entry) => (
                              <tr
                                key={`${entry.label}-${entry.month}`}
                                className="border-b border-emerald-100 dark:border-emerald-800"
                              >
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {entry.label}
                                </td>
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {entry.month}
                                </td>
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {currencyFormatter.format(entry.balance)}
                                </td>
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {currencyFormatter.format(entry.contributions)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}

                  <ExportActions
                    csvData={csvData}
                    fileName="down-payment-calculator-results"
                    title="Down payment savings plan"
                  />
                </CardContent>
              </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                <Home className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                <p className="text-sm">
                  {hasCalculated && results?.message ? (
                    results.message
                  ) : (
                    <>
                      Enter your target property, deposit percentage, and savings plan, then press{' '}
                      <strong>Calculate</strong> to see your deposit roadmap.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StandardCalculatorLayout>
  );
}
