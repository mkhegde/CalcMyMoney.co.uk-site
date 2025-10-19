import React, { Suspense, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Scale, Percent, PieChart as PieChartIcon, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';

const ResultBreakdownChart = React.lazy(() => import('@/components/calculators/ResultBreakdownChart.jsx'));

const keywords = ['capital gains tax calculator', 'capital gains tax', 'cgt calculator', 'capital gains calculator'];

const metaDescription =
  'Estimate UK capital gains tax on property or shares. This CGT calculator applies the allowance, losses, and unused basic-rate band to show how much tax you owe.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/capital-gains-tax-calculator';
const pagePath = '/calculators/capital-gains-tax-calculator';
const pageTitle = 'Capital Gains Tax Calculator | UK CGT Calculator';

const defaultInputs = {
  salePrice: '450,000',
  purchasePrice: '320,000',
  buyingCosts: '5,000',
  sellingCosts: '6,500',
  improvementCosts: '20,000',
  unusedBasicBand: '10,000',
  allowance: '3,000',
  capitalLosses: '0',
  assetType: 'residential',
};

const faqItems = [
  {
    question: 'Which assets can I model with this capital gains tax calculator?',
    answer:
      'You can analyse residential property gains and other chargeable assets such as shares, funds, or second homes. The calculator applies the correct UK CGT rates for each asset type.',
  },
  {
    question: 'How do the unused basic-rate band and allowance work?',
    answer:
      'Enter any remaining basic-rate band for the tax year. Gains up to that level are taxed at the lower CGT rate. The annual allowance – £3,000 for the 2024/25 tax year – is deducted after losses before tax is determined.',
  },
  {
    question: 'Can I include capital losses from previous years?',
    answer:
      'Yes. Add carried-forward or same-year losses. They reduce your gain before the allowance and tax rates are applied, cutting the total CGT payable.',
  },
];

const emotionalMessage =
  'Tracking capital gains before you sell removes the nasty surprises. When the tax is accounted for, you can celebrate profits rather than worry about the bill.';

const emotionalQuote = {
  text: 'In this world nothing can be said to be certain, except death and taxes.',
  author: 'Benjamin Franklin',
};

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentageFormatter = new Intl.NumberFormat('en-GB', {
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
  return `${percentageFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

function getRates(assetType) {
  return assetType === 'residential' ? { basic: 18, higher: 24 } : { basic: 10, higher: 20 };
}

function calculateCapitalGains(inputs) {
  const salePrice = parseNumber(inputs.salePrice);
  const purchasePrice = parseNumber(inputs.purchasePrice);
  const buyingCosts = parseNumber(inputs.buyingCosts);
  const sellingCosts = parseNumber(inputs.sellingCosts);
  const improvementCosts = parseNumber(inputs.improvementCosts);
  const unusedBasicBand = parseNumber(inputs.unusedBasicBand);
  const allowance = parseNumber(inputs.allowance);
  const capitalLosses = parseNumber(inputs.capitalLosses);
  const rates = getRates(inputs.assetType);

  if (salePrice <= 0 || purchasePrice < 0) {
    return null;
  }

  const totalCostBasis = purchasePrice + buyingCosts + sellingCosts + improvementCosts;
  const grossGain = Math.max(salePrice - totalCostBasis, 0);
  const netGainAfterLosses = Math.max(grossGain - capitalLosses, 0);
  const taxableGain = Math.max(netGainAfterLosses - allowance, 0);

  const taxedAtBasic = Math.min(taxableGain, Math.max(unusedBasicBand, 0));
  const taxedAtHigher = Math.max(taxableGain - taxedAtBasic, 0);

  const taxBasic = (taxedAtBasic * rates.basic) / 100;
  const taxHigher = (taxedAtHigher * rates.higher) / 100;
  const totalTax = taxBasic + taxHigher;
  const effectiveRate = grossGain > 0 ? (totalTax / grossGain) * 100 : 0;

  const pieData = [
    { name: 'Taxed at basic rate', value: taxedAtBasic, color: '#2563eb' },
    { name: 'Taxed at higher rate', value: taxedAtHigher, color: '#10b981' },
    { name: 'Covered by allowance', value: Math.min(netGainAfterLosses, allowance), color: '#f97316' },
  ].filter((segment) => segment.value > 0);

  return {
    salePrice,
    purchasePrice,
    buyingCosts,
    sellingCosts,
    improvementCosts,
    unusedBasicBand,
    allowance,
    capitalLosses,
    rates,
    totalCostBasis,
    grossGain,
    netGainAfterLosses,
    taxableGain,
    taxedAtBasic,
    taxedAtHigher,
    taxBasic,
    taxHigher,
    totalTax,
    effectiveRate,
    pieData,
  };
}

export default function CapitalGainsTaxCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [calculation, setCalculation] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Capital Gains Tax Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tax & Income Tools', url: '/calculators#tax-income' },
      { name: 'Capital Gains Tax Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!calculation || !hasCalculated) return [];
    return calculation.pieData;
  }, [calculation, hasCalculated]);

  const handleInputChange = (field) => (event) => {
    const { value } = event.target;
    setInputs((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setInputs((prev) => ({
      ...prev,
      assetType: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = calculateCapitalGains(inputs);
    setHasCalculated(true);

    if (!result) {
      setCalculation(null);
      setCsvData(null);
      return;
    }

    setCalculation(result);

    const csvRows = [
      ['Metric', 'Value'],
      ['Sale price', formatCurrency(result.salePrice)],
      ['Total cost basis', formatCurrency(result.totalCostBasis)],
      ['Gross gain', formatCurrency(result.grossGain)],
      ['Losses applied', formatCurrency(result.capitalLosses)],
      ['Net gain after losses', formatCurrency(result.netGainAfterLosses)],
      ['Annual allowance used', formatCurrency(Math.min(result.netGainAfterLosses, result.allowance))],
      ['Taxable gain', formatCurrency(result.taxableGain)],
      ['Tax at basic rate', formatCurrency(result.taxBasic)],
      ['Tax at higher rate', formatCurrency(result.taxHigher)],
      ['Total CGT due', formatCurrency(result.totalTax)],
      ['Effective tax rate', formatPercent(result.effectiveRate)],
      ['Basic rate used', formatCurrency(result.taxedAtBasic)],
      ['Higher rate used', formatCurrency(result.taxedAtHigher)],
    ];
    setCsvData(csvRows);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-400/20 dark:text-amber-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Capital Gains Tax Calculator
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Estimate the capital gains tax due on property or investments. Adjust losses, allowances, and
              remaining basic-rate band to understand your CGT bill before the sale completes.
            </p>
          </header>

          <section className="rounded-xl border border-amber-100 bg-white p-6 shadow-sm dark:border-amber-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Keep more of every gain
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-900 shadow-sm dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Scale className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  Gain details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="salePrice">Sale price (£)</Label>
                      <Input
                        id="salePrice"
                        inputMode="decimal"
                        value={inputs.salePrice}
                        onChange={handleInputChange('salePrice')}
                        placeholder="e.g. 450,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="purchasePrice">Purchase price (£)</Label>
                      <Input
                        id="purchasePrice"
                        inputMode="decimal"
                        value={inputs.purchasePrice}
                        onChange={handleInputChange('purchasePrice')}
                        placeholder="e.g. 320,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="buyingCosts">Buying costs (£)</Label>
                      <Input
                        id="buyingCosts"
                        inputMode="decimal"
                        value={inputs.buyingCosts}
                        onChange={handleInputChange('buyingCosts')}
                        placeholder="e.g. 5,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sellingCosts">Selling costs (£)</Label>
                      <Input
                        id="sellingCosts"
                        inputMode="decimal"
                        value={inputs.sellingCosts}
                        onChange={handleInputChange('sellingCosts')}
                        placeholder="e.g. 6,500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="improvementCosts">Improvement costs (£)</Label>
                      <Input
                        id="improvementCosts"
                        inputMode="decimal"
                        value={inputs.improvementCosts}
                        onChange={handleInputChange('improvementCosts')}
                        placeholder="e.g. 20,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Asset type</Label>
                      <Select value={inputs.assetType} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose asset type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="residential">Residential property</SelectItem>
                          <SelectItem value="other">Shares or other assets</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="unusedBasicBand">Unused basic-rate band (£)</Label>
                      <Input
                        id="unusedBasicBand"
                        inputMode="decimal"
                        value={inputs.unusedBasicBand}
                        onChange={handleInputChange('unusedBasicBand')}
                        placeholder="e.g. 10,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="allowance">Annual allowance (£)</Label>
                      <Input
                        id="allowance"
                        inputMode="decimal"
                        value={inputs.allowance}
                        onChange={handleInputChange('allowance')}
                        placeholder="e.g. 3,000"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capitalLosses">Capital losses (£)</Label>
                      <Input
                        id="capitalLosses"
                        inputMode="decimal"
                        value={inputs.capitalLosses}
                        onChange={handleInputChange('capitalLosses')}
                        placeholder="e.g. 5,000"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate CGT
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
                    Enter the sale details and allowances, then press <span className="font-semibold">Calculate CGT</span> to view your taxable gain, tax split, and downloadable breakdown.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && !calculation && (
                <Card className="border border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                  <CardContent className="py-6 text-sm">
                    Please check the inputs. The calculator needs a sale price above zero and realistic purchase costs to compute CGT.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && calculation && (
                <>
                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Percent className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Capital gains summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Gross gain</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.grossGain)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Taxable gain</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.taxableGain)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Total CGT due</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatCurrency(calculation.totalTax)}
                        </p>
                      </div>
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                        <p className="text-sm text-slate-600 dark:text-slate-300">Effective tax rate</p>
                        <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                          {formatPercent(calculation.effectiveRate)}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="capital-gains-tax-results"
                          title="Capital gains tax calculator results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChartIcon className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Gain allocation
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
                        <ResultBreakdownChart data={chartData} title="Capital gains tax split" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Capital gains planning tips
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Consider staggering asset sales across tax years, maximising ISA and pension allowances, and
              utilising spouse allowances to keep CGT burdens manageable. Always confirm figures with a regulated
              tax adviser for complex transactions.
            </p>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />

          <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 md:flex-row">
            <span>Find more UK tax and investment calculators.</span>
            <Link
              to="/calculators"
              className="inline-flex items-center rounded-lg border border-amber-200 px-4 py-2 font-medium text-amber-700 transition hover:border-amber-400 hover:text-amber-900 dark:border-amber-800 dark:text-amber-300 dark:hover:border-amber-600 dark:hover:text-amber-100"
            >
              Browse calculator directory
            </Link>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}

