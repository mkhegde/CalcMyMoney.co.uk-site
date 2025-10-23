import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { Calculator, Layers, PiggyBank, Quote, TrendingUp } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ResultBreakdownChart = React.lazy(() =>
  import('@/components/calculators/ResultBreakdownChart.jsx'),
);

const pagePath = '/calculators/loan-repayment-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/loan-repayment-calculator';
const pageTitle = 'Loan Repayment Calculator UK | Plan Monthly Payments';
const metaDescription =
  'Use the UK loan repayment calculator to model monthly payments, total interest, and payoff dates. Add extra payments to see how quickly you can clear personal, car, or consolidation loans.';
const keywords = getMappedKeywords('Loan Repayment Calculator');

const defaultInputs = {
  loanAmount: '25,000',
  annualRate: '6.5',
  termYears: '5',
  extraMonthly: '0',
};

const emotionalMessage =
  'Having a clear payoff date turns every repayment into motivation. Run the numbers, adjust the plan, and watch the balance fall faster.';
const emotionalQuote = {
  text: 'Debt is the worst poverty.',
  author: 'Thomas Fuller',
};

const faqItems = [
  {
    question: 'How is my monthly loan repayment calculated?',
    answer:
      'We apply the standard amortisation formula using your loan amount, annual interest rate, and repayment term. The calculation assumes fixed monthly payments over the selected term.',
  },
  {
    question: 'How can I reduce the total interest paid on a loan?',
    answer:
      'Make extra payments toward the principal, refinance at a lower rate, or shorten the loan term. Even small monthly overpayments can shave years off a UK personal or car loan.',
  },
  {
    question: 'What does the amortisation schedule show?',
    answer:
      'Each row splits the payment into interest and principal, showing how much balance remains after every instalment. Early payments are interest-heavy, but the principal share quickly grows.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function computeMonthlyPayment(principal, annualRatePercent, termYears) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;
  if (principal <= 0 || totalMonths <= 0) return 0;
  if (monthlyRate === 0) return principal / totalMonths;
  const factor = Math.pow(1 + monthlyRate, totalMonths);
  return (principal * monthlyRate * factor) / (factor - 1);
}

function buildAmortisationSchedule(principal, annualRatePercent, termYears, extraPayment) {
  const monthlyRate = annualRatePercent / 100 / 12;
  const totalMonths = termYears * 12;
  const basePayment = computeMonthlyPayment(principal, annualRatePercent, termYears);
  const monthlyPayment = basePayment + extraPayment;

  let balance = principal;
  let month = 0;
  let totalInterest = 0;
  const schedule = [];

  while (balance > 0 && month < totalMonths + 120) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPaid = monthlyPayment - interest;
    if (principalPaid <= 0) {
      principalPaid = 0;
    }
    if (principalPaid > balance) {
      principalPaid = balance;
    }
    const payment = principalPaid + interest;
    balance = Math.max(balance - principalPaid, 0);
    totalInterest += interest;
    schedule.push({
      month,
      payment,
      interest,
      principal: principalPaid,
      balance,
    });
    if (balance <= 0) break;
  }

  const totalPaid = schedule.reduce((sum, row) => sum + row.payment, 0);
  return {
    schedule,
    totalInterest,
    totalPaid,
    monthsToClear: schedule.length,
    monthlyPayment,
    baseMonthlyPayment: basePayment,
  };
}

function calculateLoanRepayment(inputs) {
  const loanAmount = parseNumber(inputs?.loanAmount);
  const annualRate = parseNumber(inputs?.annualRate);
  const termYears = parseNumber(inputs?.termYears);
  const extraMonthly = Math.max(0, parseNumber(inputs?.extraMonthly));

  const isValid = loanAmount > 0 && termYears > 0 && annualRate >= 0;
  if (!isValid) {
    return { isValid: false, loanAmount, annualRate, termYears, extraMonthly };
  }

  const amortisation = buildAmortisationSchedule(loanAmount, annualRate, termYears, extraMonthly);
  const principalRepaid = loanAmount;
  const effectiveExtra = Math.max(amortisation.monthlyPayment - amortisation.baseMonthlyPayment, 0);

  return {
    isValid: true,
    loanAmount,
    annualRate,
    termYears,
    extraMonthly,
    ...amortisation,
    principalRepaid,
    effectiveExtra,
  };
}

function buildCsvData(result) {
  if (!result?.isValid) return null;
  const rows = [
    ['Metric', 'Value'],
    ['Loan amount (£)', currencyFormatter.format(result.loanAmount)],
    ['Interest rate (%)', `${result.annualRate.toFixed(2)}%`],
    ['Term (years)', result.termYears],
    ['Monthly repayment (£)', currencyFormatter.format(result.monthlyPayment)],
    ['Total interest (£)', currencyFormatter.format(result.totalInterest)],
    ['Total repaid (£)', currencyFormatter.format(result.totalPaid)],
    ['Months to clear', result.monthsToClear],
    [],
    ['Month', 'Payment (£)', 'Principal (£)', 'Interest (£)', 'Balance (£)'],
  ];
  result.schedule.forEach((row) => {
    rows.push([
      row.month,
      currencyFormatter.format(row.payment),
      currencyFormatter.format(row.principal),
      currencyFormatter.format(row.interest),
      currencyFormatter.format(row.balance),
    ]);
  });
  return rows;
}

function buildChartData(result) {
  if (!result?.isValid) return [];
  return [
    { name: 'Principal repaid', value: result.principalRepaid, color: '#2563eb' },
    { name: 'Total interest', value: result.totalInterest, color: '#f97316' },
  ];
}

