import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Home, Briefcase, AlertTriangle, PieChart } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import ExportActions from '@/components/calculators/ExportActions';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart';
import { JsonLd, faqSchema } from '@/components/seo/JsonLd.jsx';
import { getCalculatorKeywords } from '@/components/data/calculatorKeywords.js';
import { createCalculatorWebPageSchema, createCalculatorBreadcrumbs } from '@/utils/calculatorSchema.js';
import { sanitiseNumber } from '@/utils/sanitiseNumber.js';

const CALCULATOR_NAME = 'Debt to Income Ratio Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/debt-to-income-ratio-calculator';
const keywords = getCalculatorKeywords('Debt to Income Ratio Calculator');

const metaDescription =
  'Measure your UK debt to income ratio, understand how lenders view your affordability, and see how extra repayments can bring your DTI into a safer range.';

const defaultInputs = {
  housingDebt: '1,100',
  otherDebt: '650',
  grossMonthlyIncome: '4,500',
};

const numberFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const classifyDTI = (ratio) => {
  if (!Number.isFinite(ratio)) {
    return { label: 'Add income details', tone: 'text-slate-500', description: 'Enter your gross monthly income to generate a DTI score.' };
  }

  if (ratio <= 28) {
    return {
      label: 'Excellent',
      tone: 'text-emerald-600',
      description: 'Comfortable affordability for most UK mortgage providers and personal lenders.',
    };
  }

  if (ratio <= 36) {
    return {
      label: 'Good',
      tone: 'text-lime-600',
      description: 'Generally acceptable, though lenders may look for a stronger credit profile.',
    };
  }

  if (ratio <= 43) {
    return {
      label: 'Fair',
      tone: 'text-amber-600',
      description: 'You may qualify, but lowering debt or increasing income could unlock better rates.',
    };
  }

  return {
    label: 'Needs attention',
    tone: 'text-rose-600',
    description: 'High risk for lenders. Prioritise debt reduction or boosting income before applying.',
  };
};

const computeDTI = ({ housingDebt, otherDebt, grossMonthlyIncome }) => {
  const housing = Math.max(housingDebt, 0);
  const other = Math.max(otherDebt, 0);
  const income = Math.max(grossMonthlyIncome, 0);
  const totalDebt = housing + other;

  if (income <= 0) {
    return {
      valid: false,
      message: 'Enter your gross monthly income to calculate a debt-to-income percentage.',
      housingDebt: housing,
      otherDebt: other,
      totalDebt,
      income,
    };
  }

  const housingDTI = (housing / income) * 100;
  const totalDTI = (totalDebt / income) * 100;

  return {
    valid: true,
    housingDebt: housing,
    otherDebt: other,
    totalDebt,
    income,
    housingDTI,
    totalDTI,
  };
};

const dtiFaqs = [
  {
    question: 'What monthly payments should I include in my DTI?',
    answer:
      'Include mortgage or rent, secured loans, car finance, personal loans, student loans, minimum credit card payments, overdraft commitments, and buy-now-pay-later plans. Day-to-day spending such as groceries and utilities is excluded.',
  },
  {
    question: 'What DTI ratio do UK mortgage lenders prefer?',
    answer:
      'Many UK lenders look for a total DTI below 40%, with housing costs ideally within 28% to 31% of your gross income. Strong credit scores, savings, or a large deposit can offset a slightly higher ratio.',
  },
  {
    question: 'How can I improve my debt to income ratio quickly?',
    answer:
      'Focus on reducing revolving balances such as credit cards, consolidating to lower rates, or boosting income with overtime and side gigs. Recalculate your DTI after each change to see how close you are to your goal.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Discover every UK money tool to support your financial decisions.',
  },
  {
    label: 'Debt & loans planning tools',
    url: '/#debt-loans',
    description: 'Explore calculators covering repayments, consolidation, and affordability.',
  },
  {
    label: 'Mortgage affordability hub',
    url: '/#mortgages-property',
    description: 'Stress-test your application before speaking with a UK broker or lender.',
  },
];

