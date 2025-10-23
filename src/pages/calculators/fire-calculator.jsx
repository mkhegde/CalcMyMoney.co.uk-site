import React, { useMemo, useState } from 'react';
import { Calculator, PiggyBank, TrendingUp, Target } from 'lucide-react';

import StandardCalculatorLayout from '@/components/calculators/StandardCalculatorLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'FIRE Calculator';
const pagePath = '/fire-calculator';
const canonicalUrl = `https://www.calcmymoney.co.uk${pagePath}`;
const keywords = getCalculatorKeywords('FIRE Calculator');

const pageTitle = 'FIRE Calculator | Financial Independence Timeline';

const metaDescription =
  'Map your route to financial independence with the UK FIRE calculator. Estimate your FIRE number, project portfolio growth, and see how contributions affect the time to retire early.';

const defaultInputs = {
  currentPortfolio: '120,000',
  annualContribution: '18,000',
  expectedReturn: '6',
  inflationRate: '2',
  annualSpending: '40,000',
  withdrawalRate: '4',
  yearsToGoal: '15',
};

const fireFaqs = [
  {
    question: 'What withdrawal rate should I use for FIRE?',
    answer:
      'Many UK savers model a 4% withdrawal rate, but opting for 3.5% or lower provides a safety margin against market volatility. Try different rates to see how your target changes.',
  },
  {
    question: 'How often should I revisit my FIRE plan?',
    answer:
      'Review annually or after major changes to income, spending, or market performance. Keeping your plan updated ensures you stay on track for your target retirement date.',
  },
  {
    question: 'Do I need to adjust for inflation?',
    answer:
      'Yes. The calculator uses real returns (after inflation) to show how today’s spending power translates into future targets. You can adjust inflation to explore different scenarios.',
  },
];


const relatedCalculators = [
  {
    name: 'Retirement Savings Calculator',
    url: '/retirement-savings-calculator',
    description: 'Project pension growth and retirement income needs.',
  },
  {
    name: 'Investment Calculator',
    url: '/investment-calculator',
    description: 'Model compound growth across lump sums and regular contributions.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Turn large milestones into manageable monthly targets.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const simulateFirePlan = ({
  currentPortfolio,
  annualContribution,
  expectedReturn,
  inflationRate,
  annualSpending,
  withdrawalRate,
  yearsToGoal,
}) => {
  const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
  const fireNumber = annualSpending / (withdrawalRate / 100);

  if (!Number.isFinite(realReturn) || realReturn <= -1) {
    return {
      valid: false,
      message: 'Check your return and inflation inputs. Real return must be greater than -100%.',
    };
  }

  const timeline = [];
  let balance = currentPortfolio;
  let totalContributions = 0;
  const maxYears = Math.max(Math.round(yearsToGoal), 1);

  for (let year = 1; year <= maxYears; year += 1) {
    balance = (balance + annualContribution) * (1 + realReturn);
    totalContributions += annualContribution;
    timeline.push({
      year,
      balance,
      totalContributions,
    });
  }

  const projectedBalance = timeline.length ? timeline[timeline.length - 1].balance : balance;

  let yearsToFire = 0;
  let balanceToTarget = currentPortfolio;
  if (balanceToTarget >= fireNumber) {
    yearsToFire = 0;
  } else {
    let year = 0;
    const MAX_SIMULATION_YEARS = 80;
    while (balanceToTarget < fireNumber && year < MAX_SIMULATION_YEARS) {
      balanceToTarget = (balanceToTarget + annualContribution) * (1 + realReturn);
      year += 1;
    }
    yearsToFire = balanceToTarget >= fireNumber ? year : Infinity;
  }

  const gapToTarget = Math.max(fireNumber - projectedBalance, 0);

  return {
    valid: true,
    fireNumber,
    projectedBalance,
    gapToTarget,
    yearsToFire,
    realReturn,
    timeline,
    totalContributions,
  };
};

