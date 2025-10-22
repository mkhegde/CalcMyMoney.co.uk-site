import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, TrendingUp, BarChart2, Building2, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = [
  'break even calculator',
  'break even analysis',
  'contribution margin calculator',
  'fixed cost calculator',
];

const metaDescription =
  'Calculate your break-even point in units and sales revenue. Model fixed costs, contribution margin, and target profit to plan pricing or sales pushes.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/break-even-calculator';
const pagePath = '/calculators/break-even-calculator';
const pageTitle = 'Break-Even Calculator | UK Contribution Margin Analysis';

const faqItems = [
  {
    question: 'What is the break-even point?',
    answer:
      'It is the sales volume where total revenue equals total costs. Above the break-even point you make profit, below it you make a loss.',
  },
  {
    question: 'How do I use the contribution margin?',
    answer:
      'Contribution margin equals selling price per unit minus variable cost per unit. It shows how much of each sale contributes to covering fixed costs and profit.',
  },
  {
    question: 'Can I include startup or one-off costs?',
    answer:
      'Yes. Add them to the fixed costs field while you are paying them off. Once covered you can recalculate the on-going break-even point without them.',
  },
];

const emotionalMessage =
  'Knowing the exact sales level you need removes the guesswork from pricing and promotions. Plan your next milestone and track progress with confidence.';

