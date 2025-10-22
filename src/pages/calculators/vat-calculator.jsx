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
import { Calculator, Receipt, Percent, ClipboardCheck, PieChart } from 'lucide-react';

const ResultBreakdownChart = React.lazy(
  () => import('@/components/calculators/ResultBreakdownChart.jsx')
);

const pagePath = '/calculators/vat-calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/vat-calculator';
const pageTitle = 'VAT Calculator UK | Add or Remove VAT';
const metaDescription =
  'Add, remove, or compare VAT at UK rates including 20%, 5%, and 0%. Export the VAT breakdown for invoices or VAT return reconciliations.';
const keywords = getMappedKeywords('VAT Calculator');

const faqItems = [
  {
    question: 'How do I calculate VAT for UK invoices?',
    answer:
      'Enter the net amount and select the VAT rate (standard 20%, reduced 5%, or zero-rated). The calculator shows the VAT due and the gross amount you should charge.',
  },
  {
    question: 'Can I remove VAT from a gross amount?',
    answer:
      'Yes. Enter the gross price and tick “I only know the gross amount” to back out the VAT portion. This is useful when suppliers quote VAT-inclusive prices.',
  },
  {
    question: 'Will this help with VAT returns?',
    answer:
      'Use the export option to capture VAT amounts for each invoice line. These totals feed directly into Box 1 (VAT due on sales) and Box 6 (net value of sales) on your VAT return.',
  },
];

const emotionalMessage =
  'Clarity on VAT keeps cash flow smooth. Know exactly what belongs to HMRC and what you keep on every sale or purchase.';
const emotionalQuote = {
  text: 'Look after the pennies and the pounds will look after themselves.',
  author: 'Traditional UK proverb',
};

