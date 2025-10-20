import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, PiggyBank, Percent } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Home Equity Loan Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/home-equity-loan-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Estimate how much equity you can release, potential HELOC repayments, and the total interest cost before comparing lender offers.';

const defaultInputs = {
  propertyValue: '420,000',
  outstandingMortgage: '215,000',
  maxLtv: '80',
  interestRate: '5.2',
  termYears: '20',
  fees: '1,500',
};

const faqItems = [
  {
    question: 'How do lenders calculate the maximum I can borrow?',
    answer:
      'They look at your combined loan-to-value (CLTV) ratio. Multiply your property value by the lender’s maximum CLTV and subtract your existing mortgage balance. That’s the gross amount available before fees.',
  },
  {
    question: 'How do fees affect the cash I receive?',
    answer:
      'Arrangement fees reduce the money that actually arrives in your bank account. Add them here so you can compare the gross approval amount with the usable funds after costs.',
  },
  {
    question: 'What repayment type does this calculator assume?',
    answer:
      'It models a repayment (capital and interest) loan. For interest-only drawdown periods, compare the monthly repayment shown here with the interest-only payment to stress-test affordability.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Jump to every mortgage, loan, and savings calculator we offer.',
  },
  {
    label: 'Mortgages & property hub',
    url: '/#mortgages-property',
    description: 'Explore tools for repayments, overpayments, and landlord yields.',
  },
  {
    label: 'Mortgage affordability calculator',
    url: '/mortgage-affordability-calculator',
    description: 'Check borrowing limits alongside your home equity plan.',
  },
];

