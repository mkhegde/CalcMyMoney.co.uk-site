import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, BarChart2 } from 'lucide-react';

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

const CALCULATOR_NAME = 'Future Value Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/future-value-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Project the future value of UK savings and investments by combining compound interest with regular contributions and realistic time horizons.';

const defaultInputs = {
  startingPrincipal: '15,000',
  annualInterestRate: '6',
  years: '15',
  contributionAmount: '300',
  contributionFrequency: 'monthly',
  compounding: 'monthly',
};

const contributionFrequencies = [
  { value: 'none', label: 'No regular contributions', periods: 0 },
  { value: 'monthly', label: 'Monthly contributions', periods: 12 },
  { value: 'quarterly', label: 'Quarterly contributions', periods: 4 },
  { value: 'annually', label: 'Annual contributions', periods: 1 },
];

const compoundingOptions = [
  { value: 'annual', label: 'Annual', periods: 1 },
  { value: 'semiannual', label: 'Semi-annual', periods: 2 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'monthly', label: 'Monthly', periods: 12 },
  { value: 'daily', label: 'Daily (approx. 365)', periods: 365 },
];

const faqItems = [
  {
    question: 'How does compounding frequency affect my future value?',
    answer:
      'Compounding more often means interest is added to your balance more frequently, accelerating growth. Monthly compounding produces a higher future value than annual compounding at the same rate.',
  },
  {
    question: 'Should I include regular contributions?',
    answer:
      'Yes. Contributions made throughout the year dramatically increase your future value. The calculator converts your chosen contribution frequency into the compounding period to keep the maths accurate.',
  },
  {
    question: 'Which interest rate should I use?',
    answer:
      'Use an average annual return based on your investment mix. For a conservative estimate, try a lower rate or reduce the timescale to see how risk impacts your long-term goals.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Discover every savings, mortgage, and tax calculator on Calc My Money.',
  },
  {
    label: 'Savings & investments tools',
    url: '/#savings-investments',
    description: 'Optimise ISA allowances, compound growth, and long-term wealth goals.',
  },
  {
    label: 'Retirement savings planner',
    url: '/retirement-savings-calculator',
    description: 'Translate your future value into retirement-ready income.',
  },
];

