import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, Car, PiggyBank, Percent, Quote, BookOpen } from 'lucide-react';

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
  'car finance calculator',
  'car finance payment calculator',
  'auto finance calculator',
  'car finance repayments',
  'car finance uk',
];

const metaDescription =
  'Work out UK car finance repayments, total interest, and balloon options. Compare dealer versus bank finance before you sign your next car agreement.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-finance-calculator';
const pagePath = '/calculators/car-finance-calculator';
const pageTitle = 'Car Finance Calculator | UK PCP & HP Repayment Planner';

const faqItems = [
  {
    question: 'How much deposit should I enter?',
    answer:
      'Include cash you plan to pay upfront and the equity from any part-exchange once existing finance is settled. A higher deposit reduces the amount you need to borrow and the monthly repayment.',
  },
  {
    question: 'Can I model a balloon or guaranteed minimum future value (GMFV)?',
    answer:
      'Yes. Enter the balloon amount due at the end of the agreement. Monthly payments then cover the reduced balance while the balloon remains as a final lump sum.',
  },
  {
    question: 'Are arrangement fees included?',
    answer:
      'You can add lender or broker fees in the optional fees field. They are added to the borrowing so the calculator shows the true overall cost.',
  },
];

const emotionalMessage =
  'Avoid surprises at the showroom by knowing your numbers first. Plan the monthly payment, balloon, and total cost before you commit to the car.';

const emotionalQuote = {
  text: 'Never spend your money before you have it.',
  author: 'Thomas Jefferson',
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

function buildFinanceSchedule(principal, monthlyRate, totalMonths, balloon, extraPayment) {
  const schedule = [];
  let balance = principal;
  let month = 1;
  let totalInterest = 0;

  const basePayment =
    monthlyRate === 0
      ? (principal - balloon) / totalMonths
      : ((principal - balloon / Math.pow(1 + monthlyRate, totalMonths)) *
          monthlyRate) /
        (1 - Math.pow(1 + monthlyRate, -totalMonths));

  while (balance > balloon && month <= totalMonths + 1) {
    const interest = balance * monthlyRate;
    let payment = basePayment + extraPayment;

    if (month === totalMonths) {
      payment = balance - balloon + interest;
    } else if (balance - payment + interest < balloon) {
      payment = balance - balloon + interest;
    }

    const principalPortion = payment - interest;
    balance = Math.max(balance - principalPortion, balloon);
    totalInterest += interest;

    schedule.push({
      month,
      payment,
      principalPortion,
      interestPortion: interest,
      balance,
      totalInterest,
    });

    month += 1;
  }

  return { schedule, totalInterest };
}

function calculateCarFinance({
  vehiclePrice,
  deposit,
  apr,
  termMonths,
  balloon,
  fees,
  extraPayment,
}) {
  const price = parseNumber(vehiclePrice);
  const initialDeposit = parseNumber(deposit);
  const rate = parseNumber(apr) / 100;
  const months = Math.max(parseNumber(termMonths), 1);
  const balloonValue = Math.min(parseNumber(balloon), price);
  const feeAmount = parseNumber(fees);
  const overpayment = parseNumber(extraPayment);

  const principal = Math.max(price - initialDeposit + feeAmount, 0);
  const monthlyRate = rate / 12;

  const { schedule, totalInterest } = buildFinanceSchedule(
    principal,
    monthlyRate,
    months,
    balloonValue,
    overpayment
  );
  const monthlyPayment = schedule.length ? schedule[0].payment : 0;
  const effectiveTermMonths = schedule.length;
  const payoffMonthsSaved = Math.max(months - effectiveTermMonths, 0);
  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0) + balloonValue;

  return {
    monthlyPayment,
    totalInterest,
    totalPaid,
    principal,
    feeAmount,
    balloonValue,
    effectiveTermMonths,
    payoffMonthsSaved,
    schedule,
  };
}

