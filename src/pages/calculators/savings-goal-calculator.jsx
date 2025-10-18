import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingUp, Target } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/savings-goal-calculator';

const schemaKeywords = [
  'Future Value',
  'Interest Rate',
  'Initial Deposit',
  'Savings Target',
  'Personal Finance',
];

const faqItems = [
  {
    question: 'How often should I review my savings goal?',
    answer:
      'Check progress at least quarterly. Adjust contributions if your circumstances change or you receive windfalls.',
  },
  {
    question: 'What interest rate should I assume?',
    answer:
      'Use a realistic rate reflecting your savings account or investment strategy. Conservative estimates prevent overestimating growth.',
  },
  {
    question: 'How can I reach targets faster?',
    answer:
      'Increase monthly contributions, make lump sum deposits, or move funds to higher-yield accounts where appropriate while managing risk.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function SavingsGoalCalculator() {
  const [inputs, setInputs] = useState({
    savingsTarget: '25000',
    initialDeposit: '5000',
    monthlyContribution: '450',
    annualInterestRate: '3.5',
    contributionIncreaseRate: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      savingsTarget: '25000',
      initialDeposit: '5000',
      monthlyContribution: '450',
      annualInterestRate: '3.5',
      contributionIncreaseRate: '0',
    });
  }, []);

  const results = useMemo(() => {
    const target = Number(inputs.savingsTarget) || 0;
    const initialDeposit = Number(inputs.initialDeposit) || 0;
    const monthlyContribution = Number(inputs.monthlyContribution) || 0;
    const annualRate = Number(inputs.annualInterestRate) / 100 || 0;
    const contributionIncreaseRate = Number(inputs.contributionIncreaseRate) / 100 || 0;

    const monthlyRate = annualRate / 12;
    const monthlyIncrease = contributionIncreaseRate / 12;

    let balance = initialDeposit;
    let months = 0;
    let totalContributions = initialDeposit;

    while (balance < target && months < 1200) {
      balance += balance * monthlyRate;
      balance += monthlyContribution * Math.pow(1 + monthlyIncrease, months);
      totalContributions += monthlyContribution * Math.pow(1 + monthlyIncrease, months);
      months += 1;
    }

    const years = months / 12;
    const interestEarned = balance - totalContributions;

    const monthlyNeededNoGrowth =
      target > initialDeposit && years > 0
        ? (target - initialDeposit) / months
        : 0;

    return {
      target,
      initialDeposit,
      monthlyContribution,
      annualRate,
      contributionIncreaseRate,
      months,
      years,
      balance: Math.min(balance, target),
      totalContributions,
      interestEarned,
      monthlyNeededNoGrowth,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Savings Goal &amp; Time to Save Calculator</title>
        <meta
          name="description"
          content="Savings Goal Calculator demonstrating monthly contribution plans, goal dates, and interest growth to help you reach financial targets."
        />
        <meta
          name="keywords"
          content="Savings Goal Calculator, Monthly Contribution, Goal Date"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Savings Goal Calculator',
              description:
                'Future value calculator combining interest rate, initial deposit, and monthly contributions to plan savings targets for personal finance goals.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Savings Goal Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Calculate savings goal timelines, monitor time to reach goal, and create a savings plan
            using compound interest to achieve financial goals.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Savings Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="savingsTarget" className="text-sm font-medium">
                  Savings target (GBP)
                </Label>
                <Input
                  id="savingsTarget"
                  inputMode="decimal"
                  value={inputs.savingsTarget}
                  onChange={(event) => handleChange('savingsTarget', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="initialDeposit" className="text-sm font-medium">
                  Initial deposit (GBP)
                </Label>
                <Input
                  id="initialDeposit"
                  inputMode="decimal"
                  value={inputs.initialDeposit}
                  onChange={(event) => handleChange('initialDeposit', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthlyContribution" className="text-sm font-medium">
                  Monthly contribution (GBP)
                </Label>
                <Input
                  id="monthlyContribution"
                  inputMode="decimal"
                  value={inputs.monthlyContribution}
                  onChange={(event) =>
                    handleChange('monthlyContribution', event.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="annualInterestRate" className="text-sm font-medium">
                  Annual interest rate (%)
                </Label>
                <Input
                  id="annualInterestRate"
                  inputMode="decimal"
                  value={inputs.annualInterestRate}
                  onChange={(event) => handleChange('annualInterestRate', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contributionIncreaseRate" className="text-sm font-medium">
                  Annual contribution increase (%)
                </Label>
                <Input
                  id="contributionIncreaseRate"
                  inputMode="decimal"
                  value={inputs.contributionIncreaseRate}
                  onChange={(event) =>
                    handleChange('contributionIncreaseRate', event.target.value)
                  }
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-emerald-500" />
                  Savings Projection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Months to goal</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {Number.isFinite(results.months) ? results.months : 'Goal unreachable'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Years to goal</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {Number.isFinite(results.years)
                        ? results.years.toFixed(1)
                        : 'Goal unreachable'}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated balance</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.balance)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total contributions</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.totalContributions)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Interest earned</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.interestEarned)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly needed without growth</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyNeededNoGrowth)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  Savings Plan Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Automate transfers to maintain your savings plan. Gradually increase contributions to
                  stay ahead of inflation and reach goals sooner.
                </p>
                <p>
                  Adjust assumptions for compound interest and contribution growth to build realistic
                  forecasts tuned to your personal finance strategy.
                </p>
                <p>
                  Celebrate milestones. Reaching a savings target strengthens confidence in pursuing
                  future financial goals.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Savings Goal Timelines with Confidence
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this savings planner to understand how compound interest accelerates progress toward
            your savings target. Adjust contributions to align with your timeline.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Track Time to Reach Goal and Stay Motivated
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Visualise months and years required to hit your savings target. Smaller, consistent steps
            create momentum for long-term financial goals.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Savings Plan Encourages Compound Interest Benefits
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Regular contributions plus compounding deliver exponential growth. Revisit your plan often
            to ensure you remain on track and adapt to life changes.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
