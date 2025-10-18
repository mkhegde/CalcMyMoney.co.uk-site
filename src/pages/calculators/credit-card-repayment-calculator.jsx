import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, CreditCard, TrendingDown, ShieldCheck } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/credit-card-repayment-calculator';

const schemaKeywords = [
  'Credit Card Balance',
  'Interest Rate',
  'Payoff Date',
  'Monthly Payment',
  'Debt Management',
];

const faqItems = [
  {
    question: 'How can I pay off credit card debt faster?',
    answer:
      'Pay more than the minimum each month, target the highest interest balance first, and consider balance transfer offers with lower introductory rates. Track your progress to stay motivated.',
  },
  {
    question: 'What happens if I only make the minimum payment?',
    answer:
      'Only paying the minimum extends the payoff date dramatically and increases total interest. Use this calculator to see how small increases in payment shorten the repayment period.',
  },
  {
    question: 'Should I consolidate my credit card debt?',
    answer:
      'Debt consolidation can simplify payments and reduce interest if you qualify for a lower rate. Compare the new payment schedule against your current plan before committing.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function payoffEstimate(balance, annualRatePercent, monthlyPayment, minPaymentRate, minPaymentFloor) {
  const monthlyRate = annualRatePercent / 100 / 12;
  let remainingBalance = balance;
  let months = 0;
  let totalInterest = 0;
  let totalPaid = 0;

  while (remainingBalance > 0 && months < 1200) {
    const interest = remainingBalance * monthlyRate;
    const minimumDue = Math.max(minPaymentFloor, (remainingBalance + interest) * minPaymentRate);
    const paymentThisMonth = Math.max(monthlyPayment, minimumDue);
    const principalPaid = paymentThisMonth - interest;

    if (principalPaid <= 0) {
      // Payment not enough to cover interest; break to avoid infinite loop
      totalInterest += interest;
      totalPaid += paymentThisMonth;
      months += 1;
      break;
    }

    remainingBalance = Math.max(0, remainingBalance - principalPaid);
    totalInterest += interest;
    totalPaid += paymentThisMonth;
    months += 1;

    if (remainingBalance <= 0) break;
  }

  return {
    months,
    totalInterest,
    totalPaid,
    remainingBalance,
  };
}

export default function CreditCardRepaymentCalculator() {
  const [inputs, setInputs] = useState({
    balance: '4500',
    annualRate: '23.9',
    monthlyPayment: '200',
    minPaymentRate: '0.03',
    minPaymentFloor: '5',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      balance: '4500',
      annualRate: '23.9',
      monthlyPayment: '200',
      minPaymentRate: '0.03',
      minPaymentFloor: '5',
    });
  }, []);

  const results = useMemo(() => {
    const balance = Number(inputs.balance) || 0;
    const annualRate = Number(inputs.annualRate) || 0;
    const monthlyPayment = Number(inputs.monthlyPayment) || 0;
    const minPaymentRate = Number(inputs.minPaymentRate) || 0;
    const minPaymentFloor = Number(inputs.minPaymentFloor) || 0;

    const minimumScenario = payoffEstimate(
      balance,
      annualRate,
      0,
      Math.max(0.01, minPaymentRate),
      Math.max(1, minPaymentFloor),
    );
    const acceleratedScenario = payoffEstimate(
      balance,
      annualRate,
      Math.max(monthlyPayment, 0),
      Math.max(0.01, minPaymentRate),
      Math.max(1, minPaymentFloor),
    );

    const monthsSaved =
      minimumScenario.months && acceleratedScenario.months
        ? minimumScenario.months - acceleratedScenario.months
        : 0;
    const interestSaved = minimumScenario.totalInterest - acceleratedScenario.totalInterest;

    return {
      balance,
      annualRate,
      monthlyPayment,
      minPaymentRate,
      minPaymentFloor,
      minimumScenario,
      acceleratedScenario,
      monthsSaved,
      interestSaved,
    };
  }, [inputs]);

  const payoffYears = (months) => (months ? (months / 12).toFixed(1) : 'n/a');

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Credit Card Repayment &amp; Debt Payoff Calculator</title>
        <meta
          name="description"
          content="Credit Card Repayment Calculator showing payoff timelines, minimum payment comparisons, and total interest to help plan debt payoff."
        />
        <meta
          name="keywords"
          content="Credit Card Calculator, Minimum Payment, Total Interest"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Credit Card Repayment Calculator',
              description:
                'Debt payoff planning tool for credit card balances, visualising interest charges, payoff dates, and monthly payment requirements.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Credit Card Repayment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Calculate payoff timelines, manage credit card debt, and understand interest charges on the journey to debt free financial freedom.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Credit Card Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="balance" className="text-sm font-medium">
                  Current balance (GBP)
                </Label>
                <Input
                  id="balance"
                  inputMode="decimal"
                  value={inputs.balance}
                  onChange={(event) => handleChange('balance', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualRate" className="text-sm font-medium">
                  Annual interest rate (% APR)
                </Label>
                <Input
                  id="annualRate"
                  inputMode="decimal"
                  value={inputs.annualRate}
                  onChange={(event) => handleChange('annualRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyPayment" className="text-sm font-medium">
                  Planned monthly payment (GBP)
                </Label>
                <Input
                  id="monthlyPayment"
                  inputMode="decimal"
                  value={inputs.monthlyPayment}
                  onChange={(event) => handleChange('monthlyPayment', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="minPaymentRate" className="text-sm font-medium">
                  Minimum payment rate (fraction e.g. 0.03)
                </Label>
                <Input
                  id="minPaymentRate"
                  inputMode="decimal"
                  value={inputs.minPaymentRate}
                  onChange={(event) => handleChange('minPaymentRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="minPaymentFloor" className="text-sm font-medium">
                  Minimum payment floor (GBP)
                </Label>
                <Input
                  id="minPaymentFloor"
                  inputMode="decimal"
                  value={inputs.minPaymentFloor}
                  onChange={(event) => handleChange('minPaymentFloor', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="h-5 w-5 text-rose-500" />
                  Minimum Payment Scenario
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Payoff time (months)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.minimumScenario.months || 'n/a'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payoff time (years)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {payoffYears(results.minimumScenario.months)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total interest paid</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.minimumScenario.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total payments</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.minimumScenario.totalPaid)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingDown className="h-5 w-5 text-rose-500" />
                  Accelerated Payoff
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Payoff time (months)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.acceleratedScenario.months || 'n/a'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payoff time (years)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {payoffYears(results.acceleratedScenario.months)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total interest paid</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.acceleratedScenario.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total payments</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.acceleratedScenario.totalPaid)}
                    </p>
                  </div>
                </div>
                <div className="rounded border border-muted-foreground/15 px-4 py-3 text-sm text-muted-foreground">
                  <p>
                    Months saved: <span className="font-semibold">{results.monthsSaved}</span>
                  </p>
                  <p>
                    Interest saved:{' '}
                    <span className="font-semibold">
                      {currencyFormatter.format(results.interestSaved)}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Payoff for Credit Card Debt Reduction
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Compare minimum payments against aggressive payoff plans to see how quickly you can
            eliminate interest charges and reach debt free status. Use the results to set monthly
            targets that accelerate financial freedom.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Track Credit Card Debt and Interest Charges
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Monitoring your balance, interest rate, and payment size keeps credit card debt under
            control. Applying extra payments prevents interest from compounding and shortens payoff
            dates considerably.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Plan for Debt Free Financial Freedom
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Once balances are cleared, redirect monthly payments into savings or investments. A
            disciplined payoff strategy is the foundation for long-term financial freedom and healthy
            credit scores.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
