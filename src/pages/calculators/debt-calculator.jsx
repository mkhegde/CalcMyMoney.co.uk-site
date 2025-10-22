import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, TrendingDown, AlertCircle, PieChart } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Debt Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/debt-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Use our UK debt calculator to map repayment dates, interest costs, and the impact of extra payments so you can clear balances with confidence.';

const defaultInputs = {
  balance: '12500',
  annualRate: '19.9',
  monthlyPayment: '320',
  extraPayment: '50',
};

const MAX_MONTHS = 600;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const formatDuration = (months) => {
  if (!Number.isFinite(months) || months <= 0) return '0 months';
  const totalMonths = Math.ceil(months);
  const years = Math.floor(totalMonths / 12);
  const remainingMonths = totalMonths % 12;
  if (years <= 0) return `${numberFormatter.format(remainingMonths)} months`;
  if (remainingMonths === 0) return `${numberFormatter.format(years)} years`;
  return `${numberFormatter.format(years)} yrs ${numberFormatter.format(remainingMonths)} mths`;
};

const computeDebtPayoff = ({ balance, rate, payment, extraPayment }) => {
  const monthlyRate = rate > 0 ? rate / 100 / 12 : 0;
  const scheduledPayment = payment + extraPayment;

  if (balance <= 0) {
    return {
      valid: false,
      message: 'Enter an outstanding balance to start planning your repayment strategy.',
    };
  }

  if (scheduledPayment <= 0) {
    return {
      valid: false,
      message: 'Monthly repayments must be greater than £0 to reduce your balance.',
    };
  }

  let currentBalance = balance;
  let month = 0;
  let totalInterest = 0;
  let totalPrincipal = 0;
  const schedule = [];

  while (currentBalance > 0 && month < MAX_MONTHS) {
    const interestPayment = monthlyRate > 0 ? currentBalance * monthlyRate : 0;
    let monthlyPayment = scheduledPayment;

    if (monthlyPayment <= interestPayment && monthlyRate > 0) {
      return {
        valid: false,
        message:
          'Monthly repayments are not high enough to cover the interest being charged. Increase your payment amount to see a payoff date.',
      };
    }

    const maxPayment = currentBalance + interestPayment;
    if (monthlyPayment > maxPayment) {
      monthlyPayment = maxPayment;
    }

    const principalPayment = monthlyPayment - interestPayment;
    currentBalance = Math.max(currentBalance - principalPayment, 0);
    totalInterest += interestPayment;
    totalPrincipal += principalPayment;
    month += 1;

    schedule.push({
      month,
      payment: monthlyPayment,
      interest: interestPayment,
      principal: principalPayment,
      remaining: currentBalance,
    });
  }

  if (currentBalance > 0) {
    return {
      valid: false,
      message:
        'We could not calculate a payoff date within 50 years. Please increase your payment amount or review the interest rate.',
      schedule,
    };
  }

  const payoffMonths = month;
  const totalPaid = totalPrincipal + totalInterest;

  return {
    valid: true,
    payoffMonths,
    totalInterest,
    totalPrincipal,
    totalPaid,
    schedule,
  };
};

const debtCalculatorFaqs = [
  {
    question: 'How does this UK debt calculator work?',
    answer:
      'We use your balance, APR, and planned repayments to project interest charges each month. The calculator follows UK credit card and personal loan conventions with interest compounded monthly so you can see when the balance will reach £0.',
  },
  {
    question: 'Can I include promotional or balance transfer rates?',
    answer:
      'Yes. Enter the introductory APR and the amount you plan to repay each month. When the deal ends you can update the rate and recalculate to see how the new APR affects your payoff time.',
  },
  {
    question: 'What if my repayments are below the minimum agreed with the lender?',
    answer:
      'If your repayment is set below the contractual minimum, the calculator will flag that the balance is not reducing. Increase the payment until you see a valid payoff date, or speak with your lender about a repayment plan.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Jump to every UK money tool available on Calc My Money.',
  },
  {
    label: 'Debt & borrowing calculators',
    url: '/#debt-loans',
    description: 'Compare repayment planners designed for loans, cards, and overdrafts.',
  },
  {
    label: 'Savings & emergency fund tools',
    url: '/emergency-fund-calculator',
    description: 'Balance debt repayments with a healthy emergency buffer.',
  },
];

const relatedCalculators = [
  {
    name: 'Debt to Income Ratio Calculator',
    url: '/debt-to-income-ratio-calculator',
    description: 'See how much of your monthly pay is absorbed by repayments.',
  },
  {
    name: 'Loan Repayment Calculator',
    url: '/loan-repayment-calculator',
    description: 'Compare UK personal loan costs and amortisation schedules.',
  },
  {
    name: 'Emergency Fund Calculator',
    url: '/emergency-fund-calculator',
    description: 'Plan a safety net alongside your debt freedom journey.',
  },
];

const webPageSchema = createCalculatorWebPageSchema({
  name: CALCULATOR_NAME,
  description: metaDescription,
  url: canonicalUrl,
  keywords,
});

const breadcrumbSchema = createCalculatorBreadcrumbs({
  name: CALCULATOR_NAME,
  url: canonicalUrl,
});

