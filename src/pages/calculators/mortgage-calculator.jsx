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

const keywords = [
  'mortgage calculator',
  'mortgage calculator uk',
  'mortgage loan calculator',
  'mortgage payment calculator',
  'home loan calculator',
];

const metaDescription =
  'Use our mortgage calculator to estimate repayments, compare mortgage calculator UK options, and test mortgage loan calculator scenarios before you apply.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-calculator';
const schemaKeywords = keywords;

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const mortgageFaqs = [
  {
    question: 'Does the calculator include overpayments?',
    answer:
      'This version shows standard repayment amounts. To model overpayments, increase the regular payment and compare the total interest saved.',
  },
  {
    question: 'Can I compare interest-only vs. repayment?',
    answer:
      'Yes. Set the term and rate for each option, then compare the monthly repayments and total interest cost to understand the difference.',
  },
  {
    question: 'How accurate is the mortgage interest calculation?',
    answer:
      'It uses standard amortisation formulas with a fixed-rate assumption. Actual repayments may vary once lender fees or rate changes are applied.',
  },
];

const buildSchedule = (principal, annualRate, termYears) => {
  const monthlyRate = annualRate / 100 / 12;
  const months = termYears * 12;
  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const schedule = [];
  let balance = principal;
  let totalInterest = 0;

  for (let month = 1; month <= months; month += 1) {
    const interest = balance * monthlyRate;
    const principalPayment = payment - interest;
    balance -= principalPayment;
    totalInterest += interest;
    if (month <= 360) {
      schedule.push({
        month,
        payment,
        interest,
        principal: principalPayment,
        balance: Math.max(balance, 0),
      });
    }
  }

  return {
    payment,
    totalInterest,
    totalPaid: payment * months,
    schedule,
  };
};

export default function MortgageCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: 280000,
    interestRate: 4.8,
    termYears: 25,
  });

  const scheduleResults = useMemo(
    () =>
      buildSchedule(
        Number(inputs.loanAmount) || 0,
        Number(inputs.interestRate) || 0,
        Number(inputs.termYears) || 0
      ),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      loanAmount: 280000,
      interestRate: 4.8,
      termYears: 25,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Mortgage Calculator | Mortgage Calculator UK</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Mortgage Calculator | Mortgage Calculator UK" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Mortgage Calculator | Mortgage Calculator UK" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Mortgage Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate mortgage payments',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Mortgage Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Calculate monthly mortgage payments, total interest, and amortisation. Try different
            rates and terms to compare UK mortgage deals.
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
                  Mortgage Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Monthly payment</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(scheduleResults.payment)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total interest</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(scheduleResults.totalInterest)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total paid</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(scheduleResults.totalPaid)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Months</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {inputs.termYears * 12}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  First 12 Months
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
                    {scheduleResults.schedule.slice(0, 12).map((row) => (
                      <tr
                        key={row.month}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
                          {row.month}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                          {currencyFormatter(row.payment)}
                        </td>
                        <td className="px-4 py-2 text-rose-600 dark:text-rose-200">
                          {currencyFormatter(row.interest)}
                        </td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-200">
                          {currencyFormatter(row.principal)}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                          {currencyFormatter(row.balance)}
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
                Mortgage calculator monthly payments toolkit
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust the interest rate to stress test your mortgage calculator monthly payments
                against potential Bank of England rate hikes. Budgeting for higher rates keeps you
                safe.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Mortgage interest calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The mortgage interest calculator shows how much of each payment goes towards
                interest versus principal. Use the graph to understand when you start building
                equity faster.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Home mortgage calculator comparisons
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Compare fixed and variable deals by changing the interest rate, term, and loan
                amount. The home mortgage calculator works whether you are remortgaging, buying, or
                planning to calculate mortgage payment options for future moves.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={mortgageFaqs} />
        </div>
      </section>
    </div>
  );
}
