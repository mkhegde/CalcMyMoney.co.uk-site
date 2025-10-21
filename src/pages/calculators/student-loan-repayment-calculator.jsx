import React, { useCallback, useMemo, useState, Suspense } from 'react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, GraduationCap, Clock, PiggyBank, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/student-loan-repayment-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/student-loan-repayment-calculator';
const pageTitle = 'Student Loan Repayment Calculator UK | Plan 1, Plan 2, Plan 4 & Postgraduate';
const metaDescription =
  'Estimate UK student loan repayments under Plan 1, Plan 2, Plan 4, Plan 5, or Postgraduate. Model salary growth, monthly payments, and potential write-off year.';
const keywords = getMappedKeywords('Student Loan Repayment Calculator');

const plans = [
  { value: 'plan1', label: 'Plan 1 (pre-2012 England/Wales)', threshold: 24990, rate: 0.09, writeOffYears: 25 },
  { value: 'plan2', label: 'Plan 2 (post-2012 England/Wales)', threshold: 27295, rate: 0.09, writeOffYears: 30 },
  { value: 'plan4', label: 'Plan 4 (Scotland)', threshold: 27660, rate: 0.09, writeOffYears: 30 },
  { value: 'plan5', label: 'Plan 5 (England from 2023)', threshold: 25000, rate: 0.09, writeOffYears: 40 },
  { value: 'postgrad', label: 'Postgraduate loan', threshold: 21000, rate: 0.06, writeOffYears: 30 },
];

const faqItems = [
  {
    question: 'How are UK student loan repayments calculated?',
    answer:
      'Repayments are a percentage of earnings above the plan threshold. For example, Plan 2 repays 9% of earnings above £27,295 via PAYE. The calculator uses the latest thresholds for the selected plan.',
  },
  {
    question: 'What interest rate should I enter?',
    answer:
      'Use the interest rate published by the Student Loans Company. Plan rates are linked to RPI with additional uplifts depending on income or plan type.',
  },
  {
    question: 'When will my loan be written off?',
    answer:
      'Write-off rules depend on the plan. Plan 1 loans write off 25 years after the April you were first due to repay, Plan 2 after 30 years, Plan 4 after 30 years, and Plan 5 after 40 years.',
  },
];

const emotionalMessage =
  'Understand how your student loan changes as your salary grows. Forecast repayments, plan for future pay rises, and stay on top of your debt without stress.';
const emotionalQuote = {
  text: 'Education is the most powerful weapon which you can use to change the world.',
  author: 'Nelson Mandela',
};

const directoryLinks = [
  {
    url: '/#income-tax',
    label: 'Income & tax calculators',
    description: 'See how PAYE, National Insurance, and student loans interact on your payslip.',
  },
  {
    url: '/calculators/take-home-pay-calculator',
    label: 'Take-Home Pay Calculator',
    description: 'Estimate net pay after tax, NI, pensions, and student loan deductions.',
  },
  {
    url: '/calculators/salary-calculator',
    label: 'Salary Calculator',
    description: 'Convert annual salaries into monthly, weekly, and hourly figures.',
  },
];

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

const getPlan = (value) => plans.find((plan) => plan.value === value) ?? plans[1];

const calculateStudentLoan = (inputs) => {
  const annualIncome = Math.max(parseNumber(inputs.annualIncome), 0);
  const incomeGrowth = Math.max(parseNumber(inputs.expectedIncomeGrowth), 0) / 100;
  const loanBalance = Math.max(parseNumber(inputs.loanBalance), 0);
  const interestRate = Math.max(parseNumber(inputs.interestRate), 0) / 100;
  const plan = getPlan(inputs.plan);

  const threshold = plan.threshold;
  const repaymentRate = plan.rate;
  const annualRepayment = Math.max(0, (annualIncome - threshold) * repaymentRate);
  const monthlyRepayment = annualRepayment / 12;

  let remainingBalance = loanBalance;
  let cumulativePaid = 0;
  let years = 0;
  let projectedIncome = annualIncome;
  const maxYears = plan.writeOffYears;

  while (remainingBalance > 0 && years < maxYears) {
    const interest = remainingBalance * interestRate;
    const yearlyRepayment = Math.max(0, (projectedIncome - threshold) * repaymentRate);
    const repaymentApplied = Math.min(yearlyRepayment, remainingBalance + interest);
    remainingBalance = remainingBalance + interest - repaymentApplied;
    cumulativePaid += repaymentApplied;
    years += 1;
    projectedIncome *= 1 + incomeGrowth;
    if (yearlyRepayment <= 0 && incomeGrowth === 0) {
      break;
    }
  }

  const cleared = remainingBalance <= 1;
  const writeOffYear = cleared ? null : maxYears;

  return {
    annualIncome,
    incomeGrowth,
    loanBalance,
    interestRate,
    plan,
    annualRepayment,
    monthlyRepayment,
    cumulativePaid,
    remainingBalance: Math.max(0, remainingBalance),
    yearsElapsed: years,
    cleared,
    writeOffYear,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Plan', results.plan.label],
    ['Annual income (£)', inputs.annualIncome],
    ['Income growth (%)', `${parseNumber(inputs.expectedIncomeGrowth)}%`],
    ['Loan balance (£)', inputs.loanBalance],
    ['Interest rate (%)', `${parseNumber(inputs.interestRate)}%`],
    [],
    ['Output', 'Value'],
    ['Monthly repayment (£)', currencyFormatter.format(results.monthlyRepayment)],
    ['Annual repayment (£)', currencyFormatter.format(results.annualRepayment)],
    ['Cumulative paid (£)', currencyFormatter.format(results.cumulativePaid)],
    ['Remaining balance (£)', currencyFormatter.format(results.remainingBalance)],
    [
      'Years until cleared/write-off',
      results.cleared
        ? `${results.yearsElapsed} years`
        : results.writeOffYear
          ? `${results.writeOffYear} years (write-off)`
          : `${results.yearsElapsed} years modelled`,
    ],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Remaining balance', value: results.remainingBalance, color: '#0ea5e9' },
    { name: 'Cumulative paid', value: results.cumulativePaid, color: '#22c55e' },
  ].filter((segment) => segment.value > 0);
};

