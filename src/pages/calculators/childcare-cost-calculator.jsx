import React, { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Baby, Calculator, PiggyBank, Quote, BookOpen } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

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

const keywords = ['childcare cost calculator', 'childcare calculator', 'cost of childcare calculator'];

const metaDescription =
  'Plan nursery, childminder, and wraparound care fees with this UK childcare cost calculator. See the impact of government support on your monthly cash flow.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/childcare-cost-calculator';
const pagePath = '/calculators/childcare-cost-calculator';
const pageTitle = 'Childcare Cost Calculator | UK Childcare Budget Planner';

const defaultInputs = {
  dailyRate: '65',
  daysPerWeek: '4',
  weeksPerYear: '48',
  children: '1',
  monthlyExtras: '45',
  monthlySupport: '0',
};

const faqItems = [
  {
    question: 'Which childcare costs should I include?',
    answer:
      'Include nursery or childminder day rates, the number of days each child attends, wraparound care, meals, clubs, and registration fees. Adding everything gives you a reliable monthly figure.',
  },
  {
    question: 'How do I factor in government support?',
    answer:
      'Enter the monthly value of Tax-Free Childcare, free hours, or employer childcare vouchers in the support field. The calculator subtracts this to show the net cash leaving your account.',
  },
  {
    question: 'Can I model different schedules for each child?',
    answer:
      'This version assumes the same schedule and rate for every child. For different routines, run separate calculations and sum the results, or adjust the daily rate to a blended average.',
  },
];

const emotionalMessage =
  'Childcare spending can feel daunting, but clear numbers replace the worry with actionable plans for work, savings, and support.';

