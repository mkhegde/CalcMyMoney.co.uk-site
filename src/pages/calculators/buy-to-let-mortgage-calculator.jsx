import React, { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Home,
  Percent,
  PiggyBank,
  BarChart3,
  Quote,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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
  'buy to let mortgage calculator',
  'btl mortgage calculator',
  'buy to let mortgage',
  'buy to let mortgage stamp duty',
  'buy to let mortgage calculator uk',
  'buy to let stamp duty',
];

const metaDescription =
  'Work out deposits, stamp duty, rental coverage and yields with the UK buy-to-let mortgage calculator. Stress test your rent against lender coverage rules before you apply.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/buy-to-let-mortgage-calculator';
const pagePath = '/calculators/buy-to-let-mortgage-calculator';
const pageTitle = 'Buy-to-Let Mortgage Calculator | BTL Mortgage Calculator UK';

const defaultInputs = {
  propertyPrice: '325,000',
  depositPercent: '25',
  interestRate: '5.50',
  termYears: '25',
  monthlyRent: '1,600',
  otherMonthlyCosts: '350',
  stressRate: '7.00',
};

const faqItems = [
  {
    question: 'What stress rate do UK lenders use for buy-to-let?',
    answer:
      'Most buy-to-let lenders stress test rent at 6–8% with an income coverage ratio between 125% and 145%. This calculator lets you adjust the stress rate so you can check affordability before you submit an application.',
  },
  {
    question: 'How much cash do I need for a buy-to-let purchase?',
    answer:
      'You normally need a 25% deposit, plus the 3% stamp duty surcharge and solicitor fees. Our calculator factors in stamp duty and adds a three-month expense buffer to help you plan the total capital required.',
  },
  {
    question: 'Does the calculator show rental yield?',
    answer:
      'Yes. You will see gross and net yield percentages, along with rental coverage metrics that indicate whether your rent supports the mortgage at the chosen interest rate.',
  },
];

const emotionalMessage =
  'A well-managed let provides both income today and long-term capital growth. Know your numbers and you can invest with assurance rather than anxiety.';

