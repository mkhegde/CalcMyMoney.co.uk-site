import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Users, Wallet } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Household Bills Splitter';
const canonicalUrl = 'https://www.calcmymoney.co.uk/household-bills-splitter';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Split rent, utilities, and shared subscriptions fairly. Calculate who owes what based on agreed contribution percentages.';

const defaultItems = [
  { name: 'Rent', cost: '1,200' },
  { name: 'Utilities', cost: '180' },
  { name: 'Internet & TV', cost: '55' },
];

const defaultParticipants = [
  { name: 'You', share: '50' },
  { name: 'Housemate', share: '50' },
];

const faqItems = [
  {
    question: 'How should we set contribution percentages?',
    answer:
      'Agree shares based on income, room size, or any arrangement that feels fair. Make sure the total reaches 100% so the full bill is allocated.',
  },
  {
    question: 'Can I add one-off expenses such as furniture?',
    answer:
      'Yes. Add a new expense row for furniture, cleaning, or repairs. The calculator will apportion the cost across housemates instantly.',
  },
  {
    question: 'How often should we review our split?',
    answer:
      'Review whenever someone moves in or out, a new subscription is added, or incomes change. Keeping the split up to date prevents awkward conversations later.',
  },
];

const relatedCalculators = [
  {
    name: 'Household Budget Planner',
    url: '/budget-calculator',
    description: 'Create a shared monthly budget before you split the bills.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Plan joint savings goals once essentials are covered.',
  },
  {
    name: 'Energy Bill Calculator',
    url: '/energy-bill-calculator',
    description: 'Estimate utility costs to feed into your shared expenses.',
  },
];

const webPageSchema = createCalculatorWebPageSchema({
  name: CALCULATOR_NAME,
  description: metaDescription,
  url: canonicalUrl,
  keywords,
});

const breadcrumbSchema = createCalculatorBreadcrumbs({
  name: CALCULATOR_NAME,
  url: canonicalUrl,
});

const faqStructuredData = faqSchema(faqItems);

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  });

const calculateSplits = (items, participants) => {
  const shareTotal = participants.reduce((sum, participant) => sum + participant.share, 0);
  if (shareTotal <= 0) {
    return {
      valid: false,
      message: 'Add contribution percentages that total more than zero to split the bills.',
    };
  }

  const totalCost = items.reduce((sum, item) => sum + item.cost, 0);
  if (totalCost <= 0) {
    return {
      valid: false,
      message: 'Add at least one expense with a positive cost to split between housemates.',
    };
  }

  const allocations = participants.map((participant) => ({
    name: participant.name,
    share: participant.share,
    amount: 0,
  }));

  items.forEach((item) => {
    participants.forEach((participant, index) => {
      const percentage = participant.share / shareTotal;
      allocations[index].amount += item.cost * percentage;
    });
  });

  return {
    valid: true,
    totalCost,
    shareTotal,
    allocations,
  };
};

