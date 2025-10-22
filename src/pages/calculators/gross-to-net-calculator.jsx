import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, Receipt, PieChart } from 'lucide-react';

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

const CALCULATOR_NAME = 'Gross to Net Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/gross-to-net-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Convert UK gross salary into take-home pay, factoring Income Tax, National Insurance, workplace pension contributions, and student loan repayments.';

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

const STUDENT_LOAN_PLAN_2_THRESHOLD = 27295;
const STUDENT_LOAN_PLAN_2_RATE = 0.09;

const defaultInputs = {
  grossSalary: '52,000',
  pensionPercentage: '6',
  pensionFixed: '0',
  contributionType: 'percentage',
  studentLoanPlan2: 'no',
};

const faqItems = [
  {
    question: 'Which deductions does this calculator include?',
    answer:
      'We apply UK Income Tax, employee National Insurance, an optional workplace pension contribution (percentage or fixed), and optional Student Loan plan 2 deductions.',
  },
  {
    question: 'How do I model salary sacrifice pension contributions?',
    answer:
      'Select percentage contributions and enter the rate your employer deducts via salary sacrifice. The calculator removes this amount before tax and NI are applied.',
  },
  {
    question: 'Can I enter monthly or weekly salaries?',
    answer:
      'Convert your wage to an annual figure (for example, monthly × 12). The outputs show annual, monthly, weekly, and daily take-home pay to help you budget.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Quickly jump to every tax, salary, and savings calculator available.',
  },
  {
    label: 'Tax & income tools',
    url: '/#tax-income',
    description: 'Explore PAYE, dividend, and take-home pay calculators for every scenario.',
  },
  {
    label: 'PAYE calculator',
    url: '/paye-calculator',
    description: 'Break down PAYE deductions and net pay per payslip.',
  },
];

const relatedCalculators = [
  {
    name: 'Income Tax Calculator',
    url: '/income-tax-calculator',
    description: 'View a detailed breakdown of Income Tax bands and allowances.',
  },
  {
    name: 'Take-Home Pay Calculator',
    url: '/take-home-pay-calculator',
    description: 'Compare take-home pay when pension contributions or benefits change.',
  },
  {
    name: 'Salary Calculator',
    url: '/salary-calculator',
    description: 'Translate hourly, weekly, or monthly pay into annual salary and deductions.',
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

const formatNumber = (value) =>
  value.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const calculateBandTax = (income, bands) => {
  let remaining = income;
  let tax = 0;
  for (const band of bands) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.max - band.min);
    tax += taxable * band.rate;
    remaining -= taxable;
  }
  return Math.max(tax, 0);
};

const calculateStudentLoan = (income) => {
  if (income <= STUDENT_LOAN_PLAN_2_THRESHOLD) return 0;
  return (income - STUDENT_LOAN_PLAN_2_THRESHOLD) * STUDENT_LOAN_PLAN_2_RATE;
};

const calculateGrossToNet = ({ grossSalary, contributionType, pensionPercentage, pensionFixed, studentLoanPlan2 }) => {
  if (grossSalary <= 0) {
    return {
      valid: false,
      message: 'Enter your gross annual salary to calculate net pay.',
    };
  }

  const pensionDeduction =
    contributionType === 'percentage'
      ? Math.max(grossSalary * (Math.max(pensionPercentage, 0) / 100), 0)
      : Math.min(Math.max(pensionFixed, 0), grossSalary);

  const taxableIncome = Math.max(grossSalary - pensionDeduction, 0);
  const incomeTax = calculateBandTax(taxableIncome, TAX_BANDS);
  const nationalInsurance = calculateBandTax(taxableIncome, NI_BANDS);
  const studentLoan = studentLoanPlan2 === 'yes' ? calculateStudentLoan(taxableIncome) : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoan + pensionDeduction;
  const netSalary = taxableIncome - (incomeTax + nationalInsurance + studentLoan);

  return {
    valid: true,
    grossSalary,
    pensionDeduction,
    taxableIncome,
    incomeTax,
    nationalInsurance,
    studentLoan,
    totalDeductions,
    netSalary,
  };
};

