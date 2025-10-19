import { Helmet } from 'react-helmet-async';
import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Calculator, Home, Percent, PiggyBank, BarChart3 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'buy to let mortgage calculator',
  'btl mortgage calculator',
  'buy to let mortgage',
  'buy to let mortgage stamp duty',
  'buy to let mortgage calculator uk',
  'buy to let stamp duty',
];

const metaDescription =
  'Use our buy to let mortgage calculator to plan deposits, compare BTL mortgage calculator stress tests, and forecast buy to let mortgage yields for upcoming rentals.';

const canonicalUrl = 'https://calcmymoney.co.uk/calculators/buy-to-let-mortgage-calculator';
const pageTitle = 'Buy-to-Let Mortgage Calculator | BTL Mortgage Calculator';

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Buy-to-Let Mortgage Calculator',
  url: canonicalUrl,
  description: metaDescription,
  keywords: keywords.slice(0, 5),
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'Action',
    name: 'Analyse buy to let mortgage',
    target: canonicalUrl,
  },
};

const defaultInputs = {
  propertyPrice: '325000',
  depositPercent: '25',
  interestRate: '5.5',
  termYears: '25',
  monthlyRent: '1600',
  otherMonthlyCosts: '350',
  stressRate: '7',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const stampDutyBands = [
  { threshold: 0, rate: 0.03 },
  { threshold: 250000, rate: 0.08 },
  { threshold: 925000, rate: 0.13 },
  { threshold: 1500000, rate: 0.15 },
];

const calculateStampDuty = (price) => {
  if (price <= 0) return 0;
  let remaining = price;
  let duty = 0;

  for (let i = stampDutyBands.length - 1; i >= 0; i -= 1) {
    const { threshold, rate } = stampDutyBands[i];
    if (price > threshold) {
      const taxable = remaining - threshold;
      duty += taxable * rate;
      remaining -= taxable;
    }
  }

  return duty;
};

const calculateMortgagePayment = (principal, annualRatePercent, termYears) => {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;
  if (principal <= 0 || annualRatePercent <= 0 || termYears <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
};

const faqItems = [
  {
    question: 'What is a stress test rate for buy-to-let mortgages?',
    answer:
      'Lenders often stress test rental income at a higher interest rate, commonly between 6% and 8%, to ensure the rent covers mortgage payments by at least 125-145%. Adjust the stress rate slider to see how your rental coverage shifts.',
  },
  {
    question: 'How much deposit do I need for a buy-to-let mortgage?',
    answer:
      'Most lenders require a 25% minimum deposit for buy-to-let. Larger deposits can secure better rates and improve your loan-to-value ratio, which lowers monthly payments and boosts cash flow.',
  },
  {
    question: 'Does the calculator include buy-to-let stamp duty?',
    answer:
      'Yes. The calculator estimates the additional 3% surcharge and banded UK stamp duty rates for second properties, helping you understand the true cash you need to complete the purchase.',
  },
];

export default function BuyToLetMortgageCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(() => ({}));

  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  useEffect(() => {
    const propertyPrice = Number(inputs.propertyPrice) || 0;
    const depositPercent = Number(inputs.depositPercent) || 0;
    const interestRate = Number(inputs.interestRate) || 0;
    const termYears = Number(inputs.termYears) || 0;
    const monthlyRent = Number(inputs.monthlyRent) || 0;
    const otherMonthlyCosts = Number(inputs.otherMonthlyCosts) || 0;
    const stressRate = Number(inputs.stressRate) || 0;

    const depositAmount = propertyPrice * (depositPercent / 100);
    const loanAmount = Math.max(propertyPrice - depositAmount, 0);
    const ltv = propertyPrice > 0 ? (loanAmount / propertyPrice) * 100 : 0;
    const mortgagePayment = calculateMortgagePayment(loanAmount, interestRate, termYears);
    const interestOnlyPayment = (loanAmount * (interestRate / 100)) / 12;
    const stressPayment = (loanAmount * (stressRate / 100)) / 12;
    const annualRent = monthlyRent * 12;
    const annualCosts = otherMonthlyCosts * 12;
    const annualMortgageCost = interestOnlyPayment * 12;
    const annualNetIncome = annualRent - annualCosts - annualMortgageCost;
    const rentalCoverage = interestOnlyPayment > 0 ? monthlyRent / interestOnlyPayment : 0;
    const stressCoverage = stressPayment > 0 ? monthlyRent / stressPayment : 0;
    const grossYield = propertyPrice > 0 ? (annualRent / propertyPrice) * 100 : 0;
    const netYield = propertyPrice > 0 ? ((annualRent - annualCosts) / propertyPrice) * 100 : 0;

    const stampDuty = calculateStampDuty(propertyPrice);
    const totalCashRequired = depositAmount + stampDuty + (otherMonthlyCosts * 3 || 0);

    const chartData = [
      {
        name: 'Monthly',
        Rent: monthlyRent,
        'Mortgage (Interest Only)': interestOnlyPayment,
        'Other Costs': otherMonthlyCosts,
      },
    ];

    setResults({
      depositAmount,
      loanAmount,
      ltv,
      mortgagePayment,
      interestOnlyPayment,
      stressPayment,
      annualRent,
      annualCosts,
      annualMortgageCost,
      annualNetIncome,
      rentalCoverage,
      stressCoverage,
      grossYield,
      netYield,
      stampDuty,
      totalCashRequired,
      chartData,
    });
  }, [inputs]);

  const sliderDepositMax = Math.max(40, Number(inputs.depositPercent) || 0);
  const sliderRateMax = Math.max(10, Number(inputs.interestRate) || 0);
  const sliderStressMax = Math.max(9, Number(inputs.stressRate) || 0);

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
      </Helmet>

      <div className="bg-white dark:bg-gray-950">
        <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Buy-to-Let Mortgage Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            See your deposit, loan-to-value, mortgage payments, and rental coverage in seconds so
            you can invest with confidence.
          </p>
        </div>
        </section>

        <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Property & Mortgage Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="propertyPrice" className="text-sm font-medium">
                    Property Price (£)
                  </Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.propertyPrice}
                    onChange={(event) => handleInputChange('propertyPrice', event.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Deposit (%)
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter.format(Number(inputs.depositPercent) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.depositPercent)]}
                    onValueChange={(value) => handleInputChange('depositPercent', String(value[0]))}
                    min={15}
                    max={sliderDepositMax}
                    step={1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex justify-between items-center">
                      Interest Rate
                      <span className="text-emerald-600 font-semibold">
                        {percentageFormatter.format(Number(inputs.interestRate) || 0)}%
                      </span>
                    </Label>
                    <Slider
                      value={[Number(inputs.interestRate)]}
                      onValueChange={(value) => handleInputChange('interestRate', String(value[0]))}
                      min={1}
                      max={sliderRateMax}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="termYears" className="text-sm font-medium">
                      Term (years)
                    </Label>
                    <Input
                      id="termYears"
                      type="number"
                      inputMode="numeric"
                      min={5}
                      step={1}
                      value={inputs.termYears}
                      onChange={(event) => handleInputChange('termYears', event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-emerald-100 dark:border-emerald-900 space-y-4">
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
                  <Label htmlFor="otherMonthlyCosts" className="text-sm font-medium">
                    Other Monthly Costs (£)
                  </Label>
                  <Input
                    id="otherMonthlyCosts"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.otherMonthlyCosts}
                    onChange={(event) => handleInputChange('otherMonthlyCosts', event.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Stress Test Rate
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter.format(Number(inputs.stressRate) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.stressRate)]}
                    onValueChange={(value) => handleInputChange('stressRate', String(value[0]))}
                    min={5}
                    max={sliderStressMax}
                    step={0.1}
                  />
                </div>
              </div>

              <Button type="button" variant="outline" onClick={() => setInputs(defaultInputs)}>
                Reset to defaults
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <Home className="h-5 w-5" />
                  Mortgage Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/50 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Loan Amount</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.loanAmount || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Deposit {currencyFormatter.format(results.depositAmount || 0)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/50 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Interest Only</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.interestOnlyPayment || 0)}
                    <span className="text-base text-emerald-600 dark:text-emerald-200">/mo</span>
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Repayment {currencyFormatter.format(results.mortgagePayment || 0)}/mo
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/50 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">LTV</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {percentageFormatter.format(results.ltv || 0)}%
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-200">
                    Stress Rent Cover {(results.stressCoverage || 0).toFixed(2)}x
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-slate-600" />
                  Cash Flow & Yield
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Annual Rent</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.annualRent || 0)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Annual Costs</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(
                      (results.annualCosts || 0) + (results.annualMortgageCost || 0)
                    )}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Annual Net Income</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.annualNetIncome || 0)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Rental Coverage (ICR)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {(results.rentalCoverage || 0).toFixed(2)}x
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Gross Yield</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentageFormatter.format(results.grossYield || 0)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Net Yield</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentageFormatter.format(results.netYield || 0)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BarChart3 className="h-5 w-5 text-slate-600" />
                  Monthly Cash Flow Chart
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => currencyFormatter.format(Number(value))} />
                    <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                    <Legend />
                    <Bar dataKey="Rent" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Mortgage (Interest Only)" fill="#6366f1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Other Costs" fill="#f97316" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-slate-600" />
                  Stamp Duty & Cash Required
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Buy-to-Let Stamp Duty</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.stampDuty || 0)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Total Cash to Complete</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalCashRequired || 0)}
                  </p>
                  <p className="text-xs text-slate-500">
                    Includes deposit, buy to let mortgage stamp duty, and three months of running
                    costs.
                  </p>
                </div>
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
            Buy to Let Mortgage Stamp Duty Considerations
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Understanding buy to let mortgage stamp duty is essential before you exchange contracts.
            The calculator applies the additional property surcharge so you can plan for the extra
            cash outlay and avoid surprises at completion.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Buy to Let Mortgage Calculator UK Insights
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            UK lenders typically require a minimum interest coverage ratio of 125% for standard
            taxpayers and 145% for higher-rate taxpayers. Use this buy to let mortgage calculator uk
            to test different rental assumptions before approaching brokers.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Planning Around Buy to Let Stamp Duty Costs
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Buy to let stamp duty takes a significant chunk out of your returns, especially on
            higher-value properties. Budget for legal fees, surveys, and refurbishments alongside
            the tax so you maintain enough reserves for voids and repairs once the tenants move in.
          </p>
        </div>
        </section>

        <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
        </section>
      </div>
    </>
  );
}