export default function HouseholdBillsSplitterPage() {
  const [items, setItems] = useState(defaultItems);
  const [participants, setParticipants] = useState(defaultParticipants);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const sanitisedItems = useMemo(
    () =>
      items.map((item) => ({
        name: item.name.trim() || 'Expense',
        cost: sanitiseNumber(item.cost),
      })),
    [items]
  );

  const sanitisedParticipants = useMemo(
    () =>
      participants.map((participant) => ({
        name: participant.name.trim() || 'Housemate',
        share: sanitiseNumber(participant.share),
      })),
    [participants]
  );

  const handleItemChange = (index, field) => (event) => {
    const value = event.target.value;
    setItems((prev) =>
      prev.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  const handleParticipantChange = (index, field) => (event) => {
    const value = event.target.value;
    setParticipants((prev) =>
      prev.map((participant, participantIndex) =>
        participantIndex === index ? { ...participant, [field]: value } : participant
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { name: 'New expense', cost: '0' }]);
  };

  const addParticipant = () => {
    setParticipants((prev) => [...prev, { name: `Person ${prev.length + 1}`, share: '0' }]);
  };

  const removeItem = (index) => () => {
    setItems((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const removeParticipant = (index) => () => {
    setParticipants((prev) => prev.filter((_, participantIndex) => participantIndex !== index));
  };

  const handleReset = () => {
    setItems(defaultItems);
    setParticipants(defaultParticipants);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const outcome = calculateSplits(sanitisedItems, sanitisedParticipants);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return results.allocations.map((allocation, index) => ({
      name: allocation.name,
      value: allocation.amount,
      color: ['#0ea5e9', '#f97316', '#22c55e', '#a855f7', '#facc15', '#14b8a6'][index % 6],
    }));
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const header = [
      ['Expense name', 'Monthly cost (£)'],
      ...sanitisedItems.map((item) => [item.name, item.cost.toFixed(2)]),
      [],
      ['Housemate', 'Share (%)', 'Amount owed (£)'],
      ...results.allocations.map((allocation, index) => [
        allocation.name,
        sanitisedParticipants[index].share.toFixed(2),
        allocation.amount.toFixed(2),
      ]),
      [],
      ['Total shared costs (£)', results.totalCost.toFixed(2)],
    ];
    return header;
  }, [results, sanitisedItems, sanitisedParticipants]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Shared Expense Planner`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Household Bills Splitter
          </Heading>
          <p className="calculator-hero__description">
            Share rent, utilities, and subscriptions fairly—no more chasing IOUs or guessing who owes what.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Keep the peace at home"
          message="Money conversations get easier when everyone sees the same numbers. Update the split together and walk away with confidence."
          quote="Good fences make good neighbors."
          author="Robert Frost"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Shared expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={`item-${index}`} className="space-y-2 rounded-md border border-blue-100 dark:border-blue-900 p-3">
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Expense name
                  </Label>
                  <Input
                    value={item.name}
                    onChange={handleItemChange(index, 'name')}
                    placeholder="e.g., Gas & electric"
                  />
                  <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                    Monthly cost (£)
                  </Label>
                  <Input
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={item.cost}
                    onChange={handleItemChange(index, 'cost')}
                    placeholder="e.g., 120"
                  />
                  {items.length > 1 ? (
                    <Button variant="ghost" size="sm" onClick={removeItem(index)} className="text-blue-600 dark:text-blue-200">
                      Remove
                    </Button>
                  ) : null}
                </div>
              ))}
              <Button onClick={addItem} variant="outline" className="w-full">
                Add expense
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Users className="h-5 w-5 text-blue-500" />
                  Housemates
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {participants.map((participant, index) => (
                  <div key={`participant-${index}`} className="space-y-2 rounded-md border border-blue-100 dark:border-blue-900 p-3">
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Name
                    </Label>
                    <Input
                      value={participant.name}
                      onChange={handleParticipantChange(index, 'name')}
                      placeholder="e.g., Alex"
                    />
                    <Label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                      Contribution percentage (%)
                    </Label>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={participant.share}
                      onChange={handleParticipantChange(index, 'share')}
                      placeholder="e.g., 50"
                    />
                    {participants.length > 1 ? (
                      <Button variant="ghost" size="sm" onClick={removeParticipant(index)} className="text-blue-600 dark:text-blue-200">
                        Remove
                      </Button>
                    ) : null}
                  </div>
                ))}
                <Button onClick={addParticipant} variant="outline" className="w-full">
                  Add housemate
                </Button>
              </CardContent>
            </Card>

            <form className="space-y-4" onSubmit={handleCalculate}>
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Calculate
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>

            {showResults ? (
              <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                    <Wallet className="h-5 w-5" />
                    Monthly split summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-md bg-white/80 dark:bg-blue-900/40 p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                      Total shared costs
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {currencyFormatter(results.totalCost)}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {results.allocations.map((allocation, index) => (
                      <div
                        key={allocation.name}
                        className="flex items-center justify-between rounded-md bg-white/80 dark:bg-blue-900/40 p-3 border border-blue-100 dark:border-blue-800"
                      >
                        <span className="font-medium text-blue-900 dark:text-blue-100">
                          {allocation.name}
                        </span>
                        <span className="text-sm text-blue-800 dark:text-blue-200">
                          {currencyFormatter(allocation.amount)} (
                          {sanitisedParticipants[index].share.toFixed(1)}%)
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 p-4">
                    <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-4">
                      Cost split by housemate
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Household split" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="household-bills-split"
                    title="Household bills split"
                  />
                </CardContent>
              </Card>
            ) : (
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Users className="h-5 w-5 text-blue-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your expenses and set contribution percentages, then press{' '}
                        <strong>Calculate</strong> to see who owes what.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
<RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
