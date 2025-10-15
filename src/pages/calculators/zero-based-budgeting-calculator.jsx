import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ClipboardCheck, PiggyBank, Target } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'zero based budgeting',
  'zbb',
  'budget planner',
  'budget calculator',
  'budgeting software',
  'budgeting tool',
  'cash budgeting',
];

const metaDescription =
  'Use our zero based budgeting calculator and budget planner workflow to assign every pound, operate a budget calculator, and keep cash budgeting aligned with your goals.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/zero-based-budgeting-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultIncome = [
  { id: 'paycheck', name: 'Paycheck', amount: 2800 },
  { id: 'side-hustle', name: 'Side hustle', amount: 350 },
];

const defaultCategories = [
  { id: 'rent', name: 'Rent & utilities', planned: 1200, actual: 1180 },
  { id: 'food', name: 'Food & groceries', planned: 320, actual: 295 },
  { id: 'transport', name: 'Transport', planned: 110, actual: 104 },
  { id: 'debt', name: 'Debt payments', planned: 250, actual: 250 },
  { id: 'fun', name: 'Fun money', planned: 160, actual: 148 },
  { id: 'sinking', name: 'Sinking funds', planned: 300, actual: 0 },
];

const zeroBasedFaqs = [
  {
    question: 'How does zero based budgeting differ from traditional budgets?',
    answer:
      'Zero based budgeting assigns every pound of income to a category—spending, saving, or debt—so the plan equals zero left over. Traditional budgets often leave a residual amount that can be spent without intention.',
  },
  {
    question: 'Do I need specialist budgeting software?',
    answer:
      'No. This budgeting tool tracks the same logic many budgeting software packages use. Update the plan weekly, copy the numbers into your spreadsheet, or pair with an app if you prefer automation.',
  },
  {
    question: 'How do I handle irregular expenses?',
    answer:
      'Create a sinking fund category and contribute a weekly or monthly amount. When the expense arrives, move funds out of the sinking pot so your zero based budgeting plan stays balanced.',
  },
];

const calculateZeroBalance = (incomeItems, categoryItems) => {
  const totalIncome = incomeItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalPlanned = categoryItems.reduce((sum, item) => sum + (Number(item.planned) || 0), 0);
  const totalActual = categoryItems.reduce((sum, item) => sum + (Number(item.actual) || 0), 0);
  const unassigned = totalIncome - totalPlanned;
  const variance = totalPlanned - totalActual;

  return {
    totalIncome,
    totalPlanned,
    totalActual,
    unassigned,
    variance,
  };
};

export default function ZeroBasedBudgetingCalculatorPage() {
  const [incomeItems, setIncomeItems] = useState(defaultIncome);
  const [categoryItems, setCategoryItems] = useState(defaultCategories);
  const [goalAmount, setGoalAmount] = useState(500);

  const totals = useMemo(
    () => calculateZeroBalance(incomeItems, categoryItems),
    [incomeItems, categoryItems]
  );

  const updateIncome = (id, field, value) => {
    setIncomeItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const updateCategory = (id, field, value) => {
    setCategoryItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const addIncomeRow = () => {
    const id = `income-${incomeItems.length + 1}`;
    setIncomeItems((items) => [...items, { id, name: 'New income', amount: 0 }]);
  };

  const addCategoryRow = () => {
    const id = `category-${categoryItems.length + 1}`;
    setCategoryItems((items) => [...items, { id, name: 'New category', planned: 0, actual: 0 }]);
  };

  const removeIncomeRow = (id) => {
    setIncomeItems((items) => items.filter((item) => item.id !== id));
  };

  const removeCategoryRow = (id) => {
    setCategoryItems((items) => items.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setIncomeItems(defaultIncome);
    setCategoryItems(defaultCategories);
    setGoalAmount(500);
  };

  const goalProgress = goalAmount > 0 ? Math.min(totals.unassigned / goalAmount, 1) : 0;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Zero Based Budgeting Calculator | ZBB</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Zero Based Budgeting Calculator | ZBB" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Zero Based Budgeting Calculator | ZBB" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Zero Based Budgeting Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan a budget with zero based budgeting',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Zero Based Budgeting Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Give every pound a job. Build a ZBB plan that balances income, spending, savings, and
            cash budgeting without complex spreadsheets.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Income sources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {incomeItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 md:grid-cols-[1fr_auto_auto] md:items-center"
                  >
                    <Input
                      value={item.name}
                      onChange={(event) => updateIncome(item.id, 'name', event.target.value)}
                    />
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      inputMode="decimal"
                      value={item.amount}
                      onChange={(event) =>
                        updateIncome(item.id, 'amount', Number(event.target.value) || 0)
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIncomeRow(item.id)}
                      className="justify-self-end text-emerald-600 dark:text-emerald-300"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addIncomeRow}>
                  Add income source
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Category allocations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categoryItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
                  >
                    <Input
                      value={item.name}
                      onChange={(event) => updateCategory(item.id, 'name', event.target.value)}
                    />
                    <div className="flex items-center gap-2">
                      <Label className="text-xs uppercase text-slate-500">Planned</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={item.planned}
                        onChange={(event) =>
                          updateCategory(item.id, 'planned', Number(event.target.value) || 0)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs uppercase text-slate-500">Actual</Label>
                      <Input
                        type="number"
                        min="0"
                        step="1"
                        inputMode="decimal"
                        value={item.actual}
                        onChange={(event) =>
                          updateCategory(item.id, 'actual', Number(event.target.value) || 0)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategoryRow(item.id)}
                      className="justify-self-end text-emerald-600 dark:text-emerald-300"
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addCategoryRow}>
                  Add category
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Zero based summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total income</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(totals.totalIncome)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total allocated</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(totals.totalPlanned)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800 md:col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Unassigned balance</p>
                  <p
                    className={`text-2xl font-semibold ${
                      totals.unassigned === 0
                        ? 'text-emerald-600 dark:text-emerald-200'
                        : 'text-rose-600 dark:text-rose-200'
                    }`}
                  >
                    {currencyFormatter.format(totals.unassigned)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your budget is {totals.unassigned === 0 ? 'balanced' : 'not yet zeroed out'}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800 md:col-span-2">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Variance vs actual</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(totals.variance)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Cash budgeting goal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Goal amount</span>
                  <Input
                    className="w-32"
                    type="number"
                    min="0"
                    step="10"
                    inputMode="decimal"
                    value={goalAmount}
                    onChange={(event) => setGoalAmount(Number(event.target.value) || 0)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span>Available this period</span>
                  <span>{currencyFormatter.format(Math.max(totals.unassigned, 0))}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-emerald-200 dark:bg-emerald-900/40">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all dark:bg-emerald-400"
                    style={{ width: `${Math.min(goalProgress * 100, 100)}%` }}
                  />
                </div>
                <p>
                  Assign unallocated funds to your goal until the zero based budgeting rule is met. Once
                  cash budgeting is complete, the plan will show £0 unassigned above.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Budget calculator, budgeting software, and budgeting tool workflow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Export the totals into your favourite budget calculator or budgeting software each week.
                The zero based budgeting view keeps you honest while the budgeting tool ecosystem handles
                receipts, bank feeds, and automations.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Cash budgeting confidence
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Run a quick check-in every payday: update income, adjust category envelopes, and verify
                that unassigned cash equals zero. That simple ritual keeps cash budgeting aligned with the
                zbb philosophy.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={zeroBasedFaqs} />
            </section>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example budget
            </Button>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
