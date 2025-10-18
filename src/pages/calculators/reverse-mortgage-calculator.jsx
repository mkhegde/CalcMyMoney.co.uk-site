import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Landmark, HandCoins, LifeBuoy } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/reverse-mortgage-calculator';

const schemaKeywords = [
  'Property Value',
  'Borrower Age',
  'Interest Rate',
  'Net Payout',
  'Retirement Finance',
];

const faqItems = [
  {
    question: 'What influences reverse mortgage amounts?',
    answer:
      'Lenders consider borrower age, property value, loan-to-value caps, and interest rates. Older borrowers and higher-value properties can unlock larger equity release amounts.',
  },
  {
    question: 'How is interest charged on a reverse mortgage?',
    answer:
      'Interest accrues on the outstanding loan balance and compounds over time. Repayment usually occurs when the property is sold or the borrower moves into long-term care.',
  },
  {
    question: 'What fees are associated with equity release?',
    answer:
      'Expect valuation, arrangement, and legal fees. Some providers also charge completion fees. Always include these when comparing advisers or lenders.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function ltvByAge(age) {
  if (age < 55) return 0;
  if (age >= 85) return 0.5;
  return 0.25 + Math.max(0, (age - 55) / 100);
}

export default function ReverseMortgageCalculator() {
  const [inputs, setInputs] = useState({
    propertyValue: '400000',
    existingMortgage: '50000',
    borrowerAge: '68',
    interestRate: '5.5',
    arrangementFees: '1500',
    legalFees: '1000',
    monthlyDrawdown: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      propertyValue: '400000',
      existingMortgage: '50000',
      borrowerAge: '68',
      interestRate: '5.5',
      arrangementFees: '1500',
      legalFees: '1000',
      monthlyDrawdown: '0',
    });
  }, []);

  const results = useMemo(() => {
    const propertyValue = Number(inputs.propertyValue) || 0;
    const existingMortgage = Number(inputs.existingMortgage) || 0;
    const borrowerAge = Number(inputs.borrowerAge) || 0;
    const interestRate = Number(inputs.interestRate) / 100 || 0;
    const arrangementFees = Number(inputs.arrangementFees) || 0;
    const legalFees = Number(inputs.legalFees) || 0;
    const monthlyDrawdown = Number(inputs.monthlyDrawdown) || 0;

    const maxLtv = ltvByAge(borrowerAge);
    const grossFacility = propertyValue * maxLtv;
    const netInitialRelease = Math.max(0, grossFacility - existingMortgage - arrangementFees - legalFees);
    const annualDrawdown = monthlyDrawdown * 12;
    const yearsProjection = 15;
    let projectedDebt = grossFacility;
    for (let year = 1; year <= yearsProjection; year += 1) {
      projectedDebt += annualDrawdown;
      projectedDebt += projectedDebt * interestRate;
    }
    const remainingEquity = Math.max(0, propertyValue - projectedDebt);

    return {
      propertyValue,
      existingMortgage,
      borrowerAge,
      interestRate,
      arrangementFees,
      legalFees,
      monthlyDrawdown,
      maxLtv,
      grossFacility,
      netInitialRelease,
      projectedDebt,
      remainingEquity,
      yearsProjection,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Reverse Mortgage &amp; Equity Release Calculator</title>
        <meta
          name="description"
          content="Reverse Mortgage Calculator estimating home equity access, loan payouts, and retirement finance for seniors considering equity release."
        />
        <meta
          name="keywords"
          content="Reverse Mortgage Calculator, Home Equity Access, Loan Payouts"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Reverse Mortgage Calculator',
              description:
                'Estimate property value, borrower age, interest rate, and net payout to plan retirement finance using equity release products.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Reverse Mortgage Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Calculate reverse mortgage eligibility, estimate equity release amount, and explore
            retirement income strategies that leverage housing wealth for financial planning.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Equity Release Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="propertyValue" className="text-sm font-medium">
                  Property value (GBP)
                </Label>
                <Input
                  id="propertyValue"
                  inputMode="decimal"
                  value={inputs.propertyValue}
                  onChange={(event) => handleChange('propertyValue', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="existingMortgage" className="text-sm font-medium">
                  Existing mortgage balance (GBP)
                </Label>
                <Input
                  id="existingMortgage"
                  inputMode="decimal"
                  value={inputs.existingMortgage}
                  onChange={(event) => handleChange('existingMortgage', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="borrowerAge" className="text-sm font-medium">
                  Borrower age (years)
                </Label>
                <Input
                  id="borrowerAge"
                  inputMode="numeric"
                  value={inputs.borrowerAge}
                  onChange={(event) => handleChange('borrowerAge', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="interestRate" className="text-sm font-medium">
                  Interest rate (%)
                </Label>
                <Input
                  id="interestRate"
                  inputMode="decimal"
                  value={inputs.interestRate}
                  onChange={(event) => handleChange('interestRate', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrangementFees" className="text-sm font-medium">
                    Arrangement fees (GBP)
                  </Label>
                  <Input
                    id="arrangementFees"
                    inputMode="decimal"
                    value={inputs.arrangementFees}
                    onChange={(event) => handleChange('arrangementFees', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="legalFees" className="text-sm font-medium">
                    Legal fees (GBP)
                  </Label>
                  <Input
                    id="legalFees"
                    inputMode="decimal"
                    value={inputs.legalFees}
                    onChange={(event) => handleChange('legalFees', event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="monthlyDrawdown" className="text-sm font-medium">
                  Monthly drawdown (optional, GBP)
                </Label>
                <Input
                  id="monthlyDrawdown"
                  inputMode="decimal"
                  value={inputs.monthlyDrawdown}
                  onChange={(event) => handleChange('monthlyDrawdown', event.target.value)}
                />
                <p className="caption text-muted-foreground">
                  Regular drawdown increases projected debt over time.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Landmark className="h-5 w-5 text-purple-500" />
                  Equity Release Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Maximum LTV</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {(results.maxLtv * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gross facility amount</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.grossFacility)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net initial release</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.netInitialRelease)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projected debt (15 years)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.projectedDebt)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining equity (15 years)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.remainingEquity)}
                    </p>
                  </div>
                  <div>
