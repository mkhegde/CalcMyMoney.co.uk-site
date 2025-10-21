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
import { Calculator, PiggyBank, TrendingUp, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/pension-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/pension-calculator';
const pageTitle = 'Pension Calculator UK | Project Retirement Savings & Growth';
const metaDescription =
  'Use our UK pension calculator to project retirement savings, compare options, and balance private and workplace pension contributions.';
const keywords = getMappedKeywords('Pension Calculator');

const faqItems = [
  {
    question: 'How much should I contribute to my pension?',
    answer:
      'Aim for at least 12-15% of gross pay when combining personal and employer contributions. Increase the rate when you receive a promotion or pay rise.',
  },
  {
    question: 'What growth rate should I assume?',
    answer:
      'Long-term diversified portfolios have returned 4-6% above inflation historically. Use a conservative figure (e.g. 4%) to build a safety margin.',
  },
  {
    question: 'Does this pension calculator include the State Pension?',
    answer:
      'You can add expected State Pension income in the “Other retirement income” field. Check your State Pension forecast regularly for up-to-date estimates.',
  },
];

const emotionalMessage =
  'Your retirement dreams are within reach with careful planning. Use this pension calculator to visualize your future financial security and stay motivated to build your ideal retirement.';
const emotionalQuote = {
  text: 'The best way to predict the future is to create it.',
  author: 'Peter Drucker',
};

const directoryLinks = [
  {
    url: '/#retirement-pensions',
    label: 'Explore all retirement & pension calculators',
    description: 'Plan retirement ages, pension withdrawals, and contribution strategies.',
  },
  {
    url: '/pension-contribution-calculator',
    label: 'Pension Contribution Calculator',
    description: 'Find the contribution level that maximises employer match and tax relief.',
  },
  {
    url: '/retirement-savings-calculator',
    label: 'Retirement Savings Calculator',
    description: 'Work out the age you can retire based on savings, pensions, and lifestyle costs.',
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

const calculatePensionGrowth = ({
  currentAge,
  retirementAge,
  currentPot,
  monthlyContribution,
  employerContribution,
  annualReturn,
  annualIncomeGoal,
  otherRetirementIncome,
}) => {
  const parsedCurrentAge = parseNumber(currentAge);
  const parsedRetirementAge = parseNumber(retirementAge);
  const parsedCurrentPot = parseNumber(currentPot);
  const parsedMonthlyContribution = parseNumber(monthlyContribution);
  const parsedEmployerContribution = parseNumber(employerContribution);
  const parsedAnnualReturn = parseNumber(annualReturn);
  const parsedAnnualIncomeGoal = parseNumber(annualIncomeGoal);
  const parsedOtherRetirementIncome = parseNumber(otherRetirementIncome);

  const years = Math.max(parsedRetirementAge - parsedCurrentAge, 0);
  const months = years * 12;
  const monthlyRate = parsedAnnualReturn / 100 / 12;
  let balance = parsedCurrentPot;
  let totalContributions = parsedCurrentPot;

  for (let month = 1; month <= months; month += 1) {
    const contribution = parsedMonthlyContribution + parsedEmployerContribution;
    balance += contribution;
    totalContributions += contribution;
    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }
  }

  const incomeGap = Math.max(parsedAnnualIncomeGoal - parsedOtherRetirementIncome, 0);
  const requiredPotForIncome = incomeGap / 0.04; // 4% rule
  const potGap = Math.max(requiredPotForIncome - balance, 0);

  return {
    balance,
    totalContributions,
    years,
    incomeGap,
    requiredPotForIncome,
    potGap,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Current Age', inputs.currentAge],
    ['Retirement Age', inputs.retirementAge],
    ['Current Pension Pot (£)', currencyFormatter.format(parseNumber(inputs.currentPot))],
    [
      'Your Monthly Contribution (£)',
      currencyFormatter.format(parseNumber(inputs.monthlyContribution)),
    ],
    [
      'Employer Monthly Contribution (£)',
      currencyFormatter.format(parseNumber(inputs.employerContribution)),
    ],
    ['Expected Annual Growth (%)', `${inputs.annualReturn}%`],
    [
      'Target Retirement Income (£/year)',
      currencyFormatter.format(parseNumber(inputs.annualIncomeGoal)),
    ],
    [
      'Other Retirement Income (£/year)',
      currencyFormatter.format(parseNumber(inputs.otherRetirementIncome)),
    ],
    [],
    ['Years Investing', results.years],
    ['Final Pension Pot (£)', currencyFormatter.format(results.balance)],
    ['Total Contributions (£)', currencyFormatter.format(results.totalContributions)],
    ['Pension Pot Gap (£)', currencyFormatter.format(results.potGap)],
    ['Required Pot for Income (£)', currencyFormatter.format(results.requiredPotForIncome)],
    ['Annual Income Gap (£)', currencyFormatter.format(results.incomeGap)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Total Contributions', value: results.totalContributions, color: '#3b82f6' },
    {
      name: 'Investment Growth',
      value: results.balance - results.totalContributions,
      color: '#10b981',
    },
  ].filter((segment) => segment.value > 0);
}

export default function PensionCalculatorPage() {
  const [inputs, setInputs] = useState({
    currentAge: '35',
    retirementAge: '67',
    currentPot: '55,000',
    monthlyContribution: '400',
    employerContribution: '200',
    annualReturn: '5',
    annualIncomeGoal: '38,000',
    otherRetirementIncome: '11,000',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Pension Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Retirement & Pensions Calculators', url: '/calculators#retirement-pensions' },
      { name: 'Pension Calculator', url: pagePath },
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
      const computedResults = calculatePensionGrowth(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      currentAge: '35',
      retirementAge: '67',
      currentPot: '55,000',
      monthlyContribution: '400',
      employerContribution: '200',
      annualReturn: '5',
      annualIncomeGoal: '38,000',
      otherRetirementIncome: '11,000',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Pension Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Project your retirement savings, model contributions, and see if you are on track to
              hit your pension income goals in the UK.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  Pension Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="currentAge">Current age</Label>
                      <Input
                        id="currentAge"
                        inputMode="numeric"
                        value={inputs.currentAge}
                        onChange={handleInputChange('currentAge')}
                        placeholder="e.g. 35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retirementAge">Retirement age</Label>
                      <Input
                        id="retirementAge"
                        inputMode="numeric"
                        value={inputs.retirementAge}
                        onChange={handleInputChange('retirementAge')}
                        placeholder="e.g. 67"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currentPot">Current pension pot (£)</Label>
                      <Input
                        id="currentPot"
                        inputMode="decimal"
                        value={inputs.currentPot}
                        onChange={handleInputChange('currentPot')}
                        placeholder="e.g. 55,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">Your contribution (£/month)</Label>
                      <Input
                        id="monthlyContribution"
                        inputMode="decimal"
                        value={inputs.monthlyContribution}
                        onChange={handleInputChange('monthlyContribution')}
                        placeholder="e.g. 400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employerContribution">Employer contribution (£/month)</Label>
                      <Input
                        id="employerContribution"
                        inputMode="decimal"
                        value={inputs.employerContribution}
                        onChange={handleInputChange('employerContribution')}
                        placeholder="e.g. 200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualReturn">Expected annual growth (%)</Label>
                      <Input
                        id="annualReturn"
                        inputMode="decimal"
                        value={inputs.annualReturn}
                        onChange={handleInputChange('annualReturn')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualIncomeGoal">Target retirement income (£/year)</Label>
                      <Input
                        id="annualIncomeGoal"
                        inputMode="decimal"
                        value={inputs.annualIncomeGoal}
                        onChange={handleInputChange('annualIncomeGoal')}
                        placeholder="e.g. 38,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherRetirementIncome">
                        Other retirement income (£/year)
                      </Label>
                      <Input
                        id="otherRetirementIncome"
                        inputMode="decimal"
                        value={inputs.otherRetirementIncome}
                        onChange={handleInputChange('otherRetirementIncome')}
                        placeholder="e.g. 11,000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Pension Growth
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
                    Enter your pension details and goals, then press{' '}
                    <span className="font-semibold">Calculate Pension Growth</span> to see your
                    projected retirement pot and income.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-200"
                          aria-hidden="true"
                        />
                        Pension Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Years investing
                        </p>
                        <p className="text-2xl font-semibold">{results.years}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Final pot</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total contributions
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalContributions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Pot gap</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.potGap)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="pension-projection"
                          title="Pension Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        Growth Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Pension Growth Breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides an estimate based on your inputs. Investment
                        returns are not guaranteed, and the value of investments can go down as well
                        as up.
                      </p>
                      <p>
                        Always consult with a qualified financial advisor for personalized pension
                        planning and investment advice.
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
