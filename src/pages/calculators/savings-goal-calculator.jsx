import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calendar, PiggyBank, Target, TrendingUp, BarChart2 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'savings goal calculator',
  'savings planner',
  'saving calculator',
  'how to save money calculator',
  'financial goals calculator',
];

const metaDescription =
  'Use our savings goal calculator, savings planner, and saving calculator to map timelines, interest growth, and contributions toward your targets.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/savings-goal-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultInputs = {
  goalAmount: 25000,
  currentSavings: 4500,
  monthlyContribution: 450,
  annualReturn: 4.2,
  annualIncrease: 3,
  oneTimeContribution: 1000,
  targetYears: 4,
};

const savingsGoalFaqs = [
  {
    question: 'How often should I review my savings plan?',
    answer:
      'Check in monthly to track progress against your targets. Refresh the savings goal calculator whenever your income, bills, or priorities change so that the savings planner stays realistic.',
  },
  {
    question: 'What contribution mix works best?',
    answer:
      'Combine automated transfers with ad-hoc top ups. The saving calculator shows how one-off boosts and annual increases reduce the time to goal and smooth the journey.',
  },
  {
    question: 'Can I manage multiple goals at once?',
    answer:
      'Yes. Build a template for each priority, then stack the results into a master financial goals calculator spreadsheet to balance competing timelines.',
  },
];

const formatMonthsToYears = (months) => {
  if (months === null || Number.isNaN(months)) {
    return 'Not reached within 40 years';
  }

  if (months <= 0) {
    return 'Goal already achieved';
  }

  const totalMonths = Math.round(months);
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;

  if (years === 0) {
    return `${remainingMonths} month${remainingMonths === 1 ? '' : 's'}`;
  }

  if (remainingMonths === 0) {
    return `${years} year${years === 1 ? '' : 's'}`;
  }

  return `${years} year${years === 1 ? '' : 's'} ${remainingMonths} month${
    remainingMonths === 1 ? '' : 's'
  }`;
};

const simulateSavingsJourney = ({
  goalAmount,
  currentSavings,
  monthlyContribution,
  annualReturn,
  annualIncrease,
  oneTimeContribution,
}) => {
  const safeGoal = Math.max(Number(goalAmount) || 0, 0);
  const startingBalance = Math.max(Number(currentSavings) || 0, 0);
  const monthlyRate = Math.max(Number(annualReturn) || 0, 0) / 100 / 12;
  const increaseRate = Math.max(Number(annualIncrease) || 0, 0) / 100;
  const upfront = Math.max(Number(oneTimeContribution) || 0, 0);

  let balance = startingBalance + upfront;
  let monthsToGoal = null;
  let totalContributions = upfront;
  let totalInterest = 0;

  const yearlySnapshots = [];
  let yearlyContribution = upfront;
  let yearlyInterest = 0;

  if (safeGoal > 0 && balance >= safeGoal) {
    monthsToGoal = 0;
  }

  const maxMonths = 40 * 12;

  for (let month = 0; month < maxMonths; month += 1) {
    const yearIndex = Math.floor(month / 12);
    const steppedContribution =
      Math.max(Number(monthlyContribution) || 0, 0) * (1 + increaseRate) ** yearIndex;

    if (steppedContribution > 0) {
      balance += steppedContribution;
      totalContributions += steppedContribution;
      yearlyContribution += steppedContribution;
    }

    if (monthlyRate > 0) {
      const interest = balance * monthlyRate;
      balance += interest;
      totalInterest += interest;
      yearlyInterest += interest;
    }

    if (monthsToGoal === null && safeGoal > 0 && balance >= safeGoal) {
      monthsToGoal = month + 1;
    }

    const isYearEnd = (month + 1) % 12 === 0 || month === maxMonths - 1;
    if (isYearEnd) {
      yearlySnapshots.push({
        year: yearIndex + 1,
        balance,
        contributions: yearlyContribution,
        interest: yearlyInterest,
      });
      yearlyContribution = 0;
      yearlyInterest = 0;
    }
  }

  return {
    balance,
    monthsToGoal,
    totalContributions,
    totalInterest,
    yearlySnapshots,
    goalReached: monthsToGoal !== null && monthsToGoal >= 0,
    startingBalance,
  };
};

