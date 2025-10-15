import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Hammer, LineChart, PiggyBank, Building2, ArrowUpRight } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'rental property calculator',
  'roi calculator',
  'investment calculator',
  'mortgage loan calculator',
  'property tax calculator',
];

const metaDescription =
  'Use our property flipping calculator as a rental property calculator, roi calculator, and investment calculator to scope profits before you pick your next flip.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/property-flipping-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'percent',
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const defaultInputs = {
  purchasePrice: 245000,
  renovationBudget: 42000,
  holdingMonths: 6,
  monthlyHoldingCosts: 650,
  financingPercentage: 75,
  mortgageRate: 5.4,
  salePrice: 345000,
  sellingCostsPercent: 2.5,
  stampDuty: 7200,
  miscCosts: 2500,
};

const propertyFlipFaqs = [
  {
    question: 'How do I estimate selling costs accurately?',
    answer:
      'Include estate agent fees, conveyancing, and any incentives offered to the buyer. In the UK, selling fees often sit between 1-3% plus VAT. Update the percentage to reflect quotes you receive locally.',
  },
  {
    question: 'What holding costs should be added for a flip?',
    answer:
      'Typical holding costs include mortgage interest, council tax, utilities, and insurance. Add staging or security expenses if the property sits empty during marketing.',
  },
  {
    question: 'How does finance impact the ROI calculation?',
    answer:
      'Higher leverage reduces the cash invested but increases monthly interest and risk. Adjust the loan-to-value slider and interest rate to see how leverage changes the ROI and break-even sale price.',
  },
];

const calculateFlipMetrics = (inputs) => {
  const purchasePrice = Number(inputs.purchasePrice) || 0;
  const renovationBudget = Number(inputs.renovationBudget) || 0;
  const holdingMonths = Math.max(Number(inputs.holdingMonths) || 0, 0);
  const monthlyHoldingCosts = Number(inputs.monthlyHoldingCosts) || 0;
  const financingPercentage = Math.min(Math.max(Number(inputs.financingPercentage) || 0, 0), 100);
  const mortgageRate = Math.max(Number(inputs.mortgageRate) || 0, 0);
  const salePrice = Number(inputs.salePrice) || 0;
  const sellingCostsPercent = Math.max(Number(inputs.sellingCostsPercent) || 0, 0);
  const stampDuty = Number(inputs.stampDuty) || 0;
  const miscCosts = Number(inputs.miscCosts) || 0;

  const loanAmount = purchasePrice * (financingPercentage / 100);
  const cashDown = purchasePrice - loanAmount;
  const monthlyInterestRate = mortgageRate / 100 / 12;
  const interestPaid = loanAmount * monthlyInterestRate * holdingMonths;
  const holdingCosts = monthlyHoldingCosts * holdingMonths + interestPaid;

  const closingCosts = (sellingCostsPercent / 100) * salePrice;
  const totalCashInvested = cashDown + renovationBudget + stampDuty + miscCosts + holdingCosts;
  const totalProjectCost = purchasePrice + renovationBudget + stampDuty + miscCosts + holdingCosts + closingCosts;

  const grossProfit = salePrice - (purchasePrice + renovationBudget + stampDuty + miscCosts + closingCosts);
  const netProfit = salePrice - totalProjectCost;

  const roi = totalCashInvested > 0 ? netProfit / totalCashInvested : 0;
  const annualisedRoi = holdingMonths > 0 ? roi * (12 / holdingMonths) : roi;
  const breakEvenSalePrice = totalProjectCost;

  return {
    loanAmount,
    cashDown,
    interestPaid,
    holdingCosts,
    closingCosts,
    totalCashInvested,
    totalProjectCost,
    grossProfit,
    netProfit,
    roi,
    annualisedRoi,
    breakEvenSalePrice,
    holdingMonths,
  };
};