const emotionalQuote = {
  text: 'Plans are nothing; planning is everything.',
  author: 'Dwight D. Eisenhower',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

function calculateBreakEven({
  sellingPrice,
  variableCost,
  monthlyFixedCosts,
  startupCosts,
  desiredProfit,
}) {
  const price = parseNumber(sellingPrice);
  const variable = parseNumber(variableCost);
  const fixed = parseNumber(monthlyFixedCosts);
  const startup = parseNumber(startupCosts);
  const profit = parseNumber(desiredProfit);

  const contributionMargin = price - variable;
  const totalFixed = fixed + startup;

  if (contributionMargin <= 0) {
    return {
      contributionMargin,
      totalFixed,
      breakEvenUnits: 0,
      breakEvenSales: 0,
      profitUnits: 0,
      profitSales: 0,
      marginRatio: 0,
    };
  }

  const breakEvenUnits = totalFixed / contributionMargin;
  const breakEvenSales = breakEvenUnits * price;
  const profitUnits = (totalFixed + profit) / contributionMargin;
  const profitSales = profitUnits * price;
  const marginRatio = contributionMargin / price;

  return {
    contributionMargin,
    totalFixed,
    breakEvenUnits,
    breakEvenSales,
    profitUnits,
    profitSales,
    marginRatio,
  };
}

export default function BreakEvenCalculatorPage() {
  const [inputs, setInputs] = useState({
    sellingPrice: '95',
    variableCost: '42',
    monthlyFixedCosts: '18,000',
    startupCosts: '7,500',
    desiredProfit: '8,000',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Break-Even Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Business & Freelancing Calculators', url: '/calculators#business-freelancing' },
      { name: 'Break-Even Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Fixed & startup costs', value: results.totalFixed, color: '#0ea5e9' },
      { name: 'Contribution margin (per unit)', value: results.contributionMargin, color: '#22c55e' },
      { name: 'Target profit', value: parseNumber(inputs.desiredProfit), color: '#f97316' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated, inputs.desiredProfit]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const buildCsv = (computed) => [
    ['Break-even analysis'],
    ['Selling price per unit', currencyFormatter.format(parseNumber(inputs.sellingPrice))],
    ['Variable cost per unit', currencyFormatter.format(parseNumber(inputs.variableCost))],
    ['Contribution margin per unit', currencyFormatter.format(computed.contributionMargin)],
    ['Margin ratio', `${numberFormatter.format(computed.marginRatio * 100)}%`],
    ['Total fixed costs', currencyFormatter.format(computed.totalFixed)],
    ['Break-even units', numberFormatter.format(computed.breakEvenUnits)],
    ['Break-even sales', currencyFormatter.format(computed.breakEvenSales)],
    ['Units for target profit', numberFormatter.format(computed.profitUnits)],
    ['Sales for target profit', currencyFormatter.format(computed.profitSales)],
  ];

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateBreakEven(inputs);
    setHasCalculated(true);
    setResults(computed);
    setCsvData(buildCsv(computed));
  };

  const handleReset = () => {
    setInputs({
      sellingPrice: '95',
      variableCost: '42',
      monthlyFixedCosts: '18,000',
      startupCosts: '7,500',
      desiredProfit: '8,000',
    });
    const computed = calculateBreakEven({
      sellingPrice: '95',
      variableCost: '42',
      monthlyFixedCosts: '18,000',
      startupCosts: '7,500',
      desiredProfit: '8,000',
    });
    setHasCalculated(true);
    setResults(computed);
    setCsvData(buildCsv(computed));
  };

  useMemo(() => {
    if (!hasCalculated) {
      const computed = calculateBreakEven(inputs);
      setResults(computed);
      setCsvData(buildCsv(computed));
      setHasCalculated(true);
    }
  }, [hasCalculated]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Break-Even Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work out the sales volume needed to cover fixed costs and hit your profit target. Adjust
              pricing, margins, and spending to see how the break-even point shifts.
            </p>
          </header>

          <section className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:border-sky-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Turn targets into action
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-sky-200 bg-sky-50/70 p-4 text-sm text-sky-900 shadow-sm dark:border-sky-800/60 dark:bg-sky-950/40 dark:text-sky-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-sky-700 dark:text-sky-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Business inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling price per unit (£)</Label>
                      <Input
                        id="sellingPrice"
                        inputMode="decimal"
                        value={inputs.sellingPrice}
                        onChange={handleInputChange('sellingPrice')}
                        placeholder="e.g. 95"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="variableCost">Variable cost per unit (£)</Label>
                      <Input
                        id="variableCost"
                        inputMode="decimal"
                        value={inputs.variableCost}
                        onChange={handleInputChange('variableCost')}
                        placeholder="e.g. 42"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyFixedCosts">Monthly fixed costs (£)</Label>
                      <Input
                        id="monthlyFixedCosts"
                        inputMode="decimal"
                        value={inputs.monthlyFixedCosts}
                        onChange={handleInputChange('monthlyFixedCosts')}
                        placeholder="e.g. 18,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="startupCosts">Startup or one-off costs (£)</Label>
                      <Input
                        id="startupCosts"
                        inputMode="decimal"
                        value={inputs.startupCosts}
                        onChange={handleInputChange('startupCosts')}
                        placeholder="e.g. 7,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="desiredProfit">Desired profit (£)</Label>
                      <Input
                        id="desiredProfit"
                        inputMode="decimal"
                        value={inputs.desiredProfit}
                        onChange={handleInputChange('desiredProfit')}
                        placeholder="e.g. 8,000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate break-even
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter pricing, variable, and fixed costs, then press{' '}
                    <span className="font-semibold">Calculate break-even</span> to see the units and
                    revenue required to cover your targets.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-sky-200 bg-white shadow-sm dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-sky-600 dark:text-sky-200" aria-hidden="true" />
                        Break-even summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Contribution margin</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.contributionMargin)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Margin ratio</p>
                        <p className="text-2xl font-semibold">
                          {numberFormatter.format(results.marginRatio * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Break-even units</p>
                        <p className="text-2xl font-semibold">
                          {numberFormatter.format(results.breakEvenUnits)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Break-even sales</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.breakEvenSales)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Units for target profit</p>
                        <p className="text-2xl font-semibold">
                          {numberFormatter.format(results.profitUnits)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Sales for target profit</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.profitSales)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="break-even-analysis"
                          title="Break-even calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart2 className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Cost and profit mix
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart data={chartData} title="Break-even composition" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Make better pricing decisions
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Review fixed costs regularly, test price rises against customer demand, and monitor
              margins when supplier costs move. Re-running your break-even point keeps your growth
              targets grounded in reality.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}