export default function LoanRepaymentCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [result, setResult] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Loan Repayment Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Debt & Loans', url: '/#debt-loans' },
      { name: 'Loan Repayment Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setResult(null);
    setCsvData(null);
    setHasCalculated(false);
  }, []);

  const handleCalculate = useCallback(
    (event) => {
      event.preventDefault();
      const nextResult = calculateLoanRepayment(inputs);
      setResult(nextResult);
      setHasCalculated(true);
      setCsvData(buildCsvData(nextResult));
    },
    [inputs],
  );

  const chartData = useMemo(() => buildChartData(result), [result]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="Calc My Money"
        keywords={keywords}
        articleTags={keywords}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-12">
          <section className="space-y-4 text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-slate-900adle dark:text-slate-100">
              Loan Repayment Calculator
            </Heading>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Discover the monthly payment, total interest, and payoff time for any UK personal
              loan. Add extra monthly contributions to see how quickly the balance disappears.
              Results appear only after you press <strong>Calculate loan repayments</strong>.
            </p>
          </section>

          <section className="space-y-8">
            <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <Calculator className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                  Enter your loan details
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Figures reflect fixed monthly repayments using standard UK amortisation. Extra
                  payments reduce the balance each month, shortening the term and cutting interest.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleCalculate}>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="loanAmount" className="text-sm font-medium">
                          Loan amount (£)
                        </Label>
                        <Input
                          id="loanAmount"
                          value={inputs.loanAmount}
                          onChange={handleInputChange('loanAmount')}
                          inputMode="decimal"
                          placeholder="e.g. 25,000"
                        />
                      </div>
                      <div>
                        <Label htmlFor="annualRate" className="text-sm font-medium">
                          Interest rate (% APR)
                        </Label>
                        <Input
                          id="annualRate"
                          value={inputs.annualRate}
                          onChange={handleInputChange('annualRate')}
                          inputMode="decimal"
                          placeholder="e.g. 6.5"
                        />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor="termYears" className="text-sm font-medium">
                          Term length (years)
                        </Label>
                        <Input
                          id="termYears"
                          value={inputs.termYears}
                          onChange={handleInputChange('termYears')}
                          inputMode="decimal"
                          placeholder="e.g. 5"
                        />
                      </div>
                      <div>
                        <Label htmlFor="extraMonthly" className="text-sm font-medium">
                          Extra monthly payment (£)
                        </Label>
                        <Input
                          id="extraMonthly"
                          value={inputs.extraMonthly}
                          onChange={handleInputChange('extraMonthly')}
                          inputMode="decimal"
                          placeholder="e.g. 100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate loan repayments
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {!hasCalculated && (
              <Card className="border border-dashed border-slate-300 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                <CardContent className="py-10 text-center text-sm leading-relaxed">
                  Enter your loan amount, interest rate, and term, then press{' '}
                  <strong>Calculate loan repayments</strong>. The calculator keeps results hidden
                  until you ask for them, so you can adjust the inputs without distractions.
                </CardContent>
              </Card>
            )}

            {hasCalculated && result && !result.isValid && (
              <Card className="border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                <CardContent className="py-6 text-sm leading-relaxed">
                  Please review the figures. The calculator needs a loan amount above £0, a term
                  greater than zero, and a non-negative interest rate. Adjust the inputs and
                  calculate again to see the repayment plan.
                </CardContent>
              </Card>
            )}

            {hasCalculated && result?.isValid && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <Heading
                    as="h2"
                    size="h2"
                    weight="semibold"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    Loan repayment summary
                  </Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName='loan-repayment-calculator'
                    title="Loan Repayment Calculator Results"
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                        <PiggyBank className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                        Key repayment figures
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Monthly repayment
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(result.monthlyPayment)}
                        </p>
                        {result.effectiveExtra > 0 && (
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Includes {currencyFormatter.format(result.effectiveExtra)} extra each month
                          </p>
                        )}
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Total interest
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(result.totalInterest)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          Repaying £{result.loanAmount.toLocaleString('en-GB')}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Total repaid
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {currencyFormatter.format(result.totalPaid)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 dark:border-slate-700 dark:bg-slate-900/50">
                        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                          Months to clear
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {result.monthsToClear}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                        <Layers className="h-5 w-5 text-sky-600" aria-hidden="true" />
                        First year snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                          <tr>
                            <th className="px-4 py-2">Month</th>
                            <th className="px-4 py-2">Payment</th>
                            <th className="px-4 py-2">Principal</th>
                            <th className="px-4 py-2">Interest</th>
                            <th className="px-4 py-2">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.slice(0, 12).map((row) => (
                            <tr
                              key={row.month}
                              className="border-b border-slate-100 text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-900/40"
                            >
                              <td className="px-4 py-2 font-medium">{row.month}</td>
                              <td className="px-4 py-2">{currencyFormatter.format(row.payment)}</td>
                              <td className="px-4 py-2">{currencyFormatter.format(row.principal)}</td>
                              <td className="px-4 py-2 text-rose-600 dark:text-rose-300">
                                {currencyFormatter.format(row.interest)}
                              </td>
                              <td className="px-4 py-2">{currencyFormatter.format(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.schedule.length > 12 && (
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          Export the CSV to review the full amortisation schedule and track every
                          repayment until the balance reaches zero.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      <TrendingUp className="h-5 w-5 text-emerald-600" aria-hidden="true" />
                      Principal vs interest breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={
                        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          Loading repayment chart…
                        </div>
                      }
                    >
                      <ResultBreakdownChart data={chartData} title="Loan repayment breakdown" />
                    </Suspense>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Staying motivated
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>{emotionalMessage}</p>
                <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <Quote className="h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
                  <span>
                    “{emotionalQuote.text}” — <em>{emotionalQuote.author}</em>
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Continue planning
                </CardTitle>
              </CardHeader>
              <CardContent>
</CardContent>
            </Card>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}