export default function FireCalculatorPage() {
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
      currentPortfolio: sanitiseNumber(inputs.currentPortfolio),
      annualContribution: sanitiseNumber(inputs.annualContribution),
      expectedReturn: sanitiseNumber(inputs.expectedReturn),
      inflationRate: sanitiseNumber(inputs.inflationRate),
      annualSpending: sanitiseNumber(inputs.annualSpending),
      withdrawalRate: sanitiseNumber(inputs.withdrawalRate),
      yearsToGoal: sanitiseNumber(inputs.yearsToGoal),
    };
    const outcome = simulateFirePlan(payload);
    setResults({ ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      {
        name: 'Projected portfolio',
        value: Math.min(results.projectedBalance, results.fireNumber),
        color: '#22c55e',
      },
      {
        name: 'Remaining gap',
        value: Math.max(results.fireNumber - results.projectedBalance, 0),
        color: '#f97316',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const header = [
      ['Metric', 'Value'],
      ['Current portfolio (£)', results.payload.currentPortfolio.toFixed(2)],
      ['Annual contribution (£)', results.payload.annualContribution.toFixed(2)],
      ['Expected return (%)', results.payload.expectedReturn.toFixed(2)],
      ['Inflation rate (%)', results.payload.inflationRate.toFixed(2)],
      ['Annual spending (£)', results.payload.annualSpending.toFixed(2)],
      ['Withdrawal rate (%)', results.payload.withdrawalRate.toFixed(2)],
      ['FIRE number (£)', results.fireNumber.toFixed(2)],
      ['Projected balance (£)', results.projectedBalance.toFixed(2)],
      ['Gap to target (£)', results.gapToTarget.toFixed(2)],
      [
        'Years to FIRE (approx)',
        Number.isFinite(results.yearsToFire) ? results.yearsToFire : 'More than 80 years',
      ],
    ];
    const timelineRows = results.timeline.length
      ? [
          [],
          ['Year', 'Portfolio (£)', 'Total contributions (£)'],
          ...results.timeline.map((entry) => [
            entry.year,
            entry.balance.toFixed(2),
            entry.totalContributions.toFixed(2),
          ]),
        ]
      : [];
    return [...header, ...timelineRows];
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
          { name: 'Savings & Investments Calculators', url: '/calculators#savings-investments' },
          { name: CALCULATOR_NAME, url: pagePath },
        ],
      }}
      icon={PiggyBank}
      title={CALCULATOR_NAME}
      description="Map your path to financial independence, estimate your FIRE number, and monitor how close you are to exiting the rat race."
      intro={{
        title: 'Freedom is a finance decision away',
        body:
          'Intentional saving and investing turn work optional into a date you can mark on the calendar. Run the numbers often and let the results guide your next move.',
      }}
      quote={{
        text: 'The goal isn’t more money. The goal is living life on your terms.',
        author: 'Chris Brogan',
      }}
      faqs={fireFaqs}
      relatedCalculators={relatedCalculators}
    >
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                FIRE inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="currentPortfolio" className="text-sm font-medium">
                    Current invested portfolio (£)
                  </Label>
                  <Input
                    id="currentPortfolio"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.currentPortfolio}
                    onChange={handleInputChange('currentPortfolio')}
                    placeholder="e.g., 120,000"
                  />
                </div>
                <div>
                  <Label htmlFor="annualContribution" className="text-sm font-medium">
                    Annual contributions (£)
                  </Label>
                  <Input
                    id="annualContribution"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.annualContribution}
                    onChange={handleInputChange('annualContribution')}
                    placeholder="e.g., 18,000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expectedReturn" className="text-sm font-medium">
                      Expected return (%)
                    </Label>
                    <Input
                      id="expectedReturn"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={inputs.expectedReturn}
                      onChange={handleInputChange('expectedReturn')}
                      placeholder="e.g., 6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="inflationRate" className="text-sm font-medium">
                      Inflation (%)
                    </Label>
                    <Input
                      id="inflationRate"
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={inputs.inflationRate}
                      onChange={handleInputChange('inflationRate')}
                      placeholder="e.g., 2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="annualSpending" className="text-sm font-medium">
                    Desired annual spending (£)
                  </Label>
                  <Input
                    id="annualSpending"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.annualSpending}
                    onChange={handleInputChange('annualSpending')}
                    placeholder="e.g., 40,000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="withdrawalRate" className="text-sm font-medium">
                      Withdrawal rate (%)
                    </Label>
                    <Input
                      id="withdrawalRate"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="0.1"
                      value={inputs.withdrawalRate}
                      onChange={handleInputChange('withdrawalRate')}
                      placeholder="e.g., 4"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearsToGoal" className="text-sm font-medium">
                      Years to model
                    </Label>
                    <Input
                      id="yearsToGoal"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="1"
                      value={inputs.yearsToGoal}
                      onChange={handleInputChange('yearsToGoal')}
                      placeholder="e.g., 15"
                    />
                  </div>
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
                    FIRE summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        FIRE number
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.fireNumber)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Projected balance
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.projectedBalance)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Remaining gap
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.gapToTarget)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Years to FIRE
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {Number.isFinite(results.yearsToFire)
                          ? `${results.yearsToFire} year${results.yearsToFire === 1 ? '' : 's'}`
                          : 'More than 80 years'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 p-4">
                    <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                      Target progress
                    </h3>
                    <ResultBreakdownChart data={chartData} title="FIRE number progress" />
                  </div>

                  {results.timeline.length ? (
                    <div className="space-y-3">
                      <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-100">
                        <TrendingUp className="h-5 w-5" />
                        Portfolio trajectory
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-emerald-100 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-xs uppercase tracking-wide">
                            <tr>
                              <th className="px-3 py-2">Year</th>
                              <th className="px-3 py-2">Balance</th>
                              <th className="px-3 py-2">Total contributions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.timeline.slice(0, 10).map((entry) => (
                              <tr
                                key={entry.year}
                                className="border-b border-emerald-100 dark:border-emerald-800"
                              >
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {entry.year}
                                </td>
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {currencyFormatter.format(entry.balance)}
                                </td>
                                <td className="px-3 py-2 text-emerald-900 dark:text-emerald-100">
                                  {currencyFormatter.format(entry.totalContributions)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {results.timeline.length > 10 ? (
                          <p className="text-xs text-emerald-700 dark:text-emerald-200 mt-2">
                            Showing first 10 years. Download the CSV for the full timeline.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  ) : null}

                  <ExportActions
                    csvData={csvData}
                    fileName="fire-calculator-results"
                    title="FIRE plan summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
              <Target className="h-5 w-5 text-emerald-500" aria-hidden="true" />
              <p className="text-sm">
                {hasCalculated && results?.message ? (
                  results.message
                ) : (
                  <>
                    Enter your portfolio, contributions, and desired lifestyle spending, then press{' '}
                    <strong>Calculate</strong> to see how close you are to financial independence.
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
