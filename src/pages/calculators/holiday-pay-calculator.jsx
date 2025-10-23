import React, { useMemo, useState } from 'react';
import { Calculator, Wallet, Briefcase } from 'lucide-react';

import StandardCalculatorLayout from '@/components/calculators/StandardCalculatorLayout';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Holiday Pay Calculator';
const pagePath = '/holiday-pay-calculator';
const canonicalUrl = `https://www.calcmymoney.co.uk${pagePath}`;
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const pageTitle = 'Holiday Pay Calculator | UK Leave Pay Planner';

const metaDescription =
  'Calculate UK statutory holiday pay for salaried and irregular-hours workers, including regular overtime and bonuses.';

const defaultInputs = {
  averageWeeklyPay: '650',
  leaveDays: '10',
  workingDaysPerWeek: '5',
  irregularHours: 'no',
  averageWeeklyHours: '30',
  averageHourlyPay: '16',
};

const faqItems = [
  {
    question: 'How is statutory holiday pay calculated?',
    answer:
      'Employees are entitled to 5.6 weeks paid leave. We multiply the average weekly pay (based on the previous 52 paid weeks) by the number of days taken, and include regular overtime and bonuses.',
  },
  {
    question: 'What about irregular-hours and zero-hours staff?',
    answer:
      'We use the 12.07% accrual method recommended by UK government guidance, multiplying average hours and pay to estimate the holiday pay owed for each day of leave.',
  },
  {
    question: 'Should I include overtime and bonuses?',
    answer:
      'Yes, if they form part of the worker’s normal remuneration. Add them into the average weekly pay so staff are not disadvantaged when taking leave.',
  },
];


const relatedCalculators = [
  {
    name: 'Salary Calculator',
    url: '/salary-calculator',
    description: 'Translate hourly or weekly pay into annual salary and deductions.',
  },
  {
    name: 'Take-Home Pay Calculator',
    url: '/take-home-pay-calculator',
    description: 'Understand net pay after pension, benefits, and student loan deductions.',
  },
  {
    name: 'Household Bills Splitter',
    url: '/household-bills-splitter',
    description: 'Share costs with housemates once holiday pay hits the bank.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const calculateHolidayPay = ({
  averageWeeklyPay,
  leaveDays,
  workingDaysPerWeek,
  irregularHours,
  averageWeeklyHours,
  averageHourlyPay,
}) => {
  if (workingDaysPerWeek <= 0) {
    return {
      valid: false,
      message: 'Enter the number of working days per week to pro-rate the holiday entitlement.',
    };
  }

  const dailyRate = averageWeeklyPay / workingDaysPerWeek;
  const statutoryHolidayPay = dailyRate * leaveDays;

  let irregularPay = 0;
  if (irregularHours === 'yes') {
    const accrualRate = 0.1207;
    irregularPay = averageWeeklyHours * averageHourlyPay * accrualRate * (leaveDays / workingDaysPerWeek);
  }

  const totalHolidayPay = statutoryHolidayPay + irregularPay;

  return {
    valid: true,
    statutoryHolidayPay,
    irregularPay,
    totalHolidayPay,
    dailyRate,
    leaveDays,
  };
};

