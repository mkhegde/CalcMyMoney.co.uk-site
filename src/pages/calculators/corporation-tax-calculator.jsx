import React, { useMemo, useState } from 'react';
import { Calculator, TrendingUp, Receipt, Quote, BookOpen } from 'lucide-react';

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

const keywords = ['corporation tax calculator', 'corporation tax', 'business tax calculator'];

const metaDescription =
  'Estimate UK corporation tax with allowances, marginal relief, and associated companies. See your effective tax rate and post-tax profit instantly.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/corporation-tax-calculator';
const pagePath = '/calculators/corporation-tax-calculator';
const pageTitle = 'Corporation Tax Calculator | UK Company Profit Planner';

const faqItems = [
  {
    question: 'Which UK corporation tax rates are used?',
    answer:
      'The calculator applies the 19% small profits rate, 25% main rate, and marginal relief between £50,000 and £250,000 adjusted for associated companies.',
  },
  {
    question: 'What allowances should I include?',
    answer:
      'Add deductible expenses such as salaries, pensions, and operating costs, plus capital allowances or super-deduction items. These reduce taxable profit before corporation tax.',
  },
  {
    question: 'How do associated companies affect tax?',
    answer:
      'If you control more than one company the small profits thresholds fall. Enter the total number of associated companies to see the adjusted limits and effective tax rate.',
  },
];

const emotionalMessage =
  'Clarity on corporation tax lets you plan dividends, pensions, and reinvestment with confidence. Know the impact before your year-end crunch.';

const emotionalQuote = {
  text: 'A budget is telling your money where to go instead of wondering where it went.',
  author: 'Dave Ramsey',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  maximumFractionDigits: 2,
});

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

function calculateCorporationTax({ profits, expenses, capitalAllowance, associatedCompanies }) {
  const profitBeforeTax = Math.max(parseNumber(profits), 0);
  const allowableExpenses = Math.max(parseNumber(expenses), 0);
  const capital = Math.max(parseNumber(capitalAllowance), 0);
  const associates = Math.min(Math.max(parseNumber(associatedCompanies) || 1, 1), 50);

  const adjustedProfits = Math.max(profitBeforeTax - allowableExpenses - capital, 0);

  const mainRate = 0.25;
  const smallRate = 0.19;
  const lowerLimit = 50000 / associates;
  const upperLimit = 250000 / associates;

  let corporationTax = 0;
  let effectiveRate = 0;

  if (adjustedProfits <= lowerLimit) {
    corporationTax = adjustedProfits * smallRate;
    effectiveRate = smallRate;
  } else if (adjustedProfits >= upperLimit) {
    corporationTax = adjustedProfits * mainRate;
    effectiveRate = mainRate;
  } else {
    const marginalReliefFraction =
      ((upperLimit - adjustedProfits) * (mainRate - smallRate)) / adjustedProfits;
    effectiveRate = mainRate - marginalReliefFraction;
    corporationTax = adjustedProfits * effectiveRate;
  }

  const postTaxProfit = adjustedProfits - corporationTax;

  return {
    profitBeforeTax,
    allowableExpenses,
    capital,
    adjustedProfits,
    corporationTax,
    effectiveRate: effectiveRate * 100,
    postTaxProfit,
    lowerLimit,
    upperLimit,
  };
}

export default function CorporationTaxCalculatorPage() {
  const [inputs, setInputs] = useState({
    profits: '185,000',
    expenses: '65,000',
    capitalAllowance: '12,500',
    associatedCompanies: '1',
  });
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Corporation Tax Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Business & Freelancing Calculators', url: '/calculators#business-freelancing' },
      { name: 'Corporation Tax Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!results || !hasCalculated) return [];
    return [
      { name: 'Post-tax profit', value: results.postTaxProfit, color: '#22c55e' },
      { name: 'Corporation tax', value: results.corporationTax, color: '#f97316' },
      { name: 'Allowable expenses', value: results.allowableExpenses, color: '#0ea5e9' },
      { name: 'Capital allowances', value: results.capital, color: '#6366f1' },
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
    const computed = calculateCorporationTax(inputs);
    setHasCalculated(true);
    setResults(computed);

    setCsvData([
      ['Profit before tax', currencyFormatter.format(computed.profitBeforeTax)],
      ['Allowable expenses', currencyFormatter.format(computed.allowableExpenses)],
      ['Capital allowances', currencyFormatter.format(computed.capital)],
      ['Adjusted profits', currencyFormatter.format(computed.adjustedProfits)],
      ['Corporation tax', currencyFormatter.format(computed.corporationTax)],
      ['Post-tax profit', currencyFormatter.format(computed.postTaxProfit)],
      ['Effective tax rate', `${percentFormatter.format(computed.effectiveRate)}%`],
      ['Lower small profits limit', currencyFormatter.format(computed.lowerLimit)],
      ['Upper main rate limit', currencyFormatter.format(computed.upperLimit)],
    ]);
  };

  const handleReset = () => {
    setInputs({
      profits: '185,000',
      expenses: '65,000',
      capitalAllowance: '12,500',
      associatedCompanies: '1',
    });
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
                Corporation Tax Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Enter annual profits, expenses, and capital allowances to calculate corporation tax, marginal relief, and post-tax profits for your UK limited company.
            </p>
          </header>

          <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Make every pound of profit work harder
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
                  Company figures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profits">Accounting profit (before tax) (£)</Label>
                      <Input
                        id="profits"
                        inputMode="decimal"
                        value={inputs.profits}
                        onChange={handleInputChange('profits')}
                        placeholder="e.g. 185,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenses">Allowable expenses (£)</Label>
                      <Input
                        id="expenses"
                        inputMode="decimal"
                        value={inputs.expenses}
                        onChange={handleInputChange('expenses')}
                        placeholder="e.g. 65,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capitalAllowance">Capital allowances (£)</Label>
                      <Input
                        id="capitalAllowance"
                        inputMode="decimal"
                        value={inputs.capitalAllowance}
                        onChange={handleInputChange('capitalAllowance')}
                        placeholder="e.g. 12,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="associatedCompanies">Number of associated companies</Label>
                      <Input
                        id="associatedCompanies"
                        inputMode="numeric"
                        value={inputs.associatedCompanies}
                        onChange={handleInputChange('associatedCompanies')}
                        placeholder="e.g. 1"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate corporation tax
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
                    Enter your profit and allowances, then press{' '}
                    <span className="font-semibold">Calculate corporation tax</span> to view your tax bill,
                    effective rate, and post-tax profit.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Corporation tax summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Taxable profits</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.adjustedProfits)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Corporation tax due</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.corporationTax)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Post-tax profit</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.postTaxProfit)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-200">Effective tax rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.effectiveRate)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="corporation-tax-calculation"
                          title="Corporation tax calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Profit allocation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBreakdownChart data={chartData} title="Corporation tax breakdown" />
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
                Fine-tune your tax planning
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Revisit this calculator before year-end to adjust pension contributions, salaries, or capital investments so your company makes the most of current allowances.
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

