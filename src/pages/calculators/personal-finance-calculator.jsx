import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PieChart, Target, Wallet, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'personal finance software',
  'financial calculator',
  'budget planner',
  'budgeting software',
  'best personal finance software',
  'personal finance tracker',
  'personal finance management software',
  'financial tool',
  'budget',
  'financial planning tools',
];

const metaDescription =
  'Use our personal finance software as a financial calculator and budget planner to map income, expenses, and savings goals.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/personal-finance-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const incomeFields = [
  { key: 'primaryIncome', label: 'Primary monthly income' },
  { key: 'secondaryIncome', label: 'Partner or secondary income' },
  { key: 'otherIncome', label: 'Other income & side hustles' },
];

const expenseFields = [
  { key: 'housing', label: 'Housing & mortgage', type: 'needs' },
  { key: 'utilities', label: 'Utilities & council tax', type: 'needs' },
  { key: 'groceries', label: 'Groceries & essentials', type: 'needs' },
  { key: 'transport', label: 'Transport & commuting', type: 'needs' },
  { key: 'insurance', label: 'Insurance & protection', type: 'needs' },
  { key: 'debt', label: 'Debt repayments', type: 'obligations' },
  { key: 'childcare', label: 'Childcare & education', type: 'needs' },
  { key: 'lifestyle', label: 'Lifestyle & leisure', type: 'wants' },
  { key: 'subscriptions', label: 'Subscriptions & entertainment', type: 'wants' },
  { key: 'giving', label: 'Giving & gifts', type: 'wants' },
];

const defaultIncome = {
  primaryIncome: 4200,
  secondaryIncome: 1500,
  otherIncome: 350,
};

const defaultExpenses = {
  housing: 1450,
  utilities: 280,
  groceries: 520,
  transport: 240,
  insurance: 160,
  debt: 420,
  childcare: 360,
  lifestyle: 480,
  subscriptions: 120,
  giving: 90,
};

