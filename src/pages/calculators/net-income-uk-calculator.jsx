import React, { useMemo, useState, useCallback, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
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

const pagePath = '/calculators/net-income-uk-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/net-income-uk-calculator';
const pageTitle = 'Net Income UK Calculator | Take-Home Pay & Tax Deductions';
const metaDescription =
  'Use our UK net income calculator to reveal take-home pay, compare scenarios, and see how tax and NI deductions change your paycheque.';
const keywords = getMappedKeywords('Net Income UK Calculator');

const faqItems = [
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

const emotionalMessage =
  'Understanding your net income is crucial for effective budgeting and financial planning. Use this calculator to gain clarity on your take-home pay and make informed decisions.';
const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
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
  return tax;
};

const calculatePersonalAllowance = (salary) => {
  if (salary <= 100000) return 12570;
  const reduced = Math.max(12570 - Math.floor((salary - 100000) / 2), 0);
  return reduced;
};

const calculateNetIncome = ({ salary, pensionAmount, studentLoan, taxCode }) => {
  const personalAllowance = taxCode === '0T' ? 0 : calculatePersonalAllowance(salary);
  const taxableIncome = Math.max(salary - pensionAmount, 0);

  const incomeTax = calculateBandTax(Math.max(taxableIncome - personalAllowance, 0), ENGLAND_BANDS);
  const nationalInsurance = calculateBandTax(taxableIncome, NI_BANDS);
  const studentLoanRepayment =
    studentLoan && taxableIncome > STUDENT_LOAN_THRESHOLD
      ? (taxableIncome - STUDENT_LOAN_THRESHOLD) * STUDENT_LOAN_RATE
      : 0;

  const totalDeductions = incomeTax + nationalInsurance + studentLoanRepayment + pensionAmount;
  const netAnnual = salary - totalDeductions;

  return {
    pensionAmount,
    personalAllowance,
    incomeTax,
    nationalInsurance,
    studentLoanRepayment,
    netAnnual,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Gross Annual Salary (£)', currencyFormatter.format(parseNumber(inputs.salary))],
    ['Pension Contribution Type', inputs.pensionType === 'percentage' ? 'Percentage' : 'Fixed'],
    [
      'Pension Contribution Value',
      inputs.pensionType === 'percentage'
        ? `${inputs.pensionPercent}%`
        : currencyFormatter.format(parseNumber(inputs.pensionPercent)),
    ],
    ['Include Student Loan Plan 2', inputs.studentLoan ? 'Yes' : 'No'],
    ['Tax Code', inputs.taxCode],
    [],
    ['Net Annual Income (£)', currencyFormatter.format(results.netAnnual)],
    ['Net Monthly Income (£)', currencyFormatter.format(results.netAnnual / 12)],
    ['Income Tax (£)', currencyFormatter.format(results.incomeTax)],
    ['National Insurance (£)', currencyFormatter.format(results.nationalInsurance)],
    ['Student Loan Repayment (£)', currencyFormatter.format(results.studentLoanRepayment)],
    ['Total Pension Contribution (£)', currencyFormatter.format(results.pensionAmount)],
    ['Personal Allowance (£)', currencyFormatter.format(results.personalAllowance)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Income Tax', value: results.incomeTax, color: '#3b82f6' },
    { name: 'National Insurance', value: results.nationalInsurance, color: '#10b981' },
    { name: 'Pension Contribution', value: results.pensionAmount, color: '#f97316' },
    { name: 'Student Loan', value: results.studentLoanRepayment, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function NetIncomeUKCalculatorPage() {
  const [inputs, setInputs] = useState({
    salary: '52,000',
    pensionPercent: '5',
    pensionType: 'percentage',
    studentLoan: false,
    taxCode: '1257L',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Net Income UK Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & National Insurance Calculators', url: '/calculators#tax-national-insurance' },
      { name: 'Net Income UK Calculator', url: pagePath },
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
      const parsedSalary = parseNumber(inputs.salary);
      const parsedPensionValue = parseNumber(inputs.pensionPercent);

      const pensionAmount =
        inputs.pensionType === 'percentage'
          ? parsedSalary * (parsedPensionValue / 100)
          : parsedPensionValue;

      const computedResults = calculateNetIncome({
        salary: parsedSalary,
        pensionAmount: pensionAmount,
        studentLoan: inputs.studentLoan,
        taxCode: inputs.taxCode,
      });
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      salary: '52,000',
      pensionPercent: '5',
      pensionType: 'percentage',
      studentLoan: false,
      taxCode: '1257L',
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
                Net Income UK Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Reveal your UK take-home pay after Income Tax, National Insurance, pension
              contributions, and optional Student Loan deductions.
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
                  Income & Deduction Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="salary">Gross annual salary (£)</Label>
                      <Input
                        id="salary"
                        inputMode="decimal"
                        value={inputs.salary}
                        onChange={handleInputChange('salary')}
                        placeholder="e.g. 52,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Pension contribution</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={inputs.pensionType === 'percentage' ? 'default' : 'outline'}
                          onClick={() => handlePensionTypeChange('percentage')}
                        >
                          % of salary
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
                        Include Student Loan Plan 2
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
                      Calculate Net Income
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
                    <span className="font-semibold">Calculate Net Income</span> to see your
                    estimated take-home pay after all deductions.
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
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net annual</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netAnnual)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net monthly</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netAnnual / 12)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Income tax</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.incomeTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          National Insurance
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.nationalInsurance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Student Loan Repayment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.studentLoanRepayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Pension Contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionAmount)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="net-income-uk-projection"
                          title="Net Income UK Calculator Results"
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
                        <ResultBreakdownChart data={chartData} title="Net Income Deductions" />
                      </Suspense>
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
</div>
      </CalculatorWrapper>
    </div>
  );
}
