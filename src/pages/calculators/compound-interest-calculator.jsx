import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, Layers3 } from 'lucide-react';

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
];

const metaDescription =
  'Use our compound interest calculator and find compound interest calculator modes to model calculating compound interest calculator growth, including daily compound interest calculator scenarios.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/compound-interest-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const compoundFaqs = [
  {
    question: 'How often should I compound?',
    answer:
      'Banks typically compound monthly or daily. Select the frequency that matches your account to ensure the compound interest calculator mirrors real-world growth.',
  },
  {
    question: 'Can I add annual increases to contributions?',
    answer:
      'Yes. Enter a yearly contribution and an optional growth rate for that contribution. The calculating compound interest calculator shows how increasing contributions accelerates savings.',
  },
  {
    question: 'How do I compare multiple scenarios?',
    answer:
      'Duplicate the tab with different rates or contributions. Use the daily compound interest calculator option to see the impact of more frequent compounding versus monthly or annual.',
  },
];

const generateProjection = ({
  initialDeposit,
  monthlyContribution,
  contributionAnnualGrowth,
  annualRate,
  compoundingFrequency,
  years,
}) => {
  const periodsPerYear = Math.max(compoundingFrequency, 1);
  const totalPeriods = Math.max(Math.round(years * periodsPerYear), 0);
  const periodicRate = Math.max(annualRate, 0) / 100 / periodsPerYear;
  const monthlyContributionValue = Math.max(monthlyContribution, 0);
  const contributionGrowth = Math.max(contributionAnnualGrowth, 0) / 100;

  let balance = Math.max(initialDeposit, 0);
  let totalContributions = balance;
  const projection = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    const yearIndex = Math.floor((period - 1) / periodsPerYear);
    const contributionFactor = (1 + contributionGrowth) ** yearIndex;
    const periodicContribution =
      monthsPerCompounding(periodsPerYear) > 0
        ? (monthlyContributionValue * contributionFactor * monthsPerCompounding(periodsPerYear))
        : 0;

    balance += periodicContribution;
    totalContributions += periodicContribution;

    if (periodicRate > 0) {
      balance *= 1 + periodicRate;
    }

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      projection.push({
        year,
        balance,
        contribution: totalContributions,
      });
    }
  }

  const interestEarned = balance - totalContributions;
  return {
    balance,
    totalContributions,
    interestEarned,
    projection,
  };
};

const monthsPerCompounding = (periodsPerYear) => {
  if (periodsPerYear === 12) return 1;
  if (periodsPerYear === 4) return 3;
  if (periodsPerYear === 1) return 12;
  if (periodsPerYear === 2) return 6;
  if (periodsPerYear === 365) return 12 / periodsPerYear;
  return 12 / periodsPerYear;
};

export default function CompoundInterestCalculatorPage() {
  const [inputs, setInputs] = useState({
    initialDeposit: 7500,
    monthlyContribution: 350,
    contributionAnnualGrowth: 3,
    annualRate: 6,
    compoundingFrequency: 12,
    years: 15,
  });

  const results = useMemo(
    () =>
      generateProjection({
        initialDeposit: Number(inputs.initialDeposit) || 0,
        monthlyContribution: Number(inputs.monthlyContribution) || 0,
        contributionAnnualGrowth: Number(inputs.contributionAnnualGrowth) || 0,
        annualRate: Number(inputs.annualRate) || 0,
        compoundingFrequency: Number(inputs.compoundingFrequency) || 1,
        years: Number(inputs.years) || 0,
      }),
    [inputs]
  );

  const resetAll = () =>
    setInputs({
      initialDeposit: 7500,
      monthlyContribution: 350,
      contributionAnnualGrowth: 3,
      annualRate: 6,
      compoundingFrequency: 12,
      years: 15,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Compound Interest Calculator | Find Compound Interest Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Compound Interest Calculator | Find Compound Interest Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compound Interest Calculator | Find Compound Interest Calculator" />
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
                name: 'Project savings with a compound interest calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Compound Interest Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Visualise how deposits, contributions, and compounding frequency accelerate investment and
            savings growth.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Contribution plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="initialDeposit">Initial deposit (£)</Label>
                  <Input
                    id="initialDeposit"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.initialDeposit}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        initialDeposit: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    min="0"
                    step="10"
                    inputMode="decimal"
                    value={inputs.monthlyContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlyContribution: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contributionAnnualGrowth">Contribution increase per year (%)</Label>
                  <Slider
                    id="contributionAnnualGrowth"
                    className="mt-3"
                    value={[Number(inputs.contributionAnnualGrowth)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        contributionAnnualGrowth: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={15}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.contributionAnnualGrowth.toFixed(1)}%</span>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Layers3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Growth assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="annualRate">Annual interest rate (%)</Label>
                  <Slider
                    id="annualRate"
                    className="mt-3"
                    value={[Number(inputs.annualRate)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualRate: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={15}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.annualRate.toFixed(1)}%</span>
                    <span>15%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compoundingFrequency">Compounding frequency</Label>
                  <select
                    id="compoundingFrequency"
                    className="w-full rounded-md border border-emerald-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                    value={inputs.compoundingFrequency}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        compoundingFrequency: Number(event.target.value) || 1,
                      }))
                    }
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={52}>Weekly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years">Years invested</Label>
                  <Slider
                    id="years"
                    className="mt-3"
                    value={[Number(inputs.years)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        years: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={1}
                    max={40}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1</span>
                    <span>{inputs.years} years</span>
                    <span>40</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset calculator
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Growth summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Total value</span>
                  <span>{currencyFormatter(results.balance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total contributed</span>
                  <span>{currencyFormatter(results.totalContributions)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Interest earned</span>
                  <span>{currencyFormatter(results.interestEarned)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Find compound interest calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The find compound interest calculator flow helps you test multiple rates. Tweak annual
                returns or contribution growth to see how they alter long-term balances.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Calculating compound interest calculator workflow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Check yearly projections below to understand how early contributions drive growth. The
                calculating compound interest calculator approach lets you compare investing lumps vs monthly
                saving.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Daily compound interest calculator comparisons
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Switch to daily compounding for accounts that pay interest more frequently. Small changes in
                frequency lead to noticeable gains over decades.
              </p>
            </section>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Yearly projection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {results.projection.slice(0, 15).map((row) => (
                  <div key={row.year} className="flex items-center justify-between">
                    <span>Year {row.year}</span>
                    <span>{currencyFormatter(row.balance)}</span>
                  </div>
                ))}
                {results.projection.length > 15 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Projection truncated for brevity. Increase years to view more growth.
                  </p>
                )}
              </CardContent>
            </Card>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={compoundFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
