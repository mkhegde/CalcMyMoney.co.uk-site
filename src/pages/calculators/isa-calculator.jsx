import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'isa calculator',
  'lifetime isa calculator',
  'cash isa calculator',
  'stocks and shares isa calculator',
];

const metaDescription =
  'Use our ISA calculator to track contributions, compare lifetime ISA calculator bonuses, and project tax-free growth in a cash ISA calculator or stocks and shares ISA calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/isa-calculator';
const schemaKeywords = keywords;

const ISA_ANNUAL_ALLOWANCE = 20000;
const LIFETIME_ISA_BONUS_RATE = 0.25;
const LIFETIME_ISA_BONUS_CAP = 4000;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const isaFaqs = [
  {
    question: 'What is the current ISA allowance?',
    answer:
      'For the 2025/26 tax year the overall ISA allowance is £20,000. You can spread this across Cash, Stocks & Shares, Innovative Finance, and Lifetime ISAs, subject to specific product limits.',
  },
  {
    question: 'How does the Lifetime ISA bonus work?',
    answer:
      'The government adds 25% on top of your Lifetime ISA contributions up to £4,000 per tax year. The bonus is paid monthly and added to the account balance.',
  },
  {
    question: 'Can I combine Cash and Stocks & Shares ISAs?',
    answer:
      'Yes. You can open or contribute to one of each ISA type per tax year as long as you stay within the overall £20,000 allowance.',
  },
];

const calculateIsaGrowth = ({
  initialBalance,
  monthlyContribution,
  years,
  annualReturn,
  includeLifetimeIsa,
}) => {
  const periods = years * 12;
  const monthlyRate = annualReturn / 100 / 12;
  let balance = initialBalance;
  let totalContributions = initialBalance;
  let lifetimeBonusTotal = 0;

  for (let month = 1; month <= periods; month += 1) {
    const contribution = monthlyContribution;
    balance += contribution;
    totalContributions += contribution;

    if (includeLifetimeIsa) {
      const bonusEligibleContribution = Math.min(contribution, LIFETIME_ISA_BONUS_CAP / 12);
      const bonus = bonusEligibleContribution * LIFETIME_ISA_BONUS_RATE;
      balance += bonus;
      lifetimeBonusTotal += bonus;
    }

    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }
  }

  const totalInterest = balance - totalContributions - lifetimeBonusTotal;
  return {
    balance,
    totalContributions,
    lifetimeBonusTotal,
    totalInterest,
  };
};

