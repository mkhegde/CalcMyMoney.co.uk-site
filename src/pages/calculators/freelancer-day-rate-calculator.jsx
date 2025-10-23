import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Briefcase, Clock, Target, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
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

const CALCULATOR_NAME = 'Freelancer Day Rate Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/freelancer-day-rate-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Convert your annual freelance income goals into profitable UK day and hourly rates by factoring overheads, utilisation, and planned profit.';

const defaultInputs = {
  annualIncomeGoal: '65,000',
  businessOverheads: '9,000',
  workingWeeks: '48',
  daysPerWeek: '5',
  utilisationRate: '70',
  profitMargin: '15',
  billableHoursPerDay: '7.5',
};

const faqItems = [
  {
    question: 'What is a utilisation rate?',
    answer:
      'Utilisation is the percentage of your working time that converts into billable client work. Holidays, pitching, admin, and professional development all reduce the rate, so account for them up front.',
  },
  {
    question: 'Which expenses should be included in overheads?',
    answer:
      'Include everything required to run your freelance business: software, insurance, equipment, workspace, accounting fees, marketing, and training. Build in a contingency for annual renewals too.',
  },
  {
    question: 'Why add a profit margin on top of income goals?',
    answer:
      'Adding a margin helps you future-proof your business, cover quiet months, and reinvest in growth. Without it you only break even when everything goes to plan.',
  },
];

const relatedCalculators = [
  {
    name: 'Freelancer Tax Calculator',
    url: '/contractor-calculator',
    description: 'Estimate take-home pay after tax and expenses as a UK contractor.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Allocate a slice of each invoice towards future goals.',
  },
  {
    name: 'Income Tax Calculator',
    url: '/income-tax-calculator',
    description: 'Understand how income tax and National Insurance affect your drawings.',
  },
];

