import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, Scissors, ArrowUpRight, Coins } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'salary sacrifice calculator',
  'net income calculator',
  'pay after tax',
  'net pay calculator',
  'take home pay calculator',
  'after tax income calculator',
  'take home pay',
];

const metaDescription =
  'Use our salary sacrifice calculator and net income calculator to model pension sacrifice, reduce pay after tax, and see how take home pay changes instantly.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/salary-sacrifice-calculator';
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

const TAX_BANDS = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 0.2 },
  { min: 50270, max: 125140, rate: 0.4 },
  { min: 125140, max: Infinity, rate: 0.45 },
];

const NI_BANDS = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 0.12 },
  { min: 50270, max: Infinity, rate: 0.02 },
];

const ALLOWANCE_TAPER_START = 100000;
const ALLOWANCE_TAPER_END = 125140;

const defaultInputs = {
  grossSalary: 52000,
  sacrificeValue: 8,
  sacrificeType: 'percentage',
  employerMatch: 4,
  studentLoan: false,
  planType: 'plan2',
};

const salarySacrificeFaqs = [
  {
    question: 'What is counted as salary sacrifice?',
    answer:
      'Salary sacrifice typically covers pension contributions, cycle-to-work schemes, car leasing, and other HMRC-approved benefits. The calculator models pension sacrifice, but the logic is similar for other benefits.',
  },
  {
    question: 'Does salary sacrifice reduce my pension or mortgage borrowing?',
    answer:
      'Your employer contributes the sacrificed amount into your pension, so retirement savings increase. However, mortgage lenders may use the post-sacrifice gross salary, so factor that into affordability checks.',
  },
  {
    question: 'Will student loan repayments change?',
    answer:
      'Yes. Salary sacrifice lowers the taxable income used to calculate student loan repayments. Toggle the student loan setting to see how much the reduction is worth each year.',
  },
];

const calculateTax = (income) => {
  let remaining = income;
  let tax = 0;
  TAX_BANDS.forEach((band, index) => {
    if (remaining <= 0) return;
    const upper = Math.min(remaining, band.max - band.min);
    tax += upper * band.rate;
    remaining -= upper;
  });
  return Math.max(tax, 0);
};

const calculateNI = (income) => {
  let remaining = income;
  let ni = 0;
  NI_BANDS.forEach((band) => {
    if (remaining <= 0) return;
    const upper = Math.min(remaining, band.max - band.min);
    ni += upper * band.rate;
    remaining -= upper;
  });
  return Math.max(ni, 0);
};

const calculatePersonalAllowance = (income) => {
  const baseAllowance = 12570;
  if (income <= ALLOWANCE_TAPER_START) return baseAllowance;
  if (income >= ALLOWANCE_TAPER_END) return 0;
  const reduction = Math.floor((income - ALLOWANCE_TAPER_START) / 2);
  return Math.max(baseAllowance - reduction, 0);
};

const STUDENT_LOAN_THRESHOLDS = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31989, rate: 0.09 },
  postgraduate: { threshold: 21000, rate: 0.06 },
};

const calculateStudentLoan = (income, plan, enabled) => {
  if (!enabled) return 0;
  const rule = STUDENT_LOAN_THRESHOLDS[plan] || STUDENT_LOAN_THRESHOLDS.plan2;
  if (income <= rule.threshold) return 0;
  return (income - rule.threshold) * rule.rate;
};

const calculateScenario = ({ grossSalary, sacrificeValue, sacrificeType, employerMatch, studentLoan, planType }) => {
  const sacrificeAmount =
    sacrificeType === 'percentage'
      ? grossSalary * (Math.max(sacrificeValue, 0) / 100)
      : Math.max(sacrificeValue, 0);

  const sacrificedSalary = Math.max(grossSalary - sacrificeAmount, 0);
  const allowance = calculatePersonalAllowance(sacrificedSalary);
  const taxableIncome = Math.max(sacrificedSalary - allowance, 0);
  const incomeTax = calculateTax(sacrificedSalary) - calculateTax(allowance);
  const employeeNI = calculateNI(sacrificedSalary);
  const studentLoanDeduction = calculateStudentLoan(sacrificedSalary, planType, studentLoan);
  const netIncome = sacrificedSalary - incomeTax - employeeNI - studentLoanDeduction;

  const employerContribution =
    grossSalary * (Math.max(employerMatch, 0) / 100) + sacrificeAmount;

  return {
    sacrificeAmount,
    sacrificedSalary,
    taxableIncome,
    incomeTax,
    employeeNI,
    studentLoanDeduction,
    netIncome,
    employerContribution,
  };
};

const calculateSalarySacrifice = (inputs) => {
  const before = calculateScenario({
    grossSalary: inputs.grossSalary,
    sacrificeValue: 0,
    sacrificeType: 'amount',
    employerMatch: inputs.employerMatch,
    studentLoan: inputs.studentLoan,
    planType: inputs.planType,
  });

  const after = calculateScenario(inputs);

  const netGain = after.netIncome - before.netIncome;
  const pensionBoost = after.employerContribution - before.employerContribution;

  const totalTax = after.incomeTax + after.employeeNI;
  const totalTaxBefore = before.incomeTax + before.employeeNI;

  return {
    before,
    after,
    netGain,
    pensionBoost,
    taxSavings: totalTaxBefore - totalTax,
  };
};

