import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, CreditCard, Percent, Gauge, Quote, BookOpen } from 'lucide-react';

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
  'car payment calculator',
  'auto payment calculator',
  'monthly car payment calculator',
  'vehicle payment calculator',
  'car loan payment calculator',
];

const metaDescription =
  'Estimate monthly car loan payments, total interest, and affordability with the UK car payment calculator. See how deposit and term choices change the repayments.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-payment-calculator';
const pagePath = '/calculators/car-payment-calculator';
const pageTitle = 'Car Payment Calculator | UK Monthly Auto Repayments';

const faqItems = [
  {
    question: 'What information do I need to use this calculator?',
    answer:
      'Enter the total amount to finance, your deposit, the APR offered, and the number of months in the agreement. The calculator shows the monthly repayment and total interest.',
  },
  {
    question: 'How can I reduce my monthly car payment?',
    answer:
      'Increase your deposit, extend the term, or secure a lower APR. Beware that longer terms increase total interest, so balance affordability against cost.',
  },
  {
    question: 'Does the calculator account for fees?',
    answer:
      'Add any fees to the financed amount before running the calculation. That way the monthly payment and total interest reflect the actual balance you owe.',
  },
];

const emotionalMessage =
  'Know the monthly hit to your cash flow before you fall in love with the car. Clarity today prevents stress tomorrow.';

const emotionalQuote = {
  text: 'The safe way to double your money is to fold it over once and put it in your pocket.',
  author: 'Kin Hubbard',
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

function calculateCarPayment({ loanAmount, deposit, apr, termMonths }) {
  const amount = parseNumber(loanAmount);
  const upfront = parseNumber(deposit);
  const rate = parseNumber(apr) / 100;
  const months = Math.max(parseNumber(termMonths), 1);

  const principal = Math.max(amount - upfront, 0);
  const monthlyRate = rate / 12;
  const hasInterest = monthlyRate > 0;
  const payment = hasInterest
    ? (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months))
    : principal / months;

  const totalPaid = payment * months;
  const totalInterest = totalPaid - principal;

  return {
    principal,
    monthlyPayment: payment,
    totalPaid,
    totalInterest,
    monthlyRate,
    months,
  };
}

export default function CarPaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: '18,000',
    deposit: '2,500',
    apr: '8.9',
    termMonths: '48',
    monthlyIncome: '3,200',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Car Payment Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Transport & Motoring Calculators', url: '/calculators#transport' },
      { name: 'Car Payment Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const affordability = useMemo(() => {
    if (!results || !hasCalculated) return null;
    const income = parseNumber(inputs.monthlyIncome);
    if (income <= 0) return null;
    const ratio = (results.monthlyPayment / income) * 100;
    return ratio;
  }, [results, hasCalculated, inputs.monthlyIncome]);

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Principal repaid', value: results.principal, color: '#2563eb' },
      { name: 'Interest paid', value: results.totalInterest, color: '#f97316' },
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
    const computed = calculateCarPayment(inputs);
    setHasCalculated(true);
    setResults(computed);

    setCsvData([
      ['Loan amount', currencyFormatter.format(parseNumber(inputs.loanAmount))],
      ['Deposit', currencyFormatter.format(parseNumber(inputs.deposit))],
      ['APR', `${inputs.apr}%`],
      ['Term (months)', computed.months],
      ['Monthly payment', currencyFormatter.format(computed.monthlyPayment)],
      ['Total interest', currencyFormatter.format(computed.totalInterest)],
      ['Total paid', currencyFormatter.format(computed.totalPaid)],
      ['Monthly income', currencyFormatter.format(parseNumber(inputs.monthlyIncome))],
      ['Payment to income ratio', affordability !== null ? `${affordability.toFixed(1)}%` : 'n/a'],
    ]);
  };

  const handleReset = () => {
    setInputs({
      loanAmount: '18,000',
      deposit: '2,500',
      apr: '8.9',
      termMonths: '48',
      monthlyIncome: '3,200',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-600/10 text-violet-700 dark:bg-violet-500/20 dark:text-violet-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Car Payment Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate monthly repayments for UK car loans. Adjust deposit, APR, and term to test what
              fits your income before you apply.
            </p>
          </header>

          <section className="rounded-xl border border-violet-100 bg-white p-6 shadow-sm dark:border-violet-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Keep repayments within reach
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-violet-200 bg-violet-50/70 p-4 text-sm text-violet-900 shadow-sm dark:border-violet-800/60 dark:bg-violet-950/40 dark:text-violet-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-violet-700 dark:text-violet-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                  Loan inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Amount to finance (£)</Label>
                      <Input
                        id="loanAmount"
                        inputMode="decimal"
                        value={inputs.loanAmount}
                        onChange={handleInputChange('loanAmount')}
                        placeholder="e.g. 18,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deposit">Deposit (£)</Label>
                      <Input
                        id="deposit"
                        inputMode="decimal"
                        value={inputs.deposit}
                        onChange={handleInputChange('deposit')}
                        placeholder="e.g. 2,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apr">APR (% per year)</Label>
                      <Input
                        id="apr"
                        inputMode="decimal"
                        value={inputs.apr}
                        onChange={handleInputChange('apr')}
                        placeholder="e.g. 8.9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termMonths">Term (months)</Label>
                      <Input
                        id="termMonths"
                        inputMode="numeric"
                        value={inputs.termMonths}
                        onChange={handleInputChange('termMonths')}
                        placeholder="e.g. 48"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyIncome">Monthly household income (£)</Label>
                      <Input
                        id="monthlyIncome"
                        inputMode="decimal"
                        value={inputs.monthlyIncome}
                        onChange={handleInputChange('monthlyIncome')}
                        placeholder="e.g. 3,200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate payment
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
                    Enter the finance details and press{' '}
                    <span className="font-semibold">Calculate payment</span> to see monthly costs and
                    total interest.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-violet-200 bg-white shadow-sm dark:border-violet-900 dark:bg-violet-900/30 dark:text-violet-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-violet-600 dark:text-violet-200" aria-hidden="true" />
                        Payment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-violet-900 dark:text-violet-200">Monthly payment</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-violet-900 dark:text-violet-200">Total interest</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-violet-900 dark:text-violet-200">Total repaid</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalPaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-violet-900 dark:text-violet-200">Debt-to-income ratio</p>
                        <p className="text-2xl font-semibold">
                          {affordability !== null ? `${affordability.toFixed(1)}%` : 'n/a'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="car-payment-results"
                          title="Car payment calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Gauge className="h-5 w-5 text-violet-600 dark:text-violet-300" aria-hidden="true" />
                        Principal versus interest
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
                        <ResultBreakdownChart data={chartData} title="Car payment breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-violet-600 dark:text-violet-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Keep the car budget balanced
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Combine this repayment view with insurance, maintenance, and running costs so you’re clear
              on the full monthly commitment before upgrading your vehicle.
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

