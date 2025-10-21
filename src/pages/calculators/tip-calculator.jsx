import React, { useCallback, useMemo, useState, Suspense } from 'react';
import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import { getMappedKeywords } from '@/components/seo/keywordMappings';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import DirectoryLinks from '@/components/calculators/DirectoryLinks';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import EmotionalHook from '@/components/calculators/EmotionalHook';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calculator, Users, Percent, Receipt, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/tip-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/tip-calculator';
const pageTitle = 'Tip Calculator UK | Split Bills & Add Gratuity';
const metaDescription =
  'Split restaurant bills, add a tip, and remove UK service charges with the interactive tip calculator. Share the totals instantly with your group.';
const keywords = getMappedKeywords('Tip Calculator');

const faqItems = [
  {
    question: 'Should I tip on the pre-service charge amount?',
    answer:
      'Many UK diners tip on the subtotal before the optional service charge. Use the “Remove automatic service charge” option to back out the percentage before applying your chosen tip.',
  },
  {
    question: 'How do I split the bill between friends?',
    answer:
      'Enter the number of people in your party. The calculator divides the total, including tip, so everyone can transfer the exact amount without mental maths at the table.',
  },
  {
    question: 'Can I add a fixed tip instead of a percentage?',
    answer:
      'Yes. Toggle to fixed tip mode to enter a set amount, perfect for rounding up or leaving cash on the table. The calculator still shows the effective tip percentage for etiquette checks.',
  },
];

const emotionalMessage =
  'Settle the bill with zero awkwardness. A quick calculation keeps your group aligned and makes it easy to be generous with great service.';
const emotionalQuote = {
  text: 'Feeling gratitude and not expressing it is like wrapping a present and not giving it.',
  author: 'William Arthur Ward',
};

