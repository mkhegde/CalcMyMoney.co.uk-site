import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Wallet, TrendingUp, PieChart, CalendarClock } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'subscription calculator',
  'recurring cost calculator',
  'monthly cost calculator',
  'annual expense calculator',
];

const metaDescription =
  'Use our subscription calculator, recurring cost calculator, and monthly cost calculator to tally expenses and project your annual expense calculator totals.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/subscription-cost-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultSubscriptions = [
  { id: 'netflix', name: 'Streaming service', cost: 12.99, billingCycle: 'monthly' },
  { id: 'gym', name: 'Gym membership', cost: 38, billingCycle: 'monthly' },
  { id: 'cloud', name: 'Cloud storage', cost: 119, billingCycle: 'annual' },
  { id: 'music', name: 'Music app', cost: 9.99, billingCycle: 'monthly' },
];

const subscriptionFaqs = [
  {
    question: 'How do I compare monthly versus annual pricing?',
    answer:
      'Enter the price and billing cycle for each subscription. The recurring cost calculator converts everything into monthly and annual totals so you can compare like-for-like.',
  },
  {
    question: 'What categories should I include?',
    answer:
      'Track entertainment, productivity, insurance, utilities, and niche tools. The monthly cost calculator highlights the true footprint of every subscription so nothing slips through.',
  },
  {
    question: 'Can I factor in price rises?',
    answer:
      'Yes. Use the annual increase slider to model contract renewals and introductory deals expiring. Build the annual expense calculator plan before negotiating or cancelling services.',
  },
];

const calculateTotals = (subscriptions, annualIncreasePercent) => {
  const increaseRate = Math.max(Number(annualIncreasePercent) || 0, 0) / 100;

  const mapped = subscriptions.map((subscription) => {
    const cost = Math.max(Number(subscription.cost) || 0, 0);
    const frequency = subscription.billingCycle === 'annual' ? 1 : 12;
    const monthlyCost = subscription.billingCycle === 'annual' ? cost / 12 : cost;
    const annualCost = subscription.billingCycle === 'annual' ? cost : cost * 12;

    const projectedFirstYear = annualCost;
    const projectedSecondYear = annualCost * (1 + increaseRate);
    const projectedThirdYear = projectedSecondYear * (1 + increaseRate);

    return {
      ...subscription,
      frequency,
      monthlyCost,
      annualCost,
      projectedFirstYear,
      projectedSecondYear,
      projectedThirdYear,
    };
  });

  const monthlyTotal = mapped.reduce((sum, item) => sum + item.monthlyCost, 0);
  const annualTotal = mapped.reduce((sum, item) => sum + item.annualCost, 0);

  const projectedTotals = mapped.reduce(
    (acc, item) => {
      acc.yearOne += item.projectedFirstYear;
      acc.yearTwo += item.projectedSecondYear;
      acc.yearThree += item.projectedThirdYear;
      return acc;
    },
    { yearOne: 0, yearTwo: 0, yearThree: 0 }
  );

  return { mapped, monthlyTotal, annualTotal, projectedTotals };
};

export default function SubscriptionCostCalculatorPage() {
  const [subscriptions, setSubscriptions] = useState(defaultSubscriptions);
  const [annualIncrease, setAnnualIncrease] = useState(4);

  const totals = useMemo(
    () => calculateTotals(subscriptions, annualIncrease),
    [subscriptions, annualIncrease]
  );

  const addSubscription = () => {
    setSubscriptions((prev) => [
      ...prev,
      {
        id: `subscription-${prev.length + 1}`,
        name: 'New subscription',
        cost: 0,
        billingCycle: 'monthly',
      },
    ]);
  };

  const updateSubscription = (id, field, value) => {
    setSubscriptions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeSubscription = (id) => {
    setSubscriptions((prev) => prev.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setSubscriptions(defaultSubscriptions);
    setAnnualIncrease(4);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Subscription Calculator | Recurring Cost Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Subscription Calculator | Recurring Cost Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Subscription Calculator | Recurring Cost Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Subscription Cost Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan recurring costs with a subscription calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Subscription Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Audit every subscription, compare billing cycles, and forecast future price rises with a
            recurring cost calculator built for household clarity.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            {subscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-lg font-semibold">
                      <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                      {subscription.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubscription(subscription.id)}
                      className="text-emerald-700 hover:text-emerald-800 dark:text-emerald-200"
                    >
                      Remove
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${subscription.id}-name`}>Name</Label>
                    <Input
                      id={`${subscription.id}-name`}
                      value={subscription.name}
                      onChange={(event) =>
                        updateSubscription(subscription.id, 'name', event.target.value)
                      }
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor={`${subscription.id}-cost`}>Cost (£)</Label>
                      <Input
                        id={`${subscription.id}-cost`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={subscription.cost}
                        onChange={(event) =>
                          updateSubscription(
                            subscription.id,
                            'cost',
                            Number(event.target.value)
                          )
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${subscription.id}-cycle`}>Billing cycle</Label>
                      <select
                        id={`${subscription.id}-cycle`}
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                        value={subscription.billingCycle}
                        onChange={(event) =>
                          updateSubscription(subscription.id, 'billingCycle', event.target.value)
                        }
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex flex-col gap-4 md:flex-row">
              <Button onClick={addSubscription} className="w-full md:w-auto">
                Add subscription
              </Button>
              <Button variant="outline" onClick={resetAll} className="w-full md:w-auto">
                Reset to example set
              </Button>
            </div>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Annual increase assumption
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="annualIncrease">Annual price rise (%)</Label>
                  <Slider
                    id="annualIncrease"
                    value={[Number(annualIncrease)]}
                    min={0}
                    max={15}
                    step={0.5}
                    onValueChange={(value) => setAnnualIncrease(Number(value[0].toFixed(1)))}
                    className="mt-3"
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{annualIncrease.toFixed(1)}%</span>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Wallet className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Monthly cost calculator summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Monthly total</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(totals.monthlyTotal)}
                    </p>
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Annual total</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(totals.annualTotal)}
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Year one</span>
                    <span>{currencyFormatter.format(totals.projectedTotals.yearOne)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Year two</span>
                    <span>{currencyFormatter.format(totals.projectedTotals.yearTwo)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Year three</span>
                    <span>{currencyFormatter.format(totals.projectedTotals.yearThree)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Recurring cost calculator breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {totals.mapped.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Add subscriptions to see the breakdown of monthly and annual totals.
                  </p>
                )}
                {totals.mapped.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700 dark:text-slate-200">
                        {item.name}
                      </span>
                      <span className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        {item.billingCycle === 'annual' ? 'Annual' : 'Monthly'} billing
                      </span>
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-md border border-white/30 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Monthly cost</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {currencyFormatter.format(item.monthlyCost)}
                        </p>
                      </div>
                      <div className="rounded-md border border-white/30 bg-white/60 p-3 text-sm dark:border-white/10 dark:bg-white/5">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Annual cost</p>
                        <p className="font-semibold text-slate-700 dark:text-slate-200">
                          {currencyFormatter.format(item.annualCost)}
                        </p>
                      </div>
                    </div>
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
                Annual expense calculator strategy session
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Export the totals into your budgeting spreadsheet so the annual expense calculator view
                stays current. Cancel redundant tools, downgrade tiers, and negotiate loyalty deals to
                free up cash flow.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Monthly cost calculator discipline keeps spending tidy
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use this monthly cost calculator as a decision checkpoint before adding new services.
                Note the before-and-after totals so every subscription earns its place in your budget.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <CalendarClock className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Need support?
                </CardTitle>
              </CardHeader>
              <FAQSection faqs={subscriptionFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
