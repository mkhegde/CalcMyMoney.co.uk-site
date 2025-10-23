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
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  Wallet,
  PieChart,
  CalendarClock,
  ListChecks,
  PlusCircle,
  Trash2,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/subscription-cost-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/subscription-cost-calculator';
const pageTitle = 'Subscription Cost Calculator UK | Manage Recurring Bills';
const metaDescription =
  'Audit direct debits, compare annual versus monthly billing, and project price rises with our UK subscription cost calculator.';
const keywords = getMappedKeywords('Subscription Cost Calculator');

const faqItems = [
  {
    question: 'How do I compare monthly versus annual subscription pricing?',
    answer:
      'Enter the cost and billing cycle for each service. The subscription cost calculator converts everything into monthly and annual totals so you can compare like-for-like before renewing a contract.',
  },
  {
    question: 'Can I factor UK price rises and loyalty offers into the plan?',
    answer:
      'Yes. Adjust the annual price rise field to mirror contract increases or introductory deals ending. The projection shows the next three years so you can negotiate or cancel in plenty of time.',
  },
  {
    question: 'What categories should I include in my audit?',
    answer:
      'List entertainment, mobile, broadband, software, insurance, and any small direct debits. Capturing every recurring charge keeps your budget realistic and highlights quick wins to cut waste.',
  },
];

const emotionalMessage =
  'Every unused subscription is money that could fuel your goals. Track the recurring costs, decide what truly matters, and reclaim calm in your monthly budget.';
const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const defaultSubscriptions = [
  { id: 'subscription-1', name: 'Streaming service', cost: '12.99', billingCycle: 'monthly' },
  { id: 'subscription-2', name: 'Gym membership', cost: '38', billingCycle: 'monthly' },
  { id: 'subscription-3', name: 'Cloud storage', cost: '119', billingCycle: 'annual' },
  { id: 'subscription-4', name: 'Music app', cost: '9.99', billingCycle: 'monthly' },
];

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateSubscriptionTotals = (subscriptions, annualIncreaseInput) => {
  const increasePercent = Math.max(parseNumber(annualIncreaseInput), 0);
  const increaseRate = increasePercent / 100;

  const mapped = subscriptions
    .map((subscription, index) => {
      const cost = Math.max(parseNumber(subscription.cost), 0);
      const name = subscription.name?.trim() || `Subscription ${index + 1}`;
      const billingCycle = subscription.billingCycle === 'annual' ? 'annual' : 'monthly';
      const monthlyCost = billingCycle === 'annual' ? cost / 12 : cost;
      const annualCost = billingCycle === 'annual' ? cost : cost * 12;
      const projectedYearTwo = annualCost * (1 + increaseRate);
      const projectedYearThree = projectedYearTwo * (1 + increaseRate);

      return {
        ...subscription,
        name,
        billingCycle,
        cost,
        monthlyCost,
        annualCost,
        projectedYearTwo,
        projectedYearThree,
      };
    })
    .filter((item) => item.monthlyCost > 0 || item.annualCost > 0);

  const monthlyTotal = mapped.reduce((sum, item) => sum + item.monthlyCost, 0);
  const annualTotal = mapped.reduce((sum, item) => sum + item.annualCost, 0);
  const weeklyTotal = annualTotal / 52;

  const projectedTotals = {
    yearOne: annualTotal,
    yearTwo: annualTotal * (1 + increaseRate),
    yearThree: annualTotal * (1 + increaseRate) * (1 + increaseRate),
  };

  const sortedByAnnual = [...mapped].sort((a, b) => b.annualCost - a.annualCost);
  const topSubscriptions = sortedByAnnual.slice(0, 3);
  const averageMonthlyCost = mapped.length > 0 ? monthlyTotal / mapped.length : 0;

  return {
    mapped,
    increasePercent,
    increaseRate,
    monthlyTotal,
    annualTotal,
    weeklyTotal,
    projectedTotals,
    topSubscriptions,
    averageMonthlyCost,
    activeCount: mapped.length,
  };
};

const buildCsvData = (results, annualIncreaseInput) => {
  if (!results) return null;

  const rows = [
    ['Input', 'Value'],
    ['Annual price rise (%)', annualIncreaseInput],
    ['Active subscriptions', `${results.activeCount}`],
    [],
    ['Summary', 'Value'],
    ['Monthly total (£)', currencyFormatter.format(results.monthlyTotal)],
    ['Annual total (£)', currencyFormatter.format(results.annualTotal)],
    ['Average monthly per subscription (£)', currencyFormatter.format(results.averageMonthlyCost)],
    ['Weekly equivalent (£)', currencyFormatter.format(results.weeklyTotal)],
    ['Year two projection (£)', currencyFormatter.format(results.projectedTotals.yearTwo)],
    ['Year three projection (£)', currencyFormatter.format(results.projectedTotals.yearThree)],
  ];

  if (Array.isArray(results.mapped) && results.mapped.length) {
    rows.push([], ['Subscription breakdown', 'Monthly (£)', 'Annual (£)']);
    results.mapped.forEach((item) => {
      rows.push([
        item.name,
        currencyFormatter.format(item.monthlyCost),
        currencyFormatter.format(item.annualCost),
      ]);
    });
  }

  return rows;
};

