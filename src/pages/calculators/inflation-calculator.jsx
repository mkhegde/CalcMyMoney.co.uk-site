import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['inflation calculator', 'inflation rate', 'inflation', 'inflation calculator uk'];

const metaDescription =
  'Use our inflation calculator to measure price changes, apply your preferred inflation rate, and see the real value of money with this inflation calculator UK tool.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/inflation-calculator';
const schemaKeywords = keywords;

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const percentageFormatter = (value) => `${value.toFixed(1)}%`;

const inflationFaqs = [
  {
    question: 'Where can I find UK inflation data?',
    answer:
      'The Office for National Statistics (ONS) publishes CPI, CPIH, and RPI data monthly. Use recent CPIH values for a broad measure of consumer prices.',
  },
  {
    question: 'How accurate is the inflation calculator?',
    answer:
      'It applies compound inflation based on your chosen rate. Actual inflation varies year to year, so rerun the calculator regularly with updated assumptions.',
  },
  {
    question: 'Can I estimate past purchasing power?',
    answer:
      'Yes. Enter the original amount and the number of years since you spent it. The calculator shows how much money you would need today to match historic purchasing power.',
  },
];

const calculateInflation = ({ amount, years, annualInflation }) => {
  const inflationMultiplier = (1 + annualInflation / 100) ** years;
  const futureValue = amount * inflationMultiplier;
  const realValue = amount / inflationMultiplier;

  return {
    futureValue,
    realValue,
    inflationMultiplier,
  };
};

export default function InflationCalculatorPage() {
  const [inputs, setInputs] = useState({
    amount: 10000,
    years: 5,
    annualInflation: 3.1,
  });

  const results = useMemo(
    () =>
      calculateInflation({
        amount: Number(inputs.amount) || 0,
        years: Number(inputs.years) || 0,
        annualInflation: Number(inputs.annualInflation) || 0,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      amount: 10000,
      years: 5,
      annualInflation: 3.1,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Inflation Calculator | Inflation Rate</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Inflation Calculator | Inflation Rate" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inflation Calculator | Inflation Rate" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Inflation Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate inflation-adjusted value',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Inflation Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Measure how inflation affects savings, wages, or prices. Enter an amount, choose an
            inflation rate, and see its future purchasing power instantly.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Inflation Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (£)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.amount}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, amount: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Years to project
                  <span className="text-indigo-600 font-semibold">{inputs.years}</span>
                </Label>
                <Slider
                  value={[inputs.years]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, years: Math.round(value[0]) }))
                  }
                  min={1}
                  max={50}
                  step={1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Annual inflation rate
                  <span className="text-indigo-600 font-semibold">
                    {inputs.annualInflation.toFixed(1)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.annualInflation]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, annualInflation: Number(value[0].toFixed(1)) }))
                  }
                  min={0}
                  max={15}
                  step={0.1}
                />
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
                  Inflation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Future value</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.futureValue)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Real value today</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.realValue)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">
                    Inflation multiplier
                  </p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {results.inflationMultiplier.toFixed(2)}x
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Price Change Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Every £1 today becomes{' '}
                  <span className="font-semibold">
                    {currencyFormatter(results.futureValue / inputs.amount || 0)}
                  </span>{' '}
                  in {inputs.years} years at {percentageFormatter(inputs.annualInflation)} annual
                  inflation.
                </p>
                <p>
                  To have the same buying power as {currencyFormatter(inputs.amount)}, you would
                  need{' '}
                  <span className="font-semibold">{currencyFormatter(results.futureValue)}</span>{' '}
                  after {inputs.years} years.
                </p>
                <p>
                  Alternatively, {currencyFormatter(inputs.amount)} from {inputs.years} years ago
                  would only buy{' '}
                  <span className="font-semibold">{currencyFormatter(results.realValue)}</span> of
                  goods at today’s prices.
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
                Inflation rate planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Test different inflation rate assumptions—1% for low CPI periods or 10%+ for high
                inflation episodes. The inflation rate slider keeps the inflation calculator
                grounded in real data.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Tracking price changes with an inflation calculator UK focus
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The inflation calculator UK mode reflects CPIH as a default, but you can align it
                with global CPI trends too. Watching inflation sharpens saving and investing
                decisions.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={inflationFaqs} />
        </div>
      </section>
    </div>
  );
}
