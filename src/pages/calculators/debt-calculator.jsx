import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingDown, AlertCircle } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['debt calculator', 'personal debt calculator', 'consumer debt calculator'];

const metaDescription =
  'Use our debt calculator to consolidate balances, plan personal debt calculator scenarios, and map consumer debt calculator strategies to your repayment plan.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/debt-calculator';
const schemaKeywords = keywords.slice(0, 5);

const MAX_MONTHS = 600;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatDuration = (months) => {
  const totalMonths = Math.ceil(months);
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  if (years <= 0) return `${remainingMonths} months`;
  if (remainingMonths === 0) return `${years} years`;
  return `${years} yrs ${remainingMonths} mths`;
};

const computeDebtPayoff = ({ balance, rate, payment, extraPayment }) => {
  const monthlyRate = rate / 100 / 12;
  const totalPayment = payment + extraPayment;

  if (balance <= 0) {
    return {
      payoffMonths: 0,
      totalInterest: 0,
      totalPaid: 0,
      schedule: [],
      valid: true,
      message: 'Balance already cleared.',
    };
  }

  if (totalPayment <= 0) {
    return {
      payoffMonths: MAX_MONTHS,
      totalInterest: 0,
      totalPaid: 0,
      schedule: [],
      valid: false,
      message: 'Monthly payment must be greater than zero to reduce your debt.',
    };
  }

  let currentBalance = balance;
  let month = 0;
  let totalInterest = 0;
  const schedule = [];

  while (currentBalance > 0 && month < MAX_MONTHS) {
    const interestPayment = monthlyRate > 0 ? currentBalance * monthlyRate : 0;
    const principalPayment = totalPayment - interestPayment;

    if (principalPayment <= 0) {
      return {
        payoffMonths: MAX_MONTHS,
        totalInterest,
        totalPaid: totalPayment * month,
        schedule,
        valid: false,
        message:
          'Monthly payment is too low to cover accruing interest. Increase your payment to see a payoff date.',
      };
    }

    const actualPrincipalPayment = Math.min(principalPayment, currentBalance);
    currentBalance -= actualPrincipalPayment;
    totalInterest += interestPayment;
    month += 1;

    if (month <= 60) {
      schedule.push({
        month,
        payment: totalPayment,
        interest: interestPayment,
        principal: actualPrincipalPayment,
        remaining: Math.max(currentBalance, 0),
      });
    }
  }

  return {
    payoffMonths: month,
    totalInterest,
    totalPaid: totalPayment * month,
    schedule,
    valid: true,
    message: '',
  };
};

const debtCalculatorFaqs = [
  {
    question: 'How is interest calculated in this debt calculator?',
    answer:
      'Interest accrues daily on credit cards and monthly on many loans. We approximate it using the APR divided into monthly periods so you can see how much extra interest adds up without overcomplicating the inputs.',
  },
  {
    question: 'Can I include multiple debts?',
    answer:
      'Start by modelling your highest-interest debt. For multiple balances, total the amounts with a weighted average APR or rerun the calculator for each debt to see which payoff order saves the most interest.',
  },
  {
    question: 'What if my payment is too low?',
    answer:
      'If your repayment fails to cover monthly interest, you will never reach zero. The calculator alerts you if that happens so you can increase your repayments or explore consolidation options.',
  },
];

