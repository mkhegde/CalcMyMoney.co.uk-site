import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, Wallet, PiggyBank, PlusCircle, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = ['monthly budget calculator', 'budget calculator'];

const metaDescription =
  'Create a realistic monthly budget calculator plan. Track income, compare spending categories, and see how much you can direct to savings with our UK-focused budget planner.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/budget-planner';
const pagePath = '/calculators/budget-planner';
const pageTitle = 'Budget Planner | Monthly Budget Calculator UK';

const defaultIncome = [
  { id: 'salary', name: 'Salary', amount: '3,200' },
  { id: 'side-hustle', name: 'Side hustle', amount: '450' },
];

const defaultExpenses = [
  { id: 'rent', name: 'Rent or mortgage', amount: '1,200' },
  { id: 'utilities', name: 'Utilities & broadband', amount: '220' },
  { id: 'groceries', name: 'Groceries', amount: '380' },
  { id: 'transport', name: 'Transport & fuel', amount: '160' },
  { id: 'debt', name: 'Debt repayments', amount: '300' },
  { id: 'insurance', name: 'Insurance & protection', amount: '180' },
  { id: 'lifestyle', name: 'Lifestyle & entertainment', amount: '240' },
];

const faqItems = [
  {
    question: 'How should I organise my budget categories?',
    answer:
      'Start with core bills such as housing, utilities, food, transport, insurance, savings, and lifestyle. Add extra categories for childcare, pets, or subscriptions. The aim is to mirror your real spending so nothing gets missed.',
  },
  {
    question: 'How often should I revisit my budget?',
    answer:
      'Check in weekly to keep small purchases in line, then review the full plan monthly. Update the budget planner once payday lands so you know exactly what can flow into savings.',
  },
  {
    question: 'What savings rate should I target?',
    answer:
      'Many advisers suggest 15–20% of take-home pay, but mortgage overpayments or childcare costs may reduce this temporarily. Use the monthly budget calculator to test scenarios until you find a comfortable yet ambitious target.',
  },
];

const emotionalMessage =
  'Budgeting is not about restriction; it is the map towards the experiences and impact you care about most. Every pound you direct intentionally is a vote for the life you want.';

