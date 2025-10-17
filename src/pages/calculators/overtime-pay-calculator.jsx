// src/pages/calculators/overtime-pay-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Clock, PoundSterling, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/overtime-pay-calculator';

const schemaKeywords = [
  'Overtime Wages',
  'Extra Hours',
  'Paycheck',
  'Hours Worked',
  'Time and a Half',
];

const faqItems = [
  {
    question: 'How do I calculate overtime pay in the UK?',
    answer:
      'Start with your standard hourly rate, multiply any overtime hours by the agreed overtime multiplier (often 1.5 for time and a half), and add that to your regular pay. Deduct tax and National Insurance as needed to estimate take-home pay.',
  },
  {
    question: 'Does overtime affect my pension or bonuses?',
    answer:
      'It depends on your employment contract. Some employers include overtime in pensionable earnings, while others do not. Check the terms of your pension scheme and employment agreement.',
  },
  {
    question: 'What if I work different overtime rates in the same week?',
    answer:
      'Split the overtime hours by multiplier (e.g., standard overtime vs double time) and run each amount through the calculator separately. Add the totals to see your overall overtime earnings.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function OvertimePayCalculator() {
  const [inputs, setInputs] = useState({
    hourlyRate: '18.00',
    regularHours: '37.5',
    overtimeHours: '6',
    overtimeMultiplier: '1.5',
    taxRate: '20',
    niRate: '12',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const hourlyRate = Number(inputs.hourlyRate) || 0;
    const regularHours = Number(inputs.regularHours) || 0;
    const overtimeHours = Number(inputs.overtimeHours) || 0;
    const overtimeMultiplier = Number(inputs.overtimeMultiplier) || 0;
    const taxRate = Number(inputs.taxRate) || 0;
    const niRate = Number(inputs.niRate) || 0;

    const regularPay = hourlyRate * regularHours;
    const overtimeRate = hourlyRate * overtimeMultiplier;
    const overtimePay = overtimeRate * overtimeHours;
    const grossPay = regularPay + overtimePay;

    const tax = grossPay * (taxRate / 100);
    const nationalInsurance = grossPay * (niRate / 100);
    const deductions = tax + nationalInsurance;
    const netPay = grossPay - deductions;

    return {
      overtimeRate,
      regularPay,
      overtimePay,
      grossPay,
      tax,
      nationalInsurance,
      deductions,
      netPay,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      hourlyRate: '18.00',
      regularHours: '37.5',
      overtimeHours: '6',
      overtimeMultiplier: '1.5',
      taxRate: '20',
      niRate: '12',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Overtime Pay & Overtime Earnings Calculator</title>
        <meta
          name="description"
          content="Calculate overtime rate, overtime pay, and net pay for UK workers with our overtime earnings calculator."
        />
        <meta name="keywords" content="Overtime Rate, Overtime Calculator, UK Pay" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Overtime Pay Calculator',
              description:
                'Interactive overtime pay calculator for UK employees covering extra hours, gross pay, and net pay.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate overtime pay',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Overtime Pay Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate overtime earnings, understand overtime rules, and estimate gross vs net pay in
            line with UK employer obligations.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Pay Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="hourlyRate" className="text-sm font-medium">
                  Hourly rate (£)
                </Label>
                <Input
                  id="hourlyRate"
                  inputMode="decimal"
                  value={inputs.hourlyRate}
                  onChange={(event) => handleChange('hourlyRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="regularHours" className="text-sm font-medium">
                  Regular hours this pay period
                </Label>
                <Input
                  id="regularHours"
                  inputMode="decimal"
                  value={inputs.regularHours}
                  onChange={(event) => handleChange('regularHours', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="overtimeHours" className="text-sm font-medium">
                  Overtime hours
                </Label>
                <Input
                  id="overtimeHours"
                  inputMode="decimal"
                  value={inputs.overtimeHours}
                  onChange={(event) => handleChange('overtimeHours', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="overtimeMultiplier" className="text-sm font-medium">
                  Overtime multiplier (e.g. 1.5)
                </Label>
                <Input
                  id="overtimeMultiplier"
                  inputMode="decimal"
                  value={inputs.overtimeMultiplier}
                  onChange={(event) => handleChange('overtimeMultiplier', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taxRate" className="text-sm font-medium">
                    Tax rate (%)
                  </Label>
                  <Input
                    id="taxRate"
                    inputMode="decimal"
                    value={inputs.taxRate}
                    onChange={(event) => handleChange('taxRate', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="niRate" className="text-sm font-medium">
                    NI rate (%)
                  </Label>
                  <Input
                    id="niRate"
                    inputMode="decimal"
                    value={inputs.niRate}
                    onChange={(event) => handleChange('niRate', event.target.value)}
                  />
                </div>
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
                  <Clock className="h-5 w-5 text-indigo-500" />
                  Overtime Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Overtime rate</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.overtimeRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overtime pay</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.overtimePay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Regular pay</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.regularPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gross pay</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.grossPay)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PoundSterling className="h-5 w-5 text-indigo-500" />
                  Deductions &amp; Net Pay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Income tax</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.tax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">National Insurance</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.nationalInsurance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total deductions</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.deductions)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net pay</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.netPay)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Overtime the Right Way
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding overtime rules matters for both employees and employers. Always confirm
            how gross pay is calculated, check net pay after deductions, and make sure employer
            obligations such as automatic pension enrolment or paid holiday accrual are satisfied.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Overtime Rules &amp; Gross Pay vs Net Pay
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            UK legislation does not mandate overtime premiums, but most employment contracts specify
            an overtime multiplier. Always confirm whether overtime is paid at time and a half or
            double time, and keep accurate records of hours worked to avoid pay disputes.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Employer Obligations for Extra Hours
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Employers must ensure the working time directive is respected, including rest breaks and
            weekly limits, unless the employee has opted out. Regular overtime may also impact
            holiday pay calculations, which should reflect the employee’s normal income.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
