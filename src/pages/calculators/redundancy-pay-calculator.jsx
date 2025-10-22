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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Briefcase, Scale, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/redundancy-pay-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/redundancy-pay-calculator';
const pageTitle = 'Redundancy Pay Calculator UK | Statutory & Enhanced Entitlements';
const metaDescription =
  'Estimate UK statutory redundancy pay, enhanced packages, and the tax-free allowance so you can plan finances with confidence after job loss.';
const keywords = getMappedKeywords('Redundancy Pay Calculator');

const faqItems = [
  {
    question: 'How is statutory redundancy pay worked out?',
    answer:
      'Statutory redundancy pay is based on your age, complete years of continuous service (up to 20), and gross weekly pay capped at the statutory maximum. This calculator multiplies eligible weeks by the lower of your weekly pay or the government cap.',
  },
  {
    question: 'Is redundancy pay tax-free?',
    answer:
      'Statutory redundancy pay up to £30,000 is free of Income Tax and National Insurance. Payments above that limit, holiday pay, or pay in lieu of notice are taxable. The calculator shows how much of your package could be taxed.',
  },
  {
    question: 'What if my contract offers enhanced redundancy?',
    answer:
      'Enhanced schemes multiply statutory pay or offer additional lump sums. Add the multiplier supplied by HR to see the uplift and the point at which the package becomes taxable.',
  },
];

const emotionalMessage =
  'Facing redundancy is challenging, but knowing your entitlement helps you take the next step with clarity. Use this tool to prepare conversations with HR and plan your finances calmly.';
const emotionalQuote = {
  text: 'The future depends on what you do today.',
  author: 'Mahatma Gandhi',
};

