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
import { Calculator, Building2, Percent, PiggyBank, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/rental-yield-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rental-yield-calculator';
const pageTitle = 'Rental Yield Calculator UK | Net & Gross Yield with Running Costs';
const metaDescription =
  'Analyse buy-to-let returns in the UK by combining rent, void periods, letting fees, maintenance, and mortgage interest to calculate gross, net, and cash-on-cash yield.';
const keywords = getMappedKeywords('Rental Yield Calculator');

const faqItems = [
  {
    question: 'How do I compare yields between regions?',
    answer:
      'Use identical expense assumptions for each property. Enter rent, letting fees, void periods, and mortgage interest so the net yield reflects the true return.',
  },
  {
    question: 'Should I include capital repayments?',
    answer:
      'This calculator focuses on annual income. Capital repayments increase your equity but are not treated as expenses here. Track them separately alongside long-term ROI plans.',
  },
  {
    question: 'What is an acceptable void period?',
    answer:
      'Many landlords model 2–4 weeks each year. Enter the weeks you expect between tenants so the calculator discounts rent accordingly.',
  },
];

const emotionalMessage =
  'Fine-tune your portfolio with clarity. Understand exactly how fees, voids, and finance costs impact your yield before you commit to the next purchase.';
const emotionalQuote = {
  text: 'Do not wait to strike till the iron is hot; but make it hot by striking.',
  author: 'William Butler Yeats',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'View all property calculators',
    description: 'Plan purchases, track yields, and forecast mortgage costs.',
  },
  {
    url: '/buy-to-let-mortgage-calculator',
    label: 'Buy-to-Let Mortgage Calculator',
    description: 'Check interest coverage and deposit requirements for new investments.',
  },
  {
    url: '/property-flipping-calculator',
    label: 'Property Flipping Calculator',
    description: 'Estimate renovation costs and profits on refurbishments.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 1,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateYield = (inputs) => {
  const propertyPrice = Math.max(parseNumber(inputs.propertyPrice), 0);
  const monthlyRent = Math.max(parseNumber(inputs.monthlyRent), 0);
  const rentVoidWeeks = Math.min(Math.max(parseNumber(inputs.rentVoidWeeks), 0), 52);
  const lettingFeePercent = Math.max(parseNumber(inputs.lettingFeePercent), 0) / 100;
  const monthlyMaintenance = Math.max(parseNumber(inputs.monthlyMaintenance), 0);
  const annualInsurance = Math.max(parseNumber(inputs.annualInsurance), 0);
  const annualServiceCharge = Math.max(parseNumber(inputs.annualServiceCharge), 0);
  const mortgageBalance = Math.max(parseNumber(inputs.mortgageBalance), 0);
  const mortgageRate = Math.max(parseNumber(inputs.mortgageRate), 0) / 100;
  const otherAnnualCosts = Math.max(parseNumber(inputs.otherAnnualCosts), 0);

  const grossRentAnnual = monthlyRent * 12;
  const rentAdjustmentFactor = (52 - rentVoidWeeks) / 52;
  const effectiveRentAnnual = grossRentAnnual * rentAdjustmentFactor;
  const lettingFeeAnnual = effectiveRentAnnual * lettingFeePercent;
  const maintenanceAnnual = monthlyMaintenance * 12;
  const mortgageInterestAnnual = mortgageBalance * mortgageRate;

  const totalExpenses =
    lettingFeeAnnual +
    maintenanceAnnual +
    annualInsurance +
    annualServiceCharge +
    mortgageInterestAnnual +
    otherAnnualCosts;

  const netIncomeAnnual = effectiveRentAnnual - totalExpenses;
  const netIncomeMonthly = netIncomeAnnual / 12;
  const grossYield = propertyPrice > 0 ? effectiveRentAnnual / propertyPrice : 0;
  const netYield = propertyPrice > 0 ? netIncomeAnnual / propertyPrice : 0;
  const equityInvested = Math.max(propertyPrice - mortgageBalance, 0);
  const cashOnCashReturn = equityInvested > 0 ? netIncomeAnnual / equityInvested : 0;

  return {
    propertyPrice,
    effectiveRentAnnual,
    grossRentAnnual,
    lettingFeeAnnual,
    maintenanceAnnual,
    mortgageInterestAnnual,
    annualInsurance,
    annualServiceCharge,
    otherAnnualCosts,
    totalExpenses,
    netIncomeAnnual,
    netIncomeMonthly,
    grossYield,
    netYield,
    cashOnCashReturn,
    equityInvested,
    rentVoidWeeks,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Purchase price (£)', inputs.propertyPrice],
    ['Monthly rent (£)', inputs.monthlyRent],
    ['Void period (weeks per year)', inputs.rentVoidWeeks],
    ['Letting fee (% of rent)', inputs.lettingFeePercent],
    ['Maintenance allowance (£ per month)', inputs.monthlyMaintenance],
    ['Insurance (£ per year)', inputs.annualInsurance],
    ['Service charge (£ per year)', inputs.annualServiceCharge],
    ['Outstanding mortgage (£)', inputs.mortgageBalance],
    ['Mortgage interest rate (% p.a.)', inputs.mortgageRate],
    ['Other annual costs (£)', inputs.otherAnnualCosts],
    [],
    ['Output', 'Value'],
    ['Effective annual rent (£)', currencyFormatter.format(results.effectiveRentAnnual)],
    ['Total expenses (£)', currencyFormatter.format(results.totalExpenses)],
    ['Net income (annual) (£)', currencyFormatter.format(results.netIncomeAnnual)],
    ['Net income (monthly) (£)', currencyFormatter.format(results.netIncomeMonthly)],
    ['Gross yield (%)', percentFormatter.format(results.grossYield)],
    ['Net yield (%)', percentFormatter.format(results.netYield)],
    ['Cash-on-cash return (%)', percentFormatter.format(results.cashOnCashReturn)],
  ];
};

const chartPalette = ['#10b981', '#f97316', '#6366f1', '#ef4444', '#14b8a6'];

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Effective rent', value: results.effectiveRentAnnual, color: chartPalette[0] },
    { name: 'Letting & management', value: results.lettingFeeAnnual, color: chartPalette[1] },
    { name: 'Maintenance & insurance', value: results.maintenanceAnnual + results.annualInsurance + results.annualServiceCharge, color: chartPalette[2] },
    { name: 'Mortgage interest', value: results.mortgageInterestAnnual, color: chartPalette[3] },
    { name: 'Net income', value: results.netIncomeAnnual, color: chartPalette[4] },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  propertyPrice: '265,000',
  monthlyRent: '1,450',
  rentVoidWeeks: '3',
  lettingFeePercent: '10',
  monthlyMaintenance: '180',
  annualInsurance: '520',
  annualServiceCharge: '960',
  mortgageBalance: '180,000',
  mortgageRate: '4.9',
  otherAnnualCosts: '450',
};

