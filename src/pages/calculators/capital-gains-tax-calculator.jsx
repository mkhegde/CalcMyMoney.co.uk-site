import React, { useState, useMemo, useCallback } from 'react';
import { Calculator, Scales, Percent, PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import SeoHead from '@/components/seo/SeoHead';

const keywords = [
  'capital gains tax calculator',
  'capital gains tax',
  'cgt calculator',
  'capital gains calculator',
];

const metaDescription =
  'Use our capital gains tax calculator to estimate capital gains tax, compare CGT calculator scenarios, and plan allowances with this capital gains calculator.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/capital-gains-tax-calculator';

const webpageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Capital Gains Tax Calculator',
  url: canonicalUrl,
  description: metaDescription,
  keywords,
  inLanguage: 'en-GB',
  potentialAction: {
    '@type': 'Action',
    name: 'Estimate capital gains tax',
    target: canonicalUrl,
  },
};

const COLORS = ['#6366f1', '#10b981', '#f97316', '#0ea5e9'];

const faqItems = [
  {
    question: 'Which assets does this capital gains tax calculator cover?',
    answer:
      'It supports two common scenarios: residential property and other chargeable assets such as shares or funds. The calculator applies the appropriate basic and higher-rate CGT percentages for each asset type.',
  },
  {
    question: 'How do I factor in unused basic-rate band?',
    answer:
      'Enter the amount of basic-rate band you still have available for the tax year. Any taxable gain up to that level is charged at the basic CGT rate, with the remainder taxed at the higher rate.',
  },
  {
    question: 'Can I include capital losses?',
    answer:
      'Yes. Add any carried-forward or same-year capital losses. These reduce your total gain before the annual allowance and tax rates are applied.',
  },
];

