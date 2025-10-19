import React, { useMemo, useState } from 'react';
import { Calculator, Home, ShoppingBasket, Car, PiggyBank, Quote, BookOpen } from 'lucide-react';

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
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart.jsx';

const keywords = [
  'cost of living',
  'cost of living calculator',
  'uk cost of living calculator',
  'city cost of living calculator',
];

const metaDescription =
  'Estimate your monthly and annual UK living costs. Compare housing, utilities, groceries, transport, and lifestyle spending for any city.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/cost-of-living-calculator';
const pagePath = '/calculators/cost-of-living-calculator';
const pageTitle = 'Cost of Living Calculator | UK City Expense Planner';

const faqItems = [
  {
    question: 'What expenses should I include in the cost of living?',
    answer:
      'Add rent or mortgage payments, utilities, food, commuting, insurance, childcare, entertainment, and savings. Adjust the categories to reflect your household.',
  },
  {
    question: 'How do I compare two cities?',
    answer:
      'Run the calculation for each city, adjusting the location multiplier to reflect higher or lower prices. Compare the monthly or annual totals to gauge the salary you need.',
  },
  {
    question: 'How often should I revisit my cost of living?',
    answer:
      'Update the figures whenever you move, receive a pay rise, or your household changes. Reviewing quarterly keeps budgets aligned with inflation.',
  },
];

const emotionalMessage =
  'Knowing your baseline cost of living turns salary negotiations into confident conversations. Plan the numbers so relocation decisions feel deliberate.';

const emotionalQuote = {
  text: 'The question isn’t who is going to let me; it’s who is going to stop me.',
  author: 'Ayn Rand',
};

const categoriesConfig = [
  { key: 'housing', label: 'Housing (rent or mortgage)', icon: Home, defaultValue: '1,200' },
  { key: 'utilities', label: 'Utilities & council tax', icon: Home, defaultValue: '250' },
  { key: 'groceries', label: 'Groceries & essentials', icon: ShoppingBasket, defaultValue: '350' },
  { key: 'transport', label: 'Transport & commuting', icon: Car, defaultValue: '180' },
  { key: 'lifestyle', label: 'Lifestyle & leisure', icon: PiggyBank, defaultValue: '220' },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function CostOfLivingCalculatorPage() {
  const [categoryValues, setCategoryValues] = useState(
    categoriesConfig.reduce(
      (acc, item) => ({
        ...acc,
        [item.key]: item.defaultValue,
      }),
      {}
    )
  );
  const [locationMultiplier, setLocationMultiplier] = useState('0');
  const [householdSize, setHouseholdSize] = useState('1');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Cost of Living Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Cost of Living Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return results.breakdown
      .map((item) => ({
        name: item.label,
        value: item.monthlyCost,
      }))
      .filter((item) => item.value > 0);
  }, [results, hasCalculated]);

  const handleCategoryChange = (key) => (event) => {
    const { value } = event.target;
    setCategoryValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const multiplier = parseNumber(locationMultiplier) / 100;
    const household = Math.max(parseNumber(householdSize), 1);

    const breakdown = categoriesConfig.map((category) => {
      const base = parseNumber(categoryValues[category.key]);
      const adjusted = base * (1 + multiplier);
      return {
        key: category.key,
        label: category.label,
        monthlyCost: adjusted,
      };
    });

    const monthlyTotal = breakdown.reduce((sum, item) => sum + item.monthlyCost, 0);
    const annualTotal = monthlyTotal * 12;
    const perPersonMonthly = monthlyTotal / household;
    const perPersonAnnual = annualTotal / household;

    const computed = {
      breakdown,
      monthlyTotal,
      annualTotal,
      perPersonMonthly,
      perPersonAnnual,
      multiplierPercent: multiplier * 100,
      household,
    };
    setHasCalculated(true);
    setResults(computed);

    const csvRows = [
      ['Category', 'Monthly cost (£)'],
      ...breakdown.map((item) => [item.label, item.monthlyCost]),
      [],
      ['Household members', household],
      ['Location adjustment (%)', multiplier * 100],
      ['Monthly cost', monthlyTotal],
      ['Annual cost', annualTotal],
      ['Per-person monthly cost', perPersonMonthly],
      ['Per-person annual cost', perPersonAnnual],
    ];
    setCsvData(csvRows);
  };

  const handleReset = () => {
    setCategoryValues(
      categoriesConfig.reduce(
        (acc, item) => ({
          ...acc,
          [item.key]: item.defaultValue,
        }),
        {}
      )
    );
    setLocationMultiplier('0');
    setHouseholdSize('1');
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Cost of Living Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Capture the cost of housing, bills, transport, food, and lifestyle to understand the salary you need in any UK location.
            </p>
          </header>

          <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Budget for the lifestyle you want
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  Monthly expense inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {categoriesConfig.map((category) => (
                      <div key={category.key} className="space-y-2">
                        <Label htmlFor={category.key}>{category.label}</Label>
                        <Input
                          id={category.key}
                          inputMode="decimal"
                          value={categoryValues[category.key]}
                          onChange={handleCategoryChange(category.key)}
                          placeholder={`e.g. ${category.defaultValue}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="locationMultiplier">Location adjustment (%)</Label>
                      <Input
                        id="locationMultiplier"
                        inputMode="decimal"
                        value={locationMultiplier}
                        onChange={(event) => setLocationMultiplier(event.target.value)}
                        placeholder="e.g. 10 for London premium"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Increase or decrease costs to reflect regional price differences.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="householdSize">Household size</Label>
                      <Input
                        id="householdSize"
                        inputMode="numeric"
                        value={householdSize}
                        onChange={(event) => setHouseholdSize(event.target.value)}
                        placeholder="e.g. 2"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Used to calculate per-person cost of living.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate cost of living
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
                    Enter your monthly costs and press{' '}
                    <span className="font-semibold">Calculate cost of living</span> to see total, per-person, and annual figures.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-200" aria-hidden="true" />
                        Living cost summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Monthly cost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Annual cost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Per-person monthly</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.perPersonMonthly)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Per-person annual</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.perPersonAnnual)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="cost-of-living-results"
                          title="Cost of living calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {chartData.length > 0 && (
                    <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <PiggyBank className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                          Spend breakdown
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResultBreakdownChart data={chartData} title="Monthly cost allocation" />
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Keep expenses realistic
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare these costs with your take-home pay and savings goals so you can adjust budgets ahead of time rather than reacting to shortfalls.
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
