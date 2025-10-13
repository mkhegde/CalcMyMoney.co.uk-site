import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, ShoppingBasket, Car, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'cost of living',
  'cost of living calculator',
  'uk cost of living calculator',
  'city cost of living calculator',
];

const metaDescription =
  'Use our cost of living calculator to compare living costs, plan expenses with a cost of living calculator, and benchmark city cost of living calculator results for relocation.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/cost-of-living-calculator';
const schemaKeywords = keywords.slice(0, 5);

const costCategories = [
  {
    key: 'housing',
    label: 'Housing (rent/mortgage)',
    defaultValue: 1200,
    icon: <Home className="h-4 w-4" />,
  },
  {
    key: 'utilities',
    label: 'Utilities & council tax',
    defaultValue: 250,
    icon: <Home className="h-4 w-4" />,
  },
  {
    key: 'groceries',
    label: 'Groceries & essentials',
    defaultValue: 350,
    icon: <ShoppingBasket className="h-4 w-4" />,
  },
  {
    key: 'transport',
    label: 'Transport & commuting',
    defaultValue: 180,
    icon: <Car className="h-4 w-4" />,
  },
  {
    key: 'lifestyle',
    label: 'Lifestyle & leisure',
    defaultValue: 220,
    icon: <PiggyBank className="h-4 w-4" />,
  },
];

const costOfLivingFaqs = [
  {
    question: 'How do I compare the cost of living between two cities?',
    answer:
      'Enter estimated expenses for each category and adjust the city adjustment slider. This adds a percentage increase or decrease to reflect local prices so you can compare cities side-by-side.',
  },
  {
    question: 'What expenses should be included?',
    answer:
      'Include rent or mortgage payments, utilities, food, transport, insurance, childcare, and entertainment. Adding an emergency fund contribution can help manage unexpected expenses.',
  },
  {
    question: 'How often should I review my cost of living?',
    answer:
      'Review your cost of living whenever you experience a major change—relocation, job change, or family expansion. Keeping figures up to date helps you stay on budget and negotiate salaries confidently.',
  },
];

const calculateCostOfLiving = ({ adjustments, categories }) => {
  const baseMonthlyCost = categories.reduce(
    (sum, category) => sum + Number(category.value || 0),
    0
  );

  const cityAdjustmentMultiplier = 1 + Number(adjustments.cityAdjustment || 0) / 100;
  const savingsPercentage = Number(adjustments.savingsRate || 0) / 100;

  const adjustedMonthlyCost = baseMonthlyCost * cityAdjustmentMultiplier;
  const savingsTarget = adjustedMonthlyCost * savingsPercentage;
  const totalMonthlyBudget = adjustedMonthlyCost + savingsTarget;
  const annualBudget = totalMonthlyBudget * 12;

  return {
    baseMonthlyCost,
    adjustedMonthlyCost,
    savingsTarget,
    totalMonthlyBudget,
    annualBudget,
  };
};

const formatCurrency = (value) =>
  value.toLocaleString('en-GB', { style: 'currency', currency: 'GBP', minimumFractionDigits: 0 });

export default function CostOfLivingCalculatorPage() {
  const [categoryValues, setCategoryValues] = useState(
    costCategories.map((category) => ({ ...category, value: category.defaultValue }))
  );
  const [adjustments, setAdjustments] = useState({
    cityAdjustment: 8,
    savingsRate: 15,
  });

  const results = useMemo(
    () => calculateCostOfLiving({ adjustments, categories: categoryValues }),
    [adjustments, categoryValues]
  );

  const resetState = () => {
    setCategoryValues(
      costCategories.map((category) => ({ ...category, value: category.defaultValue }))
    );
    setAdjustments({ cityAdjustment: 8, savingsRate: 15 });
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Cost of Living Calculator | Cost of Living</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Cost of Living Calculator | Cost of Living" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cost of Living Calculator | Cost of Living" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Cost of Living Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate cost of living',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Cost of Living Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Understand your monthly and annual living costs, adjust for city price differences, and
            set an achievable savings goal.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Monthly Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {categoryValues.map((category, index) => (
                <div key={category.key}>
                  <Label
                    htmlFor={category.key}
                    className="text-sm font-medium flex items-center gap-2"
                  >
                    {category.icon}
                    {category.label}
                  </Label>
                  <Input
                    id={category.key}
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={category.value}
                    onChange={(event) => {
                      const value = Number(event.target.value);
                      setCategoryValues((prev) =>
                        prev.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, value } : item
                        )
                      );
                    }}
                  />
                </div>
              ))}

              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  City adjustment
                  <span className="text-blue-600 font-semibold">{adjustments.cityAdjustment}%</span>
                </Label>
                <Slider
                  value={[adjustments.cityAdjustment]}
                  onValueChange={(value) =>
                    setAdjustments((prev) => ({ ...prev, cityAdjustment: value[0] }))
                  }
                  min={-20}
                  max={40}
                  step={1}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Reflects higher or lower prices compared with your current city.
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Savings target
                  <span className="text-blue-600 font-semibold">{adjustments.savingsRate}%</span>
                </Label>
                <Slider
                  value={[adjustments.savingsRate]}
                  onValueChange={(value) =>
                    setAdjustments((prev) => ({ ...prev, savingsRate: value[0] }))
                  }
                  min={0}
                  max={30}
                  step={1}
                />
                <p className="text-xs text-slate-500 mt-2">
                  Percentage of your adjusted expenses to allocate to savings or investments.
                </p>
              </div>

              <Button variant="outline" onClick={resetState} className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <PiggyBank className="h-5 w-5" />
                  Cost Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Base monthly cost</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(results.baseMonthlyCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Adjusted monthly</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(results.adjustedMonthlyCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Savings target</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(results.savingsTarget)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Annual budget</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(results.annualBudget)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Monthly Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                {categoryValues.map((category) => (
                  <div key={category.key}>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-1">
                      {category.label}
                    </h3>
                    <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(category.value)}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                City cost of living calculator guidance
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust the city price slider when comparing locations. The city cost of living
                calculator increases or decreases each expense so you can align salary expectations
                with local market rates.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning ahead with a uk cost of living calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the uk cost of living calculator to review budgets before job moves, university
                decisions, or returning from parental leave. Combine it with our savings tools to
                keep future plans funded.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={costOfLivingFaqs} />
        </div>
      </section>
    </div>
  );
}
