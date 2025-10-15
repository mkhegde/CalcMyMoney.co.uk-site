import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Landmark, PiggyBank, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'reverse mortgage calculator',
  'mortgage calculator',
  'remortgage calculator',
  'home loan calculator',
  'housing loan calculator',
];

const metaDescription =
  'Use our reverse mortgage calculator as a mortgage calculator and remortgage calculator to estimate equity release, future balances, and retirement cash flow.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/reverse-mortgage-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  minimumFractionDigits: 1,
});

const defaultInputs = {
  propertyValue: 425000,
  age: 68,
  interestRate: 5.6,
  propertyGrowthRate: 2.3,
  existingMortgage: 38000,
  setupFees: 2500,
  drawdownSplit: 40,
  incomeYears: 12,
  projectionYears: 20,
};

const reverseMortgageFaqs = [
  {
    question: 'How much equity can I release with a lifetime mortgage?',
    answer:
      'The maximum loan-to-value increases with age. This calculator estimates a conservative LTV curve, but individual lenders may offer higher or lower limits depending on health, property type, and interest rate.',
  },
  {
    question: 'What happens to my existing mortgage?',
    answer:
      'Your existing mortgage must be repaid when the reverse mortgage completes. We deduct the outstanding balance from the facility so you can see the true cash available after fees.',
  },
  {
    question: 'Can I take the funds as a drawdown facility?',
    answer:
      'Yes. Split the release between a lump sum and an income stream. Adjust the drawdown split and income years to model how a flexible facility alters future loan balances and remaining equity.',
  },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const calculateReverseMortgage = ({
  propertyValue,
  age,
  interestRate,
  propertyGrowthRate,
  existingMortgage,
  setupFees,
  drawdownSplit,
  incomeYears,
  projectionYears,
}) => {
  const maxLtv = clamp(0.15 + 0.01 * (age - 55), 0.15, 0.6);
  const grossFacility = propertyValue * maxLtv;
  const netFacility = Math.max(grossFacility - setupFees, 0);

  const mortgageSettlement = Math.min(existingMortgage, netFacility);
  const cashAvailable = Math.max(netFacility - mortgageSettlement, 0);

  const lumpSum = cashAvailable * (drawdownSplit / 100);
  const drawdownPool = cashAvailable - lumpSum;

  const incomeMonths = Math.max(Math.round(incomeYears * 12), 0);
  const monthlyIncome =
    incomeMonths > 0 ? drawdownPool / incomeMonths : 0;

  const monthlyRate = interestRate / 100 / 12;
  const projectionMonths = Math.max(Math.round(projectionYears * 12), 0);
  const drawdownMonths = Math.min(incomeMonths, projectionMonths);

  const initialAdvance = mortgageSettlement + lumpSum;
  const advanceFutureValue =
    monthlyRate === 0
      ? initialAdvance
      : initialAdvance * (1 + monthlyRate) ** projectionMonths;

  let drawdownFutureValue = 0;
  if (monthlyIncome > 0 && drawdownMonths > 0) {
    if (monthlyRate === 0) {
      drawdownFutureValue = monthlyIncome * drawdownMonths;
    } else {
      const factorNumerator =
        (1 + monthlyRate) ** projectionMonths - (1 + monthlyRate) ** (projectionMonths - drawdownMonths);
      drawdownFutureValue = monthlyIncome * (factorNumerator / monthlyRate);
    }
  }

  const projectedBalance = advanceFutureValue + drawdownFutureValue;

  const futurePropertyValue =
    projectionYears === 0
      ? propertyValue
      : propertyValue * (1 + propertyGrowthRate / 100) ** projectionYears;

  const remainingEquity = futurePropertyValue - projectedBalance;
  const ltvAtExit = futurePropertyValue > 0 ? projectedBalance / futurePropertyValue : 0;

  return {
    maxLtv,
    grossFacility,
    netFacility,
    mortgageSettlement,
    cashAvailable,
    lumpSum,
    drawdownPool,
    monthlyIncome,
    projectedBalance,
    futurePropertyValue,
    remainingEquity,
    ltvAtExit,
  };
};

export default function ReverseMortgageCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateReverseMortgage({
        propertyValue: Number(inputs.propertyValue) || 0,
        age: Number(inputs.age) || 0,
        interestRate: Number(inputs.interestRate) || 0,
        propertyGrowthRate: Number(inputs.propertyGrowthRate) || 0,
        existingMortgage: Number(inputs.existingMortgage) || 0,
        setupFees: Number(inputs.setupFees) || 0,
        drawdownSplit: Number(inputs.drawdownSplit) || 0,
        incomeYears: Number(inputs.incomeYears) || 0,
        projectionYears: Number(inputs.projectionYears) || 0,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Reverse Mortgage Calculator | Mortgage Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Reverse Mortgage Calculator | Mortgage Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Reverse Mortgage Calculator | Mortgage Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Reverse Mortgage Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate equity release with a reverse mortgage calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Reverse Mortgage Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Plan lifetime mortgage borrowing power, clear existing debt, and turn housing wealth into
            retirement income.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Property and loan inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyValue">Property value (£)</Label>
                    <Input
                      id="propertyValue"
                      type="number"
                      min="0"
                      step="1000"
                      inputMode="decimal"
                      value={inputs.propertyValue}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          propertyValue: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="existingMortgage">Existing mortgage to clear (£)</Label>
                    <Input
                      id="existingMortgage"
                      type="number"
                      min="0"
                      step="1000"
                      inputMode="decimal"
                      value={inputs.existingMortgage}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          existingMortgage: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="age">Youngest borrower age</Label>
                    <Slider
                      id="age"
                      className="mt-3"
                      value={[Number(inputs.age)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          age: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={55}
                      max={85}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>55</span>
                      <span>{inputs.age}</span>
                      <span>85</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest rate (% p.a.)</Label>
                    <Slider
                      id="interestRate"
                      className="mt-3"
                      value={[Number(inputs.interestRate)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          interestRate: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={3}
                      max={8}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>3%</span>
                      <span>{inputs.interestRate.toFixed(1)}%</span>
                      <span>8%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyGrowthRate">Property growth (% p.a.)</Label>
                    <Slider
                      id="propertyGrowthRate"
                      className="mt-3"
                      value={[Number(inputs.propertyGrowthRate)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          propertyGrowthRate: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={-2}
                      max={6}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>-2%</span>
                      <span>{inputs.propertyGrowthRate.toFixed(1)}%</span>
                      <span>6%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="setupFees">Setup fees (£)</Label>
                    <Input
                      id="setupFees"
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={inputs.setupFees}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          setupFees: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Drawdown plan
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="drawdownSplit">Take as lump sum (%)</Label>
                  <Slider
                    id="drawdownSplit"
                    className="mt-3"
                    value={[Number(inputs.drawdownSplit)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        drawdownSplit: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={0}
                    max={100}
                    step={5}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.drawdownSplit}%</span>
                    <span>100%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeYears">Drawdown income over (years)</Label>
                  <Slider
                    id="incomeYears"
                    className="mt-3"
                    value={[Number(inputs.incomeYears)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        incomeYears: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={1}
                    max={20}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1</span>
                    <span>{inputs.incomeYears}</span>
                    <span>20</span>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="projectionYears">Projection horizon (years)</Label>
                  <Slider
                    id="projectionYears"
                    className="mt-3"
                    value={[Number(inputs.projectionYears)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        projectionYears: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={5}
                    max={30}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>5</span>
                    <span>{inputs.projectionYears}</span>
                    <span>30</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example plan
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Reverse mortgage snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Maximum LTV</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentFormatter.format(results.maxLtv)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Facility after fees</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.netFacility)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Cash available</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.cashAvailable)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    After clearing {currencyFormatter.format(results.mortgageSettlement)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Monthly income</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.monthlyIncome)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    For {inputs.incomeYears} years
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Future balance outlook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Projected balance at year {inputs.projectionYears}</span>
                  <span>{currencyFormatter.format(results.projectedBalance)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Projected property value</span>
                  <span>{currencyFormatter.format(results.futurePropertyValue)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Remaining equity</span>
                  <span>{currencyFormatter.format(results.remainingEquity)}</span>
                </div>
                <p>
                  The exit loan-to-value stands at {percentFormatter.format(results.ltvAtExit)}. Adjust
                  the growth or interest assumptions to understand how equity changes before repayment.
                  Discuss guarantees with advisers so beneficiaries are protected if values fall.
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
                Home loan calculator style guidance
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Combine this reverse mortgage view with your favourite home loan calculator to compare
                rollover options and see how switching products changes interest charges over time.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Housing loan calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat the reverse facility like any housing loan calculator scenario: review exit plans,
                check conveyancing fees, and keep beneficiaries informed so the estate process runs
                smoothly.
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300">
                If you are comparing remortgage calculator quotes, line up lender illustrations and
                legal costs side-by-side to make sure the lifetime mortgage still provides the best net
                outcome.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={reverseMortgageFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
