import React, { useMemo, useState, useCallback, Suspense } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  PieChart,
  Target,
  Wallet,
  PiggyBank,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/personal-finance-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/personal-finance-calculator';
const pageTitle = 'Personal Finance Calculator UK | Budget Planner & Tracker';
const metaDescription =
  'Use our UK personal finance calculator as a budget planner and tracker to map income, expenses, and savings goals. Manage your money with confidence.';
const keywords = getMappedKeywords('Personal Finance Calculator');

const incomeFields = [
  { key: 'primaryIncome', label: 'Primary monthly income', placeholder: 'e.g. 4,200' },
  { key: 'secondaryIncome', label: 'Partner or secondary income', placeholder: 'e.g. 1,500' },
  { key: 'otherIncome', label: 'Other income & side hustles', placeholder: 'e.g. 350' },
];

const expenseFields = [
  { key: 'housing', label: 'Housing & mortgage', type: 'needs', placeholder: 'e.g. 1,450' },
  { key: 'utilities', label: 'Utilities & council tax', type: 'needs', placeholder: 'e.g. 280' },
  { key: 'groceries', label: 'Groceries & essentials', type: 'needs', placeholder: 'e.g. 520' },
  { key: 'transport', label: 'Transport & commuting', type: 'needs', placeholder: 'e.g. 240' },
  { key: 'insurance', label: 'Insurance & protection', type: 'needs', placeholder: 'e.g. 160' },
  { key: 'debt', label: 'Debt repayments', type: 'obligations', placeholder: 'e.g. 420' },
  { key: 'childcare', label: 'Childcare & education', type: 'needs', placeholder: 'e.g. 360' },
  { key: 'lifestyle', label: 'Lifestyle & leisure', type: 'wants', placeholder: 'e.g. 480' },
  {
    key: 'subscriptions',
    label: 'Subscriptions & entertainment',
    type: 'wants',
    placeholder: 'e.g. 120',
  },
  { key: 'giving', label: 'Giving & gifts', type: 'wants', placeholder: 'e.g. 90' },
];

const defaultInputs = {
  primaryIncome: '4,200',
  secondaryIncome: '1,500',
  otherIncome: '350',
  housing: '1,450',
  utilities: '280',
  groceries: '520',
  transport: '240',
  insurance: '160',
  debt: '420',
  childcare: '360',
  lifestyle: '480',
  subscriptions: '120',
  giving: '90',
  emergencyFundTarget: '12,000',
  currentEmergencyFund: '4,200',
  debtBalance: '7,800',
  debtRate: '5.5',
  targetInvestmentReturn: '6',
  savingsAllocation: '45',
};

const personalFinanceFaqs = [
  {
    question: 'How often should I review my personal finance plan?',
    answer:
      'Check in weekly for spending drift and complete a full monthly review to rebalance categories. Update income, expenses, and savings priorities every quarter or whenever a major life event occurs.',
  },
  {
    question: 'What percentage of income should go toward savings?',
    answer:
      'Aim for 20% of net income as a baseline. Increase that figure when bonuses arrive or high-interest debt is cleared, and reduce it temporarily if essentials spike to avoid relying on credit.',
  },
  {
    question: 'How can I stay motivated to track my money?',
    answer:
      'Automate the updates by connecting bank feeds where possible, schedule short finance check-ins, and celebrate milestones like reaching a new savings buffer or paying off a debt balance.',
  },
];

const emotionalMessage =
  'Taking control of your personal finances empowers you to achieve your dreams. Use this calculator to build a clear budget, track your progress, and make confident financial decisions.';
const emotionalQuote = {
  text: 'A budget is telling your money where to go instead of wondering where it went.',
  author: 'Dave Ramsey',
};

const directoryLinks = [
  {
    url: '/#budgeting-planning',
    label: 'Explore all budgeting & planning calculators',
    description: 'Coordinate spending plans, short-term goals, and day-to-day money decisions.',
  },
  {
    url: '/budget-calculator',
    label: 'Build a monthly budget',
    description: 'Allocate income across bills, savings, and lifestyle categories each month.',
  },
  {
    url: '/savings-goal-calculator',
    label: 'Set your savings goals',
    description: 'Track progress towards your financial milestones.',
  },
];

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

