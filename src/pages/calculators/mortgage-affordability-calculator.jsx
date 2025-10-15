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

const keywords = [
  'mortgage affordability calculator',
  'how much mortgage can i afford',
  'mortgage affordability',
];

const metaDescription =
  'Use our mortgage affordability calculator to see how much mortgage you can afford, balance mortgage affordability against debts, and plan your deposit strategy.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/mortgage-affordability-calculator';
const schemaKeywords = keywords;

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
  });

const mortgageAffordabilityFaqs = [
  {
    question: 'What income multiple do lenders use?',
    answer:
      'Most lenders cap borrowing between 4x and 4.75x joint income, though the multiple can vary based on credit score and loan-to-value. Adjust the income multiple slider to match your lender’s policy.',
  },
  {
    question: 'Do lenders consider monthly debts?',
    answer:
      'Yes. Car finance, credit cards, and childcare costs reduce the mortgage you can borrow. Enter monthly debts so the calculator reflects a realistic stress test.',
  },
  {
    question: 'How should I treat bonuses or overtime?',
    answer:
      'Many lenders only count a proportion of variable pay. Add the part that lenders will accept to reduce surprises when you receive a mortgage offer.',
  },
];

const calculateMortgageAffordability = ({
  applicantIncome,
  partnerIncome,
  bonusIncome,
  incomeMultiple,
  monthlyDebts,
  deposit,
  interestRate,
  termYears,
}) => {
  const annualDebt = monthlyDebts * 12;
  const totalIncome = applicantIncome + partnerIncome + bonusIncome;
  const maxLoanByIncome = Math.max(totalIncome * incomeMultiple - annualDebt, 0);
  const totalBuyingPower = maxLoanByIncome + deposit;

  // Stress test payment using repayment mortgage formula
  const monthlyRate = interestRate / 100 / 12;
  const months = termYears * 12;

  const stressMonthlyPayment =
    monthlyRate === 0
      ? maxLoanByIncome / months
      : (maxLoanByIncome * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

  const loanToValue = totalBuyingPower > 0 ? (maxLoanByIncome / totalBuyingPower) * 100 : 0;

  return {
    totalIncome,
    maxLoanByIncome,
    totalBuyingPower,
    stressMonthlyPayment,
    loanToValue,
  };
};

export default function MortgageAffordabilityCalculatorPage() {
  const [inputs, setInputs] = useState({
    applicantIncome: 45000,
    partnerIncome: 28000,
    bonusIncome: 5000,
    incomeMultiple: 4.5,
    monthlyDebts: 350,
    deposit: 60000,
    interestRate: 6,
    termYears: 30,
  });

  const results = useMemo(() => calculateMortgageAffordability(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      applicantIncome: 45000,
      partnerIncome: 28000,
      bonusIncome: 5000,
      incomeMultiple: 4.5,
      monthlyDebts: 350,
      deposit: 60000,
      interestRate: 6,
      termYears: 30,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Mortgage Affordability Calculator | How Much Mortgage Can I Afford</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Mortgage Affordability Calculator | How Much Mortgage Can I Afford"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Mortgage Affordability Calculator | How Much Mortgage Can I Afford"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Mortgage Affordability Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Check mortgage affordability',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Mortgage Affordability Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            See how much mortgage you can afford based on income, debts, deposit, and lender stress
            testing. Adjust the income multiple to match your lender.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Income & Debts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="applicantIncome" className="text-sm font-medium">
                  Your annual income (£)
                </Label>
                <Input
                  id="applicantIncome"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.applicantIncome}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, applicantIncome: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="partnerIncome" className="text-sm font-medium">
                  Partner annual income (£)
                </Label>
                <Input
                  id="partnerIncome"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.partnerIncome}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, partnerIncome: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="bonusIncome" className="text-sm font-medium">
                  Bonus or variable pay (£)
                </Label>
                <Input
                  id="bonusIncome"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.bonusIncome}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, bonusIncome: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Income multiple
                  <span className="text-emerald-600 font-semibold">
                    {inputs.incomeMultiple.toFixed(2)}x
                  </span>
                </Label>
                <Slider
                  value={[inputs.incomeMultiple]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, incomeMultiple: Number(value[0].toFixed(2)) }))
                  }
                  min={3.5}
                  max={5.5}
                  step={0.05}
                />
              </div>
              <div>
                <Label htmlFor="monthlyDebts" className="text-sm font-medium">
                  Monthly credit commitments (£)
                </Label>
                <Input
                  id="monthlyDebts"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.monthlyDebts}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, monthlyDebts: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="deposit" className="text-sm font-medium">
                  Deposit / equity (£)
                </Label>
                <Input
                  id="deposit"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.deposit}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, deposit: Number(event.target.value) }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Stress rate
                    <span className="text-emerald-600 font-semibold">
                      {inputs.interestRate.toFixed(1)}%
                    </span>
                  </Label>
                  <Slider
                    value={[inputs.interestRate]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, interestRate: Number(value[0].toFixed(1)) }))
                    }
                    min={3}
                    max={10}
                    step={0.1}
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium flex justify-between items-center">
                    Stress term (years)
                    <span className="text-emerald-600 font-semibold">{inputs.termYears}</span>
                  </Label>
                  <Slider
                    value={[inputs.termYears]}
                    onValueChange={(value) =>
                      setInputs((prev) => ({ ...prev, termYears: Math.round(value[0]) }))
                    }
                    min={5}
                    max={35}
                    step={1}
                  />
                </div>
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
                  Affordability Snapshot
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Total income</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter(results.totalIncome)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Max loan</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter(results.maxLoanByIncome)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Buying power</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter(results.totalBuyingPower)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Loan-to-value</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {results.loanToValue.toFixed(1)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PiggyBank className="h-5 w-5 text-slate-600" />
                  Stress Test Payment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <p>
                  At {inputs.interestRate.toFixed(1)}% over {inputs.termYears} years, your
                  stress-tested monthly repayment is{' '}
                  <span className="font-semibold">
                    {currencyFormatter(results.stressMonthlyPayment)}
                  </span>
                  . Make sure this fits comfortably within your budget.
                </p>
                <p>
                  Reduce monthly debts and increase deposit savings to unlock higher borrowing.
                  Lenders check debt-to-income ratios as well as LTV limits.
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
                Mortgage affordability calculator tips
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Try different interest rates to simulate lender stress tests. The mortgage
                affordability calculator shows how a change from 6% to 8% can reduce your maximum
                loan.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                How much mortgage can I afford planning
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Prepare supporting documents—payslips, bank statements, credit reports—so lenders
                can verify the income used in the “how much mortgage can I afford” analysis.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={mortgageAffordabilityFaqs} />
        </div>
      </section>
    </div>
  );
}
