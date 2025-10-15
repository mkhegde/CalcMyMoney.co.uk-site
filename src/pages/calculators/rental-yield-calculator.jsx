import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Building2, LineChart, PiggyBank, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'rental yield calculator',
  'buy to let mortgage calculator',
  'yield calculator',
  'rental property calculator',
  'roi calculator',
];

const metaDescription =
  'Use our rental yield calculator with buy to let mortgage calculator features and a yield calculator view to judge income and ROI in seconds.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rental-yield-calculator';
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
  propertyPrice: 265000,
  monthlyRent: 1450,
  rentVoidWeeks: 3,
  lettingFeePercent: 10,
  monthlyMaintenance: 180,
  annualInsurance: 520,
  annualServiceCharge: 960,
  mortgageBalance: 180000,
  mortgageRate: 4.9,
  otherAnnualCosts: 450,
};

const rentalYieldFaqs = [
  {
    question: 'How do I compare yields between regions?',
    answer:
      'Use identical expense assumptions for each property. Enter the expected rent, fees, and mortgage costs so the net yield reflects the true like-for-like return.',
  },
  {
    question: 'Should I include capital repayments?',
    answer:
      'The yield calculator focuses on annual income. Capital repayments increase your equity but do not count as expenses. Track them separately alongside long-term ROI plans.',
  },
  {
    question: 'What is an acceptable void period?',
    answer:
      'Many landlords model 2–4 weeks per year. Enter the number of weeks you expect between tenants so the calculator discounts rent accordingly.',
  },
];

const calculateYield = (inputs) => {
  const propertyPrice = Math.max(Number(inputs.propertyPrice) || 0, 0);
  const monthlyRent = Math.max(Number(inputs.monthlyRent) || 0, 0);
  const rentVoidWeeks = Math.min(Math.max(Number(inputs.rentVoidWeeks) || 0, 0), 52);
  const lettingFeePercent = Math.max(Number(inputs.lettingFeePercent) || 0, 0);
  const monthlyMaintenance = Math.max(Number(inputs.monthlyMaintenance) || 0, 0);
  const annualInsurance = Math.max(Number(inputs.annualInsurance) || 0, 0);
  const annualServiceCharge = Math.max(Number(inputs.annualServiceCharge) || 0, 0);
  const mortgageBalance = Math.max(Number(inputs.mortgageBalance) || 0, 0);
  const mortgageRate = Math.max(Number(inputs.mortgageRate) || 0, 0);
  const otherAnnualCosts = Math.max(Number(inputs.otherAnnualCosts) || 0, 0);

  const grossRentAnnual = monthlyRent * 12;
  const rentAdjustmentFactor = (52 - rentVoidWeeks) / 52;
  const effectiveRentAnnual = grossRentAnnual * rentAdjustmentFactor;
  const lettingFeeAnnual = effectiveRentAnnual * (lettingFeePercent / 100);
  const maintenanceAnnual = monthlyMaintenance * 12;
  const mortgageInterestAnnual = mortgageBalance * (mortgageRate / 100);

  const totalExpenses =
    lettingFeeAnnual +
    maintenanceAnnual +
    annualInsurance +
    annualServiceCharge +
    mortgageInterestAnnual +
    otherAnnualCosts;

  const netIncomeAnnual = effectiveRentAnnual - totalExpenses;
  const netIncomeMonthly = netIncomeAnnual / 12;

  const grossYield = propertyPrice > 0 ? effectiveRentAnnual / propertyPrice : 0;
  const netYield = propertyPrice > 0 ? netIncomeAnnual / propertyPrice : 0;

  const equityInvested = Math.max(propertyPrice - mortgageBalance, 0);
  const cashOnCashReturn = equityInvested > 0 ? netIncomeAnnual / equityInvested : 0;

  return {
    propertyPrice,
    effectiveRentAnnual,
    grossRentAnnual,
    lettingFeeAnnual,
    maintenanceAnnual,
    mortgageInterestAnnual,
    annualInsurance,
    annualServiceCharge,
    otherAnnualCosts,
    totalExpenses,
    netIncomeAnnual,
    netIncomeMonthly,
    grossYield,
    netYield,
    cashOnCashReturn,
    equityInvested,
    rentVoidWeeks,
  };
};

