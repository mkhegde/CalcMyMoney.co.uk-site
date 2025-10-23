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
import { Calculator, Clock, BadgePercent, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/pro-rata-salary-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/pro-rata-salary-calculator';
const pageTitle = 'Pro Rata Salary Calculator UK | Part-Time Pay & FTE';
const metaDescription =
  'Use our UK pro rata salary calculator to convert a full-time salary into the exact pay for your part-time contract. Understand FTE and flexible working.';
const keywords = getMappedKeywords('Pro Rata Salary Calculator');

const defaultInputs = {
  fullSalary: '38,000',
  fullTimeHours: '37.5',
  actualHours: '28',
  fullTimeDays: '5',
  actualDays: '4',
  contractWeeks: '46',
};

const proRataFaqs = [
  {
    question: 'How is a pro rata salary calculated?',
    answer:
      'Start with the full-time salary, multiply by the ratio of hours you work versus the full-time schedule, then adjust for the number of weeks your contract covers. The tool handles this automatically once you enter the figures.',
  },
  {
    question: 'Does annual leave change the calculation?',
    answer:
      'Enter the actual number of weeks you will be paid for, including paid holiday weeks. If your employer pays you across the full year, keep the weeks input at 52 to reflect that.',
  },
  {
    question: 'Is the hourly rate the same for part-time staff?',
    answer:
      'Yes. Employers typically keep the hourly rate aligned for full-time and part-time colleagues. The pro rata approach simply scales the total earnings in line with actual hours worked.',
  },
];

const emotionalMessage =
  'Flexible working offers freedom, and understanding your pro rata salary ensures financial fairness. Use this calculator to confidently plan your income for any working pattern.';
const emotionalQuote = {
  text: 'The only way to do great work is to love what you do.',
  author: 'Steve Jobs',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateProRata = (inputs) => {
  const fullSalary = parseNumber(inputs.fullSalary);
  const fullTimeHours = parseNumber(inputs.fullTimeHours);
  const actualHours = parseNumber(inputs.actualHours);
  const fullTimeDays = parseNumber(inputs.fullTimeDays);
  const actualDays = parseNumber(inputs.actualDays);
  const contractWeeks = Math.min(Math.max(parseNumber(inputs.contractWeeks), 0), 52);

  const hoursRatio = fullTimeHours > 0 ? actualHours / fullTimeHours : 0;
  const contractFraction = contractWeeks / 52;
  const fteEquivalent = fullSalary * hoursRatio;
  const contractPay = fteEquivalent * contractFraction;
  const contractMonths = contractFraction * 12;

  const weeklyPay = contractWeeks > 0 ? contractPay / contractWeeks : 0;
  const dailyPay = actualDays > 0 ? weeklyPay / actualDays : 0;
  const hourlyRate = fullTimeHours > 0 ? fullSalary / (fullTimeHours * 52) : 0;
  const partTimeHourlyRate = hourlyRate;

  return {
    hoursRatio,
    contractFraction,
    fteEquivalent,
    contractPay,
    contractMonths,
    weeklyPay,
    dailyPay,
    hourlyRate,
    partTimeHourlyRate,
    contractWeeks,
    actualDays,
    fullTimeDays,
    annualisedMonthlyPay: fteEquivalent / 12,
    contractMonthlyPay: contractMonths > 0 ? contractPay / contractMonths : 0,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Full-Time Salary (£)', currencyFormatter.format(parseNumber(inputs.fullSalary))],
    ['Full-Time Hours Per Week', inputs.fullTimeHours],
    ['Your Hours Per Week', inputs.actualHours],
    ['Full-Time Days Per Week', inputs.fullTimeDays],
    ['Your Days Per Week', inputs.actualDays],
    ['Paid Weeks In Contract', inputs.contractWeeks],
    [],
    ['FTE Match (%)', `${numberFormatter.format(results.hoursRatio * 100)}%`],
    ['Contract Fraction (%)', `${numberFormatter.format(results.contractFraction * 100)}%`],
    ['Annualised Salary (£)', currencyFormatter.format(results.fteEquivalent)],
    ['Contract Pay (£)', currencyFormatter.format(results.contractPay)],
    ['Monthly (Annualised) (£)', currencyFormatter.format(results.annualisedMonthlyPay)],
    ['Monthly (Contract) (£)', currencyFormatter.format(results.contractMonthlyPay)],
    ['Weekly Pay (£)', currencyFormatter.format(results.weeklyPay)],
    ['Daily Pay (£)', currencyFormatter.format(results.dailyPay)],
    ['Hourly Rate (£)', currencyFormatter.format(results.partTimeHourlyRate)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'FTE Equivalent', value: results.fteEquivalent, color: '#3b82f6' },
    { name: 'Contract Pay', value: results.contractPay, color: '#10b981' },
  ].filter((segment) => segment.value > 0);
}

export default function ProRataSalaryCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Pro Rata Salary Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'Pro Rata Salary Calculator', url: pagePath },
    ],
    faq: proRataFaqs,
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
      const computedResults = calculateProRata(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
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
                Pro Rata Salary Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Translate full-time pay into part-time reality, compare contract lengths, and see how
              your take-home adapts to flexible working patterns.
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
                  Working Pattern Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="fullSalary">Full-time salary (£)</Label>
                      <Input
                        id="fullSalary"
                        inputMode="decimal"
                        value={inputs.fullSalary}
                        onChange={handleInputChange('fullSalary')}
                        placeholder="e.g. 38,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullTimeHours">Full-time hours per week</Label>
                      <Input
                        id="fullTimeHours"
                        inputMode="decimal"
                        value={inputs.fullTimeHours}
                        onChange={handleInputChange('fullTimeHours')}
                        placeholder="e.g. 37.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actualHours">Your hours per week</Label>
                      <Input
                        id="actualHours"
                        inputMode="decimal"
                        value={inputs.actualHours}
                        onChange={handleInputChange('actualHours')}
                        placeholder="e.g. 28"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullTimeDays">Full-time days per week</Label>
                      <Input
                        id="fullTimeDays"
                        inputMode="decimal"
                        value={inputs.fullTimeDays}
                        onChange={handleInputChange('fullTimeDays')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="actualDays">Your days per week</Label>
                      <Input
                        id="actualDays"
                        inputMode="decimal"
                        value={inputs.actualDays}
                        onChange={handleInputChange('actualDays')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractWeeks">Paid weeks in contract</Label>
                      <Input
                        id="contractWeeks"
                        inputMode="numeric"
                        value={inputs.contractWeeks}
                        onChange={handleInputChange('contractWeeks')}
                        placeholder="e.g. 46"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Pro Rata Salary
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
                    Enter full-time and your working pattern details, then press{' '}
                    <span className="font-semibold">Calculate Pro Rata Salary</span> to see your
                    equivalent part-time pay.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BadgePercent
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Pro Rata Salary Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">FTE match</p>
                        <p className="text-2xl font-semibold">
                          {numberFormatter.format(results.hoursRatio * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Contract fraction
                        </p>
                        <p className="text-2xl font-semibold">
                          {numberFormatter.format(results.contractFraction * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Annualised salary
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.fteEquivalent)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Contract pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.contractPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Monthly (annualised)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.annualisedMonthlyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Monthly (contract)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.contractMonthlyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Weekly pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Daily pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.dailyPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Hourly rate</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.partTimeHourlyRate)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="pro-rata-salary"
                          title="Pro Rata Salary Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <LineChart
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Salary Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Pro Rata Salary Breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <BookOpen
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides an estimate based on your inputs. Always refer to
                        your employment contract for the exact terms and conditions regarding your
                        salary and working pattern.
                      </p>
                      <p>
                        Tax and National Insurance deductions are not included in this calculation.
                        Use a take-home pay calculator for a full net pay estimate.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={proRataFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
</div>
      </CalculatorWrapper>
    </div>
  );
}