export default function PropertyFlippingCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(() => calculateFlipMetrics(inputs), [inputs]);

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Property Flipping Calculator | ROI Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Property Flipping Calculator | ROI Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Property Flipping Calculator | ROI Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Property Flipping Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Analyse a flip with ROI and investment calculator metrics',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Property Flipping Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Pressure-test the deal before you swing a hammer. Measure costs, profits, and ROI so every flip
            aligns with your investment strategy.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Hammer className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Deal assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">Purchase price (£)</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1000"
                      value={inputs.purchasePrice}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          purchasePrice: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renovationBudget">Renovation budget (£)</Label>
                    <Input
                      id="renovationBudget"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="500"
                      value={inputs.renovationBudget}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          renovationBudget: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sellingCostsPercent">Selling costs (% of sale)</Label>
                    <Slider
                      id="sellingCostsPercent"
                      className="mt-3"
                      value={[Number(inputs.sellingCostsPercent)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          sellingCostsPercent: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={5}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.sellingCostsPercent.toFixed(1)}%</span>
                      <span>5%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holdingMonths">Holding period (months)</Label>
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
                      min={1}
                      max={24}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>1</span>
                      <span>{inputs.holdingMonths}</span>
                      <span>24</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthlyHoldingCosts">Monthly holding costs (£)</Label>
                    <Input
                      id="monthlyHoldingCosts"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="25"
                      value={inputs.monthlyHoldingCosts}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          monthlyHoldingCosts: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="salePrice">Expected sale price (£)</Label>
                    <Input
                      id="salePrice"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1000"
                      value={inputs.salePrice}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          salePrice: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="miscCosts">Miscellaneous costs (£)</Label>
                    <Input
                      id="miscCosts"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.miscCosts}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          miscCosts: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to demo flip
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Building2 className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Financing and taxes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="financingPercentage">Loan to value (%)</Label>
                    <Slider
                      id="financingPercentage"
                      className="mt-3"
                      value={[Number(inputs.financingPercentage)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          financingPercentage: Number(value[0].toFixed(0)),
                        }))
                      }
                      min={0}
                      max={90}
                      step={1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.financingPercentage}%</span>
                      <span>90%</span>
                    </div>
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
                      min={0}
                      max={12}
                      step={0.1}
                    />
                    <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                      <span>0%</span>
                      <span>{inputs.mortgageRate.toFixed(1)}%</span>
                      <span>12%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stampDuty">Stamp duty & purchase taxes (£)</Label>
                    <Input
                      id="stampDuty"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.stampDuty}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          stampDuty: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Flip profitability summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Cash invested</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalCashInvested)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Loan amount</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.loanAmount)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Net profit</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.netProfit)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">ROI</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {percentFormatter.format(results.roi)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Annualised ROI</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentFormatter.format(results.annualisedRoi)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Based on {results.holdingMonths} months held
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Break-even sale price</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.breakEvenSalePrice)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <LineChart className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Cash flow detail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Interest paid</span>
                  <span>{currencyFormatter.format(results.interestPaid)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Holding costs (inc. bills)</span>
                  <span>{currencyFormatter.format(results.holdingCosts)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Closing costs</span>
                  <span>{currencyFormatter.format(results.closingCosts)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total project cost</span>
                  <span>{currencyFormatter.format(results.totalProjectCost)}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Funding comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p>
                  Adjust the mortgage loan calculator style inputs above to see how leverage affects your
                  ROI and net profit. Lower loan-to-value increases cash outlay but reduces monthly interest
                  drag and break-even risk.
                </p>
                <p>
                  Remember to factor future liabilities such as capital gains and any property tax calculator
                  outcomes on the sale. These assumptions ensure the flip behaves like a disciplined rental
                  property calculator projection, even if you are selling immediately.
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
                Investment calculator playbook
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat each flip like a rental property calculator scenario: validate the end value, stress
                test costs, and benchmark profit against other ROI calculator projects. Consistency keeps
                your pipeline full of winners.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Scale to the next flip
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Save deal snapshots, tweak renovation assumptions, and share the numbers with partners so
                your investment calculator workflow scales across multiple projects at once.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={propertyFlipFaqs} />
        </div>
      </section>
    </div>
  );
}
