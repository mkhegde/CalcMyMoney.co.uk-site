import React, { useMemo, useState } from 'react';
import { Calculator, TrendingUp, Layers3, Quote, BookOpen } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart.jsx';

const keywords = [
  'compound interest calculator',
  'daily compound interest calculator',
  'compound interest savings calculator',
  'compound interest calculator with monthly contributions',
];

const metaDescription =
  'Project UK savings growth with compound interest. Model lump sums, monthly contributions, contribution increases, and daily or monthly compounding.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/compound-interest-calculator';
const pagePath = '/calculators/compound-interest-calculator';
const pageTitle = 'Compound Interest Calculator | UK Savings Growth Planner';

const faqItems = [
  {
    question: 'How often should I set the compounding frequency?',
    answer:
      'Match the frequency used by your savings account or investment (monthly, quarterly, or daily). The more frequently interest compounds, the slightly higher your total growth.',
  },
  {
    question: 'Can I model contribution increases each year?',
    answer:
      'Yes. Set the annual contribution increase percentage to simulate boosting monthly payments in line with pay rises or inflation.',
  },
  {
    question: 'Is the interest rate fixed for the whole term?',
    answer:
      'This calculator assumes the same annual interest rate across the projection. Re-run the calculation if you expect rates to change significantly.',
  },
];

const emotionalMessage =
  'Small, consistent contributions turn into life-changing sums with time. Map out your savings plan and stay motivated by seeing the future value.';

const emotionalQuote = {
  text: 'Compound interest is the eighth wonder of the world. He who understands it, earns it.',
  author: 'Albert Einstein',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const frequencyOptions = [
  { value: '1', label: 'Annually' },
  { value: '4', label: 'Quarterly' },
  { value: '12', label: 'Monthly' },
  { value: '365', label: 'Daily' },
];

const defaultInputs = {
  initialDeposit: '7,500',
  monthlyContribution: '350',
  contributionAnnualGrowth: '3',
  annualRate: '6',
  compoundingFrequency: '12',
  years: '15',
};

function buildProjection({
  initialDeposit,
  monthlyContribution,
  contributionAnnualGrowth,
  annualRate,
  compoundingFrequency,
  years,
}) {
  const principal = Math.max(parseNumber(initialDeposit), 0);
  const monthly = Math.max(parseNumber(monthlyContribution), 0);
  const growthRate = Math.max(parseNumber(contributionAnnualGrowth), 0) / 100;
  const rate = Math.max(parseNumber(annualRate), 0) / 100;
  const frequency = Math.max(parseNumber(compoundingFrequency), 1);
  const totalYears = Math.max(parseNumber(years), 0);

  const periodicRate = rate / frequency;
  const contributionPerPeriodBase = (monthly * 12) / frequency;

  let balance = principal;
  let totalContributions = principal;
  const rows = [];

  for (let year = 1; year <= totalYears; year += 1) {
    let contributionThisYear = 0;
    let interestThisYear = 0;
    const contributionFactor = (1 + growthRate) ** (year - 1);
    const contributionPerPeriod = contributionPerPeriodBase * contributionFactor;

    for (let period = 0; period < frequency; period += 1) {
      balance += contributionPerPeriod;
      contributionThisYear += contributionPerPeriod;
      if (periodicRate > 0) {
        const interest = balance * periodicRate;
        balance += interest;
        interestThisYear += interest;
      }
    }

    totalContributions += contributionThisYear;
    rows.push({
      year,
      balance,
      totalContributions,
      interestEarned: balance - totalContributions,
      contributionThisYear,
      interestThisYear,
    });
  }

  return {
    rows,
    finalBalance: balance,
    totalContributions,
    totalInterest: balance - totalContributions,
  };
}

export default function CompoundInterestCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Compound Interest Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Savings & Investments Calculators', url: '/calculators#savings-investments' },
      { name: 'Compound Interest Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Total contributions', value: results.totalContributions, color: '#3b82f6' },
      { name: 'Interest earned', value: results.totalInterest, color: '#10b981' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setInputs((prev) => ({
      ...prev,
      compoundingFrequency: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = buildProjection(inputs);
    setHasCalculated(true);
    setResults(computed);

    const csvRows = [
      ['Year', 'Total balance (£)', 'Total contributions (£)', 'Interest earned (£)'],
      ...computed.rows.map((row) => [
        row.year,
        row.balance,
        row.totalContributions,
        row.interestEarned,
      ]),
    ];

    setCsvData([
      ['Initial deposit', currencyFormatter.format(parseNumber(inputs.initialDeposit))],
      ['Monthly contribution', currencyFormatter.format(parseNumber(inputs.monthlyContribution))],
      ['Contribution increase per year', `${inputs.contributionAnnualGrowth}%`],
      ['Annual interest rate', `${inputs.annualRate}%`],
      ['Compounding frequency (per year)', inputs.compoundingFrequency],
      ['Years invested', inputs.years],
      [],
      ...csvRows,
    ]);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Compound Interest Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Project how lump sums and monthly savings grow with compound interest. Adjust the
              compounding frequency, annual return, and contribution increases to map your savings path.
            </p>
          </header>

          <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Grow your savings with intent
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Savings inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="initialDeposit">Initial deposit (£)</Label>
                      <Input
                        id="initialDeposit"
                        inputMode="decimal"
                        value={inputs.initialDeposit}
                        onChange={handleInputChange('initialDeposit')}
                        placeholder="e.g. 7,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                      <Input
                        id="monthlyContribution"
                        inputMode="decimal"
                        value={inputs.monthlyContribution}
                        onChange={handleInputChange('monthlyContribution')}
                        placeholder="e.g. 350"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contributionAnnualGrowth">Contribution increase per year (%)</Label>
                      <Input
                        id="contributionAnnualGrowth"
                        inputMode="decimal"
                        value={inputs.contributionAnnualGrowth}
                        onChange={handleInputChange('contributionAnnualGrowth')}
                        placeholder="e.g. 3"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRate">Annual interest rate (%)</Label>
                      <Input
                        id="annualRate"
                        inputMode="decimal"
                        value={inputs.annualRate}
                        onChange={handleInputChange('annualRate')}
                        placeholder="e.g. 6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="years">Years invested</Label>
                      <Input
                        id="years"
                        inputMode="numeric"
                        value={inputs.years}
                        onChange={handleInputChange('years')}
                        placeholder="e.g. 15"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Compounding frequency</Label>
                      <Select value={inputs.compoundingFrequency} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate growth
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
                    Enter your savings plan and press{' '}
                    <span className="font-semibold">Calculate growth</span> to see how your balance
                    builds with compound interest.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Investment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Final balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.finalBalance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Total contributions</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalContributions)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Interest earned</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="compound-interest-projection"
                          title="Compound interest calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Contributions vs interest
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBreakdownChart data={chartData} title="Compound interest breakdown" />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Keep your plan on track
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Revisit the calculator every year to adjust contributions, update interest assumptions, and
              stay focused on the milestones that matter.
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

