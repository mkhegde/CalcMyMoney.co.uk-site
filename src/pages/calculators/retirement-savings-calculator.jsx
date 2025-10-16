import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { PiggyBank, CalendarClock, LineChart, Target, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'retirement savings calculator',
  'pension calculator',
  'retirement planning calculator',
  'future value calculator',
  'compound interest calculator',
];

const metaDescription =
  'Use our retirement savings calculator, pension calculator, and retirement planning calculator to model contributions, compounding, and retirement income.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/retirement-savings-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 1,
});

const defaultInputs = {
  currentAge: 32,
  retirementAge: 67,
  currentPot: 42000,
  monthlyContribution: 450,
  employerMatchPercent: 4,
  annualSalary: 52000,
  salaryGrowthPercent: 2.5,
  annualReturn: 5.2,
  withdrawalRatePercent: 4,
  retirementYears: 25,
  desiredMonthlyIncome: 2800,
};

const retirementFaqs = [
  {
    question: 'How often should I revisit my plan?',
    answer:
      'Re-run the retirement savings calculator each year or after major life changes. Updating assumptions keeps the pension calculator aligned with current pay, contributions, and risk appetite.',
  },
  {
    question: 'What if I change jobs or contribution rates?',
    answer:
      'Adjust the monthly contributions, employer match, and salary growth. The retirement planning calculator reflects those changes instantly so you can see the long-term impact.',
  },
  {
    question: 'How do future value projections help?',
    answer:
      'The future value calculator style projection shows how today’s decisions compound. Combine it with a compound interest calculator mindset to stress-test different return scenarios.',
  },
];

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
  const yearsToRetirement = Math.max(Math.floor(Number(retirementAge) - Number(currentAge)), 0);
  const growthRate = Math.max(Number(annualReturn) || 0, 0) / 100;
  const salaryGrowth = Math.max(Number(salaryGrowthPercent) || 0, 0) / 100;

  let balance = Math.max(Number(currentPot) || 0, 0);
  let totalEmployeeContributions = 0;
  let totalEmployerContributions = 0;
  let growthEarned = 0;

  const yearlyBreakdown = [];

  if (yearsToRetirement === 0) {
    yearlyBreakdown.push({
      age: Number(currentAge),
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
    const salaryForYear = Math.max(Number(annualSalary) || 0, 0) * (1 + salaryGrowth) ** year;
    const employeeContributionYear =
      Math.max(Number(monthlyContribution) || 0, 0) * 12 * (1 + salaryGrowth) ** year;
    const employerContributionYear = salaryForYear * Math.max(Number(employerMatchPercent) || 0, 0) / 100;
    const contributionsForYear = employeeContributionYear + employerContributionYear;

    balance += contributionsForYear;
    totalEmployeeContributions += employeeContributionYear;
    totalEmployerContributions += employerContributionYear;

    const growth = balance * growthRate;
    growthEarned += growth;
    balance += growth;

    if ((year + 1) % 5 === 0 || year === yearsToRetirement - 1) {
      yearlyBreakdown.push({
        age: Number(currentAge) + year + 1,
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
  const income = Math.max(Number(desiredMonthlyIncome) || 0, 0);
  const withdrawalRate = Math.max(Number(withdrawalRatePercent) || 0, 0) / 100;
  if (withdrawalRate === 0) {
    return income > 0 ? Infinity : 0;
  }
  return (income * 12) / withdrawalRate;
};

export default function RetirementSavingsCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const projection = useMemo(
    () =>
      projectRetirementSavings({
        currentAge: inputs.currentAge,
        retirementAge: inputs.retirementAge,
        currentPot: inputs.currentPot,
        monthlyContribution: inputs.monthlyContribution,
        employerMatchPercent: inputs.employerMatchPercent,
        annualSalary: inputs.annualSalary,
        salaryGrowthPercent: inputs.salaryGrowthPercent,
        annualReturn: inputs.annualReturn,
      }),
    [inputs]
  );

  const requiredPot = useMemo(
    () =>
      calculateRequiredPot({
        desiredMonthlyIncome: inputs.desiredMonthlyIncome,
        withdrawalRatePercent: inputs.withdrawalRatePercent,
      }),
    [inputs]
  );

  const sustainableAnnualIncome =
    projection.balance * (Math.max(Number(inputs.withdrawalRatePercent) || 0, 0) / 100);
  const sustainableMonthlyIncome = sustainableAnnualIncome / 12;
  const drawdownMonthly =
    Math.max(projection.balance, 0) /
    Math.max((Number(inputs.retirementYears) || 0) * 12 || 1, 1);

  const incomeProgress =
    requiredPot > 0 && Number.isFinite(requiredPot)
      ? Math.min((projection.balance / requiredPot) * 100, 150)
      : 0;

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Retirement Savings Calculator | Pension Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Retirement Savings Calculator | Pension Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Retirement Savings Calculator | Pension Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Retirement Savings Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan retirement with a retirement savings calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Retirement Savings Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Stress-test pensions, employer matches, and growth assumptions with a retirement planning
            calculator built for confident decisions.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Current position
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Current age</Label>
                    <Input
                      id="currentAge"
                      type="number"
                      min="18"
                      max="70"
                      step="1"
                      value={inputs.currentAge}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          currentAge: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Planned retirement age</Label>
                    <Input
                      id="retirementAge"
                      type="number"
                      min="40"
                      max="75"
                      step="1"
                      value={inputs.retirementAge}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          retirementAge: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPot">Current pension pot (£)</Label>
                  <Input
                    id="currentPot"
                    type="number"
                    min="0"
                    step="1000"
                    value={inputs.currentPot}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        currentPot: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Contribution plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Your monthly contribution (£)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    min="0"
                    step="25"
                    value={inputs.monthlyContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlyContribution: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerMatchPercent">Employer match (% of salary)</Label>
                  <Slider
                    id="employerMatchPercent"
                    className="mt-3"
                    value={[Number(inputs.employerMatchPercent)]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        employerMatchPercent: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.employerMatchPercent.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualSalary">Current annual salary (£)</Label>
                  <Input
                    id="annualSalary"
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.annualSalary}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualSalary: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryGrowthPercent">Expected salary growth (%)</Label>
                  <Slider
                    id="salaryGrowthPercent"
                    className="mt-3"
                    value={[Number(inputs.salaryGrowthPercent)]}
                    min={0}
                    max={6}
                    step={0.25}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        salaryGrowthPercent: Number(value[0].toFixed(2)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{numberFormatter.format(inputs.salaryGrowthPercent)}%</span>
                    <span>6%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Growth & retirement assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="annualReturn">Expected annual return before retirement (%)</Label>
                  <Slider
                    id="annualReturn"
                    className="mt-3"
                    value={[Number(inputs.annualReturn)]}
                    min={0}
                    max={10}
                    step={0.1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualReturn: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.annualReturn.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalRatePercent">Withdrawal rate (%)</Label>
                    <Input
                      id="withdrawalRatePercent"
                      type="number"
                      min="1"
                      max="8"
                      step="0.1"
                      value={inputs.withdrawalRatePercent}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          withdrawalRatePercent: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementYears">Years in retirement</Label>
                    <Input
                      id="retirementYears"
                      type="number"
                      min="10"
                      max="40"
                      step="1"
                      value={inputs.retirementYears}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          retirementYears: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="desiredMonthlyIncome">Target monthly income in retirement (£)</Label>
                  <Input
                    id="desiredMonthlyIncome"
                    type="number"
                    min="0"
                    step="50"
                    value={inputs.desiredMonthlyIncome}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        desiredMonthlyIncome: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example plan
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CalendarClock className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Retirement snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Projected pot</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(projection.balance)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      In {projection.yearsToRetirement} years
                    </p>
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Income coverage</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {incomeProgress.toFixed(1)}%
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      Gap {currencyFormatter.format(Math.max(requiredPot - projection.balance, 0))}
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Sustainable monthly income</span>
                    <span>{currencyFormatter.format(sustainableMonthlyIncome)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Level drawdown (over {inputs.retirementYears} yrs)</span>
                    <span>{currencyFormatter.format(drawdownMonthly)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Total employee contributions</span>
                    <span>{currencyFormatter.format(projection.totalEmployeeContributions)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Total employer contributions</span>
                    <span>{currencyFormatter.format(projection.totalEmployerContributions)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Growth generated</span>
                    <span>{currencyFormatter.format(projection.growthEarned)}</span>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-xs dark:border-white/10 dark:bg-white/10">
                  <p>
                    Required pot for your target income: <strong>{currencyFormatter.format(requiredPot)}</strong>
                  </p>
                  <p className="mt-2">
                    Use the pension calculator style sliders to see how higher contributions or delayed
                    retirement change the picture.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Milestone tracker
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-5 gap-3 font-semibold text-slate-600 dark:text-slate-300">
                  <span>Age</span>
                  <span className="text-right">Balance</span>
                  <span className="text-right">You</span>
                  <span className="text-right">Employer</span>
                  <span className="text-right">Growth</span>
                </div>
                {projection.yearlyBreakdown.map((year) => (
                  <div
                    key={year.age}
                    className="grid grid-cols-5 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {year.age}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(year.balance)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(year.employee)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(year.employer)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(year.growth)}
                    </span>
                  </div>
                ))}
                {projection.yearlyBreakdown.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Increase the time horizon or contributions to generate a milestone summary.
                  </p>
                )}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Future value calculator tactics for retirement
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair the future value calculator insight with annual pension statements to stay on top
                of contribution gaps. Test early retirement scenarios, phased work, or boosting monthly
                saving rates to see how the balance reacts.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Compound interest calculator momentum looks after tomorrow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The compound interest calculator approach keeps your pension compounding even when
                markets wobble. Automate increases alongside pay rises and revisit the retirement planning
                calculator whenever life shifts direction.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={retirementFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
