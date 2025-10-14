import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Wallet, Briefcase } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['holiday pay calculator'];

const metaDescription =
  'Use our holiday pay calculator to work out leave pay, compare holiday pay calculator scenarios for irregular hours, and plan staff holiday costs accurately.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/holiday-pay-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const holidayFAQs = [
  {
    question: 'How is statutory holiday pay calculated?',
    answer:
      'Employees are entitled to 5.6 weeks of paid leave per year. Holiday pay is based on average weekly earnings over the previous 52 paid weeks, including regular overtime and bonuses.',
  },
  {
    question: 'What if an employee has irregular hours?',
    answer:
      'Use the irregular hours section to enter average weekly hours and pay. The calculator uses a 12.07% accrual rate to estimate holiday pay for casual or zero-hours staff.',
  },
  {
    question: 'Do I include overtime and bonuses?',
    answer:
      'Regular overtime, commission, and bonuses that are part of normal working patterns should be included in the 52-week average used to calculate holiday pay.',
  },
];

const calculateHolidayPay = ({
  averageWeeklyPay,
  leaveDays,
  workingDaysPerWeek,
  irregularHours,
  averageWeeklyHours,
  averageHourlyPay,
}) => {
  const dailyRate = workingDaysPerWeek > 0 ? averageWeeklyPay / workingDaysPerWeek : 0;
  const statutoryHolidayWeeks = leaveDays / workingDaysPerWeek;
  const holidayPay = dailyRate * leaveDays;

  const irregularAccrualRate = 0.1207;
  const irregularHolidayPay = irregularHours
    ? averageWeeklyHours *
      averageHourlyPay *
      irregularAccrualRate *
      (leaveDays / workingDaysPerWeek)
    : 0;

  return {
    dailyRate,
    statutoryHolidayWeeks,
    holidayPay,
    irregularHolidayPay,
    totalHolidayPay: holidayPay + irregularHolidayPay,
  };
};

export default function HolidayPayCalculatorPage() {
  const [inputs, setInputs] = useState({
    averageWeeklyPay: 650,
    leaveDays: 10,
    workingDaysPerWeek: 5,
    irregularHours: false,
    averageWeeklyHours: 30,
    averageHourlyPay: 16,
  });

  const results = useMemo(
    () =>
      calculateHolidayPay({
        averageWeeklyPay: Number(inputs.averageWeeklyPay) || 0,
        leaveDays: Number(inputs.leaveDays) || 0,
        workingDaysPerWeek: Number(inputs.workingDaysPerWeek) || 0,
        irregularHours: inputs.irregularHours,
        averageWeeklyHours: Number(inputs.averageWeeklyHours) || 0,
        averageHourlyPay: Number(inputs.averageHourlyPay) || 0,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      averageWeeklyPay: 650,
      leaveDays: 10,
      workingDaysPerWeek: 5,
      irregularHours: false,
      averageWeeklyHours: 30,
      averageHourlyPay: 16,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Holiday Pay Calculator | Holiday Pay Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Holiday Pay Calculator | Holiday Pay Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Holiday Pay Calculator | Holiday Pay Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Holiday Pay Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate holiday pay',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Holiday Pay Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Work out statutory holiday pay for salaried and irregular-hours staff, including regular
            overtime and bonuses, in a few clicks.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Employee Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="averageWeeklyPay" className="text-sm font-medium">
                  Average weekly pay (£)
                </Label>
                <Input
                  id="averageWeeklyPay"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.averageWeeklyPay}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, averageWeeklyPay: Number(event.target.value) }))
                  }
                />
                <p className="text-xs text-slate-500 mt-1">
                  Based on the average of the last 52 paid weeks, including regular overtime and
                  bonuses.
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Leave days requested
                  <span className="text-blue-600 font-semibold">{inputs.leaveDays}</span>
                </Label>
                <Slider
                  value={[inputs.leaveDays]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, leaveDays: Math.round(value[0]) }))
                  }
                  min={1}
                  max={28}
                  step={1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Working days per week
                  <span className="text-blue-600 font-semibold">{inputs.workingDaysPerWeek}</span>
                </Label>
                <Slider
                  value={[inputs.workingDaysPerWeek]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({
                      ...prev,
                      workingDaysPerWeek: Number(value[0].toFixed(1)),
                    }))
                  }
                  min={1}
                  max={7}
                  step={0.5}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Include irregular hours calculation</Label>
                <Button
                  variant={inputs.irregularHours ? 'default' : 'outline'}
                  onClick={() =>
                    setInputs((prev) => ({ ...prev, irregularHours: !prev.irregularHours }))
                  }
                >
                  {inputs.irregularHours ? 'Included' : 'Excluded'}
                </Button>
              </div>

              {inputs.irregularHours && (
                <div className="space-y-4 border border-blue-100 dark:border-blue-900/60 rounded-md p-4">
                  <div>
                    <Label htmlFor="averageWeeklyHours" className="text-sm font-medium">
                      Average weekly hours
                    </Label>
                    <Input
                      id="averageWeeklyHours"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={inputs.averageWeeklyHours}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          averageWeeklyHours: Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="averageHourlyPay" className="text-sm font-medium">
                      Average hourly pay (£)
                    </Label>
                    <Input
                      id="averageHourlyPay"
                      type="number"
                      min={0}
                      inputMode="decimal"
                      value={inputs.averageHourlyPay}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          averageHourlyPay: Number(event.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <Wallet className="h-5 w-5" />
                  Holiday Pay Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Daily rate</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter.format(results.dailyRate)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Holiday weeks</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {results.statutoryHolidayWeeks.toFixed(2)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Base holiday pay</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter.format(results.holidayPay)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Total holiday pay</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter.format(results.totalHolidayPay)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                  Calculation Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Average weekly pay:</span>{' '}
                  {currencyFormatter.format(inputs.averageWeeklyPay)} with{' '}
                  {inputs.workingDaysPerWeek} working days gives a daily rate of{' '}
                  {currencyFormatter.format(results.dailyRate)}.
                </p>
                <p>
                  <span className="font-semibold">Leave requested:</span> {inputs.leaveDays} days,
                  equivalent to {results.statutoryHolidayWeeks.toFixed(2)} weeks of the statutory
                  5.6 week entitlement.
                </p>
                {inputs.irregularHours && (
                  <p>
                    <span className="font-semibold">Irregular hours uplift:</span>{' '}
                    {currencyFormatter.format(results.irregularHolidayPay)} added using the 12.07%
                    accrual rate for average hours of {inputs.averageWeeklyHours} per week.
                  </p>
                )}
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Holiday pay calculator best practice
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Update averages whenever pay changes or when bonuses/overtime alter the 52-week
                reference period. This keeps holiday pay aligned with employment law.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning staffing budgets with the holiday pay calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Factor the holiday pay calculator results into your hiring plans. Annual cost
                forecasts prevent underfunding and maintain compliance with worker entitlements.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={holidayFAQs} />
        </div>
      </section>
    </div>
  );
}
