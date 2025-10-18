import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Factory, Building2, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/business-loan-calculator';

const schemaKeywords = [
  'Business Funding',
  'Loan Term',
  'Monthly Payment',
  'Total Interest',
  'SME Loans',
];

const faqItems = [
  {
    question: 'How are business loan repayments calculated?',
    answer:
      'Repayments are based on loan amount, interest rate, and term using an amortisation formula. Each instalment covers interest accrued plus principal reduction until the balance reaches zero.',
  },
  {
    question: 'What information will lenders review?',
    answer:
      'Lenders assess business credit history, financial statements, trading performance, collateral, and director guarantees to determine loan eligibility and interest rates.',
  },
  {
    question: 'Should my business make overpayments?',
    answer:
      'If the loan allows penalty-free overpayments, paying extra reduces total interest and shortens the loan term. Ensure cash flow remains sufficient for operating needs before committing to higher payments.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function calculateMonthlyPayment(principal, annualRate, termYears) {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

export default function BusinessLoanCalculator() {
  const [inputs, setInputs] = useState({
    loanAmount: '200000',
    annualRate: '6.2',
    termYears: '8',
    arrangementFee: '950',
    monthlyOverpayment: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      loanAmount: '200000',
      annualRate: '6.2',
      termYears: '8',
      arrangementFee: '950',
      monthlyOverpayment: '0',
    });
  }, []);

  const results = useMemo(() => {
    const loanAmount = Number(inputs.loanAmount) || 0;
    const annualRate = Number(inputs.annualRate) || 0;
    const termYears = Number(inputs.termYears) || 0;
    const arrangementFee = Number(inputs.arrangementFee) || 0;
    const monthlyOverpayment = Number(inputs.monthlyOverpayment) || 0;

    const baseMonthlyPayment = calculateMonthlyPayment(loanAmount, annualRate, termYears);
    const adjustedMonthlyPayment = baseMonthlyPayment + monthlyOverpayment;

    const monthlyRate = annualRate / 100 / 12;
    let balance = loanAmount;
    let totalInterest = 0;
    let months = 0;
    let totalPaid = arrangementFee;

    while (balance > 0 && months < termYears * 12 + 120) {
      const interest = balance * monthlyRate;
      const principalPaid = Math.min(adjustedMonthlyPayment - interest, balance);
      if (principalPaid <= 0) {
        // payment not sufficient to reduce balance
        break;
      }
      balance = Math.max(balance - principalPaid, 0);
      totalInterest += interest;
      totalPaid += interest + principalPaid;
      months += 1;
      if (balance <= 0) break;
    }

    const loanCleared = balance <= 0;
    const payoffMonths = loanCleared ? months : termYears * 12;
    const payoffYears = payoffMonths / 12;

    const totalCost = loanCleared
      ? totalPaid
      : baseMonthlyPayment * termYears * 12 + arrangementFee;

    return {
      loanAmount,
      annualRate,
      termYears,
      arrangementFee,
      monthlyOverpayment,
      baseMonthlyPayment,
      adjustedMonthlyPayment,
      totalInterest: loanCleared ? totalInterest : baseMonthlyPayment * termYears * 12 - loanAmount,
      totalCost,
      payoffMonths,
      payoffYears,
      loanCleared,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Business Loan Calculator &amp; Commercial Finance Planner</title>
        <meta
          name="description"
          content="Business loan calculator for commercial finance modelling. Review loan repayment amounts, interest costs, and SME funding scenarios."
        />
        <meta
          name="keywords"
          content="Business Loan Calculator, Loan Repayment, Interest Rate"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Business Loan Calculator',
              description:
                'Commercial finance calculator for business funding analysis, loan term planning, and SME loan amortisation comparisons.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Business Loan Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Calculate loan cost, model startup funding, and plan capital requirements with a detailed business debt amortisation breakdown.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Loan Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="loanAmount" className="text-sm font-medium">
                  Loan amount (GBP)
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
                  Loan term (years)
                </Label>
                <Input
                  id="termYears"
                  inputMode="decimal"
                  value={inputs.termYears}
                  onChange={(event) => handleChange('termYears', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="arrangementFee" className="text-sm font-medium">
                  Arrangement fee (GBP)
                </Label>
                <Input
                  id="arrangementFee"
                  inputMode="decimal"
                  value={inputs.arrangementFee}
                  onChange={(event) => handleChange('arrangementFee', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyOverpayment" className="text-sm font-medium">
                  Extra monthly overpayment (GBP)
                </Label>
                <Input
                  id="monthlyOverpayment"
                  inputMode="decimal"
                  value={inputs.monthlyOverpayment}
                  onChange={(event) => handleChange('monthlyOverpayment', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Factory className="h-5 w-5 text-purple-500" />
                  Repayment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Monthly payment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.baseMonthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly with overpayment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.adjustedMonthlyPayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total interest paid</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {currencyFormatter.format(results.totalInterest)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total cost (incl. fees)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.totalCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated payoff time</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.loanCleared
                        ? `${results.payoffMonths} months (${results.payoffYears.toFixed(1)} years)`
                        : `${results.termYears * 12} months (${results.termYears} years)`}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Arrangement fee</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.arrangementFee)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="h-5 w-5 text-purple-500" />
                  Business Debt Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Calculate loan cost in the context of working capital and startup funding. Ensure
                  repayments remain below your projected operating cash flows.
                </p>
                <p>
                  Map capital expenditure to expected asset life so the loan term matches depreciation
                  schedules and profitability forecasts.
                </p>
                <p>
                  Use amortisation summaries to inform lender negotiations, demonstrating the impact
                  of rate adjustments on total interest.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Loan Cost for Confident Commercial Finance Decisions
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Compare business loan offers by looking beyond monthly payment headlines. Review total
            interest, arrangement fees, and amortisation schedules to select funding that supports
            your growth strategy.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Startup Funding and Working Capital Planning
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Model capital injections, from equipment purchases to inventory refreshes, so you can
            demonstrate debt service coverage ratios to investors and lenders.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Amortisation Transparency Keeps Business Debt Under Control
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding how each payment reduces principal allows you to plan overpayments, protect
            cash flow, and stay ahead of refinancing milestones before rates rise.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
