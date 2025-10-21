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
import { Calculator, Clock, Wallet, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/overtime-bonus-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/overtime-bonus-calculator';
const pageTitle = 'Overtime & Bonus Calculator UK | Extra Pay & Net Income';
const metaDescription =
  'Use our UK overtime and bonus calculator to plan extra pay, compare scenarios, and project your take-home pay after tax.';
const keywords = getMappedKeywords('Overtime & Bonus Calculator');

const faqItems = [
  {
    question: 'How do I calculate overtime pay?',
    answer:
      'Multiply overtime hours by the hourly rate and overtime multiplier (e.g. 1.5x). The calculator does this automatically and adds bonuses on top.',
  },
  {
    question: 'Can I account for tax?',
    answer:
      'This version outputs gross overtime and bonus. Apply your marginal tax rate to estimate net take-home pay. We highlight the required marginal rate input for quick estimates.',
  },
  {
    question: 'How often should I update overtime assumptions?',
    answer:
      'Review monthly or after new rotas are published. Keeping the calculator current ensures you hit savings targets and anticipate higher tax bands.',
  },
];

const emotionalMessage =
  'Every extra hour and bonus earned contributes to your financial goals. Use this calculator to clearly see the impact of your hard work on your take-home pay.';
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

const calculateOvertimeBonus = ({
  hourlyRate,
  standardHours,
  overtimeHours,
  overtimeMultiplier,
  annualBonus,
  marginalTaxRate,
}) => {
  const parsedHourlyRate = parseNumber(hourlyRate);
  const parsedStandardHours = parseNumber(standardHours);
  const parsedOvertimeHours = parseNumber(overtimeHours);
  const parsedOvertimeMultiplier = parseNumber(overtimeMultiplier);
  const parsedAnnualBonus = parseNumber(annualBonus);
  const parsedMarginalTaxRate = parseNumber(marginalTaxRate);

  const baseMonthlyPay = parsedHourlyRate * parsedStandardHours * (52 / 12); // Convert weekly to monthly
  const overtimePay = parsedHourlyRate * parsedOvertimeMultiplier * parsedOvertimeHours * (52 / 12);
  const monthlyBonus = parsedAnnualBonus / 12;

  const grossMonthly = baseMonthlyPay + overtimePay + monthlyBonus;
  const grossAnnual = grossMonthly * 12;
  const estimatedNetMonthly = grossMonthly * (1 - parsedMarginalTaxRate / 100);
  const estimatedNetAnnual = estimatedNetMonthly * 12;

  return {
    baseMonthlyPay,
    overtimePay,
    monthlyBonus,
    grossMonthly,
    grossAnnual,
    estimatedNetMonthly,
    estimatedNetAnnual,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  return [
    ['Metric', 'Value'],
    ['Hourly Rate (£)', currencyFormatter.format(parseNumber(inputs.hourlyRate))],
    ['Standard Hours/Week', inputs.standardHours],
    ['Overtime Hours/Week', inputs.overtimeHours],
    ['Overtime Multiplier (x)', inputs.overtimeMultiplier],
    ['Annual Bonus (£)', currencyFormatter.format(parseNumber(inputs.annualBonus))],
    ['Marginal Tax Rate (%)', `${inputs.marginalTaxRate}%`],
    [],
    ['Gross Monthly Pay (£)', currencyFormatter.format(results.grossMonthly)],
    ['Gross Annual Pay (£)', currencyFormatter.format(results.grossAnnual)],
    ['Estimated Net Monthly Pay (£)', currencyFormatter.format(results.estimatedNetMonthly)],
    ['Estimated Net Annual Pay (£)', currencyFormatter.format(results.estimatedNetAnnual)],
    ['Base Monthly Pay (£)', currencyFormatter.format(results.baseMonthlyPay)],
    ['Overtime Pay (£)', currencyFormatter.format(results.overtimePay)],
    ['Monthly Bonus (£)', currencyFormatter.format(results.monthlyBonus)],
  ];
}

function buildChartData(results) {
  if (!results) return [];
  return [
    { name: 'Base Pay', value: results.baseMonthlyPay, color: '#10b981' },
    { name: 'Overtime Pay', value: results.overtimePay, color: '#3b82f6' },
    { name: 'Monthly Bonus', value: results.monthlyBonus, color: '#f97316' },
  ].filter((segment) => segment.value > 0);
}

export default function OvertimeBonusCalculatorPage() {
  const [inputs, setInputs] = useState({
    hourlyRate: '18',
    standardHours: '37.5',
    overtimeHours: '6',
    overtimeMultiplier: '1.5',
    annualBonus: '3,000',
    marginalTaxRate: '32',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Overtime & Bonus Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Calculators', url: '/calculators#tax-income' },
      { name: 'Overtime & Bonus Calculator', url: pagePath },
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
      const computedResults = calculateOvertimeBonus(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      hourlyRate: '18',
      standardHours: '37.5',
      overtimeHours: '6',
      overtimeMultiplier: '1.5',
      annualBonus: '3,000',
      marginalTaxRate: '32',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Overtime & Bonus Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate extra earnings from overtime shifts and bonuses, and see the potential net
              pay impact based on your marginal tax rate.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-purple-600 dark:text-purple-300"
            borderColor="border-purple-200 dark:border-purple-800/60"
            bgColor="bg-purple-50/70 dark:bg-purple-950/40"
            textColor="text-purple-900 dark:text-purple-100"
            footerColor="text-purple-700 dark:text-purple-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-purple-600 dark:text-purple-300"
                    aria-hidden="true"
                  />
                  Pay Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate" className="text-sm font-medium">
                        Hourly rate (£)
                      </Label>
                      <Input
                        id="hourlyRate"
                        inputMode="decimal"
                        value={inputs.hourlyRate}
                        onChange={handleInputChange('hourlyRate')}
                        placeholder="e.g. 18"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="standardHours">Standard hours/week</Label>
                      <Input
                        id="standardHours"
                        inputMode="decimal"
                        value={inputs.standardHours}
                        onChange={handleInputChange('standardHours')}
                        placeholder="e.g. 37.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeHours">Overtime hours/week</Label>
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
                      <Label htmlFor="annualBonus">Annual bonus (£)</Label>
                      <Input
                        id="annualBonus"
                        inputMode="decimal"
                        value={inputs.annualBonus}
                        onChange={handleInputChange('annualBonus')}
                        placeholder="e.g. 3,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marginalTaxRate">Marginal tax rate (%)</Label>
                      <Input
                        id="marginalTaxRate"
                        inputMode="decimal"
                        value={inputs.marginalTaxRate}
                        onChange={handleInputChange('marginalTaxRate')}
                        placeholder="e.g. 32"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Pay
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
                    Enter your hourly rate, hours, and any bonus, then press{' '}
                    <span className="font-semibold">Calculate Pay</span> to see your estimated gross
                    and net earnings.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-purple-200 bg-white shadow-sm dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet
                          className="h-5 w-5 text-purple-600 dark:text-purple-200"
                          aria-hidden="true"
                        />
                        Earnings Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">
                          Gross monthly
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossMonthly)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">Gross annual</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossAnnual)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">
                          Estimated net monthly
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.estimatedNetMonthly)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">
                          Estimated net annual
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.estimatedNetAnnual)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="overtime-bonus-earnings"
                          title="Overtime & Bonus Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-purple-600 dark:text-purple-300"
                          aria-hidden="true"
                        />
                        Earnings Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Overtime & Bonus Breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-purple-600 dark:text-purple-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        The estimated net pay uses a simplified marginal tax rate. Your actual
                        take-home pay may vary based on your full tax code, National Insurance, and
                        any other deductions.
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
