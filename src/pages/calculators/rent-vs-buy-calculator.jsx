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
import { Calculator, Home, Coins, PiggyBank, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/rent-vs-buy-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rent-vs-buy-calculator';
const pageTitle = 'Rent vs Buy Calculator UK | Compare Long-Term Housing Costs';
const metaDescription =
  'Weigh the long-term costs of renting against buying in the UK by modelling rent inflation, mortgage costs, maintenance, and opportunity cost to find your break-even year.';
const keywords = getMappedKeywords('Rent vs Buy Calculator');

const faqItems = [
  {
    question: 'What are the key elements in a rent vs buy comparison?',
    answer:
      'Consider mortgage repayments, maintenance, insurance, and the opportunity cost of tying up capital in a deposit. Compare these against rent, rent inflation, and your time horizon.',
  },
  {
    question: 'How is opportunity cost applied to a house deposit?',
    answer:
      'Opportunity cost is the investment return you forego by using savings as a deposit. Enter an annual percentage to estimate the growth you would have earned if the money stayed invested.',
  },
  {
    question: 'When does buying typically break even?',
    answer:
      'Buying breaks even when the cumulative cost of ownership becomes lower than renting. The calculator highlights the year this happens within your chosen time horizon.',
  },
];

const emotionalMessage =
  'Bring clarity to a life-changing decision. Quantify the long-term trade-offs so you can match your housing choice to your financial goals and lifestyle plans.';
const emotionalQuote = {
  text: 'Decisions become easier when your will to please God outweighs your will to please the world.',
  author: 'Anurag Prakash Ray',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'Explore mortgage calculators',
    description: 'Plan deposits, repayments, and property budgets in one place.',
  },
  {
    url: '/mortgage-calculator',
    label: 'Mortgage Calculator',
    description: 'Check payments at different rates before committing to buy.',
  },
  {
    url: '/rental-yield-calculator',
    label: 'Rental Yield Calculator',
    description: 'Compare ownership returns against alternative property strategies.',
  },
];

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

const calculateRentVsBuy = (inputs) => {
  const monthlyRent = Math.max(parseNumber(inputs.monthlyRent), 0);
  const annualRentIncrease = Math.max(parseNumber(inputs.annualRentIncrease), 0) / 100;
  const propertyPrice = Math.max(parseNumber(inputs.propertyPrice), 0);
  const depositPercent = Math.max(parseNumber(inputs.depositPercent), 0) / 100;
  const mortgageRate = Math.max(parseNumber(inputs.mortgageRate), 0) / 100;
  const mortgageTermYears = Math.max(parseNumber(inputs.mortgageTermYears), 0);
  const maintenancePercent = Math.max(parseNumber(inputs.maintenancePercent), 0) / 100;
  const insurancePerYear = Math.max(parseNumber(inputs.insurancePerYear), 0);
  const opportunityCostRate = Math.max(parseNumber(inputs.opportunityCostRate), 0) / 100;
  const investmentHorizonYears = Math.max(parseNumber(inputs.investmentHorizonYears), 0);

  const depositAmount = propertyPrice * depositPercent;
  const mortgagePrincipal = Math.max(propertyPrice - depositAmount, 0);

  const mortgageMonths = mortgageTermYears * 12;
  const monthlyRate = mortgageRate / 12;
  const monthlyMortgagePayment =
    mortgageMonths > 0 && mortgagePrincipal > 0
      ? monthlyRate === 0
        ? mortgagePrincipal / mortgageMonths
        : (mortgagePrincipal * monthlyRate * (1 + monthlyRate) ** mortgageMonths) /
          ((1 + monthlyRate) ** mortgageMonths - 1)
      : 0;

  const annualMaintenance = propertyPrice * maintenancePercent;
  const annualMortgageCost = monthlyMortgagePayment * 12;
  const annualBuyCost = annualMortgageCost + annualMaintenance + insurancePerYear;

  let rent = monthlyRent;
  let cumulativeRent = 0;
  for (let year = 1; year <= investmentHorizonYears; year += 1) {
    cumulativeRent += rent * 12;
    rent *= 1 + annualRentIncrease;
  }

  const opportunityCost = depositAmount * opportunityCostRate * investmentHorizonYears;
  const totalBuyCost = depositAmount + annualBuyCost * investmentHorizonYears + opportunityCost;
  const totalRentCost = cumulativeRent + opportunityCost;
  const netAdvantage = totalRentCost - totalBuyCost;

  let rentAccumulator = 0;
  let buyAccumulator = depositAmount;
  rent = monthlyRent;
  let breakEvenYear = null;
  for (let year = 1; year <= investmentHorizonYears; year += 1) {
    rentAccumulator += rent * 12;
    buyAccumulator += annualBuyCost;
    if (breakEvenYear === null && buyAccumulator <= rentAccumulator) {
      breakEvenYear = year;
    }
    rent *= 1 + annualRentIncrease;
  }

  return {
    monthlyRent,
    annualRentIncrease: annualRentIncrease * 100,
    propertyPrice,
    depositPercent: depositPercent * 100,
    depositAmount,
    mortgagePrincipal,
    monthlyMortgagePayment,
    annualMaintenance,
    annualBuyCost,
    totalRentCost,
    totalBuyCost,
    netAdvantage,
    opportunityCost,
    breakEvenYear,
    investmentHorizonYears,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Monthly rent (£)', inputs.monthlyRent],
    ['Annual rent increase (%)', inputs.annualRentIncrease],
    ['Property price (£)', inputs.propertyPrice],
    ['Deposit (%)', inputs.depositPercent],
    ['Mortgage rate (%)', inputs.mortgageRate],
    ['Mortgage term (years)', inputs.mortgageTermYears],
    ['Maintenance (% of value)', inputs.maintenancePercent],
    ['Insurance per year (£)', inputs.insurancePerYear],
    ['Opportunity cost rate (%)', inputs.opportunityCostRate],
    ['Investment horizon (years)', inputs.investmentHorizonYears],
    [],
    ['Output', 'Value'],
    ['Deposit amount (£)', currencyFormatter.format(results.depositAmount)],
    ['Mortgage principal (£)', currencyFormatter.format(results.mortgagePrincipal)],
    ['Monthly mortgage payment (£)', currencyFormatter.format(results.monthlyMortgagePayment)],
    ['Annual maintenance (£)', currencyFormatter.format(results.annualMaintenance)],
    ['Total rent cost (£)', currencyFormatter.format(results.totalRentCost)],
    ['Total buy cost (£)', currencyFormatter.format(results.totalBuyCost)],
    ['Net advantage (£)', currencyFormatter.format(results.netAdvantage)],
    ['Opportunity cost (£)', currencyFormatter.format(results.opportunityCost)],
    ['Break-even year', results.breakEvenYear ?? 'Beyond horizon'],
  ];
};

