import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Users, Wallet } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['household bills splitter'];

const metaDescription =
  'Use our household bills splitter to divide shared expenses fairly so your household bills splitter keeps rent, utilities, and subscriptions balanced every month.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/household-bills-splitter';
const schemaKeywords = keywords;

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  });

const householdFaqs = [
  {
    question: 'How do I handle different incomes?',
    answer:
      'Assign each housemate a share percentage that reflects their contribution. The calculator automatically splits bills based on those percentages.',
  },
  {
    question: 'Can I add ad-hoc expenses?',
    answer:
      'Yes. Add one-off items such as furniture or cleaning services and the household bills splitter will apportion the cost instantly.',
  },
  {
    question: 'How often should we review our split?',
    answer:
      'Review whenever incomes change or new subscriptions appear. Keeping the calculator up to date prevents resentment and missed payments.',
  },
];

const calculateSplits = (items, participants) => {
  const totals = participants.map((participant) => ({
    name: participant.name,
    share: participant.share,
    total: 0,
  }));

  items.forEach((item) => {
    const cost = Number(item.cost) || 0;
    participants.forEach((participant, index) => {
      const share = Number(participant.share) || 0;
      totals[index].total += cost * (share / 100);
    });
  });

  return totals;
};

export default function HouseholdBillsSplitterPage() {
  const [items, setItems] = useState([
    { name: 'Rent', cost: '1200' },
    { name: 'Utilities', cost: '180' },
    { name: 'Internet & TV', cost: '55' },
  ]);

  const [participants, setParticipants] = useState([
    { name: 'You', share: 50 },
    { name: 'Housemate', share: 50 },
  ]);

  const totals = useMemo(() => calculateSplits(items, participants), [items, participants]);

  const addItem = () => setItems((prev) => [...prev, { name: 'New expense', cost: '0' }]);
  const addParticipant = () =>
    setParticipants((prev) => [...prev, { name: `Person ${prev.length + 1}`, share: 0 }]);

  const totalCost = items.reduce((sum, item) => sum + (Number(item.cost) || 0), 0);
  const totalShares = participants.reduce(
    (sum, participant) => sum + (Number(participant.share) || 0),
    0
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Household Bills Splitter | Household Bills Splitter</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Household Bills Splitter | Household Bills Splitter" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Household Bills Splitter | Household Bills Splitter" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Household Bills Splitter',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Split household bills',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Household Bills Splitter
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Share rent, utilities, and subscriptions fairly. Input expenses, set contribution
            percentages, and the household bills splitter does the rest.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Shared Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={`item-${index}`} className="space-y-2">
                  <Input
                    value={item.name}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, name: event.target.value } : entry
                        )
                      )
                    }
                    placeholder="Expense name"
                  />
                  <Input
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={item.cost}
                    onChange={(event) =>
                      setItems((prev) =>
                        prev.map((entry, entryIndex) =>
                          entryIndex === index ? { ...entry, cost: event.target.value } : entry
                        )
                      )
                    }
                    placeholder="Monthly cost (£)"
                  />
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
                  <div key={`participant-${index}`} className="space-y-2">
                    <Input
                      value={participant.name}
                      onChange={(event) =>
                        setParticipants((prev) =>
                          prev.map((entry, entryIndex) =>
                            entryIndex === index ? { ...entry, name: event.target.value } : entry
                          )
                        )
                      }
                      placeholder="Name"
                    />
                    <Label className="text-sm font-medium flex justify-between items-center">
                      Contribution %
                      <span className="text-blue-600 font-semibold">
                        {(Number(participant.share) || 0).toFixed(1)}%
                      </span>
                    </Label>
                    <Slider
                      value={[Number(participant.share) || 0]}
                      onValueChange={(value) =>
                        setParticipants((prev) =>
                          prev.map((entry, entryIndex) =>
                            entryIndex === index
                              ? { ...entry, share: Number(value[0].toFixed(1)) }
                              : entry
                          )
                        )
                      }
                      min={0}
                      max={100}
                      step={0.5}
                    />
                  </div>
                ))}
                <Button onClick={addParticipant} variant="outline" className="w-full">
                  Add housemate
                </Button>
                <p className="text-xs text-slate-500">
                  Total share: {totalShares.toFixed(1)}%. Aim for 100% to split the bills evenly
                  across your household.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <Wallet className="h-5 w-5" />
                  Monthly Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Total shared cost</span>
                  <span className="text-base font-semibold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(totalCost)}
                  </span>
                </div>
                <div className="space-y-2">
                  {totals.map((total) => (
                    <div key={total.name} className="flex items-center justify-between">
                      <span>{total.name}</span>
                      <span>{currencyFormatter(total.total)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Keep the household bills splitter fair
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Document changes and agree percentages together. The household bills splitter
                provides transparency so everyone knows what they owe.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Staying organised with a household bills splitter
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair the monthly totals with a shared banking app or standing orders. Automating
                payments keeps the household bills splitter stress-free.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={householdFaqs} />
        </div>
      </section>
    </div>
  );
}
