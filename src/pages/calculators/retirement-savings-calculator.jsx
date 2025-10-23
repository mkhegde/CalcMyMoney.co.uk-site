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
import { PiggyBank, CalendarClock, LineChart, TrendingUp, Calculator } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/retirement-savings-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/retirement-savings-calculator';
const pageTitle = 'Retirement Savings Calculator UK | Project Pension Growth & Income';
const metaDescription =
  'Project retirement savings growth in the UK with monthly and employer contributions, salary increases, investment returns, and withdrawal planning to meet your income goals.';
const keywords = getMappedKeywords('Retirement Savings Calculator');

const faqItems = [
  {
    question: 'How often should I revisit my plan?',
    answer:
      'Re-run the calculator each year or after major life changes. Updating assumptions keeps your pension plan aligned with current pay, contributions, and risk appetite.',
  },
  {
    question: 'What if I change jobs or contribution rates?',
    answer:
      'Adjust the monthly contributions, employer match, and salary growth inputs. The projection shows the long-term impact instantly.',
  },
  {
    question: 'How do future value projections help?',
    answer:
      'Future value calculations show how today’s decisions compound. Combine them with stress tests for returns or salary changes to see how resilient your plan is.',
  },
];

const emotionalMessage =
  'Turn your pension contributions into a roadmap. Track how every contribution and pay rise moves you closer to your ideal retirement income.';
const emotionalQuote = {
  text: 'Do something today that your future self will thank you for.',
  author: 'Sean Patrick Flanery',
};

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

const projectRetirementSavings = ({
  currentAge,
  retirementAge,
  currentPot,
  monthlyContribution,
  employerMatchPercent,
  annualSalary,
  salaryGrowthPercent,
  annualReturn,
}) => {
  const yearsToRetirement = Math.max(Math.floor(retirementAge - currentAge), 0);
  const growthRate = Math.max(annualReturn, 0) / 100;
  const salaryGrowth = Math.max(salaryGrowthPercent, 0) / 100;

  let balance = Math.max(currentPot, 0);
  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;
  let growthEarned = 0;
  const yearlyBreakdown = [];

  if (yearsToRetirement === 0) {
    yearlyBreakdown.push({
      age: currentAge,
      balance,
      employee: 0,
      employer: 0,
      growth: 0,
    });
    return {
      balance,
      totalEmployeeContributions,
      totalEmployerContributions,
      growthEarned,
      yearlyBreakdown,
      yearsToRetirement,
    };
  }

  for (let year = 0; year < yearsToRetirement; year += 1) {
    const salaryForYear = Math.max(annualSalary, 0) * (1 + salaryGrowth) ** year;
    const employeeContributionYear = Math.max(monthlyContribution, 0) * 12 * (1 + salaryGrowth) ** year;
    const employerContributionYear = salaryForYear * Math.max(employerMatchPercent, 0) / 100;
    const contributionsForYear = employeeContributionYear + employerContributionYear;

    balance += contributionsForYear;
    totalEmployeeContributions += employeeContributionYear;
    totalEmployerContributions += employerContributionYear;

    const growth = balance * growthRate;
    growthEarned += growth;
    balance += growth;

    if ((year + 1) % 5 === 0 || year === yearsToRetirement - 1) {
      yearlyBreakdown.push({
        age: currentAge + year + 1,
        balance,
        employee: employeeContributionYear,
        employer: employerContributionYear,
        growth,
      });
    }
  }

  return {
    balance,
    totalEmployeeContributions,
    totalEmployerContributions,
    growthEarned,
    yearlyBreakdown,
    yearsToRetirement,
  };
};

