import React, { useCallback, useMemo, useState, Suspense } from 'react';
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  Wallet,
  Scale,
  Receipt,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/take-home-pay-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/take-home-pay-calculator';
const pageTitle = 'Take-Home Pay Calculator UK | Net Salary After Tax';
const metaDescription =
  'Estimate UK take-home pay by breaking down income tax, National Insurance, pension contributions, and student loan repayments.';
const keywords = getMappedKeywords('Take-Home Pay Calculator');

const faqItems = [
  {
    question: 'How is take-home pay calculated in the UK?',
    answer:
      'We start with gross salary plus bonuses, then deduct income tax, National Insurance, pension contributions, and student loan repayments using the latest PAYE thresholds.',
  },
  {
    question: 'Do pension contributions reduce my tax bill?',
    answer:
      'Salary sacrifice pension contributions reduce taxable and NI-able pay, which can increase take-home pay while boosting retirement savings. Adjust the percentage field to test different levels.',
  },
  {
    question: 'Which student loan plan should I choose?',
    answer:
      'Pick the plan that matches your course start date. Plan 1 is for older English/Welsh loans, Plan 2 for undergraduate loans after 2012, Plan 4 for Scottish borrowers, Plan 5 for 2023 starters, and the postgraduate plan applies in addition to other plans.',
  },
];

const emotionalMessage =
  'A clear payslip turns financial stress into confidence. Map each deduction, tweak contributions, and know exactly what lands in your bank each month.';
const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const studentLoanPlans = [
  { value: 'none', label: 'No student loan', threshold: Infinity, rate: 0 },
  { value: 'plan1', label: 'Plan 1', threshold: 24990, rate: 0.09 },
  { value: 'plan2', label: 'Plan 2', threshold: 27295, rate: 0.09 },
  { value: 'plan4', label: 'Plan 4 (Scotland)', threshold: 27660, rate: 0.09 },
  { value: 'plan5', label: 'Plan 5 (2023+ England & Wales)', threshold: 25000, rate: 0.09 },
  { value: 'postgrad', label: 'Postgraduate loan', threshold: 21000, rate: 0.06 },
];

