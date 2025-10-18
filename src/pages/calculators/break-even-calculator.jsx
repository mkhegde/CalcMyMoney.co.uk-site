import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, TrendingUp, BarChart2, Building2 } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/break-even-calculator';

const schemaKeywords = [
  'Break Even Formula',
  'Margin Calculation',
  'Revenue',
  'Cost Analysis',
  'Business Planning',
];

const faqItems = [
  {
    question: 'How is the break-even point calculated?',
    answer:
      'Divide fixed costs by contribution margin. Contribution margin equals selling price per unit minus variable cost per unit. The result is the number of units required to cover costs.',
  },
  {
    question: 'Can I use this calculator for service-based businesses?',
    answer:
      'Yes. Replace “units” with billable hours or engagements. Ensure you enter an average selling price and variable cost per hour or engagement.',
  },
  {
    question: 'How do startup costs influence break-even?',
    answer:
      'Startup costs increase total fixed costs in the short term. Once recovered, you can recalculate break-even using ongoing fixed costs to reflect steady-state operations.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function BreakEvenCalculator() {
  const [inputs, setInputs] = useState({
    sellingPrice: '95',
    variableCost: '42',
    monthlyFixedCosts: '18000',
    startupCosts: '7500',
    desiredProfit: '8000',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      sellingPrice: '95',
      variableCost: '42',
      monthlyFixedCosts: '18000',
      startupCosts: '7500',
      desiredProfit: '8000',
    });
  }, []);

  const results = useMemo(() => {
    const sellingPrice = Number(inputs.sellingPrice) || 0;
    const variableCost = Number(inputs.variableCost) || 0;
    const monthlyFixedCosts = Number(inputs.monthlyFixedCosts) || 0;
    const startupCosts = Number(inputs.startupCosts) || 0;
    const desiredProfit = Number(inputs.desiredProfit) || 0;

    const contributionMargin = Math.max(0, sellingPrice - variableCost);
    const totalFixed = monthlyFixedCosts + startupCosts;

    const breakEvenUnits =
      contributionMargin > 0 ? Math.ceil(totalFixed / contributionMargin) : Infinity;
    const breakEvenRevenue =
      contributionMargin > 0 ? breakEvenUnits * sellingPrice : Infinity;

    const profitPointUnits =
      contributionMargin > 0
        ? Math.ceil((totalFixed + desiredProfit) / contributionMargin)
        : Infinity;
    const profitPointRevenue =
      contributionMargin > 0 ? profitPointUnits * sellingPrice : Infinity;

    const marginRatio = sellingPrice > 0 ? contributionMargin / sellingPrice : 0;
    const breakEvenMonthRevenue =
      contributionMargin > 0 ? monthlyFixedCosts / contributionMargin * sellingPrice : Infinity;

    return {
      sellingPrice,
      variableCost,
      monthlyFixedCosts,
      startupCosts,
      desiredProfit,
      contributionMargin,
      totalFixed,
      breakEvenUnits,
      breakEvenRevenue,
      profitPointUnits,
      profitPointRevenue,
      marginRatio,
      breakEvenMonthRevenue,
    };
  }, [inputs]);

  const formattedMargin = (results.marginRatio * 100).toFixed(1);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Break Even Analysis &amp; Profit Point Calculator</title>
        <meta
          name="description"
          content="Break Even Calculator covering fixed costs, variable costs, and contribution margin to show your profit point and revenue targets."
        />
        <meta
          name="keywords"
          content="Break Even Calculator, Fixed Costs, Variable Costs"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Break Even Calculator',
              description:
                'Interactive break even analysis for identifying profit points, margin calculation, revenue goals, and business planning decisions.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Break Even Calculator
          </Heading>
          <p className="text-lg md:text-xl text-blue-100">
            Calculate break even, measure contribution margin, and plan unit sales paths toward profitability while accounting for startup costs.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="sellingPrice" className="text-sm font-medium">
                  Selling price per unit (GBP)
                </Label>
                <Input
                  id="sellingPrice"
                  inputMode="decimal"
                  value={inputs.sellingPrice}
                  onChange={(event) => handleChange('sellingPrice', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="variableCost" className="text-sm font-medium">
                  Variable cost per unit (GBP)
                </Label>
                <Input
                  id="variableCost"
                  inputMode="decimal"
                  value={inputs.variableCost}
                  onChange={(event) => handleChange('variableCost', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyFixedCosts" className="text-sm font-medium">
                  Monthly fixed costs (GBP)
                </Label>
                <Input
                  id="monthlyFixedCosts"
                  inputMode="decimal"
                  value={inputs.monthlyFixedCosts}
                  onChange={(event) => handleChange('monthlyFixedCosts', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="startupCosts" className="text-sm font-medium">
                  Startup / one-off costs (GBP)
                </Label>
                <Input
                  id="startupCosts"
                  inputMode="decimal"
                  value={inputs.startupCosts}
                  onChange={(event) => handleChange('startupCosts', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="desiredProfit" className="text-sm font-medium">
                  Desired monthly profit (GBP)
                </Label>
                <Input
                  id="desiredProfit"
                  inputMode="decimal"
                  value={inputs.desiredProfit}
                  onChange={(event) => handleChange('desiredProfit', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Break-Even Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Contribution margin</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {currencyFormatter.format(results.contributionMargin)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contribution margin %</p>
                    <p className="text-lg font-semibold text-blue-600">
                      {Number.isFinite(results.marginRatio) ? `${formattedMargin}%` : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Break-even units</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {Number.isFinite(results.breakEvenUnits)
                        ? results.breakEvenUnits.toLocaleString('en-GB')
                        : 'Not achievable'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Break-even revenue</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {Number.isFinite(results.breakEvenRevenue)
                        ? currencyFormatter.format(results.breakEvenRevenue)
                        : 'Not achievable'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit point units</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {Number.isFinite(results.profitPointUnits)
                        ? results.profitPointUnits.toLocaleString('en-GB')
                        : 'Not achievable'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Profit point revenue</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {Number.isFinite(results.profitPointRevenue)
                        ? currencyFormatter.format(results.profitPointRevenue)
                        : 'Not achievable'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  Cost Structure
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Total fixed costs (incl. startup):{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalFixed)}
                  </span>
                </p>
                <p>
                  Monthly break-even revenue (excluding startup costs):{' '}
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {Number.isFinite(results.breakEvenMonthRevenue)
                      ? currencyFormatter.format(results.breakEvenMonthRevenue)
                      : 'Not achievable'}
                  </span>
                </p>
                <p>
                  Contribution margin shows how much of each sale goes toward fixed costs and profit.
                  Improving price or reducing variable costs increases profitability faster.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Break Even and Chart Profitability
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Evaluate contribution margin, unit sales, and revenue targets to map out profitability.
            Use these figures to update cash-flow forecasts and align startup costs with realistic
            sales milestones.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Contribution Margin Drives Profitability
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Raising prices or reducing variable costs boosts contribution margin, reducing the number
            of unit sales required to cover fixed expenses. Small percentage improvements can
            dramatically shift your profit point.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Plan Startup Costs within Business Planning
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Add setup and launch expenditure to your cost analysis so investors and stakeholders
            understand how long it takes to recover initial outlay. Updating the calculator as costs
            change keeps your business planning accurate.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
