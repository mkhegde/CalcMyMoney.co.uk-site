import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calculator, ClipboardList, PiggyBank, PlusCircle, Trash2, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/weekly-budget-planner';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/weekly-budget-planner';
const pageTitle = 'Weekly Budget Planner UK | Track Income & Spend';
const metaDescription =
  'Plan weekly income, expenses, and savings goals with the UK weekly budget planner. Export your budget to stay on track every pay cycle.';
const keywords = getMappedKeywords('Weekly Budget Planner');

const faqItems = [
  {
    question: 'How should I allocate my weekly pay?',
    answer:
      'Cover essentials first—housing, utilities, food, and transport. Then assign fixed amounts to sinking funds and discretionary spends. The planner shows your leftover balance each week.',
  },
  {
    question: 'Can I roll unused amounts into next week?',
    answer:
      'Yes. Record the surplus as an income line labelled “Carry over” or add it to savings. This keeps short-term wins aligned with long-term goals.',
  },
  {
    question: 'How do I convert weekly figures to monthly?',
    answer:
      'Multiply weekly totals by 4.33 for a monthly view. The planner provides monthly equivalents automatically so you can cross-check with your bills calendar.',
  },
];

const emotionalMessage =
  'Your weekly budget is your financial heartbeat. A few intentional minutes here keep bills paid, goals funded, and guilt-free spending on the calendar.';
const emotionalQuote = {
  text: 'A budget tells us what we can’t afford, but it doesn’t keep us from buying it.',
  author: 'William Feather',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultIncome = [
  { id: 'salary', name: 'Salary', amount: '550' },
  { id: 'side', name: 'Side hustle', amount: '95' },
];

const defaultExpenses = [
  { id: 'housing', name: 'Housing & utilities', amount: '300' },
  { id: 'food', name: 'Groceries & takeaway', amount: '110' },
  { id: 'transport', name: 'Transport & fuel', amount: '45' },
  { id: 'fun', name: 'Fun & entertainment', amount: '60' },
  { id: 'sinking', name: 'Sinking funds', amount: '70' },
];

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateBudgetTotals = (incomeItems, expenseItems) => {
  const weeklyIncome = incomeItems.reduce((sum, item) => sum + Math.max(parseNumber(item.amount), 0), 0);
  const weeklyExpenses = expenseItems.reduce((sum, item) => sum + Math.max(parseNumber(item.amount), 0), 0);
  const weeklyNet = weeklyIncome - weeklyExpenses;
  const monthlyIncome = weeklyIncome * 4.33;
  const monthlyExpenses = weeklyExpenses * 4.33;
  const monthlyNet = weeklyNet * 4.33;

  return {
    weeklyIncome,
    weeklyExpenses,
    weeklyNet,
    monthlyIncome,
    monthlyExpenses,
    monthlyNet,
  };
};

const buildCsvData = (results, incomeItems, expenseItems) => {
  if (!results) return null;

  const rows = [
    ['Summary', 'Weekly (£)', 'Monthly (£)'],
    ['Income', currencyFormatter.format(results.weeklyIncome), currencyFormatter.format(results.monthlyIncome)],
    ['Expenses', currencyFormatter.format(results.weeklyExpenses), currencyFormatter.format(results.monthlyExpenses)],
    ['Net position', currencyFormatter.format(results.weeklyNet), currencyFormatter.format(results.monthlyNet)],
    [],
    ['Income items'],
  ];

  incomeItems.forEach((item) => {
    rows.push([item.name, currencyFormatter.format(parseNumber(item.amount))]);
  });

  rows.push([], ['Expense items']);
  expenseItems.forEach((item) => {
    rows.push([item.name, currencyFormatter.format(parseNumber(item.amount))]);
  });

  return rows;
};

const buildChartData = (items) =>
  items
    .map((item) => ({ name: item.name || 'Category', value: Math.max(parseNumber(item.amount), 0) }))
    .filter((item) => item.value > 0);

export default function WeeklyBudgetPlannerPage() {
  const [incomeItems, setIncomeItems] = useState(defaultIncome);
  const [expenseItems, setExpenseItems] = useState(defaultExpenses);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Weekly Budget Planner',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Weekly Budget Planner', url: pagePath },
    ],
    faq: faqItems,
  });

  const resetResults = useCallback(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const updateItem = useCallback(
    (setter) => (id, field) => (event) => {
      const { value } = event.target;
      setter((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
      resetResults();
    },
    [resetResults]
  );

  const addRow = useCallback(
    (setter, prefix, label) => () => {
      setter((prev) => [
        ...prev,
        { id: `${prefix}-${Date.now()}`, name: label, amount: '0' },
      ]);
      resetResults();
    },
    [resetResults]
  );

  const removeRow = useCallback(
    (setter) => (id) => {
      setter((prev) => prev.filter((item) => item.id !== id));
      resetResults();
    },
    [resetResults]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateBudgetTotals(incomeItems, expenseItems);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, incomeItems, expenseItems));
    },
    [incomeItems, expenseItems]
  );

  const handleReset = useCallback(() => {
    setIncomeItems(defaultIncome);
    setExpenseItems(defaultExpenses);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const incomeChart = useMemo(() => buildChartData(incomeItems), [incomeItems]);
  const expenseChart = useMemo(() => buildChartData(expenseItems), [expenseItems]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        keywords={keywords}
        articleTags={keywords}
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
                Weekly Budget Planner UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Map weekly income and spending, then roll the results into monthly totals for effortless
              budgeting.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-900/40"
            textColor="text-emerald-900 dark:text-emerald-50"
            footerColor="text-emerald-700 dark:text-emerald-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <Card className="border border-emerald-200 bg-white dark:border-emerald-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Weekly budget inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Income</h2>
                    {incomeItems.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Input
                          value={item.name}
                          onChange={updateItem(setIncomeItems)(item.id, 'name')}
                          placeholder="e.g. Salary"
                          className="sm:flex-1"
                        />
                        <Input
                          value={item.amount}
                          onChange={updateItem(setIncomeItems)(item.id, 'amount')}
                          inputMode="decimal"
                          placeholder="e.g. 550"
                          className="sm:w-36"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(setIncomeItems)(item.id)}
                          className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                        >
                          <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addRow(setIncomeItems, 'income', 'New income')}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add income line
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Expenses</h2>
                    {expenseItems.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Input
                          value={item.name}
                          onChange={updateItem(setExpenseItems)(item.id, 'name')}
                          placeholder="e.g. Groceries"
                          className="sm:flex-1"
                        />
                        <Input
                          value={item.amount}
                          onChange={updateItem(setExpenseItems)(item.id, 'amount')}
                          inputMode="decimal"
                          placeholder="e.g. 110"
                          className="sm:w-36"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(setExpenseItems)(item.id)}
                          className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                        >
                          <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addRow(setExpenseItems, 'expense', 'New expense')}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add expense line
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate weekly budget
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your weekly income and expenses and press
                    <span className="font-semibold"> Calculate weekly budget</span> to see net totals and
                    monthly equivalents.
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
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Weekly income</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Weekly expenses</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyExpenses)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Weekly net</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyNet)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Monthly net (approx)</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyNet)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="weekly-budget-calculation"
                          title="Weekly Budget Planner Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Income mix
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
                        <ResultBreakdownChart data={incomeChart} title="Weekly income sources" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Expense mix
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
                        <ResultBreakdownChart data={expenseChart} title="Weekly expense breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
</div>
      </CalculatorWrapper>
    </div>
  );
}
