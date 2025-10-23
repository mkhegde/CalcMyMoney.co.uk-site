import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Percent, PiggyBank, Target } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'First Time Buyer Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/first-time-buyer-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Size your first home deposit, lending multiple, and mortgage repayments with our UK first time buyer calculator before you make an offer.';

const defaultInputs = {
  propertyPrice: '340,000',
  depositAmount: '48,000',
  primaryIncome: '52,000',
  partnerIncome: '28,000',
  monthlyDebtPayments: '350',
  interestRate: '4.75',
  loanTermYears: '30',
  incomeMultiple: '4.5',
  targetLtv: '85',
};

const buyerFaqs = [
  {
    question: 'How do lenders judge affordability?',
    answer:
      'Most UK lenders start with an income multiple, then deduct existing debt commitments and stress test repayments several percentage points above the headline rate. This calculator mirrors that approach so you can close gaps before you apply.',
  },
  {
    question: 'How are first time buyer stamp duty reliefs applied?',
    answer:
      'The stamp duty output uses current HMRC thresholds. Homes up to £425,000 are exempt, relief tapers off between £425,001 and £625,000, and standard SDLT rates apply above that value.',
  },
  {
    question: 'How much deposit should I aim for?',
    answer:
      'A 10% to 15% deposit unlocks more products and sharper interest rates. Adjust the target LTV slider to see how much extra cash is needed to hit each tier.',
  },
];

