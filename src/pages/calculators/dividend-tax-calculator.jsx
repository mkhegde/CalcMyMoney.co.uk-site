import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, PiggyBank } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = ['dividend tax calculator', 'dividend tax'];

const metaDescription =
  'Use our dividend tax calculator to estimate dividend tax liability, plan payouts, and understand how the dividend allowance affects your investment income.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/dividend-tax-calculator';
const schemaKeywords = keywords;

const basicRateBand = 37700;
const higherRateThreshold = 125140;
const dividendAllowance = 1000;

const taxBands = [
  { threshold: basicRateBand, rate: 0.0875, label: 'Basic rate' },
  {
    threshold: higherRateThreshold - basicRateBand,
    rate: 0.3375,
    label: 'Higher rate',
  },
  { threshold: Infinity, rate: 0.3935, label: 'Additional rate' },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const calculateDividendTax = ({ salary, dividends, pensionContribution }) => {
  const totalIncome = salary + dividends;
  const adjustedIncome = Math.max(totalIncome - pensionContribution, 0);

  let remainingDividends = Math.max(dividends - dividendAllowance, 0);
  let taxDue = 0;
  const breakdown = [];

  const taxableIncomeBeforeDividends = Math.max(adjustedIncome - dividends, 0);

  let remainingBasicBand = Math.max(basicRateBand - taxableIncomeBeforeDividends, 0);
  if (taxableIncomeBeforeDividends >= higherRateThreshold) remainingBasicBand = 0;

  taxBands.forEach((band) => {
    if (remainingDividends <= 0) return;

    let bandAllowance;
    if (band.threshold === Infinity) {
      bandAllowance = remainingDividends;
    } else if (band.rate === 0.0875) {
      bandAllowance = Math.min(remainingBasicBand, remainingDividends);
    } else if (band.rate === 0.3375) {
      const higherBandCapacity =
        higherRateThreshold - Math.max(taxableIncomeBeforeDividends, basicRateBand);
      bandAllowance = Math.max(Math.min(remainingDividends, higherBandCapacity), 0);
    } else {
      bandAllowance = Math.min(remainingDividends, band.threshold);
    }

    if (bandAllowance <= 0) {
      return;
    }

    const tax = bandAllowance * band.rate;
    taxDue += tax;

    breakdown.push({
      label: band.label,
      amount: bandAllowance,
      rate: band.rate,
      tax,
    });

    remainingDividends -= bandAllowance;
  });

  const effectiveRate = dividends > 0 ? (taxDue / dividends) * 100 : 0;

  return {
    salary,
    dividends,
    pensionContribution,
    adjustedIncome,
    taxDue,
    effectiveRate,
    breakdown,
  };
};

const dividendFaqs = [
  {
    question: 'What is the dividend allowance for the 2025/26 tax year?',
    answer:
      'The dividend allowance is £1,000 for the 2025/26 tax year. Dividends within the allowance are tax-free and do not use your income tax bands.',
  },
  {
    question: 'How do pension contributions affect dividend tax?',
    answer:
      'Company pension contributions reduce profits before Corporation Tax, while personal contributions extend your basic rate band. Include personal contributions here to see the impact on your dividend tax bill.',
  },
  {
    question: 'Can I split dividends with my spouse?',
    answer:
      'Yes, if you both own shares. Each shareholder can use their own dividend allowance and rate bands, which can significantly reduce overall tax.',
  },
];

export default function DividendTaxCalculatorPage() {
  const [inputs, setInputs] = useState({
    salary: 15000,
    dividends: 30000,
    pensionContribution: 5000,
  });

  const results = useMemo(() => calculateDividendTax(inputs), [inputs]);

  const resetInputs = () =>
    setInputs({
      salary: 15000,
      dividends: 30000,
      pensionContribution: 5000,
    });

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Dividend Tax Calculator | Dividend Tax</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Dividend Tax Calculator | Dividend Tax" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dividend Tax Calculator | Dividend Tax" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Dividend Tax Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate dividend tax',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Dividend Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Forecast your dividend tax liability, see which rate bands you fall into, and understand
            how allowances and pension contributions reshape the final bill.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Income Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary (gross, per year)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.salary}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, salary: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="dividends" className="text-sm font-medium">
                  Dividends received (per year)
                </Label>
                <Input
                  id="dividends"
                  type="number"
                  min={0}
                  inputMode="decimal"
                  value={inputs.dividends}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, dividends: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Personal pension contributions
                  <span className="text-indigo-600 font-semibold">
                    £{inputs.pensionContribution.toLocaleString('en-GB')}
                  </span>
                </Label>
                <Slider
                  value={[inputs.pensionContribution]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, pensionContribution: value[0] }))
                  }
                  min={0}
                  max={30000}
                  step={500}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Gross contributions made personally. Employer contributions reduce company profits
                  before Corporation Tax.
                </p>
              </div>
              <Button variant="outline" onClick={resetInputs} className="w-full">
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <PiggyBank className="h-5 w-5" />
                  Dividend Tax Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Tax due</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.taxDue)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Effective rate</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {percentageFormatter.format(results.effectiveRate)}%
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Adjusted income</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.adjustedIncome)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Allowance used</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">£1,000</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-slate-600" />
                  Rate Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                {results.breakdown.length === 0 ? (
                  <p>No dividend tax applies under the allowance.</p>
                ) : (
                  results.breakdown.map((band) => (
                    <div key={band.label} className="flex items-center justify-between">
                      <span>
                        {band.label}: {currencyFormatter.format(band.amount)}
                      </span>
                      <span>
                        {percentageFormatter.format(band.rate * 100)}% -&gt;{' '}
                        {currencyFormatter.format(band.tax)}
                      </span>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Maximising your dividend tax allowance
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Split shareholdings between spouses, increase pension contributions, or layer income
                from ISA investments to protect more of your gains from dividend tax.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Planning ahead with a uk dividend tax calculator
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Review your uk dividend tax calculator forecast before drawing funds from your
                limited company. Aligning dividend timing with future tax years can reduce your
                sizeable liabilities.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={dividendFaqs} />
        </div>
      </section>
    </div>
  );
}
