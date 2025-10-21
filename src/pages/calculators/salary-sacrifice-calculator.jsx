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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Calculator,
  PiggyBank,
  Scissors,
  Coins,
  BarChart3,
  BookOpen,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/salary-sacrifice-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/salary-sacrifice-calculator';
const pageTitle = 'Salary Sacrifice Calculator UK | Pension & Net Pay Modeller';
const metaDescription =
  'Model UK salary sacrifice scenarios for pensions. Compare take-home pay before and after sacrificing salary, tax savings, and employer pension boosts.';
const keywords = getMappedKeywords('Salary Sacrifice Calculator');

const faqItems = [
  {
    question: 'Which benefits can run through salary sacrifice?',
    answer:
      'Common examples include pension contributions, cycle-to-work schemes, ultra-low emission vehicles, and childcare vouchers. This calculator focuses on pension sacrifice but the mechanics are similar for other approved benefits.',
  },
  {
    question: 'Will my take-home pay always increase?',
    answer:
      'Not always. Sacrificing salary reduces taxable income, but the pension contribution replaces part of your take-home pay. Compare the net pay change and the employer pension boost to decide the sweet spot for your budget.',
  },
  {
    question: 'How does salary sacrifice affect student loans?',
    answer:
      'Student loan deductions are based on post-sacrifice income, so repayments fall when you sacrifice pay. Toggle the student loan option and select the correct plan to quantify the change.',
  },
];

const emotionalMessage =
  'Turn pension top-ups into a powerful saving habit. By sacrificing salary today you keep more of your money working for future you, while trimming tax and National Insurance.';
const emotionalQuote = {
  text: 'The best investment you can make is an investment in yourself.',
  author: 'Warren Buffett',
};

const directoryLinks = [
  {
    url: '/#income-tax',
    label: 'Browse salary & tax calculators',
    description: 'Understand PAYE, NI, and allowances across every pay scenario.',
  },
  {
    url: '/calculators/take-home-pay-calculator',
    label: 'Take-Home Pay Calculator',
    description: 'Estimate net pay after income tax, National Insurance, and pensions.',
  },
  {
    url: '/calculators/pension-calculator',
    label: 'Pension Calculator',
    description: 'Project retirement income using your boosted pension contributions.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

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

const ALLOWANCE_TAPER_START = 100000;
const ALLOWANCE_TAPER_END = 125140;

const STUDENT_LOAN_THRESHOLDS = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31989, rate: 0.09 },
  postgraduate: { threshold: 21000, rate: 0.06 },
};