const emotionalQuote = {
  text: 'The days are long, but the years are short.',
  author: 'Gretchen Rubin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
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

function calculateChildcareCosts(inputs) {
  const dailyRate = parseNumber(inputs.dailyRate);
  const daysPerWeek = parseNumber(inputs.daysPerWeek);
  const weeksPerYear = parseNumber(inputs.weeksPerYear);
  const children = parseNumber(inputs.children);
  const monthlyExtras = parseNumber(inputs.monthlyExtras);
  const monthlySupport = parseNumber(inputs.monthlySupport);

  if (dailyRate <= 0 || daysPerWeek <= 0 || weeksPerYear <= 0 || children <= 0) {
    return null;
  }

  const weeklyCost = dailyRate * daysPerWeek * children;
  const annualCareCost = weeklyCost * weeksPerYear;
  const monthlyCareCost = annualCareCost / 12;
  const totalMonthlyCost = Math.max(monthlyCareCost + monthlyExtras - monthlySupport, 0);
  const totalAnnualCost = totalMonthlyCost * 12;
  const netWeeklyCost = weeksPerYear > 0 ? (totalAnnualCost / weeksPerYear) : 0;

  return {
    dailyRate,
    daysPerWeek,
    weeksPerYear,
    children,
    monthlyExtras,
    monthlySupport,
    weeklyCost,
    monthlyCareCost,
    totalMonthlyCost,
    totalAnnualCost,
    netWeeklyCost,
  };
}

export default function ChildcareCostCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Childcare Cost Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Family & Lifestyle', url: '/calculators#family' },
      { name: 'Childcare Cost Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const barChartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      {
        name: 'Monthly costs',
        'Care fees': calculation.monthlyCareCost,
        Extras: calculation.monthlyExtras,
        Support: calculation.monthlySupport * -1,
      },
    ];
  }, [calculation, hasCalculated]);

  const pieChartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Care fees', value: calculation.monthlyCareCost, color: '#ec4899' },
      { name: 'Extras', value: calculation.monthlyExtras, color: '#f97316' },
      { name: 'Support', value: calculation.monthlySupport * -1, color: '#22d3ee' },
    ].filter((item) => item.value > 0);
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
    const result = calculateChildcareCosts(inputs);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const csvRows = [
      ['Metric', 'Value'],
      ['Weekly care cost', formatCurrency(result.weeklyCost)],
      ['Monthly care cost', formatCurrency(result.monthlyCareCost)],
      ['Monthly extras', formatCurrency(result.monthlyExtras)],
      ['Monthly support', formatCurrency(result.monthlySupport)],
      ['Total monthly cost', formatCurrency(result.totalMonthlyCost)],
      ['Total annual cost', formatCurrency(result.totalAnnualCost)],
      ['Net weekly cost', formatCurrency(result.netWeeklyCost)],
    ];

    setCsvData(csvRows);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-pink-600/10 text-pink-700 dark:bg-pink-500/20 dark:text-pink-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Childcare Cost Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate monthly and annual childcare spending, weigh extras, and see how government support offsets
              bills. Update the inputs as your family’s schedule evolves.
            </p>
          </header>

          <section className="rounded-xl border border-pink-100 bg-white p-6 shadow-sm dark:border-pink-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Bring clarity to care planning
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-pink-200 bg-pink-50/70 p-4 text-sm text-pink-900 shadow-sm dark:border-pink-800/60 dark:bg-pink-950/40 dark:text-pink-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-pink-700 dark:text-pink-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Baby className="h-5 w-5 text-pink-600 dark:text-pink-300" aria-hidden="true" />
                  Care schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dailyRate">Daily rate (£)</Label>
                      <Input
                        id="dailyRate"
                        inputMode="decimal"
                        value={inputs.dailyRate}
                        onChange={handleInputChange('dailyRate')}
                        placeholder="e.g. 65"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="daysPerWeek">Days per week</Label>
                      <Input
                        id="daysPerWeek"
                        inputMode="decimal"
                        value={inputs.daysPerWeek}
                        onChange={handleInputChange('daysPerWeek')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeksPerYear">Weeks per year</Label>
                      <Input
                        id="weeksPerYear"
                        inputMode="decimal"
                        value={inputs.weeksPerYear}
                        onChange={handleInputChange('weeksPerYear')}
                        placeholder="e.g. 48"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="children">Number of children</Label>
                      <Input
                        id="children"
                        inputMode="decimal"
                        value={inputs.children}
                        onChange={handleInputChange('children')}
                        placeholder="e.g. 2"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="monthlyExtras">Monthly extras (£)</Label>
                      <Input
                        id="monthlyExtras"
                        inputMode="decimal"
                        value={inputs.monthlyExtras}
                        onChange={handleInputChange('monthlyExtras')}
                        placeholder="e.g. 45"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlySupport">Monthly support (£)</Label>
                      <Input
                        id="monthlySupport"
                        inputMode="decimal"
                        value={inputs.monthlySupport}
                        onChange={handleInputChange('monthlySupport')}
                        placeholder="e.g. 100"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate childcare costs
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
                    Enter the childcare schedule, extras, and support, then press{' '}
                    <span className="font-semibold">Calculate childcare costs</span> to see monthly and annual totals
                    with download options.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please check the inputs. Daily rate, days per week, weeks per year, and number of children must
                    all be greater than zero.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-pink-600 dark:text-pink-300" aria-hidden="true" />
                        Cost summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total monthly cost</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalMonthlyCost)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total annual cost</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalAnnualCost)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Weekly cost per schedule</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.weeklyCost)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Net weekly cost after support</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.netWeeklyCost)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="childcare-cost-results"
                          title="Childcare cost calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-pink-600 dark:text-pink-300" aria-hidden="true" />
                        Monthly cost balance
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
                        <ResultBreakdownChart data={pieChartData} title="Childcare cost composition" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-pink-600 dark:text-pink-300" aria-hidden="true" />
                        Monthly cash flow
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={barChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          <Legend />
                          <Bar dataKey="Care fees" fill="#ec4899" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Extras" fill="#f97316" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Support" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-pink-600 dark:text-pink-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Childcare budgeting tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Check for expanded free hours, spread payments using Tax-Free Childcare, and build a sinking fund for
              school holidays. Revisiting this calculator each term keeps your childcare budget accurate.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row">
            <span>Explore more family and childcare planning tools.</span>
            <Link
              to="/calculators"
              className="inline-flex items-center rounded-lg border border-pink-200 px-4 py-2 font-medium text-pink-700 transition hover:border-pink-400 hover:text-pink-900 dark:border-pink-800 dark:text-pink-300 dark:hover:border-pink-600 dark:hover:text-pink-100"
            >
              Browse calculator directory
            </Link>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}