const directoryLinks = [
  {
    url: '/#tax',
    label: 'Explore UK tax calculators',
    description: 'From PAYE to corporation tax, stay compliant with our full tax toolkit.',
  },
  {
    url: '/calculators/tax-and-ni-calculator',
    label: 'Tax & NI Calculator',
    description: 'Cross-check PAYE deductions alongside VAT obligations for cash-flow planning.',
  },
  {
    url: '/calculators/self-assessment-calculator',
    label: 'Self Assessment Tax Calculator',
    description: 'Estimate income tax and payments on account for sole traders.',
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
  netAmount: '120',
  vatRate: '20',
  grossOnly: false,
  grossAmount: '144',
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

const calculateVat = ({ netAmountInput, vatRateInput, grossOnly, grossAmountInput }) => {
  const vatRate = Math.max(parseNumber(vatRateInput), 0) / 100;
  let netAmount = Math.max(parseNumber(netAmountInput), 0);
  let grossAmount = Math.max(parseNumber(grossAmountInput), 0);

  if (grossOnly) {
    grossAmount = Math.max(grossAmount, 0);
    netAmount = vatRate >= 0 ? grossAmount / (1 + vatRate) : grossAmount;
  } else {
    grossAmount = netAmount * (1 + vatRate);
  }

  const vatAmount = grossAmount - netAmount;

  return {
    netAmount,
    vatAmount,
    grossAmount,
    vatRate,
  };
};

const buildCsvData = (results, inputs) => {
  if (!results) return null;
  return [
    ['Input', 'Value'],
    ['Net amount (£)', inputs.netAmount],
    ['VAT rate (%)', inputs.vatRate],
    ['Gross amount provided', inputs.grossOnly ? 'Yes' : 'No'],
    ['Gross amount (£)', inputs.grossAmount],
    [],
    ['Output', 'Value'],
    ['Calculated net (£)', currencyFormatter.format(results.netAmount)],
    ['VAT amount (£)', currencyFormatter.format(results.vatAmount)],
    ['Gross amount (£)', currencyFormatter.format(results.grossAmount)],
    ['VAT rate (%)', `${percentFormatter.format(results.vatRate * 100)}%`],
  ];
};

const buildChartData = (results) => {
  if (!results) return [];
  return [
    { name: 'Net amount', value: results.netAmount, color: '#0ea5e9' },
    { name: 'VAT amount', value: results.vatAmount, color: '#f59e0b' },
  ].filter((item) => item.value > 0);
};

export default function VATCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'VAT Calculator',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Business & Tax Calculators', url: '/calculators#tax' },
      { name: 'VAT Calculator', url: pagePath },
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
    (event) => {
      const { checked } = event.target;
      setInputs((prev) => ({ ...prev, grossOnly: checked }));
      resetResults();
    },
    [resetResults]
  );

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const computed = calculateVat({
        netAmountInput: inputs.netAmount,
        vatRateInput: inputs.vatRate,
        grossOnly: inputs.grossOnly,
        grossAmountInput: inputs.grossAmount,
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                VAT Calculator UK
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Work out the VAT portion of any price, whether you are adding VAT for an invoice or removing
              it from a gross total.
            </p>
          </header>

          <EmotionalHook
            message={emotionalMessage}
            quote={emotionalQuote}
            icon={<Percent className="h-4 w-4 shrink-0" aria-hidden="true" />}
            iconColor="text-amber-600 dark:text-amber-300"
            borderColor="border-amber-200 dark:border-amber-800/60"
            bgColor="bg-amber-50/70 dark:bg-amber-900/40"
            textColor="text-amber-900 dark:text-amber-50"
            footerColor="text-amber-700 dark:text-amber-200"
          />

          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <Card className="border border-amber-200 bg-white dark:border-amber-900 dark:bg-slate-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  VAT inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="netAmount">Net amount (£)</Label>
                      <Input
                        id="netAmount"
                        inputMode="decimal"
                        value={inputs.netAmount}
                        onChange={handleInputChange('netAmount')}
                        placeholder="e.g. 120"
                        disabled={inputs.grossOnly}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="vatRate">VAT rate (%)</Label>
                      <Input
                        id="vatRate"
                        inputMode="decimal"
                        value={inputs.vatRate}
                        onChange={handleInputChange('vatRate')}
                        placeholder="e.g. 20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="grossAmount">Gross amount (£)</Label>
                      <Input
                        id="grossAmount"
                        inputMode="decimal"
                        value={inputs.grossAmount}
                        onChange={handleInputChange('grossAmount')}
                        placeholder="e.g. 144"
                        disabled={!inputs.grossOnly}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <input type="checkbox" checked={inputs.grossOnly} onChange={handleCheckboxChange} />
                    I only know the gross amount (calculate the net and VAT portion)
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Calculate VAT
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
                    Enter a net or gross amount and press
                    <span className="font-semibold"> Calculate VAT</span> to see the VAT split and gross
                    price.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && results && (
                <>
                  <Card className="border border-amber-200 bg-white shadow-sm dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-200" aria-hidden="true" />
                        VAT breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-100">Net amount</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.netAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-100">VAT amount</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.vatAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-100">Gross amount</p>
                        <p className="text-2xl font-semibold">
                          {currencyFormatter.format(results.grossAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-amber-900 dark:text-amber-100">VAT rate</p>
                        <p className="text-2xl font-semibold">
                          {percentFormatter.format(results.vatRate * 100)}%
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="vat-calculation"
                          title="VAT Calculator Results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ClipboardCheck className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        Notes for record keeping
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                      <p>
                        Include the VAT amount in Box 1 of your VAT return if this is a sale, and record
                        the gross sale value in Box 6. If this is an expense, capture the VAT for input tax
                        reclaim in Box 4.
                      </p>
                      <p>
                        Keep a copy of this calculation with your invoice or receipt so your accountant can
                        verify the VAT treatment during quarter-end checks.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <PieChart className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                        VAT vs net share
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
                        <ResultBreakdownChart data={chartData} title="VAT composition" />
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
