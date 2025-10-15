import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Calendar, Clock, Coins, BarChart3 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'salary calculator',
  'annual salary calculator',
  'gross pay calculator',
  'yearly salary calculator',
  'hourly wage calculator',
  'monthly salary calculator',
  'hourly rate calculator',
  'wages calculator',
];

const metaDescription =
  'Use the salary calculator with annual salary calculator tools to convert gross pay, compare hourly wage calculator results, and plan monthly salary cash flow.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/salary-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const defaultInputs = {
  annualSalary: 42000,
  weeksPerYear: 52,
  hoursPerWeek: 37.5,
  paidDaysPerWeek: 5,
  bonus: 2500,
  overtimeHours: 5,
  overtimeRate: 22,
  pensionContribution: 5,
  pensionType: 'percentage',
};

const salaryFaqs = [
  {
    question: 'How do I use this salary calculator with irregular bonuses?',
    answer:
      'Enter the typical annual bonus in the bonus field. If bonuses vary, average the last few years or run multiple scenarios so you can see best- and worst-case cash flow.',
  },
  {
    question: 'What about unpaid leave or zero-hours contracts?',
    answer:
      'Adjust the weeks worked each year or the hours per week slider to reflect realistic patterns. The calculator instantly updates the hourly wage calculator outputs so you can compare contracts.',
  },
  {
    question: 'How accurate is the overtime estimate?',
    answer:
      'The overtime feature multiplies hours by the overtime rate and spreads the value across the year. Update the figures whenever shift patterns change to keep the wage projections up to date.',
  },
];

const calculateSalaryBreakdown = ({
  annualSalary,
  weeksPerYear,
  hoursPerWeek,
  paidDaysPerWeek,
  bonus,
  overtimeHours,
  overtimeRate,
  pensionContribution,
  pensionType,
}) => {
  const baseAnnual = Math.max(annualSalary, 0);
  const annualBonus = Math.max(bonus, 0);
  const overtimeValue = Math.max(overtimeHours, 0) * Math.max(overtimeRate, 0) * Math.max(weeksPerYear, 0);
  const totalAnnualGross = baseAnnual + annualBonus + overtimeValue;

  const pensionDeduction =
    pensionType === 'percentage'
      ? (totalAnnualGross * Math.max(pensionContribution, 0)) / 100
      : Math.max(pensionContribution, 0);
  const adjustedAnnual = Math.max(totalAnnualGross - pensionDeduction, 0);

  const monthsPerYear = 12;
  const monthlyGross = adjustedAnnual / monthsPerYear;
  const weeklyGross = adjustedAnnual / Math.max(weeksPerYear, 1);
  const dailyGross = weeklyGross / Math.max(paidDaysPerWeek, 1);
  const hourlyGross = weeklyGross / Math.max(hoursPerWeek, 1);

  const baseHourlyRate = baseAnnual / (Math.max(weeksPerYear, 1) * Math.max(hoursPerWeek, 1));
  const overtimePremium = hourlyGross - baseHourlyRate;

  return {
    totalAnnualGross,
    adjustedAnnual,
    monthlyGross,
    weeklyGross,
    dailyGross,
    hourlyGross,
    baseHourlyRate,
    overtimePremium,
    pensionDeduction,
    overtimeValue,
    annualBonus,
  };
};

