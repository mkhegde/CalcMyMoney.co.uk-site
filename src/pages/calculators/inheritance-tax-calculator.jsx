import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Crown, Landmark } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import EmotionalHook from '@/components/calculators/EmotionalHook';
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

const CALCULATOR_NAME = 'Inheritance Tax Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/inheritance-tax-calculator';
const keywords = getCalculatorKeywords(CALCULATOR_NAME);

const metaDescription =
  'Estimate UK inheritance tax liability using nil-rate bands, residence allowances, charitable gifts, and debt deductions.';

const defaultInputs = {
  estateValue: '850,000',
  debts: '15,000',
  charitableGifts: '20,000',
  nilRateBand: '325,000',
  residenceNilRateBand: '175,000',
  spouseTransferPercent: '100',
  taperThreshold: '2,000,000',
};

const faqItems = [
  {
    question: 'How much of my estate is tax-free?',
    answer:
      'Every individual has a £325,000 nil-rate band. Leaving a home to direct descendants unlocks the £175,000 residence nil-rate band. Unused allowances from a late spouse or civil partner can be transferred.',
  },
  {
    question: 'How does the residence nil-rate band taper?',
    answer:
      'For estates worth over £2 million, the residence allowance falls by £1 for every £2 above the threshold. Estates above £2.7 million lose the residence allowance completely.',
  },
  {
    question: 'Are charitable gifts deductible?',
    answer:
      'Yes. Charitable legacies reduce the taxable estate. Giving at least 10% of the net estate to charity can also reduce the IHT rate from 40% to 36%—factor that in with advice if relevant.',
  },
];

const relatedCalculators = [
  {
    name: 'Estate Planning Checklist',
    url: '/resources',
    description: 'Explore guides on wills, trusts, and family gifting.',
  },
  {
    name: 'Income Tax Calculator',
    url: '/income-tax-calculator',
    description: 'Understand ongoing tax liabilities for beneficiaries or executors.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Build inheritance reserves or cover future IHT bills in advance.',
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

const faqStructuredData = faqSchema(faqItems);

const currencyFormatter = (value) =>
  value.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  });

const calculateInheritanceTax = ({
  estateValue,
  debts,
  charitableGifts,
  nilRateBand,
  residenceNilRateBand,
  spouseTransferPercent,
  taperThreshold,
}) => {
  if (estateValue <= 0) {
    return { valid: false, message: 'Enter an estate value greater than zero to calculate IHT.' };
  }

  const spouseRate = Math.min(Math.max(spouseTransferPercent / 100, 0), 1);
  const totalNilRateBand = nilRateBand * (1 + spouseRate);
  const grossResidenceBand = residenceNilRateBand * (1 + spouseRate);

  const netEstate = Math.max(estateValue - debts - charitableGifts, 0);

  let taperedResidenceBand = grossResidenceBand;
  if (netEstate > taperThreshold) {
    const excess = netEstate - taperThreshold;
    const taperReduction = Math.min(grossResidenceBand, Math.floor(excess / 2));
    taperedResidenceBand = Math.max(0, grossResidenceBand - taperReduction);
  }

  const taxableEstate = Math.max(netEstate - totalNilRateBand - taperedResidenceBand, 0);
  const ihtLiability = taxableEstate * 0.4;
  const effectiveRate = netEstate > 0 ? (ihtLiability / netEstate) * 100 : 0;

  return {
    valid: true,
    netEstate,
    totalNilRateBand,
    taperedResidenceBand,
    taxableEstate,
    ihtLiability,
    effectiveRate,
    estateValue,
    debts,
    charitableGifts,
  };
};

