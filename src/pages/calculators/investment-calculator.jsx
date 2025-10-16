import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LineChart, BarChart3, Rocket, Calculator, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'investment calculator',
  'future value calculator',
  'compound interest calculator',
  'cagr calculator',
  'rate of return calculator',
];

const metaDescription =
  'Model your investment calculator journey with future value calculator projections, compound interest calculator growth, and automated contribution increases.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/investment-calculator';
const schemaKeywords = keywords.slice(0, 5);

const compoundingOptions = [
  { value: 1, label: 'Annually' },
  { value: 4, label: 'Quarterly' },
  { value: 12, label: 'Monthly' },
  { value: 365, label: 'Daily' },
];

const investmentFaqs = [
  {
    question: 'How does compounding frequency affect returns?',
    answer:
      'More frequent compounding applies interest to your balance more often. Switching from annual to monthly or daily compounding slightly accelerates growth, especially over long time frames.',
  },
  {
    question: 'Can I model annual contribution increases?',
    answer:
      'Yes. Use the contribution growth slider to mimic pay rises or bonus sweeps. The investment calculator automatically scales future deposits by your chosen percentage.',
  },
  {
    question: 'What does CAGR represent?',
    answer:
      'CAGR (compound annual growth rate) shows the smoothed annual return needed to move from your starting value to the final projection. It helps you compare scenarios on an apples-to-apples basis.',
  },
];

const calculateMonthlyRate = (annualReturn, periodsPerYear) => {
  const rate = Math.max(Number(annualReturn) || 0, 0) / 100;
  const perYear = Math.max(Number(periodsPerYear) || 1, 1);
  return Math.pow(1 + rate / perYear, perYear / 12) - 1;
};

const generateInvestmentProjection = ({
  initialInvestment,
  monthlyContribution,
  annualContributionGrowth,
  annualReturn,
  compoundingFrequency,
  years,
  annualTopUp,
}) => {
  const months = Math.max(Math.round(Number(years) * 12) || 0, 0);
  const monthlyRate = calculateMonthlyRate(annualReturn, compoundingFrequency);
  const contributionGrowthRate = Math.max(Number(annualContributionGrowth) || 0, 0) / 100;
  const topUp = Math.max(Number(annualTopUp) || 0, 0);

  let balance = Math.max(Number(initialInvestment) || 0, 0);
  let totalContributions = balance;

  const snapshots = [];

  for (let month = 1; month <= months; month += 1) {
    const yearIndex = Math.floor((month - 1) / 12);
    const grownContribution =
      Math.max(Number(monthlyContribution) || 0, 0) * Math.pow(1 + contributionGrowthRate, yearIndex);

    balance += grownContribution;
    totalContributions += grownContribution;

    if (month % 12 === 1 && month !== 1) {
      balance += topUp;
      totalContributions += topUp;
    }

    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }

    if (month % 12 === 0) {
      const year = month / 12;
      snapshots.push({
        year,
        balance,
        contributions: totalContributions,
        growth: balance - totalContributions,
      });
    }
  }

  return {
    finalBalance: balance,
    totalContributions,
    growth: balance - totalContributions,
    snapshots,
  };
};

const calculateCagr = ({ initialInvestment, finalBalance, years, totalContributions }) => {
  const safeYears = Math.max(Number(years) || 0, 0);
  if (safeYears === 0 || finalBalance <= 0) {
    return 0;
  }

  const initialValue = Math.max(Number(initialInvestment) || 0, 0);

  if (initialValue > 0 && Math.max(Number(totalContributions) || 0, 0) === initialValue) {
    return Math.pow(finalBalance / initialValue, 1 / safeYears) - 1;
  }

  // Approximate CAGR using average invested capital when there are contributions
  const averageInvested = (initialValue + Math.max(Number(totalContributions) || 0, 0)) / 2 || 1;
  return Math.pow(finalBalance / averageInvested, 1 / safeYears) - 1;
};

