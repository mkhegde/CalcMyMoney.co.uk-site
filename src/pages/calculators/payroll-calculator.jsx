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
import {
  Calculator,
  Receipt,
  ClipboardCheck,
  PoundSterling,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/payroll-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/payroll-calculator';
const pageTitle = 'Payroll Calculator UK | Payslip Breakdown & Net Pay';
const metaDescription =
  'Use our UK payroll calculator to estimate PAYE deductions, NI, pensions, and net pay to understand your payslip breakdown.';
const keywords = getMappedKeywords('Payroll Calculator');

const studentLoanPlans = [
  { value: 'none', label: 'No student loan', threshold: Infinity, rate: 0 },
  { value: 'plan1', label: 'Plan 1 (pre-2012 loans)', threshold: 24990, rate: 0.09 },
  { value: 'plan2', label: 'Plan 2 (post-2012 loans)', threshold: 27295, rate: 0.09 },
  { value: 'plan4', label: 'Plan 4 (Scotland)', threshold: 27660, rate: 0.09 },
  { value: 'postgrad', label: 'Postgraduate loan', threshold: 21000, rate: 0.06 },
];

const faqItems = [
  {
    question: 'How does PAYE calculate income tax?',
    answer:
      'PAYE spreads income tax across the year. It applies personal allowance, basic, higher, and additional rate bands to gross pay and deducts tax each pay period.',
  },
  {
    question: 'Does pension contribution reduce taxable income?',
    answer:
      'Yes. Employee pension contributions reduce taxable and NIable pay when made via salary sacrifice or net pay arrangements, lowering statutory deductions.',
  },
  {
    question: 'Are student loan repayments included on the payslip?',
    answer:
      'If you have an active student loan, payroll deducts repayments via PAYE once earnings exceed the plan-specific threshold. This calculator shows an estimate of those deductions.',
  },
];

const emotionalMessage =
  'Understanding your payslip is key to financial clarity. Use this payroll calculator to break down your earnings and deductions, ensuring you always know your true take-home pay.';
const emotionalQuote = {
  text: 'An investment in knowledge pays the best interest.',
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
    url: '/paye-calculator',
    label: 'PAYE Calculator',
    description: 'Work out PAYE tax, National Insurance, and student loan deductions.',
  },
  {
    url: '/salary-calculator',
    label: 'Salary Calculator',
    description: 'Estimate your gross and net pay based on your annual salary.',
  },
];

const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_MAIN_RATE = 0.08;
const NI_UPPER_RATE = 0.02;

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