export default function RentalYieldCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Rental Yield Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Rental Yield Calculator', url: pagePath },
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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateYield(inputs);
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
                Rental Yield Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Combine rent, voids, fees, and finance costs to see the real return on your next buy-to-let investment.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Building2 className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Property & rent details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="propertyPrice">Purchase price (£)</Label>
                      <Input
                        id="propertyPrice"
                        inputMode="decimal"
                        value={inputs.propertyPrice}
                        onChange={handleInputChange('propertyPrice')}
                        placeholder="e.g. 265,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Expected monthly rent (£)</Label>
                      <Input
                        id="monthlyRent"
                        inputMode="decimal"
                        value={inputs.monthlyRent}
                        onChange={handleInputChange('monthlyRent')}
                        placeholder="e.g. 1,450"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="rentVoidWeeks">Void period (weeks per year)</Label>
                      <Input
                        id="rentVoidWeeks"
                        inputMode="decimal"
                        value={inputs.rentVoidWeeks}
                        onChange={handleInputChange('rentVoidWeeks')}
                        placeholder="e.g. 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lettingFeePercent">Letting fee (% of rent)</Label>
                      <Input
                        id="lettingFeePercent"
                        inputMode="decimal"
                        value={inputs.lettingFeePercent}
                        onChange={handleInputChange('lettingFeePercent')}
                        placeholder="e.g. 10"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyMaintenance">Maintenance allowance (£ per month)</Label>
                      <Input
                        id="monthlyMaintenance"
                        inputMode="decimal"
                        value={inputs.monthlyMaintenance}
                        onChange={handleInputChange('monthlyMaintenance')}
                        placeholder="e.g. 180"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualInsurance">Insurance (£ per year)</Label>
                      <Input
                        id="annualInsurance"
                        inputMode="decimal"
                        value={inputs.annualInsurance}
                        onChange={handleInputChange('annualInsurance')}
                        placeholder="e.g. 520"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="annualServiceCharge">Service charge / ground rent (£ per year)</Label>
                      <Input
                        id="annualServiceCharge"
                        inputMode="decimal"
                        value={inputs.annualServiceCharge}
                        onChange={handleInputChange('annualServiceCharge')}
                        placeholder="e.g. 960"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherAnnualCosts">Other annual costs (£)</Label>
                      <Input
                        id="otherAnnualCosts"
                        inputMode="decimal"
                        value={inputs.otherAnnualCosts}
                        onChange={handleInputChange('otherAnnualCosts')}
                        placeholder="e.g. 450"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mortgageBalance">Outstanding mortgage (£)</Label>
                      <Input
                        id="mortgageBalance"
                        inputMode="decimal"
                        value={inputs.mortgageBalance}
                        onChange={handleInputChange('mortgageBalance')}
                        placeholder="e.g. 180,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mortgageRate">Mortgage interest rate (% p.a.)</Label>
                      <Input
                        id="mortgageRate"
                        inputMode="decimal"
                        value={inputs.mortgageRate}
                        onChange={handleInputChange('mortgageRate')}
                        placeholder="e.g. 4.9"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate rental yield
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
                    Enter property and finance details, then press <span className="font-semibold">Calculate rental yield</span> to view gross, net, and cash-on-cash returns.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Yield summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Effective annual rent</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.effectiveRentAnnual)}</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-200">Voids: {results.rentVoidWeeks} weeks</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total expenses</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.totalExpenses)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net income (annual)</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.netIncomeAnnual)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net income (monthly)</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.netIncomeMonthly)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Gross yield</p>
                        <p className="text-2xl font-semibold">{percentFormatter.format(results.grossYield)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net yield</p>
                        <p className="text-2xl font-semibold">{percentFormatter.format(results.netYield)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Cash-on-cash return</p>
                        <p className="text-2xl font-semibold">{percentFormatter.format(results.cashOnCashReturn)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Equity invested</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.equityInvested)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="rental-yield-analysis"
                          title="Rental Yield Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Income & expense breakdown
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
                        <ResultBreakdownChart data={chartData} title="Rental yield breakdown" />
                      </Suspense>
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
