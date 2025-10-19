import React, { useState, useMemo } from 'react';
import { Calculator, Wallet, PiggyBank, PlusCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const budgetKeywords = ['monthly budget calculator', 'budget calculator'];

const metaDescription =
  'Use our monthly budget calculator to track income, compare categories with the budget calculator, and plan savings goals with flexible monthly adjustments.';

const canonicalUrl = 'https://calcmymoney.co.uk/calculators/budget-planner';
const pageTitle = 'Budget Planner | Budget Calculator';

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Budget Planner',
  url: canonicalUrl,
  description: metaDescription,
  keywords: budgetKeywords.slice(0, 5),
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'Action',
    name: 'Build a monthly budget',
    target: canonicalUrl,
  },
};

const faqItems = [
  {
    question: 'How should I categorise my spending?',
    answer:
      'Start with broad buckets like housing, utilities, food, transport, debt payments, insurance, and personal spending. Add or rename categories so your monthly budget reflects your lifestyle, making it easier to compare actuals against targets.',
  },
  {
    question: 'How often should I update my budget?',
    answer:
      'Review your budget weekly to stay on track, then commit to a monthly review where you capture actual spending, adjust category targets, and realign savings goals. The more frequently you check in, the faster you spot problem areas.',
  },
  {
    question: 'What is a good savings rate?',
    answer:
      'Many planners suggest saving 15-20% of take-home pay, but the right rate depends on your goals. Use this monthly budget calculator to benchmark your current rate and experiment with different cuts or extra income to reach milestones sooner.',
  },
];

const defaultIncome = [
  { id: 'salary', name: 'Salary', amount: '3200' },
  { id: 'side-hustle', name: 'Side Hustle', amount: '450' },
];

const defaultExpenses = [
  { id: 'rent', name: 'Rent or Mortgage', amount: '1200' },
  { id: 'utilities', name: 'Utilities & Internet', amount: '220' },
  { id: 'groceries', name: 'Groceries', amount: '380' },
  { id: 'transport', name: 'Transport', amount: '160' },
  { id: 'debt', name: 'Debt Payments', amount: '300' },
  { id: 'insurance', name: 'Insurance', amount: '180' },
  { id: 'lifestyle', name: 'Lifestyle & Entertainment', amount: '240' },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const COLORS = ['#6366f1', '#22c55e', '#f97316', '#14b8a6', '#f43f5e', '#8b5cf6', '#0ea5e9'];

const calculateTotal = (items) => items.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

export default function BudgetPlannerPage() {
  const [incomeItems, setIncomeItems] = useState(defaultIncome);
  const [expenseItems, setExpenseItems] = useState(defaultExpenses);

  const totals = useMemo(() => {
    const totalIncome = calculateTotal(incomeItems);
    const totalExpenses = calculateTotal(expenseItems);
    const net = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (net / totalIncome) * 100 : 0;
    return { totalIncome, totalExpenses, net, savingsRate };
  }, [incomeItems, expenseItems]);

  const expenseChartData = useMemo(
    () =>
      expenseItems
        .filter((item) => Number(item.amount) > 0)
        .map((item) => ({
          name: item.name,
          value: Number(item.amount),
        })),
    [expenseItems]
  );

  const handleIncomeChange = (id, value) => {
    setIncomeItems((items) =>
      items.map((item) => (item.id === id ? { ...item, amount: value } : item))
    );
  };

  const handleExpenseChange = (id, value) => {
    setExpenseItems((items) =>
      items.map((item) => (item.id === id ? { ...item, amount: value } : item))
    );
  };

  const addIncomeRow = () => {
    const id = `income-${incomeItems.length + 1}`;
    setIncomeItems((items) => [...items, { id, name: 'Additional Income', amount: '0' }]);
  };

  const addExpenseRow = () => {
    const id = `expense-${expenseItems.length + 1}`;
    setExpenseItems((items) => [...items, { id, name: 'New Category', amount: '0' }]);
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={budgetKeywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
      </Helmet>

      <div className="bg-white dark:bg-gray-950">
        <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Budget Planner
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Track income, organise essential spending, and uncover savings opportunities with an
            interactive budgeting workspace.
          </p>
        </div>
        </section>

        <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Monthly Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Heading
                    as="h2"
                    size="h4"
                    weight="semibold"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    Income
                  </Heading>
                  <Button type="button" variant="ghost" size="sm" onClick={addIncomeRow}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {incomeItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      {item.name}
                    </label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={item.amount}
                      onChange={(event) => handleIncomeChange(item.id, event.target.value)}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <Heading
                    as="h2"
                    size="h4"
                    weight="semibold"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    Expenses
                  </Heading>
                  <Button type="button" variant="ghost" size="sm" onClick={addExpenseRow}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
                {expenseItems.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <label className="text-xs text-slate-500 dark:text-slate-400">
                      {item.name}
                    </label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={item.amount}
                      onChange={(event) => handleExpenseChange(item.id, event.target.value)}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <Wallet className="h-5 w-5" />
                  Budget Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total Income</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(totals.totalIncome)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total Expenses</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(totals.totalExpenses)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net Position</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(totals.net)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-slate-600" />
                  Savings Outlook
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-[1fr_auto] gap-6 items-center">
                <div className="space-y-4 text-slate-700 dark:text-slate-200">
                  <p>
                    Based on your current inputs, you are saving{' '}
                    <span className="font-semibold">{totals.savingsRate.toFixed(1)}%</span> of
                    monthly income. Set a target percentage and track your progress by updating this
                    budget calculator each week.
                  </p>
                  <p>
                    If you redirect an extra £100 per month toward savings, your annual savings
                    would increase to{' '}
                    <span className="font-semibold">
                      {currencyFormatter.format(totals.net + 1200)}
                    </span>
                    .
                  </p>
                </div>
                <div className="text-center">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-semibold">
                    {totals.savingsRate.toFixed(1)}%
                  </div>
                  <p className="mt-2 text-xs uppercase text-slate-500 tracking-wide">
                    Savings Rate
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Monthly Spending Mix
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
        </CalculatorWrapper>

        <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Heading
            as="h2"
            size="h2"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Monthly Budget Calculator Insights
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            The monthly budget calculator makes it easy to compare planned figures against actual
            spending. Categorise your expenses, note one-off purchases, and use the pie chart to
            spot where lifestyle creep may be eroding savings.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Making the Most of This Budget Calculator
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Treat this budget calculator as your financial control centre. Enter future changes—like
            a pay rise or upcoming holiday—so you can allocate funds before the month begins. When
            you embrace proactive planning, surplus cash is less likely to disappear on unplanned
            expenses.
          </p>
        </div>
        </section>

        <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
        </section>
      </div>
    </>
  );
}
