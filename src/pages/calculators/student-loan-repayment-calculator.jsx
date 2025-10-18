import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, GraduationCap, Clock, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/student-loan-repayment-calculator';

const schemaKeywords = [
  'Interest Rate',
  'Loan Balance',
  'Repayment Schedule',
  'Loan Write-Off',
  'Student Finance',
];

const plans = [
  { value: 'plan1', label: 'Plan 1 (pre-2012, England/Wales)', threshold: 24990, rate: 0.09, writeOffYears: 25 },
  { value: 'plan2', label: 'Plan 2 (post-2012, England/Wales)', threshold: 27295, rate: 0.09, writeOffYears: 30 },
  { value: 'plan4', label: 'Plan 4 (Scotland)', threshold: 27660, rate: 0.09, writeOffYears: 30 },
  { value: 'plan5', label: 'Plan 5 (England from 2023)', threshold: 25000, rate: 0.09, writeOffYears: 40 },
  { value: 'postgrad', label: 'Postgraduate loan', threshold: 21000, rate: 0.06, writeOffYears: 30 },
];

const faqItems = [
  {
    question: 'How are UK student loan repayments calculated?',
    answer:
      'Repayments are a percentage of earnings above the plan-specific threshold. For example, Plan 2 repays 9% of income above £27,295, collected through PAYE.',
  },
  {
    question: 'What interest rate should I use?',
    answer:
      'Student loan interest is linked to RPI with plan-specific uplifts. Use the latest SLC announced rate or your current statement rate for accurate forecasting.',
  },
  {
    question: 'When is the loan written off?',
    answer:
      'Write-off rules depend on the plan. Plan 2 and Plan 4 loans are written off 30 years after April following graduation, Plan 1 after 25 years, and Plan 5 after 40 years.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function getPlan(value) {
  return plans.find((plan) => plan.value === value) ?? plans[1];
}

export default function StudentLoanRepaymentCalculator() {
  const [inputs, setInputs] = useState({
    annualIncome: '38000',
    expectedIncomeGrowth: '2',
    loanBalance: '32000',
    interestRate: '6.25',
    plan: 'plan2',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      annualIncome: '38000',
      expectedIncomeGrowth: '2',
      loanBalance: '32000',
      interestRate: '6.25',
      plan: 'plan2',
    });
  }, []);

  const results = useMemo(() => {
    const annualIncome = Number(inputs.annualIncome) || 0;
    const incomeGrowth = Math.max(0, Number(inputs.expectedIncomeGrowth) || 0) / 100;
    const loanBalance = Number(inputs.loanBalance) || 0;
    const interestRate = Number(inputs.interestRate) / 100 || 0;
    const plan = getPlan(inputs.plan);

    const threshold = plan.threshold;
    const repaymentRate = plan.rate;
    const annualRepayment = Math.max(0, (annualIncome - threshold) * repaymentRate);
    const monthlyRepayment = annualRepayment / 12;

    // simple projection assuming income grows annually; stops after write-off years or zero balance
    let remainingBalance = loanBalance;
    let cumulativePaid = 0;
    let years = 0;
    let projectedIncome = annualIncome;
    const maxYears = plan.writeOffYears;

    while (remainingBalance > 0 && years < maxYears) {
      const interest = remainingBalance * interestRate;
      const yearlyRepayment = Math.max(0, (projectedIncome - threshold) * repaymentRate);
      const repaymentApplied = Math.min(yearlyRepayment, remainingBalance + interest);
      remainingBalance = remainingBalance + interest - repaymentApplied;
      cumulativePaid += repaymentApplied;
      years += 1;
      projectedIncome *= 1 + incomeGrowth;
      if (yearlyRepayment <= 0 && incomeGrowth === 0) {
        break;
      }
    }

    const cleared = remainingBalance <= 1;
    const writeOff = !cleared && years >= maxYears;

    return {
      annualIncome,
      incomeGrowth,
      loanBalance,
      interestRate,
      plan,
      annualRepayment,
      monthlyRepayment,
      cumulativePaid,
      remainingBalance: Math.max(0, remainingBalance),
      yearsElapsed: years,
      cleared,
      writeOffYear: writeOff ? years : null,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Student Loan Repayment &amp; SLC Calculator</title>
        <meta
          name="description"
          content="Student Loan Repayment Calculator for UK graduates. Estimate SLC repayments, repayment thresholds, and loan duration under Plan 2 rules."
        />
        <meta
          name="keywords"
          content="Student Loan Repayment Calculator, Plan 2, Repayment Threshold"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Student Loan Repayment Calculator',
              description:
                'Model student finance repayments including interest rate, loan balance, repayment schedule, and potential loan write-off.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Student Loan Repayment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Calculate student loan repayments, view monthly payment estimates, and understand loan
            duration under SLC rules for your repayment amount.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Loan Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Repayment plan</Label>
                <select
                  value={inputs.plan}
                  onChange={(event) => handleChange('plan', event.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  {plans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="annualIncome" className="text-sm font-medium">
                  Annual income (GBP)
                </Label>
                <Input
                  id="annualIncome"
                  inputMode="decimal"
                  value={inputs.annualIncome}
                  onChange={(event) => handleChange('annualIncome', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expectedIncomeGrowth" className="text-sm font-medium">
                  Expected annual income growth (%)
                </Label>
                <Input
                  id="expectedIncomeGrowth"
                  inputMode="decimal"
                  value={inputs.expectedIncomeGrowth}
                  onChange={(event) => handleChange('expectedIncomeGrowth', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="loanBalance" className="text-sm font-medium">
                  Current loan balance (GBP)
                </Label>
                <Input
                  id="loanBalance"
                  inputMode="decimal"
                  value={inputs.loanBalance}
                  onChange={(event) => handleChange('loanBalance', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium">
                  Interest rate (%)
                </Label>
                <Input
                  id="interestRate"
                  inputMode="decimal"
                  value={inputs.interestRate}
                  onChange={(event) => handleChange('interestRate', event.target.value)}
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
                  <GraduationCap className="h-5 w-5 text-rose-500" />
                  Repayment Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Plan threshold</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.plan.threshold)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly payment estimate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyRepayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual repayment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.annualRepayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Cumulative paid</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.cumulativePaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining balance (projection)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.remainingBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Years until cleared/write-off</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.cleared
                        ? `${results.yearsElapsed} years`
                        : results.writeOffYear
                          ? `${results.writeOffYear} years (write-off)`
                          : `${results.yearsElapsed} years modelled`}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Clock className="h-5 w-5 text-rose-500" />
                  Repayment Outlook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Use the monthly payment estimate to budget for student loan deductions alongside tax
                  and National Insurance on your payslip.
                </p>
                <p>
                  If income exceeds the threshold only late in the tax year, repayments start when HMRC
                  receives updated earnings. Forecasting prevents surprise deductions.
                </p>
                <p>
                  Project how salary growth impacts repayments and loan duration. Higher earnings
                  shorten the repayment period but also increase total paid before loan write-off.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Student Loan Repayment with Confidence
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Estimate monthly payment, assess loan duration, and review SLC rules so you stay on top of
            your repayment amount and financial planning goals.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Monthly Payment Transparency
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Knowing the expected deduction helps you prepare for payslip changes each April when
            thresholds and interest rates update.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Understand Loan Duration and Write-Off Rules
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Projecting future repayments shows whether you are likely to repay the balance or have it
            written off, informing long-term financial decisions.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