export default function IsaCalculatorPage() {
  const [inputs, setInputs] = useState({
    initialBalance: 5000,
    monthlyContribution: 600,
    annualReturn: 5,
    years: 10,
    includeLifetimeIsa: false,
  });

  const annualContributionTotal = inputs.monthlyContribution * 12;
  const allowanceWarning =
    annualContributionTotal > ISA_ANNUAL_ALLOWANCE
      ? `Warning: You are planning to contribute £${annualContributionTotal.toLocaleString(
          'en-GB'
        )} per year, exceeding the £${ISA_ANNUAL_ALLOWANCE.toLocaleString('en-GB')} ISA allowance.`
      : '';

  const lifetimeBonusWarning =
    inputs.includeLifetimeIsa && annualContributionTotal > LIFETIME_ISA_BONUS_CAP
      ? `Lifetime ISA bonus only applies to the first £${LIFETIME_ISA_BONUS_CAP.toLocaleString(
          'en-GB'
        )} of contributions each tax year.`
      : '';

  const results = useMemo(
    () =>
      calculateIsaGrowth({
        initialBalance: Number(inputs.initialBalance) || 0,
        monthlyContribution: Number(inputs.monthlyContribution) || 0,
        annualReturn: Number(inputs.annualReturn) || 0,
        years: Number(inputs.years) || 0,
        includeLifetimeIsa: inputs.includeLifetimeIsa,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      initialBalance: 5000,
      monthlyContribution: 600,
      annualReturn: 5,
      years: 10,
      includeLifetimeIsa: false,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>ISA Calculator | Lifetime ISA Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="ISA Calculator | Lifetime ISA Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ISA Calculator | Lifetime ISA Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'ISA Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan ISA contributions',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-indigo-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            ISA Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Plan your tax-free savings. Track contributions, growth, and government bonuses across
            Cash ISAs, Stocks & Shares ISAs, and Lifetime ISAs.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                ISA Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="initialBalance" className="text-sm font-medium">
                  Current ISA balance (£)
                </Label>
                <Input
                  id="initialBalance"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.initialBalance}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, initialBalance: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="monthlyContribution" className="text-sm font-medium">
                  Monthly contribution (£)
                </Label>
                <Input
                  id="monthlyContribution"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.monthlyContribution}
                  onChange={(event) =>
                    setInputs((prev) => ({
                      ...prev,
                      monthlyContribution: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Expected annual growth
                  <span className="text-emerald-600 font-semibold">
                    {inputs.annualReturn.toFixed(1)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.annualReturn]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, annualReturn: Number(value[0].toFixed(1)) }))
                  }
                  min={0}
                  max={12}
                  step={0.1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Years to invest
                  <span className="text-emerald-600 font-semibold">{inputs.years}</span>
                </Label>
                <Slider
                  value={[inputs.years]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, years: Math.round(value[0]) }))
                  }
                  min={1}
                  max={40}
                  step={1}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Include Lifetime ISA bonus</Label>
                <Button
                  variant={inputs.includeLifetimeIsa ? 'default' : 'outline'}
                  onClick={() =>
                    setInputs((prev) => ({ ...prev, includeLifetimeIsa: !prev.includeLifetimeIsa }))
                  }
                >
                  {inputs.includeLifetimeIsa ? 'Included' : 'Excluded'}
                </Button>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {allowanceWarning && (
              <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30">
                <CardContent className="py-4 text-sm text-amber-900 dark:text-amber-100">
                  {allowanceWarning}
                </CardContent>
              </Card>
            )}
            {lifetimeBonusWarning && (
              <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30">
                <CardContent className="py-4 text-sm text-amber-900 dark:text-amber-100">
                  {lifetimeBonusWarning}
                </CardContent>
              </Card>
            )}

            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <PiggyBank className="h-5 w-5" />
                  ISA Growth Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Final balance</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.balance)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Total contributions
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.totalContributions)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Lifetime ISA bonus
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.lifetimeBonusTotal)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Investment growth
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.totalInterest)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Contribution Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  You plan to contribute{' '}
                  <span className="font-semibold">
                    £{(inputs.monthlyContribution * 12).toLocaleString('en-GB')}
                  </span>{' '}
                  per tax year. Adjust the monthly contribution to stay within the ISA allowance of{' '}
                  £{ISA_ANNUAL_ALLOWANCE.toLocaleString('en-GB')}.
                </p>
                <p>
                  The lifetime ISA calculator section adds{' '}
                  {currencyFormatter.format(results.lifetimeBonusTotal)} of government bonus if
                  turned on. Disable the bonus toggle to model a standard cash ISA calculator or
                  stocks and shares ISA calculator scenario.
                </p>
                <p>
                  Investment growth contributes {currencyFormatter.format(results.totalInterest)} to
                  your final balance at an expected {inputs.annualReturn.toFixed(1)}% annual return
                  over {inputs.years} years.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Lifetime ISA calculator strategy
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the lifetime ISA calculator toggle to model first-home or retirement bonuses.
                Combine the bonus with cash savings to accelerate your deposit.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Choosing between a cash ISA calculator and stocks and shares ISA calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Cash ISAs keep capital secure, while stocks and shares ISAs target long-term growth.
                Try different growth rates to see how each approach affects your ISA balance.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={isaFaqs} />
        </div>
      </section>
    </div>
  );
}
