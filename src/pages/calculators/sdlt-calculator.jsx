import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Landmark, Info, Percent, ClipboardList } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'stamp duty calculator',
  'sdlt calculator',
  'uk stamp duty calculator',
  'stamp duty',
  'stamp duty rates',
];

const metaDescription =
  'Use our SDLT calculator and stamp duty calculator to estimate UK stamp duty, compare stamp duty rates, and plan completion funds.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/sdlt-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const purchaseBandsStandard = [
  { threshold: 0, rate: 0 },
  { threshold: 250000, rate: 0.05 },
  { threshold: 925000, rate: 0.1 },
  { threshold: 1500000, rate: 0.12 },
];

const purchaseBandsFirstTime = [
  { threshold: 0, rate: 0 },
  { threshold: 425000, rate: 0 },
  { threshold: 625000, rate: 0.05 },
  { threshold: 925000, rate: 0.1 },
  { threshold: 1500000, rate: 0.12 },
];

const purchaseBandsAdditional = [
  { threshold: 0, rate: 0.03 },
  { threshold: 250000, rate: 0.08 },
  { threshold: 925000, rate: 0.13 },
  { threshold: 1500000, rate: 0.15 },
];

const sdltFaqs = [
  {
    question: 'Which SDLT rate applies to my purchase?',
    answer:
      'Use the buttons above to select Standard, First-Time Buyer, or Additional Property. The SDLT calculator automatically toggles between the correct stamp duty rates for each scenario.',
  },
  {
    question: 'Do first-time buyers pay stamp duty?',
    answer:
      'First-time buyers pay no SDLT up to £425,000 and 5% on the slice between £425,000 and £625,000. Above £625,000 the standard stamp duty rates apply on the whole purchase price.',
  },
  {
    question: 'How do surcharges affect buy-to-let properties?',
    answer:
      'Additional properties attract a 3% surcharge on every band. Toggle “Additional property” to see how much extra SDLT you will pay on top of the standard stamp duty calculator results.',
  },
];

const calculateStampDuty = ({ price, buyerType, additionalProperty }) => {
  const purchasePrice = Math.max(price, 0);
  const firstTimeEligible = buyerType === 'firstTime' && purchasePrice <= 625000;

  let bands;
  if (additionalProperty) {
    bands = purchaseBandsAdditional;
  } else if (firstTimeEligible) {
    bands = purchaseBandsFirstTime;
  } else {
    bands = purchaseBandsStandard;
  }

  let remaining = purchasePrice;
  let previousThreshold = bands[0].threshold;
  const breakdown = [];
  let totalTax = 0;

  for (let index = 1; index < bands.length; index += 1) {
    if (remaining <= 0) break;
    const currentBand = bands[index];
    const bandUpper = Math.min(currentBand.threshold, purchasePrice);
    const taxableAmount = Math.max(bandUpper - previousThreshold, 0);
    if (taxableAmount > 0) {
      const rate = bands[index - 1].rate;
      const tax = taxableAmount * rate;
      breakdown.push({
        from: previousThreshold,
        to: bandUpper,
        taxable: taxableAmount,
        rate,
        tax,
      });
      totalTax += tax;
      remaining -= taxableAmount;
    }
    previousThreshold = currentBand.threshold;
  }

  if (remaining > 0) {
    const rate = bands[bands.length - 1].rate;
    const tax = remaining * rate;
    breakdown.push({
      from: previousThreshold,
      to: purchasePrice,
      taxable: remaining,
      rate,
      tax,
    });
    totalTax += tax;
  }

  const effectiveRate = purchasePrice > 0 ? totalTax / purchasePrice : 0;

  return {
    price: purchasePrice,
    totalTax,
    effectiveRate,
    breakdown,
  };
};

export default function SDLTCalculatorPage() {
  const [inputs, setInputs] = useState({
    price: 450000,
    buyerType: 'standard',
    additionalProperty: false,
  });

  const results = useMemo(
    () =>
      calculateStampDuty({
        price: Number(inputs.price) || 0,
        buyerType: inputs.buyerType,
        additionalProperty: inputs.additionalProperty,
      }),
    [inputs]
  );

  const setBuyerType = (type) =>
    setInputs((prev) => ({
      ...prev,
      buyerType: type,
    }));

  const toggleAdditional = () =>
    setInputs((prev) => ({
      ...prev,
      additionalProperty: !prev.additionalProperty,
    }));

  const resetAll = () =>
    setInputs({
      price: 450000,
      buyerType: 'standard',
      additionalProperty: false,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>SDLT Calculator | Stamp Duty Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="SDLT Calculator | Stamp Duty Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="SDLT Calculator | Stamp Duty Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'SDLT Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate UK stamp duty with an SDLT calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            SDLT Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Work out UK stamp duty in seconds, compare surcharge scenarios, and prepare completion
            funds with confidence.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Purchase price
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Property price (£)</Label>
                  <Slider
                    id="price"
                    className="mt-3"
                    value={[Number(inputs.price)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        price: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={75000}
                    max={2000000}
                    step={5000}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>£75k</span>
                    <span>{currencyFormatter.format(inputs.price)}</span>
                    <span>£2m</span>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <Button
                    type="button"
                    variant={inputs.buyerType === 'standard' ? 'default' : 'outline'}
                    onClick={() => setBuyerType('standard')}
                  >
                    Standard
                  </Button>
                  <Button
                    type="button"
                    variant={inputs.buyerType === 'firstTime' ? 'default' : 'outline'}
                    onClick={() => setBuyerType('firstTime')}
                  >
                    First-time buyer
                  </Button>
                  <Button
                    type="button"
                    variant={inputs.buyerType === 'nonResident' ? 'default' : 'outline'}
                    onClick={() => setBuyerType('nonResident')}
                  >
                    Non-UK resident
                  </Button>
                </div>

                <div className="flex items-center justify-between rounded-md border border-indigo-200 bg-indigo-50 p-4 text-sm shadow-sm dark:border-indigo-800 dark:bg-indigo-900/30">
                  <span>Additional property surcharge</span>
                  <Button type="button" variant={inputs.additionalProperty ? 'default' : 'outline'} onClick={toggleAdditional}>
                    {inputs.additionalProperty ? 'Included' : 'Excluded'}
                  </Button>
                </div>

                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example purchase
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Landmark className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Stamp duty summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total SDLT</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalTax)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Effective rate</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentFormatter.format(results.effectiveRate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Band breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {results.breakdown.length === 0 ? (
                  <p>No SDLT due at this price point.</p>
                ) : (
                  results.breakdown.map((band, index) => (
                    <div
                      key={`${band.from}-${band.to}-${index}`}
                      className="flex items-center justify-between rounded-md border border-indigo-200 bg-white p-3 dark:border-indigo-800 dark:bg-indigo-950/30"
                    >
                      <span>
                        £{band.from.toLocaleString()} – £{band.to.toLocaleString()} @{' '}
                        {(band.rate * 100).toFixed(1)}%
                      </span>
                      <span>{currencyFormatter.format(band.tax)}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Stamp duty guidance and stamp duty rates
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Cross-check this uk stamp duty calculator output with your solicitor’s quote. Stamp duty
                rates can change at Budget time, so rerun the numbers before exchange to avoid shortfalls.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Stamp duty planning for completion
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Add the SDLT to your completion statement alongside legal fees and deposits. If buying a
                second property, set cash aside for the surcharge and plan how to reclaim it if the main
                residence changes within HMRC deadlines.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={sdltFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
