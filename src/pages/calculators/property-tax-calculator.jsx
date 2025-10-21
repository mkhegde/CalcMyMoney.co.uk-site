import React, { useMemo, useState, useCallback, Suspense } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calculator, Home, Landmark, Percent, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/property-tax-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/property-tax-calculator';
const pageTitle = 'Property Tax Calculator UK | Stamp Duty & SDLT Estimator';
const metaDescription =
  'Use our UK property tax calculator to estimate stamp duty (SDLT), first-time buyer relief, and surcharges for additional properties or non-UK residents.';
const keywords = getMappedKeywords('Property Tax Calculator');

const faqItems = [
  {
    question: 'Which rate should first-time buyers use?',
    answer:
      'Choose the first-time buyer option and enter your purchase price. Relief applies on homes up to £625,000, removing SDLT up to £425,000. Above that threshold the calculator reverts to standard rates automatically.',
  },
  {
    question: 'How do additional property surcharges work?',
    answer:
      'Second homes and buy-to-let purchases attract a 3% surcharge on every SDLT band. Toggle the additional property switch to see the uplift against the standard calculation.',
  },
  {
    question: 'Do non-UK residents pay more stamp duty?',
    answer:
      'Yes. Non-UK residents currently pay a further 2% surcharge on top of standard or additional property rates. Select the non-UK resident buyer type to factor in the surcharge.',
  },
];

const emotionalMessage =
  'Plan your next purchase with confidence. This tool breaks down every pound of SDLT so you can budget conveyancing funds accurately and avoid last-minute surprises.';