const defaultGoals = {
  emergencyFundTarget: 12000,
  currentEmergencyFund: 4200,
  debtBalance: 7800,
  debtRate: 5.5,
  targetInvestmentReturn: 6,
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

const calculateBudgetSummary = (income, expenses) => {
  const totalIncome = incomeFields.reduce(
    (sum, field) => sum + (Number(income[field.key]) || 0),
    0
  );

  const totals = expenseFields.reduce(
    (acc, field) => {
      const value = Number(expenses[field.key]) || 0;
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
  const monthlyPayment = Number(payment) || 0;
  const remainingBalance = Number(balance) || 0;
  if (remainingBalance <= 0) return 0;
  if (monthlyPayment <= 0) return Infinity;

  const monthlyRate = (Number(annualRate) || 0) / 100 / 12;
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
  if (!Number.isFinite(months) || months === Infinity) return 'n/a';
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

export default function PersonalFinanceCalculatorPage() {
  const [income, setIncome] = useState(defaultIncome);
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [goals, setGoals] = useState(defaultGoals);
  const [savingsAllocation, setSavingsAllocation] = useState(45);

  const summary = useMemo(
    () => calculateBudgetSummary(income, expenses),
    [income, expenses]
  );

  const monthlySurplus = Math.max(summary.surplus, 0);
  const emergencyGap = Math.max(goals.emergencyFundTarget - goals.currentEmergencyFund, 0);
  const monthlyEmergencyContribution = monthlySurplus * (savingsAllocation / 100);
  const monthsToEmergencyFund =
    monthlyEmergencyContribution > 0 ? emergencyGap / monthlyEmergencyContribution : Infinity;

  const investmentContribution = Math.max(monthlySurplus - monthlyEmergencyContribution, 0);
  const investmentProjectionYears = 10;
  const monthlyReturn = (Number(goals.targetInvestmentReturn) || 0) / 100 / 12;
  const projectedInvestment =
    investmentContribution <= 0
      ? 0
      : monthlyReturn > 0
      ? investmentContribution *
        (((1 + monthlyReturn) ** (investmentProjectionYears * 12) - 1) / monthlyReturn) *
        (1 + monthlyReturn)
      : investmentContribution * investmentProjectionYears * 12;

  const debtPayoffMonths = calculateDebtPayoffMonths(
    expenses.debt,
    goals.debtBalance,
    goals.debtRate
  );

  const needsPercent =
    summary.totalIncome > 0 ? (summary.needs / summary.totalIncome) * 100 : 0;
  const wantsPercent =
    summary.totalIncome > 0 ? (summary.wants / summary.totalIncome) * 100 : 0;
  const obligationsPercent =
    summary.totalIncome > 0 ? (summary.obligations / summary.totalIncome) * 100 : 0;
  const savingsPercent =
    summary.totalIncome > 0 ? (Math.max(summary.surplus, 0) / summary.totalIncome) * 100 : 0;

  const resetAll = () => {
    setIncome(defaultIncome);
    setExpenses(defaultExpenses);
    setGoals(defaultGoals);
    setSavingsAllocation(45);
  };

  return (
    <div className="bg-gray-950 text-white">
      <Helmet>
        <title>Personal Finance Calculator | Financial Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Personal Finance Calculator | Financial Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Personal Finance Calculator | Financial Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Personal Finance Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan your monthly budget with personal finance software insights',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Personal Finance Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Combine budgeting software habits with the best personal finance software tactics to
            monitor income, organised spending, and long-term savings decisions in one place.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  Monthly income and spending inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Heading as="h3" size="h4" weight="semibold" className="text-slate-900 dark:text-slate-100">
                    Income
                  </Heading>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {incomeFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                          id={field.key}
                          type="number"
                          min="0"
                          step="50"
                          inputMode="decimal"
                          value={income[field.key]}
                          onChange={(event) =>
                            setIncome((prev) => ({
                              ...prev,
                              [field.key]: Number(event.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Heading as="h3" size="h4" weight="semibold" className="text-slate-900 dark:text-slate-100">
                    Expenses
                  </Heading>
                  <div className="grid gap-4 md:grid-cols-2">
                    {expenseFields.map((field) => (
                      <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key}>{field.label}</Label>
                        <Input
                          id={field.key}
                          type="number"
                          min="0"
                          step="10"
                          inputMode="decimal"
                          value={expenses[field.key]}
                          onChange={(event) =>
                            setExpenses((prev) => ({
                              ...prev,
                              [field.key]: Number(event.target.value) || 0,
                            }))
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to default plan
                </Button>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Target className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Savings and debt goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="emergencyFundTarget">Emergency fund target (£)</Label>
                    <Input
                      id="emergencyFundTarget"
                      type="number"
                      min="0"
                      step="500"
                      inputMode="decimal"
                      value={goals.emergencyFundTarget}
                      onChange={(event) =>
                        setGoals((prev) => ({
                          ...prev,
                          emergencyFundTarget: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentEmergencyFund">Current emergency fund (£)</Label>
                    <Input
                      id="currentEmergencyFund"
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={goals.currentEmergencyFund}
                      onChange={(event) =>
                        setGoals((prev) => ({
                          ...prev,
                          currentEmergencyFund: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtBalance">Outstanding debt balance (£)</Label>
                    <Input
                      id="debtBalance"
                      type="number"
                      min="0"
                      step="100"
                      inputMode="decimal"
                      value={goals.debtBalance}
                      onChange={(event) =>
                        setGoals((prev) => ({
                          ...prev,
                          debtBalance: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtRate">Debt interest rate (% APR)</Label>
                    <Input
                      id="debtRate"
                      type="number"
                      min="0"
                      step="0.1"
                      inputMode="decimal"
                      value={goals.debtRate}
                      onChange={(event) =>
                        setGoals((prev) => ({
                          ...prev,
                          debtRate: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="savingsAllocation">
                    Share of surplus directed to emergency fund (%)
                  </Label>
                  <Slider
                    id="savingsAllocation"
                    className="mt-3"
                    value={[Number(savingsAllocation)]}
                    onValueChange={(value) => setSavingsAllocation(Math.round(value[0]))}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>Emergency {savingsAllocation}%</span>
                    <span>Investing {100 - savingsAllocation}%</span>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="targetInvestmentReturn">Expected investment return (% p.a.)</Label>
                    <Input
                      id="targetInvestmentReturn"
                      type="number"
                      min="0"
                      step="0.1"
                      inputMode="decimal"
                      value={goals.targetInvestmentReturn}
                      onChange={(event) =>
                        setGoals((prev) => ({
                          ...prev,
                          targetInvestmentReturn: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Budget overview
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total monthly income</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(summary.totalIncome)}
                  </p>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-800">
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total monthly expenses</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(summary.totalExpenses)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Monthly surplus</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(summary.surplus)}
                  </p>
                </div>
                <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 text-center dark:border-emerald-800 dark:bg-emerald-900/30">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Savings rate</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {savingsPercent.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Spending ratios vs 50/30/20
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Needs</span>
                  <span>
                    {currencyFormatter.format(summary.needs)} ({needsPercent.toFixed(1)}%) · target{' '}
                    {currencyFormatter.format(summary.recommended.needs)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Wants</span>
                  <span>
                    {currencyFormatter.format(summary.wants)} ({wantsPercent.toFixed(1)}%) · target{' '}
                    {currencyFormatter.format(summary.recommended.wants)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Debt commitments</span>
                  <span>
                    {currencyFormatter.format(summary.obligations)} ({obligationsPercent.toFixed(1)}
                    %)
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-800 dark:bg-emerald-900/30">
                  <span>Available for savings</span>
                  <span>
                    {currencyFormatter.format(monthlySurplus)} ({savingsPercent.toFixed(1)}%) ·
                    target {currencyFormatter.format(summary.recommended.savings)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Goal progress outlook
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Emergency fund gap</span>
                  <span>{currencyFormatter.format(emergencyGap)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Monthly to emergency</span>
                  <span>{currencyFormatter.format(monthlyEmergencyContribution)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Time to target</span>
                  <span>{formatMonthsToYears(monthsToEmergencyFund)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Debt-free in</span>
                  <span>{formatMonthsToYears(debtPayoffMonths)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Invested in 10 years</span>
                  <span>{currencyFormatter.format(projectedInvestment)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Personal finance tracker strategies
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat this dashboard like personal finance management software that highlights
                upcoming cash flow pressure points. The view doubles as a financial tool so you can
                monitor every budget line and direct savings with confidence.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Activate financial planning tools today
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Update the figures weekly to keep your budget realistic, then layer on automations
                from other financial planning tools to stay consistent when life gets busy.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white py-12 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={personalFinanceFaqs} />
        </div>
      </section>
    </div>
  );
}
