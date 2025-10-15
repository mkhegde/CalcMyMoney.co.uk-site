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
  'Use our net income uk calculator to reveal take-home pay, compare net income uk calculator scenarios, and see how tax and NI deductions change your paycheque.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/net-income-uk-calculator';
const schemaKeywords = [
  'net income uk calculator',
  'take home pay calculator uk',
  'uk tax calculator',
];

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

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

const calculateBandTax = (income, bands) => {
  let remaining = income;
  let tax = 0;
  bands.forEach((band) => {
    if (remaining <= 0) return;
    const taxable = Math.min(remaining, band.max - band.min);
    tax += taxable * band.rate;
    remaining -= taxable;
  });
  return tax;
};

const calculatePersonalAllowance = (salary) => {
  if (salary <= 100000) return 12570;
  const reduced = Math.max(12570 - Math.floor((salary - 100000) / 2), 0);
  return reduced;
};

const calculateNetIncome = ({ salary, pensionPercent, pensionType, studentLoan, taxCode }) => {
  const pensionDeduction =
    pensionType === 'percentage'
      ? salary * (pensionPercent / 100)
      : Math.min(pensionPercent, salary);

  const taxableIncome = Math.max(salary - pensionDeduction, 0);
  const personalAllowance = taxCode === '0T' ? 0 : calculatePersonalAllowance(salary);
  const incomeTax = calculateBandTax(Math.max(taxableIncome - personalAllowance, 0), ENGLAND_BANDS);
  const nationalInsurance = calculateBandTax(taxableIncome, NI_BANDS);
  const studentLoanRepayment =
    studentLoan && taxableIncome > STUDENT_LOAN_THRESHOLD
      ? (taxableIncome - STUDENT_LOAN_THRESHOLD) * STUDENT_LOAN_RATE
      : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoanRepayment + pensionDeduction;
  const netAnnual = salary - totalDeductions;

  return {
    pensionDeduction,
    personalAllowance,
    incomeTax,
    nationalInsurance,
    studentLoanRepayment,
    netAnnual,
  };
};

const netIncomeFaqs = [
  {
    question: 'Which tax code should I choose?',
    answer:
      'Use 1257L for most employees. Choose 0T if you are on an emergency tax code with no personal allowance or BR if your income is taxed at basic rate only.',
  },
  {
    question: 'How are pension contributions treated?',
    answer:
      'Enter either a percentage or fixed annual amount. Salary sacrifice and personal contributions both reduce taxable income and National Insurance in this calculator.',
  },
  {
    question: 'Does this cover the latest UK tax year?',
    answer:
      'Yes, it reflects the 2025/26 tax and NI thresholds. Update the inputs if HMRC announces changes in future budgets.',
  },
];

export default function NetIncomeUKCalculatorPage() {
  const [inputs, setInputs] = useState({
    salary: 52000,
    pensionPercent: 5,
    pensionType: 'percentage',
    studentLoan: false,
    taxCode: '1257L',
  });

  const results = useMemo(
    () =>
      calculateNetIncome({
        salary: Number(inputs.salary) || 0,
        pensionPercent: Number(inputs.pensionPercent) || 0,
        pensionType: inputs.pensionType,
        studentLoan: inputs.studentLoan,
        taxCode: inputs.taxCode,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      salary: 52000,
      pensionPercent: 5,
      pensionType: 'percentage',
      studentLoan: false,
      taxCode: '1257L',
    });

  const netMonthly = results.netAnnual / 12;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Net Income UK Calculator | Take Home Pay Calculator UK</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Net Income UK Calculator | Take Home Pay Calculator UK"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Net Income UK Calculator | Take Home Pay Calculator UK"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Net Income UK Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate UK net income',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Net Income UK Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Reveal your UK take-home pay after Income Tax, National Insurance, pension
            contributions, and optional Student Loan deductions.
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
                <Label htmlFor="salary" className="text-sm font-medium">
                  Gross annual salary (£)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.salary}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, salary: Number(event.target.value) }))
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
                        pensionPercent: 5,
                      }))
                    }
                  >
                    % of salary
                  </Button>
                  <Button
                    variant={inputs.pensionType === 'fixed' ? 'default' : 'outline'}
                    onClick={() =>
                      setInputs((prev) => ({ ...prev, pensionType: 'fixed', pensionPercent: 3000 }))
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
                    max={30}
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
                <Label className="text-sm font-medium">Include Student Loan Plan 2</Label>
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
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net annual</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.netAnnual)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net monthly</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(netMonthly)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Income tax</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.incomeTax)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">National Insurance</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter(results.nationalInsurance)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardList className="h-5 w-5 text-slate-600" />
                  Deduction Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Personal allowance:</span>{' '}
                  {currencyFormatter(results.personalAllowance)}
                </p>
                <p>
                  <span className="font-semibold">Pension contribution:</span>{' '}
                  {currencyFormatter(results.pensionDeduction)}
                </p>
                <p>
                  <span className="font-semibold">Student loan:</span>{' '}
                  {currencyFormatter(results.studentLoanRepayment)}
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
                Net income uk calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust pension, tax code, or student loan repayments to see instant take-home pay
                changes. The net income uk calculator keeps budgeting grounded in reality.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Comparing offers with a net income uk calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Before accepting a new role, run the net income uk calculator for each offer so you
                know exactly which package delivers the best take home pay.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={netIncomeFaqs} />
        </div>
      </section>
    </div>
  );
}
