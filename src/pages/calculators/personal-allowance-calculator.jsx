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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calculator, Percent, FileText, HandCoins, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/personal-allowance-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/personal-allowance-calculator';
const pageTitle = 'Personal Allowance Calculator UK | Income Tax & Tapering';
const metaDescription =
  'Use our UK personal allowance calculator to estimate your personal allowance, adjust for tax reliefs, and understand how high income affects tapering.';
const keywords = getMappedKeywords('Personal Allowance Calculator');

const faqItems = [
  {
    question: 'How does the personal allowance taper work?',
    answer:
      'For every £2 of adjusted net income above £100,000, your personal allowance is reduced by £1. Once adjusted income reaches £125,140, the personal allowance is fully removed.',
  },
  {
    question: 'What counts as adjusted net income?',
    answer:
      'Adjusted net income starts with taxable income and subtracts certain tax reliefs (for example, pension contributions, gross Gift Aid donations, and trade losses). Use official HMRC guidance to ensure your inputs are accurate.',
  },
  {
    question: 'How does Marriage Allowance affect my personal allowance?',
    answer:
      'If you receive Marriage Allowance, your personal allowance increases by 10% of the standard allowance (£1,257 for 2025/26). If you transfer it to a spouse, your allowance decreases by the same amount.',
  },
];

const emotionalMessage =
  "Understanding your personal allowance is key to optimizing your tax position. Use this calculator to ensure you're claiming all eligible reliefs and managing your income effectively.";
const emotionalQuote = {
  text: 'The avoidance of taxes is the only intellectual pursuit that still carries any reward.',
  author: 'John Maynard Keynes',
};

