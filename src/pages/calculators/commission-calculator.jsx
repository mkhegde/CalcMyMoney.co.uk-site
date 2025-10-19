import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, Percent, Wallet, Quote, BookOpen } from 'lucide-react';

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
  'commission calculator',
  'sales commission calculator',
  'commission pay calculator',
  'uk commission calculator',
];

const metaDescription =
  'Plan UK sales commissions with base and accelerator rates. Calculate commission draw recovery, team bonus, and total take-home pay.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/commission-calculator';
const pagePath = '/calculators/commission-calculator';
const pageTitle = 'Commission Calculator | UK Sales Earnings Planner';

const faqItems = [
  {
    question: 'How do sales accelerators work?',
    answer:
      'An accelerator increases the commission rate once you exceed a target or quota. Enter your threshold and higher rate to see how much extra you earn after hitting goal.',
  },
  {
    question: 'What is a draw against commission?',
    answer:
      'A draw is an advance paid at the start of the period. When commission is calculated, the draw is deducted from earnings. Add draws in the calculator to see your true take-home pay.',
  },
  {
    question: 'Can I model team bonuses?',
    answer:
      'Yes. Add a team bonus percentage to reward group performance. It is applied to total sales after individual commission is calculated.',
  },
];

const emotionalMessage =
  'Know your commission upside before every pitch. When you can see exactly what each sale delivers, targets become more than numbers.';

