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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Heart, ClipboardList, PiggyBank, Gift, Trash2, PlusCircle, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/wedding-budget-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/wedding-budget-calculator';
const pageTitle = 'Wedding Budget Calculator UK | Plan Your Celebration';
const metaDescription =
  'Plan venue, catering, and supplier costs with the UK wedding budget calculator. Track deposits, committed spend, and gift contributions in one place.';
const keywords = getMappedKeywords('Wedding Budget Calculator');

const faqItems = [
  {
    question: 'How should we split our wedding budget?',
    answer:
      'List the biggest categories first—venue, catering, attire, and photography. Allocate a target to each, then update the committed column as you pay deposits. The calculator highlights the remaining balance.',
  },
  {
    question: 'Can we track gift contributions?',
    answer:
      'Yes. Add monetary gifts or savings to the gift contributions field. The results show how much of the wedding is already funded and what still needs covering.',
  },
  {
    question: 'How often should we review the plan?',
    answer:
      'Check in monthly or after each supplier meeting. Export the results so everyone involved stays aligned on the remaining budget.',
  },
];

const emotionalMessage =
  'A clear budget lets you focus on the celebration, not the spreadsheets. Track every supplier, celebrate each milestone payment, and protect the day you are dreaming of.';
const emotionalQuote = {
  text: 'Love recognises no barriers.',
  author: 'Maya Angelou',
};

