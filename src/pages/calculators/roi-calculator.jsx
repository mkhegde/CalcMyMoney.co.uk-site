import React, { useCallback, useMemo, useState, Suspense } from 'react';
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
import {
  Calculator,
  TrendingUp,
  LineChart,
  Coins,
  PieChart,
  BookOpen,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/roi-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/roi-calculator';
const pageTitle = 'ROI Calculator UK | Return on Investment & CAGR';
const metaDescription =
  'Work out return on investment (ROI), compound annual growth rate (CAGR), and investment multiples with our UK-focused ROI calculator.';
const keywords = getMappedKeywords('ROI Calculator');

const faqItems = [
  {
    question: 'How should I treat ongoing contributions?',
    answer:
      'Add the value of each top-up under additional contributions. For a money-weighted return such as XIRR, log the timing of each deposit in your spreadsheet and reconcile regularly.',
  },
  {
    question: 'What is a good ROI benchmark?',
    answer:
      'Compare your annualised return with a passive market tracker or the hurdle rate in your investment policy. Adjust for risk, inflation, and tax so that the ROI figures reflect your true opportunity cost.',
  },
  {
    question: 'Why is CAGR useful?',
    answer:
      'Compound annual growth rate smooths volatile performance into a single yearly figure, making it easier to compare investments of different lengths when presenting to clients or stakeholders.',
  },
];

const emotionalMessage =
  'Track every pound invested and every pound returned. This calculator helps you evidence success, refine underperforming projects, and stay accountable to your targets.';
const emotionalQuote = {
  text: 'Someone is sitting in the shade today because someone planted a tree a long time ago.',
  author: 'Warren Buffett',
};

const directoryLinks = [
  {
    url: '/#investing',
    label: 'Browse all investing calculators',
    description: 'Compare asset growth, risk, and opportunity cost across our full toolkit.',
  },
  {
    url: '/calculators/compound-interest-calculator',
    label: 'Compound Interest Calculator',
    description: 'Project savings growth with monthly contributions and inflation assumptions.',
  },
  {
    url: '/calculators/investment-calculator',
    label: 'Investment Growth Calculator',
    description: 'Model portfolio balances with blended rates, fees, and contribution changes.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const ratioPercentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const defaultInputs = {
  initialInvestment: '25,000',
  additionalContributions: '6,000',
  finalValue: '48,200',
  incomeReceived: '2,600',
  feesPaid: '750',
  holdingYears: '4',
  holdingMonths: '6',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateRoi = (inputs) => {
  const initialInvestment = Math.max(parseNumber(inputs.initialInvestment), 0);
  const additionalContributions = Math.max(parseNumber(inputs.additionalContributions), 0);
  const finalValue = Math.max(parseNumber(inputs.finalValue), 0);
  const incomeReceived = Math.max(parseNumber(inputs.incomeReceived), 0);
  const feesPaid = Math.max(parseNumber(inputs.feesPaid), 0);
  const holdingYears = Math.max(parseNumber(inputs.holdingYears), 0);
  const holdingMonths = Math.max(parseNumber(inputs.holdingMonths), 0);

  const totalInvested = initialInvestment + additionalContributions;
  const totalFees = feesPaid;
  const grossProceeds = finalValue + incomeReceived;
  const netProceeds = Math.max(grossProceeds - totalFees, 0);

  const totalOutlay = totalInvested + totalFees;
  const netGain = netProceeds - totalInvested;
  const roi = totalOutlay > 0 ? (netGain / totalOutlay) * 100 : 0;

  const totalHoldingYears = holdingYears + holdingMonths / 12;
  const annualisedReturn =
    totalHoldingYears > 0 && totalOutlay > 0 && netProceeds > 0
      ? Math.pow(netProceeds / totalOutlay, 1 / totalHoldingYears) - 1
      : 0;
  const simpleAnnualReturn = totalHoldingYears > 0 ? (roi / 100) / totalHoldingYears : 0;
  const investmentMultiple = totalOutlay > 0 ? netProceeds / totalOutlay : 0;
  const breakevenValue = totalOutlay;
  const incomeYield = totalOutlay > 0 ? incomeReceived / totalOutlay : 0;

  return {
    initialInvestment,
    additionalContributions,
    finalValue,
    incomeReceived,
    feesPaid,
    totalInvested,
    totalFees,
    grossProceeds,
    netProceeds,
    netGain,
    roi,
    annualisedReturn,
    simpleAnnualReturn,
    investmentMultiple,
    breakevenValue,
    incomeYield,
    holdingYears: totalHoldingYears,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  return [
    ['Input', 'Value'],
    ['Initial investment (£)', inputs.initialInvestment],
    ['Additional contributions (£)', inputs.additionalContributions],
    ['Final value (£)', inputs.finalValue],
    ['Income received (£)', inputs.incomeReceived],
    ['Fees paid (£)', inputs.feesPaid],
    ['Holding period (years)', `${inputs.holdingYears}`],
    ['Holding period (months)', `${inputs.holdingMonths}`],
    [],
    ['Output', 'Value'],
    ['Total invested (£)', currencyFormatter.format(results.totalInvested)],
    ['Total fees (£)', currencyFormatter.format(results.totalFees)],
    ['Net proceeds (£)', currencyFormatter.format(results.netProceeds)],
    ['Net gain (£)', currencyFormatter.format(results.netGain)],
    ['ROI (%)', `${percentFormatter.format(results.roi)}%`],
    ['Annualised return (%)', ratioPercentFormatter.format(results.annualisedReturn)],
    ['Simple annual return (%)', ratioPercentFormatter.format(results.simpleAnnualReturn)],
    ['Income yield (%)', ratioPercentFormatter.format(results.incomeYield)],
    ['Investment multiple (x)', results.investmentMultiple.toFixed(2)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    {
      name: 'Initial investment',
      value: results.initialInvestment,
      color: '#2563eb',
    },
    {
      name: 'Additional contributions',
      value: results.additionalContributions,
      color: '#0ea5e9',
    },
    {
      name: 'Fees paid',
      value: results.feesPaid,
      color: '#f97316',
    },
    {
      name: 'Income received',
      value: results.incomeReceived,
      color: '#10b981',
    },
    {
      name: 'Net gain',
      value: results.netGain,
      color: '#8b5cf6',
    },
  ].filter((segment) => segment.value > 0);
};

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'ROI Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Investing & Savings Calculators', url: '/calculators#investing' },
      { name: 'ROI Calculator', url: pagePath },
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
      const computed = calculateRoi(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
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
        keywords={keywords}
        articleTags={keywords}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                ROI Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Measure return on investment, income yield, and compound annual growth so you can
              compare projects, pitch to investors, and keep portfolios on track.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-sky-600 dark:text-sky-300"
            borderColor="border-sky-200 dark:border-sky-800/60"
            bgColor="bg-sky-50/70 dark:bg-sky-900/40"
            textColor="text-sky-900 dark:text-sky-100"
            footerColor="text-sky-700 dark:text-sky-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <PieChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Investment details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="initialInvestment">Initial investment (£)</Label>
                      <Input
                        id="initialInvestment"
                        inputMode="decimal"
                        value={inputs.initialInvestment}
                        onChange={handleInputChange('initialInvestment')}
                        placeholder="e.g. 25,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="additionalContributions">Additional contributions (£)</Label>
                      <Input
                        id="additionalContributions"
                        inputMode="decimal"
                        value={inputs.additionalContributions}
                        onChange={handleInputChange('additionalContributions')}
                        placeholder="e.g. 6,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="finalValue">Final value (£)</Label>
                      <Input
                        id="finalValue"
                        inputMode="decimal"
                        value={inputs.finalValue}
                        onChange={handleInputChange('finalValue')}
                        placeholder="e.g. 48,200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="incomeReceived">Income received (£)</Label>
                      <Input
                        id="incomeReceived"
                        inputMode="decimal"
                        value={inputs.incomeReceived}
                        onChange={handleInputChange('incomeReceived')}
                        placeholder="e.g. 2,600"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="feesPaid">Fees and costs (£)</Label>
                      <Input
                        id="feesPaid"
                        inputMode="decimal"
                        value={inputs.feesPaid}
                        onChange={handleInputChange('feesPaid')}
                        placeholder="e.g. 750"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="holdingYears">Years invested</Label>
                      <Input
                        id="holdingYears"
                        inputMode="decimal"
                        value={inputs.holdingYears}
                        onChange={handleInputChange('holdingYears')}
                        placeholder="e.g. 4"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="holdingMonths">Additional months invested</Label>
                    <Input
                      id="holdingMonths"
                      inputMode="numeric"
                      value={inputs.holdingMonths}
                      onChange={handleInputChange('holdingMonths')}
                      placeholder="e.g. 6"
                    />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate ROI
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter investment details and press <span className="font-semibold">Calculate ROI</span>
                    to view profit, yield, and CAGR results. Your data stays on this device.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-sky-200 bg-white shadow-sm dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-200" aria-hidden="true" />
                        ROI summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Total invested</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInvested)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Net proceeds</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netProceeds)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Net gain</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netGain)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">ROI</p>
                        <p className="text-2xl font-semibold">{percentFormatter.format(results.roi)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Investment multiple</p>
                        <p className="text-2xl font-semibold">{results.investmentMultiple.toFixed(2)}×</p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Income yield</p>
                        <p className="text-2xl font-semibold">
                          {ratioPercentFormatter.format(results.incomeYield)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="roi-calculation"
                          title="ROI Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        CAGR & holding insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Holding period (years)</span>
                        <span>{results.holdingYears.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Compound annual growth rate</span>
                        <span>{ratioPercentFormatter.format(results.annualisedReturn)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Simple annual return</span>
                        <span>{ratioPercentFormatter.format(results.simpleAnnualReturn)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Breakeven value</span>
                        <span>{currencyFormatter.format(results.breakevenValue)}</span>
                      </div>
                      <p>
                        CAGR smooths volatile returns so you can benchmark investments with different time
                        horizons. Use the breakeven value to test downside cases or stress a hurdle rate.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Contribution vs return mix
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
                        <ResultBreakdownChart data={chartData} title="ROI contribution breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        ROI does not reflect the timing of cash flows. For large irregular deposits or
                        withdrawals, supplement this tool with an internal rate of return (IRR) analysis.
                      </p>
                      <p>
                        Past performance does not guarantee future results. Update assumptions regularly and
                        factor in trading costs, taxes, and inflation when comparing investment options.
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
