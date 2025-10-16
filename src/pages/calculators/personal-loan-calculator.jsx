import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, CreditCard, BarChart3, Shield } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'personal loan calculator',
  'loan repayment calculator',
  'loan payment calculator',
  'interest rate calculator',
];

const metaDescription =
  'Use our personal loan calculator, loan repayment calculator, and loan payment calculator to model monthly payments, compare terms, and explore interest rate calculator scenarios.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/personal-loan-calculator';
const schemaKeywords = keywords.slice(0, 5);

const personalLoanFaqs = [
  {
    question: 'How do lenders calculate monthly payments?',
    answer:
      'Most personal loans use fixed interest with equal monthly instalments. The personal loan calculator applies the amortisation formula so you can compare offers instantly.',
  },
  {
    question: 'What happens if I make extra payments?',
    answer:
      'Overpayments reduce the balance faster. The loan repayment calculator shows how a regular overpayment shaves time and interest from the schedule.',
  },
  {
    question: 'Should I include arrangement fees?',
    answer:
      'Yes. If the lender charges an upfront or financed fee, include it here so the loan payment calculator reflects the true cost of borrowing.',
  },
];

const calculateMonthlyPayment = (principal, annualRate, termMonths) => {
  const rate = Math.max(Number(annualRate) || 0, 0) / 100 / 12;
  const months = Math.max(Number(termMonths) || 0, 0);
  if (months === 0) return 0;

  if (rate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + rate, months);
  return (principal * rate * factor) / (factor - 1);
};

const buildAmortisation = ({ loanAmount, annualRate, termYears, fees, extraPayment }) => {
  const principal = Math.max(Number(loanAmount) || 0, 0);
  const totalFees = Math.max(Number(fees) || 0, 0);
  const financedPrincipal = principal + totalFees;
  const months = Math.max(Math.round(Number(termYears) * 12) || 0, 0);
  const regularPayment = calculateMonthlyPayment(financedPrincipal, annualRate, months);
  const overpayment = Math.max(Number(extraPayment) || 0, 0);

  let balance = financedPrincipal;
  let totalInterest = 0;
  let month = 0;

  const rows = [];

  const monthlyRate = Math.max(Number(annualRate) || 0, 0) / 100 / 12;

  while (balance > 0 && month < months + 1_000) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPaid = regularPayment + overpayment - interest;
    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance -= principalPaid;
    totalInterest += interest;

    rows.push({
      month,
      payment: principalPaid + interest,
      interest,
      principal: principalPaid,
      balance: Math.max(balance, 0),
    });

    if (balance <= 0) {
      break;
    }
  }

  return {
    schedule: rows,
    monthlyPayment: regularPayment,
    totalInterest,
    termMonths: rows.length,
    totalCost: financedPrincipal + (rows.length > 0 ? totalInterest : 0),
    fees: totalFees,
  };
};

export default function PersonalLoanCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: 15000,
    annualRate: 8.5,
    termYears: 4,
    fees: 0,
    extraPayment: 50,
  });

  const results = useMemo(
    () =>
      buildAmortisation({
        loanAmount: inputs.loanAmount,
        annualRate: inputs.annualRate,
        termYears: inputs.termYears,
        fees: inputs.fees,
        extraPayment: inputs.extraPayment,
      }),
    [inputs]
  );

  const resetAll = () =>
    setInputs({
      loanAmount: 15000,
      annualRate: 8.5,
      termYears: 4,
      fees: 0,
      extraPayment: 50,
    });

  const termYearsRounded = inputs.termYears;
  const standardMonthly = calculateMonthlyPayment(
    Math.max(Number(inputs.loanAmount) || 0, 0) + Math.max(Number(inputs.fees) || 0, 0),
    inputs.annualRate,
    Math.max(Math.round(Number(inputs.termYears) * 12) || 0, 0)
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Personal Loan Calculator | Loan Repayment Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Personal Loan Calculator | Loan Repayment Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personal Loan Calculator | Loan Repayment Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Personal Loan Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan borrowing with a personal loan calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Personal Loan Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Compare terms, test overpayments, and understand the lifetime cost of your personal loan
            before you apply.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Borrowing details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan amount (£)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      min="0"
                      step="100"
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
                    <Label htmlFor="fees">Fees (added to loan) (£)</Label>
                    <Input
                      id="fees"
                      type="number"
                      min="0"
                      step="10"
                      value={inputs.fees}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          fees: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annualRate">Interest rate (APR %)</Label>
                    <Slider
                      id="annualRate"
                      className="mt-3"
                      value={[Number(inputs.annualRate)]}
                      min={0}
                      max={30}
                      step={0.1}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualRate: Number(value[0].toFixed(2)),
                        }))
                      }
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.annualRate.toFixed(2)}%</span>
                      <span>30%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termYears">Term (years)</Label>
                    <Slider
                      id="termYears"
                      className="mt-3"
                      value={[Number(termYearsRounded)]}
                      min={1}
                      max={10}
                      step={0.5}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          termYears: Number(value[0].toFixed(1)),
                        }))
                      }
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>1 year</span>
                      <span>{inputs.termYears.toFixed(1)} years</span>
                      <span>10 years</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extraPayment">Monthly overpayment (£)</Label>
                  <Input
                    id="extraPayment"
                    type="number"
                    min="0"
                    step="10"
                    value={inputs.extraPayment}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        extraPayment: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <Button variant="outline" onClick={resetAll} className="w-full">
                  Reset to example loan
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Loan repayment calculator summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Standard monthly payment</span>
                  <span>£{standardMonthly.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly with overpayment</span>
                  <span>£{(results.monthlyPayment + inputs.extraPayment).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total interest</span>
                  <span>£{results.totalInterest.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total cost (inc. fees)</span>
                  <span>£{results.totalCost.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Loan cleared in</span>
                  <span>{(results.termMonths / 12).toFixed(1)} years</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  Overpayments accelerate the schedule. Check your lender allows fee-free overpayments
                  before committing.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Loan payment calculator schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {results.schedule.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Adjust the inputs to produce a repayment schedule.
                  </p>
                )}
                {results.schedule.slice(0, 12).map((row) => (
                  <div
                    key={row.month}
                    className="grid grid-cols-4 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">Month {row.month}</span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Paid £{row.payment.toFixed(2)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Interest £{row.interest.toFixed(2)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Balance £{row.balance.toFixed(2)}
                    </span>
                  </div>
                ))}
                {results.schedule.length > 12 && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Showing the first 12 months. Continue the pattern to forecast the full term.
                  </p>
                )}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading as="h2" size="h2" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Loan payment calculator tactics
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Compare multiple offers by plugging in different APRs and fees. The loan payment
                calculator highlights the deal that keeps repayments and total cost within your comfort
                zone.
              </p>
              <Heading as="h3" size="h3" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Interest rate calculator reminders
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Rate quotes can change quickly. Re-run this interest rate calculator after each credit
                check to ensure the latest APR still fits your budget before signing the agreement.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={personalLoanFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
