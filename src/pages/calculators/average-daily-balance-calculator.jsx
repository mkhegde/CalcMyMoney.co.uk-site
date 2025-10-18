import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, CreditCard, CalendarDays, TrendingDown } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl =
  'https://www.calcmymoney.co.uk/calculators/average-daily-balance-calculator';

const schemaKeywords = [
  'Credit Card Debt',
  'Monthly Payments',
  'Annual Percentage Rate (APR)',
  'Finance Charge',
  'Debt Management',
];

const defaultTransactions = [
  { id: 1, day: '1', amount: '-50', description: 'Purchase' },
  { id: 2, day: '12', amount: '200', description: 'Payment' },
  { id: 3, day: '20', amount: '-120', description: 'Purchase' },
];

let transactionId = 4;

const faqItems = [
  {
    question: 'What is the average daily balance method?',
    answer:
      'Credit card issuers sum daily balances across the billing cycle, divide by the number of days to get the average daily balance, then apply APR/12 to calculate interest charges.',
  },
  {
    question: 'How can I minimize interest?',
    answer:
      'Make payments early in the billing cycle and avoid new charges. Lower daily balances reduce the average and therefore the interest charged.',
  },
  {
    question: 'Does this calculator account for grace periods?',
    answer:
      'The calculation focuses on average daily balance and finance charge. Grace period rules vary by issuer, so confirm with your credit card provider.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function AverageDailyBalanceCalculator() {
  const [billingDays, setBillingDays] = useState('30');
  const [startingBalance, setStartingBalance] = useState('1200');
  const [apr, setApr] = useState('19.9');
  const [transactions, setTransactions] = useState(defaultTransactions);

  const updateTransaction = useCallback((id, field, value) => {
    setTransactions((prev) =>
      prev.map((txn) => (txn.id === id ? { ...txn, [field]: value } : txn)),
    );
  }, []);

  const removeTransaction = useCallback((id) => {
    setTransactions((prev) => prev.filter((txn) => txn.id !== id));
  }, []);

  const addTransaction = useCallback(() => {
    setTransactions((prev) => [
      ...prev,
      { id: transactionId++, day: '15', amount: '0', description: 'Adjustment' },
    ]);
  }, []);

  const reset = useCallback(() => {
    setBillingDays('30');
    setStartingBalance('1200');
    setApr('19.9');
    setTransactions(defaultTransactions);
  }, []);

  const results = useMemo(() => {
    const days = Math.max(1, Number(billingDays) || 30);
    const initialBalance = Number(startingBalance) || 0;
    const aprValue = Number(apr) / 100 || 0;

    const entries = [
      ...transactions
        .map((txn) => ({
          day: Math.min(days, Math.max(1, Number(txn.day) || 1)),
          amount: Number(txn.amount) || 0,
          description: txn.description || '',
        }))
        .sort((a, b) => a.day - b.day),
    ];

    let runningBalance = initialBalance;
    let totalBalanceDays = 0;
    let previousDay = 1;

    for (const entry of entries) {
      const span = entry.day - previousDay;
      totalBalanceDays += runningBalance * span;
      runningBalance += entry.amount;
      previousDay = entry.day;
    }
    totalBalanceDays += runningBalance * (days - previousDay + 1);

    const averageDailyBalance = totalBalanceDays / days;
    const monthlyPeriodicRate = aprValue / 12;
    const financeCharge = averageDailyBalance * monthlyPeriodicRate;

    return {
      averageDailyBalance,
      financeCharge,
      monthlyPeriodicRate,
      endingBalance: runningBalance,
      days,
    };
  }, [apr, billingDays, startingBalance, transactions]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Average Daily Balance &amp; Credit Card Interest Calculator</title>
        <meta
          name="description"
          content="Average Daily Balance Calculator to estimate credit card interest charges and understand billing cycle finance charges."
        />
        <meta
          name="keywords"
          content="Average Daily Balance Calculator, Interest Charges, Billing Cycle"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Average Daily Balance Calculator',
              description:
                'Estimate credit card debt interest using average daily balance, monthly payments, APR, and finance charge calculations for debt management.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Average Daily Balance Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Calculate average daily balance, understand the credit card interest method, and discover
            strategies to minimize interest while maintaining healthy credit utilization.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Billing Cycle Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="billingDays" className="text-sm font-medium">
                  Billing cycle length (days)
                </Label>
                <Input
                  id="billingDays"
                  inputMode="numeric"
                  value={billingDays}
                  onChange={(event) => setBillingDays(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="startingBalance" className="text-sm font-medium">
                  Starting balance (GBP)
                </Label>
                <Input
                  id="startingBalance"
                  inputMode="decimal"
                  value={startingBalance}
                  onChange={(event) => setStartingBalance(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="apr" className="text-sm font-medium">
                  Annual percentage rate (APR %)
                </Label>
                <Input
                  id="apr"
                  inputMode="decimal"
                  value={apr}
                  onChange={(event) => setApr(event.target.value)}
                />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Transactions during cycle
                  </span>
                  <Button type="button" variant="outline" size="sm" onClick={addTransaction}>
                    Add transaction
                  </Button>
                </div>
                <div className="space-y-3">
                  {transactions.map((txn) => (
                    <div
                      key={txn.id}
                      className="grid grid-cols-[70px_1fr_1fr_auto] items-center gap-2"
                    >
                      <Input
                        value={txn.day}
                        inputMode="numeric"
                        onChange={(event) =>
                          updateTransaction(txn.id, 'day', event.target.value)
                        }
                        placeholder="Day"
                      />
                      <Input
                        value={txn.amount}
                        inputMode="decimal"
                        onChange={(event) =>
                          updateTransaction(txn.id, 'amount', event.target.value)
                        }
                        placeholder="Amount"
                      />
                      <Input
                        value={txn.description}
                        onChange={(event) =>
                          updateTransaction(txn.id, 'description', event.target.value)
                        }
                        placeholder="Description"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTransaction(txn.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <CreditCard className="h-5 w-5 text-rose-500" />
                  Credit Card Interest Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Average daily balance</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.averageDailyBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Finance charge (current cycle)</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.financeCharge)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly periodic rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {(results.monthlyPeriodicRate * 100).toFixed(3)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Ending balance projection</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.endingBalance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Billing cycle length</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.days} days
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingDown className="h-5 w-5 text-rose-500" />
                  Debt Management Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Pay early in the billing cycle to lower the daily balance and reduce accrued
                  interest. Multiple smaller payments can outperform one payment at the end of the
                  cycle.
                </p>
                <p>
                  Consolidate high-interest debt or switch to 0% promotional cards to slow finance
                  charge accumulation, improving debt management outcomes.
                </p>
                <p>
                  Monitor credit utilization—keeping balances below 30% of available credit supports
                  stronger credit scores and cheaper borrowing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Average Daily Balance and Credit Card Interest Method
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understand how daily balance fluctuations influence interest. This calculator helps you
            minimize interest and keep credit utilization in check.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Daily Balance Insights Tame High APR Cards
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Track spending and repayments to avoid unnecessary finance charges. Early payments lower
            the average balance and reduce monthly charges.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Smart Strategies to Minimize Interest
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Schedule additional repayments before your statement closes and ringfence a small buffer
            fund. Lower daily balances slash finance charges, while a cash reserve stops you from
            leaning on costly credit during tight months.
          </p>
        </section>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Why Average Daily Balance Matters
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Credit card issuers calculate interest using your average daily balance, so keeping tabs
            on mid-cycle spending is essential. Track balance changes to plan payments and compare
            whether balance transfer deals could reduce costs.
          </p>
          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Stay Ahead of the Billing Cycle
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Note the dates new statements are generated, automate payments, and avoid late-month
            purchases when the balance is already high. These proactive steps keep your average
            balance lean and interest predictable.
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