const projectBalanceForMonths = (inputs, months) => {
  const totalMonths = Math.max(Math.round(months), 0);
  const monthlyRate = Math.max(Number(inputs.annualReturn) || 0, 0) / 100 / 12;
  const increaseRate = Math.max(Number(inputs.annualIncrease) || 0, 0) / 100;

  let balance = Math.max(Number(inputs.currentSavings) || 0, 0);
  let totalContributions = 0;

  const upfront = Math.max(Number(inputs.oneTimeContribution) || 0, 0);
  balance += upfront;
  totalContributions += upfront;

  for (let month = 0; month < totalMonths; month += 1) {
    const yearIndex = Math.floor(month / 12);
    const steppedContribution =
      Math.max(Number(inputs.monthlyContribution) || 0, 0) * (1 + increaseRate) ** yearIndex;

    if (steppedContribution > 0) {
      balance += steppedContribution;
      totalContributions += steppedContribution;
    }

    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }
  }

  return { balance, totalContributions };
};

const calculateRequiredMonthlyContribution = ({
  goalAmount,
  currentSavings,
  oneTimeContribution,
  annualReturn,
  targetYears,
}) => {
  const safeGoal = Math.max(Number(goalAmount) || 0, 0);
  const months = Math.max(Math.round(Number(targetYears) * 12) || 0, 1);
  const monthlyRate = Math.max(Number(annualReturn) || 0, 0) / 100 / 12;
  const initialBalance =
    Math.max(Number(currentSavings) || 0, 0) + Math.max(Number(oneTimeContribution) || 0, 0);

  if (safeGoal <= 0) {
    return 0;
  }

  const growthFactor = (1 + monthlyRate) ** months;
  const futureValueOfInitial = initialBalance * growthFactor;
  const annuityFactor = monthlyRate > 0 ? (growthFactor - 1) / monthlyRate : months;
  const remaining = safeGoal - futureValueOfInitial;

  if (remaining <= 0) {
    return 0;
  }

  if (annuityFactor <= 0) {
    return 0;
  }

  return remaining / annuityFactor;
};