export default function InheritanceTaxCalculatorPage() {
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
      estateValue: sanitiseNumber(inputs.estateValue),
      debts: sanitiseNumber(inputs.debts),
      charitableGifts: sanitiseNumber(inputs.charitableGifts),
      nilRateBand: sanitiseNumber(inputs.nilRateBand),
      residenceNilRateBand: sanitiseNumber(inputs.residenceNilRateBand),
      spouseTransferPercent: sanitiseNumber(inputs.spouseTransferPercent),
      taperThreshold: sanitiseNumber(inputs.taperThreshold),
    };
    const outcome = calculateInheritanceTax(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      { name: 'Tax-free allowances', value: results.totalNilRateBand + results.taperedResidenceBand, color: '#0ea5e9' },
      { name: 'Taxable estate', value: results.taxableEstate, color: '#f97316' },
      { name: 'Charitable gifts & debts', value: results.debts + results.charitableGifts, color: '#22c55e' },
    ].filter((segment) => segment.value > 0);
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    return [
      ['Metric', 'Value'],
      ['Estate value (£)', results.estateValue.toFixed(2)],
      ['Debts (£)', results.debts.toFixed(2)],
      ['Charitable gifts (£)', results.charitableGifts.toFixed(2)],
      ['Net estate (£)', results.netEstate.toFixed(2)],
      ['Total nil-rate band (£)', results.totalNilRateBand.toFixed(2)],
      ['Residence nil-rate band after taper (£)', results.taperedResidenceBand.toFixed(2)],
      ['Taxable estate (£)', results.taxableEstate.toFixed(2)],
      ['Inheritance tax liability (£)', results.ihtLiability.toFixed(2)],
      ['Effective tax rate (%)', results.effectiveRate.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | UK IHT Liability Planner`}</title>
        <meta name="description" content={metaDescription} />
        {keywords.length ? <meta name="keywords" content={keywords.join(', ')} /> : null}
        <link rel="canonical" href={canonicalUrl} />
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="calculator-hero__content">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Inheritance Tax Calculator
          </Heading>
          <p className="calculator-hero__description">
            Model nil-rate bands, residence allowances, and charitable gifts to understand your potential IHT bill.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Pass on more of what matters"
          message="Clarity on the future tax bill helps families plan gifts, life cover, and charitable legacies with confidence."
          quote="Someone’s sitting in the shade today because someone planted a tree a long time ago."
          author="Warren Buffett"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Estate inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="estateValue" className="text-sm font-medium">
                    Total estate value (£)
                  </Label>
                  <Input
                    id="estateValue"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.estateValue}
                    onChange={handleInputChange('estateValue')}
                    placeholder="e.g., 850,000"
                  />
                </div>
                <div>
                  <Label htmlFor="debts" className="text-sm font-medium">
                    Debts & liabilities (£)
                  </Label>
                  <Input
                    id="debts"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="500"
                    value={inputs.debts}
                    onChange={handleInputChange('debts')}
                    placeholder="e.g., 15,000"
                  />
                </div>
                <div>
                  <Label htmlFor="charitableGifts" className="text-sm font-medium">
                    Charitable gifts (£)
                  </Label>
                  <Input
                    id="charitableGifts"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="500"
                    value={inputs.charitableGifts}
                    onChange={handleInputChange('charitableGifts')}
                    placeholder="e.g., 20,000"
                  />
                </div>
                <div>
                  <Label htmlFor="nilRateBand" className="text-sm font-medium">
                    Available nil-rate band (£)
                  </Label>
                  <Input
                    id="nilRateBand"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.nilRateBand}
                    onChange={handleInputChange('nilRateBand')}
                    placeholder="e.g., 325,000"
                  />
                </div>
                <div>
                  <Label htmlFor="residenceNilRateBand" className="text-sm font-medium">
                    Residence nil-rate band (£)
                  </Label>
                  <Input
                    id="residenceNilRateBand"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.residenceNilRateBand}
                    onChange={handleInputChange('residenceNilRateBand')}
                    placeholder="e.g., 175,000"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Include any transferred allowance from a late spouse or civil partner.
                  </p>
                </div>
                <div>
                  <Label htmlFor="spouseTransferPercent" className="text-sm font-medium">
                    Additional spouse/civil partner allowance (%)
                  </Label>
                  <Input
                    id="spouseTransferPercent"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    max="100"
                    step="5"
                    value={inputs.spouseTransferPercent}
                    onChange={handleInputChange('spouseTransferPercent')}
                    placeholder="e.g., 100"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    100% represents a full transfer of unused allowances from a spouse or civil partner.
                  </p>
                </div>
                <div>
                  <Label htmlFor="taperThreshold" className="text-sm font-medium">
                    Residence nil-rate band taper threshold (£)
                  </Label>
                  <Input
                    id="taperThreshold"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1000"
                    value={inputs.taperThreshold}
                    onChange={handleInputChange('taperThreshold')}
                    placeholder="e.g., 2,000,000"
                  />
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
              <Card className="border border-purple-200 dark:border-purple-900 bg-purple-50 dark:bg-purple-900/20 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
                    <Crown className="h-5 w-5" />
                    Inheritance tax summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Net estate
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter(results.netEstate)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Inheritance tax due
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter(results.ihtLiability)}
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-200">
                        Effective rate {results.effectiveRate.toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Nil-rate band allowance
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter(results.totalNilRateBand)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-purple-900/40 p-4 border border-purple-100 dark:border-purple-800">
                      <p className="text-xs uppercase tracking-wide text-purple-700 dark:text-purple-200">
                        Residence allowance (after taper)
                      </p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {currencyFormatter(results.taperedResidenceBand)}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-purple-100 dark:border-purple-900 p-4">
                    <h3 className="text-base font-semibold text-purple-900 dark:text-purple-100 mb-4">
                      Estate allocation
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Estate allocation" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="inheritance-tax-calculator-results"
                    title="Inheritance tax breakdown"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Landmark className="h-5 w-5 text-purple-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter estate details and allowances, then press <strong>Calculate</strong> to
                        estimate inheritance tax.
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
<RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
