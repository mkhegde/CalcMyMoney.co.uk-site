import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, Receipt } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['gross to net calculator', 'gross to net', 'gross up calculator'];

const metaDescription =
  'Use our gross to net calculator to convert gross salary, compare gross to net calculator scenarios, and check take-home pay after tax, NI, and pension deductions.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/gross-to-net-calculator';
const schemaKeywords = keywords;

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

const SL_PLAN_2_THRESHOLD = 27295;
const SL_PLAN_2_RATE = 0.09;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const grossToNetFaqs = [
  {
    question: 'Which deductions are included?',
    answer:
      'The calculator applies UK Income Tax, employee National Insurance, optional pension contributions, and optional Student Loan plan 2 repayments.',
  },
  {
    question: 'How often are tax thresholds updated?',
    answer:
      'Thresholds reflect the announced 2025/26 UK tax year values. Update the figures manually if HMRC changes rates or thresholds mid-year.',
  },
  {
    question: 'Can I enter monthly salary instead?',
    answer:
      'Yes. Convert your monthly pay to annual (×12) and enter the gross annual amount. The calculator outputs annual, monthly, weekly, and daily figures for clarity.',
  },
];

const calculateBandTax = (income, bands) => {
  let remaining = income;
  let tax = 0;
  bands.forEach((band) => {
    if (remaining <= 0) return;
    const taxable = Math.min(remaining, band.max - band.min);
    tax += taxable * band.rate;
    remaining -= taxable;
  });
  return Math.max(tax, 0);
};

const calculateStudentLoan = (income) => {
  if (income <= SL_PLAN_2_THRESHOLD) return 0;
  return (income - SL_PLAN_2_THRESHOLD) * SL_PLAN_2_RATE;
};

const calculateGrossToNet = ({ grossSalary, pensionContribution, pensionType, studentLoan }) => {
  const pensionDeduction =
    pensionType === 'salary'
      ? Math.min(pensionContribution, grossSalary)
      : grossSalary * (pensionContribution / 100);

  const taxableIncome = Math.max(grossSalary - pensionDeduction, 0);
  const incomeTax = calculateBandTax(taxableIncome, TAX_BANDS);
  const nationalInsurance = calculateBandTax(taxableIncome, NI_BANDS);
  const studentLoanRepayment = studentLoan ? calculateStudentLoan(taxableIncome) : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoanRepayment;
  const netSalary = taxableIncome - totalDeductions;

  return {
    taxableIncome,
    incomeTax,
    nationalInsurance,
    studentLoanRepayment,
    pensionDeduction,
    netSalary,
  };
};

export default function GrossToNetCalculatorPage() {
  const [inputs, setInputs] = useState({
    grossSalary: 52000,
    pensionContribution: 6,
    pensionType: 'percentage',
    studentLoan: false,
  });

  const results = useMemo(
    () =>
      calculateGrossToNet({
        grossSalary: Number(inputs.grossSalary) || 0,
        pensionContribution:
          inputs.pensionType === 'salary'
            ? Number(inputs.pensionContribution) || 0
            : Number(inputs.pensionContribution) || 0,
        pensionType: inputs.pensionType,
        studentLoan: inputs.studentLoan,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      grossSalary: 52000,
      pensionContribution: 6,
      pensionType: 'percentage',
      studentLoan: false,
    });

  const netMonthly = results.netSalary / 12;
  const netWeekly = results.netSalary / 52;
  const netDaily = results.netSalary / 260;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Gross to Net Calculator | Gross to Net</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Gross to Net Calculator | Gross to Net" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Gross to Net Calculator | Gross to Net" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Gross to Net Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Convert gross salary to net pay',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Gross to Net Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Convert gross salary to take-home pay instantly. Understand tax, NI, pension deductions,
            and student loan repayments for the 2025/26 UK tax year.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Salary Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="grossSalary" className="text-sm font-medium">
                  Gross salary (annual, £)
                </Label>
                <Input
                  id="grossSalary"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.grossSalary}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, grossSalary: Number(event.target.value) }))
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
                        pensionContribution: 6,
                      }))
                    }
                  >
                    % of salary
                  </Button>
                  <Button
                    variant={inputs.pensionType === 'salary' ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionType: 'salary',
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
                    value={[Number(inputs.pensionContribution)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionContribution: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={0}
                    max={20}
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
                  Pension contributions reduce taxable pay. Enter percentage or fixed amount
                  depending on your scheme.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="studentLoan" className="text-sm font-medium">
                  Include Student Loan (Plan 2)
                </Label>
                <Button
                  variant={inputs.studentLoan ? 'default' : 'outline'}
                  onClick={() => setInputs((prev) => ({ ...prev, studentLoan: !prev.studentLoan }))}
                >
                  {inputs.studentLoan ? 'Included' : 'Excluded'}
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
                  Take-home Pay Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net annual</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.netSalary)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net monthly</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(netMonthly)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net weekly</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(netWeekly)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net daily</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(netDaily)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Receipt className="h-5 w-5 text-slate-600" />
                  Deductions Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Income Tax</span>
                  <span>{currencyFormatter.format(results.incomeTax)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>National Insurance</span>
                  <span>{currencyFormatter.format(results.nationalInsurance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pension deduction</span>
                  <span>{currencyFormatter.format(results.pensionDeduction)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Student Loan (Plan 2)</span>
                  <span>{currencyFormatter.format(results.studentLoanRepayment)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Gross to net calculator scenarios
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Experiment with pension contributions, salary sacrifices, and bonuses. The gross to
                net calculator shows you exactly how those changes impact take-home pay.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Using the gross up calculator for offers
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                When negotiating an offer, enter the gross package the employer proposes. The gross
                up calculator reveals the real-world take home so you can benchmark against your
                current role.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={grossToNetFaqs} />
        </div>
      </section>
    </div>
  );
}