function calculateIncomeTax(grossIncome) {
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (grossIncome > 100000) {
    const reduction = Math.floor((grossIncome - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxable = Math.max(0, grossIncome - personalAllowance);

  let tax = 0;
  if (taxable <= 0) return { tax, personalAllowance };

  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - personalAllowance);
  tax += basicBand * 0.2;

  if (taxable > basicBand) {
    const higherBand = Math.min(taxable - basicBand, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT);
    tax += higherBand * 0.4;

    if (taxable > basicBand + higherBand) {
      const additionalBand = taxable - basicBand - higherBand;
      tax += additionalBand * 0.45;
    }
  }

  return { tax, personalAllowance };
}

function calculateNationalInsurance(annualPay) {
  const niBand1 = Math.max(0, Math.min(annualPay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD);
  const niBand2 = Math.max(0, annualPay - NI_UPPER_EARNINGS_LIMIT);
  const ni = niBand1 * NI_MAIN_RATE + niBand2 * NI_UPPER_RATE;
  return ni;
}

function calculateStudentLoan(annualPay, plan) {
  if (!plan || plan.value === 'none') return 0;
  const threshold = plan.threshold;
  const rate = plan.rate;
  if (!Number.isFinite(threshold) || threshold === Infinity) return 0;
  return Math.max(0, (annualPay - threshold) * rate);
}

export default function PayrollCalculatorPage() {
  const [inputs, setInputs] = useState({
    annualSalary: '52,000',
    pensionContributionType: 'percentage',
    pensionContributionValue: '5',
    taxCode: '1257L',
    studentLoanPlan: 'plan2',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Payroll Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'Payroll Calculator', url: pagePath },
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

  const handlePensionTypeChange = useCallback((type) => {
    setInputs((prev) => ({
      ...prev,
      pensionContributionType: type,
      pensionContributionValue: type === 'percentage' ? '5' : '3000', // Default values
    }));
  }, []);

  const handleStudentLoanPlanChange = useCallback((event) => {
    setInputs((prev) => ({ ...prev, studentLoanPlan: event.target.value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const annualSalary = parseNumber(inputs.annualSalary);
      const pensionValue = parseNumber(inputs.pensionContributionValue);
      const pensionContribution =
        inputs.pensionContributionType === 'percentage'
          ? annualSalary * (pensionValue / 100)
          : pensionValue;

      const taxablePay = Math.max(0, annualSalary - pensionContribution);

      const { tax, personalAllowance } = calculateIncomeTax(taxablePay);
      const ni = calculateNationalInsurance(taxablePay);
      const studentLoanPlan = studentLoanPlans.find(
        (plan) => plan.value === inputs.studentLoanPlan
      );
      const studentLoan = calculateStudentLoan(taxablePay, studentLoanPlan);

      const totalDeductions = tax + ni + pensionContribution + studentLoan;
      const takeHome = annualSalary - totalDeductions;

      setResults({
        annualSalary,
        pensionContribution,
        taxablePay,
        tax,
        ni,
        studentLoan,
        totalDeductions,
        takeHome,
        monthlyNet: takeHome / 12,
        monthlyGross: annualSalary / 12,
        personalAllowance,
      });
      setHasCalculated(true);

      const csvRows = [
        ['Metric', 'Value'],
        ['Gross Annual Salary (£)', currencyFormatter.format(annualSalary)],
        [
          'Pension Contribution Type',
          inputs.pensionContributionType === 'percentage' ? 'Percentage' : 'Fixed',
        ],
        [
          'Pension Contribution Value',
          inputs.pensionContributionType === 'percentage'
            ? `${inputs.pensionContributionValue}%`
            : currencyFormatter.format(pensionValue),
        ],
        ['Tax Code', inputs.taxCode],
        ['Student Loan Plan', studentLoanPlan.label],
        [],
        ['Monthly Gross Pay (£)', currencyFormatter.format(annualSalary / 12)],
        ['Monthly Net Pay (£)', currencyFormatter.format(takeHome / 12)],
        ['Annual Income Tax (£)', currencyFormatter.format(tax)],
        ['Annual National Insurance (£)', currencyFormatter.format(ni)],
        ['Annual Pension Contribution (£)', currencyFormatter.format(pensionContribution)],
        ['Annual Student Loan Repayment (£)', currencyFormatter.format(studentLoan)],
        ['Total Annual Deductions (£)', currencyFormatter.format(totalDeductions)],
        ['Annual Take-Home Salary (£)', currencyFormatter.format(takeHome)],
        ['Personal Allowance (£)', currencyFormatter.format(personalAllowance)],
      ];
      setCsvData(csvRows);
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      annualSalary: '52,000',
      pensionContributionType: 'percentage',
      pensionContributionValue: '5',
      taxCode: '1257L',
      studentLoanPlan: 'plan2',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Income Tax', value: results.tax, color: '#3b82f6' },
      { name: 'National Insurance', value: results.ni, color: '#10b981' },
      { name: 'Pension Contribution', value: results.pensionContribution, color: '#f97316' },
      { name: 'Student Loan', value: results.studentLoan, color: '#ef4444' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Payroll Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate payroll deductions, breakdown salary deductions, and ensure PAYE system
              figures match your payslip accuracy expectations.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PoundSterling className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  Salary & Deduction Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="annualSalary">Gross annual salary (£)</Label>
                      <Input
                        id="annualSalary"
                        inputMode="decimal"
                        value={inputs.annualSalary}
                        onChange={handleInputChange('annualSalary')}
                        placeholder="e.g. 52,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pension contribution</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={
                            inputs.pensionContributionType === 'percentage' ? 'default' : 'outline'
                          }
                          onClick={() => handlePensionTypeChange('percentage')}
                        >
                          % of salary
                        </Button>
                        <Button
                          type="button"
                          variant={
                            inputs.pensionContributionType === 'fixed' ? 'default' : 'outline'
                          }
                          onClick={() => handlePensionTypeChange('fixed')}
                        >
                          £ per year
                        </Button>
                      </div>
                      <Input
                        className="mt-3"
                        inputMode="decimal"
                        value={inputs.pensionContributionValue}
                        onChange={handleInputChange('pensionContributionValue')}
                        placeholder={
                          inputs.pensionContributionType === 'percentage' ? 'e.g. 5' : 'e.g. 3000'
                        }
                      />
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
                    <div className="space-y-2">
                      <Label htmlFor="studentLoanPlan">Student loan plan</Label>
                      <select
                        id="studentLoanPlan"
                        value={inputs.studentLoanPlan}
                        onChange={handleStudentLoanPlanChange}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
                      >
                        {studentLoanPlans.map((plan) => (
                          <option key={plan.value} value={plan.value}>
                            {plan.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Payroll
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
                    Enter your gross annual salary and deduction details, then press{' '}
                    <span className="font-semibold">Calculate Payroll</span> to see your estimated
                    payslip breakdown and take-home pay.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Receipt
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-200"
                          aria-hidden="true"
                        />
                        Payslip Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Monthly Gross Pay
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyGross)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Monthly Net Pay
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyNet)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Annual Income Tax
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.tax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Annual National Insurance
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.ni)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Annual Pension Contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionContribution)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Annual Student Loan
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.studentLoan)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="payroll-breakdown"
                          title="Payroll Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        Deduction Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart data={chartData} title="Payroll Deductions" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
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
                          className="text-emerald-600 hover:underline dark:text-emerald-400"
                        >
                          official UK government website
                        </a>{' '}
                        for the most current rates and thresholds.
                      </p>
                      <p>
                        This calculator provides an estimate. Your actual payslip may vary based on
                        your specific employment circumstances, tax code, and any additional
                        benefits or deductions.
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
