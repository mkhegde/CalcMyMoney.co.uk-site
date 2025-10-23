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
import { Calculator, LineChart, Sigma, TrendingDown, Quote, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/present-value-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/present-value-calculator';
const pageTitle = 'Present Value Calculator UK | Discount Cash Flows & NPV';
const metaDescription =
  'Use our UK present value calculator to discount cash flows, calculate net present value (NPV), and compare investments with precision.';
const keywords = getMappedKeywords('Present Value Calculator');

const defaultInputs = {
  futureValue: '25,000',
  annualRate: '5.2',
  years: '4',
  compounding: '12',
  annuityPayment: '450',
  annuityYears: '6',
  initialInvestment: '18,000',
};

const defaultCashFlows = [
  { year: '1', amount: '6,500' },
  { year: '2', amount: '7,200' },
  { year: '3', amount: '7,600' },
  { year: '4', amount: '8,200' },
];

const presentValueFaqs = [
  {
    question: 'What discount rate should I use?',
    answer:
      'Pick a rate that reflects the opportunity cost of capital. For corporate projects that may be the weighted average cost of capital, while households often use the expected return of their next best alternative.',
  },
  {
    question: 'Can I assess uneven cash flows?',
    answer:
      'Yes. Edit both the year and cash flow amount fields to mirror real-world payments. The calculator discounts each entry back to today and reports the net present value instantly.',
  },
  {
    question: 'How is the present value of an annuity calculated?',
    answer:
      'The annuity calculation applies the standard discounting formula for equal payments at regular intervals. Adjust the compounding frequency to model monthly, quarterly, or annual receipts accurately.',
  },
];

const emotionalMessage =
  "Understanding the true value of money over time is a cornerstone of smart financial decisions. Use this calculator to bring future earnings and costs into today's perspective.";
const emotionalQuote = {
  text: 'Time is money.',
  author: 'Benjamin Franklin',
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

const formatNumber = (value, decimals = 2) =>
  Number.isFinite(value) ? Number(value).toFixed(decimals) : '0.00';

const calculatePresentValueMetrics = (inputValues, cashFlows) => {
  const futureValue = parseNumber(inputValues.futureValue);
  const annualRate = parseNumber(inputValues.annualRate) / 100;
  const compounding = Math.max(parseNumber(inputValues.compounding), 1);
  const years = parseNumber(inputValues.years);

  const periodicRate = annualRate / compounding;
  const totalPeriods = years * compounding;

  const discountFactor = periodicRate === 0 ? 1 : 1 / (1 + periodicRate) ** totalPeriods;
  const presentValue = futureValue * discountFactor;

  const effectiveAnnualRate =
    periodicRate === 0 ? annualRate : (1 + periodicRate) ** compounding - 1;

  const annuityPayment = parseNumber(inputValues.annuityPayment);
  const annuityYears = parseNumber(inputValues.annuityYears);
  const annuityPeriods = annuityYears * compounding;
  let annuityPresentValue = 0;
  if (annuityPayment > 0 && annuityPeriods > 0) {
    annuityPresentValue =
      periodicRate === 0
        ? annuityPayment * annuityPeriods
        : annuityPayment * ((1 - (1 + periodicRate) ** -annuityPeriods) / periodicRate);
  }

  const initialInvestment = parseNumber(inputValues.initialInvestment);
  let npv = -initialInvestment;
  let breakEvenYear = null;
  let cumulative = -initialInvestment;

  const discountedCashFlows = cashFlows.map((flow) => {
    const year = parseNumber(flow.year);
    const amount = parseNumber(flow.amount);
    const discounted = annualRate === 0 ? amount : amount / (1 + annualRate) ** year;
    cumulative += discounted;
    if (breakEvenYear === null && cumulative >= 0) {
      breakEvenYear = year;
    }
    npv += discounted;
    return {
      year,
      amount,
      discounted,
    };
  });

  return {
    presentValue,
    discountFactor,
    effectiveAnnualRate,
    annuityPresentValue,
    npv,
    discountedCashFlows,
    breakEvenYear,
  };
};

function buildCsvData(metrics, inputs, cashFlows) {
  if (!metrics) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Future Value (£)', currencyFormatter.format(parseNumber(inputs.futureValue))],
    ['Annual Discount Rate (%)', `${inputs.annualRate}%`],
    ['Years Until Payment', inputs.years],
    ['Compounding Frequency (per year)', inputs.compounding],
    [
      'Annuity Payment (£ per period)',
      currencyFormatter.format(parseNumber(inputs.annuityPayment)),
    ],
    ['Annuity Length (years)', inputs.annuityYears],
    ['Initial Investment (£)', currencyFormatter.format(parseNumber(inputs.initialInvestment))],
    [],
    ['Present Value (Lump Sum) (£)', currencyFormatter.format(metrics.presentValue)],
    ['Discount Factor', formatNumber(metrics.discountFactor, 4)],
    ['Effective Annual Rate (%)', `${formatNumber(metrics.effectiveAnnualRate * 100, 2)}%`],
    ['Present Value of Annuity (£)', currencyFormatter.format(metrics.annuityPresentValue)],
    ['Net Present Value (NPV) (£)', currencyFormatter.format(metrics.npv)],
    [
      'Break-Even Year',
      metrics.breakEvenYear !== null ? metrics.breakEvenYear : 'Beyond modelled horizon',
    ],
    [],
    ['Cash Flows'],
    ['Year', 'Amount (£)', 'Discounted (£)'],
    ...metrics.discountedCashFlows.map((flow) => [
      flow.year,
      currencyFormatter.format(flow.amount),
      currencyFormatter.format(flow.discounted),
    ]),
  ];
  return csvRows;
}

function buildChartData(metrics) {
  if (!metrics || !metrics.discountedCashFlows || metrics.discountedCashFlows.length === 0)
    return [];

  const chartData = metrics.discountedCashFlows.map((flow) => ({
    name: `Year ${flow.year}`,
    'Original Amount': flow.amount,
    'Discounted Value': flow.discounted,
  }));

  return chartData;
}

export default function PresentValueCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [cashFlows, setCashFlows] = useState(defaultCashFlows);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [metrics, setMetrics] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Present Value Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Savings & Investments Calculators', url: '/calculators#savings-investments' },
      { name: 'Present Value Calculator', url: pagePath },
    ],
    faq: presentValueFaqs,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleCashFlowChange = useCallback((index, field, value) => {
    setCashFlows((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }, []);

  const handleAddCashFlow = useCallback(() => {
    setCashFlows((prev) => [...prev, { year: '', amount: '' }]);
  }, []);

  const handleRemoveCashFlow = useCallback((index) => {
    setCashFlows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computedMetrics = calculatePresentValueMetrics(inputs, cashFlows);
      setMetrics(computedMetrics);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedMetrics, inputs, cashFlows));
    },
    [inputs, cashFlows]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setCashFlows(defaultCashFlows);
    setHasCalculated(false);
    setMetrics(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(metrics), [metrics]);

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
                Present Value Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Discount cash flows, calculate net present value (NPV), and compare investments with
              precision.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Sigma className="h-4 w-4 shrink-0" aria-hidden="true" />}
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
                  Valuation Inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="futureValue">Future value (£)</Label>
                      <Input
                        id="futureValue"
                        inputMode="decimal"
                        value={inputs.futureValue}
                        onChange={handleInputChange('futureValue')}
                        placeholder="e.g. 25,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRate">Annual discount rate (%)</Label>
                      <Input
                        id="annualRate"
                        inputMode="decimal"
                        value={inputs.annualRate}
                        onChange={handleInputChange('annualRate')}
                        placeholder="e.g. 5.2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years">Years until payment</Label>
                      <Input
                        id="years"
                        inputMode="decimal"
                        value={inputs.years}
                        onChange={handleInputChange('years')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compounding">Compounding frequency (per year)</Label>
                      <Input
                        id="compounding"
                        inputMode="numeric"
                        value={inputs.compounding}
                        onChange={handleInputChange('compounding')}
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annuityPayment">Annuity payment (£ per period)</Label>
                      <Input
                        id="annuityPayment"
                        inputMode="decimal"
                        value={inputs.annuityPayment}
                        onChange={handleInputChange('annuityPayment')}
                        placeholder="e.g. 450"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annuityYears">Annuity length (years)</Label>
                      <Input
                        id="annuityYears"
                        inputMode="decimal"
                        value={inputs.annuityYears}
                        onChange={handleInputChange('annuityYears')}
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialInvestment">Initial investment (£)</Label>
                      <Input
                        id="initialInvestment"
                        inputMode="decimal"
                        value={inputs.initialInvestment}
                        onChange={handleInputChange('initialInvestment')}
                        placeholder="e.g. 18,000"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-md font-semibold text-slate-900 dark:text-slate-100">
                      Cash Flows
                    </h3>
                    {cashFlows.map((flow, index) => (
                      <div key={`flow-${index}`} className="flex items-end gap-2">
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`flow-year-${index}`}>Year</Label>
                          <Input
                            id={`flow-year-${index}`}
                            inputMode="numeric"
                            value={flow.year}
                            onChange={(event) =>
                              handleCashFlowChange(index, 'year', event.target.value)
                            }
                            placeholder="e.g. 1"
                          />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Label htmlFor={`flow-amount-${index}`}>Amount (£)</Label>
                          <Input
                            id={`flow-amount-${index}`}
                            inputMode="decimal"
                            value={flow.amount}
                            onChange={(event) =>
                              handleCashFlowChange(index, 'amount', event.target.value)
                            }
                            placeholder="e.g. 6,500"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => handleRemoveCashFlow(index)}
                          className="shrink-0"
                        >
                          -
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={handleAddCashFlow}
                      variant="outline"
                      className="w-full"
                    >
                      Add Cash Flow
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Present Value
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
                    Enter your future values, discount rates, and cash flows, then press{' '}
                    <span className="font-semibold">Calculate Present Value</span> to see the
                    discounted values and net present value.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && metrics && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sigma
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Key Valuation Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Present value (lump sum)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(metrics.presentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Present value of annuity
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(metrics.annuityPresentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Net present value (NPV)
                        </p>
                        <p
                          className={`text-2xl font-semibold ${
                            metrics.npv >= 0
                              ? 'text-emerald-600 dark:text-emerald-300'
                              : 'text-rose-600 dark:text-rose-300'
                          }`}
                        >
                          {currencyFormatter.format(metrics.npv)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Effective annual rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatNumber(metrics.effectiveAnnualRate * 100, 2)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="present-value-analysis"
                          title="Present Value Calculator Results"
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
                        Discounted Cash Flow Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Discounted Cash Flows" />
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
                        This calculator provides a financial estimate. Actual returns and values can
                        vary based on market conditions, inflation, and other economic factors.
                      </p>
                      <p>
                        For complex investment decisions, consult with a qualified financial
                        advisor.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={presentValueFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
</div>
      </CalculatorWrapper>
    </div>
  );
}
