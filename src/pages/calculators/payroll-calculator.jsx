import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Receipt, ClipboardCheck, PoundSterling } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/payroll-calculator';

const schemaKeywords = [
  'Gross Pay',
  'Pensions',
  'Tax Code',
  'Statutory Deductions',
  'Take Home Salary',
];

const studentLoanPlans = [
  { value: 'none', label: 'No student loan', threshold: Infinity, rate: 0 },
  { value: 'plan1', label: 'Plan 1 (pre-2012 loans)', threshold: 24990, rate: 0.09 },
  { value: 'plan2', label: 'Plan 2 (post-2012 loans)', threshold: 27295, rate: 0.09 },
  { value: 'plan4', label: 'Plan 4 (Scotland)', threshold: 27660, rate: 0.09 },
  { value: 'postgrad', label: 'Postgraduate loan', threshold: 21000, rate: 0.06 },
];

const faqItems = [
  {
    question: 'How does PAYE calculate income tax?',
    answer:
      'PAYE spreads income tax across the year. It applies personal allowance, basic, higher, and additional rate bands to gross pay and deducts tax each pay period.',
  },
  {
    question: 'Does pension contribution reduce taxable income?',
    answer:
      'Yes. Employee pension contributions reduce taxable and NIable pay when made via salary sacrifice or net pay arrangements, lowering statutory deductions.',
  },
  {
    question: 'Are student loan repayments included on the payslip?',
    answer:
      'If you have an active student loan, payroll deducts repayments via PAYE once earnings exceed the plan-specific threshold. This calculator shows an estimate of those deductions.',
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
  if (taxable <= 0) return { tax, personalAllowance };

  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - personalAllowance);
  tax += basicBand * 0.2;

  if (taxable > basicBand) {
    const higherBand = Math.min(
      taxable - basicBand,
      HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT,
    );
    tax += higherBand * 0.4;

    if (taxable > basicBand + higherBand) {
      const additionalBand = taxable - basicBand - higherBand;
      tax += additionalBand * 0.45;
    }
  }

  return { tax, personalAllowance };
}

function calculateNationalInsurance(annualPay) {
  const niBand1 = Math.max(0, Math.min(annualPay, NI_UPPER_EARNINGS_LIMIT) - NI_PRIMARY_THRESHOLD);
  const niBand2 = Math.max(0, annualPay - NI_UPPER_EARNINGS_LIMIT);
  const ni = niBand1 * NI_MAIN_RATE + niBand2 * NI_UPPER_RATE;
  return ni;
}

function calculateStudentLoan(annualPay, plan) {
  if (!plan) return 0;
  const threshold = plan.threshold;
  const rate = plan.rate;
  if (!Number.isFinite(threshold) || threshold === Infinity) return 0;
  return Math.max(0, (annualPay - threshold) * rate);
}

export default function PayrollCalculator() {
  const [inputs, setInputs] = useState({
    annualSalary: '52000',
    pensionPercent: '5',
    taxCode: '1257L',
    studentLoanPlan: 'plan2',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      annualSalary: '52000',
      pensionPercent: '5',
      taxCode: '1257L',
      studentLoanPlan: 'plan2',
    });
  }, []);

  const results = useMemo(() => {
    const annualSalary = Number(inputs.annualSalary) || 0;
    const pensionPercent = Math.max(0, Number(inputs.pensionPercent) || 0) / 100;
    const pensionContribution = annualSalary * pensionPercent;
    const taxablePay = Math.max(0, annualSalary - pensionContribution);

    const { tax } = calculateIncomeTax(taxablePay);
    const ni = calculateNationalInsurance(taxablePay);

    const studentLoanPlan =
      studentLoanPlans.find((plan) => plan.value === inputs.studentLoanPlan) ||
      studentLoanPlans[0];
    const studentLoan = calculateStudentLoan(taxablePay, studentLoanPlan);

    const totalDeductions = tax + ni + pensionContribution + studentLoan;
    const takeHome = annualSalary - totalDeductions;
    const monthlyNet = takeHome / 12;
    const monthlyGross = annualSalary / 12;

    return {
      annualSalary,
      pensionContribution,
      taxablePay,
      tax,
      ni,
      studentLoan,
      totalDeductions,
      takeHome,
      monthlyNet,
      monthlyGross,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Payroll Calculator &amp; Payslip Breakdown</title>
        <meta
          name="description"
          content="Payroll Calculator for UK employees. Estimate PAYE deductions, NI, pensions, and net pay to understand your payslip breakdown."
        />
        <meta
          name="keywords"
          content="UK Payroll Calculator, PAYE Deductions, Net Pay"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Payroll Calculator',
              description:
                'Estimate gross pay, pensions, tax code impact, statutory deductions, and take home salary for UK payslip accuracy.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Payroll Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Calculate payroll deductions, breakdown salary deductions, and ensure PAYE system figures
            match your payslip accuracy expectations.
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
                  Gross annual salary (GBP)
                </Label>
                <Input
                  id="annualSalary"
                  inputMode="decimal"
                  value={inputs.annualSalary}
                  onChange={(event) => handleChange('annualSalary', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pensionPercent" className="text-sm font-medium">
                  Pension contribution (% via salary sacrifice)
                </Label>
                <Input
                  id="pensionPercent"
                  inputMode="decimal"
                  value={inputs.pensionPercent}
                  onChange={(event) => handleChange('pensionPercent', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="taxCode" className="text-sm font-medium">
                  Tax code (for reference)
                </Label>
                <Input
                  id="taxCode"
                  value={inputs.taxCode}
                  onChange={(event) => handleChange('taxCode', event.target.value)}
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
            <Card className="border border-emerald-200 dark;border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Receipt className="h-5 w-5 text-emerald-500" />
                  Payslip Breakdown
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
                    <p className="text-muted-foreground">Monthly net pay</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.monthlyNet)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Income tax (annual)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.tax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">National Insurance (annual)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.ni)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Pension contribution (annual)</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.pensionContribution)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Student loan (annual)</p>
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
                    <p className="text-muted-foreground">Take-home salary (annual)</p>
                    <p className="text-lg font-semibold text-emerald-600">
                      {currencyFormatter.format(results.takeHome)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <ClipboardCheck className="h-5 w-5 text-emerald-500" />
                  Payroll Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Salary sacrifice pension contributions lower taxable income, reducing PAYE and
                  National Insurance while bolstering retirement savings.
                </p>
                <p>
                  Verify tax code changes promptly—incorrect codes cause under or over-payments that
                  HMRC reconciles later.
                </p>
                <p>
                  Keep payslip copies: they evidence statutory deductions, support mortgage
                  applications, and document pensionable earnings.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Payroll for Complete Payslip Accuracy
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            This payroll calculator shows salary deductions and taxable income to keep the PAYE system
            transparent. Adjust inputs to forecast net pay across the tax year.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Break Down Salary Deductions with Ease
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understanding statutory deductions—tax, NI, pensions, and loans—helps you anticipate net
            pay and avoid cash-flow surprises.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            PAYE System Insight Supports Financial Planning
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Accurate payslip breakdowns underpin budgeting and long-term goals. Compare payroll
            scenarios before negotiating salary changes or adjusting pension contributions.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
