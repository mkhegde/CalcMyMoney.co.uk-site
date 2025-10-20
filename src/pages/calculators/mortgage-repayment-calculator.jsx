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
import { Calculator, PiggyBank, TrendingDown, Quote, BookOpen, LineChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/mortgage-repayment-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-repayment-calculator';
const pageTitle = 'Mortgage Repayment Calculator UK | Plan Overpayments & Payoff';
const metaDescription =
  'Use our UK mortgage repayment calculator to plan your mortgage allocation, test repayment scenarios, and understand how overpayments change the mortgage repayment schedule.';
const keywords = getMappedKeywords('Mortgage Repayment Calculator');

const faqItems = [
  {
    question: 'How do extra payments affect my mortgage?',
    answer:
      'Extra payments reduce the principal faster, shorten the term, and cut total interest. The calculator shows the new payoff date after applying your extra amount.',
  },
  {
    question: 'Can I model interest-only periods?',
    answer:
      'For interest-only stages, set the term to the total loan length and use the base payment to reflect interest-only payments. Then add overpayments to estimate principal reductions.',
  },
  {
    question: 'How often should I review my mortgage repayment plan?',
    answer:
      'Review when your rate changes, after remortgaging, or when you receive bonuses. Regular checks help identify whether overpayments remain worthwhile or if you should re-fix your rate.',
  },
];

const emotionalMessage =
  'Every extra payment is a step closer to mortgage freedom. Use this calculator to visualize your accelerated payoff and stay motivated on your journey to owning your home outright.';
const emotionalQuote = {
  text: 'The best investment on Earth is earth.',
  author: 'Louis Glickman',
};

const directoryLinks = [
  {
    url: '/#property-mortgage',
    label: 'Explore all property & mortgage calculators',
    description: 'From stamp duty to rental yield, plan your property investments.',
  },
  {
    url: '/mortgage-calculator',
    label: 'Plan your mortgage repayments',
    description: 'Stress test UK mortgage deals and understand combined loan commitments.',
  },
  {
    url: '/remortgage-calculator',
    label: 'Compare remortgage deals',
    description: 'Find out if remortgaging could save you money on your monthly payments.',
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

const calculateSchedule = ({ loanAmount, interestRate, termYears, extraPayment }) => {
  const monthlyRate = interestRate / 100 / 12;
  const months = termYears * 12;
  const basePayment =
    monthlyRate === 0
      ? loanAmount / months
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  let balance = loanAmount;
  const schedule = [];
  let totalInterest = 0;
  let month = 0;

  while (balance > 0 && month < 1000) {
    month += 1;
    const interest = balance * monthlyRate;
    let principal = basePayment + extraPayment - interest;
    if (principal <= 0) {
      principal = 0;
    }
    if (principal > balance) {
      principal = balance;
    }
    balance -= principal;
    totalInterest += interest;
    schedule.push({
      month,
      payment: principal + interest,
      interest,
      principal,
      balance: Math.max(balance, 0),
    });
  }

  const totalPaid = schedule.reduce((sum, entry) => sum + entry.payment, 0);
  return {
    schedule,
    totalInterest,
    totalPaid,
    monthsToClear: schedule.length,
    monthlyPayment: basePayment + extraPayment,
    basePayment,
  };
};

function buildCsvData(results, inputs) {
  if (!results) return null;
  const rows = [
    ['Metric', 'Value'],
    ['Loan Amount (£)', currencyFormatter.format(parseNumber(inputs.loanAmount))],
    ['Interest Rate (%)', `${inputs.interestRate}%`],
    ['Term (Years)', inputs.termYears],
    ['Extra Payment (£/month)', currencyFormatter.format(parseNumber(inputs.extraPayment))],
    [],
    ['Monthly Payment (£)', currencyFormatter.format(results.monthlyPayment)],
    ['Total Interest (£)', currencyFormatter.format(results.totalInterest)],
    ['Total Paid (£)', currencyFormatter.format(results.totalPaid)],
    ['Months to Clear', results.monthsToClear],
    [],
    ['Month', 'Payment (£)', 'Interest (£)', 'Principal (£)', 'Balance (£)'],
  ];
  results.schedule.forEach((row) => {
    rows.push([
      row.month,
      currencyFormatter.format(row.payment),
      currencyFormatter.format(row.interest),
      currencyFormatter.format(row.principal),
      currencyFormatter.format(row.balance),
    ]);
  });
  return rows;
}

function buildChartData(results, inputs) {
  if (!results) return [];
  return [
    { name: 'Principal Repaid', value: parseNumber(inputs.loanAmount), color: '#10b981' },
    { name: 'Total Interest', value: results.totalInterest, color: '#3b82f6' },
  ].filter((segment) => segment.value > 0);
}

export default function MortgageRepaymentCalculatorPage() {
  const [inputs, setInputs] = useState({
    loanAmount: '275,000',
    interestRate: '4.9',
    termYears: '25',
    extraPayment: '100',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Mortgage Repayment Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property & Mortgage Calculators', url: '/calculators#property-mortgage' },
      { name: 'Mortgage Repayment Calculator', url: pagePath },
    ],
    faq: faqItems,
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
      const computedResults = calculateSchedule({
        loanAmount: parseNumber(inputs.loanAmount),
        interestRate: parseNumber(inputs.interestRate),
        termYears: parseNumber(inputs.termYears),
        extraPayment: parseNumber(inputs.extraPayment),
      });
      setResults(computedResults);
      setHasCalculated(true);
      setCsvData(buildCsvData(computedResults, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs({
      loanAmount: '275,000',
      interestRate: '4.9',
      termYears: '25',
      extraPayment: '100',
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Mortgage Repayment Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Measure how payments split between interest and principal, see how extra payments
              shorten your term, and plan a faster mortgage payoff strategy.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<PiggyBank className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-indigo-600 dark:text-indigo-300"
            borderColor="border-indigo-200 dark:border-indigo-800/60"
            bgColor="bg-indigo-50/70 dark:bg-indigo-950/40"
            textColor="text-indigo-900 dark:text-indigo-100"
            footerColor="text-indigo-700 dark:text-indigo-300"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator
                    className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                    aria-hidden="true"
                  />
                  Mortgage Inputs
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
                        placeholder="e.g. 275,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="interestRate">Interest rate (%)</Label>
                      <Input
                        id="interestRate"
                        inputMode="decimal"
                        value={inputs.interestRate}
                        onChange={handleInputChange('interestRate')}
                        placeholder="e.g. 4.9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="termYears">Term (years)</Label>
                      <Input
                        id="termYears"
                        inputMode="numeric"
                        value={inputs.termYears}
                        onChange={handleInputChange('termYears')}
                        placeholder="e.g. 25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="extraPayment">Extra payment (£/month)</Label>
                      <Input
                        id="extraPayment"
                        inputMode="decimal"
                        value={inputs.extraPayment}
                        onChange={handleInputChange('extraPayment')}
                        placeholder="e.g. 100"
                      />
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Applied in addition to the standard repayment. Helps you see new payoff
                        dates and interest savings.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate Repayment
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
                    Enter your mortgage details and any extra payments, then press{' '}
                    <span className="font-semibold">Calculate Repayment</span> to see your estimated
                    monthly payments, total interest, and payoff schedule.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-200"
                          aria-hidden="true"
                        />
                        Repayment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Monthly payment
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.monthlyPayment)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Total interest
                        </p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalInterest)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Total paid</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.totalPaid)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">
                          Months to clear
                        </p>
                        <p className="text-2xl font-semibold">{results.monthsToClear}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="mortgage-repayment-schedule"
                          title="Mortgage Repayment Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <LineChart
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        Principal vs Interest Breakdown
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
                        <ResultBreakdownChart
                          data={chartData}
                          title="Mortgage Repayment Breakdown"
                        />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen
                          className="h-5 w-5 text-indigo-600 dark:text-indigo-300"
                          aria-hidden="true"
                        />
                        First 12 Months Amortisation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 dark:bg-slate-900 text-xs uppercase tracking-wide">
                          <tr>
                            <th className="px-4 py-2">Month</th>
                            <th className="px-4 py-2">Payment</th>
                            <th className="px-4 py-2">Interest</th>
                            <th className="px-4 py-2">Principal</th>
                            <th className="px-4 py-2">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {results.schedule.slice(0, 12).map((entry) => (
                            <tr
                              key={entry.month}
                              className="border-b border-slate-100 dark:border-slate-800 text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-900/40"
                            >
                              <td className="px-4 py-2 font-medium">{entry.month}</td>
                              <td className="px-4 py-2">
                                {currencyFormatter.format(entry.payment)}
                              </td>
                              <td className="px-4 py-2 text-rose-600 dark:text-rose-300">
                                {currencyFormatter.format(entry.interest)}
                              </td>
                              <td className="px-4 py-2 text-emerald-600 dark:text-emerald-300">
                                {currencyFormatter.format(entry.principal)}
                              </td>
                              <td className="px-4 py-2">
                                {currencyFormatter.format(entry.balance)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {results.schedule.length > 12 && (
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                          Export the CSV to review the full amortisation schedule and track every
                          repayment until the balance reaches zero.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