const calculateRequiredPot = ({ desiredMonthlyIncome, withdrawalRatePercent }) => {
  const income = Math.max(desiredMonthlyIncome, 0);
  const withdrawalRate = Math.max(withdrawalRatePercent, 0) / 100;
  if (withdrawalRate === 0) return income > 0 ? Infinity : 0;
  return (income * 12) / withdrawalRate;
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Current age', inputs.currentAge],
    ['Retirement age', inputs.retirementAge],
    ['Current pension pot (£)', inputs.currentPot],
    ['Monthly contribution (£)', inputs.monthlyContribution],
    ['Employer match (% of salary)', inputs.employerMatchPercent],
    ['Annual salary (£)', inputs.annualSalary],
    ['Salary growth (%)', inputs.salaryGrowthPercent],
    ['Expected annual return (%)', inputs.annualReturn],
    ['Withdrawal rate (%)', inputs.withdrawalRatePercent],
    ['Retirement duration (years)', inputs.retirementYears],
    ['Desired monthly income (£)', inputs.desiredMonthlyIncome],
    [],
    ['Output', 'Value'],
    ['Projected pot (£)', currencyFormatter.format(results.balance)],
    ['Total employee contributions (£)', currencyFormatter.format(results.totalEmployeeContributions)],
    ['Total employer contributions (£)', currencyFormatter.format(results.totalEmployerContributions)],
    ['Growth earned (£)', currencyFormatter.format(results.growthEarned)],
    ['Required pot (£)', Number.isFinite(results.requiredPot) ? currencyFormatter.format(results.requiredPot) : 'n/a'],
    ['Sustainable monthly income (£)', currencyFormatter.format(results.sustainableMonthlyIncome)],
    ['Target monthly income (£)', currencyFormatter.format(results.desiredMonthlyIncome)],
    ['Income coverage (%)', `${results.incomeProgress.toFixed(1)}%`],
  ];
};

const chartPalette = ['#10b981', '#3b82f6', '#f97316'];

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Employee contributions', value: results.totalEmployeeContributions, color: chartPalette[0] },
    { name: 'Employer contributions', value: results.totalEmployerContributions, color: chartPalette[1] },
    { name: 'Investment growth', value: results.growthEarned, color: chartPalette[2] },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  currentAge: '32',
  retirementAge: '67',
  currentPot: '42,000',
  monthlyContribution: '450',
  employerMatchPercent: '4',
  annualSalary: '52,000',
  salaryGrowthPercent: '2.5',
  annualReturn: '5.2',
  withdrawalRatePercent: '4',
  retirementYears: '25',
  desiredMonthlyIncome: '2,800',
};

