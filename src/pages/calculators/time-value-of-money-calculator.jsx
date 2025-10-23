import React, { useCallback, useMemo, useState, Suspense } from 'react';
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
import { Calculator, Sigma, TrendingUp, Layers3 } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/time-value-of-money-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/time-value-of-money-calculator';
const pageTitle = 'Time Value of Money Calculator UK | Present & Future Value';
const metaDescription =
  'Discount or project cash flows with the UK-focused time value of money calculator. Solve for present value, future value, or annuity outcomes.';
const keywords = getMappedKeywords('Time Value of Money Calculator');

const faqItems = [
  {
    question: 'How does compounding frequency affect the result?',
    answer:
      'Increasing compounding frequency boosts the effective annual rate, so future values grow faster and present values shrink. Switch between annual, quarterly, and monthly assumptions to see the sensitivity.',
  },
  {
    question: 'Can I solve for a missing value?',
    answer:
      'Yes. Leave present value or future value blank to solve for it. You can also enter a payment amount to model an annuity—toggle the payment timing to test end-of-period or beginning-of-period cash flows.',
  },
  {
    question: 'What discount rate should I use?',
    answer:
      'Choose a rate that reflects your opportunity cost or hurdle rate. UK households might use the expected return of an ISA, while businesses often choose the weighted average cost of capital (WACC).',
  },
];

const emotionalMessage =
  'When you quantify the value of money over time, long-term decisions become clearer. Compare scenarios side by side and focus on the plan that compounds in your favour.';
