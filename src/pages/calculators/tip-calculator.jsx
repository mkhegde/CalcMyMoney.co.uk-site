import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Users, Percent, Receipt } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'tip calculator',
  'restaurant tip calculator',
  'bill tip calculator',
  'tip percentage calculator',
  'group tip calculator',
];

const metaDescription =
  'Use our tip calculator and restaurant tip calculator to split bills, adjust tip percentage calculator settings, and share group tip calculator totals instantly.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/tip-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const tipFaqs = [
  {
    question: 'Should I tip on the pre-service charge amount?',
    answer:
      'Many diners tip on the pre-service charge subtotal. Use the optional “Subtract service charge” toggle to remove automatic gratuities before the tip calculator applies your percentage.',
  },
  {
    question: 'How do I handle large groups?',
    answer:
      'Enter the number of guests in the group tip calculator field. The calculator splits the total, including tip, so everyone can send the exact amount right away.',
  },
  {
    question: 'Can I add a fixed amount rather than a percentage?',
    answer:
      'Yes. Switch to custom amount mode to add or remove a flat tip. The restaurant tip calculator updates the effective percentage so you can double-check etiquette.',
  },
];

const calculateTip = ({
  billAmount,
  tipPercentage,
  guests,
  roundUp,
  fixedTip,
  useFixedTip,
  removeServiceCharge,
  serviceChargeRate,
}) => {
  const baseBill = Math.max(billAmount, 0);
  const adjustedBill = removeServiceCharge
    ? baseBill / (1 + Math.max(serviceChargeRate, 0) / 100)
    : baseBill;

  const tipAmount = useFixedTip
    ? Math.max(fixedTip, 0)
    : adjustedBill * Math.max(tipPercentage, 0) / 100;

  let total = adjustedBill + tipAmount;
  if (roundUp) {
    total = Math.ceil(total);
  }

  const perPerson = Math.max(guests, 1) > 0 ? total / Math.max(guests, 1) : total;
  const effectiveRate = adjustedBill > 0 ? (tipAmount / adjustedBill) * 100 : 0;

  return {
    adjustedBill,
    tipAmount,
    total,
    perPerson,
    effectiveRate,
  };
};

export default function TipCalculatorPage() {
  const [inputs, setInputs] = useState({
    billAmount: 68.5,
    tipPercentage: 12.5,
    guests: 2,
    roundUp: false,
    useFixedTip: false,
    fixedTip: 5,
    removeServiceCharge: false,
    serviceChargeRate: 12.5,
  });

  const results = useMemo(
    () =>
      calculateTip({
        billAmount: Number(inputs.billAmount) || 0,
        tipPercentage: Number(inputs.tipPercentage) || 0,
        guests: Number(inputs.guests) || 1,
        roundUp: inputs.roundUp,
        useFixedTip: inputs.useFixedTip,
        fixedTip: Number(inputs.fixedTip) || 0,
        removeServiceCharge: inputs.removeServiceCharge,
        serviceChargeRate: Number(inputs.serviceChargeRate) || 0,
      }),
    [inputs]
  );

  const toggleBoolean = (field) =>
    setInputs((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));

  const resetAll = () =>
    setInputs({
      billAmount: 68.5,
      tipPercentage: 12.5,
      guests: 2,
      roundUp: false,
      useFixedTip: false,
      fixedTip: 5,
      removeServiceCharge: false,
      serviceChargeRate: 12.5,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Tip Calculator | Restaurant Tip Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Tip Calculator | Restaurant Tip Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tip Calculator | Restaurant Tip Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Tip Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Split a bill with a tip calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Tip Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Calculate gratuities in seconds, split the bill by headcount, and share round-ups so the group
            stays in sync.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Bill details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="billAmount">Bill total (£)</Label>
                  <Input
                    id="billAmount"
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={inputs.billAmount}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        billAmount: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tipPercentage">Tip percentage</Label>
                  <Slider
                    id="tipPercentage"
                    className="mt-3"
                    value={[Number(inputs.tipPercentage)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        tipPercentage: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={30}
                    step={0.5}
                    disabled={inputs.useFixedTip}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.tipPercentage.toFixed(1)}%</span>
                    <span>30%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of guests</Label>
                  <Slider
                    id="guests"
                    className="mt-3"
                    value={[Number(inputs.guests)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        guests: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={1}
                    max={12}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1</span>
                    <span>{inputs.guests}</span>
                    <span>12</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Tip options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Use fixed tip amount</Label>
                  <Button variant={inputs.useFixedTip ? 'default' : 'outline'} onClick={() => toggleBoolean('useFixedTip')}>
                    {inputs.useFixedTip ? 'Fixed amount' : 'Percentage'}
                  </Button>
                </div>
                {inputs.useFixedTip && (
                  <div className="space-y-2">
                    <Label htmlFor="fixedTip">Tip amount (£)</Label>
                    <Input
                      id="fixedTip"
                      type="number"
                      min="0"
                      step="0.1"
                      inputMode="decimal"
                      value={inputs.fixedTip}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          fixedTip: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Round total up</Label>
                  <Button variant={inputs.roundUp ? 'default' : 'outline'} onClick={() => toggleBoolean('roundUp')}>
                    {inputs.roundUp ? 'Rounded' : 'Exact'}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="font-medium">Remove service charge {`(${inputs.serviceChargeRate.toFixed(1)}%)`}</Label>
                  <Button
                    variant={inputs.removeServiceCharge ? 'default' : 'outline'}
                    onClick={() => toggleBoolean('removeServiceCharge')}
                  >
                    {inputs.removeServiceCharge ? 'Removed' : 'Included'}
                  </Button>
                </div>
                {inputs.removeServiceCharge && (
                  <div className="space-y-2">
                    <Label htmlFor="serviceChargeRate">Service charge rate (%)</Label>
                    <Input
                      id="serviceChargeRate"
                      type="number"
                      min="0"
                      step="0.5"
                      inputMode="decimal"
                      value={inputs.serviceChargeRate}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          serviceChargeRate: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Group tip summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Adjusted bill</span>
                  <span>{currencyFormatter.format(results.adjustedBill)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>
                    Tip {inputs.useFixedTip ? '(fixed)' : `(${inputs.tipPercentage.toFixed(1)}%)`}
                  </span>
                  <span>{currencyFormatter.format(results.tipAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total</span>
                  <span>{currencyFormatter.format(results.total)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Per person ({inputs.guests})</span>
                  <span>{currencyFormatter.format(results.perPerson)}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Effective tip rate {results.effectiveRate.toFixed(2)}%
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
                Restaurant tip calculator best practices
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Always double-check whether service is already included before adding more. The restaurant
                tip calculator makes it simple to remove automatic charges and replace them with your own
                figure when you prefer.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Tip percentage calculator etiquette
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Switch the tip percentage calculator slider to align with local customs or service quality.
                Use preset percentages like 10%, 12.5%, and 20% for faster decisions.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Bill tip calculator for travel
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                When travelling, enter the bill in local currency and note the effective tip rate. The bill tip
                calculator ensures you comply with international norms without guesswork.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={tipFaqs} />
            </section>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset calculator
            </Button>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
