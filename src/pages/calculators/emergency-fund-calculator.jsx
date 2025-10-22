import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, LifeBuoy, Shield, PiggyBank, Trash2 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Emergency Fund Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/emergency-fund-calculator';
const keywords = getCalculatorKeywords('Emergency Fund Calculator');

const metaDescription =
  'Calculate your UK emergency fund target based on essential monthly expenses, savings progress, and planned contributions. Build a resilient buffer before life throws a curve ball.';

const defaultExpenses = [
  { id: 'housing', label: 'Housing & utilities', amount: '950' },
  { id: 'food', label: 'Groceries & essentials', amount: '300' },
  { id: 'transport', label: 'Transport & commuting', amount: '160' },
  { id: 'insurance', label: 'Insurance & healthcare', amount: '120' },
];

let idCounter = 30;
const newId = () => `expense-${idCounter++}`;

const defaultInputs = {
  monthsCover: '6',
  currentSavings: '2,500',
  monthlyContribution: '300',
};

const faqItems = [
  {
    question: 'How much should I keep in an emergency fund?',
    answer:
      'Aim for three to six months of essential living costs. Increase to nine or twelve months if you have dependants, variable income, or would take longer to find a new role.',
  },
  {
    question: 'What counts as an essential expense?',
    answer:
      'Include housing, utilities, food, transport, insurance, debt repayments, childcare, and any non-negotiable bills. Exclude holidays, memberships, and discretionary spending.',
  },
  {
    question: 'Where should I store my emergency fund?',
    answer:
      'Use a secure, easy-access savings account. Competitive interest is helpful, but capital safety and quick access matter most in an emergency.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Discover every UK calculator to support your financial wellbeing.',
  },
  {
    label: 'Budgeting & planning tools',
    url: '/#budgeting-planning',
    description: 'Keep spending aligned with your emergency fund goals.',
  },
  {
    label: 'Savings & investments hub',
    url: '/#savings-investments',
    description: 'Grow long-term reserves once your emergency buffer is secure.',
  },
];

const relatedCalculators = [
  {
    name: 'Budget Calculator',
    url: '/budget-calculator',
    description: 'Identify savings to fast-track your emergency fund.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Turn your target fund into monthly milestones.',
  },
  {
    name: 'Take-Home Pay Calculator',
    url: '/take-home-pay-calculator',
    description: 'Work out how much income you can channel into savings each month.',
  },
];

const schemaKeywords = [
  'Emergency fund calculator',
  'Financial cushion',
  'UK savings buffer',
  'Monthly essential expenses',
];

const webPageSchema = createCalculatorWebPageSchema({
  name: CALCULATOR_NAME,
  description: metaDescription,
  url: canonicalUrl,
  keywords,
});

const breadcrumbSchema = createCalculatorBreadcrumbs({
  name: CALCULATOR_NAME,
  url: canonicalUrl,
});

const faqStructuredData = faqSchema(faqItems);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatDuration = (months) => {
  if (!Number.isFinite(months) || months === Infinity) return 'Not reached with current plan';
  if (months <= 0) return 'Already funded';
  const totalMonths = Math.ceil(months);
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  if (years === 0) return `${totalMonths} month${totalMonths === 1 ? '' : 's'}`;
  if (remainingMonths === 0) return `${years} year${years === 1 ? '' : 's'}`;
  return `${years} yr ${remainingMonths} mo`;
};

const calculateEmergencyFund = ({ expenses, monthsCover, currentSavings, monthlyContribution }) => {
  const parsedExpenses = expenses.map((item) => ({
    ...item,
    amount: Math.max(item.amount, 0),
  }));

  const monthlyEssentialSpend = parsedExpenses.reduce((sum, item) => sum + item.amount, 0);

  if (monthlyEssentialSpend <= 0) {
    return {
      valid: false,
      message: 'Add at least one essential monthly expense to calculate your emergency fund target.',
    };
  }

  const months = Math.max(monthsCover, 0);
  const targetFund = monthlyEssentialSpend * months;
  const shortfall = Math.max(0, targetFund - currentSavings);
  const monthsToTarget =
    monthlyContribution > 0 ? Math.ceil(shortfall / monthlyContribution) : Infinity;

  return {
    valid: true,
    expenses: parsedExpenses,
    monthlyEssentialSpend,
    monthsCover: months,
    targetFund,
    currentSavings,
    monthlyContribution,
    shortfall,
    monthsToTarget,
    coverageAchieved: targetFund > 0 ? (currentSavings / targetFund) * 100 : 0,
    weeklyContributionNeeded:
      monthsToTarget === Infinity || monthsToTarget <= 0
        ? 0
        : Math.max(shortfall / (monthsToTarget * 4.345), 0),
  };
};

