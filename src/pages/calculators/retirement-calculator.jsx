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
import { Calculator, Target, PiggyBank, TrendingUp, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/retirement-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/retirement-calculator';
const pageTitle = 'Retirement Calculator UK | Project Pot, Income & Withdrawal Plans';
const metaDescription =
  'Plan UK retirement goals by projecting pension growth, contributions, inflation, and withdrawal rates to estimate sustainable income, pot requirements, and any funding gap.';
const keywords = getMappedKeywords('Retirement Calculator');

const faqItems = [
  {
    question: 'How often should I review my retirement targets?',
    answer:
      'Check in at least twice each year. Update contributions after pay rises, re-run the numbers when markets move sharply, and revisit the withdrawal plan as you get closer to retiring.',
  },
  {
    question: 'What if I prefer a guaranteed income?',
    answer:
      'Use annuity quotes alongside this plan. Convert part of your pension into guaranteed income while keeping the remainder invested for growth.',
  },
  {
    question: 'Can this help with FIRE planning?',
    answer:
      'Yes. Adjust the retirement age, contributions, and withdrawal rate to model early retirement or FIRE scenarios and see how much extra saving you need.',
  },
];

const emotionalMessage =
  'Build a retirement plan with confidence. Understand how your savings, contributions, and investment returns translate into the lifestyle you want after work.';
const emotionalQuote = {
  text: 'Someone’s sitting in the shade today because someone planted a tree a long time ago.',
  author: 'Warren Buffett',
};

const directoryLinks = [
  {
    url: '/#retirement-pensions',
    label: 'Explore pension calculators',
    description: 'Plan contributions, savings growth, and income drawdown strategies.',
  },
  {
    url: '/retirement-savings-calculator',
    label: 'Retirement Savings Calculator',
    description: 'Project pension growth with salary increases and employer matches.',
  },
  {
    url: '/pension-calculator',
    label: 'Pension Calculator',
    description: 'Combine state and private pensions to estimate retirement income.',
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

const calculateRetirementPlan = ({
  currentAge,
  retirementAge,
  currentSavings,
  monthlyContribution,
  employerContribution,
  expectedReturn,
  inflationRate,
  desiredIncome,
  otherIncome,
  withdrawalRate,
}) => {
  const yearsToRetirement = Math.max(retirementAge - currentAge, 0);
  const monthsToRetirement = yearsToRetirement * 12;
  const totalMonthlyContribution = Math.max(monthlyContribution + employerContribution, 0);

  const monthlyReturn = Math.max(expectedReturn, 0) / 100 / 12;
  const inflationFactor = (1 + Math.max(inflationRate, 0) / 100) ** yearsToRetirement;

  const futureValueSavings =
    monthlyReturn === 0
      ? currentSavings
      : currentSavings * (1 + monthlyReturn) ** monthsToRetirement;

  const futureValueContributions =
    monthsToRetirement === 0
      ? 0
      : monthlyReturn === 0
      ? totalMonthlyContribution * monthsToRetirement
      : totalMonthlyContribution * (((1 + monthlyReturn) ** monthsToRetirement - 1) / monthlyReturn);

  const projectedPot = futureValueSavings + futureValueContributions;
  const realProjectedPot = inflationFactor > 0 ? projectedPot / inflationFactor : projectedPot;
  const sustainableIncome = projectedPot * (Math.max(withdrawalRate, 0) / 100);
  const realSustainableIncome = inflationFactor > 0 ? sustainableIncome / inflationFactor : sustainableIncome;
  const totalRetirementIncome = realSustainableIncome + Math.max(otherIncome, 0);
  const incomeGap = Math.max(desiredIncome - totalRetirementIncome, 0);
  const incomeSurplus = Math.max(totalRetirementIncome - desiredIncome, 0);

  const withdrawalRateDecimal = Math.max(withdrawalRate, 0) / 100;
  const requiredPot =
    withdrawalRateDecimal > 0 ? Math.max(desiredIncome - otherIncome, 0) / withdrawalRateDecimal : Infinity;
  const potShortfall = Number.isFinite(requiredPot) ? Math.max(requiredPot - projectedPot, 0) : 0;

  let requiredContribution = 0;
  if (monthsToRetirement > 0) {
    if (monthlyReturn === 0) {
      requiredContribution = Math.max(requiredPot - currentSavings, 0) / monthsToRetirement;
    } else {
      const discountedTarget = Math.max(requiredPot - futureValueSavings, 0);
      const factor = ((1 + monthlyReturn) ** monthsToRetirement - 1) / monthlyReturn;
      requiredContribution = factor > 0 ? discountedTarget / factor : 0;
    }
  }

  const extraMonthlyNeeded = Math.max(requiredContribution - totalMonthlyContribution, 0);
  const fireTarget = withdrawalRateDecimal > 0 ? desiredIncome / withdrawalRateDecimal : Infinity;
  const fireProgress = fireTarget > 0 ? projectedPot / fireTarget : 0;

  return {
    yearsToRetirement,
    projectedPot,
    realProjectedPot,
    sustainableIncome,
    realSustainableIncome,
    totalRetirementIncome,
    incomeGap,
    incomeSurplus,
    requiredPot,
    potShortfall,
    extraMonthlyNeeded,
    fireTarget,
    fireProgress,
    totalMonthlyContribution,
    futureValueContributions,
    futureValueSavings,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Current age', inputs.currentAge],
    ['Retirement age', inputs.retirementAge],
    ['Current retirement savings (£)', inputs.currentSavings],
    ['Monthly contribution (£)', inputs.monthlyContribution],
    ['Employer contribution (£)', inputs.employerContribution],
    ['Expected annual return (%)', inputs.expectedReturn],
    ['Inflation assumption (% p.a.)', inputs.inflationRate],
    ['Desired annual income (£)', inputs.desiredIncome],
    ['Other annual income (£)', inputs.otherIncome],
    ['Withdrawal rate (%)', inputs.withdrawalRate],
    [],
    ['Output', 'Value'],
    ['Years to retirement', results.yearsToRetirement],
    ['Projected pot (£)', currencyFormatter.format(results.projectedPot)],
    ['Projected pot (real £)', currencyFormatter.format(results.realProjectedPot)],
    ['Sustainable income (£)', currencyFormatter.format(results.realSustainableIncome)],
    ['Total retirement income (£)', currencyFormatter.format(results.totalRetirementIncome)],
    ['Income gap (£)', currencyFormatter.format(results.incomeGap)],
    ['Income surplus (£)', currencyFormatter.format(results.incomeSurplus)],
    ['Required pot (£)', Number.isFinite(results.requiredPot) ? currencyFormatter.format(results.requiredPot) : 'n/a'],
    ['Pot shortfall (£)', currencyFormatter.format(results.potShortfall)],
    ['Extra monthly needed (£)', currencyFormatter.format(results.extraMonthlyNeeded)],
  ];
};

const chartPalette = ['#10b981', '#3b82f6', '#f97316', '#ef4444'];

const buildChartData = (results, inputs) => {
  if (!results) return [];
  return [
    { name: 'Desired income', value: Math.max(parseNumber(inputs.desiredIncome), 0), color: chartPalette[0] },
    { name: 'Sustainable income', value: results.realSustainableIncome, color: chartPalette[1] },
    { name: 'Other income', value: Math.max(parseNumber(inputs.otherIncome), 0), color: chartPalette[2] },
    { name: 'Income gap', value: results.incomeGap, color: chartPalette[3] },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  currentAge: '38',
  retirementAge: '67',
  currentSavings: '65,000',
  monthlyContribution: '650',
  employerContribution: '350',
  expectedReturn: '5.2',
  inflationRate: '2.4',
  desiredIncome: '38,000',
  otherIncome: '11,000',
  withdrawalRate: '4',
};

export default function RetirementCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Retirement Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Retirement & Pension Calculators', url: '/calculators#retirement-pensions' },
      { name: 'Retirement Calculator', url: pagePath },
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
      const computed = calculateRetirementPlan({
        currentAge: Math.max(parseNumber(inputs.currentAge), 0),
        retirementAge: Math.max(parseNumber(inputs.retirementAge), 0),
        currentSavings: Math.max(parseNumber(inputs.currentSavings), 0),
        monthlyContribution: Math.max(parseNumber(inputs.monthlyContribution), 0),
        employerContribution: Math.max(parseNumber(inputs.employerContribution), 0),
        expectedReturn: parseNumber(inputs.expectedReturn),
        inflationRate: parseNumber(inputs.inflationRate),
        desiredIncome: Math.max(parseNumber(inputs.desiredIncome), 0),
        otherIncome: Math.max(parseNumber(inputs.otherIncome), 0),
        withdrawalRate: Math.max(parseNumber(inputs.withdrawalRate), 0),
      });
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

  const chartData = useMemo(() => buildChartData(results, inputs), [results, inputs]);

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
                Retirement Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Project your pension pot, understand sustainable retirement income, and spot any savings gap before you leave work.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Target className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Journey inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentAge">Current age</Label>
                      <Input
                        id="currentAge"
                        inputMode="decimal"
                        value={inputs.currentAge}
                        onChange={handleInputChange('currentAge')}
                        placeholder="e.g. 38"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retirementAge">Retirement age</Label>
                      <Input
                        id="retirementAge"
                        inputMode="decimal"
                        value={inputs.retirementAge}
                        onChange={handleInputChange('retirementAge')}
                        placeholder="e.g. 67"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currentSavings">Current retirement savings (£)</Label>
                      <Input
                        id="currentSavings"
                        inputMode="decimal"
                        value={inputs.currentSavings}
                        onChange={handleInputChange('currentSavings')}
                        placeholder="e.g. 65,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">Your monthly contribution (£)</Label>
                      <Input
                        id="monthlyContribution"
                        inputMode="decimal"
                        value={inputs.monthlyContribution}
                        onChange={handleInputChange('monthlyContribution')}
                        placeholder="e.g. 650"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="employerContribution">Employer contribution (£)</Label>
                      <Input
                        id="employerContribution"
                        inputMode="decimal"
                        value={inputs.employerContribution}
                        onChange={handleInputChange('employerContribution')}
                        placeholder="e.g. 350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedReturn">Expected annual return (%)</Label>
                      <Input
                        id="expectedReturn"
                        inputMode="decimal"
                        value={inputs.expectedReturn}
                        onChange={handleInputChange('expectedReturn')}
                        placeholder="e.g. 5.2"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="inflationRate">Inflation assumption (% p.a.)</Label>
                      <Input
                        id="inflationRate"
                        inputMode="decimal"
                        value={inputs.inflationRate}
                        onChange={handleInputChange('inflationRate')}
                        placeholder="e.g. 2.4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredIncome">Desired annual income (£)</Label>
                      <Input
                        id="desiredIncome"
                        inputMode="decimal"
                        value={inputs.desiredIncome}
                        onChange={handleInputChange('desiredIncome')}
                        placeholder="e.g. 38,000"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="otherIncome">Other annual income (£)</Label>
                      <Input
                        id="otherIncome"
                        inputMode="decimal"
                        value={inputs.otherIncome}
                        onChange={handleInputChange('otherIncome')}
                        placeholder="e.g. 11,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="withdrawalRate">Withdrawal rate (% of pot)</Label>
                      <Input
                        id="withdrawalRate"
                        inputMode="decimal"
                        value={inputs.withdrawalRate}
                        onChange={handleInputChange('withdrawalRate')}
                        placeholder="e.g. 4"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate retirement outlook
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
                    Enter your pension details and press <span className="font-semibold">Calculate retirement outlook</span> to see projected pots, sustainable income, and any savings gap.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Retirement summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Years to retirement</p>
                        <p className="text-2xl font-semibold">{results.yearsToRetirement}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Projected pot</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.projectedPot)}</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-200">Real terms {currencyFormatter.format(results.realProjectedPot)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Sustainable income</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.realSustainableIncome)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Total retirement income</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.totalRetirementIncome)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Income gap / surplus</p>
                        <p
                          className={`text-2xl font-semibold ${
                            results.incomeGap > 0 ? 'text-rose-300' : 'text-emerald-300'
                          }`}
                        >
                          {currencyFormatter.format(results.incomeGap > 0 ? results.incomeGap : results.incomeSurplus)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Required pot</p>
                        <p className="text-2xl font-semibold">
                          {Number.isFinite(results.requiredPot)
                            ? currencyFormatter.format(results.requiredPot)
                            : 'n/a'}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-200">Shortfall {currencyFormatter.format(results.potShortfall)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="retirement-plan"
                          title="Retirement Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Contribution progress
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Total monthly invested</span>
                        <span>{currencyFormatter.format(results.totalMonthlyContribution)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Growth from new contributions</span>
                        <span>{currencyFormatter.format(results.futureValueContributions)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Growth from existing savings</span>
                        <span>{currencyFormatter.format(results.futureValueSavings)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Extra monthly needed</span>
                        <span>{currencyFormatter.format(results.extraMonthlyNeeded)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Income outlook
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
                        <ResultBreakdownChart data={chartData} title="Retirement income comparison" />
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