const calculateBudgetSummary = (inputs) => {
  const totalIncome = incomeFields.reduce((sum, field) => sum + parseNumber(inputs[field.key]), 0);

  const totals = expenseFields.reduce(
    (acc, field) => {
      const value = parseNumber(inputs[field.key]);
      acc.total += value;
      if (field.type === 'needs') {
        acc.needs += value;
      } else if (field.type === 'wants') {
        acc.wants += value;
      } else if (field.type === 'obligations') {
        acc.obligations += value;
      }
      return acc;
    },
    { total: 0, needs: 0, wants: 0, obligations: 0 }
  );

  const surplus = totalIncome - totals.total;
  const savingsRate = totalIncome > 0 ? (Math.max(surplus, 0) / totalIncome) * 100 : 0;

  const recommended = {
    needs: totalIncome * 0.5,
    wants: totalIncome * 0.3,
    savings: totalIncome * 0.2,
  };

  return {
    totalIncome,
    totalExpenses: totals.total,
    needs: totals.needs,
    wants: totals.wants,
    obligations: totals.obligations,
    surplus,
    savingsRate,
    recommended,
  };
};

const calculateDebtPayoffMonths = (payment, balance, annualRate) => {
  const monthlyPayment = parseNumber(payment);
  const remainingBalance = parseNumber(balance);
  if (remainingBalance <= 0) return 0;
  if (monthlyPayment <= 0) return Infinity;

  const monthlyRate = parseNumber(annualRate) / 100 / 12;
  if (monthlyRate === 0) {
    return Math.ceil(remainingBalance / monthlyPayment);
  }

  const denominator = monthlyPayment - monthlyRate * remainingBalance;
  if (denominator <= 0) {
    return Infinity;
  }

  const months = Math.log(monthlyPayment / denominator) / Math.log(1 + monthlyRate);
  return Math.max(Math.ceil(months), 0);
};

const formatMonthsToYears = (months) => {
  if (!Number.isFinite(months) || months === Infinity) return 'N/A';
  if (months <= 0) return 'Achieved';
  const wholeMonths = Math.ceil(months);
  const years = Math.floor(wholeMonths / 12);
  const remainingMonths = wholeMonths % 12;
  if (years === 0) {
    return `${wholeMonths} mo`;
  }
  if (remainingMonths === 0) {
    return `${years} yr`;
  }
  return `${years} yr ${remainingMonths} mo`;
};

function buildCsvData(
  summary,
  goals,
  inputs,
  monthlyEmergencyContribution,
  projectedInvestment,
  monthsToEmergencyFund,
  debtPayoffMonths
) {
  if (!summary) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Total Monthly Income (£)', currencyFormatter.format(summary.totalIncome)],
    ['Total Monthly Expenses (£)', currencyFormatter.format(summary.totalExpenses)],
    ['Monthly Surplus (£)', currencyFormatter.format(summary.surplus)],
    ['Savings Rate (%)', `${summary.savingsRate.toFixed(1)}%`],
    [],
    ['Income Breakdown'],
    ...incomeFields.map((field) => [
      field.label,
      currencyFormatter.format(parseNumber(inputs[field.key])),
    ]),
    [],
    ['Expense Breakdown'],
    ...expenseFields.map((field) => [
      field.label,
      currencyFormatter.format(parseNumber(inputs[field.key])),
    ]),
    [],
    ['Goals & Progress'],
    [
      'Emergency Fund Target (£)',
      currencyFormatter.format(parseNumber(inputs.emergencyFundTarget)),
    ],
    [
      'Current Emergency Fund (£)',
      currencyFormatter.format(parseNumber(inputs.currentEmergencyFund)),
    ],
    [
      'Emergency Fund Gap (£)',
      currencyFormatter.format(
        Math.max(
          parseNumber(inputs.emergencyFundTarget) - parseNumber(inputs.currentEmergencyFund),
          0
        )
      ),
    ],
    ['Monthly Emergency Contribution (£)', currencyFormatter.format(monthlyEmergencyContribution)],
    ['Time to Emergency Fund Target', formatMonthsToYears(monthsToEmergencyFund)],
    ['Outstanding Debt Balance (£)', currencyFormatter.format(parseNumber(inputs.debtBalance))],
    ['Debt Interest Rate (%)', `${inputs.debtRate}%`],
    ['Debt-Free In', formatMonthsToYears(debtPayoffMonths)],
    ['Expected Investment Return (%)', `${inputs.targetInvestmentReturn}%`],
    ['Projected Investment in 10 Years (£)', currencyFormatter.format(projectedInvestment)],
  ];
  return csvRows;
}

