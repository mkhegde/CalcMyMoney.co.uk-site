import React, { useMemo, useState } from 'react';
import { Calculator, Home, MapPin, Percent, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart.jsx';

const keywords = ['council tax calculator', 'uk council tax', 'council tax bands'];

const metaDescription =
  'Estimate UK council tax by band, local authority rate, parish precepts, and discounts. Understand your annual, monthly, and weekly bills.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/council-tax-calculator';
const pagePath = '/calculators/council-tax-calculator';
const pageTitle = 'Council Tax Calculator | UK Band & Discount Estimator';

const faqItems = [
  {
    question: 'How is council tax calculated?',
    answer:
      'Each property sits in valuation bands A–H. The council sets a Band D rate, and other bands are a fraction or multiple of Band D. Parish precepts and adult discounts adjust the final bill.',
  },
  {
    question: 'Am I eligible for a discount?',
    answer:
      'Single adults, students, carers, and certain empty properties may qualify for discounts or exemptions. Select the relevant discount to estimate your reduced bill.',
  },
  {
    question: 'How often should I review my council tax bill?',
    answer:
      'Recalculate whenever your household changes, you move, or your local authority updates rates. Verifying the numbers helps you budget for monthly payments.',
  },
];

const emotionalMessage =
  'Council tax is one of the largest household bills. Plan it properly and you can set aside funds for savings instead of scrambling at year end.';

const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

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

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

function calculateCouncilTax({ band, bandDCharge, parishPrecept, discountCode }) {
  const bandInfo = TAX_BANDS.find((item) => item.band === band) ?? TAX_BANDS[3];
  const baseCharge = parseNumber(bandDCharge);
  const parishCharge = parseNumber(parishPrecept);
  const discount = DISCOUNT_OPTIONS.find((item) => item.value === discountCode) ?? DISCOUNT_OPTIONS[0];

  const annualChargeBeforeDiscount = baseCharge * bandInfo.multiplier + parishCharge;
  const discountAmount = (annualChargeBeforeDiscount * discount.percentage) / 100;
  const annualCharge = Math.max(annualChargeBeforeDiscount - discountAmount, 0);
  const monthlyCharge = annualCharge / 12;
  const weeklyCharge = annualCharge / 52;

  return {
    band,
    annualCharge,
    monthlyCharge,
    weeklyCharge,
    annualChargeBeforeDiscount,
    discountAmount,
    discountPercentage: discount.percentage,
  };
}

export default function CouncilTaxCalculatorPage() {
  const [inputs, setInputs] = useState({
    band: 'D',
    bandDCharge: '2,050',
    parishPrecept: '80',
    discountCode: 'none',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Council Tax Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Utilities & Tools Calculators', url: '/calculators#utilities-tools' },
      { name: 'Council Tax Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Annual council tax', value: results.annualCharge, color: '#0ea5e9' },
      { name: 'Discount applied', value: results.discountAmount, color: '#f97316' },
      { name: 'Parish precept', value: parseNumber(inputs.parishPrecept), color: '#22c55e' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated, inputs.parishPrecept]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBandChange = (value) => {
    setInputs((prev) => ({
      ...prev,
      band: value,
    }));
  };

  const handleDiscountChange = (value) => {
    setInputs((prev) => ({
      ...prev,
      discountCode: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateCouncilTax(inputs);
    setHasCalculated(true);
    setResults(computed);

    setCsvData([
      ['Band', computed.band],
      ['Band D charge', parseNumber(inputs.bandDCharge)],
      ['Parish precept', parseNumber(inputs.parishPrecept)],
      ['Discount (%)', computed.discountPercentage],
      ['Annual charge before discount', computed.annualChargeBeforeDiscount],
      ['Discount amount', computed.discountAmount],
      ['Final annual charge', computed.annualCharge],
      ['Monthly charge', computed.monthlyCharge],
      ['Weekly charge', computed.weeklyCharge],
    ]);
  };

  const handleReset = () => {
    setInputs({
      band: 'D',
      bandDCharge: '2,050',
      parishPrecept: '80',
      discountCode: 'none',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Council Tax Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate your council tax bill for any UK valuation band, apply single-person discounts, and see the monthly and weekly amounts you need to budget.
            </p>
          </header>

          <section className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:border-sky-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Keep your council bill predictable
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-900 shadow-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Property and household details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Valuation band</Label>
                      <Select value={inputs.band} onValueChange={handleBandChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select band" />
                        </SelectTrigger>
                        <SelectContent>
                          {TAX_BANDS.map((band) => (
                            <SelectItem key={band.band} value={band.band}>
                              Band {band.band}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bandDCharge">Local Band D charge (£)</Label>
                      <Input
                        id="bandDCharge"
                        inputMode="decimal"
                        value={inputs.bandDCharge}
                        onChange={handleInputChange('bandDCharge')}
                        placeholder="e.g. 2,050"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="parishPrecept">Parish / town precept (£)</Label>
                      <Input
                        id="parishPrecept"
                        inputMode="decimal"
                        value={inputs.parishPrecept}
                        onChange={handleInputChange('parishPrecept')}
                        placeholder="e.g. 80"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Discount or exemption</Label>
                      <Select value={inputs.discountCode} onValueChange={handleDiscountChange}>
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
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate council tax
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Pick your band, Band D charge, and discounts, then press{' '}
                    <span className="font-semibold">Calculate council tax</span> to see annual, monthly, and weekly amounts.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-sky-200 bg-white shadow-sm dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <MapPin className="h-5 w-5 text-sky-600 dark:text-sky-200" aria-hidden="true" />
                        Council tax summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Annual bill</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualCharge)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Monthly payments</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyCharge)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Weekly equivalent</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyCharge)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Discount applied</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.discountAmount)} ({results.discountPercentage}%)
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="council-tax-results"
                          title="Council tax calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Charge breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBreakdownChart data={chartData} title="Council tax allocation" />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Budget ahead for council tax
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Set aside the monthly amount in a separate account or switch to 12 instalments if your council allows it. Keep supporting documents to claim discounts you’re entitled to.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}

