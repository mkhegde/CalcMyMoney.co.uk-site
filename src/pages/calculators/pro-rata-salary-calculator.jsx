import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Clock, BadgePercent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'pro rata calculator',
  'hourly to salary calculator',
  'annual salary calculator',
  'salary converter',
  'hourly rate to salary',
  'yearly salary calculator',
];

const metaDescription =
  'Use our pro rata calculator and hourly to salary calculator to turn an annual salary calculator figure into the exact pay for your contract.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/pro-rata-salary-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const defaultInputs = {
  fullSalary: 38000,
  fullTimeHours: 37.5,
  actualHours: 28,
  fullTimeDays: 5,
  actualDays: 4,
  contractWeeks: 46,
};

const proRataFaqs = [
  {
    question: 'How is a pro rata salary calculated?',
    answer:
      'Start with the full-time salary, multiply by the ratio of hours you work versus the full-time schedule, then adjust for the number of weeks your contract covers. The tool handles this automatically once you enter the figures.',
  },
  {
    question: 'Does annual leave change the calculation?',
    answer:
      'Enter the actual number of weeks you will be paid for, including paid holiday weeks. If your employer pays you across the full year, keep the weeks slider at 52 to reflect that.',
  },
  {
    question: 'Is the hourly rate the same for part-time staff?',
    answer:
      'Yes. Employers typically keep the hourly rate aligned for full-time and part-time colleagues. The pro rata approach simply scales the total earnings in line with actual hours worked.',
  },
];

const calculateProRata = (inputs) => {
  const fullSalary = Number(inputs.fullSalary) || 0;
  const fullTimeHours = Number(inputs.fullTimeHours) || 0;
  const actualHours = Number(inputs.actualHours) || 0;
  const fullTimeDays = Number(inputs.fullTimeDays) || 0;
  const actualDays = Number(inputs.actualDays) || 0;
  const contractWeeks = Math.min(Math.max(Number(inputs.contractWeeks) || 0, 0), 52);

  const hoursRatio = fullTimeHours > 0 ? actualHours / fullTimeHours : 0;
  const contractFraction = contractWeeks / 52;
  const fteEquivalent = fullSalary * hoursRatio;
  const contractPay = fteEquivalent * contractFraction;
  const contractMonths = contractFraction * 12;

  const weeklyPay = contractWeeks > 0 ? contractPay / contractWeeks : 0;
  const dailyPay = actualDays > 0 ? weeklyPay / actualDays : 0;
  const hourlyRate = fullTimeHours > 0 ? fullSalary / (fullTimeHours * 52) : 0;
  const partTimeHourlyRate = hourlyRate;

  return {
    hoursRatio,
    contractFraction,
    fteEquivalent,
    contractPay,
    contractMonths,
    weeklyPay,
    dailyPay,
    hourlyRate,
    partTimeHourlyRate,
    contractWeeks,
    actualDays,
    fullTimeDays,
    annualisedMonthlyPay: fteEquivalent / 12,
    contractMonthlyPay: contractMonths > 0 ? contractPay / contractMonths : 0,
  };
};

export default function ProRataSalaryCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(() => calculateProRata(inputs), [inputs]);

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Pro Rata Salary Calculator | Hourly to Salary Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Pro Rata Salary Calculator | Hourly to Salary Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pro Rata Salary Calculator | Hourly to Salary Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Pro Rata Salary Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Convert a full-time salary into a part-time pro rata amount',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Pro Rata Salary Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Translate full-time pay into part-time reality, compare contract lengths, and see how your
            take-home adapts to flexible working patterns.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Working pattern inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullSalary">Full-time salary (£)</Label>
                    <Input
                      id="fullSalary"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="500"
                      value={inputs.fullSalary}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          fullSalary: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullTimeHours">Full-time hours per week</Label>
                    <Input
                      id="fullTimeHours"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={inputs.fullTimeHours}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          fullTimeHours: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualHours">Your hours per week</Label>
                    <Slider
                      id="actualHours"
                      className="mt-3"
                      value={[Number(inputs.actualHours)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          actualHours: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={5}
                      max={inputs.fullTimeHours > 0 ? Math.max(inputs.fullTimeHours, 5) : 40}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                      <span>5</span>
                      <span>{inputs.actualHours.toFixed(1)}</span>
                      <span>{inputs.fullTimeHours > 0 ? Math.max(inputs.fullTimeHours, 5) : 40}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractWeeks">Paid weeks in contract</Label>
                    <Slider
                      id="contractWeeks"
                      className="mt-3"
                      value={[Number(inputs.contractWeeks)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          contractWeeks: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={4}
                      max={52}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                      <span>4</span>
                      <span>{inputs.contractWeeks}</span>
                      <span>52</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullTimeDays">Full-time days per week</Label>
                    <Input
                      id="fullTimeDays"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="7"
                      step="0.1"
                      value={inputs.fullTimeDays}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          fullTimeDays: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="actualDays">Your days per week</Label>
                    <Input
                      id="actualDays"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="7"
                      step="0.1"
                      value={inputs.actualDays}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          actualDays: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to default pattern
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Pro rata salary breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">FTE match</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {numberFormatter.format(results.hoursRatio * 100)}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hours vs full-time</p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Contract fraction</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {numberFormatter.format(results.contractFraction * 100)}%
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {results.contractWeeks} weeks of pay
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Annualised salary</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.fteEquivalent)}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-200">
                    Annual salary calculator output
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Contract pay</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.contractPay)}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-200">
                    Paid over {numberFormatter.format(results.contractMonths)} months
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Monthly (annualised)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.annualisedMonthlyPay)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Monthly (contract)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.contractMonthlyPay)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Weekly</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.weeklyPay)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Daily</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.dailyPay)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30 md:col-span-2">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Hourly rate</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.partTimeHourlyRate)}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-200">
                    Hourly rate to salary conversion stays consistent
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BadgePercent className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Contract snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Hours match {numberFormatter.format(results.hoursRatio * 100)}% of the full-time
                  schedule across {inputs.actualDays} days per week. That is equivalent to{' '}
                  {numberFormatter.format(results.contractFraction * 100)}% of annual pay when you are
                  on contract for {results.contractWeeks} paid weeks.
                </p>
                <p>
                  The salary converter shows a total contract value of{' '}
                  {currencyFormatter.format(results.contractPay)}, or{' '}
                  {currencyFormatter.format(results.contractMonthlyPay)} per month if the employer pays
                  evenly across the period.
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
                Salary converter planning tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the hourly rate to salary comparison to judge whether extra shifts or compressed
                hours make sense. The yearly salary calculator perspective lets you benchmark offers
                against full-time colleagues without losing sight of part-year income.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Coordinate with other work benefits
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair the calculator output with pension or bonus details so you understand the complete
                reward package before signing a flexible contract.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={proRataFaqs} />
        </div>
      </section>
    </div>
  );
}
