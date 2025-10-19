import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, Wallet, PieChart, PiggyBank, Quote, BookOpen } from 'lucide-react';

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
  'budget calculator',
  'monthly budget calculator',
  'income vs expenses calculator',
  'cash flow planner',
];

const metaDescription =
  'Build your UK monthly budget by balancing income, bills, savings, and debt repayments. See your cash surplus and savings rate instantly.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/budget-calculator';
const pagePath = '/calculators/budget-calculator';
const pageTitle = 'Budget Calculator | UK Monthly Cash-Flow Planner';

const defaultIncomes = [
  { id: 'income-1', label: 'Primary salary', amount: '3,200' },
  { id: 'income-2', label: 'Side hustle', amount: '400' },
];

const defaultExpenses = [
  { id: 'expense-1', label: 'Rent / Mortgage', amount: '1,200' },
  { id: 'expense-2', label: 'Utilities & bills', amount: '220' },
  { id: 'expense-3', label: 'Groceries', amount: '360' },
];

const faqItems = [
  {
    question: 'How should I structure my monthly budget?',
    answer:
      'Start with income, then split expenses into essentials, financial goals, and lifestyle. Tracking each category helps you prioritise and adjust when costs shift.',
  },
  {
    question: 'What savings rate should I aim for?',
    answer:
      'A 20% savings rate is a popular benchmark, but the right target depends on your debt repayments and financial goals. Use this calculator to test different scenarios.',
  },
  {
    question: 'How can I free up cash for goals?',
    answer:
      'Review subscriptions, negotiate bills, and plan meals to trim discretionary costs. Any freed-up cash can go towards debt, savings, or investment targets.',
  },
];

const emotionalMessage =
  'Money confidence comes from seeing every pound working for you. Give each expense a job, and you will stay in control of your goals.';

