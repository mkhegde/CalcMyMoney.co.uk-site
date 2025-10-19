import React, { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, CreditCard, TrendingUp, BarChart2, Quote, BookOpen } from 'lucide-react';
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

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = [
  'car loan calculator',
  'car loan',
  'new car loan calculator',
  'used car loan calculator',
  'auto loan calculator',
  'car loan payment calculator',
];

const metaDescription =
  'Estimate monthly car loan repayments, total interest, and payoff time. Compare new and used car finance options with the UK car loan calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-loan-calculator';
const pagePath = '/calculators/car-loan-calculator';
const pageTitle = 'Car Loan Calculator | UK Auto Finance Calculator';

const defaultInputs = {
  vehiclePrice: '28,000',
  depositAmount: '4,000',
  interestRate: '6.2',
  termYears: '5',
  adminFees: '250',
  extraPayment: '0',
};

const faqItems = [
  {
    question: 'Should I choose dealer finance or a bank loan?',
    answer:
      'Compare the APR, fees, and repayment flexibility. Dealer finance is convenient but may be more expensive. This calculator shows the true total cost so you can pick the option that fits your budget.',
  },
  {
    question: 'What happens if I make extra monthly payments?',
    answer:
      'Overpayments reduce both the loan term and interest paid. Enter an extra payment amount to see how quickly the balance clears and how much interest you save.',
  },
  {
    question: 'Does the calculator work for new and used cars?',
    answer:
      'Yes. Adjust the rate and term to reflect the finance you have been quoted. Used car loans often have higher rates and shorter terms, which you can model instantly.',
  },
];

const emotionalMessage =
  'Financing a car should enhance your freedom, not add financial stress. Understanding each repayment lets you drive off the forecourt with certainty.';

