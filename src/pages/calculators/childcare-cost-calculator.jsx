import React, { useState, useMemo, useCallback } from 'react';
import { Baby, Calculator, PiggyBank } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import SeoHead from '@/components/seo/SeoHead';

const keywords = [
  'childcare cost calculator',
  'childcare calculator',
  'cost of childcare calculator',
];

const metaDescription =
  'Use our childcare cost calculator to plan fees, compare childcare calculator scenarios, and map cost of childcare calculator insights for your family budget.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/childcare-cost-calculator';
const schemaKeywords = keywords.slice(0, 5);

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Childcare Cost Calculator',
  url: canonicalUrl,
  description: metaDescription,
  keywords: schemaKeywords,
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'Action',
    name: 'Estimate childcare costs',
    target: canonicalUrl,
  },
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const defaultInputs = {
  dailyRate: '65',
  daysPerWeek: '4',
  weeksPerYear: '48',
  children: '1',
  monthlyExtras: '45',
  monthlySupport: '0',
};

const childcareFaqs = [
  {
    question: 'Which costs should I include in childcare budgeting?',
    answer:
      'Add the daily nursery or childminder rate, number of days needed, projected weeks per year, and extras such as meals, clubs, or registration charges. Include subsidies or Tax-Free Childcare so you understand the net cash leaving your account.',
  },
  {
    question: 'How do I reflect government childcare support?',
    answer:
      'Enter any monthly support you receive, such as Tax-Free Childcare top-ups, 30 free hours in England, or employer childcare vouchers. The calculator subtracts the support amount from the projected total so you can see the true cost.',
  },
  {
    question: 'Can I model different schedules for each child?',
    answer:
      'This version assumes the same daily rate and schedule for every child. For different timetables, run a scenario for each child and combine the results, or adjust the daily rate to reflect the blended cost.',
  },
];

