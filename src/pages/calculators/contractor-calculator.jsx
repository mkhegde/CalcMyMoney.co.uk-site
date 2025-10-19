import React, { useMemo, useState } from 'react';
import { Calculator, PiggyBank, Receipt, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart.jsx';

const keywords = [
  'contractor calculator',
  'contractor take home pay calculator',
  'limited company contractor calculator',
];

const metaDescription =
  'Estimate UK contractor take-home pay using day rate, salary, dividends, expenses, pension contributions, and company costs.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/contractor-calculator';
const pagePath = '/calculators/contractor-calculator';
const pageTitle = 'Contractor Calculator | UK Limited Company Take-Home Pay';

const faqItems = [
  {
    question: 'How does the calculator treat dividends?',
    answer:
      'It assumes you draw a small salary up to the personal allowance and distribute remaining profits as dividends after corporation tax. Dividend tax bands are then applied.',
  },
  {
    question: 'Can I include pension contributions and allowances?',
    answer:
      'Yes. Pension contributions and allowable business expenses reduce company profit, lowering corporation tax and increasing net dividends.',
  },
  {
    question: 'Does this calculator consider IR35?',
    answer:
      'It models outside IR35 engagements. If your contract is inside IR35 you will be taxed via PAYE, so the actual take-home pay will be lower.',
  },
];

const emotionalMessage =
  'Understanding your pay structure keeps your contract worthwhile. Test different rates, expenses, and draws so every invoice translates into real income.';

const emotionalQuote = {
  text: 'Do not save what is left after spending; instead spend what is left after saving.',
  author: 'Warren Buffett',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const taxBands = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 0.2 },
  { min: 50270, max: 125140, rate: 0.4 },
  { min: 125140, max: Infinity, rate: 0.45 },
];

const niBands = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12570, max: 50270, rate: 0.12 },
  { min: 50270, max: Infinity, rate: 0.02 },
];

const dividendBands = [
  { min: 0, max: 1000, rate: 0 },
  { min: 1000, max: 1000 + 37500, rate: 0.0875 },
  { min: 1000 + 37500, max: 125140, rate: 0.3375 },
  { min: 125140, max: Infinity, rate: 0.3935 },
];

const defaultInputs = {
  dayRate: '500',
  workingDays: '220',
  expenses: '6,000',
  pensionContribution: '8,000',
  salary: '12,570',
  businessCostsPercent: '10',
  accountingFees: '1,200',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateBandTax = (income, bands) => {
  let tax = 0;
  for (const band of bands) {
    if (income > band.min) {
      const upperLimit = Math.min(income, band.max);
      const taxable = Math.max(upperLimit - band.min, 0);
      tax += taxable * band.rate;
    } else {
      break;
    }
  }
  return tax;
};

function computeContractorTakeHome(inputs) {
  const dayRate = parseNumber(inputs.dayRate);
  const workingDays = parseNumber(inputs.workingDays);
  const expenses = parseNumber(inputs.expenses);
  const pensionContribution = parseNumber(inputs.pensionContribution);
  const salary = parseNumber(inputs.salary);
  const businessCostsPercent = parseNumber(inputs.businessCostsPercent);
  const accountingFees = parseNumber(inputs.accountingFees);

  const grossRevenue = dayRate * workingDays;
  const businessCosts = (grossRevenue * businessCostsPercent) / 100;
  const companyProfitBeforeTax =
    grossRevenue - businessCosts - expenses - pensionContribution - salary - accountingFees;

  const corporationTaxRate = 0.19;
  const corporationTax = Math.max(companyProfitBeforeTax * corporationTaxRate, 0);
  const postTaxProfit = Math.max(companyProfitBeforeTax - corporationTax, 0);

  const dividends = Math.max(postTaxProfit, 0);
  const incomeTax = calculateBandTax(salary, taxBands);
  const nationalInsurance = calculateBandTax(salary, niBands);
  const dividendTax = calculateBandTax(dividends, dividendBands);

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
    expenses,
    accountingFees,
    effectiveRate,
  };
}