const directoryLinks = [
  {
    url: '/#income-tax',
    label: 'Browse salary & tax calculators',
    description: 'Break down PAYE, NI, and take-home pay for your next role.',
  },
  {
    url: '/take-home-pay-calculator',
    label: 'Take-Home Pay Calculator',
    description: 'See the net impact of your next job offer after deductions.',
  },
  {
    url: '/salary-calculator-uk',
    label: 'Salary Calculator UK',
    description: 'Model new salaries, benefits, and pension contributions.',
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

const TAX_FREE_LIMIT = 30_000;

const calculateEligibleWeeks = (age, serviceYears) => {
  const cappedService = Math.min(Math.max(Math.floor(serviceYears), 0), 20);
  let eligibleWeeks = 0;
  for (let year = 1; year <= cappedService; year += 1) {
    const currentAge = age - (cappedService - year);
    if (currentAge < 22) eligibleWeeks += 0.5;
    else if (currentAge <= 40) eligibleWeeks += 1;
    else eligibleWeeks += 1.5;
  }
  return Math.min(eligibleWeeks, 20);
};

const calculateRedundancy = (inputs) => {
  const ageAtRedundancy = Math.max(Math.floor(parseNumber(inputs.ageAtRedundancy)), 0);
  const yearsOfService = Math.max(parseNumber(inputs.yearsOfService), 0);
  const weeklyPay = Math.max(parseNumber(inputs.weeklyPay), 0);
  const statutoryWeeklyCap = Math.max(parseNumber(inputs.statutoryWeeklyCap), 0);
  const enhancedMultiplier = Math.max(parseNumber(inputs.enhancedMultiplier), 1);

  const eligibleWeeks = calculateEligibleWeeks(ageAtRedundancy, yearsOfService);
  const cappedWeeklyPay = Math.min(weeklyPay, statutoryWeeklyCap);
  const statutoryAmount = eligibleWeeks * cappedWeeklyPay;
  const enhancedAmount = statutoryAmount * enhancedMultiplier;

  const taxFreePortion = Math.min(enhancedAmount, TAX_FREE_LIMIT);
  const taxableAmount = Math.max(enhancedAmount - TAX_FREE_LIMIT, 0);
  const enhancedUplift = Math.max(enhancedAmount - statutoryAmount, 0);

  return {
    ageAtRedundancy,
    yearsOfService,
    eligibleWeeks,
    cappedWeeklyPay,
    statutoryAmount,
    enhancedAmount,
    enhancedUplift,
    taxFreePortion,
    taxableAmount,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Age at redundancy', inputs.ageAtRedundancy],
    ['Years of service', inputs.yearsOfService],
    ['Average weekly pay (£)', inputs.weeklyPay],
    ['Statutory weekly cap (£)', inputs.statutoryWeeklyCap],
    ['Enhanced multiplier', inputs.enhancedMultiplier],
    [],
    ['Output', 'Value'],
    ['Eligible weeks', results.eligibleWeeks.toFixed(1)],
    ['Weekly pay used (£)', currencyFormatter.format(results.cappedWeeklyPay)],
    ['Statutory redundancy (£)', currencyFormatter.format(results.statutoryAmount)],
    ['Enhanced redundancy (£)', currencyFormatter.format(results.enhancedAmount)],
    ['Tax-free portion (£)', currencyFormatter.format(results.taxFreePortion)],
    ['Taxable portion (£)', currencyFormatter.format(results.taxableAmount)],
  ];
};

const chartPalette = ['#f97316', '#6366f1', '#10b981'];

const buildChartData = (results) => {
  if (!results) return [];
  return [
    {
      name: 'Tax-free allowance',
      value: results.taxFreePortion,
      color: chartPalette[0],
    },
    {
      name: 'Taxable portion',
      value: results.taxableAmount,
      color: chartPalette[1],
    },
    {
      name: 'Statutory entitlement',
      value: results.statutoryAmount,
      color: chartPalette[2],
    },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  ageAtRedundancy: '35',
  yearsOfService: '6',
  weeklyPay: '620',
  statutoryWeeklyCap: '700',
  enhancedMultiplier: '1.2',
};

export default function RedundancyPayCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Redundancy Pay Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Salary & Income Calculators', url: '/calculators#income-tax' },
      { name: 'Redundancy Pay Calculator', url: pagePath },
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
      const computed = calculateRedundancy(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rose-600/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Redundancy Pay Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Calculate statutory redundancy entitlement, model enhanced packages, and understand how much of the payout remains tax-free.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Briefcase className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-rose-600 dark:text-rose-300"
            borderColor="border-rose-200 dark:border-rose-800/60"
            bgColor="bg-rose-50/70 dark:bg-rose-950/40"
            textColor="text-rose-900 dark:text-rose-100"
            footerColor="text-rose-700 dark:text-rose-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Briefcase className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                  Employment details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ageAtRedundancy">Age at redundancy</Label>
                      <Input
                        id="ageAtRedundancy"
                        inputMode="numeric"
                        value={inputs.ageAtRedundancy}
                        onChange={handleInputChange('ageAtRedundancy')}
                        placeholder="e.g. 35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfService">Years of continuous service</Label>
                      <Input
                        id="yearsOfService"
                        inputMode="decimal"
                        value={inputs.yearsOfService}
                        onChange={handleInputChange('yearsOfService')}
                        placeholder="e.g. 6"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="weeklyPay">Average weekly pay (£)</Label>
                      <Input
                        id="weeklyPay"
                        inputMode="decimal"
                        value={inputs.weeklyPay}
                        onChange={handleInputChange('weeklyPay')}
                        placeholder="e.g. 620"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="statutoryWeeklyCap">Statutory weekly cap (£)</Label>
                      <Input
                        id="statutoryWeeklyCap"
                        inputMode="decimal"
                        value={inputs.statutoryWeeklyCap}
                        onChange={handleInputChange('statutoryWeeklyCap')}
                        placeholder="e.g. 700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enhancedMultiplier">Enhanced multiplier (if offered)</Label>
                    <Input
                      id="enhancedMultiplier"
                      inputMode="decimal"
                      value={inputs.enhancedMultiplier}
                      onChange={handleInputChange('enhancedMultiplier')}
                      placeholder="e.g. 1.2"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate redundancy pay
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
                    Enter your employment details and press <span className="font-semibold">Calculate redundancy pay</span> to reveal your statutory entitlement, enhanced uplift, and tax treatment.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-rose-200 bg-white shadow-sm dark:border-rose-900 dark:bg-rose-900/30 dark:text-rose-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calculator className="h-5 w-5 text-rose-600 dark:text-rose-200" aria-hidden="true" />
                        Redundancy summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Eligible weeks</p>
                        <p className="text-2xl font-semibold">{results.eligibleWeeks.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Weekly pay used</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.cappedWeeklyPay)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Statutory redundancy</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.statutoryAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Enhanced package</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.enhancedAmount)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Tax-free portion</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.taxFreePortion)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-rose-900 dark:text-rose-200">Taxable portion</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.taxableAmount)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="redundancy-pay-results"
                          title="Redundancy Pay Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Scale className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Tax overview
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
                        <ResultBreakdownChart data={chartData} title="Redundancy payout composition" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-rose-600 dark:text-rose-300" aria-hidden="true" />
                        Next steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Confirm the calculation with HR and request a written breakdown including any pay in lieu of notice or holiday pay, as these are usually taxed.
                      </p>
                      <p>
                        Share the results with a financial adviser if you plan to make pension contributions or need guidance on claiming benefits while between roles.
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
