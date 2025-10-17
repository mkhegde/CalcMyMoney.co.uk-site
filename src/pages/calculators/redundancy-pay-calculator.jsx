// src/pages/calculators/redundancy-pay-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Briefcase, Scale, Clipboard } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/redundancy-pay-calculator';

const schemaKeywords = [
  'Redundancy Amount',
  'Service Length',
  'Weekly Pay',
  'Employment Rights',
  'Tax-Free Limit',
];

const faqItems = [
  {
    question: 'How is statutory redundancy pay worked out?',
    answer:
      'Statutory redundancy pay is based on age, years of continuous service, and weekly pay (capped). Multiply eligible weeks by the lower of your weekly pay or the statutory maximum.',
  },
  {
    question: 'Is redundancy pay tax-free?',
    answer:
      'Statutory redundancy pay up to £30,000 is free of income tax and National Insurance. Payments that exceed this or include holiday pay are taxable.',
  },
  {
    question: 'What if my contract offers enhanced redundancy?',
    answer:
      'Enhanced or contractual redundancy schemes can exceed statutory minimums. Enter the enhanced multiplier to model a fair compensation package consistent with your employment rights.',
  },
];

function calculateEligibleWeeks(age, serviceYears) {
  let eligibleWeeks = 0;
  for (let year = 1; year <= serviceYears; year += 1) {
    const currentAge = age - (serviceYears - year);
    if (currentAge < 22) eligibleWeeks += 0.5;
    else if (currentAge <= 40) eligibleWeeks += 1;
    else eligibleWeeks += 1.5;
  }
  return Math.min(eligibleWeeks, 20);
}

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function RedundancyPayCalculator() {
  const [inputs, setInputs] = useState({
    ageAtRedundancy: '35',
    yearsOfService: '6',
    weeklyPay: '620',
    statutoryWeeklyCap: '700',
    enhancedMultiplier: '1',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const ageAtRedundancy = Number(inputs.ageAtRedundancy) || 0;
    const yearsOfService = Number(inputs.yearsOfService) || 0;
    const weeklyPay = Number(inputs.weeklyPay) || 0;
    const statutoryWeeklyCap = Number(inputs.statutoryWeeklyCap) || 0;
    const enhancedMultiplier = Number(inputs.enhancedMultiplier) || 0;

    const eligibleWeeks = calculateEligibleWeeks(ageAtRedundancy, yearsOfService);
    const cappedWeeklyPay = Math.min(weeklyPay, statutoryWeeklyCap);
    const statutoryAmount = eligibleWeeks * cappedWeeklyPay;
    const enhancedAmount = statutoryAmount * Math.max(enhancedMultiplier, 1);

    const taxFreeLimit = 30000;
    const taxableAmount = Math.max(0, enhancedAmount - taxFreeLimit);

    return {
      eligibleWeeks,
      cappedWeeklyPay,
      statutoryAmount,
      enhancedAmount,
      taxFreeLimit,
      taxableAmount,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      ageAtRedundancy: '35',
      yearsOfService: '6',
      weeklyPay: '620',
      statutoryWeeklyCap: '700',
      enhancedMultiplier: '1',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Redundancy Pay & Redundancy Entitlement Calculator</title>
        <meta
          name="description"
          content="Estimate redundancy pay, understand statutory redundancy entitlements, and model notice pay for UK employees."
        />
        <meta name="keywords" content="Redundancy Calculator, Statutory Redundancy, Notice Pay" />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'GovernmentService',
              name: 'Redundancy Pay Calculator',
              description:
                'Calculate redundancy amount based on service length, weekly pay, employment rights, and tax-free limits in the UK.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              areaServed: 'GB',
              serviceType: 'Redundancy entitlement calculation',
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Redundancy Pay Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Calculate redundancy entitlements, check redundancy law, and review payment breakdowns to
            ensure fair compensation after job loss.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Redundancy Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ageAtRedundancy" className="text-sm font-medium">
                    Age at redundancy
                  </Label>
                  <Input
                    id="ageAtRedundancy"
                    inputMode="numeric"
                    value={inputs.ageAtRedundancy}
                    onChange={(event) => handleChange('ageAtRedundancy', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="yearsOfService" className="text-sm font-medium">
                    Years of service
                  </Label>
                  <Input
                    id="yearsOfService"
                    inputMode="numeric"
                    value={inputs.yearsOfService}
                    onChange={(event) => handleChange('yearsOfService', event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="weeklyPay" className="text-sm font-medium">
                  Average weekly pay (£)
                </Label>
                <Input
                  id="weeklyPay"
                  inputMode="decimal"
                  value={inputs.weeklyPay}
                  onChange={(event) => handleChange('weeklyPay', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="statutoryWeeklyCap" className="text-sm font-medium">
                  Statutory weekly cap (£)
                </Label>
                <Input
                  id="statutoryWeeklyCap"
                  inputMode="decimal"
                  value={inputs.statutoryWeeklyCap}
                  onChange={(event) => handleChange('statutoryWeeklyCap', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="enhancedMultiplier" className="text-sm font-medium">
                  Enhanced multiplier
                </Label>
                <Input
                  id="enhancedMultiplier"
                  inputMode="decimal"
                  value={inputs.enhancedMultiplier}
                  onChange={(event) => handleChange('enhancedMultiplier', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Briefcase className="h-5 w-5 text-rose-500" />
                  Payment Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Eligible weeks</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.eligibleWeeks.toFixed(1)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Capped weekly pay</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.cappedWeeklyPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Statutory redundancy</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.statutoryAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Enhanced redundancy</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.enhancedAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax-free limit</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.taxFreeLimit)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Taxable amount</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.taxableAmount)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 dark;border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Scale className="h-5 w-5 text-rose-500" />
                  Fair Compensation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>• Confirm service length and job loss dates against employment records.</p>
                <p>
                  • Include contractual notice pay, holiday pay, and other allowances for a complete
                  payment breakdown.
                </p>
                <p>
                  • Seek advice if redundancy law or employment rights are unclear, especially for
                  enhanced schemes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Redundancy for Fair Compensation
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            This redundancy calculator helps you estimate statutory entitlements, understand
            redundancy law, and prepare for job loss with clarity on payment breakdowns.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Redundancy Law and Employment Rights
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Employers must follow fair redundancy processes and provide the higher of statutory or
            contractual redundancy pay. Always verify calculations and discuss with HR if figures
            seem incorrect.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Payment Breakdown and Tax-Free Limits
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Payments up to £30,000 are tax-free, but holiday pay, notice pay, or ex gratia sums above
            that limit may be taxable. Use this tool to check which parts of the package count
            toward the tax-free allowance.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
