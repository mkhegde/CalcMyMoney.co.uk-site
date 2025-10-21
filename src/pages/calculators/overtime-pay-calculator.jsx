// src/pages/calculators/overtime-pay-calculator.jsx
import React, { useState, useMemo, useCallback, Suspense } from 'react';
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
  Clock,
  PoundSterling,
  PiggyBank,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/overtime-pay-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/overtime-pay-calculator';
const pageTitle = 'Overtime Pay Calculator UK | Calculate Extra Earnings';
const metaDescription =
  'Use our UK overtime pay calculator to estimate extra earnings from overtime hours, understand overtime rules, and project gross vs net pay.';
const keywords = getMappedKeywords('Overtime Pay Calculator');

const faqItems = [
  {
    question: 'How do I calculate overtime pay in the UK?',
    answer:
      'Start with your standard hourly rate, multiply any overtime hours by the agreed overtime multiplier (often 1.5 for time and a half), and add that to your regular pay. Deduct tax and National Insurance as needed to estimate take-home pay.',
  },
  {
    question: 'Does overtime affect my pension or bonuses?',
    answer:
      'It depends on your employment contract. Some employers include overtime in pensionable earnings, while others do not. Check the terms of your pension scheme and employment agreement.',
  },
  {
    question: 'What if I work different overtime rates in the same week?',
    answer:
      'Split the overtime hours by multiplier (e.g., standard overtime vs double time) and run each amount through the calculator separately. Add the totals to see your overall overtime earnings.',
  },
];

const emotionalMessage =
  'Your extra effort deserves clear recognition. Use this calculator to accurately track your overtime earnings and ensure every hour worked is accounted for in your take-home pay.';
const emotionalQuote = {
  text: 'The future depends on what you do today.',
  author: 'Mahatma Gandhi',
};

