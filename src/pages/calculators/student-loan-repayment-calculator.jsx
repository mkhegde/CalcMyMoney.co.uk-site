import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { GraduationCap, Calculator, Scale, TrendingUp, AlertTriangle } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'student loan repayment calculator',
  'student loan calculator',
  'student finance calculator',
  'loan payment calculator',
];

const metaDescription =
  'Use our student loan repayment calculator, student loan calculator, student finance calculator, and loan payment calculator to plan repayments and interest.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/student-loan-repayment-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultInputs = {
  loanBalance: 32000,
  annualSalary: 38000,
  repaymentPlan: 'plan2',
  overpayment: 100,
  annualSalaryGrowth: 3,
};

const repaymentPlans = {
  plan1: {
    name: 'Plan 1',
    threshold: 24375,
    rate: 0.09,
    interestRate: 5,
    writeOffYears: 25,
  },
  plan2: {
    name: 'Plan 2',
    threshold: 27295,
    rate: 0.09,
    interestRate: 6.5,
    writeOffYears: 30,
  },
  plan4: {
    name: 'Plan 4 (Scotland)',
    threshold: 31660,
    rate: 0.09,
    interestRate: 6,
    writeOffYears: 30,
  },
  plan5: {
    name: 'Plan 5',
    threshold: 25000,
    rate: 0.09,
    interestRate: 6.25,
    writeOffYears: 40,
  },
};

const studentLoanFaqs = [
  {
    question: 'How are repayments calculated?',
    answer:
      'Once your salary exceeds the plan threshold, you pay 9% of income above the line. The student loan repayment calculator applies this idea annually and adds interest linked to your plan.',
  },
  {
    question: 'Do overpayments help?',
    answer:
      'Voluntary overpayments reduce the balance faster. Combine the student loan calculator payoff data with your budgeting to clear debt earlier if you expect higher lifetime earnings.',
  },
  {
    question: 'What about write-off rules?',
    answer:
      'Each repayment plan writes off the remaining balance after 25–40 years. The student finance calculator shows whether you are projected to repay before the write-off kicks in.',
  },
];

const calculateRepayments = ({
  loanBalance,
  annualSalary,
  repaymentPlan,
  overpayment,
  annualSalaryGrowth,
}) => {
  const plan = repaymentPlans[repaymentPlan] ?? repaymentPlans.plan2;
  const rate = plan.rate;
  const threshold = plan.threshold;
  const interestRate = plan.interestRate / 100;
  const writeOffYears = plan.writeOffYears;

  let balance = Math.max(Number(loanBalance) || 0, 0);
  let salary = Math.max(Number(annualSalary) || 0, 0);
  const overpaymentValue = Math.max(Number(overpayment) || 0, 0);
  const salaryGrowthRate = Math.max(Number(annualSalaryGrowth) || 0, 0) / 100;

  const yearlyBreakdown = [];
  let totalPaid = 0;
  let year = 0;

  while (balance > 0 && year < writeOffYears) {
    year += 1;
    const interest = balance * interestRate;
    balance += interest;

    const annualRequiredPayment = Math.max((salary - threshold) * rate, 0);
    const totalPayment = Math.min(balance, annualRequiredPayment + overpaymentValue * 12);

    balance -= totalPayment;
    totalPaid += totalPayment;

    yearlyBreakdown.push({
      year,
      salary,
      interest,
      payment: totalPayment,
      balance: Math.max(balance, 0),
    });

    salary *= 1 + salaryGrowthRate;
  }

  const writeOff = balance > 0;

  return { yearlyBreakdown, totalPaid, balance: Math.max(balance, 0), yearsTaken: year, writeOff };
};

export default function StudentLoanRepaymentCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateRepayments({
        loanBalance: inputs.loanBalance,
        annualSalary: inputs.annualSalary,
        repaymentPlan: inputs.repaymentPlan,
        overpayment: inputs.overpayment,
        annualSalaryGrowth: inputs.annualSalaryGrowth,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Student Loan Repayment Calculator | Student Loan Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Student Loan Repayment Calculator | Student Loan Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Student Loan Repayment Calculator | Student Loan Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Student Loan Repayment Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan repayments with a student loan repayment calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-emerald-900 to-slate-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Student Loan Repayment Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Understand repayments, interest, and write-off timelines for UK student loans across plans
            1, 2, 4, and 5.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <GraduationCap className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Student finance calculator inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="loanBalance">Current loan balance (£)</Label>
                  <Input
                    id="loanBalance"
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.loanBalance}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        loanBalance: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualSalary">Current annual salary (£)</Label>
                  <Input
                    id="annualSalary"
                    type="number"
                    min="0"
                    step="500"
                    value={inputs.annualSalary}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualSalary: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repaymentPlan">Repayment plan</Label>
                  <select
                    id="repaymentPlan"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    value={inputs.repaymentPlan}
                    onChange={(event) =>
                      setInputs((prev) => ({ ...prev, repaymentPlan: event.target.value }))
                    }
                  >
                    {Object.entries(repaymentPlans).map(([key, plan]) => (
                      <option key={key} value={key}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="overpayment">Monthly voluntary overpayment (£)</Label>
                  <Input
                    id="overpayment"
                    type="number"
                    min="0"
                    step="10"
                    value={inputs.overpayment}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        overpayment: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualSalaryGrowth">Expected annual salary growth (%)</Label>
                  <Slider
                    id="annualSalaryGrowth"
                    value={[Number(inputs.annualSalaryGrowth)]}
                    min={0}
                    max={10}
                    step={0.5}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualSalaryGrowth: Number(value[0].toFixed(1)),
                      }))
                    }
                    className="mt-3"
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>0%</span>
                    <span>{inputs.annualSalaryGrowth.toFixed(1)}%</span>
                    <span>10%</span>
                  </div>
                </div>
                <Button variant="outline" onClick={resetAll} className="w-full">
                  Reset to example plan
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Student loan calculator summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total paid</p>
                  <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.totalPaid)}
                  </p>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Years until cleared / write-off</span>
                    <span>{results.yearsTaken}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Balance remaining</span>
                    <span>{currencyFormatter.format(results.balance)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Write-off applies?</span>
                    <span>{results.writeOff ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Repayment timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                {results.yearlyBreakdown.length === 0 && (
                  <p className="text-center text-slate-600 dark:text-slate-300">
                    Adjust the inputs to see annual payments, interest, and balances.
                  </p>
                )}
                {results.yearlyBreakdown.map((year) => (
                  <div
                    key={year.year}
                    className="grid grid-cols-4 gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                  >
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Year {year.year}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Salary {currencyFormatter.format(year.salary)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Paid {currencyFormatter.format(year.payment)}
                    </span>
                    <span className="text-right text-slate-600 dark:text-slate-300">
                      Balance {currencyFormatter.format(year.balance)}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading as="h2" size="h2" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Loan payment calculator guidance
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Run multiple scenarios using the loan payment calculator to see how salary jumps,
                family leave, or changing plans influence your student debt path.
              </p>
              <Heading as="h3" size="h3" weight="semibold" className="text-slate-900 dark:text-slate-100">
                Student finance calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Log in to your Student Loans Company account annually to grab your balance and interest
                rate. Update this student finance calculator so you stay informed.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <AlertTriangle className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Need help understanding your plan?
                </CardTitle>
              </CardHeader>
              <FAQSection faqs={studentLoanFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
