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
  CreditCard,
  BarChart3,
  Shield,
  Quote,
  BookOpen,
  LineChart,
} from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/personal-loan-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/personal-loan-calculator';
const pageTitle = 'Personal Loan Calculator UK | Monthly Payments & Interest';
const metaDescription =
  'Use our UK personal loan calculator to model monthly payments, compare terms, and explore interest rate scenarios before you apply.';
const keywords = getMappedKeywords('Personal Loan Calculator');

const personalLoanFaqs = [
  {
    question: 'How do lenders calculate monthly payments?',
    answer:
      'Most personal loans use fixed interest with equal monthly instalments. The personal loan calculator applies the amortisation formula so you can compare offers instantly.',
  },
  {
    question: 'What happens if I make extra payments?',
    answer:
      'Overpayments reduce the balance faster. The loan repayment calculator shows how a regular overpayment shaves time and interest from the schedule.',
  },
  {
    question: 'Should I include arrangement fees?',
    answer:
      'Yes. If the lender charges an upfront or financed fee, include it here so the loan payment calculator reflects the true cost of borrowing.',
  },
];

const emotionalMessage =
  'Taking out a personal loan is a big decision. Use this calculator to understand your repayment options, compare interest costs, and borrow with confidence.';
const emotionalQuote = {
  text: 'The rich invest in time, the poor invest in money.',
  author: 'Warren Buffett',
};

