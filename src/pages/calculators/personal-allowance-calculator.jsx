import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, FileText, HandCoins } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/personal-allowance-calculator';

const faqItems = [
  {
    question: 'How does the personal allowance taper work?',
    answer:
      'For every £2 of adjusted net income above £100,000, your personal allowance is reduced by £1. Once adjusted income reaches £125,140, the personal allowance is fully removed.',
  },
  {
    question: 'What counts as adjusted net income?',
    answer:
      'Adjusted net income starts with taxable income and subtracts certain tax reliefs (for example, pension contributions, gross Gift Aid donations, and trade losses). Use official HMRC guidance to ensure your inputs are accurate.',
  },
  {
    question: 'How does Marriage Allowance affect my personal allowance?',
    answer:
      'If you receive Marriage Allowance, your personal allowance increases by 10% of the standard allowance (£1,257 for 2025/26). If you transfer it to a spouse, your allowance decreases by the same amount.',
  },
];

const formatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const allowanceFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const STANDARD_ALLOWANCE = 12570;
const MARRIAGE_ALLOWANCE_DELTA = Math.round(STANDARD_ALLOWANCE * 0.1); // £1257
const ALLOWANCE_ZERO_THRESHOLD = 125140; // 100k + (12570 * 2)

const marriageAllowanceOptions = [
  { value: 'none', label: 'No marriage allowance change', delta: 0 },
  {
    value: 'received',
    label: 'I receive Marriage Allowance (+£1,257)',
    delta: MARRIAGE_ALLOWANCE_DELTA,
  },
  {
    value: 'transferred',
    label: 'I transfer Marriage Allowance (-£1,257)',
    delta: -MARRIAGE_ALLOWANCE_DELTA,
  },
];

export default function PersonalAllowanceCalculator() {
  const [inputs, setInputs] = useState({
    income: '110000',
    pensionRelief: '5000',
    giftAid: '1000',
    otherReliefs: '0',
    marriageOption: 'none',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const income = Number(inputs.income) || 0;
    const pensionRelief = Number(inputs.pensionRelief) || 0;
    const giftAid = Number(inputs.giftAid) || 0;
    const otherReliefs = Number(inputs.otherReliefs) || 0;
    const marriageOption =
      marriageAllowanceOptions.find((opt) => opt.value === inputs.marriageOption) ||
      marriageAllowanceOptions[0];

    const reliefTotal = pensionRelief + giftAid + otherReliefs;
    const adjustedNetIncome = Math.max(0, income - reliefTotal);

    let taperedAllowance = STANDARD_ALLOWANCE;
    if (adjustedNetIncome > 100000) {
      const reduction = Math.floor((adjustedNetIncome - 100000) / 2);
      taperedAllowance = Math.max(0, STANDARD_ALLOWANCE - reduction);
    }

    // Marriage allowance adjustment applied after taper
    let adjustedAllowance = taperedAllowance + marriageOption.delta;
    adjustedAllowance = Math.max(0, adjustedAllowance);

    const lostAllowance = STANDARD_ALLOWANCE + Math.min(0, marriageOption.delta) - adjustedAllowance;
    const taxCost = lostAllowance * 0.4; // high rate band assumption for illustration

    const marginalReliefNeeded =
      adjustedAllowance === 0 && adjustedNetIncome > ALLOWANCE_ZERO_THRESHOLD
        ? Math.max(0, adjustedNetIncome - ALLOWANCE_ZERO_THRESHOLD + 1)
        : Math.max(0, adjustedAllowance - taperedAllowance);

    return {
      income,
      reliefTotal,
      adjustedNetIncome,
      taperedAllowance,
      marriageDelta: marriageOption.delta,
      adjustedAllowance,
      lostAllowance,
      taxCost,
      marginalReliefNeeded,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      income: '110000',
      pensionRelief: '5000',
      giftAid: '1000',
      otherReliefs: '0',
      marriageOption: 'none',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Personal Allowance Calculator | UK Income Tax Tool</title>
        <meta
          name="description"
          content="Estimate your personal allowance, adjust for tax reliefs, and understand how high income affects UK personal allowance tapering."
        />
        <meta
          name="keywords"
          content="personal allowance calculator, adjusted net income, UK income tax"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Personal Allowance Calculator',
              description:
                'Interactive calculator to estimate UK personal allowance after pension contributions, Gift Aid, and other reliefs.',
              url: canonicalUrl,
              keywords: [
                'Personal Allowance',
                'Adjusted Net Income',
                'Income Tax Relief',
                'Marriage Allowance',
                'Gift Aid',
              ],
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Personal Allowance Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Understand how adjusted net income, pension relief, and Marriage Allowance influence your
            UK personal allowance.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="income" className="text-sm font-medium">
                  Total taxable income (£)
                </Label>
                <Input
                  id="income"
                  inputMode="decimal"
                  value={inputs.income}
                  onChange={(event) => handleChange('income', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pensionRelief" className="text-sm font-medium">
                  Gross pension contributions (£)
                </Label>
                <Input
                  id="pensionRelief"
                  inputMode="decimal"
                  value={inputs.pensionRelief}
                  onChange={(event) => handleChange('pensionRelief', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="giftAid" className="text-sm font-medium">
                  Gross Gift Aid donations (£)
                </Label>
                <Input
                  id="giftAid"
                  inputMode="decimal"
                  value={inputs.giftAid}
                  onChange={(event) => handleChange('giftAid', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="otherReliefs" className="text-sm font-medium">
                  Other tax reliefs (£)
                </Label>
                <Input
                  id="otherReliefs"
                  inputMode="decimal"
                  value={inputs.otherReliefs}
                  onChange={(event) => handleChange('otherReliefs', event.target.value)}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Marriage Allowance setting</Label>
                <Select
                  value={inputs.marriageOption}
                  onValueChange={(value) => handleChange('marriageOption', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select option" />
                  </SelectTrigger>
                  <SelectContent>
                    {marriageAllowanceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <HandCoins className="h-5 w-5 text-indigo-500" />
                  Allowance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Adjusted net income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {formatter.format(results.adjustedNetIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax relief total</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {formatter.format(results.reliefTotal)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tapered allowance (before marriage adj.)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {allowanceFormatter.format(results.taperedAllowance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Marriage allowance change</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {allowanceFormatter.format(results.marriageDelta)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Resulting personal allowance</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {allowanceFormatter.format(results.adjustedAllowance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Allowance lost vs standard</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {allowanceFormatter.format(results.lostAllowance)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-indigo-500" />
                  Tax Impact Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Estimated tax cost of allowance loss:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {allowanceFormatter.format(results.taxCost)}
                  </span>
                </p>
                <p>
                  Additional relief needed to restore allowance:{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {allowanceFormatter.format(results.marginalReliefNeeded)}
                  </span>
                </p>
                <p>
                  Calculations assume 2025/26 thresholds and a 40% marginal tax rate for lost
                  allowance. Adjust these figures to match your personal circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Track Your Personal Allowance with Ease
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this tool to stay on top of your personal allowance, especially if your income
            fluctuates near the taper threshold. Reviewing figures ahead of the tax year end can help
            you plan pension contributions or Gift Aid to reduce adjusted net income.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Manage Adjusted Net Income Proactively
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Adding to pensions or making charitable donations can reclaim personal allowance and
            reduce overall tax. Experiment with different relief values to see how quickly the
            allowance restores.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Document Marriage Allowance Changes
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Marriage Allowance transfers affect both partners. Make sure you record HMRC approvals
            and understand whether you are receiving or surrendering part of your allowance each tax
            year.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