export default function ContractorCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Contractor Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Business & Freelancing Calculators', url: '/calculators#business-freelancing' },
      { name: 'Contractor Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    const taxes = results.incomeTax + results.nationalInsurance + results.dividendTax + results.corporationTax;
    const costs = results.expenses + results.accountingFees + results.businessCosts;
    return [
      { name: 'Net take-home', value: Math.max(results.takeHome, 0), color: '#10b981' },
      { name: 'Total tax', value: Math.max(taxes, 0), color: '#f97316' },
      { name: 'Business costs', value: Math.max(costs, 0), color: '#0ea5e9' },
    ].filter((segment) => segment.value > 0);
  }, [results, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const computed = computeContractorTakeHome(inputs);
    setHasCalculated(true);
    setResults(computed);

    setCsvData([
      ['Day rate', currencyFormatter.format(parseNumber(inputs.dayRate))],
      ['Working days per year', inputs.workingDays],
      ['Gross revenue', currencyFormatter.format(computed.grossRevenue)],
      ['Salary', currencyFormatter.format(computed.salary)],
      ['Dividends', currencyFormatter.format(computed.dividends)],
      ['Income tax', currencyFormatter.format(computed.incomeTax)],
      ['National Insurance', currencyFormatter.format(computed.nationalInsurance)],
      ['Dividend tax', currencyFormatter.format(computed.dividendTax)],
      ['Corporation tax', currencyFormatter.format(computed.corporationTax)],
      ['Business costs', currencyFormatter.format(computed.businessCosts)],
      ['Expenses', currencyFormatter.format(computed.expenses)],
      ['Accounting fees', currencyFormatter.format(computed.accountingFees)],
      ['Net take-home', currencyFormatter.format(computed.takeHome)],
      ['Effective take-home rate', `${computed.effectiveRate.toFixed(1)}%`],
    ]);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        jsonLd={schema}
      />

      <CalculatorWrapper>
        <div className="space-y-10">
          <header className="space-y-6 text-slate-900 dark:text-slate-100">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Contractor Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate day-rate income, corporation tax, salary, and dividends to see your take-home pay when working through a UK limited company.
            </p>
          </header>

          <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Plan your contract income with clarity
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-emerald-200 bg-emerald-50/70 p-4 text-sm text-emerald-900 shadow-sm dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Contract inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="dayRate">Day rate (£)</Label>
                      <Input
                        id="dayRate"
                        inputMode="decimal"
                        value={inputs.dayRate}
                        onChange={handleInputChange('dayRate')}
                        placeholder="e.g. 500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workingDays">Working days per year</Label>
                      <Input
                        id="workingDays"
                        inputMode="numeric"
                        value={inputs.workingDays}
                        onChange={handleInputChange('workingDays')}
                        placeholder="e.g. 220"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenses">Allowable expenses (£/year)</Label>
                      <Input
                        id="expenses"
                        inputMode="decimal"
                        value={inputs.expenses}
                        onChange={handleInputChange('expenses')}
                        placeholder="e.g. 6,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionContribution">Pension contribution (£/year)</Label>
                      <Input
                        id="pensionContribution"
                        inputMode="decimal"
                        value={inputs.pensionContribution}
                        onChange={handleInputChange('pensionContribution')}
                        placeholder="e.g. 8,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salary">Director salary (£/year)</Label>
                      <Input
                        id="salary"
                        inputMode="decimal"
                        value={inputs.salary}
                        onChange={handleInputChange('salary')}
                        placeholder="e.g. 12,570"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="businessCostsPercent">Business costs (% of revenue)</Label>
                      <Input
                        id="businessCostsPercent"
                        inputMode="decimal"
                        value={inputs.businessCostsPercent}
                        onChange={handleInputChange('businessCostsPercent')}
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accountingFees">Accounting & insurances (£/year)</Label>
                      <Input
                        id="accountingFees"
                        inputMode="decimal"
                        value={inputs.accountingFees}
                        onChange={handleInputChange('accountingFees')}
                        placeholder="e.g. 1,200"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate take-home
                    </Button>
                    <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter contract details and press{' '}
                    <span className="font-semibold">Calculate take-home</span> to view contractor pay,
                    taxes, and dividends.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Contractor summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Gross revenue</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossRevenue)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Net take-home pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.takeHome)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Effective take-home rate</p>
                        <p className="text-2xl font-semibold">{results.effectiveRate.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Corporation tax</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.corporationTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Income tax & NI</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.incomeTax + results.nationalInsurance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Dividend tax</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.dividendTax)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="contractor-take-home"
                          title="Contractor calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Cash flow breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBreakdownChart data={chartData} title="Contractor pay distribution" />
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Keep more of what you earn
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Review your salary and dividend mix each tax year, set aside corporation tax as you go,
              and explore pension contributions to reduce your overall tax bill.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}

