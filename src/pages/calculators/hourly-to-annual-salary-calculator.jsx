import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Clock, Wallet, Calendar } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Hourly to Annual Salary Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/hourly-to-annual-salary-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Convert hourly pay into annual, monthly, weekly, and daily earnings. Include paid overtime to understand your true earning power.';

const defaultInputs = {
  hourlyRate: '22',
  hoursPerWeek: '37.5',
  weeksPerYear: '52',
  overtimeHours: '5',
  overtimeMultiplier: '1.5',
};

const faqItems = [
  {
    question: 'How many hours per week should I enter?',
    answer:
      'Use your contracted hours or a realistic average if you work variable shifts. Add overtime hours separately so the calculator shows how extra time boosts your salary.',
  },
  {
    question: 'What if I have unpaid weeks during the year?',
    answer:
      'Reduce the “weeks worked per year” input to account for unpaid leave or seasonal gaps. The annual salary will adjust automatically.',
  },
  {
    question: 'Can I reverse the calculation to find an hourly rate?',
    answer:
      'Yes. Enter your annual salary in the hourly rate field, set hours and weeks, then look at the “effective hourly rate” in the results to cross-check your pay.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Compare every salary, tax, and savings calculator we provide.',
  },
  {
    label: 'Employment & payroll tools',
    url: '/#employment',
    description: 'Manage overtime, holiday pay, and take-home projections with confidence.',
  },
  {
    label: 'Gross to net calculator',
    url: '/gross-to-net-calculator',
    description: 'Turn your annual salary into net pay after deductions.',
  },
];

const relatedCalculators = [
  {
    name: 'Salary Calculator',
    url: '/salary-calculator',
    description: 'Convert between hourly, weekly, monthly, and annual pay in both directions.',
  },
  {
    name: 'Take-Home Pay Calculator',
    url: '/take-home-pay-calculator',
    description: 'See how tax, NI, and pension contributions affect your earnings.',
  },
  {
    name: 'Holiday Pay Calculator',
    url: '/holiday-pay-calculator',
    description: 'Cost paid leave days once you know your daily rate.',
  },
];

const webPageSchema = createCalculatorWebPageSchema({
  name: CALCULATOR_NAME,
  description: metaDescription,
  url: canonicalUrl,
  keywords,
});

const breadcrumbSchema = createCalculatorBreadcrumbs({
  name: CALCULATOR_NAME,
  url: canonicalUrl,
});

const faqStructuredData = faqSchema(faqItems);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const calculateSalary = ({
  hourlyRate,
  hoursPerWeek,
  weeksPerYear,
  overtimeHours,
  overtimeMultiplier,
}) => {
  if (hourlyRate <= 0 || hoursPerWeek <= 0 || weeksPerYear <= 0) {
    return {
      valid: false,
      message: 'Enter an hourly rate, hours worked per week, and weeks per year to continue.',
    };
  }

  const overtimeRate = hourlyRate * Math.max(overtimeMultiplier, 0);
  const baseWeeklyPay = hourlyRate * hoursPerWeek;
  const overtimeWeeklyPay = Math.max(overtimeHours, 0) * overtimeRate;
  const totalWeeklyPay = baseWeeklyPay + overtimeWeeklyPay;

  const annualSalary = totalWeeklyPay * weeksPerYear;
  const monthlySalary = annualSalary / 12;
  const weeklySalary = totalWeeklyPay;
  const dailySalary = totalWeeklyPay / 5;
  const hourlyEquivalent = annualSalary / (hoursPerWeek * weeksPerYear + Math.max(overtimeHours, 0) * weeksPerYear);

  return {
    valid: true,
    baseWeeklyPay,
    overtimeWeeklyPay,
    totalWeeklyPay,
    annualSalary,
    monthlySalary,
    weeklySalary,
    dailySalary,
    hourlyEquivalent,
  };
};

export default function HourlyToAnnualSalaryCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
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
      hourlyRate: sanitiseNumber(inputs.hourlyRate),
      hoursPerWeek: sanitiseNumber(inputs.hoursPerWeek),
      weeksPerYear: sanitiseNumber(inputs.weeksPerYear),
      overtimeHours: sanitiseNumber(inputs.overtimeHours),
      overtimeMultiplier: sanitiseNumber(inputs.overtimeMultiplier),
    };
    const outcome = calculateSalary(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Base pay', value: results.baseWeeklyPay * 52, color: '#0ea5e9' },
      { name: 'Overtime pay', value: results.overtimeWeeklyPay * 52, color: '#f97316' },
    ].filter((item) => item.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Hourly rate (£)', sanitiseNumber(inputs.hourlyRate).toFixed(2)],
      ['Hours per week', sanitiseNumber(inputs.hoursPerWeek).toFixed(2)],
      ['Weeks per year', sanitiseNumber(inputs.weeksPerYear).toFixed(2)],
      ['Overtime hours per week', sanitiseNumber(inputs.overtimeHours).toFixed(2)],
      ['Overtime multiplier', sanitiseNumber(inputs.overtimeMultiplier).toFixed(2)],
      ['Annual salary (£)', results.annualSalary.toFixed(2)],
      ['Monthly salary (£)', results.monthlySalary.toFixed(2)],
      ['Weekly pay (£)', results.weeklySalary.toFixed(2)],
      ['Daily pay (£)', results.dailySalary.toFixed(2)],
      ['Effective hourly rate (£)', results.hourlyEquivalent.toFixed(2)],
    ];
  }, [results, inputs]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Pay Conversion Tool`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Hourly to Annual Salary Calculator
          </Heading>
          <p className="calculator-hero__description">
            Convert your hourly rate into annual, monthly, weekly, and daily pay—including the impact of regular overtime.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Know what your time is worth"
          message="When you can translate every hour into a yearly figure, it’s easier to negotiate raises, pick shifts, and plan your finances."
          quote="Time is more valuable than money. You can get more money, but you cannot get more time."
          author="Jim Rohn"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Hourly pay inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="hourlyRate" className="text-sm font-medium">
                    Hourly rate (£)
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={inputs.hourlyRate}
                    onChange={handleInputChange('hourlyRate')}
                    placeholder="e.g., 22"
                  />
                </div>
                <div>
                  <Label htmlFor="hoursPerWeek" className="text-sm font-medium">
                    Contracted hours per week
                  </Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={inputs.hoursPerWeek}
                    onChange={handleInputChange('hoursPerWeek')}
                    placeholder="e.g., 37.5"
                  />
                </div>
                <div>
                  <Label htmlFor="weeksPerYear" className="text-sm font-medium">
                    Weeks worked per year
                  </Label>
                  <Input
                    id="weeksPerYear"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.5"
                    value={inputs.weeksPerYear}
                    onChange={handleInputChange('weeksPerYear')}
                    placeholder="e.g., 52"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Adjust if you have unpaid time off or seasonal breaks.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="overtimeHours" className="text-sm font-medium">
                      Paid overtime hours per week
                    </Label>
                    <Input
                      id="overtimeHours"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.5"
                      value={inputs.overtimeHours}
                      onChange={handleInputChange('overtimeHours')}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="overtimeMultiplier" className="text-sm font-medium">
                      Overtime multiplier
                    </Label>
                    <Input
                      id="overtimeMultiplier"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={inputs.overtimeMultiplier}
                      onChange={handleInputChange('overtimeMultiplier')}
                      placeholder="e.g., 1.5"
                    />
                  </div>
                </div>
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
              <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                    <Wallet className="h-5 w-5" />
                    Salary breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Annual salary
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.annualSalary)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Monthly pay
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.monthlySalary)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Weekly pay (incl. overtime)
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.weeklySalary)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Effective hourly rate
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.hourlyEquivalent)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 p-4">
                    <h3 className="text-base font-semibold text-purple-900 dark:text-purple-100 mb-4">
                      Annual earnings composition
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Annual salary composition" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="hourly-to-annual-salary-results"
                    title="Hourly to annual salary conversion"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Calendar className="h-5 w-5 text-purple-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your hourly rate, working hours, and overtime details, then press{' '}
                        <strong>Calculate</strong> to reveal your annual salary.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
