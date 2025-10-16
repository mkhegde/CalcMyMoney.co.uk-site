import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Home, Wallet, Scale, Percent, FileText, Calculator } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'first time buyer calculator',
  'mortgage affordability calculator',
  'stamp duty calculator',
  'loan to value calculator',
  'deposit calculator',
];

const metaDescription =
  'Use our first time buyer calculator, mortgage affordability calculator, and stamp duty calculator to size your deposit, LTV, and repayments before you offer.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/first-time-buyer-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
});

const defaultInputs = {
  propertyPrice: 340000,
  depositAmount: 48000,
  primaryIncome: 52000,
  partnerIncome: 28000,
  monthlyDebtPayments: 350,
  interestRate: 4.75,
  loanTermYears: 30,
  incomeMultiple: 4.5,
  targetLtv: 85,
};

const buyerFaqs = [
  {
    question: 'How do lenders judge affordability?',
    answer:
      'They start with income multiples, then adjust for debts and stress-test repayments. The mortgage affordability calculator in this tool mirrors that logic so you can spot potential gaps early.',
  },
  {
    question: 'Where do stamp duty costs come from?',
    answer:
      'The stamp duty calculator applies the latest first time buyer relief bands. If your property exceeds the relief thresholds, the standard SDLT rates kick in automatically.',
  },
  {
    question: 'How does deposit size influence offers?',
    answer:
      'Bigger deposits reduce the loan to value ratio, unlock better rates, and strengthen your application. Use the loan to value calculator output to see how close you are to each tier.',
  },
];

const calculateStampDuty = (price) => {
  const amount = Math.max(Number(price) || 0, 0);
  if (amount <= 425000) {
    return 0;
  }
  if (amount <= 625000) {
    return (amount - 425000) * 0.05;
  }

  // Standard SDLT bands
  let duty = 0;
  const bands = [
    { threshold: 1500000, rate: 0.12 },
    { threshold: 925000, rate: 0.1 },
    { threshold: 250000, rate: 0.05 },
    { threshold: 0, rate: 0 },
  ];

  let remaining = amount;
  let previousThreshold = amount;

  for (const band of bands) {
    if (remaining > band.threshold) {
      const taxableAmount = previousThreshold - Math.max(band.threshold, 0);
      duty += taxableAmount * band.rate;
      previousThreshold = band.threshold;
    }
  }

  return duty;
};

const calculateMonthlyPayment = (loanAmount, interestRate, loanTermYears) => {
  const principal = Math.max(Number(loanAmount) || 0, 0);
  const monthlyRate = Math.max(Number(interestRate) || 0, 0) / 100 / 12;
  const months = Math.max(Math.round(Number(loanTermYears) * 12) || 0, 1);

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = (1 + monthlyRate) ** months;
  return (principal * monthlyRate * factor) / (factor - 1);
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
  const price = Math.max(Number(propertyPrice) || 0, 0);
  const deposit = Math.min(Math.max(Number(depositAmount) || 0, 0), price);
  const loanAmount = Math.max(price - deposit, 0);

  const income = Math.max(Number(primaryIncome) || 0, 0) + Math.max(Number(partnerIncome) || 0, 0);
  const debtPayments = Math.max(Number(monthlyDebtPayments) || 0, 0);
  const multiple = Math.max(Number(incomeMultiple) || 0, 0);

  const maxLoanByIncome = income * multiple;
  const debtDrag = debtPayments * 12 * 4;
  const adjustedMaxLoan = Math.max(maxLoanByIncome - debtDrag, 0);

  const ltv = price > 0 ? (loanAmount / price) * 100 : 0;
  const depositPercent = price > 0 ? (deposit / price) * 100 : 0;

  const monthlyPayment = calculateMonthlyPayment(loanAmount, interestRate, loanTermYears);
  const stressPayment = calculateMonthlyPayment(loanAmount, interestRate + 3, loanTermYears);
  const totalInterest =
    monthlyPayment * Math.max(Math.round(Number(loanTermYears) * 12) || 0, 0) - loanAmount;

  const targetLtvPercent = Math.min(Math.max(Number(targetLtv) || 0, 0), 95);
  const depositNeededForTarget = price * Math.max(1 - targetLtvPercent / 100, 0);
  const extraDepositForTarget = Math.max(depositNeededForTarget - deposit, 0);

  const extraDepositForAffordability = Math.max(loanAmount - adjustedMaxLoan, 0);
  const stampDuty = calculateStampDuty(price);

  const incomeMultiplierUsed = income > 0 ? loanAmount / income : 0;
  const monthlyIncome = income / 12;
  const paymentToIncomeRatio = monthlyIncome > 0 ? (monthlyPayment / monthlyIncome) * 100 : 0;

  return {
    loanAmount,
    ltv,
    depositPercent,
    monthlyPayment,
    stressPayment,
    totalInterest,
    depositNeededForTarget,
    extraDepositForTarget,
    adjustedMaxLoan,
    affordabilityGap: adjustedMaxLoan - loanAmount,
    extraDepositForAffordability,
    stampDuty,
    incomeMultiplierUsed,
    paymentToIncomeRatio,
    income,
  };
};

