import React, { Suspense, useMemo, useState } from 'react';
import { Baby, Calculator, AlertCircle, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = [
  'child benefit calculator',
  'child benefit calculator 2024',
  'child benefit',
  'child tax benefit calculator',
];

const metaDescription =
  'Estimate weekly, monthly, and annual UK Child Benefit, including the High Income Child Benefit Charge. Check how much you keep in 2024/25 with our Child Benefit calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/child-benefit-calculator';
const pagePath = '/calculators/child-benefit-calculator';
const pageTitle = 'Child Benefit Calculator | UK Child Benefit 2024';

const FIRST_CHILD_WEEKLY = 25.6;
const ADDITIONAL_CHILD_WEEKLY = 16.95;
const LOWER_THRESHOLD = 50000;
const UPPER_THRESHOLD = 60000;

const faqItems = [
  {
    question: 'How much Child Benefit is paid per child in 2024/25?',
    answer:
      'The weekly rate is £25.60 for the eldest or only child and £16.95 for each additional child. Multiply by 52 to get the annual total. This calculator applies those rates automatically.',
  },
  {
    question: 'What is the High Income Child Benefit Charge?',
    answer:
      'If the higher-earning partner earns over £50,000, HMRC charges back 1% of Child Benefit for every £100 of income above the threshold. At £60,000 the charge equals the entire benefit. Enter both incomes to see the impact.',
  },
  {
    question: 'Should I still claim Child Benefit if I expect to repay it?',
    answer:
      'Yes. Claiming protects your National Insurance credits and maintains your State Pension record. You can choose to receive payments and repay the charge via self assessment, or opt out of payments while keeping the claim live.',
  },
];

const emotionalMessage =
  'Child Benefit can be a lifeline during the early years. Knowing what will arrive each month helps you focus on memories, not money worries.';

const emotionalQuote = {
  text: 'There is no such thing as a perfect parent. So just be a real one.',
  author: 'Sue Atkins',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function computeChildBenefit(childrenInput, incomeInput, partnerIncomeInput) {
  const children = Math.max(parseNumber(childrenInput), 0);
  const income = Math.max(parseNumber(incomeInput), 0);
  const partnerIncome = Math.max(parseNumber(partnerIncomeInput), 0);

  if (children <= 0) {
    return {
      weeklyBenefit: 0,
      monthlyBenefit: 0,
      annualBenefit: 0,
      charge: 0,
      netAnnual: 0,
      netMonthly: 0,
      netWeekly: 0,
      chargeRate: 0,
      highestIncome: Math.max(income, partnerIncome),
    };
  }

  const weeklyBenefit = FIRST_CHILD_WEEKLY + Math.max(children - 1, 0) * ADDITIONAL_CHILD_WEEKLY;
  const annualBenefit = weeklyBenefit * 52;
  const monthlyBenefit = annualBenefit / 12;
  const highestIncome = Math.max(income, partnerIncome);

  let chargeRate = 0;
  if (highestIncome > LOWER_THRESHOLD) {
    chargeRate = (highestIncome - LOWER_THRESHOLD) / (UPPER_THRESHOLD - LOWER_THRESHOLD);
    chargeRate = Math.min(Math.max(chargeRate, 0), 1);
  }

  const charge = annualBenefit * chargeRate;
  const netAnnual = Math.max(annualBenefit - charge, 0);

  return {
    weeklyBenefit,
    monthlyBenefit,
    annualBenefit,
    charge,
    netAnnual,
    netMonthly: netAnnual / 12,
    netWeekly: netAnnual / 52,
    chargeRate,
    highestIncome,
  };
}

export default function ChildBenefitCalculatorPage() {
  const [childrenCount, setChildrenCount] = useState('1');
  const [income, setIncome] = useState('0');
  const [partnerIncome, setPartnerIncome] = useState('0');
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Child Benefit Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Family & Lifestyle', url: '/calculators#family' },
      { name: 'Child Benefit Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Annual benefit retained', value: calculation.netAnnual, color: '#2563eb' },
      { name: 'High income charge', value: calculation.charge, color: '#f97316' },
    ].filter((item) => item.value > 0);
  }, [calculation, hasCalculated]);

  const incomeMessage = useMemo(() => {
    if (!calculation) return '';
    if (calculation.highestIncome <= LOWER_THRESHOLD) {
      return 'No High Income Child Benefit Charge applies.';
    }
    if (calculation.highestIncome >= UPPER_THRESHOLD) {
      return 'Charge equals 100% of the benefit. You can opt out of payments to avoid repayments.';
    }
    const percent = (calculation.chargeRate * 100).toFixed(1);
    return `Charge claws back ${percent}% of your Child Benefit.`;
  }, [calculation]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = computeChildBenefit(childrenCount, income, partnerIncome);
    setHasCalculated(true);
    setCalculation(result);

    const csvRows = [
      ['Metric', 'Value'],
      ['Weekly Child Benefit', formatCurrency(result.weeklyBenefit)],
      ['Monthly Child Benefit', formatCurrency(result.monthlyBenefit)],
      ['Annual Child Benefit', formatCurrency(result.annualBenefit)],
      ['High income charge', formatCurrency(result.charge)],
      ['Net annual benefit', formatCurrency(result.netAnnual)],
      ['Net monthly benefit', formatCurrency(result.netMonthly)],
      ['Net weekly benefit', formatCurrency(result.netWeekly)],
      ['Highest household income', formatCurrency(result.highestIncome)],
      ['Charge rate', `${(result.chargeRate * 100).toFixed(1)}%`],
    ];
    setCsvData(csvRows);
  };

  const handleReset = () => {
    setChildrenCount('1');
    setIncome('0');
    setPartnerIncome('0');
    setCalculation(null);
    setCsvData(null);
    setHasCalculated(false);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Child Benefit Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work out how much Child Benefit you will receive and whether the High Income Child Benefit Charge will
              apply. Update the figures whenever incomes change so you avoid unexpected tax bills.
            </p>
          </header>

          <section className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:border-sky-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Make every family pound count
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

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Baby className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Household details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="childrenCount">Number of children</Label>
                    <Input
                      id="childrenCount"
                      inputMode="numeric"
                      value={childrenCount}
                      onChange={(event) => setChildrenCount(event.target.value)}
                      placeholder="e.g. 2"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="income">Higher earner income (£)</Label>
                      <Input
                        id="income"
                        inputMode="decimal"
                        value={income}
                        onChange={(event) => setIncome(event.target.value)}
                        placeholder="e.g. 52,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="partnerIncome">Second partner income (£)</Label>
                      <Input
                        id="partnerIncome"
                        inputMode="decimal"
                        value={partnerIncome}
                        onChange={(event) => setPartnerIncome(event.target.value)}
                        placeholder="e.g. 28,000"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Child Benefit
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
                <Card className="border border-dashed border-slate-300 bg-white/50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter the number of children and both incomes, then press{' '}
                    <span className="font-semibold">Calculate Child Benefit</span> to see weekly, monthly, and annual
                    payments alongside any High Income Child Benefit Charge.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calculator className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Benefit summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Weekly benefit</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.weeklyBenefit)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Annual benefit</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.annualBenefit)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">High income charge</p>
                        <p className="text-2xl font-semibold text-red-600 dark:text-red-300">
                          {formatCurrency(calculation.charge)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Net annual benefit</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.netAnnual)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="child-benefit-results"
                          title="Child Benefit calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-amber-200 bg-amber-50 text-amber-900 shadow-sm dark:border-amber-900 dark:bg-amber-900/40 dark:text-amber-100">
                    <CardContent className="flex items-start gap-3">
                      <AlertCircle className="mt-1 h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      <div className="space-y-1 text-sm">
                        <p className="font-medium">Charge guidance</p>
                        <p>{incomeMessage}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Baby className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Benefit versus charge
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
                        <ResultBreakdownChart data={chartData} title="Child Benefit net outcome" />
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
                Child Benefit planning tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Update HMRC when your family changes, consider pension contributions to reduce adjusted net income,
              and keep records of claim dates to maintain National Insurance credits. This calculator gives a quick
              view, but always check with HMRC for complex cases.
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
