import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const metaDescription =
  'Use our pension calculator to project retirement savings, compare uk pension calculator options, and balance private pension calculator and workplace pension calculator contributions.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/pension-calculator';
const schemaKeywords = [
  'pension calculator',
  'uk pension calculator',
  'private pension calculator',
  'state pension calculator',
  'workplace pension calculator',
];

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const pensionFaqs = [
  {
    question: 'How much should I contribute to my pension?',
    answer:
      'Aim for at least 12-15% of gross pay when combining personal and employer contributions. Increase the rate when you receive a promotion or pay rise.',
  },
  {
    question: 'What growth rate should I assume?',
    answer:
      'Long-term diversified portfolios have returned 4-6% above inflation historically. Use a conservative figure (e.g. 4%) to build a safety margin.',
  },
  {
    question: 'Does this pension calculator include the State Pension?',
    answer:
      'You can add expected State Pension income in the “Other retirement income” field. Check your State Pension forecast regularly for up-to-date estimates.',
  },
];

const calculatePensionGrowth = ({
  currentAge,
  retirementAge,
  currentPot,
  monthlyContribution,
  employerContribution,
  annualReturn,
  annualIncomeGoal,
  otherRetirementIncome,
}) => {
  const years = Math.max(retirementAge - currentAge, 0);
  const months = years * 12;
  const monthlyRate = annualReturn / 100 / 12;
  let balance = currentPot;
  let totalContributions = currentPot;

  for (let month = 1; month <= months; month += 1) {
    const contribution = monthlyContribution + employerContribution;
    balance += contribution;
    totalContributions += contribution;
    if (monthlyRate > 0) {
      balance *= 1 + monthlyRate;
    }
  }

  const incomeGap = Math.max(annualIncomeGoal - otherRetirementIncome, 0);
  const requiredPotForIncome = incomeGap / 0.04; // 4% rule
  const potGap = Math.max(requiredPotForIncome - balance, 0);

  return {
    balance,
    totalContributions,
    years,
    incomeGap,
    requiredPotForIncome,
    potGap,
  };
};

export default function PensionCalculatorPage() {
  const [inputs, setInputs] = useState({
    currentAge: 35,
    retirementAge: 67,
    currentPot: 55000,
    monthlyContribution: 400,
    employerContribution: 200,
    annualReturn: 5,
    annualIncomeGoal: 38000,
    otherRetirementIncome: 11000,
  });

  const results = useMemo(
    () =>
      calculatePensionGrowth({
        currentAge: Number(inputs.currentAge) || 0,
        retirementAge: Number(inputs.retirementAge) || 0,
        currentPot: Number(inputs.currentPot) || 0,
        monthlyContribution: Number(inputs.monthlyContribution) || 0,
        employerContribution: Number(inputs.employerContribution) || 0,
        annualReturn: Number(inputs.annualReturn) || 0,
        annualIncomeGoal: Number(inputs.annualIncomeGoal) || 0,
        otherRetirementIncome: Number(inputs.otherRetirementIncome) || 0,
      }),
    [inputs]
  );

  const resetInputs = () =>
    setInputs({
      currentAge: 35,
      retirementAge: 67,
      currentPot: 55000,
      monthlyContribution: 400,
      employerContribution: 200,
      annualReturn: 5,
      annualIncomeGoal: 38000,
      otherRetirementIncome: 11000,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Pension Calculator | UK Pension Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Pension Calculator | UK Pension Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pension Calculator | UK Pension Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Pension Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan pension savings',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-indigo-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Pension Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Project retirement savings, model contributions, and see if you are on track to hit your
            pension income goals in the UK.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Current age
                    <span className="text-emerald-600 font-semibold">{inputs.currentAge}</span>
                  </Label>
                  <Slider
                    value={[inputs.currentAge]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, currentAge: Math.round(value[0]) }))
                    }
                    min={18}
                    max={70}
                    step={1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Retirement age
                    <span className="text-emerald-600 font-semibold">{inputs.retirementAge}</span>
                  </Label>
                  <Slider
                    value={[inputs.retirementAge]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, retirementAge: Math.round(value[0]) }))
                    }
                    min={40}
                    max={75}
                    step={1}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="currentPot" className="text-sm font-medium">
                  Current pension pot (£)
                </Label>
                <Input
                  id="currentPot"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.currentPot}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, currentPot: Number(event.target.value) }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyContribution" className="text-sm font-medium">
                    Your contribution (£/month)
                  </Label>
                  <Input
                    id="monthlyContribution"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.monthlyContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlyContribution: Number(event.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="employerContribution" className="text-sm font-medium">
                    Employer contribution (£/month)
                  </Label>
                  <Input
                    id="employerContribution"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.employerContribution}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        employerContribution: Number(event.target.value),
                      }))
                    }
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Expected annual growth
                  <span className="text-emerald-600 font-semibold">
                    {inputs.annualReturn.toFixed(1)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.annualReturn]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, annualReturn: Number(value[0].toFixed(1)) }))
                  }
                  min={0}
                  max={12}
                  step={0.1}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="annualIncomeGoal" className="text-sm font-medium">
                    Target retirement income (£/year)
                  </Label>
                  <Input
                    id="annualIncomeGoal"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.annualIncomeGoal}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualIncomeGoal: Number(event.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="otherRetirementIncome" className="text-sm font-medium">
                    Other retirement income (£/year)
                  </Label>
                  <Input
                    id="otherRetirementIncome"
                    type="number"
                    min={0}
                    inputMode="decimal"
                    value={inputs.otherRetirementIncome}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        otherRetirementIncome: Number(event.target.value),
                      }))
                    }
                  />
                </div>
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
                  <PiggyBank className="h-5 w-5" />
                  Pension Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Years investing</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {results.years}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Final pot</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter(results.balance)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">
                    Total contributions
                  </p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter(results.totalContributions)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Pot gap</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter(results.potGap)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Income Goal Check
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  Your target pension income is{' '}
                  <span className="font-semibold">
                    {currencyFormatter(inputs.annualIncomeGoal)}
                  </span>{' '}
                  per year. Other income contributes{' '}
                  {currencyFormatter(inputs.otherRetirementIncome)}.
                </p>
                <p>
                  That leaves an income gap of {currencyFormatter(results.incomeGap)}, requiring a
                  pot of {currencyFormatter(results.requiredPotForIncome)} assuming a 4% withdrawal
                  rate.
                </p>
                <p>
                  Increase contributions or extend your timeline to close the{' '}
                  {currencyFormatter(results.potGap)} gap shown above.
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
                UK pension calculator planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Combine the uk pension calculator projections with State Pension forecasts,
                workplace contributions, and private pension calculator plans for the full picture.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Moving from workplace pension calculator to retirement
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the workplace pension calculator inputs to see how employer contributions
                accelerate growth. Small increases in contributions early on deliver big retirement
                gains.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={pensionFaqs} />
        </div>
      </section>
    </div>
  );
}
