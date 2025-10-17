// src/pages/calculators/pension-contribution-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingUp, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/pension-contribution-calculator';

const schemaKeywords = [
  'Contribution Rate',
  'Employer Match',
  'Tax Relief',
  'Retirement Savings',
  'NEST',
];

const faqItems = [
  {
    question: 'How much should I contribute to my pension?',
    answer:
      'Auto-enrolment sets a minimum contribution, but many planners suggest saving 12-15% of gross salary to build a substantial pension fund. Adjust your voluntary contributions to match retirement goals.',
  },
  {
    question: 'How does tax relief work on UK pension contributions?',
    answer:
      'For basic rate taxpayers, every £80 you contribute is topped up to £100 by HMRC. Higher-rate taxpayers can claim additional relief through self-assessment. Workplace pension providers usually add basic rate tax relief automatically.',
  },
  {
    question: 'Do pension contributions reduce take-home pay?',
    answer:
      'Yes, but tax relief and employer contributions offset the reduction. Viewing contributions as part of your total reward package rather than lost pay helps with long-term planning.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function PensionContributionCalculator() {
  const [inputs, setInputs] = useState({
    annualSalary: '42000',
    employeeRate: '5',
    employerRate: '3',
    voluntaryRate: '2',
    qualifyingEarningsMin: '6240',
    qualifyingEarningsMax: '50270',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const annualSalary = Number(inputs.annualSalary) || 0;
    const employeeRate = Number(inputs.employeeRate) / 100 || 0;
    const employerRate = Number(inputs.employerRate) / 100 || 0;
    const voluntaryRate = Number(inputs.voluntaryRate) / 100 || 0;
    const qualifyingEarningsMin = Number(inputs.qualifyingEarningsMin) || 0;
    const qualifyingEarningsMax = Number(inputs.qualifyingEarningsMax) || 0;

    const qualifyingEarnings = Math.max(
      0,
      Math.min(annualSalary, qualifyingEarningsMax) - qualifyingEarningsMin,
    );

    const autoContributionBase = Math.max(0, qualifyingEarnings);
    const employeeContribution = autoContributionBase * employeeRate;
    const employerContribution = autoContributionBase * employerRate;
    const voluntaryContribution = annualSalary * voluntaryRate;

    const grossContribution = employeeContribution + employerContribution + voluntaryContribution;
    const taxRelief = employeeContribution * 0.25;
    const totalIntoPension = grossContribution + taxRelief;

    const employeeMonthly = (employeeContribution + voluntaryContribution - taxRelief) / 12;
    const employerMonthly = employerContribution / 12;
    const taxReliefMonthly = taxRelief / 12;

    return {
      qualifyingEarnings,
      employeeContribution,
      employerContribution,
      voluntaryContribution,
      grossContribution,
      taxRelief,
      totalIntoPension,
      employeeMonthly,
      employerMonthly,
      taxReliefMonthly,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      annualSalary: '42000',
      employeeRate: '5',
      employerRate: '3',
      voluntaryRate: '2',
      qualifyingEarningsMin: '6240',
      qualifyingEarningsMax: '50270',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Pension Contribution & Pension Planning Calculator</title>
        <meta
          name="description"
          content="Model workplace pension amounts, employer match, and tax relief to inform pension planning and auto-enrolment decisions."
        />
        <meta name="keywords" content="Workplace Pension, Pension Amount, Auto-Enrolment" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Pension Contribution Calculator',
              description:
                'Calculate pension contribution rate, employer match, tax relief, and retirement savings projections for workplace schemes such as NEST.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate pension contributions',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Pension Contribution Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Calculate pension contributions, visualise pension planning, and manage your pension fund
            while balancing take-home pay.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Pension Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="annualSalary" className="text-sm font-medium">
                  Annual salary (£)
                </Label>
                <Input
                  id="annualSalary"
                  inputMode="decimal"
                  value={inputs.annualSalary}
                  onChange={(event) => handleChange('annualSalary', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="employeeRate" className="text-sm font-medium">
                    Employee rate (%)
                  </Label>
                  <Input
                    id="employeeRate"
                    inputMode="decimal"
                    value={inputs.employeeRate}
                    onChange={(event) => handleChange('employeeRate', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="employerRate" className="text-sm font-medium">
                    Employer rate (%)
                  </Label>
                  <Input
                    id="employerRate"
                    inputMode="decimal"
                    value={inputs.employerRate}
                    onChange={(event) => handleChange('employerRate', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="voluntaryRate" className="text-sm font-medium">
                    Voluntary rate (%)
                  </Label>
                  <Input
                    id="voluntaryRate"
                    inputMode="decimal"
                    value={inputs.voluntaryRate}
                    onChange={(event) => handleChange('voluntaryRate', event.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="qualifyingEarningsMin" className="text-sm font-medium">
                    Qualifying earnings min (£)
                  </Label>
                  <Input
                    id="qualifyingEarningsMin"
                    inputMode="decimal"
                    value={inputs.qualifyingEarningsMin}
                    onChange={(event) => handleChange('qualifyingEarningsMin', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="qualifyingEarningsMax" className="text-sm font-medium">
                    Qualifying earnings max (£)
                  </Label>
                  <Input
                    id="qualifyingEarningsMax"
                    inputMode="decimal"
                    value={inputs.qualifyingEarningsMax}
                    onChange={(event) => handleChange('qualifyingEarningsMax', event.target.value)}
                  />
                </div>
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-500" />
                  Contribution Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Qualifying earnings</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.qualifyingEarnings)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employee contribution</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.employeeContribution)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employer contribution</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.employerContribution)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Voluntary contribution</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.voluntaryContribution)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax relief</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.taxRelief)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total into pension</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.totalIntoPension)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-emerald-500" />
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-muted-foreground">Contribution impact on take-home pay</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.employeeMonthly)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employer monthly match</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.employerMonthly)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly tax relief</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.taxReliefMonthly)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Contributions for a Strong Pension Fund
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this tool to calculate contributions, assess take-home pay impact, and plan voluntary
            contributions that keep your pension scheme on track for retirement savings targets.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Pension Planning and Pension Fund Growth
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Workplace schemes like NEST or trust-based pensions combine employee savings with
            employer match and tax relief. The sooner you plan, the more time your pension fund has to
            grow through compounding.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Balancing Take-Home Pay with Voluntary Contributions
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Increasing voluntary contributions lowers take-home pay today in exchange for future
            retirement income. Adjust contribution rates gradually to support both current lifestyle
            and long-term pension planning goals.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