export default function SalarySacrificeCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const parsedInputs = {
    grossSalary: Number(inputs.grossSalary) || 0,
    sacrificeValue: Number(inputs.sacrificeValue) || 0,
    sacrificeType: inputs.sacrificeType,
    employerMatch: Number(inputs.employerMatch) || 0,
    studentLoan: inputs.studentLoan,
    planType: inputs.planType,
  };

  const results = useMemo(() => calculateSalarySacrifice(parsedInputs), [parsedInputs]);

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Salary Sacrifice Calculator | Net Income Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Salary Sacrifice Calculator | Net Income Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Salary Sacrifice Calculator | Net Income Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Salary Sacrifice Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Reduce tax with a salary sacrifice calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Salary Sacrifice Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            See how pension sacrifice trims pay after tax while boosting employer contributions and
            long-term savings.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Gross pay inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="grossSalary">Gross annual salary (£)</Label>
                    <Input
                      id="grossSalary"
                      type="number"
                      min="0"
                      step="500"
                      inputMode="decimal"
                      value={inputs.grossSalary}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          grossSalary: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employerMatch">Employer match (% of salary)</Label>
                    <Slider
                      id="employerMatch"
                      className="mt-3"
                      value={[Number(inputs.employerMatch)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          employerMatch: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={0}
                      max={15}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.employerMatch}%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Scissors className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Salary sacrifice setup
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sacrificeType">Sacrifice type</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={inputs.sacrificeType === 'percentage' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          sacrificeType: 'percentage',
                        }))
                      }
                    >
                      %
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.sacrificeType === 'amount' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          sacrificeType: 'amount',
                        }))
                      }
                    >
                      £
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sacrificeValue">
                    Sacrifice {inputs.sacrificeType === 'percentage' ? 'percentage (%)' : 'amount (£)'}
                  </Label>
                  {inputs.sacrificeType === 'percentage' ? (
                    <Slider
                      id="sacrificeValue"
                      className="mt-3"
                      value={[Number(inputs.sacrificeValue)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          sacrificeValue: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={60}
                      step={0.5}
                    />
                  ) : (
                    <Input
                      id="sacrificeValue"
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={inputs.sacrificeValue}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          sacrificeValue: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  )}
                  {inputs.sacrificeType === 'percentage' && (
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.sacrificeValue.toFixed(1)}%</span>
                      <span>60%</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="studentLoan">Student loan</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant={inputs.studentLoan ? 'outline' : 'default'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          studentLoan: !prev.studentLoan,
                        }))
                      }
                    >
                      {inputs.studentLoan ? 'Included' : 'Excluded'}
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.planType === 'plan2' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          planType: 'plan2',
                        }))
                      }
                      disabled={!inputs.studentLoan}
                    >
                      Plan 2
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.planType === 'plan1' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          planType: 'plan1',
                        }))
                      }
                      disabled={!inputs.studentLoan}
                    >
                      Plan 1
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.planType === 'plan4' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          planType: 'plan4',
                        }))
                      }
                      disabled={!inputs.studentLoan}
                    >
                      Plan 4
                    </Button>
                    <Button
                      type="button"
                      variant={inputs.planType === 'postgraduate' ? 'default' : 'outline'}
                      onClick={() =>
                        setInputs((prev) => ({
                          ...prev,
                          planType: 'postgraduate',
                        }))
                      }
                      disabled={!inputs.studentLoan}
                    >
                      Postgraduate
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example salary sacrifice
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Net pay calculator comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Take-home before</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.before.netIncome)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Take-home after</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.after.netIncome)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Change {currencyFormatter.format(results.netGain)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Income tax saved</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.taxSavings)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Pension boost</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.pensionBoost)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Coins className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Pay after tax breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Sacrificed salary</span>
                  <span>{currencyFormatter.format(results.after.sacrificeAmount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Taxable income</span>
                  <span>{currencyFormatter.format(results.after.taxableIncome)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Income tax</span>
                  <span>{currencyFormatter.format(results.after.incomeTax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>National Insurance</span>
                  <span>{currencyFormatter.format(results.after.employeeNI)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Student loan</span>
                  <span>{currencyFormatter.format(results.after.studentLoanDeduction)}</span>
                </div>
                <p>
                  The pay after tax calculation reflects reduced gross pay and employer pension top-ups.
                  Compare against the take-home pay calculator result when you adjust sacrifice levels to
                  find the sweet spot.
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
                Take home pay calculator context
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair this tool with a take home pay calculator to see monthly net changes. Feed the
                sacrificed gross into your payroll simulator so you can plan how direct debits and savings
                rules adjust.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                After tax income calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Monitor how the after tax income calculator values change once you cross tax thresholds.
                If the sacrifice pushes gross pay below £50,270 you might also regain 40% child benefit or
                reduce student loan deductions.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Remember to review state benefits, life insurance, and mortgage affordability because some
                providers reference pre-sacrifice pay while others use the reduced figure.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={salarySacrificeFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