export default function RetirementSavingsCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Retirement Savings Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Retirement & Pension Calculators', url: '/calculators#retirement-pensions' },
      { name: 'Retirement Savings Calculator', url: pagePath },
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
      const parsedInputs = {
        currentAge: Math.max(parseNumber(inputs.currentAge), 0),
        retirementAge: Math.max(parseNumber(inputs.retirementAge), 0),
        currentPot: Math.max(parseNumber(inputs.currentPot), 0),
        monthlyContribution: Math.max(parseNumber(inputs.monthlyContribution), 0),
        employerMatchPercent: Math.max(parseNumber(inputs.employerMatchPercent), 0),
        annualSalary: Math.max(parseNumber(inputs.annualSalary), 0),
        salaryGrowthPercent: parseNumber(inputs.salaryGrowthPercent),
        annualReturn: parseNumber(inputs.annualReturn),
        withdrawalRatePercent: Math.max(parseNumber(inputs.withdrawalRatePercent), 0),
        retirementYears: Math.max(parseNumber(inputs.retirementYears), 0),
        desiredMonthlyIncome: Math.max(parseNumber(inputs.desiredMonthlyIncome), 0),
      };

      const projection = projectRetirementSavings(parsedInputs);
      const requiredPot = calculateRequiredPot({
        desiredMonthlyIncome: parsedInputs.desiredMonthlyIncome,
        withdrawalRatePercent: parsedInputs.withdrawalRatePercent,
      });
      const sustainableAnnualIncome = projection.balance * (parsedInputs.withdrawalRatePercent / 100);
      const sustainableMonthlyIncome = sustainableAnnualIncome / 12;
      const drawdownMonthly =
        Math.max(projection.balance, 0) /
        Math.max(parsedInputs.retirementYears * 12 || 1, 1);
      const incomeProgress =
        requiredPot > 0 && Number.isFinite(requiredPot)
          ? Math.min((projection.balance / requiredPot) * 100, 200)
          : 0;

      setResults({
        ...projection,
        requiredPot,
        sustainableMonthlyIncome,
        drawdownMonthly,
        incomeProgress,
        desiredMonthlyIncome: parsedInputs.desiredMonthlyIncome,
        withdrawalRatePercent: parsedInputs.withdrawalRatePercent,
        retirementYears: parsedInputs.retirementYears,
      });
      setHasCalculated(true);
      setCsvData(
        buildCsvData(
          {
            ...projection,
            requiredPot,
            sustainableMonthlyIncome,
            desiredMonthlyIncome: parsedInputs.desiredMonthlyIncome,
            incomeProgress,
          },
          inputs
        )
      );
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
                Retirement Savings Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Stress-test contributions, employer matches, and growth assumptions to see how your pension pot evolves.
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

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CalendarClock className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Current position
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
                        placeholder="e.g. 32"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="retirementAge">Planned retirement age</Label>
                      <Input
                        id="retirementAge"
                        inputMode="decimal"
                        value={inputs.retirementAge}
                        onChange={handleInputChange('retirementAge')}
                        placeholder="e.g. 67"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPot">Current pension pot (£)</Label>
                    <Input
                      id="currentPot"
                      inputMode="decimal"
                      value={inputs.currentPot}
                      onChange={handleInputChange('currentPot')}
                      placeholder="e.g. 42,000"
                    />
                  </div>

                  <Card className="border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-900/30">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">Contribution plan</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyContribution">Your monthly contribution (£)</Label>
                        <Input
                          id="monthlyContribution"
                          inputMode="decimal"
                          value={inputs.monthlyContribution}
                          onChange={handleInputChange('monthlyContribution')}
                          placeholder="e.g. 450"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="employerMatchPercent">Employer match (% of salary)</Label>
                        <Input
                          id="employerMatchPercent"
                          inputMode="decimal"
                          value={inputs.employerMatchPercent}
                          onChange={handleInputChange('employerMatchPercent')}
                          placeholder="e.g. 4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annualSalary">Annual salary (£)</Label>
                        <Input
                          id="annualSalary"
                          inputMode="decimal"
                          value={inputs.annualSalary}
                          onChange={handleInputChange('annualSalary')}
                          placeholder="e.g. 52,000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="salaryGrowthPercent">Expected salary growth (%)</Label>
                        <Input
                          id="salaryGrowthPercent"
                          inputMode="decimal"
                          value={inputs.salaryGrowthPercent}
                          onChange={handleInputChange('salaryGrowthPercent')}
                          placeholder="e.g. 2.5"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-900/30">
                    <CardHeader>
                      <CardTitle className="text-sm font-semibold">Growth & retirement assumptions</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="annualReturn">Expected annual return (%)</Label>
                        <Input
                          id="annualReturn"
                          inputMode="decimal"
                          value={inputs.annualReturn}
                          onChange={handleInputChange('annualReturn')}
                          placeholder="e.g. 5.2"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="withdrawalRatePercent">Withdrawal rate (%)</Label>
                        <Input
                          id="withdrawalRatePercent"
                          inputMode="decimal"
                          value={inputs.withdrawalRatePercent}
                          onChange={handleInputChange('withdrawalRatePercent')}
                          placeholder="e.g. 4"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="retirementYears">Years in retirement</Label>
                        <Input
                          id="retirementYears"
                          inputMode="decimal"
                          value={inputs.retirementYears}
                          onChange={handleInputChange('retirementYears')}
                          placeholder="e.g. 25"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="desiredMonthlyIncome">Target monthly income (£)</Label>
                        <Input
                          id="desiredMonthlyIncome"
                          inputMode="decimal"
                          value={inputs.desiredMonthlyIncome}
                          onChange={handleInputChange('desiredMonthlyIncome')}
                          placeholder="e.g. 2,800"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate savings projection
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
                    Enter your pension details and press <span className="font-semibold">Calculate savings projection</span> to map your pot, growth, and retirement income.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CalendarClock className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Retirement snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Projected pot</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.balance)}</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-200">In {results.yearsToRetirement} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Income coverage</p>
                        <p className="text-2xl font-semibold">{results.incomeProgress.toFixed(1)}%</p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-200">Gap {currencyFormatter.format(Math.max(results.requiredPot - results.balance, 0))}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Sustainable monthly income</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.sustainableMonthlyIncome)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Level drawdown ({results.retirementYears} yrs)</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.drawdownMonthly)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Employee contributions</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.totalEmployeeContributions)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Employer contributions</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.totalEmployerContributions)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="retirement-savings-projection"
                          title="Retirement Savings Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Contribution breakdown
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
                        <ResultBreakdownChart data={chartData} title="Retirement contribution mix" />
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
