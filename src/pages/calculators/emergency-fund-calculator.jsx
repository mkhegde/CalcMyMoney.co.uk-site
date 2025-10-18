import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, LifeBuoy, Shield, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/emergency-fund-calculator';

const schemaKeywords = [
  'Financial Cushion',
  'Monthly Expenditure',
  'Job Loss Protection',
  'Risk Management',
  'Financial Security',
];

const defaultExpenses = [
  { id: 'housing', label: 'Housing & utilities', amount: '950' },
  { id: 'food', label: 'Groceries & essentials', amount: '300' },
  { id: 'transport', label: 'Transport & commuting', amount: '160' },
  { id: 'insurance', label: 'Insurance & healthcare', amount: '120' },
];

let idCounter = 30;
const newId = () => `expense-${idCounter++}`;

const FAQS = [
  {
    question: 'How many months of expenses should my emergency fund cover?',
    answer:
      'Most planners recommend three to six months of essential living expenses. Increase to nine or twelve months if your job security is low or you have dependants.',
  },
  {
    question: 'What counts as an emergency fund expense?',
    answer:
      'Include only essential living costs—housing, food, utilities, insurance, debts, and necessary transport. Exclude discretionary spending like holidays or luxury purchases.',
  },
  {
    question: 'Where should I keep my emergency savings?',
    answer:
      'Choose easy-access savings accounts with competitive interest rates. Safety and liquidity matter more than high returns for a financial buffer.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function EmergencyFundCalculator() {
  const [expenses, setExpenses] = useState(defaultExpenses);
  const [monthsCover, setMonthsCover] = useState('6');
  const [currentSavings, setCurrentSavings] = useState('2500');
  const [savePerMonth, setSavePerMonth] = useState('300');

  const updateExpense = useCallback((id, field, value) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }, []);

  const removeExpense = useCallback((id) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addExpense = useCallback(() => {
    setExpenses((prev) => [
      ...prev,
      { id: newId(), label: 'New essential expense', amount: '0' },
    ]);
  }, []);

  const reset = useCallback(() => {
    setExpenses(defaultExpenses);
    setMonthsCover('6');
    setCurrentSavings('2500');
    setSavePerMonth('300');
  }, []);

  const summary = useMemo(() => {
    const monthlyEssentialSpend = expenses.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    const months = Math.max(Number(monthsCover) || 0, 0);
    const targetFund = monthlyEssentialSpend * months;
    const currentBuffer = Number(currentSavings) || 0;
    const monthlyContribution = Math.max(Number(savePerMonth) || 0, 0);
    const shortfall = Math.max(0, targetFund - currentBuffer);
    const monthsToTarget =
      monthlyContribution > 0 ? Math.ceil(shortfall / monthlyContribution) : Infinity;

    return {
      monthlyEssentialSpend,
      targetFund,
      currentBuffer,
      monthlyContribution,
      shortfall,
      monthsToTarget,
    };
  }, [expenses, monthsCover, currentSavings, savePerMonth]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Emergency Fund Planner &amp; Savings Goal Calculator</title>
        <meta
          name="description"
          content="Emergency Fund Calculator to build a savings goal based on living expenses. Plan your financial cushion for job loss protection and risk management."
        />
        <meta
          name="keywords"
          content="Emergency Fund Calculator, Living Expenses, Savings Target"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Emergency Fund Calculator',
              description:
                'Savings planner helping households determine financial cushions, monthly expenditure coverage, and job loss protection strategies.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-teal-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Emergency Fund Calculator
          </Heading>
          <p className="text-lg md:text-xl text-teal-100">
            Calculate fund target, build a savings plan, and secure a financial buffer covering three
            months expenses to avoid debt reliance.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-2">
          <Card className="border border-teal-200 dark:border-teal-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-teal-500" />
                Essential Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {expenses.map((item) => (
                <div key={item.id} className="grid grid-cols-[1fr_auto_auto] gap-3 items-center">
                  <Input
                    value={item.label}
                    onChange={(event) => updateExpense(item.id, 'label', event.target.value)}
                  />
                  <Input
                    value={item.amount}
                    inputMode="decimal"
                    onChange={(event) => updateExpense(item.id, 'amount', event.target.value)}
                    className="w-28"
                  />
                  <Button type="button" variant="ghost" onClick={() => removeExpense(item.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addExpense}>
                Add essential cost
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-teal-200 dark:border-teal-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <LifeBuoy className="h-5 w-5 text-teal-500" />
                  Fund Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="monthsCover" className="text-sm font-medium">
                    Months of cover
                  </Label>
                  <Input
                    id="monthsCover"
                    inputMode="decimal"
                    value={monthsCover}
                    onChange={(event) => setMonthsCover(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currentSavings" className="text-sm font-medium">
                    Current emergency savings (GBP)
                  </Label>
                  <Input
                    id="currentSavings"
                    inputMode="decimal"
                    value={currentSavings}
                    onChange={(event) => setCurrentSavings(event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="savePerMonth" className="text-sm font-medium">
                    Planned monthly saving (GBP)
                  </Label>
                  <Input
                    id="savePerMonth"
                    inputMode="decimal"
                    value={savePerMonth}
                    onChange={(event) => setSavePerMonth(event.target.value)}
                  />
                </div>
                <Button type="button" variant="outline" onClick={reset}>
                  Reset inputs
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-teal-200 dark:border-teal-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Shield className="h-5 w-5 text-teal-500" />
                Emergency Fund Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Monthly essential spend</p>
                  <p className="text-lg font-semibold text-teal-600">
                    {currencyFormatter.format(summary.monthlyEssentialSpend)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fund target</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(summary.targetFund)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Current buffer</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(summary.currentBuffer)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Savings shortfall</p>
                  <p className="text-lg font-semibold text-rose-600">
                    {currencyFormatter.format(summary.shortfall)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly contribution</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(summary.monthlyContribution)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Months to target</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {Number.isFinite(summary.monthsToTarget)
                      ? summary.monthsToTarget
                      : 'Not reachable'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-teal-200 dark:border-teal-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <PiggyBank className="h-5 w-5 text-teal-500" />
                Savings Plan Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Automate transfers on payday to keep the financial cushion growing before discretionary
                spending erodes progress.
              </p>
              <p>
                Review essential expenses annually; as living costs rise, recalibrate the emergency
                fund to maintain adequate financial security.
              </p>
              <p>
                Avoid dipping into the fund for non-emergencies. Replenish withdrawals quickly to
                maintain job loss protection and risk management resilience.
              </p>
            </CardContent>
          </Card>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Fund Target for a Robust Financial Buffer
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this tool to determine the right emergency fund size and create a savings plan that
            protects against unexpected income shocks without resorting to debt.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Three Months Expenses as a Starting Point
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Many households target three to six months of living expenses. Increase the goal if your
            income varies seasonally or you have high-risk employment.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Savings Plan Prevents Debt Avoidance Setbacks
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Building a dedicated emergency fund minimises reliance on credit cards or loans during
            emergencies, preserving long-term financial security.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={FAQS} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
