import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Calendar, Clock, TrendingUp, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/yearly-income-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/yearly-income-calculator';
const pageTitle = 'Yearly Income Calculator UK | Convert Hourly to Annual';
const metaDescription =
  'Convert hourly pay, overtime, and bonuses into annual, monthly, weekly, and daily figures with the UK yearly income calculator.';
const keywords = getMappedKeywords('Yearly Income Calculator');

const faqItems = [
  {
    question: 'What if I am not paid for all 52 weeks?',
    answer:
      'Adjust the weeks per year field to reflect unpaid leave or seasonal work. The calculator automatically reduces annual totals when you enter fewer weeks.',
  },
  {
    question: 'How should I include overtime?',
    answer:
      'Enter average weekly overtime hours and the overtime hourly rate. The calculator annualises this and separates base salary from overtime for clarity.',
  },
  {
    question: 'Can I reverse engineer an hourly rate?',
    answer:
      'Yes. Enter your annual salary in the bonus field temporarily and set the hourly rate to zero to see the implied hourly, daily, and weekly figures. Then adjust the inputs to match your real pay mix.',
  },
];

const emotionalMessage =
  'Knowing your true annual income helps you negotiate pay, plan savings, and set realistic budgets. Translate every hour worked into a clear yearly picture.';
const emotionalQuote = {
  text: 'Success is the sum of small efforts, repeated day in and day out.',
  author: 'Robert Collier',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultInputs = {
  hourlyRate: '24',
  hoursPerWeek: '37.5',
  weeksPerYear: '52',
  bonus: '2,500',
  overtimeHours: '5',
  overtimeRate: '30',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateYearlyIncome = (inputs) => {
  const hourlyRate = Math.max(parseNumber(inputs.hourlyRate), 0);
  const hoursPerWeek = Math.max(parseNumber(inputs.hoursPerWeek), 0);
  const weeksPerYear = Math.max(parseNumber(inputs.weeksPerYear), 0);
  const bonus = Math.max(parseNumber(inputs.bonus), 0);
  const overtimeHours = Math.max(parseNumber(inputs.overtimeHours), 0);
  const overtimeRate = Math.max(parseNumber(inputs.overtimeRate), 0);

  const baseAnnual = hourlyRate * hoursPerWeek * weeksPerYear;
  const overtimeAnnual = overtimeHours * overtimeRate * weeksPerYear;
  const totalAnnual = baseAnnual + overtimeAnnual + bonus;
  const monthly = totalAnnual / 12;
  const weekly = weeksPerYear > 0 ? totalAnnual / weeksPerYear : 0;
  const daily = hoursPerWeek > 0 ? weekly / (hoursPerWeek / 5 || 5) : 0;
  const effectiveHourly = hoursPerWeek > 0 && weeksPerYear > 0 ? totalAnnual / (hoursPerWeek * weeksPerYear) : 0;

  return {
    baseAnnual,
    overtimeAnnual,
    bonus,
    totalAnnual,
    monthly,
    weekly,
    daily,
    effectiveHourly,
    weeksPerYear,
    hoursPerWeek,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Hourly rate (£)', inputs.hourlyRate],
    ['Hours per week', inputs.hoursPerWeek],
    ['Weeks per year', inputs.weeksPerYear],
    ['Overtime hours (weekly)', inputs.overtimeHours],
    ['Overtime rate (£)', inputs.overtimeRate],
    ['Bonus (£)', inputs.bonus],
    [],
    ['Output', 'Value'],
    ['Base annual pay (£)', currencyFormatter.format(results.baseAnnual)],
    ['Overtime annual pay (£)', currencyFormatter.format(results.overtimeAnnual)],
    ['Bonus (£)', currencyFormatter.format(results.bonus)],
    ['Total annual pay (£)', currencyFormatter.format(results.totalAnnual)],
    ['Monthly pay (£)', currencyFormatter.format(results.monthly)],
    ['Weekly pay (£)', currencyFormatter.format(results.weekly)],
    ['Daily pay (£)', currencyFormatter.format(results.daily)],
    ['Effective hourly rate (£)', currencyFormatter.format(results.effectiveHourly)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Base salary', value: results.baseAnnual, color: '#0ea5e9' },
    { name: 'Overtime', value: results.overtimeAnnual, color: '#6366f1' },
    { name: 'Bonus', value: results.bonus, color: '#f97316' },
  ].filter((item) => item.value > 0);
};

export default function YearlyIncomeCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Yearly Income Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Salary & Payslip Calculators', url: '/calculators#income' },
      { name: 'Yearly Income Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
      setHasCalculated(false);
      setResults(null);
      setCsvData(null);
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateYearlyIncome(inputs);
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results), [results]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        keywords={keywords}
        articleTags={keywords}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-500/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Yearly Income Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Combine hourly pay, overtime, and bonuses to see annual, monthly, weekly, and daily income
              figures instantly.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<TrendingUp className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-sky-600 dark:text-sky-300"
            borderColor="border-sky-200 dark:border-sky-800/60"
            bgColor="bg-sky-50/70 dark:bg-sky-900/40"
            textColor="text-sky-900 dark:text-sky-50"
            footerColor="text-sky-700 dark:text-sky-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <Card className="border border-sky-200 bg-white dark:border-sky-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Clock className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Pay inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly rate (£)</Label>
                      <Input
                        id="hourlyRate"
                        inputMode="decimal"
                        value={inputs.hourlyRate}
                        onChange={handleInputChange('hourlyRate')}
                        placeholder="e.g. 24"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hoursPerWeek">Hours per week</Label>
                      <Input
                        id="hoursPerWeek"
                        inputMode="decimal"
                        value={inputs.hoursPerWeek}
                        onChange={handleInputChange('hoursPerWeek')}
                        placeholder="e.g. 37.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weeksPerYear">Weeks worked per year</Label>
                      <Input
                        id="weeksPerYear"
                        inputMode="decimal"
                        value={inputs.weeksPerYear}
                        onChange={handleInputChange('weeksPerYear')}
                        placeholder="e.g. 52"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bonus">Annual bonus (£)</Label>
                      <Input
                        id="bonus"
                        inputMode="decimal"
                        value={inputs.bonus}
                        onChange={handleInputChange('bonus')}
                        placeholder="e.g. 2,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeHours">Weekly overtime hours</Label>
                      <Input
                        id="overtimeHours"
                        inputMode="decimal"
                        value={inputs.overtimeHours}
                        onChange={handleInputChange('overtimeHours')}
                        placeholder="e.g. 5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overtimeRate">Overtime hourly rate (£)</Label>
                      <Input
                        id="overtimeRate"
                        inputMode="decimal"
                        value={inputs.overtimeRate}
                        onChange={handleInputChange('overtimeRate')}
                        placeholder="e.g. 30"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate yearly income
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your pay details and press
                    <span className="font-semibold"> Calculate yearly income</span> to see annual, monthly,
                    weekly, and daily results.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-sky-200 bg-white shadow-sm dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-200" aria-hidden="true" />
                        Income summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Annual income</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalAnnual)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Monthly income</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthly)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Weekly income</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weekly)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-100">Effective hourly</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.effectiveHourly)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="yearly-income-calculation"
                          title="Yearly Income Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Pay composition
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Base salary</span>
                        <span>{currencyFormatter.format(results.baseAnnual)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Overtime</span>
                        <span>{currencyFormatter.format(results.overtimeAnnual)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Bonus</span>
                        <span>{currencyFormatter.format(results.bonus)}</span>
                      </div>
                      <p>
                        Totals assume {results.hoursPerWeek} hours per week across {results.weeksPerYear} weeks.
                        Adjust the inputs to match your employment pattern or contract terms.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Income breakdown
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
                        <ResultBreakdownChart data={chartData} title="Annual income composition" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
</div>
      </CalculatorWrapper>
    </div>
  );
}
