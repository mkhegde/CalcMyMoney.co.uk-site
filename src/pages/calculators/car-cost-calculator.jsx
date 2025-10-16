import React, { useState, useMemo, useCallback } from 'react';
import Head from 'next/head';
import { Calculator, Gauge, Car, Wallet } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['car cost calculator'];

const metaDescription =
  'Use our car cost calculator to factor purchase finance, insurance, fuel, tax, and maintenance so you know the true monthly cost of running your car.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/car-cost-calculator';

const faqItems = [
  {
    question: 'What costs should I include when budgeting for a car?',
    answer:
      'Consider finance payments, insurance, road tax, fuel, servicing, tyres, depreciation, and parking permits. Our calculator lets you tailor each component to reflect new or used ownership.',
  },
  {
    question: 'How accurate is the running cost estimate?',
    answer:
      'The tool uses your inputs for mileage, fuel price, and efficiency. Update the figures with your actual receipts each month to keep the forecast aligned with real-world spending.',
  },
  {
    question: 'Can I compare multiple vehicles?',
    answer:
      'Yes. Save the totals for your shortlisted vehicles and compare how different MPG ratings or insurance bands affect monthly affordability before committing to a purchase.',
  },
];

const defaultInputs = {
  purchasePrice: '22000',
  depositPercent: '10',
  interestRate: '5.9',
  termYears: '4',
  expectedDepreciation: '3000',
  annualMileage: '9000',
  mpg: '42',
  fuelPrice: '1.65',
  insuranceAnnual: '650',
  taxAnnual: '180',
  maintenanceAnnual: '500',
  tyresAnnual: '250',
  parkingMonthly: '40',
  breakdownCoverAnnual: '90',
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

const calculateMonthlyPayment = (principal, annualRate, termYears) => {
  if (principal <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = termYears * 12;
  if (monthlyRate === 0) return principal / totalMonths;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
};

export default function CarCostCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const purchasePrice = Number(inputs.purchasePrice) || 0;
    const depositPercent = Number(inputs.depositPercent) || 0;
    const interestRate = Number(inputs.interestRate) || 0;
    const termYears = Number(inputs.termYears) || 0;
    const expectedDepreciation = Number(inputs.expectedDepreciation) || 0;
    const annualMileage = Number(inputs.annualMileage) || 0;
    const mpg = Number(inputs.mpg) || 0;
    const fuelPrice = Number(inputs.fuelPrice) || 0;
    const insuranceAnnual = Number(inputs.insuranceAnnual) || 0;
    const taxAnnual = Number(inputs.taxAnnual) || 0;
    const maintenanceAnnual = Number(inputs.maintenanceAnnual) || 0;
    const tyresAnnual = Number(inputs.tyresAnnual) || 0;
    const parkingMonthly = Number(inputs.parkingMonthly) || 0;
    const breakdownCoverAnnual = Number(inputs.breakdownCoverAnnual) || 0;

    const depositAmount = purchasePrice * (depositPercent / 100);
    const financedAmount = Math.max(purchasePrice - depositAmount, 0);
    const financePayment = calculateMonthlyPayment(financedAmount, interestRate, termYears);

    const totalAnnualFuel = mpg > 0 ? (annualMileage / mpg) * 4.546 * fuelPrice : 0; // litres consumed times price
    const monthlyFuel = totalAnnualFuel / 12;
    const monthlyInsurance = insuranceAnnual / 12;
    const monthlyTax = taxAnnual / 12;
    const monthlyMaintenance = maintenanceAnnual / 12;
    const monthlyTyres = tyresAnnual / 12;
    const monthlyBreakdown = breakdownCoverAnnual / 12;
    const monthlyDepreciation = expectedDepreciation / (termYears > 0 ? termYears * 12 : 12);

    const totalMonthlyCost =
      financePayment +
      monthlyFuel +
      monthlyInsurance +
      monthlyTax +
      monthlyMaintenance +
      monthlyTyres +
      monthlyBreakdown +
      parkingMonthly +
      monthlyDepreciation;

    const chartData = [
      { category: 'Finance', value: financePayment },
      { category: 'Fuel', value: monthlyFuel },
      { category: 'Insurance', value: monthlyInsurance },
      { category: 'Tax', value: monthlyTax },
      { category: 'Maintenance', value: monthlyMaintenance },
      { category: 'Tyres', value: monthlyTyres },
      { category: 'Breakdown Cover', value: monthlyBreakdown },
      { category: 'Parking', value: parkingMonthly },
      { category: 'Depreciation', value: monthlyDepreciation },
    ];

    return {
      depositAmount,
      financedAmount,
      financePayment,
      totalMonthlyCost,
      totalAnnualCost: totalMonthlyCost * 12,
      chartData,
      mpg,
      annualMileage,
    };
  }, [inputs]);

  const depositSliderMax = Math.max(50, Number(inputs.depositPercent) || 0);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Head>
        <title>Car Cost Calculator | Car Cost Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Car Cost Calculator | Car Cost Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Car Cost Calculator | Car Cost Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Car Cost Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate car running costs',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Head>

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Car Cost Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Build a complete picture of what your next car will cost each month, including finance,
            fuel, and ongoing ownership expenses.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Ownership Inputs
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
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Deposit Percentage
                    <span className="text-indigo-600 font-semibold">
                      {percentageFormatter.format(Number(inputs.depositPercent) || 0)}%
                    </span>
                  </Label>
                  <Slider
                    value={[Number(inputs.depositPercent)]}
                    onValueChange={(value) => handleInputChange('depositPercent', String(value[0]))}
                    min={0}
                    max={depositSliderMax}
                    step={1}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium flex justify-between items-center">
                      Interest Rate
                      <span className="text-indigo-600 font-semibold">
                        {percentageFormatter.format(Number(inputs.interestRate) || 0)}%
                      </span>
                    </Label>
                    <Slider
                      value={[Number(inputs.interestRate)]}
                      onValueChange={(value) => handleInputChange('interestRate', String(value[0]))}
                      min={0}
                      max={12}
                      step={0.1}
                    />
                  </div>
                  <div>
                    <Label htmlFor="termYears" className="text-sm font-medium">
                      Finance Term (years)
                    </Label>
                    <Input
                      id="termYears"
                      type="number"
                      inputMode="numeric"
                      min={1}
                      step={1}
                      value={inputs.termYears}
                      onChange={(event) => handleInputChange('termYears', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="expectedDepreciation" className="text-sm font-medium">
                    Depreciation over Term (£)
                  </Label>
                  <Input
                    id="expectedDepreciation"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.expectedDepreciation}
                    onChange={(event) =>
                      handleInputChange('expectedDepreciation', event.target.value)
                    }
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="annualMileage" className="text-sm font-medium">
                      Annual Mileage
                    </Label>
                    <Input
                      id="annualMileage"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.annualMileage}
                      onChange={(event) => handleInputChange('annualMileage', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="mpg" className="text-sm font-medium">
                      MPG (UK)
                    </Label>
                    <Input
                      id="mpg"
                      type="number"
                      inputMode="decimal"
                      min={1}
                      value={inputs.mpg}
                      onChange={(event) => handleInputChange('mpg', event.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fuelPrice" className="text-sm font-medium">
                    Fuel Price per Litre (£)
                  </Label>
                  <Input
                    id="fuelPrice"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="0.01"
                    value={inputs.fuelPrice}
                    onChange={(event) => handleInputChange('fuelPrice', event.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="insuranceAnnual" className="text-sm font-medium">
                      Insurance (£/year)
                    </Label>
                    <Input
                      id="insuranceAnnual"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.insuranceAnnual}
                      onChange={(event) => handleInputChange('insuranceAnnual', event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="taxAnnual" className="text-sm font-medium">
                      Road Tax (£/year)
                    </Label>
                    <Input
                      id="taxAnnual"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.taxAnnual}
                      onChange={(event) => handleInputChange('taxAnnual', event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="maintenanceAnnual" className="text-sm font-medium">
                      Maintenance (£/year)
                    </Label>
                    <Input
                      id="maintenanceAnnual"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.maintenanceAnnual}
                      onChange={(event) =>
                        handleInputChange('maintenanceAnnual', event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="tyresAnnual" className="text-sm font-medium">
                      Tyres (£/year)
                    </Label>
                    <Input
                      id="tyresAnnual"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.tyresAnnual}
                      onChange={(event) => handleInputChange('tyresAnnual', event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="breakdownCoverAnnual" className="text-sm font-medium">
                      Breakdown Cover (£/year)
                    </Label>
                    <Input
                      id="breakdownCoverAnnual"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.breakdownCoverAnnual}
                      onChange={(event) =>
                        handleInputChange('breakdownCoverAnnual', event.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="parkingMonthly" className="text-sm font-medium">
                      Parking Permits (£/month)
                    </Label>
                    <Input
                      id="parkingMonthly"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      value={inputs.parkingMonthly}
                      onChange={(event) => handleInputChange('parkingMonthly', event.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={() => setInputs(defaultInputs)}>
                Reset to defaults
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <Car className="h-5 w-5" />
                  Monthly Ownership Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Finance Payment</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.financePayment)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Running Costs</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(
                      (results.totalMonthlyCost || 0) - results.financePayment
                    )}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Total Monthly Cost</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.totalMonthlyCost)}
                  </p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-200">
                    Annual cost {currencyFormatter.format(results.totalAnnualCost)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Gauge className="h-5 w-5 text-slate-600" />
                  Usage & Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Annual Mileage</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {results.annualMileage?.toLocaleString('en-GB')} miles
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Fuel Efficiency</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentageFormatter.format(results.mpg)} MPG
                  </p>
                  <p className="text-xs text-slate-500">Includes UK gallon conversion</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Wallet className="h-5 w-5 text-slate-600" />
                  Monthly Cost Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis tickFormatter={(value) => currencyFormatter.format(Number(value))} />
                    <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" name="Monthly Cost" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
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
            How the Car Cost Calculator Helps
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            The car cost calculator captures every predictable cost of ownership. By adjusting loan
            terms, MPG, and maintenance expectations, you can see the pressure a vehicle places on
            your monthly budget before signing the finance agreement.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Budget Confidently for Your Next Car
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Use the car cost calculator to compare petrol, hybrid, and electric options. Factor in
            eligible government grants, insurance group differences, and public charging costs so
            you choose the car that balances comfort, running costs, and long-term value.
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
