import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, BarChart3 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
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

const CALCULATOR_NAME = 'Investment Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/investment-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Project the future value of UK investments with compound growth, contribution increases, and annual top-ups.';

const compoundingOptions = [
  { value: 1, label: 'Annually' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
  { value: 365, label: 'Daily (approx.)' },
];

const defaultInputs = {
  initialInvestment: '10,000',
  monthlyContribution: '400',
  annualContributionGrowth: '3',
  annualReturn: '7',
  compoundingFrequency: '12',
  years: '20',
  annualTopUp: '1,000',
};

const faqItems = [
  {
    question: 'How does compounding frequency influence returns?',
    answer:
      'More frequent compounding credits growth to your balance more often. Switching from annual to monthly compounding slightly increases long-term gains.',
  },
  {
    question: 'Can I simulate annual pay rises or contribution increases?',
    answer:
      'Yes. Enter a contribution growth rate to automatically scale monthly deposits each year. Add an optional annual top-up for bonuses or lump sums.',
  },
  {
    question: 'Do the calculations allow for charges or inflation?',
    answer:
      'This calculator models growth before fees and inflation. Run scenarios with lower returns to reflect platform charges or rising costs.',
  },
];

const relatedCalculators = [
  {
    name: 'ISA Calculator',
    url: '/isa-calculator',
    description: 'Plan tax-free contributions and government bonuses for ISAs.',
  },
  {
    name: 'Retirement Savings Calculator',
    url: '/retirement-savings-calculator',
    description: 'Map retirement pot growth across multiple investment accounts.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Break investment targets into manageable monthly savings.',
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

const calculateMonthlyRate = (annualReturn, compoundingFrequency) => {
  const annualRate = Math.max(annualReturn, 0) / 100;
  const periodsPerYear = Math.max(compoundingFrequency, 1);
  return Math.pow(1 + annualRate / periodsPerYear, periodsPerYear / 12) - 1;
};

const projectInvestment = ({
  initialInvestment,
  monthlyContribution,
  annualContributionGrowth,
  annualReturn,
  compoundingFrequency,
  years,
  annualTopUp,
}) => {
  if (years <= 0) {
    return { valid: false, message: 'Enter a time horizon greater than zero years.' };
  }

  const months = Math.round(years * 12);
  const monthlyRate = calculateMonthlyRate(annualReturn, compoundingFrequency);
  const contributionGrowthRate = Math.max(annualContributionGrowth, 0) / 100;
  const topUp = Math.max(annualTopUp, 0);

  let balance = Math.max(initialInvestment, 0);
  let totalContributions = balance;

  const snapshots = [];

  for (let month = 1; month <= months; month += 1) {
    const yearIndex = Math.floor((month - 1) / 12);
    const adjustedContribution =
      Math.max(monthlyContribution, 0) * Math.pow(1 + contributionGrowthRate, yearIndex);

    balance += adjustedContribution;
    totalContributions += adjustedContribution;

    if (month % 12 === 0) {
      balance += topUp;
      totalContributions += topUp;
    }

    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }

    if (month % 12 === 0) {
      const year = month / 12;
      snapshots.push({
        year,
        balance,
        contributions: totalContributions,
        growth: balance - totalContributions,
      });
    }
  }

  const growth = balance - totalContributions;
  return {
    valid: true,
    finalBalance: balance,
    totalContributions,
    growth,
    snapshots,
  };
};

const calculateCagr = ({ initialInvestment, totalContributions, finalBalance, years }) => {
  if (years <= 0 || finalBalance <= 0) return 0;
  const initial = Math.max(initialInvestment, 0);
  const contributions = Math.max(totalContributions, 0);
  if (contributions === 0) return 0;

  const averageInvested = (initial + contributions) / 2 || 1;
  return Math.pow(finalBalance / averageInvested, 1 / years) - 1;
};

export default function InvestmentCalculatorPage() {
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
      initialInvestment: sanitiseNumber(inputs.initialInvestment),
      monthlyContribution: sanitiseNumber(inputs.monthlyContribution),
      annualContributionGrowth: sanitiseNumber(inputs.annualContributionGrowth),
      annualReturn: sanitiseNumber(inputs.annualReturn),
      compoundingFrequency: Number(inputs.compoundingFrequency),
      years: sanitiseNumber(inputs.years),
      annualTopUp: sanitiseNumber(inputs.annualTopUp),
    };
    const projection = projectInvestment(payload);
    if (!projection.valid) {
      setResults(projection);
      setHasCalculated(true);
      return;
    }

    const cagr = calculateCagr({
      initialInvestment: payload.initialInvestment,
      totalContributions: projection.totalContributions,
      finalBalance: projection.finalBalance,
      years: payload.years,
    });

    setResults({
      ...projection,
      cagr,
      payload,
    });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Total contributions', value: results.totalContributions, color: '#0ea5e9' },
      { name: 'Investment growth', value: results.growth, color: '#22c55e' },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid || !results.snapshots) return null;
    const rows = [
      ['Metric', 'Value'],
      ['Initial investment (£)', results.payload.initialInvestment.toFixed(2)],
      ['Monthly contribution (£)', results.payload.monthlyContribution.toFixed(2)],
      ['Contribution growth (%)', results.payload.annualContributionGrowth.toFixed(2)],
      ['Annual top-up (£)', results.payload.annualTopUp.toFixed(2)],
      ['Annual return (%)', results.payload.annualReturn.toFixed(2)],
      ['Years invested', results.payload.years.toFixed(1)],
      ['Compounding frequency (per year)', results.payload.compoundingFrequency],
      ['Total contributions (£)', results.totalContributions.toFixed(2)],
      ['Investment growth (£)', results.growth.toFixed(2)],
      ['Final balance (£)', results.finalBalance.toFixed(2)],
      ['Approximate CAGR (%)', (results.cagr * 100).toFixed(2)],
      [],
      ['Year', 'Balance (£)', 'Cumulative contributions (£)', 'Growth (£)'],
    ];
    results.snapshots.slice(0, 20).forEach((snapshot) => {
      rows.push([
        snapshot.year,
        snapshot.balance.toFixed(2),
        snapshot.contributions.toFixed(2),
        snapshot.growth.toFixed(2),
      ]);
    });
    return rows;
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Compound Growth Planner`}</title>
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
            Investment Calculator
          </Heading>
          <p className="calculator-hero__description">
            Forecast your portfolio growth with compound interest, contribution increases, and annual top-ups.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Let compounding carry more of the load"
          message="When you understand how contributions and growth work together, it’s easier to stay invested through market noise and delayed gratification."
          quote="The stock market is a device for transferring money from the impatient to the patient."
          author="Warren Buffett"
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
                  <Label htmlFor="initialInvestment" className="text-sm font-medium">
                    Initial investment (£)
                  </Label>
                  <Input
                    id="initialInvestment"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.initialInvestment}
                    onChange={handleInputChange('initialInvestment')}
                    placeholder="e.g., 10,000"
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
                    placeholder="e.g., 400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualContributionGrowth" className="text-sm font-medium">
                      Contribution growth (% p.a.)
                    </Label>
                    <Input
                      id="annualContributionGrowth"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={inputs.annualContributionGrowth}
                      onChange={handleInputChange('annualContributionGrowth')}
                      placeholder="e.g., 3"
                    />
                  </div>
                  <div>
                    <Label htmlFor="annualTopUp" className="text-sm font-medium">
                      Annual top-up (£)
                    </Label>
                    <Input
                      id="annualTopUp"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.annualTopUp}
                      onChange={handleInputChange('annualTopUp')}
                      placeholder="e.g., 1,000"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualReturn" className="text-sm font-medium">
                      Expected return (% p.a.)
                    </Label>
                    <Input
                      id="annualReturn"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={inputs.annualReturn}
                      onChange={handleInputChange('annualReturn')}
                      placeholder="e.g., 7"
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
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="compoundingFrequency" className="text-sm font-medium">
                    Compounding frequency
                  </Label>
                  <select
                    id="compoundingFrequency"
                    value={inputs.compoundingFrequency}
                    onChange={handleSelectChange('compoundingFrequency')}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    {compoundingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
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
              <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    <TrendingUp className="h-5 w-5" />
                    Projection summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Final balance
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter(results.finalBalance)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Total contributions
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter(results.totalContributions)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Investment growth
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter(results.growth)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Approximate CAGR
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {(results.cagr * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      Contributions vs growth
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Investment breakdown" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="investment-calculator-results"
                    title="Investment projection summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <BarChart3 className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your contributions, returns, and timeframe, then press{' '}
                        <strong>Calculate</strong> to see how your portfolio could grow.
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
<RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
