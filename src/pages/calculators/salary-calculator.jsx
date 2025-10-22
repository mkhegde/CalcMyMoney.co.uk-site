import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
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
import { Calculator, Calendar, Clock, Coins, BarChart3, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/salary-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/salary-calculator';
const pageTitle = 'Salary Calculator UK | Annual, Monthly & Hourly Pay Breakdown';
const metaDescription =
  'Convert an annual salary into monthly, weekly, and hourly rates with UK salary calculator tools. Include bonuses, overtime, and pension deductions for an accurate pay picture.';
const keywords = getMappedKeywords('Salary Calculator');

const faqItems = [
  {
    question: 'How can I include irregular bonuses?',
    answer:
      'Average bonus payments across the year and enter the total here. Recalculate whenever commissions or bonus structures change to keep your budget accurate.',
  },
  {
    question: 'Does this include pension salary sacrifice?',
    answer:
      'Yes. Toggle the pension contribution type to model percentage or fixed deductions. For true salary sacrifice savings, combine with the salary sacrifice calculator to estimate tax and NI relief.',
  },
  {
    question: 'How should I treat overtime?',
    answer:
      'Enter the typical overtime hours per week and the enhanced hourly rate. The calculator multiplies this across the weeks worked each year so you can compare total remuneration packages.',
  },
];

const emotionalMessage =
  'Bring clarity to your payslip. Understand how each element of your package contributes to take-home pay so you can negotiate with confidence and budget calmly.';
const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const directoryLinks = [
  {
    url: '/#income-tax',
    label: 'Explore salary & tax calculators',
    description: 'Break down PAYE, NI, and student loans for every job offer.',
  },
  {
    url: '/calculators/take-home-pay-calculator',
    label: 'Take-Home Pay Calculator',
    description: 'Project net pay after income tax, National Insurance, and pensions.',
  },
  {
    url: '/calculators/salary-sacrifice-calculator',
    label: 'Salary Sacrifice Calculator',
    description: 'See how pension sacrifice changes tax, NI, and employer top-ups.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultInputs = {
  annualSalary: '42,000',
  weeksPerYear: '52',
  hoursPerWeek: '37.5',
  paidDaysPerWeek: '5',
  bonus: '2,500',
  overtimeHours: '5',
  overtimeRate: '22',
  pensionContribution: '5',
  pensionType: 'percentage',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateSalaryBreakdown = (inputs) => {
  const annualSalary = Math.max(parseNumber(inputs.annualSalary), 0);
  const weeksPerYear = Math.max(parseNumber(inputs.weeksPerYear), 1);
  const hoursPerWeek = Math.max(parseNumber(inputs.hoursPerWeek), 0.1);
  const paidDaysPerWeek = Math.max(parseNumber(inputs.paidDaysPerWeek), 0.1);
  const bonus = Math.max(parseNumber(inputs.bonus), 0);
  const overtimeHours = Math.max(parseNumber(inputs.overtimeHours), 0);
  const overtimeRate = Math.max(parseNumber(inputs.overtimeRate), 0);
  const pensionContribution = Math.max(parseNumber(inputs.pensionContribution), 0);
  const pensionType = inputs.pensionType === 'fixed' ? 'fixed' : 'percentage';

  const overtimeValue = overtimeHours * overtimeRate * weeksPerYear;
  const totalAnnualGross = annualSalary + bonus + overtimeValue;

  const pensionDeduction =
    pensionType === 'percentage'
      ? (totalAnnualGross * pensionContribution) / 100
      : pensionContribution;

  const adjustedAnnual = Math.max(totalAnnualGross - pensionDeduction, 0);

  const monthlyGross = adjustedAnnual / 12;
  const weeklyGross = adjustedAnnual / weeksPerYear;
  const dailyGross = weeklyGross / paidDaysPerWeek;
  const hourlyGross = weeklyGross / hoursPerWeek;

  const baseHourlyRate = annualSalary / (weeksPerYear * hoursPerWeek);
  const hourlyWithExtras = adjustedAnnual / (weeksPerYear * hoursPerWeek);
  const overtimePremium = overtimeRate - baseHourlyRate;

  return {
    annualSalary,
    bonus,
    overtimeHours,
    overtimeRate,
    overtimeValue,
    totalAnnualGross,
    pensionDeduction,
    adjustedAnnual,
    monthlyGross,
    weeklyGross,
    dailyGross,
    hourlyGross,
    baseHourlyRate,
    hourlyWithExtras,
    overtimePremium,
    pensionType,
    pensionContribution,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  return [
    ['Input', 'Value'],
    ['Base annual salary (£)', inputs.annualSalary],
    ['Annual bonus (£)', inputs.bonus],
    ['Weeks worked per year', inputs.weeksPerYear],
    ['Paid days per week', inputs.paidDaysPerWeek],
    ['Hours per week', inputs.hoursPerWeek],
    ['Overtime hours per week', inputs.overtimeHours],
    ['Overtime hourly rate (£)', inputs.overtimeRate],
    [
      'Pension contribution',
      results.pensionType === 'percentage'
        ? `${inputs.pensionContribution}%`
        : currencyFormatter.format(results.pensionContribution),
    ],
    [],
    ['Output', 'Value'],
    ['Total annual gross (£)', currencyFormatter.format(results.totalAnnualGross)],
    ['Pension deduction (£)', currencyFormatter.format(results.pensionDeduction)],
    ['Adjusted annual (£)', currencyFormatter.format(results.adjustedAnnual)],
    ['Monthly gross (£)', currencyFormatter.format(results.monthlyGross)],
    ['Weekly gross (£)', currencyFormatter.format(results.weeklyGross)],
    ['Daily gross (£)', currencyFormatter.format(results.dailyGross)],
    ['Hourly gross (£)', currencyFormatter.format(results.hourlyGross)],
    ['Base hourly rate (£)', currencyFormatter.format(results.baseHourlyRate)],
    ['Overtime value (£)', currencyFormatter.format(results.overtimeValue)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Base salary', value: results.annualSalary, color: '#0ea5e9' },
    { name: 'Bonus', value: results.bonus, color: '#6366f1' },
    { name: 'Overtime earnings', value: results.overtimeValue, color: '#f97316' },
    { name: 'Pension deduction', value: results.pensionDeduction, color: '#22c55e' },
  ].filter((segment) => segment.value > 0);
};

export default function SalaryCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Salary Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Salary & Tax Calculators', url: '/calculators#income-tax' },
      { name: 'Salary Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateSalaryBreakdown(inputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-sky-600/10 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Salary Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Convert between annual, monthly, weekly, daily, and hourly pay. Include bonuses,
              overtime, and pension deductions to understand the full value of your package.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Coins className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-sky-600 dark:text-sky-300"
            borderColor="border-sky-200 dark:border-sky-800/60"
            bgColor="bg-sky-50/70 dark:bg-sky-900/40"
            textColor="text-sky-900 dark:text-sky-100"
            footerColor="text-sky-700 dark:text-sky-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                  Pay inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="annualSalary">Base annual salary (£)</Label>
                      <Input
                        id="annualSalary"
                        inputMode="decimal"
                        value={inputs.annualSalary}
                        onChange={handleInputChange('annualSalary')}
                        placeholder="e.g. 42,000"
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
                      <Label htmlFor="paidDaysPerWeek">Paid days per week</Label>
                      <Input
                        id="paidDaysPerWeek"
                        inputMode="decimal"
                        value={inputs.paidDaysPerWeek}
                        onChange={handleInputChange('paidDaysPerWeek')}
                        placeholder="e.g. 5"
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
                      <Label htmlFor="overtimeHours">Overtime hours per week</Label>
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
                        placeholder="e.g. 22"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionContribution">Pension contribution</Label>
                      <div className="flex gap-2">
                        <Input
                          id="pensionContribution"
                          inputMode="decimal"
                          value={inputs.pensionContribution}
                          onChange={handleInputChange('pensionContribution')}
                          placeholder={inputs.pensionType === 'percentage' ? 'e.g. 5' : 'e.g. 2,000'}
                        />
                        <select
                          value={inputs.pensionType}
                          onChange={(event) =>
                            setInputs((prev) => ({ ...prev, pensionType: event.target.value }))
                          }
                          className="w-32 rounded-md border border-input bg-transparent px-2 text-sm"
                        >
                          <option value="percentage">%</option>
                          <option value="fixed">£</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate salary breakdown
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
                    <span className="font-semibold"> Calculate salary breakdown</span> to see
                    annual, monthly, weekly, and hourly results.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-sky-200 bg-white shadow-sm dark:border-sky-900 dark:bg-sky-900/30 dark:text-sky-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Coins className="h-5 w-5 text-sky-600 dark:text-sky-200" aria-hidden="true" />
                        Salary summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Adjusted annual</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.adjustedAnnual)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Total annual gross</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalAnnualGross)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Monthly gross</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyGross)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Weekly gross</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.weeklyGross)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Daily gross</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.dailyGross)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-sky-900 dark:text-sky-200">Pension deduction</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.pensionDeduction)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="salary-breakdown"
                          title="Salary Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Clock className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Pay rates & extras
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2 text-sm text-slate-600 dark:text-slate-300">
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700 dark:text-slate-100">Hourly base rate</p>
                        <p>{currencyFormatter.format(results.baseHourlyRate)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700 dark:text-slate-100">Hourly incl. extras</p>
                        <p>{currencyFormatter.format(results.hourlyWithExtras)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700 dark:text-slate-100">Overtime annual value</p>
                        <p>{currencyFormatter.format(results.overtimeValue)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700 dark:text-slate-100">Overtime premium per hour</p>
                        <p>{currencyFormatter.format(results.overtimePremium)}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-slate-700 dark:text-slate-100">Annual bonus</p>
                        <p>{currencyFormatter.format(results.bonus)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Package composition
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
                        <ResultBreakdownChart data={chartData} title="Salary package breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-sky-600 dark:text-sky-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Results show gross pay before tax and National Insurance. Combine with the take-home
                        pay calculator to understand net pay after statutory deductions.
                      </p>
                      <p>
                        Pension contributions can be deducted via relief at source or salary sacrifice.
                        Confirm which scheme your employer uses to ensure the figures match your payslip.
                      </p>
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
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
