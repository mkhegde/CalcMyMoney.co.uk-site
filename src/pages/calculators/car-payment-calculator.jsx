import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, CreditCard, Percent, Gauge } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'car payment calculator',
  'auto payment calculator',
  'car loan payment calculator',
  'monthly car payment calculator',
  'vehicle payment calculator',
];

const metaDescription =
  'Use our car payment calculator and auto payment calculator to estimate car loan payment calculator results, monthly car payment calculator schedules, and total interest before buying.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-payment-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = (value) =>
  Number.isFinite(value)
    ? value.toLocaleString('en-GB', {
        style: 'currency',
        currency: 'GBP',
        minimumFractionDigits: 0,
      })
    : '£0';

const carPaymentFaqs = [
  {
    question: 'How do I include optional extras or fees?',
    answer:
      'Add them to the loan amount. The car loan payment calculator assumes the financed balance already includes administration fees, negative equity, or warranties you roll into the agreement.',
  },
  {
    question: 'Can I see the interest breakdown?',
    answer:
      'Yes. The results show total interest paid across the term. Shorter terms and lower APRs dramatically reduce the interest highlighted by the vehicle payment calculator.',
  },
  {
    question: 'What is a good debt-to-income ratio for car loans?',
    answer:
      'Most lenders prefer car payments below 15% of gross monthly income. Use the monthly car payment calculator to test affordability before you apply.',
  },
];

const calculateCarPayment = ({ loanAmount, deposit, apr, termMonths }) => {
  const principal = Math.max(loanAmount - deposit, 0);
  const months = Math.max(termMonths, 1);
  const monthlyRate = Math.max(apr, 0) / 100 / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / months;
  } else {
    const factor = (1 + monthlyRate) ** months;
    monthlyPayment = principal * (monthlyRate * factor) / (factor - 1);
  }

  const totalPaid = monthlyPayment * months;
  const totalInterest = totalPaid - principal;

  return {
    principal,
    monthlyPayment,
    totalPaid,
    totalInterest,
    monthlyRate,
  };
};

export default function CarPaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: 18000,
    deposit: 0,
    apr: 6.5,
    termMonths: 60,
  });

  const results = useMemo(
    () =>
      calculateCarPayment({
        loanAmount: Number(inputs.loanAmount) || 0,
        deposit: Number(inputs.deposit) || 0,
        apr: Number(inputs.apr) || 0,
        termMonths: Number(inputs.termMonths) || 0,
      }),
    [inputs]
  );

  const resetAll = () =>
    setInputs({
      loanAmount: 18000,
      deposit: 0,
      apr: 6.5,
      termMonths: 60,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Car Payment Calculator | Auto Payment Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Car Payment Calculator | Auto Payment Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Car Payment Calculator | Auto Payment Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Car Payment Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate payments with a car payment calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Car Payment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Convert loan offers into clear monthly repayments, compare APRs, and plan the impact on your
            household budget before you buy.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Loan inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan amount (£)</Label>
                  <Input
                    id="loanAmount"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.loanAmount}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        loanAmount: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit / Cash (£)</Label>
                  <Input
                    id="deposit"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.deposit}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        deposit: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Finance terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="termMonths">Term (months)</Label>
                  <Slider
                    id="termMonths"
                    className="mt-3"
                    value={[Number(inputs.termMonths)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        termMonths: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={12}
                    max={84}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>12</span>
                    <span>{inputs.termMonths} months</span>
                    <span>84</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apr">APR (%)</Label>
                  <Slider
                    id="apr"
                    className="mt-3"
                    value={[Number(inputs.apr)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        apr: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={20}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>0%</span>
                    <span>{inputs.apr.toFixed(1)}%</span>
                    <span>20%</span>
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
                  <Gauge className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Monthly car payment calculator results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Financed principal</span>
                  <span>{currencyFormatter(results.principal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly payment</span>
                  <span>{currencyFormatter(results.monthlyPayment)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total interest paid</span>
                  <span>{currencyFormatter(results.totalInterest)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total amount payable</span>
                  <span>{currencyFormatter(results.totalPaid)}</span>
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
                Car loan payment calculator and monthly car payment calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Shorter terms mean higher monthly car payment calculator outputs but markedly less
                interest. Experiment with deposits and APR to reach a comfortable payment.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Vehicle payment calculator comparisons
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Compare dealer finance, bank loans, and credit union offers by matching term and APR. The
                vehicle payment calculator makes it easy to see which lender offers the best overall cost.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={carPaymentFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
