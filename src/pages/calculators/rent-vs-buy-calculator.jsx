import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Home, Handshake, TrendingUp, CircleDollarSign, PieChart } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'rent vs buy calculator',
  'buy vs rent calculator',
  'mortgage calculator',
  'cost of renting vs owning calculator',
];

const metaDescription =
  'Use our rent vs buy calculator, buy vs rent calculator, and mortgage calculator style comparisons to weigh the cost of renting vs owning over any timeline.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rent-vs-buy-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultInputs = {
  comparisonYears: 7,
  rentMonthly: 1450,
  rentIncreasePercent: 3,
  rentersInsuranceMonthly: 18,
  propertyPrice: 320000,
  depositPercent: 15,
  mortgageRate: 4.5,
  loanTermYears: 30,
  propertyTaxPercent: 0.9,
  maintenancePercent: 1.2,
  homeInsuranceAnnual: 480,
  closingCostsPercent: 2,
  homeAppreciationPercent: 2.5,
};

const rentVsBuyFaqs = [
  {
    question: 'How long should I stay put before buying makes sense?',
    answer:
      'Run multiple scenarios with different timelines. Closing costs and early mortgage interest are front-loaded, so the rent vs buy calculator often favours renting if you move within a couple of years.',
  },
  {
    question: 'Does this include investment growth on my deposit?',
    answer:
      'This comparison focuses on the cost of renting vs owning calculator outputs. Add your own investment assumptions to deposits or rent savings to build an even richer picture.',
  },
  {
    question: 'Why do maintenance and tax estimates matter?',
    answer:
      'Ownership carries ongoing repairs, insurance, and council tax. The buy vs rent calculator makes these explicit so you can budget beyond the mortgage payment alone.',
  },
];

const calculateMonthlyPayment = (principal, annualRate, termYears) => {
  const balance = Math.max(Number(principal) || 0, 0);
  const monthlyRate = Math.max(Number(annualRate) || 0, 0) / 100 / 12;
  const months = Math.max(Math.round(Number(termYears) * 12) || 0, 1);

  if (monthlyRate === 0) {
    return balance / months;
  }

  const factor = (1 + monthlyRate) ** months;
  return (balance * monthlyRate * factor) / (factor - 1);
};

const calculateRentVsBuy = ({
  comparisonYears,
  rentMonthly,
  rentIncreasePercent,
  rentersInsuranceMonthly,
  propertyPrice,
  depositPercent,
  mortgageRate,
  loanTermYears,
  propertyTaxPercent,
  maintenancePercent,
  homeInsuranceAnnual,
  closingCostsPercent,
  homeAppreciationPercent,
}) => {
  const years = Math.max(Number(comparisonYears) || 0, 0);
  const rentStart = Math.max(Number(rentMonthly) || 0, 0);
  const rentIncrease = Math.max(Number(rentIncreasePercent) || 0, 0) / 100;
  const rentersInsurance = Math.max(Number(rentersInsuranceMonthly) || 0, 0);
  const price = Math.max(Number(propertyPrice) || 0, 0);
  const depositRate = Math.min(Math.max(Number(depositPercent) || 0, 0), 80) / 100;
  const deposit = price * depositRate;
  const loanAmount = Math.max(price - deposit, 0);
  const annualPropertyTaxRate = Math.max(Number(propertyTaxPercent) || 0, 0) / 100;
  const annualMaintenanceRate = Math.max(Number(maintenancePercent) || 0, 0) / 100;
  const closingCosts = price * (Math.max(Number(closingCostsPercent) || 0, 0) / 100);
  const appreciationRate = Math.max(Number(homeAppreciationPercent) || 0, 0) / 100;

  let totalRentCost = 0;
  const rentAnnualBreakdown = [];

  for (let year = 0; year < years; year += 1) {
    const annualRent = rentStart * (1 + rentIncrease) ** year * 12;
    totalRentCost += annualRent;
    rentAnnualBreakdown.push({
      year: year + 1,
      monthlyRent: rentStart * (1 + rentIncrease) ** year,
      annualRent,
    });
  }

  const rentersInsuranceCost = rentersInsurance * 12 * years;
  totalRentCost += rentersInsuranceCost;

  const monthlyMortgagePayment = calculateMonthlyPayment(loanAmount, mortgageRate, loanTermYears);
  const monthlyRate = Math.max(Number(mortgageRate) || 0, 0) / 100 / 12;
  const termMonths = Math.max(Math.round(Number(loanTermYears) * 12) || 0, 1);
  const comparisonMonths = Math.max(Math.round(years * 12) || 0, 0);

  let balance = loanAmount;
  let totalInterestPaid = 0;
  let totalPrincipalPaid = 0;
  let monthsSimulated = 0;
  const amortisation = [];

  for (let month = 1; month <= comparisonMonths && balance > 0; month += 1) {
    const interest = balance * monthlyRate;
    const principal = Math.min(monthlyMortgagePayment - interest, balance);
    balance -= principal;
    totalInterestPaid += interest;
    totalPrincipalPaid += principal;
    monthsSimulated = month;

    if (month % 12 === 0 || balance === 0) {
      amortisation.push({
        year: month / 12,
        balance,
        interestPaid: totalInterestPaid,
        principalPaid: totalPrincipalPaid,
      });
    }

    if (month >= termMonths) {
      break;
    }
  }

  const mortgagePayments = monthlyMortgagePayment * monthsSimulated;

  let propertyTaxCost = 0;
  let maintenanceCost = 0;
  const insuranceCost = Math.max(Number(homeInsuranceAnnual) || 0, 0) * years;

  for (let year = 0; year < years; year += 1) {
    const homeValue = price * (1 + appreciationRate) ** year;
    propertyTaxCost += homeValue * annualPropertyTaxRate;
    maintenanceCost += homeValue * annualMaintenanceRate;
  }

  const totalOwningOutflows =
    deposit + closingCosts + mortgagePayments + propertyTaxCost + maintenanceCost + insuranceCost;

  const futureHomeValue = price * (1 + appreciationRate) ** years;
  const remainingBalance = Math.max(balance, 0);
  const homeEquity = Math.max(futureHomeValue - remainingBalance, 0);

  const netCostOwning = totalOwningOutflows - homeEquity;
  const costDifference = totalRentCost - netCostOwning;
  const differencePerMonth = years > 0 ? costDifference / (years * 12) : 0;

  return {
    totalRentCost,
    rentersInsuranceCost,
    rentAnnualBreakdown,
    deposit,
    closingCosts,
    mortgagePayments,
    propertyTaxCost,
    maintenanceCost,
    insuranceCost,
    totalOwningOutflows,
    totalInterestPaid,
    totalPrincipalPaid,
    homeEquity,
    futureHomeValue,
    remainingBalance,
    netCostOwning,
    costDifference,
    differencePerMonth,
    monthlyMortgagePayment,
    monthsSimulated,
    amortisation,
    years,
  };
};

