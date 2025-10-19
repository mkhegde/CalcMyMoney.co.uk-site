import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Zap, Flame, Home } from 'lucide-react';

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

const CALCULATOR_NAME = 'Energy Bill Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/energy-bill-calculator';
const keywords = getCalculatorKeywords('Energy Bill Calculator');

const metaDescription =
  'Estimate monthly and annual UK energy bills by combining electricity and gas usage, standing charges, VAT, and smoothing buffers.';

const MONTHS_PER_YEAR = 12;
const AVERAGE_DAYS_PER_MONTH = 30.4;

const defaultInputs = {
  electricityUsage: '310',
  electricityUnitRate: '0.28',
  electricityStandingCharge: '0.45',
  gasUsage: '520',
  gasUnitRate: '0.09',
  gasStandingCharge: '0.30',
  vatRate: '5',
  smoothingBuffer: '20',
};

const energyFaqs = [
  {
    question: 'How accurate is this UK energy bill estimate?',
    answer:
      'We combine your kWh usage, unit rates, standing charges, and VAT to estimate bills. Inputting smart meter data or recent readings gives the best accuracy.',
  },
  {
    question: 'What if I only have electricity or only gas?',
    answer:
      'Enter zero for the fuel you do not use. The calculator automatically removes it from your totals.',
  },
  {
    question: 'What is the smoothing buffer?',
    answer:
      'Direct debit plans often collect a little extra each month to cover winter spikes. Add an optional buffer if your supplier uses bill smoothing.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Explore every UK calculator on Calc My Money.',
  },
  {
    label: 'Utilities & household tools',
    url: '/#utilities-tools',
    description: 'Compare broadband, fuel, and living costs alongside energy.',
  },
  {
    label: 'Budgeting & planning hub',
    url: '/#budgeting-planning',
    description: 'Fold your energy estimate into a realistic monthly budget.',
  },
];

