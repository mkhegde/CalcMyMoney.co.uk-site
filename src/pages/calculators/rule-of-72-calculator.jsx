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
import { Hourglass, Calculator, TrendingUp, LineChart, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/rule-of-72-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rule-of-72-calculator';
const pageTitle = 'Rule of 72 Calculator UK | Doubling Time & Growth Projection';
const metaDescription =
  'Estimate how quickly investments could double with the UK-focused rule of 72 calculator. Model annual growth, contributions, and compound interest timelines.';
const keywords = getMappedKeywords('Rule of 72 Calculator');

const faqItems = [
  {
    question: 'How accurate is the rule of 72?',
    answer:
      'The rule of 72 is a quick mental model. It works best for annual returns between 4% and 12%. For detailed cash-flow planning, combine this tool with a compound interest calculator.',
  },
  {
    question: 'Can I test different return rates?',
    answer:
      'Yes. Enter new return assumptions to see how doubling timelines change. Higher returns shorten the timeline, while lower returns extend it.',
  },
  {
    question: 'What if my goal is not simply to double?',
    answer:
      'Use the projection to see the balance every year. Adjust the target horizon to compare different savings or investment milestones.',
  },
];

const emotionalMessage =
  'Visualise how consistent saving and sensible returns compound over time. Stay invested, stay patient, and let the numbers keep you motivated.';
const emotionalQuote = {
  text: 'Do not save what is left after spending, but spend what is left after saving.',
  author: 'Warren Buffett',
};

const directoryLinks = [
  {
    url: '/#investing',
    label: 'See all investing calculators',
    description: 'Build projections, test market assumptions, and plan financial independence.',
  },
  {
    url: '/calculators/compound-interest-calculator',
    label: 'Compound Interest Calculator',
    description: 'Project annual balances with monthly top-ups and inflation assumptions.',
  },
  {
    url: '/calculators/savings-calculator',
    label: 'Savings Calculator',
    description: 'Compare contribution strategies and interest rates for UK savings goals.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const defaultInputs = {
  rateOfReturn: '6',
  targetYears: '15',
  startingAmount: '10,000',
  monthlyContribution: '250',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateRuleOf72 = (inputs) => {
  const rateOfReturn = Math.max(parseNumber(inputs.rateOfReturn), 0);
  const targetYears = Math.max(parseNumber(inputs.targetYears), 0);
  const startingAmount = Math.max(parseNumber(inputs.startingAmount), 0);
  const monthlyContribution = Math.max(parseNumber(inputs.monthlyContribution), 0);

  const doublingTime = rateOfReturn > 0 ? 72 / rateOfReturn : Infinity;
  const monthlyRate = rateOfReturn / 100 / 12;
  const months = Math.max(Math.round(targetYears * 12), 0);

  let balance = startingAmount;
  let totalContributions = startingAmount;
  let interestAccrued = 0;
  const projection = [];

  for (let month = 1; month <= months; month += 1) {
    if (monthlyContribution > 0) {
      balance += monthlyContribution;
      totalContributions += monthlyContribution;
    }

    if (monthlyRate > 0) {
      const interest = balance * monthlyRate;
      balance += interest;
      interestAccrued += interest;
    }

    if (month % 12 === 0) {
      projection.push({
        year: month / 12,
        balance,
        contributions: totalContributions,
        interestAccrued,
      });
    }
  }

  const doubled = balance >= startingAmount * 2;

  return {
    rateOfReturn,
    targetYears,
    startingAmount,
    monthlyContribution,
    doublingTime,
    projection,
    finalBalance: balance,
    totalContributions,
    interestAccrued,
    doubled,
  };
};

const buildCsvData = (results) => {
  if (!results) return null;

  const rows = [
    ['Metric', 'Value'],
    ['Expected annual return (%)', `${percentFormatter.format(results.rateOfReturn)}%`],
    ['Projection length (years)', numberFormatter.format(results.targetYears)],
    ['Starting amount (£)', currencyFormatter.format(results.startingAmount)],
    ['Monthly contribution (£)', currencyFormatter.format(results.monthlyContribution)],
    ['Estimated doubling time (years)',
      Number.isFinite(results.doublingTime)
        ? numberFormatter.format(results.doublingTime)
        : 'Not available'],
    ['Total contributions (£)', currencyFormatter.format(results.totalContributions)],
    ['Interest earned (£)', currencyFormatter.format(results.interestAccrued)],
    ['Projected final balance (£)', currencyFormatter.format(results.finalBalance)],
    [],
    ['Year', 'Balance (£)', 'Total contributions (£)', 'Interest earned (£)'],
  ];

  results.projection.forEach((point) => {
    rows.push([
      point.year,
      currencyFormatter.format(point.balance),
      currencyFormatter.format(point.contributions),
      currencyFormatter.format(point.interestAccrued),
    ]);
  });

  return rows;
};

const buildChartData = (results) => {
  if (!results) return [];
  const additionalContributions = Math.max(
    results.totalContributions - results.startingAmount,
    0
  );
  return [
    { name: 'Starting capital', value: results.startingAmount, color: '#0ea5e9' },
    { name: 'Ongoing contributions', value: additionalContributions, color: '#22c55e' },
    { name: 'Interest earned', value: results.interestAccrued, color: '#6366f1' },
  ].filter((segment) => segment.value > 0);
};

export default function RuleOf72CalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Rule of 72 Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Investing & Savings Calculators', url: '/calculators#investing' },
      { name: 'Rule of 72 Calculator', url: pagePath },
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
      const computed = calculateRuleOf72(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Hourglass className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Rule of 72 Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate doubling timelines, compare growth scenarios, and map the impact of regular
              contributions on your investment balance.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-900/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Projection inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="rateOfReturn">Expected annual return (%)</Label>
                    <Input
                      id="rateOfReturn"
                      inputMode="decimal"
                      value={inputs.rateOfReturn}
                      onChange={handleInputChange('rateOfReturn')}
                      placeholder="e.g. 6"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetYears">Projection length (years)</Label>
                    <Input
                      id="targetYears"
                      inputMode="decimal"
                      value={inputs.targetYears}
                      onChange={handleInputChange('targetYears')}
                      placeholder="e.g. 15"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="startingAmount">Starting amount (£)</Label>
                      <Input
                        id="startingAmount"
                        inputMode="decimal"
                        value={inputs.startingAmount}
                        onChange={handleInputChange('startingAmount')}
                        placeholder="e.g. 10,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                      <Input
                        id="monthlyContribution"
                        inputMode="decimal"
                        value={inputs.monthlyContribution}
                        onChange={handleInputChange('monthlyContribution')}
                        placeholder="e.g. 250"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate timeline
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
                    Enter your assumptions and press <span className="font-semibold">Calculate timeline</span>
                    to see doubling estimates, contribution totals, and a projection chart.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Doubling overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Estimated doubling time</p>
                        <p className="text-2xl font-semibold">
                          {Number.isFinite(results.doublingTime)
                            ? `${numberFormatter.format(results.doublingTime)} years`
                            : 'Not available'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Final balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.finalBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Total contributions</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalContributions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Interest earned</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.interestAccrued)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Did the pot double?</p>
                        <p className="text-2xl font-semibold">{results.doubled ? 'Yes' : 'Not yet'}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="rule-of-72-results"
                          title="Rule of 72 Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Annual projection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      {results.projection.length === 0 ? (
                        <p className="text-center">Extend the projection length to view yearly balances.</p>
                      ) : (
                        results.projection.map((point) => (
                          <div
                            key={point.year}
                            className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-slate-700 dark:text-slate-100">
                                Year {point.year}
                              </span>
                              <span>{currencyFormatter.format(point.balance)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span>Total contributions</span>
                              <span>{currencyFormatter.format(point.contributions)}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span>Interest earned to date</span>
                              <span>{currencyFormatter.format(point.interestAccrued)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Contribution vs growth mix
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
                        <ResultBreakdownChart data={chartData} title="Savings growth breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Markets fluctuate. Revisit projections regularly and use conservative rates for
                        essential goals. Adjust for fees and taxes when investing through ISAs or pensions.
                      </p>
                      <p>
                        The rule of 72 assumes annual compounding. If your returns are irregular, use a
                        detailed cash-flow model or spreadsheet to capture timing effects.
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
