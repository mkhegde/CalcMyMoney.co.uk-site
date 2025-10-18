import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Shield, PiggyBank, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/national-insurance-calculator';

const schemaKeywords = [
  'NI Earnings Thresholds',
  'Gross Salary',
  'Take-Home Pay',
  'UK Tax',
  'State Pension',
];

const faqItems = [
  {
    question: 'What are the main National Insurance thresholds?',
    answer:
      'Employees pay Class 1 NI on earnings above the Primary Threshold (£12,570 for most people) and up to the Upper Earnings Limit (£50,270). Earnings above that limit attract a smaller NI rate.',
  },
  {
    question: 'Are NI contributions the same for all employees?',
    answer:
      'No. NI classes differ for employees, self-employed workers, and company directors. This calculator focuses on Class 1 employee contributions based on annual gross salary.',
  },
  {
    question: 'Do salary sacrifice pension schemes reduce NI?',
    answer:
      'Yes. Reducing taxable pay via salary sacrifice lowers taxable income and National Insurance contributions. Enter salary after any sacrifice to model the impact.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_MAIN_RATE = 0.08; // 8% employee rate
const NI_UPPER_RATE = 0.02; // 2% employee rate
const NI_EMPLOYER_SECONDARY_THRESHOLD = 9100;
const NI_EMPLOYER_RATE = 0.138; // 13.8%

export default function NationalInsuranceCalculator() {
  const [inputs, setInputs] = useState({
    annualSalary: '42000',
    pensionPercent: '5',
    salarySacrifice: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      annualSalary: '42000',
      pensionPercent: '5',
      salarySacrifice: '0',
    });
  }, []);

  const results = useMemo(() => {
    const annualSalary = Number(inputs.annualSalary) || 0;
    const pensionPercent = Math.max(0, Number(inputs.pensionPercent) || 0) / 100;
    const salarySacrifice = Math.max(0, Number(inputs.salarySacrifice) || 0);

    const pensionContribution = annualSalary * pensionPercent;
    const niablePay = Math.max(0, annualSalary - salarySacrifice);

    const niBand1Earnings = Math.max(0, Math.min(niablePay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD);
    const niBand2Earnings = Math.max(0, niablePay - NI_UPPER_EARNINGS_LIMIT);

    const employeeNI = niBand1Earnings * NI_MAIN_RATE + niBand2Earnings * NI_UPPER_RATE;

    const employerBandEarnings = Math.max(0, niablePay - NI_EMPLOYER_SECONDARY_THRESHOLD);
    const employerNI = employerBandEarnings * NI_EMPLOYER_RATE;

    const monthlyNI = employeeNI / 12;
    const effectiveRate = niablePay > 0 ? (employeeNI / niablePay) * 100 : 0;
    const takeHomeEstimate = niablePay - employeeNI - pensionContribution;

    return {
      annualSalary,
      pensionContribution,
      niablePay,
      employeeNI,
      employerNI,
      monthlyNI,
      effectiveRate,
      takeHomeEstimate,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>National Insurance &amp; NI Contributions Calculator</title>
        <meta
          name="description"
          content="National Insurance Calculator for UK employees. Estimate NI classes, taxable income bands, and NI contributions affecting take-home pay."
        />
        <meta
          name="keywords"
          content="National Insurance Calculator, NI Classes, Taxable Income"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'National Insurance Calculator',
              description:
                'Calculator estimating NI earnings thresholds, gross salary, take-home pay, and National Insurance contributions for UK employees under HMRC rules.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            National Insurance Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate National Insurance, understand your NI rate, and view contribution amount to
            inform NI relief discussions with HMRC.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Income Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="annualSalary" className="text-sm font-medium">
                  Annual gross salary (GBP)
                </Label>
                <Input
                  id="annualSalary"
                  inputMode="decimal"
                  value={inputs.annualSalary}
                  onChange={(event) => handleChange('annualSalary', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pensionPercent" className="text-sm font-medium">
                  Employee pension contribution (%)
                </Label>
                <Input
                  id="pensionPercent"
                  inputMode="decimal"
                  value={inputs.pensionPercent}
                  onChange={(event) => handleChange('pensionPercent', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="salarySacrifice" className="text-sm font-medium">
                  Salary sacrifice (GBP)
                </Label>
                <Input
                  id="salarySacrifice"
                  inputMode="decimal"
                  value={inputs.salarySacrifice}
                  onChange={(event) => handleChange('salarySacrifice', event.target.value)}
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
                  <Shield className="h-5 w-5 text-indigo-500" />
                  NI Contributions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Employee NI (annual)</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.employeeNI)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employee NI (monthly)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyNI)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Employer NI (annual)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.employerNI)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effective NI rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.effectiveRate.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated take-home pay (after NI &amp; pension)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.takeHomeEstimate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pension contribution</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.pensionContribution)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-indigo-500" />
                  NI Relief Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Salary sacrifice arrangements and employee pension contributions reduce NIable pay,
                  delivering NI relief and boosting take-home pay.
                </p>
                <p>
                  Directors may calculate NI on an annual earnings basis. This calculator assumes a
                  standard employee paid under PAYE.
                </p>
                <p>
                  Keep payroll records up to date to support HMRC reviews and maintain qualifying
                  years for the State Pension.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate National Insurance with Confidence
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Combine NI rate data and contribution amount outputs to review take-home pay. Use the
            figures when discussing NI relief or HMRC adjustments with your payroll provider.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            NI Rate Awareness Supports Financial Planning
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding how NI interacts with income tax ensures accurate cash-flow forecasts and
            supports pension decisions that influence UK State Pension entitlements.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Monitor NI Contributions for HMRC Compliance
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Track NI classes and taxable income boundaries each tax year. Staying informed helps avoid
            surprises during PAYE reconciliations and reinforces take-home pay planning.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
