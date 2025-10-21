import React, { useMemo, useState, useCallback, Suspense } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  ShoppingBasket,
  Scale,
  PiggyBank,
  BarChart3,
  Plus,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/price-per-unit-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/price-per-unit-calculator';
const pageTitle = 'Price Per Unit Calculator UK | Compare Grocery Costs';
const metaDescription =
  'Use our UK price per unit calculator to track cost of living changes and power your budgeting decisions every shop. Compare grocery costs efficiently.';
const keywords = getMappedKeywords('Price Per Unit Calculator');

const defaultItems = [
  { name: 'Brand A', price: '3.60', quantity: '750', unit: 'ml' },
  { name: 'Brand B', price: '4.10', quantity: '1000', unit: 'ml' },
  { name: 'Brand C', price: '2.85', quantity: '650', unit: 'ml' },
];

const pricePerUnitFaqs = [
  {
    question: 'How do supermarkets present unit prices?',
    answer:
      'Most UK retailers show a unit price on the shelf label, usually per kilogram, litre, or item. This calculator lets you compare alternative pack sizes quickly if the in-store data is unclear or missing.',
  },
  {
    question: 'Which unit size should I compare?',
    answer:
      'Pick a comparison size that reflects how you use the product. For liquids select per 100 ml, for pantry goods try per 100 g, and for household items you can compare per single unit.',
  },
  {
    question: 'Can this help with meal planning?',
    answer:
      'Yes. Estimate the units your household consumes each week and the tool will project the total cost so you can slot the figure straight into your food or essentials budget.',
  },
];

const emotionalMessage =
  'Every penny saved adds up! Use this calculator to become a savvy shopper, easily comparing prices to ensure you always get the best value for your money.';
const emotionalQuote = {
  text: 'A penny saved is a penny earned.',
  author: 'Benjamin Franklin',
};

const directoryLinks = [
  {
    url: '/#budgeting-planning',
    label: 'Explore all budgeting & planning calculators',
    description: 'Coordinate spending plans, short-term goals, and day-to-day money decisions.',
  },
  {
    url: '/budget-calculator',
    label: 'Build a monthly budget',
    description: 'Allocate income across bills, savings, and lifestyle categories each month.',
  },
  {
    url: '/cost-of-living-calculator',
    label: 'Cost of Living Calculator',
    description:
      'Compare monthly spending across housing, utilities, transport, and lifestyle costs.',
  },
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

const calculateComparisons = (items, comparisonAmount, weeklyUsage) => {
  const rows = items.map((item) => {
    const price = parseNumber(item.price);
    const quantity = parseNumber(item.quantity);
    const perUnit = quantity > 0 ? price / quantity : 0;
    const costForComparison = perUnit * parseNumber(comparisonAmount);
    const weeklyCost = perUnit * parseNumber(weeklyUsage);
    return {
      ...item,
      price,
      quantity,
      perUnit,
      costForComparison,
      weeklyCost,
    };
  });

  const validRows = rows.filter((row) => row.quantity > 0 && row.price > 0);
  const cheapestPerUnit =
    validRows.length > 0 ? Math.min(...validRows.map((row) => row.perUnit)) : null;

  return rows.map((row) => ({
    ...row,
    isCheapest: cheapestPerUnit !== null && row.perUnit === cheapestPerUnit,
    relativeDifference:
      cheapestPerUnit !== null && cheapestPerUnit > 0
        ? (row.perUnit - cheapestPerUnit) / cheapestPerUnit
        : 0,
  }));
};

function buildCsvData(comparisons, inputs) {
  if (!comparisons) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Comparison Amount', `${inputs.comparisonAmount} ${inputs.items[0]?.unit || 'units'}`],
    ['Estimated Weekly Usage', `${inputs.weeklyUsage} ${inputs.items[0]?.unit || 'units'}`],
    [],
    [
      'Product Name',
      'Price (£)',
      'Quantity',
      'Unit',
      `Cost per ${inputs.comparisonAmount} ${inputs.items[0]?.unit || 'units'} (£)`,
      'Weekly Cost (£)',
      'Cheapest Per Unit',
    ],
    ...comparisons.map((row) => [
      row.name,
      currencyFormatter.format(row.price),
      row.quantity,
      row.unit,
      currencyFormatter.format(row.costForComparison),
      currencyFormatter.format(row.weeklyCost),
      row.isCheapest ? 'Yes' : 'No',
    ]),
  ];
  return csvRows;
}

function buildChartData(comparisons) {
  if (!comparisons) return [];
  return comparisons.map((row) => ({
    name: row.name,
    'Cost per unit': row.perUnit,
  }));
}

