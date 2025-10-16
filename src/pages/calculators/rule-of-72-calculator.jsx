import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, SandTimer, TrendingUp, ArrowRightLeft, LineChart } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'rule of 72 calculator',
  'doubling time calculator',
  'investment calculator',
  'compound interest calculator',
];

const metaDescription =
  'Use our rule of 72 calculator, doubling time calculator, and investment calculator to estimate compound interest calculator growth and savings milestones.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rule-of-72-calculator';
const schemaKeywords = keywords.slice(0, 5);

const defaultInputs = {
  rateOfReturn: 6,
  targetYears: 10,
  startingAmount: 10000,
  monthlyContribution: 250,
};

const ruleFaqs = [
  {
    question: 'How accurate is the rule of 72?',
    answer:
      'The rule of 72 calculator offers a quick estimate for doubling time when returns fall between 4% and 12%. For precise planning, pair it with a compound interest calculator that models monthly compounding.',
  },
  {
    question: 'Can I test different returns?',
    answer:
      'Yes. Drag the slider or enter a new annual return to see how the doubling time calculator adjusts the results. Higher returns reduce the doubling time, while lower returns extend it.',
  },
  {
    question: 'What if my goal is not to double?',
    answer:
      'Use the investment calculator section to see how your starting amount and contributions grow over time. The projection shows balances across the full timeline, not just when you double.',
  },
];

const calculateRuleOf72 = (rate) => {
  if (rate <= 0) return Infinity;
  return 72 / rate;
};

const generateProjection = ({ startingAmount, monthlyContribution, rateOfReturn, targetYears }) => {
  const monthlyRate = Math.max(Number(rateOfReturn) || 0, 0) / 100 / 12;
  const months = Math.max(Math.round(Number(targetYears) * 12) || 0, 0);

  let balance = Math.max(Number(startingAmount) || 0, 0);
  const monthlyContributionValue = Math.max(Number(monthlyContribution) || 0, 0);
  let totalContributions = balance;
  const points = [];

  for (let month = 1; month <= months; month += 1) {
    balance += monthlyContributionValue;
    totalContributions += monthlyContributionValue;
    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }

    if (month % 12 === 0) {
      points.push({
        year: month / 12,
        balance,
        contributions: totalContributions,
      });
    }
  }

  const doublingBalance = balance >= 2 * Math.max(Number(startingAmount) || 0, 0);

  return { points, balance, totalContributions, doublingBalance };
};

export default function RuleOf72CalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const doublingTime = useMemo(() => calculateRuleOf72(Number(inputs.rateOfReturn) || 0), [inputs]);

  const projection = useMemo(
    () =>
      generateProjection({
        startingAmount: inputs.startingAmount,
        monthlyContribution: inputs.monthlyContribution,
        rateOfReturn: inputs.rateOfReturn,
        targetYears: inputs.targetYears,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Rule of 72 Calculator | Doubling Time Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Rule of 72 Calculator | Doubling Time Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rule of 72 Calculator | Doubling Time Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Rule of 72 Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate doubling time with the rule of 72 calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Rule of 72 Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Estimate how long investments take to double, then visualise your balance across the full
            horizon with supporting charts.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <SandTimer className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Doubling time inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rateOfReturn">Expected annual return (%)</Label>
                  <Slider
                    id="rateOfReturn"
                    value={[Number(inputs.rateOfReturn)]}
                    min={1}
                    max={18}
                    step={0.5}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, rateOfReturn: Number(value[0].toFixed(1)) }))
                    }
                    className="mt-3"
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1%</span>
                    <span>{Number(inputs.rateOfReturn).toFixed(1)}%</span>
                    <span>18%</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startingAmount">Starting amount (£)</Label>
                    <Input
                      id="startingAmount"
                      type="number"
                      min="0"
                      step="100"
                      value={inputs.startingAmount}
                      onChange={(event) =>
                        setInputs((prev) => ({ ...prev, startingAmount: Number(event.target.value) || 0 }))
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
                <div className="space-y-2">
                  <Label htmlFor="targetYears">Projection length (years)</Label>
                  <Slider
                    id="targetYears"
                    value={[Number(inputs.targetYears)]}
                    min={1}
                    max={35}
                    step={1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, targetYears: Number(value[0]) }))
                    }
                    className="mt-3"
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1 year</span>
                    <span>{inputs.targetYears} years</span>
                    <span>35 years</span>
                  </div>
                </div>
                <Button variant="outline" onClick={resetAll} className="w-full">
                  Reset to example projection
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Investment calculator snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Estimated doubling time</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {Number.isFinite(doublingTime) ? `${doublingTime.toFixed(1)} years` : 'Not available'}
                  </p>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Projected final balance</span>
                    <span>£{projection.balance.toFixed(0)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Total contributions</span>
                    <span>£{projection.totalContributions.toFixed(0)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Did balance double?</span>
                    <span>{projection.doublingBalance ? 'Yes' : 'Not yet'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Compound interest calculator timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {projection.points.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Increase the projection length to view annual balances.
                  </p>
                )}
                {projection.points.map((point) => (
                  <div
                    key={point.year}
                    className="grid grid-cols-3 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Year {point.year}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      £{point.balance.toFixed(0)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Contributed £{point.contributions.toFixed(0)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading as="h2" size="h2" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Investment calculator and doubling tactics
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Combine this investment calculator with your wider savings plan. Reinvest dividends,
                increase contributions after pay rises, and monitor fees so the doubling time calculator
                stays on target.
              </p>
              <Heading as="h3" size="h3" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Compound interest calculator discipline
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Track your balances quarterly. A compound interest calculator perspective helps you
                stay invested through market swings and stick to long-term goals.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={ruleFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