const relatedCalculators = [
  {
    name: 'Debt Calculator',
    url: '/debt-calculator',
    description: 'Build a payoff plan and see how fast you can clear balances.',
  },
  {
    name: 'Loan Repayment Calculator',
    url: '/loan-repayment-calculator',
    description: 'Model amortisation schedules for personal loans and car finance.',
  },
  {
    name: 'Emergency Fund Calculator',
    url: '/emergency-fund-calculator',
    description: 'Balance debt reduction with a resilient rainy-day fund.',
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

const faqStructuredData = faqSchema(dtiFaqs);

export default function DebtToIncomeRatioCalculatorPage() {
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
      housingDebt: sanitiseNumber(inputs.housingDebt),
      otherDebt: sanitiseNumber(inputs.otherDebt),
      grossMonthlyIncome: sanitiseNumber(inputs.grossMonthlyIncome),
    };
    const outcome = computeDTI(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      {
        name: 'Monthly debt commitments',
        value: results.totalDebt,
        color: '#f97316',
      },
      {
        name: 'Income remaining',
        value: Math.max(results.income - results.totalDebt, 0),
        color: '#0ea5e9',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Gross monthly income (£)', results.income.toFixed(2)],
      ['Housing repayments (£)', results.housingDebt.toFixed(2)],
      ['Other repayments (£)', results.otherDebt.toFixed(2)],
      ['Total debt commitments (£)', results.totalDebt.toFixed(2)],
      ['Housing DTI (%)', results.housingDTI.toFixed(2)],
      ['Total DTI (%)', results.totalDTI.toFixed(2)],
    ];
  }, [results]);

  const housingClassification = results?.valid ? classifyDTI(results.housingDTI) : null;
  const totalClassification = results?.valid ? classifyDTI(results.totalDTI) : null;

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | UK Affordability Check`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${CALCULATOR_NAME} | UK Affordability Check`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${CALCULATOR_NAME} | UK Affordability Check`} />
        <meta name="twitter:description" content={metaDescription} />
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Debt to Income Ratio Calculator
          </Heading>
          <p className="calculator-hero__description">
            Check how much of your monthly income is committed to debt and see whether you sit
            within UK lender affordability guidelines.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Put yourself back in control"
          message="Your DTI is more than a percentage—it is a reflection of the breathing room in your monthly budget. Track the number today and revisit as you make progress."
          quote="A budget is telling your money where to go instead of wondering where it went."
          author="John C. Maxwell"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Monthly totals
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="housingDebt" className="text-sm font-medium">
                    Housing repayments (£)
                  </Label>
                  <Input
                    id="housingDebt"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.housingDebt}
                    onChange={handleInputChange('housingDebt')}
                    placeholder="e.g., 1,100"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include mortgage, rent, or secured loan payments.
                  </p>
                </div>
                <div>
                  <Label htmlFor="otherDebt" className="text-sm font-medium">
                    Other monthly debt (£)
                  </Label>
                  <Input
                    id="otherDebt"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.otherDebt}
                    onChange={handleInputChange('otherDebt')}
                    placeholder="e.g., 650"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Add credit cards, car finance, student loans, and overdraft commitments.
                  </p>
                </div>
                <div>
                  <Label htmlFor="grossMonthlyIncome" className="text-sm font-medium">
                    Gross monthly income (£)
                  </Label>
                  <Input
                    id="grossMonthlyIncome"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.grossMonthlyIncome}
                    onChange={handleInputChange('grossMonthlyIncome')}
                    placeholder="e.g., 4,500"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Use income before tax including salary, bonuses, and regular allowances.
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
              <Card className="border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                    <Percent className="h-5 w-5" />
                    Your DTI snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-700 dark:text-emerald-200">Housing DTI</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {percentageFormatter.format(results.housingDTI)}
                      </p>
                      {housingClassification ? (
                        <p className={`text-xs font-medium mt-1 ${housingClassification.tone}`}>
                          {housingClassification.label} · {housingClassification.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-700 dark:text-emerald-200">Total DTI</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {percentageFormatter.format(results.totalDTI)}
                      </p>
                      {totalClassification ? (
                        <p className={`text-xs font-medium mt-1 ${totalClassification.tone}`}>
                          {totalClassification.label} · {totalClassification.description}
                        </p>
                      ) : null}
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-700 dark:text-emerald-200">Monthly debt</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(results.totalDebt)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-emerald-900/40 p-4 border border-emerald-100 dark:border-emerald-800">
                      <p className="text-sm text-emerald-700 dark:text-emerald-200">Income remaining</p>
                      <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                        {currencyFormatter.format(Math.max(results.income - results.totalDebt, 0))}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900 p-4">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-emerald-900 dark:text-emerald-100 mb-4">
                      <PieChart className="h-5 w-5" />
                      Monthly budget split
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Debt to income split" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="debt-to-income-ratio-results"
                    title="Debt to income ratio summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <AlertTriangle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your monthly repayments and gross income, then press{' '}
                        <strong>Calculate</strong> to view your personal DTI score.
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
          <FAQSection faqs={dtiFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