export default function EmergencyFundCalculatorPage() {
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleExpenseChange = (id, field) => (event) => {
    const { value } = event.target;
    setExpenses((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeExpense = (id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const addExpense = () => {
    setExpenses((prev) => [
      ...prev,
      { id: newId(), label: 'New essential expense', amount: '0' },
    ]);
  };

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleReset = () => {
    setExpenses(defaultExpenses);
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const parsedExpenses = expenses.map((item) => ({
      id: item.id,
      label: item.label || 'Essential expense',
      amount: sanitiseNumber(item.amount),
    }));

    const payload = {
      expenses: parsedExpenses,
      monthsCover: sanitiseNumber(inputs.monthsCover),
      currentSavings: sanitiseNumber(inputs.currentSavings),
      monthlyContribution: sanitiseNumber(inputs.monthlyContribution),
    };

    const outcome = calculateEmergencyFund(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return results.expenses
      .filter((item) => item.amount > 0)
      .map((item) => ({
        name: item.label,
        value: item.amount,
      }));
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const expenseRows = results.expenses.map((item) => [
      item.label,
      item.amount.toFixed(2),
    ]);
    return [
      ['Expense category', 'Monthly amount (£)'],
      ...expenseRows,
      [],
      ['Metric', 'Value'],
      ['Monthly essential spend (£)', results.monthlyEssentialSpend.toFixed(2)],
      ['Months of cover', results.monthsCover],
      ['Emergency fund target (£)', results.targetFund.toFixed(2)],
      ['Current savings (£)', results.currentSavings.toFixed(2)],
      ['Monthly contribution (£)', results.monthlyContribution.toFixed(2)],
      ['Shortfall (£)', results.shortfall.toFixed(2)],
      ['Coverage achieved (%)', results.coverageAchieved.toFixed(2)],
      ['Months to target', Number.isFinite(results.monthsToTarget) ? results.monthsToTarget : 'Not reached'],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Build Your Safety Net`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={schemaKeywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Emergency Fund Calculator
          </Heading>
          <p className="calculator-hero__description">
            Build a resilient financial cushion that keeps the lights on when life suddenly changes.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Security creates space to breathe"
          message="An emergency fund turns shocks into inconveniences. Every pound saved here is a promise to your future self that you will handle whatever comes next."
          quote="Do not save what is left after spending, but spend what is left after saving."
          author="Warren Buffett"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border border-teal-200 dark:border-teal-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-teal-500" />
                Essential expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center border border-teal-100 dark:border-teal-900 rounded-md p-3 bg-white dark:bg-slate-900"
                >
                  <Input
                    value={item.label}
                    onChange={handleExpenseChange(item.id, 'label')}
                    placeholder="e.g., Housing & utilities"
                  />
                  <Input
                    value={item.amount}
                    inputMode="decimal"
                    onChange={handleExpenseChange(item.id, 'amount')}
                    className="md:w-28"
                    placeholder="e.g., 950"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExpense(item.id)}
                    aria-label="Remove expense"
                    className="justify-self-end text-teal-600 hover:text-teal-700 dark:text-teal-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addExpense}>
                Add essential cost
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-teal-200 dark:border-teal-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <LifeBuoy className="h-5 w-5 text-teal-500" />
                Fund parameters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="monthsCover" className="text-sm font-medium">
                    Months of cover
                  </Label>
                  <Input
                    id="monthsCover"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={inputs.monthsCover}
                    onChange={handleInputChange('monthsCover')}
                    placeholder="e.g., 6"
                  />
                </div>
                <div>
                  <Label htmlFor="currentSavings" className="text-sm font-medium">
                    Current emergency savings (£)
                  </Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="10"
                    value={inputs.currentSavings}
                    onChange={handleInputChange('currentSavings')}
                    placeholder="e.g., 2,500"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyContribution" className="text-sm font-medium">
                    Planned monthly contribution (£)
                  </Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="10"
                    value={inputs.monthlyContribution}
                    onChange={handleInputChange('monthlyContribution')}
                    placeholder="e.g., 300"
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
        </div>
      </CalculatorWrapper>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        {showResults ? (
          <div className="space-y-6">
            <Card className="border border-teal-200 dark:border-teal-900 bg-teal-50 dark:bg-teal-900/20 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-teal-900 dark:text-teal-100">
                  <Shield className="h-5 w-5" />
                  Emergency fund summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-white/80 dark:bg-teal-900/40 p-4 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-200">
                      Monthly essentials
                    </p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {currencyFormatter.format(results.monthlyEssentialSpend)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-teal-900/40 p-4 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-200">
                      Fund target ({results.monthsCover} months)
                    </p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {currencyFormatter.format(results.targetFund)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-teal-900/40 p-4 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-200">
                      Current savings
                    </p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {currencyFormatter.format(results.currentSavings)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-teal-900/40 p-4 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-200">
                      Buffer funded
                    </p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {percentageFormatter.format(Math.min(results.coverageAchieved, 999))}%
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-white/80 dark:bg-teal-900/40 p-4 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-200">
                      Shortfall
                    </p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {currencyFormatter.format(results.shortfall)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-teal-900/40 p-4 border border-teal-100 dark:border-teal-800">
                    <p className="text-xs uppercase tracking-wide text-teal-700 dark:text-teal-200">
                      Time to target
                    </p>
                    <p className="text-2xl font-bold text-teal-900 dark:text-teal-100">
                      {formatDuration(results.monthsToTarget)}
                    </p>
                    <p className="text-xs text-teal-700 dark:text-teal-200">
                      Based on a £{results.monthlyContribution.toFixed(0)} monthly contribution.
                    </p>
                  </div>
                </div>

                <div className="rounded-md bg-white dark:bg-slate-900 border border-teal-100 dark:border-teal-900 p-4">
                  <h3 className="text-base font-semibold text-teal-900 dark:text-teal-100 mb-4">
                    Monthly expense breakdown
                  </h3>
                  <ResultBreakdownChart data={chartData} title="Emergency fund expense split" />
                </div>

                <ExportActions
                  csvData={csvData}
                  fileName="emergency-fund-calculator-results"
                  title="Emergency fund summary"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
              <PiggyBank className="h-5 w-5 text-teal-500" aria-hidden="true" />
              <p className="text-sm">
                {hasCalculated && results?.message ? (
                  results.message
                ) : (
                  <>
                    List your essential monthly costs, choose how many months of cover you want, then press{' '}
                    <strong>Calculate</strong> to get a savings roadmap.
                  </>
                )}
              </p>
            </CardContent>
          </Card>
        )}
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
