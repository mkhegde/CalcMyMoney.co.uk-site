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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Home, Hammer, TrendingUp, Quote, BookOpen, LineChart, Plus } from 'lucide-react';

const ResultBreakdownChart = React.lazy(() =>
  import('@/components/calculators/ResultBreakdownChart.jsx'),
);

const pagePath = '/calculators/property-flipping-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/property-flipping-calculator';
const pageTitle = 'Property Flipping Calculator UK | ROI & Profit Estimator';
const metaDescription =
  'Use our UK property flipping calculator to estimate return on investment (ROI), renovation costs, and gross profit for your house flipping projects.';
const keywords = getMappedKeywords('Property Flipping Calculator');

const defaultRenovationItems = [
  { id: 1, label: 'Kitchen refurbishment', amount: '8,000' },
  { id: 2, label: 'Bathroom upgrade', amount: '4,500' },
  { id: 3, label: 'Decor & staging', amount: '2,200' },
];

let renovationId = defaultRenovationItems.length + 1;

const faqItems = [
  {
    question: 'What costs should I include in a flip analysis?',
    answer:
      'Include acquisition price, renovation budget, holding costs (mortgage interest, council tax, utilities), selling fees (estate agent, legal), and contingency funds.',
  },
  {
    question: 'How do I estimate property flipping ROI?',
    answer:
      'ROI is calculated by dividing net profit by total cash invested. This calculator shows ROI based on your projected sale price and all costs entered.',
  },
  {
    question: 'How much contingency should I set aside?',
    answer:
      'Many investors set aside 10-15% of the renovation budget for unexpected issues. Adjust based on property condition and contractor quotes.',
  },
];

const emotionalMessage =
  'Unlock the potential of property flipping! This calculator helps you meticulously plan every cost and revenue, ensuring your next house flip is a profitable success.';
const emotionalQuote = {
  text: 'The best investment on Earth is earth.',
  author: 'Louis Glickman',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'Explore all property & mortgage calculators',
    description: 'Compare mortgage deals, calculate repayments, and assess affordability.',
  },
  {
    url: '/buy-to-let-mortgage-calculator',
    label: 'Buy-to-Let Mortgage Calculator',
    description: 'Calculate potential rental income and mortgage affordability for investment properties.',
  },
  {
    url: '/mortgage-affordability-calculator',
    label: 'Mortgage Affordability Calculator',
    description: 'Determine how much you can afford to borrow for a mortgage based on your income and expenses.',
  },
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

const calculateFlippingMetrics = (inputs, renovationItems) => {
  const purchasePrice = parseNumber(inputs.purchasePrice);
  const stampDuty = parseNumber(inputs.stampDuty);
  const legalFees = parseNumber(inputs.legalFees);
  const holdingCostsPerMonth = parseNumber(inputs.holdingCostsPerMonth);
  const holdingMonths = parseNumber(inputs.holdingMonths);
  const sellingFeesPercent = parseNumber(inputs.sellingFeesPercent) / 100;
  const desiredSalePrice = parseNumber(inputs.desiredSalePrice);
  const contingencyPercent = parseNumber(inputs.contingencyPercent) / 100;

  const renovationCost = renovationItems.reduce(
    (sum, item) => sum + parseNumber(item.amount),
    0,
  );
  const contingency = renovationCost * contingencyPercent;
  const holdingCosts = holdingCostsPerMonth * holdingMonths;
  const acquisitionCosts = purchasePrice + stampDuty + legalFees;
  const total Investment =
    acquisitionCosts + renovationCost + contingency + holdingCosts;
  const sellingFees = desiredSalePrice * sellingFeesPercent;
  const netProceeds = desiredSalePrice - sellingFees;
  const grossProfit = netProceeds - totalInvestment;
  const roi =
    totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;

  return {
    purchasePrice,
    stampDuty,
    legalFees,
    renovationCost,
    contingency,
    holdingCosts,
    sellingFees,
    desiredSalePrice,
    totalInvestment,
    netProceeds,
    grossProfit,
    roi,
  };
};

