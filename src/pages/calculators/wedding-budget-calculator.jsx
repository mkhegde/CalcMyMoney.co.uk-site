import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, ClipboardList, PiggyBank, CalendarDays, Gift } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'wedding budget calculator',
  'budget planner',
  'event cost calculator',
  'expense tracker',
];

const metaDescription =
  'Use our wedding budget calculator, budget planner, event cost calculator, and expense tracker to organise costs, deposits, and final payments.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/wedding-budget-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultCategories = [
  { id: 'venue', name: 'Venue & ceremony', estimated: 8500, committed: 3000 },
  { id: 'food', name: 'Food & drink', estimated: 5000, committed: 1500 },
  { id: 'attire', name: 'Attire & beauty', estimated: 2200, committed: 600 },
  { id: 'decor', name: 'Decor & styling', estimated: 1800, committed: 400 },
  { id: 'photo', name: 'Photography & video', estimated: 2500, committed: 500 },
  { id: 'music', name: 'Entertainment', estimated: 1200, committed: 250 },
];

const weddingFaqs = [
  {
    question: 'How do I keep the wedding budget on track?',
    answer:
      'Set a total target, assign percentages to each category, then review commitments weekly. The wedding budget calculator highlights remaining balances so you can steer spending.',
  },
  {
    question: 'What deposits should I track?',
    answer:
      'Record supplier deposits, milestone payments, and final balances. The event cost calculator view shows committed versus estimated amounts to avoid surprises.',
  },
  {
    question: 'Can this double as an expense tracker after the big day?',
    answer:
      'Yes. Use it to reconcile invoices, manage gift funds, and close out any outstanding balances. Export your totals into a shared wedding expense tracker spreadsheet.',
  },
];

const calculateBudget = (categories) => {
  const rows = categories.map((category) => {
    const estimated = Math.max(Number(category.estimated) || 0, 0);
    const committed = Math.min(Math.max(Number(category.committed) || 0, 0), estimated);
    const remaining = Math.max(estimated - committed, 0);
    return { ...category, estimated, committed, remaining };
  });

  const totals = rows.reduce(
    (acc, row) => {
      acc.estimated += row.estimated;
      acc.committed += row.committed;
      acc.remaining += row.remaining;
      return acc;
    },
    { estimated: 0, committed: 0, remaining: 0 }
  );

  return { rows, totals };
};

export default function WeddingBudgetCalculatorPage() {
  const [categories, setCategories] = useState(defaultCategories);
  const [overallBudget, setOverallBudget] = useState(25000);
  const [giftContributions, setGiftContributions] = useState(3500);

  const budget = useMemo(() => calculateBudget(categories), [categories]);

  const addCategory = () => {
    setCategories((prev) => [
      ...prev,
      {
        id: `category-${prev.length + 1}`,
        name: 'New item',
        estimated: 0,
        committed: 0,
      },
    ]);
  };

  const updateCategory = (id, field, value) => {
    setCategories((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const removeCategory = (id) => {
    setCategories((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setCategories(defaultCategories);
    setOverallBudget(25000);
    setGiftContributions(3500);
  };

  const totalFunded = budget.totals.committed + Math.max(Number(giftContributions) || 0, 0);
  const budgetGap = Math.max(overallBudget - totalFunded, 0);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Wedding Budget Calculator | Budget Planner</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Wedding Budget Calculator | Budget Planner" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wedding Budget Calculator | Budget Planner" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Wedding Budget Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan your day with a wedding budget calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Wedding Budget Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Map supplier costs, deposits, and gift contributions with a single wedding budget planner
            that keeps the celebration on track.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <ClipboardList className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Budget planner categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <Input
                        value={category.name}
                        onChange={(event) => updateCategory(category.id, 'name', event.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCategory(category.id)}
                        className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`${category.id}-estimated`}>Estimated (£)</Label>
                        <Input
                          id={`${category.id}-estimated`}
                          type="number"
                          min="0"
                          step="50"
                          value={category.estimated}
                          onChange={(event) =>
                            updateCategory(category.id, 'estimated', Number(event.target.value))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${category.id}-committed`}>Deposits & paid (£)</Label>
                        <Input
                          id={`${category.id}-committed`}
                          type="number"
                          min="0"
                          step="50"
                          value={category.committed}
                          onChange={(event) =>
                            updateCategory(category.id, 'committed', Number(event.target.value))
                          }
                        />
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      Remaining {currencyFormatter.format(Math.max(category.estimated - category.committed, 0))}
                    </p>
                  </div>
                ))}
                <Button onClick={addCategory} className="w-full">
                  Add category
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Overall wedding budget
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="overallBudget">Total budget (£)</Label>
                    <Input
                      id="overallBudget"
                      type="number"
                      min="0"
                      step="500"
                      value={overallBudget}
                      onChange={(event) => setOverallBudget(Number(event.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="giftContributions">Gift contributions / savings (£)</Label>
                    <Input
                      id="giftContributions"
                      type="number"
                      min="0"
                      step="100"
                      value={giftContributions}
                      onChange={(event) => setGiftContributions(Number(event.target.value) || 0)}
                    />
                  </div>
                </div>
                <Button variant="outline" onClick={resetAll} className="w-full">
                  Reset to example wedding
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Heart className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Wedding budget planner summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Estimated total</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(budget.totals.estimated)}
                    </p>
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Deposits & paid</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(budget.totals.committed)}
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Remaining to allocate</span>
                    <span>{currencyFormatter.format(budget.totals.remaining)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Total funded (inc. gifts)</span>
                    <span>{currencyFormatter.format(totalFunded)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Budget gap</span>
                    <span>{currencyFormatter.format(budgetGap)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Event cost calculator checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {budget.rows.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Add categories to build your personalised wedding checklist.
                  </p>
                )}
                {budget.rows.map((row) => (
                  <div
                    key={row.id}
                    className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-4"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">{row.name}</span>
                    <span className="text-right text-slate-600 dark:text-slate-300">Estimated {currencyFormatter.format(row.estimated)}</span>
                    <span className="text-right text-slate-600 dark:text-slate-300">Committed {currencyFormatter.format(row.committed)}</span>
                    <span className="text-right text-slate-600 dark:text-slate-300">Remaining {currencyFormatter.format(row.remaining)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading as="h2" size="h2" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Expense tracker habits make planning easier
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Update the expense tracker each time you pay a supplier or receive a gift. Keep receipt
                numbers and contact details handy for quick reference.
              </p>
              <Heading as="h3" size="h3" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Budget planner routines keep stress low
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Schedule a weekly check-in with your partner. The budget planner view shows upcoming
                payments so you can delegate tasks and stay calm.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <Gift className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Need wedding planning tips?
                </CardTitle>
              </CardHeader>
              <FAQSection faqs={weddingFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
