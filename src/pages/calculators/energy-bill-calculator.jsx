import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Zap, Flame, Home } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['energy bill calculator', 'electricity bill calculator', 'gas bill calculator'];

const metaDescription =
  'Use our energy bill calculator to estimate energy costs, compare electricity bill calculator and gas bill calculator results, and plan monthly payments with confidence.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/energy-bill-calculator';
const schemaKeywords = keywords;

const MONTHS_PER_YEAR = 12;

const formatCurrency = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const energyFaqs = [
  {
    question: 'How accurate is this energy bill calculator?',
    answer:
      'The calculator uses your unit rates and standing charges to model bills. Enter readings directly from your meter or smart app for the most precise results.',
  },
  {
    question: 'How do I reduce my electricity and gas bills?',
    answer:
      'Improve insulation, upgrade to energy-efficient appliances, and shift usage to off-peak times if you have a time-of-use tariff. Regularly compare supplier deals to ensure you are on the best rate.',
  },
  {
    question: 'What if I only have electricity or gas?',
    answer:
      'Set the unused energy type to zero. The calculator will ignore that section, providing results for the fuel you pay for.',
  },
];

const calculateEnergyBill = ({
  electricityUsage,
  electricityUnitRate,
  electricityStandingCharge,
  gasUsage,
  gasUnitRate,
  gasStandingCharge,
  vatRate,
  smoothingBuffer,
}) => {
  const electricityCost = electricityUsage * electricityUnitRate + electricityStandingCharge * 30.4; // approx monthly days
  const gasCost = gasUsage * gasUnitRate + gasStandingCharge * 30.4;
  const subtotal = electricityCost + gasCost;
  const vatAmount = subtotal * (vatRate / 100);
  const monthlyTotal = subtotal + vatAmount + smoothingBuffer;
  const annualTotal = monthlyTotal * MONTHS_PER_YEAR;

  return {
    electricityCost,
    gasCost,
    subtotal,
    vatAmount,
    monthlyTotal,
    annualTotal,
  };
};

export default function EnergyBillCalculatorPage() {
  const [inputs, setInputs] = useState({
    electricityUsage: 310, // kWh per month
    electricityUnitRate: 0.28, // £/kWh
    electricityStandingCharge: 0.45, // £/day
    gasUsage: 520, // kWh per month
    gasUnitRate: 0.09,
    gasStandingCharge: 0.3,
    vatRate: 5,
    smoothingBuffer: 20,
  });

  const results = useMemo(() => calculateEnergyBill(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      electricityUsage: 310,
      electricityUnitRate: 0.28,
      electricityStandingCharge: 0.45,
      gasUsage: 520,
      gasUnitRate: 0.09,
      gasStandingCharge: 0.3,
      vatRate: 5,
      smoothingBuffer: 20,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Energy Bill Calculator | Electricity Bill Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Energy Bill Calculator | Electricity Bill Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Energy Bill Calculator | Electricity Bill Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Energy Bill Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate energy bills',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Energy Bill Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Estimate your monthly and annual electricity and gas costs, including VAT and standing
            charges, so you always know what to budget for.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Tariff Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label
                  htmlFor="electricityUsage"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Zap className="h-4 w-4 text-indigo-500" />
                  Electricity usage (kWh/month)
                </Label>
                <Input
                  id="electricityUsage"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.electricityUsage}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, electricityUsage: Number(event.target.value) }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="electricityUnitRate" className="text-sm font-medium">
                    Electricity unit rate (£/kWh)
                  </Label>
                  <Input
                    id="electricityUnitRate"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    step="0.001"
                    value={inputs.electricityUnitRate}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        electricityUnitRate: Number(event.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="electricityStandingCharge" className="text-sm font-medium">
                    Electricity standing charge (£/day)
                  </Label>
                  <Input
                    id="electricityStandingCharge"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    step="0.001"
                    value={inputs.electricityStandingCharge}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        electricityStandingCharge: Number(event.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900" />

              <div>
                <Label htmlFor="gasUsage" className="text-sm font-medium flex items-center gap-2">
                  <Flame className="h-4 w-4 text-indigo-500" />
                  Gas usage (kWh/month)
                </Label>
                <Input
                  id="gasUsage"
                  type="number"
                  min={0}
                  inputMode=""
                  value={inputs.gasUsage}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, gasUsage: Number(event.target.value) }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gasUnitRate" className="text-sm font-medium">
                    Gas unit rate (£/kWh)
                  </Label>
                  <Input
                    id="gasUnitRate"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    step="0.001"
                    value={inputs.gasUnitRate}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, gasUnitRate: Number(event.target.value) }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="gasStandingCharge" className="text-sm font-medium">
                    Gas standing charge (£/day)
                  </Label>
                  <Input
                    id="gasStandingCharge"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    step="0.001"
                    value={inputs.gasStandingCharge}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        gasStandingCharge: Number(event.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-indigo-100 dark:border-indigo-900" />

              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  VAT rate
                  <span className="text-indigo-600 font-semibold">{inputs.vatRate}%</span>
                </Label>
                <Slider
                  value={[inputs.vatRate]}
                  onValueChange={(value) => setInputs((prev) => ({ ...prev, vatRate: value[0] }))}
                  min={0}
                  max={20}
                  step={1}
                />
              </div>

              <div>
                <Label
                  htmlFor="smoothingBuffer"
                  className="text-sm font-medium flex justify-between items-center"
                >
                  Monthly smoothing buffer (£)
                  <span className="text-indigo-600 font-semibold">
                    £{inputs.smoothingBuffer.toFixed(0)}
                  </span>
                </Label>
                <Slider
                  value={[inputs.smoothingBuffer]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, smoothingBuffer: value[0] }))
                  }
                  min={0}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Adds a little extra each month to smooth seasonal usage or price spikes.
                </p>
              </div>

              <Button variant="outline" onClick={resetInputs} className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <Home className="h-5 w-5" />
                  Energy Bill Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Electricity/month</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(results.electricityCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Gas/month</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(results.gasCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Monthly total</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(results.monthlyTotal)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Annual total</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {formatCurrency(results.annualTotal)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Monthly Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Electricity usage + standing charge</span>
                  <span>{formatCurrency(results.electricityCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gas usage + standing charge</span>
                  <span>{formatCurrency(results.gasCost)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Subtotal before VAT</span>
                  <span>{formatCurrency(results.subtotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>VAT ({inputs.vatRate}%)</span>
                  <span>{formatCurrency(results.vatAmount)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Smoothing buffer</span>
                  <span>{formatCurrency(inputs.smoothingBuffer)}</span>
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
                Electricity bill calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Track kWh each month using a smart meter or app. The electricity bill calculator
                shows how adjusting usage or switching tariffs can shrink your annual spend.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Gas bill calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use thermostat schedules, bleeding radiators, and insulation checks to reduce the
                gas bill calculator forecast. Re-run the numbers after improvements to quantify
                savings.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={energyFaqs} />
        </div>
      </section>
    </div>
  );
}
