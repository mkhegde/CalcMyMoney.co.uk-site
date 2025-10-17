import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Calculator, Building2, BarChart3, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import SeoHead from '@/components/seo/SeoHead';

const brrrrKeywords = ['brrrr calculator', 'brrrr real estate calculator'];

const metaDescription =
  'Use our BRRRR calculator to map buy-rehab-rent-refinance results while the BRRRR real estate calculator tracks cash flow, equity, and cash-out potential for your next deal.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/brrrr-calculator';

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'BRRRR Calculator',
  url: canonicalUrl,
  description: metaDescription,
  keywords: brrrrKeywords.slice(0, 5),
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'Action',
    name: 'Run BRRRR analysis',
    target: canonicalUrl,
  },
};

const faqItems = [
  {
    question: 'What does the BRRRR strategy stand for?',
    answer:
      'BRRRR stands for Buy, Rehab, Rent, Refinance, and Repeat. Investors purchase undervalued property, renovate to raise value, rent it out, refinance based on the higher valuation, and recycle the released capital into the next project.',
  },
  {
    question: 'How accurate is the BRRRR calculator?',
    answer:
      'The BRRRR calculator uses your figures for purchase price, refurbishment spend, refinance terms, and operating expenses. While it provides a robust forecast, always validate costs with contractors, lenders, and local letting agents before committing capital.',
  },
  {
    question: 'What loan-to-value (LTV) should I assume?',
    answer:
      'Many lenders refinance BRRRR deals at around 70-75% loan-to-value once the property is stabilised. Adjust the LTV slider in the calculator to match lender quotes so the refinance proceeds and mortgage payments align with real-world expectations.',
  },
];

