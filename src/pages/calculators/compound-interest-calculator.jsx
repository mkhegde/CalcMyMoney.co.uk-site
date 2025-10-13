import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'compound interest calculator',
  'find compound interest calculator',
  'calculating compound interest calculator',
  'compound interest',
  'daily compound interest calculator',
  'compound interest formula calculator',
  'compound interest savings calculator',
  'compound interest calculator monthly',
  'compound interest calculator uk',
  'compound interest calculator yearly',
  'compound interest calculator daily',
  'compound interest calculator with monthly contributions',
];

const metaDescription =
  'Use our compound interest calculator to model growth, compare calculating compound interest calculator options, and see how a compound interest savings calculator powers your goals.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/compound-interest-calculator';
const schemaKeywords = keywords.slice(0, 5);

const compoundingFrequencies = [
  { value: 'annual', label: 'Yearly', periods: 1 },
  { value: 'semiannual', label: 'Twice per year', periods: 2 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'monthly', label: 'Monthly', periods: 12 },
  { value: 'daily', label: 'Daily', periods: 365 },
];

const contributionFrequencies = [
  { value: 'monthly', label: 'Monthly', periods: 12 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'annually', label: 'Annually', periods: 1 },
];

const defaultInputs = {
  principal: 10000,
  annualRate: 6,
  years: 15,
  compounding: 'monthly',
  contribution: 250,
  contributionFrequency: 'monthly',
  contributionIncreaseRate: 2,
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const calculateCompoundInterest = (inputs) => {
  const principal = Number(inputs.principal) || 0;
  const annualRate = Number(inputs.annualRate) || 0;
  const years = Number(inputs.years) || 0;
  const compounding = compoundingFrequencies.find((item) => item.value === inputs.compounding);
  const contributionFrequency = contributionFrequencies.find(
    (item) => item.value === inputs.contributionFrequency
  );
  const contribution = Number(inputs.contribution) || 0;
  const contributionIncreaseRate = Number(inputs.contributionIncreaseRate) || 0;

  if (!compounding || !contributionFrequency) {
    return { totalContributions: 0, totalInterest: 0, futureValue: principal, timeline: [] };
  }

  const periods = years * compounding.periods;
  const ratePerPeriod = annualRate / 100 / compounding.periods;
  const contributionPeriods = compounding.periods / contributionFrequency.periods;
  const contributionIncreasePerPeriod =
    contributionIncreaseRate > 0
      ? Math.pow(1 + contributionIncreaseRate / 100, 1 / contributionFrequency.periods) - 1
      : 0;

  let balance = principal;
  let totalContributions = 0;
  let currentContribution = contribution;

  const timeline = [];

  for (let period = 1; period <= periods; period += 1) {
    // Apply contributions at the start of each contribution period
    if (contribution > 0 && (period - 1) % contributionPeriods === 0) {
      balance += currentContribution;
      totalContributions += currentContribution;
      currentContribution += currentContribution * contributionIncreasePerPeriod;
    }

    // Apply interest
    balance += balance * ratePerPeriod;

    if (period % compounding.periods === 0) {
      const year = period / compounding.periods;
      timeline.push({
        year,
        balance,
        totalContributions,
        interestEarned: balance - principal - totalContributions,
      });
    }
  }

  const futureValue = balance;
  const totalInterest = futureValue - principal - totalContributions;

  return {
    futureValue,
    totalInterest,
    totalContributions,
    timeline,
  };
};

const compoundInterestFaqs = [
  {
    question: 'How often should I compound interest?',
    answer:
      'Monthly compounding is common for savings accounts, while daily compounding offers a slight edge. Choose the option that matches your account terms so the compound interest calculator stays accurate.',
  },
  {
    question: 'Should I increase my contributions over time?',
    answer:
      'If you expect salary growth, increasing contributions by a set percentage each year can significantly accelerate growth. Use the contribution increase slider to model inflation busting pay rises or bonus top-ups.',
  },
  {
    question: 'What is the difference between compound and simple interest?',
    answer:
      'Compound interest reinvests earnings so interest is calculated on the previous interest as well as the original principal. Simple interest only applies to the original principal, leading to a slower growth curve.',
  },
];

export default function CompoundInterestCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(() => calculateCompoundInterest(inputs), [inputs]);
  const lastPoint = results.timeline[results.timeline.length - 1] || {
    balance: inputs.principal || 0,
    totalContributions: 0,
  };

  const resetInputs = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Compound Interest Calculator | Find Compound Interest Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Compound Interest Calculator | Find Compound Interest Calculator"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Compound Interest Calculator | Find Compound Interest Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Compound Interest Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate compound interest',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Compound Interest Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Forecast wealth growth with detailed charts that show how compounding, contributions,
            and rate changes accelerate your savings plan.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Investment Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="principal" className="text-sm font-medium">
                  Initial deposit (£)
                </Label>
                <Input
                  id="principal"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.principal}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, principal: Number(event.target.value) }))
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Annual rate
                    <span className="text-indigo-600 font-semibold">
                      {percentageFormatter.format(inputs.annualRate)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.annualRate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, annualRate: value[0] }))
                    }
                    min={0}
                    max={20}
                    step={0.25}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Years
                    <span className="text-indigo-600 font-semibold">{inputs.years}</span>
                  </Label>
                  <Slider
                    value={[inputs.years]}
                    onValueChange={(value) => setInputs((prev) => ({ ...prev, years: value[0] }))}
                    min={1}
                    max={50}
                    step={1}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="compounding" className="text-sm font-medium">
                  Compounding frequency
                </Label>
                <select
                  id="compounding"
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={inputs.compounding}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, compounding: event.target.value }))
                  }
                >
                  {compoundingFrequencies.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="contribution" className="text-sm font-medium">
                    Regular contribution (£)
                  </Label>
                  <Input
                    id="contribution"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.contribution}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, contribution: Number(event.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="contributionFrequency" className="text-sm font-medium">
                    Contribution frequency
                  </Label>
                  <select
                    id="contributionFrequency"
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={inputs.contributionFrequency}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, contributionFrequency: event.target.value }))
                    }
                  >
                    {contributionFrequencies.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Annual contribution increase
                    <span className="text-indigo-600 font-semibold">
                      {percentageFormatter.format(inputs.contributionIncreaseRate)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.contributionIncreaseRate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, contributionIncreaseRate: value[0] }))
                    }
                    min={0}
                    max={10}
                    step={0.25}
                  />
                </div>
              </div>

              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <TrendingUp className="h-5 w-5" />
                  Growth Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Future value</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.futureValue)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">
                    Total contributions
                  </p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.totalContributions)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Interest earned</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.totalInterest)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Last yearly growth</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(lastPoint.interestEarned || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-slate-600" />
                  Savings Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Principal & Contributions
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(inputs.principal + results.totalContributions)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Includes the initial deposit of{' '}
                    <span className="font-semibold">
                      {currencyFormatter.format(inputs.principal)}
                    </span>{' '}
                    plus{' '}
                    <span className="font-semibold">
                      {currencyFormatter.format(results.totalContributions)}
                    </span>{' '}
                    made over the plan.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Compound Growth
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalInterest)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Captures the impact of reinvesting returns. Increasing the compounding frequency
                    or raising contributions accelerates this figure.
                  </p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Find compound interest calculator strategies for your goals
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the find compound interest calculator approach to test different market returns,
                salary raises, or contribution increases. Small adjustments made early on can have a
                dramatic effect on the final number.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Calculating compound interest calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Review the calculating compound interest calculator results each year to ensure you
                stay ahead of inflation. Adjust the contribution increase slider to simulate pay
                rises or side-hustle income funneled into your savings account.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={compoundInterestFaqs} />
        </div>
      </section>
    </div>
  );
}
