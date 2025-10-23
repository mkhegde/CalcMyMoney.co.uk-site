import React, { useCallback, useMemo, useState, Suspense } from 'react';
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
import { Calculator, PiggyBank, TrendingUp, LineChart, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/savings-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/savings-calculator';
const pageTitle = 'Savings Calculator UK | Compound Interest & Growth Planner';
const metaDescription =
  'Project savings balances with our UK savings calculator. Combine monthly contributions, compound interest, and inflation assumptions to hit your financial goals.';
const keywords = getMappedKeywords('Savings Calculator');

const faqItems = [
  {
    question: 'How often should I review my savings plan?',
    answer:
      'Check progress every few months or after pay rises. Update contribution increases when your salary changes or expenses shift so the projection stays realistic.',
  },
  {
    question: 'Can I compare fixed-rate and regular savings?',
    answer:
      'Yes. Set monthly contributions to zero to model a one-off fixed-rate bond, or add regular deposits for an easy-access account. Duplicate the calculation with different rates and terms to compare.',
  },
  {
    question: 'How do I account for inflation?',
    answer:
      'Use the inflation field to see the “real” spending power of your pot. Long-term goals such as house deposits or school fees benefit from conservative inflation assumptions.',
  },
];

const emotionalMessage =
  'Small, consistent contributions add up. Visualise your future balance, tweak the plan, and stay motivated as the projection line nudges closer to your goal.';
const emotionalQuote = {
  text: 'Do something today that your future self will thank you for.',
  author: 'Sean Patrick Flanery',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const defaultInputs = {
  initialDeposit: '7,500',
  monthlyContribution: '350',
  annualRate: '4.2',
  compoundingFrequency: '12',
  savingYears: '8',
  inflationRate: '2',
  contributionIncrease: '2',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateSavingsGrowth = (inputs) => {
  const initialDeposit = Math.max(parseNumber(inputs.initialDeposit), 0);
  const monthlyContribution = Math.max(parseNumber(inputs.monthlyContribution), 0);
  const annualRate = Math.max(parseNumber(inputs.annualRate), 0);
  const compoundingFrequency = Math.max(parseNumber(inputs.compoundingFrequency), 1);
  const savingYears = Math.max(parseNumber(inputs.savingYears), 0);
  const inflationRate = Math.max(parseNumber(inputs.inflationRate), 0);
  const contributionIncrease = Math.max(parseNumber(inputs.contributionIncrease), 0);

  const periodsPerYear = compoundingFrequency;
  const totalPeriods = Math.max(Math.round(savingYears * periodsPerYear), 0);
  const periodicRate = annualRate / 100 / periodsPerYear;
  const monthlyInflationRate = inflationRate / 100 / 12;
  const monthlyIncreaseRate = contributionIncrease / 100 / 12;

  let balance = initialDeposit;
  let totalContributions = initialDeposit;
  let interestAccrued = 0;
  let currentContribution = monthlyContribution;
  const projection = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    if (monthlyContribution > 0) {
      balance += currentContribution;
      totalContributions += currentContribution;
      currentContribution *= 1 + monthlyIncreaseRate;
    }

    if (periodicRate > 0) {
      const interest = balance * periodicRate;
      balance += interest;
      interestAccrued += interest;
    }

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      const inflationFactor = (1 + monthlyInflationRate) ** (year * 12);
      projection.push({
        year,
        balance,
        contributions: totalContributions,
        interestAccrued,
        realBalance: inflationFactor > 0 ? balance / inflationFactor : balance,
      });
    }
  }

  const inflationFactorTotal = (1 + monthlyInflationRate) ** (savingYears * 12);
  const realBalance = inflationFactorTotal > 0 ? balance / inflationFactorTotal : balance;

  return {
    initialDeposit,
    finalBalance: balance,
    totalContributions,
    interestAccrued,
    realBalance,
    projection,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  const rows = [
    ['Input', 'Value'],
    ['Initial deposit (£)', inputs.initialDeposit],
    ['Monthly contribution (£)', inputs.monthlyContribution],
    ['Annual interest rate (%)', `${percentFormatter.format(parseNumber(inputs.annualRate))}%`],
    ['Compounding frequency (per year)', inputs.compoundingFrequency],
    ['Saving term (years)', inputs.savingYears],
    ['Annual contribution increase (%)', `${percentFormatter.format(parseNumber(inputs.contributionIncrease))}%`],
    ['Inflation rate (%)', `${percentFormatter.format(parseNumber(inputs.inflationRate))}%`],
    [],
    ['Output', 'Value'],
    ['Final balance (£)', currencyFormatter.format(results.finalBalance)],
    ['Total contributions (£)', currencyFormatter.format(results.totalContributions)],
    ['Interest earned (£)', currencyFormatter.format(results.interestAccrued)],
    ['Inflation-adjusted balance (£)', currencyFormatter.format(results.realBalance)],
    [],
    ['Year', 'Balance (£)', 'Contributions (£)', 'Interest earned (£)', 'Real balance (£)'],
  ];

  results.projection.forEach((point) => {
    rows.push([
      point.year,
      currencyFormatter.format(point.balance),
      currencyFormatter.format(point.contributions),
      currencyFormatter.format(point.interestAccrued),
      currencyFormatter.format(point.realBalance),
    ]);
  });

  return rows;
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Initial deposit', value: results.initialDeposit, color: '#0ea5e9' },
    {
      name: 'Ongoing contributions',
      value: Math.max(results.totalContributions - results.initialDeposit, 0),
      color: '#22c55e',
    },
    { name: 'Interest earned', value: results.interestAccrued, color: '#6366f1' },
  ].filter((segment) => segment.value > 0);
};

export default function SavingsCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Savings Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Savings & Budgeting Calculators', url: '/calculators#savings' },
      { name: 'Savings Calculator', url: pagePath },
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
      const computed = calculateSavingsGrowth(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
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
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Savings Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Forecast how your savings pot could grow with monthly contributions, compound interest,
              and inflation adjustments.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Savings inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="initialDeposit">Initial deposit (£)</Label>
                      <Input
                        id="initialDeposit"
                        inputMode="decimal"
                        value={inputs.initialDeposit}
                        onChange={handleInputChange('initialDeposit')}
                        placeholder="e.g. 7,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                      <Input
                        id="monthlyContribution"
                        inputMode="decimal"
                        value={inputs.monthlyContribution}
                        onChange={handleInputChange('monthlyContribution')}
                        placeholder="e.g. 350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRate">Annual interest rate (%)</Label>
                      <Input
                        id="annualRate"
                        inputMode="decimal"
                        value={inputs.annualRate}
                        onChange={handleInputChange('annualRate')}
                        placeholder="e.g. 4.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compoundingFrequency">Compounding frequency (per year)</Label>
                      <Input
                        id="compoundingFrequency"
                        inputMode="numeric"
                        value={inputs.compoundingFrequency}
                        onChange={handleInputChange('compoundingFrequency')}
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="savingYears">Saving term (years)</Label>
                      <Input
                        id="savingYears"
                        inputMode="decimal"
                        value={inputs.savingYears}
                        onChange={handleInputChange('savingYears')}
                        placeholder="e.g. 8"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contributionIncrease">Annual contribution increase (%)</Label>
                      <Input
                        id="contributionIncrease"
                        inputMode="decimal"
                        value={inputs.contributionIncrease}
                        onChange={handleInputChange('contributionIncrease')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="inflationRate">Inflation assumption (%)</Label>
                      <Input
                        id="inflationRate"
                        inputMode="decimal"
                        value={inputs.inflationRate}
                        onChange={handleInputChange('inflationRate')}
                        placeholder="e.g. 2"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate savings growth
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
                    Add your deposit, contributions, and interest rate, then press
                    <span className="font-semibold"> Calculate savings growth</span> to view projected
                    balances and charts.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Savings summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
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
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Real (inflation-adjusted) balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.realBalance)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="savings-calculator-results"
                          title="Savings Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Year-by-year projection
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      {results.projection.length === 0 ? (
                        <p className="text-center">
                          Extend the saving term to display annual balances.
                        </p>
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
                            <div className="flex items-center justify-between text-xs sm:text-sm">
                              <span>Real balance</span>
                              <span>{currencyFormatter.format(point.realBalance)}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Contributions vs growth
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
                        Actual interest rates vary. Check your provider’s small print for compounding
                        frequency, withdrawal penalties, and rate changes after introductory periods.
                      </p>
                      <p>
                        Inflation assumptions are estimates. Re-run the calculation annually to confirm your
                        plan still meets your goals in real terms.
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