const defaultInputs = {
  purchasePrice: '180000',
  rehabBudget: '35000',
  closingCosts: '9000',
  carryingCosts: '6000',
  afterRepairValue: '280000',
  monthlyRent: '1800',
  expenseRatio: '35',
  vacancyRate: '6',
  refinanceRate: '6.25',
  refinanceTerm: '30',
  refinanceLtv: '75',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const monthlyPayment = (principal, annualRatePercent, years) => {
  const rate = annualRatePercent / 100 / 12;
  const n = years * 12;
  if (n <= 0) return 0;
  if (rate === 0) return principal / n;
  return (principal * rate) / (1 - Math.pow(1 + rate, -n));
};

const calculateOutputs = (inputs) => {
  const purchasePrice = Number(inputs.purchasePrice) || 0;
  const rehabBudget = Number(inputs.rehabBudget) || 0;
  const closingCosts = Number(inputs.closingCosts) || 0;
  const carryingCosts = Number(inputs.carryingCosts) || 0;
  const afterRepairValue = Number(inputs.afterRepairValue) || 0;
  const monthlyRent = Number(inputs.monthlyRent) || 0;
  const expenseRatio = Number(inputs.expenseRatio) || 0;
  const vacancyRate = Number(inputs.vacancyRate) || 0;
  const refinanceRate = Number(inputs.refinanceRate) || 0;
  const refinanceTerm = Number(inputs.refinanceTerm) || 0;
  const refinanceLtv = Number(inputs.refinanceLtv) / 100 || 0;

  const totalAcquisition = purchasePrice + rehabBudget + closingCosts + carryingCosts;
  const refinanceLoan = afterRepairValue * refinanceLtv;
  const mortgagePayment = monthlyPayment(refinanceLoan, refinanceRate, refinanceTerm);
  const vacancyLoss = monthlyRent * (vacancyRate / 100);
  const operatingExpenses = monthlyRent * (expenseRatio / 100);
  const netOperatingIncome = (monthlyRent - vacancyLoss - operatingExpenses) * 12;
  const annualMortgageCost = mortgagePayment * 12;
  const annualCashFlow = netOperatingIncome - annualMortgageCost;
  const equityCreated = Math.max(afterRepairValue - refinanceLoan, 0);
  const cashOutProceeds = refinanceLoan - totalAcquisition;
  const cashOnCashReturn = totalAcquisition > 0 ? (annualCashFlow / totalAcquisition) * 100 : 0;

  const capitalStack = [
    { name: 'Purchase', amount: purchasePrice },
    { name: 'Rehab', amount: rehabBudget },
    { name: 'Closing', amount: closingCosts },
    { name: 'Carrying', amount: carryingCosts },
    { name: 'Refinance Loan', amount: refinanceLoan },
  ];

  return {
    totalAcquisition,
    refinanceLoan,
    mortgagePayment,
    vacancyLoss,
    operatingExpenses,
    netOperatingIncome,
    annualMortgageCost,
    annualCashFlow,
    equityCreated,
    cashOutProceeds,
    cashOnCashReturn,
    capitalStack,
  };
};

export default function BRRRRCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(() => calculateOutputs(defaultInputs));

  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    setResults(calculateOutputs(inputs));
  }, [inputs]);

  const handleReset = () => {
    setInputs(defaultInputs);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <SeoHead
        title="BRRRR Calculator | BRRRR Real Estate Calculator"
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle="BRRRR Calculator | BRRRR Real Estate Calculator"
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="Calc My Money"
        twitterTitle="BRRRR Calculator | BRRRR Real Estate Calculator"
        twitterDescription={metaDescription}
        jsonLd={[webpageSchema]}
      />

      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            BRRRR Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Model every step of the Buy, Rehab, Rent, Refinance, Repeat strategy and see how quickly
            you can recycle capital into the next deal.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Deal Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="purchasePrice" className="text-sm font-medium">
                    Purchase Price (£)
                  </Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.purchasePrice}
                    onChange={(event) => handleInputChange('purchasePrice', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rehabBudget" className="text-sm font-medium">
                    Rehab Budget (£)
                  </Label>
                  <Input
                    id="rehabBudget"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.rehabBudget}
                    onChange={(event) => handleInputChange('rehabBudget', event.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="closingCosts" className="text-sm font-medium">
                      Closing Costs (£)
                    </Label>
                    <Input
                      id="closingCosts"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.closingCosts}
                      onChange={(event) => handleInputChange('closingCosts', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="carryingCosts" className="text-sm font-medium">
                      Holding & Utilities (£)
                    </Label>
                    <Input
                      id="carryingCosts"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.carryingCosts}
                      onChange={(event) => handleInputChange('carryingCosts', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="afterRepairValue" className="text-sm font-medium">
                    After Repair Value (£)
                  </Label>
                  <Input
                    id="afterRepairValue"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.afterRepairValue}
                    onChange={(event) => handleInputChange('afterRepairValue', event.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <Label htmlFor="monthlyRent" className="text-sm font-medium">
                    Monthly Rent (£)
                  </Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.monthlyRent}
                    onChange={(event) => handleInputChange('monthlyRent', event.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Operating Expense Ratio
                    <span className="text-emerald-600 font-semibold">
                      {percentFormatter.format(Number(inputs.expenseRatio) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.expenseRatio)]}
                    onValueChange={(value) => handleInputChange('expenseRatio', String(value[0]))}
                    min={10}
                    max={60}
                    step={1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Vacancy Rate
                    <span className="text-emerald-600 font-semibold">
                      {percentFormatter.format(Number(inputs.vacancyRate) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.vacancyRate)]}
                    onValueChange={(value) => handleInputChange('vacancyRate', String(value[0]))}
                    min={0}
                    max={15}
                    step={1}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Refinance LTV
                    <span className="text-emerald-600 font-semibold">
                      {percentFormatter.format(Number(inputs.refinanceLtv) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.refinanceLtv)]}
                    onValueChange={(value) => handleInputChange('refinanceLtv', String(value[0]))}
                    min={60}
                    max={80}
                    step={1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="refinanceRate" className="text-sm font-medium">
                      Refinance Rate (%)
                    </Label>
                    <Input
                      id="refinanceRate"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.05"
                      value={inputs.refinanceRate}
                      onChange={(event) => handleInputChange('refinanceRate', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="refinanceTerm" className="text-sm font-medium">
                      Term (years)
                    </Label>
                    <Input
                      id="refinanceTerm"
                      type="number"
                      inputMode="numeric"
                      min={5}
                      step="1"
                      value={inputs.refinanceTerm}
                      onChange={(event) => handleInputChange('refinanceTerm', event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="button" className="flex-1" onClick={handleReset} variant="outline">
                  Reset
                </Button>
                <Button
                  type="button"
                  className="flex-1"
                  onClick={() => setResults(calculateOutputs(inputs))}
                >
                  Update
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <TrendingUp className="h-5 w-5" />
                  Strategy Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Cash-Out Proceeds
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.cashOutProceeds)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Annual Cash Flow</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.annualCashFlow)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Cash-on-Cash</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {percentFormatter.format(results.cashOnCashReturn)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Building2 className="h-5 w-5 text-slate-600" />
                  Deal Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Total Acquisition</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalAcquisition)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    Refinance Loan (LTV {inputs.refinanceLtv}%)
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.refinanceLoan)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Mortgage Payment</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.mortgagePayment)}
                    <span className="text-base text-slate-500"> /month</span>
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Equity Created</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.equityCreated)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                  Capital Stack Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={results.capitalStack}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
                    <Tooltip
                      formatter={(value) => currencyFormatter.format(Number(value))}
                      cursor={{ fill: 'rgba(79, 70, 229, 0.08)' }}
                    />
                    <Legend />
                    <Bar dataKey="amount" name="Amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Heading
            as="h2"
            size="h2"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            BRRRR Real Estate Calculator Breakdown
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            This BRRRR real estate calculator highlights how your renovation budget, refinance
            terms, and rental assumptions interact. Tweak rent, vacancy, and LTV expectations to see
            how sensitive your cash-out proceeds are before you add the property to your portfolio.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Putting the BRRRR Calculator to Work
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Use the BRRRR calculator to compare multiple properties quickly, ensuring each deal
            generates enough equity and cash flow to rinse and repeat. Export your figures into
            investment memorandums, or share them with lenders to validate borrowing capacity before
            you go under contract.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>
    </div>
  );
}