export default function CarFinanceCalculatorPage() {
  const [inputs, setInputs] = useState({
    vehiclePrice: '28,000',
    deposit: '4,000',
    apr: '7.5',
    termMonths: '48',
    balloon: '10,000',
    fees: '250',
    extraPayment: '0',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Car Finance Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Transport & Motoring Calculators', url: '/calculators#transport' },
      { name: 'Car Finance Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Amount borrowed', value: results.principal, color: '#2563eb' },
      { name: 'Total interest', value: results.totalInterest, color: '#f97316' },
      { name: 'Arrangement fees', value: results.feeAmount, color: '#22d3ee' },
      { name: 'Balloon payment', value: results.balloonValue, color: '#0ea5e9' },
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
    const computed = calculateCarFinance(inputs);
    setHasCalculated(true);
    setResults(computed);

    const header = ['Month', 'Payment (£)', 'Principal (£)', 'Interest (£)', 'Balance (£)'];
    const rows = computed.schedule.map((row) => [
      row.month,
      currencyFormatter.format(row.payment),
      currencyFormatter.format(row.principalPortion),
      currencyFormatter.format(row.interestPortion),
      currencyFormatter.format(row.balance),
    ]);

    setCsvData([
      ['Vehicle price', currencyFormatter.format(parseNumber(inputs.vehiclePrice))],
      ['Deposit', currencyFormatter.format(parseNumber(inputs.deposit))],
      ['Balloon payment', currencyFormatter.format(computed.balloonValue)],
      ['APR', `${inputs.apr}%`],
      ['Term (months)', computed.effectiveTermMonths],
      ['Monthly payment', currencyFormatter.format(computed.monthlyPayment)],
      ['Total interest', currencyFormatter.format(computed.totalInterest)],
      ['Total paid (including fees & balloon)', currencyFormatter.format(computed.totalPaid)],
      ['Months saved via overpayment', computed.payoffMonthsSaved],
      [],
      header,
      ...rows,
    ]);
  };

  const handleReset = () => {
    setInputs({
      vehiclePrice: '28,000',
      deposit: '4,000',
      apr: '7.5',
      termMonths: '48',
      balloon: '10,000',
      fees: '250',
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
                Car Finance Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Model PCP or HP car finance repayments, compare interest costs, and check how deposits
              or balloon options change your monthly budget.
            </p>
          </header>

          <section className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Finance smarter, not harder
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
                  <Car className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Finance inputs
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
                      <Label htmlFor="deposit">Deposit (£)</Label>
                      <Input
                        id="deposit"
                        inputMode="decimal"
                        value={inputs.deposit}
                        onChange={handleInputChange('deposit')}
                        placeholder="e.g. 4,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apr">APR (% per year)</Label>
                      <Input
                        id="apr"
                        inputMode="decimal"
                        value={inputs.apr}
                        onChange={handleInputChange('apr')}
                        placeholder="e.g. 7.5"
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
                      <Label htmlFor="balloon">Balloon / GMFV (£)</Label>
                      <Input
                        id="balloon"
                        inputMode="decimal"
                        value={inputs.balloon}
                        onChange={handleInputChange('balloon')}
                        placeholder="e.g. 10,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fees">Arrangement & broker fees (£)</Label>
                      <Input
                        id="fees"
                        inputMode="decimal"
                        value={inputs.fees}
                        onChange={handleInputChange('fees')}
                        placeholder="e.g. 250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraPayment">Optional monthly overpayment (£)</Label>
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
                      Calculate finance
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
                    Enter the finance details and press <span className="font-semibold">Calculate finance</span> to
                    see monthly repayments, balloon impact, and total interest.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Finance summary
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
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total interest paid</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total paid (inc. balloon & fees)</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalPaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Months saved via overpayments</p>
                        <p className="text-2xl font-semibold">{results.payoffMonthsSaved}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="car-finance-schedule"
                          title="Car finance calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Cost breakdown
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
                        <ResultBreakdownChart data={chartData} title="Car finance cost distribution" />
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
                Plan the full car budget
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Pair these repayments with the running costs of the car—insurance, fuel, maintenance—and
              check your budget calculator to confirm everything fits before you upgrade.
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