const directoryLinks = [
  {
    url: '/#budgeting',
    label: 'Explore budgeting tools',
    description: 'Track eating-out spending alongside groceries, travel, and personal treats.',
  },
  {
    url: '/calculators/travel-budget-calculator',
    label: 'Travel Budget Calculator',
    description: 'Plan holiday spending, including meals and experiences, before you fly.',
  },
  {
    url: '/calculators/weekly-budget-planner',
    label: 'Weekly Budget Planner',
    description: 'Balance hospitality treats with your weekly spending limit.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const percentFormatter = new Intl.NumberFormat('en-GB', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const defaultInputs = {
  billAmount: '68.50',
  tipPercentage: '12.5',
  guests: '2',
  roundUp: false,
  useFixedTip: false,
  fixedTip: '5',
  removeServiceCharge: false,
  serviceChargeRate: '12.5',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateTip = ({
  billAmount,
  tipPercentage,
  guests,
  roundUp,
  fixedTip,
  useFixedTip,
  removeServiceCharge,
  serviceChargeRate,
}) => {
  const baseBill = Math.max(billAmount, 0);
  const adjustedBill = removeServiceCharge
    ? baseBill / (1 + Math.max(serviceChargeRate, 0) / 100)
    : baseBill;

  const tipAmount = useFixedTip
    ? Math.max(fixedTip, 0)
    : (adjustedBill * Math.max(tipPercentage, 0)) / 100;

  let total = adjustedBill + tipAmount;
  if (roundUp) {
    total = Math.ceil(total);
  }

  const people = Math.max(guests, 1);
  const perPerson = total / people;
  const effectiveRate = adjustedBill > 0 ? (tipAmount / adjustedBill) * 100 : 0;

  return {
    adjustedBill,
    tipAmount,
    total,
    perPerson,
    effectiveRate,
    serviceChargeRemoved: removeServiceCharge ? baseBill - adjustedBill : 0,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Bill total (£)', inputs.billAmount],
    ['Tip percentage (%)', inputs.tipPercentage],
    ['Number of guests', inputs.guests],
    ['Use fixed tip', inputs.useFixedTip ? 'Yes' : 'No'],
    ['Fixed tip (£)', inputs.fixedTip],
    ['Round up to nearest pound', inputs.roundUp ? 'Yes' : 'No'],
    ['Remove service charge', inputs.removeServiceCharge ? 'Yes' : 'No'],
    ['Service charge rate (%)', inputs.serviceChargeRate],
    [],
    ['Output', 'Value'],
    ['Adjusted bill (£)', currencyFormatter.format(results.adjustedBill)],
    ['Tip amount (£)', currencyFormatter.format(results.tipAmount)],
    ['Total to pay (£)', currencyFormatter.format(results.total)],
    ['Per person (£)', currencyFormatter.format(results.perPerson)],
    ['Effective tip (%)', `${percentFormatter.format(results.effectiveRate)}%`],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Adjusted bill', value: results.adjustedBill, color: '#0ea5e9' },
    { name: 'Tip amount', value: results.tipAmount, color: '#10b981' },
  ].filter((item) => item.value > 0);
};

export default function TipCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Tip Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Budgeting & Planning Calculators', url: '/calculators#budgeting' },
      { name: 'Tip Calculator', url: pagePath },
    ],
    faq: faqItems,
  });

  const resetResults = useCallback(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const handleInputChange = useCallback(
    (field) => (event) => {
      const { value } = event.target;
      setInputs((prev) => ({ ...prev, [field]: value }));
      resetResults();
    },
    [resetResults]
  );

  const handleCheckboxChange = useCallback(
    (field) => (event) => {
      const { checked } = event.target;
      setInputs((prev) => ({ ...prev, [field]: checked }));
      resetResults();
    },
    [resetResults]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateTip({
        billAmount: parseNumber(inputs.billAmount),
        tipPercentage: parseNumber(inputs.tipPercentage),
        guests: Math.max(parseNumber(inputs.guests), 1),
        roundUp: inputs.roundUp,
        useFixedTip: inputs.useFixedTip,
        fixedTip: parseNumber(inputs.fixedTip),
        removeServiceCharge: inputs.removeServiceCharge,
        serviceChargeRate: parseNumber(inputs.serviceChargeRate),
      });
      setResults(computed);
      setHasCalculated(true);
      setCsvData(buildCsvData(computed, inputs));
    },
    [inputs]
  );

  const handleReset = useCallback(() => {
    setInputs(defaultInputs);
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, []);

  const chartData = useMemo(() => buildChartData(results), [results]);

  return (
    <div className="bg-slate-50 dark:bg-slate-900">
      <SeoHead
        title={pageTitle}
        description={metaDescription}
        canonical={canonicalUrl}
        ogTitle={pageTitle}
        ogDescription={metaDescription}
        ogUrl={canonicalUrl}
        ogType="website"
        ogSiteName="CalcMyMoney UK"
        ogLocale="en_GB"
        twitterTitle={pageTitle}
        twitterDescription={metaDescription}
        keywords={keywords}
        articleTags={keywords}
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
                Tip Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Quickly set the right gratuity, optionally remove automatic service charges, and share the
              split with your dining companions.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Receipt className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-emerald-600 dark:text-emerald-300"
            borderColor="border-emerald-200 dark:border-emerald-800/60"
            bgColor="bg-emerald-50/70 dark:bg-emerald-900/40"
            textColor="text-emerald-900 dark:text-emerald-50"
            footerColor="text-emerald-700 dark:text-emerald-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
            <Card className="border border-emerald-200 bg-white dark:border-emerald-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Percent className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                  Bill details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="billAmount">Bill total (£)</Label>
                      <Input
                        id="billAmount"
                        inputMode="decimal"
                        value={inputs.billAmount}
                        onChange={handleInputChange('billAmount')}
                        placeholder="e.g. 68.50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tipPercentage">Tip percentage (%)</Label>
                      <Input
                        id="tipPercentage"
                        inputMode="decimal"
                        value={inputs.tipPercentage}
                        onChange={handleInputChange('tipPercentage')}
                        placeholder="e.g. 12.5"
                        disabled={inputs.useFixedTip}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fixedTip">Fixed tip (£)</Label>
                      <Input
                        id="fixedTip"
                        inputMode="decimal"
                        value={inputs.fixedTip}
                        onChange={handleInputChange('fixedTip')}
                        placeholder="e.g. 5"
                        disabled={!inputs.useFixedTip}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="guests">Number of people splitting</Label>
                      <Input
                        id="guests"
                        inputMode="decimal"
                        value={inputs.guests}
                        onChange={handleInputChange('guests')}
                        placeholder="e.g. 2"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="serviceChargeRate">Service charge rate (%)</Label>
                      <Input
                        id="serviceChargeRate"
                        inputMode="decimal"
                        value={inputs.serviceChargeRate}
                        onChange={handleInputChange('serviceChargeRate')}
                        placeholder="e.g. 12.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={inputs.useFixedTip}
                        onChange={handleCheckboxChange('useFixedTip')}
                      />
                      Use fixed tip instead of percentage
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={inputs.roundUp}
                        onChange={handleCheckboxChange('roundUp')}
                      />
                      Round total up to nearest pound
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <input
                        type="checkbox"
                        checked={inputs.removeServiceCharge}
                        onChange={handleCheckboxChange('removeServiceCharge')}
                      />
                      Remove automatic service charge before tipping
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate tip & split
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      Reset inputs
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              {!hasCalculated && (
                <Card className="border border-dashed border-slate-300 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">
                  <CardContent className="py-10 text-center text-sm leading-relaxed">
                    Enter your bill details and press
                    <span className="font-semibold"> Calculate tip & split</span> to see the gratuity and
                    per-person share.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-emerald-200 bg-white shadow-sm dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-200" aria-hidden="true" />
                        Bill summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Adjusted bill</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.adjustedBill)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Tip amount</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.tipAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Total to pay</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.total)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Per person</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.perPerson)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-900 dark:text-emerald-100">Effective tip</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.effectiveRate)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="tip-calculation"
                          title="Tip Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Receipt className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Service charge insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      {results.serviceChargeRemoved > 0 ? (
                        <p>
                          Automatic service charge removed: {currencyFormatter.format(results.serviceChargeRemoved)}.
                          Your tip is applied to the original subtotal.
                        </p>
                      ) : (
                        <p>No service charge adjustments applied to this calculation.</p>
                      )}
                      <p>
                        Share the per-person amount via your group chat so everyone can transfer the same
                        figure immediately.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-emerald-600 dark:text-emerald-300" aria-hidden="true" />
                        Bill composition
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
                        <ResultBreakdownChart data={chartData} title="Bill vs tip" />
                      </Suspense>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <FAQSection faqs={faqItems} />
          </section>

          <RelatedCalculators calculators={relatedCalculators} />
          <DirectoryLinks links={directoryLinks} />
        </div>
      </CalculatorWrapper>
    </div>
  );
}
