import React, { useMemo, useState, useCallback, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, PiggyBank, ClipboardList, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/paye-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/paye-calculator';
const pageTitle = 'PAYE Calculator UK | Take-Home Pay & Tax Deductions';
const metaDescription =
  'Use our UK PAYE calculator to check income tax, NI, and student loan deductions so the PAYE calculator shows your true take-home pay each payday.';
const keywords = getMappedKeywords('PAYE Calculator');

const faqItems = [
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
      'Yes, Plan 2 repayments are included when toggled on. Adjust the input if your marginal rate changes or if you want to model salary sacrifice to reduce NI.',
  },
];

const emotionalMessage =
  'Understanding your PAYE deductions is essential for managing your finances. Use this calculator to gain clarity on your take-home pay and plan your budget effectively.';
const emotionalQuote = {
  text: 'A penny saved is a penny earned.',
  author: 'Benjamin Franklin',
};

const directoryLinks = [
  {
    url: '/#tax-income',
    label: 'Explore all tax & income calculators',
    description:
      'Understand deductions, take-home pay, and tax liabilities on every type of income.',
  },
  {
    url: '/income-tax-calculator',
    label: 'Income Tax Calculator',
    description: 'Estimate your income tax liability based on your annual earnings.',
  },
  {
    url: '/national-insurance-calculator',
    label: 'National Insurance Calculator',
    description: 'Estimate NI contributions and see the impact on your take-home pay.',
  },
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

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

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

const calculateNetPay = ({ grossPay, frequency, pensionAmount, taxCode, studentLoan }) => {
  const periods = PAY_FREQUENCIES[frequency].periods;
  const annualGrossPay = parseNumber(grossPay) * periods;
  const annualPensionDeduction = parseNumber(pensionAmount);

  const taxableIncome = Math.max(annualGrossPay - annualPensionDeduction, 0);
  const personalAllowance =
    taxCode.toUpperCase() === '0T' ? 0 : calculatePersonalAllowance(annualGrossPay);
  const incomeTax = calculateBandTax(Math.max(taxableIncome - personalAllowance, 0), ENGLAND_BANDS);
  const nationalInsurance = calculateBandTax(taxableIncome, NI_BANDS);
  const studentLoanRepayment =
    studentLoan && taxableIncome > STUDENT_LOAN_THRESHOLD
      ? (taxableIncome - STUDENT_LOAN_THRESHOLD) * STUDENT_LOAN_RATE
      : 0;

  const totalAnnualDeductions =
    incomeTax + nationalInsurance + studentLoanRepayment + annualPensionDeduction;
  const netAnnual = annualGrossPay - totalAnnualDeductions;

  return {
    annualGrossPay,
    annualPensionDeduction,
    personalAllowance,
    incomeTax,
    nationalInsurance,
    studentLoanRepayment,
    netAnnual,
    grossPerPeriod: annualGrossPay / periods,
    netPerPeriod: netAnnual / periods,
    incomeTaxPerPeriod: incomeTax / periods,
    nationalInsurancePerPeriod: nationalInsurance / periods,
    studentLoanRepaymentPerPeriod: studentLoanRepayment / periods,
    pensionDeductionPerPeriod: annualPensionDeduction / periods,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    [
      `Gross Pay (${PAY_FREQUENCIES[inputs.frequency].label}) (£)`,
      currencyFormatter.format(parseNumber(inputs.grossPay)),
    ],
    ['Pay Frequency', PAY_FREQUENCIES[inputs.frequency].label],
    ['Pension Contribution Type', inputs.pensionType === 'percentage' ? 'Percentage' : 'Fixed'],
    [
      'Pension Contribution Value',
      inputs.pensionType === 'percentage'
        ? `${inputs.pensionPercent}%`
        : currencyFormatter.format(parseNumber(inputs.pensionPercent)),
    ],
    ['Tax Code', inputs.taxCode],
    ['Student Loan Plan 2', inputs.studentLoan ? 'Included' : 'Excluded'],
    [],
    ['Gross Pay (Annual) (£)', currencyFormatter.format(results.annualGrossPay)],
    ['Net Pay (Annual) (£)', currencyFormatter.format(results.netAnnual)],
    [
      `Gross Pay (${PAY_FREQUENCIES[inputs.frequency].label}) (£)`,
      currencyFormatter.format(results.grossPerPeriod),
    ],
    [
      `Net Pay (${PAY_FREQUENCIES[inputs.frequency].label}) (£)`,
      currencyFormatter.format(results.netPerPeriod),
    ],
    ['Income Tax (Annual) (£)', currencyFormatter.format(results.incomeTax)],
    ['National Insurance (Annual) (£)', currencyFormatter.format(results.nationalInsurance)],
    ['Student Loan Repayment (Annual) (£)', currencyFormatter.format(results.studentLoanRepayment)],
    ['Pension Contribution (Annual) (£)', currencyFormatter.format(results.annualPensionDeduction)],
    ['Personal Allowance (Annual) (£)', currencyFormatter.format(results.personalAllowance)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Income Tax', value: results.incomeTax, color: '#3b82f6' },
    { name: 'National Insurance', value: results.nationalInsurance, color: '#10b981' },
    { name: 'Pension Contribution', value: results.annualPensionDeduction, color: '#f97316' },
    { name: 'Student Loan', value: results.studentLoanRepayment, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function PayeCalculatorPage() {
  const [inputs, setInputs] = useState({
    grossPay: '3,800',
    frequency: 'monthly',
    pensionPercent: '5',
    pensionType: 'percentage',
    taxCode: '1257L',
    studentLoan: false,
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'PAYE Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'PAYE Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleFrequencyChange = useCallback((value) => {
    setInputs((prev) => ({ ...prev, frequency: value }));
  }, []);

  const handlePensionTypeChange = useCallback((type) => {
    setInputs((prev) => ({
      ...prev,
      pensionType: type,
      pensionPercent: type === 'percentage' ? '5' : '3000', // Default values for each type
    }));
  }, []);

  const handleStudentLoanToggle = useCallback(() => {
    setInputs((prev) => ({ ...prev, studentLoan: !prev.studentLoan }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const parsedPensionValue = parseNumber(inputs.pensionPercent);
      const pensionAmount =
        inputs.pensionType === 'percentage'
          ? parseNumber(inputs.grossPay) *
            PAY_FREQUENCIES[inputs.frequency].periods *
            (parsedPensionValue / 100)
          : parsedPensionValue;

      const computedResults = calculateNetPay({
        grossPay: inputs.grossPay,
        frequency: inputs.frequency,
        pensionAmount: pensionAmount,
        taxCode: inputs.taxCode,
        studentLoan: inputs.studentLoan,
      });
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      grossPay: '3,800',
      frequency: 'monthly',
      pensionPercent: '5',
      pensionType: 'percentage',
      taxCode: '1257L',
      studentLoan: false,
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results), [results]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                PAYE Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work out PAYE tax, National Insurance, pension deductions, and optional Student Loan
              repayments for your next payslip.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-950/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            footerColor="text-indigo-700 dark:text-indigo-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                    aria-hidden="true"
                  />
                  Pay & Deduction Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="grossPay">
                        Gross pay ({PAY_FREQUENCIES[inputs.frequency].label}) (£)
                      </Label>
                      <Input
                        id="grossPay"
                        inputMode="decimal"
                        value={inputs.grossPay}
                        onChange={handleInputChange('grossPay')}
                        placeholder="e.g. 3,800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pay frequency</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(PAY_FREQUENCIES).map(([key, option]) => (
                          <Button
                            type="button"
                            key={key}
                            variant={inputs.frequency === key ? 'default' : 'outline'}
                            onClick={() => handleFrequencyChange(key)}
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Pension contribution</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={inputs.pensionType === 'percentage' ? 'default' : 'outline'}
                          onClick={() => handlePensionTypeChange('percentage')}
                        >
                          % of pay
                        </Button>
                        <Button
                          type="button"
                          variant={inputs.pensionType === 'fixed' ? 'default' : 'outline'}
                          onClick={() => handlePensionTypeChange('fixed')}
                        >
                          £ per year
                        </Button>
                      </div>
                      <Input
                        className="mt-3"
                        inputMode="decimal"
                        value={inputs.pensionPercent}
                        onChange={handleInputChange('pensionPercent')}
                        placeholder={inputs.pensionType === 'percentage' ? 'e.g. 5' : 'e.g. 3000'}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentLoan" className="text-sm font-medium">
                        Student Loan Plan 2
                      </Label>
                      <Button
                        type="button"
                        variant={inputs.studentLoan ? 'default' : 'outline'}
                        onClick={handleStudentLoanToggle}
                        className="w-full"
                      >
                        {inputs.studentLoan ? 'Included' : 'Excluded'}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxCode">Tax code</Label>
                      <Input
                        id="taxCode"
                        value={inputs.taxCode}
                        onChange={handleInputChange('taxCode')}
                        placeholder="e.g. 1257L"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate PAYE
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your gross pay and deduction details, then press{' '}
                    <span className="font-semibold">Calculate PAYE</span> to see your estimated
                    take-home pay after all deductions.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Take-Home Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Gross per period
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossPerPeriod)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Net per period
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netPerPeriod)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Income tax per period
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.incomeTaxPerPeriod)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          NI per period
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.nationalInsurancePerPeriod)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Student Loan per period
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.studentLoanRepaymentPerPeriod)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Pension per period
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionDeductionPerPeriod)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="paye-take-home-pay"
                          title="PAYE Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Annual Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Gross annual salary
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualGrossPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Net annual pay
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netAnnual)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Annual income tax
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.incomeTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Annual National Insurance
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.nationalInsurance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Annual Student Loan
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.studentLoanRepayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Annual Pension Contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualPensionDeduction)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        The tax and National Insurance thresholds and rates used in this calculator
                        are examples. Always check the{' '}
                        <a
                          href="https://www.gov.uk/government/publications/rates-and-allowances-income-tax"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          official UK government website
                        </a>{' '}
                        for the most current rates and thresholds.
                      </p>
                      <p>
                        This calculator provides an estimate. Your actual take-home pay may vary
                        based on your specific employment circumstances, tax code, and any
                        additional benefits or deductions.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
