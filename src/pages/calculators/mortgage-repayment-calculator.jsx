import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingDown } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const metaDescription =
  'Use our mortgage repayment calculator to plan your mortgage allocation, test repayment scenarios, and understand how overpayments change the mortgage repayment schedule.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-repayment-calculator';
const schemaKeywords = [
  'mortgage repayment calculator',
  'home loan repayment calculator',
  'loan payoff calculator',
  'loan payment schedule calculator',
  'loan calculator with extra payments',
];

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const calculateSchedule = ({ loanAmount, interestRate, termYears, extraPayment }) => {
  const monthlyRate = interestRate / 100 / 12;
  const months = termYears * 12;
  const basePayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  let balance = loanAmount;
  const schedule = [];
  let totalInterest = 0;
  let month = 0;

  while (balance > 0 && month < 1000) {
    month += 1;
    const interest = balance * monthlyRate;
    let principal = basePayment + extraPayment - interest;
    if (principal <= 0) {
      principal = 0;
    }
    if (principal > balance) {
      principal = balance;
    }
    balance -= principal;
    totalInterest += interest;
    schedule.push({
      month,
      payment: principal + interest,
      interest,
      principal,
      balance: Math.max(balance, 0),
    });
  }

  const totalPaid = schedule.reduce((sum, entry) => sum + entry.payment, 0);
  return {
    schedule,
    totalInterest,
    totalPaid,
    monthsToClear: schedule.length,
    monthlyPayment: basePayment + extraPayment,
  };
};

const repaymentFaqs = [
  {
    question: 'How do extra payments affect my mortgage?',
    answer:
      'Extra payments reduce the principal faster, shorten the term, and cut total interest. The calculator shows the new payoff date after applying your extra amount.',
  },
  {
    question: 'Can I model interest-only periods?',
    answer:
      'For interest-only stages, set the term to the total loan length and use the base payment to reflect interest-only payments. Then add overpayments to estimate principal reductions.',
  },
  {
    question: 'How often should I review my mortgage repayment plan?',
    answer:
      'Review when your rate changes, after remortgaging, or when you receive bonuses. Regular checks help identify whether overpayments remain worthwhile or if you should re-fix your rate.',
  },
];

export default function MortgageRepaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: 275000,
    interestRate: 4.9,
    termYears: 25,
    extraPayment: 100,
  });

  const results = useMemo(() => calculateSchedule(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      loanAmount: 275000,
      interestRate: 4.9,
      termYears: 25,
      extraPayment: 100,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Mortgage Repayment Calculator | Home Loan Repayment Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Mortgage Repayment Calculator | Home Loan Repayment Calculator"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mortgage Repayment Calculator | Home Loan Repayment Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Mortgage Repayment Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate mortgage repayments',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Mortgage Repayment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Measure how payments split between interest and principal, see how extra payments
            shorten your term, and plan a faster mortgage payoff strategy.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Mortgage Inputs
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
                  Interest rate
                  <span className="text-indigo-600 font-semibold">
                    {inputs.interestRate.toFixed(2)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.interestRate]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, interestRate: Number(value[0].toFixed(2)) }))
                  }
                  min={1}
                  max={12}
                  step={0.05}
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
              <div>
                <Label htmlFor="extraPayment" className="text-sm font-medium">
                  Extra payment (£/month)
                </Label>
                <Input
                  id="extraPayment"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.extraPayment}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, extraPayment: Number(event.target.value) }))
                  }
                />
                <p className="text-xs text-slate-500 mt-1">
                  Applied in addition to the standard repayment. Helps you see new payoff dates and
                  interest savings.
                </p>
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
                  <PiggyBank className="h-5 w-5" />
                  Repayment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Monthly payment</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.monthlyPayment)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total interest</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.totalInterest)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total paid</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.totalPaid)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Months to clear</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {results.monthsToClear}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingDown className="h-5 w-5 text-slate-600" />
                  First 12 Months Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-900 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2">Month</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Interest</th>
                      <th className="px-4 py-2">Principal</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.slice(0, 12).map((entry) => (
                      <tr
                        key={entry.month}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
                          {entry.month}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                          {currencyFormatter(entry.payment)}
                        </td>
                        <td className="px-4 py-2 text-rose-600 dark:text-rose-200">
                          {currencyFormatter(entry.interest)}
                        </td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-200">
                          {currencyFormatter(entry.principal)}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                          {currencyFormatter(entry.balance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Mortgage repayment calculator strategies
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Try different extra payment amounts to see how quickly the mortgage repayment
                calculator trims years off your loan. Even small overpayments compound into big
                interest savings.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning a home loan repayment calculator schedule
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Export the first year’s schedule to stay accountable. Revisit the home loan
                repayment calculator every time your rate changes so you always know your payoff
                trajectory.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={repaymentFaqs} />
        </div>
      </section>
    </div>
  );
}