const defaultInputs = {
  annualSalary: '48,000',
  pensionContributionPercent: '5',
  bonus: '3,000',
  studentLoanPlan: 'plan2',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;
const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_MAIN_RATE = 0.08;
const NI_UPPER_RATE = 0.02;

const calculateIncomeTax = (grossIncome) => {
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (grossIncome > 100000) {
    const reduction = Math.floor((grossIncome - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxable = Math.max(0, grossIncome - personalAllowance);
  let tax = 0;

  const basicBand = Math.min(taxable, Math.max(0, BASIC_RATE_LIMIT - personalAllowance));
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT)
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, personalAllowanceUsed: personalAllowance };
};

const calculateNI = (annualPay) => {
  const niBand1 = Math.max(0, Math.min(annualPay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD);
  const niBand2 = Math.max(0, annualPay - NI_UPPER_EARNINGS_LIMIT);
  return niBand1 * NI_MAIN_RATE + niBand2 * NI_UPPER_RATE;
};

const calculateStudentLoan = (annualPay, plan) => {
  if (!plan || !Number.isFinite(plan.threshold) || plan.threshold === Infinity) return 0;
  return Math.max(0, (annualPay - plan.threshold) * plan.rate);
};

const calculateTakeHome = (inputs) => {
  const salary = Math.max(parseNumber(inputs.annualSalary), 0);
  const bonus = Math.max(parseNumber(inputs.bonus), 0);
  const pensionPercent = Math.max(parseNumber(inputs.pensionContributionPercent), 0) / 100;

  const grossPay = salary + bonus;
  const pensionContribution = grossPay * pensionPercent;
  const taxablePay = Math.max(0, grossPay - pensionContribution);

  const { tax, personalAllowanceUsed } = calculateIncomeTax(taxablePay);
  const ni = calculateNI(taxablePay);
  const plan =
    studentLoanPlans.find((candidate) => candidate.value === inputs.studentLoanPlan) ||
    studentLoanPlans[0];
  const studentLoan = calculateStudentLoan(taxablePay, plan);

  const totalDeductions = tax + ni + pensionContribution + studentLoan;
  const takeHomeAnnual = grossPay - totalDeductions;
  const monthlyGross = grossPay / 12;
  const monthlyTakeHome = takeHomeAnnual / 12;
  const weeklyTakeHome = takeHomeAnnual / 52;

  return {
    grossPay,
    pensionContribution,
    taxablePay,
    tax,
    ni,
    studentLoan,
    totalDeductions,
    takeHomeAnnual,
    monthlyGross,
    monthlyTakeHome,
    weeklyTakeHome,
    effectiveTaxRate: grossPay > 0 ? (tax / grossPay) * 100 : 0,
    overallDeductionRate: grossPay > 0 ? (totalDeductions / grossPay) * 100 : 0,
    personalAllowanceUsed,
    studentLoanPlan: plan,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  return [
    ['Input', 'Value'],
    ['Annual salary (£)', inputs.annualSalary],
    ['Annual bonus (£)', inputs.bonus],
    ['Pension contribution (%)', inputs.pensionContributionPercent],
    ['Student loan plan', inputs.studentLoanPlan],
    [],
    ['Output', 'Value'],
    ['Gross pay (£)', currencyFormatter.format(results.grossPay)],
    ['Pension contribution (£)', currencyFormatter.format(results.pensionContribution)],
    ['Taxable pay (£)', currencyFormatter.format(results.taxablePay)],
    ['Income tax (£)', currencyFormatter.format(results.tax)],
    ['National Insurance (£)', currencyFormatter.format(results.ni)],
    ['Student loan (£)', currencyFormatter.format(results.studentLoan)],
    ['Total deductions (£)', currencyFormatter.format(results.totalDeductions)],
    ['Net annual pay (£)', currencyFormatter.format(results.takeHomeAnnual)],
    ['Net monthly pay (£)', currencyFormatter.format(results.monthlyTakeHome)],
    ['Net weekly pay (£)', currencyFormatter.format(results.weeklyTakeHome)],
    ['Effective tax rate (%)', `${percentFormatter.format(results.effectiveTaxRate)}%`],
    ['Overall deduction rate (%)', `${percentFormatter.format(results.overallDeductionRate)}%`],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Income tax', value: results.tax, color: '#ef4444' },
    { name: 'National Insurance', value: results.ni, color: '#22d3ee' },
    { name: 'Pension contribution', value: results.pensionContribution, color: '#6366f1' },
    { name: 'Student loan', value: results.studentLoan, color: '#f97316' },
    { name: 'Take-home pay', value: results.takeHomeAnnual, color: '#10b981' },
  ].filter((item) => item.value > 0);
};

export default function TakeHomePayCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Take-Home Pay Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Salary & Payslip Calculators', url: '/calculators#income' },
      { name: 'Take-Home Pay Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
      setHasCalculated(false);
      setResults(null);
      setCsvData(null);
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateTakeHome(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Take-Home Pay Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Break down PAYE deductions, pension choices, and student loan repayments to understand
              exactly how your gross salary converts into net income.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-900/40"
            textColor="text-emerald-900 dark:text-emerald-50"
            footerColor="text-emerald-700 dark:text-emerald-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <Card className="border border-emerald-200 bg-white dark:border-emerald-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Payslip inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="annualSalary">Annual salary (£)</Label>
                      <Input
                        id="annualSalary"
                        inputMode="decimal"
                        value={inputs.annualSalary}
                        onChange={handleInputChange('annualSalary')}
                        placeholder="e.g. 48,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonus">Annual bonus (£)</Label>
                      <Input
                        id="bonus"
                        inputMode="decimal"
                        value={inputs.bonus}
                        onChange={handleInputChange('bonus')}
                        placeholder="e.g. 3,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionContributionPercent">Pension via salary sacrifice (%)</Label>
                      <Input
                        id="pensionContributionPercent"
                        inputMode="decimal"
                        value={inputs.pensionContributionPercent}
                        onChange={handleInputChange('pensionContributionPercent')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentLoanPlan">Student loan plan</Label>
                      <select
                        id="studentLoanPlan"
                        value={inputs.studentLoanPlan}
                        onChange={handleInputChange('studentLoanPlan')}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
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
                      Calculate take-home pay
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
                    Enter your salary details and press
                    <span className="font-semibold"> Calculate take-home pay</span> to view the breakdown
                    of tax, NI, pension, and net pay.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Net income snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Monthly take-home</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyTakeHome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Annual take-home</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.takeHomeAnnual)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Weekly take-home</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyTakeHome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Overall deduction rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.overallDeductionRate)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Effective income tax rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.effectiveTaxRate)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="take-home-pay-calculation"
                          title="Take-Home Pay Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Scale className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Deduction breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Income tax</span>
                        <span>{currencyFormatter.format(results.tax)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>National Insurance</span>
                        <span>{currencyFormatter.format(results.ni)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Pension contribution</span>
                        <span>{currencyFormatter.format(results.pensionContribution)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Student loan</span>
                        <span>{currencyFormatter.format(results.studentLoan)}</span>
                      </div>
                      <div className="flex items-center justify-between font-medium text-slate-700 dark:text-slate-200">
                        <span>Total deductions</span>
                        <span>{currencyFormatter.format(results.totalDeductions)}</span>
                      </div>
                      <p>
                        Personal allowance used: {currencyFormatter.format(results.personalAllowanceUsed)}. Review
                        your tax code if this looks different from your payslip.
                      </p>
                      {results.studentLoanPlan?.value !== 'none' && (
                        <p>
                          Student loan plan: {results.studentLoanPlan.label}. Repayments only start once
                          taxable pay exceeds £{results.studentLoanPlan.threshold.toLocaleString('en-GB')}.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Pay composition
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
                        <ResultBreakdownChart data={chartData} title="Take-home pay vs deductions" />
                      </Suspense>
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