export default function StudentLoanRepaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    annualIncome: '38,000',
    expectedIncomeGrowth: '2',
    loanBalance: '32,000',
    interestRate: '6.25',
    plan: 'plan2',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Student Loan Repayment Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Income & Tax Calculators', url: '/calculators#income-tax' },
      { name: 'Student Loan Repayment Calculator', url: pagePath },
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

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateStudentLoan(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      annualIncome: '38,000',
      expectedIncomeGrowth: '2',
      loanBalance: '32,000',
      interestRate: '6.25',
      plan: 'plan2',
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
        keywords={keywords}
        articleTags={keywords}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Student Loan Repayment Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Model monthly payments, lifetime repayments, and potential write-off dates for UK student
              loans.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-rose-600 dark:text-rose-300"
            borderColor="border-rose-200 dark:border-rose-800/60"
            bgColor="bg-rose-50/70 dark:bg-rose-900/40"
            textColor="text-rose-900 dark:text-rose-100"
            footerColor="text-rose-700 dark:text-rose-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PiggyBank className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Loan inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="plan">Repayment plan</Label>
                    <select
                      id="plan"
                      value={inputs.plan}
                      onChange={handleInputChange('plan')}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      {plans.map((plan) => (
                        <option key={plan.value} value={plan.value}>
                          {plan.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="annualIncome">Annual income (£)</Label>
                      <Input
                        id="annualIncome"
                        inputMode="decimal"
                        value={inputs.annualIncome}
                        onChange={handleInputChange('annualIncome')}
                        placeholder="e.g. 38,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedIncomeGrowth">Expected annual income growth (%)</Label>
                      <Input
                        id="expectedIncomeGrowth"
                        inputMode="decimal"
                        value={inputs.expectedIncomeGrowth}
                        onChange={handleInputChange('expectedIncomeGrowth')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loanBalance">Current loan balance (£)</Label>
                      <Input
                        id="loanBalance"
                        inputMode="decimal"
                        value={inputs.loanBalance}
                        onChange={handleInputChange('loanBalance')}
                        placeholder="e.g. 32,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest rate (%)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 6.25"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate repayments
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Choose your student loan plan and enter your salary and balance. Press
                    <span className="font-semibold"> Calculate repayments</span> to see your projected
                    payments and write-off date.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <GraduationCap className="h-5 w-5 text-rose-600 dark:text-rose-200" aria-hidden="true" />
                        Repayment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Monthly payment</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyRepayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Annual repayment</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualRepayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Cumulative paid</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.cumulativePaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Remaining balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.remainingBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Years to clear/write-off</p>
                        <p className="text-2xl font-semibold">
                          {results.cleared
                            ? `${results.yearsElapsed} years`
                            : results.writeOffYear
                              ? `${results.writeOffYear} years (write-off)`
                              : `${results.yearsElapsed} years modelled`}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="student-loan-results"
                          title="Student Loan Repayment Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Repayment notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Repayments are collected via PAYE when earnings exceed the threshold. Check your
                        payslip for the deduction line so you can match it against this projection.
                      </p>
                      <p>
                        Overpayments reduce the balance faster but cannot be reclaimed once the loan is written
                        off. Consider your interest rate and other financial priorities before making lump sums.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Balance vs repayments
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
                        <ResultBreakdownChart data={chartData} title="Student loan balance vs repayments" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        The Student Loans Company adjusts thresholds and interest rates annually. Re-run the
                        calculator after each announcement to keep your budget up to date.
                      </p>
                      <p>
                        If you work overseas, repayments must be arranged directly with the SLC. Contact them
                        to avoid arrears and estimate payments based on your overseas income.
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
