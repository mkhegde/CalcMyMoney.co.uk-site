import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Coins, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/rent-vs-buy-calculator';

const schemaKeywords = [
  'Mortgage Costs',
  'Rental Costs',
  'Opportunity Cost',
  'Break-Even Point',
  'Real Estate Finance',
];

const faqItems = [
  {
    question: 'What are the key elements in a rent vs buy comparison?',
    answer:
      'Consider mortgage costs, maintenance, insurance, and the opportunity cost of tying up capital in a deposit. Also factor in how long you plan to stay, rental inflation, and house price trends.',
  },
  {
    question: 'How is opportunity cost applied to a house deposit?',
    answer:
      'Opportunity cost is the investment return you forego by using savings as a deposit. Estimate it using your expected long-term return from savings or investments.',
  },
  {
    question: 'When does buying typically break even?',
    answer:
      'Buying often breaks even when the cumulative cost of ownership becomes lower than renting. This calculator estimates the break-even point within your chosen horizon.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function RentVsBuyCalculator() {
  const [inputs, setInputs] = useState({
    monthlyRent: '1300',
    annualRentIncrease: '3',
    propertyPrice: '325000',
    depositPercent: '15',
    mortgageRate: '4.2',
    mortgageTermYears: '30',
    maintenancePercent: '1',
    insurancePerYear: '350',
    opportunityCostRate: '3',
    investmentHorizonYears: '7',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      monthlyRent: '1300',
      annualRentIncrease: '3',
      propertyPrice: '325000',
      depositPercent: '15',
      mortgageRate: '4.2',
      mortgageTermYears: '30',
      maintenancePercent: '1',
      insurancePerYear: '350',
      opportunityCostRate: '3',
      investmentHorizonYears: '7',
    });
  }, []);

  const results = useMemo(() => {
    const monthlyRent = Number(inputs.monthlyRent) || 0;
    const annualRentIncrease = Number(inputs.annualRentIncrease) / 100 || 0;
    const propertyPrice = Number(inputs.propertyPrice) || 0;
    const depositPercent = Number(inputs.depositPercent) / 100 || 0;
    const mortgageRate = Number(inputs.mortgageRate) / 100 || 0;
    const mortgageTermYears = Number(inputs.mortgageTermYears) || 0;
    const maintenancePercent = Number(inputs.maintenancePercent) / 100 || 0;
    const insurancePerYear = Number(inputs.insurancePerYear) || 0;
    const opportunityCostRate = Number(inputs.opportunityCostRate) / 100 || 0;
    const investmentHorizonYears = Number(inputs.investmentHorizonYears) || 0;

    const depositAmount = propertyPrice * depositPercent;
    const mortgagePrincipal = Math.max(0, propertyPrice - depositAmount);

    const mortgageMonths = mortgageTermYears * 12;
    const monthlyRate = mortgageRate / 12;
    const monthlyMortgagePayment =
      mortgageMonths > 0 && mortgagePrincipal > 0
        ? monthlyRate === 0
          ? mortgagePrincipal / mortgageMonths
          : (mortgagePrincipal * monthlyRate * Math.pow(1 + monthlyRate, mortgageMonths)) /
            (Math.pow(1 + monthlyRate, mortgageMonths) - 1)
        : 0;

    const annualMaintenance = propertyPrice * maintenancePercent;
    const annualMortgageCost = monthlyMortgagePayment * 12;
    const annualBuyCost = annualMortgageCost + annualMaintenance + insurancePerYear;

    let rent = monthlyRent;
    let cumulativeRent = 0;
    for (let year = 1; year <= investmentHorizonYears; year += 1) {
      cumulativeRent += rent * 12;
      rent *= 1 + annualRentIncrease;
    }

    const totalBuyCost =
      depositAmount + annualBuyCost * investmentHorizonYears + depositAmount * opportunityCostRate * investmentHorizonYears;
    const totalRentCost =
      cumulativeRent + depositAmount * opportunityCostRate * investmentHorizonYears;
    const netAdvantage = totalRentCost - totalBuyCost;

    let rentAccumulator = 0;
    let buyAccumulator = depositAmount;
    let breakEvenYear = null;
    rent = monthlyRent;
    for (let year = 1; year <= investmentHorizonYears; year += 1) {
      rentAccumulator += rent * 12;
      buyAccumulator += annualBuyCost;
      if (breakEvenYear === null && buyAccumulator <= rentAccumulator) {
        breakEvenYear = year;
      }
      rent *= 1 + annualRentIncrease;
    }

    return {
      depositAmount,
      mortgagePrincipal,
      monthlyMortgagePayment,
      annualMaintenance,
      annualBuyCost,
      totalRentCost,
      totalBuyCost,
      netAdvantage,
      opportunityCost: depositAmount * opportunityCostRate * investmentHorizonYears,
      breakEvenYear,
      investmentHorizonYears,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Rent vs Buy &amp; Housing Decision Calculator</title>
        <meta
          name="description"
          content="Rent vs Buy Calculator comparing mortgage costs and rental costs with opportunity cost and break-even analysis for property ownership decisions."
        />
        <meta
          name="keywords"
          content="Rent vs Buy Calculator, Financial Analysis, Property Ownership"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Rent vs Buy Calculator',
              description:
                'Assess mortgage costs, rental costs, opportunity cost, and break-even point when considering real estate finance decisions.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Rent vs Buy Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate rent vs buy scenarios to evaluate home ownership, renting costs, and the path to
            financial freedom through property investment.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="monthlyRent" className="text-sm font-medium">
                  Monthly rent (GBP)
                </Label>
                <Input
                  id="monthlyRent"
                  inputMode="decimal"
                  value={inputs.monthlyRent}
                  onChange={(event) => handleChange('monthlyRent', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualRentIncrease" className="text-sm font-medium">
                  Annual rent increase (%)
                </Label>
                <Input
                  id="annualRentIncrease"
                  inputMode="decimal"
                  value={inputs.annualRentIncrease}
                  onChange={(event) => handleChange('annualRentIncrease', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="propertyPrice" className="text-sm font-medium">
                  Property price (GBP)
                </Label>
                <Input
                  id="propertyPrice"
                  inputMode="decimal"
                  value={inputs.propertyPrice}
                  onChange={(event) => handleChange('propertyPrice', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="depositPercent" className="text-sm font-medium">
                  Deposit (%)
                </Label>
                <Input
                  id="depositPercent"
                  inputMode="decimal"
                  value={inputs.depositPercent}
                  onChange={(event) => handleChange('depositPercent', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mortgageRate" className="text-sm font-medium">
                  Mortgage rate (%)
                </Label>
                <Input
                  id="mortgageRate"
                  inputMode="decimal"
                  value={inputs.mortgageRate}
                  onChange={(event) => handleChange('mortgageRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="mortgageTermYears" className="text-sm font-medium">
                  Mortgage term (years)
                </Label>
                <Input
                  id="mortgageTermYears"
                  inputMode="decimal"
                  value={inputs.mortgageTermYears}
                  onChange={(event) => handleChange('mortgageTermYears', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="maintenancePercent" className="text-sm font-medium">
                  Annual maintenance (% of property value)
                </Label>
                <Input
                  id="maintenancePercent"
                  inputMode="decimal"
                  value={inputs.maintenancePercent}
                  onChange={(event) => handleChange('maintenancePercent', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="insurancePerYear" className="text-sm font-medium">
                  Insurance per year (GBP)
                </Label>
                <Input
                  id="insurancePerYear"
                  inputMode="decimal"
                  value={inputs.insurancePerYear}
                  onChange={(event) => handleChange('insurancePerYear', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="opportunityCostRate" className="text-sm font-medium">
                  Opportunity cost rate (%)
                </Label>
                <Input
                  id="opportunityCostRate"
                  inputMode="decimal"
                  value={inputs.opportunityCostRate}
                  onChange={(event) => handleChange('opportunityCostRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="investmentHorizonYears" className="text-sm font-medium">
                  Investment horizon (years)
                </Label>
                <Input
                  id="investmentHorizonYears"
                  inputMode="decimal"
                  value={inputs.investmentHorizonYears}
                  onChange={(event) =>
                    handleChange('investmentHorizonYears', event.target.value)
                  }
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Home className="h-5 w-5 text-indigo-500" />
                  Rent vs Buy Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Deposit amount</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.depositAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mortgage principal</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.mortgagePrincipal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly mortgage payment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyMortgagePayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual maintenance</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.annualMaintenance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total rent cost</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.totalRentCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total buy cost</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.totalBuyCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Opportunity cost of deposit</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.opportunityCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Net advantage (positive = renting cheaper)
                    </p>
                    <p
                      className={`text-lg font-semibold ${
                        results.netAdvantage >= 0 ? 'text-rose-600' : 'text-indigo-600'
                      }`}
                    >
                      {currencyFormatter.format(results.netAdvantage)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Break-even year</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.breakEvenYear ?? 'Beyond horizon'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Horizon analysed</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.investmentHorizonYears} years
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Coins className="h-5 w-5 text-indigo-500" />
                  Financial Perspective
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Renters avoid maintenance and property risks but miss out on equity growth. Buyers
                  gain stability and potential appreciation in exchange for upfront costs.
                </p>
                <p>
                  Opportunity cost highlights the investment income forgone by allocating savings to a
                  deposit. Include this in financial analysis for a balanced viewpoint.
                </p>
                <p>
                  Adjust assumptions for mortgage rate changes, rent inflation, and personal
                  circumstances to stress-test your housing decision.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Rent vs Buy for Informed Home Ownership Choices
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Compare renting costs with the financial freedom potential of property investment. The
            calculator weighs mortgage costs and opportunity cost to support home ownership decisions.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Renting Costs vs Home Ownership
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Renting offers flexibility, while owning builds equity. Align the decision with your
            long-term plans, risk tolerance, and the costs of moving or remodelling. The right answer
            can change if your career, family, or financial goals shift.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Optimise Your Deposit Strategy
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            If a purchase is a few years away, model how savings or investments could grow. A larger
            deposit may unlock lower mortgage rates or reduce monthly payments, tipping the balance in
            favour of buying.
          </p>
        </section>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Rent vs Buy Insights
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Test multiple horizons, mortgage rates, and rent inflation scenarios so you understand when
            the scales tip in favour of ownership. Pair the numbers with lifestyle goals for the most
            confident decision.
          </p>
          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Plan for Ownership Extras
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Budget for solicitor fees, moving costs, surveys, insurance, and ongoing maintenance. The
            calculator makes it easy to add these so you compare the full cost of each option.
          </p>
          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Keep a Financial Buffer
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Whether renting or buying, hold an emergency fund. Unexpected repairs, void periods, or job
            changes can happen, and a buffer protects your plan.
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
