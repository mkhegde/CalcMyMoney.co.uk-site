import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Key, PiggyBank, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'mortgage calculator',
  'remortgage calculator',
  'mortgage payment calculator',
  'loan calculator',
  'home loan calculator',
  'house payment calculator',
];

const metaDescription =
  'Use our rent to buy calculator alongside a mortgage calculator, remortgage calculator, and mortgage payment calculator to track rent credits and future affordability.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rent-to-buy-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultInputs = {
  propertyPriceToday: 320000,
  initialDeposit: 15000,
  monthlyRent: 1350,
  rentCreditPercent: 30,
  yearsUntilPurchase: 5,
  annualPriceGrowth: 2.5,
  mortgageRate: 5.2,
  mortgageTermYears: 30,
  leaseServiceCharge: 120,
  completionFees: 6500,
};

const rentToBuyFaqs = [
  {
    question: 'How much rent is typically credited in rent to buy schemes?',
    answer:
      'Contracts often credit 20–40% of your rent towards the future purchase. Adjust the rent credit slider to match your agreement and monitor how that translates into deposit savings.',
  },
  {
    question: 'What happens if property prices rise faster than planned?',
    answer:
      'Increase the annual price growth assumption to stress test the deal. A higher future purchase price can erode your deposit percentage and increase the mortgage payment calculator estimate.',
  },
  {
    question: 'Can I buy sooner than planned?',
    answer:
      'Yes, most schemes let you exercise the option early once you have enough deposit. Reduce the years-to-purchase slider to see how the shorter timeline affects savings and mortgage affordability.',
  },
];

const calculateMetrics = (inputs) => {
  const propertyPriceToday = Number(inputs.propertyPriceToday) || 0;
  const initialDeposit = Math.max(Number(inputs.initialDeposit) || 0, 0);
  const monthlyRent = Math.max(Number(inputs.monthlyRent) || 0, 0);
  const rentCreditPercent = Math.min(Math.max(Number(inputs.rentCreditPercent) || 0, 0), 100);
  const yearsUntilPurchase = Math.max(Number(inputs.yearsUntilPurchase) || 0, 0);
  const annualPriceGrowth = Number(inputs.annualPriceGrowth) || 0;
  const mortgageRate = Math.max(Number(inputs.mortgageRate) || 0, 0);
  const mortgageTermYears = Math.max(Number(inputs.mortgageTermYears) || 0, 1);
  const leaseServiceCharge = Math.max(Number(inputs.leaseServiceCharge) || 0, 0);
  const completionFees = Math.max(Number(inputs.completionFees) || 0, 0);

  const rentCreditRate = rentCreditPercent / 100;
  const rentCreditMonthly = monthlyRent * rentCreditRate;
  const rentCreditTotal = rentCreditMonthly * 12 * yearsUntilPurchase;
  const totalRentPaid = (monthlyRent + leaseServiceCharge) * 12 * yearsUntilPurchase;

  const futurePrice =
    yearsUntilPurchase === 0
      ? propertyPriceToday
      : propertyPriceToday * (1 + annualPriceGrowth / 100) ** yearsUntilPurchase;

  const projectedDeposit = initialDeposit + rentCreditTotal;
  const depositPercent = futurePrice > 0 ? (projectedDeposit / futurePrice) * 100 : 0;

  const mortgageAmount = Math.max(futurePrice - projectedDeposit, 0);
  const monthlyInterestRate = mortgageRate / 100 / 12;
  const totalPayments = mortgageTermYears * 12;
  const mortgagePayment =
    monthlyInterestRate === 0
      ? (totalPayments > 0 ? mortgageAmount / totalPayments : 0)
      : mortgageAmount *
        (monthlyInterestRate * (1 + monthlyInterestRate) ** totalPayments) /
        ((1 + monthlyInterestRate) ** totalPayments - 1 || 1);

  const cashNeededAtCompletion = Math.max(completionFees + projectedDeposit, 0);
  const gapToTenPercentDeposit = Math.max(futurePrice * 0.1 - projectedDeposit, 0);

  return {
    rentCreditMonthly,
    rentCreditTotal,
    totalRentPaid,
    futurePrice,
    projectedDeposit,
    depositPercent,
    mortgageAmount,
    mortgagePayment,
    cashNeededAtCompletion,
    gapToTenPercentDeposit,
    yearsUntilPurchase,
    monthlyRent,
    leaseServiceCharge,
  };
};

