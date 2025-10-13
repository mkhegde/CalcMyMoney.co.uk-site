import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Wallet } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const commissionKeywords = [
  'commission calculator',
  'sales commission calculator',
  'commission pay calculator',
];

const metaDescription =
  'Use our commission calculator to model earnings, compare sales commission calculator tiers, and plan each commission pay calculator scenario before proposal time.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/commission-calculator';

const faqItems = [
  {
    question: 'How do accelerators affect sales commission?',
    answer:
      'Accelerators increase the commission rate once performance passes a sales threshold. Enter your quota or stretch target and the higher accelerator rate to see how much extra earnings you generate above goal.',
  },
  {
    question: 'What is a commission draw and how is it applied?',
    answer:
      'A draw is an advance paid at the start of the period. When commissions are calculated the draw is subtracted from earnings. Use the draw field to see the take-home pay after recovering the advance.',
  },
  {
    question: 'How can I compare monthly vs annual commission?',
    answer:
      'Toggle between monthly and annual sales figures to see the impact on cash flow. If you work on quarterly targets, multiply the monthly output and align it with your payroll schedule so tax planning stays accurate.',
  },
];

const defaultInputs = {
  salesValue: 85000,
  commissionRate: 7,
  acceleratorThreshold: 60000,
  acceleratorRate: 12,
  teamBonusRate: 1.5,
  baseSalary: 2500,
  commissionDraw: 500,
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

export default function CommissionCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(() => {
    const salesValue = Number(inputs.salesValue) || 0;
    const commissionRate = Number(inputs.commissionRate) || 0;
    const acceleratorThreshold = Number(inputs.acceleratorThreshold) || 0;
    const acceleratorRate = Number(inputs.acceleratorRate) || 0;
    const teamBonusRate = Number(inputs.teamBonusRate) || 0;
    const baseSalary = Number(inputs.baseSalary) || 0;
    const commissionDraw = Number(inputs.commissionDraw) || 0;

    const cappedSales = Math.min(salesValue, acceleratorThreshold);
    const acceleratedSales = Math.max(salesValue - acceleratorThreshold, 0);

    const baseCommission = (cappedSales * commissionRate) / 100;
    const acceleratedCommission = (acceleratedSales * acceleratorRate) / 100;
    const grossCommission = baseCommission + acceleratedCommission;

    const teamBonus = (salesValue * teamBonusRate) / 100;
    const netCommission = Math.max(grossCommission - commissionDraw, 0);
    const totalEarnings = netCommission + teamBonus + baseSalary;
    const effectiveRate = salesValue > 0 ? (grossCommission / salesValue) * 100 : 0;

    return {
      salesValue,
      baseCommission,
      acceleratedCommission,
      grossCommission,
      commissionDraw,
      netCommission,
      teamBonus,
      baseSalary,
      totalEarnings,
      effectiveRate,
    };
  }, [inputs]);

  const updateInput = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const resetInputs = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Commission Calculator | Sales Commission Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Commission Calculator | Sales Commission Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Commission Calculator | Sales Commission Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Commission Calculator',
              description: metaDescription,
              keywords: commissionKeywords,
              url: canonicalUrl,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate sales commission',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Commission Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Forecast commission earnings, accelerators, and bonuses with a flexible sales commission
            calculator that keeps you on target.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Sales Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="salesValue" className="text-sm font-medium">
                  Revenue this period (£)
                </Label>
                <Input
                  id="salesValue"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.salesValue}
                  onChange={(event) => updateInput('salesValue', Number(event.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Commission rate
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter.format(inputs.commissionRate)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.commissionRate]}
                    onValueChange={(value) => updateInput('commissionRate', value[0])}
                    min={0}
                    max={40}
                    step={0.25}
                  />
                </div>
                <div>
                  <Label htmlFor="acceleratorThreshold" className="text-sm font-medium">
                    Accelerator threshold (£)
                  </Label>
                  <Input
                    id="acceleratorThreshold"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.acceleratorThreshold}
                    onChange={(event) =>
                      updateInput('acceleratorThreshold', Number(event.target.value))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Accelerator rate
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter.format(inputs.acceleratorRate)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.acceleratorRate]}
                    onValueChange={(value) => updateInput('acceleratorRate', value[0])}
                    min={0}
                    max={50}
                    step={0.5}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Team bonus rate
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter.format(inputs.teamBonusRate)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.teamBonusRate]}
                    onValueChange={(value) => updateInput('teamBonusRate', value[0])}
                    min={0}
                    max={10}
                    step={0.25}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="commissionDraw" className="text-sm font-medium">
                    Recoverable draw (£)
                  </Label>
                  <Input
                    id="commissionDraw"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.commissionDraw}
                    onChange={(event) => updateInput('commissionDraw', Number(event.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="baseSalary" className="text-sm font-medium">
                    Base salary this period (£)
                  </Label>
                  <Input
                    id="baseSalary"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.baseSalary}
                    onChange={(event) => updateInput('baseSalary', Number(event.target.value))}
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
                  <Wallet className="h-5 w-5" />
                  Commission Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Gross commission</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.grossCommission)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Net commission</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.netCommission)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Effective rate</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {percentageFormatter.format(results.effectiveRate)}%
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total earnings</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.totalEarnings)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-slate-600" />
                  Commission Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Base tier
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.baseCommission)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Earned at {percentageFormatter.format(inputs.commissionRate)}% on the first £
                    {inputs.acceleratorThreshold.toLocaleString('en-GB') || 0}.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Accelerator
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.acceleratedCommission)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Applied at {percentageFormatter.format(inputs.acceleratorRate)}% above your
                    threshold, rewarding over-performance.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Bonuses
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.teamBonus)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Team bonus converts to {percentageFormatter.format(inputs.teamBonusRate)}% of
                    revenue for collaborative wins.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Draw recovery
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    -{currencyFormatter.format(results.commissionDraw)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Recoverable draw deducted to keep net commission realistic for payday planning.
                  </p>
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
                Sales commission calculator strategies for every plan
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Test different rates, thresholds, and draws to mirror your compensation plan. The
                sales commission calculator highlights how accelerators and bonuses influence each
                paycheque.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Turning insights into a commission pay calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Share the results with finance or leadership to confirm targets. The commission pay
                calculator makes it simple to model promotions, adjust for seasonal peaks, or check
                that your draw policy supports healthy cash flow.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>
    </div>
  );
}
