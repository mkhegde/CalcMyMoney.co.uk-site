import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Clock, Wallet, Calendar } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'hourly to annual salary calculator',
  'hourly salary calculator',
  'hourly wage calculator',
];

const metaDescription =
  'Use our hourly to annual salary calculator to convert pay, compare hourly salary calculator scenarios, and validate hourly wage calculator totals for budgeting.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/hourly-to-annual-salary-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const hourlyFaqs = [
  {
    question: 'How many hours per week should I use?',
    answer:
      'Use your contracted hours or average weekly hours if you work variable shifts. Adjust overtime hours to see how they affect your annual salary.',
  },
  {
    question: 'How do paid holidays affect the calculation?',
    answer:
      'Include paid weeks (usually 52) if you receive paid leave. For unpaid breaks, reduce the weeks worked so the annual figure reflects your real income.',
  },
  {
    question: 'Can I reverse the calculation to get the hourly rate?',
    answer:
      'Yes. Enter your annual salary and use the hourly rate box to see the equivalent hourly pay. Adjust hours or weeks to ensure the result matches your work pattern.',
  },
];

const calculateSalary = ({
  hourlyRate,
  hoursPerWeek,
  weeksPerYear,
  overtimeHours,
  overtimeRate,
}) => {
  const baseWeeklyPay = hourlyRate * hoursPerWeek;
  const overtimeWeeklyPay = overtimeHours * overtimeRate;
  const totalWeeklyPay = baseWeeklyPay + overtimeWeeklyPay;
  const annualSalary = totalWeeklyPay * weeksPerYear;
  const monthlySalary = annualSalary / 12;
  const dailySalary = totalWeeklyPay / 5;

  return {
    baseWeeklyPay,
    overtimeWeeklyPay,
    totalWeeklyPay,
    annualSalary,
    monthlySalary,
    dailySalary,
    hourlyEquivalent: annualSalary / (hoursPerWeek * weeksPerYear || 1),
  };
};

export default function HourlyToAnnualSalaryCalculatorPage() {
  const [inputs, setInputs] = useState({
    hourlyRate: 22,
    hoursPerWeek: 37.5,
    weeksPerYear: 52,
    overtimeHours: 5,
    overtimeMultiplier: 1.5,
  });

  const results = useMemo(
    () =>
      calculateSalary({
        hourlyRate: Number(inputs.hourlyRate) || 0,
        hoursPerWeek: Number(inputs.hoursPerWeek) || 0,
        weeksPerYear: Number(inputs.weeksPerYear) || 0,
        overtimeHours: Number(inputs.overtimeHours) || 0,
        overtimeRate: (Number(inputs.hourlyRate) || 0) * (Number(inputs.overtimeMultiplier) || 0),
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      hourlyRate: 22,
      hoursPerWeek: 37.5,
      weeksPerYear: 52,
      overtimeHours: 5,
      overtimeMultiplier: 1.5,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Hourly to Annual Salary Calculator | Hourly Salary Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Hourly to Annual Salary Calculator | Hourly Salary Calculator"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Hourly to Annual Salary Calculator | Hourly Salary Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Hourly to Annual Salary Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Convert hourly rate to annual salary',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Hourly to Annual Salary Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Convert hourly pay into annual, monthly, weekly, and daily figures. Include overtime to
            see your true earning power and plan your budget with confidence.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Pay Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="hourlyRate" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Hourly rate (£)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.hourlyRate}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, hourlyRate: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Hours per week
                  <span className="text-purple-600 font-semibold">
                    {inputs.hoursPerWeek.toFixed(1)}
                  </span>
                </Label>
                <Slider
                  value={[inputs.hoursPerWeek]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, hoursPerWeek: Number(value[0].toFixed(1)) }))
                  }
                  min={10}
                  max={60}
                  step={0.5}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Weeks worked per year
                  <span className="text-purple-600 font-semibold">
                    {inputs.weeksPerYear.toFixed(1)}
                  </span>
                </Label>
                <Slider
                  value={[inputs.weeksPerYear]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, weeksPerYear: Number(value[0].toFixed(1)) }))
                  }
                  min={40}
                  max={52}
                  step={0.5}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Reduce weeks for unpaid leave or seasonal downtime to reflect actual working time.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Overtime hours/week
                    <span className="text-purple-600 font-semibold">
                      {inputs.overtimeHours.toFixed(1)}
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.overtimeHours]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, overtimeHours: Number(value[0].toFixed(1)) }))
                    }
                    min={0}
                    max={20}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Overtime multiplier
                    <span className="text-purple-600 font-semibold">
                      {inputs.overtimeMultiplier.toFixed(1)}x
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.overtimeMultiplier]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        overtimeMultiplier: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={1}
                    max={2.5}
                    step={0.1}
                  />
                </div>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                  <Wallet className="h-5 w-5" />
                  Salary Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Annual salary</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.annualSalary)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Monthly</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.monthlySalary)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Weekly</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.totalWeeklyPay)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Daily</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.dailySalary)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  Earnings Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Base weekly pay:</span>{' '}
                  {currencyFormatter.format(results.baseWeeklyPay)} from{' '}
                  {inputs.hoursPerWeek.toFixed(1)} hours at{' '}
                  {currencyFormatter.format(inputs.hourlyRate)} per hour.
                </p>
                <p>
                  <span className="font-semibold">Overtime weekly pay:</span>{' '}
                  {currencyFormatter.format(results.overtimeWeeklyPay)} with{' '}
                  {inputs.overtimeHours.toFixed(1)} hours at{' '}
                  {(inputs.hourlyRate * inputs.overtimeMultiplier).toFixed(2)} per hour.
                </p>
                <p>
                  <span className="font-semibold">Hourly equivalent:</span>{' '}
                  {currencyFormatter.format(results.hourlyEquivalent)} when averaged across all
                  hours worked.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Hourly salary calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The hourly salary calculator helps you evaluate job offers, negotiate freelance
                contracts, or confirm that overtime rates match market expectations.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning budgets with an hourly wage calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the hourly wage calculator to build realistic monthly budgets. Switch between
                hourly and annual views to make sure your take-home pay covers savings goals and
                living costs.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={hourlyFaqs} />
        </div>
      </section>
    </div>
  );
}
