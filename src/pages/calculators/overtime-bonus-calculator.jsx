import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Clock, Wallet } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const metaDescription =
  'Use our overtime bonus calculator to plan extra pay, compare overtime bonus calculator scenarios, and project overtime and bonus calculator take-home pay.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/overtime-bonus-calculator';
const schemaKeywords = [
  'overtime and bonus calculator',
  'overtime pay calculator',
  'bonus calculator',
  'overtime calculator uk',
  'bonus pay calculator',
];

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const overtimeFaqs = [
  {
    question: 'How do I calculate overtime pay?',
    answer:
      'Multiply overtime hours by the hourly rate and overtime multiplier (e.g. 1.5x). The overtime bonus calculator does this automatically and adds bonuses on top.',
  },
  {
    question: 'Can I account for tax?',
    answer:
      'This version outputs gross overtime and bonus. Apply your marginal tax rate to estimate net take-home pay. We highlight the required marginal rate slider for quick estimates.',
  },
  {
    question: 'How often should I update overtime assumptions?',
    answer:
      'Review monthly or after new rotas are published. Keeping the calculator current ensures you hit savings targets and anticipate higher tax bands.',
  },
];

const calculateOvertimeBonus = ({
  hourlyRate,
  standardHours,
  overtimeHours,
  overtimeMultiplier,
  annualBonus,
  marginalTaxRate,
}) => {
  const baseMonthlyPay = hourlyRate * standardHours * 4.33;
  const overtimePay = hourlyRate * overtimeMultiplier * overtimeHours * 4.33;
  const monthlyBonus = annualBonus / 12;

  const grossMonthly = baseMonthlyPay + overtimePay + monthlyBonus;
  const grossAnnual = grossMonthly * 12;
  const estimatedNetMonthly = grossMonthly * (1 - marginalTaxRate / 100);
  const estimatedNetAnnual = estimatedNetMonthly * 12;

  return {
    baseMonthlyPay,
    overtimePay,
    monthlyBonus,
    grossMonthly,
    grossAnnual,
    estimatedNetMonthly,
    estimatedNetAnnual,
  };
};

export default function OvertimeBonusCalculatorPage() {
  const [inputs, setInputs] = useState({
    hourlyRate: 18,
    standardHours: 37.5,
    overtimeHours: 6,
    overtimeMultiplier: 1.5,
    annualBonus: 3000,
    marginalTaxRate: 32,
  });

  const results = useMemo(
    () =>
      calculateOvertimeBonus({
        hourlyRate: Number(inputs.hourlyRate) || 0,
        standardHours: Number(inputs.standardHours) || 0,
        overtimeHours: Number(inputs.overtimeHours) || 0,
        overtimeMultiplier: Number(inputs.overtimeMultiplier) || 0,
        annualBonus: Number(inputs.annualBonus) || 0,
        marginalTaxRate: Number(inputs.marginalTaxRate) || 0,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      hourlyRate: 18,
      standardHours: 37.5,
      overtimeHours: 6,
      overtimeMultiplier: 1.5,
      annualBonus: 3000,
      marginalTaxRate: 32,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Overtime & Bonus Calculator | Overtime Pay Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Overtime & Bonus Calculator | Overtime Pay Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Overtime & Bonus Calculator | Overtime Pay Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Overtime & Bonus Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate overtime and bonus pay',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Overtime & Bonus Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Estimate extra earnings from overtime shifts and bonuses, and see the potential net pay
            impact based on your marginal tax rate.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Pay Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="hourlyRate" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  Hourly rate (£)
                </Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.hourlyRate}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, hourlyRate: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Standard hours/week
                  <span className="text-purple-600 font-semibold">
                    {inputs.standardHours.toFixed(1)}
                  </span>
                </Label>
                <Slider
                  value={[inputs.standardHours]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, standardHours: Number(value[0].toFixed(1)) }))
                  }
                  min={10}
                  max={50}
                  step={0.5}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Overtime hours/week
                  <span className="text-purple-600 font-semibold">
                    {inputs.overtimeHours.toFixed(1)}
                  </span>
                </Label>
                <Slider
                  value={[inputs.overtimeHours]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, overtimeHours: Number(value[0].toFixed(1)) }))
                  }
                  min={0}
                  max={25}
                  step={0.5}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Overtime multiplier
                  <span className="text-purple-600 font-semibold">
                    {inputs.overtimeMultiplier.toFixed(1)}x
                  </span>
                </Label>
                <Slider
                  value={[inputs.overtimeMultiplier]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({
                      ...prev,
                      overtimeMultiplier: Number(value[0].toFixed(1)),
                    }))
                  }
                  min={1}
                  max={2.5}
                  step={0.1}
                />
              </div>
              <div>
                <Label htmlFor="annualBonus" className="text-sm font-medium">
                  Annual bonus (£)
                </Label>
                <Input
                  id="annualBonus"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.annualBonus}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, annualBonus: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Marginal tax rate
                  <span className="text-purple-600 font-semibold">
                    {inputs.marginalTaxRate.toFixed(1)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.marginalTaxRate]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, marginalTaxRate: Number(value[0].toFixed(1)) }))
                  }
                  min={20}
                  max={50}
                  step={0.5}
                />
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                  <Wallet className="h-5 w-5" />
                  Earnings Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Gross monthly</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter(results.grossMonthly)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Gross annual</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter(results.grossAnnual)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">
                    Estimated net monthly
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter(results.estimatedNetMonthly)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Component Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Base pay:</span>{' '}
                  {currencyFormatter(results.baseMonthlyPay)} per month.
                </p>
                <p>
                  <span className="font-semibold">Overtime pay:</span>{' '}
                  {currencyFormatter(results.overtimePay)} per month.
                </p>
                <p>
                  <span className="font-semibold">Bonus:</span>{' '}
                  {currencyFormatter(results.monthlyBonus)} per month.
                </p>
                <p>
                  <span className="font-semibold">Estimated net annual:</span>{' '}
                  {currencyFormatter(results.estimatedNetAnnual)} using a{' '}
                  {inputs.marginalTaxRate.toFixed(1)}% marginal tax rate.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Overtime bonus calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust overtime hours and multipliers to forecast busy periods. The overtime bonus
                calculator shows the uplift in gross and estimated net pay instantly.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Projecting overtime and bonus calculator totals
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use results to set aside funds for taxes, savings, or investments. Knowing your
                combined overtime and bonus calculator projections keeps your finances on track.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={overtimeFaqs} />
        </div>
      </section>
    </div>
  );
}
