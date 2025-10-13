import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Plane, Home, PiggyBank, Sparkles } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['dream lifestyle calculator'];

const metaDescription =
  'Use our dream lifestyle calculator to price your ideal life, align income goals, and map actionable steps toward the dream lifestyle you are designing.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/dream-lifestyle-calculator';
const schemaKeywords = keywords;

const dreamLifestyleFaqs = [
  {
    question: 'How do I estimate lifestyle costs accurately?',
    answer:
      'Break your dream lifestyle into categories such as housing, travel, hobbies, and savings. Adjust each input based on research and add a buffer for spontaneity or price fluctuations.',
  },
  {
    question: 'How often should I revisit this dream lifestyle calculator?',
    answer:
      'Review your plan quarterly or after major life events. As your goals evolve, updating the calculator keeps your income targets realistic and motivating.',
  },
  {
    question: 'Can I use this to plan early retirement or mini-retirements?',
    answer:
      'Yes. Combine the annual figure with your investment projections. Knowing the cost of your dream lifestyle makes it easier to plan sabbaticals, location-independent living, or early retirement.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const calculateDreamLifestyle = ({
  housing,
  travel,
  experiences,
  savingsGoal,
  emergencyBuffer,
  taxMultiplier,
}) => {
  const monthlyLifestyleCost = housing + travel + experiences + savingsGoal;
  const annualLifestyleCost = monthlyLifestyleCost * 12;
  const annualTotal = annualLifestyleCost + emergencyBuffer;
  const incomeTarget = annualTotal * taxMultiplier;

  return {
    monthlyLifestyleCost,
    annualLifestyleCost,
    emergencyBuffer,
    annualTotal,
    incomeTarget,
  };
};

export default function DreamLifestyleCalculatorPage() {
  const [inputs, setInputs] = useState({
    housing: 2200,
    travel: 600,
    experiences: 400,
    savingsGoal: 800,
    emergencyBuffer: 12000,
    taxMultiplier: 1.3,
  });

  const results = useMemo(() => calculateDreamLifestyle(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      housing: 2200,
      travel: 600,
      experiences: 400,
      savingsGoal: 800,
      emergencyBuffer: 12000,
      taxMultiplier: 1.3,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Dream Lifestyle Calculator | Dream Lifestyle</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Dream Lifestyle Calculator | Dream Lifestyle" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dream Lifestyle Calculator | Dream Lifestyle" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Dream Lifestyle Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Design dream lifestyle budget',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Dream Lifestyle Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Put numbers behind the life you want. Set income targets, savings commitments, and a
            plan to make your dream lifestyle your default lifestyle.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Lifestyle Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="housing" className="text-sm font-medium flex items-center gap-2">
                  <Home className="h-4 w-4 text-purple-500" />
                  Dream housing (£/month)
                </Label>
                <Input
                  id="housing"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.housing}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, housing: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="travel" className="text-sm font-medium flex items-center gap-2">
                  <Plane className="h-4 w-4 text-purple-500" />
                  Travel & adventures (£/month)
                </Label>
                <Input
                  id="travel"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.travel}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, travel: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="experiences"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Experiences & hobbies (£/month)
                </Label>
                <Input
                  id="experiences"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.experiences}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, experiences: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="savingsGoal"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <PiggyBank className="h-4 w-4 text-purple-500" />
                  Future-you savings (£/month)
                </Label>
                <Input
                  id="savingsGoal"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.savingsGoal}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, savingsGoal: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Annual buffer / contingency
                  <span className="text-purple-600 font-semibold">
                    £{inputs.emergencyBuffer.toLocaleString('en-GB')}
                  </span>
                </Label>
                <Slider
                  value={[inputs.emergencyBuffer]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, emergencyBuffer: value[0] }))
                  }
                  min={0}
                  max={25000}
                  step={1000}
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Tax & lifestyle multiplier
                  <span className="text-purple-600 font-semibold">
                    {inputs.taxMultiplier.toFixed(2)}x
                  </span>
                </Label>
                <Slider
                  value={[inputs.taxMultiplier]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, taxMultiplier: Number(value[0].toFixed(2)) }))
                  }
                  min={1.0}
                  max={1.6}
                  step={0.05}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Multiplies your annual cost to cover taxes, pensions, and investment top ups.
                </p>
              </div>

              <Button variant="outline" onClick={resetInputs} className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                  <PiggyBank className="h-5 w-5" />
                  Dream Lifestyle Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Monthly lifestyle</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.monthlyLifestyleCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Annual lifestyle</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.annualLifestyleCost)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">
                    Annual total + buffer
                  </p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.annualTotal)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-purple-900/60 p-4 border border-purple-100 dark:border-purple-800">
                  <p className="text-sm text-purple-700 dark:text-purple-200">Income target</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {currencyFormatter.format(results.incomeTarget)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  Lifestyle Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Housing & living</span>
                  <span>{currencyFormatter.format(inputs.housing * 12)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Travel & adventures</span>
                  <span>{currencyFormatter.format(inputs.travel * 12)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Experiences & hobbies</span>
                  <span>{currencyFormatter.format(inputs.experiences * 12)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Future-you savings</span>
                  <span>{currencyFormatter.format(inputs.savingsGoal * 12)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Emergency / flexibility fund</span>
                  <span>{currencyFormatter.format(inputs.emergencyBuffer)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Using the dream lifestyle calculator for goal setting
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Translate your dream lifestyle calculator results into monthly income targets. Pair
                the numbers with timeline milestones so you know exactly when you can sustain your
                ideal life without burning out.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Keeping the dream lifestyle calculator up to date
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Revisit the figures whenever your goals evolve—new cities, additional family
                members, or a bigger philanthropic footprint. Updating the dream lifestyle
                calculator keeps your vision grounded in the numbers that make it possible.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={dreamLifestyleFaqs} />
        </div>
      </section>
    </div>
  );
}
