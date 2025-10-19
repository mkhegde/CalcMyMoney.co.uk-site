import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Calculator, Calendar, FileSpreadsheet, Percent } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import { breadcrumbSchema } from '@/components/seo/JsonLd';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import ExportActions from '@/components/calculators/ExportActions';
import FAQSection from '@/components/calculators/FAQSection';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';

const amortizationKeywords = [
  'loan amortization calculator',
  'loan amortization',
  'loan amortization schedule',
  'amortization schedule',
  'amortization calculator',
  'loan amortization schedule calculator',
];

const metaDescription =
  'Use our loan amortization calculator to explore loan amortization and build a loan amortization schedule for mortgages, personal loans, or refinancing.';

const canonicalUrl = 'https://calcmymoney.co.uk/amortization-calculator';
const schemaKeywords = amortizationKeywords.slice(0, 5);

const amortizationFAQs = [
  {
    question: 'What is a loan amortization schedule?',
    answer:
      'An amortization schedule breaks every repayment into principal and interest so you always know how much of your balance is outstanding and how quickly you are building equity.',
  },
  {
    question: 'How does extra repayment affect loan amortization?',
    answer:
      'Additional payments reduce your remaining balance, which means more of each future repayment goes to principal rather than interest, shortening your loan term and cutting total interest costs.',
  },
  {
    question: 'Why should I export the amortization schedule?',
    answer:
      'Exporting the full table makes it easy to share the results with advisers, compare refinancing offers, or model “what if” scenarios in your own spreadsheet.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const generateAmortizationSchedule = (principal, monthlyRate, totalMonths) => {
  const schedule = [];
  let balance = principal;
  let cumulativeInterest = 0;

  if (monthlyRate === 0) {
    const flatPrincipal = principal / totalMonths;
    for (let month = 1; month <= totalMonths; month += 1) {
      balance -= flatPrincipal;
      schedule.push({
        month,
        interestPortion: 0,
        principalPortion: flatPrincipal,
        cumulativeInterest,
        remainingBalance: Math.max(balance, 0),
      });
    }
    return schedule;
  }

  const monthlyPayment = (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

  for (let month = 1; month <= totalMonths; month += 1) {
    const interestPortion = balance * monthlyRate;
    const principalPortion = monthlyPayment - interestPortion;
    cumulativeInterest += interestPortion;
    balance -= principalPortion;

    schedule.push({
      month,
      interestPortion,
      principalPortion,
      cumulativeInterest,
      remainingBalance: Math.max(balance, 0),
    });
  }

  return schedule;
};

const buildCsv = ({
  amount,
  rate,
  termYears,
  monthlyPayment,
  totalInterest,
  totalRepayment,
  schedule,
}) => {
  const header = [
    ['Metric', 'Value'],
    ['Loan Amount', currencyFormatter.format(amount)],
    ['Interest Rate', `${percentageFormatter.format(rate)}%`],
    ['Loan Term', `${termYears} years`],
    ['Monthly Payment', currencyFormatter.format(monthlyPayment)],
    ['Total Interest Paid', currencyFormatter.format(totalInterest)],
    ['Total Repayment', currencyFormatter.format(totalRepayment)],
    [],
    ['Month', 'Interest Portion', 'Principal Portion', 'Cumulative Interest', 'Remaining Balance'],
  ];

  const rows = schedule.map((entry) => [
    entry.month,
    currencyFormatter.format(entry.interestPortion),
    currencyFormatter.format(entry.principalPortion),
    currencyFormatter.format(entry.cumulativeInterest),
    currencyFormatter.format(entry.remainingBalance),
  ]);

  return [...header, ...rows];
};

export default function AmortizationCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState('250000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTermYears, setLoanTermYears] = useState('30');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState([]);

  const handleCalculate = useCallback(() => {
    const amount = Number(loanAmount) || 0;
    const ratePercent = Number(interestRate) || 0;
    const termYears = Number(loanTermYears) || 0;

    if (amount <= 0 || ratePercent < 0 || termYears <= 0) {
      setResults(null);
      setHasCalculated(true);
      setCsvData([]);
      return;
    }

    const totalMonths = termYears * 12;
    const monthlyRate = ratePercent / 100 / 12;
    const schedule = generateAmortizationSchedule(amount, monthlyRate, totalMonths);
    const monthlyPayment =
      monthlyRate === 0
        ? amount / totalMonths
        : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
    const totalRepayment = monthlyPayment * totalMonths;
    const totalInterest = totalRepayment - amount;

    const computed = {
      amount,
      ratePercent,
      termYears,
      monthlyPayment,
      totalInterest,
      totalRepayment,
      schedule,
    };

    setResults(computed);
    setCsvData(buildCsv(computed));
    setHasCalculated(true);
  }, [interestRate, loanAmount, loanTermYears]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const breadcrumbJson = breadcrumbSchema([
    { name: 'Home', item: 'https://www.calcmymoney.co.uk/' },
    {
      name: 'Loans & Debt Calculators',
      item: 'https://www.calcmymoney.co.uk/calculators#loans-debt',
    },
    { name: 'Amortization Calculator', item: canonicalUrl },
  ]);

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Amortization Calculator',
    description: metaDescription,
    url: canonicalUrl,
    keywords: schemaKeywords,
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'SearchAction',
      target: canonicalUrl,
      'query-input': 'required name=loan amortization calculator',
    },
    about: {
      '@type': 'FinancialProduct',
      name: 'Loan Amortization Schedule',
      description:
        'Interactive calculator that generates detailed loan amortization schedules, including interest and principal breakdowns.',
    },
  };

  const monthlyPaymentDisplay = results
    ? currencyFormatter.format(results.monthlyPayment)
    : '£0.00';
  const totalInterestDisplay = results
    ? currencyFormatter.format(Math.max(results.totalInterest, 0))
    : '£0.00';
  const totalRepaymentDisplay = results
    ? currencyFormatter.format(Math.max(results.totalRepayment, 0))
    : '£0.00';

  const loanSliderMax = Math.max(1000000, Number(loanAmount) || 0);
  const rateSliderMax = Math.max(20, Number(interestRate) || 0);
  const termSliderMax = Math.max(40, Number(loanTermYears) || 0);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>UK Loan Amortization Schedule Calculator | CalcMyMoney 2025</title>
        <meta
          name="description"
          content="Generate detailed amortization schedules for UK mortgages, personal loans, or refinancing plans. Compare monthly payments, track interest against principal, and export lender-ready tables."
        />
        <link rel="canonical" href="https://calcmymoney.co.uk/amortization-calculator" />
      </Helmet>
      <SeoHead
        title="Amortization Calculator | Loan Amortization"
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle="Amortization Calculator | Loan Amortization"
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="Calc My Money"
        twitterTitle="Amortization Calculator | Loan Amortization"
        twitterDescription={metaDescription}
        jsonLd={[breadcrumbJson, webpageSchema]}
      />

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Amortization Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Master loan amortization with real-time charts and tables. Generate a personalised loan
            amortization schedule, compare repayment scenarios, and download your amortization
            schedule for future planning.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-600" />
                Loan Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="loan-amount"
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>Loan Amount</span>
                  <span className="text-indigo-600 font-semibold">
                    {currencyFormatter.format(Number(loanAmount) || 0)}
                  </span>
                </Label>
                <Input
                  id="loan-amount"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="1000"
                  className="mt-2"
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(event.target.value)}
                />
                <Slider
                  value={[Math.min(Math.max(Number(loanAmount) || 0, 0), loanSliderMax)]}
                  onValueChange={(value) => setLoanAmount(String(value[0]))}
                  max={loanSliderMax}
                  min={0}
                  step={1000}
                  className="mt-4"
                />
              </div>

              <div>
                <Label
                  htmlFor="interest-rate"
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>Annual Interest</span>
                  <span className="text-indigo-600 font-semibold">
                    {percentageFormatter.format(Number(interestRate) || 0)}%
                  </span>
                </Label>
                <Input
                  id="interest-rate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.1"
                  className="mt-2"
                  value={interestRate}
                  onChange={(event) => setInterestRate(event.target.value)}
                />
                <Slider
                  value={[Math.min(Math.max(Number(interestRate) || 0, 0), rateSliderMax)]}
                  onValueChange={(value) => setInterestRate(String(value[0]))}
                  max={rateSliderMax}
                  min={0}
                  step={0.1}
                  className="mt-4"
                />
              </div>

              <div>
                <Label
                  htmlFor="loan-term"
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>Loan Term (years)</span>
                  <span className="text-indigo-600 font-semibold">
                    {Number(loanTermYears) || 0} years
                  </span>
                </Label>
                <Input
                  id="loan-term"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step="1"
                  className="mt-2"
                  value={loanTermYears}
                  onChange={(event) => setLoanTermYears(event.target.value)}
                />
                <Slider
                  value={[Math.min(Math.max(Number(loanTermYears) || 0, 1), termSliderMax)]}
                  onValueChange={(value) => setLoanTermYears(String(value[0]))}
                  max={termSliderMax}
                  min={1}
                  step={1}
                  className="mt-4"
                />
              </div>

              <Button type="button" onClick={handleCalculate} className="w-full">
                Recalculate Schedule
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                  Loan Amortization Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3 text-center">
                <div className="rounded-md bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Payment</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {monthlyPaymentDisplay}
                  </p>
                </div>
                <div className="rounded-md bg-rose-50 dark:bg-rose-900/40 p-4 border border-rose-200 dark:border-rose-900">
                  <p className="text-sm text-rose-600 dark:text-rose-200">Total Interest</p>
                  <p className="text-2xl font-bold text-rose-700 dark:text-rose-100">
                    {totalInterestDisplay}
                  </p>
                </div>
                <div className="rounded-md bg-emerald-50 dark:bg-emerald-900/40 p-4 border border-emerald-200 dark:border-emerald-900">
                  <p className="text-sm text-emerald-600 dark:text-emerald-200">Total Repayment</p>
                  <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-100">
                    {totalRepaymentDisplay}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Heading
                as="h2"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Detailed Loan Amortization Schedule
              </Heading>
              {hasCalculated && results && csvData.length > 0 && (
                <ExportActions
                  csvData={csvData}
                  fileName="loan-amortization-schedule"
                  title="Loan Amortization Schedule"
                />
              )}
            </div>

            {hasCalculated && results ? (
              <>
                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Percent className="h-5 w-5 text-indigo-600" />
                      Principal vs Interest
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={320}>
                      <AreaChart data={results.schedule}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis
                          tickFormatter={(value) =>
                            currencyFormatter.format(value).replace(/\.00$/, '')
                          }
                        />
                        <Tooltip
                          formatter={(value) =>
                            currencyFormatter.format(Number(value)).replace(/\.00$/, '')
                          }
                          labelFormatter={(value) => `Month ${value}`}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="remainingBalance"
                          name="Remaining Balance"
                          stroke="#4f46e5"
                          fill="#4f46e5"
                          fillOpacity={0.3}
                        />
                        <Area
                          type="monotone"
                          dataKey="cumulativeInterest"
                          name="Cumulative Interest"
                          stroke="#dc2626"
                          fill="#dc2626"
                          fillOpacity={0.25}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <FileSpreadsheet className="h-5 w-5 text-indigo-600" />
                      Full Loan Amortization Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="sticky top-0 bg-slate-100 dark:bg-slate-900 text-xs uppercase tracking-wide">
                        <tr>
                          <th className="px-4 py-3">Month</th>
                          <th className="px-4 py-3">Interest</th>
                          <th className="px-4 py-3">Principal</th>
                          <th className="px-4 py-3">Cumulative Interest</th>
                          <th className="px-4 py-3">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((row) => (
                          <tr
                            key={row.month}
                            className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                          >
                            <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
                              {row.month}
                            </td>
                            <td className="px-4 py-2 text-rose-600 dark:text-rose-200">
                              {currencyFormatter.format(row.interestPortion)}
                            </td>
                            <td className="px-4 py-2 text-emerald-600 dark:text-emerald-200">
                              {currencyFormatter.format(row.principalPortion)}
                            </td>
                            <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                              {currencyFormatter.format(row.cumulativeInterest)}
                            </td>
                            <td className="px-4 py-2 font-semibold text-slate-900 dark:text-slate-100">
                              {currencyFormatter.format(row.remainingBalance)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-64 border border-dashed border-indigo-300 dark:border-indigo-900 flex items-center justify-center text-center">
                <div className="space-y-2 text-slate-500 dark:text-slate-300">
                  <Calculator className="mx-auto h-10 w-10 text-indigo-500" />
                  <p className="text-lg font-semibold">Ready when you are</p>
                  <p className="text-sm">
                    Adjust the loan amount, rate, and term to generate your personalised loan
                    amortization schedule.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-4">
            <Heading
              as="h2"
              size="h2"
              weight="semibold"
              className="text-slate-900 dark:text-slate-100"
            >
              Loan Amortization Schedule Insights
            </Heading>
            <p className="text-base text-slate-600 dark:text-slate-300">
              A transparent loan amortization schedule shows exactly how each repayment splits
              between loan amortization and interest. By comparing your amortization schedule month
              by month, you can spot when overpayments deliver the most value and understand the
              tipping point where interest drops below principal.
            </p>
          </div>

          <div className="space-y-4">
            <Heading
              as="h3"
              size="h3"
              weight="semibold"
              className="text-slate-900 dark:text-slate-100"
            >
              Choosing the Right Loan Amortization Schedule Calculator
            </Heading>
            <p className="text-base text-slate-600 dark:text-slate-300">
              This amortization calculator combines charts, tables, and export tools so you can
              tailor any loan amortization calculator scenario to your needs. Use it as a loan
              amortization schedule calculator before refinancing, planning home improvements, or
              comparing how different amortization schedule options affect your long-term costs.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={amortizationFAQs} />
        </div>
      </section>
    </div>
  );
}