export default function FirstTimeBuyerCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const plan = useMemo(
    () =>
      evaluateFirstTimeBuyerPlan({
        propertyPrice: inputs.propertyPrice,
        depositAmount: inputs.depositAmount,
        primaryIncome: inputs.primaryIncome,
        partnerIncome: inputs.partnerIncome,
        monthlyDebtPayments: inputs.monthlyDebtPayments,
        interestRate: inputs.interestRate,
        loanTermYears: inputs.loanTermYears,
        incomeMultiple: inputs.incomeMultiple,
        targetLtv: inputs.targetLtv,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>First Time Buyer Calculator | Mortgage Affordability Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="First Time Buyer Calculator | Mortgage Affordability Calculator"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="First Time Buyer Calculator | Mortgage Affordability Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'First Time Buyer Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Plan a purchase with a first time buyer calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            First Time Buyer Calculator
          </Heading>
          <p className="text-lg text-emerald-100 md:text-xl">
            Understand deposits, repayments, and stamp duty before you book viewings, with a single
            mortgage affordability calculator dashboard.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Home className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Property & deposit
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyPrice">Property price (£)</Label>
                  <Input
                    id="propertyPrice"
                    type="number"
                    min="0"
                    step="1000"
                    value={inputs.propertyPrice}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        propertyPrice: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">Deposit saved (£)</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    min="0"
                    step="1000"
                    value={inputs.depositAmount}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        depositAmount: Number(event.target.value) || 0,
                      }))
                    }
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Current deposit represents {plan.depositPercent.toFixed(1)}% of the purchase.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetLtv">Target loan to value (%)</Label>
                  <Slider
                    id="targetLtv"
                    className="mt-3"
                    value={[Number(inputs.targetLtv)]}
                    min={60}
                    max={95}
                    step={1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        targetLtv: Number(value[0]),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>60%</span>
                    <span>{inputs.targetLtv}%</span>
                    <span>95%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Wallet className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Income & commitments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="primaryIncome">Your annual income (£)</Label>
                    <Input
                      id="primaryIncome"
                      type="number"
                      min="0"
                      step="500"
                      value={inputs.primaryIncome}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          primaryIncome: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="partnerIncome">Partner income (£)</Label>
                    <Input
                      id="partnerIncome"
                      type="number"
                      min="0"
                      step="500"
                      value={inputs.partnerIncome}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          partnerIncome: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyDebtPayments">Monthly committed debt payments (£)</Label>
                  <Input
                    id="monthlyDebtPayments"
                    type="number"
                    min="0"
                    step="10"
                    value={inputs.monthlyDebtPayments}
                    onChange={(event) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlyDebtPayments: Number(event.target.value) || 0,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="incomeMultiple">Income multiple</Label>
                  <Slider
                    id="incomeMultiple"
                    className="mt-3"
                    value={[Number(inputs.incomeMultiple)]}
                    min={3}
                    max={5.5}
                    step={0.1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        incomeMultiple: Number(value[0].toFixed(1)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>3.0×</span>
                    <span>{inputs.incomeMultiple.toFixed(1)}×</span>
                    <span>5.5×</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-emerald-200 bg-white text-slate-900 shadow-md dark:border-emerald-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Percent className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Mortgage terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Indicative mortgage rate (%)</Label>
                  <Slider
                    id="interestRate"
                    className="mt-3"
                    value={[Number(inputs.interestRate)]}
                    min={1.5}
                    max={8}
                    step={0.05}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        interestRate: Number(value[0].toFixed(2)),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>1.5%</span>
                    <span>{inputs.interestRate.toFixed(2)}%</span>
                    <span>8.0%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTermYears">Mortgage term (years)</Label>
                  <Slider
                    id="loanTermYears"
                    className="mt-3"
                    value={[Number(inputs.loanTermYears)]}
                    min={20}
                    max={35}
                    step={1}
                    onValueChange={(value) =>
                      setInputs((prev) => ({
                        ...prev,
                        loanTermYears: Number(value[0]),
                      }))
                    }
                  />
                  <div className="flex justify-between text-sm text-emerald-800 dark:text-emerald-200">
                    <span>20 years</span>
                    <span>{inputs.loanTermYears} years</span>
                    <span>35 years</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={resetAll}>
                  Reset to example purchase
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-emerald-200 bg-emerald-50 text-slate-900 shadow-md dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Scale className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
                  Affordability snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Loan required</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {currencyFormatter.format(plan.loanAmount)}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      Income multiple {plan.incomeMultiplierUsed.toFixed(2)}×
                    </p>
                  </div>
                  <div className="rounded-md border border-white/40 bg-white/60 p-4 text-center dark:border-white/10 dark:bg-white/10">
                    <p className="text-sm text-emerald-700 dark:text-emerald-200">Loan to value</p>
                    <p className="text-2xl font-semibold text-emerald-900 dark:text-emerald-100">
                      {plan.ltv.toFixed(1)}%
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-200">
                      Deposit {plan.depositPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 dark:border-white/10 dark:bg-white/10">
                  <div className="flex items-center justify-between">
                    <span>Monthly repayment</span>
                    <span>{currencyFormatter.format(plan.monthlyPayment)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Stress test at +3%</span>
                    <span>{currencyFormatter.format(plan.stressPayment)}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span>Payment vs income</span>
                    <span>{plan.paymentToIncomeRatio.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="rounded-md border border-white/40 bg-white/60 p-4 text-xs dark:border-white/10 dark:bg-white/10">
                  <p>
                    Based on total household income of <strong>{currencyFormatter.format(plan.income)}</strong> and an
                    income multiple of {inputs.incomeMultiple.toFixed(1)}×.
                  </p>
                  {plan.affordabilityGap < 0 && (
                    <p className="mt-2 text-rose-700 dark:text-rose-300">
                      Reduce borrowing by {currencyFormatter.format(Math.abs(plan.affordabilityGap))} or increase your
                      deposit to fit typical lender parameters.
                    </p>
                  )}
                  {plan.affordabilityGap >= 0 && (
                    <p className="mt-2 text-emerald-700 dark:text-emerald-200">
                      You have a buffer of {currencyFormatter.format(plan.affordabilityGap)} under the selected income
                      multiple.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 bg-white text-slate-900 shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Cost breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Stamp duty estimate</span>
                  <span>{currencyFormatter.format(plan.stampDuty)}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Total interest over term</span>
                  <span>{currencyFormatter.format(plan.totalInterest)}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Deposit needed for {inputs.targetLtv}% LTV</span>
                  <span>{currencyFormatter.format(plan.depositNeededForTarget)}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Extra deposit for target LTV</span>
                  <span>{currencyFormatter.format(plan.extraDepositForTarget)}</span>
                </div>
                <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                  <span>Extra deposit to satisfy affordability</span>
                  <span>{currencyFormatter.format(plan.extraDepositForAffordability)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Loan to value calculator tactics for first homes
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Work the numbers like a loan to value calculator by testing multiple property prices,
                deposits, and rates. Shift the sliders until you uncover the sweet spot where lenders,
                risk, and your monthly budget align.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Deposit calculator moves that speed up completion
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Treat this dashboard like a deposit calculator that tells you the next milestone. Save
                windfalls, trim expenses, and explore gifted deposits so you can shift into a stronger LTV
                band before exchange.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="px-0">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                  <FileText className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
                  Need more guidance?
                </CardTitle>
              </CardHeader>
              <FAQSection faqs={buyerFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