export default function SavingsGoalCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const journey = useMemo(
    () =>
      simulateSavingsJourney({
        goalAmount: inputs.goalAmount,
        currentSavings: inputs.currentSavings,
        monthlyContribution: inputs.monthlyContribution,
        annualReturn: inputs.annualReturn,
        annualIncrease: inputs.annualIncrease,
        oneTimeContribution: inputs.oneTimeContribution,
      }),
    [inputs]
  );

  const targetMonths = Math.max(Math.round(inputs.targetYears * 12), 0);

  const projectionAtTarget = useMemo(
    () =>
      projectBalanceForMonths(
        {
          currentSavings: inputs.currentSavings,
          monthlyContribution: inputs.monthlyContribution,
          annualIncrease: inputs.annualIncrease,
          annualReturn: inputs.annualReturn,
          oneTimeContribution: inputs.oneTimeContribution,
        },
        targetMonths
      ),
    [inputs, targetMonths]
  );

  const requiredMonthly = useMemo(
    () =>
      calculateRequiredMonthlyContribution({
        goalAmount: inputs.goalAmount,
        currentSavings: inputs.currentSavings,
        oneTimeContribution: inputs.oneTimeContribution,
        annualReturn: inputs.annualReturn,
        targetYears: inputs.targetYears,
      }),
    [inputs]
  );

  const goalGap = Math.max(Number(inputs.goalAmount) - projectionAtTarget.balance, 0);
  const progressPercent =
    Number(inputs.goalAmount) > 0
      ? Math.min((projectionAtTarget.balance / Number(inputs.goalAmount)) * 100, 150)
      : 0;

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Savings Goal Calculator | Savings Planner</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Savings Goal Calculator | Savings Planner" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Savings Goal Calculator | Savings Planner" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Savings Goal Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan savings goals with a savings goal calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Savings Goal Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Map every deposit, projection, and milestone with a savings planner and saving calculator
            that keep your ambitions on track.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Savings targets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="goalAmount">Goal amount (£)</Label>
                  <Input
                    id="goalAmount"
                    type="number"
                    min="0"
                    step="500"
                    inputMode="decimal"
                    value={inputs.goalAmount}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        goalAmount: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentSavings">Current savings (£)</Label>
                  <Input
                    id="currentSavings"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.currentSavings}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        currentSavings: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="oneTimeContribution">One-off boost this year (£)</Label>
                  <Input
                    id="oneTimeContribution"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.oneTimeContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        oneTimeContribution: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Contribution plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    min="0"
                    step="10"
                    inputMode="decimal"
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
                  <Label htmlFor="annualIncrease">Contribution uplift per year (%)</Label>
                  <Slider
                    id="annualIncrease"
                    className="mt-3"
                    value={[Number(inputs.annualIncrease)]}
                    min={0}
                    max={12}
                    step={0.5}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualIncrease: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.annualIncrease.toFixed(1)}%</span>
                    <span>12%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetYears">Target timeline (years)</Label>
                  <Slider
                    id="targetYears"
                    className="mt-3"
                    value={[Number(inputs.targetYears)]}
                    min={1}
                    max={15}
                    step={0.5}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        targetYears: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1 year</span>
                    <span>{inputs.targetYears.toFixed(1)} years</span>
                    <span>15 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Growth assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="annualReturn">Expected annual return (%)</Label>
                  <Slider
                    id="annualReturn"
                    className="mt-3"
                    value={[Number(inputs.annualReturn)]}
                    min={0}
                    max={12}
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
                    <span>12%</span>
                  </div>
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
                  <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Savings planner summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Projected pot</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(projectionAtTarget.balance)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      After {inputs.targetYears.toFixed(1)} years
                    </p>
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Goal progress</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {progressPercent.toFixed(1)}%
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      Gap {currencyFormatter.format(goalGap)}
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Time to goal</span>
                    <span>{formatMonthsToYears(journey.monthsToGoal)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Total new contributions</span>
                    <span>{currencyFormatter.format(journey.totalContributions)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Growth earned</span>
                    <span>{currencyFormatter.format(journey.totalInterest)}</span>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Suggested monthly to hit goal</span>
                    <span>{currencyFormatter.format(requiredMonthly)}</span>
                  </div>
                  <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">
                    This assumes no annual increases. Continue using the saving calculator to test
                    different uplift strategies.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Annual checkpoint
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-4 gap-3 font-semibold text-slate-600 dark:text-slate-300">
                  <span>Year</span>
                  <span className="text-right">Balance</span>
                  <span className="text-right">Added</span>
                  <span className="text-right">Growth</span>
                </div>
                {journey.yearlySnapshots.slice(0, 10).map((snapshot) => (
                  <div
                    key={snapshot.year}
                    className="grid grid-cols-4 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="font-medium text-slate-700 dark:text-slate-200">
                      {snapshot.year}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(snapshot.balance)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(snapshot.contributions)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      {currencyFormatter.format(snapshot.interest)}
                    </span>
                  </div>
                ))}
                {journey.yearlySnapshots.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Adjust the inputs to generate an annual savings journey.
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
                How to save money calculator roadmap
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Blend automatic transfers with quarterly lump sums to keep the how to save money
                calculator projections trending upward. Each small tweak compounds across the plan and
                shortens the journey.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Build a financial goals calculator playbook
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Track your milestones inside this financial goals calculator, review them alongside your
                savings planner dashboard, and celebrate each milestone as the pot grows.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={savingsGoalFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