export default function SalaryCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateSalaryBreakdown({
        annualSalary: Number(inputs.annualSalary) || 0,
        weeksPerYear: Number(inputs.weeksPerYear) || 0,
        hoursPerWeek: Number(inputs.hoursPerWeek) || 0,
        paidDaysPerWeek: Number(inputs.paidDaysPerWeek) || 0,
        bonus: Number(inputs.bonus) || 0,
        overtimeHours: Number(inputs.overtimeHours) || 0,
        overtimeRate: Number(inputs.overtimeRate) || 0,
        pensionContribution: Number(inputs.pensionContribution) || 0,
        pensionType: inputs.pensionType,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Salary Calculator | Annual Salary Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Salary Calculator | Annual Salary Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Salary Calculator | Annual Salary Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Salary Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Convert income with an annual salary calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-sky-900 via-slate-900 to-sky-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Salary Calculator
          </Heading>
          <p className="text-lg md:text-xl text-sky-100">
            Translate gross pay into monthly, weekly, and hourly values while factoring bonuses, overtime,
            and pension deductions.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-sky-200 bg-white text-slate-900 shadow-md dark:border-sky-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Base pay inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="annualSalary">Base annual salary (£)</Label>
                    <Input
                      id="annualSalary"
                      type="number"
                      inputMode="decimal"
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
                    <Label htmlFor="bonus">Annual bonus (£)</Label>
                    <Input
                      id="bonus"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
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
                    <Label htmlFor="weeksPerYear">Weeks worked per year</Label>
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
                      min={40}
                      max={52}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                      <span>40</span>
                      <span>{inputs.weeksPerYear}</span>
                      <span>52</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paidDaysPerWeek">Paid days per week</Label>
                    <Slider
                      id="paidDaysPerWeek"
                      className="mt-3"
                      value={[Number(inputs.paidDaysPerWeek)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          paidDaysPerWeek: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={3}
                      max={6}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                      <span>3</span>
                      <span>{numberFormatter.format(inputs.paidDaysPerWeek)}</span>
                      <span>6</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 bg-sky-50 text-slate-900 shadow-md dark:border-sky-900 dark:bg-sky-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Clock className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  Overtime and pension
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
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
                    min={20}
                    max={48}
                    step={0.5}
                  />
                  <div className="flex justify-between text-sm text-sky-700 dark:text-sky-200">
                    <span>20</span>
                    <span>{numberFormatter.format(inputs.hoursPerWeek)}</span>
                    <span>48</span>
                  </div>
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
                  <Label htmlFor="overtimeRate">Overtime rate (£ per hour)</Label>
                  <Input
                    id="overtimeRate"
                    type="number"
                    min="0"
                    step="1"
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
                <div className="space-y-2">
                  <Label htmlFor="pensionContribution">
                    Pension contribution ({inputs.pensionType === 'percentage' ? '%' : '£'})
                  </Label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant={inputs.pensionType === 'percentage' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          pensionType: 'percentage',
                        }))
                      }
                    >
                      %
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.pensionType === 'amount' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          pensionType: 'amount',
                        }))
                      }
                    >
                      £
                    </Button>
                  </div>
                  <Input
                    id="pensionContribution"
                    type="number"
                    min="0"
                    step="0.5"
                    inputMode="decimal"
                    value={inputs.pensionContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionContribution: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example salary
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Coins className="h-5 w-5 text-sky-600 dark:text-sky-300" />
                  Gross pay calculator overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total annual gross</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalAnnualGross)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Net of pension</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.adjustedAnnual)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pension {currencyFormatter.format(results.pensionDeduction)}
                  </p>
                </div>
                <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-center dark:border-sky-800 dark:bg-sky-900/30">
                  <p className="text-sm text-sky-700 dark:text-sky-200">Monthly salary calculator</p>
                  <p className="text-2xl font-semibold text-sky-900 dark:text-sky-100">
                    {currencyFormatter.format(results.monthlyGross)}
                  </p>
                </div>
                <div className="rounded-md border border-sky-200 bg-sky-50 p-4 text-center dark:border-sky-800 dark:bg-sky-900/30">
                  <p className="text-sm text-sky-700 dark:text-sky-200">Weekly pay</p>
                  <p className="text-2xl font-semibold text-sky-900 dark:text-sky-100">
                    {currencyFormatter.format(results.weeklyGross)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Daily pay</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.dailyGross)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Hourly rate</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.hourlyGross)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Base rate {currencyFormatter.format(results.baseHourlyRate)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-sky-200 bg-sky-50 text-slate-900 shadow-md dark:border-sky-900 dark:bg-sky-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <BarChart3 className="h-5 w-5 text-sky-700 dark:text-sky-300" />
                  Yearly salary calculator drill-down
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Annual bonus</span>
                  <span>{currencyFormatter.format(results.annualBonus)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Overtime value</span>
                  <span>{currencyFormatter.format(results.overtimeValue)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Overtime premium per hour</span>
                  <span>{currencyFormatter.format(results.overtimePremium)}</span>
                </div>
                <p>
                  The yearly salary calculator view bundles guaranteed pay, bonus, and overtime into a single
                  adjusted gross figure. Update the sliders whenever work patterns shift so your budgeting
                  stays accurate.
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
                Hourly wage calculator confidence
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The hourly wage calculator output helps when comparing contract roles or negotiating a move to
                reduced hours. Track base and overtime rates so you can benchmark against market offers.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Hourly rate calculator and wages calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the hourly rate calculator insights to set minimum acceptable pay, then layer on the wages
                calculator breakdown to understand weekly take-home expectations including overtime.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Need a full monthly salary calculator view for budgeting? Pair these figures with your net pay
                calculations to map every bill against a reliable monthly cash flow.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={salaryFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
