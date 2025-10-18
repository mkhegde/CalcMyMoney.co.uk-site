import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, BarChart2, Timer } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/future-value-calculator';

const schemaKeywords = [
  'Time Value of Money',
  'Starting Principal',
  'Contribution Amount',
  'Interest Rate',
  'Compounding Frequency',
];

const contributionFrequencies = [
  { value: 'none', label: 'No regular contributions', periods: 1 },
  { value: 'monthly', label: 'Monthly contributions', periods: 12 },
  { value: 'quarterly', label: 'Quarterly contributions', periods: 4 },
  { value: 'annually', label: 'Annual contributions', periods: 1 },
];

const compoundingOptions = [
  { value: 'annual', label: 'Annual', periods: 1 },
  { value: 'semiannual', label: 'Semi-annual', periods: 2 },
  { value: 'quarterly', label: 'Quarterly', periods: 4 },
  { value: 'monthly', label: 'Monthly', periods: 12 },
  { value: 'daily', label: 'Daily (approx. 365)', periods: 365 },
];

const faqItems = [
  {
    question: 'How does compounding frequency affect future value?',
    answer:
      'More frequent compounding increases growth because interest is credited more often. Monthly compounding earns more than annual compounding at the same nominal rate.',
  },
  {
    question: 'Should I include regular contributions?',
    answer:
      'Yes, if you plan to invest a fixed amount each month or quarter. This calculator shows how ongoing contributions accelerate investment growth over the investment horizon.',
  },
  {
    question: 'What rate of return should I use?',
    answer:
      'Use a realistic long-term estimate based on historical returns or your financial adviser’s guidance. Adjust for inflation if you want to see real purchasing power.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function FutureValueCalculator() {
  const [inputs, setInputs] = useState({
    startingPrincipal: '15000',
    annualInterestRate: '6',
    years: '15',
    contributionAmount: '300',
    contributionFrequency: 'monthly',
    compounding: 'monthly',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      startingPrincipal: '15000',
      annualInterestRate: '6',
      years: '15',
      contributionAmount: '300',
      contributionFrequency: 'monthly',
      compounding: 'monthly',
    });
  }, []);

  const results = useMemo(() => {
    const principal = Number(inputs.startingPrincipal) || 0;
    const rate = Number(inputs.annualInterestRate) / 100 || 0;
    const years = Number(inputs.years) || 0;
    const contribution = Number(inputs.contributionAmount) || 0;
    const contributionFrequency =
      contributionFrequencies.find((opt) => opt.value === inputs.contributionFrequency) ||
      contributionFrequencies[1];
    const compounding =
      compoundingOptions.find((opt) => opt.value === inputs.compounding) ||
      compoundingOptions[3];

    const periodsPerYear = compounding.periods;
    const totalPeriods = years * periodsPerYear;
    const periodicRate = rate / periodsPerYear;

    const compoundFactor = Math.pow(1 + periodicRate, totalPeriods);
    const futurePrincipal = principal * compoundFactor;

    const contributionPeriods = contributionFrequency.periods;
    const contributionPerPeriod =
      contributionFrequency.value === 'none'
        ? 0
        : contribution * (contributionFrequency.periods / periodsPerYear);

    let futureContributions = 0;
    if (contributionPerPeriod > 0 && rate > 0) {
      futureContributions =
        contributionPerPeriod * ((compoundFactor - 1) / periodicRate);
    } else if (contributionPerPeriod > 0) {
      futureContributions = contributionPerPeriod * totalPeriods;
    }

    const futureValue = futurePrincipal + futureContributions;
    const totalContributed = principal + contribution * years * contributionFrequency.periods;
    const totalContributionsOnly = futureValue - futurePrincipal;

    return {
      principal,
      rate,
      years,
      contribution,
      periodsPerYear,
      futurePrincipal,
      futureContributions,
      futureValue,
      totalContributed,
      totalContributionsOnly,
      totalGrowth: futureValue - totalContributed,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Future Value &amp; Investment Growth Calculator</title>
        <meta
          name="description"
          content="Future Value Calculator to model compound returns and investment growth over your investment horizon. Plan long-term investments with ease."
        />
        <meta
          name="keywords"
          content="Future Value Calculator, Compound Returns, Investment Horizon"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Future Value Calculator',
              description:
                'Time value of money calculator analysing starting principal, contribution amount, interest rate, and compounding frequency to forecast investment growth.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Future Value Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate future value, understand compound interest, and build financial forecasting
            confidence for long-term investments.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Investment Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="startingPrincipal" className="text-sm font-medium">
                  Starting principal (GBP)
                </Label>
                <Input
                  id="startingPrincipal"
                  inputMode="decimal"
                  value={inputs.startingPrincipal}
                  onChange={(event) => handleChange('startingPrincipal', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="annualInterestRate" className="text-sm font-medium">
                  Annual interest rate (%)
                </Label>
                <Input
                  id="annualInterestRate"
                  inputMode="decimal"
                  value={inputs.annualInterestRate}
                  onChange={(event) => handleChange('annualInterestRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="years" className="text-sm font-medium">
                  Investment horizon (years)
                </Label>
                <Input
                  id="years"
                  inputMode="decimal"
                  value={inputs.years}
                  onChange={(event) => handleChange('years', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contributionAmount" className="text-sm font-medium">
                  Contribution amount (GBP)
                </Label>
                <Input
                  id="contributionAmount"
                  inputMode="decimal"
                  value={inputs.contributionAmount}
                  onChange={(event) => handleChange('contributionAmount', event.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Contribution frequency</Label>
                <select
                  value={inputs.contributionFrequency}
                  onChange={(event) => handleChange('contributionFrequency', event.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  {contributionFrequencies.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium">Compounding frequency</Label>
                <select
                  value={inputs.compounding}
                  onChange={(event) => handleChange('compounding', event.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  {compoundingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  Growth Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Future value</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.futureValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total contributed</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.totalContributed)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Growth from contributions</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.futureContributions)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total growth</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.totalGrowth)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BarChart2 className="h-5 w-5 text-indigo-500" />
                  Investment Planning Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Map contributions to your budget so long-term investments remain consistent. Small,
                  regular deposits often outperform erratic lump sums thanks to compound interest.
                </p>
                <p>
                  Adjust interest rate assumptions for financial forecasting. Conservative estimates
                  prevent overestimating future value.
                </p>
                <p>
                  Revisit investment planning targets annually to reflect market performance, new
                  savings goals, or changes in time horizon.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Future Value for Long-Term Investments
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            This compound interest calculator supports financial forecasting. Mix starting principal,
            regular contributions, and investment horizon to plan long-term investments with clarity.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Compound Interest Drives Investment Planning
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Leaving gains invested multiplies returns over time. Use compounding frequency and
            contribution settings to explore how the time value of money accelerates portfolio growth.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Financial Forecasting Tailored to Your Goals
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Whether saving for retirement, education, or a major purchase, adjusting these inputs will
            guide realistic investment planning scenarios.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