const emotionalQuote = {
  text: 'Success usually comes to those who are too busy to be looking for it.',
  author: 'Henry David Thoreau',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

function calculateCommission({
  salesValue,
  commissionRate,
  acceleratorThreshold,
  acceleratorRate,
  teamBonusRate,
  baseSalary,
  commissionDraw,
}) {
  const sales = parseNumber(salesValue);
  const baseRate = parseNumber(commissionRate) / 100;
  const threshold = parseNumber(acceleratorThreshold);
  const accelRate = parseNumber(acceleratorRate) / 100;
  const teamRate = parseNumber(teamBonusRate) / 100;
  const salary = parseNumber(baseSalary);
  const draw = parseNumber(commissionDraw);

  const cappedSales = Math.min(sales, threshold);
  const acceleratedSales = Math.max(sales - threshold, 0);

  const baseCommission = cappedSales * baseRate;
  const acceleratedCommission = acceleratedSales * Math.max(accelRate, baseRate);
  const totalCommission = baseCommission + acceleratedCommission;
  const teamBonus = sales * teamRate;
  const grossPay = salary + totalCommission + teamBonus;
  const netPay = Math.max(grossPay - draw, 0);

  return {
    baseCommission,
    acceleratedCommission,
    totalCommission,
    teamBonus,
    salary,
    draw,
    grossPay,
    netPay,
    sales,
  };
}

export default function CommissionCalculatorPage() {
  const [inputs, setInputs] = useState({
    salesValue: '85,000',
    commissionRate: '7',
    acceleratorThreshold: '60,000',
    acceleratorRate: '12',
    teamBonusRate: '1.5',
    baseSalary: '2,500',
    commissionDraw: '500',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Commission Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Business & Freelancing Calculators', url: '/calculators#business-freelancing' },
      { name: 'Commission Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Base commission', value: results.baseCommission, color: '#2563eb' },
      { name: 'Accelerated commission', value: results.acceleratedCommission, color: '#22c55e' },
      { name: 'Team bonus', value: results.teamBonus, color: '#f97316' },
      { name: 'Salary', value: results.salary, color: '#0ea5e9' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = calculateCommission(inputs);
    setHasCalculated(true);
    setResults(computed);

    setCsvData([
      ['Sales achieved', currencyFormatter.format(computed.sales)],
      ['Base commission rate', `${percentFormatter.format(parseNumber(inputs.commissionRate))}%`],
      ['Accelerator threshold', currencyFormatter.format(parseNumber(inputs.acceleratorThreshold))],
      ['Accelerator rate', `${percentFormatter.format(parseNumber(inputs.acceleratorRate))}%`],
      ['Team bonus rate', `${percentFormatter.format(parseNumber(inputs.teamBonusRate))}%`],
      ['Base commission', currencyFormatter.format(computed.baseCommission)],
      ['Accelerated commission', currencyFormatter.format(computed.acceleratedCommission)],
      ['Team bonus', currencyFormatter.format(computed.teamBonus)],
      ['Base salary', currencyFormatter.format(computed.salary)],
      ['Commission draw deducted', currencyFormatter.format(computed.draw)],
      ['Gross pay', currencyFormatter.format(computed.grossPay)],
      ['Net pay after draw', currencyFormatter.format(computed.netPay)],
    ]);
  };

  const handleReset = () => {
    setInputs({
      salesValue: '85,000',
      commissionRate: '7',
      acceleratorThreshold: '60,000',
      acceleratorRate: '12',
      teamBonusRate: '1.5',
      baseSalary: '2,500',
      commissionDraw: '500',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  };

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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Commission Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Model commission earnings for UK sales roles with base rates, accelerators, team bonuses,
              and draws. See your expected take-home pay for any sales scenario.
            </p>
          </header>

          <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Connect effort to earnings
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Percent className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  Commission structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="salesValue">Sales achieved (£)</Label>
                      <Input
                        id="salesValue"
                        inputMode="decimal"
                        value={inputs.salesValue}
                        onChange={handleInputChange('salesValue')}
                        placeholder="e.g. 85,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Commission rate (%)</Label>
                      <Input
                        id="commissionRate"
                        inputMode="decimal"
                        value={inputs.commissionRate}
                        onChange={handleInputChange('commissionRate')}
                        placeholder="e.g. 7"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="acceleratorThreshold">Accelerator threshold (£)</Label>
                      <Input
                        id="acceleratorThreshold"
                        inputMode="decimal"
                        value={inputs.acceleratorThreshold}
                        onChange={handleInputChange('acceleratorThreshold')}
                        placeholder="e.g. 60,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="acceleratorRate">Accelerator rate (%)</Label>
                      <Input
                        id="acceleratorRate"
                        inputMode="decimal"
                        value={inputs.acceleratorRate}
                        onChange={handleInputChange('acceleratorRate')}
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="teamBonusRate">Team bonus rate (%)</Label>
                      <Input
                        id="teamBonusRate"
                        inputMode="decimal"
                        value={inputs.teamBonusRate}
                        onChange={handleInputChange('teamBonusRate')}
                        placeholder="e.g. 1.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="baseSalary">Base salary (£)</Label>
                      <Input
                        id="baseSalary"
                        inputMode="decimal"
                        value={inputs.baseSalary}
                        onChange={handleInputChange('baseSalary')}
                        placeholder="e.g. 2,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="commissionDraw">Commission draw (£)</Label>
                      <Input
                        id="commissionDraw"
                        inputMode="decimal"
                        value={inputs.commissionDraw}
                        onChange={handleInputChange('commissionDraw')}
                        placeholder="e.g. 500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate commission
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
                    Enter sales performance and commission structure, then press{' '}
                    <span className="font-semibold">Calculate commission</span> to view your earnings
                    breakdown.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-blue-200 bg-white shadow-sm dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-200" aria-hidden="true" />
                        Earnings summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Base commission</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.baseCommission)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Accelerated commission</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.acceleratedCommission)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Team bonus</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.teamBonus)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Gross pay (inc. salary)</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossPay)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Draw deducted</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.draw)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-900 dark:text-blue-200">Net pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netPay)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="commission-calculator-results"
                          title="Commission calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                        Earnings breakdown
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
                        <ResultBreakdownChart data={chartData} title="Commission component mix" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Fine-tune your commission plan
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Use these figures in negotiations, agree fair accelerators, and align team bonuses with
              company objectives so everyone benefits from growth.
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

