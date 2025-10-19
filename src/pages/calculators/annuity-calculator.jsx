import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Calendar, PoundSterling, TrendingUp } from 'lucide-react';

import { breadcrumbSchema } from '@/components/seo/JsonLd';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const annuityKeywords = [
  'annuity calculator',
  'best annuity calculator',
  'variable annuity calculator',
  'immediate annuity calculator',
  'deferred annuity calculator',
  'retirement annuity calculator',
  'lump sum annuity calculator',
];

const metaDescription =
  'Use our annuity calculator to compare best annuity calculator rates and model payouts with a variable annuity calculator for security and fixed-term plans.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/annuity-calculator';
const schemaKeywords = annuityKeywords.slice(0, 5);

const annuityFAQs = [
  {
    question: 'How does an annuity calculator estimate income?',
    answer:
      'An annuity calculator uses the size of your pension pot, expected interest rate, and term to estimate a regular payment amount. The formula solves for the payment in a standard annuity equation, showing the monthly and annual income you could receive.',
  },
  {
    question: 'Can I model inflation-linked annuities?',
    answer:
      'The tool assumes a level (fixed) payment. To model inflation-linked or escalating annuities, adjust the interest rate downward to simulate how providers price rising payments or run multiple scenarios for each expected uplift.',
  },
  {
    question: 'What fees or taxes should I consider?',
    answer:
      'Providers may deduct charges before setting your rate, and income tax applies to annuity income. Always request personalised quotes and confirm projected payments with a regulated adviser before committing.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPounds = (value) =>
  currencyFormatter.format(Math.max(Number.isFinite(value) ? value : 0, 0));

export default function AnnuityCalculatorPage() {
  const [annuityPot, setAnnuityPot] = useState('150000');
  const [interestRate, setInterestRate] = useState('5');
  const [annuityTerm, setAnnuityTerm] = useState('20');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const pot = Number(annuityPot) || 0;
    const ratePercent = Number(interestRate) || 0;
    const termYears = Number(annuityTerm) || 0;

    if (pot <= 0 || ratePercent <= 0 || termYears <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const monthlyRate = ratePercent / 100 / 12;
    const totalPayments = termYears * 12;
    const monthlyPayout =
      monthlyRate === 0
        ? pot / totalPayments
        : pot / ((1 - Math.pow(1 + monthlyRate, -totalPayments)) / monthlyRate);
    const annualPayout = monthlyPayout * 12;
    const totalPayout = monthlyPayout * totalPayments;
    const totalInterest = totalPayout - pot;

    setResults({
      pot,
      ratePercent,
      termYears,
      monthlyPayout,
      annualPayout,
      totalPayout,
      totalInterest,
    });
    setHasCalculated(true);
  }, [annuityPot, interestRate, annuityTerm]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  const breadcrumbJson = breadcrumbSchema([
    { name: 'Home', item: 'https://www.calcmymoney.co.uk/' },
    {
      name: 'Pensions & Retirement Calculators',
      item: 'https://www.calcmymoney.co.uk/calculators#pensions-retirement',
    },
    { name: 'Annuity Calculator', item: canonicalUrl },
  ]);

  const webpageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Annuity Calculator',
    description: metaDescription,
    url: canonicalUrl,
    keywords: schemaKeywords,
    inLanguage: 'en-GB',
    potentialAction: {
      '@type': 'Action',
      name: 'Calculate annuity income',
      target: canonicalUrl,
    },
    about: {
      '@type': 'FinancialProduct',
      name: 'Annuity Income Projection',
      description:
        'Interactive annuity calculator that estimates monthly, annual, and total payouts for pension pots.',
    },
  };

  const rateSliderMax = Math.max(10, Number(interestRate) || 0);
  const termSliderMax = Math.max(40, Number(annuityTerm) || 0);
  const potSliderMax = Math.max(500000, Number(annuityPot) || 0);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Annuity Calculator | Best Annuity Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {/* OpenGraph/Twitter tags using static data - these were manually included in the old SeoHead */}
        <meta property="og:title" content="Annuity Calculator | Best Annuity Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:title" content="Annuity Calculator | Best Annuity Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        {/* We keep the JSON-LD schemas, as Helmet can handle them */}
        <script type="application/ld+json">{JSON.stringify(breadcrumbJson)}</script>
        <script type="application/ld+json">{JSON.stringify(webpageSchema)}</script>
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Annuity Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Compare payouts with the best annuity calculator approach, adjust assumptions with a
            variable annuity calculator, and project steady retirement income in minutes.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-600" />
                Annuity Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label
                  htmlFor="annuity-pot"
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>Pension Pot</span>
                  <span className="text-emerald-600 font-semibold">
                    {formatPounds(Number(annuityPot) || 0)}
                  </span>
                </Label>
                <div className="mt-2 relative">
                  <PoundSterling className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="annuity-pot"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step="1000"
                    className="pl-9"
                    value={annuityPot}
                    onChange={(event) => setAnnuityPot(event.target.value)}
                  />
                </div>
                <Slider
                  value={[Math.min(Math.max(Number(annuityPot) || 0, 0), potSliderMax)]}
                  onValueChange={(value) => setAnnuityPot(String(value[0]))}
                  max={potSliderMax}
                  min={0}
                  step={1000}
                  className="mt-4"
                />
              </div>

              <div>
                <Label
                  htmlFor="annuity-rate"
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>Estimated Annual Rate</span>
                  <span className="text-emerald-600 font-semibold">
                    {(Number(interestRate) || 0).toFixed(2)}%
                  </span>
                </Label>
                <Input
                  id="annuity-rate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.1"
                  className="mt-2"
                  value={interestRate}
                  onChange={(event) => setInterestRate(event.target.value)}
                />
                <Slider
                  value={[Math.min(Math.max(Number(interestRate) || 0, 0), rateSliderMax)]}
                  onValueChange={(value) => setInterestRate(String(value[0]))}
                  max={rateSliderMax}
                  min={0}
                  step={0.1}
                  className="mt-4"
                />
              </div>

              <div>
                <Label
                  htmlFor="annuity-term"
                  className="flex items-center justify-between text-sm font-medium"
                >
                  <span>Payment Term (years)</span>
                  <span className="text-emerald-600 font-semibold">{Number(annuityTerm) || 0}</span>
                </Label>
                <Input
                  id="annuity-term"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step="1"
                  className="mt-2"
                  value={annuityTerm}
                  onChange={(event) => setAnnuityTerm(event.target.value)}
                />
                <Slider
                  value={[Math.min(Math.max(Number(annuityTerm) || 0, 1), termSliderMax)]}
                  onValueChange={(value) => setAnnuityTerm(String(value[0]))}
                  max={termSliderMax}
                  min={1}
                  step={1}
                  className="mt-4"
                />
              </div>

              <Button type="button" onClick={handleCalculate} className="w-full">
                Recalculate Income
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm bg-emerald-50 dark:bg-emerald-900/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-800 dark:text-emerald-100">
                      <TrendingUp className="h-5 w-5" />
                      Annuity Income Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-3 text-center">
                    <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-600 dark:text-emerald-200">
                        Monthly Payout
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {formatPounds(results.monthlyPayout)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-600 dark:text-emerald-200">
                        Annual Payout
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {formatPounds(results.annualPayout)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-600 dark:text-emerald-200">Total Payout</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {formatPounds(results.totalPayout)}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      Scenario Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-slate-700 dark:text-slate-200">
                    <p>
                      Based on a pension pot of {formatPounds(results.pot)} and an estimated rate of{' '}
                      {(results.ratePercent || 0).toFixed(2)}%, your annuity could pay{' '}
                      {formatPounds(results.annualPayout)} per year for {results.termYears} years.
                    </p>
                    <p>
                      Over the full term you would receive {formatPounds(results.totalPayout)}, of
                      which {formatPounds(results.totalInterest)} represents growth generated by the
                      best annuity calculator assumption you set.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="h-64 border border-dashed border-emerald-300 dark:border-emerald-900 flex items-center justify-center text-center">
                <div className="space-y-2 text-slate-500 dark:text-slate-300">
                  <TrendingUp className="mx-auto h-10 w-10 text-emerald-500" />
                  <p className="text-lg font-semibold">
                    Enter your details to project annuity income
                  </p>
                  <p className="text-sm">
                    Provide your pension pot, rate, and term to see monthly and annual payouts.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="space-y-4">
            <Heading
              as="h2"
              size="h2"
              weight="semibold"
              className="text-slate-900 dark:text-slate-100"
            >
              Immediate Annuity Calculator vs Deferred Strategies
            </Heading>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Run multiple scenarios with the immediate annuity calculator settings to model income
              that starts right away, or slow the start date with deferred annuity calculator
              assumptions. Blending both approaches can help balance near-term spending power with
              future flexibility.
            </p>
          </div>

          <div className="space-y-4">
            <Heading
              as="h3"
              size="h3"
              weight="semibold"
              className="text-slate-900 dark:text-slate-100"
            >
              Planning with a Retirement Annuity Calculator
            </Heading>
            <p className="text-base text-slate-600 dark:text-slate-300">
              Combine this retirement annuity calculator with your broader financial plan to see how
              much guaranteed income you can draw from a lump sum annuity calculator payout. Test
              pot sizes, interest rate expectations, and terms to keep retirement spending on track
              even if market returns vary.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={annuityFAQs} />
        </div>
      </section>
    </div>
  );
}
