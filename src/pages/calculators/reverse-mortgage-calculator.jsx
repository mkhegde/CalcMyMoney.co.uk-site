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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Landmark, HandCoins, LifeBuoy, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/reverse-mortgage-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/reverse-mortgage-calculator';
const pageTitle = 'Reverse Mortgage Calculator UK | Equity Release & Lifetime Mortgage';
const metaDescription =
  'Estimate equity release from a UK lifetime mortgage by modelling property value, age, loan-to-value limits, fees, drawdown, and future interest to see remaining equity.';
const keywords = getMappedKeywords('Reverse Mortgage Calculator');

const faqItems = [
  {
    question: 'What influences reverse mortgage amounts?',
    answer:
      'Lenders consider borrower age, property value, loan-to-value caps, and interest rates. Older borrowers and higher-value homes can unlock larger amounts.',
  },
  {
    question: 'How is interest charged on a reverse mortgage?',
    answer:
      'Interest accrues on the outstanding balance and compounds over time. Repayment usually happens when the property is sold or the borrower moves into long-term care.',
  },
  {
    question: 'What fees are associated with equity release?',
    answer:
      'Expect valuation, advice, arrangement, and legal fees. Include these in the calculator to understand the true net release.',
  },
];

const emotionalMessage =
  'Understand exactly how equity release affects your finances. Model the net cash available today and how much equity remains for the future.';
const emotionalQuote = {
  text: 'Planning is bringing the future into the present so that you can do something about it now.',
  author: 'Alan Lakein',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const ltvByAge = (age) => {
  if (age < 55) return 0;
  if (age >= 85) return 0.5;
  return 0.25 + Math.max(0, (age - 55) / 100);
};

const calculateReverseMortgage = (inputs) => {
  const propertyValue = Math.max(parseNumber(inputs.propertyValue), 0);
  const existingMortgage = Math.max(parseNumber(inputs.existingMortgage), 0);
  const borrowerAge = Math.max(parseNumber(inputs.borrowerAge), 0);
  const interestRate = Math.max(parseNumber(inputs.interestRate), 0) / 100;
  const arrangementFees = Math.max(parseNumber(inputs.arrangementFees), 0);
  const legalFees = Math.max(parseNumber(inputs.legalFees), 0);
  const monthlyDrawdown = Math.max(parseNumber(inputs.monthlyDrawdown), 0);
  const yearsProjection = Math.max(parseNumber(inputs.yearsProjection), 0);

  const maxLtv = ltvByAge(borrowerAge);
  const grossFacility = propertyValue * maxLtv;
  const netInitialRelease = Math.max(0, grossFacility - existingMortgage - arrangementFees - legalFees);
  const annualDrawdown = monthlyDrawdown * 12;
  let projectedDebt = grossFacility;
  for (let year = 1; year <= yearsProjection; year += 1) {
    projectedDebt += annualDrawdown;
    projectedDebt += projectedDebt * interestRate;
  }
  const remainingEquity = Math.max(propertyValue - projectedDebt, 0);

  return {
    propertyValue,
    existingMortgage,
    borrowerAge,
    interestRate,
    arrangementFees,
    legalFees,
    monthlyDrawdown,
    yearsProjection,
    maxLtv,
    grossFacility,
    netInitialRelease,
    projectedDebt,
    remainingEquity,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Property value (£)', inputs.propertyValue],
    ['Existing mortgage (£)', inputs.existingMortgage],
    ['Borrower age', inputs.borrowerAge],
    ['Interest rate (% p.a.)', inputs.interestRate],
    ['Arrangement fees (£)', inputs.arrangementFees],
    ['Legal fees (£)', inputs.legalFees],
    ['Monthly drawdown (£)', inputs.monthlyDrawdown],
    ['Projection horizon (years)', inputs.yearsProjection],
    [],
    ['Output', 'Value'],
    ['Maximum LTV (%)', (results.maxLtv * 100).toFixed(1)],
    ['Gross facility (£)', currencyFormatter.format(results.grossFacility)],
    ['Net initial release (£)', currencyFormatter.format(results.netInitialRelease)],
    ['Projected debt (£)', currencyFormatter.format(results.projectedDebt)],
    ['Remaining equity (£)', currencyFormatter.format(results.remainingEquity)],
  ];
};

const chartPalette = ['#3b82f6', '#f97316', '#10b981'];

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Net initial release', value: results.netInitialRelease, color: chartPalette[0] },
    { name: 'Projected debt', value: results.projectedDebt, color: chartPalette[1] },
    { name: 'Remaining equity', value: results.remainingEquity, color: chartPalette[2] },
  ].filter((segment) => segment.value > 0);
};

