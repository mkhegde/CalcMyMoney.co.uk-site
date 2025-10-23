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
import { Calculator, Target, TrendingUp, LineChart, BookOpen } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/savings-goal-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/savings-goal-calculator';
const pageTitle = 'Savings Goal Calculator UK | Time to Target Planner';
const metaDescription =
  'Plan your UK savings goal with monthly contributions and compound interest. Estimate the time to target and interest earned with our savings goal calculator.';
const keywords = getMappedKeywords('Savings Goal Calculator');

const faqItems = [
  {
    question: 'How often should I check my progress?',
    answer:
      'Review progress monthly and adjust contributions after pay rises or expense changes. Re-running the calculator keeps your plan aligned with your cash flow.',
  },
  {
    question: 'What interest rate should I use?',
    answer:
      'Use the rate offered by your savings account or investment. If uncertain, err on the conservative side so you are not relying on high returns to reach the goal.',
  },
  {
    question: 'Can I model contribution increases?',
    answer:
      'Yes. Add an annual contribution increase percentage to reflect automatic savings escalators or expected pay rises.',
  },
];

const emotionalMessage =
  'Give your goal a timeline. When you can see the finish line, sticking to monthly contributions feels effortless and purposeful.';
const emotionalQuote = {
  text: 'A goal without a plan is just a wish.',
  author: 'Antoine de Saint-Exupéry',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const defaultInputs = {
  savingsTarget: '25,000',
  initialDeposit: '5,000',
  monthlyContribution: '450',
  annualInterestRate: '3.5',
  contributionIncreaseRate: '0',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateSavingsGoal = (inputs) => {
  const target = Math.max(parseNumber(inputs.savingsTarget), 0);
  const initialDeposit = Math.max(parseNumber(inputs.initialDeposit), 0);
  const monthlyContribution = Math.max(parseNumber(inputs.monthlyContribution), 0);
  const annualRate = Math.max(parseNumber(inputs.annualInterestRate), 0) / 100;
  const contributionIncreaseRate = Math.max(parseNumber(inputs.contributionIncreaseRate), 0) / 100;

  const monthlyRate = annualRate / 12;
  const monthlyIncrease = contributionIncreaseRate / 12;

  let balance = initialDeposit;
  let months = 0;
  let totalContributions = initialDeposit;
  let interestEarned = 0;
  let currentContribution = monthlyContribution;

  while (balance < target && months < 1200) {
    balance += balance * monthlyRate;
    interestEarned += balance * monthlyRate;
    balance += currentContribution;
    totalContributions += currentContribution;
    currentContribution *= 1 + monthlyIncrease;
    months += 1;
  }

  const years = months / 12;
  const monthlyNeededNoGrowth =
    target > initialDeposit && months > 0 ? (target - initialDeposit) / months : 0;
  const reached = balance >= target;

  return {
    target,
    initialDeposit,
    monthlyContribution,
    annualRate,
    contributionIncreaseRate,
    months,
    years,
    reached,
    balance: reached ? target : balance,
    totalContributions,
    interestEarned,
    monthlyNeededNoGrowth,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;

  return [
    ['Input', 'Value'],
    ['Savings target (£)', inputs.savingsTarget],
    ['Initial deposit (£)', inputs.initialDeposit],
    ['Monthly contribution (£)', inputs.monthlyContribution],
    ['Annual interest rate (%)', `${percentFormatter.format(parseNumber(inputs.annualInterestRate))}%`],
    ['Annual contribution increase (%)', `${percentFormatter.format(parseNumber(inputs.contributionIncreaseRate))}%`],
    [],
    ['Output', 'Value'],
    ['Months to goal', results.reached ? results.months : 'Goal not reached'],
    ['Years to goal', results.reached ? results.years.toFixed(1) : 'Goal not reached'],
    ['Estimated balance (£)', currencyFormatter.format(results.balance)],
    ['Total contributions (£)', currencyFormatter.format(results.totalContributions)],
    ['Interest earned (£)', currencyFormatter.format(results.interestEarned)],
    ['Monthly needed without growth (£)', currencyFormatter.format(results.monthlyNeededNoGrowth)],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  const remainingGap = Math.max(results.target - results.balance, 0);
  return [
    { name: 'Total contributions', value: results.totalContributions, color: '#0ea5e9' },
    { name: 'Interest earned', value: results.interestEarned, color: '#22c55e' },
    { name: 'Remaining gap', value: remainingGap, color: '#f97316' },
  ].filter((segment) => segment.value > 0);
};

export default function SavingsGoalCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Savings Goal Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Savings & Budgeting Calculators', url: '/calculators#savings' },
      { name: 'Savings Goal Calculator', url: pagePath },
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
      const computed = calculateSavingsGoal(inputs);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-600/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Savings Goal Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Set a target, map the contribution schedule, and see how interest accelerates your
              progress towards the finish line.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Target className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-amber-600 dark:text-amber-300"
            borderColor="border-amber-200 dark:border-amber-800/60"
            bgColor="bg-amber-50/70 dark:bg-amber-900/40"
            textColor="text-amber-900 dark:text-amber-100"
            footerColor="text-amber-700 dark:text-amber-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  Goal inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="savingsTarget">Savings target (£)</Label>
                      <Input
                        id="savingsTarget"
                        inputMode="decimal"
                        value={inputs.savingsTarget}
                        onChange={handleInputChange('savingsTarget')}
                        placeholder="e.g. 25,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="initialDeposit">Initial deposit (£)</Label>
                      <Input
                        id="initialDeposit"
                        inputMode="decimal"
                        value={inputs.initialDeposit}
                        onChange={handleInputChange('initialDeposit')}
                        placeholder="e.g. 5,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyContribution">Monthly contribution (£)</Label>
                      <Input
                        id="monthlyContribution"
                        inputMode="decimal"
                        value={inputs.monthlyContribution}
                        onChange={handleInputChange('monthlyContribution')}
                        placeholder="e.g. 450"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualInterestRate">Annual interest rate (%)</Label>
                      <Input
                        id="annualInterestRate"
                        inputMode="decimal"
                        value={inputs.annualInterestRate}
                        onChange={handleInputChange('annualInterestRate')}
                        placeholder="e.g. 3.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contributionIncreaseRate">Annual contribution increase (%)</Label>
                      <Input
                        id="contributionIncreaseRate"
                        inputMode="decimal"
                        value={inputs.contributionIncreaseRate}
                        onChange={handleInputChange('contributionIncreaseRate')}
                        placeholder="e.g. 0"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate savings goal
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
                    Tell us your target, deposit, and monthly contribution, then press
                    <span className="font-semibold"> Calculate savings goal</span> to reveal how long it
                    could take and the interest earned on the way.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-amber-200 bg-white shadow-sm dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Target className="h-5 w-5 text-amber-600 dark:text-amber-200" aria-hidden="true" />
                        Goal summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Months to goal</p>
                        <p className="text-2xl font-semibold">
                          {results.reached ? results.months : 'Goal not reached'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Years to goal</p>
                        <p className="text-2xl font-semibold">
                          {results.reached ? results.years.toFixed(1) : 'Goal not reached'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Estimated balance</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Interest earned</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.interestEarned)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-200">Monthly needed with no growth</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyNeededNoGrowth)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="savings-goal-results"
                          title="Savings Goal Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Progress outlook
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Review the monthly figure with no growth to understand the benefit compound interest
                        delivers. Increasing contributions or boosting the interest rate shortens the journey.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Goal composition
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
                        <ResultBreakdownChart data={chartData} title="Savings goal contribution mix" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Important notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Large monthly increases can make the model optimistic. Revisit the plan regularly and
                        adjust the contribution increase to reflect what you can realistically save.
                      </p>
                      <p>
                        For goals longer than ten years, account for inflation or switch to an investment
                        calculator to capture potential market growth and volatility.
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
</div>
      </CalculatorWrapper>
    </div>
  );
}
