import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, PiggyBank, BarChart2 } from 'lucide-react';

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

const CALCULATOR_NAME = 'Dividend Tax Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/dividend-tax-calculator';
const keywords = getCalculatorKeywords('Dividend Tax Calculator');

const metaDescription =
  'Estimate UK dividend tax for the 2025/26 tax year, see how the dividend allowance is used, and combine salary, dividends, and pension contributions for smarter tax planning.';

const defaultInputs = {
  salary: '15,000',
  dividends: '30,000',
  pensionContribution: '5,000',
};

const basicRateBand = 37_700;
const higherRateThreshold = 125_140;
const dividendAllowance = 1_000;

const taxBands = [
  { threshold: basicRateBand, rate: 0.0875, label: 'Basic rate (8.75%)' },
  {
    threshold: higherRateThreshold - basicRateBand,
    rate: 0.3375,
    label: 'Higher rate (33.75%)',
  },
  { threshold: Infinity, rate: 0.3935, label: 'Additional rate (39.35%)' },
];

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

const dividendFaqs = [
  {
    question: 'What is the dividend allowance for the 2025/26 tax year?',
    answer:
      'The dividend allowance is £1,000 for the 2025/26 tax year. Dividends within the allowance are tax-free and do not use up your income tax rate bands.',
  },
  {
    question: 'How do pension contributions affect my dividend tax?',
    answer:
      'Personal pension contributions extend your basic rate band. Enter them here to see how much additional dividend income can be taxed at 8.75% before hitting the higher rate.',
  },
  {
    question: 'Can I reduce my dividend tax bill by spreading payouts?',
    answer:
      'Yes. Splitting dividends across tax years or between shareholders lets each person use their £1,000 allowance and lower rate bands, helping to reduce overall tax.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'See every UK calculator available on Calc My Money.',
  },
  {
    label: 'Tax & income planning tools',
    url: '/#tax-income',
    description: 'Optimise salary, dividends, and allowances across the UK tax system.',
  },
  {
    label: 'Savings & investments hub',
    url: '/#savings-investments',
    description: 'Track compounding, ISA allowances, and long-term investment growth.',
  },
];

