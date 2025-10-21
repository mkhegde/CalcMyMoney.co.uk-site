import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Calculator, Landmark, Percent, Coins, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/sdlt-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/sdlt-calculator';
const pageTitle = 'SDLT Calculator UK | Stamp Duty Calculator for Buyers';
const metaDescription =
  'Estimate UK Stamp Duty Land Tax (SDLT) for residential purchases. Compare standard, first-time buyer, and additional property rates with our SDLT calculator.';
const keywords = getMappedKeywords('Stamp Duty Calculator');

const faqItems = [
  {
    question: 'Who qualifies for first-time buyer relief?',
    answer:
      'All buyers must be first-time buyers purchasing a property worth £625,000 or less. Relief removes SDLT on the first £425,000 and charges 5% on the slice up to £625,000.',
  },
  {
    question: 'How is the additional property surcharge applied?',
    answer:
      'An extra 3% SDLT applies to each band if you already own another property. Toggle the additional property option to see the difference in completion funds.',
  },
  {
    question: 'Do non-UK residents pay more SDLT?',
    answer:
      'Yes. Non-UK residents currently pay a 2% surcharge. Add this on top of the standard rates in negotiations and discuss with your solicitor for the latest guidance.',
  },
];

const emotionalMessage =
  'Buying a home is a milestone. Understanding stamp duty upfront keeps negotiations smooth and prevents last-minute surprises on completion day.';
const emotionalQuote = {
  text: 'The ache for home lives in all of us.',
  author: 'Maya Angelou',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'Property & mortgage calculators',
    description: 'Plan deposits, compare mortgages, and model home-buying costs in minutes.',
  },
  {
    url: '/calculators/mortgage-calculator',
    label: 'Mortgage Repayment Calculator',
    description: 'Estimate monthly repayments for your chosen loan amount and term.',
  },
  {
    url: '/calculators/property-tax-calculator',
    label: 'Property Tax Calculator',
    description: 'Check ongoing property taxes alongside your stamp duty bill.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
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

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateStampDuty = ({ price, buyerType, additionalProperty }) => {
  const purchasePrice = Math.max(parseNumber(price), 0);
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

  if (buyerType === 'nonResident' && purchasePrice > 0) {
    const surcharge = purchasePrice * 0.02;
    breakdown.push({
      from: 0,
      to: purchasePrice,
      taxable: purchasePrice,
      rate: 0.02,
      tax: surcharge,
      isSurcharge: true,
    });
    totalTax += surcharge;
  }

  const effectiveRate = purchasePrice > 0 ? totalTax / purchasePrice : 0;

  return {
    purchasePrice,
    totalTax,
    effectiveRate,
    breakdown,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  const rows = [
    ['Input', 'Value'],
    ['Property price (£)', inputs.price],
    ['Buyer type', inputs.buyerType],
    ['Additional property', inputs.additionalProperty ? 'Yes' : 'No'],
    [],
    ['Output', 'Value'],
    ['Total SDLT (£)', currencyFormatter.format(results.totalTax)],
    ['Effective rate (%)', percentFormatter.format(results.effectiveRate)],
    [],
    ['Band from (£)', 'Band to (£)', 'Taxable amount (£)', 'Rate (%)', 'Tax (£)'],
  ];

  results.breakdown.forEach((band) => {
    rows.push([
      currencyFormatter.format(band.from),
      currencyFormatter.format(band.to),
      currencyFormatter.format(band.taxable),
      percentFormatter.format(band.rate),
      currencyFormatter.format(band.tax),
    ]);
  });

  return rows;
};

const buildChartData = (results) => {
  if (!results) return [];
  return results.breakdown.map((band, index) => ({
    name: band.isSurcharge ? 'Non-UK surcharge' : `Band ${index + 1}`,
    value: band.tax,
    color: ['#0ea5e9', '#22c55e', '#6366f1', '#f97316'][index % 4],
  }));
};

export default function SDLTCalculatorPage() {
  const [inputs, setInputs] = useState({
    price: '450,000',
    buyerType: 'standard',
    additionalProperty: false,
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'SDLT Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'SDLT Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCheckboxToggle = useCallback((checked) => {
    setInputs((prev) => ({ ...prev, additionalProperty: Boolean(checked) }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateStampDuty(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({ price: '450,000', buyerType: 'standard', additionalProperty: false });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results), [results]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        keywords={keywords}
        articleTags={keywords}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                SDLT Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate stamp duty for first-time buyers, movers, or additional properties and plan your
              completion funds with confidence.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Landmark className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-900/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            footerColor="text-indigo-700 dark:text-indigo-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Purchase details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="price">Property price (£)</Label>
                    <Input
                      id="price"
                      inputMode="decimal"
                      value={inputs.price}
                      onChange={handleInputChange('price')}
                      placeholder="e.g. 450,000"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyerType">Buyer type</Label>
                    <select
                      id="buyerType"
                      value={inputs.buyerType}
                      onChange={handleInputChange('buyerType')}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="standard">Standard residential purchase</option>
                      <option value="firstTime">First-time buyer</option>
                      <option value="nonResident">Non-UK resident (apply surcharge)</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3 rounded-lg border border-indigo-200 bg-indigo-50 p-3 dark:border-indigo-800 dark:bg-indigo-900/30">
                    <Checkbox
                      id="additionalProperty"
                      checked={inputs.additionalProperty}
                      onCheckedChange={handleCheckboxToggle}
                    />
                    <Label htmlFor="additionalProperty" className="text-sm">
                      Include 3% additional property surcharge
                    </Label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate SDLT
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your property price and buyer type, then press
                    <span className="font-semibold"> Calculate SDLT</span> to view the full stamp duty
                    breakdown.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Landmark className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Stamp duty summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total SDLT</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Effective rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.effectiveRate)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="sdlt-calculation"
                          title="SDLT Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Band breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      {results.breakdown.map((band, index) => (
                        <div
                          key={band.from}
                          className="flex flex-col gap-1 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                        >
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span>
                              {band.isSurcharge
                                ? 'Non-UK surcharge'
                                : `Band ${index + 1} (${currencyFormatter.format(band.from)} - ${currencyFormatter.format(band.to)})`}
                            </span>
                            <span>{percentFormatter.format(band.rate)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span>Taxable amount</span>
                            <span>{currencyFormatter.format(band.taxable)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span>Tax due</span>
                            <span>{currencyFormatter.format(band.tax)}</span>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        SDLT distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart data={chartData} title="Stamp duty band distribution" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        SDLT rules can change at each Budget. Always confirm calculations with your
                        conveyancer before exchanging contracts, especially for complex transactions.
                      </p>
                      <p>
                        Non-UK residents currently pay a 2% surcharge. Add this to the result above if it
                        applies to your purchase.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