const relatedCalculators = [
  {
    name: 'Mortgage Repayment Calculator',
    url: '/mortgage-repayment-calculator',
    description: 'Compare mortgage repayments with and without extra borrowing.',
  },
  {
    name: 'Down Payment Calculator',
    url: '/down-payment-calculator',
    description: 'Plan how much equity you’ll have left after releasing funds.',
  },
  {
    name: 'Remortgage Calculator',
    url: '/remortgage-calculator',
    description: 'See if switching lender unlocks better rates before raising equity.',
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

const faqStructuredData = faqSchema(faqItems);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatPercentage = (value) =>
  `${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;

const calculateMonthlyPayment = (principal, annualRate, termYears) => {
  if (principal <= 0 || termYears <= 0) return 0;
  const monthlyRate = Math.max(annualRate, 0) / 100 / 12;
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
  if (propertyValue <= 0) {
    return {
      valid: false,
      message: 'Enter a property value to estimate the equity you can release.',
    };
  }

  const cltvCap = propertyValue * (maxLtv / 100);
  const grossLoan = Math.max(cltvCap - outstandingMortgage, 0);
  if (grossLoan <= 0) {
    return {
      valid: false,
      message: 'The current mortgage already uses all available equity at this LTV.',
    };
  }

  const netLoan = Math.max(grossLoan - fees, 0);
  const monthlyPayment = calculateMonthlyPayment(grossLoan, interestRate, termYears);
  const totalInterest = monthlyPayment * termYears * 12 - grossLoan;

  return {
    valid: true,
    propertyValue,
    outstandingMortgage,
    grossLoan,
    netLoan,
    maxLtv,
    interestRate,
    termYears,
    fees,
    monthlyPayment,
    totalInterest,
  };
};

export default function HomeEquityLoanCalculatorPage() {
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
      propertyValue: sanitiseNumber(inputs.propertyValue),
      outstandingMortgage: sanitiseNumber(inputs.outstandingMortgage),
      maxLtv: sanitiseNumber(inputs.maxLtv),
      interestRate: sanitiseNumber(inputs.interestRate),
      termYears: sanitiseNumber(inputs.termYears),
      fees: sanitiseNumber(inputs.fees),
    };
    const outcome = calculateHomeEquityLoan(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Existing mortgage', value: results.outstandingMortgage, color: '#0ea5e9' },
      { name: 'New equity release', value: results.grossLoan, color: '#22c55e' },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Property value (£)', results.propertyValue.toFixed(2)],
      ['Outstanding mortgage (£)', results.outstandingMortgage.toFixed(2)],
      ['Maximum CLTV (%)', results.maxLtv.toFixed(2)],
      ['Gross loan approval (£)', results.grossLoan.toFixed(2)],
      ['Arrangement fees (£)', results.fees.toFixed(2)],
      ['Cash received after fees (£)', results.netLoan.toFixed(2)],
      ['Interest rate (%)', results.interestRate.toFixed(2)],
      ['Term (years)', results.termYears.toFixed(1)],
      ['Monthly repayment (£)', results.monthlyPayment.toFixed(2)],
      ['Total interest over term (£)', results.totalInterest.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | HELOC & Equity Release Planner`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Home Equity Loan Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            See how much equity you can release, what it costs each month, and how fees impact the cash you actually receive.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Unlock value without losing focus"
          message="Equity release can fund renovations, consolidate expensive debt, or support big life events. Knowing the repayment impact up front keeps those plans sustainable."
          quote="Beware of little expenses; a small leak will sink a great ship."
          author="Benjamin Franklin"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Property & loan inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="propertyValue" className="text-sm font-medium">
                    Property value (£)
                  </Label>
                  <Input
                    id="propertyValue"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.propertyValue}
                    onChange={handleInputChange('propertyValue')}
                    placeholder="e.g., 420,000"
                  />
                </div>
                <div>
                  <Label htmlFor="outstandingMortgage" className="text-sm font-medium">
                    Outstanding mortgage (£)
                  </Label>
                  <Input
                    id="outstandingMortgage"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.outstandingMortgage}
                    onChange={handleInputChange('outstandingMortgage')}
                    placeholder="e.g., 215,000"
                  />
                </div>
                <div>
                  <Label htmlFor="maxLtv" className="text-sm font-medium">
                    Maximum combined LTV (%)
                  </Label>
                  <Input
                    id="maxLtv"
                    type="number"
                    inputMode="decimal"
                    min="50"
                    max="95"
                    step="1"
                    value={inputs.maxLtv}
                    onChange={handleInputChange('maxLtv')}
                    placeholder="e.g., 80"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="interestRate" className="text-sm font-medium">
                      Interest rate (%)
                    </Label>
                    <Input
                      id="interestRate"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.05"
                      value={inputs.interestRate}
                      onChange={handleInputChange('interestRate')}
                      placeholder="e.g., 5.2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="termYears" className="text-sm font-medium">
                      Term (years)
                    </Label>
                    <Input
                      id="termYears"
                      type="number"
                      inputMode="decimal"
                      min="1"
                      step="1"
                      value={inputs.termYears}
                      onChange={handleInputChange('termYears')}
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="fees" className="text-sm font-medium">
                    Arrangement & legal fees (£)
                  </Label>
                  <Input
                    id="fees"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="100"
                    value={inputs.fees}
                    onChange={handleInputChange('fees')}
                    placeholder="e.g., 1,500"
                  />
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
                    <Home className="h-5 w-5" />
                    Equity release summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Gross loan approval
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.grossLoan)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        CLTV {formatPercentage(results.maxLtv)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Cash after fees
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.netLoan)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        Fees deducted: {currencyFormatter.format(results.fees)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Monthly repayment
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.monthlyPayment)}
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-200">
                        Total interest: {currencyFormatter.format(results.totalInterest)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-xs uppercase tracking-wide text-emerald-700 dark:text-emerald-200">
                        Remaining mortgage
                      </p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.outstandingMortgage)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 p-4">
                    <h3 className="text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                      Combined borrowing
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Combined property borrowing" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="home-equity-loan-calculator-results"
                    title="Home equity loan summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Percent className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your property value, outstanding mortgage, and lender LTV, then press{' '}
                        <strong>Calculate</strong> to size up your equity release.
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
          <FAQSection faqs={faqItems} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
