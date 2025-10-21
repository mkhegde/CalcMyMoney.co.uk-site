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
import { Calculator, ClipboardList, PiggyBank, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/ni-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/ni-calculator';
const pageTitle = 'NI Calculator UK | National Insurance Contributions';
const metaDescription =
  'Use our UK NI calculator to estimate National Insurance contributions, compare scenarios for salary sacrifice, and plan deductions with this national insurance calculator.';
const keywords = getMappedKeywords('NI Calculator');

const faqItems = [
  {
    question: 'How is National Insurance calculated?',
    answer:
      'Class 1 NI is charged on earnings above the primary threshold. The calculator applies the 2025/26 UK thresholds and rates to show annual, monthly, and weekly NI.',
  },
  {
    question: 'Do pension contributions reduce NI?',
    answer:
      'Salary sacrifice pension contributions reduce NI because they lower gross pay. Personal contributions do not. Use the input to see how much NI you save with salary sacrifice.',
  },
  {
    question: 'Does the ni calculator include employer NI?',
    answer:
      'This tool focuses on employee National Insurance. Employers pay additional Class 1 NI which is not deducted from take-home pay.',
  },
];

const emotionalMessage =
  'Understanding your National Insurance contributions is key to managing your take-home pay. Use this calculator to gain clarity and plan your finances effectively.';
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
    url: '/national-insurance-calculator',
    label: 'National Insurance Calculator',
    description: 'Estimate NI contributions and see the impact on your take-home pay.',
  },
  {
    url: '/take-home-pay-calculator',
    label: 'Take-Home Pay Calculator',
    description:
      'Understand the impact of pension, benefits, and salary sacrifice on take-home pay.',
  },
];

const NI_BANDS = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 0.12 },
  { min: 50270, max: Infinity, rate: 0.02 },
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

const calculateNi = ({ salary, pensionPercent, salarySacrifice }) => {
  const pensionDeduction = salarySacrifice
    ? parseNumber(salary) * (parseNumber(pensionPercent) / 100)
    : 0;
  const niSalary = Math.max(0, parseNumber(salary) - pensionDeduction);

  let remaining = niSalary;
  let totalNi = 0;
  NI_BANDS.forEach((band) => {
    if (remaining <= 0) return;
    const taxable = Math.min(remaining, band.max - band.min);
    totalNi += taxable * band.rate;
    remaining -= taxable;
  });

  return {
    niSalary,
    pensionDeduction,
    annualNi: totalNi,
    monthlyNi: totalNi / 12,
    weeklyNi: totalNi / 52,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Gross Annual Salary (£)', currencyFormatter.format(parseNumber(inputs.salary))],
    ['Pension Contribution (Salary Sacrifice) (%)', `${inputs.pensionPercent}%`],
    ['Apply Salary Sacrifice', inputs.salarySacrifice ? 'Yes' : 'No'],
    [],
    ['Taxable Pay for NI (£)', currencyFormatter.format(results.niSalary)],
    ['Annual NI (£)', currencyFormatter.format(results.annualNi)],
    ['Monthly NI (£)', currencyFormatter.format(results.monthlyNi)],
    ['Weekly NI (£)', currencyFormatter.format(results.weeklyNi)],
    [
      'Pension Deduction (Salary Sacrifice) (£)',
      currencyFormatter.format(results.pensionDeduction),
    ],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Employee NI', value: results.annualNi, color: '#3b82f6' },
    { name: 'Pension Deduction', value: results.pensionDeduction, color: '#10b981' },
  ].filter((segment) => segment.value > 0);
}

export default function NiCalculatorPage() {
  const [inputs, setInputs] = useState({
    salary: '48,000',
    pensionPercent: '5',
    salarySacrifice: true,
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'NI Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'NI Calculator', url: pagePath },
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

  const handleSalarySacrificeToggle = useCallback(() => {
    setInputs((prev) => ({ ...prev, salarySacrifice: !prev.salarySacrifice }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedResults = calculateNi(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      salary: '48,000',
      pensionPercent: '5',
      salarySacrifice: true,
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                NI Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate your UK employee National Insurance deductions, see the impact of salary
              sacrifice, and understand how NI affects take-home pay.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-blue-600 dark:text-blue-300"
            borderColor="border-blue-200 dark:border-blue-800/60"
            bgColor="bg-blue-50/70 dark:bg-blue-950/40"
            textColor="text-blue-900 dark:text-blue-100"
            footerColor="text-blue-700 dark:text-blue-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-blue-600 dark:text-blue-300"
                    aria-hidden="true"
                  />
                  Salary & Contribution Inputs
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
                        placeholder="e.g. 48,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionPercent">
                        Pension contribution (salary sacrifice) (%)
                      </Label>
                      <Input
                        id="pensionPercent"
                        inputMode="decimal"
                        value={inputs.pensionPercent}
                        onChange={handleInputChange('pensionPercent')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salarySacrifice">Apply salary sacrifice</Label>
                      <Button
                        type="button"
                        variant={inputs.salarySacrifice ? 'default' : 'outline'}
                        onClick={handleSalarySacrificeToggle}
                        className="w-full"
                      >
                        {inputs.salarySacrifice ? 'Included' : 'Excluded'}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate NI
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
                    Enter your gross annual salary and pension contribution, then press{' '}
                    <span className="font-semibold">Calculate NI</span> to see your estimated
                    National Insurance contributions.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-blue-600 dark:text-blue-200"
                          aria-hidden="true"
                        />
                        National Insurance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          Taxable pay for NI
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.niSalary)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Annual NI</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualNi)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Monthly NI</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyNi)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Weekly NI</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyNi)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">
                          Pension Deduction (Salary Sacrifice)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionDeduction)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="ni-contributions"
                          title="NI Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-blue-600 dark:text-blue-300"
                          aria-hidden="true"
                        />
                        Contribution Breakdown
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
                        <ResultBreakdownChart
                          data={chartData}
                          title="National Insurance Breakdown"
                        />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-blue-600 dark:text-blue-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        The National Insurance thresholds and rates used in this calculator are
                        examples. Always check the{' '}
                        <a
                          href="https://www.gov.uk/national-insurance-rates-bands"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline dark:text-blue-400"
                        >
                          official UK government website
                        </a>{' '}
                        for the most current rates and thresholds.
                      </p>
                      <p>
                        This calculator provides an estimate for Class 1 employee contributions.
                        Your actual contributions may vary based on your specific employment
                        circumstances and any additional benefits.
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