const emotionalQuote = {
  text: 'The power of compound interest is the eighth wonder of the world.',
  author: 'Albert Einstein (attributed)',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const defaultInputs = {
  presentValue: '15,000',
  futureValue: '22,000',
  rate: '5.5',
  years: '6',
  compoundsPerYear: '12',
  paymentPerPeriod: '0',
  paymentTiming: 'end',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const toNumberOrNull = (value) => {
  if (value === null || value === undefined) return null;
  const trimmed = String(value).trim();
  if (trimmed === '') return null;
  const numeric = parseNumber(trimmed);
  return Number.isFinite(numeric) ? numeric : null;
};

const calculateTimeValue = (inputs) => {
  const presentValueInput = toNumberOrNull(inputs.presentValue);
  const futureValueInput = toNumberOrNull(inputs.futureValue);
  const rateInput = toNumberOrNull(inputs.rate);
  const yearsInput = toNumberOrNull(inputs.years);
  const compoundsInput = toNumberOrNull(inputs.compoundsPerYear);
  const paymentInput = toNumberOrNull(inputs.paymentPerPeriod);
  const paymentTiming = inputs.paymentTiming === 'beginning' ? 'beginning' : 'end';

  const periodsPerYear = Math.max(compoundsInput ?? 1, 1);
  const totalPeriods = Math.max(Math.round((yearsInput ?? 0) * periodsPerYear), 0);
  const periodicRate = ((rateInput ?? 0) / 100) / periodsPerYear;
  const paymentPerPeriod = paymentInput ?? 0;
  const isDue = paymentTiming === 'beginning';

  const pow = (base, exponent) => {
    if (Number.isNaN(base) || Number.isNaN(exponent)) return 0;
    return base ** exponent;
  };

  const growthFactor = pow(1 + periodicRate, totalPeriods);
  const annuityFactor = periodicRate === 0 ? totalPeriods : (growthFactor - 1) / periodicRate;
  const dueAdjustment = isDue ? 1 + periodicRate : 1;

  let presentValue = presentValueInput ?? 0;
  let futureValue = futureValueInput ?? 0;
  let solvedRate = periodicRate;
  let solvedPeriods = totalPeriods;

  if (presentValueInput === null && futureValueInput !== null) {
    presentValue = futureValue / Math.max(growthFactor, 1);
    if (paymentPerPeriod !== 0) {
      presentValue -= (paymentPerPeriod * dueAdjustment * annuityFactor) / Math.max(growthFactor, 1);
    }
  } else if (futureValueInput === null && presentValueInput !== null) {
    futureValue = presentValue * growthFactor + paymentPerPeriod * dueAdjustment * annuityFactor;
  } else if (rateInput === null && presentValueInput !== null && futureValueInput !== null && totalPeriods > 0) {
    solvedRate = pow(futureValue / Math.max(presentValue, 1e-9), 1 / totalPeriods) - 1;
  } else if (yearsInput === null && presentValueInput !== null && futureValueInput !== null && solvedRate !== 0) {
    solvedPeriods = Math.log(futureValue / Math.max(presentValue, 1e-9)) / Math.log(1 + solvedRate);
  } else {
    // Default scenario: compute future value based on supplied inputs.
    futureValue = presentValue * growthFactor + paymentPerPeriod * dueAdjustment * annuityFactor;
  }

  const effectiveAnnualRate = solvedRate > -1 ? pow(1 + solvedRate, periodsPerYear) - 1 : solvedRate;
  const actualPeriods = yearsInput === null ? solvedPeriods : totalPeriods;
  const totalContributions = paymentPerPeriod * actualPeriods * (isDue ? 1 : 1);
  const interestEarned = futureValue - (presentValue + totalContributions);

  return {
    presentValue,
    futureValue,
    periodicRate: solvedRate,
    effectiveAnnualRate,
    totalPeriods: actualPeriods,
    paymentPerPeriod,
    paymentTiming,
    totalContributions,
    interestEarned,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  return [
    ['Input', 'Value'],
    ['Present value (£)', inputs.presentValue || ''],
    ['Future value (£)', inputs.futureValue || ''],
    ['Annual rate (%)', inputs.rate || ''],
    ['Years', inputs.years || ''],
    ['Compounds per year', inputs.compoundsPerYear || ''],
    ['Payment per period (£)', inputs.paymentPerPeriod || ''],
    ['Payment timing', inputs.paymentTiming === 'beginning' ? 'Beginning of period' : 'End of period'],
    [],
    ['Output', 'Value'],
    ['Present value (£)', currencyFormatter.format(results.presentValue)],
    ['Future value (£)', currencyFormatter.format(results.futureValue)],
    ['Total periods', results.totalPeriods.toFixed(2)],
    ['Effective annual rate (%)', `${percentFormatter.format(results.effectiveAnnualRate * 100)}%`],
    ['Periodic rate (%)', `${percentFormatter.format(results.periodicRate * 100)}%`],
    ['Total contributions (£)', currencyFormatter.format(results.totalContributions)],
    ['Interest / growth (£)', currencyFormatter.format(results.interestEarned)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Present value', value: Math.abs(results.presentValue), color: '#0ea5e9' },
    { name: 'Total contributions', value: Math.max(results.totalContributions, 0), color: '#6366f1' },
    { name: 'Interest / growth', value: Math.max(results.interestEarned, 0), color: '#10b981' },
  ].filter((item) => item.value > 0);
};

export default function TimeValueOfMoneyCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Time Value of Money Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Investing & Savings Calculators', url: '/calculators#investing' },
      { name: 'Time Value of Money Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
      setHasCalculated(false);
      setResults(null);
      setCsvData(null);
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateTimeValue(inputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Time Value of Money Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Discount or project cash flows, compare annuity scenarios, and reveal the effective annual
              rate driving your investment decisions.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Sigma className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-900/40"
            textColor="text-indigo-900 dark:text-indigo-50"
            footerColor="text-indigo-700 dark:text-indigo-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <Card className="border border-indigo-200 bg-white dark:border-indigo-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers3 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Cash flow inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="presentValue">Present value (£)</Label>
                      <Input
                        id="presentValue"
                        inputMode="decimal"
                        value={inputs.presentValue}
                        onChange={handleInputChange('presentValue')}
                        placeholder="Leave blank to solve"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="futureValue">Future value (£)</Label>
                      <Input
                        id="futureValue"
                        inputMode="decimal"
                        value={inputs.futureValue}
                        onChange={handleInputChange('futureValue')}
                        placeholder="Leave blank to solve"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rate">Annual interest / discount rate (%)</Label>
                      <Input
                        id="rate"
                        inputMode="decimal"
                        value={inputs.rate}
                        onChange={handleInputChange('rate')}
                        placeholder="e.g. 5.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years">Years</Label>
                      <Input
                        id="years"
                        inputMode="decimal"
                        value={inputs.years}
                        onChange={handleInputChange('years')}
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="compoundsPerYear">Compounds per year</Label>
                      <Input
                        id="compoundsPerYear"
                        inputMode="decimal"
                        value={inputs.compoundsPerYear}
                        onChange={handleInputChange('compoundsPerYear')}
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentPerPeriod">Payment per period (£)</Label>
                      <Input
                        id="paymentPerPeriod"
                        inputMode="decimal"
                        value={inputs.paymentPerPeriod}
                        onChange={handleInputChange('paymentPerPeriod')}
                        placeholder="e.g. 200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="paymentTiming">Payment timing</Label>
                      <select
                        id="paymentTiming"
                        value={inputs.paymentTiming}
                        onChange={handleInputChange('paymentTiming')}
                        className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                      >
                        <option value="end">End of period</option>
                        <option value="beginning">Beginning of period</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate cash flow value
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
                    Provide the values you know and leave the unknown blank. Press
                    <span className="font-semibold"> Calculate cash flow value</span> to solve the missing
                    figure and reveal the effective annual rate.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Valuation summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-100">Present value</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.presentValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-100">Future value</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.futureValue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-100">Total periods</p>
                        <p className="text-2xl font-semibold">{results.totalPeriods.toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-100">Effective annual rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.effectiveAnnualRate * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-100">Periodic rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.periodicRate * 100)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="time-value-of-money-calculation"
                          title="Time Value of Money Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Sigma className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Cash flow insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Total contributions</span>
                        <span>{currencyFormatter.format(results.totalContributions)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Interest / growth</span>
                        <span>{currencyFormatter.format(results.interestEarned)}</span>
                      </div>
                      <p>
                        Payments are scheduled at the {results.paymentTiming === 'beginning' ? 'beginning' : 'end'} of each
                        period. Adjust this setting to understand the impact of advance payments or rent
                        received in arrears.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Value composition
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
                        <ResultBreakdownChart data={chartData} title="Present vs future value" />
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
