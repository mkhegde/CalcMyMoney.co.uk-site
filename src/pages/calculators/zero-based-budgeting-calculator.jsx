import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
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
import { Calculator, ClipboardCheck, PiggyBank, Target, Trash2, PlusCircle, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/zero-based-budgeting-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/zero-based-budgeting-calculator';
const pageTitle = 'Zero-Based Budgeting Calculator UK | Assign Every Pound';
const metaDescription =
  'Build a UK zero-based budget by allocating every pound of income to spending, savings, or debt. Track planned versus actual amounts and export the results.';
const keywords = getMappedKeywords('Zero Based Budgeting Calculator');

const faqItems = [
  {
    question: 'How does zero-based budgeting work?',
    answer:
      'Assign every pound of income to a specific job—spending, saving, or debt. When income minus planned allocations equals zero, you have a balanced plan.',
  },
  {
    question: 'How often should I update the plan?',
    answer:
      'Review weekly to log real spending and adjust the remaining amounts. Zero-based budgeting works best when you reconcile regularly.',
  },
  {
    question: 'Can I plan sinking funds in a zero-based budget?',
    answer:
      'Absolutely. Create categories for holidays, car maintenance, or other irregular bills and allocate monthly amounts until they are fully funded.',
  },
];

const emotionalMessage =
  'A zero-based budget gives every pound a purpose. Once the numbers balance to zero, you can spend with confidence and hit your savings goals faster.';
const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const directoryLinks = [
  {
    url: '/#budgeting',
    label: 'Explore budgeting calculators',
    description: 'Pair zero-based budgeting with weekly plans and goal tracking tools.',
  },
  {
    url: '/calculators/weekly-budget-planner',
    label: 'Weekly Budget Planner',
    description: 'Roll your zero-based allocations into a weekly routine.',
  },
  {
    url: '/calculators/savings-goal-calculator',
    label: 'Savings Goal Calculator',
    description: 'Ringfence spare pounds for holidays, emergency funds, or debt payoff.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultIncome = [
  { id: 'paycheck', name: 'Paycheque', amount: '2,800' },
  { id: 'side', name: 'Side income', amount: '350' },
];

const defaultCategories = [
  { id: 'rent', name: 'Rent & utilities', planned: '1,200', actual: '1,180' },
  { id: 'food', name: 'Food & groceries', planned: '320', actual: '295' },
  { id: 'transport', name: 'Transport', planned: '110', actual: '104' },
  { id: 'debt', name: 'Debt payments', planned: '250', actual: '250' },
  { id: 'fun', name: 'Fun money', planned: '160', actual: '148' },
  { id: 'sinking', name: 'Sinking funds', planned: '300', actual: '0' },
];

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateZeroBasedBudget = (incomeItems, categoryItems) => {
  const incomeTotal = incomeItems.reduce((sum, item) => sum + Math.max(parseNumber(item.amount), 0), 0);
  const plannedTotal = categoryItems.reduce((sum, item) => sum + Math.max(parseNumber(item.planned), 0), 0);
  const actualTotal = categoryItems.reduce((sum, item) => sum + Math.max(parseNumber(item.actual), 0), 0);
  const unassigned = incomeTotal - plannedTotal;
  const variance = plannedTotal - actualTotal;

  const rows = categoryItems.map((item, index) => ({
    id: item.id,
    name: item.name?.trim() || `Category ${index + 1}`,
    planned: Math.max(parseNumber(item.planned), 0),
    actual: Math.max(parseNumber(item.actual), 0),
  }));

  return {
    incomeTotal,
    plannedTotal,
    actualTotal,
    unassigned,
    variance,
    rows,
  };
};

const buildCsvData = (results, incomeItems) => {
  if (!results) return null;
  const rows = [
    ['Income source', 'Amount (£)'],
  ];
  incomeItems.forEach((item) => {
    rows.push([item.name, currencyFormatter.format(parseNumber(item.amount))]);
  });
  rows.push([]);
  rows.push(['Category', 'Planned (£)', 'Actual (£)']);
  results.rows.forEach((row) => {
    rows.push([
      row.name,
      currencyFormatter.format(row.planned),
      currencyFormatter.format(row.actual),
    ]);
  });
  rows.push([]);
  rows.push(['Total income (£)', currencyFormatter.format(results.incomeTotal)]);
  rows.push(['Total planned (£)', currencyFormatter.format(results.plannedTotal)]);
  rows.push(['Total actual (£)', currencyFormatter.format(results.actualTotal)]);
  rows.push(['Unassigned (£)', currencyFormatter.format(results.unassigned)]);
  rows.push(['Variance (£)', currencyFormatter.format(results.variance)]);
  return rows;
};

const buildChartData = (rows, key) =>
  rows
    .map((row) => ({ name: row.name, value: row[key] }))
    .filter((item) => item.value > 0);

export default function ZeroBasedBudgetingCalculatorPage() {
  const [incomeItems, setIncomeItems] = useState(defaultIncome);
  const [categoryItems, setCategoryItems] = useState(defaultCategories);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Zero Based Budgeting Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Zero-Based Budgeting Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const resetResults = useCallback(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const updateIncome = useCallback(
    (id, field) => (event) => {
      const { value } = event.target;
      setIncomeItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
      resetResults();
    },
    [resetResults]
  );

  const updateCategory = useCallback(
    (id, field) => (event) => {
      const { value } = event.target;
      setCategoryItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
      resetResults();
    },
    [resetResults]
  );

  const addIncomeRow = useCallback(() => {
    setIncomeItems((prev) => [
      ...prev,
      { id: `income-${Date.now()}`, name: 'New income', amount: '0' },
    ]);
    resetResults();
  }, [resetResults]);

  const addCategoryRow = useCallback(() => {
    setCategoryItems((prev) => [
      ...prev,
      { id: `category-${Date.now()}`, name: 'New category', planned: '0', actual: '0' },
    ]);
    resetResults();
  }, [resetResults]);

  const removeIncomeRow = useCallback(
    (id) => () => {
      setIncomeItems((prev) => prev.filter((item) => item.id !== id));
      resetResults();
    },
    [resetResults]
  );

  const removeCategoryRow = useCallback(
    (id) => () => {
      setCategoryItems((prev) => prev.filter((item) => item.id !== id));
      resetResults();
    },
    [resetResults]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateZeroBasedBudget(incomeItems, categoryItems);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, incomeItems));
    },
    [incomeItems, categoryItems]
  );

  const handleReset = useCallback(() => {
    setIncomeItems(defaultIncome);
    setCategoryItems(defaultCategories);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const plannedChart = useMemo(() => buildChartData(results?.rows || [], 'planned'), [results]);
  const actualChart = useMemo(() => buildChartData(results?.rows || [], 'actual'), [results]);

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
                Zero-Based Budgeting Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Allocate every pound of income, compare planned versus actual spending, and ensure the
              leftover balance hits zero.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Target className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <ClipboardCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Budget inputs
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
                          onChange={updateIncome(item.id, 'name')}
                          placeholder="e.g. Paycheque"
                          className="sm:flex-1"
                        />
                        <Input
                          value={item.amount}
                          onChange={updateIncome(item.id, 'amount')}
                          inputMode="decimal"
                          placeholder="e.g. 2,800"
                          className="sm:w-36"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeIncomeRow(item.id)}
                          className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                        >
                          <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addIncomeRow}>
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add income line
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Categories</h2>
                    {categoryItems.map((item) => (
                      <div key={item.id} className="flex flex-col gap-3 sm:grid sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-center sm:gap-2">
                        <Input
                          value={item.name}
                          onChange={updateCategory(item.id, 'name')}
                          placeholder="e.g. Rent & utilities"
                        />
                        <Input
                          value={item.planned}
                          onChange={updateCategory(item.id, 'planned')}
                          inputMode="decimal"
                          placeholder="Planned"
                          className="sm:w-32"
                        />
                        <Input
                          value={item.actual}
                          onChange={updateCategory(item.id, 'actual')}
                          inputMode="decimal"
                          placeholder="Actual"
                          className="sm:w-32"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeCategoryRow(item.id)}
                          className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                        >
                          <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" onClick={addCategoryRow}>
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add category
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate zero-based budget
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
                    Enter income and allocations, then press
                    <span className="font-semibold"> Calculate zero-based budget</span> to confirm that every
                    pound has a job.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Budget balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Total income</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.incomeTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Planned allocations</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.plannedTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Unassigned balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.unassigned)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Planned vs actual variance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.variance)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="zero-based-budget-calculation"
                          title="Zero-Based Budgeting Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Category overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      {results.rows.map((row) => (
                        <div key={row.id} className="flex items-center justify-between">
                          <span>{row.name}</span>
                          <span>
                            {currencyFormatter.format(row.planned)} planned · {currencyFormatter.format(row.actual)} actual
                          </span>
                        </div>
                      ))}
                      <p>
                        Any positive unassigned balance should be allocated to savings, debt, or a new
                        category so that income minus allocations returns to zero.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Planned allocation mix
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
                        <ResultBreakdownChart data={plannedChart} title="Planned allocations" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Actual spending mix
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
                        <ResultBreakdownChart data={actualChart} title="Actual spending" />
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
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