const defaultInputs = {
  salePrice: '450000',
  purchasePrice: '320000',
  buyingCosts: '5000',
  sellingCosts: '6500',
  improvementCosts: '20000',
  unusedBasicBand: '10000',
  allowance: '3000',
  capitalLosses: '0',
  assetType: 'residential',
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

const getRates = (assetType) =>
  assetType === 'residential' ? { basic: 18, higher: 24 } : { basic: 10, higher: 20 };

export default function CapitalGainsTaxCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const handleInputChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const salePrice = Number(inputs.salePrice) || 0;
    const purchasePrice = Number(inputs.purchasePrice) || 0;
    const buyingCosts = Number(inputs.buyingCosts) || 0;
    const sellingCosts = Number(inputs.sellingCosts) || 0;
    const improvementCosts = Number(inputs.improvementCosts) || 0;
    const unusedBasicBand = Number(inputs.unusedBasicBand) || 0;
    const allowance = Number(inputs.allowance) || 0;
    const capitalLosses = Number(inputs.capitalLosses) || 0;
    const rates = getRates(inputs.assetType);

    const totalCostBasis = purchasePrice + buyingCosts + sellingCosts + improvementCosts;
    const grossGain = Math.max(salePrice - totalCostBasis, 0);
    const netGainAfterLosses = Math.max(grossGain - capitalLosses, 0);
    const taxableGain = Math.max(netGainAfterLosses - allowance, 0);

    const taxedAtBasic = Math.min(taxableGain, unusedBasicBand);
    const taxedAtHigher = Math.max(taxableGain - taxedAtBasic, 0);

    const taxBasic = (taxedAtBasic * rates.basic) / 100;
    const taxHigher = (taxedAtHigher * rates.higher) / 100;
    const totalTax = taxBasic + taxHigher;
    const effectiveRate = grossGain > 0 ? (totalTax / grossGain) * 100 : 0;

    const pieData = [
      { name: 'Basic Rate Portion', value: taxedAtBasic },
      { name: 'Higher Rate Portion', value: taxedAtHigher },
      { name: 'Allowance', value: Math.min(netGainAfterLosses, allowance) },
    ].filter((segment) => segment.value > 0);

    return {
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
      rates,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <SeoHead
        title="Capital Gains Tax Calculator | Capital Gains Tax"
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle="Capital Gains Tax Calculator | Capital Gains Tax"
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="Calc My Money"
        twitterTitle="Capital Gains Tax Calculator | Capital Gains Tax"
        twitterDescription={metaDescription}
        jsonLd={[webpageSchema]}
      />

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Capital Gains Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Estimate gains, allowances, and tax due on property or investments with a comprehensive
            CGT calculator.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Transaction Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="salePrice" className="text-sm font-medium">
                    Sale Price (£)
                  </Label>
                  <Input
                    id="salePrice"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.salePrice}
                    onChange={(event) => handleInputChange('salePrice', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="purchasePrice" className="text-sm font-medium">
                    Purchase Price (£)
                  </Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.purchasePrice}
                    onChange={(event) => handleInputChange('purchasePrice', event.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buyingCosts" className="text-sm font-medium">
                    Buying Costs (£)
                  </Label>
                  <Input
                    id="buyingCosts"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.buyingCosts}
                    onChange={(event) => handleInputChange('buyingCosts', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sellingCosts" className="text-sm font-medium">
                    Selling Costs (£)
                  </Label>
                  <Input
                    id="sellingCosts"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.sellingCosts}
                    onChange={(event) => handleInputChange('sellingCosts', event.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="improvementCosts" className="text-sm font-medium">
                  Improvement Costs (£)
                </Label>
                <Input
                  id="improvementCosts"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={inputs.improvementCosts}
                  onChange={(event) => handleInputChange('improvementCosts', event.target.value)}
                />
              </div>

              <div className="pt-4 border-t border-indigo-100 dark:border-indigo-900 space-y-4">
                <div>
                  <Label className="text-sm font-medium">Asset Type</Label>
                  <Select
                    value={inputs.assetType}
                    onValueChange={(value) => handleInputChange('assetType', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential property</SelectItem>
                      <SelectItem value="other">Shares or other assets</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="unusedBasicBand" className="text-sm font-medium">
                    Unused Basic-Rate Band (£)
                  </Label>
                  <Input
                    id="unusedBasicBand"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.unusedBasicBand}
                    onChange={(event) => handleInputChange('unusedBasicBand', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="allowance" className="text-sm font-medium">
                    Annual Exempt Amount (£)
                  </Label>
                  <Input
                    id="allowance"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.allowance}
                    onChange={(event) => handleInputChange('allowance', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="capitalLosses" className="text-sm font-medium">
                    Capital Losses (£)
                  </Label>
                  <Input
                    id="capitalLosses"
                    type="number"
                    inputMode="decimal"
                    min={0}
                    value={inputs.capitalLosses}
                    onChange={(event) => handleInputChange('capitalLosses', event.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100">
                  <Scales className="h-5 w-5" />
                  Gain Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Gross Gain</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.grossGain)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Losses & Allowance</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.grossGain - results.taxableGain || 0)}
                  </p>
                </div>
                <div className="rounded-md bg-white/70 dark:bg-indigo-900/60 p-4 border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm text-indigo-700 dark:text-indigo-200">Taxable Gain</p>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                    {currencyFormatter.format(results.taxableGain)}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Percent className="h-5 w-5 text-slate-600" />
                  Capital Gains Tax Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    Basic Rate ({percentageFormatter.format(results.rates.basic)}%)
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.taxBasic)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">
                    Higher Rate ({percentageFormatter.format(results.rates.higher)}%)
                  </p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.taxHigher)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Total CGT Payable</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {currencyFormatter.format(results.totalTax)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-500">Effective Rate</p>
                  <p className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                    {percentageFormatter.format(results.effectiveRate)}%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <PieChartIcon className="h-5 w-5 text-slate-600" />
                  Capital Gains Calculator Visual
                </CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={results.pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {results.pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => currencyFormatter.format(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </CalculatorWrapper>

      <section className="bg-slate-50 dark:bg-slate-900/40 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <Heading
            as="h2"
            size="h2"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            CGT Calculator Tips for UK Investors
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            This CGT calculator allows you to model how different allowance and loss figures affect
            the tax due. Adjust the unused basic-rate band to reflect your income position, then
            compare the outcome for residential property versus other chargeable assets.
          </p>
          <Heading
            as="h3"
            size="h3"
            weight="semibold"
            className="text-slate-900 dark:text-slate-100"
          >
            Planning with a Capital Gains Calculator
          </Heading>
          <p className="text-base text-slate-600 dark:text-slate-300">
            Use the capital gains calculator to plan disposals across tax years, optimise the annual
            exemption, and ensure losses are recorded before submitting your self-assessment return.
            When gains are substantial, consider spreading sales to make full use of yearly
            allowances for you and your partner.
          </p>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={faqItems} />
        </div>
      </section>
    </div>
  );
}
