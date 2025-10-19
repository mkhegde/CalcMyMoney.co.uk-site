import React, { Suspense, useMemo, useState } from 'react';
import {
  Calculator,
  Building2,
  TrendingUp,
  BarChart3,
  Quote,
  BookOpen,
} from 'lucide-react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = ['brrrr calculator', 'brrrr real estate calculator'];

const metaDescription =
  'Run the BRRRR calculator to plan buy, refurbish, rent, refinance, repeat strategies for UK property. Compare capital costs, refinance proceeds, and rental cash flow before recycling funds into the next purchase.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/brrrr-calculator';
const pagePath = '/calculators/brrrr-calculator';
const pageTitle = 'BRRRR Calculator | UK Buy-Refurbish-Refinance Tool';

const defaultInputs = {
  purchasePrice: '180,000',
  rehabBudget: '35,000',
  closingCosts: '9,000',
  carryingCosts: '6,000',
  afterRepairValue: '280,000',
  monthlyRent: '1,800',
  expenseRatio: '35',
  vacancyRate: '6',
  refinanceRate: '6.25',
  refinanceTerm: '25',
  refinanceLtv: '75',
};

const faqItems = [
  {
    question: 'What does BRRRR stand for?',
    answer:
      'BRRRR means Buy, Refurbish, Rent, Refinance, Repeat. Investors purchase below-market homes, refurbish them to lift value, let them to stabilise income, refinance at a higher valuation, then recycle the released capital into another property.',
  },
  {
    question: 'Is this BRRRR calculator aligned with UK lending?',
    answer:
      'Yes. It reflects common UK buy-to-let refinance assumptions, including loan-to-value caps around 75%, interest-only remortgages, and monthly rent coverage expectations. Always confirm lender requirements such as minimum income or EPC standards before progressing.',
  },
  {
    question: 'How can I improve cash flow and cash-out proceeds?',
    answer:
      'Securing competitive refinance rates, keeping refurbishment costs under control, and achieving realistic market rent all help. You can also explore adding value through energy upgrades to command higher rent and refine expense ratios.',
  },
];

const emotionalMessage =
  'Every renovation and refinance gets you closer to the lifestyle you pictured when you first dreamed about property income. Track the numbers, trust the plan, and let momentum build.';

const emotionalQuote = {
  text: 'Beware of little expenses; a small leak will sink a great ship.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 2,
});

function parseNumber(value) {
  if (value == null) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
}

function formatCurrency(value) {
  return currencyFormatter.format(Number.isFinite(value) ? value : 0);
}