const directoryLinks = [
  {
    url: '/#tax-income',
    label: 'Explore all tax & income calculators',
    description:
      'Understand deductions, take-home pay, and tax liabilities on every type of income.',
  },
  {
    url: '/income-tax-calculator',
    label: 'Income Tax Calculator',
    description: 'Estimate your income tax liability based on your annual earnings.',
  },
  {
    url: '/national-insurance-calculator',
    label: 'National Insurance Calculator',
    description: 'Estimate NI contributions and see the impact on your take-home pay.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const allowanceFormatter = new Intl.NumberFormat('en-GB', {
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

const STANDARD_ALLOWANCE = 12570;
const MARRIAGE_ALLOWANCE_DELTA = Math.round(STANDARD_ALLOWANCE * 0.1); // £1257
const ALLOWANCE_ZERO_THRESHOLD = 125140; // 100k + (12570 * 2)

const marriageAllowanceOptions = [
  { value: 'none', label: 'No marriage allowance change', delta: 0 },
  {
    value: 'received',
    label: 'I receive Marriage Allowance (+£1,257)',
    delta: MARRIAGE_ALLOWANCE_DELTA,
  },
  {
    value: 'transferred',
    label: 'I transfer Marriage Allowance (-£1,257)',
    delta: -MARRIAGE_ALLOWANCE_DELTA,
  },
];

const calculatePersonalAllowance = ({
  income,
  pensionRelief,
  giftAid,
  otherReliefs,
  marriageOption,
}) => {
  const parsedIncome = parseNumber(income);
  const parsedPensionRelief = parseNumber(pensionRelief);
  const parsedGiftAid = parseNumber(giftAid);
  const parsedOtherReliefs = parseNumber(otherReliefs);
  const selectedMarriageOption =
    marriageAllowanceOptions.find((opt) => opt.value === marriageOption) ||
    marriageAllowanceOptions[0];

  const reliefTotal = parsedPensionRelief + parsedGiftAid + parsedOtherReliefs;
  const adjustedNetIncome = Math.max(0, parsedIncome - reliefTotal);

  let taperedAllowance = STANDARD_ALLOWANCE;
  if (adjustedNetIncome > 100000) {
    const reduction = Math.floor((adjustedNetIncome - 100000) / 2);
    taperedAllowance = Math.max(0, STANDARD_ALLOWANCE - reduction);
  }

  // Marriage allowance adjustment applied after taper
  let adjustedAllowance = taperedAllowance + selectedMarriageOption.delta;
  adjustedAllowance = Math.max(0, adjustedAllowance);

  const lostAllowance =
    STANDARD_ALLOWANCE + Math.min(0, selectedMarriageOption.delta) - adjustedAllowance;
  const taxCost = lostAllowance * 0.4; // high rate band assumption for illustration

  const marginalReliefNeeded =
    adjustedAllowance === 0 && adjustedNetIncome > ALLOWANCE_ZERO_THRESHOLD
      ? Math.max(0, adjustedNetIncome - ALLOWANCE_ZERO_THRESHOLD + 1)
      : Math.max(0, adjustedAllowance - taperedAllowance);

  return {
    income: parsedIncome,
    reliefTotal,
    adjustedNetIncome,
    taperedAllowance,
    marriageDelta: selectedMarriageOption.delta,
    adjustedAllowance,
    lostAllowance,
    taxCost,
    marginalReliefNeeded,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Total Taxable Income (£)', currencyFormatter.format(parseNumber(inputs.income))],
    [
      'Gross Pension Contributions (£)',
      currencyFormatter.format(parseNumber(inputs.pensionRelief)),
    ],
    ['Gross Gift Aid Donations (£)', currencyFormatter.format(parseNumber(inputs.giftAid))],
    ['Other Tax Reliefs (£)', currencyFormatter.format(parseNumber(inputs.otherReliefs))],
    [
      'Marriage Allowance Setting',
      marriageAllowanceOptions.find((opt) => opt.value === inputs.marriageOption)?.label || 'N/A',
    ],
    [],
    ['Adjusted Net Income (£)', currencyFormatter.format(results.adjustedNetIncome)],
    ['Tax Relief Total (£)', currencyFormatter.format(results.reliefTotal)],
    [
      'Tapered Allowance (before marriage adj.) (£)',
      allowanceFormatter.format(results.taperedAllowance),
    ],
    ['Marriage Allowance Change (£)', allowanceFormatter.format(results.marriageDelta)],
    ['Resulting Personal Allowance (£)', allowanceFormatter.format(results.adjustedAllowance)],
    ['Allowance Lost vs Standard (£)', allowanceFormatter.format(results.lostAllowance)],
    ['Estimated Tax Cost of Allowance Loss (£)', allowanceFormatter.format(results.taxCost)],
    [
      'Additional Relief Needed to Restore Allowance (£)',
      allowanceFormatter.format(results.marginalReliefNeeded),
    ],
  ];
  return csvRows;
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Standard Allowance', value: STANDARD_ALLOWANCE, color: '#10b981' },
    { name: 'Allowance Lost', value: results.lostAllowance, color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function PersonalAllowanceCalculatorPage() {
  const [inputs, setInputs] = useState({
    income: '110,000',
    pensionRelief: '5,000',
    giftAid: '1,000',
    otherReliefs: '0',
    marriageOption: 'none',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Personal Allowance Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'Personal Allowance Calculator', url: pagePath },
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

  const handleSelectChange = useCallback((value) => {
    setInputs((prev) => ({ ...prev, marriageOption: value }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedResults = calculatePersonalAllowance(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      income: '110,000',
      pensionRelief: '5,000',
      giftAid: '1,000',
      otherReliefs: '0',
      marriageOption: 'none',
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
                Personal Allowance Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Understand how adjusted net income, pension relief, and Marriage Allowance influence
              your UK personal allowance.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<HandCoins className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  Allowance Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="income">Total taxable income (£)</Label>
                      <Input
                        id="income"
                        inputMode="decimal"
                        value={inputs.income}
                        onChange={handleInputChange('income')}
                        placeholder="e.g. 110,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionRelief">Gross pension contributions (£)</Label>
                      <Input
                        id="pensionRelief"
                        inputMode="decimal"
                        value={inputs.pensionRelief}
                        onChange={handleInputChange('pensionRelief')}
                        placeholder="e.g. 5,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="giftAid">Gross Gift Aid donations (£)</Label>
                      <Input
                        id="giftAid"
                        inputMode="decimal"
                        value={inputs.giftAid}
                        onChange={handleInputChange('giftAid')}
                        placeholder="e.g. 1,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otherReliefs">Other tax reliefs (£)</Label>
                      <Input
                        id="otherReliefs"
                        inputMode="decimal"
                        value={inputs.otherReliefs}
                        onChange={handleInputChange('otherReliefs')}
                        placeholder="e.g. 0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marriageOption">Marriage Allowance setting</Label>
                      <Select value={inputs.marriageOption} onValueChange={handleSelectChange}>
                        <SelectTrigger id="marriageOption">
                          <SelectValue placeholder="Select option" />
                        </SelectTrigger>
                        <SelectContent>
                          {marriageAllowanceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Allowance
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
                    Enter your income and tax relief details, then press{' '}
                    <span className="font-semibold">Calculate Allowance</span> to see your estimated
                    personal allowance and tax impact.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <HandCoins
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Allowance Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Adjusted net income
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.adjustedNetIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Tax relief total
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.reliefTotal)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Tapered allowance
                        </p>
                        <p className="text-2xl font-semibold">
                          {allowanceFormatter.format(results.taperedAllowance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Marriage allowance change
                        </p>
                        <p className="text-2xl font-semibold">
                          {allowanceFormatter.format(results.marriageDelta)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Resulting personal allowance
                        </p>
                        <p className="text-2xl font-semibold">
                          {allowanceFormatter.format(results.adjustedAllowance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Allowance lost vs standard
                        </p>
                        <p className="text-2xl font-semibold">
                          {allowanceFormatter.format(results.lostAllowance)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="personal-allowance-summary"
                          title="Personal Allowance Calculator Results"
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
                        Allowance Impact
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
                        <ResultBreakdownChart data={chartData} title="Personal Allowance Impact" />
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
                        This calculator provides an estimate based on current UK tax rules. Adjusted
                        net income calculations can be complex; always refer to{' '}
                        <a
                          href="https://www.gov.uk/guidance/adjusted-net-income"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline dark:text-indigo-400"
                        >
                          official HMRC guidance
                        </a>{' '}
                        for precise definitions.
                      </p>
                      <p>
                        Tax laws and thresholds can change with government budgets. Consult with a
                        qualified tax advisor for personalized advice.
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