const directoryLinks = [
  {
    url: '/#budgeting',
    label: 'Explore budgeting calculators',
    description: 'Balance your wedding plans with everyday budgets and savings goals.',
  },
  {
    url: '/calculators/savings-goal-calculator',
    label: 'Savings Goal Calculator',
    description: 'Work out how much to save each month for the big day.',
  },
  {
    url: '/calculators/travel-budget-calculator',
    label: 'Travel Budget Calculator',
    description: 'Plan your honeymoon budget alongside the main celebration.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultCategories = [
  { id: 'venue', name: 'Venue & ceremony', estimated: '8,500', committed: '3,000' },
  { id: 'catering', name: 'Food & drink', estimated: '5,000', committed: '1,500' },
  { id: 'attire', name: 'Attire & beauty', estimated: '2,200', committed: '600' },
  { id: 'decor', name: 'Decor & styling', estimated: '1,800', committed: '400' },
  { id: 'photo', name: 'Photography & video', estimated: '2,500', committed: '500' },
  { id: 'music', name: 'Entertainment', estimated: '1,200', committed: '250' },
];

const defaultInputs = {
  overallBudget: '25,000',
  giftContributions: '3,500',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateWeddingBudget = (categories, overallBudgetInput, giftContributionsInput) => {
  const rows = categories.map((category, index) => {
    const estimated = Math.max(parseNumber(category.estimated), 0);
    const committed = Math.max(Math.min(parseNumber(category.committed), estimated), 0);
    const remaining = Math.max(estimated - committed, 0);
    const name = category.name?.trim() || `Category ${index + 1}`;
    return { ...category, name, estimated, committed, remaining };
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

  const overallBudget = Math.max(parseNumber(overallBudgetInput), totals.estimated);
  const giftContributions = Math.max(parseNumber(giftContributionsInput), 0);
  const funded = totals.committed + giftContributions;
  const fundingGap = Math.max(overallBudget - funded, 0);

  return { rows, totals, overallBudget, giftContributions, funded, fundingGap };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  const rows = [
    ['Input', 'Value'],
    ['Overall budget (£)', inputs.overallBudget],
    ['Gift contributions (£)', inputs.giftContributions],
    [],
    ['Summary', 'Value'],
    ['Estimated spend (£)', currencyFormatter.format(results.totals.estimated)],
    ['Committed spend (£)', currencyFormatter.format(results.totals.committed)],
    ['Remaining (£)', currencyFormatter.format(results.totals.remaining)],
    ['Total funded (£)', currencyFormatter.format(results.funded)],
    ['Funding gap (£)', currencyFormatter.format(results.fundingGap)],
  ];

  if (results.rows.length) {
    rows.push([], ['Category', 'Estimated (£)', 'Committed (£)', 'Remaining (£)']);
    results.rows.forEach((row) => {
      rows.push([
        row.name,
        currencyFormatter.format(row.estimated),
        currencyFormatter.format(row.committed),
        currencyFormatter.format(row.remaining),
      ]);
    });
  }

  return rows;
};

const buildChartData = (results) => {
  if (!results) return [];
  return results.rows.map((row) => ({ name: row.name, value: row.estimated }));
};

export default function WeddingBudgetCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [categories, setCategories] = useState(defaultCategories);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Wedding Budget Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Wedding Budget Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const resetResults = useCallback(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
      resetResults();
    },
    [resetResults]
  );

  const handleCategoryChange = useCallback(
    (id, field) => (event) => {
      const { value } = event.target;
      setCategories((prev) =>
        prev.map((category) => (category.id === id ? { ...category, [field]: value } : category))
      );
      resetResults();
    },
    [resetResults]
  );

  const handleCategoryRemoval = useCallback(
    (id) => () => {
      setCategories((prev) => prev.filter((category) => category.id !== id));
      resetResults();
    },
    [resetResults]
  );

  const handleAddCategory = useCallback(() => {
    setCategories((prev) => [
      ...prev,
      { id: `category-${Date.now()}`, name: 'New category', estimated: '0', committed: '0' },
    ]);
    resetResults();
  }, [resetResults]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateWeddingBudget(categories, inputs.overallBudget, inputs.giftContributions);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [categories, inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setCategories(defaultCategories);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results), [results]);

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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Heart className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Wedding Budget Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Track every supplier, monitor deposits, and stay on top of your wedding budget with one
              clear dashboard.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Gift className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-rose-600 dark:text-rose-300"
            borderColor="border-rose-200 dark:border-rose-800/60"
            bgColor="bg-rose-50/70 dark:bg-rose-900/40"
            textColor="text-rose-900 dark:text-rose-50"
            footerColor="text-rose-700 dark:text-rose-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
            <Card className="border border-rose-200 bg-white dark:border-rose-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardList className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Wedding budget inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="overallBudget">Overall budget (£)</Label>
                      <Input
                        id="overallBudget"
                        inputMode="decimal"
                        value={inputs.overallBudget}
                        onChange={handleInputChange('overallBudget')}
                        placeholder="e.g. 25,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="giftContributions">Gift contributions / savings (£)</Label>
                      <Input
                        id="giftContributions"
                        inputMode="decimal"
                        value={inputs.giftContributions}
                        onChange={handleInputChange('giftContributions')}
                        placeholder="e.g. 3,500"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="rounded-lg border border-slate-200 p-4 shadow-sm dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Input
                            value={category.name}
                            onChange={handleCategoryChange(category.id, 'name')}
                            placeholder="e.g. Venue"
                            className="text-sm"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleCategoryRemoval(category.id)}
                            className="text-rose-700 hover:text-rose-800 dark:text-rose-200"
                          >
                            <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                            Remove
                          </Button>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${category.id}-estimated`}>Estimated (£)</Label>
                            <Input
                              id={`${category.id}-estimated`}
                              inputMode="decimal"
                              value={category.estimated}
                              onChange={handleCategoryChange(category.id, 'estimated')}
                              placeholder="e.g. 2,500"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${category.id}-committed`}>Committed (£)</Label>
                            <Input
                              id={`${category.id}-committed`}
                              inputMode="decimal"
                              value={category.committed}
                              onChange={handleCategoryChange(category.id, 'committed')}
                              placeholder="e.g. 1,000"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" onClick={handleAddCategory} className="flex-1">
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add category
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset to example plan
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate wedding budget
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Clear results
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Add your categories, then press
                    <span className="font-semibold"> Calculate wedding budget</span> to see totals and the
                    remaining funding gap.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-rose-600 dark:text-rose-200" aria-hidden="true" />
                        Budget summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-100">Estimated spend</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totals.estimated)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-100">Committed so far</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totals.committed)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-100">Gift & savings</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.giftContributions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-100">Funding gap</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.fundingGap)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="wedding-budget-calculation"
                          title="Wedding Budget Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ClipboardList className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Category detail
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      {results.rows.map((row) => (
                        <div key={row.id} className="flex items-center justify-between">
                          <span>{row.name}</span>
                          <span>
                            {currencyFormatter.format(row.committed)} committed ·{' '}
                            {currencyFormatter.format(row.remaining)} remaining
                          </span>
                        </div>
                      ))}
                      <p>
                        Overall budget: {currencyFormatter.format(results.overallBudget)} · Remaining funds:
                        {currencyFormatter.format(results.totals.remaining)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Estimated spend mix
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
                        <ResultBreakdownChart data={chartData} title="Wedding budget breakdown" />
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