function formatPercent(value) {
  return `${percentFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

function monthlyPayment(principal, annualRatePercent, years) {
  const months = Math.max(Number.isFinite(years) ? years * 12 : 0, 0);
  if (months <= 0) return 0;
  const rate = annualRatePercent / 100 / 12;
  if (rate === 0) return principal / months;
  return (principal * rate) / (1 - Math.pow(1 + rate, -months));
}

function calculateBrrrr(inputs) {
  const purchasePrice = parseNumber(inputs.purchasePrice);
  const rehabBudget = parseNumber(inputs.rehabBudget);
  const closingCosts = parseNumber(inputs.closingCosts);
  const carryingCosts = parseNumber(inputs.carryingCosts);
  const afterRepairValue = parseNumber(inputs.afterRepairValue);
  const monthlyRent = parseNumber(inputs.monthlyRent);
  const expenseRatio = parseNumber(inputs.expenseRatio);
  const vacancyRate = parseNumber(inputs.vacancyRate);
  const refinanceRate = parseNumber(inputs.refinanceRate);
  const refinanceTerm = parseNumber(inputs.refinanceTerm);
  const refinanceLtv = parseNumber(inputs.refinanceLtv) / 100;

  if (
    purchasePrice <= 0 ||
    afterRepairValue <= 0 ||
    refinanceTerm <= 0 ||
    refinanceLtv <= 0 ||
    refinanceLtv > 1
  ) {
    return null;
  }

  const totalAcquisition = purchasePrice + rehabBudget + closingCosts + carryingCosts;
  const refinanceLoan = afterRepairValue * refinanceLtv;
  const mortgagePayment = monthlyPayment(refinanceLoan, refinanceRate, refinanceTerm);
  const vacancyLoss = monthlyRent * (vacancyRate / 100);
  const operatingExpenses = monthlyRent * (expenseRatio / 100);
  const netOperatingIncome = (monthlyRent - vacancyLoss - operatingExpenses) * 12;
  const annualMortgageCost = mortgagePayment * 12;
  const annualCashFlow = netOperatingIncome - annualMortgageCost;
  const equityCreated = Math.max(afterRepairValue - refinanceLoan, 0);
  const cashOutProceeds = refinanceLoan - totalAcquisition;
  const cashOnCashReturn = totalAcquisition > 0 ? (annualCashFlow / totalAcquisition) * 100 : 0;

  return {
    purchasePrice,
    rehabBudget,
    closingCosts,
    carryingCosts,
    afterRepairValue,
    monthlyRent,
    expenseRatio,
    vacancyRate,
    refinanceRate,
    refinanceTerm,
    refinanceLtv: refinanceLtv * 100,
    totalAcquisition,
    refinanceLoan,
    mortgagePayment,
    vacancyLoss,
    operatingExpenses,
    netOperatingIncome,
    annualMortgageCost,
    annualCashFlow,
    equityCreated,
    cashOutProceeds,
    cashOnCashReturn,
  };
}

export default function BRRRRCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'BRRRR Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Property Investment Calculators', url: '/calculators#mortgages-property' },
      { name: 'BRRRR Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const capitalStackData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Purchase', amount: calculation.purchasePrice },
      { name: 'Refurbishment', amount: calculation.rehabBudget },
      { name: 'Closing fees', amount: calculation.closingCosts },
      { name: 'Carrying costs', amount: calculation.carryingCosts },
      { name: 'Refinance loan', amount: calculation.refinanceLoan },
    ];
  }, [calculation, hasCalculated]);

  const chartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return [
      { name: 'Total acquisition', value: calculation.totalAcquisition, color: '#0ea5e9' },
      { name: 'Refinance loan', value: calculation.refinanceLoan, color: '#2563eb' },
      { name: 'Equity created', value: calculation.equityCreated, color: '#10b981' },
    ];
  }, [calculation, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = calculateBrrrr(inputs);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const header = ['Metric', 'Value'];
    const rows = [
      ['Total acquisition cost', formatCurrency(result.totalAcquisition)],
      ['Refinance loan', formatCurrency(result.refinanceLoan)],
      ['Monthly mortgage payment', formatCurrency(result.mortgagePayment)],
      ['Annual cash flow', formatCurrency(result.annualCashFlow)],
      ['Equity created', formatCurrency(result.equityCreated)],
      ['Cash-out proceeds', formatCurrency(result.cashOutProceeds)],
      ['Cash-on-cash return', formatPercent(result.cashOnCashReturn)],
      ['Net operating income', formatCurrency(result.netOperatingIncome)],
      ['Annual mortgage cost', formatCurrency(result.annualMortgageCost)],
    ];
    setCsvData([header, ...rows]);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setCalculation(null);
    setCsvData(null);
    setHasCalculated(false);
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
                BRRRR Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Build a buy-refurbish-rent-refinance-repeat plan that aligns with UK lending rules and rental
              demand. Review acquisition costs, project refinance proceeds, and confirm the rental income covers
              mortgage payments before committing to the next property.
            </p>
          </header>

          <section className="rounded-xl border border-emerald-100 bg-white p-6 shadow-sm dark:border-emerald-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Keep your BRRRR cycle moving
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

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Deal inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-5" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase price (£)</Label>
                      <Input
                        id="purchasePrice"
                        inputMode="decimal"
                        value={inputs.purchasePrice}
                        onChange={handleInputChange('purchasePrice')}
                        placeholder="e.g. 180,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rehabBudget">Refurbishment budget (£)</Label>
                      <Input
                        id="rehabBudget"
                        inputMode="decimal"
                        value={inputs.rehabBudget}
                        onChange={handleInputChange('rehabBudget')}
                        placeholder="e.g. 35,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="closingCosts">Purchase fees (£)</Label>
                      <Input
                        id="closingCosts"
                        inputMode="decimal"
                        value={inputs.closingCosts}
                        onChange={handleInputChange('closingCosts')}
                        placeholder="e.g. 9,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="carryingCosts">Holding costs (£)</Label>
                      <Input
                        id="carryingCosts"
                        inputMode="decimal"
                        value={inputs.carryingCosts}
                        onChange={handleInputChange('carryingCosts')}
                        placeholder="e.g. 6,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="afterRepairValue">After-repair value (£)</Label>
                      <Input
                        id="afterRepairValue"
                        inputMode="decimal"
                        value={inputs.afterRepairValue}
                        onChange={handleInputChange('afterRepairValue')}
                        placeholder="e.g. 280,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyRent">Market rent (£ per month)</Label>
                      <Input
                        id="monthlyRent"
                        inputMode="decimal"
                        value={inputs.monthlyRent}
                        onChange={handleInputChange('monthlyRent')}
                        placeholder="e.g. 1,800"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="expenseRatio">Operating expenses (% of rent)</Label>
                      <Input
                        id="expenseRatio"
                        inputMode="decimal"
                        value={inputs.expenseRatio}
                        onChange={handleInputChange('expenseRatio')}
                        placeholder="e.g. 35"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vacancyRate">Vacancy allowance (%)</Label>
                      <Input
                        id="vacancyRate"
                        inputMode="decimal"
                        value={inputs.vacancyRate}
                        onChange={handleInputChange('vacancyRate')}
                        placeholder="e.g. 6"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="refinanceRate">Refinance rate (% APR)</Label>
                      <Input
                        id="refinanceRate"
                        inputMode="decimal"
                        value={inputs.refinanceRate}
                        onChange={handleInputChange('refinanceRate')}
                        placeholder="e.g. 6.25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refinanceTerm">Mortgage term (years)</Label>
                      <Input
                        id="refinanceTerm"
                        inputMode="decimal"
                        value={inputs.refinanceTerm}
                        onChange={handleInputChange('refinanceTerm')}
                        placeholder="e.g. 25"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refinanceLtv">Refinance LTV (%)</Label>
                      <Input
                        id="refinanceLtv"
                        inputMode="decimal"
                        value={inputs.refinanceLtv}
                        onChange={handleInputChange('refinanceLtv')}
                        placeholder="e.g. 75"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate BRRRR metrics
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
                <Card className="border border-dashed border-slate-300 bg-white/50 text-slate-700 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your purchase, refurbishment, and refinance assumptions, then press{' '}
                    <span className="font-semibold">Calculate BRRRR metrics</span> to view cash-out proceeds,
                    cash flow, and capital stack analysis.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please double-check the inputs. The BRRRR calculator needs positive purchase and after-repair
                    values, a refinance term above zero, and a loan-to-value between 0 and 100%.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-emerald-200 bg-emerald-50 text-emerald-900 shadow-sm dark:border-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-100">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5" aria-hidden="true" />
                        Strategy snapshot
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3 text-center">
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-emerald-900/30">
                        <p className="text-sm text-emerald-700 dark:text-emerald-200">Cash-out proceeds</p>
                        <p className="text-2xl font-semibold">{formatCurrency(calculation.cashOutProceeds)}</p>
                      </div>
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-emerald-900/30">
                        <p className="text-sm text-emerald-700 dark:text-emerald-200">Annual cash flow</p>
                        <p className="text-2xl font-semibold">{formatCurrency(calculation.annualCashFlow)}</p>
                      </div>
                      <div className="rounded-lg bg-white/70 p-4 dark:bg-emerald-900/30">
                        <p className="text-sm text-emerald-700 dark:text-emerald-200">Cash-on-cash return</p>
                        <p className="text-2xl font-semibold">{formatPercent(calculation.cashOnCashReturn)}</p>
                      </div>
                      <div className="sm:col-span-3">
                        <ExportActions
                          csvData={csvData}
                          fileName="brrrr-calculator-results"
                          title="BRRRR calculator metrics"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Cash flow and equity balance
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Suspense
                        fallback={
                          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-300 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            Loading chart…
                          </div>
                        }
                      >
                        <ResultBreakdownChart data={chartData} title="BRRRR funding mix" />
                      </Suspense>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <BarChart3 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Capital stack visual
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={capitalStackData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis tickFormatter={(value) => formatCurrency(value)} />
                          <Tooltip
                            formatter={(value) => formatCurrency(Number(value))}
                            cursor={{ fill: 'rgba(16,185,129,0.08)' }}
                          />
                          <Legend />
                          <Bar dataKey="amount" name="Amount" fill="#10b981" radius={[4, 4, 0, 0]} />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Deal metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total acquisition</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalAcquisition)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                          Refinance loan (LTV {formatPercent(calculation.refinanceLtv)})
                        </p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.refinanceLoan)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Monthly mortgage payment</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.mortgagePayment)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Net operating income (annual)</p>
                        <p className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.netOperatingIncome)}
                        </p>
                      </div>
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
                BRRRR strategy insights
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Line up brokers, contractors, and letting agents before you exchange contracts. Use this BRRRR
              calculator to stress-test best and worst cases, then export the figures to share with potential
              lenders or partners. Revisit your assumptions after each project to refine the playbook.
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