function buildCsvData(results, inputs, renovationItems) {
  if (!results) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Purchase Price (£)', currencyFormatter.format(parseNumber(inputs.purchasePrice))],
    ['Stamp Duty (£)', currencyFormatter.format(parseNumber(inputs.stampDuty))],
    ['Legal & Conveyancing Fees (£)', currencyFormatter.format(parseNumber(inputs.legalFees))],
    ['Holding Costs Per Month (£)', currencyFormatter.format(parseNumber(inputs.holdingCostsPerMonth))],
    ['Holding Duration (Months)', inputs.holdingMonths],
    ['Selling Fees (% of Sale Price)', `${inputs.sellingFeesPercent}%`],
    ['Contingency (% of Reno Budget)', `${inputs.contingencyPercent}%`],
    ['Target Sale Price (£)', currencyFormatter.format(parseNumber(inputs.desiredSalePrice))],
    [],
    ['Renovation Items'],
    ...renovationItems.map(item => [item.label, currencyFormatter.format(parseNumber(item.amount))]),
    [],
    ['Total Investment (£)', currencyFormatter.format(results.totalInvestment)],
    ['Net Sale Proceeds (£)', currencyFormatter.format(results.netProceeds)],
    ['Gross Profit (£)', currencyFormatter.format(results.grossProfit)],
    ['Return on Investment (ROI) (%)', `${results.roi.toFixed(1)}%`],
  ];
  return csvRows;
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Acquisition Costs', value: results.purchasePrice + results.stampDuty + results.legalFees, color: '#3b82f6' },
    { name: 'Renovation & Contingency', value: results.renovationCost + results.contingency, color: '#10b981' },
    { name: 'Holding Costs', value: results.holdingCosts, color: '#f97316' },
    { name: 'Selling Fees', value: results.sellingFees, color: '#ef4444' },
    { name: 'Gross Profit', value: results.grossProfit, color: '#8b5cf6' },
  ].filter((segment) => segment.value > 0);
}