const schemaKeywords = [
  'freelancer day rate calculator',
  'contractor hourly rate calculator',
  'freelance pricing',
  'utilisation rate',
  'freelance overheads',
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

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const calculateFreelancerRate = ({
  annualIncomeGoal,
  businessOverheads,
  workingWeeks,
  daysPerWeek,
  utilisationRate,
  profitMargin,
  billableHoursPerDay,
}) => {
  const incomeGoal = Math.max(annualIncomeGoal, 0);
  const overheads = Math.max(businessOverheads, 0);
  const weeks = Math.max(workingWeeks, 0);
  const daysWeek = Math.max(daysPerWeek, 0);
  const utilisation = Math.min(Math.max(utilisationRate, 1), 100);
  const margin = Math.max(profitMargin, 0);
  const hoursPerDay = Math.max(billableHoursPerDay, 1);

  const potentialWorkingDays = weeks * daysWeek;
  const billableDays = Math.max(1, Math.round((potentialWorkingDays * utilisation) / 100));
  const totalAnnualCost = incomeGoal + overheads;
  const baseDayRate = billableDays > 0 ? totalAnnualCost / billableDays : 0;
  const dayRateWithMargin = baseDayRate * (1 + margin / 100);
  const hourlyRate = dayRateWithMargin / hoursPerDay;
  const overheadShare = overheads / billableDays;
  const incomeShare = incomeGoal / billableDays;
  const profitShare = baseDayRate * (margin / 100);

  return {
    valid: true,
    incomeGoal,
    overheads,
    weeks,
    daysWeek,
    utilisation,
    margin,
    hoursPerDay,
    billableDays,
    totalAnnualCost,
    baseDayRate,
    dayRateWithMargin,
    hourlyRate,
    overheadShare,
    incomeShare,
    profitShare,
  };
};

export default function FreelancerDayRateCalculatorPage() {
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
      annualIncomeGoal: sanitiseNumber(inputs.annualIncomeGoal),
      businessOverheads: sanitiseNumber(inputs.businessOverheads),
      workingWeeks: sanitiseNumber(inputs.workingWeeks),
      daysPerWeek: sanitiseNumber(inputs.daysPerWeek),
      utilisationRate: sanitiseNumber(inputs.utilisationRate),
      profitMargin: sanitiseNumber(inputs.profitMargin),
      billableHoursPerDay: sanitiseNumber(inputs.billableHoursPerDay),
    };

    const potentialWorkingDays = payload.workingWeeks * payload.daysPerWeek;
    if (potentialWorkingDays <= 0) {
      setResults({
        valid: false,
        message: 'Add the weeks and days you expect to work to calculate a realistic day rate.',
      });
      setHasCalculated(true);
      return;
    }

    const outcome = calculateFreelancerRate(payload);
    setResults({ ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Income goal', value: results.incomeShare, color: '#f97316' },
      { name: 'Overheads', value: results.overheadShare, color: '#6366f1' },
      { name: 'Profit margin', value: results.profitShare, color: '#22c55e' },
    ].filter((item) => item.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Annual income goal (£)', results.incomeGoal.toFixed(2)],
      ['Annual business overheads (£)', results.overheads.toFixed(2)],
      ['Working weeks per year', results.weeks.toFixed(0)],
      ['Working days per week', results.daysWeek.toFixed(0)],
      ['Utilisation rate (%)', results.utilisation.toFixed(2)],
      ['Profit margin (%)', results.margin.toFixed(2)],
      ['Billable hours per day', results.hoursPerDay.toFixed(2)],
      ['Billable days per year', results.billableDays.toFixed(0)],
      ['Base day rate (£)', results.baseDayRate.toFixed(2)],
      ['Suggested day rate (£)', results.dayRateWithMargin.toFixed(2)],
      ['Suggested hourly rate (£)', results.hourlyRate.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | UK Contractor Pricing Tool`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={schemaKeywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Freelancer Day Rate Calculator
          </Heading>
          <p className="calculator-hero__description">
            Turn annual income goals into profitable day and hourly rates that cover overheads and non-billable time.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Price with confidence"
          message="You are not just charging for the hours you invoice. You are pricing for holidays, admin time, and the freedom to choose clients that light you up."
          quote="If you think it’s expensive to hire a professional, wait until you hire an amateur."
          author="Red Adair"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-amber-500" />
                Freelance inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="annualIncomeGoal" className="text-sm font-medium">
                    Annual income goal (£)
                  </Label>
                  <Input
                    id="annualIncomeGoal"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="500"
                    value={inputs.annualIncomeGoal}
                    onChange={handleInputChange('annualIncomeGoal')}
                    placeholder="e.g., 65,000"
                  />
                </div>
                <div>
                  <Label htmlFor="businessOverheads" className="text-sm font-medium">
                    Annual business overheads (£)
                  </Label>
                  <Input
                    id="businessOverheads"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.businessOverheads}
                    onChange={handleInputChange('businessOverheads')}
                    placeholder="e.g., 9,000"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include software, insurance, workspace, equipment, and other recurring costs.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workingWeeks" className="text-sm font-medium">
                      Working weeks per year
                    </Label>
                    <Input
                      id="workingWeeks"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="52"
                      step="1"
                      value={inputs.workingWeeks}
                      onChange={handleInputChange('workingWeeks')}
                      placeholder="e.g., 48"
                    />
                  </div>
                  <div>
                    <Label htmlFor="daysPerWeek" className="text-sm font-medium">
                      Working days each week
                    </Label>
                    <Input
                      id="daysPerWeek"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="7"
                      step="1"
                      value={inputs.daysPerWeek}
                      onChange={handleInputChange('daysPerWeek')}
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="utilisationRate" className="text-sm font-medium">
                      Utilisation rate (%)
                    </Label>
                    <Input
                      id="utilisationRate"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      max="100"
                      step="1"
                      value={inputs.utilisationRate}
                      onChange={handleInputChange('utilisationRate')}
                      placeholder="e.g., 70"
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Percentage of working time that you expect to invoice clients.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="profitMargin" className="text-sm font-medium">
                      Profit margin (%)
                    </Label>
                    <Input
                      id="profitMargin"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1"
                      value={inputs.profitMargin}
                      onChange={handleInputChange('profitMargin')}
                      placeholder="e.g., 15"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="billableHoursPerDay" className="text-sm font-medium">
                    Billable hours per day
                  </Label>
                  <Input
                    id="billableHoursPerDay"
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.25"
                    value={inputs.billableHoursPerDay}
                    onChange={handleInputChange('billableHoursPerDay')}
                    placeholder="e.g., 7.5"
                  />
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
              <Card className="border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-amber-900 dark:text-amber-100">
                    <Briefcase className="h-5 w-5" />
                    Day rate summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/30 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Suggested day rate
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {currencyFormatter.format(results.dayRateWithMargin)}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        Includes {percentageFormatter.format(results.margin)}% profit uplift
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/30 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Suggested hourly rate
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {currencyFormatter.format(results.hourlyRate)}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        Based on {results.hoursPerDay.toFixed(1)} billable hours per day
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/30 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Billable days per year
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {results.billableDays}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        Utilisation {percentageFormatter.format(results.utilisation)}% of {results.weeks} weeks
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/30 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Annual coverage
                      </p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {currencyFormatter.format(results.totalAnnualCost)}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        Income goal + overheads before profit
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900 p-4">
                    <h3 className="text-base font-semibold text-amber-900 dark:text-amber-100 mb-4">
                      Day rate composition
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Freelancer day rate breakdown" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="freelancer-day-rate-results"
                    title="Freelancer day rate analysis"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Target className="h-5 w-5 text-amber-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your income target, overheads, and billable utilisation, then press{' '}
                        <strong>Calculate</strong> to reveal a sustainable day rate.
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
<RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
