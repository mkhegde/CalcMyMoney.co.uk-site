import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, ClipboardList } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const metaDescription =
  'Use our paye calculator to check income tax, NI, and student loan deductions so the paye calculator shows your true take-home pay each payday.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/paye-calculator';
const schemaKeywords = [
  'paye calculator',
  'uk paye calculator',
  'paye tax calculator',
  'paye take home calculator',
  'paye deductions calculator',
];

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

const STUDENT_LOAN_THRESHOLD = 27295;
const STUDENT_LOAN_RATE = 0.09;

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const payeFaqs = [
  {
    question: 'Which pay frequency should I choose?',
    answer:
      'Select the frequency that matches your payslip (monthly, weekly, or fortnightly). The PAYE calculator converts deductions from annual thresholds so the results match your pay cycle.',
  },
  {
    question: 'How are tax codes applied?',
    answer:
      'Most employees use 1257L, which provides a £12,570 allowance. Emergency codes such as 0T remove the allowance. Enter your code exactly as shown on your payslip.',
  },
  {
    question: 'Does the calculator handle student loans?',
    answer:
      'Yes, Plan 2 repayments are included when toggled on. Adjust the slider if your marginal rate changes or if you want to model salary sacrifice to reduce NI.',
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

const calculatePersonalAllowance = (salary) => {
  if (salary <= 100000) return 12570;
  const reduced = Math.max(12570 - Math.floor((salary - 100000) / 2), 0);
  return reduced;
};

const PAY_FREQUENCIES = {
  monthly: { label: 'Monthly', periods: 12 },
  weekly: { label: 'Weekly', periods: 52 },
  fortnightly: { label: 'Fortnightly', periods: 26 },
};

const calculateNetPay = ({
  grossPay,
  frequency,
  pensionPercent,
  pensionType,
  taxCode,
  studentLoan,
}) => {
  const periods = PAY_FREQUENCIES[frequency].periods;
  const annualSalary = pensionType === 'salary' ? grossPay * periods : grossPay * periods;
  const pensionDeduction =
    pensionType === 'percentage'
      ? annualSalary * (pensionPercent / 100)
      : Math.min(pensionPercent, annualSalary);

  const taxableIncome = Math.max(annualSalary - pensionDeduction, 0);
  const personalAllowance =
    taxCode.toUpperCase() === '0T' ? 0 : calculatePersonalAllowance(annualSalary);
  const incomeTax = calculateBandTax(Math.max(taxableIncome - personalAllowance, 0), ENGLAND_BANDS);
  const nationalInsurance = calculateBandTax(taxableIncome, NI_BANDS);
  const studentLoanRepayment =
    studentLoan && taxableIncome > STUDENT_LOAN_THRESHOLD
      ? (taxableIncome - STUDENT_LOAN_THRESHOLD) * STUDENT_LOAN_RATE
      : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoanRepayment + pensionDeduction;
  const netAnnual = annualSalary - totalDeductions;

  return {
    annualSalary,
    pensionDeduction,
    personalAllowance,
    incomeTax,
    nationalInsurance,
    studentLoanRepayment,
    netAnnual,
    grossPerPeriod: annualSalary / periods,
    netPerPeriod: netAnnual / periods,
  };
};

export default function PayeCalculatorPage() {
  const [inputs, setInputs] = useState({
    grossPay: 3800,
    frequency: 'monthly',
    pensionPercent: 5,
    pensionType: 'percentage',
    taxCode: '1257L',
    studentLoan: false,
  });

  const results = useMemo(
    () =>
      calculateNetPay({
        grossPay: Number(inputs.grossPay) || 0,
        frequency: inputs.frequency,
        pensionPercent: Number(inputs.pensionPercent) || 0,
        pensionType: inputs.pensionType,
        taxCode: inputs.taxCode || '1257L',
        studentLoan: inputs.studentLoan,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      grossPay: 3800,
      frequency: 'monthly',
      pensionPercent: 5,
      pensionType: 'percentage',
      taxCode: '1257L',
      studentLoan: false,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>PAYE Calculator | PAYE Tax Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="PAYE Calculator | PAYE Tax Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PAYE Calculator | PAYE Tax Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'PAYE Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate PAYE deductions',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            PAYE Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Work out PAYE tax, National Insurance, pension deductions, and optional Student Loan
            repayments for your next payslip.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Pay Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="grossPay" className="text-sm font-medium">
                  Gross pay ({PAY_FREQUENCIES[inputs.frequency].label})
                </Label>
                <Input
                  id="grossPay"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.grossPay}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, grossPay: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Pay frequency</Label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(PAY_FREQUENCIES).map(([key, option]) => (
                    <Button
                      key={key}
                      variant={inputs.frequency === key ? 'default' : 'outline'}
                      onClick={() => setInputs((prev) => ({ ...prev, frequency: key }))}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
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
                        pensionPercent: 5,
                      }))
                    }
                  >
                    % of pay
                  </Button>
                  <Button
                    variant={inputs.pensionType === 'salary' ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionType: 'salary',
                        pensionPercent:
                          inputs.grossPay * PAY_FREQUENCIES[inputs.frequency].periods * 0.05,
                      }))
                    }
                  >
                    £ per year
                  </Button>
                </div>
                {inputs.pensionType === 'percentage' ? (
                  <Slider
                    className="mt-3"
                    value={[Number(inputs.pensionPercent) || 0]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        pensionPercent: Number(value[0].toFixed(1)),
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
                    value={inputs.pensionPercent}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, pensionPercent: Number(event.target.value) }))
                    }
                  />
                )}
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Student Loan Plan 2</Label>
                <Button
                  variant={inputs.studentLoan ? 'default' : 'outline'}
                  onClick={() => setInputs((prev) => ({ ...prev, studentLoan: !prev.studentLoan }))}
                >
                  {inputs.studentLoan ? 'Included' : 'Excluded'}
                </Button>
              </div>
              <div>
                <Label htmlFor="taxCode" className="text-sm font-medium">
                  Tax code
                </Label>
                <Input
                  id="taxCode"
                  value={inputs.taxCode}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, taxCode: event.target.value.toUpperCase() }))
                  }
                  placeholder="1257L, 0T, BR ..."
                />
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
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Gross per period</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.grossPerPeriod)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net per period</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.netPerPeriod)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Income tax</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(
                      results.incomeTax / PAY_FREQUENCIES[inputs.frequency].periods
                    )}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">NI</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(
                      results.nationalInsurance / PAY_FREQUENCIES[inputs.frequency].periods
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardList className="h-5 w-5 text-slate-600" />
                  Annual Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Gross annual salary:</span>{' '}
                  {currencyFormatter(results.annualSalary)}
                </p>
                <p>
                  <span className="font-semibold">Pension (salary sacrifice):</span>{' '}
                  {currencyFormatter(results.pensionDeduction)}
                </p>
                <p>
                  <span className="font-semibold">Student loan Plan 2:</span>{' '}
                  {currencyFormatter(results.studentLoanRepayment)}
                </p>
                <p>
                  <span className="font-semibold">Take-home pay:</span>{' '}
                  {currencyFormatter(results.netAnnual)}
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
                PAYE calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the paye calculator to test salary sacrifice, bonuses, and tax code changes.
                Knowing your net pay keeps budgeting on track and prevents unexpected tax bills.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={payeFaqs} />
        </div>
      </section>
    </div>
  );
}
