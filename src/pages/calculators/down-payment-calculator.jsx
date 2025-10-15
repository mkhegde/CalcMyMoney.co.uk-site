import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, PiggyBank, Target } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'down payment calculator',
  'house deposit calculator',
  'mortgage deposit calculator',
  'down payment savings calculator',
  'home deposit calculator',
];

const metaDescription =
  'Use our down payment calculator and house deposit calculator to plan mortgage deposit calculator goals, track down payment savings calculator milestones, and secure your home deposit calculator target.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/down-payment-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const downPaymentFaqs = [
  {
    question: 'What deposit percentage should I aim for?',
    answer:
      'Most lenders require at least 5%, but 10-20% opens access to better rates. Adjust the slider to see how each percentage affects your savings plan using the mortgage deposit calculator view.',
  },
  {
    question: 'How can I accelerate my savings timeline?',
    answer:
      'Increase monthly contributions or add lump sums. The down payment savings calculator visualises progress so you can see how bonuses or side income bring the move-in date forward.',
  },
  {
    question: 'Do I need to include closing costs?',
    answer:
      'Yes. Add solicitor fees, stamp duty, and moving costs to appreciate the full cash requirement. The house deposit calculator ensures you do not overlook these items.',
  },
];

const calculateDownPayment = ({
  homePrice,
  depositPercent,
  monthlySaving,
  lumpSum,
  annualReturn,
  timelineYears,
}) => {
  const targetDeposit = Math.max(homePrice * (depositPercent / 100), 0);
  const monthlyRate = Math.max(annualReturn, 0) / 100 / 12;
  const months = Math.max(Math.round(timelineYears * 12), 0);
  const monthlyContribution = Math.max(monthlySaving, 0);
  const initial = Math.max(lumpSum, 0);

  let balance = initial;
  let totalContributions = initial;

  for (let month = 1; month <= months; month += 1) {
    balance += monthlyContribution;
    totalContributions += monthlyContribution;
    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }
  }

  const timeToTargetMonths =
    monthlyRate > 0
      ? Math.log(
          (monthlyContribution + monthlyRate * targetDeposit) /
            (monthlyContribution + monthlyRate * initial)
        ) /
        Math.log(1 + monthlyRate)
      : (targetDeposit - initial) / (monthlyContribution || 1);

  const monthsToTarget = Math.max(Math.ceil(timeToTargetMonths), 0);
  const yearsToTarget = monthsToTarget / 12;

  return {
    targetDeposit,
    balance,
    totalContributions,
    growth: balance - totalContributions,
    monthsToTarget: Number.isFinite(monthsToTarget) ? monthsToTarget : Infinity,
    yearsToTarget: Number.isFinite(yearsToTarget) ? yearsToTarget : Infinity,
  };
};

export default function DownPaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    homePrice: 320000,
    depositPercent: 15,
    monthlySaving: 900,
    lumpSum: 8000,
    annualReturn: 3,
    timelineYears: 3,
  });

  const results = useMemo(
    () =>
      calculateDownPayment({
        homePrice: Number(inputs.homePrice) || 0,
        depositPercent: Number(inputs.depositPercent) || 0,
        monthlySaving: Number(inputs.monthlySaving) || 0,
        lumpSum: Number(inputs.lumpSum) || 0,
        annualReturn: Number(inputs.annualReturn) || 0,
        timelineYears: Number(inputs.timelineYears) || 0,
      }),
    [inputs]
  );

  const resetAll = () =>
    setInputs({
      homePrice: 320000,
      depositPercent: 15,
      monthlySaving: 900,
      lumpSum: 8000,
      annualReturn: 3,
      timelineYears: 3,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Down Payment Calculator | House Deposit Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Down Payment Calculator | House Deposit Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Down Payment Calculator | House Deposit Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Down Payment Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan savings with a down payment calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Down Payment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Discover how monthly savings, lump sums, and investment returns get you to your home deposit
            goal faster.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Property details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="homePrice">Target property price (£)</Label>
                  <Input
                    id="homePrice"
                    type="number"
                    min="0"
                    step="1000"
                    inputMode="decimal"
                    value={inputs.homePrice}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        homePrice: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depositPercent">Deposit goal (%)</Label>
                  <Slider
                    id="depositPercent"
                    className="mt-3"
                    value={[Number(inputs.depositPercent)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        depositPercent: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={5}
                    max={30}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>5%</span>
                    <span>{inputs.depositPercent.toFixed(1)}%</span>
                    <span>30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Savings plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlySaving">Monthly savings (£)</Label>
                  <Input
                    id="monthlySaving"
                    type="number"
                    min="0"
                    step="10"
                    inputMode="decimal"
                    value={inputs.monthlySaving}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlySaving: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lumpSum">Current savings / lump sum (£)</Label>
                  <Input
                    id="lumpSum"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.lumpSum}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        lumpSum: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualReturn">Expected annual return (%)</Label>
                  <Slider
                    id="annualReturn"
                    className="mt-3"
                    value={[Number(inputs.annualReturn)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualReturn: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={10}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.annualReturn.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timelineYears">Planned timeline (years)</Label>
                  <Slider
                    id="timelineYears"
                    className="mt-3"
                    value={[Number(inputs.timelineYears)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        timelineYears: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={1}
                    max={10}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1</span>
                    <span>{inputs.timelineYears.toFixed(1)} years</span>
                    <span>10</span>
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
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Mortgage deposit calculator summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Deposit target</span>
                  <span>{currencyFormatter(results.targetDeposit)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Projected balance</span>
                  <span>{currencyFormatter(results.balance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total contributions</span>
                  <span>{currencyFormatter(results.totalContributions)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Growth</span>
                  <span>{currencyFormatter(results.growth)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time to goal (estimate)</span>
                  <span>
                    {Number.isFinite(results.yearsToTarget)
                      ? `${results.yearsToTarget.toFixed(1)} years`
                      : 'Beyond current timeline'}
                  </span>
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
                Down payment savings calculator milestones
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Set mini milestones at 5%, 10%, and 20% to stay motivated. Switch deposit percentage to see
                how each milestone affects your schedule in the down payment savings calculator.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Home deposit calculator budgeting
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Transfer your monthly savings figure into your budget. Pair the home deposit calculator with
                your banking or budgeting app so contributions stay automatic.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={downPaymentFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
