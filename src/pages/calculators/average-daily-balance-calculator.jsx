import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, CreditCard, CalendarDays, TrendingDown, Quote, BookOpen } from 'lucide-react';

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
  'average daily balance calculator',
  'credit card interest calculator',
  'finance charge calculator',
  'credit card payoff planner',
];

const metaDescription =
  'Estimate the average daily balance for your UK credit card, model the finance charge for the billing cycle, and plan earlier payments to minimise interest.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/average-daily-balance-calculator';
const pagePath = '/calculators/average-daily-balance-calculator';
const pageTitle = 'Average Daily Balance Calculator | Credit Card Finance Charge';

const defaultTransactions = [
  { id: 1, day: '1', amount: '-50', description: 'Purchase' },
  { id: 2, day: '12', amount: '200', description: 'Payment' },
  { id: 3, day: '20', amount: '-120', description: 'Purchase' },
];

const faqItems = [
  {
    question: 'How is the average daily balance calculated?',
    answer:
      'Your card provider records the balance for each day of the billing cycle, sums those balances, and divides by the number of days. The result is the average daily balance used to determine the finance charge.',
  },
  {
    question: 'How can I lower the finance charge?',
    answer:
      'Make payments as early as possible in the billing cycle and avoid new purchases after paying. Lower balances earlier in the month reduce the average balance and the interest charged.',
  },
  {
    question: 'Does this calculator include grace periods?',
    answer:
      'It shows the interest based on the average daily balance and the APR. Grace period eligibility varies between issuers, so double-check your card terms to see if interest is waived when you clear the full balance.',
  },
];

const emotionalMessage =
  'Staying ahead of credit card interest starts with clarity. Track how each purchase or payment nudges the balance so you can plan smarter repayments.';

const emotionalQuote = {
  text: 'Beware of little expenses. A small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

let transactionId = defaultTransactions.length + 1;

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const clampDay = (day, maxDays) => {
  const value = Math.round(parseNumber(day));
  if (!Number.isFinite(value) || value <= 0) return 1;
  if (value > maxDays) return maxDays;
  return value;
};

function calculateAverageDailyBalance({
  billingDays,
  startingBalance,
  apr,
  transactions,
}) {
  const days = Math.max(1, parseNumber(billingDays));
  const initialBalance = parseNumber(startingBalance);
  const aprValue = parseNumber(apr) / 100;

  const entries = [...transactions]
    .map((txn) => ({
      day: clampDay(txn.day, days),
      amount: parseNumber(txn.amount),
      description: txn.description || '',
    }))
    .sort((a, b) => a.day - b.day);

  let runningBalance = initialBalance;
  let totalBalanceDays = 0;
  let previousDay = 1;

  const contributions = [];

  for (const entry of entries) {
    const span = entry.day - previousDay;
    if (span > 0) {
      totalBalanceDays += runningBalance * span;
    }

    runningBalance += entry.amount;
    contributions.push({
      ...entry,
      balanceAfter: runningBalance,
    });
    previousDay = entry.day;
  }

  totalBalanceDays += runningBalance * (days - previousDay + 1);

  const averageDailyBalance = totalBalanceDays / days;
  const monthlyPeriodicRate = aprValue / 12;
  const financeCharge = averageDailyBalance * monthlyPeriodicRate;

  const totalPurchases = contributions
    .filter((item) => item.amount < 0)
    .reduce((sum, item) => sum + Math.abs(item.amount), 0);
  const totalPayments = contributions
    .filter((item) => item.amount > 0)
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    averageDailyBalance,
    financeCharge,
    monthlyPeriodicRate,
    endingBalance: runningBalance,
    totalPurchases,
    totalPayments,
    contributions,
    days,
  };
}

