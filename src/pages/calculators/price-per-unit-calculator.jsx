import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ShoppingBasket, Scale, PiggyBank, BarChart3, Plus } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'price calculator',
  'cost of living',
  'budget calculator',
  'budget planner',
  'budgeting tool',
];

const metaDescription =
  'Use our price per unit calculator price calculator to track cost of living changes and power your budget calculator decisions every shop.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/price-per-unit-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultItems = [
  { name: 'Brand A', price: 3.6, quantity: 750, unit: 'ml' },
  { name: 'Brand B', price: 4.1, quantity: 1000, unit: 'ml' },
  { name: 'Brand C', price: 2.85, quantity: 650, unit: 'ml' },
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

const calculateComparisons = (items, comparisonAmount, weeklyUsage) => {
  const rows = items.map((item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const perUnit = quantity > 0 ? price / quantity : 0;
    const costForComparison = perUnit * comparisonAmount;
    const weeklyCost = perUnit * weeklyUsage;
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

export default function PricePerUnitCalculatorPage() {
  const [comparisonAmount, setComparisonAmount] = useState(100);
  const [weeklyUsage, setWeeklyUsage] = useState(400);
  const [items, setItems] = useState(defaultItems);

  const comparisons = useMemo(
    () => calculateComparisons(items, comparisonAmount, weeklyUsage),
    [items, comparisonAmount, weeklyUsage]
  );

  const cheapestItem = comparisons.find((row) => row.isCheapest);

  const handleItemChange = (index, key, value) => {
    setItems((previous) =>
      previous.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems((previous) => [
      ...previous,
      { name: `Product ${previous.length + 1}`, price: 0, quantity: 0, unit: previous[0]?.unit || 'g' },
    ]);
  };

  const removeItem = (index) => {
    setItems((previous) => previous.filter((_, itemIndex) => itemIndex !== index));
  };

  const resetAll = () => {
    setItems(defaultItems);
    setComparisonAmount(100);
    setWeeklyUsage(400);
  };

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Price Per Unit Calculator | Cost of Living</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Price Per Unit Calculator | Cost of Living" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Price Per Unit Calculator | Cost of Living" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Price Per Unit Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Compare prices by unit across grocery products',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Price Per Unit Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Quickly benchmark pack sizes as the cost of living shifts and see which basket delivers the
            best value for your weekly shop.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <ShoppingBasket className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Product comparison inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="rounded-md border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <Label htmlFor={`item-name-${index}`} className="text-sm font-semibold">
                          Item {index + 1}
                        </Label>
                        {items.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removeItem(index)}>
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
                            onChange={(event) => handleItemChange(index, 'name', event.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-price-${index}`}>Price (£)</Label>
                          <Input
                            id={`item-price-${index}`}
                            type="number"
                            min="0"
                            step="0.01"
                            inputMode="decimal"
                            value={item.price}
                            onChange={(event) =>
                              handleItemChange(index, 'price', Number(event.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`item-quantity-${index}`}>Quantity</Label>
                          <Input
                            id={`item-quantity-${index}`}
                            type="number"
                            min="0"
                            step="1"
                            inputMode="decimal"
                            value={item.quantity}
                            onChange={(event) =>
                              handleItemChange(index, 'quantity', Number(event.target.value) || 0)
                            }
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`item-unit-${index}`}>Unit (e.g. g, ml, pack)</Label>
                          <Input
                            id={`item-unit-${index}`}
                            value={item.unit}
                            onChange={(event) => handleItemChange(index, 'unit', event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add another product
                </Button>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to demo data
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Scale className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Comparison settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="comparison-amount">
                    Units for comparison ({items[0]?.unit || 'units'})
                  </Label>
                  <Slider
                    id="comparison-amount"
                    className="mt-3"
                    value={[Number(comparisonAmount)]}
                    onValueChange={(value) => setComparisonAmount(Number(value[0].toFixed(0)))}
                    min={10}
                    max={1000}
                    step={10}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>10</span>
                    <span>{comparisonAmount}</span>
                    <span>1000</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weekly-usage">
                    Estimated weekly usage ({items[0]?.unit || 'units'})
                  </Label>
                  <Slider
                    id="weekly-usage"
                    className="mt-3"
                    value={[Number(weeklyUsage)]}
                    onValueChange={(value) => setWeeklyUsage(Number(value[0].toFixed(0)))}
                    min={50}
                    max={1500}
                    step={10}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>50</span>
                    <span>{weeklyUsage}</span>
                    <span>1500</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Price per unit summary
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
                        Cost per {comparisonAmount} {items[0]?.unit || 'units'}
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
                          {Math.round(row.relativeDifference * 100)}% more than the cheapest option
                        </p>
                      )}
                      {row.isCheapest && <p className="text-xs text-emerald-600 dark:text-emerald-300">Cheapest per unit</p>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Weekly spending projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {comparisons.map((row, index) => (
                  <div
                    key={`weekly-${index}`}
                    className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <span>{row.name || `Product ${index + 1}`}</span>
                    <span>{currencyFormatter.format(row.weeklyCost)} / week</span>
                  </div>
                ))}
                {cheapestItem && (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Switching everything to {cheapestItem.name || 'the cheapest item'} saves up to{' '}
                    {currencyFormatter.format(
                      comparisons
                        .filter((row) => !row.isCheapest)
                        .reduce(
                          (saving, row) =>
                            saving + Math.max(row.weeklyCost - cheapestItem.weeklyCost, 0),
                          0
                        )
                    )}{' '}
                    per week at the current usage rate.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Savings ideas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Bulk buying works when the price per unit stays low and you can store the items. Track
                  expiry dates so nothing goes to waste.
                </p>
                <p>
                  Mix and match loyalty vouchers with the best unit price to stack discounts, then add
                  the final figure into your budget planner.
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
                Budget planner price comparison tactics
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat this view as a budgeting tool that highlights which household essentials deliver
                the lowest unit cost so your basket automatically aligns with the goals in your budget
                planner.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Turn insights into budget wins
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Update the numbers before big shops, compare multibuys with base ranges, and push the
                savings into future sinking funds or debt repayments.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={pricePerUnitFaqs} />
        </div>
      </section>
    </div>
  );
}
