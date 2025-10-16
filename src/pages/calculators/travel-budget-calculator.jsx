import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plane, Wallet, Globe, Calculator, Compass } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'travel budget calculator',
  'trip cost calculator',
  'budget planner',
  'expense tracker',
];

const metaDescription =
  'Use our travel budget calculator, trip cost calculator, and budget planner to plan flights, accommodation, and spending while keeping an expense tracker up to date.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/travel-budget-calculator';
const schemaKeywords = keywords.slice(0, 5);

const typeOptions = {
  perPerson: {
    label: 'Per traveller',
    helper: 'Multiplies by the number of travellers',
  },
  perPersonPerNight: {
    label: 'Per traveller per night',
    helper: 'Multiplies by travellers and nights',
  },
  perNight: {
    label: 'Per night',
    helper: 'Multiplies by trip length (nights)',
  },
  perTrip: {
    label: 'Whole trip',
    helper: 'One-off cost for the whole party',
  },
};

const defaultItems = [
  { id: 'flights', name: 'Flights', amount: 220, type: 'perPerson' },
  { id: 'accommodation', name: 'Accommodation', amount: 140, type: 'perNight' },
  { id: 'food', name: 'Daily food & drinks', amount: 38, type: 'perPersonPerNight' },
  { id: 'activities', name: 'Activities & tours', amount: 22, type: 'perPersonPerNight' },
  { id: 'insurance', name: 'Travel insurance', amount: 35, type: 'perPerson' },
  { id: 'transfers', name: 'Airport & local transfers', amount: 140, type: 'perTrip' },
];

const travelFaqs = [
  {
    question: 'How should I split my travel budget?',
    answer:
      'List the biggest cost drivers first: flights, accommodation, local transport, food, and experiences. The travel budget calculator converts every item into a single total so you can check affordability quickly.',
  },
  {
    question: 'What does the contingency slider represent?',
    answer:
      'It adds a safety buffer for surprises such as luggage fees, exchange-rate swings, or last-minute tours. Set the percentage based on the destination and how much flexibility you want.',
  },
  {
    question: 'Can I use this as a live expense tracker while I travel?',
    answer:
      'Yes. Update the committed column while you are on the road to keep a running tally of your spend and compare it with the plan.',
  },
];

const calculateItemTotal = (item, travellers, nights) => {
  const amount = Math.max(Number(item.amount) || 0, 0);
  const safeTravellers = Math.max(Number(travellers) || 0, 0);
  const safeNights = Math.max(Number(nights) || 0, 0);

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

const enrichItems = (items, travellers, nights) =>
  items.map((item) => ({
    ...item,
    total: calculateItemTotal(item, travellers, nights),
  }));

export default function TravelBudgetCalculatorPage() {
  const [travellers, setTravellers] = useState(2);
  const [nights, setNights] = useState(7);
  const [contingencyPercent, setContingencyPercent] = useState(10);
  const [items, setItems] = useState(defaultItems);

  const enrichedItems = useMemo(
    () => enrichItems(items, travellers, nights),
    [items, travellers, nights]
  );

  const baseTotal = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + item.total, 0),
    [enrichedItems]
  );

  const contingencyAmount = useMemo(
    () => (baseTotal * Math.max(Number(contingencyPercent) || 0, 0)) / 100,
    [baseTotal, contingencyPercent]
  );

  const grandTotal = baseTotal + contingencyAmount;
  const perTraveller = travellers > 0 ? grandTotal / travellers : grandTotal;

  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${prev.length + 1}`,
        name: 'New item',
        amount: 0,
        type: 'perTrip',
      },
    ]);
  };

  const updateItem = (id, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setTravellers(2);
    setNights(7);
    setContingencyPercent(10);
    setItems(defaultItems);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Travel Budget Calculator | Trip Cost Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Travel Budget Calculator | Trip Cost Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Travel Budget Calculator | Trip Cost Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Travel Budget Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan trips with a travel budget calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Travel Budget Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Build a personalised itinerary budget, apply a contingency buffer, and split the total per
            traveller so your next adventure stays on track.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Trip overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="travellers">Travellers</Label>
                    <Input
                      id="travellers"
                      type="number"
                      min="1"
                      step="1"
                      value={travellers}
                      onChange={(event) => setTravellers(Number(event.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nights">Trip length (nights)</Label>
                    <Input
                      id="nights"
                      type="number"
                      min="1"
                      step="1"
                      value={nights}
                      onChange={(event) => setNights(Number(event.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contingency">Contingency (%)</Label>
                    <Slider
                      id="contingency"
                      className="mt-3"
                      value={[Number(contingencyPercent)]}
                      onValueChange={(value) => setContingencyPercent(Number(value[0].toFixed(1)))}
                      min={0}
                      max={30}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{contingencyPercent.toFixed(1)}%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example trip
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Plane className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Trip cost calculator items
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <Input
                        value={item.name}
                        onChange={(event) => updateItem(item.id, 'name', event.target.value)}
                        className="text-sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.id)}
                        className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div className="space-y-2">
                        <Label htmlFor={`${item.id}-amount`}>Amount (£)</Label>
                        <Input
                          id={`${item.id}-amount`}
                          type="number"
                          min="0"
                          step="5"
                          value={item.amount}
                          onChange={(event) =>
                            updateItem(item.id, 'amount', Number(event.target.value) || 0)
                          }
                        />
                      </div>
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`${item.id}-type`}>Cost type</Label>
                        <select
                          id={`${item.id}-type`}
                          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                          value={item.type}
                          onChange={(event) => updateItem(item.id, 'type', event.target.value)}
                        >
                          {Object.entries(typeOptions).map(([value, option]) => (
                            <option key={value} value={value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {typeOptions[item.type]?.helper}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                      Estimated cost: £{calculateItemTotal(item, travellers, nights).toFixed(0)}
                    </p>
                  </div>
                ))}
                <Button onClick={addItem} className="w-full">
                  Add itinerary item
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Wallet className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Budget summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Base itinerary total</span>
                  <span>£{baseTotal.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Contingency buffer</span>
                  <span>£{contingencyAmount.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total budget</span>
                  <span>£{grandTotal.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Per traveller</span>
                  <span>£{perTraveller.toFixed(0)}</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  Update the figures whenever exchange rates move or you lock in new bookings to keep
                  the trip cost calculator view accurate.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Expense tracker breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {enrichedItems.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Add itinerary items to populate the expense tracker.
                  </p>
                )}
                {enrichedItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800 md:grid-cols-3"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      {item.name}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">
                      Cost type: {typeOptions[item.type]?.label ?? 'Per trip'}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      £{item.total.toFixed(0)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Budget planner and expense tracker techniques
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Sync this travel budget with your core budget planner so flights, insurance, and
                excursions do not compete with household bills. Tag each booking with due dates to keep
                cash flow smooth.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Travel day tips for the expense tracker
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Snap receipts into your expense tracker app while travelling. Reconciling daily means
                you can redirect underspend towards last-minute treats without blowing the plan.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={travelFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
