import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['home equity loan calculator', 'heloc calculator'];

const metaDescription =
  'Use our home equity loan calculator to estimate borrowing capacity, compare heloc calculator payment scenarios, and plan how a home equity loan affects your budget.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/home-equity-loan-calculator';
const schemaKeywords = keywords;

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = (value) => `${value.toFixed(2)}%`;

const calcMonthlyPayment = (principal, annualRate, termYears) => {
  if (principal <= 0 || termYears <= 0) return 0;
  const monthlyRate = annualRate / 100 / 12;
  const months = termYears * 12;
  if (monthlyRate === 0) return principal / months;
  return (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));
};

const calculateHomeEquityLoan = ({
  propertyValue,
  outstandingMortgage,
  maxLtv,
  interestRate,
  termYears,
  fees,
}) => {
  const allowedLoanAmount = Math.max(propertyValue * (maxLtv / 100) - outstandingMortgage, 0);
  const loanAmount = Math.max(allowedLoanAmount - fees, 0);
  const monthlyPayment = calcMonthlyPayment(loanAmount, interestRate, termYears);
  const totalInterest = monthlyPayment * termYears * 12 - loanAmount;

  return {
    allowedLoanAmount,
    loanAmount,
    monthlyPayment,
    totalInterest,
  };
};

const homeEquityFaqs = [
  {
    question: 'What LTV should I use for my lender?',
    answer:
      'Many lenders cap combined loan-to-value (CLTV) at 80-85%. Check your existing mortgage balance and lender policy to choose an accurate percentage.',
  },
  {
    question: 'How do fees affect the loan?',
    answer:
      'Arrangement fees reduce the cash you receive. Enter estimated fees so the calculator shows both the gross approval amount and the cash that lands in your account.',
  },
  {
    question: 'Can I model interest-only HELOC payments?',
    answer:
      'This calculator assumes amortising repayments. For interest-only HELOC payments, set a longer term and compare monthly amounts to approximate the lower payment during the draw period.',
  },
];

export default function HomeEquityLoanCalculatorPage() {
  const [inputs, setInputs] = useState({
    propertyValue: 420000,
    outstandingMortgage: 215000,
    maxLtv: 80,
    interestRate: 5.2,
    termYears: 20,
    fees: 1500,
  });

  const results = useMemo(() => calculateHomeEquityLoan(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      propertyValue: 420000,
      outstandingMortgage: 215000,
      maxLtv: 80,
      interestRate: 5.2,
      termYears: 20,
      fees: 1500,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Home Equity Loan Calculator | HELOC Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Home Equity Loan Calculator | HELOC Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Equity Loan Calculator | HELOC Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Home Equity Loan Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate home equity borrowing',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Home Equity Loan Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Discover how much equity you can release, what the monthly payment looks like, and how a
            HELOC stacks against traditional loan terms.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Property & Loan Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="propertyValue" className="text-sm font-medium">
                  Property value (£)
                </Label>
                <Input
                  id="propertyValue"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.propertyValue}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, propertyValue: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="outstandingMortgage" className="text-sm font-medium">
                  Outstanding mortgage (£)
                </Label>
                <Input
                  id="outstandingMortgage"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.outstandingMortgage}
                  onChange={(event) =>
                    setInputs((prev) => ({
                      ...prev,
                      outstandingMortgage: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Maximum CLTV
                  <span className="text-emerald-600 font-semibold">
                    {inputs.maxLtv.toFixed(0)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.maxLtv]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, maxLtv: Math.round(value[0]) }))
                  }
                  min={60}
                  max={95}
                  step={1}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Interest rate
                    <span className="text-emerald-600 font-semibold">
                      {percentageFormatter(inputs.interestRate)}
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.interestRate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, interestRate: Number(value[0].toFixed(2)) }))
                    }
                    min={1}
                    max={12}
                    step={0.1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Term (years)
                    <span className="text-emerald-600 font-semibold">{inputs.termYears}</span>
                  </Label>
                  <Slider
                    value={[inputs.termYears]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, termYears: Math.round(value[0]) }))
                    }
                    min={5}
                    max={30}
                    step={1}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="fees" className="text-sm font-medium">
                  Arrangement fees (£)
                </Label>
                <Input
                  id="fees"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.fees}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, fees: Number(event.target.value) }))
                  }
                />
                <p className="text-xs text-slate-500 mt-1">
                  Include valuation, legal, or arrangement fees deducted from the advance.
                </p>
              </div>
              <Button onClick={resetInputs} variant="outline" className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  <Home className="h-5 w-5" />
                  Home Equity Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Allowed advance</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.allowedLoanAmount)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Cash after fees</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.loanAmount)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Monthly payment</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.monthlyPayment)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total interest</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.totalInterest)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-slate-600" />
                  Payment Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  <span className="font-semibold">Combined LTV target:</span> {inputs.maxLtv}% means
                  you can borrow up to {currencyFormatter.format(results.allowedLoanAmount)} across
                  all secured loans.
                </p>
                <p>
                  <span className="font-semibold">Monthly payment:</span>{' '}
                  {currencyFormatter.format(results.monthlyPayment)} based on an interest rate of{' '}
                  {inputs.interestRate.toFixed(2)}% over {inputs.termYears} years.
                </p>
                <p>
                  <span className="font-semibold">Fees deducted:</span>{' '}
                  {currencyFormatter.format(inputs.fees)} for arrangement/valuation costs, leaving{' '}
                  {currencyFormatter.format(results.loanAmount)} cash on completion.
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Home equity loan calculator strategy
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Experiment with the home equity loan calculator by adjusting rates, fees, and terms.
                Small shifts in CLTV or interest rate can change monthly payments dramatically.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Comparing lenders with a heloc calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Use the heloc calculator to compare introductory rates, repayment terms, and fee
                structures across lenders. Save scenarios so you can quickly choose the best offer
                when you are ready to apply.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={homeEquityFaqs} />
        </div>
      </section>
    </div>
  );
}
