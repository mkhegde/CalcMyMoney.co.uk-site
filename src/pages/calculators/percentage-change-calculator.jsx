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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Percent,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/percentage-change-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/percentage-change-calculator';
const pageTitle = 'Percentage Change Calculator UK | Increase, Decrease & Difference';
const metaDescription =
  'Use our UK percentage change calculator to measure percentage increase, percentage decrease, and percent difference for investments, pricing, or KPIs.';
const keywords = getMappedKeywords('Percentage Change Calculator');

const faqItems = [
  {
    question: 'How do I compare two prices or salaries?',
    answer:
      'Enter the original amount and the new amount. The percentage change calculator reports the absolute difference, percentage increase, or percentage decrease so you can benchmark offers quickly.',
  },
  {
    question: 'What if I want to reverse the calculation?',
    answer:
      'Toggle the reverse mode to solve for the new value given a percentage change. It is useful when you need to target a specific price rise or cost reduction.',
  },
  {
    question: 'How is percent difference different from percent change?',
    answer:
      'Percent change compares the difference relative to the original value. Percent difference compares the change relative to the average of the two numbers. Use the percent difference calculator result when neither value is the “original”.',
  },
];

const emotionalMessage =
  'Understanding changes in your finances is crucial for smart decision-making. Use this calculator to clearly see the impact of increases, decreases, and differences on your financial journey.';
const emotionalQuote = {
  text: 'Change is the only constant in life.',
  author: 'Heraclitus',
};

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

const formatNumber = (value, decimals = 2) =>
  Number.isFinite(value) ? Number(value).toFixed(decimals) : '0.00';

const calculatePercentageChange = ({ originalValue, newValue }) => {
  const original = parseNumber(originalValue);
  const updated = parseNumber(newValue);
  const difference = updated - original;
  const percentChange = original !== 0 ? (difference / original) * 100 : 0;
  const percentIncrease = difference > 0 ? percentChange : 0;
  const percentDecrease = difference < 0 ? Math.abs(percentChange) : 0;
  const average = (Math.abs(original) + Math.abs(updated)) / 2 || 1;
  const percentDifference = (Math.abs(difference) / average) * 100;

  return {
    original,
    updated,
    difference,
    percentChange,
    percentIncrease,
    percentDecrease,
    percentDifference,
  };
};

const calculateReverseValue = ({ originalValue, percentChange }) => {
  const original = parseNumber(originalValue);
  const change = parseNumber(percentChange);
  return original * (1 + change / 100);
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Original Value (£)', formatNumber(parseNumber(inputs.originalValue), inputs.decimals)],
    ['New Value (£)', formatNumber(parseNumber(inputs.newValue), inputs.decimals)],
    ['Decimal Places', inputs.decimals],
    ['Reverse Mode', inputs.reverseMode ? 'Enabled' : 'Disabled'],
    ['Target Percent Change (%)', `${inputs.reversePercent}%`],
    [],
    ['Difference (£)', formatNumber(results.difference, inputs.decimals)],
    ['Percentage Change (%)', `${formatNumber(results.percentChange, inputs.decimals)}%`],
    ['Percentage Increase (%)', `${formatNumber(results.percentIncrease, inputs.decimals)}%`],
    ['Percentage Decrease (%)', `${formatNumber(results.percentDecrease, inputs.decimals)}%`],
    ['Percent Difference (%)', `${formatNumber(results.percentDifference, inputs.decimals)}%`],
  ];

  if (inputs.reverseMode) {
    csvRows.push([
      'New Value Required (Reverse Calculation) (£)',
      formatNumber(calculateReverseValue(inputs), inputs.decimals),
    ]);
  }
  return csvRows;
}