export default function GrossToNetCalculatorPage() {
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
      grossSalary: sanitiseNumber(inputs.grossSalary),
      contributionType: inputs.contributionType,
      pensionPercentage: sanitiseNumber(inputs.pensionPercentage),
      pensionFixed: sanitiseNumber(inputs.pensionFixed),
      studentLoanPlan2: inputs.studentLoanPlan2,
    };

    const outcome = calculateGrossToNet(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Net salary', value: results.netSalary, color: '#22c55e' },
      { name: 'Income tax', value: results.incomeTax, color: '#ef4444' },
      { name: 'National Insurance', value: results.nationalInsurance, color: '#0ea5e9' },
      { name: 'Pension', value: results.pensionDeduction, color: '#f59e0b' },
      { name: 'Student loan', value: results.studentLoan, color: '#a855f7' },
    ].filter((item) => item.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Gross salary (£)', results.grossSalary.toFixed(2)],
      ['Pension deduction (£)', results.pensionDeduction.toFixed(2)],
      ['Taxable income (£)', results.taxableIncome.toFixed(2)],
      ['Income tax (£)', results.incomeTax.toFixed(2)],
      ['National Insurance (£)', results.nationalInsurance.toFixed(2)],
      ['Student loan (£)', results.studentLoan.toFixed(2)],
      ['Net salary (£)', results.netSalary.toFixed(2)],
      ['Total deductions (£)', results.totalDeductions.toFixed(2)],
      ['Net per month (£)', (results.netSalary / 12).toFixed(2)],
      ['Net per week (£)', (results.netSalary / 52).toFixed(2)],
      ['Net per day (£)', (results.netSalary / 260).toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Take-Home Pay Converter`}</title>
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
            Gross to Net Calculator
          </Heading>
          <p className="calculator-hero__description">
            Understand how pension contributions, tax, NI, and student loan deductions shape your take-home pay for the UK 2025/26 tax year.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Own every pound you earn"
          message="When you know how much actually lands in your account, it’s easier to negotiate salary, tweak pension contributions, and plan your monthly budget."
          quote="Knowledge is of no value unless you put it into practice."
          author="Anton Chekhov"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Salary inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="grossSalary" className="text-sm font-medium">
                    Gross salary (£ per year)
                  </Label>
                  <Input
                    id="grossSalary"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="500"
                    value={inputs.grossSalary}
                    onChange={handleInputChange('grossSalary')}
                    placeholder="e.g., 52,000"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Pension contribution</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        value={inputs.contributionType}
                        onChange={handleSelectChange('contributionType')}
                        className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      >
                        <option value="percentage">Percentage of salary</option>
                        <option value="fixed">Fixed annual contribution</option>
                      </select>
                    </div>
                    <div>
                      {inputs.contributionType === 'percentage' ? (
                        <Input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="0.5"
                          value={inputs.pensionPercentage}
                          onChange={handleInputChange('pensionPercentage')}
                          placeholder="e.g., 6"
                        />
                      ) : (
                        <Input
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step="100"
                          value={inputs.pensionFixed}
                          onChange={handleInputChange('pensionFixed')}
                          placeholder="e.g., 3,000"
                        />
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the employee pension amount deducted before tax.
                  </p>
                </div>
                <div>
                  <Label htmlFor="studentLoanPlan2" className="text-sm font-medium">
                    Student loan plan 2 deduction?
                  </Label>
                  <select
                    id="studentLoanPlan2"
                    value={inputs.studentLoanPlan2}
                    onChange={handleSelectChange('studentLoanPlan2')}
                    className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
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
              <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    <PiggyBank className="h-5 w-5" />
                    Net pay summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Take-home pay (annual)
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.netSalary)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Total deductions
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.totalDeductions)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Monthly net pay
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.netSalary / 12)}
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-200">
                        Weekly: {currencyFormatter.format(results.netSalary / 52)} · Daily:{' '}
                        {currencyFormatter.format(results.netSalary / 260)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Taxable income
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.taxableIncome)}
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-200">
                        Pension contribution: {currencyFormatter.format(results.pensionDeduction)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      Deductions breakdown
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Net pay composition" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="gross-to-net-calculator-results"
                    title="Gross to net salary breakdown"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <PieChart className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your annual salary, pension contribution, and student loan status, then press{' '}
                        <strong>Calculate</strong> to reveal your take-home pay.
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