export default function RentVsBuyCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const comparison = useMemo(
    () =>
      calculateRentVsBuy({
        comparisonYears: inputs.comparisonYears,
        rentMonthly: inputs.rentMonthly,
        rentIncreasePercent: inputs.rentIncreasePercent,
        rentersInsuranceMonthly: inputs.rentersInsuranceMonthly,
        propertyPrice: inputs.propertyPrice,
        depositPercent: inputs.depositPercent,
        mortgageRate: inputs.mortgageRate,
        loanTermYears: inputs.loanTermYears,
        propertyTaxPercent: inputs.propertyTaxPercent,
        maintenancePercent: inputs.maintenancePercent,
        homeInsuranceAnnual: inputs.homeInsuranceAnnual,
        closingCostsPercent: inputs.closingCostsPercent,
        homeAppreciationPercent: inputs.homeAppreciationPercent,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  const verdict =
    comparison.costDifference > 0
      ? 'Buying edges ahead over this timeline.'
      : comparison.costDifference < 0
        ? 'Renting keeps more cash in your pocket for now.'
        : 'Both paths cost the same on this timeline.';

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Rent vs Buy Calculator | Buy vs Rent Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Rent vs Buy Calculator | Buy vs Rent Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Rent vs Buy Calculator | Buy vs Rent Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Rent vs Buy Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Compare homes with a rent vs buy calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Rent vs Buy Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Run a buy vs rent calculator before your next move. Check rent inflation, mortgage
            scenarios, and the cost of renting vs owning side-by-side.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Handshake className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Renting profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rentMonthly">Monthly rent (£)</Label>
                  <Input
                    id="rentMonthly"
                    type="number"
                    min="0"
                    step="25"
                    value={inputs.rentMonthly}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        rentMonthly: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentIncreasePercent">Expected annual rent increase (%)</Label>
                  <Slider
                    id="rentIncreasePercent"
                    className="mt-3"
                    value={[Number(inputs.rentIncreasePercent)]}
                    min={0}
                    max={8}
                    step={0.25}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        rentIncreasePercent: Number(value[0].toFixed(2)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.rentIncreasePercent.toFixed(2)}%</span>
                    <span>8%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rentersInsuranceMonthly">Renters insurance monthly (£)</Label>
                  <Input
                    id="rentersInsuranceMonthly"
                    type="number"
                    min="0"
                    step="1"
                    value={inputs.rentersInsuranceMonthly}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        rentersInsuranceMonthly: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparisonYears">Years to compare</Label>
                  <Slider
                    id="comparisonYears"
                    className="mt-3"
                    value={[Number(inputs.comparisonYears)]}
                    min={1}
                    max={20}
                    step={1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        comparisonYears: Number(value[0]),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1 year</span>
                    <span>{inputs.comparisonYears} years</span>
                    <span>20 years</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Buying assumptions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyPrice">Purchase price (£)</Label>
                  <Input
                    id="propertyPrice"
                    type="number"
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
                  <Label htmlFor="depositPercent">Deposit (%)</Label>
                  <Slider
                    id="depositPercent"
                    className="mt-3"
                    value={[Number(inputs.depositPercent)]}
                    min={5}
                    max={40}
                    step={1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        depositPercent: Number(value[0]),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>5%</span>
                    <span>{inputs.depositPercent}%</span>
                    <span>40%</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Deposit equals {currencyFormatter.format(comparison.deposit)}.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mortgageRate">Mortgage rate (%)</Label>
                  <Slider
                    id="mortgageRate"
                    className="mt-3"
                    value={[Number(inputs.mortgageRate)]}
                    min={1.5}
                    max={8}
                    step={0.05}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        mortgageRate: Number(value[0].toFixed(2)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1.5%</span>
                    <span>{inputs.mortgageRate.toFixed(2)}%</span>
                    <span>8%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTermYears">Loan term (years)</Label>
                  <Slider
                    id="loanTermYears"
                    className="mt-3"
                    value={[Number(inputs.loanTermYears)]}
                    min={20}
                    max={35}
                    step={1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        loanTermYears: Number(value[0]),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>20 years</span>
                    <span>{inputs.loanTermYears} years</span>
                    <span>35 years</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closingCostsPercent">Closing costs (%)</Label>
                  <Slider
                    id="closingCostsPercent"
                    className="mt-3"
                    value={[Number(inputs.closingCostsPercent)]}
                    min={0}
                    max={5}
                    step={0.25}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        closingCostsPercent: Number(value[0].toFixed(2)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.closingCostsPercent.toFixed(2)}%</span>
                    <span>5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Ongoing ownership costs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyTaxPercent">Council tax & rates (% of value)</Label>
                  <Slider
                    id="propertyTaxPercent"
                    className="mt-3"
                    value={[Number(inputs.propertyTaxPercent)]}
                    min={0}
                    max={3}
                    step={0.1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        propertyTaxPercent: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.propertyTaxPercent.toFixed(1)}%</span>
                    <span>3%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maintenancePercent">Maintenance reserve (% of value)</Label>
                  <Slider
                    id="maintenancePercent"
                    className="mt-3"
                    value={[Number(inputs.maintenancePercent)]}
                    min={0.5}
                    max={3}
                    step={0.1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        maintenancePercent: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0.5%</span>
                    <span>{inputs.maintenancePercent.toFixed(1)}%</span>
                    <span>3.0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeInsuranceAnnual">Home insurance annual (£)</Label>
                  <Input
                    id="homeInsuranceAnnual"
                    type="number"
                    min="0"
                    step="10"
                    value={inputs.homeInsuranceAnnual}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        homeInsuranceAnnual: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="homeAppreciationPercent">Expected appreciation (%)</Label>
                  <Slider
                    id="homeAppreciationPercent"
                    className="mt-3"
                    value={[Number(inputs.homeAppreciationPercent)]}
                    min={-2}
                    max={6}
                    step={0.25}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        homeAppreciationPercent: Number(value[0].toFixed(2)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>-2%</span>
                    <span>{inputs.homeAppreciationPercent.toFixed(2)}%</span>
                    <span>6%</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example scenario
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CircleDollarSign className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Buy vs rent verdict
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Cost of buying</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(comparison.netCostOwning)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      Includes equity offset
                    </p>
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Cost of renting</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(comparison.totalRentCost)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      Rent + insurance over {inputs.comparisonYears} years
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Difference</span>
                    <span>{currencyFormatter.format(comparison.costDifference)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Per month advantage</span>
                    <span>{currencyFormatter.format(comparison.differencePerMonth)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Mortgage payment</span>
                    <span>{currencyFormatter.format(comparison.monthlyMortgagePayment)}</span>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-sm dark:border-white/10 dark:bg-white/10">
                  <p className="font-semibold text-emerald-800 dark:text-emerald-200">{verdict}</p>
                  <p className="mt-2 text-xs text-emerald-700 dark:text-emerald-200">
                    Equity after {inputs.comparisonYears} years: {currencyFormatter.format(comparison.homeEquity)}.
                    Future home value: {currencyFormatter.format(comparison.futureHomeValue)}.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Cost breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Upfront costs
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {currencyFormatter.format(comparison.deposit + comparison.closingCosts)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Deposit {currencyFormatter.format(comparison.deposit)} and fees {currencyFormatter.format(comparison.closingCosts)}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Interest paid
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {currencyFormatter.format(comparison.totalInterestPaid)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Principal repaid {currencyFormatter.format(comparison.totalPrincipalPaid)}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Property taxes
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {currencyFormatter.format(comparison.propertyTaxCost)}
                    </p>
                  </div>
                  <div className="rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      Maintenance fund
                    </p>
                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                      {currencyFormatter.format(comparison.maintenanceCost)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Insurance (renters vs home)</span>
                  <span>
                    {currencyFormatter.format(comparison.rentersInsuranceCost)} vs {currencyFormatter.format(comparison.insuranceCost)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Cost of renting vs owning calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Blend this rent vs buy calculator with your favourite mortgage calculator to measure
                rate shifts, overpayments, and tenure plans. The cost of renting vs owning calculator
                shows the cash impact of moving fast versus waiting.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Mortgage calculator thinking keeps decisions grounded
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust the assumptions often. Mortgage calculator style updates help you react to rate
                news, salary changes, and new rental deals without over-committing.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={rentVsBuyFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}

