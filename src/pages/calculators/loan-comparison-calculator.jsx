import React, { Suspense, useCallback, useMemo, useState } from 'react';
import { Calculator, LineChart, Quote, Scale } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const ResultBreakdownChart = React.lazy(() =>
  import('@/components/calculators/ResultBreakdownChart.jsx'),
);

const pagePath = '/calculators/loan-comparison-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/loan-comparison-calculator';
const pageTitle = 'Loan Comparison Calculator UK | Find the Better Deal';
const metaDescription =
  'Use the loan comparison calculator to weigh two UK personal loans side-by-side. Compare monthly repayments, total interest, APR-style costs, and fees before you apply.';
const keywords = getMappedKeywords('Loan Comparison Calculator');

const defaultLoans = {
  a: {
    name: 'Loan A',
    amount: '15,000',
    rate: '5.8',
    term: '4',
    fees: '125',
  },
  b: {
    name: 'Loan B',
    amount: '15,000',
    rate: '6.3',
    term: '3',
    fees: '0',
  },
};

const emotionalMessage =
  'A calm comparison today can save months of overpaying tomorrow. Check the numbers, protect your goals, and borrow with confidence.';
const emotionalQuote = {
  text: 'Neither a borrower nor a lender be; For loan oft loses both itself and friend.',
  author: 'William Shakespeare',
};

const faqItems = [
  {
    question: 'What should I compare when choosing between two loans?',
    answer:
      'Look beyond the monthly payment. Compare the total interest charged, any arrangement or early repayment fees, and the overall repayment amount. APR figures help capture the full borrowing cost.',
  },
  {
    question: 'How does APR differ from the interest rate?',
    answer:
      'The headline interest rate covers the cost of borrowing the principal, while APR/APRC includes mandatory fees spread across the term. Use both to understand which loan is genuinely cheaper.',
  },
  {
    question: 'Why might the cheapest monthly payment not be the best loan?',
    answer:
      'Longer terms lower the monthly payment but extend the repayment period, increasing total interest paid. Balance affordability now with the total cost over the lifetime of the loan.',
  },
];