export default function AverageDailyBalanceCalculatorPage() {
  const [billingDays, setBillingDays] = useState('30');
  const [startingBalance, setStartingBalance] = useState('1,200');
  const [apr, setApr] = useState('19.9');
  const [transactions, setTransactions] = useState(defaultTransactions);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Average Daily Balance Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Debt & Loans Calculators', url: '/calculators#debt-loans' },
      { name: 'Average Daily Balance Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Purchases & charges', value: results.totalPurchases, color: '#f97316' },
      { name: 'Payments & credits', value: results.totalPayments, color: '#22d3ee' },
      { name: 'Finance charge', value: Math.max(results.financeCharge, 0), color: '#dc2626' },
    ].filter((item) => item.value > 0);
  }, [results, hasCalculated]);

  const handleAddTransaction = () => {
    setTransactions((prev) => [
      ...prev,
      { id: transactionId += 1, day: '1', amount: '0', description: '' },
    ]);
  };

  const handleUpdateTransaction = (id, field, value) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, [field]: value } : txn))
    );
  };

  const handleRemoveTransaction = (id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateAverageDailyBalance({
      billingDays,
      startingBalance,
      apr,
      transactions,
    });

    setHasCalculated(true);
    setResults(computed);

    const header = ['Day', 'Amount (£)', 'Description', 'Balance after (£)'];
    const rows = computed.contributions.map((item) => [
      item.day,
      currencyFormatter.format(item.amount),
      item.description || '—',
      currencyFormatter.format(item.balanceAfter),
    ]);

    setCsvData([
      ['Billing days', computed.days],
      ['Average daily balance', currencyFormatter.format(computed.averageDailyBalance)],
      ['Monthly finance charge', currencyFormatter.format(computed.financeCharge)],
      [],
      header,
      ...rows,
    ]);
  };

  const handleReset = () => {
    setBillingDays('30');
    setStartingBalance('1,200');
    setApr('19.9');
    setTransactions(defaultTransactions);
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
                Average Daily Balance Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Track your UK credit card balance across the billing cycle, find the average balance used
              for interest calculations, and see how early payments reduce finance charges.
            </p>
          </header>

          <section className="rounded-xl border border-rose-100 bg-white p-6 shadow-sm dark:border-rose-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Stay ahead of interest surprises
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
                  <CalendarDays className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Billing cycle details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="billingDays">Billing cycle length (days)</Label>
                      <Input
                        id="billingDays"
                        inputMode="numeric"
                        value={billingDays}
                        onChange={(event) => setBillingDays(event.target.value)}
                        placeholder="e.g. 30"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startingBalance">Starting balance (£)</Label>
                      <Input
                        id="startingBalance"
                        inputMode="decimal"
                        value={startingBalance}
                        onChange={(event) => setStartingBalance(event.target.value)}
                        placeholder="e.g. 1,200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apr">Annual percentage rate (APR %)</Label>
                      <Input
                        id="apr"
                        inputMode="decimal"
                        value={apr}
                        onChange={(event) => setApr(event.target.value)}
                        placeholder="e.g. 19.9"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="!mb-0">Transactions during cycle</Label>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddTransaction}>
                        Add transaction
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {transactions.map((txn) => (
                        <div
                          key={txn.id}
                          className="grid gap-2 sm:grid-cols-[80px_minmax(0,1fr)_minmax(0,1fr)_auto]"
                        >
                          <Input
                            inputMode="numeric"
                            value={txn.day}
                            onChange={(event) => handleUpdateTransaction(txn.id, 'day', event.target.value)}
                            placeholder="Day"
                            aria-label="Transaction day"
                          />
                          <Input
                            inputMode="decimal"
                            value={txn.amount}
                            onChange={(event) => handleUpdateTransaction(txn.id, 'amount', event.target.value)}
                            placeholder="Amount (e.g. -50 for spend)"
                            aria-label="Transaction amount"
                          />
                          <Input
                            value={txn.description}
                            onChange={(event) => handleUpdateTransaction(txn.id, 'description', event.target.value)}
                            placeholder="Description"
                            aria-label="Transaction description"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTransaction(txn.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate finance charge
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
                    Add your billing cycle details and press{' '}
                    <span className="font-semibold">Calculate finance charge</span> to see the average
                    daily balance and interest for this month.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CreditCard className="h-5 w-5 text-rose-600 dark:text-rose-200" aria-hidden="true" />
                        Cycle summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Average daily balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.averageDailyBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Finance charge</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.financeCharge)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Monthly periodic rate</p>
                        <p className="text-xl font-semibold">
                          {(results.monthlyPeriodicRate * 100).toFixed(3)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Ending balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.endingBalance)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="average-daily-balance"
                          title="Average daily balance results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingDown className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Purchases vs payments
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
                        <ResultBreakdownChart data={chartData} title="Credit card cycle breakdown" />
                      </Suspense>
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
                Managing credit card interest
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Schedule payments just after payday so the balance stays lower for most of the cycle.
              If you can, line up a balance transfer to a 0% card and use this calculator to check the
              savings before switching.
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

