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

const keywords = ['fire calculator', 'financial independence retire early calculator'];

const metaDescription =
  'Use our fire calculator to plan financial independence, stress-test FIRE calculator goals, and map the financial independence retire early calculator timeline for your investments.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/fire-calculator';
const schemaKeywords = keywords;

const fireFaqs = [
  {
    question: 'What withdrawal rate should I use?',
    answer:
      'Many FIRE plans use a 4% withdrawal rate, though some opt for 3.5% for added safety. Adjust the slider to see how the target portfolio changes with different assumptions.',
  },
  {
    question: 'How often should I review my FIRE plan?',
    answer:
      'Review annually or whenever your income, spending, or investment performance changes significantly. Staying on top of your FIRE calculator outputs keeps you aligned with real-world conditions.',
  },
  {
    question: 'How do I handle fluctuating investment returns?',
    answer:
      'The calculator uses an average annual return. In reality, returns vary. Build in a safety margin by assuming lower returns or higher spending than expected.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const calculateFirePlan = ({
  currentPortfolio,
  annualContribution,
  expectedReturn,
  inflationRate,
  annualSpending,
  withdrawalRate,
  yearsToGoal,
}) => {
  const realReturn = (1 + expectedReturn / 100) / (1 + inflationRate / 100) - 1;
  const contributionFutureValue =
    annualContribution * (((1 + realReturn) ** yearsToGoal - 1) / realReturn) * (1 + realReturn);
  const portfolioFutureValue =
    currentPortfolio * (1 + realReturn) ** yearsToGoal + contributionFutureValue;

  const fireNumber = annualSpending / (withdrawalRate / 100);
  const gapToTarget = Math.max(fireNumber - portfolioFutureValue, 0);
  const yearsToFire =
    gapToTarget <= 0
      ? 0
      : Math.log((annualContribution + gapToTarget * realReturn) / annualContribution) /
        Math.log(1 + realReturn);

  return {
    portfolioFutureValue,
    fireNumber,
    gapToTarget,
    yearsToFire: Math.max(yearsToFire, 0),
  };
};

export default function FireCalculatorPage() {
  const [inputs, setInputs] = useState({
    currentPortfolio: 120000,
    annualContribution: 18000,
    expectedReturn: 6,
    inflationRate: 2,
    annualSpending: 40000,
    withdrawalRate: 4,
    yearsToGoal: 15,
  });

  const results = useMemo(() => calculateFirePlan(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      currentPortfolio: 120000,
      annualContribution: 18000,
      expectedReturn: 6,
      inflationRate: 2,
      annualSpending: 40000,
      withdrawalRate: 4,
      yearsToGoal: 15,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>FIRE Calculator | Financial Independence Retire Early Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="FIRE Calculator | Financial Independence Retire Early Calculator"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FIRE Calculator | Financial Independence Retire Early Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'FIRE Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan financial independence',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            FIRE Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Map your path to financial independence, estimate your FIRE number, and see how long it
            will take to retire early with your current savings plan.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                FIRE Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="currentPortfolio" className="text-sm font-medium">
                  Current invested portfolio (£)
                </Label>
                <Input
                  id="currentPortfolio"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.currentPortfolio}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, currentPortfolio: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="annualContribution" className="text-sm font-medium">
                  Annual contributions (£)
                </Label>
                <Input
                  id="annualContribution"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.annualContribution}
                  onChange={(event) =>
                    setInputs((prev) => ({
                      ...prev,
                      annualContribution: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Expected return
                    <span className="text-emerald-600 font-semibold">
                      {inputs.expectedReturn.toFixed(1)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.expectedReturn]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        expectedReturn: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={2}
                    max={10}
                    step={0.1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Inflation rate
                    <span className="text-emerald-600 font-semibold">
                      {inputs.inflationRate.toFixed(1)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.inflationRate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, inflationRate: Number(value[0].toFixed(1)) }))
                    }
                    min={0}
                    max={5}
                    step={0.1}
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
                  min={0}
                  inputMode="decimal"
                  value={inputs.annualSpending}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, annualSpending: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Withdrawal rate
                  <span className="text-emerald-600 font-semibold">
                    {inputs.withdrawalRate.toFixed(1)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.withdrawalRate]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, withdrawalRate: Number(value[0].toFixed(1)) }))
                  }
                  min={2.5}
                  max={5}
                  step={0.1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Years until target
                  <span className="text-emerald-600 font-semibold">{inputs.yearsToGoal}</span>
                </Label>
                <Slider
                  value={[inputs.yearsToGoal]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, yearsToGoal: Math.round(value[0]) }))
                  }
                  min={1}
                  max={40}
                  step={1}
                />
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <PiggyBank className="h-5 w-5" />
                  FIRE Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Projected portfolio
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.portfolioFutureValue)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">FIRE number</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.fireNumber)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Gap to target</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.gapToTarget)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Years to FIRE</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {results.yearsToFire.toFixed(1)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  FIRE Plan Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Target annual spending:</span>{' '}
                  {currencyFormatter.format(inputs.annualSpending)} supports a FIRE number of{' '}
                  {currencyFormatter.format(results.fireNumber)} at a{' '}
                  {inputs.withdrawalRate.toFixed(1)}% withdrawal rate.
                </p>
                <p>
                  <span className="font-semibold">Projected portfolio:</span>{' '}
                  {currencyFormatter.format(results.portfolioFutureValue)} after{' '}
                  {inputs.yearsToGoal} years assuming a {inputs.expectedReturn.toFixed(1)}% return
                  and {inputs.inflationRate.toFixed(1)}% inflation.
                </p>
                <p>
                  Reduce the gap by increasing contributions, trimming spending, or extending your
                  timeline. Small adjustments compound significantly over the years.
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
                FIRE calculator roadmap
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Review your savings rate, investment strategy, and withdrawal assumptions regularly.
                The fire calculator shows precisely how closer-to-reality returns affect your plan.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Leveraging the financial independence retire early calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust annual spending to test alternative lifestyles. The financial independence
                retire early calculator makes it easy to compare lean, standard, and fat FIRE
                targets so you stay motivated all the way to independence.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={fireFaqs} />
        </div>
      </section>
    </div>
  );
}
