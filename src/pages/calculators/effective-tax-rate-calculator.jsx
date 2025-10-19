import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Scale, FileText } from 'lucide-react';

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

const CALCULATOR_NAME = 'Effective Tax Rate Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/effective-tax-rate-calculator';
const keywords = getCalculatorKeywords('Effective Tax Rate Calculator');

const metaDescription =
  'Work out your UK effective tax rate by combining income tax, National Insurance, and other deductions. Compare gross income with take-home pay in minutes.';

const defaultInputs = {
  grossIncome: '52,000',
  taxableIncome: '48,000',
  incomeTaxPaid: '7,400',
  nationalInsurancePaid: '4,100',
  otherTaxes: '0',
};

const faqItems = [
  {
    question: 'What is an effective tax rate?',
    answer:
      'It is the percentage of your total income that goes to tax and National Insurance. Unlike marginal rates that apply to your last pound earned, the effective rate shows your overall tax burden.',
  },
  {
    question: 'How can I reduce my effective tax rate in the UK?',
    answer:
      'Boost pension contributions, use salary sacrifice for benefits such as childcare or cycle-to-work schemes, claim allowable expenses if you are self-employed, and use ISA allowances to shelter investment income.',
  },
  {
    question: 'Should I include student loan or workplace share deductions?',
    answer:
      'Student loans are not taxes but they do affect take-home pay. You can add them to the “Other payroll taxes” input to see their impact on your effective rate.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Find every UK calculator to support your financial planning.',
  },
  {
    label: 'Tax & income planning tools',
    url: '/#tax-income',
    description: 'Model PAYE, dividends, and self-employment taxes in one place.',
  },
  {
    label: 'Budgeting & planning hub',
    url: '/#budgeting-planning',
    description: 'Connect your tax rate to monthly budgeting and lifestyle goals.',
  },
];

const relatedCalculators = [
  {
    name: 'Income Tax Calculator',
    url: '/income-tax-calculator',
    description: 'See the breakdown of UK income tax bands and allowances.',
  },
  {
    name: 'PAYE Calculator',
    url: '/paye-calculator',
    description: 'Understand PAYE deductions, National Insurance, and take-home pay.',
  },
  {
    name: 'Salary Calculator',
    url: '/salary-calculator',
    description: 'Plan gross-to-net pay across monthly, weekly, or yearly frequencies.',
  },
];

