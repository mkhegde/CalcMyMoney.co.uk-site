import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ClipboardList, PiggyBank, BarChart3 } from 'lucide-react';

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

const CALCULATOR_NAME = 'Income Tax Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/income-tax-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Estimate UK Income Tax, National Insurance, pension contributions, and optional Student Loan repayments to reveal your net income for the 2025/26 tax year.';

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
const STUDENT_LOAN_RATE = 0.09;

const defaultInputs = {
  annualSalary: '52,000',
  pensionContribution: '5',
  pensionType: 'percentage',
  includeStudentLoan: 'no',
};

const faqItems = [
  {
    question: 'Does this calculator reflect the 2025/26 thresholds?',
    answer:
      'Yes. The income tax and National Insurance bands are aligned with the 2025/26 UK tax year. Update the figures manually if HMRC announces changes.',
  },
  {
    question: 'How do pension contributions affect taxable pay?',
    answer:
      'Workplace pension contributions are deducted before tax, reducing the income taxed by HMRC. You can enter either a percentage or a fixed annual contribution.',
  },
  {
    question: 'Can I include Student Loan deductions?',
    answer:
      'Select “Yes” for Student Loan plan 2 to see how repayments affect your take-home pay. Add plan 1 or postgraduate calculations manually if needed.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Jump to every tax, salary, mortgage, and savings calculator we host.',
  },
  {
    label: 'Tax & income tools',
    url: '/#tax-income',
    description: 'Understand PAYE, dividends, and take-home pay from every angle.',
  },
  {
    label: 'Gross to net calculator',
    url: '/gross-to-net-calculator',
    description: 'Convert gross salary to net pay with pension and student loan deductions.',
  },
];

const relatedCalculators = [
  {
    name: 'Take-Home Pay Calculator',
    url: '/take-home-pay-calculator',
    description: 'Compare net pay when pension contributions or benefits change.',
  },
  {
    name: 'PAYE Calculator',
    url: '/paye-calculator',
    description: 'Break down PAYE deductions per payslip, including NI and student loans.',
  },
  {
    name: 'Dividend Tax Calculator',
    url: '/dividend-tax-calculator',
    description: 'Plan tax-efficient income if you pay yourself via salary and dividends.',
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

const calculateBandTax = (income, bands) => {
  let remaining = income;
  let tax = 0;
  const breakdown = [];

  for (const band of bands) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.max - band.min);
    const bandTax = taxable * band.rate;
    if (taxable > 0) {
      breakdown.push({ rate: band.rate, taxable, tax: bandTax });
    }
    tax += bandTax;
    remaining -= taxable;
  }

  return { tax, breakdown };
};

const calculatePersonalAllowance = (salary, allowance = 12570) => {
  if (salary <= 100000) return allowance;
  const reduction = Math.floor((salary - 100000) / 2);
  return Math.max(allowance - reduction, 0);
};

const calculateIncomeTax = ({ annualSalary, pensionContribution, pensionType, includeStudentLoan }) => {
  if (annualSalary <= 0) {
    return {
      valid: false,
      message: 'Enter your annual salary to calculate tax and net income.',
    };
  }

  const pensionDeduction =
    pensionType === 'percentage'
      ? annualSalary * (Math.max(pensionContribution, 0) / 100)
      : Math.min(Math.max(pensionContribution, 0), annualSalary);

  const taxablePay = Math.max(annualSalary - pensionDeduction, 0);
  const personalAllowance = calculatePersonalAllowance(annualSalary);
  const taxableIncome = Math.max(taxablePay - personalAllowance, 0);

  const { tax: incomeTax, breakdown: incomeTaxBreakdown } = calculateBandTax(taxableIncome, TAX_BANDS);
  const { tax: nationalInsurance, breakdown: niBreakdown } = calculateBandTax(taxablePay, NI_BANDS);
  const studentLoan =
    includeStudentLoan === 'yes' && taxablePay > STUDENT_LOAN_PLAN_2_THRESHOLD
      ? (taxablePay - STUDENT_LOAN_PLAN_2_THRESHOLD) * STUDENT_LOAN_RATE
      : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoan + pensionDeduction;
  const netIncome = annualSalary - totalDeductions;

  return {
    valid: true,
    annualSalary,
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
      annualSalary: sanitiseNumber(inputs.annualSalary),
      pensionContribution: sanitiseNumber(inputs.pensionContribution),
      pensionType: inputs.pensionType,
      includeStudentLoan: inputs.includeStudentLoan,
    };
    const outcome = calculateIncomeTax(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Net income', value: results.netIncome, color: '#22c55e' },
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
      ['Gross salary (£)', results.annualSalary.toFixed(2)],
      ['Pension deduction (£)', results.pensionDeduction.toFixed(2)],
      ['Personal allowance (£)', results.personalAllowance.toFixed(2)],
      ['Taxable income (£)', results.taxableIncome.toFixed(2)],
      ['Income tax (£)', results.incomeTax.toFixed(2)],
      ['National Insurance (£)', results.nationalInsurance.toFixed(2)],
      ['Student loan (£)', results.studentLoan.toFixed(2)],
      ['Net income (£)', results.netIncome.toFixed(2)],
      ['Net per month (£)', (results.netIncome / 12).toFixed(2)],
      ['Net per week (£)', (results.netIncome / 52).toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | UK Take-Home Estimator`}</title>
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
            Income Tax Calculator
          </Heading>
          <p className="calculator-hero__description">
            Understand how Income Tax, National Insurance, pension contributions, and Student Loan plan 2 deductions shape your take-home pay.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Plan pay rises the smart way"
          message="Knowing the tax bite before you negotiate a salary or contract keeps surprises off your payslip and goals on track."
          quote="A budget is more than numbers; it’s a reflection of values."
          author="Dave Ramsey"
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
                  <Label htmlFor="annualSalary" className="text-sm font-medium">
                    Gross salary (£ per year)
                  </Label>
                  <Input
                    id="annualSalary"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="500"
                    value={inputs.annualSalary}
                    onChange={handleInputChange('annualSalary')}
                    placeholder="e.g., 52,000"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Pension contribution</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={inputs.pensionType}
                      onChange={handleSelectChange('pensionType')}
                      className="mt-1 block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                    >
                      <option value="percentage">Percentage of salary</option>
                      <option value="fixed">Fixed annual amount</option>
                    </select>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step={inputs.pensionType === 'percentage' ? '0.5' : '100'}
                      value={inputs.pensionContribution}
                      onChange={handleInputChange('pensionContribution')}
                      placeholder={inputs.pensionType === 'percentage' ? 'e.g., 5' : 'e.g., 3,000'}
                    />
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Enter the employee contribution deducted before tax.
                  </p>
                </div>
                <div>
                  <Label htmlFor="includeStudentLoan" className="text-sm font-medium">
                    Include Student Loan plan 2 deduction?
                  </Label>
                  <select
                    id="includeStudentLoan"
                    value={inputs.includeStudentLoan}
                    onChange={handleSelectChange('includeStudentLoan')}
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
                    Tax breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Net income
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.netIncome)}
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-200">
                        Monthly: {currencyFormatter.format(results.netIncome / 12)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Total deductions
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(
                          results.incomeTax + results.nationalInsurance + results.studentLoan + results.pensionDeduction
                        )}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Personal allowance
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.personalAllowance)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Taxable income
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.taxableIncome)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      Net pay composition
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Net pay composition" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="income-tax-calculator-results"
                    title="Income tax breakdown"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <BarChart3 className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your salary, pension, and student loan status, then press{' '}
                        <strong>Calculate</strong> to reveal your tax and net income.
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
