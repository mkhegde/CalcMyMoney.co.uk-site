import React, { useMemo, useState } from 'react';
import { Calculator, CreditCard, TrendingDown, ShieldCheck, Quote, BookOpen } from 'lucide-react';

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
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart.jsx';

const keywords = [
  'credit card repayment calculator',
  'credit card calculator',
  'credit card payoff calculator',
  'credit card interest calculator',
];

const metaDescription =
  'See how long it takes to repay UK credit card debt. Compare minimum payments versus fixed payments, total interest, and payoff dates.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/credit-card-repayment-calculator';
const pagePath = '/calculators/credit-card-repayment-calculator';
const pageTitle = 'Credit Card Repayment Calculator | UK Payoff Planner';

const faqItems = [
  {
    question: 'Why should I pay more than the minimum?',
    answer:
      'Minimum payments mostly cover interest. Paying extra each month slashes total interest and months to clear the balance. Use this calculator to test different payment levels.',
  },
  {
    question: 'How is the minimum payment calculated?',
    answer:
      'Most lenders set the minimum as a percentage of the balance, with a small floor (e.g. £5). Adjust these inputs to mirror your card’s terms.',
  },
  {
    question: 'Should I consider a balance transfer?',
    answer:
      'If you qualify for a 0% card, the interest-free period can speed up repayment. Run the numbers here first so you know the regular payoff time as a benchmark.',
  },
];

const emotionalMessage =
  'Watching your balance fall each month turns discipline into momentum. Map out the journey so you stay motivated until the debt disappears.';

const emotionalQuote = {
  text: 'Success is the sum of small efforts, repeated day in and day out.',
  author: 'Robert Collier',
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

function calculateRepayment({
  balance,
  apr,
  monthlyPayment,
  minPaymentPercent,
  minPaymentFloor,
}) {
  const monthlyRate = Math.max(parseNumber(apr), 0) / 100 / 12;
  let remaining = Math.max(parseNumber(balance), 0);
  const fixedPayment = Math.max(parseNumber(monthlyPayment), 0);
  const minRate = Math.max(parseNumber(minPaymentPercent), 0) / 100;
  const minFloor = Math.max(parseNumber(minPaymentFloor), 0);

  const schedule = [];
  let totalInterest = 0;
  let totalPaid = 0;
  let months = 0;

  while (remaining > 0 && months < 1200) {
    const interest = remaining * monthlyRate;
    const minimumDue = Math.max(minFloor, (remaining + interest) * minRate);
    const payment = Math.max(fixedPayment, minimumDue);

    if (payment <= interest) {
      // payment does not cover interest; break to avoid infinite loop
      totalInterest += interest;
      totalPaid += payment;
      months += 1;
      break;
    }

    const principal = Math.min(payment - interest, remaining);
    remaining = Math.max(remaining - principal, 0);

    schedule.push({
      month: months + 1,
      payment,
      interest,
      principal,
      balance: remaining,
    });

    totalInterest += interest;
    totalPaid += payment;
    months += 1;

    if (remaining <= 0) break;
  }

  return {
    months,
    totalInterest,
    totalPaid,
    schedule,
    remaining,
  };
}

export default function CreditCardRepaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    balance: '4,500',
    apr: '24.9',
    monthlyPayment: '150',
    minPaymentPercent: '2.5',
    minPaymentFloor: '5',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Credit Card Repayment Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Debt & Loans Calculators', url: '/calculators#debt-loans' },
      { name: 'Credit Card Repayment Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Interest paid', value: results.totalInterest, color: '#f97316' },
      { name: 'Principal repaid', value: results.totalPaid - results.totalInterest, color: '#2563eb' },
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
    const computed = calculateRepayment(inputs);
    setHasCalculated(true);
    setResults(computed);

    const csvRows = [
      ['Month', 'Payment (£)', 'Interest (£)', 'Principal (£)', 'Balance (£)'],
      ...computed.schedule.map((row) => [
        row.month,
        row.payment,
        row.interest,
        row.principal,
        row.balance,
      ]),
    ];

    setCsvData([
      ['Starting balance', parseNumber(inputs.balance)],
      ['APR', `${inputs.apr}%`],
      ['Monthly payment', parseNumber(inputs.monthlyPayment)],
      ['Minimum payment rate', `${inputs.minPaymentPercent}%`],
      ['Minimum payment floor', parseNumber(inputs.minPaymentFloor)],
      ['Total interest paid', computed.totalInterest],
      ['Total paid', computed.totalPaid],
      ['Months to clear balance', computed.months],
      [],
      ...csvRows,
    ]);
  };

  const handleReset = () => {
    setInputs({
      balance: '4,500',
      apr: '24.9',
      monthlyPayment: '150',
      minPaymentPercent: '2.5',
      minPaymentFloor: '5',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Credit Card Repayment Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Enter your balance, APR, and planned payment to see how long it takes to clear your UK credit card debt and how much interest you’ll pay.
            </p>
          </header>

          <section className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm dark:border-rose-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Plan your path to debt-free
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-rose-200 bg-rose-50/70 p-4 text-sm text-rose-900 shadow-sm dark:border-rose-800/60 dark:bg-rose-950/40 dark:text-rose-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-rose-700 dark:text-rose-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Card details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="balance">Current balance (£)</Label>
                      <Input
                        id="balance"
                        inputMode="decimal"
                        value={inputs.balance}
                        onChange={handleInputChange('balance')}
                        placeholder="e.g. 4,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apr">APR (% per year)</Label>
                      <Input
                        id="apr"
                        inputMode="decimal"
                        value={inputs.apr}
                        onChange={handleInputChange('apr')}
                        placeholder="e.g. 24.9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyPayment">Monthly payment (£)</Label>
                      <Input
                        id="monthlyPayment"
                        inputMode="decimal"
                        value={inputs.monthlyPayment}
                        onChange={handleInputChange('monthlyPayment')}
                        placeholder="e.g. 150"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPaymentPercent">Minimum payment rate (% of balance + interest)</Label>
                      <Input
                        id="minPaymentPercent"
                        inputMode="decimal"
                        value={inputs.minPaymentPercent}
                        onChange={handleInputChange('minPaymentPercent')}
                        placeholder="e.g. 2.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minPaymentFloor">Minimum payment floor (£)</Label>
                      <Input
                        id="minPaymentFloor"
                        inputMode="decimal"
                        value={inputs.minPaymentFloor}
                        onChange={handleInputChange('minPaymentFloor')}
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate repayment plan
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
                    Add your balance, APR, and payment, then press{' '}
                    <span className="font-semibold">Calculate repayment plan</span> to see payoff time and interest.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-200" aria-hidden="true" />
                        Repayment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Months to clear balance</p>
                        <p className="text-2xl font-semibold">{results.months}</p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Total interest paid</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Total paid</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalPaid)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="credit-card-repayment-schedule"
                          title="Credit card repayment calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ShieldCheck className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Interest versus principal
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBreakdownChart data={chartData} title="Credit card repayment breakdown" />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Stay in control of repayments
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Automate payments above the minimum, track promotional APR expiry dates, and review balances monthly so you stay on track.
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