export default function PricePerUnitCalculatorPage() {
  const [inputs, setInputs] = useState({
    items: defaultItems,
    comparisonAmount: '100',
    weeklyUsage: '400',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [comparisons, setComparisons] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Price Per Unit Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting-planning' },
      { name: 'Price Per Unit Calculator', url: pagePath },
    ],
    faq: pricePerUnitFaqs,
  });

  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleItemChange = useCallback((index, field, value) => {
    setInputs((prev) => ({
      ...prev,
      items: prev.items.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }));
  }, []);

  const handleAddItem = useCallback(() => {
    setInputs((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          name: `Product ${prev.items.length + 1}`,
          price: '',
          quantity: '',
          unit: prev.items[0]?.unit || 'g',
        },
      ],
    }));
  }, []);

  const handleRemoveItem = useCallback((index) => {
    setInputs((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedComparisons = calculateComparisons(
        inputs.items,
        inputs.comparisonAmount,
        inputs.weeklyUsage
      );
      setComparisons(computedComparisons);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedComparisons, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      items: defaultItems,
      comparisonAmount: '100',
      weeklyUsage: '400',
    });
    setHasCalculated(false);
    setComparisons(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(comparisons), [comparisons]);

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
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Price Per Unit Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Quickly benchmark pack sizes as the cost of living shifts and see which basket
              delivers the best value for your weekly shop.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<ShoppingBasket className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Product Comparison Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    {inputs.items.map((item, index) => (
                      <div
                        key={index}
                        className="rounded-md border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <Label htmlFor={`item-name-${index}`} className="text-sm font-semibold">
                            Item {index + 1}
                          </Label>
                          {inputs.items.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="mt-3 grid gap-3 md:grid-cols-4">
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor={`item-name-${index}`}>Name</Label>
                            <Input
                              id={`item-name-${index}`}
                              value={item.name}
                              onChange={(event) =>
                                handleItemChange(index, 'name', event.target.value)
                              }
                              placeholder={`e.g. Product ${index + 1}`}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`item-price-${index}`}>Price (£)</Label>
                            <Input
                              id={`item-price-${index}`}
                              inputMode="decimal"
                              value={item.price}
                              onChange={(event) =>
                                handleItemChange(index, 'price', event.target.value)
                              }
                              placeholder="e.g. 3.60"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                            <Input
                              id={`item-quantity-${index}`}
                              inputMode="decimal"
                              value={item.quantity}
                              onChange={(event) =>
                                handleItemChange(index, 'quantity', event.target.value)
                              }
                              placeholder="e.g. 750"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor={`item-unit-${index}`}>Unit (e.g. g, ml, pack)</Label>
                            <Input
                              id={`item-unit-${index}`}
                              value={item.unit}
                              onChange={(event) =>
                                handleItemChange(index, 'unit', event.target.value)
                              }
                              placeholder="e.g. ml"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddItem}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add another product
                  </Button>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Button type="submit" className="flex-1">
                      Calculate Prices
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Comparison Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="comparisonAmount">
                    Units for comparison ({inputs.items[0]?.unit || 'units'})
                  </Label>
                  <Input
                    id="comparisonAmount"
                    inputMode="decimal"
                    value={inputs.comparisonAmount}
                    onChange={(event) => handleInputChange('comparisonAmount', event.target.value)}
                    placeholder="e.g. 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyUsage">
                    Estimated weekly usage ({inputs.items[0]?.unit || 'units'})
                  </Label>
                  <Input
                    id="weeklyUsage"
                    inputMode="decimal"
                    value={inputs.weeklyUsage}
                    onChange={(event) => handleInputChange('weeklyUsage', event.target.value)}
                    placeholder="e.g. 400"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter product details and comparison settings, then press{' '}
                    <span className="font-semibold">Calculate Prices</span> to see the price per
                    unit and weekly spending projections.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && comparisons && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ShoppingBasket className="h-5 w-5 text-emerald-600 dark:text-emerald-200" />
                        Price Per Unit Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {comparisons.map((row, index) => (
                        <div
                          key={`${row.name}-${index}`}
                          className={`flex flex-col gap-2 rounded-md border p-4 md:flex-row md:items-center md:justify-between ${
                            row.isCheapest
                              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/40'
                              : 'border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900'
                          }`}
                        >
                          <div>
                            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
                              {row.name || `Product ${index + 1}`}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {currencyFormatter.format(row.price)} · {row.quantity} {row.unit}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-slate-500 dark:text-slate-300">
                              Cost per {inputs.comparisonAmount} {inputs.items[0]?.unit || 'units'}
                            </p>
                            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {currencyFormatter.format(row.costForComparison)}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {row.quantity > 0
                                ? `${currencyFormatter.format(row.perUnit)} per ${row.unit}`
                                : 'Enter quantity to calculate'}
                            </p>
                            {row.relativeDifference > 0 && (
                              <p className="text-xs text-rose-600 dark:text-rose-300">
                                {Math.round(row.relativeDifference * 100)}% more than the cheapest
                                option
                              </p>
                            )}
                            {row.isCheapest && (
                              <p className="text-xs text-emerald-600 dark:text-emerald-300">
                                Cheapest per unit
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        Weekly Spending Projection
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
                        <ResultBreakdownChart
                          data={buildChartData(comparisons)}
                          title="Weekly Spending"
                        />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides a comparison based on your inputs. Actual prices
                        and unit sizes may vary between retailers and over time.
                      </p>
                      <p>
                        Always check in-store labels for the most accurate unit pricing and consider
                        your household's consumption habits when making purchasing decisions.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={pricePerUnitFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