const emotionalQuote = {
  text: 'Do not wait to buy real estate. Buy real estate and wait.',
  author: 'Will Rogers',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

const stampDutyBands = [
  { threshold: 0, rate: 0.03 },
  { threshold: 250000, rate: 0.08 },
  { threshold: 925000, rate: 0.13 },
  { threshold: 1500000, rate: 0.15 },
];

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value) {
  return `${percentageFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

function calculateStampDuty(price) {
  if (price <= 0) return 0;
  let duty = 0;
  let remaining = price;

  for (let index = stampDutyBands.length - 1; index >= 0; index -= 1) {
    const { threshold, rate } = stampDutyBands[index];
    if (price > threshold) {
      const taxable = remaining - threshold;
      duty += taxable * rate;
      remaining -= taxable;
    }
  }

  return duty;
}

function calculateMortgagePayment(principal, annualRatePercent, termYears) {
  if (principal <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;
  if (monthlyRate === 0) return principal / totalMonths;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
}

function calculateBuyToLet(inputs) {
  const propertyPrice = parseNumber(inputs.propertyPrice);
  const depositPercent = parseNumber(inputs.depositPercent);
  const interestRate = parseNumber(inputs.interestRate);
  const termYears = parseNumber(inputs.termYears);
  const monthlyRent = parseNumber(inputs.monthlyRent);
  const otherMonthlyCosts = parseNumber(inputs.otherMonthlyCosts);
  const stressRate = parseNumber(inputs.stressRate);

  if (propertyPrice <= 0 || depositPercent <= 0 || termYears <= 0 || monthlyRent <= 0) {
    return null;
  }

  const depositAmount = propertyPrice * (depositPercent / 100);
  const loanAmount = Math.max(propertyPrice - depositAmount, 0);
  const ltv = propertyPrice > 0 ? (loanAmount / propertyPrice) * 100 : 0;
  const repaymentPayment = calculateMortgagePayment(loanAmount, interestRate, termYears);
  const interestOnlyPayment = (loanAmount * (interestRate / 100)) / 12;
  const stressPayment = (loanAmount * (stressRate / 100)) / 12;

  const annualRent = monthlyRent * 12;
  const annualCosts = otherMonthlyCosts * 12;
  const annualMortgageCost = interestOnlyPayment * 12;
  const annualNetIncome = annualRent - annualCosts - annualMortgageCost;
  const rentalCoverage = interestOnlyPayment > 0 ? (monthlyRent / interestOnlyPayment) * 100 : 0;
  const stressCoverage = stressPayment > 0 ? (monthlyRent / stressPayment) * 100 : 0;
  const grossYield = propertyPrice > 0 ? (annualRent / propertyPrice) * 100 : 0;
  const netYield = propertyPrice > 0 ? ((annualRent - annualCosts) / propertyPrice) * 100 : 0;

  const stampDuty = calculateStampDuty(propertyPrice);
  const totalCashRequired = depositAmount + stampDuty + otherMonthlyCosts * 3;

  return {
    propertyPrice,
    depositPercent,
    depositAmount,
    loanAmount,
    ltv,
    interestRate,
    termYears,
    repaymentPayment,
    interestOnlyPayment,
    stressRate,
    stressPayment,
    monthlyRent,
    otherMonthlyCosts,
    annualRent,
    annualCosts,
    annualMortgageCost,
    annualNetIncome,
    rentalCoverage,
    stressCoverage,
    grossYield,
    netYield,
    stampDuty,
    totalCashRequired,
  };
}

export default function BuyToLetMortgageCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Buy-to-Let Mortgage Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Mortgages & Property', url: '/calculators#mortgages-property' },
      { name: 'Buy-to-Let Mortgage Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const barChartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      {
        name: 'Monthly comparison',
        Rent: calculation.monthlyRent,
        'Interest-only mortgage': calculation.interestOnlyPayment,
        'Other costs': calculation.otherMonthlyCosts,
      },
    ];
  }, [calculation, hasCalculated]);

  const pieChartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Deposit', value: calculation.depositAmount, color: '#2563eb' },
      { name: 'Stamp duty', value: calculation.stampDuty, color: '#0ea5e9' },
      { name: 'Expense buffer', value: calculation.otherMonthlyCosts * 3, color: '#22d3ee' },
    ];
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
    const result = calculateBuyToLet(inputs);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const csvRows = [
      ['Metric', 'Value'],
      ['Deposit amount', formatCurrency(result.depositAmount)],
      ['Loan amount', formatCurrency(result.loanAmount)],
      ['Loan-to-value', formatPercent(result.ltv)],
      ['Repayment mortgage payment', formatCurrency(result.repaymentPayment)],
      ['Interest-only payment', formatCurrency(result.interestOnlyPayment)],
      ['Stress payment', formatCurrency(result.stressPayment)],
      ['Monthly rent', formatCurrency(result.monthlyRent)],
      ['Other monthly costs', formatCurrency(result.otherMonthlyCosts)],
      ['Gross yield', formatPercent(result.grossYield)],
      ['Net yield', formatPercent(result.netYield)],
      ['Rental coverage (interest-only)', formatPercent(result.rentalCoverage)],
      ['Rental coverage (stress)', formatPercent(result.stressCoverage)],
      ['Stamp duty estimate', formatCurrency(result.stampDuty)],
      ['Total cash required', formatCurrency(result.totalCashRequired)],
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Buy-to-Let Mortgage Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Evaluate rent coverage, yields, deposit requirements, and stamp duty for your next buy-to-let
              purchase. The calculator follows UK tax rules, putting you in control before speaking to lenders or
              brokers.
            </p>
          </header>

          <section className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:border-sky-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Make confident property decisions
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-900 shadow-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Property details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="propertyPrice">Property price (£)</Label>
                      <Input
                        id="propertyPrice"
                        inputMode="decimal"
                        value={inputs.propertyPrice}
                        onChange={handleInputChange('propertyPrice')}
                        placeholder="e.g. 325,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositPercent">Deposit (%)</Label>
                      <Input
                        id="depositPercent"
                        inputMode="decimal"
                        value={inputs.depositPercent}
                        onChange={handleInputChange('depositPercent')}
                        placeholder="e.g. 25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest rate (% APR)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 5.50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Mortgage term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="decimal"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 25"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Monthly rent (£)</Label>
                      <Input
                        id="monthlyRent"
                        inputMode="decimal"
                        value={inputs.monthlyRent}
                        onChange={handleInputChange('monthlyRent')}
                        placeholder="e.g. 1,600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherMonthlyCosts">Other monthly costs (£)</Label>
                      <Input
                        id="otherMonthlyCosts"
                        inputMode="decimal"
                        value={inputs.otherMonthlyCosts}
                        onChange={handleInputChange('otherMonthlyCosts')}
                        placeholder="e.g. 350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stressRate">Stress rate (% APR)</Label>
                      <Input
                        id="stressRate"
                        inputMode="decimal"
                        value={inputs.stressRate}
                        onChange={handleInputChange('stressRate')}
                        placeholder="e.g. 7.00"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate buy-to-let results
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
                    Enter the property details and rental assumptions, then press{' '}
                    <span className="font-semibold">Calculate buy-to-let results</span> to reveal deposit
                    requirements, rent coverage, yields, and downloadable outputs.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please review the figures. Ensure property price, deposit percentage, term, and monthly rent
                    are all positive numbers before calculating.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Investment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Deposit required</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.depositAmount)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Stamp duty surcharge</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.stampDuty)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Interest-only coverage</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatPercent(calculation.rentalCoverage)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Stress rate coverage</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatPercent(calculation.stressCoverage)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Gross yield</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatPercent(calculation.grossYield)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Net yield</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatPercent(calculation.netYield)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="buy-to-let-mortgage-results"
                          title="Buy-to-let mortgage calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Cash requirement breakdown
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
                        <ResultBreakdownChart data={pieChartData} title="Cash needed for completion" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Monthly rent coverage
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Bar dataKey="Rent" fill="#2563eb" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Interest-only mortgage" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Other costs" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Buy-to-let planning tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Check lender stress criteria, EPC requirements, and limited company structuring before lining up a
              property. Use the calculator output in your discussions with mortgage brokers so they can fast-track
              suitable products.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row">
            <span>Browse more UK mortgage and property calculators.</span>
            <Link
              to="/calculators"
              className="inline-flex items-center rounded-lg border border-sky-200 px-4 py-2 font-medium text-sky-700 transition hover:border-sky-400 hover:text-sky-900 dark:border-sky-800 dark:text-sky-300 dark:hover:border-sky-600 dark:hover:text-sky-100"
            >
              Browse calculator directory
            </Link>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}

