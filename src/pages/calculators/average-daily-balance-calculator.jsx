import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, CalendarRange, Percent, Receipt } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'average daily balance calculator',
  'average daily balance',
  'average balance calculator',
  'credit card interest calculator',
  'loan balance calculator',
];

const metaDescription =
  'Use our average daily balance calculator and average balance calculator to estimate credit card interest calculator charges and loan balance calculator accruals.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/average-daily-balance-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const defaultEntries = [
  { id: 'period-1', days: 10, balance: 1250 },
  { id: 'period-2', days: 8, balance: 925 },
  { id: 'period-3', days: 12, balance: 600 },
];

const averageDailyFaqs = [
  {
    question: 'What transactions should I include?',
    answer:
      'List each period where your balance stayed constant. Use statement activity to note the number of days after a purchase or payment. The average daily balance calculator multiplies each balance by the days it was outstanding.',
  },
  {
    question: 'Does this work for loans as well as credit cards?',
    answer:
      'Yes. The same approach works for overdrafts, credit cards, and lines of credit. Enter each balance and the days it remained outstanding to estimate the finance charge.',
  },
  {
    question: 'How is interest calculated from the average balance?',
    answer:
      'Lenders multiply the average daily balance by the daily periodic rate (APR ÷ 365) and the number of days on the statement. Adjust the APR slider to see how interest changes.',
  },
];

const calculateAverageDailyBalance = ({ entries, statementDays, apr }) => {
  const totalDays = Math.max(statementDays, 1);
  const weightedSum = entries.reduce(
    (sum, entry) => sum + (Number(entry.balance) || 0) * (Number(entry.days) || 0),
    0
  );
  const daysTracked = entries.reduce((sum, entry) => sum + (Number(entry.days) || 0), 0);
  const averageBalance = totalDays > 0 ? weightedSum / totalDays : 0;

  const dailyRate = Math.max(apr, 0) / 100 / 365;
  const financeCharge = averageBalance * dailyRate * Math.max(statementDays, 0);

  return {
    averageBalance,
    financeCharge,
    daysTracked,
    unexplainedDays: Math.max(totalDays - daysTracked, 0),
    dailyRate,
  };
};

export default function AverageDailyBalanceCalculatorPage() {
  const [statementDays, setStatementDays] = useState(30);
  const [apr, setApr] = useState(19.9);
  const [entries, setEntries] = useState(defaultEntries);

  const results = useMemo(
    () =>
      calculateAverageDailyBalance({
        entries,
        statementDays: Number(statementDays) || 0,
        apr: Number(apr) || 0,
      }),
    [entries, statementDays, apr]
  );

  const updateEntry = (id, field, value) => {
    setEntries((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addEntry = () => {
    const id = `period-${entries.length + 1}`;
    setEntries((items) => [...items, { id, days: 1, balance: 0 }]);
  };

  const removeEntry = (id) => {
    setEntries((items) => items.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setStatementDays(30);
    setApr(19.9);
    setEntries(defaultEntries);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Average Daily Balance Calculator | Average Daily Balance</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Average Daily Balance Calculator | Average Daily Balance" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Average Daily Balance Calculator | Average Daily Balance" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Average Daily Balance Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate charges with an average daily balance calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Average Daily Balance Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Break down balances by day to see the precise interest impact for your credit card or line of
            credit statement period.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CalendarRange className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Statement settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="statementDays">Statement length (days)</Label>
                  <Slider
                    id="statementDays"
                    className="mt-3"
                    value={[Number(statementDays)]}
                    onValueChange={(value) => setStatementDays(Number(value[0].toFixed(0)))}
                    min={10}
                    max={45}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>10</span>
                    <span>{statementDays}</span>
                    <span>45</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apr">APR (% per year)</Label>
                  <Slider
                    id="apr"
                    className="mt-3"
                    value={[Number(apr)]}
                    onValueChange={(value) => setApr(Number(value[0].toFixed(1)))}
                    min={0}
                    max={39.9}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>0%</span>
                    <span>{apr.toFixed(1)}%</span>
                    <span>39.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Balance periods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center"
                  >
                    <div className="flex items-center gap-2">
                      <Label className="text-xs uppercase text-slate-500">Days</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="numeric"
                        value={entry.days}
                        onChange={(event) =>
                          updateEntry(entry.id, 'days', Number(event.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs uppercase text-slate-500">Balance (£)</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={entry.balance}
                        onChange={(event) =>
                          updateEntry(entry.id, 'balance', Number(event.target.value) || 0)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="justify-self-end text-indigo-600 dark:text-indigo-300"
                      onClick={() => removeEntry(entry.id)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addEntry}>
                  Add balance period
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Average balance summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Average daily balance</span>
                  <span>{currencyFormatter.format(results.averageBalance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Daily periodic rate</span>
                  <span>{percentFormatter.format(results.dailyRate)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Finance charge estimate</span>
                  <span>{currencyFormatter.format(results.financeCharge)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Days tracked</span>
                  <span>{results.daysTracked}</span>
                </div>
                {results.unexplainedDays > 0 && (
                  <p className="text-xs text-amber-600 dark:text-amber-300">
                    You have {results.unexplainedDays} unassigned days. Add additional balance periods or
                    adjust statement length to ensure totals match.
                  </p>
                )}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Average balance calculator workflow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Start with the average balance calculator above, then reconcile the results against your
                statement. Combine multiple cards or overdrafts to see how balances fluctuate across your
                full portfolio.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Credit card interest calculator checks
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Feed the average daily balance into your credit card interest calculator to validate the
                issuer’s finance charge. Spot mistakes early and adjust repayments to limit future interest.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Loan balance calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                For loans with interest calculated daily, plug in the outstanding balances after each
                payment. The loan balance calculator approach highlights how extra payments reduce average
                balances and interest charges over time.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={averageDailyFaqs} />
            </section>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example statement
            </Button>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
