import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, Sparkles } from 'lucide-react';

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

const CALCULATOR_NAME = 'ISA Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/isa-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Plan ISA contributions, Lifetime ISA bonuses, and tax-free investment growth using the latest UK allowances.';

const ISA_ANNUAL_ALLOWANCE = 20000;
const LIFETIME_ISA_BONUS_RATE = 0.25;
const LIFETIME_ISA_CAP = 4000;

const defaultInputs = {
  initialBalance: '5,000',
  monthlyContribution: '600',
  annualReturn: '5',
  years: '10',
  includeLifetimeIsa: 'no',
};

const faqItems = [
  {
    question: 'What is the current ISA allowance?',
    answer:
      'For the 2025/26 tax year you can invest up to £20,000 across all your ISAs. The calculator warns you if planned contributions exceed this limit.',
  },
  {
    question: 'How does the Lifetime ISA bonus work?',
    answer:
      'The government adds 25% on the first £4,000 per tax year into a Lifetime ISA. The calculator adds this bonus monthly so you can see the boost to tax-free growth.',
  },
  {
    question: 'Can I use this for Stocks & Shares ISAs?',
    answer:
      'Yes. Adjust the annual return to reflect your expected investment performance, net of platform charges.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Compare every tax-free savings and investment tool we provide.',
  },
  {
    label: 'Savings & investments tools',
    url: '/#savings-investments',
    description: 'Optimise ISAs alongside pensions, LISAs, and general investment accounts.',
  },
  {
    label: 'Lifetime ISA bonus rules',
    url: '/resources',
    description: 'Read our guide to Lifetime ISA eligibility and withdrawal restrictions.',
  },
];

