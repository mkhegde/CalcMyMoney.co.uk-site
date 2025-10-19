import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Wallet, PieChart, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://calcmymoney.co.uk/calculators/budget-calculator';

const schemaKeywords = [
  'Financial Planning',
  'Income vs Expenses',
  'Debt Repayment',
  'Cash Flow',
  'Money Management',
];

const faqItems = [
  {
    question: 'How do I start building a monthly budget?',
    answer:
      'List every source of income, then categorise fixed and variable expenses. Track actual spending against your plan weekly to stay in control of cash flow.',
  },
  {
    question: 'What percentage of income should go to savings goals?',
    answer:
      'Many planners suggest saving 20% of net income, but tailor the number to your debt repayment needs, emergency fund target, and lifestyle priorities.',
  },
  {
    question: 'How can I make space for savings if my expenses are high?',
    answer:
      'Start by reviewing subscriptions and discretionary categories. Negotiating bills or consolidating debt can lower monthly spending and free up cash for your goals.',
  },
];

const defaultIncomes = [
  { id: 'income-1', label: 'Primary salary', amount: '3200' },
  { id: 'income-2', label: 'Side hustle', amount: '400' },
];

const defaultExpenses = [
  { id: 'expense-1', label: 'Rent / Mortgage', amount: '1200' },
  { id: 'expense-2', label: 'Utilities & bills', amount: '220' },
  { id: 'expense-3', label: 'Groceries', amount: '360' },
];

let idCounter = 10;
const newId = (prefix) => `${prefix}-${idCounter++}`;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function BudgetCalculator() {
  const [incomes, setIncomes] = useState(defaultIncomes);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [savingsGoal, setSavingsGoal] = useState('500');
  const [debtRepayment, setDebtRepayment] = useState('250');

  const handleIncomeChange = useCallback((id, field, value) => {
    setIncomes((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }, []);

  const handleExpenseChange = useCallback((id, field, value) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }, []);

  const removeIncome = useCallback((id) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addIncome = useCallback(() => {
    setIncomes((prev) => [
      ...prev,
      { id: newId('income'), label: 'New income', amount: '0' },
    ]);
  }, []);

  const addExpense = useCallback(() => {
    setExpenses((prev) => [
      ...prev,
      { id: newId('expense'), label: 'New expense', amount: '0' },
    ]);
  }, []);

  const reset = useCallback(() => {
    setIncomes(defaultIncomes);
    setExpenses(defaultExpenses);
    setSavingsGoal('500');
    setDebtRepayment('250');
  }, []);

  const overview = useMemo(() => {
    const totalIncome = incomes.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    const totalExpenses = expenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    const savingsTarget = Number(savingsGoal) || 0;
    const debtTarget = Number(debtRepayment) || 0;

    const totalOutgoings = totalExpenses + savingsTarget + debtTarget;
    const balance = totalIncome - totalOutgoings;
    const savingsRate = totalIncome > 0 ? (savingsTarget / totalIncome) * 100 : 0;
    const debtRatio = totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;

    return {
      totalIncome,
      totalExpenses,
      savingsTarget,
      debtTarget,
      totalOutgoings,
      balance,
      savingsRate,
      debtRatio,
    };
  }, [incomes, expenses, savingsGoal, debtRepayment]);

  const incomeAnalysis = useMemo(() => {
    const topIncome = incomes.reduce(
      (acc, item) =>
        Number(item.amount) > Number(acc.amount || 0) ? item : acc,
      { label: 'n/a', amount: '0' },
    );
    const topExpense = expenses.reduce(
      (acc, item) =>
        Number(item.amount) > Number(acc.amount || 0) ? item : acc,
      { label: 'n/a', amount: '0' },
    );
    return { topIncome, topExpense };
  }, [incomes, expenses]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Monthly Budget Planner &amp; Personal Finance Calculator</title>
        <meta
          name="description"
          content="Monthly budget calculator for personal finance planning. Track income vs expenses, manage debt repayment, and monitor savings goals."
        />
        <meta
          name="keywords"
          content="Budget Calculator, Expense Tracker, Savings Goals"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Budget Calculator',
              description:
                'Personal finance planner for income versus expenses, debt repayment scheduling, cash-flow monitoring, and money management.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Budget Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Create budget plans, strengthen personal finance habits, and track monthly spending to stay aligned with savings goals.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Wallet className="h-5 w-5 text-emerald-500" />
                Incomes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {incomes.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      handleIncomeChange(item.id, 'label', event.target.value)
                    }
                    className="col-span-1"
                  />
                  <Input
                    value={item.amount}
                    inputMode="decimal"
                    onChange={(event) =>
                      handleIncomeChange(item.id, 'amount', event.target.value)
                    }
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeIncome(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addIncome}>
                Add income
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <Input
                    value={item.label}
                    onChange={(event) =>
                      handleExpenseChange(item.id, 'label', event.target.value)
                    }
                  />
                  <Input
                    value={item.amount}
                    inputMode="decimal"
                    onChange={(event) =>
                      handleExpenseChange(item.id, 'amount', event.target.value)
                    }
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeExpense(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addExpense}>
                Add expense
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <PiggyBank className="h-5 w-5 text-emerald-500" />
                Goals &amp; Debt
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium" htmlFor="savingsGoal">
                  Monthly savings goal (GBP)
                </Label>
                <Input
                  id="savingsGoal"
                  inputMode="decimal"
                  value={savingsGoal}
                  onChange={(event) => setSavingsGoal(event.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium" htmlFor="debtRepayment">
                  Monthly debt repayment (GBP)
                </Label>
                <Input
                  id="debtRepayment"
                  inputMode="decimal"
                  value={debtRepayment}
                  onChange={(event) => setDebtRepayment(event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset budget
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PieChart className="h-5 w-5 text-emerald-500" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Total monthly income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(overview.totalIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total monthly expenses</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(overview.totalExpenses)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Savings goal</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(overview.savingsTarget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Debt repayment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(overview.debtTarget)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total outgoings</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(overview.totalOutgoings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p
                      className={`text-lg font-semibold ${overview.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}
                    >
                      {currencyFormatter.format(overview.balance)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-500" />
                  Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Savings rate:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {Number.isFinite(overview.savingsRate)
                      ? `${overview.savingsRate.toFixed(1)}%`
                      : '0%'}
                  </span>
                </p>
                <p>
                  Expense ratio:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {Number.isFinite(overview.debtRatio)
                      ? `${overview.debtRatio.toFixed(1)}%`
                      : '0%'}
                  </span>
                </p>
                <p>
                  Highest income source:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {incomeAnalysis.topIncome.label} (
                    {currencyFormatter.format(Number(incomeAnalysis.topIncome.amount) || 0)})
                  </span>
                </p>
                <p>
                  Largest budget category:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {incomeAnalysis.topExpense.label} (
                    {currencyFormatter.format(Number(incomeAnalysis.topExpense.amount) || 0)})
                  </span>
                </p>
                <p>
                  Revisit budget categories quarterly to reflect changes in monthly spending and ensure ongoing financial health.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Create Budget Habits that Support Financial Health
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Reviewing monthly spending and income analysis keeps personal finance in balance. Use a
            consistent schedule to reconcile accounts, update budget categories, and stay on track for
            savings goals.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Monitor Monthly Spending by Budget Categories
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Group expenses into meaningful budget categories. This makes it easier to reduce overspend,
            track debt repayment progress, and redirect surplus cash toward investment or emergency
            funds.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Strengthen Financial Health with Income Analysis
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding which income streams drive your cash flow helps you prioritise career
            decisions, side hustles, or passive income strategies that bolster monthly budget
            resilience.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
