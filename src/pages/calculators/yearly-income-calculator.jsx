import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Calendar, Clock, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'yearly income calculator',
  'annual income calculator',
  'annual salary calculator',
  'monthly income calculator',
  'hourly wage calculator',
  'yearly salary calculator',
];

const metaDescription =
  'Use our yearly income calculator and annual income calculator to convert hourly wage calculator inputs into monthly income calculator and yearly salary figures.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/yearly-income-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultInputs = {
  hourlyRate: 24,
  hoursPerWeek: 37.5,
  weeksPerYear: 52,
  bonus: 2500,
  overtimeHours: 5,
  overtimeRate: 30,
};

const yearlyIncomeFaqs = [
  {
    question: 'What if I am not paid for all 52 weeks?',
    answer:
      'Adjust the weeks per year slider to reflect unpaid leave or seasonal schedules. The yearly income calculator multiplies hours by weeks, so missing weeks automatically reduce the annual projection.',
  },
  {
    question: 'How should I account for overtime?',
    answer:
      'Enter average weekly overtime hours and rate. The yearly salary calculator adds this to core pay, giving you a realistic view before taxes.',
  },
  {
    question: 'Can I switch between hourly and salary inputs?',
    answer:
      'Yes. Update the hourly wage calculator fields for quick conversions, or reverse-engineer an annual salary by dividing the yearly total by expected hours.',
  },
];

const calculateYearlyIncome = ({
  hourlyRate,
  hoursPerWeek,
  weeksPerYear,
  bonus,
  overtimeHours,
  overtimeRate,
}) => {
  const baseAnnual = Math.max(hourlyRate, 0) * Math.max(hoursPerWeek, 0) * Math.max(weeksPerYear, 0);
  const overtimeAnnual =
    Math.max(overtimeHours, 0) * Math.max(overtimeRate, 0) * Math.max(weeksPerYear, 0);
  const totalAnnual = baseAnnual + overtimeAnnual + Math.max(bonus, 0);

  const monthly = totalAnnual / 12;
  const weekly = totalAnnual / Math.max(weeksPerYear, 1);
  const daily = weekly / Math.max(hoursPerWeek / 5 || 5, 1);
  const hourly = totalAnnual / Math.max(hoursPerWeek * weeksPerYear, 1);

  return {
    totalAnnual,
    monthly,
    weekly,
    daily,
    hourly,
    baseAnnual,
    overtimeAnnual,
    bonus: Math.max(bonus, 0),
  };
};

export default function YearlyIncomeCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateYearlyIncome({
        hourlyRate: Number(inputs.hourlyRate) || 0,
        hoursPerWeek: Number(inputs.hoursPerWeek) || 0,
        weeksPerYear: Number(inputs.weeksPerYear) || 0,
        bonus: Number(inputs.bonus) || 0,
        overtimeHours: Number(inputs.overtimeHours) || 0,
        overtimeRate: Number(inputs.overtimeRate) || 0,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Yearly Income Calculator | Annual Income Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Yearly Income Calculator | Annual Income Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Yearly Income Calculator | Annual Income Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Yearly Income Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Convert pay with a yearly income calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Yearly Income Calculator
          </Heading>
          <p className="text-lg md:text-xl text-sky-100">
            Convert hourly rates, overtime, and bonuses into clear annual, monthly, weekly, and daily
            totals so you can budget with confidence.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-sky-200 bg-white text-slate-900 shadow-md dark:border-sky-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Hourly details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hourlyRate">Hourly rate (£)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    value={inputs.hourlyRate}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        hourlyRate: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek">Hours per week</Label>
                  <Slider
                    id="hoursPerWeek"
                    className="mt-3"
                    value={[Number(inputs.hoursPerWeek)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        hoursPerWeek: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={10}
                    max={60}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                    <span>10</span>
                    <span>{inputs.hoursPerWeek.toFixed(1)}</span>
                    <span>60</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeksPerYear">Paid weeks per year</Label>
                  <Slider
                    id="weeksPerYear"
                    className="mt-3"
                    value={[Number(inputs.weeksPerYear)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        weeksPerYear: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={30}
                    max={52}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                    <span>30</span>
                    <span>{inputs.weeksPerYear}</span>
                    <span>52</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 bg-sky-50 text-slate-900 shadow-md dark:border-sky-900 dark:bg-sky-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  Bonus and overtime
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bonus">Annual bonus (£)</Label>
                  <Input
                    id="bonus"
                    type="number"
                    min="0"
                    step="100"
                    inputMode="decimal"
                    value={inputs.bonus}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        bonus: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeHours">Overtime hours per week</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    value={inputs.overtimeHours}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        overtimeHours: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overtimeRate">Overtime rate (£)</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    value={inputs.overtimeRate}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        overtimeRate: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example schedule
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Annual income summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Yearly total</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalAnnual)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Monthly equivalent</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.monthly)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Weekly income</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.weekly)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Daily income</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.daily)}
                  </p>
                </div>
                <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-center dark:border-sky-800 dark:bg-sky-900/30 md:col-span-2">
                  <p className="text-sm text-sky-700 dark:text-sky-200">Effective hourly rate</p>
                  <p className="text-2xl font-semibold text-sky-900 dark:text-sky-100">
                    {currencyFormatter.format(results.hourly)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 bg-sky-50 text-slate-900 shadow-md dark:border-sky-900 dark:bg-sky-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  Contribution breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Base annual pay</span>
                  <span>{currencyFormatter.format(results.baseAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Overtime total</span>
                  <span>{currencyFormatter.format(results.overtimeAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bonus</span>
                  <span>{currencyFormatter.format(results.bonus)}</span>
                </div>
                <p>
                  Update each field as your contract changes. The annual salary calculator logic ensures
                  every adjustment feeds through to yearly, monthly, weekly, and hourly outputs without
                  manual steps.
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
                Monthly income calculator conversions
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The monthly income calculator figures above help you map bills, savings targets, and
                debt repayments. Export the monthly total to your budgeting app so cash flow stays
                aligned with the yearly income calculator projection.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Hourly wage calculator cross-checks
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Double-check the hourly wage calculator result when evaluating new offers or setting
                freelance rates. Enter proposed hours and overtime to see how small adjustments impact
                annual totals.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Yearly salary calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the yearly salary calculator output to stress test promotions, sabbaticals, or
                reduced hours. Keep historical snapshots so you can track income growth across your
                career.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={yearlyIncomeFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