function buildChartData(summary) {
  if (!summary) return [];
  return [
    { name: 'Needs', value: summary.needs, color: '#3b82f6' },
    { name: 'Wants', value: summary.wants, color: '#10b981' },
    { name: 'Obligations', value: summary.obligations, color: '#f97316' },
    { name: 'Surplus (Savings)', value: Math.max(summary.surplus, 0), color: '#ef4444' },
  ].filter((segment) => segment.value > 0);
}

export default function PersonalFinanceCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [summaryResults, setSummaryResults] = useState(null);
  const [goalResults, setGoalResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Personal Finance Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting-planning' },
      { name: 'Personal Finance Calculator', url: pagePath },
    ],
    faq: personalFinanceFaqs,
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
      const summary = calculateBudgetSummary(inputs);
      setSummaryResults(summary);

      const monthlySurplus = Math.max(summary.surplus, 0);
      const emergencyGap = Math.max(
        parseNumber(inputs.emergencyFundTarget) - parseNumber(inputs.currentEmergencyFund),
        0
      );
      const monthlyEmergencyContribution =
        monthlySurplus * (parseNumber(inputs.savingsAllocation) / 100);
      const monthsToEmergencyFund =
        monthlyEmergencyContribution > 0 ? emergencyGap / monthlyEmergencyContribution : Infinity;

      const investmentContribution = Math.max(monthlySurplus - monthlyEmergencyContribution, 0);
      const investmentProjectionYears = 10;
      const monthlyReturn = (parseNumber(inputs.targetInvestmentReturn) || 0) / 100 / 12;
      const projectedInvestment =
        investmentContribution <= 0
          ? 0
          : monthlyReturn > 0
            ? investmentContribution *
              (((1 + monthlyReturn) ** (investmentProjectionYears * 12) - 1) / monthlyReturn) *
              (1 + monthlyReturn)
            : investmentContribution * investmentProjectionYears * 12;

      const debtPayoffMonths = calculateDebtPayoffMonths(
        parseNumber(inputs.debt),
        parseNumber(inputs.debtBalance),
        parseNumber(inputs.debtRate)
      );

      setGoalResults({
        monthlySurplus,
        emergencyGap,
        monthlyEmergencyContribution,
        monthsToEmergencyFund,
        investmentContribution,
        projectedInvestment,
        debtPayoffMonths,
      });
      setHasCalculated(true);
      setCsvData(
        buildCsvData(
          summary,
          goalResults,
          inputs,
          monthlyEmergencyContribution,
          projectedInvestment,
          monthsToEmergencyFund,
          debtPayoffMonths
        )
      );
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setHasCalculated(false);
    setSummaryResults(null);
    setGoalResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(summaryResults), [summaryResults]);

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
        jsonLd={schema}
        keywords={keywords}
        articleTags={keywords}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Personal Finance Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Combine budgeting habits with smart financial tactics to monitor income, organized
              spending, and long-term savings decisions in one place.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Wallet className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Monthly Income & Spending Inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Heading
                    as="h3"
                    size="h4"
                    weight="semibold"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    Income
                  </Heading>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {incomeFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label} (£)</Label>
                        <Input
                          id={field.key}
                          inputMode="decimal"
                          value={inputs[field.key]}
                          onChange={handleInputChange(field.key)}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Heading
                    as="h3"
                    size="h4"
                    weight="semibold"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    Expenses
                  </Heading>
                  <div className="grid gap-4 md:grid-cols-2">
                    {expenseFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label} (£)</Label>
                        <Input
                          id={field.key}
                          inputMode="decimal"
                          value={inputs[field.key]}
                          onChange={handleInputChange(field.key)}
                          placeholder={field.placeholder}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button type="button" variant="outline" className="w-full" onClick={handleReset}>
                  Reset to Default Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Savings & Debt Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyFundTarget">Emergency fund target (£)</Label>
                    <Input
                      id="emergencyFundTarget"
                      inputMode="decimal"
                      value={inputs.emergencyFundTarget}
                      onChange={handleInputChange('emergencyFundTarget')}
                      placeholder="e.g. 12,000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentEmergencyFund">Current emergency fund (£)</Label>
                    <Input
                      id="currentEmergencyFund"
                      inputMode="decimal"
                      value={inputs.currentEmergencyFund}
                      onChange={handleInputChange('currentEmergencyFund')}
                      placeholder="e.g. 4,200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtBalance">Outstanding debt balance (£)</Label>
                    <Input
                      id="debtBalance"
                      inputMode="decimal"
                      value={inputs.debtBalance}
                      onChange={handleInputChange('debtBalance')}
                      placeholder="e.g. 7,800"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtRate">Debt interest rate (% APR)</Label>
                    <Input
                      id="debtRate"
                      inputMode="decimal"
                      value={inputs.debtRate}
                      onChange={handleInputChange('debtRate')}
                      placeholder="e.g. 5.5"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savingsAllocation">
                    Share of surplus directed to emergency fund (%)
                  </Label>
                  <Input
                    id="savingsAllocation"
                    inputMode="decimal"
                    value={inputs.savingsAllocation}
                    onChange={handleInputChange('savingsAllocation')}
                    placeholder="e.g. 45"
                  />
                  <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>Emergency {inputs.savingsAllocation}%</span>
                    <span>Investing {100 - parseNumber(inputs.savingsAllocation)}%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetInvestmentReturn">
                    Expected investment return (% p.a.)
                  </Label>
                  <Input
                    id="targetInvestmentReturn"
                    inputMode="decimal"
                    value={inputs.targetInvestmentReturn}
                    onChange={handleInputChange('targetInvestmentReturn')}
                    placeholder="e.g. 6"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Calculate Financial Plan
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your income, expenses, and goals, then press{' '}
                    <span className="font-semibold">Calculate Financial Plan</span> to see your
                    budget overview and goal progress.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && summaryResults && goalResults && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-200" />
                        Budget Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total monthly income
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(summaryResults.totalIncome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total monthly expenses
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(summaryResults.totalExpenses)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Monthly surplus
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(summaryResults.surplus)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Savings rate
                        </p>
                        <p className="text-2xl font-semibold">
                          {summaryResults.savingsRate.toFixed(1)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="personal-finance-plan"
                          title="Personal Finance Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        Spending Ratios vs 50/30/20
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
                        <ResultBreakdownChart data={chartData} title="Spending Ratios" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Target className="h-5 w-5 text-emerald-600 dark:text-emerald-200" />
                        Goal Progress Outlook
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span>Emergency fund gap</span>
                        <span>{currencyFormatter.format(goalResults.emergencyGap)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Monthly to emergency</span>
                        <span>
                          {currencyFormatter.format(goalResults.monthlyEmergencyContribution)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Time to target</span>
                        <span>{formatMonthsToYears(goalResults.monthsToEmergencyFund)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Debt-free in</span>
                        <span>{formatMonthsToYears(goalResults.debtPayoffMonths)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Invested in 10 years</span>
                        <span>{currencyFormatter.format(goalResults.projectedInvestment)}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides a general financial plan based on your inputs.
                        Individual circumstances vary, and unexpected events can impact your
                        finances.
                      </p>
                      <p>
                        For personalized financial advice, consider consulting with a qualified
                        financial advisor.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={personalFinanceFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
