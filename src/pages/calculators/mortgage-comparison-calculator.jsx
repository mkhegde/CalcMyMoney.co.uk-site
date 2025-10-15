import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const metaDescription =
  'Use our mortgage comparison calculator to compare mortgage rates, view repayments side by side, and see the total cost of two mortgage deals before you decide.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-comparison-calculator';
const schemaKeywords = [
  'mortgage comparison calculator',
  'compare mortgage rates',
  'mortgage comparison',
];

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const calculateRepayment = (amount, rate, termYears) => {
  const monthlyRate = rate / 100 / 12;
  const months = termYears * 12;
  if (monthlyRate === 0) return amount / months;
  return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
};

const buildComparison = ({ loanAmount, termYears, mortgageA, mortgageB }) => {
  const paymentA = calculateRepayment(loanAmount, mortgageA.rate, termYears);
  const totalInterestA = paymentA * termYears * 12 - loanAmount;
  const totalCostA = loanAmount + totalInterestA + mortgageA.fees;

  const paymentB = calculateRepayment(loanAmount, mortgageB.rate, termYears);
  const totalInterestB = paymentB * termYears * 12 - loanAmount;
  const totalCostB = loanAmount + totalInterestB + mortgageB.fees;

  return {
    a: {
      payment: paymentA,
      interest: totalInterestA,
      fees: mortgageA.fees,
      totalCost: totalCostA,
    },
    b: {
      payment: paymentB,
      interest: totalInterestB,
      fees: mortgageB.fees,
      totalCost: totalCostB,
    },
    difference: {
      payment: paymentB - paymentA,
      totalCost: totalCostB - totalCostA,
    },
  };
};

const comparisonFaqs = [
  {
    question: 'Should I include lender fees?',
    answer:
      'Yes. Arrangement and valuation fees can significantly change the total cost. Enter each lender’s fees so the comparison is accurate.',
  },
  {
    question: 'How do I compare fixed and variable rates?',
    answer:
      'Use promotional rates for the fixed period and stress test variable rates with a higher figure. Refresh the comparison when you remortgage.',
  },
  {
    question: 'Can I model overpayments?',
    answer:
      'This basic comparison focuses on standard payments. To model overpayments, reduce the term or recalculate with a lower loan amount after your lump sum.',
  },
];

export default function MortgageComparisonCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: 250000,
    termYears: 25,
    mortgageA: { rate: 4.2, fees: 999 },
    mortgageB: { rate: 5.1, fees: 0 },
  });

  const results = useMemo(
    () =>
      buildComparison({
        loanAmount: Number(inputs.loanAmount) || 0,
        termYears: Number(inputs.termYears) || 0,
        mortgageA: {
          rate: Number(inputs.mortgageA.rate) || 0,
          fees: Number(inputs.mortgageA.fees) || 0,
        },
        mortgageB: {
          rate: Number(inputs.mortgageB.rate) || 0,
          fees: Number(inputs.mortgageB.fees) || 0,
        },
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      loanAmount: 250000,
      termYears: 25,
      mortgageA: { rate: 4.2, fees: 999 },
      mortgageB: { rate: 5.1, fees: 0 },
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Mortgage Comparison Calculator | Compare Mortgage Rates</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Mortgage Comparison Calculator | Compare Mortgage Rates"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mortgage Comparison Calculator | Compare Mortgage Rates"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Mortgage Comparison Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Compare mortgage rates',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Mortgage Comparison Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Compare two mortgage deals side by side. See monthly repayments, total interest, and the
            overall cost including lender fees.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Loan Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="loanAmount" className="text-sm font-medium">
                  Loan amount (£)
                </Label>
                <Input
                  id="loanAmount"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.loanAmount}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, loanAmount: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Term (years)
                  <span className="text-indigo-600 font-semibold">{inputs.termYears}</span>
                </Label>
                <Slider
                  value={[inputs.termYears]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, termYears: Math.round(value[0]) }))
                  }
                  min={5}
                  max={40}
                  step={1}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Mortgage A rate (%)</Label>
                  <Slider
                    value={[inputs.mortgageA.rate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageA: { ...prev.mortgageA, rate: Number(value[0].toFixed(2)) },
                      }))
                    }
                    min={1}
                    max={10}
                    step={0.05}
                  />
                  <Input
                    className="mt-2"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.mortgageA.fees}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageA: { ...prev.mortgageA, fees: Number(event.target.value) },
                      }))
                    }
                    placeholder="Mortgage A fees (£)"
                  />
                </div>
                <div>
                  <Label className="text-sm font-semibold">Mortgage B rate (%)</Label>
                  <Slider
                    value={[inputs.mortgageB.rate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageB: { ...prev.mortgageB, rate: Number(value[0].toFixed(2)) },
                      }))
                    }
                    min={1}
                    max={10}
                    step={0.05}
                  />
                  <Input
                    className="mt-2"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.mortgageB.fees}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageB: { ...prev.mortgageB, fees: Number(event.target.value) },
                      }))
                    }
                    placeholder="Mortgage B fees (£)"
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
                  <Home className="h-5 w-5" />
                  Comparison Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">
                    Monthly payment (A)
                  </p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.a.payment)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">
                    Monthly payment (B)
                  </p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.b.payment)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Difference</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.difference.payment)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Total Cost Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Mortgage A total cost:</span>{' '}
                  {currencyFormatter(results.a.totalCost)} (Interest{' '}
                  {currencyFormatter(results.a.interest)} + Fees {currencyFormatter(results.a.fees)}
                  )
                </p>
                <p>
                  <span className="font-semibold">Mortgage B total cost:</span>{' '}
                  {currencyFormatter(results.b.totalCost)} (Interest{' '}
                  {currencyFormatter(results.b.interest)} + Fees {currencyFormatter(results.b.fees)}
                  )
                </p>
                <p>
                  <span className="font-semibold">Overall difference:</span>{' '}
                  {currencyFormatter(results.difference.totalCost)} over the full term.
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
                Mortgage comparison calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Compare mortgage rates by varying the interest, fees, and terms. The mortgage
                comparison calculator highlights how lower fees can beat a slightly cheaper rate.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={comparisonFaqs} />
        </div>
      </section>
    </div>
  );
}
