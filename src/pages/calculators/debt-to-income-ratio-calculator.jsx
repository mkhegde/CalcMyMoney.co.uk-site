import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Home, Briefcase, AlertTriangle } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['debt to income ratio calculator', 'dti calculator', 'debt to income calculator'];

const metaDescription =
  'Use our debt to income ratio calculator to track DTI, test dti calculator scenarios, and keep debt to income calculator goals in view before applying for loans.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/debt-to-income-ratio-calculator';
const schemaKeywords = keywords.slice(0, 5);

const dtiFaqs = [
  {
    question: 'What counts as debt in the DTI calculation?',
    answer:
      'Include monthly repayments for mortgages, car loans, student loans, credit cards, buy now pay later plans, and minimum payments on overdrafts. Exclude discretionary spending, utility bills, and subscriptions.',
  },
  {
    question: 'What is a good debt-to-income ratio?',
    answer:
      'Lenders often prefer a DTI below 36%, with 28% or less going to housing. Higher ratios can still qualify depending on credit score and savings, but improving DTI helps secure better interest rates.',
  },
  {
    question: 'How can I reduce my DTI?',
    answer:
      'Pay down revolving debt, consolidate to lower-interest loans, or increase income with side hustles. Revisit this DTI calculator after each change to visualise progress.',
  },
];

const formatPercentage = (value) => `${value.toFixed(1)}%`;

const calculateDTI = ({ housingDebt, otherDebt, grossMonthlyIncome }) => {
  const totalDebt = Number(housingDebt) + Number(otherDebt);
  const income = Number(grossMonthlyIncome);

  if (income <= 0) {
    return {
      housingDTI: 0,
      totalDTI: 0,
      totalDebt,
      warning: 'Enter your gross monthly income to calculate DTI accurately.',
    };
  }

  const housingDTI = (housingDebt / income) * 100;
  const totalDTI = (totalDebt / income) * 100;

  return {
    housingDTI,
    totalDTI,
    totalDebt,
    warning: '',
  };
};

const classifyDTI = (ratio) => {
  if (ratio <= 28) return { label: 'Excellent', color: 'text-emerald-600' };
  if (ratio <= 36) return { label: 'Good', color: 'text-lime-600' };
  if (ratio <= 43) return { label: 'Fair', color: 'text-amber-600' };
  return { label: 'Needs attention', color: 'text-rose-600' };
};

export default function DebtToIncomeRatioCalculatorPage() {
  const [inputs, setInputs] = useState({
    housingDebt: 1100,
    otherDebt: 650,
    grossMonthlyIncome: 4500,
  });

  const results = useMemo(
    () =>
      calculateDTI({
        housingDebt: Number(inputs.housingDebt) || 0,
        otherDebt: Number(inputs.otherDebt) || 0,
        grossMonthlyIncome: Number(inputs.grossMonthlyIncome) || 0,
      }),
    [inputs]
  );

  const housingClassification = classifyDTI(results.housingDTI);
  const totalClassification = classifyDTI(results.totalDTI);

  const resetInputs = () =>
    setInputs({
      housingDebt: 1100,
      otherDebt: 650,
      grossMonthlyIncome: 4500,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Debt to Income Ratio Calculator | DTI Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Debt to Income Ratio Calculator | DTI Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Debt to Income Ratio Calculator | DTI Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Debt to Income Ratio Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate debt to income ratio',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-emerald-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Debt to Income Ratio Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Understand how lenders view your debt load and explore ways to improve your DTI before
            applying for mortgages, loans, or new credit cards.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Monthly Totals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label
                  htmlFor="housingDebt"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Home className="h-4 w-4 text-emerald-500" />
                  Housing costs (£/month)
                </Label>
                <Input
                  id="housingDebt"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.housingDebt}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, housingDebt: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="otherDebt" className="text-sm font-medium flex items-center gap-2">
                  <Percent className="h-4 w-4 text-emerald-500" />
                  Other debt payments (£/month)
                </Label>
                <Input
                  id="otherDebt"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.otherDebt}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, otherDebt: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label
                  htmlFor="grossMonthlyIncome"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Briefcase className="h-4 w-4 text-emerald-500" />
                  Gross monthly income (£)
                </Label>
                <Input
                  id="grossMonthlyIncome"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.grossMonthlyIncome}
                  onChange={(event) =>
                    setInputs((prev) => ({
                      ...prev,
                      grossMonthlyIncome: Number(event.target.value),
                    }))
                  }
                />
                <p className="text-xs text-slate-500 mt-1">
                  Before tax and deductions. Include your salary and any regular secondary income.
                </p>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <Percent className="h-5 w-5" />
                  Debt to Income Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Housing DTI</p>
                  <p className={`text-2xl font-bold ${housingClassification.color}`}>
                    {formatPercentage(results.housingDTI)}{' '}
                    <span className="text-base text-slate-500">
                      / {housingClassification.label}
                    </span>
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total DTI</p>
                  <p className={`text-2xl font-bold ${totalClassification.color}`}>
                    {formatPercentage(results.totalDTI)}{' '}
                    <span className="text-base text-slate-500">/ {totalClassification.label}</span>
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Monthly debt total
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    £{results.totalDebt.toFixed(0)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {results.warning ? (
              <Card className="border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/30">
                <CardContent className="flex items-center gap-3 py-4 text-amber-800 dark:text-amber-100">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="text-sm">{results.warning}</p>
                </CardContent>
              </Card>
            ) : null}

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  What your DTI means
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Housing ratio:</span> Lenders like this to sit
                  below 28%. If you are above that threshold, consider paying off consumer debt or
                  increasing your deposit to bring the ratio down.
                </p>
                <p>
                  <span className="font-semibold">Total ratio:</span> Keep it under 36% for
                  conventional mortgages. Anything above 43% often requires specialist products,
                  higher rates, or a guarantor.
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
                DTI calculator action plan
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the dti calculator to test different payoff amounts or income changes. Improving
                your ratio before you apply for a mortgage or personal loan can unlock lower
                interest rates and higher borrowing power.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Debt to income calculator checkpoints
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Monitor your debt to income calculator results quarterly, especially after taking on
                new credit. Record your ratios so you can show consistent improvement when speaking
                with lenders.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={dtiFaqs} />
        </div>
      </section>
    </div>
  );
}