const schemaKeywords = [
  'Effective tax calculator',
  'Average tax rate',
  'UK tax burden',
  'Income tax and NI',
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

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const computeEffectiveTax = ({ grossIncome, taxableIncome, incomeTaxPaid, nationalInsurancePaid, otherTaxes }) => {
  if (grossIncome <= 0) {
    return {
      valid: false,
      message: 'Enter your gross income to calculate an effective tax rate.',
    };
  }

  const totalTaxPaid = incomeTaxPaid + nationalInsurancePaid + otherTaxes;
  const effectiveRate = (totalTaxPaid / grossIncome) * 100;
  const postTaxIncome = grossIncome - totalTaxPaid;
  const taxToIncomeRatio = taxableIncome > 0 ? (incomeTaxPaid / taxableIncome) * 100 : 0;

  return {
    valid: true,
    grossIncome,
    taxableIncome,
    incomeTaxPaid,
    nationalInsurancePaid,
    otherTaxes,
    totalTaxPaid,
    effectiveRate,
    postTaxIncome,
    taxToIncomeRatio,
  };
};

export default function EffectiveTaxRateCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleChange = (field) => (event) => {
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
      grossIncome: sanitiseNumber(inputs.grossIncome),
      taxableIncome: sanitiseNumber(inputs.taxableIncome),
      incomeTaxPaid: sanitiseNumber(inputs.incomeTaxPaid),
      nationalInsurancePaid: sanitiseNumber(inputs.nationalInsurancePaid),
      otherTaxes: sanitiseNumber(inputs.otherTaxes),
    };

    const outcome = computeEffectiveTax(payload);
    setResults({ ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      {
        name: 'Tax & NI paid',
        value: results.totalTaxPaid,
        color: '#ef4444',
      },
      {
        name: 'Take-home income',
        value: Math.max(results.postTaxIncome, 0),
        color: '#22c55e',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const { payload } = results;
    return [
      ['Metric', 'Value'],
      ['Gross income (£)', results.grossIncome.toFixed(2)],
      ['Taxable income (£)', results.taxableIncome.toFixed(2)],
      ['Income tax paid (£)', results.incomeTaxPaid.toFixed(2)],
      ['National Insurance paid (£)', results.nationalInsurancePaid.toFixed(2)],
      ['Other payroll taxes (£)', results.otherTaxes.toFixed(2)],
      ['Total tax paid (£)', results.totalTaxPaid.toFixed(2)],
      ['Effective tax rate (%)', results.effectiveRate.toFixed(2)],
      ['Income tax vs taxable income (%)', results.taxToIncomeRatio.toFixed(2)],
      ['Take-home income (£)', results.postTaxIncome.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Average UK Tax Rate`}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={schemaKeywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'FinancialProduct',
          name: CALCULATOR_NAME,
          description: metaDescription,
          url: canonicalUrl,
          keywords: schemaKeywords,
        }}
      />
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Effective Tax Rate Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Combine income tax, National Insurance, and payroll deductions to understand your true average tax rate.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Turn your tax bill into a planning tool"
          message="Knowing your effective tax rate helps you negotiate salaries, plan pension contributions, and decide when a side hustle becomes worth the extra admin."
          quote="You must gain control over your money or the lack of it will forever control you."
          author="Dave Ramsey"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Tax inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="grossIncome" className="text-sm font-medium">
                    Gross income (£)
                  </Label>
                  <Input
                    id="grossIncome"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.grossIncome}
                    onChange={handleChange('grossIncome')}
                    placeholder="e.g., 52,000"
                  />
                </div>
                <div>
                  <Label htmlFor="taxableIncome" className="text-sm font-medium">
                    Taxable income (£)
                  </Label>
                  <Input
                    id="taxableIncome"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.taxableIncome}
                    onChange={handleChange('taxableIncome')}
                    placeholder="e.g., 48,000"
                  />
                </div>
                <div>
                  <Label htmlFor="incomeTaxPaid" className="text-sm font-medium">
                    Income tax paid (£)
                  </Label>
                  <Input
                    id="incomeTaxPaid"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.incomeTaxPaid}
                    onChange={handleChange('incomeTaxPaid')}
                    placeholder="e.g., 7,400"
                  />
                </div>
                <div>
                  <Label htmlFor="nationalInsurancePaid" className="text-sm font-medium">
                    National Insurance paid (£)
                  </Label>
                  <Input
                    id="nationalInsurancePaid"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.nationalInsurancePaid}
                    onChange={handleChange('nationalInsurancePaid')}
                    placeholder="e.g., 4,100"
                  />
                </div>
                <div>
                  <Label htmlFor="otherTaxes" className="text-sm font-medium">
                    Other payroll taxes (£)
                  </Label>
                  <Input
                    id="otherTaxes"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.otherTaxes}
                    onChange={handleChange('otherTaxes')}
                    placeholder="e.g., 0"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Add student loan repayments, share schemes, or other workplace deductions if you want to include them.
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
              <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                    <Percent className="h-5 w-5" />
                    Effective tax summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Effective tax rate
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {percentageFormatter.format(results.effectiveRate)}%
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Total tax paid
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.totalTaxPaid)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Take-home income
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.postTaxIncome)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Income tax vs taxable income
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {percentageFormatter.format(results.taxToIncomeRatio)}%
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      <Scale className="h-5 w-5" />
                      Tax versus take-home
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Effective tax split" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="effective-tax-rate-results"
                    title="Effective tax rate summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <FileText className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your income and tax details, then press <strong>Calculate</strong> to see your average tax rate.
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
