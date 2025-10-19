import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, PiggyBank, LineChart, Quote, BookOpen } from 'lucide-react';

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
  'annuity calculator',
  'best annuity calculator',
  'variable annuity calculator',
  'immediate annuity calculator',
  'deferred annuity calculator',
  'retirement annuity calculator',
  'lump sum annuity calculator',
];

const metaDescription =
  'Plan guaranteed retirement income with the UK annuity calculator. Compare variable, immediate, and deferred annuity outcomes to see how long your pension pot will provide steady income.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/annuity-calculator';
const pagePath = '/calculators/annuity-calculator';
const pageTitle = 'Annuity Calculator | UK Retirement Annuity Planner';

const defaultInputs = {
  annuityPot: '150,000',
  interestRate: '4.25',
  annuityTerm: '20',
};

const annuityFaqs = [
  {
    question: 'How does the annuity calculator estimate my income?',
    answer:
      'The annuity calculator solves the standard annuity formula based on your pension pot, expected return, and term. It produces an even monthly income and shows how much interest you earn throughout the contract.',
  },
  {
    question: 'Are the results aligned with UK annuity products?',
    answer:
      'Yes. It models a level annuity with monthly payments in arrears, mirroring the structure offered by UK insurers. Always compare against live quotes because provider charges and medical underwriting can change the rate.',
  },
  {
    question: 'What if I want inflation protection or escalating income?',
    answer:
      'Escalating and inflation-linked annuities typically pay less upfront. You can model them by reducing the interest rate assumption or shortening the term to reflect a more cautious projection.',
  },
];

const emotionalMessage =
  'Securing a predictable income lets you enjoy retirement without second-guessing every treat. Give your future self the confidence that bills and bucket-list moments are both covered.';

const emotionalQuote = {
  text: 'The goal isn’t more money. The goal is living life on your terms.',
  author: 'Chris Brogan',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function calculateAnnuity(pot, annualRatePercent, termYears) {
  if (pot <= 0 || annualRatePercent < 0 || termYears <= 0) {
    return null;
  }

  const totalPayments = Math.round(termYears * 12);
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyIncome = 0;
  if (monthlyRate === 0) {
    monthlyIncome = pot / totalPayments;
  } else {
    const factor = 1 - Math.pow(1 + monthlyRate, -totalPayments);
    monthlyIncome = pot * (monthlyRate / factor);
  }

  const yearlyAggregation = [];
  let balance = pot;
  let totalInterest = 0;

  for (let month = 1; month <= totalPayments; month += 1) {
    const interest = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const capital = monthlyIncome - interest;
    balance = Math.max(balance - capital, 0);
    totalInterest += interest;

    const yearIndex = Math.ceil(month / 12);
    if (!yearlyAggregation[yearIndex - 1]) {
      yearlyAggregation[yearIndex - 1] = {
        year: yearIndex,
        income: 0,
        capital: 0,
        interest: 0,
        balance: 0,
      };
    }

    yearlyAggregation[yearIndex - 1].income += monthlyIncome;
    yearlyAggregation[yearIndex - 1].capital += capital;
    yearlyAggregation[yearIndex - 1].interest += interest;
    yearlyAggregation[yearIndex - 1].balance = balance;
  }

  const annualIncome = monthlyIncome * 12;
  const totalPaid = monthlyIncome * totalPayments;

  return {
    pot,
    monthlyIncome,
    annualIncome,
    totalPaid,
    totalInterest,
    termYears,
    yearlySchedule: yearlyAggregation,
  };
}

export default function AnnuityCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Annuity Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Pensions & Retirement Calculators', url: '/calculators#pensions-retirement' },
      { name: 'Annuity Calculator', url: pagePath },
    ],
    faq: annuityFaqs,
  });

  const chartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Capital returned', value: calculation.pot, color: '#0ea5e9' },
      { name: 'Interest earned', value: calculation.totalInterest, color: '#2563eb' },
    ];
  }, [calculation, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const pot = parseNumber(inputs.annuityPot);
    const rate = parseNumber(inputs.interestRate);
    const term = parseNumber(inputs.annuityTerm);

    const result = calculateAnnuity(pot, rate, term);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const header = ['Year', 'Income (£)', 'Capital returned (£)', 'Interest earned (£)', 'Balance (£)'];
    const rows = result.yearlySchedule.map((year) => [
      year.year,
      formatCurrency(year.income),
      formatCurrency(year.capital),
      formatCurrency(year.interest),
      formatCurrency(year.balance),
    ]);
    setCsvData([header, ...rows]);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
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
                Annuity Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Model level annuity income with UK assumptions and build confidence that your pension pot will
              last. Compare annuity rates, explore immediate versus deferred start dates, and download a clear
              yearly income schedule tailored to your retirement plans.
            </p>
          </header>

          <section className="rounded-xl border border-sky-100 bg-white p-6 shadow-sm dark:border-sky-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Map the retirement you deserve
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
                  <PiggyBank className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Pension pot details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="annuityPot">Pension pot (£)</Label>
                    <Input
                      id="annuityPot"
                      inputMode="decimal"
                      value={inputs.annuityPot}
                      onChange={handleInputChange('annuityPot')}
                      placeholder="e.g. 150,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Expected return (% p.a.)</Label>
                    <Input
                      id="interestRate"
                      inputMode="decimal"
                      value={inputs.interestRate}
                      onChange={handleInputChange('interestRate')}
                      placeholder="e.g. 4.25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="annuityTerm">Income term (years)</Label>
                    <Input
                      id="annuityTerm"
                      inputMode="decimal"
                      value={inputs.annuityTerm}
                      onChange={handleInputChange('annuityTerm')}
                      placeholder="e.g. 20"
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate annuity income
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
                    Enter your pension pot, expected return, and income duration, then press{' '}
                    <span className="font-semibold">Calculate annuity income</span> to see monthly and yearly
                    payments with a downloadable schedule.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please check the entries. The annuity calculator needs a pension pot above zero, a
                    non-negative expected return, and an income term in years.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Guaranteed income snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4 dark:border-sky-900/50 dark:bg-sky-950/40">
                        <p className="text-sm text-sky-900 dark:text-sky-200">Monthly income</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.monthlyIncome)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Annual income</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.annualIncome)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total returned</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalPaid)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Over {calculation.termYears} years of income
                        </p>
                      </div>
                      <div className="rounded-lg border border-sky-100 bg-sky-50/70 p-4 dark:border-sky-900/50 dark:bg-sky-950/40">
                        <p className="text-sm text-sky-900 dark:text-sky-200">Interest generated</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalInterest)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="annuity-income-schedule"
                          title="Annuity calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Capital versus interest
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
                        <ResultBreakdownChart data={chartData} title="Annuity income composition" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Annual income schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        The schedule aggregates your annuity income each year, tracking the amount treated as
                        interest versus the capital being returned.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <tr>
                              <th scope="col" className="px-3 py-2">
                                Year
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Income (£)
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Capital returned (£)
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Interest (£)
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Balance (£)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {calculation.yearlySchedule.map((year) => (
                              <tr key={year.year} className="bg-white odd:bg-slate-50 dark:bg-slate-900 dark:odd:bg-slate-800/60">
                                <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">
                                  Year {year.year}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(year.income)}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(year.capital)}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(year.interest)}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(year.balance)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
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
                Retirement planning tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Blend your annuity income with drawdown and cash reserves so you can support essentials and still
              fund occasional luxuries. Revisit the figures each year and remortgage or switch providers where
              better terms exist.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={annuityFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