const relatedCalculators = [
  {
    name: 'Compound Interest Calculator',
    url: '/compound-interest-calculator',
    description: 'See how lump sums and regular contributions grow over time.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Turn your future value target into monthly savings milestones.',
  },
  {
    name: 'Investment Calculator',
    url: '/investment-calculator',
    description: 'Model real-world investment returns using contributions and fees.',
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

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const calculateFutureValue = ({
  startingPrincipal,
  annualInterestRate,
  years,
  contributionAmount,
  contributionFrequency,
  compounding,
}) => {
  const principal = Math.max(startingPrincipal, 0);
  const rate = Math.max(annualInterestRate, 0) / 100;
  const termYears = Math.max(years, 0);
  const contribution = Math.max(contributionAmount, 0);

  const compoundingMeta =
    compoundingOptions.find((option) => option.value === compounding) || compoundingOptions[3];
  const contributionMeta =
    contributionFrequencies.find((option) => option.value === contributionFrequency) ||
    contributionFrequencies[1];

  const periodsPerYear = compoundingMeta.periods;
  const totalPeriods = Math.round(termYears * periodsPerYear);
  const periodicRate = periodsPerYear > 0 ? rate / periodsPerYear : 0;
  const contributionPerPeriod =
    contributionMeta.periods === 0
      ? 0
      : (contribution * contributionMeta.periods) / periodsPerYear;

  if (principal <= 0 && contributionPerPeriod <= 0) {
    return {
      valid: false,
      message:
        'Enter a starting amount or add regular contributions to forecast your investment growth.',
    };
  }

  const growthFactor = Math.pow(1 + periodicRate, totalPeriods);
  const futurePrincipal = principal * growthFactor;

  let futureContributions = 0;
  if (contributionPerPeriod > 0) {
    if (periodicRate === 0) {
      futureContributions = contributionPerPeriod * totalPeriods;
    } else {
      futureContributions = contributionPerPeriod * ((growthFactor - 1) / periodicRate);
    }
  }

  const futureValue = futurePrincipal + futureContributions;
  const totalInvested =
    principal +
    (contributionMeta.periods === 0 ? 0 : contribution * contributionMeta.periods * termYears);
  const growth = futureValue - totalInvested;

  return {
    valid: true,
    futureValue,
    futurePrincipal,
    futureContributions,
    totalInvested,
    growth,
    principal,
    contribution,
    contributionFrequency: contributionMeta.label,
    compounding: compoundingMeta.label,
    annualInterestRate,
    years: termYears,
  };
};

export default function FutureValueCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field) => (event) => {
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
      startingPrincipal: sanitiseNumber(inputs.startingPrincipal),
      annualInterestRate: sanitiseNumber(inputs.annualInterestRate),
      years: sanitiseNumber(inputs.years),
      contributionAmount: sanitiseNumber(inputs.contributionAmount),
      contributionFrequency: inputs.contributionFrequency,
      compounding: inputs.compounding,
    };
    const outcome = calculateFutureValue(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Total invested', value: results.totalInvested, color: '#0ea5e9' },
      { name: 'Investment growth', value: results.growth, color: '#22c55e' },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Starting principal (£)', results.principal.toFixed(2)],
      ['Annual interest rate (%)', results.annualInterestRate.toFixed(2)],
      ['Years invested', results.years.toFixed(1)],
      ['Contribution amount (£)', results.contribution.toFixed(2)],
      ['Contribution frequency', results.contributionFrequency],
      ['Compounding frequency', results.compounding],
      ['Future value (£)', results.futureValue.toFixed(2)],
      ['Future value of principal (£)', results.futurePrincipal.toFixed(2)],
      ['Future value of contributions (£)', results.futureContributions.toFixed(2)],
      ['Total invested (£)', results.totalInvested.toFixed(2)],
      ['Total growth (£)', results.growth.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Compound Growth Forecast`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Future Value Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Forecast how savings and investments grow when compound interest and regular contributions work together.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Start where you are, grow what you have"
          message="When you can picture tomorrow’s balance, it becomes easier to automate today’s transfer. Let the numbers keep you focused when motivation dips."
          quote="Do something today that your future self will thank you for."
          author="Sean Patrick Flanery"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Investment inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="startingPrincipal" className="text-sm font-medium">
                    Starting principal (£)
                  </Label>
                  <Input
                    id="startingPrincipal"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.startingPrincipal}
                    onChange={handleInputChange('startingPrincipal')}
                    placeholder="e.g., 15,000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualInterestRate" className="text-sm font-medium">
                      Annual interest rate (%)
                    </Label>
                    <Input
                      id="annualInterestRate"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={inputs.annualInterestRate}
                      onChange={handleInputChange('annualInterestRate')}
                      placeholder="e.g., 6"
                    />
                  </div>
                  <div>
                    <Label htmlFor="years" className="text-sm font-medium">
                      Years invested
                    </Label>
                    <Input
                      id="years"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={inputs.years}
                      onChange={handleInputChange('years')}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contributionAmount" className="text-sm font-medium">
                    Contribution amount (£)
                  </Label>
                  <Input
                    id="contributionAmount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="10"
                    value={inputs.contributionAmount}
                    onChange={handleInputChange('contributionAmount')}
                    placeholder="e.g., 300"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contributionFrequency" className="text-sm font-medium">
                      Contribution frequency
                    </Label>
                    <select
                      id="contributionFrequency"
                      value={inputs.contributionFrequency}
                      onChange={handleSelectChange('contributionFrequency')}
                      className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      {contributionFrequencies.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="compounding" className="text-sm font-medium">
                      Compounding frequency
                    </Label>
                    <select
                      id="compounding"
                      value={inputs.compounding}
                      onChange={handleSelectChange('compounding')}
                      className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      {compoundingOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
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
              <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    <TrendingUp className="h-5 w-5" />
                    Growth summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Future value
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.futureValue)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Total invested
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.totalInvested)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Investment growth
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.growth)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Contribution summary
                      </p>
                      <p className="text-sm text-indigo-800 dark:text-indigo-200">
                        {results.contributionFrequency} · {results.compounding}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      Growth breakdown
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Future value composition" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="future-value-calculator-results"
                    title="Future value projection"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <BarChart2 className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your starting balance, interest rate, and contribution plan, then press{' '}
                        <strong>Calculate</strong> to see your future value.
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
