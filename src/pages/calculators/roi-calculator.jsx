import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, PieChart, PiggyBank, Sigma } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'roi calculator',
  'return on investment formula',
  'investment return calculator',
  'return calculator',
  'cagr calculator',
  'roi formula',
  'annual rate of return calculator',
  'investment calculator',
];

const metaDescription =
  'Use our ROI calculator with the return on investment formula and investment return calculator outputs to measure profit, CAGR, and annualised returns.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/roi-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const defaultInputs = {
  initialInvestment: 25000,
  additionalContributions: 6000,
  finalValue: 48200,
  incomeReceived: 2600,
  feesPaid: 750,
  holdingYears: 4,
  holdingMonths: 6,
};

const roiFaqs = [
  {
    question: 'How should I treat ongoing contributions?',
    answer:
      'Add the total value of ongoing top-ups under additional contributions. For precise money-weighted returns, track the timing of each cash flow separately or use XIRR within your spreadsheet.',
  },
  {
    question: 'What is a good ROI benchmark?',
    answer:
      'Compare the annualised return with your target asset allocation or a simple global tracker fund. Factor in risk, inflation, and tax so the investment calculator output reflects your real opportunity cost.',
  },
  {
    question: 'Why is CAGR useful?',
    answer:
      'Compound annual growth rate smooths volatile returns into a single annual figure, making it easier to compare investments of different lengths. Use the CAGR result when pitching to stakeholders or reviewing mandates.',
  },
];

const calculateRoi = ({
  initialInvestment,
  additionalContributions,
  finalValue,
  incomeReceived,
  feesPaid,
  holdingYears,
  holdingMonths,
}) => {
  const totalInvested = Math.max(initialInvestment, 0) + Math.max(additionalContributions, 0);
  const totalFees = Math.max(feesPaid, 0);
  const grossProceeds = Math.max(finalValue, 0) + Math.max(incomeReceived, 0);
  const netProceeds = grossProceeds - totalFees;

  const totalOutlay = totalInvested + totalFees;
  const netGain = netProceeds - totalInvested;
  const roi = totalOutlay > 0 ? netGain / totalOutlay : 0;

  const holdingPeriodYears =
    Math.max(holdingYears, 0) + Math.max(holdingMonths, 0) / 12;

  const annualisedReturn =
    holdingPeriodYears > 0 && totalOutlay > 0 && netProceeds > 0
      ? Math.pow(netProceeds / totalOutlay, 1 / holdingPeriodYears) - 1
      : 0;

  const simpleAnnualReturn = holdingPeriodYears > 0 ? roi / holdingPeriodYears : 0;
  const investmentMultiple = totalOutlay > 0 ? netProceeds / totalOutlay : 0;

  const breakevenValue = totalOutlay;
  const incomeYield = totalOutlay > 0 ? incomeReceived / totalOutlay : 0;

  return {
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
    holdingPeriodYears,
  };
};

export default function ROICalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateRoi({
        initialInvestment: Number(inputs.initialInvestment) || 0,
        additionalContributions: Number(inputs.additionalContributions) || 0,
        finalValue: Number(inputs.finalValue) || 0,
        incomeReceived: Number(inputs.incomeReceived) || 0,
        feesPaid: Number(inputs.feesPaid) || 0,
        holdingYears: Number(inputs.holdingYears) || 0,
        holdingMonths: Number(inputs.holdingMonths) || 0,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>ROI Calculator | Return on Investment Formula</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="ROI Calculator | Return on Investment Formula" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ROI Calculator | Return on Investment Formula" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'ROI Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Measure performance with a return on investment formula',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            ROI Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Quantify profit, income yield, and compound growth so every project stacks up against
            your target hurdle rate.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Investment cash flows
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="initialInvestment">Initial investment (£)</Label>
                    <Input
                      id="initialInvestment"
                      type="number"
                      min="0"
                      step="500"
                      inputMode="decimal"
                      value={inputs.initialInvestment}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          initialInvestment: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="additionalContributions">
                      Additional contributions (total) (£)
                    </Label>
                    <Input
                      id="additionalContributions"
                      type="number"
                      min="0"
                      step="250"
                      inputMode="decimal"
                      value={inputs.additionalContributions}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          additionalContributions: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="feesPaid">Fees and costs (£)</Label>
                    <Input
                      id="feesPaid"
                      type="number"
                      min="0"
                      step="50"
                      inputMode="decimal"
                      value={inputs.feesPaid}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          feesPaid: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incomeReceived">Income received (dividends, rent) (£)</Label>
                    <Input
                      id="incomeReceived"
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={inputs.incomeReceived}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          incomeReceived: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="finalValue">Value today (£)</Label>
                    <Input
                      id="finalValue"
                      type="number"
                      min="0"
                      step="500"
                      inputMode="decimal"
                      value={inputs.finalValue}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          finalValue: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PieChart className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Holding period
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="holdingYears">Years invested</Label>
                  <Slider
                    id="holdingYears"
                    className="mt-3"
                    value={[Number(inputs.holdingYears)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        holdingYears: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={0}
                    max={30}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>0</span>
                    <span>{inputs.holdingYears}</span>
                    <span>30</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="holdingMonths">Months invested</Label>
                  <Slider
                    id="holdingMonths"
                    className="mt-3"
                    value={[Number(inputs.holdingMonths)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        holdingMonths: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={0}
                    max={11}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>0</span>
                    <span>{inputs.holdingMonths}</span>
                    <span>11</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example data
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  ROI summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total invested</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalInvested)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Net proceeds</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.netProceeds)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net gain</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.netGain)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">ROI</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentFormatter.format(results.roi)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Investment multiple</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {results.investmentMultiple.toFixed(2)}x
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Income yield</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentFormatter.format(results.incomeYield)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Sigma className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  CAGR calculator view
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Holding period (years)</span>
                  <span>{results.holdingPeriodYears.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Compound annual growth rate</span>
                  <span>{percentFormatter.format(results.annualisedReturn)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Simple annual return</span>
                  <span>{percentFormatter.format(results.simpleAnnualReturn)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Breakeven value</span>
                  <span>{currencyFormatter.format(results.breakevenValue)}</span>
                </div>
                <p>
                  The cagr calculator output smooths volatility so you can benchmark against
                  long-term return targets. Keep a log of contributions if you plan to calculate a true
                  internal rate of return later.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                ROI formula and return calculator workflow
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Plug the results into any ROI formula: <em>(net profit ÷ total cost) × 100</em>. The
                return calculator view above handles fees and income so you can share clean, auditable
                numbers with investors.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Annual rate of return calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the annual rate of return calculator output when comparing projects with different
                durations. Add monthly contributions to a spreadsheet-based investment calculator if you
                need a full money-weighted analysis.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Re-run the investment calculator numbers whenever fees change, you rebalance the
                portfolio, or you receive additional income streams such as dividends or rental uplift.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={roiFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
