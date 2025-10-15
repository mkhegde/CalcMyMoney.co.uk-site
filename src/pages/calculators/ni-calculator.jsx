import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, ClipboardList, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const metaDescription =
  'Use our ni calculator to estimate national insurance, compare ni calculator scenarios for salary sacrifice, and plan deductions with this national insurance calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/ni-calculator';
const schemaKeywords = [
  'ni calculator',
  'national insurance calculator',
  'uk ni calculator',
  'ni deduction calculator',
  'national insurance uk',
];

const NI_BANDS = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 0.12 },
  { min: 50270, max: Infinity, rate: 0.02 },
];

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const niFaqs = [
  {
    question: 'How is National Insurance calculated?',
    answer:
      'Class 1 NI is charged on earnings above the primary threshold. The calculator applies the 2025/26 UK thresholds and rates to show annual, monthly, and weekly NI.',
  },
  {
    question: 'Do pension contributions reduce NI?',
    answer:
      'Salary sacrifice pension contributions reduce NI because they lower gross pay. Personal contributions do not. Use the slider to see how much NI you save with salary sacrifice.',
  },
  {
    question: 'Does the ni calculator include employer NI?',
    answer:
      'This tool focuses on employee National Insurance. Employers pay additional Class 1 NI which is not deducted from take-home pay.',
  },
];

const calculateNi = ({ salary, pensionPercent, salarySacrifice }) => {
  const pensionDeduction = salarySacrifice ? salary * (pensionPercent / 100) : 0;
  const niSalary = Math.max(salary - pensionDeduction, 0);

  let remaining = niSalary;
  let totalNi = 0;
  NI_BANDS.forEach((band) => {
    if (remaining <= 0) return;
    const taxable = Math.min(remaining, band.max - band.min);
    totalNi += taxable * band.rate;
    remaining -= taxable;
  });

  return {
    niSalary,
    pensionDeduction,
    annualNi: totalNi,
    monthlyNi: totalNi / 12,
    weeklyNi: totalNi / 52,
  };
};

export default function NiCalculatorPage() {
  const [inputs, setInputs] = useState({
    salary: 48000,
    pensionPercent: 5,
    salarySacrifice: true,
  });

  const results = useMemo(
    () =>
      calculateNi({
        salary: Number(inputs.salary) || 0,
        pensionPercent: Number(inputs.pensionPercent) || 0,
        salarySacrifice: inputs.salarySacrifice,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      salary: 48000,
      pensionPercent: 5,
      salarySacrifice: true,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>NI Calculator | National Insurance Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="NI Calculator | National Insurance Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="NI Calculator | National Insurance Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'NI Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate National Insurance',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            NI Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate your UK employee National Insurance deductions, see the impact of salary
            sacrifice, and understand how NI affects take-home pay.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Salary Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="salary" className="text-sm font-medium">
                  Gross annual salary (£)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.salary}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, salary: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Pension contribution (salary sacrifice)
                  <span className="text-blue-600 font-semibold">
                    {inputs.pensionPercent.toFixed(1)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.pensionPercent]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, pensionPercent: Number(value[0].toFixed(1)) }))
                  }
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Apply salary sacrifice</Label>
                <Button
                  variant={inputs.salarySacrifice ? 'default' : 'outline'}
                  onClick={() =>
                    setInputs((prev) => ({ ...prev, salarySacrifice: !prev.salarySacrifice }))
                  }
                >
                  {inputs.salarySacrifice ? 'Included' : 'Excluded'}
                </Button>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <PiggyBank className="h-5 w-5" />
                  National Insurance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Taxable pay</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.niSalary)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">NI (annual)</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.annualNi)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">NI (monthly)</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.monthlyNi)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">NI (weekly)</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter(results.weeklyNi)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardList className="h-5 w-5 text-slate-600" />
                  Deduction Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Pension deduction:</span>{' '}
                  {currencyFormatter(results.pensionDeduction)} via salary sacrifice.
                </p>
                <p>
                  <span className="font-semibold">NI rate bands:</span> 12% between £12,570 and
                  £50,270, then 2% above that threshold.
                </p>
                <p>
                  Review your payslip each year to ensure the National Insurance calculator matches
                  HMRC deductions.
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
                NI calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust pension contributions to see how salary sacrifice reduces National Insurance.
                The ni calculator ensures your pay strategy matches HMRC rules.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={niFaqs} />
        </div>
      </section>
    </div>
  );
}
