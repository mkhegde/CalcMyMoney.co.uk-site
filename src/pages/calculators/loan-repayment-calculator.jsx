// src/pages/calculators/loan-repayment-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Layers, TrendingUp, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/loan-repayment-calculator';

const schemaKeywords = [
  'Loan Amount',
  'Interest Rate',
  'Repayment Term',
  'Total Cost',
  'Personal Loans',
];

const faqItems = [
  {
    question: 'How is my monthly loan repayment calculated?',
    answer:
      'We apply the standard amortisation formula using your loan amount, annual interest rate, and repayment term. The calculation assumes fixed monthly payments over the term selected.',
  },
  {
    question: 'How can I reduce the total interest paid on a loan?',
    answer:
      'Make extra payments towards the principal, refinance at a lower rate, or shorten the loan term. Even small additional monthly contributions can shave years off a mortgage or personal loan.',
  },
  {
    question: 'What does the amortisation schedule show?',
    answer:
      'Each line of the schedule breaks your payment into interest and principal, showing how much of the balance remains after every instalment. Early payments are interest-heavy, but the principal share grows over time.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function computeMonthlyPayment(principal, annualRatePercent, termYears) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;

  if (principal <= 0 || totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function buildAmortisationSchedule(principal, annualRatePercent, termYears, extraPayment) {
  const monthlyPaymentBase = computeMonthlyPayment(principal, annualRatePercent, termYears);
  const monthlyPayment = monthlyPaymentBase + extraPayment;
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;

  let balance = principal;
  const schedule = [];
  for (let month = 1; month <= totalMonths && balance > 0; month += 1) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(monthlyPayment - interest, balance);
    balance = Math.max(balance - principalPaid, 0);

    schedule.push({
      month,
      payment: monthlyPayment,
      interest,
      principal: principalPaid,
      balance,
    });

    if (balance <= 0) break;
  }

  return schedule;
}

export default function LoanRepaymentCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: '25000',
    annualRate: '6.5',
    termYears: '5',
    extraMonthly: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const loanAmount = Number(inputs.loanAmount) || 0;
    const annualRate = Number(inputs.annualRate) || 0;
    const termYears = Number(inputs.termYears) || 0;
    const extraMonthly = Number(inputs.extraMonthly) || 0;

    const baseMonthlyPayment = computeMonthlyPayment(loanAmount, annualRate, termYears);
    const schedule = buildAmortisationSchedule(loanAmount, annualRate, termYears, extraMonthly);
    const actualMonths = schedule.length;

    const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
    const totalInterest = totalPaid - loanAmount;

    return {
      baseMonthlyPayment,
      schedule,
      totalPaid,
      totalInterest,
      actualMonths,
      monthlyPaymentWithExtra: baseMonthlyPayment + extraMonthly,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      loanAmount: '25000',
      annualRate: '6.5',
      termYears: '5',
      extraMonthly: '0',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Loan Repayment & Amortisation Schedule Calculator</title>
        <meta
          name="description"
          content="Plan loan repayments, explore amortisation schedules, and estimate total interest with our loan repayment calculator."
        />
        <meta name="keywords" content="Loan Calculator, Monthly Payments, Interest Paid" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Loan Repayment Calculator',
              description:
                'Calculate monthly repayments, view amortisation schedules, and plan debt payoff for personal loans, car loans, or mortgages.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate loan repayments',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Loan Repayment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-blue-100">
            Calculate repayments, map an amortisation schedule, and plan debt payoff with confidence.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Loan Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loanAmount" className="text-sm font-medium">
                  Loan amount (£)
                </Label>
                <Input
                  id="loanAmount"
                  inputMode="decimal"
                  value={inputs.loanAmount}
                  onChange={(event) => handleChange('loanAmount', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualRate" className="text-sm font-medium">
                  Annual interest rate (%)
                </Label>
                <Input
                  id="annualRate"
                  inputMode="decimal"
                  value={inputs.annualRate}
                  onChange={(event) => handleChange('annualRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="termYears" className="text-sm font-medium">
                  Term (years)
                </Label>
                <Input
                  id="termYears"
                  inputMode="decimal"
                  value={inputs.termYears}
                  onChange={(event) => handleChange('termYears', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="extraMonthly" className="text-sm font-medium">
                  Extra monthly payment (£)
                </Label>
                <Input
                  id="extraMonthly"
                  inputMode="decimal"
                  value={inputs.extraMonthly}
                  onChange={(event) => handleChange('extraMonthly', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-blue-500" />
                  Repayment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Monthly payment</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {currencyFormatter.format(results.monthlyPaymentWithExtra)}
                    </p>
                    <p className="caption text-muted-foreground">
                      Includes base payment plus extra contribution
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total interest</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total repaid</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.totalPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Months to clear</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.actualMonths}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Layers className="h-5 w-5 text-blue-500" />
                  Amortisation Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {results.schedule.slice(0, 6).map((row) => (
                  <div
                    key={row.month}
                    className="flex flex-wrap justify-between rounded border border-muted-foreground/10 px-3 py-2"
                  >
                    <span className="font-medium text-foreground">Month {row.month}</span>
                    <span>Payment: {currencyFormatter.format(row.payment)}</span>
                    <span>Interest: {currencyFormatter.format(row.interest)}</span>
                    <span>Principal: {currencyFormatter.format(row.principal)}</span>
                    <span>Balance: {currencyFormatter.format(row.balance)}</span>
                  </div>
                ))}
                {results.schedule.length > 6 && (
                  <p className="caption text-muted-foreground">
                    Showing first six payments. Continue exporting for full amortisation details.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Repayments and Plan Debt Strategically
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding the breakdown of principal and interest is critical to debt planning. Use
            this calculator to model monthly obligations and test how extra payments reduce total
            interest paid.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Loan Terminology, Principal, and Interest
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Principal represents the amount borrowed, while interest compensates the lender over the
            term. The amortisation schedule shows how each payment reduces the principal and how
            much interest you pay across the life of the loan.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Debt Planning Through Extra Payments
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Even modest extra monthly payments can save thousands in interest and shorten the term.
            Experiment with different contributions to identify the most efficient payoff strategy.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
