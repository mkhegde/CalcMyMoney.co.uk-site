import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, LineChart, Sigma, TrendingDown } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'present value calculator',
  'future value calculator',
  'npv calculator',
  'net present value calculator',
  'pv calculator',
  'present value of annuity calculator',
  'time value of money calculator',
  'present value formula',
];

const metaDescription =
  'Use our present value calculator and future value calculator as an npv calculator to discount cash flows and compare investments.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/present-value-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const defaultInputs = {
  futureValue: 25000,
  annualRate: 5.2,
  years: 4,
  compounding: 12,
  annuityPayment: 450,
  annuityYears: 6,
  initialInvestment: 18000,
};

const defaultCashFlows = [
  { year: 1, amount: 6500 },
  { year: 2, amount: 7200 },
  { year: 3, amount: 7600 },
  { year: 4, amount: 8200 },
];

const presentValueFaqs = [
  {
    question: 'What discount rate should I use?',
    answer:
      'Pick a rate that reflects the opportunity cost of capital. For corporate projects that may be the weighted average cost of capital, while households often use the expected return of their next best alternative.',
  },
  {
    question: 'Can I assess uneven cash flows?',
    answer:
      'Yes. Edit both the year and cash flow amount fields to mirror real-world payments. The calculator discounts each entry back to today and reports the net present value instantly.',
  },
  {
    question: 'How is the present value of an annuity calculated?',
    answer:
      'The annuity calculation applies the standard discounting formula for equal payments at regular intervals. Adjust the compounding frequency to model monthly, quarterly, or annual receipts accurately.',
  },
];

const calculatePresentValueMetrics = (inputValues, cashFlows) => {
  const futureValue = Number(inputValues.futureValue) || 0;
  const annualRate = (Number(inputValues.annualRate) || 0) / 100;
  const compounding = Math.max(Number(inputValues.compounding) || 1, 1);
  const years = Math.max(Number(inputValues.years) || 0, 0);

  const periodicRate = annualRate / compounding;
  const totalPeriods = years * compounding;

  const discountFactor =
    periodicRate === 0 ? 1 : 1 / (1 + periodicRate) ** totalPeriods;
  const presentValue = futureValue * discountFactor;

  const effectiveAnnualRate =
    periodicRate === 0 ? annualRate : (1 + periodicRate) ** compounding - 1;

  const annuityPayment = Number(inputValues.annuityPayment) || 0;
  const annuityYears = Math.max(Number(inputValues.annuityYears) || 0, 0);
  const annuityPeriods = annuityYears * compounding;
  let annuityPresentValue = 0;
  if (annuityPayment > 0 && annuityPeriods > 0) {
    annuityPresentValue =
      periodicRate === 0
        ? annuityPayment * annuityPeriods
        : annuityPayment * ((1 - (1 + periodicRate) ** -annuityPeriods) / periodicRate);
  }

  const initialInvestment = Number(inputValues.initialInvestment) || 0;
  let npv = -initialInvestment;
  let breakEvenYear = null;
  let cumulative = -initialInvestment;

  const discountedCashFlows = cashFlows.map((flow) => {
    const year = Math.max(Number(flow.year) || 0, 0);
    const amount = Number(flow.amount) || 0;
    const discounted =
      annualRate === 0 ? amount : amount / (1 + annualRate) ** year;
    cumulative += discounted;
    if (breakEvenYear === null && cumulative >= 0) {
      breakEvenYear = year;
    }
    npv += discounted;
    return {
      year,
      amount,
      discounted,
    };
  });

  return {
    presentValue,
    discountFactor,
    effectiveAnnualRate,
    annuityPresentValue,
    npv,
    discountedCashFlows,
    breakEvenYear,
  };
};