const defaultInputs = {
  propertyValue: '400,000',
  existingMortgage: '50,000',
  borrowerAge: '68',
  interestRate: '5.5',
  arrangementFees: '1,500',
  legalFees: '1,000',
  monthlyDrawdown: '0',
  yearsProjection: '15',
};

export default function ReverseMortgageCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Reverse Mortgage Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Retirement & Pension Calculators', url: '/calculators#retirement-pensions' },
      { name: 'Reverse Mortgage Calculator', url: pagePath },
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
      const computed = calculateReverseMortgage(inputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/10 text-purple-700 dark:bg-purple-500/20 dark:text-purple-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Reverse Mortgage Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate how much tax-free cash could be released from your home and how the balance grows over time with a lifetime mortgage.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Landmark className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-purple-600 dark:text-purple-300"
            borderColor="border-purple-200 dark:border-purple-800/60"
            bgColor="bg-purple-50/70 dark:bg-purple-950/40"
            textColor="text-purple-900 dark:text-purple-100"
            footerColor="text-purple-700 dark:text-purple-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Landmark className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                  Property & loan details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="propertyValue">Property value (£)</Label>
                      <Input
                        id="propertyValue"
                        inputMode="decimal"
                        value={inputs.propertyValue}
                        onChange={handleInputChange('propertyValue')}
                        placeholder="e.g. 400,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="existingMortgage">Existing mortgage (£)</Label>
                      <Input
                        id="existingMortgage"
                        inputMode="decimal"
                        value={inputs.existingMortgage}
                        onChange={handleInputChange('existingMortgage')}
                        placeholder="e.g. 50,000"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="borrowerAge">Borrower age</Label>
                      <Input
                        id="borrowerAge"
                        inputMode="decimal"
                        value={inputs.borrowerAge}
                        onChange={handleInputChange('borrowerAge')}
                        placeholder="e.g. 68"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest rate (% p.a.)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 5.5"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="arrangementFees">Arrangement fees (£)</Label>
                      <Input
                        id="arrangementFees"
                        inputMode="decimal"
                        value={inputs.arrangementFees}
                        onChange={handleInputChange('arrangementFees')}
                        placeholder="e.g. 1,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="legalFees">Legal fees (£)</Label>
                      <Input
                        id="legalFees"
                        inputMode="decimal"
                        value={inputs.legalFees}
                        onChange={handleInputChange('legalFees')}
                        placeholder="e.g. 1,000"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyDrawdown">Monthly drawdown (£)</Label>
                      <Input
                        id="monthlyDrawdown"
                        inputMode="decimal"
                        value={inputs.monthlyDrawdown}
                        onChange={handleInputChange('monthlyDrawdown')}
                        placeholder="e.g. 0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsProjection">Projection horizon (years)</Label>
                      <Input
                        id="yearsProjection"
                        inputMode="decimal"
                        value={inputs.yearsProjection}
                        onChange={handleInputChange('yearsProjection')}
                        placeholder="e.g. 15"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate equity release
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
                    Enter property and loan details, then press <span className="font-semibold">Calculate equity release</span> to see the cash available today and projected balance later.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-purple-200 bg-white shadow-sm dark:border-purple-900 dark:bg-purple-900/30 dark:text-purple-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <HandCoins className="h-5 w-5 text-purple-600 dark:text-purple-200" aria-hidden="true" />
                        Equity release summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">Maximum LTV</p>
                        <p className="text-2xl font-semibold">{(results.maxLtv * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">Gross facility</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.grossFacility)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">Net initial release</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.netInitialRelease)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">Projected debt ({results.yearsProjection} yrs)</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.projectedDebt)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-purple-900 dark:text-purple-200">Remaining equity ({results.yearsProjection} yrs)</p>
                        <p className="text-2xl font-semibold">{currencyFormatter.format(results.remainingEquity)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="reverse-mortgage-analysis"
                          title="Reverse Mortgage Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                        Balance outlook
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
                        <ResultBreakdownChart data={chartData} title="Reverse mortgage balance vs equity" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LifeBuoy className="h-5 w-5 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                        Safeguards & advice
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Speak with an FCA-regulated adviser to compare lifetime mortgages, confirm eligibility, and review any early repayment charges or voluntary payment options.
                      </p>
                      <p>
                        Share plans with family members—equity release reduces the estate available to beneficiaries. Use the projections to manage expectations.
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
