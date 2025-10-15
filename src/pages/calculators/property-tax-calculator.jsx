import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Landmark, Percent, Info } from 'lucide-react';

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
  'tax calculator',
  'sdlt calculator',
  'property tax calculator',
  'uk stamp duty calculator',
  'tax rate calculator',
  'land transfer tax calculator',
];

const metaDescription =
  'Use our property tax calculator powered by a stamp duty calculator, tax calculator, and sdlt calculator to work out purchase taxes before completion.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/property-tax-calculator';
const schemaKeywords = keywords.slice(0, 5);

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

const propertyTaxFaqs = [
  {
    question: 'Which rate should first-time buyers use?',
    answer:
      'Enter the purchase price and choose the first-time buyer option. Relief applies on homes up to £625,000 and removes tax up to £425,000. For higher values the calculator automatically switches to standard rates.',
  },
  {
    question: 'How do additional property surcharges work?',
    answer:
      'Second homes and buy-to-lets carry a 3% surcharge on each SDLT band. Select “Additional property” to see the uplift and the difference compared with the standard rates.',
  },
  {
    question: 'Are there regional variations?',
    answer:
      'Yes. Scotland and Wales operate Land and Buildings Transaction Tax (LBTT) and Land Transaction Tax (LTT). Use the land transfer tax calculator note below to adjust the figures to your devolved nation thresholds.',
  },
];

const calculateStampDuty = ({ price, buyerType, isAdditionalProperty, leasePremium }) => {
  const purchasePrice = Math.max(Number(price) || 0, 0);
  const premium = Math.max(Number(leasePremium) || 0, 0);
  const taxableConsideration = purchasePrice + premium;

  const firstTimeEligible = buyerType === 'firstTime' && purchasePrice <= 625000;
  let bands;

  if (isAdditionalProperty) {
    bands = purchaseBandsAdditional;
  } else if (firstTimeEligible) {
    bands = purchaseBandsFirstTime;
  } else {
    bands = purchaseBandsStandard;
  }

  let remaining = taxableConsideration;
  let previousThreshold = 0;
  const breakdown = [];
  let totalTax = 0;

  bands.forEach((band, index) => {
    if (remaining <= 0) return;
    const nextThreshold = band.threshold;

    if (index === 0) {
      previousThreshold = band.threshold;
      return;
    }

    const bandLower = previousThreshold;
    const bandUpper = Math.min(nextThreshold, taxableConsideration);
    const taxableAmount = Math.max(bandUpper - bandLower, 0);

    if (taxableAmount > 0) {
      const tax = taxableAmount * bands[index - 1].rate;
      breakdown.push({
        from: bandLower,
        to: bandUpper,
        rate: bands[index - 1].rate,
        taxable: taxableAmount,
        tax,
      });
      totalTax += tax;
    }
    previousThreshold = nextThreshold;
    remaining -= taxableAmount;
  });

  if (remaining > 0) {
    const topBandRate = bands[bands.length - 1].rate;
    const tax = remaining * topBandRate;
    breakdown.push({
      from: bands[bands.length - 1].threshold,
      to: taxableConsideration,
      rate: topBandRate,
      taxable: remaining,
      tax,
    });
    totalTax += tax;
  }

  const effectiveRate = taxableConsideration > 0 ? totalTax / taxableConsideration : 0;

  return {
    price: purchasePrice,
    totalTax,
    effectiveRate,
    breakdown,
    taxableConsideration,
  };
};

export default function PropertyTaxCalculatorPage() {
  const [inputs, setInputs] = useState({
    price: 475000,
    buyerType: 'standard',
    isAdditionalProperty: false,
    leasePremium: 0,
  });

  const results = useMemo(() => calculateStampDuty(inputs), [inputs]);

  const setBuyerType = (type) => {
    setInputs((prev) => ({
      ...prev,
      buyerType: type,
    }));
  };

  const toggleAdditional = () => {
    setInputs((prev) => ({
      ...prev,
      isAdditionalProperty: !prev.isAdditionalProperty,
    }));
  };

  const resetAll = () =>
    setInputs({
      price: 475000,
      buyerType: 'standard',
      isAdditionalProperty: false,
      leasePremium: 0,
    });

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Property Tax Calculator | Tax Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Property Tax Calculator | Tax Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Property Tax Calculator | Tax Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Property Tax Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate stamp duty with a UK property tax calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Property Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Quickly estimate UK stamp duty, additional property surcharges, and lease premiums before you
            exchange contracts.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Purchase details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="price">Purchase price (£)</Label>
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
                    min={50000}
                    max={2000000}
                    step={5000}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>£50k</span>
                    <span>{currencyFormatter.format(inputs.price)}</span>
                    <span>£2m</span>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <Button
                    type="button"
                    variant={inputs.buyerType === 'standard' ? 'default' : 'outline'}
                    onClick={() => setBuyerType('standard')}
                  >
                    Standard buyer
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
                <div className="space-y-2">
                  <Label htmlFor="leasePremium">Lease premium (£, if applicable)</Label>
                  <Input
                    id="leasePremium"
                    type="number"
                    min="0"
                    step="500"
                    inputMode="decimal"
                    value={inputs.leasePremium}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        leasePremium: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between rounded-md border border-indigo-200 bg-indigo-50 p-4 text-sm dark:border-indigo-800 dark:bg-indigo-900/30">
                  <span>Additional property surcharge</span>
                  <Button type="button" variant={inputs.isAdditionalProperty ? 'default' : 'outline'} onClick={toggleAdditional}>
                    {inputs.isAdditionalProperty ? 'Included' : 'Excluded'}
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
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Stamp duty summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Taxable consideration</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.taxableConsideration)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total SDLT due</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalTax)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30 md:col-span-2">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Effective rate</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentFormatter.format(results.effectiveRate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Band-by-band breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {results.breakdown.length === 0 ? (
                  <p>No SDLT is due at this price point.</p>
                ) : (
                  results.breakdown.map((band, index) => (
                    <div
                      key={`${band.from}-${band.to}-${index}`}
                      className="flex items-center justify-between rounded-md border border-indigo-200 bg-white p-3 dark:border-indigo-800 dark:bg-indigo-950/30"
                    >
                      <span>
                        £{band.from.toLocaleString()} - £{band.to.toLocaleString()} @{' '}
                        {(band.rate * 100).toFixed(1)}%
                      </span>
                      <span>{currencyFormatter.format(band.tax)}</span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Landmark className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Rate comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Switching to the additional property surcharge adds 3 percentage points to each SDLT band.
                  Use the toggle to reveal how that uplift changes the tax rate calculator output for your
                  purchase price.
                </p>
                <p>
                  Buying abroad or in devolved nations? Map their thresholds into the land transfer tax
                  calculator fields so your projections match the local rules.
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
                UK stamp duty calculator checklist
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Save a copy of this property tax calculator output for your solicitor, then double check the
                figures before completion in case a price renegotiation moves you into the next band.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Next steps with your lender
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Share the sdlt calculator result with your broker so they can confirm funds on account. It
                keeps your property tax calculator estimates aligned with lender requirements and avoids last
                minute surprises.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={propertyTaxFaqs} />
        </div>
      </section>
    </div>
  );
}