const defaultInputs = {
  grossSalary: '52,000',
  sacrificeValue: '8',
  sacrificeType: 'percentage',
  employerMatch: '4',
  studentLoan: true,
  planType: 'plan2',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateTax = (income) => {
  let remaining = income;
  let tax = 0;
  TAX_BANDS.forEach((band) => {
    if (remaining <= 0) return;
    const taxableSlice = Math.min(remaining, band.max - band.min);
    tax += taxableSlice * band.rate;
    remaining -= taxableSlice;
  });
  return Math.max(tax, 0);
};

const calculateNI = (income) => {
  let remaining = income;
  let contributions = 0;
  NI_BANDS.forEach((band) => {
    if (remaining <= 0) return;
    const taxableSlice = Math.min(remaining, band.max - band.min);
    contributions += taxableSlice * band.rate;
    remaining -= taxableSlice;
  });
  return Math.max(contributions, 0);
};

const calculatePersonalAllowance = (income) => {
  const baseAllowance = 12570;
  if (income <= ALLOWANCE_TAPER_START) return baseAllowance;
  if (income >= ALLOWANCE_TAPER_END) return 0;
  const reduction = Math.floor((income - ALLOWANCE_TAPER_START) / 2);
  return Math.max(baseAllowance - reduction, 0);
};

const calculateStudentLoan = (income, plan, enabled) => {
  if (!enabled) return 0;
  const rule = STUDENT_LOAN_THRESHOLDS[plan] || STUDENT_LOAN_THRESHOLDS.plan2;
  if (income <= rule.threshold) return 0;
  return (income - rule.threshold) * rule.rate;
};

const calculateScenario = ({
  grossSalary,
  sacrificeValue,
  sacrificeType,
  employerMatch,
  studentLoan,
  planType,
}) => {
  const salary = Math.max(grossSalary, 0);
  const sacrificeAmount =
    sacrificeType === 'percentage'
      ? salary * Math.max(sacrificeValue, 0) / 100
      : Math.max(sacrificeValue, 0);

  const sacrificedSalary = Math.max(salary - sacrificeAmount, 0);
  const allowance = calculatePersonalAllowance(sacrificedSalary);
  const taxableIncome = Math.max(sacrificedSalary - allowance, 0);

  const incomeTax = calculateTax(sacrificedSalary) - calculateTax(allowance);
  const employeeNI = calculateNI(sacrificedSalary);
  const studentLoanDeduction = calculateStudentLoan(
    sacrificedSalary,
    planType,
    studentLoan
  );

  const netIncome = sacrificedSalary - incomeTax - employeeNI - studentLoanDeduction;
  const employerContribution =
    salary * Math.max(employerMatch, 0) / 100 + sacrificeAmount;

  return {
    salary,
    sacrificeAmount,
    sacrificedSalary,
    taxableIncome,
    incomeTax,
    employeeNI,
    studentLoanDeduction,
    netIncome,
    employerContribution,
  };
};

const calculateSalarySacrifice = (inputs) => {
  const before = calculateScenario({
    grossSalary: inputs.grossSalary,
    sacrificeValue: 0,
    sacrificeType: 'amount',
    employerMatch: inputs.employerMatch,
    studentLoan: inputs.studentLoan,
    planType: inputs.planType,
  });

  const after = calculateScenario(inputs);

  const netGain = after.netIncome - before.netIncome;
  const pensionBoost = after.employerContribution - before.employerContribution;
  const totalTaxBefore = before.incomeTax + before.employeeNI;
  const totalTaxAfter = after.incomeTax + after.employeeNI;

  return {
    before,
    after,
    netGain,
    pensionBoost,
    taxSavings: totalTaxBefore - totalTaxAfter,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  return [
    ['Input', 'Value'],
    ['Gross salary (£)', inputs.grossSalary],
    ['Sacrifice type', inputs.sacrificeType],
    ['Sacrifice amount',
      inputs.sacrificeType === 'percentage'
        ? `${inputs.sacrificeValue}%`
        : currencyFormatter.format(parseNumber(inputs.sacrificeValue))],
    ['Employer match (%)', inputs.employerMatch],
    ['Student loan plan', inputs.studentLoan ? inputs.planType : 'None'],
    [],
    ['Before sacrifice', ''],
    ['Net income (£)', currencyFormatter.format(results.before.netIncome)],
    ['Income tax (£)', currencyFormatter.format(results.before.incomeTax)],
    ['National Insurance (£)', currencyFormatter.format(results.before.employeeNI)],
    ['Employer pension (£)', currencyFormatter.format(results.before.employerContribution)],
    [],
    ['After sacrifice', ''],
    ['Net income (£)', currencyFormatter.format(results.after.netIncome)],
    ['Income tax (£)', currencyFormatter.format(results.after.incomeTax)],
    ['National Insurance (£)', currencyFormatter.format(results.after.employeeNI)],
    ['Student loan (£)', currencyFormatter.format(results.after.studentLoanDeduction)],
    ['Employer pension (£)', currencyFormatter.format(results.after.employerContribution)],
    [],
    ['Net pay change (£)', currencyFormatter.format(results.netGain)],
    ['Pension boost (£)', currencyFormatter.format(results.pensionBoost)],
    ['Tax & NI saved (£)', currencyFormatter.format(results.taxSavings)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    {
      name: 'Take-home pay',
      value: Math.max(results.after.netIncome, 0),
      color: '#10b981',
    },
    {
      name: 'Income tax',
      value: Math.max(results.after.incomeTax, 0),
      color: '#6366f1',
    },
    {
      name: 'National Insurance',
      value: Math.max(results.after.employeeNI, 0),
      color: '#f97316',
    },
    {
      name: 'Student loan',
      value: Math.max(results.after.studentLoanDeduction, 0),
      color: '#ef4444',
    },
    {
      name: 'Employer pension',
      value: Math.max(results.after.employerContribution, 0),
      color: '#0ea5e9',
    },
  ].filter((segment) => segment.value > 0);
};

export default function SalarySacrificeCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Salary Sacrifice Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Salary & Tax Calculators', url: '/calculators#income-tax' },
      { name: 'Salary Sacrifice Calculator', url: pagePath },
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

  const handleCheckboxToggle = useCallback((checked) => {
    setInputs((prev) => ({ ...prev, studentLoan: Boolean(checked) }));
  }, []);

  const handlePlanChange = useCallback((event) => {
    const { value } = event.target;
    setInputs((prev) => ({ ...prev, planType: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const parsed = {
        grossSalary: parseNumber(inputs.grossSalary),
        sacrificeValue: parseNumber(inputs.sacrificeValue),
        sacrificeType: inputs.sacrificeType,
        employerMatch: parseNumber(inputs.employerMatch),
        studentLoan: Boolean(inputs.studentLoan),
        planType: inputs.planType,
      };
      const computed = calculateSalarySacrifice(parsed);
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
                Salary Sacrifice Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare your take-home pay before and after pension salary sacrifice, see tax and
              National Insurance savings, and quantify the employer pension boost.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-900/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scissors className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Salary sacrifice inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="grossSalary">Gross annual salary (£)</Label>
                      <Input
                        id="grossSalary"
                        inputMode="decimal"
                        value={inputs.grossSalary}
                        onChange={handleInputChange('grossSalary')}
                        placeholder="e.g. 52,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employerMatch">Employer pension match (%)</Label>
                      <Input
                        id="employerMatch"
                        inputMode="decimal"
                        value={inputs.employerMatch}
                        onChange={handleInputChange('employerMatch')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Sacrifice type</Label>
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant={inputs.sacrificeType === 'percentage' ? 'default' : 'outline'}
                          onClick={() => setInputs((prev) => ({ ...prev, sacrificeType: 'percentage' }))}
                        >
                          %
                        </Button>
                        <Button
                          type="button"
                          variant={inputs.sacrificeType === 'amount' ? 'default' : 'outline'}
                          onClick={() => setInputs((prev) => ({ ...prev, sacrificeType: 'amount' }))}
                        >
                          £
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sacrificeValue">
                        {inputs.sacrificeType === 'percentage' ? 'Sacrifice percentage (%)' : 'Sacrifice amount (£)'}
                      </Label>
                      <Input
                        id="sacrificeValue"
                        inputMode="decimal"
                        value={inputs.sacrificeValue}
                        onChange={handleInputChange('sacrificeValue')}
                        placeholder={inputs.sacrificeType === 'percentage' ? 'e.g. 8' : 'e.g. 4,000'}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studentLoan">Student loan deductions</Label>
                    <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/30">
                      <Checkbox id="studentLoan" checked={inputs.studentLoan} onCheckedChange={handleCheckboxToggle} />
                      <Label htmlFor="studentLoan" className="text-sm">
                        Include student loan repayments in the calculation
                      </Label>
                    </div>
                    <select
                      value={inputs.planType}
                      onChange={handlePlanChange}
                      disabled={!inputs.studentLoan}
                      className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                    >
                      <option value="plan1">Plan 1 (pre-2012 England/Wales)</option>
                      <option value="plan2">Plan 2 (post-2012 England/Wales)</option>
                      <option value="plan4">Plan 4 (Scotland)</option>
                      <option value="postgraduate">Postgraduate loan</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate salary sacrifice
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
                    Enter your salary, sacrifice level, and employer match, then press
                    <span className="font-semibold"> Calculate salary sacrifice</span> to see net pay
                    changes and pension boosts.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Net pay comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Take-home before</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.before.netIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Take-home after</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.after.netIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Net pay change</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netGain)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Tax & NI saved</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.taxSavings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Pension boost</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionBoost)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="salary-sacrifice-results"
                          title="Salary Sacrifice Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        After-sacrifice breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Salary sacrificed</span>
                        <span>{currencyFormatter.format(results.after.sacrificeAmount)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Taxable income</span>
                        <span>{currencyFormatter.format(results.after.taxableIncome)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Income tax</span>
                        <span>{currencyFormatter.format(results.after.incomeTax)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>National Insurance</span>
                        <span>{currencyFormatter.format(results.after.employeeNI)}</span>
                      </div>
                      {results.after.studentLoanDeduction > 0 && (
                        <div className="flex items-center justify-between">
                          <span>Student loan</span>
                          <span>{currencyFormatter.format(results.after.studentLoanDeduction)}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Pay allocation visual
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
                        <ResultBreakdownChart data={chartData} title="After sacrifice pay distribution" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Confirm with HR whether the scheme is true salary sacrifice. Relief at source
                        pensions deduct contributions after tax and NI, which changes the net pay impact.
                      </p>
                      <p>
                        Check how lenders or benefit providers view sacrificed salary. Some use pre-sacrifice
                        income while others use the reduced figure for affordability tests.
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
