// src/pages/calculators/overtime-rate-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Gauge, Briefcase, Scale } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/overtime-rate-calculator';

const schemaKeywords = [
  'Calculate Rate',
  'Contracted Hours',
  'Annual Salary',
  'UK Employment Law',
  'Pay Scale',
];

const faqItems = [
  {
    question: 'How do I work out my overtime rate from my salary?',
    answer:
      'Divide your annual salary by the number of contracted weekly hours multiplied by 52 to get your normal hourly rate. Multiply that figure by the overtime multiplier stated in your contract for the applicable rate.',
  },
  {
    question: 'What is time and a half?',
    answer:
      'Time and a half means your overtime rate is 1.5 times your standard hourly rate. For example, an hourly rate of £20 becomes £30 for every overtime hour.',
  },
  {
    question: 'Does overtime change my average hourly pay?',
    answer:
      'Yes. Regular overtime can increase your average hourly pay figure, which may be relevant for holiday pay calculations and mortgage applications. Track both your contracted and actual hours to calculate your average pay accurately.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function OvertimeRateCalculator() {
  const [inputs, setInputs] = useState({
    annualSalary: '38000',
    contractedHoursPerWeek: '37.5',
    overtimeMultiplier: '1.5',
    doubleTimeMultiplier: '2',
    weeklyOvertimeHours: '5',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const annualSalary = Number(inputs.annualSalary) || 0;
    const contractedHoursPerWeek = Number(inputs.contractedHoursPerWeek) || 0;
    const overtimeMultiplier = Number(inputs.overtimeMultiplier) || 0;
    const doubleTimeMultiplier = Number(inputs.doubleTimeMultiplier) || 0;
    const weeklyOvertimeHours = Number(inputs.weeklyOvertimeHours) || 0;

    const contractedHoursPerYear = contractedHoursPerWeek * 52;
    const baseHourlyRate =
      contractedHoursPerYear > 0 ? annualSalary / contractedHoursPerYear : 0;

    const overtimeRate = baseHourlyRate * overtimeMultiplier;
    const doubleTimeRate = baseHourlyRate * doubleTimeMultiplier;

    const weeklyGrossIncome = annualSalary / 52;
    const overtimeWeeklyValue = overtimeRate * weeklyOvertimeHours;
    const averageWeeklyIncome = weeklyGrossIncome + overtimeWeeklyValue;

    return {
      baseHourlyRate,
      overtimeRate,
      doubleTimeRate,
      weeklyGrossIncome,
      overtimeWeeklyValue,
      averageWeeklyIncome,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      annualSalary: '38000',
      contractedHoursPerWeek: '37.5',
      overtimeMultiplier: '1.5',
      doubleTimeMultiplier: '2',
      weeklyOvertimeHours: '5',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Overtime Rate & Hourly Rate Calculator</title>
        <meta
          name="description"
          content="Work out your overtime multiplier, time and a half, and double time rates from UK salary or hourly pay."
        />
        <meta name="keywords" content="Overtime Multiplier, Time and a Half, Double Time" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Overtime Rate Calculator',
              description:
                'Tool to calculate UK overtime rates, compare hourly rate to overtime multipliers, and understand contracted vs overtime hours.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate overtime rate',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Overtime Rate Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Calculate overtime rates, compare standard hours to extra hours, and align gross income
            with your employment contract.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Employment Inputs
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
              <div>
                <Label htmlFor="contractedHoursPerWeek" className="text-sm font-medium">
                  Contracted hours per week
                </Label>
                <Input
                  id="contractedHoursPerWeek"
                  inputMode="decimal"
                  value={inputs.contractedHoursPerWeek}
                  onChange={(event) => handleChange('contractedHoursPerWeek', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="overtimeMultiplier" className="text-sm font-medium">
                    Overtime multiplier
                  </Label>
                  <Input
                    id="overtimeMultiplier"
                    inputMode="decimal"
                    value={inputs.overtimeMultiplier}
                    onChange={(event) => handleChange('overtimeMultiplier', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="doubleTimeMultiplier" className="text-sm font-medium">
                    Double time multiplier
                  </Label>
                  <Input
                    id="doubleTimeMultiplier"
                    inputMode="decimal"
                    value={inputs.doubleTimeMultiplier}
                    onChange={(event) => handleChange('doubleTimeMultiplier', event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weeklyOvertimeHours" className="text-sm font-medium">
                  Weekly overtime hours
                </Label>
                <Input
                  id="weeklyOvertimeHours"
                  inputMode="decimal"
                  value={inputs.weeklyOvertimeHours}
                  onChange={(event) => handleChange('weeklyOvertimeHours', event.target.value)}
                />
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
                  <Gauge className="h-5 w-5 text-emerald-500" />
                  Overtime Calculation Results
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Standard hourly rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.baseHourlyRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Overtime rate</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.overtimeRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Double time rate</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.doubleTimeRate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weekly overtime value</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.overtimeWeeklyValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Weekly gross income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.weeklyGrossIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Average weekly income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.averageWeeklyIncome)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Briefcase className="h-5 w-5 text-emerald-500" />
                  Employment Contract Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Review your employment contract for how overtime is authorised and recorded.
                </p>
                <p>
                  • Check whether overtime counts towards pensionable pay, bonuses, or commissions.
                </p>
                <p>
                  • Confirm compliance with UK employment law on maximum weekly working hours and
                  rest periods.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Overtime Calculation Essentials
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding how contracted hours compare to the hours you actually work is central to
            fair pay. Use this calculator to align your hourly rate with every overtime multiplier
            listed in your employment contract.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Standard Hours vs. Gross Income
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Monitor your standard hours alongside overtime to see how gross income fluctuates. If
            overtime is frequent, consider negotiating a higher base salary or a formal overtime
            agreement.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Rate per Hour and Employment Contracts
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Keep written evidence of your pay scale. Contracts should spell out when overtime
            triggers time and a half or double time, as well as any caps on the number of overtime
            hours you can work.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