const emotionalQuote = {
  text: 'A budget is more than just a series of numbers on a page; it is an embodiment of our values.',
  author: 'Barack Obama',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

let idCounter = 100;
const newId = (prefix) => `${prefix}-${idCounter += 1}`;

function calculateBudget({ incomes, expenses, savingsGoal, debtRepayment }) {
  const totalIncome = incomes.reduce((sum, item) => sum + parseNumber(item.amount), 0);
  const expenseTotal = expenses.reduce((sum, item) => sum + parseNumber(item.amount), 0);
  const savings = parseNumber(savingsGoal);
  const debt = parseNumber(debtRepayment);

  const totalOutgoings = expenseTotal + savings + debt;
  const balance = totalIncome - totalOutgoings;
  const savingsRate = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
  const essentialRate = totalIncome > 0 ? (expenseTotal / totalIncome) * 100 : 0;

  return {
    totalIncome,
    expenseTotal,
    savings,
    debt,
    totalOutgoings,
    balance,
    savingsRate,
    essentialRate,
  };
}

export default function BudgetCalculatorPage() {
  const [incomes, setIncomes] = useState(defaultIncomes);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [savingsGoal, setSavingsGoal] = useState('500');
  const [debtRepayment, setDebtRepayment] = useState('250');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Budget Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Budget Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Living costs', value: results.expenseTotal, color: '#0ea5e9' },
      { name: 'Savings goals', value: results.savings, color: '#22c55e' },
      { name: 'Debt repayments', value: results.debt, color: '#f97316' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

  const updateItem = (setState) => (id, field, value) => {
    setState((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeItem = (setState) => (id) => {
    setState((prev) => prev.filter((item) => item.id !== id));
  };

  const addItem = (setState, prefix, defaultLabel) => () => {
    setState((prev) => [
      ...prev,
      { id: newId(prefix), label: defaultLabel, amount: '0' },
    ]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateBudget({ incomes, expenses, savingsGoal, debtRepayment });
    setHasCalculated(true);
    setResults(computed);

    const header = ['Category', 'Amount (£)'];
    const incomeRows = incomes.map((item) => [item.label, currencyFormatter.format(parseNumber(item.amount))]);
    const expenseRows = expenses.map((item) => [item.label, currencyFormatter.format(parseNumber(item.amount))]);

    setCsvData([
      ['Monthly income'],
      ...incomeRows,
      [],
      ['Monthly expenses'],
      ...expenseRows,
      [],
      ['Savings goal', currencyFormatter.format(computed.savings)],
      ['Debt repayments', currencyFormatter.format(computed.debt)],
      ['Total income', currencyFormatter.format(computed.totalIncome)],
      ['Total outgoings', currencyFormatter.format(computed.totalOutgoings)],
      ['Monthly balance', currencyFormatter.format(computed.balance)],
      ['Savings rate', `${numberFormatter.format(computed.savingsRate)}%`],
    ]);
  };

  const handleReset = () => {
    setIncomes(defaultIncomes);
    setExpenses(defaultExpenses);
    setSavingsGoal('500');
    setDebtRepayment('250');
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Budget Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Build a monthly budget that balances bills, savings, and debt repayments. Adjust each
              category to see how your surplus and savings rate respond.
            </p>
          </header>

          <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Give every £ a purpose
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Income and spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <Heading as="h2" size="h4" className="text-slate-900 dark:text-slate-100 !mb-0">
                      Monthly income
                    </Heading>
                    <div className="space-y-3">
                      {incomes.map((item) => (
                        <div key={item.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px_auto]">
                          <Input
                            value={item.label}
                            onChange={(event) => updateItem(setIncomes)(item.id, 'label', event.target.value)}
                            aria-label="Income source"
                          />
                          <Input
                            inputMode="decimal"
                            value={item.amount}
                            onChange={(event) => updateItem(setIncomes)(item.id, 'amount', event.target.value)}
                            aria-label="Income amount"
                          />
                          <Button type="button" variant="ghost" onClick={() => removeItem(setIncomes)(item.id)}>
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={addItem(setIncomes, 'income', 'Additional income')}>
                      Add income
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Heading as="h2" size="h4" className="text-slate-900 dark:text-slate-100 !mb-0">
                      Monthly expenses
                    </Heading>
                    <div className="space-y-3">
                      {expenses.map((item) => (
                        <div key={item.id} className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_150px_auto]">
                          <Input
                            value={item.label}
                            onChange={(event) => updateItem(setExpenses)(item.id, 'label', event.target.value)}
                            aria-label="Expense category"
                          />
                          <Input
                            inputMode="decimal"
                            value={item.amount}
                            onChange={(event) => updateItem(setExpenses)(item.id, 'amount', event.target.value)}
                            aria-label="Expense amount"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeItem(setExpenses)(item.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button type="button" variant="outline" onClick={addItem(setExpenses, 'expense', 'Additional expense')}>
                      Add expense
                    </Button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="savingsGoal">Monthly savings goal (£)</Label>
                      <Input
                        id="savingsGoal"
                        inputMode="decimal"
                        value={savingsGoal}
                        onChange={(event) => setSavingsGoal(event.target.value)}
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="debtRepayment">Debt repayments (£)</Label>
                      <Input
                        id="debtRepayment"
                        inputMode="decimal"
                        value={debtRepayment}
                        onChange={(event) => setDebtRepayment(event.target.value)}
                        placeholder="e.g. 250"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate budget
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
                    Add your monthly income and spending, then press{' '}
                    <span className="font-semibold">Calculate budget</span> to reveal cash flow and
                    savings rate.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Budget summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Total income</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Total outgoings</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalOutgoings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Monthly balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Savings rate</p>
                        <p className="text-2xl font-semibold">
                          {numberFormatter.format(results.savingsRate)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="budget-calculator-results"
                          title="Budget calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Spending mix
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
                        <ResultBreakdownChart data={chartData} title="Budget allocation breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Stay on track each month
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Revisit the calculator at the start of every month, line up direct debits just after
              payday, and choose one category to trim if your balance dips into the red.
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

