// src/pages/calculators/loan-comparison-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Balance, Scale, LineChart } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/loan-comparison-calculator';

const schemaKeywords = [
  'Loan Affordability',
  'Comparison Rate',
  'Total Repayment',
  'APRC',
  'Loan Options',
];

const faqItems = [
  {
    question: 'What should I compare when choosing between two loans?',
    answer:
      'Monthly payment size, total repayment amount, interest charged, and any arrangement fees or early repayment penalties. APR and APRC figures help capture overall cost differences.',
  },
  {
    question: 'How does APR differ from interest rate?',
    answer:
      'The nominal interest rate reflects the cost of borrowing excluding fees. APR or APRC include mandatory fees, giving a clearer picture of the total borrowing cost.',
  },
  {
    question: 'Why might the cheapest monthly payment not be the best loan?',
    answer:
      'Longer loan terms reduce monthly payments but extend the repayment period, increasing total interest. Compare total cost to ensure borrowing decisions align with financial goals.',
  },
];

function computeMonthlyPayment(principal, annualRatePercent, termYears) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;

  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function summarizeLoan(principal, annualRatePercent, termYears, fees) {
  const monthlyPayment = computeMonthlyPayment(principal, annualRatePercent, termYears);
  const totalMonths = termYears * 12;
  const totalPaid = monthlyPayment * totalMonths + fees;
  const totalInterest = totalPaid - principal - fees;

  return {
    monthlyPayment,
    totalPaid,
    totalInterest,
    totalMonths,
  };
}

