import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Target, TrendingUp, PiggyBank, Shield } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'pension calculator',
  'retirement calculator',
  'retirement income calculator',
  'retirement planning calculator',
  'retirement savings calculator',
  'fire calculator',
  'annuity calculator',
  'enhanced annuity calculator',
];

const metaDescription =
  'Use our retirement calculator as a pension calculator and retirement income calculator to build a confident glide path into retirement.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/retirement-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 1,
});

const defaultInputs = {
  currentAge: 38,
  retirementAge: 67,
  currentSavings: 65000,
  monthlyContribution: 650,
  employerContribution: 350,
  expectedReturn: 5.2,
  inflationRate: 2.4,
  desiredIncome: 38000,
  otherIncome: 11000,
  withdrawalRate: 4,
};

const retirementFaqs = [
  {
    question: 'How often should I review my retirement targets?',
    answer:
      'Check in at least twice each year. Update contributions after pay rises, re-run the retirement income numbers whenever markets move sharply, and revisit the withdrawal plan in the final decade before retiring.',
  },
  {
    question: 'What if I prefer a guaranteed income?',
    answer:
      'Use the annuity calculator and enhanced annuity calculator quotes alongside this plan. Convert part of your pension into a guaranteed income while keeping the remainder invested for growth.',
  },
  {
    question: 'Can this help with FIRE planning?',
    answer:
      'Yes. The withdrawal rate and desired income fields mirror the fire calculator 25x rule. Adjust the retirement age slider to model an early exit and track how much extra monthly savings you need.',
  },
];

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
      : totalMonthlyContribution *
        (((1 + monthlyReturn) ** monthsToRetirement - 1) / monthlyReturn);

  const projectedPot = futureValueSavings + futureValueContributions;
  const realProjectedPot = inflationFactor > 0 ? projectedPot / inflationFactor : projectedPot;

  const sustainableIncome = projectedPot * (Math.max(withdrawalRate, 0) / 100);
  const realSustainableIncome =
    inflationFactor > 0 ? sustainableIncome / inflationFactor : sustainableIncome;

  const totalRetirementIncome = realSustainableIncome + Math.max(otherIncome, 0);
  const incomeGap = Math.max(desiredIncome - totalRetirementIncome, 0);
  const incomeSurplus = Math.max(totalRetirementIncome - desiredIncome, 0);

  const withdrawalRateDecimal = Math.max(withdrawalRate, 0) / 100;
  const requiredPot =
    withdrawalRateDecimal > 0
      ? Math.max(desiredIncome - otherIncome, 0) / withdrawalRateDecimal
      : Infinity;
  const potShortfall = Math.max(requiredPot - projectedPot, 0);

  let requiredContribution = 0;
  if (monthsToRetirement > 0) {
    if (monthlyReturn === 0) {
      requiredContribution = (Math.max(requiredPot - currentSavings, 0)) / monthsToRetirement;
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
    monthsToRetirement,
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

export default function RetirementCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateRetirementPlan({
        currentAge: Number(inputs.currentAge) || 0,
        retirementAge: Number(inputs.retirementAge) || 0,
        currentSavings: Number(inputs.currentSavings) || 0,
        monthlyContribution: Number(inputs.monthlyContribution) || 0,
        employerContribution: Number(inputs.employerContribution) || 0,
        expectedReturn: Number(inputs.expectedReturn) || 0,
        inflationRate: Number(inputs.inflationRate) || 0,
        desiredIncome: Number(inputs.desiredIncome) || 0,
        otherIncome: Number(inputs.otherIncome) || 0,
        withdrawalRate: Number(inputs.withdrawalRate) || 0,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Retirement Calculator | Pension Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Retirement Calculator | Pension Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Retirement Calculator | Pension Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Retirement Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Model future income with a retirement income calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Retirement Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Blend pension calculator checks with a retirement income calculator outlook so you know
            exactly what lifestyle your savings can support.
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
                  Retirement journey inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Current age</Label>
                    <Slider
                      id="currentAge"
                      className="mt-3"
                      value={[Number(inputs.currentAge)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          currentAge: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={20}
                      max={65}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>20</span>
                      <span>{inputs.currentAge}</span>
                      <span>65</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Retirement age</Label>
                    <Slider
                      id="retirementAge"
                      className="mt-3"
                      value={[Number(inputs.retirementAge)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          retirementAge: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={45}
                      max={75}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>45</span>
                      <span>{inputs.retirementAge}</span>
                      <span>75</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentSavings">Current retirement savings (£)</Label>
                    <Input
                      id="currentSavings"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1000"
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
                    <Label htmlFor="monthlyContribution">Your monthly contribution (£)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      inputMode="decimal"
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
                    <Label htmlFor="employerContribution">Employer contribution (£)</Label>
                    <Input
                      id="employerContribution"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="25"
                      value={inputs.employerContribution}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          employerContribution: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedReturn">Expected annual return (%)</Label>
                    <Slider
                      id="expectedReturn"
                      className="mt-3"
                      value={[Number(inputs.expectedReturn)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          expectedReturn: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={12}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.expectedReturn.toFixed(1)}%</span>
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inflationRate">Inflation assumption (% p.a.)</Label>
                    <Slider
                      id="inflationRate"
                      className="mt-3"
                      value={[Number(inputs.inflationRate)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          inflationRate: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={6}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.inflationRate.toFixed(1)}%</span>
                      <span>6%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="desiredIncome">Desired annual income (£)</Label>
                    <Input
                      id="desiredIncome"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="500"
                      value={inputs.desiredIncome}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          desiredIncome: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherIncome">Other annual income (£)</Label>
                    <Input
                      id="otherIncome"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="500"
                      value={inputs.otherIncome}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          otherIncome: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="withdrawalRate">Withdrawal rate (% of pot)</Label>
                    <Slider
                      id="withdrawalRate"
                      className="mt-3"
                      value={[Number(inputs.withdrawalRate)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          withdrawalRate: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={2}
                      max={6}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>2%</span>
                      <span>{inputs.withdrawalRate.toFixed(1)}%</span>
                      <span>6%</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example plan
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Retirement readiness summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Years to retirement</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {results.yearsToRetirement}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Projected pot</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.projectedPot)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Real terms {currencyFormatter.format(results.realProjectedPot)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Sustainable income</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.realSustainableIncome)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Withdrawal rate {inputs.withdrawalRate.toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total retirement income</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.totalRetirementIncome)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Includes other income {currencyFormatter.format(inputs.otherIncome)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Income gap</p>
                  <p
                    className={`text-2xl font-semibold ${
                      results.incomeGap > 0
                        ? 'text-rose-600 dark:text-rose-300'
                        : 'text-emerald-700 dark:text-emerald-200'
                    }`}
                  >
                    {results.incomeGap > 0
                      ? currencyFormatter.format(results.incomeGap)
                      : currencyFormatter.format(results.incomeSurplus)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {results.incomeGap > 0 ? 'Shortfall' : 'Surplus'}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Pot required</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {Number.isFinite(results.requiredPot)
                      ? currencyFormatter.format(results.requiredPot)
                      : 'n/a'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Shortfall {currencyFormatter.format(results.potShortfall)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Contribution breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Monthly invested (you + employer)</span>
                  <span>{currencyFormatter.format(results.totalMonthlyContribution)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Projected growth from contributions</span>
                  <span>{currencyFormatter.format(results.futureValueContributions)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Projected growth from existing savings</span>
                  <span>{currencyFormatter.format(results.futureValueSavings)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Extra monthly needed for target</span>
                  <span>{currencyFormatter.format(results.extraMonthlyNeeded)}</span>
                </div>
                <p>
                  Increasing tax-relief savings or adding lump sums can reduce the extra required. If
                  you have a retirement savings calculator spreadsheet, plug these numbers in to test
                  different contribution schedules.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  FIRE and longevity view
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>FIRE target (based on withdrawal rate)</span>
                  <span>
                    {Number.isFinite(results.fireTarget)
                      ? currencyFormatter.format(results.fireTarget)
                      : 'n/a'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Progress toward FIRE goal</span>
                  <span>{percentFormatter.format(results.fireProgress)}</span>
                </div>
                <p>
                  Treat the slider set as a fire calculator when aiming for an early exit. If the
                  withdrawal rate feels aggressive, blend the plan with annuity calculator quotes or
                  phased drawdown options.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Retirement planning calculator playbook
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair this view with any retirement planning calculator or advice journey your provider
                offers. Layer in life expectancy tools, state pension forecasts, and tax planning to
                make confident decisions every year.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Stress test with a retirement savings calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Build scenarios that include part-time work, phased drawdown, or legacy goals. Use the
                retirement savings calculator variants provided by your pension provider to confirm
                the plan stays resilient even in lower-return markets.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Annuitising part of the pot later in life? Compare standard, single-life, joint-life,
                and enhanced annuity calculator illustrations so you secure an income floor while
                keeping flexibility with the remaining investments.
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
