import React, { Suspense, useMemo, useState } from 'react';
import { Calculator, TrendingUp, Table as TableIcon, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = [
  'loan amortization calculator',
  'loan amortization',
  'loan amortization schedule',
  'amortization schedule',
  'amortization calculator',
  'loan amortization schedule calculator',
];

const metaDescription =
  'Model monthly repayments with the UK-focused amortisation calculator, create a clear loan amortization schedule, and understand interest versus principal at every step.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/amortization-calculator';
const pagePath = '/calculators/amortization-calculator';
const pageTitle = 'Amortization Calculator | UK Loan Amortisation Schedule';

const defaultInputs = {
  loanAmount: '250,000',
  interestRate: '4.50',
  termYears: '25',
};

const amortisationFaqs = [
  {
    question: 'What does the amortisation calculator show?',
    answer:
      'The amortisation calculator reveals monthly repayments, the total interest payable, and a full amortisation schedule so you can see how each instalment chips away at your balance.',
  },
  {
    question: 'Is the schedule aligned with UK mortgage practice?',
    answer:
      'Yes. It assumes a capital-and-interest repayment mortgage with interest charged monthly on the remaining balance, matching how mainstream UK lenders structure repayments.',
  },
  {
    question: 'How can I reduce the total interest paid?',
    answer:
      'Reducing the mortgage term or making lump-sum overpayments shortens the schedule and cuts interest dramatically. Always confirm fees and early repayment charges with your lender before making changes.',
  },
];

const emotionalMessage =
  'Watching your balance fall year after year is the reminder that today’s effort secures tomorrow’s freedom. Set your repayment plan, stay the course, and celebrate every milestone.';

const emotionalQuote = {
  text: 'Compound interest is the eighth wonder of the world. He who understands it, earns it; he who doesn’t, pays it.',
  author: 'Albert Einstein',
};

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

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function calculateAmortisation(principal, annualRatePercent, termYears) {
  if (principal <= 0 || annualRatePercent < 0 || termYears <= 0) {
    return null;
  }

  const totalPayments = Math.round(termYears * 12);
  const monthlyRate = annualRatePercent / 100 / 12;

  let monthlyPayment = 0;
  if (monthlyRate === 0) {
    monthlyPayment = principal / totalPayments;
  } else {
    const factor = Math.pow(1 + monthlyRate, totalPayments);
    monthlyPayment = (principal * monthlyRate * factor) / (factor - 1);
  }

  const schedule = [];
  let balance = principal;
  let totalInterest = 0;

  for (let paymentNumber = 1; paymentNumber <= totalPayments; paymentNumber += 1) {
    const interestPayment = monthlyRate === 0 ? 0 : balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance = Math.max(balance - principalPayment, 0);
    totalInterest += interestPayment;

    schedule.push({
      paymentNumber,
      paymentAmount: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance,
    });
  }

  const totalPaid = monthlyPayment * totalPayments;

  return {
    principal,
    monthlyPayment,
    totalInterest,
    totalPaid,
    schedule,
    totalPayments,
  };
}

export default function AmortizationCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Amortization Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Loan Calculators', url: '/calculators#loans' },
      { name: 'Amortization Calculator', url: pagePath },
    ],
    faq: amortisationFaqs,
  });

  const chartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Principal repaid', value: calculation.principal, color: '#1d4ed8' },
      { name: 'Interest paid', value: calculation.totalInterest, color: '#22d3ee' },
    ];
  }, [calculation, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const principal = parseNumber(inputs.loanAmount);
    const annualRate = parseNumber(inputs.interestRate);
    const termYears = parseNumber(inputs.termYears);

    const result = calculateAmortisation(principal, annualRate, termYears);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const header = ['Payment number', 'Payment (£)', 'Principal (£)', 'Interest (£)', 'Balance (£)'];
    const rows = result.schedule.map((row) => [
      row.paymentNumber,
      formatCurrency(row.paymentAmount),
      formatCurrency(row.principal),
      formatCurrency(row.interest),
      formatCurrency(row.balance),
    ]);

    setCsvData([header, ...rows]);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setCalculation(null);
    setCsvData(null);
    setHasCalculated(false);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/10 text-blue-700 dark:bg-blue-500/20 dark:text-blue-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Amortisation Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Use this loan amortisation calculator to map every monthly payment, compare interest versus
              principal, and download a full loan amortization schedule tailored to UK repayment mortgages.
              Adjust the figures to plan remortgaging, track outstanding balances, and stay motivated as the
              debt reduces.
            </p>
          </header>

          <section className="rounded-xl border border-blue-100 bg-white p-6 shadow-sm dark:border-blue-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Stay the course with every repayment
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-blue-200 bg-blue-50/70 p-4 text-sm text-blue-900 shadow-sm dark:border-blue-800/60 dark:bg-blue-950/40 dark:text-blue-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-blue-700 dark:text-blue-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                  Loan inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="loanAmount">Loan amount (£)</Label>
                    <Input
                      id="loanAmount"
                      inputMode="decimal"
                      value={inputs.loanAmount}
                      onChange={handleInputChange('loanAmount')}
                      placeholder="e.g. 250,000"
                      aria-describedby="loan-amount-help"
                    />
                    <p id="loan-amount-help" className="text-xs text-slate-500 dark:text-slate-400">
                      Enter the outstanding mortgage or loan balance.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">Interest rate (% APR)</Label>
                    <Input
                      id="interestRate"
                      inputMode="decimal"
                      value={inputs.interestRate}
                      onChange={handleInputChange('interestRate')}
                      placeholder="e.g. 4.50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="termYears">Remaining term (years)</Label>
                    <Input
                      id="termYears"
                      inputMode="decimal"
                      value={inputs.termYears}
                      onChange={handleInputChange('termYears')}
                      placeholder="e.g. 25"
                    />
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate repayments
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your figures and press <span className="font-semibold">Calculate repayments</span>{' '}
                    to see monthly payments, a downloadable amortisation schedule, and a visual breakdown of
                    principal versus interest.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please check the inputs. The amortisation schedule needs a positive loan amount, a term
                    in years, and an interest rate that is zero or higher.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                        Repayment summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
                        <p className="text-sm text-blue-900 dark:text-blue-200">Monthly payment</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.monthlyPayment)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total interest</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalInterest)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total repaid</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalPaid)}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Across {calculation.totalPayments} monthly payments
                        </p>
                      </div>
                      <div className="rounded-lg border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/50 dark:bg-blue-950/40">
                        <p className="text-sm text-blue-900 dark:text-blue-200">Original borrowing</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.principal)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="amortization-schedule"
                          title="Amortisation calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                        Principal versus interest
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
                        <ResultBreakdownChart
                          data={chartData}
                          title="Principal and interest repayment breakdown"
                        />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TableIcon className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                        Amortisation schedule
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        Scroll horizontally on smaller screens to review every monthly entry. The figures are
                        rounded to two decimals, so the final row may include a balancing adjustment.
                      </p>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                          <thead className="bg-slate-100 text-left text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            <tr>
                              <th scope="col" className="px-3 py-2">
                                Payment
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Payment (£)
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Principal (£)
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Interest (£)
                              </th>
                              <th scope="col" className="px-3 py-2">
                                Balance (£)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                            {calculation.schedule.map((row) => (
                              <tr key={row.paymentNumber} className="bg-white odd:bg-slate-50 dark:bg-slate-900 dark:odd:bg-slate-800/60">
                                <td className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">
                                  {row.paymentNumber}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(row.paymentAmount)}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(row.principal)}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(row.interest)}
                                </td>
                                <td className="px-3 py-2 text-slate-600 dark:text-slate-300">
                                  {formatCurrency(row.balance)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Amortisation insights
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Understanding your loan amortization schedule gives you full control over future decisions. Track
              the tipping point where interest outgoings fade, experiment with shorter terms, and benchmark
              offers before you remortgage. Pair this with our mortgage and loan comparison tools to map the
              path to debt freedom.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={amortisationFaqs} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