export default function LoanComparisonCalculator() {
  const [loanA, setLoanA] = useState({
    name: 'Loan A',
    amount: '15000',
    rate: '5.8',
    term: '4',
    fees: '125',
  });

  const [loanB, setLoanB] = useState({
    name: 'Loan B',
    amount: '15000',
    rate: '6.3',
    term: '3',
    fees: '0',
  });

  const handleChange = useCallback((loanSetter, field, value) => {
    loanSetter((prev) => ({ ...prev, [field]: value }));
  }, []);

  const comparison = useMemo(() => {
    const parsedLoanA = {
      amount: Number(loanA.amount) || 0,
      rate: Number(loanA.rate) || 0,
      term: Number(loanA.term) || 0,
      fees: Number(loanA.fees) || 0,
      name: loanA.name || 'Loan A',
    };

    const parsedLoanB = {
      amount: Number(loanB.amount) || 0,
      rate: Number(loanB.rate) || 0,
      term: Number(loanB.term) || 0,
      fees: Number(loanB.fees) || 0,
      name: loanB.name || 'Loan B',
    };

    const summaryA = summarizeLoan(
      parsedLoanA.amount,
      parsedLoanA.rate,
      parsedLoanA.term,
      parsedLoanA.fees,
    );
    const summaryB = summarizeLoan(
      parsedLoanB.amount,
      parsedLoanB.rate,
      parsedLoanB.term,
      parsedLoanB.fees,
    );

    const monthlyDifference = summaryA.monthlyPayment - summaryB.monthlyPayment;
    const totalCostDifference = summaryA.totalPaid - summaryB.totalPaid;

    return {
      summaryA,
      summaryB,
      loans: { a: parsedLoanA, b: parsedLoanB },
      monthlyDifference,
      totalCostDifference,
    };
  }, [loanA, loanB]);

  const reset = useCallback(() => {
    setLoanA({
      name: 'Loan A',
      amount: '15000',
      rate: '5.8',
      term: '4',
      fees: '125',
    });
    setLoanB({
      name: 'Loan B',
      amount: '15000',
      rate: '6.3',
      term: '3',
      fees: '0',
    });
  }, []);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-GB', {
        style: 'currency',
        currency: 'GBP',
      }),
    [],
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Loan Comparison & Best Loan Calculator</title>
        <meta
          name="description"
          content="Compare loan costs, review total repayment, and pick the best loan by analysing interest, APR, and monthly payments."
        />
        <meta name="keywords" content="Loan Interest, Compare APR, Cheapest Loan" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Loan Comparison Calculator',
              description:
                'Compare two loans side-by-side, including monthly payments, total cost, APR, and borrowing decisions.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              potentialAction: {
                '@type': 'Action',
                name: 'Compare loan costs',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Loan Comparison Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Compare loan costs, contrast loan terms, and support borrowing decisions with clear APR insight.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-2">
          {[loanA, loanB].map((loan, index) => {
            const setLoan = index === 0 ? setLoanA : setLoanB;
            const title = index === 0 ? 'Loan A' : 'Loan B';
            return (
              <Card
                key={title}
                className="border border-purple-200 dark:border-purple-900 shadow-sm"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <Calculator className="h-5 w-5 text-purple-500" />
                    {title} Inputs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium">Nickname</Label>
                    <Input
                      value={loan.name}
                      onChange={(event) => handleChange(setLoan, 'name', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Loan amount (£)</Label>
                    <Input
                      inputMode="decimal"
                      value={loan.amount}
                      onChange={(event) => handleChange(setLoan, 'amount', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Interest rate (% per year)</Label>
                    <Input
                      inputMode="decimal"
                      value={loan.rate}
                      onChange={(event) => handleChange(setLoan, 'rate', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Term (years)</Label>
                    <Input
                      inputMode="decimal"
                      value={loan.term}
                      onChange={(event) => handleChange(setLoan, 'term', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Fees (£)</Label>
                    <Input
                      inputMode="decimal"
                      value={loan.fees}
                      onChange={(event) => handleChange(setLoan, 'fees', event.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="button" variant="outline" onClick={reset}>
            Reset both loans
          </Button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Scale className="h-5 w-5 text-purple-500" />
                Comparison Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">{comparison.loans.a.name} monthly payment</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(comparison.summaryA.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{comparison.loans.b.name} monthly payment</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(comparison.summaryB.monthlyPayment)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{comparison.loans.a.name} total repayment</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(comparison.summaryA.totalPaid)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{comparison.loans.b.name} total repayment</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(comparison.summaryB.totalPaid)}
                  </p>
                </div>
              </div>
              <div className="rounded border border-muted-foreground/15 px-4 py-3">
                <p className="font-medium text-foreground">Monthly payment difference</p>
                <p
                  className={
                    comparison.monthlyDifference > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }
                >
                  {currencyFormatter.format(Math.abs(comparison.monthlyDifference))}{' '}
                  {comparison.monthlyDifference > 0 ? 'more' : 'less'} per month on{' '}
                  {comparison.monthlyDifference > 0
                    ? comparison.loans.a.name
                    : comparison.loans.b.name}
                </p>
              </div>
              <div className="rounded border border-muted-foreground/15 px-4 py-3">
                <p className="font-medium text-foreground">Total cost comparison</p>
                <p
                  className={
                    comparison.totalCostDifference > 0 ? 'text-rose-600' : 'text-emerald-600'
                  }
                >
                  {currencyFormatter.format(Math.abs(comparison.totalCostDifference))}{' '}
                  {comparison.totalCostDifference > 0 ? 'higher' : 'lower'} total repayment on{' '}
                  {comparison.totalCostDifference > 0
                    ? comparison.loans.a.name
                    : comparison.loans.b.name}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <LineChart className="h-5 w-5 text-purple-500" />
                Interest vs APR Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                • Compare the impact of different APRs or APRC values to understand the true cost of
                borrowing.
              </p>
              <p>
                • Shorter terms raise monthly payments but reduce total interest, helping reach a
                lower total cost comparison.
              </p>
              <p>
                • Factor in all fees and penalties when deciding which loan option best fits your
                borrowing decisions.
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Compare Loan Costs with Clarity
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Weigh monthly payments, total cost, APR, and fees to make smart borrowing decisions. A
            comprehensive comparison helps you select the best loan for your circumstances.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Loan Terms and Interest vs APR
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            The nominal interest rate shows borrowing cost before fees, while APR rolls fees into a
            single comparison rate. Use both to understand how loan terms influence affordability.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Total Cost Comparison for Borrowing Decisions
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Prioritise the loan option that balances manageable monthly payments with the lowest
            total repayment. Small adjustments to term or fees can have a big impact over time.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