const directoryLinks = [
  {
    url: '/#tax-income',
    label: 'Explore all tax & income calculators',
    description:
      'Understand deductions, take-home pay, and tax liabilities on every type of income.',
  },
  {
    url: '/overtime-bonus-calculator',
    label: 'Overtime & Bonus Calculator',
    description: 'Estimate extra earnings from overtime shifts and bonuses.',
  },
  {
    url: '/salary-calculator',
    label: 'Salary Calculator',
    description: 'Estimate your gross and net pay based on your annual salary.',
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

const calculateOvertimePay = ({
  hourlyRate,
  regularHours,
  overtimeHours,
  overtimeMultiplier,
  taxRate,
  niRate,
}) => {
  const parsedHourlyRate = parseNumber(hourlyRate);
  const parsedRegularHours = parseNumber(regularHours);
  const parsedOvertimeHours = parseNumber(overtimeHours);
  const parsedOvertimeMultiplier = parseNumber(overtimeMultiplier);
  const parsedTaxRate = parseNumber(taxRate);
  const parsedNiRate = parseNumber(niRate);

  const regularPay = parsedHourlyRate * parsedRegularHours;
  const overtimeRate = parsedHourlyRate * parsedOvertimeMultiplier;
  const overtimePay = overtimeRate * parsedOvertimeHours;
  const grossPay = regularPay + overtimePay;

  const tax = grossPay * (parsedTaxRate / 100);
  const nationalInsurance = grossPay * (parsedNiRate / 100);
  const deductions = tax + nationalInsurance;
  const netPay = grossPay - deductions;

  return {
    overtimeRate,
    regularPay,
    overtimePay,
    grossPay,
    tax,
    nationalInsurance,
    deductions,
    netPay,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Hourly Rate (£)', currencyFormatter.format(parseNumber(inputs.hourlyRate))],
    ['Regular Hours This Pay Period', inputs.regularHours],
    ['Overtime Hours', inputs.overtimeHours],
    ['Overtime Multiplier (x)', inputs.overtimeMultiplier],
    ['Tax Rate (%)', `${inputs.taxRate}%`],
    ['NI Rate (%)', `${inputs.niRate}%`],
    [],
    ['Overtime Rate (£)', currencyFormatter.format(results.overtimeRate)],
    ['Overtime Pay (£)', currencyFormatter.format(results.overtimePay)],
    ['Regular Pay (£)', currencyFormatter.format(results.regularPay)],
    ['Gross Pay (£)', currencyFormatter.format(results.grossPay)],
    ['Income Tax (£)', currencyFormatter.format(results.tax)],
    ['National Insurance (£)', currencyFormatter.format(results.nationalInsurance)],
    ['Total Deductions (£)', currencyFormatter.format(results.deductions)],
    ['Net Pay (£)', currencyFormatter.format(results.netPay)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Regular Pay', value: results.regularPay, color: '#10b981' },
    { name: 'Overtime Pay', value: results.overtimePay, color: '#3b82f6' },
    { name: 'Income Tax', value: results.tax, color: '#f97316' },
    { name: 'National Insurance', value: results.nationalInsurance, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function OvertimePayCalculatorPage() {
  const [inputs, setInputs] = useState({
    hourlyRate: '18.00',
    regularHours: '37.5',
    overtimeHours: '6',
    overtimeMultiplier: '1.5',
    taxRate: '20',
    niRate: '12',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Overtime Pay Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'Overtime Pay Calculator', url: pagePath },
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
      const computedResults = calculateOvertimePay(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      hourlyRate: '18.00',
      regularHours: '37.5',
      overtimeHours: '6',
      overtimeMultiplier: '1.5',
      taxRate: '20',
      niRate: '12',
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
                Overtime Pay Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate your overtime earnings, understand overtime rules, and estimate gross vs net
              pay in line with UK employer obligations.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Clock className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  Pay Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly rate (£)</Label>
                      <Input
                        id="hourlyRate"
                        inputMode="decimal"
                        value={inputs.hourlyRate}
                        onChange={handleInputChange('hourlyRate')}
                        placeholder="e.g. 18.00"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="regularHours">Regular hours this pay period</Label>
                      <Input
                        id="regularHours"
                        inputMode="decimal"
                        value={inputs.regularHours}
                        onChange={handleInputChange('regularHours')}
                        placeholder="e.g. 37.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeHours">Overtime hours</Label>
                      <Input
                        id="overtimeHours"
                        inputMode="decimal"
                        value={inputs.overtimeHours}
                        onChange={handleInputChange('overtimeHours')}
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeMultiplier">Overtime multiplier (x)</Label>
                      <Input
                        id="overtimeMultiplier"
                        inputMode="decimal"
                        value={inputs.overtimeMultiplier}
                        onChange={handleInputChange('overtimeMultiplier')}
                        placeholder="e.g. 1.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax rate (%)</Label>
                      <Input
                        id="taxRate"
                        inputMode="decimal"
                        value={inputs.taxRate}
                        onChange={handleInputChange('taxRate')}
                        placeholder="e.g. 20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="niRate">NI rate (%)</Label>
                      <Input
                        id="niRate"
                        inputMode="decimal"
                        value={inputs.niRate}
                        onChange={handleInputChange('niRate')}
                        placeholder="e.g. 12"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Overtime Pay
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
                    Enter your hourly rate, hours, and tax details, then press{' '}
                    <span className="font-semibold">Calculate Overtime Pay</span> to see your
                    estimated gross and net earnings.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PoundSterling
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Overtime Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Overtime rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.overtimeRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Overtime pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.overtimePay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Regular pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.regularPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Gross pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Income tax</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.tax)}
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
                          Total deductions
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.deductions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Net pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netPay)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="overtime-pay-earnings"
                          title="Overtime Pay Calculator Results"
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
                        Pay Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Overtime Pay Breakdown" />
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
                        The tax and National Insurance rates used in this calculator are simplified
                        examples. Your actual deductions may vary based on your full tax code, NI
                        category, and any other deductions or allowances.
                      </p>
                      <p>
                        Always check your payslip for accurate figures and consult with a financial
                        advisor for personalized tax planning.
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