const relatedCalculators = [
  {
    name: 'Budget Calculator',
    url: '/budget-calculator',
    description: 'See how energy fits within your household spending.',
  },
  {
    name: 'Cost of Living Calculator',
    url: '/cost-of-living-calculator',
    description: 'Compare regional living costs including utilities.',
  },
  {
    name: 'Energy Tariff Comparison Calculator',
    url: '/energy-tariff-comparison-calculator',
    description: 'Benchmark your tariff against other UK suppliers.',
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

const faqStructuredData = faqSchema(energyFaqs);

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

const calculateEnergyBill = ({
  electricityUsage,
  electricityUnitRate,
  electricityStandingCharge,
  gasUsage,
  gasUnitRate,
  gasStandingCharge,
  vatRate,
  smoothingBuffer,
}) => {
  if (
    electricityUsage <= 0 &&
    gasUsage <= 0
  ) {
    return {
      valid: false,
      message: 'Enter electricity or gas usage to estimate your energy bill.',
    };
  }

  const electricityCost =
    electricityUsage * electricityUnitRate + electricityStandingCharge * AVERAGE_DAYS_PER_MONTH;
  const gasCost = gasUsage * gasUnitRate + gasStandingCharge * AVERAGE_DAYS_PER_MONTH;
  const subtotal = electricityCost + gasCost;
  const vatAmount = subtotal * (vatRate / 100);
  const monthlyTotal = subtotal + vatAmount + smoothingBuffer;

  return {
    valid: true,
    electricityCost,
    gasCost,
    subtotal,
    vatAmount,
    smoothingBuffer,
    monthlyTotal,
    annualTotal: monthlyTotal * MONTHS_PER_YEAR,
    vatRate,
  };
};

export default function EnergyBillCalculatorPage() {
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
      electricityUsage: sanitiseNumber(inputs.electricityUsage),
      electricityUnitRate: sanitiseNumber(inputs.electricityUnitRate),
      electricityStandingCharge: sanitiseNumber(inputs.electricityStandingCharge),
      gasUsage: sanitiseNumber(inputs.gasUsage),
      gasUnitRate: sanitiseNumber(inputs.gasUnitRate),
      gasStandingCharge: sanitiseNumber(inputs.gasStandingCharge),
      vatRate: sanitiseNumber(inputs.vatRate),
      smoothingBuffer: sanitiseNumber(inputs.smoothingBuffer),
    };
    const outcome = calculateEnergyBill(payload);
    setResults({ ...outcome, payload });
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    const data = [];
    if (results.electricityCost > 0) {
      data.push({ name: 'Electricity', value: results.electricityCost, color: '#6366f1' });
    }
    if (results.gasCost > 0) {
      data.push({ name: 'Gas', value: results.gasCost, color: '#f97316' });
    }
    if (results.vatAmount > 0) {
      data.push({ name: 'VAT', value: results.vatAmount, color: '#10b981' });
    }
    if (results.smoothingBuffer > 0) {
      data.push({ name: 'Smoothing buffer', value: results.smoothingBuffer, color: '#0ea5e9' });
    }
    return data;
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const { payload } = results;
    return [
      ['Metric', 'Value'],
      ['Electricity usage (kWh/month)', payload.electricityUsage.toFixed(2)],
      ['Electricity unit rate (£/kWh)', payload.electricityUnitRate.toFixed(4)],
      ['Electricity standing charge (£/day)', payload.electricityStandingCharge.toFixed(4)],
      ['Gas usage (kWh/month)', payload.gasUsage.toFixed(2)],
      ['Gas unit rate (£/kWh)', payload.gasUnitRate.toFixed(4)],
      ['Gas standing charge (£/day)', payload.gasStandingCharge.toFixed(4)],
      ['VAT rate (%)', payload.vatRate.toFixed(2)],
      ['Smoothing buffer (£/month)', payload.smoothingBuffer.toFixed(2)],
      [],
      ['Electricity cost (£/month)', results.electricityCost.toFixed(2)],
      ['Gas cost (£/month)', results.gasCost.toFixed(2)],
      ['Subtotal before VAT (£/month)', results.subtotal.toFixed(2)],
      ['VAT (£/month)', results.vatAmount.toFixed(2)],
      ['Monthly total (£)', results.monthlyTotal.toFixed(2)],
      ['Annual total (£)', results.annualTotal.toFixed(2)],
    ];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Electricity & Gas Estimator`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Energy Bill Calculator
          </Heading>
          <p className="text-lg md:text-xl text-slate-200">
            Estimate monthly and annual electricity and gas bills, including VAT and standing charges, to keep your budget in sync with reality.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Forecast your bills before they arrive"
          message="Knowing your baseline energy cost keeps winter statements from derailing your plans. Tweak usage or tariffs today and bank the savings tomorrow."
          quote="Energy and persistence conquer all things."
          author="Benjamin Franklin"
        />
      </div>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Tariff inputs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="electricityUsage" className="text-sm font-medium flex items-center gap-2">
                    <Zap className="h-4 w-4 text-indigo-500" />
                    Electricity usage (kWh/month)
                  </Label>
                  <Input
                    id="electricityUsage"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.electricityUsage}
                    onChange={handleInputChange('electricityUsage')}
                    placeholder="e.g., 310"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="electricityUnitRate" className="text-sm font-medium">
                      Electricity unit rate (£/kWh)
                    </Label>
                    <Input
                      id="electricityUnitRate"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.001"
                      value={inputs.electricityUnitRate}
                      onChange={handleInputChange('electricityUnitRate')}
                      placeholder="e.g., 0.28"
                    />
                  </div>
                  <div>
                    <Label htmlFor="electricityStandingCharge" className="text-sm font-medium">
                      Electricity standing charge (£/day)
                    </Label>
                    <Input
                      id="electricityStandingCharge"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.001"
                      value={inputs.electricityStandingCharge}
                      onChange={handleInputChange('electricityStandingCharge')}
                      placeholder="e.g., 0.45"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gasUsage" className="text-sm font-medium flex items-center gap-2">
                    <Flame className="h-4 w-4 text-amber-500" />
                    Gas usage (kWh/month)
                  </Label>
                  <Input
                    id="gasUsage"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="1"
                    value={inputs.gasUsage}
                    onChange={handleInputChange('gasUsage')}
                    placeholder="e.g., 520"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gasUnitRate" className="text-sm font-medium">
                      Gas unit rate (£/kWh)
                    </Label>
                    <Input
                      id="gasUnitRate"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.001"
                      value={inputs.gasUnitRate}
                      onChange={handleInputChange('gasUnitRate')}
                      placeholder="e.g., 0.09"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gasStandingCharge" className="text-sm font-medium">
                      Gas standing charge (£/day)
                    </Label>
                    <Input
                      id="gasStandingCharge"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.001"
                      value={inputs.gasStandingCharge}
                      onChange={handleInputChange('gasStandingCharge')}
                      placeholder="e.g., 0.30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vatRate" className="text-sm font-medium">
                      VAT rate (%)
                    </Label>
                    <Input
                      id="vatRate"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="0.1"
                      value={inputs.vatRate}
                      onChange={handleInputChange('vatRate')}
                      placeholder="e.g., 5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smoothingBuffer" className="text-sm font-medium">
                      Smoothing buffer (£)
                    </Label>
                    <Input
                      id="smoothingBuffer"
                      type="number"
                      inputMode="decimal"
                      min="0"
                      step="1"
                      value={inputs.smoothingBuffer}
                      onChange={handleInputChange('smoothingBuffer')}
                      placeholder="e.g., 20"
                    />
                  </div>
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
                    <Home className="h-5 w-5" />
                    Energy bill summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Monthly electricity cost
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.electricityCost)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Monthly gas cost
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.gasCost)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        VAT ({percentageFormatter.format(results.vatRate)}%)
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.vatAmount)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-indigo-900/40 p-4 border border-indigo-100 dark:border-indigo-800">
                      <p className="text-xs uppercase tracking-wide text-indigo-700 dark:text-indigo-200">
                        Monthly total
                      </p>
                      <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
                        {currencyFormatter.format(results.monthlyTotal)}
                      </p>
                      <p className="text-xs text-indigo-700 dark:text-indigo-200">
                        ≈ {currencyFormatter.format(results.annualTotal)} per year
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900 p-4">
                    <h3 className="text-base font-semibold text-indigo-900 dark:text-indigo-100 mb-4">
                      Cost breakdown
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Energy bill breakdown" />
                  </div>

                  <ExportActions
                    csvData={csvData}
                    fileName="energy-bill-calculator-results"
                    title="Energy bill estimate"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 dark:border-slate-800 shadow-sm">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Zap className="h-5 w-5 text-indigo-500" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Enter your latest usage and tariff details, then press <strong>Calculate</strong> to forecast monthly and annual energy costs.
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
          <FAQSection faqs={energyFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