const directoryLinks = [
  {
    url: '/#debt-loans',
    label: 'Explore all debt & loan calculators',
    description: 'Plan repayments, understand borrowing costs, and accelerate debt freedom.',
  },
  {
    url: '/loan-comparison-calculator',
    label: 'Loan Comparison Calculator',
    description: 'Compare two personal loan offers side-by-side.',
  },
  {
    url: '/loan-repayment-calculator',
    label: 'Loan Repayment Calculator',
    description: 'Model monthly payments, total interest, and payoff dates.',
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

const calculateMonthlyPayment = (principal, annualRate, termMonths) => {
  const rate = Math.max(parseNumber(annualRate), 0) / 100 / 12;
  const months = Math.max(parseNumber(termMonths), 0);
  if (months === 0) return 0;

  if (rate === 0) {
    return principal / months;
  }

  const factor = Math.pow(1 + rate, months);
  return (principal * rate * factor) / (factor - 1);
};

const buildAmortisation = ({ loanAmount, annualRate, termYears, fees, extraPayment }) => {
  const principal = Math.max(parseNumber(loanAmount), 0);
  const totalFees = Math.max(parseNumber(fees), 0);
  const financedPrincipal = principal + totalFees;
  const months = Math.max(Math.round(parseNumber(termYears) * 12), 0);
  const regularPayment = calculateMonthlyPayment(financedPrincipal, annualRate, months);
  const overpayment = Math.max(parseNumber(extraPayment), 0);

  let balance = financedPrincipal;
  let totalInterest = 0;
  let month = 0;

  const rows = [];

  const monthlyRate = Math.max(parseNumber(annualRate), 0) / 100 / 12;

  while (balance > 0 && month < months + 1_000) {
    month += 1;
    const interest = balance * monthlyRate;
    let principalPaid = regularPayment + overpayment - interest;
    if (principalPaid > balance) {
      principalPaid = balance;
    }

    balance -= principalPaid;
    totalInterest += interest;

    rows.push({
      month,
      payment: principalPaid + interest,
      interest,
      principal: principalPaid,
      balance: Math.max(balance, 0),
    });

    if (balance <= 0) {
      break;
    }
  }

  return {
    schedule: rows,
    monthlyPayment: regularPayment,
    totalInterest,
    termMonths: rows.length,
    totalCost: financedPrincipal + (rows.length > 0 ? totalInterest : 0),
    fees: totalFees,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  const csvRows = [
    ['Metric', 'Value'],
    ['Loan Amount (£)', currencyFormatter.format(parseNumber(inputs.loanAmount))],
    ['Interest Rate (APR %) (£)', `${inputs.annualRate}%`],
    ['Term (Years)', inputs.termYears],
    ['Fees (added to loan) (£)', currencyFormatter.format(parseNumber(inputs.fees))],
    ['Monthly Overpayment (£)', currencyFormatter.format(parseNumber(inputs.extraPayment))],
    [],
    ['Standard Monthly Payment (£)', currencyFormatter.format(results.monthlyPayment)],
    [
      'Monthly Payment with Overpayment (£)',
      currencyFormatter.format(results.monthlyPayment + parseNumber(inputs.extraPayment)),
    ],
    ['Total Interest (£)', currencyFormatter.format(results.totalInterest)],
    ['Total Cost (inc. fees) (£)', currencyFormatter.format(results.totalCost)],
    ['Loan Cleared In (Months)', results.termMonths],
    ['Loan Cleared In (Years)', (results.termMonths / 12).toFixed(1)],
    [],
    ['Month', 'Payment (£)', 'Interest (£)', 'Principal (£)', 'Balance (£)'],
  ];
  results.schedule.forEach((row) => {
    csvRows.push([
      row.month,
      currencyFormatter.format(row.payment),
      currencyFormatter.format(row.interest),
      currencyFormatter.format(row.principal),
      currencyFormatter.format(row.balance),
    ]);
  });
  return csvRows;
}

function buildChartData(results, inputs) {
  if (!results) return [];
  const principalPaid = parseNumber(inputs.loanAmount) + parseNumber(inputs.fees);
  return [
    { name: 'Principal Paid', value: principalPaid, color: '#10b981' },
    { name: 'Total Interest', value: results.totalInterest, color: '#3b82f6' },
  ].filter((segment) => segment.value > 0);
}

export default function PersonalLoanCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: '15,000',
    annualRate: '8.5',
    termYears: '4',
    fees: '0',
    extraPayment: '50',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Personal Loan Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Debt & Loans Calculators', url: '/calculators#debt-loans' },
      { name: 'Personal Loan Calculator', url: pagePath },
    ],
    faq: personalLoanFaqs,
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
      const computedResults = buildAmortisation(inputs);
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      loanAmount: '15,000',
      annualRate: '8.5',
      termYears: '4',
      fees: '0',
      extraPayment: '50',
    });
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results, inputs), [results, inputs]);

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
                Personal Loan Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Compare terms, test overpayments, and understand the lifetime cost of your personal
              loan before you apply.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<CreditCard className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-950/40"
            textColor="text-emerald-900 dark:text-emerald-100"
            footerColor="text-emerald-700 dark:text-emerald-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-1">
                    <div className="space-y-2">
                      <Label htmlFor="loanAmount">Loan amount (£)</Label>
                      <Input
                        id="loanAmount"
                        inputMode="decimal"
                        value={inputs.loanAmount}
                        onChange={handleInputChange('loanAmount')}
                        placeholder="e.g. 15,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="annualRate">Interest rate (APR %)</Label>
                      <Input
                        id="annualRate"
                        inputMode="decimal"
                        value={inputs.annualRate}
                        onChange={handleInputChange('annualRate')}
                        placeholder="e.g. 8.5"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="numeric"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fees">Fees (added to loan) (£)</Label>
                      <Input
                        id="fees"
                        inputMode="decimal"
                        value={inputs.fees}
                        onChange={handleInputChange('fees')}
                        placeholder="e.g. 0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraPayment">Monthly overpayment (£)</Label>
                      <Input
                        id="extraPayment"
                        inputMode="decimal"
                        value={inputs.extraPayment}
                        onChange={handleInputChange('extraPayment')}
                        placeholder="e.g. 50"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Loan
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your loan details, then press{' '}
                    <span className="font-semibold">Calculate Loan</span> to see your estimated
                    monthly payments and full repayment schedule.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Shield
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-200"
                          aria-hidden="true"
                        />
                        Loan Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Standard monthly payment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Monthly with overpayment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(
                            results.monthlyPayment + parseNumber(inputs.extraPayment)
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total interest
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Total cost (inc. fees)
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalCost)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">
                          Loan cleared in
                        </p>
                        <p className="text-2xl font-semibold">
                          {formatMonthsToYears(results.termMonths)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="personal-loan-repayment"
                          title="Personal Loan Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        Loan Breakdown
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
                        <ResultBreakdownChart data={chartData} title="Personal Loan Breakdown" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-emerald-600 dark:text-emerald-300"
                          aria-hidden="true"
                        />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        This calculator provides an estimate based on your inputs. Actual loan terms
                        and repayments may vary based on your lender, credit score, and any
                        additional fees or charges.
                      </p>
                      <p>
                        Always review your loan agreement carefully before committing and consider
                        seeking independent financial advice.
                      </p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={personalLoanFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
