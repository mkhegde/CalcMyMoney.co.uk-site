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
import { Calculator, Gauge, Briefcase, Scale, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/overtime-rate-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/overtime-rate-calculator';
const pageTitle = 'Overtime Rate Calculator UK | Hourly Pay & Multipliers';
const metaDescription =
  'Use our UK overtime rate calculator to work out your overtime multiplier, time and a half, and double time rates from salary or hourly pay.';
const keywords = getMappedKeywords('Overtime Rate Calculator');

const faqItems = [
  {
    question: 'How do I work out my overtime rate from my salary?',
    answer:
      'Divide your annual salary by the number of contracted weekly hours multiplied by 52 to get your normal hourly rate. Multiply that figure by the overtime multiplier stated in your contract for the applicable rate.',
  },
  {
    question: 'What is time and a half?',
    answer:
      'Time and a half means your overtime rate is 1.5 times your standard hourly rate. For example, an hourly rate of £20 becomes £30 for every overtime hour.',
  },
  {
    question: 'Does overtime change my average hourly pay?',
    answer:
      'Yes. Regular overtime can increase your average hourly pay figure, which may be relevant for holiday pay calculations and mortgage applications. Track both your contracted and actual hours to calculate your average pay accurately.',
  },
];

const emotionalMessage =
  'Every hour of overtime is an opportunity to boost your income. Use this calculator to understand your true hourly rate and ensure you are fairly compensated for your hard work.';
const emotionalQuote = {
  text: 'The only way to do great work is to love what you do.',
  author: 'Steve Jobs',
};

const directoryLinks = [
  {
    url: '/#tax-income',
    label: 'Explore all tax & income calculators',
    description:
      'Understand deductions, take-home pay, and tax liabilities on every type of income.',
  },
  {
    url: '/overtime-pay-calculator',
    label: 'Overtime Pay Calculator',
    description: 'Calculate additional earnings from overtime hours at multiple pay rates.',
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

const calculateOvertimeRate = ({
  annualSalary,
  contractedHoursPerWeek,
  overtimeMultiplier,
  doubleTimeMultiplier,
  weeklyOvertimeHours,
}) => {
  const parsedAnnualSalary = parseNumber(annualSalary);
  const parsedContractedHoursPerWeek = parseNumber(contractedHoursPerWeek);
  const parsedOvertimeMultiplier = parseNumber(overtimeMultiplier);
  const parsedDoubleTimeMultiplier = parseNumber(doubleTimeMultiplier);
  const parsedWeeklyOvertimeHours = parseNumber(weeklyOvertimeHours);

  const contractedHoursPerYear = parsedContractedHoursPerWeek * 52;
  const baseHourlyRate =
    contractedHoursPerYear > 0 ? parsedAnnualSalary / contractedHoursPerYear : 0;

  const overtimeRate = baseHourlyRate * parsedOvertimeMultiplier;
  const doubleTimeRate = baseHourlyRate * parsedDoubleTimeMultiplier;

  const weeklyGrossIncome = parsedAnnualSalary / 52;
  const overtimeWeeklyValue = overtimeRate * parsedWeeklyOvertimeHours;
  const averageWeeklyIncome = weeklyGrossIncome + overtimeWeeklyValue;

  return {
    baseHourlyRate,
    overtimeRate,
    doubleTimeRate,
    weeklyGrossIncome,
    overtimeWeeklyValue,
    averageWeeklyIncome,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Annual Salary (£)', currencyFormatter.format(parseNumber(inputs.annualSalary))],
    ['Contracted Hours Per Week', inputs.contractedHoursPerWeek],
    ['Overtime Multiplier (x)', inputs.overtimeMultiplier],
    ['Double Time Multiplier (x)', inputs.doubleTimeMultiplier],
    ['Weekly Overtime Hours', inputs.weeklyOvertimeHours],
    [],
    ['Standard Hourly Rate (£)', currencyFormatter.format(results.baseHourlyRate)],
    ['Overtime Rate (£)', currencyFormatter.format(results.overtimeRate)],
    ['Double Time Rate (£)', currencyFormatter.format(results.doubleTimeRate)],
    ['Weekly Overtime Value (£)', currencyFormatter.format(results.overtimeWeeklyValue)],
    ['Weekly Gross Income (£)', currencyFormatter.format(results.weeklyGrossIncome)],
    ['Average Weekly Income (£)', currencyFormatter.format(results.averageWeeklyIncome)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Standard Hourly Rate', value: results.baseHourlyRate, color: '#10b981' },
    { name: 'Overtime Rate', value: results.overtimeRate, color: '#3b82f6' },
    { name: 'Double Time Rate', value: results.doubleTimeRate, color: '#f97316' },
  ].filter((segment) => segment.value > 0);
}

export default function OvertimeRateCalculatorPage() {
  const [inputs, setInputs] = useState({
    annualSalary: '38,000',
    contractedHoursPerWeek: '37.5',
    overtimeMultiplier: '1.5',
    doubleTimeMultiplier: '2',
    weeklyOvertimeHours: '5',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Overtime Rate Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'Overtime Rate Calculator', url: pagePath },
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
      const computedResults = calculateOvertimeRate(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      annualSalary: '38,000',
      contractedHoursPerWeek: '37.5',
      overtimeMultiplier: '1.5',
      doubleTimeMultiplier: '2',
      weeklyOvertimeHours: '5',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Overtime Rate Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work out your standard hourly rate, overtime multiplier, and double time rates from
              your UK salary or hourly pay.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Gauge className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  Employment Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="annualSalary">Annual salary (£)</Label>
                      <Input
                        id="annualSalary"
                        inputMode="decimal"
                        value={inputs.annualSalary}
                        onChange={handleInputChange('annualSalary')}
                        placeholder="e.g. 38,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contractedHoursPerWeek">Contracted hours per week</Label>
                      <Input
                        id="contractedHoursPerWeek"
                        inputMode="decimal"
                        value={inputs.contractedHoursPerWeek}
                        onChange={handleInputChange('contractedHoursPerWeek')}
                        placeholder="e.g. 37.5"
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
                      <Label htmlFor="doubleTimeMultiplier">Double time multiplier (x)</Label>
                      <Input
                        id="doubleTimeMultiplier"
                        inputMode="decimal"
                        value={inputs.doubleTimeMultiplier}
                        onChange={handleInputChange('doubleTimeMultiplier')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeklyOvertimeHours">Weekly overtime hours</Label>
                      <Input
                        id="weeklyOvertimeHours"
                        inputMode="decimal"
                        value={inputs.weeklyOvertimeHours}
                        onChange={handleInputChange('weeklyOvertimeHours')}
                        placeholder="e.g. 5"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Overtime Rates
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
                    Enter your salary, hours, and multipliers, then press{' '}
                    <span className="font-semibold">Calculate Overtime Rates</span> to see your
                    standard, overtime, and double time hourly rates.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Gauge
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-200"
                          aria-hidden="true"
                        />
                        Overtime Rates Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Standard hourly rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.baseHourlyRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Overtime rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.overtimeRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Double time rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.doubleTimeRate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Weekly overtime value
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.overtimeWeeklyValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Weekly gross income
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyGrossIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Average weekly income
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.averageWeeklyIncome)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="overtime-rates"
                          title="Overtime Rate Calculator Results"
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
                        Rate Comparison
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
                        <ResultBreakdownChart data={chartData} title="Overtime Rate Comparison" />
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
                        This calculator provides an estimate based on your inputs. Always refer to
                        your employment contract for the exact terms and conditions regarding
                        overtime pay and multipliers.
                      </p>
                      <p>
                        UK employment law does not mandate overtime premiums, but most contracts
                        specify them. Ensure your employer is compliant with the Working Time
                        Regulations.
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