const buildChartData = (results) => {
  if (!results || !Array.isArray(results.mapped)) return [];
  return results.mapped.map((item) => ({
    name: item.name,
    value: item.monthlyCost,
  }));
};

export default function SubscriptionCostCalculatorPage() {
  const [subscriptions, setSubscriptions] = useState(defaultSubscriptions);
  const [annualIncrease, setAnnualIncrease] = useState('4');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Subscription Cost Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Subscription Cost Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const resetResults = useCallback(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const handleSubscriptionChange = useCallback(
    (id, field) => (event) => {
      const { value } = event.target;
      setSubscriptions((prev) =>
        prev.map((subscription) =>
          subscription.id === id ? { ...subscription, [field]: value } : subscription
        )
      );
      resetResults();
    },
    [resetResults]
  );

  const handleSubscriptionRemoval = useCallback(
    (id) => () => {
      setSubscriptions((prev) => prev.filter((subscription) => subscription.id !== id));
      resetResults();
    },
    [resetResults]
  );

  const handleAddSubscription = useCallback(() => {
    setSubscriptions((prev) => [
      ...prev,
      {
        id: `subscription-${Date.now()}`,
        name: 'New subscription',
        cost: '0',
        billingCycle: 'monthly',
      },
    ]);
    resetResults();
  }, [resetResults]);

  const handleIncreaseChange = useCallback(
    (event) => {
      setAnnualIncrease(event.target.value);
      resetResults();
    },
    [resetResults]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateSubscriptionTotals(subscriptions, annualIncrease);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, annualIncrease));
    },
    [annualIncrease, subscriptions]
  );

  const handleReset = useCallback(() => {
    setSubscriptions(defaultSubscriptions);
    setAnnualIncrease('4');
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Subscription Cost Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Catalogue every direct debit, compare billing cycles, and forecast contract increases so
              your subscriptions only support what you truly use.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Subscription details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {subscriptions.map((subscription, index) => (
                      <div
                        key={subscription.id}
                        className="rounded-lg border border-slate-200 p-4 shadow-sm dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            Subscription {index + 1}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleSubscriptionRemoval(subscription.id)}
                            className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                          >
                            <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                            Remove
                          </Button>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`${subscription.id}-name`}>Name</Label>
                            <Input
                              id={`${subscription.id}-name`}
                              value={subscription.name}
                              onChange={handleSubscriptionChange(subscription.id, 'name')}
                              placeholder="e.g. Netflix"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${subscription.id}-cost`}>Price (£)</Label>
                            <Input
                              id={`${subscription.id}-cost`}
                              inputMode="decimal"
                              value={subscription.cost}
                              onChange={handleSubscriptionChange(subscription.id, 'cost')}
                              placeholder="e.g. 12.99"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${subscription.id}-cycle`}>Billing cycle</Label>
                            <select
                              id={`${subscription.id}-cycle`}
                              value={subscription.billingCycle}
                              onChange={handleSubscriptionChange(subscription.id, 'billingCycle')}
                              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            >
                              <option value="monthly">Monthly</option>
                              <option value="annual">Annual</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" onClick={handleAddSubscription} className="flex-1">
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add subscription
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset to example set
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annualIncrease">Expected annual price rise (%)</Label>
                    <Input
                      id="annualIncrease"
                      inputMode="decimal"
                      value={annualIncrease}
                      onChange={handleIncreaseChange}
                      placeholder="e.g. 4"
                    />
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Use the average uplift from recent renewals or the inflation-linked increase quoted
                      in your contract.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate subscription totals
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
                    Enter each subscription, select the billing cycle, and press
                    <span className="font-semibold"> Calculate subscription totals</span> to reveal monthly,
                    annual, and projected spending.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Spending summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Monthly total</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Annual total</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Weekly equivalent</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Average per service</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.averageMonthlyCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Annual price rise assumption</p>
                        <p className="text-2xl font-semibold">{numberFormatter.format(results.increasePercent)}%</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="subscription-cost-calculation"
                          title="Subscription Cost Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarClock className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Projected spending
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Year one</span>
                        <span>{currencyFormatter.format(results.projectedTotals.yearOne)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Year two (with increases)</span>
                        <span>{currencyFormatter.format(results.projectedTotals.yearTwo)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Year three (with increases)</span>
                        <span>{currencyFormatter.format(results.projectedTotals.yearThree)}</span>
                      </div>
                      {results.topSubscriptions.length > 0 && (
                        <div className="space-y-2">
                          <p className="font-medium text-slate-700 dark:text-slate-200">Top cost drivers</p>
                          <ul className="list-disc space-y-1 pl-5">
                            {results.topSubscriptions.map((item) => (
                              <li key={item.id}>
                                {item.name}: {currencyFormatter.format(item.annualCost)} per year
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Monthly cost mix
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
                        <ResultBreakdownChart data={chartData} title="Monthly subscription breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Next steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Review the top three cost drivers and decide whether to negotiate, downgrade, or
                        cancel. Redirect any savings to your emergency fund or a goal in the savings
                        planner.
                      </p>
                      <p>
                        Use the export options to keep your spreadsheet in sync and schedule a monthly
                        reminder to repeat the audit—UK providers often adjust fees with little notice.
                      </p>
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
