import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, LineChart } from 'lucide-react';

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

const CALCULATOR_NAME = 'Inflation Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/inflation-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'See how UK inflation erodes purchasing power. Estimate the future cost of today’s spending or the present value of future goals.';

const defaultInputs = {
  amount: '10,000',
  years: '5',
  annualInflation: '3.1',
};

const faqItems = [
  {
    question: 'Where can I find up-to-date UK inflation rates?',
    answer:
      'The Office for National Statistics (ONS) publishes CPI and CPIH each month. Use the latest CPIH figure for a broad measure of consumer prices.',
  },
  {
    question: 'Can I work out the value of past amounts?',
    answer:
      'Yes. Enter the number of years since the purchase. The calculator shows how much that amount would cost today and how the same cash would feel after inflation.',
  },
  {
    question: 'What if inflation changes each year?',
    answer:
      'This tool compounds a single average inflation rate. Recalculate when new data is released or to compare best- and worst-case scenarios.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Discover every savings, mortgage, and budgeting calculator in one place.',
  },
  {
    label: 'Budgeting & planning tools',
    url: '/#budgeting-planning',
    description: 'Plan everyday spending alongside long-term inflation expectations.',
  },
  {
    label: 'Investment Calculator',
    url: '/investment-calculator',
    description: 'Compare inflation-adjusted growth with potential investment returns.',
  },
];

const relatedCalculators = [
  {
    name: 'Future Value Calculator',
    url: '/future-value-calculator',
    description: 'Project investment growth to stay ahead of rising prices.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Translate inflation-aware targets into monthly savings amounts.',
  },
  {
    name: 'Cost of Living Calculator',
    url: '/cost-of-living-calculator',
    description: 'See how household budgets change between UK cities.',
  },
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

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  });

const computeInflation = ({ amount, years, annualInflation }) => {
  if (amount <= 0) {
    return { valid: false, message: 'Enter an amount to see how inflation changes its value.' };
  }
  if (years === 0) {
    return { valid: false, message: 'Add a number of years greater than zero to model inflation.' };
  }

  const inflationMultiplier = (1 + annualInflation / 100) ** Math.abs(years);
  const futureValue = years > 0 ? amount * inflationMultiplier : amount / inflationMultiplier;
  const difference = futureValue - amount;
  const erosion = years > 0 ? difference : amount - futureValue;

  return {
    valid: true,
    futureValue,
    difference,
    inflationMultiplier,
    annualInflation,
    years,
    erosion,
  };
};

export default function InflationCalculatorPage() {
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
      amount: sanitiseNumber(inputs.amount),
      years: sanitiseNumber(inputs.years),
      annualInflation: sanitiseNumber(inputs.annualInflation),
    };
    const outcome = computeInflation(payload);
    setResults({ ...outcome, amount: payload.amount });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    const today = results.years >= 0 ? results.amount : results.futureValue;
    const future = results.years >= 0 ? results.futureValue : results.amount;
    return [
      { name: results.years >= 0 ? 'Value today' : 'Original value', value: today, color: '#0ea5e9' },
      { name: results.years >= 0 ? 'Cost in future' : 'Today’s equivalent', value: future, color: '#f97316' },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Original amount (£)', results.amount.toFixed(2)],
      ['Years projected', results.years.toFixed(1)],
      ['Annual inflation rate (%)', results.annualInflation.toFixed(2)],
      [results.years >= 0 ? 'Future cost (£)' : 'Present-day equivalent (£)', results.futureValue.toFixed(2)],
      ['Inflation multiplier', results.inflationMultiplier.toFixed(4)],
      ['Change in value (£)', results.difference.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | UK Inflation Impact`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Inflation Calculator
          </Heading>
          <p className="calculator-hero__description">
            Estimate how rising prices change the real-world value of your money over time.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Protect tomorrow’s spending power"
          message="Seeing how inflation chips away at savings keeps you proactive—whether that means negotiating pay, trimming costs, or investing for growth."
          quote="Inflation is taxation without legislation."
          author="Milton Friedman"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Inflation inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="amount" className="text-sm font-medium">
                    Amount (£)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.amount}
                    onChange={handleInputChange('amount')}
                    placeholder="e.g., 10,000"
                  />
                </div>
                <div>
                  <Label htmlFor="years" className="text-sm font-medium">
                    Years into the future
                  </Label>
                  <Input
                    id="years"
                    type="number"
                    inputMode="decimal"
                    step="1"
                    value={inputs.years}
                    onChange={handleInputChange('years')}
                    placeholder="e.g., 5"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Use a positive number to project forwards or a negative number to look back in time.
                  </p>
                </div>
                <div>
                  <Label htmlFor="annualInflation" className="text-sm font-medium">
                    Average annual inflation (%)
                  </Label>
                  <Input
                    id="annualInflation"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={inputs.annualInflation}
                    onChange={handleInputChange('annualInflation')}
                    placeholder="e.g., 3.1"
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
              <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    <TrendingUp className="h-5 w-5" />
                    Inflation impact summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Original amount
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter(results.amount)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        {results.years >= 0 ? 'Future cost' : 'Today’s equivalent'}
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter(results.futureValue)}
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-200">
                        Inflation multiplier: {results.inflationMultiplier.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-indigo-900 dark:text-indigo-100">
                    This {results.years >= 0 ? 'will cost' : 'would be worth'}{' '}
                    <strong>{currencyFormatter(Math.abs(results.difference))}</strong>{' '}
                    {results.years >= 0 ? 'more' : 'less'} after {Math.abs(results.years)}{' '}
                    {Math.abs(results.years) === 1 ? 'year' : 'years'} with inflation averaging{' '}
                    {results.annualInflation.toFixed(1)}% per year.
                  </p>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      Inflation comparison
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Inflation comparison" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="inflation-calculator-results"
                    title="Inflation calculator results"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <LineChart className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter an amount, the number of years, and an inflation rate, then press{' '}
                        <strong>Calculate</strong> to see how purchasing power shifts.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
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
