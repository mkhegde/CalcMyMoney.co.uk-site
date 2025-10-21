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
import { Button } from '@/components/ui/button';
import { Calculator, PiggyBank, TrendingUp, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/net-worth-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/net-worth-calculator';
const pageTitle = 'Net Worth Calculator UK | Track Assets & Liabilities';
const metaDescription =
  'Use our UK net worth calculator to track assets, compare progress, and keep your financial snapshot updated each quarter.';
const keywords = getMappedKeywords('Net Worth Calculator');

const faqItems = [
  {
    question: 'What assets should I include?',
    answer:
      'Include property equity, investments, pensions, savings, cash, and high-value belongings. Use realistic valuations to avoid inflating your net worth.',
  },
  {
    question: 'How often should I review my net worth?',
    answer:
      'Quarterly reviews are ideal. Monthly updates can be helpful during rapid change, while annual updates work for long-term planning.',
  },
  {
    question: 'Should I include pension pots?',
    answer:
      'Yes. Estimate pension values from provider statements so your net worth reflects all long-term assets. Remember that tax may apply when withdrawing.',
  },
];

const emotionalMessage =
  'Your net worth is a powerful snapshot of your financial journey. Track your progress, celebrate your growth, and stay motivated on the path to financial independence.';
const emotionalQuote = {
  text: "Wealth is not about having a lot of money; it's about having a lot of options.",
  author: 'Chris Rock',
};

const directoryLinks = [
  {
    url: '/#savings-investments',
    label: 'Explore all savings & investment calculators',
    description: 'Track growth, optimise allowances, and compare investment strategies.',
  },
  {
    url: '/budget-calculator',
    label: 'Build a monthly budget',
    description: 'Allocate income across bills, savings, and lifestyle categories.',
  },
  {
    url: '/retirement-savings-calculator',
    label: 'Plan your retirement savings',
    description: 'Project future pension values and retirement income.',
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

const calculateNetWorth = ({ assets, liabilities }) => {
  const totalAssets = assets.reduce((sum, item) => sum + parseNumber(item.value), 0);
  const totalLiabilities = liabilities.reduce((sum, item) => sum + parseNumber(item.value), 0);
  const netWorth = totalAssets - totalLiabilities;
  const debtRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    debtRatio,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Total Assets (£)', currencyFormatter.format(results.totalAssets)],
    ['Total Liabilities (£)', currencyFormatter.format(results.totalLiabilities)],
    ['Net Worth (£)', currencyFormatter.format(results.netWorth)],
    ['Debt Ratio (%)', `${results.debtRatio.toFixed(1)}%`],
    [],
    ['Assets'],
    ['Name', 'Value (£)'],
    ...inputs.assets.map((asset) => [
      asset.name,
      currencyFormatter.format(parseNumber(asset.value)),
    ]),
    [],
    ['Liabilities'],
    ['Name', 'Value (£)'],
    ...inputs.liabilities.map((liability) => [
      liability.name,
      currencyFormatter.format(parseNumber(liability.value)),
    ]),
  ];
  return csvRows;
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Total Assets', value: results.totalAssets, color: '#10b981' },
    { name: 'Total Liabilities', value: results.totalLiabilities, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function NetWorthCalculatorPage() {
  const [assets, setAssets] = useState([
    { name: 'Home equity', value: '150,000' },
    { name: 'Investments', value: '65,000' },
    { name: 'Cash savings', value: '12,000' },
  ]);

  const [liabilities, setLiabilities] = useState([
    { name: 'Mortgage balance', value: '120,000' },
    { name: 'Credit cards', value: '2,500' },
  ]);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Net Worth Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Savings & Investments Calculators', url: '/calculators#savings-investments' },
      { name: 'Net Worth Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleAssetChange = useCallback((index, field, value) => {
    setAssets((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }, []);

  const handleLiabilityChange = useCallback((index, field, value) => {
    setLiabilities((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }, []);

  const handleAddAsset = useCallback(() => {
    setAssets((prev) => [...prev, { name: '', value: '' }]);
  }, []);

  const handleRemoveAsset = useCallback((index) => {
    setAssets((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddLiability = useCallback(() => {
    setLiabilities((prev) => [...prev, { name: '', value: '' }]);
  }, []);

  const handleRemoveLiability = useCallback((index) => {
    setLiabilities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedResults = calculateNetWorth({ assets, liabilities });
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, { assets, liabilities }));
    },
    [assets, liabilities]
  );

  const handleReset = useCallback(() => {
    setAssets([
      { name: 'Home equity', value: '150,000' },
      { name: 'Investments', value: '65,000' },
      { name: 'Cash savings', value: '12,000' },
    ]);
    setLiabilities([
      { name: 'Mortgage balance', value: '120,000' },
      { name: 'Credit cards', value: '2,500' },
    ]);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Net Worth Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Track your assets and liabilities to calculate your net worth. Understand your
              financial position and visualize your progress towards financial independence.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-blue-600 dark:text-blue-300"
            borderColor="border-blue-200 dark:border-blue-800/60"
            bgColor="bg-blue-50/70 dark:bg-blue-950/40"
            textColor="text-blue-900 dark:text-blue-100"
            footerColor="text-blue-700 dark:text-blue-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp
                    className="h-5 w-5 text-blue-600 dark:text-blue-300"
                    aria-hidden="true"
                  />
                  Assets & Liabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                      Your Assets
                    </h3>
                    {assets.map((asset, index) => (
                      <div key={`asset-${index}`} className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`asset-name-${index}`}>Asset name</Label>
                          <Input
                            id={`asset-name-${index}`}
                            value={asset.name}
                            onChange={(event) =>
                              handleAssetChange(index, 'name', event.target.value)
                            }
                            placeholder="e.g. Home Equity"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`asset-value-${index}`}>Value (£)</Label>
                          <Input
                            id={`asset-value-${index}`}
                            inputMode="decimal"
                            value={asset.value}
                            onChange={(event) =>
                              handleAssetChange(index, 'value', event.target.value)
                            }
                            placeholder="e.g. 150,000"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveAsset(index)}
                          className="shrink-0"
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddAsset}
                      variant="outline"
                      className="w-full"
                    >
                      Add Asset
                    </Button>
                  </div>

                  <div className="space-y-4 pt-6">
                    <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                      Your Liabilities
                    </h3>
                    {liabilities.map((liability, index) => (
                      <div key={`liability-${index}`} className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`liability-name-${index}`}>Liability name</Label>
                          <Input
                            id={`liability-name-${index}`}
                            value={liability.name}
                            onChange={(event) =>
                              handleLiabilityChange(index, 'name', event.target.value)
                            }
                            placeholder="e.g. Mortgage Balance"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`liability-value-${index}`}>Balance (£)</Label>
                          <Input
                            id={`liability-value-${index}`}
                            inputMode="decimal"
                            value={liability.value}
                            onChange={(event) =>
                              handleLiabilityChange(index, 'value', event.target.value)
                            }
                            placeholder="e.g. 120,000"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveLiability(index)}
                          className="shrink-0"
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddLiability}
                      variant="outline"
                      className="w-full"
                    >
                      Add Liability
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Net Worth
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
                    Enter your assets and liabilities, then press{' '}
                    <span className="font-semibold">Calculate Net Worth</span> to see your financial
                    snapshot and track your progress.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-blue-600 dark:text-blue-200"
                          aria-hidden="true"
                        />
                        Net Worth Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Total Assets</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalAssets)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          Total Liabilities
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalLiabilities)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Net Worth</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netWorth)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Debt Ratio</p>
                        <p className="text-2xl font-semibold">{results.debtRatio.toFixed(1)}%</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="net-worth-summary"
                          title="Net Worth Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-blue-600 dark:text-blue-300"
                          aria-hidden="true"
                        />
                        Net Worth Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Net Worth Breakdown" />
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
