import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, PiggyBank, Receipt } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'contractor calculator',
  'contractor take home pay calculator',
  'limited company contractor calculator',
];

const metaDescription =
  'Use our contractor calculator to compare take-home pay, model contractor take home pay calculator scenarios, and optimise with a limited company contractor calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/contractor-calculator';
const schemaKeywords = keywords.slice(0, 5);

const taxBands = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12571, max: 50270, rate: 0.2 },
  { min: 50271, max: 125140, rate: 0.4 },
  { min: 125141, max: Infinity, rate: 0.45 },
];

const niBands = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12571, max: 50270, rate: 0.12 },
  { min: 50271, max: Infinity, rate: 0.02 },
];

const dividendBands = [
  { min: 0, max: 1000, rate: 0 },
  { min: 1001, max: 37500, rate: 0.0875 },
  { min: 37501, max: 125140, rate: 0.3375 },
  { min: 125141, max: Infinity, rate: 0.3935 },
];

const defaultInputs = {
  dayRate: 500,
  workingDays: 220,
  expenses: 6000,
  pensionContribution: 8000,
  salary: 12570,
  businessCostsPercent: 10,
  accountingFees: 1200,
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const calculateTax = (income, bands) => {
  let remaining = income;
  let tax = 0;

  for (const band of bands) {
    if (remaining <= 0) break;
    const bandUpper =
      band.max === Infinity
        ? remaining
        : Math.min(remaining, band.max - band.min + (band.min === 0 ? 0 : 1));
    const taxable = Math.max(bandUpper - (band.min === 0 ? 0 : 1), 0);
    tax += taxable * band.rate;
    remaining -= taxable;
  }

  return Math.max(tax, 0);
};

const contractorFaqs = [
  {
    question: 'How does this contractor calculator handle dividends?',
    answer:
      'The calculator assumes you take a modest salary up to the primary threshold, with the remainder paid as dividends after corporation tax. Dividend tax bands are applied to show the impact on your take-home pay.',
  },
  {
    question: 'Can I model pension contributions and expenses?',
    answer:
      'Yes. Add annual pension contributions, business expenses, or professional fees. These reduce your taxable company profit, which in turn lowers corporation tax and increases available dividends.',
  },
  {
    question: 'What about IR35 considerations?',
    answer:
      'This calculator focuses on outside IR35 contracts. If you are deemed inside IR35, you will be taxed like an employee via PAYE, so the take-home figure will be significantly lower. Always confirm IR35 status before relying on the estimates.',
  },
];

const computeContractorTakeHome = (inputs) => {
  const dayRate = Number(inputs.dayRate) || 0;
  const workingDays = Number(inputs.workingDays) || 0;
  const expenses = Number(inputs.expenses) || 0;
  const pensionContribution = Number(inputs.pensionContribution) || 0;
  const salary = Number(inputs.salary) || 0;
  const businessCostsPercent = Number(inputs.businessCostsPercent) || 0;
  const accountingFees = Number(inputs.accountingFees) || 0;

  const grossRevenue = dayRate * workingDays;
  const businessCosts = (grossRevenue * businessCostsPercent) / 100;
  const companyProfitBeforeTax =
    grossRevenue - businessCosts - expenses - pensionContribution - salary - accountingFees;

  const corporationTaxRate = 0.19;
  const corporationTax = Math.max(companyProfitBeforeTax * corporationTaxRate, 0);
  const postTaxProfit = Math.max(companyProfitBeforeTax - corporationTax, 0);

  const dividends = Math.max(postTaxProfit, 0);

  const incomeTax = calculateTax(salary, taxBands);
  const nationalInsurance = calculateTax(salary, niBands);
  const dividendTax = calculateTax(dividends, dividendBands);

  const takeHome =
    salary + dividends - incomeTax - nationalInsurance - dividendTax - accountingFees - expenses;

  const effectiveRate = grossRevenue > 0 ? (takeHome / grossRevenue) * 100 : 0;

  return {
    grossRevenue,
    businessCosts,
    companyProfitBeforeTax,
    corporationTax,
    postTaxProfit,
    dividends,
    salary,
    pensionContribution,
    incomeTax,
    nationalInsurance,
    dividendTax,
    takeHome,
    effectiveRate,
  };
};

export default function ContractorCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const results = useMemo(() => computeContractorTakeHome(inputs), [inputs]);

  const resetInputs = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Contractor Calculator | Contractor Take Home Pay Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta
          property="og:title"
          content="Contractor Calculator | Contractor Take Home Pay Calculator"
        />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Contractor Calculator | Contractor Take Home Pay Calculator"
        />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Contractor Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Estimate contractor take home pay',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Contractor Calculator
          </Heading>
          <p className="text-lg md:text-xl text-emerald-100">
            Compare day rates, salary, and dividends to understand your contractor take-home pay and
            optimise your limited company setup.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          <Card className="border border-emerald-200 dark:border-emerald-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-emerald-500" />
                Contract Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="dayRate" className="text-sm font-medium">
                  Day rate (£)
                </Label>
                <Input
                  id="dayRate"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.dayRate}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, dayRate: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Working days per year
                  <span className="text-emerald-600 font-semibold">{inputs.workingDays}</span>
                </Label>
                <Slider
                  value={[inputs.workingDays]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, workingDays: value[0] }))
                  }
                  min={100}
                  max={260}
                  step={5}
                />
              </div>
              <div>
                <Label htmlFor="expenses" className="text-sm font-medium">
                  Allowable expenses (£/year)
                </Label>
                <Input
                  id="expenses"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.expenses}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, expenses: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="pensionContribution" className="text-sm font-medium">
                  Pension contribution (£/year)
                </Label>
                <Input
                  id="pensionContribution"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.pensionContribution}
                  onChange={(event) =>
                    setInputs((prev) => ({
                      ...prev,
                      pensionContribution: Number(event.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="salary" className="text-sm font-medium">
                  Director salary (£/year)
                </Label>
                <Input
                  id="salary"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.salary}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, salary: Number(event.target.value) }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium flex justify-between items-center">
                  Business costs (% of revenue)
                  <span className="text-emerald-600 font-semibold">
                    {percentageFormatter.format(inputs.businessCostsPercent)}%
                  </span>
                </Label>
                <Slider
                  value={[inputs.businessCostsPercent]}
                  onValueChange={(value) =>
                    setInputs((prev) => ({ ...prev, businessCostsPercent: value[0] }))
                  }
                  min={0}
                  max={25}
                  step={0.5}
                />
              </div>
              <div>
                <Label htmlFor="accountingFees" className="text-sm font-medium">
                  Accounting & insurances (£/year)
                </Label>
                <Input
                  id="accountingFees"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.accountingFees}
                  onChange={(event) =>
                    setInputs((prev) => ({ ...prev, accountingFees: Number(event.target.value) }))
                  }
                />
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
                  <PiggyBank className="h-5 w-5" />
                  Contractor Take-Home Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-4 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Gross revenue</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.grossRevenue)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Take-home pay</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.takeHome)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Effective rate</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {percentageFormatter.format(results.effectiveRate)}%
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-emerald-900/60 p-4 border border-emerald-100 dark:border-emerald-800">
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Dividends</p>
                  <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {currencyFormatter.format(results.dividends)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Receipt className="h-5 w-5 text-slate-600" />
                  Tax Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Income tax & NI
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.incomeTax + results.nationalInsurance)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Salary of {currencyFormatter.format(results.salary)} triggers{' '}
                    {currencyFormatter.format(results.incomeTax)} income tax and{' '}
                    {currencyFormatter.format(results.nationalInsurance)} National Insurance.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wide mb-2">
                    Corporation & dividend tax
                  </h3>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.corporationTax + results.dividendTax)}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                    Corporation tax of {currencyFormatter.format(results.corporationTax)} and
                    dividend tax of {currencyFormatter.format(results.dividendTax)} apply after
                    expenses and pension contributions.
                  </p>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Contractor take home pay calculator scenarios
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Adjust expenses, salary, and pension contributions to see how the contractor take
                home pay calculator impacts your net earnings. Running multiple scenarios helps you
                decide whether to increase pension savings or tweak your salary/dividend split.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Limited company contractor calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Enter updated day rates when negotiating contracts. The limited company contractor
                calculator reveals how much revenue you need to reach target take-home pay after
                corporation tax, dividend tax, and your chosen expenses.
              </p>
            </section>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={contractorFaqs} />
        </div>
      </section>
    </div>
  );
}