const relatedCalculators = [
  {
    name: 'Mortgage Affordability Calculator',
    url: '/mortgage-affordability-calculator',
    description: 'Stress test your borrowing limit against income and outgoings.',
  },
  {
    name: 'Mortgage Repayment Calculator',
    url: '/mortgage-repayment-calculator',
    description: 'See how rate changes shift your monthly repayments.',
  },
  {
    name: 'Stamp Duty Calculator',
    url: '/sdlt-calculator',
    description: 'Check SDLT for first homes, second homes, and investment properties.',
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

const faqStructuredData = faqSchema(buyerFaqs);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const calculateMonthlyPayment = (loanAmount, interestRate, loanTermYears) => {
  const principal = Math.max(loanAmount, 0);
  const monthlyRate = Math.max(interestRate, 0) / 100 / 12;
  const months = Math.max(Math.round(loanTermYears * 12), 1);

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
};

const calculateStampDuty = (price) => {
  const amount = Math.max(price, 0);

  if (amount <= 425000) {
    return 0;
  }

  if (amount <= 625000) {
    return (amount - 425000) * 0.05;
  }

  const bands = [
    { limit: 1500000, rate: 0.12 },
    { limit: 925000, rate: 0.1 },
    { limit: 250000, rate: 0.05 },
    { limit: 0, rate: 0 },
  ];

  let duty = 0;
  let remaining = amount;
  let previousThreshold = amount;

  for (const band of bands) {
    if (remaining > band.limit) {
      const taxable = previousThreshold - Math.max(band.limit, 0);
      duty += taxable * band.rate;
      previousThreshold = band.limit;
    }
  }

  return duty;
};

const evaluateFirstTimeBuyerPlan = ({
  propertyPrice,
  depositAmount,
  primaryIncome,
  partnerIncome,
  monthlyDebtPayments,
  interestRate,
  loanTermYears,
  incomeMultiple,
  targetLtv,
}) => {
  const price = Math.max(propertyPrice, 0);
  if (price <= 0) {
    return {
      valid: false,
      message: 'Enter a property price to model borrowing, deposit, and stamp duty requirements.',
    };
  }

  const deposit = Math.min(Math.max(depositAmount, 0), price);
  const loanAmount = Math.max(price - deposit, 0);

  const householdIncome = Math.max(primaryIncome, 0) + Math.max(partnerIncome, 0);
  const monthlyDebts = Math.max(monthlyDebtPayments, 0);
  const incomeMultipleCap = Math.max(incomeMultiple, 0);

  const maxLoanByIncome = householdIncome * incomeMultipleCap;
  const debtDrag = monthlyDebts * 12 * 4;
  const adjustedMaxLoan = Math.max(maxLoanByIncome - debtDrag, 0);

  const ltv = price > 0 ? (loanAmount / price) * 100 : 0;
  const depositPercent = price > 0 ? (deposit / price) * 100 : 0;

  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
  const stressPayment = calculateMonthlyPayment(loanAmount, interestRate + 3, loanTermYears);
  const totalInterest = monthlyPayment * Math.round(loanTermYears * 12) - loanAmount;

  const targetLtvPercent = Math.min(Math.max(targetLtv, 0), 95);
  const depositNeededForTarget = price * (1 - targetLtvPercent / 100);
  const extraDepositForTarget = Math.max(depositNeededForTarget - deposit, 0);
  const extraDepositForAffordability = Math.max(loanAmount - adjustedMaxLoan, 0);

  const stampDuty = calculateStampDuty(price);
  const incomeMultiplierUsed = householdIncome > 0 ? loanAmount / householdIncome : 0;
  const monthlyIncome = householdIncome / 12;
  const paymentToIncomeRatio = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0;

  return {
    valid: true,
    propertyPrice: price,
    deposit,
    loanAmount,
    ltv,
    depositPercent,
    monthlyPayment,
    stressPayment,
    totalInterest,
    adjustedMaxLoan,
    affordabilityGap: adjustedMaxLoan - loanAmount,
    extraDepositForAffordability,
    depositNeededForTarget,
    extraDepositForTarget,
    stampDuty,
    incomeMultiplierUsed,
    paymentToIncomeRatio,
    householdIncome,
    targetLtvPercent,
  };
};

export default function FirstTimeBuyerCalculatorPage() {
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
      propertyPrice: sanitiseNumber(inputs.propertyPrice),
      depositAmount: sanitiseNumber(inputs.depositAmount),
      primaryIncome: sanitiseNumber(inputs.primaryIncome),
      partnerIncome: sanitiseNumber(inputs.partnerIncome),
      monthlyDebtPayments: sanitiseNumber(inputs.monthlyDebtPayments),
      interestRate: sanitiseNumber(inputs.interestRate),
      loanTermYears: sanitiseNumber(inputs.loanTermYears),
      incomeMultiple: sanitiseNumber(inputs.incomeMultiple),
      targetLtv: sanitiseNumber(inputs.targetLtv),
    };
    const outcome = evaluateFirstTimeBuyerPlan(payload);
    setResults({ ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    const segments = [
      { name: 'Loan amount', value: results.loanAmount, color: '#0ea5e9' },
      { name: 'Deposit', value: results.deposit, color: '#22c55e' },
      { name: 'Stamp duty', value: results.stampDuty, color: '#f97316' },
    ];
    return segments.filter((segment) => segment.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Property price (£)', results.propertyPrice.toFixed(2)],
      ['Deposit (£)', results.deposit.toFixed(2)],
      ['Loan amount (£)', results.loanAmount.toFixed(2)],
      ['Loan to value (%)', results.ltv.toFixed(2)],
      ['Deposit percentage (%)', results.depositPercent.toFixed(2)],
      ['Monthly repayment (£)', results.monthlyPayment.toFixed(2)],
      ['Stress-tested payment (£)', results.stressPayment.toFixed(2)],
      ['Total interest over term (£)', results.totalInterest.toFixed(2)],
      ['Stamp duty (£)', results.stampDuty.toFixed(2)],
      ['Household income (£)', results.householdIncome.toFixed(2)],
      ['Income multiple used', results.incomeMultiplierUsed.toFixed(2)],
      ['Payment-to-income ratio (%)', results.paymentToIncomeRatio.toFixed(2)],
      ['Adjusted max loan (£)', results.adjustedMaxLoan.toFixed(2)],
      ['Affordability gap (£)', results.affordabilityGap.toFixed(2)],
      ['Deposit needed for target LTV (£)', results.depositNeededForTarget.toFixed(2)],
      ['Extra deposit for target LTV (£)', results.extraDepositForTarget.toFixed(2)],
      ['Extra deposit for affordability (£)', results.extraDepositForAffordability.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Mortgage Affordability Helper`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            First Time Buyer Calculator
          </Heading>
          <p className="calculator-hero__description">
            Understand how your deposit, borrowing capacity, and mortgage repayments line up before you book a viewing.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Turn home ownership from dream to date"
          message="Visibility over your numbers shrinks the gap between renting and receiving the keys. Check in regularly and tweak the plan to stay on track."
          quote="The future depends on what you do today."
          author="Mahatma Gandhi"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Buyer inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="propertyPrice" className="text-sm font-medium">
                    Property price (£)
                  </Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.propertyPrice}
                    onChange={handleInputChange('propertyPrice')}
                    placeholder="e.g., 340,000"
                  />
                </div>
                <div>
                  <Label htmlFor="depositAmount" className="text-sm font-medium">
                    Deposit saved (£)
                  </Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.depositAmount}
                    onChange={handleInputChange('depositAmount')}
                    placeholder="e.g., 48,000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryIncome" className="text-sm font-medium">
                      Your gross income (£/year)
                    </Label>
                    <Input
                      id="primaryIncome"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.primaryIncome}
                      onChange={handleInputChange('primaryIncome')}
                      placeholder="e.g., 52,000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="partnerIncome" className="text-sm font-medium">
                      Partner income (£/year)
                    </Label>
                    <Input
                      id="partnerIncome"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="100"
                      value={inputs.partnerIncome}
                      onChange={handleInputChange('partnerIncome')}
                      placeholder="e.g., 28,000"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="monthlyDebtPayments" className="text-sm font-medium">
                    Monthly debt payments (£)
                  </Label>
                  <Input
                    id="monthlyDebtPayments"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="10"
                    value={inputs.monthlyDebtPayments}
                    onChange={handleInputChange('monthlyDebtPayments')}
                    placeholder="e.g., 350"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include credit cards, loans, car finance, and student loan repayments.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interestRate" className="text-sm font-medium">
                      Mortgage rate (%)
                    </Label>
                    <Input
                      id="interestRate"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.05"
                      value={inputs.interestRate}
                      onChange={handleInputChange('interestRate')}
                      placeholder="e.g., 4.75"
                    />
                  </div>
                  <div>
                    <Label htmlFor="loanTermYears" className="text-sm font-medium">
                      Loan term (years)
                    </Label>
                    <Input
                      id="loanTermYears"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="1"
                      value={inputs.loanTermYears}
                      onChange={handleInputChange('loanTermYears')}
                      placeholder="e.g., 30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="incomeMultiple" className="text-sm font-medium">
                      Income multiple
                    </Label>
                    <Input
                      id="incomeMultiple"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="0.1"
                      value={inputs.incomeMultiple}
                      onChange={handleInputChange('incomeMultiple')}
                      placeholder="e.g., 4.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetLtv" className="text-sm font-medium">
                      Target LTV (%)
                    </Label>
                    <Input
                      id="targetLtv"
                      type="number"
                      inputMode="decimal"
                      min="50"
                      max="95"
                      step="0.5"
                      value={inputs.targetLtv}
                      onChange={handleInputChange('targetLtv')}
                      placeholder="e.g., 85"
                    />
                  </div>
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
              <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    <PiggyBank className="h-5 w-5" />
                    Home buying snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/30 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Loan amount
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.loanAmount)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        LTV {percentageFormatter.format(results.ltv)}%
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/30 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Monthly repayment
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.monthlyPayment)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        Stress tested at {percentageFormatter.format(results.payload.interestRate + 3)}% →{' '}
                        {currencyFormatter.format(results.stressPayment)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/30 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Deposit in place
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.deposit)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        {percentageFormatter.format(results.depositPercent)}% of purchase price
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/30 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Stamp duty due
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.stampDuty)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        Includes first-time buyer relief where eligible
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 p-4">
                    <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                      Deposit versus borrowing mix
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Deposit versus borrowing" />
                  </div>

                  <div className="rounded-md bg-white/80 dark:bg-emerald-900/30 p-4 border border-emerald-100 dark:border-emerald-800">
                    <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                      Affordability insights
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm text-emerald-900 dark:text-emerald-100">
                      <li>
                        Income multiple used:{' '}
                        <strong>{percentageFormatter.format(results.incomeMultiplierUsed)}</strong>x household income
                      </li>
                      <li>
                        Payment-to-income ratio:{' '}
                        <strong>{percentageFormatter.format(results.paymentToIncomeRatio)}%</strong> of monthly income
                      </li>
                      <li>
                        Affordability gap: <strong>{currencyFormatter.format(results.affordabilityGap)}</strong>{' '}
                        (negative values indicate a shortfall)
                      </li>
                      <li>
                        Extra deposit for target {percentageFormatter.format(results.targetLtvPercent)}% LTV:{' '}
                        <strong>{currencyFormatter.format(results.extraDepositForTarget)}</strong>
                      </li>
                      <li>
                        Extra deposit to satisfy income stress tests:{' '}
                        <strong>{currencyFormatter.format(results.extraDepositForAffordability)}</strong>
                      </li>
                    </ul>
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="first-time-buyer-calculator-results"
                    title="First time buyer affordability summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Target className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your property price, savings, and income details, then press{' '}
                        <strong>Calculate</strong> to see your first home roadmap.
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
          <FAQSection faqs={buyerFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
<RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
