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
  Receipt,
  FileWarning,
  CheckCircle,
  PieChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/tax-refund-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/tax-refund-calculator';
const pageTitle = 'Tax Refund Calculator UK | Estimate PAYE Rebates';
const metaDescription =
  'Estimate potential HMRC tax refunds by comparing PAYE tax paid with expected liability and allowable expenses.';
const keywords = getMappedKeywords('Tax Refund Calculator');

const faqItems = [
  {
    question: 'When might I receive a PAYE tax refund?',
    answer:
      'Refunds are common after emergency tax codes, leaving a job mid-year, receiving backdated pay, or claiming allowable expenses that reduce your taxable income.',
  },
  {
    question: 'What is a P800 tax calculation?',
    answer:
      'HMRC issues a P800 to show whether you overpaid or underpaid tax. If it shows a refund, HMRC may send it automatically or invite you to claim online. Use this calculator to anticipate the amount.',
  },
  {
    question: 'How can I strengthen a refund claim?',
    answer:
      'Keep payslips, P60s, and receipts for expenses such as professional fees or uniforms. If the calculator shows a refund, use these documents when submitting your claim through HMRC.',
  },
];

const emotionalMessage =
  'Overpaying tax means lending HMRC your hard-earned money interest free. Spot the mismatch, file the claim, and put those pounds back to work for you.';
const emotionalQuote = {
  text: 'A penny saved is a penny earned.',
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

const defaultInputs = {
  yearToDatePay: '32,000',
  yearToDateTaxPaid: '5,200',
  expectedAnnualSalary: '42,000',
  monthsWorked: '9',
  personalAllowance: '12,570',
  allowableExpenses: '500',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const PERSONAL_ALLOWANCE_DEFAULT = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const annualTax = (income, personalAllowanceInput) => {
  const baseAllowance = personalAllowanceInput || PERSONAL_ALLOWANCE_DEFAULT;
  let allowance = baseAllowance;
  if (income > 100000) {
    const reduction = Math.floor((income - 100000) / 2);
    allowance = Math.max(0, baseAllowance - reduction);
  }
  const taxable = Math.max(0, income - allowance);
  let tax = 0;
  const basicBand = Math.min(taxable, Math.max(0, BASIC_RATE_LIMIT - allowance));
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT)
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, allowanceUsed: allowance };
};

const calculateRefund = (inputs) => {
  const yearToDatePay = Math.max(parseNumber(inputs.yearToDatePay), 0);
  const yearToDateTaxPaid = Math.max(parseNumber(inputs.yearToDateTaxPaid), 0);
  const expectedAnnualSalary = Math.max(parseNumber(inputs.expectedAnnualSalary), 0);
  const monthsWorked = Math.min(12, Math.max(1, parseNumber(inputs.monthsWorked)));
  const personalAllowance = Math.max(parseNumber(inputs.personalAllowance), 0) || PERSONAL_ALLOWANCE_DEFAULT;
  const allowableExpenses = Math.max(parseNumber(inputs.allowableExpenses), 0);

  const adjustedAnnualIncome = Math.max(0, expectedAnnualSalary - allowableExpenses);
  const { tax: annualTaxDue, allowanceUsed } = annualTax(adjustedAnnualIncome, personalAllowance);
  const expectedTaxToDate = (annualTaxDue * monthsWorked) / 12;

  const overpayment = Math.max(0, yearToDateTaxPaid - expectedTaxToDate);
  const underpayment = Math.max(0, expectedTaxToDate - yearToDateTaxPaid);
  const refundLikelihood = overpayment > 0 ? 'Likely refund' : underpayment > 0 ? 'Likely underpayment' : 'On track';

  const potentialRefundTriggers = [
    yearToDateTaxPaid > expectedTaxToDate
      ? 'Tax deducted at source exceeds PAYE for the year to date.'
      : null,
    allowableExpenses > 0 ? 'Allowable expenses reduce taxable income.' : null,
    expectedAnnualSalary < (monthsWorked > 0 ? (yearToDatePay * 12) / monthsWorked : expectedAnnualSalary)
      ? 'Income earlier in the year was higher than the annual salary projection.'
      : null,
  ].filter(Boolean);

  return {
    yearToDatePay,
    yearToDateTaxPaid,
    expectedAnnualSalary,
    monthsWorked,
    personalAllowance,
    allowableExpenses,
    annualTaxDue,
    expectedTaxToDate,
    overpayment,
    underpayment,
    refundLikelihood,
    potentialRefundTriggers,
    allowanceUsed,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  const rows = [
    ['Input', 'Value'],
    ['Pay received to date (£)', inputs.yearToDatePay],
    ['Tax paid to date (£)', inputs.yearToDateTaxPaid],
    ['Expected annual salary (£)', inputs.expectedAnnualSalary],
    ['Months worked', inputs.monthsWorked],
    ['Personal allowance (£)', inputs.personalAllowance],
    ['Allowable expenses (£)', inputs.allowableExpenses],
    [],
    ['Output', 'Value'],
    ['Expected tax to date (£)', currencyFormatter.format(results.expectedTaxToDate)],
    ['Tax paid to date (£)', currencyFormatter.format(results.yearToDateTaxPaid)],
    ['Potential refund (£)', currencyFormatter.format(results.overpayment)],
    ['Potential underpayment (£)', currencyFormatter.format(results.underpayment)],
    ['Projected annual tax (£)', currencyFormatter.format(results.annualTaxDue)],
    ['Refund likelihood', results.refundLikelihood],
  ];

  if (results.potentialRefundTriggers.length) {
    rows.push([], ['Potential refund triggers']);
    results.potentialRefundTriggers.forEach((trigger) => rows.push([trigger]));
  }

  return rows;
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Tax paid year to date', value: results.yearToDateTaxPaid, color: '#0ea5e9' },
    { name: 'Expected tax year to date', value: results.expectedTaxToDate, color: '#6366f1' },
    { name: 'Potential refund', value: results.overpayment, color: '#10b981' },
  ].filter((item) => item.value > 0);
};

