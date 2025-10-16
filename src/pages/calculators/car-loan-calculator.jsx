import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Calculator, CreditCard, TrendingUp, BarChart2 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'car loan calculator',
  'car loan',
  'new car loan calculator',
  'used car loan calculator',
  'auto loan calculator',
  'car loan payment calculator',
];

const metaDescription =
  'Use our car loan calculator to compare car loan options, evaluate a new car loan calculator scenario, and stress-test finance terms in an auto loan calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-loan-calculator';

const defaultInputs = {
  vehiclePrice: '28000',
  depositAmount: '4000',
  interestRate: '6.2',
  termYears: '5',
  adminFees: '250',
  extraPayment: '0',
};

const faqItems = [
  {
    question: 'Should I apply for a car loan or use dealer finance?',
    answer:
      'A bank or credit union loan may offer lower rates but might take longer to arrange. Dealer finance is fast but can include hidden fees. Use the calculator to compare the APR and total cost of each option before accepting an offer.',
  },
  {
    question: 'How do extra payments affect my car loan?',
    answer:
      'Making extra payments reduces both the term and the total interest paid. Enter an optional monthly overpayment to see how quickly you can pay off the balance and how much interest you save.',
  },
  {
    question: 'Is this calculator suitable for both new and used cars?',
    answer:
      'Yes. Adjust the interest rate and term to reflect whether you are using a new car loan calculator scenario or financing a used car. Used car rates are typically higher and terms may be shorter.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const buildAmortizationSchedule = (loanAmount, monthlyRate, totalMonths, extraPayment) => {
  const schedule = [];
  let balance = loanAmount;
  let month = 1;
  let totalInterest = 0;

  while (balance > 0 && month <= totalMonths + 1) {
    const interestPortion = balance * monthlyRate;
    const basePayment =
      monthlyRate === 0
        ? loanAmount / totalMonths
        : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
    const payment = Math.min(basePayment + extraPayment, balance + interestPortion);
    const principalPortion = payment - interestPortion;
    balance = Math.max(balance - principalPortion, 0);
    totalInterest += interestPortion;

    schedule.push({
      month,
      payment,
      interestPortion,
      principalPortion,
      remainingBalance: balance,
      totalInterest,
    });

    month += 1;
  }

  return schedule;
};

export default function CarLoanCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);

  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const vehiclePrice = Number(inputs.vehiclePrice) || 0;
    const depositAmount = Number(inputs.depositAmount) || 0;
    const interestRate = Number(inputs.interestRate) || 0;
    const termYears = Number(inputs.termYears) || 0;
    const adminFees = Number(inputs.adminFees) || 0;
    const extraPayment = Number(inputs.extraPayment) || 0;

    const loanAmount = Math.max(vehiclePrice - depositAmount + adminFees, 0);
    const totalMonths = termYears * 12;
    const monthlyRate = interestRate / 100 / 12;

    const basePayment =
      totalMonths > 0
        ? monthlyRate === 0
          ? loanAmount / totalMonths
          : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths))
        : 0;

    const schedule = buildAmortizationSchedule(loanAmount, monthlyRate, totalMonths, extraPayment);
    const actualTermMonths = schedule.length;
    const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
    const totalInterest = totalPaid - loanAmount;

    setResults({
      loanAmount,
      basePayment,
      extraPayment,
      schedule,
      totalInterest,
      totalPaid,
      actualTermMonths,
    });
  }, [inputs]);

  const sliderTermMax = Math.max(7, Number(inputs.termYears) || 0);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Head>
        <title>Car Loan Calculator | Car Loan</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Car Loan Calculator | Car Loan" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Car Loan Calculator | Car Loan" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Car Loan Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: keywords.slice(0, 5),
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan car finance payments',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Head>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Car Loan Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Model monthly payments, chart amortisation, and understand the long-term cost of your
            car finance in one place.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Finance Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehiclePrice" className="text-sm font-medium">
                    Vehicle Price (£)
                  </Label>
                  <Input
                    id="vehiclePrice"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.vehiclePrice}
                    onChange={(event) => handleInputChange('vehiclePrice', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="depositAmount" className="text-sm font-medium">
                    Deposit (£)
                  </Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.depositAmount}
                    onChange={(event) => handleInputChange('depositAmount', event.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Interest Rate
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter.format(Number(inputs.interestRate) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.interestRate)]}
                    onValueChange={(value) => handleInputChange('interestRate', String(value[0]))}
                    min={0}
                    max={12}
                    step={0.1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Term (years)
                    <span className="text-emerald-600 font-semibold">{inputs.termYears}</span>
                  </Label>
                  <Slider
                    value={[Number(inputs.termYears)]}
                    onValueChange={(value) => handleInputChange('termYears', String(value[0]))}
                    min={1}
                    max={sliderTermMax}
                    step={1}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-100 dark:border-emerald-900 space-y-4">
                <div>
                  <Label htmlFor="adminFees" className="text-sm font-medium">
                    Arrangement Fees (£)
                  </Label>
                  <Input
                    id="adminFees"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.adminFees}
                    onChange={(event) => handleInputChange('adminFees', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="extraPayment" className="text-sm font-medium">
                    Monthly Overpayment (£)
                  </Label>
                  <Input
                    id="extraPayment"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.extraPayment}
                    onChange={(event) => handleInputChange('extraPayment', event.target.value)}
                  />
                </div>
              </div>

              <Button type="button" variant="outline" onClick={() => setInputs(defaultInputs)}>
                Reset to defaults
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <CreditCard className="h-5 w-5" />
                  Payment Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/50 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Loan Amount</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results?.loanAmount || 0)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/50 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Monthly Payment</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(
                      (results?.basePayment || 0) + (results?.extraPayment || 0)
                    )}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Includes overpayment of {currencyFormatter.format(results?.extraPayment || 0)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/50 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total Interest</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results?.totalInterest || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Paid over {results?.actualTermMonths || 0} months
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Amortisation Chart
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={results?.schedule || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => currencyFormatter.format(Number(value))} />
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(Number(value))}
                      labelFormatter={(value) => `Month ${value}`}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="remainingBalance"
                      name="Remaining Balance"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalInterest"
                      name="Cumulative Interest"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BarChart2 className="h-5 w-5 text-slate-600" />
                  Detailed Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-4 py-2">Month</th>
                      <th className="px-4 py-2">Payment</th>
                      <th className="px-4 py-2">Interest</th>
                      <th className="px-4 py-2">Principal</th>
                      <th className="px-4 py-2">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(results?.schedule || []).map((row) => (
                      <tr
                        key={row.month}
                        className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                      >
                        <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
                          {row.month}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                          {currencyFormatter.format(row.payment)}
                        </td>
                        <td className="px-4 py-2 text-rose-600 dark:text-rose-200">
                          {currencyFormatter.format(row.interestPortion)}
                        </td>
                        <td className="px-4 py-2 text-emerald-600 dark:text-emerald-200">
                          {currencyFormatter.format(row.principalPortion)}
                        </td>
                        <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                          {currencyFormatter.format(row.remainingBalance)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Heading
            as="h2"
            size="h2"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            New Car Loan Calculator vs Used Scenarios
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Rates can differ dramatically between a new car loan calculator quote and used car loan
            options. Adjust the APR and term to mirror lender offers, then test how a larger deposit
            or overpayment accelerates ownership.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Auto Loan Calculator Strategies
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Treat this auto loan calculator as your negotiation tool. Enter dealer fees, change the
            agreement length, and rerun the numbers while you are in the showroom. When the monthly
            figure aligns with your budget, the car loan payment calculator confirms the true cost
            of the finance agreement before you sign.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>
    </div>
  );
}
