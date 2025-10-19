import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Plane, Home, PiggyBank, Sparkles } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Dream Lifestyle Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/dream-lifestyle-calculator';
const keywords = getCalculatorKeywords('Dream Lifestyle Calculator');

const metaDescription =
  'Put a realistic price tag on your dream lifestyle. Estimate monthly spending, build in savings buffers, and set the pre-tax income you need to live life on your terms.';

const defaultInputs = {
  housing: '2,200',
  travel: '600',
  experiences: '400',
  savingsGoal: '800',
  emergencyBuffer: '12,000',
  taxMultiplier: '1.3',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dreamLifestyleFaqs = [
  {
    question: 'How can I create a realistic dream lifestyle budget?',
    answer:
      'Start with your non-negotiables: housing, travel, hobbies, self-care, and savings. Research actual prices and build in a 10% buffer for spontaneity and inflation so the plan feels expansive and achievable.',
  },
  {
    question: 'Should I include taxes in my lifestyle income target?',
    answer:
      'Yes. Use the tax multiplier to estimate the gross income you need after HMRC deductions. Many UK earners work with 1.2 to 1.4 to cover tax, National Insurance, and pension contributions.',
  },
  {
    question: 'How often should I revisit my dream lifestyle numbers?',
    answer:
      'Review every six months or after major life changes. As your goals evolve, refreshing the calculator keeps your income targets inspiring rather than outdated.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Explore every UK calculator to keep your money goals on track.',
  },
  {
    label: 'Budgeting & planning tools',
    url: '/#budgeting-planning',
    description: 'Balance everyday spending with future aspirations.',
  },
  {
    label: 'Savings & investments hub',
    url: '/#savings-investments',
    description: 'Grow the funds that make your dream lifestyle sustainable.',
  },
];

const relatedCalculators = [
  {
    name: 'Budget Calculator',
    url: '/budget-calculator',
    description: 'Align your current spending with your ideal lifestyle blueprint.',
  },
  {
    name: 'Travel Budget Calculator',
    url: '/travel-budget-calculator',
    description: 'Plan experiences without derailing your monthly targets.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Turn lifestyle dreams into a step-by-step savings plan.',
  },
];

const webPageSchema = createCalculatorWebPageSchema({
  name: CALCULATOR_NAME,
  description: metaDescription,
  url: canonicalUrl,
  keywords,
});

const breadcrumbSchema = createCalculatorBreadcrumbs({
  name: CALCULATOR_NAME,
  url: canonicalUrl,
});

const faqStructuredData = faqSchema(dreamLifestyleFaqs);

const buildLifestylePlan = ({ housing, travel, experiences, savingsGoal, emergencyBuffer, taxMultiplier }) => {
  const monthlyLifestyleCost = housing + travel + experiences + savingsGoal;
  const annualLifestyleCost = monthlyLifestyleCost * 12;
  const annualTotal = annualLifestyleCost + emergencyBuffer;
  const incomeTarget = annualTotal * taxMultiplier;

  return {
    monthlyLifestyleCost,
    annualLifestyleCost,
    annualTotal,
    incomeTarget,
    monthlyIncomeTarget: incomeTarget / 12,
    emergencyBuffer,
  };
};

export default function DreamLifestyleCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const payload = {
      housing: sanitiseNumber(inputs.housing),
      travel: sanitiseNumber(inputs.travel),
      experiences: sanitiseNumber(inputs.experiences),
      savingsGoal: sanitiseNumber(inputs.savingsGoal),
      emergencyBuffer: sanitiseNumber(inputs.emergencyBuffer),
      taxMultiplier: Math.max(sanitiseNumber(inputs.taxMultiplier), 1),
    };

    if (
      payload.housing <= 0 &&
      payload.travel <= 0 &&
      payload.experiences <= 0 &&
      payload.savingsGoal <= 0
    ) {
      setResults({ valid: false, message: 'Add at least one lifestyle cost to estimate your income target.' });
      setHasCalculated(true);
      return;
    }

    const outcome = buildLifestylePlan(payload);
    setResults({ valid: true, ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    const { payload } = results;
    return [
      {
        name: 'Dream housing',
        value: payload.housing,
        color: '#8b5cf6',
      },
      {
        name: 'Travel & adventures',
        value: payload.travel,
        color: '#ec4899',
      },
      {
        name: 'Experiences & hobbies',
        value: payload.experiences,
        color: '#f97316',
      },
      {
        name: 'Savings & wealth',
        value: payload.savingsGoal,
        color: '#22c55e',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const { payload } = results;
    return [
      ['Expense category', 'Monthly amount (£)'],
      ['Dream housing', payload.housing.toFixed(2)],
      ['Travel & adventures', payload.travel.toFixed(2)],
      ['Experiences & hobbies', payload.experiences.toFixed(2)],
      ['Savings & wealth-building', payload.savingsGoal.toFixed(2)],
      [],
      ['Metric', 'Value'],
      ['Monthly lifestyle cost (£)', results.monthlyLifestyleCost.toFixed(2)],
      ['Annual lifestyle cost (£)', results.annualLifestyleCost.toFixed(2)],
      ['Emergency buffer (£)', results.emergencyBuffer.toFixed(2)],
      ['Annual total (£)', results.annualTotal.toFixed(2)],
      ['Pre-tax income required (£)', results.incomeTarget.toFixed(2)],
      ['Monthly pre-tax income target (£)', results.monthlyIncomeTarget.toFixed(2)],
      ['Tax multiplier used', payload.taxMultiplier.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Price Your Ideal Life`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${CALCULATOR_NAME} | Price Your Ideal Life`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${CALCULATOR_NAME} | Price Your Ideal Life`} />
        <meta name="twitter:description" content={metaDescription} />
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="bg-gradient-to-r from-purple-900 via-pink-900 to-purple-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Dream Lifestyle Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Put numbers behind the life you want. Set income targets, savings commitments, and a plan to make your dream lifestyle your everyday reality.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Design the life you cannot wait to wake up to"
          message="Once you know the price tag of your dream life you can reverse-engineer the income, assets, and habits needed to sustain it."
          quote="The future belongs to those who believe in the beauty of their dreams."
          author="Eleanor Roosevelt"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Lifestyle inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="housing" className="text-sm font-medium flex items-center gap-2">
                    <Home className="h-4 w-4 text-purple-500" />
                    Dream housing (£/month)
                  </Label>
                  <Input
                    id="housing"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.housing}
                    onChange={handleInputChange('housing')}
                    placeholder="e.g., 2,200"
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
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.travel}
                    onChange={handleInputChange('travel')}
                    placeholder="e.g., 600"
                  />
                </div>
                <div>
                  <Label htmlFor="experiences" className="text-sm font-medium flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-purple-500" />
                    Experiences & hobbies (£/month)
                  </Label>
                  <Input
                    id="experiences"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.experiences}
                    onChange={handleInputChange('experiences')}
                    placeholder="e.g., 400"
                  />
                </div>
                <div>
                  <Label htmlFor="savingsGoal" className="text-sm font-medium flex items-center gap-2">
                    <PiggyBank className="h-4 w-4 text-purple-500" />
                    Savings & wealth-building (£/month)
                  </Label>
                  <Input
                    id="savingsGoal"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.savingsGoal}
                    onChange={handleInputChange('savingsGoal')}
                    placeholder="e.g., 800"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyBuffer" className="text-sm font-medium">
                    Annual experiences fund / emergency buffer (£)
                  </Label>
                  <Input
                    id="emergencyBuffer"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.emergencyBuffer}
                    onChange={handleInputChange('emergencyBuffer')}
                    placeholder="e.g., 12,000"
                  />
                </div>
                <div>
                  <Label htmlFor="taxMultiplier" className="text-sm font-medium">
                    Tax & NI multiplier
                  </Label>
                  <Input
                    id="taxMultiplier"
                    type="number"
                    inputMode="decimal"
                    min="1"
                    step="0.05"
                    value={inputs.taxMultiplier}
                    onChange={handleInputChange('taxMultiplier')}
                    placeholder="e.g., 1.30"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Multiply your annual lifestyle cost to cover UK tax, National Insurance, and pension contributions.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Calculate
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {showResults ? (
            <div className="space-y-6">
              <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                    <Sparkles className="h-5 w-5" />
                    Lifestyle summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Monthly lifestyle cost
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.monthlyLifestyleCost)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Annual lifestyle cost
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.annualLifestyleCost)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Annual total incl. buffer
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.annualTotal)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Pre-tax income target
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter.format(results.incomeTarget)}
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-200">
                        ≈ {currencyFormatter.format(results.monthlyIncomeTarget)} per month before tax.
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 p-4">
                    <h3 className="text-base font-semibold text-purple-900 dark:text-purple-100 mb-4">
                      Budget split
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Dream lifestyle budget split" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="dream-lifestyle-calculator-results"
                    title="Dream lifestyle calculation"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Sparkles className="h-5 w-5 text-purple-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add monthly lifestyle categories and press <strong>Calculate</strong> to uncover the income that powers your dream life.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={dreamLifestyleFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
