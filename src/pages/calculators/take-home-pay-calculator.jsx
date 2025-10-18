import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Wallet, Receipt, Scale } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/take-home-pay-calculator';

const schemaKeywords = [
  'Gross Pay',
  'Income Tax',
  'National Insurance',
  'Pension Contributions',
  'Take Home Amount',
];

const studentLoanPlans = [
  { value: 'none', label: 'No student loan', threshold: Infinity, rate: 0 },
  { value: 'plan1', label: 'Plan 1', threshold: 24990, rate: 0.09 },
  { value: 'plan2', label: 'Plan 2', threshold: 27295, rate: 0.09 },
  { value: 'plan4', label: 'Plan 4', threshold: 27660, rate: 0.09 },
  { value: 'plan5', label: 'Plan 5', threshold: 25000, rate: 0.09 },
  { value: 'postgrad', label: 'Postgraduate loan', threshold: 21000, rate: 0.06 },
];

const faqItems = [
  {
    question: 'How is UK take home pay calculated?',
    answer:
      'Take home pay subtracts income tax, National Insurance, pension contributions, and student loan repayments from your gross salary using PAYE thresholds.',
  },
  {
    question: 'Can pension contributions reduce deductions?',
    answer:
      'Yes. Pension contributions made through salary sacrifice reduce taxable and NIable pay, increasing net income while boosting retirement savings.',
  },
  {
    question: 'Why does my tax code matter?',
    answer:
      'Your tax code determines personal allowance. This calculator assumes the current standard allowance (1257L). If HMRC sets a different code, your take home pay changes.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const NI_PRIMARY_THRESHOLD = 12570;
const NI_UPPER_EARNINGS_LIMIT = 50270;
const NI_MAIN_RATE = 0.08;
const NI_UPPER_RATE = 0.02;

function calculateIncomeTax(grossIncome) {
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (grossIncome > 100000) {
    const reduction = Math.floor((grossIncome - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxable = Math.max(0, grossIncome - personalAllowance);
  let tax = 0;

  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - personalAllowance);
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT,
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, personalAllowance };
}

function calculateNI(annualPay) {
  const niBand1 = Math.max(0, Math.min(annualPay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD);
  const niBand2 = Math.max(0, annualPay - NI_UPPER_EARNINGS_LIMIT);
  return niBand1 * NI_MAIN_RATE + niBand2 * NI_UPPER_RATE;
}

function calculateStudentLoan(annualPay, plan) {
  if (!plan || !Number.isFinite(plan.threshold) || plan.threshold === Infinity) return 0;
  return Math.max(0, (annualPay - plan.threshold) * plan.rate);
}

export default function TakeHomePayCalculator() {
  const [inputs, setInputs] = useState({
    annualSalary: '48000',
    pensionContributionPercent: '5',
    bonus: '3000',
    studentLoanPlan: 'plan2',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      annualSalary: '48000',
      pensionContributionPercent: '5',
      bonus: '3000',
      studentLoanPlan: 'plan2',
    });
  }, []);

  const results = useMemo(() => {
    const salary = Number(inputs.annualSalary) || 0;
    const bonus = Math.max(0, Number(inputs.bonus) || 0);
    const pensionPercent = Math.max(0, Number(inputs.pensionContributionPercent) || 0) / 100;

    const grossPay = salary + bonus;
    const pensionContribution = grossPay * pensionPercent;
    const taxablePay = Math.max(0, grossPay - pensionContribution);

    const { tax } = calculateIncomeTax(taxablePay);
    const ni = calculateNI(taxablePay);
    const studentLoanPlan =
      studentLoanPlans.find((plan) => plan.value === inputs.studentLoanPlan) ||
      studentLoanPlans[0];
    const studentLoan = calculateStudentLoan(taxablePay, studentLoanPlan);

    const totalDeductions = tax + ni + pensionContribution + studentLoan;
    const takeHomeAnnual = grossPay - totalDeductions;
    const monthlyGross = grossPay / 12;
    const monthlyTakeHome = takeHomeAnnual / 12;

    return {
      grossPay,
      pensionContribution,
      tax,
      ni,
      studentLoan,
      totalDeductions,
      takeHomeAnnual,
      monthlyGross,
      monthlyTakeHome,
      effectiveTaxRate: grossPay > 0 ? (tax / grossPay) * 100 : 0,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Take Home Pay &amp; Net Salary Calculator</title>
        <meta
          name="description"
          content="Take Home Pay Calculator showing salary deductions, National Insurance, pension contributions, and net income from annual salary."
        />
        <meta
          name="keywords"
          content="Take Home Pay Calculator, Salary Deductions, Annual Salary"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Take Home Pay Calculator',
              description:
                'Calculate gross pay, income tax, National Insurance, pension contributions, and take home amount for UK employees.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Take Home Pay Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Calculate take home pay, analyse net income, and understand paycheck breakdown with
            deductions explained for salary comparison.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Salary Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="annualSalary" className="text-sm font-medium">
                  Annual salary (GBP)
                </Label>
                <Input
                  id="annualSalary"
                  inputMode="decimal"
                  value={inputs.annualSalary}
                  onChange={(event) => handleChange('annualSalary', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bonus" className="text-sm font-medium">
                  Annual bonus (GBP)
                </Label>
                <Input
                  id="bonus"
                  inputMode="decimal"
                  value={inputs.bonus}
                  onChange={(event) => handleChange('bonus', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pensionContributionPercent" className="text-sm font-medium">
                  Pension contribution (% via salary sacrifice)
                </Label>
                <Input
                  id="pensionContributionPercent"
                  inputMode="decimal"
                  value={inputs.pensionContributionPercent}
                  onChange={(event) =>
                    handleChange('pensionContributionPercent', event.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="studentLoanPlan" className="text-sm font-medium">
                  Student loan plan
                </Label>
                <select
                  id="studentLoanPlan"
                  value={inputs.studentLoanPlan}
                  onChange={(event) => handleChange('studentLoanPlan', event.target.value)}
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                >
                  {studentLoanPlans.map((plan) => (
                    <option key={plan.value} value={plan.value}>
                      {plan.label}
                    </option>
                  ))}
                </select>
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
                  <Wallet className="h-5 w-5 text-emerald-500" />
                  Net Salary Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Monthly gross pay</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlyGross)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly take home pay</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.monthlyTakeHome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual tax</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.tax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual National Insurance</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.ni)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pension contribution</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.pensionContribution)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Student loan deduction</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.studentLoan)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total deductions</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.totalDeductions)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effective income tax rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.effectiveTaxRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Scale className="h-5 w-5 text-emerald-500" />
                  Paycheck Breakdown Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Compare net income across job offers by adjusting pension contributions and bonuses.
                  This clarifies salary comparison decisions.
                </p>
                <p>
                  Monitor deductions explained on your payslip. If tax or NI appears incorrect, contact
                  HMRC with your tax code and income details.
                </p>
                <p>
                  Align savings goals with monthly take home pay by automating transfers after payday.
                  Budgeting becomes easier with consistent net income tracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Take Home Pay for Clear Net Income Insight
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understand how taxes, NI, and pensions shape your paycheck breakdown. This helps align
            deductions explained with financial goals and salary comparison discussions.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Master Net Income to Support Budgeting
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use the calculator to set realistic budgets, plan savings contributions, and ensure take
            home pay meets monthly obligations.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Salary Comparison with Deductions Explained
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Evaluating different pension percentages or bonus structures shows their impact on net
            salary, supporting informed career choices.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