const relatedCalculators = [
  {
    name: 'Income Tax Calculator',
    url: '/income-tax-calculator',
    description: 'Combine salary and dividends to see overall tax and take-home pay.',
  },
  {
    name: 'Effective Tax Rate Calculator',
    url: '/effective-tax-rate-calculator',
    description: 'Understand the blended tax rate across salary, dividends, and bonuses.',
  },
  {
    name: 'Pension Contribution Calculator',
    url: '/pension-contribution-calculator',
    description: 'Model how contributions expand your basic rate band.',
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

const faqStructuredData = faqSchema(dividendFaqs);

const computeDividendTax = ({ salary, dividends, pensionContribution }) => {
  const salaryIncome = Math.max(salary, 0);
  const dividendIncome = Math.max(dividends, 0);
  const pension = Math.max(pensionContribution, 0);

  if (salaryIncome <= 0 && dividendIncome <= 0) {
    return { valid: false, message: 'Enter your salary and dividend amounts to estimate tax.' };
  }

  const totalIncome = salaryIncome + dividendIncome;
  const adjustedIncome = Math.max(totalIncome - pension, 0);
  const taxableIncomeBeforeDividends = Math.max(adjustedIncome - dividendIncome, 0);

  let remainingDividends = Math.max(dividendIncome - dividendAllowance, 0);
  let remainingBasicBand = Math.max(basicRateBand - taxableIncomeBeforeDividends, 0);
  if (taxableIncomeBeforeDividends >= higherRateThreshold) {
    remainingBasicBand = 0;
  }

  const breakdown = [];
  let taxDue = 0;

  taxBands.forEach((band) => {
    if (remainingDividends <= 0) return;

    let bandAllowance;
    if (band.threshold === Infinity) {
      bandAllowance = remainingDividends;
    } else if (band.rate === 0.0875) {
      bandAllowance = Math.min(remainingBasicBand, remainingDividends);
    } else if (band.rate === 0.3375) {
      const higherBandBase = Math.max(taxableIncomeBeforeDividends, basicRateBand);
      const higherBandCapacity = Math.max(higherRateThreshold - higherBandBase, 0);
      bandAllowance = Math.min(remainingDividends, higherBandCapacity);
    } else {
      bandAllowance = Math.min(remainingDividends, band.threshold);
    }

    if (bandAllowance <= 0) {
      return;
    }

    const bandTax = bandAllowance * band.rate;
    taxDue += bandTax;
    breakdown.push({
      label: band.label,
      amount: bandAllowance,
      rate: band.rate,
      tax: bandTax,
    });

    if (band.rate === 0.0875) {
      remainingBasicBand = Math.max(remainingBasicBand - bandAllowance, 0);
    }
    remainingDividends -= bandAllowance;
  });

  const taxableDividends = Math.max(dividendIncome - dividendAllowance, 0);
  const netDividends = dividendIncome - taxDue;
  const effectiveRate = dividendIncome > 0 ? (taxDue / dividendIncome) * 100 : 0;

  return {
    valid: true,
    salaryIncome,
    dividendIncome,
    pension,
    adjustedIncome,
    taxableIncomeBeforeDividends,
    taxableDividends,
    taxDue,
    netDividends,
    effectiveRate,
    allowanceUsed: Math.min(dividendIncome, dividendAllowance),
    breakdown,
  };
};

export default function DividendTaxCalculatorPage() {
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
      salary: sanitiseNumber(inputs.salary),
      dividends: sanitiseNumber(inputs.dividends),
      pensionContribution: sanitiseNumber(inputs.pensionContribution),
    };
    const outcome = computeDividendTax(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      {
        name: 'Tax due',
        value: results.taxDue,
        color: '#ef4444',
      },
      {
        name: 'Net dividends kept',
        value: Math.max(results.netDividends, 0),
        color: '#22c55e',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const summary = [
      ['Metric', 'Value'],
      ['Salary (gross)', results.salaryIncome.toFixed(2)],
      ['Dividends received', results.dividendIncome.toFixed(2)],
      ['Pension contribution', results.pension.toFixed(2)],
      ['Adjusted income', results.adjustedIncome.toFixed(2)],
      ['Dividend allowance used', results.allowanceUsed.toFixed(2)],
      ['Taxable dividends', results.taxableDividends.toFixed(2)],
      ['Dividend tax due', results.taxDue.toFixed(2)],
      ['Net dividends after tax', results.netDividends.toFixed(2)],
      ['Effective tax rate (%)', results.effectiveRate.toFixed(2)],
    ];
    const detailed = results.breakdown.length
      ? [
          [],
          ['Band', 'Taxed amount (£)', 'Rate', 'Tax due (£)'],
          ...results.breakdown.map((band) => [
            band.label,
            band.amount.toFixed(2),
            `${percentageFormatter.format(band.rate * 100)}%`,
            band.tax.toFixed(2),
          ]),
        ]
      : [];
    return [...summary, ...detailed];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | UK Dividend Allowance Helper`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${CALCULATOR_NAME} | UK Dividend Allowance Helper`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${CALCULATOR_NAME} | UK Dividend Allowance Helper`} />
        <meta name="twitter:description" content={metaDescription} />
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Dividend Tax Calculator
          </Heading>
          <p className="calculator-hero__description">
            Combine salary, dividends, and pension contributions to keep more of the income your investments work so hard to generate.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Plan payouts with confidence"
          message="Forecasting your dividend tax bill before the year closes helps you choose the right mix of salary, pension, and dividends for a smoother cash flow."
          quote="The stock market is a device for transferring money from the impatient to the patient."
          author="Warren Buffett"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Income inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="salary" className="text-sm font-medium">
                    Salary (gross, per year)
                  </Label>
                  <Input
                    id="salary"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.salary}
                    onChange={handleInputChange('salary')}
                    placeholder="e.g., 15,000"
                  />
                </div>
                <div>
                  <Label htmlFor="dividends" className="text-sm font-medium">
                    Dividends paid (per year)
                  </Label>
                  <Input
                    id="dividends"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.dividends}
                    onChange={handleInputChange('dividends')}
                    placeholder="e.g., 30,000"
                  />
                </div>
                <div>
                  <Label htmlFor="pensionContribution" className="text-sm font-medium">
                    Personal pension contributions
                  </Label>
                  <Input
                    id="pensionContribution"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.pensionContribution}
                    onChange={handleInputChange('pensionContribution')}
                    placeholder="e.g., 5,000"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include gross personal contributions that attract tax relief.
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
                    <PiggyBank className="h-5 w-5" />
                    Dividend tax summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Tax due
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.taxDue)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Net dividends
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.netDividends)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Allowance used
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.allowanceUsed)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Effective rate
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {percentageFormatter.format(results.effectiveRate)}%
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      <BarChart2 className="h-5 w-5" />
                      Net income versus tax
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Dividend tax versus income kept" />
                  </div>

                  {results.breakdown.length ? (
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100">
                        Dividend tax bands used
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 text-xs uppercase tracking-wide">
                            <tr>
                              <th className="px-3 py-2">Band</th>
                              <th className="px-3 py-2">Taxed amount</th>
                              <th className="px-3 py-2">Rate</th>
                              <th className="px-3 py-2">Tax due</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.breakdown.map((band, index) => (
                              <tr
                                key={`${band.label}-${index}`}
                                className="border-b border-indigo-100 dark:border-indigo-800"
                              >
                                <td className="px-3 py-2 text-indigo-900 dark:text-indigo-100">
                                  {band.label}
                                </td>
                                <td className="px-3 py-2 text-indigo-900 dark:text-indigo-100">
                                  {currencyFormatter.format(band.amount)}
                                </td>
                                <td className="px-3 py-2 text-indigo-900 dark:text-indigo-100">
                                  {percentageFormatter.format(band.rate * 100)}%
                                </td>
                                <td className="px-3 py-2 text-indigo-900 dark:text-indigo-100">
                                  {currencyFormatter.format(band.tax)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-indigo-800 dark:text-indigo-200">
                      All dividends fall within the £{dividendAllowance.toLocaleString('en-GB')} allowance or existing basic rate band, so no dividend tax is due.
                    </p>
                  )}

                  <ExportActions
                    csvData={csvData}
                    fileName='dividend-tax-calculator-results'
                    title="Dividend tax calculation summary"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Percent className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your salary, dividends, and pension contributions, then press{' '}
                        <strong>Calculate</strong> to see how much dividend tax you owe.
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
          <FAQSection faqs={dividendFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