export default function ChildcareCostCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const dailyRate = Number(inputs.dailyRate) || 0;
    const daysPerWeek = Number(inputs.daysPerWeek) || 0;
    const weeksPerYear = Number(inputs.weeksPerYear) || 0;
    const children = Number(inputs.children) || 0;
    const monthlyExtras = Number(inputs.monthlyExtras) || 0;
    const monthlySupport = Number(inputs.monthlySupport) || 0;

    const weeklyCost = dailyRate * daysPerWeek * children;
    const annualCareCost = weeklyCost * weeksPerYear;
    const monthlyCareCost = annualCareCost / 12;
    const totalMonthlyCost = Math.max(monthlyCareCost + monthlyExtras - monthlySupport, 0);
    const totalAnnualCost = totalMonthlyCost * 12;
    const netWeeklyCost = (totalMonthlyCost * 12) / weeksPerYear || 0;

    const chartData = [
      { name: 'Care Fees', value: monthlyCareCost },
      { name: 'Extras', value: monthlyExtras },
      { name: 'Support', value: -monthlySupport },
    ];

    return {
      weeklyCost,
      monthlyCareCost,
      totalMonthlyCost,
      totalAnnualCost,
      netWeeklyCost,
      chartData,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <SeoHead
        title="Childcare Cost Calculator | Childcare Calculator"
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle="Childcare Cost Calculator | Childcare Calculator"
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="Calc My Money"
        twitterTitle="Childcare Cost Calculator | Childcare Calculator"
        twitterDescription={metaDescription}
        jsonLd={[webpageSchema]}
      />

      <section className="bg-gradient-to-r from-pink-900 via-rose-900 to-pink-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Childcare Cost Calculator
          </Heading>
          <p className="text-lg md:text-xl text-pink-100">
            Forecast nursery, childminder, and wraparound care expenses with a childcare calculator
            that adapts to your family.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-pink-200 dark:border-pink-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-pink-600" />
                Care Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="dailyRate" className="text-sm font-medium">
                  Daily rate per child (£)
                </Label>
                <Input
                  id="dailyRate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.dailyRate}
                  onChange={(event) => handleChange('dailyRate', event.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Days per week
                  <span className="text-pink-600 font-semibold">{inputs.daysPerWeek}</span>
                </Label>
                <Slider
                  value={[Number(inputs.daysPerWeek)]}
                  onValueChange={(value) => handleChange('daysPerWeek', String(value[0]))}
                  min={1}
                  max={7}
                  step={1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Weeks per year
                  <span className="text-pink-600 font-semibold">{inputs.weeksPerYear}</span>
                </Label>
                <Slider
                  value={[Number(inputs.weeksPerYear)]}
                  onValueChange={(value) => handleChange('weeksPerYear', String(value[0]))}
                  min={30}
                  max={52}
                  step={1}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Number of children
                  <span className="text-pink-600 font-semibold">{inputs.children}</span>
                </Label>
                <Slider
                  value={[Number(inputs.children)]}
                  onValueChange={(value) => handleChange('children', String(value[0]))}
                  min={1}
                  max={4}
                  step={1}
                />
              </div>
              <div>
                <Label htmlFor="monthlyExtras" className="text-sm font-medium">
                  Monthly extras (£)
                </Label>
                <Input
                  id="monthlyExtras"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.monthlyExtras}
                  onChange={(event) => handleChange('monthlyExtras', event.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Include meals, clubs, nappies, or transport.
                </p>
              </div>
              <div>
                <Label htmlFor="monthlySupport" className="text-sm font-medium">
                  Monthly support (£)
                </Label>
                <Input
                  id="monthlySupport"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.monthlySupport}
                  onChange={(event) => handleChange('monthlySupport', event.target.value)}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Add Tax-Free Childcare, free hours, or employer vouchers.
                </p>
              </div>
              <Button type="button" variant="outline" onClick={() => setInputs(defaultInputs)}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-pink-200 dark:border-pink-900 bg-pink-50 dark:bg-pink-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-pink-900 dark:text-pink-100">
                  <Baby className="h-5 w-5" />
                  Cost Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-pink-900/60 p-4 border border-pink-100 dark:border-pink-800">
                  <p className="text-sm text-pink-700 dark:text-pink-200">Weekly Care Cost</p>
                  <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                    {currencyFormatter.format(results.weeklyCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-pink-900/60 p-4 border border-pink-100 dark:border-pink-800">
                  <p className="text-sm text-pink-700 dark:text-pink-200">Monthly Total</p>
                  <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                    {currencyFormatter.format(results.totalMonthlyCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-pink-900/60 p-4 border border-pink-100 dark:border-pink-800">
                  <p className="text-sm text-pink-700 dark:text-pink-200">Annual Total</p>
                  <p className="text-2xl font-bold text-pink-900 dark:text-pink-100">
                    {currencyFormatter.format(results.totalAnnualCost)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-slate-600" />
                  Childcare Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Care Fees (monthly)</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.monthlyCareCost)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Net Weekly Cost</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.netWeeklyCost)}
                  </p>
                  <p className="text-xs text-slate-500">Adjusted for support and weeks attended.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Monthly Cost of Childcare Calculator View
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => currencyFormatter.format(Number(value))} />
                    <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                    <Legend />
                    <Bar dataKey="value" fill="#f472b6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                How this Childcare Calculator supports planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Input your monthly schedule, extras, and government support to see how the childcare
                calculator alters your spending. It is flexible enough for nursery, childminder, or
                wraparound care arrangements, helping you manage cash flow across the year.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Using the Cost of Childcare Calculator for comparisons
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Experiment with different weekly schedules or fee structures to compare providers.
                By adjusting the cost of childcare calculator inputs you can gauge the long-term
                affordability of nurseries, clubs, or nanny shares before signing a contract.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={childcareFaqs} />
        </div>
      </section>
    </div>
  );
}