const emotionalQuote = {
  text: 'The road to success is dotted with many tempting parking spaces.',
  author: 'Will Rogers',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function buildAmortisationSchedule(loanAmount, monthlyRate, totalMonths, extraPayment) {
  const schedule = [];
  let balance = loanAmount;
  let month = 1;
  let totalInterest = 0;
  const basePayment =
    monthlyRate === 0
      ? loanAmount / totalMonths
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

  while (balance > 0 && month <= totalMonths + 1) {
    const interestPortion = balance * monthlyRate;
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

    if (balance <= 0) break;
    month += 1;
  }

  return schedule;
}

function calculateCarLoan(inputs) {
  const vehiclePrice = parseNumber(inputs.vehiclePrice);
  const depositAmount = parseNumber(inputs.depositAmount);
  const interestRate = parseNumber(inputs.interestRate);
  const termYears = parseNumber(inputs.termYears);
  const adminFees = parseNumber(inputs.adminFees);
  const extraPayment = parseNumber(inputs.extraPayment);

  if (vehiclePrice <= 0 || termYears <= 0) {
    return null;
  }

  const amountFinanced = Math.max(vehiclePrice - depositAmount + adminFees, 0);
  const totalMonths = Math.round(termYears * 12);
  const monthlyRate = interestRate / 100 / 12;
  const schedule = buildAmortisationSchedule(amountFinanced, monthlyRate, totalMonths, extraPayment);

  if (!schedule.length) {
    return null;
  }

  const monthlyPayment = schedule[0]?.payment ?? 0;
  const totalInterest = schedule[schedule.length - 1].totalInterest;
  const totalCost = amountFinanced + totalInterest;
  const effectiveTermMonths = schedule.length;
  const payoffDateMonthsEarlier = totalMonths - effectiveTermMonths;

  return {
    vehiclePrice,
    depositAmount,
    interestRate,
    termYears,
    adminFees,
    extraPayment,
    amountFinanced,
    schedule,
    monthlyPayment,
    totalInterest,
    totalCost,
    effectiveTermMonths,
    payoffDateMonthsEarlier,
  };
}

export default function CarLoanCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Car Loan Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Transport & Motoring', url: '/calculators#transport' },
      { name: 'Car Loan Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Principal', value: calculation.amountFinanced, color: '#2563eb' },
      { name: 'Interest', value: calculation.totalInterest, color: '#f97316' },
    ];
  }, [calculation, hasCalculated]);

  const areaData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return calculation.schedule.map((entry) => ({
      month: entry.month,
      Balance: entry.remainingBalance,
      InterestPaid: entry.totalInterest,
    }));
  }, [calculation, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = calculateCarLoan(inputs);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const scheduleRows = result.schedule.map((row) => [
      row.month,
      formatCurrency(row.payment),
      formatCurrency(row.principalPortion),
      formatCurrency(row.interestPortion),
      formatCurrency(row.remainingBalance),
    ]);

    const csvRows = [
      ['Metric', 'Value'],
      ['Amount financed', formatCurrency(result.amountFinanced)],
      ['Monthly payment', formatCurrency(result.monthlyPayment)],
      ['Total interest', formatCurrency(result.totalInterest)],
      ['Total cost of finance', formatCurrency(result.totalCost)],
      ['Effective term (months)', result.effectiveTermMonths],
      ['Months saved via overpayments', result.payoffDateMonthsEarlier],
      [],
      ['Month', 'Payment (£)', 'Principal (£)', 'Interest (£)', 'Remaining balance (£)'],
      ...scheduleRows,
    ];

    setCsvData(csvRows);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setCalculation(null);
    setCsvData(null);
    setHasCalculated(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Car Loan Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare UK car finance offers. Adjust deposit, APR, and terms to reveal monthly repayments, total
              interest, and the benefit of overpayments before you sign the paperwork.
            </p>
          </header>

          <section className="rounded-xl border border-purple-100 bg-white p-6 shadow-sm dark:border-purple-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Finance with certainty
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-purple-200 bg-purple-50/70 p-4 text-sm text-purple-900 shadow-sm dark:border-purple-800/60 dark:bg-purple-950/40 dark:text-purple-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-purple-700 dark:text-purple-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                  Loan inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vehiclePrice">Vehicle price (£)</Label>
                      <Input
                        id="vehiclePrice"
                        inputMode="decimal"
                        value={inputs.vehiclePrice}
                        onChange={handleInputChange('vehiclePrice')}
                        placeholder="e.g. 28,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositAmount">Deposit (£)</Label>
                      <Input
                        id="depositAmount"
                        inputMode="decimal"
                        value={inputs.depositAmount}
                        onChange={handleInputChange('depositAmount')}
                        placeholder="e.g. 4,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">APR (% per year)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 6.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="decimal"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adminFees">Admin & option-to-purchase fees (£)</Label>
                      <Input
                        id="adminFees"
                        inputMode="decimal"
                        value={inputs.adminFees}
                        onChange={handleInputChange('adminFees')}
                        placeholder="e.g. 250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraPayment">Monthly overpayment (£)</Label>
                      <Input
                        id="extraPayment"
                        inputMode="decimal"
                        value={inputs.extraPayment}
                        onChange={handleInputChange('extraPayment')}
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate car finance
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your vehicle price, deposit, rate, and term, then press{' '}
                    <span className="font-semibold">Calculate car finance</span> to see repayments, interest, and an
                    amortisation schedule you can download.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please review the figures. Ensure the vehicle price and term are positive values to produce a
                    valid schedule.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                        Finance summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Monthly payment</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.monthlyPayment)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total interest paid</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalInterest)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Finance balance</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.amountFinanced)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Months saved by overpaying</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {calculation.payoffDateMonthsEarlier}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="car-loan-schedule"
                          title="Car loan calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                        Payment composition
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart data={chartData} title="Principal versus interest" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart2 className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                        Balance over time
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={areaData}>
                          <defs>
                            <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.6} />
                              <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.05} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="Balance"
                            stroke="#7c3aed"
                            fill="url(#balanceGradient)"
                            strokeWidth={2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Smarter car finance decisions
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Use soft credit checks to secure a range of offers, compare representative APRs, and consider paying
              fees upfront to reduce interest. If you intend to change vehicle early, ensure the settlement figure
              fits the car’s future value.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row">
            <span>Plan every motoring expense with our transport calculators.</span>
            <Link
              to="/calculators"
              className="inline-flex items-center rounded-lg border border-purple-200 px-4 py-2 font-medium text-purple-700 transition hover:border-purple-400 hover:text-purple-900 dark:border-purple-800 dark:text-purple-300 dark:hover:border-purple-600 dark:hover:text-purple-100"
            >
              Browse calculator directory
            </Link>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}