export default function TaxRefundCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Tax Refund Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Salary & Tax Calculators', url: '/calculators#income' },
      { name: 'Tax Refund Calculator', url: pagePath },
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
      const computed = calculateRefund(inputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Tax Refund Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare PAYE tax deducted with the expected liability for your annual salary, taking
              into account personal allowance adjustments and allowable expenses.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Receipt className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-sky-600 dark:text-sky-300"
            borderColor="border-sky-200 dark:border-sky-800/60"
            bgColor="bg-sky-50/70 dark:bg-sky-900/40"
            textColor="text-sky-900 dark:text-sky-50"
            footerColor="text-sky-700 dark:text-sky-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <Card className="border border-sky-200 bg-white dark:border-sky-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileWarning className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  PAYE details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="yearToDatePay">Pay received this tax year (£)</Label>
                      <Input
                        id="yearToDatePay"
                        inputMode="decimal"
                        value={inputs.yearToDatePay}
                        onChange={handleInputChange('yearToDatePay')}
                        placeholder="e.g. 32,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearToDateTaxPaid">Tax deducted this tax year (£)</Label>
                      <Input
                        id="yearToDateTaxPaid"
                        inputMode="decimal"
                        value={inputs.yearToDateTaxPaid}
                        onChange={handleInputChange('yearToDateTaxPaid')}
                        placeholder="e.g. 5,200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expectedAnnualSalary">Expected annual salary (£)</Label>
                      <Input
                        id="expectedAnnualSalary"
                        inputMode="decimal"
                        value={inputs.expectedAnnualSalary}
                        onChange={handleInputChange('expectedAnnualSalary')}
                        placeholder="e.g. 42,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthsWorked">Months worked so far</Label>
                      <Input
                        id="monthsWorked"
                        inputMode="decimal"
                        value={inputs.monthsWorked}
                        onChange={handleInputChange('monthsWorked')}
                        placeholder="e.g. 9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="personalAllowance">Personal allowance (£)</Label>
                      <Input
                        id="personalAllowance"
                        inputMode="decimal"
                        value={inputs.personalAllowance}
                        onChange={handleInputChange('personalAllowance')}
                        placeholder="e.g. 12,570"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowableExpenses">Allowable expenses (£)</Label>
                      <Input
                        id="allowableExpenses"
                        inputMode="decimal"
                        value={inputs.allowableExpenses}
                        onChange={handleInputChange('allowableExpenses')}
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate potential refund
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
                    Add your payslip figures and press
                    <span className="font-semibold"> Calculate potential refund</span> to compare tax paid
                    against expected liability.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-sky-200 bg-white shadow-sm dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <CheckCircle className="h-5 w-5 text-sky-600 dark:text-sky-200" aria-hidden="true" />
                        Refund overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Expected tax to date</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.expectedTaxToDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Tax paid to date</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.yearToDateTaxPaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Potential refund</p>
                        <p className="text-2xl font-semibold text-emerald-500">
                          {currencyFormatter.format(results.overpayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Potential underpayment</p>
                        <p className="text-2xl font-semibold text-rose-500">
                          {currencyFormatter.format(results.underpayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Refund likelihood</p>
                        <p className="text-lg font-semibold">{results.refundLikelihood}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="tax-refund-calculation"
                          title="Tax Refund Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Receipt className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Allowances & triggers
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Personal allowance used</span>
                        <span>{currencyFormatter.format(results.allowanceUsed)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Projected annual tax</span>
                        <span>{currencyFormatter.format(results.annualTaxDue)}</span>
                      </div>
                      {results.potentialRefundTriggers.length > 0 ? (
                        <div>
                          <p className="font-medium text-slate-700 dark:text-slate-200">Potential refund triggers</p>
                          <ul className="mt-2 list-disc space-y-1 pl-5">
                            {results.potentialRefundTriggers.map((trigger, index) => (
                              <li key={`${trigger}-${index}`}>{trigger}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p>
                          No obvious triggers detected—double-check your tax code and expenses before
                          submitting a claim.
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Tax comparison
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
                        <ResultBreakdownChart data={chartData} title="Tax paid vs expected" />
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
