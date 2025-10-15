import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, TrendingDown, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'percentage change calculator',
  'percent change calculator',
  'percentage increase calculator',
  'percentage decrease calculator',
  'percent difference calculator',
];

const metaDescription =
  'Use our percentage change calculator and percent change calculator to measure percentage increase calculator values, percentage decrease calculator drops, and percent difference calculator comparisons.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/percentage-change-calculator';
const schemaKeywords = keywords.slice(0, 5);

const formatNumber = (value, decimals = 2) =>
  Number.isFinite(value) ? Number(value).toFixed(decimals) : '0.00';

const percentageChangeFaqs = [
  {
    question: 'How do I compare two prices or salaries?',
    answer:
      'Enter the original amount and the new amount. The percentage change calculator reports the absolute difference, percentage increase, or percentage decrease so you can benchmark offers quickly.',
  },
  {
    question: 'What if I want to reverse the calculation?',
    answer:
      'Toggle the reverse slider to solve for the new value given a percentage change. It is useful when you need to target a specific price rise or cost reduction.',
  },
  {
    question: 'How is percent difference different from percent change?',
    answer:
      'Percent change compares the difference relative to the original value. Percent difference compares the change relative to the average of the two numbers. Use the percent difference calculator result when neither value is the “original”.',
  },
];

const calculatePercentageChange = ({ originalValue, newValue }) => {
  const original = Number(originalValue) || 0;
  const updated = Number(newValue) || 0;
  const difference = updated - original;
  const percentChange = original !== 0 ? (difference / original) * 100 : 0;
  const percentIncrease = difference > 0 ? percentChange : 0;
  const percentDecrease = difference < 0 ? Math.abs(percentChange) : 0;
  const average = (Math.abs(original) + Math.abs(updated)) / 2 || 1;
  const percentDifference = (Math.abs(difference) / average) * 100;

  return {
    original,
    updated,
    difference,
    percentChange,
    percentIncrease,
    percentDecrease,
    percentDifference,
  };
};

const calculateReverseValue = ({ originalValue, percentChange }) => {
  const original = Number(originalValue) || 0;
  const change = Number(percentChange) || 0;
  return original * (1 + change / 100);
};

export default function PercentageChangeCalculatorPage() {
  const [inputs, setInputs] = useState({
    originalValue: 1250,
    newValue: 1485,
    decimals: 2,
    reverseMode: false,
    reversePercent: 12,
  });

  const results = useMemo(
    () =>
      calculatePercentageChange({
        originalValue: inputs.originalValue,
        newValue: inputs.newValue,
      }),
    [inputs.originalValue, inputs.newValue]
  );

  const reversedValue = useMemo(
    () =>
      calculateReverseValue({
        originalValue: inputs.originalValue,
        percentChange: inputs.reversePercent,
      }),
    [inputs.originalValue, inputs.reversePercent]
  );

  const resetAll = () =>
    setInputs({
      originalValue: 1250,
      newValue: 1485,
      decimals: 2,
      reverseMode: false,
      reversePercent: 12,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Percentage Change Calculator | Percent Change Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Percentage Change Calculator | Percent Change Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Percentage Change Calculator | Percent Change Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Percentage Change Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Compare values with a percentage change calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Percentage Change Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Measure increases, decreases, and differences instantly—perfect for investments, pricing, or KPI
            dashboards.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Value comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="originalValue">Original value (£)</Label>
                  <Input
                    id="originalValue"
                    type="number"
                    inputMode="decimal"
                    value={inputs.originalValue}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        originalValue: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newValue">New value (£)</Label>
                  <Input
                    id="newValue"
                    type="number"
                    inputMode="decimal"
                    value={inputs.newValue}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        newValue: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="decimals">Decimal places</Label>
                  <Slider
                    id="decimals"
                    className="mt-3"
                    value={[Number(inputs.decimals)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        decimals: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={0}
                    max={6}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>0</span>
                    <span>{inputs.decimals}</span>
                    <span>6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Reverse calculation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Reverse mode</Label>
                  <Button
                    variant={inputs.reverseMode ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        reverseMode: !prev.reverseMode,
                      }))
                    }
                  >
                    {inputs.reverseMode ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reversePercent">Target percent change (%)</Label>
                  <Slider
                    id="reversePercent"
                    className="mt-3"
                    value={[Number(inputs.reversePercent)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        reversePercent: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={-100}
                    max={200}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>-100%</span>
                    <span>{inputs.reversePercent.toFixed(1)}%</span>
                    <span>200%</span>
                  </div>
                </div>
                {inputs.reverseMode && (
                  <p className="rounded-md border border-indigo-200 bg-white p-3 text-sm font-medium dark:border-indigo-800 dark:bg-slate-900/40">
                    New value required: {formatNumber(reversedValue, inputs.decimals)}
                  </p>
                )}
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
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Difference</span>
                  <span>{formatNumber(results.difference, inputs.decimals)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Percentage change</span>
                  <span>{formatNumber(results.percentChange, inputs.decimals)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Percentage increase</span>
                  <span>{formatNumber(results.percentIncrease, inputs.decimals)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Percentage decrease</span>
                  <span>{formatNumber(results.percentDecrease, inputs.decimals)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Percent difference</span>
                  <span>{formatNumber(results.percentDifference, inputs.decimals)}%</span>
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
                Percentage increase calculator and percentage decrease calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the percentage increase calculator to measure growth in KPIs or investments. Switch the
                values to track cost savings with the percentage decrease calculator when negotiating with
                suppliers.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Percent difference calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                When neither value is the baseline, the percent difference calculator gives a fair comparison
                of volatility—ideal for scientific measurements or price comparisons between products.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={percentageChangeFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
