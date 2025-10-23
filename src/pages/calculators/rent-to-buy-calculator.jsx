import React, { useMemo, useState, useCallback, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
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
import { Calculator, Home, Key, PiggyBank, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/rent-to-buy-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rent-to-buy-calculator';
const pageTitle = 'Rent to Buy Calculator UK | Track Rent Credits & Deposit Growth';
const metaDescription =
  'Model rent-to-buy agreements in the UK by projecting rent credits, future property value, deposit at completion, and mortgage payments before exercising the option to buy.';
const keywords = getMappedKeywords('Rent to Buy Calculator');

const faqItems = [
  {
    question: 'How much rent is typically credited in rent to buy schemes?',
    answer:
      'Contracts often credit 20–40% of rent towards the future purchase. Enter the percentage agreed in your contract to see how those credits grow your deposit.',
  },
  {
    question: 'What happens if property prices rise faster than planned?',
    answer:
      'Increase the annual price growth assumption to stress test the deal. A higher future purchase price can erode your deposit percentage and increase the mortgage required.',
  },
  {
    question: 'Can I buy sooner than planned?',
    answer:
      'Yes, most schemes let you exercise the option early once you have enough deposit. Reduce the years-to-purchase input to see how a shorter timeline affects savings and affordability.',
  },
];

const emotionalMessage =
  'Stay motivated on your path to ownership. Track how rent credits, savings, and purchase costs progress every month so you know exactly when the keys will be yours.';
const emotionalQuote = {
  text: 'The best way to predict the future is to create it.',
  author: 'Peter Drucker',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateRentToBuy = (inputs) => {
  const propertyPriceToday = Math.max(parseNumber(inputs.propertyPriceToday), 0);
  const initialDeposit = Math.max(parseNumber(inputs.initialDeposit), 0);
  const monthlyRent = Math.max(parseNumber(inputs.monthlyRent), 0);
  const rentCreditPercent = Math.min(Math.max(parseNumber(inputs.rentCreditPercent), 0), 100) / 100;
  const yearsUntilPurchase = Math.max(parseNumber(inputs.yearsUntilPurchase), 0);
  const annualPriceGrowth = parseNumber(inputs.annualPriceGrowth) / 100;
  const mortgageRate = Math.max(parseNumber(inputs.mortgageRate), 0);
  const mortgageTermYears = Math.max(parseNumber(inputs.mortgageTermYears), 1);
  const leaseServiceCharge = Math.max(parseNumber(inputs.leaseServiceCharge), 0);
  const completionFees = Math.max(parseNumber(inputs.completionFees), 0);

  const rentCreditMonthly = monthlyRent * rentCreditPercent;
  const rentCreditTotal = rentCreditMonthly * 12 * yearsUntilPurchase;
  const totalRentPaid = (monthlyRent + leaseServiceCharge) * 12 * yearsUntilPurchase;

  const futurePrice =
    yearsUntilPurchase === 0
      ? propertyPriceToday
      : propertyPriceToday * (1 + annualPriceGrowth) ** yearsUntilPurchase;

  const projectedDeposit = initialDeposit + rentCreditTotal;
  const depositPercent = futurePrice > 0 ? (projectedDeposit / futurePrice) * 100 : 0;
  const mortgageAmount = Math.max(futurePrice - projectedDeposit, 0);
  const monthlyInterestRate = mortgageRate / 100 / 12;
  const totalPayments = mortgageTermYears * 12;
  const mortgagePayment =
    monthlyInterestRate === 0
      ? totalPayments > 0
        ? mortgageAmount / totalPayments
        : 0
      : (mortgageAmount * monthlyInterestRate * (1 + monthlyInterestRate) ** totalPayments) /
        ((1 + monthlyInterestRate) ** totalPayments - 1 || 1);

  const cashNeededAtCompletion = projectedDeposit + completionFees;
  const gapToTenPercentDeposit = Math.max(futurePrice * 0.1 - projectedDeposit, 0);

  return {
    propertyPriceToday,
    initialDeposit,
    monthlyRent,
    rentCreditPercent: rentCreditPercent * 100,
    yearsUntilPurchase,
    rentCreditMonthly,
    rentCreditTotal,
    totalRentPaid,
    futurePrice,
    projectedDeposit,
    depositPercent,
    mortgageAmount,
    mortgagePayment,
    leaseServiceCharge,
    completionFees,
    cashNeededAtCompletion,
    gapToTenPercentDeposit,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Property price today (£)', inputs.propertyPriceToday],
    ['Initial deposit (£)', inputs.initialDeposit],
    ['Monthly rent (£)', inputs.monthlyRent],
    ['Rent credited (%)', inputs.rentCreditPercent],
    ['Years until purchase', inputs.yearsUntilPurchase],
    ['Expected price growth (% p.a.)', inputs.annualPriceGrowth],
    ['Lease/service charge (£ per month)', inputs.leaseServiceCharge],
    ['Completion costs (£)', inputs.completionFees],
    ['Mortgage rate (% p.a.)', inputs.mortgageRate],
    ['Mortgage term (years)', inputs.mortgageTermYears],
    [],
    ['Output', 'Value'],
    ['Future property price (£)', currencyFormatter.format(results.futurePrice)],
    ['Deposit at completion (£)', currencyFormatter.format(results.projectedDeposit)],
    ['Deposit percentage (%)', results.depositPercent.toFixed(1)],
    ['Rent credited overall (£)', currencyFormatter.format(results.rentCreditTotal)],
    ['Mortgage required (£)', currencyFormatter.format(results.mortgageAmount)],
    ['Mortgage payment estimate (£)', currencyFormatter.format(results.mortgagePayment)],
    ['Cash needed at completion (£)', currencyFormatter.format(results.cashNeededAtCompletion)],
    ['Total rent paid (£)', currencyFormatter.format(results.totalRentPaid)],
    ['Gap to 10% deposit (£)', currencyFormatter.format(results.gapToTenPercentDeposit)],
  ];
};

const chartPalette = ['#10b981', '#3b82f6', '#f97316', '#6366f1'];

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Initial savings', value: results.initialDeposit, color: chartPalette[0] },
    { name: 'Rent credit contribution', value: results.rentCreditTotal, color: chartPalette[1] },
    { name: 'Mortgage required', value: results.mortgageAmount, color: chartPalette[2] },
    { name: 'Completion fees', value: results.completionFees, color: chartPalette[3] },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  propertyPriceToday: '320,000',
  initialDeposit: '15,000',
  monthlyRent: '1,350',
  rentCreditPercent: '30',
  yearsUntilPurchase: '5',
  annualPriceGrowth: '2.5',
  mortgageRate: '5.2',
  mortgageTermYears: '30',
  leaseServiceCharge: '120',
  completionFees: '6,500',
};

export default function RentToBuyCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Rent to Buy Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Rent to Buy Calculator', url: pagePath },
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
      const computed = calculateRentToBuy(inputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Rent to Buy Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Track rent credits, deposit progress, and mortgage affordability so you know when your rent-to-buy option is ready to exercise.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Key className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Agreement details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="propertyPriceToday">Property price today (£)</Label>
                      <Input
                        id="propertyPriceToday"
                        inputMode="decimal"
                        value={inputs.propertyPriceToday}
                        onChange={handleInputChange('propertyPriceToday')}
                        placeholder="e.g. 320,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialDeposit">Initial deposit saved (£)</Label>
                      <Input
                        id="initialDeposit"
                        inputMode="decimal"
                        value={inputs.initialDeposit}
                        onChange={handleInputChange('initialDeposit')}
                        placeholder="e.g. 15,000"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Monthly rent (£)</Label>
                      <Input
                        id="monthlyRent"
                        inputMode="decimal"
                        value={inputs.monthlyRent}
                        onChange={handleInputChange('monthlyRent')}
                        placeholder="e.g. 1,350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rentCreditPercent">Rent credited to purchase (%)</Label>
                      <Input
                        id="rentCreditPercent"
                        inputMode="decimal"
                        value={inputs.rentCreditPercent}
                        onChange={handleInputChange('rentCreditPercent')}
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="yearsUntilPurchase">Years until purchase</Label>
                      <Input
                        id="yearsUntilPurchase"
                        inputMode="decimal"
                        value={inputs.yearsUntilPurchase}
                        onChange={handleInputChange('yearsUntilPurchase')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualPriceGrowth">Expected price growth (% p.a.)</Label>
                      <Input
                        id="annualPriceGrowth"
                        inputMode="decimal"
                        value={inputs.annualPriceGrowth}
                        onChange={handleInputChange('annualPriceGrowth')}
                        placeholder="e.g. 2.5"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="leaseServiceCharge">Lease/service charge (£ per month)</Label>
                      <Input
                        id="leaseServiceCharge"
                        inputMode="decimal"
                        value={inputs.leaseServiceCharge}
                        onChange={handleInputChange('leaseServiceCharge')}
                        placeholder="e.g. 120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="completionFees">Completion costs (£)</Label>
                      <Input
                        id="completionFees"
                        inputMode="decimal"
                        value={inputs.completionFees}
                        onChange={handleInputChange('completionFees')}
                        placeholder="e.g. 6,500"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mortgageRate">Mortgage rate (% p.a.)</Label>
                      <Input
                        id="mortgageRate"
                        inputMode="decimal"
                        value={inputs.mortgageRate}
                        onChange={handleInputChange('mortgageRate')}
                        placeholder="e.g. 5.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mortgageTermYears">Mortgage term (years)</Label>
                      <Input
                        id="mortgageTermYears"
                        inputMode="decimal"
                        value={inputs.mortgageTermYears}
                        onChange={handleInputChange('mortgageTermYears')}
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate rent to buy plan
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
                    Fill in your agreement details and press <span className="font-semibold">Calculate rent to buy plan</span> to see projected deposits, mortgage needs, and cash required at completion.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Rent to buy summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Future property price</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.futurePrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Deposit at completion</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.projectedDeposit)}</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-200">{results.depositPercent.toFixed(1)}% deposit</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Rent credited overall</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.rentCreditTotal)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Mortgage required</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.mortgageAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Mortgage payment estimate</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.mortgagePayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Cash needed at completion</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.cashNeededAtCompletion)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="rent-to-buy-analysis"
                          title="Rent to Buy Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Funding breakdown
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
                        <ResultBreakdownChart data={chartData} title="Rent to buy funding mix" />
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
</div>
      </CalculatorWrapper>
    </div>
  );
}
