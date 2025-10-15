import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ClipboardList, PiggyBank, PlusCircle } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'weekly budget planner',
  'budget planner',
  'budget spreadsheet',
  'budget tracker',
  'budgeting tool',
  'budget online',
  'monthly budget planner',
];

const metaDescription =
  'Use our weekly budget planner and budget planner dashboard to track income, run a budget spreadsheet, and manage spending with a flexible budgeting tool.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/weekly-budget-planner';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultIncome = [
  { id: 'salary', name: 'Salary', amount: 550 },
  { id: 'side', name: 'Side hustle', amount: 95 },
];

const defaultExpenses = [
  { id: 'housing', name: 'Housing & utilities', amount: 300 },
  { id: 'food', name: 'Groceries & takeaway', amount: 110 },
  { id: 'transport', name: 'Transport & fuel', amount: 45 },
  { id: 'fun', name: 'Fun & entertainment', amount: 60 },
  { id: 'sinking', name: 'Sinking funds', amount: 70 },
];

const weeklyBudgetFaqs = [
  {
    question: 'How should I split my weekly pay?',
    answer:
      'Cover essentials like rent, utilities, and groceries first. Then allocate fixed amounts to sinking funds and discretionary categories. The weekly budget planner helps enforce those limits so you never overspend between pay days.',
  },
  {
    question: 'Can I roll unused amounts into next week?',
    answer:
      'Yes. Record the surplus in the budget tracker section and decide whether to roll it over, save it, or fund irregular expenses. Consistent tracking keeps short-term windsfalls aligned with long-term goals.',
  },
  {
    question: 'How do I convert the plan to monthly?',
    answer:
      'Use the monthly budget planner view in the summary area. Multiply weekly totals by the average number of weeks per month (4.33) to keep annual and monthly budgets synchronised.',
  },
];

const calculateTotals = (incomeItems, expenseItems) => {
  const incomeTotal = incomeItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const expenseTotal = expenseItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const net = incomeTotal - expenseTotal;
  return {
    incomeTotal,
    expenseTotal,
    net,
    monthlyIncome: incomeTotal * 4.33,
    monthlyExpenses: expenseTotal * 4.33,
    monthlyNet: net * 4.33,
  };
};

export default function WeeklyBudgetPlannerPage() {
  const [incomeItems, setIncomeItems] = useState(defaultIncome);
  const [expenseItems, setExpenseItems] = useState(defaultExpenses);

  const totals = useMemo(() => calculateTotals(incomeItems, expenseItems), [incomeItems, expenseItems]);

  const updateItem = (setter) => (id, field, value) => {
    setter((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addRow = (setter, prefix, label) => () => {
    setter((items) => [
      ...items,
      { id: `${prefix}-${items.length + 1}`, name: label, amount: 0 },
    ]);
  };

  const removeRow = (setter) => (id) => {
    setter((items) => items.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Weekly Budget Planner | Budget Planner</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Weekly Budget Planner | Budget Planner" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Weekly Budget Planner | Budget Planner" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Weekly Budget Planner',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan weekly spending with a budgeting tool',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Weekly Budget Planner
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Map income, bills, and savings goals in a single weekly dashboard—then roll the totals into
            your monthly budget planner automatically.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Weekly income
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {incomeItems.map((item) => (
                  <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <Input
                      value={item.name}
                      onChange={(event) => updateItem(setIncomeItems)(item.id, 'name', event.target.value)}
                      className="font-medium"
                    />
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${item.id}-amount`} className="text-xs uppercase text-slate-500">
                        Amount
                      </Label>
                      <Input
                        id={`${item.id}-amount`}
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={item.amount}
                        onChange={(event) =>
                          updateItem(setIncomeItems)(item.id, 'amount', Number(event.target.value) || 0)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(setIncomeItems)(item.id)}
                      className="justify-self-end text-emerald-600 dark:text-emerald-300"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addRow(setIncomeItems, 'income', 'New income')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add weekly income
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Weekly expenses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {expenseItems.map((item) => (
                  <div key={item.id} className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center">
                    <Input
                      value={item.name}
                      onChange={(event) => updateItem(setExpenseItems)(item.id, 'name', event.target.value)}
                      className="font-medium"
                    />
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`${item.id}-amount`} className="text-xs uppercase text-slate-500">
                        Amount
                      </Label>
                      <Input
                        id={`${item.id}-amount`}
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={item.amount}
                        onChange={(event) =>
                          updateItem(setExpenseItems)(item.id, 'amount', Number(event.target.value) || 0)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(setExpenseItems)(item.id)}
                      className="justify-self-end text-emerald-600 dark:text-emerald-300"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={addRow(setExpenseItems, 'expense', 'New category')}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add weekly expense
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Weekly summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total income</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(totals.incomeTotal)}
                  </p>
                </div>
                <div className="rounded-md border border-rose-200 bg-rose-50 p-4 text-center dark:border-rose-800 dark:bg-rose-900/30">
                  <p className="text-sm text-rose-700 dark:text-rose-200">Total expenses</p>
                  <p className="text-2xl font-semibold text-rose-900 dark:text-rose-100">
                    {currencyFormatter.format(totals.expenseTotal)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800 md:col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Net position</p>
                  <p
                    className={`text-2xl font-semibold ${
                      totals.net >= 0
                        ? 'text-emerald-700 dark:text-emerald-200'
                        : 'text-rose-700 dark:text-rose-200'
                    }`}
                  >
                    {currencyFormatter.format(totals.net)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Equivalent monthly surplus {currencyFormatter.format(totals.monthlyNet)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Budget tracker and budget spreadsheet workflow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Export these numbers into your favourite budget spreadsheet each Friday. Batch upload
                receipts, track cash envelopes, and use the weekly budget planner view here to make sure
                every pound is allocated with purpose.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Budgeting tool and budget online tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat this budgeting tool as your online control panel. Set phone reminders so you block
                time for budget online reviews, and celebrate weekly wins by transferring surplus into
                targeted sinking funds.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                For longer horizons, plug the monthly figures into the monthly budget planner. That way
                holiday funds, debt overpayments, and investment contributions stay consistent year-round.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={weeklyBudgetFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
