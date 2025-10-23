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
import { Calculator, Home, TrendingUp, Quote, BookOpen, Scale } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/mortgage-comparison-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-comparison-calculator';
const pageTitle = 'Mortgage Comparison Calculator UK | Compare Rates & Total Costs';
const metaDescription =
  'Use our UK mortgage comparison calculator to compare mortgage rates, view repayments side by side, and see the total cost of two mortgage deals before you decide.';
const keywords = getMappedKeywords('Mortgage Comparison Calculator');

const faqItems = [
  {
    question: 'Should I include lender fees?',
    answer:
      'Yes. Arrangement and valuation fees can significantly change the total cost. Enter each lender’s fees so the comparison is accurate.',
  },
  {
    question: 'How do I compare fixed and variable rates?',
    answer:
      'Use promotional rates for the fixed period and stress test variable rates with a higher figure. Refresh the comparison when you remortgage.',
  },
  {
    question: 'Can I model overpayments?',
    answer:
      'This basic comparison focuses on standard payments. To model overpayments, reduce the term or recalculate with a lower loan amount after your lump sum.',
  },
];

const emotionalMessage =
  'Comparing mortgage deals can save you thousands over the lifetime of your loan. Take the time to find the best fit for your financial future and secure your home with confidence.';
const emotionalQuote = {
  text: 'The best way to predict the future is to create it.',
  author: 'Peter Drucker',
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

const calculateRepayment = (amount, rate, termYears) => {
  const monthlyRate = rate / 100 / 12;
  const months = termYears * 12;
  if (amount <= 0 || months <= 0) return 0;
  if (monthlyRate === 0) return amount / months;
  return (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
};

const buildComparison = ({ loanAmount, termYears, mortgageA, mortgageB }) => {
  const paymentA = calculateRepayment(loanAmount, mortgageA.rate, termYears);
  const totalInterestA = paymentA * termYears * 12 - loanAmount;
  const totalCostA = loanAmount + totalInterestA + mortgageA.fees;

  const paymentB = calculateRepayment(loanAmount, mortgageB.rate, termYears);
  const totalInterestB = paymentB * termYears * 12 - loanAmount;
  const totalCostB = loanAmount + totalInterestB + mortgageB.fees;

  return {
    a: {
      payment: paymentA,
      interest: totalInterestA,
      fees: mortgageA.fees,
      totalCost: totalCostA,
    },
    b: {
      payment: paymentB,
      interest: totalInterestB,
      fees: mortgageB.fees,
      totalCost: totalCostB,
    },
    difference: {
      payment: paymentB - paymentA,
      totalCost: totalCostB - totalCostA,
    },
  };
};

function buildCsvData(comparison, inputs) {
  if (!comparison) return null;
  return [
    ['Metric', 'Mortgage A', 'Mortgage B', 'Difference (B - A)'],
    ['Loan Amount (£)', currencyFormatter.format(parseNumber(inputs.loanAmount)), '', ''],
    ['Term (Years)', inputs.termYears, '', ''],
    [],
    ['Interest Rate (%)', inputs.mortgageA.rate, inputs.mortgageB.rate, ''],
    [
      'Fees (£)',
      currencyFormatter.format(inputs.mortgageA.fees),
      currencyFormatter.format(inputs.mortgageB.fees),
      '',
    ],
    [],
    [
      'Monthly Payment (£)',
      currencyFormatter.format(comparison.a.payment),
      currencyFormatter.format(comparison.b.payment),
      currencyFormatter.format(comparison.difference.payment),
    ],
    [
      'Total Interest (£)',
      currencyFormatter.format(comparison.a.interest),
      currencyFormatter.format(comparison.b.interest),
      currencyFormatter.format(comparison.b.interest - comparison.a.interest),
    ],
    [
      'Total Cost (£)',
      currencyFormatter.format(comparison.a.totalCost),
      currencyFormatter.format(comparison.b.totalCost),
      currencyFormatter.format(comparison.difference.totalCost),
    ],
  ];
}

function buildChartData(comparison) {
  if (!comparison) return [];
  return [
    { name: 'Mortgage A Total Cost', value: comparison.a.totalCost, color: '#10b981' },
    { name: 'Mortgage B Total Cost', value: comparison.b.totalCost, color: '#3b82f6' },
  ].filter((segment) => segment.value > 0);
}

export default function MortgageComparisonCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: '250,000',
    termYears: '25',
    mortgageA: { rate: '4.2', fees: '999' },
    mortgageB: { rate: '5.1', fees: '0' },
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [comparison, setComparison] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Mortgage Comparison Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Mortgage Comparison Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (loanKey, field) => (event) => {
      const { value } = event.target;
      if (loanKey) {
        setInputs((prev) => ({
          ...prev,
          [loanKey]: { ...prev[loanKey], [field]: value },
        }));
      } else {
        setInputs((prev) => ({ ...prev, [field]: value }));
      }
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const parsedInputs = {
        loanAmount: parseNumber(inputs.loanAmount),
        termYears: parseNumber(inputs.termYears),
        mortgageA: {
          rate: parseNumber(inputs.mortgageA.rate),
          fees: parseNumber(inputs.mortgageA.fees),
        },
        mortgageB: {
          rate: parseNumber(inputs.mortgageB.rate),
          fees: parseNumber(inputs.mortgageB.fees),
        },
      };
      const computedComparison = buildComparison(parsedInputs);
      setComparison(computedComparison);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedComparison, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      loanAmount: '250,000',
      termYears: '25',
      mortgageA: { rate: '4.2', fees: '999' },
      mortgageB: { rate: '5.1', fees: '0' },
    });
    setHasCalculated(false);
    setComparison(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(comparison), [comparison]);

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
                Mortgage Comparison Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare two UK mortgage deals side by side. See monthly repayments, total interest,
              and the overall cost including lender fees to find the best option for you.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Home className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  <Scale
                    className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                    aria-hidden="true"
                  />
                  Mortgage Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan amount (£)</Label>
                      <Input
                        id="loanAmount"
                        inputMode="decimal"
                        value={inputs.loanAmount}
                        onChange={handleInputChange(null, 'loanAmount')}
                        placeholder="e.g. 250,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="numeric"
                        value={inputs.termYears}
                        onChange={handleInputChange(null, 'termYears')}
                        placeholder="e.g. 25"
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Mortgage A
                      </h2>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="mortgageA-rate">Interest rate (%)</Label>
                          <Input
                            id="mortgageA-rate"
                            inputMode="decimal"
                            value={inputs.mortgageA.rate}
                            onChange={handleInputChange('mortgageA', 'rate')}
                            placeholder="e.g. 4.2"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mortgageA-fees">Arrangement fees (£)</Label>
                          <Input
                            id="mortgageA-fees"
                            inputMode="decimal"
                            value={inputs.mortgageA.fees}
                            onChange={handleInputChange('mortgageA', 'fees')}
                            placeholder="e.g. 999"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
                      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Mortgage B
                      </h2>
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="mortgageB-rate">Interest rate (%)</Label>
                          <Input
                            id="mortgageB-rate"
                            inputMode="decimal"
                            value={inputs.mortgageB.rate}
                            onChange={handleInputChange('mortgageB', 'rate')}
                            placeholder="e.g. 5.1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="mortgageB-fees">Arrangement fees (£)</Label>
                          <Input
                            id="mortgageB-fees"
                            inputMode="decimal"
                            value={inputs.mortgageB.fees}
                            onChange={handleInputChange('mortgageB', 'fees')}
                            placeholder="e.g. 0"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Compare Mortgages
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
                    Enter the details for two mortgage options, then press{' '}
                    <span className="font-semibold">Compare Mortgages</span> to see a side-by-side
                    comparison of monthly payments and total costs.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && comparison && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Home
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Comparison Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Mortgage A Monthly Payment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(comparison.a.payment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Mortgage B Monthly Payment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(comparison.b.payment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Mortgage A Total Cost
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(comparison.a.totalCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Mortgage B Total Cost
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(comparison.b.totalCost)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Monthly Payment Difference (B - A)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(comparison.difference.payment)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Total Cost Difference (B - A)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(comparison.difference.totalCost)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="mortgage-comparison-results"
                          title="Mortgage Comparison Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Total Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading comparison chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart
                          data={chartData}
                          title="Mortgage Total Cost Comparison"
                        />
                      </Suspense>
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
