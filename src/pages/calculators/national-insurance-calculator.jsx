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
import { Calculator, Shield, PiggyBank, Percent, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/national-insurance-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/national-insurance-calculator';
const pageTitle = 'National Insurance Calculator UK | NI Contributions & Take-Home Pay';
const metaDescription =
  'Use our UK National Insurance calculator to estimate NI contributions, understand NI rates, and see the impact on your take-home pay.';
const keywords = getMappedKeywords('NI Calculator');

const faqItems = [
  {
    question: 'What are the main National Insurance thresholds?',
    answer:
      'Employees pay Class 1 NI on earnings above the Primary Threshold (£12,570 for most people) and up to the Upper Earnings Limit (£50,270). Earnings above that limit attract a smaller NI rate.',
  },
  {
    question: 'Are NI contributions the same for all employees?',
    answer:
      'No. NI classes differ for employees, self-employed workers, and company directors. This calculator focuses on Class 1 employee contributions based on annual gross salary.',
  },
  {
    question: 'Do salary sacrifice pension schemes reduce NI?',
    answer:
      'Yes. Reducing taxable pay via salary sacrifice lowers taxable income and National Insurance contributions. Enter salary after any sacrifice to model the impact.',
  },
];

const emotionalMessage =
  'Understanding your National Insurance contributions is key to managing your take-home pay. Use this calculator to gain clarity and plan your finances effectively.';
const emotionalQuote = {
  text: 'An investment in knowledge pays the best interest.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_MAIN_RATE = 0.08; // 8% employee rate
const NI_UPPER_RATE = 0.02; // 2% employee rate
const NI_EMPLOYER_SECONDARY_THRESHOLD = 9100;
const NI_EMPLOYER_RATE = 0.138; // 13.8%

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function NationalInsuranceCalculatorPage() {
  const [inputs, setInputs] = useState({
    annualSalary: '42,000',
    pensionPercent: '5',
    salarySacrifice: '0',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'National Insurance Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & National Insurance Calculators', url: '/calculators#tax-national-insurance' },
      { name: 'National Insurance Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const calculateNI = useCallback(() => {
    const annualSalary = parseNumber(inputs.annualSalary);
    const pensionPercent = Math.max(0, parseNumber(inputs.pensionPercent)) / 100;
    const salarySacrifice = Math.max(0, parseNumber(inputs.salarySacrifice));

    const pensionContribution = annualSalary * pensionPercent;
    const niablePay = Math.max(0, annualSalary - salarySacrifice);

    const niBand1Earnings = Math.max(
      0,
      Math.min(niablePay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD
    );
    const niBand2Earnings = Math.max(0, niablePay - NI_UPPER_EARNINGS_LIMIT);

    const employeeNI = niBand1Earnings * NI_MAIN_RATE + niBand2Earnings * NI_UPPER_RATE;

    const employerBandEarnings = Math.max(0, niablePay - NI_EMPLOYER_SECONDARY_THRESHOLD);
    const employerNI = employerBandEarnings * NI_EMPLOYER_RATE;

    const monthlyNI = employeeNI / 12;
    const effectiveRate = niablePay > 0 ? (employeeNI / niablePay) * 100 : 0;
    const takeHomeEstimate = niablePay - employeeNI - pensionContribution;

    return {
      annualSalary,
      pensionContribution,
      niablePay,
      employeeNI,
      employerNI,
      monthlyNI,
      effectiveRate,
      takeHomeEstimate,
    };
  }, [inputs]);

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
      const computedResults = calculateNI();
      setResults(computedResults);
      setHasCalculated(true);

      const csvRows = [
        ['Metric', 'Value'],
        ['Annual Gross Salary (£)', currencyFormatter.format(parseNumber(inputs.annualSalary))],
        ['Pension Contribution (%)', `${inputs.pensionPercent}%`],
        ['Salary Sacrifice (£)', currencyFormatter.format(parseNumber(inputs.salarySacrifice))],
        [],
        ['NIable Pay (£)', currencyFormatter.format(computedResults.niablePay)],
        ['Employee NI (Annual) (£)', currencyFormatter.format(computedResults.employeeNI)],
        ['Employee NI (Monthly) (£)', currencyFormatter.format(computedResults.monthlyNI)],
        ['Employer NI (Annual) (£)', currencyFormatter.format(computedResults.employerNI)],
        ['Effective NI Rate (%)', `${computedResults.effectiveRate.toFixed(2)}%`],
        [
          'Estimated Take-Home Pay (after NI & Pension) (£)',
          currencyFormatter.format(computedResults.takeHomeEstimate),
        ],
        ['Pension Contribution (£)', currencyFormatter.format(computedResults.pensionContribution)],
      ];
      setCsvData(csvRows);
    },
    [calculateNI, currencyFormatter, inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      annualSalary: '42,000',
      pensionPercent: '5',
      salarySacrifice: '0',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Employee NI', value: results.employeeNI, color: '#3b82f6' },
      { name: 'Employer NI', value: results.employerNI, color: '#10b981' },
      { name: 'Pension Contribution', value: results.pensionContribution, color: '#f97316' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

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
                National Insurance Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate your National Insurance contributions, understand NI rates, and see the
              impact on your take-home pay for informed financial planning.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Shield className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  Income & Contribution Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="annualSalary">Annual gross salary (£)</Label>
                      <Input
                        id="annualSalary"
                        inputMode="decimal"
                        value={inputs.annualSalary}
                        onChange={handleInputChange('annualSalary')}
                        placeholder="e.g. 42,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionPercent">Employee pension contribution (%)</Label>
                      <Input
                        id="pensionPercent"
                        inputMode="decimal"
                        value={inputs.pensionPercent}
                        onChange={handleInputChange('pensionPercent')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salarySacrifice">Salary sacrifice (£)</Label>
                      <Input
                        id="salarySacrifice"
                        inputMode="decimal"
                        value={inputs.salarySacrifice}
                        onChange={handleInputChange('salarySacrifice')}
                        placeholder="e.g. 0"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Enter the amount of salary sacrificed for benefits like pensions or
                        cycle-to-work schemes.
                      </p>
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
                    Enter your annual salary and contributions, then press{' '}
                    <span className="font-semibold">Calculate NI</span> to see your estimated
                    National Insurance contributions and take-home pay.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        NI Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Employee NI (Annual)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.employeeNI)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Employee NI (Monthly)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyNI)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Employer NI (Annual)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.employerNI)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Effective NI Rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {results.effectiveRate.toFixed(2)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Estimated Take-Home Pay
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.takeHomeEstimate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Pension Contribution
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionContribution)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="national-insurance-contributions"
                          title="National Insurance Calculator Results"
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
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
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
                          className="text-indigo-600 hover:underline dark:text-indigo-400"
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
</div>
      </CalculatorWrapper>
    </div>
  );
}