export default function DebtCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const payload = {
      balance: sanitiseNumber(inputs.balance),
      rate: sanitiseNumber(inputs.annualRate),
      payment: sanitiseNumber(inputs.monthlyPayment),
      extraPayment: sanitiseNumber(inputs.extraPayment),
    };

    const outcome = computeDebtPayoff(payload);
    setResults({ ...outcome });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results || !results.valid) return [];
    return [
      {
        name: 'Principal repaid',
        value: results.totalPrincipal,
        color: '#22c55e',
      },
      {
        name: 'Interest paid',
        value: results.totalInterest,
        color: '#f97316',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results || !results.valid || !Array.isArray(results.schedule)) {
      return null;
    }
    return [
      ['Month', 'Payment (£)', 'Interest (£)', 'Principal (£)', 'Remaining balance (£)'],
      ...results.schedule.map((entry) => [
        entry.month,
        entry.payment.toFixed(2),
        entry.interest.toFixed(2),
        entry.principal.toFixed(2),
        entry.remaining.toFixed(2),
      ]),
    ];
  }, [results]);

  const faqStructuredData = faqSchema(debtCalculatorFaqs);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Personal Debt Planner`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${CALCULATOR_NAME} | Personal Debt Planner`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${CALCULATOR_NAME} | Personal Debt Planner`} />
        <meta name="twitter:description" content={metaDescription} />
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Debt Calculator
          </Heading>
          <p className="calculator-hero__description">
            Map out a clear repayment plan, understand the cost of interest, and stay motivated as
            your outstanding balance falls month by month.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Small wins add up quickly"
          message="Short bursts of focused repayments can transform seemingly unmanageable balances.
            Visualise the finish line and create an action plan you can keep coming back to."
          quote="A goal without a plan is just a wish."
          author="Antoine de Saint-Exupéry"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Debt inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="balance" className="text-sm font-medium">
                    Outstanding balance (£)
                  </Label>
                  <Input
                    id="balance"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.balance}
                    onChange={handleInputChange('balance')}
                    placeholder="e.g., 12,500"
                    aria-describedby="balance-help"
                  />
                  <p id="balance-help" className="mt-1 text-xs text-slate-500">
                    Enter the total balance you want to repay, excluding any new spending.
                  </p>
                </div>
                <div>
                  <Label htmlFor="annualRate" className="text-sm font-medium">
                    Annual interest rate (APR %)
                  </Label>
                  <Input
                    id="annualRate"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="99"
                    step="0.01"
                    value={inputs.annualRate}
                    onChange={handleInputChange('annualRate')}
                    placeholder="e.g., 19.9"
                  />
                </div>
                <div>
                  <Label htmlFor="monthlyPayment" className="text-sm font-medium">
                    Monthly repayment (£)
                  </Label>
                  <Input
                    id="monthlyPayment"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.monthlyPayment}
                    onChange={handleInputChange('monthlyPayment')}
                    placeholder="e.g., 320"
                  />
                </div>
                <div>
                  <Label htmlFor="extraPayment" className="text-sm font-medium">
                    Extra monthly payment (£)
                  </Label>
                  <Input
                    id="extraPayment"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.extraPayment}
                    onChange={handleInputChange('extraPayment')}
                    placeholder="e.g., 50"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Optional overpayment that will be added to your standard repayment each month.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    Calculate
                  </Button>
                  <Button type="button" variant="outline" className="flex-1" onClick={handleReset}>
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {showResults ? (
            <div className="space-y-6">
              <Card className="border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-rose-900 dark:text-rose-100">
                    <PiggyBank className="h-5 w-5" />
                    Repayment overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                      <p className="text-sm text-rose-700 dark:text-rose-200">Time to clear balance</p>
                      <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                        {formatDuration(results.payoffMonths)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                      <p className="text-sm text-rose-700 dark:text-rose-200">Interest paid</p>
                      <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                        {currencyFormatter.format(results.totalInterest)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                      <p className="text-sm text-rose-700 dark:text-rose-200">Total repaid</p>
                      <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                        {currencyFormatter.format(results.totalPaid)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-rose-900/60 p-4 border border-rose-100 dark:border-rose-800">
                      <p className="text-sm text-rose-700 dark:text-rose-200">Monthly commitment</p>
                      <p className="text-2xl font-bold text-rose-900 dark:text-rose-100">
                        {currencyFormatter.format(
                          sanitiseNumber(inputs.monthlyPayment) + sanitiseNumber(inputs.extraPayment)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900 p-4">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-rose-900 dark:text-rose-100 mb-4">
                      <PieChart className="h-5 w-5" />
                      Interest versus principal
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Debt repayment split" />
                  </div>

                  <ExportActions csvData={csvData} fileName="debt-calculator-schedule" title="Debt repayment schedule" />
                </CardContent>
              </Card>

              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base font-semibold">
                    <TrendingDown className="h-5 w-5 text-slate-600" />
                    First year repayment schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide bg-slate-100 dark:bg-slate-900">
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
                          className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40"
                        >
                          <td className="px-4 py-2 font-medium text-slate-700 dark:text-slate-200">
                            {entry.month}
                          </td>
                          <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                            {currencyFormatter.format(entry.payment)}
                          </td>
                          <td className="px-4 py-2 text-rose-600 dark:text-rose-200">
                            {currencyFormatter.format(entry.interest)}
                          </td>
                          <td className="px-4 py-2 text-emerald-600 dark:text-emerald-200">
                            {currencyFormatter.format(entry.principal)}
                          </td>
                          <td className="px-4 py-2 text-slate-700 dark:text-slate-200">
                            {currencyFormatter.format(entry.remaining)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <AlertCircle className="h-5 w-5 text-rose-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results && results.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your balance, APR, and planned repayments, then press{' '}
                        <strong>Calculate</strong> to see a personalised payoff plan.
                      </>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={debtCalculatorFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
