import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, Factory, TrendingUp, Building2, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = [
  'business loan calculator',
  'commercial loan repayments',
  'uk sme loan calculator',
  'business finance calculator',
];

const metaDescription =
  'Work out monthly repayments for a UK business loan, including total interest and the impact of optional overpayments and arrangement fees.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/business-loan-calculator';
const pagePath = '/calculators/business-loan-calculator';
const pageTitle = 'Business Loan Calculator | UK SME Repayment Planner';

const faqItems = [
  {
    question: 'How are business loan repayments calculated?',
    answer:
      'Repayments are calculated using an amortisation formula that spreads capital and interest over the loan term. Each instalment includes interest on the remaining balance plus a principal reduction.',
  },
  {
    question: 'What costs should I include?',
    answer:
      'Include arrangement fees, valuation costs, or broker fees charged upfront or added to the loan. You can enter them in the fees field to see the real cost of borrowing.',
  },
  {
    question: 'Is it worth making overpayments?',
    answer:
      'If your loan agreement allows penalty-free overpayments, paying extra shortens the term and reduces interest. Always confirm cash flow remains healthy before committing extra funds.',
  },
];

const emotionalMessage =
  'When you know the repayment profile before you borrow, every investment decision becomes clearer. Plan your cash flow with precision.';

const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

function buildSchedule(principal, monthlyRate, totalMonths, extraPayment) {
  const schedule = [];
  let balance = principal;
  let month = 1;
  let totalInterest = 0;

  const basePayment =
    monthlyRate === 0
      ? principal / totalMonths
      : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));

  while (balance > 0 && month <= totalMonths + 1) {
    const interest = balance * monthlyRate;
    const payment = Math.min(basePayment + extraPayment, balance + interest);
    const principalPortion = payment - interest;
    balance = Math.max(balance - principalPortion, 0);
    totalInterest += interest;

    schedule.push({
      month,
      payment,
      principalPortion,
      interestPortion: interest,
      balance,
      totalInterest,
    });

    if (balance <= 0) break;
    month += 1;
  }

  return { schedule, totalInterest };
}

function calculateBusinessLoan({ amount, annualRate, termYears, fees, extraPayment }) {
  const loanAmount = parseNumber(amount);
  const rate = parseNumber(annualRate) / 100;
  const years = parseNumber(termYears);
  const feeAmount = parseNumber(fees);
  const overpayment = parseNumber(extraPayment);

  if (loanAmount <= 0 || years <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalCost: feeAmount,
      effectiveTermMonths: 0,
      payoffMonthsSaved: 0,
      schedule: [],
      principal: loanAmount,
      feeAmount,
    };
  }

  const totalMonths = Math.round(years * 12);
  const monthlyRate = rate / 12;
  const { schedule, totalInterest } = buildSchedule(loanAmount, monthlyRate, totalMonths, overpayment);
  const monthlyPayment = schedule.length > 0 ? schedule[0].payment : 0;
  const effectiveTermMonths = schedule.length;
  const payoffMonthsSaved = Math.max(totalMonths - effectiveTermMonths, 0);

  return {
    monthlyPayment,
    totalInterest,
    totalCost: loanAmount + feeAmount + totalInterest,
    effectiveTermMonths,
    payoffMonthsSaved,
    schedule,
    principal: loanAmount,
    feeAmount,
  };
}

export default function BusinessLoanCalculatorPage() {
  const [inputs, setInputs] = useState({
    amount: '150,000',
    annualRate: '7.2',
    termYears: '6',
    fees: '1,250',
    extraPayment: '0',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Business Loan Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Business & Freelancing Calculators', url: '/calculators#business-freelancing' },
      { name: 'Business Loan Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Principal borrowed', value: results.principal, color: '#2563eb' },
      { name: 'Interest over term', value: results.totalInterest, color: '#f97316' },
      { name: 'Fees & costs', value: results.feeAmount, color: '#22d3ee' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateBusinessLoan(inputs);
    setHasCalculated(true);
    setResults(computed);

    const header = ['Month', 'Repayment (£)', 'Principal (£)', 'Interest (£)', 'Balance (£)'];
    const rows = computed.schedule.map((row) => [
      row.month,
      currencyFormatter.format(row.payment),
      currencyFormatter.format(row.principalPortion),
      currencyFormatter.format(row.interestPortion),
      currencyFormatter.format(row.balance),
    ]);

    setCsvData([
      ['Loan amount', currencyFormatter.format(parseNumber(inputs.amount))],
      ['Interest rate (APR)', `${inputs.annualRate}%`],
      ['Term (months)', computed.schedule.length],
      ['Monthly payment', currencyFormatter.format(computed.monthlyPayment)],
      ['Total interest', currencyFormatter.format(computed.totalInterest)],
      ['Arrangement fees', currencyFormatter.format(computed.feeAmount)],
      ['Total cost', currencyFormatter.format(computed.totalCost)],
      ['Months saved via overpayments', computed.payoffMonthsSaved],
      [],
      header,
      ...rows,
    ]);
  };

  const handleReset = () => {
    setInputs({
      amount: '150,000',
      annualRate: '7.2',
      termYears: '6',
      fees: '1,250',
      extraPayment: '0',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Business Loan Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Plan repayments for UK business borrowing. Understand monthly costs, total interest, and
              the benefit of optional overpayments before committing to finance.
            </p>
          </header>

          <section className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Borrow with clarity
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-indigo-200 bg-indigo-50/70 p-4 text-sm text-indigo-900 shadow-sm dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Loan details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Loan amount (£)</Label>
                      <Input
                        id="amount"
                        inputMode="decimal"
                        value={inputs.amount}
                        onChange={handleInputChange('amount')}
                        placeholder="e.g. 150,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRate">Interest rate (APR %)</Label>
                      <Input
                        id="annualRate"
                        inputMode="decimal"
                        value={inputs.annualRate}
                        onChange={handleInputChange('annualRate')}
                        placeholder="e.g. 7.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Loan term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="decimal"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fees">Arrangement and broker fees (£)</Label>
                      <Input
                        id="fees"
                        inputMode="decimal"
                        value={inputs.fees}
                        onChange={handleInputChange('fees')}
                        placeholder="e.g. 1,250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraPayment">Monthly overpayment (£)</Label>
                      <Input
                        id="extraPayment"
                        inputMode="decimal"
                        value={inputs.extraPayment}
                        onChange={handleInputChange('extraPayment')}
                        placeholder="e.g. 100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate repayments
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
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Provide loan details and press{' '}
                    <span className="font-semibold">Calculate repayments</span> to see monthly costs and
                    total interest.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Factory className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Repayment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Monthly payment</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total interest</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total cost of finance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Months saved by overpayments</p>
                        <p className="text-2xl font-semibold">{results.payoffMonthsSaved}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="business-loan-schedule"
                          title="Business loan calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Cost mix
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
                        <ResultBreakdownChart data={chartData} title="Business loan cost breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Strengthen your borrowing strategy
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare offers from multiple lenders, stress-test cash flow with this calculator, and
              set calendar reminders to revisit rates when your fixed term ends.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}