export default function RentalYieldCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(() => calculateYield(inputs), [inputs]);

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Rental Yield Calculator | Buy to Let Mortgage Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Rental Yield Calculator | Buy to Let Mortgage Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rental Yield Calculator | Buy to Let Mortgage Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Rental Yield Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Evaluate investment returns with a rental yield calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Rental Yield Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Combine rental income, expenses, and finance costs to see the real return on your next buy to let.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-indigo-200 bg-white text-slate-900 shadow-md dark:border-indigo-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Property & rental details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyPrice">Purchase price (£)</Label>
                    <Input
                      id="propertyPrice"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1000"
                      value={inputs.propertyPrice}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          propertyPrice: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">Expected monthly rent (£)</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="25"
                      value={inputs.monthlyRent}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          monthlyRent: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rentVoidWeeks">Void period (weeks per year)</Label>
                    <Slider
                      id="rentVoidWeeks"
                      className="mt-3"
                      value={[Number(inputs.rentVoidWeeks)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          rentVoidWeeks: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={0}
                      max={12}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                      <span>0</span>
                      <span>{inputs.rentVoidWeeks}</span>
                      <span>12</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lettingFeePercent">Letting fee (% of rent)</Label>
                    <Slider
                      id="lettingFeePercent"
                      className="mt-3"
                      value={[Number(inputs.lettingFeePercent)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          lettingFeePercent: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={20}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                      <span>0%</span>
                      <span>{inputs.lettingFeePercent.toFixed(1)}%</span>
                      <span>20%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyMaintenance">Maintenance allowance (£ per month)</Label>
                    <Input
                      id="monthlyMaintenance"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="10"
                      value={inputs.monthlyMaintenance}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          monthlyMaintenance: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualInsurance">Insurance (£ per year)</Label>
                    <Input
                      id="annualInsurance"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="50"
                      value={inputs.annualInsurance}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualInsurance: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualServiceCharge">Service charge/ground rent (£ per year)</Label>
                    <Input
                      id="annualServiceCharge"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="50"
                      value={inputs.annualServiceCharge}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualServiceCharge: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="otherAnnualCosts">Other annual costs (£)</Label>
                    <Input
                      id="otherAnnualCosts"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="50"
                      value={inputs.otherAnnualCosts}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          otherAnnualCosts: Number(event.target.value) || 0,
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
                  <PiggyBank className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Finance inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mortgageBalance">Outstanding mortgage (£)</Label>
                  <Input
                    id="mortgageBalance"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.mortgageBalance}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageBalance: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgageRate">Interest rate (% p.a.)</Label>
                  <Slider
                    id="mortgageRate"
                    className="mt-3"
                    value={[Number(inputs.mortgageRate)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageRate: Number(value[0].toFixed(1)),
                      }))
                    }
                    min={1}
                    max={10}
                    step={0.1}
                  />
                  <div className="flex justify-between text-sm text-indigo-700 dark:text-indigo-200">
                    <span>1%</span>
                    <span>{inputs.mortgageRate.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example property
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  Yield summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Gross annual rent</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.grossRentAnnual)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Effective rent (voids)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.effectiveRentAnnual)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {results.rentVoidWeeks} weeks void modelled
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Gross yield</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentFormatter.format(results.grossYield)}
                  </p>
                </div>
                <div className="rounded-md border border-indigo-200 bg-indigo-50 p-4 text-center dark:border-indigo-800 dark:bg-indigo-900/30">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Net yield</p>
                  <p className="text-2xl font-semibold text-indigo-900 dark:text-indigo-100">
                    {percentFormatter.format(results.netYield)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Net income (annual)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.netIncomeAnnual)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Net income (monthly)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.netIncomeMonthly)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 bg-indigo-50 text-slate-900 shadow-md dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-indigo-700 dark:text-indigo-300" />
                  Expense breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Letting & management</span>
                  <span>{currencyFormatter.format(results.lettingFeeAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Maintenance allowance</span>
                  <span>{currencyFormatter.format(results.maintenanceAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Mortgage interest</span>
                  <span>{currencyFormatter.format(results.mortgageInterestAnnual)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Insurance & service charges</span>
                  <span>
                    {currencyFormatter.format(results.annualInsurance + results.annualServiceCharge)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Other costs</span>
                  <span>{currencyFormatter.format(results.otherAnnualCosts)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Total expenses</span>
                  <span>{currencyFormatter.format(results.totalExpenses)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <LineChart className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
                  ROI spotlight
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Equity invested</span>
                  <span>{currencyFormatter.format(results.equityInvested)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cash-on-cash return</span>
                  <span>{percentFormatter.format(results.cashOnCashReturn)}</span>
                </div>
                <p>
                  Benchmark this against other rental property calculator scenarios or your wider ROI calculator
                  targets to see where capital earns the best return.
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
                Rental property calculator toolkit
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair this rental yield calculator with a rental property calculator spreadsheet so you can
                capture renovation budgets, purchase costs, and contingency alongside the running numbers.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Layer ROI calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Drop the cash-on-cash return into an ROI calculator to compare against alternative investments,
                or tweak leverage to see how mortgage balances change the final yield.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={rentalYieldFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