const emotionalQuote = {
  text: "Buy land, they're not making it anymore.",
  author: 'Mark Twain',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'Explore all property & mortgage calculators',
    description: 'Compare mortgages, yields, and affordability tools in one place.',
  },
  {
    url: '/remortgage-calculator',
    label: 'Remortgage Calculator',
    description: 'Check whether switching deals offsets fees with lower repayments.',
  },
  {
    url: '/rental-yield-calculator',
    label: 'Rental Yield Calculator',
    description: 'Benchmark rental returns after fees, voids, and finance costs.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const SURCHARGE_ADDITIONAL = 0.03;
const SURCHARGE_NON_RESIDENT = 0.02;

const STANDARD_BANDS = [
  { from: 0, to: 250_000, rate: 0 },
  { from: 250_000, to: 925_000, rate: 0.05 },
  { from: 925_000, to: 1_500_000, rate: 0.1 },
  { from: 1_500_000, to: Number.POSITIVE_INFINITY, rate: 0.12 },
];

const FIRST_TIME_BANDS = [
  { from: 0, to: 425_000, rate: 0 },
  { from: 425_000, to: 625_000, rate: 0.05 },
  { from: 625_000, to: 925_000, rate: 0.1 },
  { from: 925_000, to: Number.POSITIVE_INFINITY, rate: 0.12 },
];

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const computeBandTax = (bands, consideration) => {
  let totalTax = 0;
  const breakdown = [];

  bands.forEach((band, index) => {
    if (consideration <= band.from) return;
    const upperBound = band.to === Number.POSITIVE_INFINITY ? consideration : Math.min(band.to, consideration);
    const taxable = Math.max(upperBound - band.from, 0);
    if (taxable <= 0) return;
    const tax = taxable * band.rate;
    breakdown.push({
      from: band.from,
      to: band.to === Number.POSITIVE_INFINITY ? null : band.to,
      rate: band.rate,
      taxable,
      tax,
      index,
    });
    totalTax += tax;
  });

  return { totalTax, breakdown };
};

const calculateStampDuty = (inputs) => {
  const purchasePrice = Math.max(parseNumber(inputs.purchasePrice), 0);
  const leasePremium = Math.max(parseNumber(inputs.leasePremium), 0);
  const buyerType = inputs.buyerType;
  const isAdditionalProperty = Boolean(inputs.isAdditionalProperty);

  const consideration = purchasePrice + leasePremium;
  const firstTimeEligible = buyerType === 'firstTime' && purchasePrice <= 625_000;

  const baseBands = firstTimeEligible ? FIRST_TIME_BANDS : STANDARD_BANDS;
  const surcharge =
    (isAdditionalProperty ? SURCHARGE_ADDITIONAL : 0) +
    (buyerType === 'nonResident' ? SURCHARGE_NON_RESIDENT : 0);

  const workingBands = baseBands.map((band) => ({
    from: band.from,
    to: band.to,
    rate: band.rate + surcharge,
  }));

  const { totalTax, breakdown } = computeBandTax(workingBands, consideration);
  const effectiveRate = consideration > 0 ? totalTax / consideration : 0;

  const comparisonBands = STANDARD_BANDS.map((band) => ({
    from: band.from,
    to: band.to,
    rate: band.rate + surcharge,
  }));
  const { totalTax: comparisonTax } = computeBandTax(comparisonBands, consideration);
  const reliefOrSurcharge = comparisonTax - totalTax;

  return {
    purchasePrice,
    leasePremium,
    consideration,
    buyerType,
    isAdditionalProperty,
    firstTimeEligible,
    totalTax,
    breakdown,
    effectiveRate,
    comparisonTax,
    reliefOrSurcharge,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  const csvRows = [
    ['Input', 'Value'],
    ['Purchase price (£)', inputs.purchasePrice],
    ['Lease premium (£)', inputs.leasePremium],
    ['Buyer type',
      results.buyerType === 'firstTime'
        ? 'First-time buyer'
        : results.buyerType === 'nonResident'
        ? 'Non-UK resident'
        : 'Standard buyer'],
    ['Additional property', results.isAdditionalProperty ? 'Yes' : 'No'],
    [],
    ['Output', 'Value'],
    ['Taxable consideration (£)', currencyFormatter.format(results.consideration)],
    ['Total SDLT (£)', currencyFormatter.format(results.totalTax)],
    ['Effective rate (%)', percentFormatter.format(results.effectiveRate)],
    ['Comparison tax (£)', currencyFormatter.format(results.comparisonTax)],
    [
      results.reliefOrSurcharge >= 0 ? 'Relief vs standard (£)' : 'Additional cost vs standard (£)',
      currencyFormatter.format(Math.abs(results.reliefOrSurcharge)),
    ],
    [],
    ['Band breakdown'],
    ['Band range', 'Rate', 'Taxable (£)', 'Tax due (£)'],
    ...results.breakdown.map((band) => [
      band.to
        ? `${currencyFormatter.format(band.from)} – ${currencyFormatter.format(band.to)}`
        : `${currencyFormatter.format(band.from)}+`,
      `${(band.rate * 100).toFixed(2)}%`,
      currencyFormatter.format(band.taxable),
      currencyFormatter.format(band.tax),
    ]),
  ];
  return csvRows;
};

const chartPalette = ['#3b82f6', '#10b981', '#6366f1', '#f97316', '#ef4444'];

const buildChartData = (results) => {
  if (!results || !Array.isArray(results.breakdown)) return [];
  return results.breakdown
    .filter((band) => band.tax > 0)
    .map((band, index) => ({
      name: band.to
        ? `${currencyFormatter.format(band.from)} – ${currencyFormatter.format(band.to)}`
        : `${currencyFormatter.format(band.from)}+`,
      value: band.tax,
      color: chartPalette[index % chartPalette.length],
    }));
};

const defaultInputs = {
  purchasePrice: '475,000',
  leasePremium: '0',
  buyerType: 'standard',
  isAdditionalProperty: false,
};

export default function PropertyTaxCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Property Tax Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Property Tax Calculator', url: pagePath },
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

  const handleBuyerTypeChange = useCallback((value) => {
    setInputs((prev) => ({ ...prev, buyerType: value }));
  }, []);

  const handleAdditionalToggle = useCallback((checked) => {
    setInputs((prev) => ({ ...prev, isAdditionalProperty: checked }));
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
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
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
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Property Tax Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate SDLT for purchases across England and Northern Ireland, including first-time buyer relief and surcharges for second homes or non-UK residents.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Home className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-950/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            footerColor="text-indigo-700 dark:text-indigo-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Landmark className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Purchase details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase price (£)</Label>
                      <Input
                        id="purchasePrice"
                        inputMode="decimal"
                        value={inputs.purchasePrice}
                        onChange={handleInputChange('purchasePrice')}
                        placeholder="e.g. 475,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leasePremium">Lease premium (£, if applicable)</Label>
                      <Input
                        id="leasePremium"
                        inputMode="decimal"
                        value={inputs.leasePremium}
                        onChange={handleInputChange('leasePremium')}
                        placeholder="e.g. 15,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Buyer type</Label>
                      <Select value={inputs.buyerType} onValueChange={handleBuyerTypeChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select buyer type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">Standard buyer</SelectItem>
                          <SelectItem value="firstTime">First-time buyer</SelectItem>
                          <SelectItem value="nonResident">Non-UK resident</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 dark:border-indigo-800 dark:bg-indigo-950/40">
                      <div>
                        <p className="text-sm font-medium text-indigo-900 dark:text-indigo-100">Additional property surcharge</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                          Applies to second homes and most buy-to-let purchases.
                        </p>
                      </div>
                      <Switch
                        checked={inputs.isAdditionalProperty}
                        onCheckedChange={handleAdditionalToggle}
                        aria-label="Toggle additional property surcharge"
                      />
                    </div>
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
                    Enter your purchase details and press <span className="font-semibold">Calculate SDLT</span> to see the full band-by-band property tax breakdown.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        SDLT summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Taxable consideration</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.consideration)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total SDLT due</p>
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
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Difference vs standard</p>
                        <p
                          className={`text-2xl font-semibold ${
                            results.reliefOrSurcharge < 0
                              ? 'text-rose-400'
                              : 'text-emerald-300'
                          }`}
                        >
                          {results.reliefOrSurcharge === 0
                            ? 'No change'
                            : `${results.reliefOrSurcharge > 0 ? '−' : '+'}${currencyFormatter.format(Math.abs(results.reliefOrSurcharge))}`}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="property-tax-calculation"
                          title="Property Tax Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Band breakdown
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
                        <ResultBreakdownChart
                          data={chartData}
                          title="Stamp Duty Band Breakdown"
                        />
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
                        SDLT is payable within 14 days of completion. Your solicitor will normally submit the return and arrange payment on your behalf.
                      </p>
                      <p>
                        Devolved nations have different property taxes (LBTT in Scotland, LTT in Wales). Adjust the calculation to mirror those thresholds when purchasing outside England and Northern Ireland.
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
