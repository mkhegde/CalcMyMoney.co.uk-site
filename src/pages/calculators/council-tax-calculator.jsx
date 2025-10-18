import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, MapPin, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/council-tax-calculator';

const schemaKeywords = [
  'Property Valuation',
  'Annual Charge',
  'Exemptions',
  'Council Services',
  'UK Rates',
];

const TAX_BANDS = [
  { band: 'A', multiplier: 6 / 9 },
  { band: 'B', multiplier: 7 / 9 },
  { band: 'C', multiplier: 8 / 9 },
  { band: 'D', multiplier: 1 },
  { band: 'E', multiplier: 11 / 9 },
  { band: 'F', multiplier: 13 / 9 },
  { band: 'G', multiplier: 15 / 9 },
  { band: 'H', multiplier: 18 / 9 },
];

const DISCOUNT_OPTIONS = [
  { value: 'none', label: 'No discount', percentage: 0 },
  { value: 'single', label: 'Single person discount (25%)', percentage: 25 },
  { value: 'student', label: 'Student exemption (100%)', percentage: 100 },
  { value: 'other25', label: 'Other 25% discount', percentage: 25 },
  { value: 'other50', label: 'Other 50% discount', percentage: 50 },
];

const faqItems = [
  {
    question: 'How is council tax calculated for my property?',
    answer:
      'Each property is allocated a valuation band (A to H) based on its April 1991 value in England and Scotland, or April 2003 in Wales. Your local authority sets a Band D rate, and other bands are charged as a fraction or multiple of that rate.',
  },
  {
    question: 'Can I get a single person discount?',
    answer:
      'If only one adult lives in a property, the council tax bill is reduced by 25%. Use the single person discount option to reflect this reduction.',
  },
  {
    question: 'What exemptions exist?',
    answer:
      'Full-time students, certain care leavers, and properties left empty for specific reasons may qualify for exemptions. Check with your local government office for the status that applies to your household.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function CouncilTaxCalculator() {
  const [inputs, setInputs] = useState({
    band: 'D',
    localBandDCharge: '2050',
    parishPrecept: '80',
    adultCount: '2',
    discountCode: 'none',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      band: 'D',
      localBandDCharge: '2050',
      parishPrecept: '80',
      adultCount: '2',
      discountCode: 'none',
    });
  }, []);

  const results = useMemo(() => {
    const selectedBand =
      TAX_BANDS.find((bandInfo) => bandInfo.band === inputs.band) || TAX_BANDS[3];
    const baseBandD = Number(inputs.localBandDCharge) || 0;
    const parishPrecept = Number(inputs.parishPrecept) || 0;
    const adultCount = Math.max(0, Number(inputs.adultCount) || 0);
    const discountOption =
      DISCOUNT_OPTIONS.find((option) => option.value === inputs.discountCode) ||
      DISCOUNT_OPTIONS[0];

    const annualBeforeDiscount = baseBandD * selectedBand.multiplier + parishPrecept;
    let discountPercentage = discountOption.percentage;
    if (discountOption.value === 'none' && adultCount === 1) {
      // Auto single-person 25% discount if only one adult and no other discount selected
      discountPercentage = 25;
    }
    const annualDiscount = (annualBeforeDiscount * discountPercentage) / 100;
    const annualPayable = Math.max(0, annualBeforeDiscount - annualDiscount);
    const monthlyPayable = annualPayable / 12;

    return {
      annualBeforeDiscount,
      discountPercentage,
      annualDiscount,
      annualPayable,
      monthlyPayable,
      bandMultiplier: selectedBand.multiplier,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Council Tax &amp; Local Authority Tax Calculator</title>
        <meta
          name="description"
          content="Council Tax Calculator showing tax bands, discounts, and annual charges for UK households. Estimate your local authority tax bill quickly."
        />
        <meta name="keywords" content="Council Tax Calculator, Tax Bands, Discounts" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GovernmentService',
              name: 'Council Tax Calculator',
              description:
                'Tool for estimating UK council tax based on property valuation bands, annual charges, exemptions, and discounts for local authority services.',
              areaServed: 'GB',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Council Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate council tax, review council tax bands, and estimate property bills with
            discounts applied for your household.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Council Tax Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium">Property valuation band</Label>
                <Select
                  value={inputs.band}
                  onValueChange={(value) => handleChange('band', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select band" />
                  </SelectTrigger>
                  <SelectContent>
                    {TAX_BANDS.map((bandInfo) => (
                      <SelectItem key={bandInfo.band} value={bandInfo.band}>
                        Band {bandInfo.band} (multiplier {bandInfo.multiplier.toFixed(2)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="localBandDCharge" className="text-sm font-medium">
                  Local authority Band D charge (GBP)
                </Label>
                <Input
                  id="localBandDCharge"
                  inputMode="decimal"
                  value={inputs.localBandDCharge}
                  onChange={(event) => handleChange('localBandDCharge', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="parishPrecept" className="text-sm font-medium">
                  Parish / town precept (GBP)
                </Label>
                <Input
                  id="parishPrecept"
                  inputMode="decimal"
                  value={inputs.parishPrecept}
                  onChange={(event) => handleChange('parishPrecept', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="adultCount" className="text-sm font-medium">
                  Number of adults in property
                </Label>
                <Input
                  id="adultCount"
                  inputMode="numeric"
                  value={inputs.adultCount}
                  onChange={(event) => handleChange('adultCount', event.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Discounts and exemptions</Label>
                <Select
                  value={inputs.discountCode}
                  onValueChange={(value) => handleChange('discountCode', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount" />
                  </SelectTrigger>
                  <SelectContent>
                    {DISCOUNT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Home className="h-5 w-5 text-indigo-500" />
                  Council Tax Bands Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Annual bill before discounts</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.annualBeforeDiscount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Band multiplier</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.bandMultiplier.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Discount applied</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.discountPercentage}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual discount value</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.annualDiscount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual council tax payable</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.annualPayable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly instalment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyPayable)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <MapPin className="h-5 w-5 text-indigo-500" />
                  Local Government Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Validate property valuation with your local government; appeals can only be made
                  under specific circumstances.
                </p>
                <p>
                  Council tax funds council services including waste collection, social care, and
                  emergency response coordination. Annual charges differ between authorities.
                </p>
                <p>
                  Single person discount and student exemptions reduce liability but may require
                  submitting evidence to the local authority each year.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Council Tax with Property Bill Clarity
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Enter your council tax bands and local authority charges to estimate your yearly property
            bill. Adjust for single person discount and council tax reductions to plan payments ahead
            of the financial year.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Council Tax Bands and Local Government Rates
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Each band represents a proportion of the Band D charge. Councils also levy parish or town
            precepts, so final bills differ even within the same valuation band.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Manage Discounts and Exemptions
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Ensure single person discount, student exemptions, or disability band reductions are
            reflected on your account. Updating the calculator helps households budget monthly
            property bills accurately.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