export default function DebtCalculatorPage() {
  const [inputs, setInputs] = useState({
    balance: 12500,
    annualRate: 19.9,
    monthlyPayment: 320,
    extraPayment: 50,
  });

  const results = useMemo(
    () =>
      computeDebtPayoff({
        balance: Number(inputs.balance) || 0,
        rate: Number(inputs.annualRate) || 0,
        payment: Number(inputs.monthlyPayment) || 0,
        extraPayment: Number(inputs.extraPayment) || 0,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      balance: 12500,
      annualRate: 19.9,
      monthlyPayment: 320,
      extraPayment: 50,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Debt Calculator | Personal Debt Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Debt Calculator | Personal Debt Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Debt Calculator | Personal Debt Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Debt Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan debt repayment',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-rose-900 via-slate-900 to-rose-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Debt Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Understand how long it will take to clear your balance, how much interest you will pay,
            and how extra payments accelerate your personal debt repayment plan.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Debt Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="balance" className="text-sm font-medium">
                  Outstanding balance (£)
                </Label>
                <Input
                  id="balance"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.balance}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, balance: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Annual interest rate (APR)
                  <span className="text-rose-600 font-semibold">
                    {inputs.annualRate.toFixed(2)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.annualRate]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, annualRate: value[0] }))
                  }
                  min={0}
                  max={40}
                  step={0.25}
                />
              </div>
              <div>
                <Label htmlFor="monthlyPayment" className="text-sm font-medium">
                  Minimum monthly payment (£)
                </Label>
                <Input
                  id="monthlyPayment"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.monthlyPayment}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, monthlyPayment: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="extraPayment" className="text-sm font-medium">
                  Extra payment (£)
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
                  Applied in addition to your minimum payment every month.
                </p>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-rose-900 dark:text-rose-100">
                  <PiggyBank className="h-5 w-5" />
                  Repayment Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                  <p className="text-sm text-rose-700 dark:text-rose-200">Payoff time</p>
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                    {results.valid ? formatDuration(results.payoffMonths) : 'No payoff'}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                  <p className="text-sm text-rose-700 dark:text-rose-200">Total interest</p>
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                    {currencyFormatter.format(results.totalInterest)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                  <p className="text-sm text-rose-700 dark:text-rose-200">Total paid</p>
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                    {currencyFormatter.format(results.totalPaid)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                  <p className="text-sm text-rose-700 dark:text-rose-200">Monthly payment</p>
                  <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                    {currencyFormatter.format(inputs.monthlyPayment + inputs.extraPayment)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {!results.valid && results.message ? (
              <Card className="border border-rose-200 dark:border-rose-900 shadow-sm bg-rose-50 dark:bg-rose-900/20">
                <CardContent className="flex items-center gap-3 text-rose-900 dark:text-rose-100 py-5">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">{results.message}</p>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingDown className="h-5 w-5 text-slate-600" />
                  First Year Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-xs uppercase tracking-wide bg-slate-100 dark:bg-slate-900">
                    <tr>
                      <th className="px-4 py-2">Month</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Interest</th>
                      <th className="px-4 py-2">Principal</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.schedule.length === 0 ? (
                      <tr>
                        <td className="px-4 py-3 text-slate-500" colSpan={5}>
                          Add a monthly payment to see the repayment schedule.
                        </td>
                      </tr>
                    ) : (
                      results.schedule.slice(0, 12).map((entry) => (
                        <tr
                          key={entry.month}
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        >
                          <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
                            {entry.month}
                          </td>
                          <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                            {currencyFormatter.format(entry.payment)}
                          </td>
                          <td className="px-4 py-2 text-rose-600 dark:text-rose-200">
                            {currencyFormatter.format(entry.interest)}
                          </td>
                          <td className="px-4 py-2 text-emerald-600 dark:text-emerald-200">
                            {currencyFormatter.format(entry.principal)}
                          </td>
                          <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                            {currencyFormatter.format(entry.remaining)}
                          </td>
                        </tr>
                      ))
                    )}
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
                Personal debt calculator strategies
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The personal debt calculator view highlights how changing your APR or payoff amount
                affects long-term costs. Experiment with balance transfers or consolidation loans to
                find the fastest route to debt freedom.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Using the consumer debt calculator to stay motivated
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Track progress by revisiting this consumer debt calculator each month. Seeing the
                principal fall and interest shrink keeps you motivated to maintain or increase extra
                payments.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={debtCalculatorFaqs} />
        </div>
      </section>
    </div>
  );
}
