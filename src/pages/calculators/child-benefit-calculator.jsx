import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Baby, Calculator, AlertCircle } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'child benefit calculator',
  'child benefit calculator 2024',
  'child benefit',
  'child tax benefit calculator',
];

const metaDescription =
  'Use our child benefit calculator to estimate payments, compare child benefit calculator 2024 updates, and plan how much child benefit you keep after the charge.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/child-benefit-calculator';
const schemaKeywords = keywords.slice(0, 5);

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Child Benefit Calculator',
  url: canonicalUrl,
  description: metaDescription,
  keywords: schemaKeywords,
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'Action',
    name: 'Calculate child benefit',
    target: canonicalUrl,
  },
};

const FIRST_CHILD_WEEKLY = 25.6;
const ADDITIONAL_CHILD_WEEKLY = 16.95;
const LOWER_THRESHOLD = 50000;
const UPPER_THRESHOLD = 60000;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const childBenefitFaqs = [
  {
    question: 'How much Child Benefit will I receive?',
    answer:
      'For the 2024/25 tax year the weekly rate is £25.60 for your eldest or only child and £16.95 for each additional child. Multiply the weekly figure by 52 to get the annual amount. The calculator applies these rates automatically and displays weekly, monthly, and annual totals.',
  },
  {
    question: 'What is the High Income Child Benefit Charge?',
    answer:
      'If either partner has adjusted net income above £50,000 the government claws back 1% of your Child Benefit for every £100 over that threshold. Once income reaches £60,000 the charge equals 100% of the benefit, effectively cancelling it out. Only the higher earner pays the charge.',
  },
  {
    question: 'Should I claim Child Benefit if I expect to repay it?',
    answer:
      'Yes. Registering preserves your National Insurance credits and protects your State Pension record. You can choose to keep receiving payments and repay the charge via self assessment, or opt out of the payments while maintaining the claim.',
  },
];

const computeChildBenefit = (childrenInput, incomeInput, partnerIncomeInput) => {
  const children = Math.max(Number(childrenInput) || 0, 0);
  const income = Math.max(Number(incomeInput) || 0, 0);
  const partnerIncome = Math.max(Number(partnerIncomeInput) || 0, 0);

  if (children === 0) {
    return {
      weeklyBenefit: 0,
      monthlyBenefit: 0,
      annualBenefit: 0,
      charge: 0,
      netAnnual: 0,
      netMonthly: 0,
      netWeekly: 0,
      chargeRate: 0,
      highestIncome: Math.max(income, partnerIncome),
    };
  }

  const weeklyBenefit = FIRST_CHILD_WEEKLY + Math.max(children - 1, 0) * ADDITIONAL_CHILD_WEEKLY;
  const annualBenefit = weeklyBenefit * 52;
  const monthlyBenefit = annualBenefit / 12;
  const highestIncome = Math.max(income, partnerIncome);

  let chargeRate = 0;
  if (highestIncome > LOWER_THRESHOLD) {
    chargeRate = (highestIncome - LOWER_THRESHOLD) / (UPPER_THRESHOLD - LOWER_THRESHOLD);
    chargeRate = Math.min(Math.max(chargeRate, 0), 1);
  }

  const charge = annualBenefit * chargeRate;
  const netAnnual = Math.max(annualBenefit - charge, 0);

  return {
    weeklyBenefit,
    monthlyBenefit,
    annualBenefit,
    charge,
    netAnnual,
    netMonthly: netAnnual / 12,
    netWeekly: netAnnual / 52,
    chargeRate,
    highestIncome,
  };
};

export default function ChildBenefitCalculatorPage() {
  const [childrenCount, setChildrenCount] = useState('1');
  const [income, setIncome] = useState('');
  const [partnerIncome, setPartnerIncome] = useState('');

  const results = useMemo(
    () => computeChildBenefit(childrenCount, income, partnerIncome),
    [childrenCount, income, partnerIncome]
  );

  const incomeMessage = useMemo(() => {
    if (!results) return '';
    if (results.highestIncome <= LOWER_THRESHOLD) {
      return 'No High Income Child Benefit Charge applies.';
    }
    if (results.highestIncome >= UPPER_THRESHOLD) {
      return 'Charge equals 100% of the Child Benefit received. Consider opting out of payments to avoid repayments.';
    }
    const percent = (results.chargeRate * 100).toFixed(1);
    return `Charge claws back ${percent}% of your Child Benefit.`;
  }, [results]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Child Benefit Calculator | Child Benefit Calculator 2024</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Child Benefit Calculator | Child Benefit Calculator 2024"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Child Benefit Calculator | Child Benefit Calculator 2024"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-blue-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Child Benefit Calculator
          </Heading>
          <p className="text-lg md:text-xl text-blue-100">
            Estimate how much child benefit you can claim, apply the 2024 High Income Charge, and
            plan your family budget in minutes.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-600" />
                Household Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="children" className="text-sm font-medium">
                  Number of eligible children
                </Label>
                <Input
                  id="children"
                  type="number"
                  min={0}
                  inputMode="numeric"
                  value={childrenCount}
                  onChange={(event) => setChildrenCount(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="income" className="text-sm font-medium">
                  Your adjusted net income (£)
                </Label>
                <Input
                  id="income"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={income}
                  onChange={(event) => setIncome(event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="partnerIncome" className="text-sm font-medium">
                  Partner adjusted net income (£)
                </Label>
                <Input
                  id="partnerIncome"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={partnerIncome}
                  onChange={(event) => setPartnerIncome(event.target.value)}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setChildrenCount('1');
                  setIncome('');
                  setPartnerIncome('');
                }}
              >
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
                  <Baby className="h-5 w-5" />
                  Benefit Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Weekly Benefit</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter.format(results.weeklyBenefit)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Monthly Benefit</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter.format(results.monthlyBenefit)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-blue-900/60 p-4 border border-blue-100 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-200">Annual Benefit</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {currencyFormatter.format(results.annualBenefit)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <AlertCircle className="h-5 w-5 text-slate-600" />
                  High Income Charge Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4 text-center">
                  <div className="rounded-md bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Charge Amount</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.charge)}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Net Annual Benefit</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.netAnnual)}
                    </p>
                  </div>
                  <div className="rounded-md bg-slate-50 dark:bg-slate-900/50 p-4 border border-slate-200 dark:border-slate-800">
                    <p className="text-sm text-slate-600 dark:text-slate-300">Charge Rate</p>
                    <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                      {(results.chargeRate * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300">{incomeMessage}</p>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Child Benefit Calculator 2024 updates
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The child benefit calculator 2024 figures reflect the latest weekly payments and the
                tapered High Income Charge. Update your earnings or adjust the number of children to
                see how child benefit contributes to your monthly cash flow.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning with a Child Tax Benefit Calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Pair this child tax benefit calculator with your wider household budget to forecast
                future income. Whether you are returning to work or adjusting salary sacrifice
                contributions, modelling the child benefit impact helps prevent unexpected tax
                bills.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={childBenefitFaqs} />
        </div>
      </section>
    </div>
  );
}