export default function PropertyFlippingCalculatorPage() {
  const [inputs, setInputs] = useState({
    purchasePrice: '210,000',
    stampDuty: '7,300',
    legalFees: '1,500',
    holdingCostsPerMonth: '650',
    holdingMonths: '6',
    sellingFeesPercent: '2.5',
    desiredSalePrice: '285,000',
    contingencyPercent: '10',
  });
  const [renovationItems, setRenovationItems] = useState(defaultRenovationItems);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Property Flipping Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Property Flipping Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const updateRenovationItem = useCallback((id, value) => {
    setRenovationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: value } : item)),
    );
  }, []);

  const addRenovationItem = useCallback(() => {
    setRenovationItems((prev) => [
      ...prev,
      { id: renovationId++, label: 'New item', amount: '0' },
    ]);
  }, []);

  const removeRenovationItem = useCallback((id) => {
    setRenovationItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleInputChange = useCallback((field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((event) => {
    event.preventDefault();
    const computedResults = calculateFlippingMetrics(inputs, renovationItems);
    setResults(computedResults);
    setHasCalculated(true);
    setCsvData(buildCsvData(computedResults, inputs, renovationItems));
  }, [inputs, renovationItems]);

  const handleReset = useCallback(() => {
    setInputs({
      purchasePrice: '210,000',
      stampDuty: '7,300',
      legalFees: '1,500',
      holdingCostsPerMonth: '650',
      holdingMonths: '6',
      sellingFeesPercent: '2.5',
      desiredSalePrice: '285,000',
      contingencyPercent: '10',
    });
    setRenovationItems(defaultRenovationItems);
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
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Property Flipping Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate property flipping profit, estimate ROI, and refine your renovation budget
              for an investment strategy aligned with property market analysis.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Home className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-amber-600 dark:text-amber-300"
            borderColor="border-amber-200 dark:border-amber-800/60"
            bgColor="bg-amber-50/70 dark:bg-amber-950/40"
            textColor="text-amber-900 dark:text-amber-100"
            footerColor="text-amber-700 dark:text-amber-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  Flip Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase price (£)</Label>
                      <Input
                        id="purchasePrice"
                        inputMode="decimal"
                        value={inputs.purchasePrice}
                        onChange={handleInputChange('purchasePrice')}
                        placeholder="e.g. 210,000"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="stampDuty">Stamp duty (£)</Label>
                        <Input
                          id="stampDuty"
                          inputMode="decimal"
                          value={inputs.stampDuty}
                          onChange={handleInputChange('stampDuty')}
                          placeholder="e.g. 7,300"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="legalFees">Legal & conveyancing (£)</Label>
                        <Input
                          id="legalFees"
                          inputMode="decimal"
                          value={inputs.legalFees}
                          onChange={handleInputChange('legalFees')}
                          placeholder="e.g. 1,500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Renovation items</Label>
                      <div className="space-y-3">
                        {renovationItems.map((item) => (
                          <div key={item.id} className="flex items-end gap-2">
                            <div className="flex-1 space-y-2">
                              <Label htmlFor={`renovation-label-${item.id}`}>Item label</Label>
                              <Input
                                id={`renovation-label-${item.id}`}
                                value={item.label}
                                onChange={(event) =>
                                  updateRenovationItem(item.id, {
                                    label: event.target.value,
                                    amount: item.amount,
                                  })
                                }
                                placeholder="e.g. Kitchen refurbishment"
                              />
                            </div>
                            <div className="flex-1 space-y-2">
                              <Label htmlFor={`renovation-amount-${item.id}`}>Amount (£)</Label>
                              <Input
                                id={`renovation-amount-${item.id}`}
                                inputMode="decimal"
                                value={item.amount}
                                onChange={(event) =>
                                  updateRenovationItem(item.id, {
                                    label: item.label,
                                    amount: event.target.value,
                                  })
                                }
                                placeholder="e.g. 8,000"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeRenovationItem(item.id)}
                              className="shrink-0"
                            >
                              -
                            </Button>
                          </div>
                        ))}
                        <Button type="button" variant="outline" onClick={addRenovationItem} className="w-full">
                          <Plus className="mr-2 h-4 w-4" />
                          Add renovation item
                        </Button>
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="holdingCostsPerMonth">Holding costs per month (£)</Label>
                        <Input
                          id="holdingCostsPerMonth"
                          inputMode="decimal"
                          value={inputs.holdingCostsPerMonth}
                          onChange={handleInputChange('holdingCostsPerMonth')}
                          placeholder="e.g. 650"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="holdingMonths">Holding duration (months)</Label>
                        <Input
                          id="holdingMonths"
                          inputMode="numeric"
                          value={inputs.holdingMonths}
                          onChange={handleInputChange('holdingMonths')}
                          placeholder="e.g. 6"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="sellingFeesPercent">Selling fees (% of sale price)</Label>
                        <Input
                          id="sellingFeesPercent"
                          inputMode="decimal"
                          value={inputs.sellingFeesPercent}
                          onChange={handleInputChange('sellingFeesPercent')}
                          placeholder="e.g. 2.5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contingencyPercent">Contingency (% of reno budget)</Label>
                        <Input
                          id="contingencyPercent"
                          inputMode="decimal"
                          value={inputs.contingencyPercent}
                          onChange={handleInputChange('contingencyPercent')}
                          placeholder="e.g. 10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredSalePrice">Target sale price (£)</Label>
                      <Input
                        id="desiredSalePrice"
                        inputMode="decimal"
                        value={inputs.desiredSalePrice}
                        onChange={handleInputChange('desiredSalePrice')}
                        placeholder="e.g. 285,000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Flip Profit
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
                    Enter your property details, renovation costs, and financial assumptions, then
                    press <span className="font-semibold">Calculate Flip Profit</span> to see your
                    estimated profit and ROI.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-amber-200 bg-white shadow-sm dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Home className="h-5 w-5 text-amber-600 dark:text-amber-200" aria-hidden="true" />
                        Flip Profit Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Total investment</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInvestment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Net sale proceeds</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netProceeds)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Gross profit</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossProfit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Return on investment</p>
                        <p className="text-2xl font-semibold">{results.roi.toFixed(1)}%</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="property-flip-analysis"
                          title="Property Flipping Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Cost Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Property Flip Cost Breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides an estimate based on your inputs. Property flipping
                        involves significant risks, including market fluctuations, unexpected
                        renovation costs, and delays.
                      </p>
                      <p>
                        Always conduct thorough due diligence and consider consulting with real
                        estate professionals and financial advisors before making investment
                        decisions.
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
