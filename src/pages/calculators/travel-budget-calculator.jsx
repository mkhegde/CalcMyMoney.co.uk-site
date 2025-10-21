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
import { Plane, Wallet, Globe, Compass, PlusCircle, Trash2, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/travel-budget-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/travel-budget-calculator';
const pageTitle = 'Travel Budget Calculator UK | Plan Trip Costs';
const metaDescription =
  'Plan UK and overseas trips with the travel budget calculator. Estimate flights, accommodation, daily spending, and contingency buffers for every traveller.';
const keywords = getMappedKeywords('Travel Budget Calculator');

const faqItems = [
  {
    question: 'How should I build my travel budget?',
    answer:
      'Start with fixed costs like flights and accommodation, then add flexible categories such as food, excursions, and local transport. The calculator converts each entry into a total so you can check affordability quickly.',
  },
  {
    question: 'What contingency should I allow?',
    answer:
      'Add a buffer for surprises such as baggage fees, exchange-rate swings, or last-minute tours. The contingency field increases the total by your chosen percentage, which you can tweak before booking.',
  },
  {
    question: 'Can I use this while I am travelling?',
    answer:
      'Yes. Update the amounts with what you actually spend each day to keep a running comparison between planned and committed costs.',
  },
];

const emotionalMessage =
  'A detailed travel budget lets you enjoy the adventure without worrying about overspending. Plan ahead, capture every category, and relax once you take off.';
const emotionalQuote = {
  text: 'Live with no excuses and travel with no regrets.',
  author: 'Oscar Wilde',
};

const directoryLinks = [
  {
    url: '/#budgeting',
    label: 'See all budgeting calculators',
    description: 'Balance holiday costs with your day-to-day spending plans and savings goals.',
  },
  {
    url: '/calculators/savings-goal-calculator',
    label: 'Savings Goal Calculator',
    description: 'Work out how much to save each month to fund your next getaway.',
  },
  {
    url: '/calculators/subscription-cost-calculator',
    label: 'Subscription Cost Calculator',
    description: 'Trim unused subscriptions to free up cash for travel treats.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultItems = [
  { id: 'flights', name: 'Flights', amount: '220', type: 'perPerson' },
  { id: 'accommodation', name: 'Accommodation', amount: '140', type: 'perNight' },
  { id: 'food', name: 'Daily food & drinks', amount: '38', type: 'perPersonPerNight' },
  { id: 'activities', name: 'Activities & tours', amount: '22', type: 'perPersonPerNight' },
  { id: 'insurance', name: 'Travel insurance', amount: '35', type: 'perPerson' },
  { id: 'transfers', name: 'Airport & local transfers', amount: '140', type: 'perTrip' },
];

const typeOptions = [
  { value: 'perPerson', label: 'Per traveller' },
  { value: 'perPersonPerNight', label: 'Per traveller per night' },
  { value: 'perNight', label: 'Per night' },
  { value: 'perTrip', label: 'Whole trip' },
];

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateItemTotal = (item, travellers, nights) => {
  const amount = Math.max(parseNumber(item.amount), 0);
  const safeTravellers = Math.max(travellers, 0);
  const safeNights = Math.max(nights, 0);

  switch (item.type) {
    case 'perPerson':
      return amount * safeTravellers;
    case 'perPersonPerNight':
      return amount * safeTravellers * safeNights;
    case 'perNight':
      return amount * safeNights;
    case 'perTrip':
    default:
      return amount;
  }
};

const computeTravelBudget = (items, travellersInput, nightsInput, contingencyInput) => {
  const travellers = Math.max(parseNumber(travellersInput), 1);
  const nights = Math.max(parseNumber(nightsInput), 1);
  const contingencyPercent = Math.max(parseNumber(contingencyInput), 0);

  const enrichedItems = items.map((item, index) => {
    const name = item.name?.trim() || `Item ${index + 1}`;
    const type = typeOptions.some((option) => option.value === item.type) ? item.type : 'perTrip';
    const total = calculateItemTotal({ ...item, name, type }, travellers, nights);
    return { ...item, name, type, total };
  });

  const baseTotal = enrichedItems.reduce((sum, item) => sum + item.total, 0);
  const contingencyAmount = (baseTotal * contingencyPercent) / 100;
  const grandTotal = baseTotal + contingencyAmount;
  const perTraveller = grandTotal / travellers;
  const perNight = grandTotal / nights;

  return {
    enrichedItems,
    travellers,
    nights,
    contingencyPercent,
    baseTotal,
    contingencyAmount,
    grandTotal,
    perTraveller,
    perNight,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  const rows = [
    ['Input', 'Value'],
    ['Travellers', inputs.travellers],
    ['Nights', inputs.nights],
    ['Contingency (%)', inputs.contingencyPercent],
    [],
    ['Summary', 'Value'],
    ['Base total (£)', currencyFormatter.format(results.baseTotal)],
    ['Contingency (£)', currencyFormatter.format(results.contingencyAmount)],
    ['Grand total (£)', currencyFormatter.format(results.grandTotal)],
    ['Per traveller (£)', currencyFormatter.format(results.perTraveller)],
    ['Per night (£)', currencyFormatter.format(results.perNight)],
  ];

  if (results.enrichedItems.length) {
    rows.push([], ['Item', 'Type', 'Amount input', 'Total (£)']);
    results.enrichedItems.forEach((item) => {
      rows.push([
        item.name,
        item.type,
        item.amount,
        currencyFormatter.format(item.total),
      ]);
    });
  }

  return rows;
};

const buildChartData = (results) => {
  if (!results) return [];
  return results.enrichedItems.map((item) => ({
    name: item.name,
    value: item.total,
  }));
};

export default function TravelBudgetCalculatorPage() {
  const [inputs, setInputs] = useState({
    travellers: '2',
    nights: '7',
    contingencyPercent: '10',
  });
  const [items, setItems] = useState(defaultItems);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Travel Budget Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Travel Budget Calculator', url: pagePath },
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

  const handleItemChange = useCallback(
    (id, field) => (event) => {
      const value = event.target.value;
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
      resetResults();
    },
    [resetResults]
  );

  const handleItemRemoval = useCallback(
    (id) => () => {
      setItems((prev) => prev.filter((item) => item.id !== id));
      resetResults();
    },
    [resetResults]
  );

  const handleAddItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        name: 'New item',
        amount: '0',
        type: 'perTrip',
      },
    ]);
    resetResults();
  }, [resetResults]);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = computeTravelBudget(
        items,
        inputs.travellers,
        inputs.nights,
        inputs.contingencyPercent
      );
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs, items]
  );

  const handleReset = useCallback(() => {
    setInputs({ travellers: '2', nights: '7', contingencyPercent: '10' });
    setItems(defaultItems);
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
                <Plane className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Travel Budget Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Build a personalised travel budget, add a contingency buffer, and split the total per
              traveller before you book.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Globe className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <Compass className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Trip details & costs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="travellers">Travellers</Label>
                      <Input
                        id="travellers"
                        inputMode="decimal"
                        value={inputs.travellers}
                        onChange={handleInputChange('travellers')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nights">Nights away</Label>
                      <Input
                        id="nights"
                        inputMode="decimal"
                        value={inputs.nights}
                        onChange={handleInputChange('nights')}
                        placeholder="e.g. 7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contingencyPercent">Contingency (%)</Label>
                      <Input
                        id="contingencyPercent"
                        inputMode="decimal"
                        value={inputs.contingencyPercent}
                        onChange={handleInputChange('contingencyPercent')}
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-lg border border-slate-200 p-4 shadow-sm dark:border-slate-800"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                            {item.name || 'Trip item'}
                          </Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleItemRemoval(item.id)}
                            className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                          >
                            <Trash2 className="mr-1 h-4 w-4" aria-hidden="true" />
                            Remove
                          </Button>
                        </div>
                        <div className="mt-4 grid gap-4 sm:grid-cols-3">
                          <div className="space-y-2">
                            <Label htmlFor={`${item.id}-name`}>Name</Label>
                            <Input
                              id={`${item.id}-name`}
                              value={item.name}
                              onChange={handleItemChange(item.id, 'name')}
                              placeholder="e.g. Accommodation"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${item.id}-amount`}>Amount (£)</Label>
                            <Input
                              id={`${item.id}-amount`}
                              inputMode="decimal"
                              value={item.amount}
                              onChange={handleItemChange(item.id, 'amount')}
                              placeholder="e.g. 140"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`${item.id}-type`}>Basis</Label>
                            <select
                              id={`${item.id}-type`}
                              value={item.type}
                              onChange={handleItemChange(item.id, 'type')}
                              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                            >
                              {typeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="button" onClick={handleAddItem} className="flex-1">
                      <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                      Add cost line
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset to sample trip
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate travel budget
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
                    Enter your trip details and press
                    <span className="font-semibold"> Calculate travel budget</span> to see totals per
                    traveller and per night.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Budget summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Base total</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.baseTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Contingency</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.contingencyAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Grand total</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grandTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Per traveller</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.perTraveller)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Per night</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.perNight)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="travel-budget-calculation"
                          title="Travel Budget Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Plane className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Itemised costs
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      {results.enrichedItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span>{currencyFormatter.format(item.total)}</span>
                        </div>
                      ))}
                      <p>
                        Travellers: {results.travellers} · Nights: {results.nights} · Contingency:{' '}
                        {results.contingencyPercent}%
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Cost breakdown
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
                        <ResultBreakdownChart data={chartData} title="Travel budget breakdown" />
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