const relatedCalculators = [
  {
    name: 'Investment Calculator',
    url: '/investment-calculator',
    description: 'Project detailed investment growth using contributions and top-ups.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Translate ISA targets into manageable monthly savings.',
  },
  {
    name: 'Future Value Calculator',
    url: '/future-value-calculator',
    description: 'See how compound interest works outside an ISA wrapper.',
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

const calculateIsaGrowth = ({
  initialBalance,
  monthlyContribution,
  annualReturn,
  years,
  includeLifetimeIsa,
}) => {
  if (years <= 0) {
    return { valid: false, message: 'Enter an investment timeframe greater than zero years.' };
  }

  const months = Math.round(years * 12);
  const monthlyRate = Math.max(annualReturn, 0) / 100 / 12;
  let balance = Math.max(initialBalance, 0);
  let totalContributions = balance;
  let lifetimeBonus = 0;
  const warnings = [];

  const annualContribution = monthlyContribution * 12;
  if (annualContribution > ISA_ANNUAL_ALLOWANCE) {
    warnings.push(
      `You plan to contribute £${annualContribution.toLocaleString(
        'en-GB'
      )} per year, which exceeds the £${ISA_ANNUAL_ALLOWANCE.toLocaleString('en-GB')} ISA allowance.`
    );
  }
  if (includeLifetimeIsa === 'yes' && annualContribution > LIFETIME_ISA_CAP) {
    warnings.push(
      `Lifetime ISA bonuses apply to the first £${LIFETIME_ISA_CAP.toLocaleString(
        'en-GB'
      )} of contributions per tax year. Contributions above this amount will not receive the 25% bonus.`
    );
  }

  for (let month = 1; month <= months; month += 1) {
    const contribution = Math.max(monthlyContribution, 0);
    balance += contribution;
    totalContributions += contribution;

    if (includeLifetimeIsa === 'yes') {
      const monthInYear = ((month - 1) % 12) + 1;
      const contributionThisYear = contribution;
      const annualAllowanceUsed = Math.min(contributionThisYear, LIFETIME_ISA_CAP / 12);
      const bonus = annualAllowanceUsed * LIFETIME_ISA_BONUS_RATE;
      balance += bonus;
      lifetimeBonus += bonus;
    }

    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }
  }

  const growth = balance - totalContributions - lifetimeBonus;

  return {
    valid: true,
    balance,
    totalContributions,
    lifetimeBonus,
    growth,
    warnings,
  };
};

export default function IsaCalculatorPage() {
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
      initialBalance: sanitiseNumber(inputs.initialBalance),
      monthlyContribution: sanitiseNumber(inputs.monthlyContribution),
      annualReturn: sanitiseNumber(inputs.annualReturn),
      years: sanitiseNumber(inputs.years),
      includeLifetimeIsa: inputs.includeLifetimeIsa,
    };
    const outcome = calculateIsaGrowth(payload);
    setResults({ ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Contributions', value: results.totalContributions, color: '#0ea5e9' },
      { name: 'Lifetime ISA bonus', value: results.lifetimeBonus, color: '#facc15' },
      { name: 'Investment growth', value: results.growth, color: '#22c55e' },
    ].filter((segment) => segment.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Initial balance (£)', results.payload.initialBalance.toFixed(2)],
      ['Monthly contribution (£)', results.payload.monthlyContribution.toFixed(2)],
      ['Annual return (%)', results.payload.annualReturn.toFixed(2)],
      ['Years invested', results.payload.years.toFixed(1)],
      ['Lifetime ISA bonus applied', results.payload.includeLifetimeIsa === 'yes' ? 'Yes' : 'No'],
      ['Total contributions (£)', results.totalContributions.toFixed(2)],
      ['Lifetime ISA bonus (£)', results.lifetimeBonus.toFixed(2)],
      ['Investment growth (£)', results.growth.toFixed(2)],
      ['Final balance (£)', results.balance.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Tax-Free Savings Planner`}</title>
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
            ISA Calculator
          </Heading>
          <p className="calculator-hero__description">
            Plan Cash, Stocks & Shares, and Lifetime ISA contributions while tracking government bonuses and tax-free growth.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Let tax-free wrappers work harder for you"
          message="Intentional ISA contributions and timely top-ups help you ring-fence growth from HMRC and keep goals on schedule."
          quote="Small steps taken consistently over time create big results."
          author="Unknown"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                ISA inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="initialBalance" className="text-sm font-medium">
                    Current ISA balance (£)
                  </Label>
                  <Input
                    id="initialBalance"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.initialBalance}
                    onChange={handleInputChange('initialBalance')}
                    placeholder="e.g., 5,000"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyContribution" className="text-sm font-medium">
                    Monthly contribution (£)
                  </Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="10"
                    value={inputs.monthlyContribution}
                    onChange={handleInputChange('monthlyContribution')}
                    placeholder="e.g., 600"
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
                    placeholder="e.g., 5"
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
                    min="1"
                    step="1"
                    value={inputs.years}
                    onChange={handleInputChange('years')}
                    placeholder="e.g., 10"
                  />
                </div>
                <div>
                  <Label htmlFor="includeLifetimeIsa" className="text-sm font-medium">
                    Apply Lifetime ISA bonus?
                  </Label>
                  <select
                    id="includeLifetimeIsa"
                    value={inputs.includeLifetimeIsa}
                    onChange={handleSelectChange('includeLifetimeIsa')}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
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
                    ISA projection summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {results.warnings?.length ? (
                    <ul className="space-y-2 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-600 dark:bg-amber-900/20 dark:text-amber-100">
                      {results.warnings.map((warning, index) => (
                        <li key={`warning-${index}`}>{warning}</li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Final ISA value
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter(results.balance)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Total contributions
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter(results.totalContributions)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Lifetime ISA bonus
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter(results.lifetimeBonus)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Investment growth
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter(results.growth)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 p-4">
                    <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                      Tax-free growth breakdown
                    </h3>
                    <ResultBreakdownChart data={chartData} title="ISA growth breakdown" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="isa-calculator-results"
                    title="ISA growth summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Sparkles className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your current balance, monthly savings, and expected returns, then press{' '}
                        <strong>Calculate</strong> to see your ISA projection.
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
