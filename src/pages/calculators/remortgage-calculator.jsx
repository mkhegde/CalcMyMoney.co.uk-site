import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Wallet, Info } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/remortgage-calculator';

const schemaKeywords = [
  'Mortgage Balance',
  'New Interest Rate',
  'New Term',
  'Total Savings',
  'Lender Fees',
];

const faqItems = [
  {
    question: 'When is remortgaging worthwhile?',
    answer:
      'Remortgaging helps when the new deal lowers monthly repayments enough to offset lender fees and early repayment charges. Compare total costs over the remaining term before switching.',
  },
  {
    question: 'What costs should I include?',
    answer:
      'Factor in arrangement fees, valuation costs, legal fees, and any early repayment charge on your current mortgage. These affect total savings and payback period.',
  },
  {
    question: 'Can I shorten the mortgage term when remortgaging?',
    answer:
      'Yes. Many borrowers align the new term with their financial goals. Shorter terms increase monthly payments but reduce overall interest.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function monthlyPayment(balance, annualRate, termYears) {
  const months = termYears * 12;
  if (months <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return balance / months;
  const factor = Math.pow(1 + monthlyRate, months);
  return (balance * monthlyRate * factor) / (factor - 1);
}

export default function RemortgageCalculator() {
  const [inputs, setInputs] = useState({
    currentBalance: '210000',
    remainingTermYears: '18',
    currentInterestRate: '5.2',
    newInterestRate: '3.9',
    newTermYears: '18',
    newArrangementFees: '995',
    earlyRepaymentCharge: '2500',
    otherFees: '350',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      currentBalance: '210000',
      remainingTermYears: '18',
      currentInterestRate: '5.2',
      newInterestRate: '3.9',
      newTermYears: '18',
      newArrangementFees: '995',
      earlyRepaymentCharge: '2500',
      otherFees: '350',
    });
  }, []);

  const results = useMemo(() => {
    const currentBalance = Number(inputs.currentBalance) || 0;
    const remainingTermYears = Number(inputs.remainingTermYears) || 0;
    const currentInterestRate = Number(inputs.currentInterestRate) || 0;
    const newInterestRate = Number(inputs.newInterestRate) || 0;
    const newTermYears = Number(inputs.newTermYears) || 0;
    const newArrangementFees = Number(inputs.newArrangementFees) || 0;
    const earlyRepaymentCharge = Number(inputs.earlyRepaymentCharge) || 0;
    const otherFees = Number(inputs.otherFees) || 0;

    const currentMonthly = monthlyPayment(
      currentBalance,
      currentInterestRate,
      remainingTermYears,
    );
    const newMonthly = monthlyPayment(currentBalance, newInterestRate, newTermYears);

    const currentTotalCost = currentMonthly * remainingTermYears * 12;
    const newTotalCost =
      newMonthly * newTermYears * 12 + newArrangementFees + earlyRepaymentCharge + otherFees;

    const monthlySavings = currentMonthly - newMonthly;
    const totalSavings = currentTotalCost - newTotalCost;
    const upfrontCosts = newArrangementFees + earlyRepaymentCharge + otherFees;
    const monthlySavingsPositive = monthlySavings > 0 ? monthlySavings : 0;
    const paybackMonths =
      monthlySavingsPositive > 0 ? Math.ceil(upfrontCosts / monthlySavingsPositive) : Infinity;

    return {
      currentBalance,
      remainingTermYears,
      currentInterestRate,
      currentMonthly,
      currentTotalCost,
      newInterestRate,
      newTermYears,
      newMonthly,
      newTotalCost,
      monthlySavings,
      totalSavings,
      upfrontCosts,
      paybackMonths,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Remortgage Calculator &amp; Remortgage Savings Planner</title>
        <meta
          name="description"
          content="Remortgage Calculator comparing monthly payments, total savings, and early repayment charges to help you decide if switching mortgage deals saves money."
        />
        <meta
          name="keywords"
          content="Remortgage Tool, Monthly Payments, Early Repayment Charges"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Remortgage Calculator',
              description:
                'Compare mortgage balance payoff with new interest rate, new term, total savings, and lender fees to inform property finance decisions.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Remortgage Calculator
          </Heading>
          <p className="text-lg md:text-xl text-blue-100">
            Calculate remortgage savings, analyse mortgage savings, and account for ERC costs when
            reviewing property finance options.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Mortgage Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentBalance" className="text-sm font-medium">
                  Current mortgage balance (GBP)
                </Label>
                <Input
                  id="currentBalance"
                  inputMode="decimal"
                  value={inputs.currentBalance}
                  onChange={(event) => handleChange('currentBalance', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="remainingTermYears" className="text-sm font-medium">
                  Remaining term (years)
                </Label>
                <Input
                  id="remainingTermYears"
                  inputMode="decimal"
                  value={inputs.remainingTermYears}
                  onChange={(event) => handleChange('remainingTermYears', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="currentInterestRate" className="text-sm font-medium">
                  Current interest rate (%)
                </Label>
                <Input
                  id="currentInterestRate"
                  inputMode="decimal"
                  value={inputs.currentInterestRate}
                  onChange={(event) => handleChange('currentInterestRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="newInterestRate" className="text-sm font-medium">
                  New interest rate (%)
                </Label>
                <Input
                  id="newInterestRate"
                  inputMode="decimal"
                  value={inputs.newInterestRate}
                  onChange={(event) => handleChange('newInterestRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="newTermYears" className="text-sm font-medium">
                  New mortgage term (years)
                </Label>
                <Input
                  id="newTermYears"
                  inputMode="decimal"
                  value={inputs.newTermYears}
                  onChange={(event) => handleChange('newTermYears', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="newArrangementFees" className="text-sm font-medium">
                  New lender arrangement fees (GBP)
                </Label>
                <Input
                  id="newArrangementFees"
                  inputMode="decimal"
                  value={inputs.newArrangementFees}
                  onChange={(event) => handleChange('newArrangementFees', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="earlyRepaymentCharge" className="text-sm font-medium">
                  Early repayment charge (GBP)
                </Label>
                <Input
                  id="earlyRepaymentCharge"
                  inputMode="decimal"
                  value={inputs.earlyRepaymentCharge}
                  onChange={(event) => handleChange('earlyRepaymentCharge', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="otherFees" className="text-sm font-medium">
                  Other fees (valuation, legal) (GBP)
                </Label>
                <Input
                  id="otherFees"
                  inputMode="decimal"
                  value={inputs.otherFees}
                  onChange={(event) => handleChange('otherFees', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Home className="h-5 w-5 text-blue-500" />
                  Remortgage Savings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Current monthly payment</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.currentMonthly)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">New monthly payment</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {currencyFormatter.format(results.newMonthly)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly savings</p>
                    <p
                      className={`text-lg font-semibold ${
                        results.monthlySavings >= 0 ? 'text-blue-600' : 'text-rose-600'
                      }`}
                    >
                      {currencyFormatter.format(results.monthlySavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Upfront remortgage costs</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.upfrontCosts)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total cost (current deal)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.currentTotalCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total cost (new deal)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.newTotalCost)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total savings</p>
                    <p
                      className={`text-lg font-semibold ${
                        results.totalSavings >= 0 ? 'text-blue-600' : 'text-rose-600'
                      }`}
                    >
                      {currencyFormatter.format(results.totalSavings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payback period (months)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {Number.isFinite(results.paybackMonths)
                        ? results.paybackMonths
                        : 'Not recovered'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Wallet className="h-5 w-5 text-blue-500" />
                  Remortgage Advice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Factor ERC costs and lender fees into property finance decisions. Even modest fees
                  lengthen the payback period when monthly savings are small.
                </p>
                <p>
                  Compare fixed and variable rates, considering future Bank of England moves. A lower
                  rate now protects monthly budgets if base rates rise.
                </p>
                <p>
                  Consult lenders or brokers before switching to confirm eligibility, valuation
                  requirements, and additional charges tied to mortgage savings forecasts.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Remortgage Outcomes Before Switching
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Model mortgage savings and ERC costs to determine if refinancing delivers property finance
            gains. Use the results to negotiate with lenders or brokers.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Review Mortgage Savings Against Upfront Costs
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Compare monthly savings with fees to assess the break-even point. Large ERCs can offset the
            benefit of a lower rate, delaying remortgage advantages.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Seek Remortgage Advice for Tailored Guidance
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Mortgage advisers help interpret property finance implications, including affordability
            tests and lender requirements for new mortgage offers.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