function buildChartData(results) {
  if (!results) return [];
  const data = [];
  if (results.percentIncrease > 0) {
    data.push({ name: 'Percentage Increase', value: results.percentIncrease, color: '#10b981' });
  }
  if (results.percentDecrease > 0) {
    data.push({ name: 'Percentage Decrease', value: results.percentDecrease, color: '#ef4444' });
  }
  if (data.length === 0 && results.percentChange === 0) {
    data.push({ name: 'No Change', value: 100, color: '#3b82f6' }); // Placeholder for no change
  }
  return data;
}

export default function PercentageChangeCalculatorPage() {
  const [inputs, setInputs] = useState({
    originalValue: '1,250',
    newValue: '1,485',
    decimals: '2',
    reverseMode: false,
    reversePercent: '12',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Percentage Change Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting-planning' },
      { name: 'Percentage Change Calculator', url: pagePath },
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

  const handleReverseModeToggle = useCallback(() => {
    setInputs((prev) => ({ ...prev, reverseMode: !prev.reverseMode }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedResults = calculatePercentageChange(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      originalValue: '1,250',
      newValue: '1,485',
      decimals: '2',
      reverseMode: false,
      reversePercent: '12',
    });
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Percentage Change Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Measure increases, decreases, and differences instantly—perfect for investments,
              pricing, or KPI dashboards.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Percent className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-950/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            footerColor="text-indigo-700 dark:text-indigo-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                    aria-hidden="true"
                  />
                  Value Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="originalValue">Original value (£)</Label>
                      <Input
                        id="originalValue"
                        inputMode="decimal"
                        value={inputs.originalValue}
                        onChange={handleInputChange('originalValue')}
                        placeholder="e.g. 1,250"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newValue">New value (£)</Label>
                      <Input
                        id="newValue"
                        inputMode="decimal"
                        value={inputs.newValue}
                        onChange={handleInputChange('newValue')}
                        placeholder="e.g. 1,485"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="decimals">Decimal places</Label>
                      <Input
                        id="decimals"
                        inputMode="numeric"
                        value={inputs.decimals}
                        onChange={handleInputChange('decimals')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reverseMode" className="text-sm font-medium">
                        Reverse calculation mode
                      </Label>
                      <Button
                        type="button"
                        variant={inputs.reverseMode ? 'default' : 'outline'}
                        onClick={handleReverseModeToggle}
                        className="w-full"
                      >
                        {inputs.reverseMode ? 'Enabled' : 'Disabled'}
                      </Button>
                    </div>
                    {inputs.reverseMode && (
                      <div className="space-y-2">
                        <Label htmlFor="reversePercent">Target percent change (%)</Label>
                        <Input
                          id="reversePercent"
                          inputMode="decimal"
                          value={inputs.reversePercent}
                          onChange={handleInputChange('reversePercent')}
                          placeholder="e.g. 12"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Change
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
                    Enter your original and new values, then press{' '}
                    <span className="font-semibold">Calculate Change</span> to see the percentage
                    increase, decrease, or difference.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Change Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Difference</p>
                        <p className="text-2xl font-semibold">
                          {formatNumber(results.difference, inputs.decimals)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Percentage change
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatNumber(results.percentChange, inputs.decimals)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Percentage increase
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatNumber(results.percentIncrease, inputs.decimals)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Percentage decrease
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatNumber(results.percentDecrease, inputs.decimals)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Percent difference
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatNumber(results.percentDifference, inputs.decimals)}%
                        </p>
                      </div>
                      {inputs.reverseMode && (
                        <div>
                          <p className="text-sm text-indigo-900 dark:text-indigo-200">
                            New value required
                          </p>
                          <p className="text-2xl font-semibold">
                            {formatNumber(calculateReverseValue(inputs), inputs.decimals)}
                          </p>
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="percentage-change-results"
                          title="Percentage Change Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Change Visualisation
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
                          title="Percentage Change Breakdown"
                        />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides a mathematical calculation of percentage change.
                        Always consider the context of the numbers when interpreting results for
                        financial decisions.
                      </p>
                      <p>
                        For complex financial analysis, consult with a qualified financial advisor.
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
</div>
      </CalculatorWrapper>
    </div>
  );
}