export default function InvestmentCalculatorPage() {
  const [inputs, setInputs] = useState({
    initialInvestment: 10000,
    monthlyContribution: 400,
    annualContributionGrowth: 3,
    annualReturn: 7,
    compoundingFrequency: 12,
    years: 20,
    annualTopUp: 1000,
  });

  const projection = useMemo(
    () =>
      generateInvestmentProjection({
        initialInvestment: inputs.initialInvestment,
        monthlyContribution: inputs.monthlyContribution,
        annualContributionGrowth: inputs.annualContributionGrowth,
        annualReturn: inputs.annualReturn,
        compoundingFrequency: inputs.compoundingFrequency,
        years: inputs.years,
        annualTopUp: inputs.annualTopUp,
      }),
    [inputs]
  );

  const cagr = useMemo(
    () =>
      calculateCagr({
        initialInvestment: inputs.initialInvestment,
        finalBalance: projection.finalBalance,
        years: inputs.years,
        totalContributions: projection.totalContributions,
      }),
    [inputs, projection.finalBalance, projection.totalContributions]
  );

  const resetAll = () =>
    setInputs({
      initialInvestment: 10000,
      monthlyContribution: 400,
      annualContributionGrowth: 3,
      annualReturn: 7,
      compoundingFrequency: 12,
      years: 20,
      annualTopUp: 1000,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Investment Calculator | Future Value Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Investment Calculator | Future Value Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Investment Calculator | Future Value Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Investment Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Project savings with an investment calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Investment Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Forecast the future value of your investments with adjustable contribution growth, annual
            top-ups, and flexible compounding frequencies.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Rocket className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Contribution plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="initialInvestment">Initial investment (£)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      min="0"
                      step="100"
                      value={inputs.initialInvestment}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          initialInvestment: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
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
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annualContributionGrowth">Contribution increase per year (%)</Label>
                    <Slider
                      id="annualContributionGrowth"
                      className="mt-3"
                      value={[Number(inputs.annualContributionGrowth)]}
                      min={0}
                      max={15}
                      step={0.5}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualContributionGrowth: Number(value[0].toFixed(1)),
                        }))
                      }
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.annualContributionGrowth.toFixed(1)}%</span>
                      <span>15%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualTopUp">Annual top-up (£)</Label>
                    <Input
                      id="annualTopUp"
                      type="number"
                      min="0"
                      step="100"
                      value={inputs.annualTopUp}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualTopUp: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button variant="outline" onClick={resetAll} className="w-full">
                  Reset to example plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Growth settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annualReturn">Expected annual return (%)</Label>
                    <Slider
                      id="annualReturn"
                      className="mt-3"
                      value={[Number(inputs.annualReturn)]}
                      min={0}
                      max={15}
                      step={0.25}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualReturn: Number(value[0].toFixed(2)),
                        }))
                      }
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.annualReturn.toFixed(2)}%</span>
                      <span>15%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="years">Investment length (years)</Label>
                    <Input
                      id="years"
                      type="number"
                      min="1"
                      step="1"
                      value={inputs.years}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          years: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compoundingFrequency">Compounding frequency</Label>
                  <select
                    id="compoundingFrequency"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    value={inputs.compoundingFrequency}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        compoundingFrequency: Number(event.target.value) || 1,
                      }))
                    }
                  >
                    {compoundingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Projection summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Final value</span>
                  <span>£{projection.finalBalance.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total contributions</span>
                  <span>£{projection.totalContributions.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Growth generated</span>
                  <span>£{projection.growth.toFixed(0)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>CAGR (approx.)</span>
                  <span>{(cagr * 100).toFixed(2)}%</span>
                </div>
                <p className="text-xs text-emerald-800 dark:text-emerald-200">
                  CAGR is approximated for illustration. Real-world returns vary, especially when you
                  add money over time.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Compound interest calculator timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {projection.snapshots.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Extend the investment length to view annual snapshots.
                  </p>
                )}
                {projection.snapshots.map((snapshot) => (
                  <div
                    key={snapshot.year}
                    className="grid grid-cols-4 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Year {snapshot.year}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      £{snapshot.balance.toFixed(0)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Paid £{snapshot.contributions.toFixed(0)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Growth £{snapshot.growth.toFixed(0)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading as="h2" size="h2" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Compound interest calculator and CAGR insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Layer this compound interest calculator projection next to your pension and ISA goals.
                Adjust the annual return to reflect different asset mixes and stress-test the plan.
              </p>
              <Heading as="h3" size="h3" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Rate of return calculator best practices
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Review the rate of return calculator results yearly. If markets outperform, bank part of
                the gains; if they lag, consider boosting contributions to stay aligned with your goals.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={investmentFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