const emotionalQuote = {
  text: 'A budget is telling your money where to go instead of wondering where it went.',
  author: 'John C. Maxwell',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

function parseAmount(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value) {
  return `${percentFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

function sum(items = []) {
  return items.reduce((total, item) => total + parseAmount(item.amount), 0);
}

export default function BudgetPlannerPage() {
  const [incomeItems, setIncomeItems] = useState(defaultIncome);
  const [expenseItems, setExpenseItems] = useState(defaultExpenses);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Budget Planner',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Saving Tools', url: '/calculators#budgeting' },
      { name: 'Budget Planner', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleIncomeChange = (id, value) => {
    setIncomeItems((items) => items.map((item) => (item.id === id ? { ...item, amount: value } : item)));
  };

  const handleExpenseChange = (id, value) => {
    setExpenseItems((items) => items.map((item) => (item.id === id ? { ...item, amount: value } : item)));
  };

  const addIncomeRow = () => {
    const id = `income-${incomeItems.length + 1}`;
    setIncomeItems((items) => [...items, { id, name: 'Additional income', amount: '0' }]);
  };

  const addExpenseRow = () => {
    const id = `expense-${expenseItems.length + 1}`;
    setExpenseItems((items) => [...items, { id, name: 'New category', amount: '0' }]);
  };

  const expenseChartData = useMemo(() => {
    if (!calculation) return [];
    return calculation.expenseItems
      .filter((item) => parseAmount(item.amount) > 0)
      .map((item) => ({
        name: item.name,
        value: parseAmount(item.amount),
      }));
  }, [calculation]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const totalIncome = sum(incomeItems);
    const totalExpenses = sum(expenseItems);
    const net = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (net / totalIncome) * 100 : 0;

    const result = {
      totalIncome,
      totalExpenses,
      net,
      savingsRate,
      incomeItems,
      expenseItems,
    };
    setCalculation(result);
    setHasCalculated(true);

    const csvRows = [
      ['Income category', 'Amount (£)'],
      ...incomeItems.map((item) => [item.name, formatCurrency(parseAmount(item.amount))]),
      [],
      ['Expense category', 'Amount (£)'],
      ...expenseItems.map((item) => [item.name, formatCurrency(parseAmount(item.amount))]),
      [],
      ['Total income', formatCurrency(totalIncome)],
      ['Total expenses', formatCurrency(totalExpenses)],
      ['Net position', formatCurrency(net)],
      ['Savings rate', formatPercent(savingsRate)],
    ];

    setCsvData(csvRows);
  };

  const handleReset = () => {
    setIncomeItems(defaultIncome);
    setExpenseItems(defaultExpenses);
    setCalculation(null);
    setCsvData(null);
    setHasCalculated(false);
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
                Budget Planner
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Map your monthly cash flow with the UK budget calculator, compare spending categories, and reclaim
              more cash for savings goals. Enter your income and bills, then reveal how much is left once every
              commitment is covered.
            </p>
          </header>

          <section className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Stay intentional with every £
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

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wallet className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Monthly inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Heading as="h2" size="h4" className="!mb-0 text-slate-900 dark:text-slate-100">
                        Income
                      </Heading>
                      <Button type="button" variant="ghost" size="sm" onClick={addIncomeRow}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add income
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {incomeItems.map((item) => (
                        <div key={item.id} className="space-y-1">
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {item.name}
                          </p>
                          <Input
                            inputMode="decimal"
                            value={item.amount}
                            onChange={(event) => handleIncomeChange(item.id, event.target.value)}
                            placeholder="e.g. 3,200"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <Heading as="h2" size="h4" className="!mb-0 text-slate-900 dark:text-slate-100">
                        Expenses
                      </Heading>
                      <Button type="button" variant="ghost" size="sm" onClick={addExpenseRow}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add expense
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {expenseItems.map((item) => (
                        <div key={item.id} className="space-y-1">
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {item.name}
                          </p>
                          <Input
                            inputMode="decimal"
                            value={item.amount}
                            onChange={(event) => handleExpenseChange(item.id, event.target.value)}
                            placeholder="e.g. 350"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate monthly budget
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
                <Card className="border border-dashed border-slate-300 bg-white/50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Add your income and expense figures, then press{' '}
                    <span className="font-semibold">Calculate monthly budget</span> to see the total you can put
                    towards savings.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-indigo-200 bg-indigo-50 text-indigo-900 shadow-sm dark:border-indigo-900 dark:bg-indigo-900/40 dark:text-indigo-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5" aria-hidden="true" />
                        Budget snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-indigo-900/40">
                        <p className="text-sm text-indigo-700 dark:text-indigo-200">Total income</p>
                        <p className="text-2xl font-semibold">{formatCurrency(calculation.totalIncome)}</p>
                      </div>
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-indigo-900/40">
                        <p className="text-sm text-indigo-700 dark:text-indigo-200">Total expenses</p>
                        <p className="text-2xl font-semibold">{formatCurrency(calculation.totalExpenses)}</p>
                      </div>
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-indigo-900/40">
                        <p className="text-sm text-indigo-700 dark:text-indigo-200">Net position</p>
                        <p className="text-2xl font-semibold">
                          {formatCurrency(calculation.net)}{' '}
                          <span className="text-sm text-indigo-600 dark:text-indigo-200">per month</span>
                        </p>
                      </div>
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-indigo-900/40">
                        <p className="text-sm text-indigo-700 dark:text-indigo-200">Savings rate</p>
                        <p className="text-2xl font-semibold">{formatPercent(calculation.savingsRate)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="budget-planner-results"
                          title="Budget planner results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Expense breakdown
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
                        <ResultBreakdownChart data={expenseChartData} title="Budget expense breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Detailed numbers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                          <p className="text-sm text-slate-600 dark:text-slate-300">Average daily spend</p>
                          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(calculation.totalExpenses / 30)}
                          </p>
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                          <p className="text-sm text-slate-600 dark:text-slate-300">Annual savings potential</p>
                          <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {formatCurrency(calculation.net * 12)}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        These figures assume a 30-day month for daily averages. Adjust your budget whenever bills
                        change to keep your savings targets on track.
                      </p>
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
                Budget planning tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Split your net surplus between emergency savings, pension contributions, and lifestyle treats so
              you stay motivated. If your savings rate is negative, prioritise high-interest debt repayments,
              negotiate bills, or explore additional income streams.
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
