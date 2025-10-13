import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, Receipt } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['corporation tax calculator', 'corporation tax', 'business tax calculator'];

const metaDescription =
  'Use our corporation tax calculator to estimate corporation tax, compare business tax calculator scenarios, and see how allowances change your liability.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/corporation-tax-calculator';
const schemaKeywords = keywords.slice(0, 5);

const corporationTaxFaqs = [
  {
    question: 'What corporation tax rates does the calculator use?',
    answer:
      'The calculator reflects the UK corporation tax system with a main rate of 25%, a small profits rate of 19%, and marginal relief between £50,000 and £250,000. You can adjust profits to see where you fall on the scale.',
  },
  {
    question: 'How do I include salaries and expenses?',
    answer:
      'Enter all allowable business expenses, including director salaries, pension contributions, and operating costs. These reduce taxable profits before corporation tax is applied.',
  },
  {
    question: 'Can I model multiple associated companies?',
    answer:
      'Yes. If you have associated companies the small profits thresholds reduce. Enter the number of associated companies to see how your effective corporation tax rate changes.',
  },
];

const calculateCorporationTax = ({ profits, expenses, capitalAllowance, associatedCompanies }) => {
  const adjustedProfits = Math.max(profits - expenses - capitalAllowance, 0);

  const mainRate = 0.25;
  const smallProfitsRate = 0.19;
  const lowerLimitBase = 50000;
  const upperLimitBase = 250000;
  const associatedMultiplier = Math.min(Math.max(associatedCompanies, 1), 50);
  const lowerLimit = lowerLimitBase / associatedMultiplier;
  const upperLimit = upperLimitBase / associatedMultiplier;

  if (adjustedProfits <= lowerLimit) {
    return {
      adjustedProfits,
      corporationTax: adjustedProfits * smallProfitsRate,
      effectiveRate: smallProfitsRate * 100,
      lowerLimit,
      upperLimit,
    };
  }

  if (adjustedProfits >= upperLimit) {
    return {
      adjustedProfits,
      corporationTax: adjustedProfits * mainRate,
      effectiveRate: mainRate * 100,
      lowerLimit,
      upperLimit,
    };
  }

  const marginalReliefFraction =
    ((upperLimit - adjustedProfits) * (mainRate - smallProfitsRate)) / adjustedProfits;
  const effectiveRate = mainRate - marginalReliefFraction;
  const corporationTax = adjustedProfits * effectiveRate;

  return {
    adjustedProfits,
    corporationTax,
    effectiveRate: effectiveRate * 100,
    lowerLimit,
    upperLimit,
  };
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export default function CorporationTaxCalculatorPage() {
  const [inputs, setInputs] = useState({
    profits: 180000,
    expenses: 45000,
    capitalAllowance: 10000,
    associatedCompanies: 1,
  });

  const results = useMemo(() => calculateCorporationTax(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      profits: 180000,
      expenses: 45000,
      capitalAllowance: 10000,
      associatedCompanies: 1,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Corporation Tax Calculator | Corporation Tax</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Corporation Tax Calculator | Corporation Tax" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Corporation Tax Calculator | Corporation Tax" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Corporation Tax Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate corporation tax liability',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Corporation Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Forecast your corporation tax bill with real-time marginal relief calculations and see
            how expenses and allowances influence your final payment.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Company Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="profits" className="text-sm font-medium">
                  Taxable profits (£)
                </Label>
                <Input
                  id="profits"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.profits}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, profits: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="expenses" className="text-sm font-medium">
                  Allowable expenses (£)
                </Label>
                <Input
                  id="expenses"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.expenses}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, expenses: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="capitalAllowance" className="text-sm font-medium">
                  Capital allowances (£)
                </Label>
                <Input
                  id="capitalAllowance"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.capitalAllowance}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, capitalAllowance: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Associated companies
                  <span className="text-emerald-600 font-semibold">
                    {inputs.associatedCompanies}
                  </span>
                </Label>
                <Slider
                  value={[inputs.associatedCompanies]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, associatedCompanies: value[0] }))
                  }
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <TrendingUp className="h-5 w-5" />
                  Tax Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Adjusted profits</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.adjustedProfits)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Corporation tax</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.corporationTax)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Effective rate</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {results.effectiveRate.toFixed(2)}%
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Profit after tax</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.adjustedProfits - results.corporationTax)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Receipt className="h-5 w-5 text-slate-600" />
                  Marginal Relief Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Thresholds
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Lower limit: {currencyFormatter.format(results.lowerLimit)} <br />
                    Upper limit: {currencyFormatter.format(results.upperLimit)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Rate explanation
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    When profits sit between the limits, marginal relief reduces the corporation tax
                    rate from the main 25%. Adjust associated companies to see how thresholds scale.
                  </p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Business tax calculator planning tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the business tax calculator to check how pension contributions, capital
                allowances, and expenses change your effective corporation tax rate. Scenario plan
                bonuses or new hires before finalising budgets.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Staying ahead on corporation tax
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Set aside funds each month so your corporation tax payment is ready for the end of
                the financial year. Revisit this corporation tax calculator quarterly to stay on top
                of cash flow and avoid surprise bills.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={corporationTaxFaqs} />
        </div>
      </section>
    </div>
  );
}
