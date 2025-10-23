// src/pages/calculators/pension-contribution-calculator.jsx
import React, { useState, useMemo, useCallback, Suspense } from 'react';
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
import {
  Calculator,
  PiggyBank,
  TrendingUp,
  Percent,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/pension-contribution-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/pension-contribution-calculator';
const pageTitle = 'Pension Contribution Calculator UK | Workplace & Voluntary';
const metaDescription =
  'Use our UK pension contribution calculator to model workplace pension amounts, employer match, and tax relief to inform pension planning.';
const keywords = getMappedKeywords('Pension Contribution Calculator');

const faqItems = [
  {
    question: 'How much should I contribute to my pension?',
    answer:
      'Auto-enrolment sets a minimum contribution, but many planners suggest saving 12-15% of gross salary to build a substantial pension fund. Adjust your voluntary contributions to match retirement goals.',
  },
  {
    question: 'How does tax relief work on UK pension contributions?',
    answer:
      'For basic rate taxpayers, every £80 you contribute is topped up to £100 by HMRC. Higher-rate taxpayers can claim additional relief through self-assessment. Workplace pension providers usually add basic rate tax relief automatically.',
  },
  {
    question: 'Do pension contributions reduce take-home pay?',
    answer:
      'Yes, but tax relief and employer contributions offset the reduction. Viewing contributions as part of your total reward package rather than lost pay helps with long-term planning.',
  },
];

const emotionalMessage =
  'Every pension contribution is an investment in your future self. Use this calculator to optimize your contributions, maximize employer matching, and secure the retirement you deserve.';
const emotionalQuote = {
  text: 'The greatest wealth is health.',
  author: 'Virgil',
};

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

const calculatePensionContribution = ({
  annualSalary,
  employeeRate,
  employerRate,
  voluntaryRate,
  qualifyingEarningsMin,
  qualifyingEarningsMax,
}) => {
  const parsedAnnualSalary = parseNumber(annualSalary);
  const parsedEmployeeRate = parseNumber(employeeRate) / 100;
  const parsedEmployerRate = parseNumber(employerRate) / 100;
  const parsedVoluntaryRate = parseNumber(voluntaryRate) / 100;
  const parsedQualifyingEarningsMin = parseNumber(qualifyingEarningsMin);
  const parsedQualifyingEarningsMax = parseNumber(qualifyingEarningsMax);

  const qualifyingEarnings = Math.max(
    0,
    Math.min(parsedAnnualSalary, parsedQualifyingEarningsMax) - parsedQualifyingEarningsMin
  );

  const autoContributionBase = Math.max(0, qualifyingEarnings);
  const employeeContribution = autoContributionBase * parsedEmployeeRate;
  const employerContribution = autoContributionBase * parsedEmployerRate;
  const voluntaryContribution = parsedAnnualSalary * parsedVoluntaryRate;

  const grossContribution = employeeContribution + employerContribution + voluntaryContribution;
  const taxRelief = employeeContribution * 0.25; // Assuming basic rate tax relief
  const totalIntoPension = grossContribution + taxRelief;

  const employeeMonthly = (employeeContribution + voluntaryContribution - taxRelief) / 12;
  const employerMonthly = employerContribution / 12;
  const taxReliefMonthly = taxRelief / 12;

  return {
    qualifyingEarnings,
    employeeContribution,
    employerContribution,
    voluntaryContribution,
    grossContribution,
    taxRelief,
    totalIntoPension,
    employeeMonthly,
    employerMonthly,
    taxReliefMonthly,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Annual Salary (£)', currencyFormatter.format(parseNumber(inputs.annualSalary))],
    ['Employee Rate (%)', inputs.employeeRate],
    ['Employer Rate (%)', inputs.employerRate],
    ['Voluntary Rate (%)', inputs.voluntaryRate],
    [
      'Qualifying Earnings Min (£)',
      currencyFormatter.format(parseNumber(inputs.qualifyingEarningsMin)),
    ],
    [
      'Qualifying Earnings Max (£)',
      currencyFormatter.format(parseNumber(inputs.qualifyingEarningsMax)),
    ],
    [],
    ['Qualifying Earnings (£)', currencyFormatter.format(results.qualifyingEarnings)],
    ['Employee Contribution (Annual) (£)', currencyFormatter.format(results.employeeContribution)],
    ['Employer Contribution (Annual) (£)', currencyFormatter.format(results.employerContribution)],
    [
      'Voluntary Contribution (Annual) (£)',
      currencyFormatter.format(results.voluntaryContribution),
    ],
    ['Gross Contribution (Annual) (£)', currencyFormatter.format(results.grossContribution)],
    ['Tax Relief (Annual) (£)', currencyFormatter.format(results.taxRelief)],
    ['Total Into Pension (Annual) (£)', currencyFormatter.format(results.totalIntoPension)],
    [
      'Employee Monthly Impact on Take-Home Pay (£)',
      currencyFormatter.format(results.employeeMonthly),
    ],
    ['Employer Monthly Match (£)', currencyFormatter.format(results.employerMonthly)],
    ['Monthly Tax Relief (£)', currencyFormatter.format(results.taxReliefMonthly)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Employee Contribution', value: results.employeeContribution, color: '#3b82f6' },
    { name: 'Employer Contribution', value: results.employerContribution, color: '#10b981' },
    { name: 'Voluntary Contribution', value: results.voluntaryContribution, color: '#f97316' },
    { name: 'Tax Relief', value: results.taxRelief, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function PensionContributionCalculatorPage() {
  const [inputs, setInputs] = useState({
    annualSalary: '42,000',
    employeeRate: '5',
    employerRate: '3',
    voluntaryRate: '2',
    qualifyingEarningsMin: '6,240',
    qualifyingEarningsMax: '50,270',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Pension Contribution Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Retirement & Pensions Calculators', url: '/calculators#retirement-pensions' },
      { name: 'Pension Contribution Calculator', url: pagePath },
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
      const computedResults = calculatePensionContribution(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      annualSalary: '42,000',
      employeeRate: '5',
      employerRate: '3',
      voluntaryRate: '2',
      qualifyingEarningsMin: '6,240',
      qualifyingEarningsMax: '50,270',
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
                Pension Contribution Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate your pension contributions, visualise pension planning, and manage your
              pension fund while balancing take-home pay.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  Contribution Inputs
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
                        placeholder="e.g. 42,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employeeRate">Employee rate (%)</Label>
                      <Input
                        id="employeeRate"
                        inputMode="decimal"
                        value={inputs.employeeRate}
                        onChange={handleInputChange('employeeRate')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="employerRate">Employer rate (%)</Label>
                      <Input
                        id="employerRate"
                        inputMode="decimal"
                        value={inputs.employerRate}
                        onChange={handleInputChange('employerRate')}
                        placeholder="e.g. 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="voluntaryRate">Voluntary rate (%)</Label>
                      <Input
                        id="voluntaryRate"
                        inputMode="decimal"
                        value={inputs.voluntaryRate}
                        onChange={handleInputChange('voluntaryRate')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualifyingEarningsMin">Qualifying earnings min (£)</Label>
                      <Input
                        id="qualifyingEarningsMin"
                        inputMode="decimal"
                        value={inputs.qualifyingEarningsMin}
                        onChange={handleInputChange('qualifyingEarningsMin')}
                        placeholder="e.g. 6,240"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="qualifyingEarningsMax">Qualifying earnings max (£)</Label>
                      <Input
                        id="qualifyingEarningsMax"
                        inputMode="decimal"
                        value={inputs.qualifyingEarningsMax}
                        onChange={handleInputChange('qualifyingEarningsMax')}
                        placeholder="e.g. 50,270"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Contributions
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
                    Enter your salary and contribution rates, then press{' '}
                    <span className="font-semibold">Calculate Contributions</span> to see your
                    estimated pension contributions and tax relief.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-200"
                          aria-hidden="true"
                        />
                        Contribution Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Qualifying earnings
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.qualifyingEarnings)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Employee contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.employeeContribution)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Employer contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.employerContribution)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Voluntary contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.voluntaryContribution)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Tax relief</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.taxRelief)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total into pension
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalIntoPension)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="pension-contributions"
                          title="Pension Contribution Calculator Results"
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
                          title="Pension Contribution Breakdown"
                        />
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
                        This calculator provides an estimate based on current tax rules and
                        auto-enrolment thresholds. Always check with your pension provider and HMRC
                        for personalized information.
                      </p>
                      <p>
                        Tax relief rates and qualifying earnings thresholds can change with
                        government budgets.
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
