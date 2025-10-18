import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, FileText, Percent, Scale } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/effective-tax-rate-calculator';

const schemaKeywords = [
  'Taxable Income',
  'Gross Income',
  'Tax Due',
  'Tax Burden',
  'Financial Analysis',
];

const faqItems = [
  {
    question: 'What is an effective tax rate?',
    answer:
      'It is the percentage of your gross income paid in income tax and National Insurance combined. Unlike marginal rates, it reflects your overall tax burden.',
  },
  {
    question: 'How can I lower my effective tax rate?',
    answer:
      'Increasing pension contributions, using salary sacrifice, and making Gift Aid donations can reduce taxable income. Review tax planning options with a qualified adviser.',
  },
  {
    question: 'Why is National Insurance included?',
    answer:
      'NI is a payroll charge that reduces net pay. Including it alongside income tax gives a clearer picture of your true tax rate.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function EffectiveTaxRateCalculator() {
  const [inputs, setInputs] = useState({
    grossIncome: '52000',
    taxableIncome: '48000',
    incomeTaxPaid: '7400',
    nationalInsurancePaid: '4100',
    otherTaxes: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      grossIncome: '52000',
      taxableIncome: '48000',
      incomeTaxPaid: '7400',
      nationalInsurancePaid: '4100',
      otherTaxes: '0',
    });
  }, []);

  const results = useMemo(() => {
    const grossIncome = Number(inputs.grossIncome) || 0;
    const taxableIncome = Number(inputs.taxableIncome) || 0;
    const incomeTaxPaid = Number(inputs.incomeTaxPaid) || 0;
    const nationalInsurancePaid = Number(inputs.nationalInsurancePaid) || 0;
    const otherTaxes = Number(inputs.otherTaxes) || 0;

    const totalTaxPaid = incomeTaxPaid + nationalInsurancePaid + otherTaxes;
    const effectiveRate =
      grossIncome > 0 ? (totalTaxPaid / grossIncome) * 100 : 0;
    const taxToIncomeRatio =
      taxableIncome > 0 ? (incomeTaxPaid / taxableIncome) * 100 : 0;
    const postTaxIncome = grossIncome - totalTaxPaid;

    return {
      grossIncome,
      taxableIncome,
      incomeTaxPaid,
      nationalInsurancePaid,
      otherTaxes,
      totalTaxPaid,
      effectiveRate,
      taxToIncomeRatio,
      postTaxIncome,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Effective Tax Rate &amp; True Tax Rate Calculator</title>
        <meta
          name="description"
          content="Effective Tax Rate Calculator showing average tax rate across income tax and National Insurance. Analyse total tax paid for smarter planning."
        />
        <meta
          name="keywords"
          content="Effective Tax Calculator, Average Tax Rate, Total Tax Paid"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Effective Tax Rate Calculator',
              description:
                'Financial analysis tool assessing taxable income, gross income, tax due, and overall tax burden to reveal the true tax rate.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Effective Tax Rate Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate effective rate, review tax calculation inputs, and understand income tax with
            National Insurance for better tax planning.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Tax Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="grossIncome" className="text-sm font-medium">
                  Gross income (GBP)
                </Label>
                <Input
                  id="grossIncome"
                  inputMode="decimal"
                  value={inputs.grossIncome}
                  onChange={(event) => handleChange('grossIncome', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="taxableIncome" className="text-sm font-medium">
                  Taxable income (GBP)
                </Label>
                <Input
                  id="taxableIncome"
                  inputMode="decimal"
                  value={inputs.taxableIncome}
                  onChange={(event) => handleChange('taxableIncome', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="incomeTaxPaid" className="text-sm font-medium">
                  Income tax paid (GBP)
                </Label>
                <Input
                  id="incomeTaxPaid"
                  inputMode="decimal"
                  value={inputs.incomeTaxPaid}
                  onChange={(event) => handleChange('incomeTaxPaid', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nationalInsurancePaid" className="text-sm font-medium">
                  National Insurance paid (GBP)
                </Label>
                <Input
                  id="nationalInsurancePaid"
                  inputMode="decimal"
                  value={inputs.nationalInsurancePaid}
                  onChange={(event) =>
                    handleChange('nationalInsurancePaid', event.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="otherTaxes" className="text-sm font-medium">
                  Other payroll taxes (GBP)
                </Label>
                <Input
                  id="otherTaxes"
                  inputMode="decimal"
                  value={inputs.otherTaxes}
                  onChange={(event) => handleChange('otherTaxes', event.target.value)}
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
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Effective Rate Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Total tax paid</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.totalTaxPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effective tax rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.effectiveRate.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average income tax vs taxable income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.taxToIncomeRatio.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net income after tax &amp; NI</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.postTaxIncome)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Scale className="h-5 w-5 text-indigo-500" />
                  Tax Planning Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Calculate effective rate annually to evaluate whether pension contributions, salary
                  sacrifice, or charitable donations could reduce your tax burden.
                </p>
                <p>
                  Review National Insurance alongside income tax when budgeting, as both erode net
                  pay. Separate tracking clarifies your overall tax calculation.
                </p>
                <p>
                  Keep records of taxable income and reliefs to support financial analysis and ensure
                  your tax planning adapts as earnings change.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Effective Rate with Tax Planning Insight
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Combine income tax, National Insurance, and other payroll deductions to see your true tax
            burden. This helps align budgets with actual net income.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Income Tax and National Insurance Overview
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Effective rate reveals the portion of gross income spent on HMRC liabilities. Tracking
            both income tax and National Insurance ensures no hidden costs disrupt forecasts.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Strengthen Tax Planning Decisions
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this calculator to test how pension contributions or bonus payments change the
            effective rate, supporting smarter financial analysis.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
