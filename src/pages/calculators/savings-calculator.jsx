import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingUp, BarChart3 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'savings calculator',
  'compound interest calculator',
  'interest calculator savings',
  'savings account calculator',
  'fixed deposit calculator',
  'savings account interest calculator',
  'savings compound interest calculator',
  'compound interest',
];

const metaDescription =
  'Use our savings calculator and compound interest calculator to project balances, compare savings account calculator results, and track interest growth.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/savings-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const defaultInputs = {
  initialDeposit: 7500,
  monthlyContribution: 350,
  annualRate: 4.2,
  compoundingFrequency: 12,
  savingYears: 8,
  inflationRate: 2,
  contributionIncrease: 2,
};

const savingsFaqs = [
  {
    question: 'How often should I review my savings plan?',
    answer:
      'Check in quarterly to adjust contributions, especially if your savings account interest calculator shows rate changes. Update the contribution increase slider when salary or expense changes occur.',
  },
  {
    question: 'Can this handle fixed deposit comparisons?',
    answer:
      'Yes. Set monthly contributions to zero and adjust the fixed deposit calculator rate and compounding frequency to match the term. Compare multiple scenarios side by side for the best maturity value.',
  },
  {
    question: 'What if rates change over time?',
    answer:
      'Run separate scenarios with different interest assumptions. Many savers split deposits across accounts, so use the savings compound interest calculator approach to blend weighted average rates.',
  },
];

const calculateSavingsGrowth = ({
  initialDeposit,
  monthlyContribution,
  annualRate,
  compoundingFrequency,
  savingYears,
  inflationRate,
  contributionIncrease,
}) => {
  const periodsPerYear = Math.max(compoundingFrequency, 1);
  const totalPeriods = Math.max(Math.round(savingYears * periodsPerYear), 0);
  const periodicRate = Math.max(annualRate, 0) / 100 / periodsPerYear;
  const monthlyRateForInflation = Math.max(inflationRate, 0) / 100 / 12;

  const contributionIncreaseRate = Math.max(contributionIncrease, 0) / 100;
  const monthlyContributionStart = Math.max(monthlyContribution, 0);

  let balance = Math.max(initialDeposit, 0);
  let contributions = 0;
  let interestAccrued = 0;
  let inflationAdjustedContribution = monthlyContributionStart;
  const projection = [];

  for (let period = 1; period <= totalPeriods; period += 1) {
    if ((period - 1) % (periodsPerYear / 12) === 0 && period !== 1) {
      inflationAdjustedContribution *= 1 + contributionIncreaseRate / 12;
    }

    const deposit = monthlyContributionStart > 0 ? inflationAdjustedContribution : 0;
    balance += deposit;
    contributions += deposit;

    const interest = periodicRate > 0 ? balance * periodicRate : 0;
    balance += interest;
    interestAccrued += interest;

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      const inflationFactor = (1 + monthlyRateForInflation) ** (year * 12);
      projection.push({
        year,
        balance,
        contributions,
        interestAccrued,
        realBalance: inflationFactor > 0 ? balance / inflationFactor : balance,
      });
    }
  }

  const inflationFactorTotal = (1 + monthlyRateForInflation) ** (savingYears * 12);
  const realBalance = inflationFactorTotal > 0 ? balance / inflationFactorTotal : balance;

  return {
    finalBalance: balance,
    totalContributions: contributions,
    interestAccrued,
    realBalance,
    projection,
  };
};

export default function SavingsCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateSavingsGrowth({
        initialDeposit: Number(inputs.initialDeposit) || 0,
        monthlyContribution: Number(inputs.monthlyContribution) || 0,
        annualRate: Number(inputs.annualRate) || 0,
        compoundingFrequency: Number(inputs.compoundingFrequency) || 1,
        savingYears: Number(inputs.savingYears) || 0,
        inflationRate: Number(inputs.inflationRate) || 0,
        contributionIncrease: Number(inputs.contributionIncrease) || 0,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  const lastProjection = results.projection[results.projection.length - 1];

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Savings Calculator | Compound Interest Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Savings Calculator | Compound Interest Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Savings Calculator | Compound Interest Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Savings Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan contributions with an interest calculator savings tool',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Savings Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Estimate how every contribution and interest payment compounds so you can hit your next
            savings milestone with confidence.
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
                  Contribution plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="initialDeposit">Initial deposit (£)</Label>
                    <Input
                      id="initialDeposit"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.initialDeposit}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          initialDeposit: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="10"
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
                    <Label htmlFor="savingYears">Saving duration (years)</Label>
                    <Slider
                      id="savingYears"
                      className="mt-3"
                      value={[Number(inputs.savingYears)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          savingYears: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={1}
                      max={40}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>1</span>
                      <span>{inputs.savingYears}</span>
                      <span>40</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contributionIncrease">Contribution increase (% pa)</Label>
                    <Slider
                      id="contributionIncrease"
                      className="mt-3"
                      value={[Number(inputs.contributionIncrease)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          contributionIncrease: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={10}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.contributionIncrease.toFixed(1)}%</span>
                      <span>10%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Interest settings
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="annualRate">Annual interest rate (%)</Label>
                  <Slider
                    id="annualRate"
                    className="mt-3"
                    value={[Number(inputs.annualRate)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualRate: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={12}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.annualRate.toFixed(1)}%</span>
                    <span>12%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compoundingFrequency">Compounding frequency</Label>
                  <select
                    id="compoundingFrequency"
                    className="w-full rounded-md border border-emerald-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none dark:border-emerald-800 dark:bg-slate-900 dark:text-slate-100"
                    value={inputs.compoundingFrequency}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        compoundingFrequency: Number(event.target.value) || 1,
                      }))
                    }
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                    <option value={52}>Weekly</option>
                    <option value={365}>Daily</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inflationRate">Inflation estimate (% p.a.)</Label>
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
                    max={8}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.inflationRate.toFixed(1)}%</span>
                    <span>8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example plan
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Interest calculator savings summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Final balance</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.finalBalance)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total contributions</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalContributions)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Interest earned</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.interestAccrued)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Real balance (post inflation)</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.realBalance)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Savings account calculator insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {lastProjection ? (
                  <>
                    <div className="flex items-center justify-between">
                      <span>Balance after {lastProjection.year} years</span>
                      <span>{currencyFormatter.format(lastProjection.balance)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Real value (today&apos;s money)</span>
                      <span>{currencyFormatter.format(lastProjection.realBalance)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Interest share</span>
                      <span>
                        {percentFormatter.format(
                          lastProjection.interestAccrued / lastProjection.balance || 0
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <p>Enter a saving period to see yearly projections.</p>
                )}
                <p>
                  Review the savings account interest calculator results whenever your bank updates
                  rates. Incremental contributions and compounding frequency changes make a huge
                  difference over multi-year horizons.
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
                Fixed deposit calculator and savings compound interest tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                When comparing fixed deposit calculator offers, replicate the term by switching off
                monthly contributions. Then toggle compounding to match the bank’s policy so you can
                accurately judge maturity values.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Compound interest planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The savings compound interest calculator approach helps you map how rate tweaks, bonus
                payments, or top-ups accelerate progress. Keep experimenting until the compound
                interest totals hit your target timeline.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Always cross-check with your bank’s compound interest calculator to confirm there are no
                cap rules or penalty adjustments for variable contributions.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={savingsFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