const directoryLinks = [
  {
    url: '/#debt-loans',
    label: 'Explore all debt & loan calculators',
    description: 'From credit cards to mortgages, compare the tools that keep borrowing in check.',
  },
  {
    url: '/mortgage-calculator',
    label: 'Plan your mortgage repayments',
    description: 'Stress test UK mortgage deals and understand combined loan commitments.',
  },
  {
    url: '/net-income-uk-calculator',
    label: 'Check your net income after tax',
    description: 'See what you can comfortably afford once PAYE, NI, and pensions are deducted.',
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

function summariseLoan({ amount, rate, termYears, fees, name }) {
  const monthlyPayment = computeMonthlyPayment(amount, rate, termYears);
  const totalMonths = termYears * 12;
  const totalPaid = monthlyPayment * totalMonths + fees;
  const totalInterest = totalPaid - amount - fees;
  return {
    name,
    amount,
    rate,
    termYears,
    fees,
    monthlyPayment,
    totalPaid,
    totalInterest,
    totalMonths,
  };
}

function calculateComparison(loans) {
  const loanA = {
    name: loans?.a?.name?.trim() || 'Loan A',
    amount: parseNumber(loans?.a?.amount),
    rate: parseNumber(loans?.a?.rate),
    termYears: parseNumber(loans?.a?.term),
    fees: parseNumber(loans?.a?.fees),
  };
  const loanB = {
    name: loans?.b?.name?.trim() || 'Loan B',
    amount: parseNumber(loans?.b?.amount),
    rate: parseNumber(loans?.b?.rate),
    termYears: parseNumber(loans?.b?.term),
    fees: parseNumber(loans?.b?.fees),
  };

  const isValid =
    loanA.amount > 0 &&
    loanA.rate >= 0 &&
    loanA.termYears > 0 &&
    loanB.amount > 0 &&
    loanB.rate >= 0 &&
    loanB.termYears > 0;

  if (!isValid) {
    return { isValid: false, loanA, loanB };
  }

  const summaryA = summariseLoan(loanA);
  const summaryB = summariseLoan(loanB);
  const monthlyDifference = summaryB.monthlyPayment - summaryA.monthlyPayment;
  const totalCostDifference = summaryB.totalPaid - summaryA.totalPaid;

  return {
    isValid: true,
    loanA: summaryA,
    loanB: summaryB,
    monthlyDifference,
    totalCostDifference,
  };
}

function buildCsvData(comparison) {
  if (!comparison?.isValid) return null;
  return [
    ['Metric', comparison.loanA.name, comparison.loanB.name, 'Difference (B - A)'],
    [
      'Monthly repayment (£)',
      currencyFormatter.format(comparison.loanA.monthlyPayment),
      currencyFormatter.format(comparison.loanB.monthlyPayment),
      currencyFormatter.format(comparison.monthlyDifference),
    ],
    [
      'Total repaid (£)',
      currencyFormatter.format(comparison.loanA.totalPaid),
      currencyFormatter.format(comparison.loanB.totalPaid),
      currencyFormatter.format(comparison.totalCostDifference),
    ],
    [
      'Total interest (£)',
      currencyFormatter.format(comparison.loanA.totalInterest),
      currencyFormatter.format(comparison.loanB.totalInterest),
      currencyFormatter.format(comparison.loanB.totalInterest - comparison.loanA.totalInterest),
    ],
    [
      'Fees (£)',
      currencyFormatter.format(comparison.loanA.fees),
      currencyFormatter.format(comparison.loanB.fees),
      currencyFormatter.format(comparison.loanB.fees - comparison.loanA.fees),
    ],
    [
      'Term (months)',
      comparison.loanA.totalMonths,
      comparison.loanB.totalMonths,
      comparison.loanB.totalMonths - comparison.loanA.totalMonths,
    ],
  ];
}

function buildChartData(comparison) {
  if (!comparison?.isValid) return [];
  return [
    {
      name: `${comparison.loanA.name} total cost`,
      value: comparison.loanA.totalPaid,
      color: '#2563eb',
    },
    {
      name: `${comparison.loanB.name} total cost`,
      value: comparison.loanB.totalPaid,
      color: '#f97316',
    },
  ];
}

export default function LoanComparisonCalculatorPage() {
  const [loans, setLoans] = useState(defaultLoans);
  const [comparison, setComparison] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Loan Comparison Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Debt & Loans', url: '/#debt-loans' },
      { name: 'Loan Comparison Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const handleLoanChange = useCallback(
    (loanKey, field) => (event) => {
      const value = event.target.value;
      setLoans((prev) => ({
        ...prev,
        [loanKey]: {
          ...prev[loanKey],
          [field]: value,
        },
      }));
    },
    [],
  );

  const handleReset = useCallback(() => {
    setLoans(defaultLoans);
    setComparison(null);
    setCsvData(null);
    setHasCalculated(false);
  }, []);

  const handleCalculate = useCallback(
    (event) => {
      event.preventDefault();
      const nextComparison = calculateComparison(loans);
      setComparison(nextComparison);
      setHasCalculated(true);
      setCsvData(buildCsvData(nextComparison));
    },
    [loans],
  );

  const chartData = useMemo(() => buildChartData(comparison), [comparison]);

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
            <Heading as="h1" size="h1" weight="bold" className="text-slate-900 dark:text-slate-100">
              Loan Comparison Calculator UK
            </Heading>
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Enter the loan amounts, interest rates, fees, and terms for two borrowing options.
              Press <strong>Calculate loan comparison</strong> to see monthly repayments, true total
              costs, and which deal leaves more in your pocket.
            </p>
          </section>

          <section className="space-y-8">
            <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="space-y-2">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <Calculator className="h-5 w-5 text-sky-600" aria-hidden="true" />
                  Compare two personal loans
                </CardTitle>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  All figures use UK-style amortisation with fixed monthly repayments. Fees are added
                  to the overall cost so you can see APRC-style comparisons.
                </p>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleCalculate}>
                  <div className="grid gap-6 md:grid-cols-2">
                    {['a', 'b'].map((loanKey) => {
                      const loan = loans[loanKey];
                      const label = loanKey === 'a' ? 'Loan A details' : 'Loan B details';
                      return (
                        <div
                          key={loanKey}
                          className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40"
                        >
                          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {label}
                          </h2>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor={`${loanKey}-name`} className="text-sm font-medium">
                                Loan name
                              </Label>
                              <Input
                                id={`${loanKey}-name`}
                                value={loan.name}
                                onChange={handleLoanChange(loanKey, 'name')}
                                placeholder={loanKey === 'a' ? 'e.g. Bank A personal loan' : 'e.g. Credit union offer'}
                                autoComplete="off"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${loanKey}-amount`} className="text-sm font-medium">
                                Amount borrowed (£)
                              </Label>
                              <Input
                                id={`${loanKey}-amount`}
                                value={loan.amount}
                                onChange={handleLoanChange(loanKey, 'amount')}
                                inputMode="decimal"
                                placeholder="e.g. 15,000"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${loanKey}-rate`} className="text-sm font-medium">
                                Interest rate (% APR)
                              </Label>
                              <Input
                                id={`${loanKey}-rate`}
                                value={loan.rate}
                                onChange={handleLoanChange(loanKey, 'rate')}
                                inputMode="decimal"
                                placeholder="e.g. 5.9"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${loanKey}-term`} className="text-sm font-medium">
                                Term length (years)
                              </Label>
                              <Input
                                id={`${loanKey}-term`}
                                value={loan.term}
                                onChange={handleLoanChange(loanKey, 'term')}
                                inputMode="decimal"
                                placeholder="e.g. 4"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`${loanKey}-fees`} className="text-sm font-medium">
                                Arrangement fees (£)
                              </Label>
                              <Input
                                id={`${loanKey}-fees`}
                                value={loan.fees}
                                onChange={handleLoanChange(loanKey, 'fees')}
                                inputMode="decimal"
                                placeholder="e.g. 125"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate loan comparison
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
                  Enter the loan details for both options, then press{' '}
                  <strong>Calculate loan comparison</strong> to reveal the monthly payments, total
                  costs, and savings insights. Results stay hidden until you choose to calculate.
                </CardContent>
              </Card>
            )}

            {hasCalculated && comparison && !comparison.isValid && (
              <Card className="border border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
                <CardContent className="py-6 text-sm leading-relaxed">
                  Please check the figures. Ensure each loan has an amount above £0, a term in years,
                  and a percentage rate (0% is allowed). Once corrected, calculate again to view the
                  comparison.
                </CardContent>
              </Card>
            )}

            {hasCalculated && comparison?.isValid && (
              <div className="space-y-6">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <Heading
                    as="h2"
                    size="h2"
                    weight="semibold"
                    className="text-slate-900 dark:text-slate-100"
                  >
                    Loan comparison results
                  </Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName="loan-comparison-calculator"
                    title="Loan Comparison Calculator Results"
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                        <Scale className="h-5 w-5 text-sky-600" aria-hidden="true" />
                        Monthly repayment comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                      {[comparison.loanA, comparison.loanB].map((loan) => (
                        <div
                          key={loan.name}
                          className="rounded-lg border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/50"
                        >
                          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                            {loan.name}
                          </p>
                          <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">
                            Monthly repayment
                          </p>
                          <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                            {currencyFormatter.format(loan.monthlyPayment)}
                          </p>
                          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                            Total repayable: {currencyFormatter.format(loan.totalPaid)}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Interest paid: {currencyFormatter.format(loan.totalInterest)}
                          </p>
                        </div>
                      ))}
                      <div className="md:col-span-2 rounded-lg border border-blue-200 bg-blue-50/60 p-4 dark:border-blue-900 dark:bg-blue-950/40">
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                          Monthly difference
                        </p>
                        <p className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                          {currencyFormatter.format(Math.abs(comparison.monthlyDifference))}{' '}
                          {comparison.monthlyDifference > 0 ? 'more' : 'less'} per month with{' '}
                          {comparison.monthlyDifference > 0
                            ? comparison.loanB.name
                            : comparison.loanA.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                        <LineChart className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                        Lifetime cost and key insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Total cost difference:{' '}
                        <strong>
                          {currencyFormatter.format(Math.abs(comparison.totalCostDifference))}
                        </strong>{' '}
                        {comparison.totalCostDifference > 0 ? 'more' : 'less'} with{' '}
                        {comparison.totalCostDifference > 0
                          ? comparison.loanB.name
                          : comparison.loanA.name}
                        .
                      </p>
                      <p>
                        {comparison.loanA.name} spans {comparison.loanA.totalMonths} monthly payments,
                        while {comparison.loanB.name} finishes after {comparison.loanB.totalMonths}{' '}
                        months.
                      </p>
                      <p>
                        Consider fee amortisation: {comparison.loanA.name} adds{' '}
                        {currencyFormatter.format(comparison.loanA.fees)} in fees;{' '}
                        {comparison.loanB.name} adds{' '}
                        {currencyFormatter.format(comparison.loanB.fees)}.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                      <LineChart className="h-5 w-5 text-sky-600" aria-hidden="true" />
                      Total repayment visual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Suspense
                      fallback={
                        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                          Loading comparison chart…
                        </div>
                      }
                    >
                      <ResultBreakdownChart
                        data={chartData}
                        title="Loan comparison total repayment chart"
                      />
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
                  <Calculator className="h-5 w-5 text-sky-600" aria-hidden="true" />
                  Borrowing confidence boost
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                <p>{emotionalMessage}</p>
                <p className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50/70 p-3 text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <Quote className="h-5 w-5 flex-shrink-0 text-sky-600 dark:text-sky-400" aria-hidden="true" />
                  <span>
                    “{emotionalQuote.text}” — <em>{emotionalQuote.author}</em>
                  </span>
                </p>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-slate-100">
                  Other helpful tools
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DirectoryLinks links={directoryLinks} />
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