export default function RentToBuyCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(() => calculateMetrics(inputs), [inputs]);

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Rent to Buy Calculator | Remortgage Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Rent to Buy Calculator | Remortgage Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rent to Buy Calculator | Remortgage Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Rent to Buy Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan a rent to buy strategy with mortgage payment insights',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Rent to Buy Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Track rent credits, estimate your future deposit, and preview mortgage payments before you
            exercise the option to buy.
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
                  Rent to buy inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="propertyPriceToday">Property price today (£)</Label>
                    <Input
                      id="propertyPriceToday"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1000"
                      value={inputs.propertyPriceToday}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          propertyPriceToday: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="initialDeposit">Initial deposit saved (£)</Label>
                    <Input
                      id="initialDeposit"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="500"
                      value={inputs.initialDeposit}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          initialDeposit: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyRent">Monthly rent (£)</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="10"
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
                    <Label htmlFor="rentCreditPercent">Rent credited to purchase (%)</Label>
                    <Slider
                      id="rentCreditPercent"
                      className="mt-3"
                      value={[Number(inputs.rentCreditPercent)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          rentCreditPercent: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={0}
                      max={50}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.rentCreditPercent}%</span>
                      <span>50%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsUntilPurchase">Years until purchase</Label>
                    <Slider
                      id="yearsUntilPurchase"
                      className="mt-3"
                      value={[Number(inputs.yearsUntilPurchase)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          yearsUntilPurchase: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={1}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>1</span>
                      <span>{inputs.yearsUntilPurchase}</span>
                      <span>10</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annualPriceGrowth">Expected price growth (% p.a.)</Label>
                    <Slider
                      id="annualPriceGrowth"
                      className="mt-3"
                      value={[Number(inputs.annualPriceGrowth)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          annualPriceGrowth: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={-5}
                      max={8}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>-5%</span>
                      <span>{inputs.annualPriceGrowth.toFixed(1)}%</span>
                      <span>8%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leaseServiceCharge">Lease/service charge (£ per month)</Label>
                    <Input
                      id="leaseServiceCharge"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="10"
                      value={inputs.leaseServiceCharge}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          leaseServiceCharge: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="completionFees">Completion costs (£)</Label>
                    <Input
                      id="completionFees"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.completionFees}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          completionFees: Number(event.target.value) || 0,
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
                  <Key className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Mortgage preview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mortgageRate">Mortgage rate (% p.a.)</Label>
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
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1%</span>
                    <span>{inputs.mortgageRate.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgageTermYears">Mortgage term (years)</Label>
                  <Slider
                    id="mortgageTermYears"
                    className="mt-3"
                    value={[Number(inputs.mortgageTermYears)]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageTermYears: Number(value[0].toFixed(0)),
                      }))
                    }
                    min={15}
                    max={35}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>15</span>
                    <span>{inputs.mortgageTermYears}</span>
                    <span>35</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to example scenario
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Rent to buy summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Rent credited each month</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.rentCreditMonthly)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Deposit at completion</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.projectedDeposit)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {results.depositPercent.toFixed(1)}% deposit
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Future property price</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.futurePrice)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Projected mortgage</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.mortgageAmount)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Mortgage payment estimate</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.mortgagePayment)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Based on {inputs.mortgageTermYears}-year term</p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Cash needed at completion</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.cashNeededAtCompletion)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Deposit plus fees</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Deposit timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Rent credited overall</span>
                  <span>{currencyFormatter.format(results.rentCreditTotal)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total rent paid (inc. service charge)</span>
                  <span>{currencyFormatter.format(results.totalRentPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gap to 10% deposit</span>
                  <span>{currencyFormatter.format(results.gapToTenPercentDeposit)}</span>
                </div>
                <p>
                  Gradually increasing the rent credit rate or saving extra alongside this option shrinks the
                  gap and improves your mortgage calculator outcome once you complete.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Stress test scenario
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-600 dark:text-slate-300 space-y-3">
                <p>
                  Adjust the annual price growth slider to simulate different market conditions. A higher
                  future value increases the mortgage payment calculator estimate and may require additional
                  savings beyond rent credits.
                </p>
                <p>
                  Compare the outputs with a loan calculator or home loan calculator quote from lenders to
                  understand how much flexibility you have if rates move during the rental phase.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading as="h2" size="h2" weight="semibold" className="text-slate-900 dark:text-slate-100">
                House payment calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Drop the mortgage payment estimate into your favourite house payment calculator to stress test
                affordability alongside insurance, council tax, and maintenance allowances.
              </p>
              <Heading as="h3" size="h3" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Build confidence before completion
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Keep the rent to buy calculator updated monthly so you always know your projected deposit,
                closing costs, and the date you can safely exercise the purchase option.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={rentToBuyFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