const chartPalette = ['#f97316', '#3b82f6', '#10b981'];

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Total rent cost', value: results.totalRentCost, color: chartPalette[0] },
    { name: 'Total buy cost', value: results.totalBuyCost, color: chartPalette[1] },
    { name: results.netAdvantage >= 0 ? 'Rent advantage' : 'Buy advantage', value: Math.abs(results.netAdvantage), color: results.netAdvantage >= 0 ? '#ef4444' : '#10b981' },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  monthlyRent: '1,300',
  annualRentIncrease: '3',
  propertyPrice: '325,000',
  depositPercent: '15',
  mortgageRate: '4.2',
  mortgageTermYears: '30',
  maintenancePercent: '1',
  insurancePerYear: '350',
  opportunityCostRate: '3',
  investmentHorizonYears: '7',
};

export default function RentVsBuyCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Rent vs Buy Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Rent vs Buy Calculator', url: pagePath },
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
      const computed = calculateRentVsBuy(inputs);
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
                Rent vs Buy Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare the long-term cost of renting with buying, including maintenance, insurance, and opportunity cost, to decide which option fits your goals.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Coins className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <Home className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Scenario inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Monthly rent (£)</Label>
                      <Input
                        id="monthlyRent"
                        inputMode="decimal"
                        value={inputs.monthlyRent}
                        onChange={handleInputChange('monthlyRent')}
                        placeholder="e.g. 1,300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRentIncrease">Annual rent increase (%)</Label>
                      <Input
                        id="annualRentIncrease"
                        inputMode="decimal"
                        value={inputs.annualRentIncrease}
                        onChange={handleInputChange('annualRentIncrease')}
                        placeholder="e.g. 3"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="propertyPrice">Property price (£)</Label>
                      <Input
                        id="propertyPrice"
                        inputMode="decimal"
                        value={inputs.propertyPrice}
                        onChange={handleInputChange('propertyPrice')}
                        placeholder="e.g. 325,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="depositPercent">Deposit (%)</Label>
                      <Input
                        id="depositPercent"
                        inputMode="decimal"
                        value={inputs.depositPercent}
                        onChange={handleInputChange('depositPercent')}
                        placeholder="e.g. 15"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="mortgageRate">Mortgage rate (%)</Label>
                      <Input
                        id="mortgageRate"
                        inputMode="decimal"
                        value={inputs.mortgageRate}
                        onChange={handleInputChange('mortgageRate')}
                        placeholder="e.g. 4.2"
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
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="maintenancePercent">Annual maintenance (% of value)</Label>
                      <Input
                        id="maintenancePercent"
                        inputMode="decimal"
                        value={inputs.maintenancePercent}
                        onChange={handleInputChange('maintenancePercent')}
                        placeholder="e.g. 1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="insurancePerYear">Insurance per year (£)</Label>
                      <Input
                        id="insurancePerYear"
                        inputMode="decimal"
                        value={inputs.insurancePerYear}
                        onChange={handleInputChange('insurancePerYear')}
                        placeholder="e.g. 350"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="opportunityCostRate">Opportunity cost rate (%)</Label>
                      <Input
                        id="opportunityCostRate"
                        inputMode="decimal"
                        value={inputs.opportunityCostRate}
                        onChange={handleInputChange('opportunityCostRate')}
                        placeholder="e.g. 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="investmentHorizonYears">Investment horizon (years)</Label>
                      <Input
                        id="investmentHorizonYears"
                        inputMode="decimal"
                        value={inputs.investmentHorizonYears}
                        onChange={handleInputChange('investmentHorizonYears')}
                        placeholder="e.g. 7"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate rent vs buy
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
                    Add your rental and purchase assumptions, then press <span className="font-semibold">Calculate rent vs buy</span> to see the cumulative cost of each option.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Comparison summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Deposit amount</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.depositAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Mortgage principal</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.mortgagePrincipal)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Monthly mortgage payment</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.monthlyMortgagePayment)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Annual maintenance</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.annualMaintenance)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total rent cost</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.totalRentCost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total buy cost</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.totalBuyCost)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net advantage</p>
                        <p
                          className={`text-2xl font-semibold ${
                            results.netAdvantage >= 0 ? 'text-emerald-300' : 'text-rose-300'
                          }`}
                        >
                          {currencyFormatter.format(results.netAdvantage)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Break-even year</p>
                        <p className="text-2xl font-semibold">
                          {results.breakEvenYear ?? 'Beyond horizon'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="rent-vs-buy-analysis"
                          title="Rent vs Buy Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Cost comparison
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
                        <ResultBreakdownChart data={chartData} title="Rent vs buy cost comparison" />
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