export default function PresentValueCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [cashFlows, setCashFlows] = useState(defaultCashFlows);

  const metrics = useMemo(
    () => calculatePresentValueMetrics(inputs, cashFlows),
    [inputs, cashFlows]
  );

  const resetAll = () => {
    setInputs(defaultInputs);
    setCashFlows(defaultCashFlows);
  };

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Present Value Calculator | Future Value Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Present Value Calculator | Future Value Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Present Value Calculator | Future Value Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Present Value Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Analyse cash flows with a PV calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Present Value Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Blend a future value calculator, npv calculator, and net present value calculator
            workflow so every pv calculator scenario is discounted back to today.
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
                  Discounted cash flow inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="futureValue">Future value (£)</Label>
                    <Input
                      id="futureValue"
                      type="number"
                      step="100"
                      min="0"
                      inputMode="decimal"
                      value={inputs.futureValue}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          futureValue: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Years until payment</Label>
                    <Input
                      id="years"
                      type="number"
                      step="0.1"
                      min="0"
                      inputMode="decimal"
                      value={inputs.years}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          years: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="compounding">Compounding frequency (per year)</Label>
                    <Input
                      id="compounding"
                      type="number"
                      step="1"
                      min="1"
                      inputMode="numeric"
                      value={inputs.compounding}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          compounding: Math.max(Number(event.target.value) || 1, 1),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualRate">Discount rate (% per year)</Label>
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
                      max={20}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-300">
                      <span>0%</span>
                      <span>{inputs.annualRate.toFixed(1)}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annuityPayment">Annuity payment (£ per period)</Label>
                    <Input
                      id="annuityPayment"
                      type="number"
                      step="10"
                      min="0"
                      inputMode="decimal"
                      value={inputs.annuityPayment}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          annuityPayment: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annuityYears">Annuity length (years)</Label>
                    <Input
                      id="annuityYears"
                      type="number"
                      step="0.5"
                      min="0"
                      inputMode="decimal"
                      value={inputs.annuityYears}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          annuityYears: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialInvestment">Initial investment (£)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      step="100"
                      min="0"
                      inputMode="decimal"
                      value={inputs.initialInvestment}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          initialInvestment: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example scenario
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <LineChart className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Cash flow schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cashFlows.map((flow, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-[1fr_1fr_1fr]">
                    <div className="space-y-2">
                      <Label htmlFor={`flow-year-${index}`}>Year</Label>
                      <Input
                        id={`flow-year-${index}`}
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={flow.year}
                        onChange={(event) =>
                          setCashFlows((previous) =>
                            previous.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, year: Math.max(Number(event.target.value) || 0, 0) }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`flow-amount-${index}`}>Cash flow (£)</Label>
                      <Input
                        id={`flow-amount-${index}`}
                        type="number"
                        step="100"
                        inputMode="decimal"
                        value={flow.amount}
                        onChange={(event) =>
                          setCashFlows((previous) =>
                            previous.map((item, itemIndex) =>
                              itemIndex === index
                                ? { ...item, amount: Number(event.target.value) || 0 }
                                : item
                            )
                          )
                        }
                      />
                    </div>
                    <div className="flex flex-col justify-center rounded-md border border-indigo-200 bg-white p-3 text-center text-sm dark:border-indigo-800 dark:bg-indigo-950/30">
                      <span className="text-indigo-700 dark:text-indigo-200">Discounted today</span>
                      <span className="text-lg font-semibold">
                        {currencyFormatter.format(metrics.discountedCashFlows[index]?.discounted || 0)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Sigma className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Key valuation metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Discount factor</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {metrics.discountFactor.toFixed(4)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Present value (lump sum)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(metrics.presentValue)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Effective annual rate</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentageFormatter.format(metrics.effectiveAnnualRate)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">
                    Present value of annuity
                  </p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(metrics.annuityPresentValue)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800 md:col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Net present value (NPV)</p>
                  <p
                    className={`text-2xl font-semibold ${
                      metrics.npv >= 0
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-rose-600 dark:text-rose-300'
                    }`}
                  >
                    {currencyFormatter.format(metrics.npv)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Break-even {metrics.breakEvenYear !== null ? `in year ${metrics.breakEvenYear}` : 'beyond the modelled horizon'}.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingDown className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Discounted cash flow table
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {metrics.discountedCashFlows.map((row, index) => (
                  <div
                    key={`${row.year}-${index}`}
                    className="flex items-center justify-between rounded-md border border-indigo-200 bg-white p-3 dark:border-indigo-800 dark:bg-indigo-950/30"
                  >
                    <span>Year {row.year}</span>
                    <span>
                      {currencyFormatter.format(row.amount)} →{' '}
                      {currencyFormatter.format(row.discounted)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Present value of annuity calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use this time value of money calculator to compare level payment streams with lump
                sum opportunities. A clear view of discounted receipts helps you capture the best
                return for every pound deployed.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Applying the present value formula
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The present value formula shown above discounts each cash flow to today, letting you
                benchmark projects, loans, or savings plans with precision before committing capital.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={presentValueFaqs} />
        </div>
      </section>
    </div>
  );
}
