import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ClipboardList, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'income tax calculator',
  'taxable income calculator',
  'tax calculator',
  'income tax',
  'hmrc tax calculator',
];

const metaDescription =
  'Use our income tax calculator to estimate take-home pay, compare taxable income calculator scenarios, and verify tax calculator results before filing.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/income-tax-calculator';
const schemaKeywords = keywords;

const ENGLAND_BANDS = [
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

const STUDENT_LOAN_PLAN2_THRESHOLD = 27295;
const STUDENT_LOAN_RATE = 0.09;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = (value) => `${value.toFixed(1)}%`;

const incomeTaxFaqs = [
  {
    question: 'Does this calculator cover the latest UK tax year?',
    answer:
      'Yes, the income tax calculator uses the 2025/26 thresholds for Income Tax and National Insurance. Update the sliders if HMRC announces mid-year changes.',
  },
  {
    question: 'How is the personal allowance handled?',
    answer:
      'The personal allowance reduces by £1 for every £2 earned above £100,000 and disappears fully at £125,140. The calculator automatically adjusts for this taper.',
  },
  {
    question: 'Can I include pension and student loan deductions?',
    answer:
      'Yes. Pension contributions reduce taxable pay before tax is calculated. You can also include optional Student Loan Plan 2 repayments to see the impact on net income.',
  },
];

const calculateTaxBands = (income, bands) => {
  let remaining = income;
  let totalTax = 0;
  const breakdown = [];

  bands.forEach((band) => {
    if (remaining <= 0) return;

    const taxable = Math.min(remaining, band.max - band.min);
    const tax = taxable * band.rate;
    totalTax += tax;

    if (taxable > 0) {
      breakdown.push({
        rate: band.rate,
        taxable,
        tax,
      });
    }

    remaining -= taxable;
  });

  return { totalTax, breakdown };
};

const calculatePersonalAllowance = (salary, baseAllowance = 12570) => {
  if (salary <= 100000) return baseAllowance;
  const reduction = Math.floor((salary - 100000) / 2);
  return Math.max(baseAllowance - reduction, 0);
};

const calculateIncomeTax = ({
  annualSalary,
  pensionContribution,
  pensionType,
  includeStudentLoan,
}) => {
  const pensionDeduction =
    pensionType === 'percentage'
      ? annualSalary * (pensionContribution / 100)
      : Math.min(pensionContribution, annualSalary);

  const taxablePay = Math.max(annualSalary - pensionDeduction, 0);
  const personalAllowance = calculatePersonalAllowance(annualSalary);
  const taxableIncome = Math.max(taxablePay - personalAllowance, 0);

  const { totalTax: incomeTax, breakdown: incomeTaxBreakdown } = calculateTaxBands(
    taxableIncome,
    ENGLAND_BANDS
  );

  const { totalTax: nationalInsurance, breakdown: niBreakdown } = calculateTaxBands(
    taxablePay,
    NI_BANDS
  );

  const studentLoan =
    includeStudentLoan && taxablePay > STUDENT_LOAN_PLAN2_THRESHOLD
      ? (taxablePay - STUDENT_LOAN_PLAN2_THRESHOLD) * STUDENT_LOAN_RATE
      : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoan + pensionDeduction;
  const netIncome = annualSalary - totalDeductions;

  return {
    pensionDeduction,
    personalAllowance,
    taxableIncome,
    incomeTax,
    incomeTaxBreakdown,
    nationalInsurance,
    niBreakdown,
    studentLoan,
    netIncome,
  };
};

export default function IncomeTaxCalculatorPage() {
  const [inputs, setInputs] = useState({
    annualSalary: 52000,
    pensionContribution: 5,
    pensionType: 'percentage',
    includeStudentLoan: false,
  });

  const results = useMemo(
    () =>
      calculateIncomeTax({
        annualSalary: Number(inputs.annualSalary) || 0,
        pensionContribution: Number(inputs.pensionContribution) || 0,
        pensionType: inputs.pensionType,
        includeStudentLoan: inputs.includeStudentLoan,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      annualSalary: 52000,
      pensionContribution: 5,
      pensionType: 'percentage',
      includeStudentLoan: false,
    });

  const netMonthly = results.netIncome / 12;
  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Income Tax Calculator | Taxable Income Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Income Tax Calculator | Taxable Income Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Income Tax Calculator | Taxable Income Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Income Tax Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate income tax',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Income Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Find your UK take-home pay, view tax, National Insurance, and optional Student Loan
            deductions, and see how pension contributions change your results.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Salary Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="annualSalary" className="text-sm font-medium">
                  Gross annual salary (£)
                </Label>
                <Input
                  id="annualSalary"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.annualSalary}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, annualSalary: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Pension contribution</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant={inputs.pensionType === 'percentage' ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionType: 'percentage',
                        pensionContribution: 5,
                      }))
                    }
                  >
                    % of salary
                  </Button>
                  <Button
                    variant={inputs.pensionType === 'fixed' ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionType: 'fixed',
                        pensionContribution: 3000,
                      }))
                    }
                  >
                    £ per year
                  </Button>
                </div>
                {inputs.pensionType === 'percentage' ? (
                  <Slider
                    className="mt-3"
                    value={[Number(inputs.pensionContribution) || 0]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionContribution: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={30}
                    step={0.5}
                  />
                ) : (
                  <Input
                    className="mt-3"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.pensionContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionContribution: Number(event.target.value),
                      }))
                    }
                  />
                )}
                <p className="text-xs text-slate-500 mt-1">
                  Pension contributions reduce your taxable income, lowering Income Tax and NI.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Include Student Loan Plan 2</Label>
                <Button
                  variant={inputs.includeStudentLoan ? 'default' : 'outline'}
                  onClick={() =>
                    setInputs((prev) => ({ ...prev, includeStudentLoan: !prev.includeStudentLoan }))
                  }
                >
                  {inputs.includeStudentLoan ? 'Included' : 'Excluded'}
                </Button>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <PiggyBank className="h-5 w-5" />
                  Take-Home Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net annual pay</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.netIncome)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net monthly</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(netMonthly)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Income Tax</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.incomeTax)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net weekly</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.netIncome / 52)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardList className="h-5 w-5 text-slate-600" />
                  Tax Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Personal allowance:</span>{' '}
                  {currencyFormatter.format(results.personalAllowance)} of your income is tax-free.
                </p>
                {results.incomeTaxBreakdown.map((band, index) => (
                  <p key={`band-${index}`}>
                    {percentageFormatter(band.rate * 100)} on{' '}
                    {currencyFormatter.format(band.taxable)} → {currencyFormatter.format(band.tax)}
                  </p>
                ))}
                <p>
                  <span className="font-semibold">Student loan:</span>{' '}
                  {currencyFormatter.format(results.studentLoan)}{' '}
                  {inputs.includeStudentLoan ? '(Plan 2 applied)' : '(not applied)'}
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
                Income tax calculator UK guidance
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Whether you are looking at an income tax calculator UK pay slip, comparing an income
                tax calculator 2024 forecast, or double checking how to calculate income tax for a
                bonus, this tool surfaces every deduction.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Matching international needs with a tax return calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Need to compare with other jurisdictions? Use the numbers from this tax return
                calculator against a federal income tax calculator to evaluate relocation offers.
                Wherever you live, being able to calculate tax accurately helps you negotiate.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning ahead with an income tax calculator with standard deduction
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Budget for the year by comparing an income tax calculator 2023 snapshot with the tax
                calculator 2024 view. When you regularly calculate tax, tweaks to pension
                contributions or salary sacrifice schemes become easy wins.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={incomeTaxFaqs} />
        </div>
      </section>
    </div>
  );
}