export default function HolidayPayCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const payload = {
      averageWeeklyPay: sanitiseNumber(inputs.averageWeeklyPay),
      leaveDays: sanitiseNumber(inputs.leaveDays),
      workingDaysPerWeek: sanitiseNumber(inputs.workingDaysPerWeek),
      irregularHours: inputs.irregularHours,
      averageWeeklyHours: sanitiseNumber(inputs.averageWeeklyHours),
      averageHourlyPay: sanitiseNumber(inputs.averageHourlyPay),
    };

    const outcome = calculateHolidayPay(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Statutory holiday pay', value: results.statutoryHolidayPay, color: '#0ea5e9' },
      { name: 'Irregular hours uplift', value: results.irregularPay, color: '#f97316' },
    ].filter((item) => item.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Average weekly pay (£)', sanitiseNumber(inputs.averageWeeklyPay).toFixed(2)],
      ['Working days per week', sanitiseNumber(inputs.workingDaysPerWeek).toFixed(2)],
      ['Leave days taken', results.leaveDays.toFixed(2)],
      ['Statutory holiday pay (£)', results.statutoryHolidayPay.toFixed(2)],
      ['Irregular hours holiday pay (£)', results.irregularPay.toFixed(2)],
      ['Total holiday pay (£)', results.totalHolidayPay.toFixed(2)],
    ];
  }, [results, inputs.averageWeeklyPay, inputs.workingDaysPerWeek]);

  const showResults = hasCalculated && results?.valid;

  return (
    <StandardCalculatorLayout
      seo={{
        title: pageTitle,
        description: metaDescription,
        canonical: canonicalUrl,
        keywords,
      }}
      schemaConfig={{
        path: pagePath,
        name: CALCULATOR_NAME,
        description: metaDescription,
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Employment & Payroll Calculators', url: '/calculators#employment' },
          { name: CALCULATOR_NAME, url: pagePath },
        ],
      }}
      icon={Briefcase}
      title={CALCULATOR_NAME}
      description="Cost every day of leave with confidence, whether staff work set hours or irregular shifts."
      intro={{
        title: 'Reward rest without guesswork',
        body:
          'When employees feel paid fairly for time off, resilience and retention rise. Let the numbers protect both your people and your payroll.',
      }}
      quote={{
        text: 'Take care of your employees and they’ll take care of your business.',
        author: 'Richard Branson',
      }}
      faqs={faqItems}
      relatedCalculators={relatedCalculators}
    >
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base font-semibold">
              <Calculator className="h-5 w-5 text-blue-500" />
              Employee inputs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleCalculate}>
              <div>
                <Label htmlFor="averageWeeklyPay" className="text-sm font-medium">
                  Average weekly pay (£)
                </Label>
                <Input
                  id="averageWeeklyPay"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="1"
                  value={inputs.averageWeeklyPay}
                  onChange={handleInputChange('averageWeeklyPay')}
                  placeholder="e.g., 650"
                />
                <p className="mt-1 text-xs text-slate-500">
                  Use the average of the last 52 paid weeks, including regular overtime and bonuses.
                </p>
              </div>
              <div>
                <Label htmlFor="workingDaysPerWeek" className="text-sm font-medium">
                  Working days per week
                </Label>
                <Input
                  id="workingDaysPerWeek"
                  type="number"
                  inputMode="decimal"
                  min="1"
                  max="6"
                  step="0.5"
                  value={inputs.workingDaysPerWeek}
                  onChange={handleInputChange('workingDaysPerWeek')}
                  placeholder="e.g., 5"
                />
              </div>
              <div>
                <Label htmlFor="leaveDays" className="text-sm font-medium">
                  Leave days taken
                </Label>
                <Input
                  id="leaveDays"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={inputs.leaveDays}
                  onChange={handleInputChange('leaveDays')}
                  placeholder="e.g., 10"
                />
              </div>
              <div>
                <Label htmlFor="irregularHours" className="text-sm font-medium">
                  Irregular hours or zero-hours contract?
                </Label>
                <select
                  id="irregularHours"
                  value={inputs.irregularHours}
                  onChange={handleSelectChange('irregularHours')}
                  className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {inputs.irregularHours === 'yes' ? (
                <>
                  <div>
                    <Label htmlFor="averageWeeklyHours" className="text-sm font-medium">
                      Average weekly hours
                    </Label>
                    <Input
                      id="averageWeeklyHours"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={inputs.averageWeeklyHours}
                      onChange={handleInputChange('averageWeeklyHours')}
                      placeholder="e.g., 30"
                    />
                  </div>
                  <div>
                    <Label htmlFor="averageHourlyPay" className="text-sm font-medium">
                      Average hourly pay (£)
                    </Label>
                    <Input
                      id="averageHourlyPay"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={inputs.averageHourlyPay}
                      onChange={handleInputChange('averageHourlyPay')}
                      placeholder="e.g., 16"
                    />
                  </div>
                </>
              ) : null}
              <div className="flex gap-3">
                <Button type="submit" className="flex-1">
                  Calculate
                </Button>
                <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                  Reset
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {showResults ? (
          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <Wallet className="h-5 w-5" />
                  Holiday pay summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-md bg-white/80 dark:bg-blue-900/40 p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                      Total holiday pay owed
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {currencyFormatter.format(results.totalHolidayPay)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-blue-900/40 p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                      Statutory entitlement
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {currencyFormatter.format(results.statutoryHolidayPay)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-blue-900/40 p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                      Irregular hours uplift
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {currencyFormatter.format(results.irregularPay)}
                    </p>
                  </div>
                  <div className="rounded-md bg-white/80 dark:bg-blue-900/40 p-4 border border-blue-100 dark:border-blue-800">
                    <p className="text-xs uppercase tracking-wide text-blue-700 dark:text-blue-200">
                      Daily holiday rate
                    </p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {currencyFormatter.format(results.dailyRate)}
                    </p>
                  </div>
                </div>

                <div className="rounded-md bg-white dark:bg-slate-900 border border-blue-100 dark:border-blue-900 p-4">
                  <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100 mb-4">
                    Holiday pay breakdown
                  </h3>
                  <ResultBreakdownChart data={chartData} title="Holiday pay breakdown" />
                </div>

                <ExportActions
                  csvData={csvData}
                  fileName="holiday-pay-calculator-results"
                  title="Holiday pay calculation summary"
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                <Wallet className="h-5 w-5 text-blue-500" aria-hidden="true" />
                <p className="text-sm">
                  {hasCalculated && results?.message ? (
                    results.message
                  ) : (
                    <>
                      Enter average weekly pay, days of leave, and whether hours are irregular, then press{' '}
                      <strong>Calculate</strong> to see the holiday pay owed.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StandardCalculatorLayout>
  );
}
