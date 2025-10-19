import React, { useMemo, useState } from 'react';
import { Calculator, ArrowRightLeft, Info, Quote, BookOpen } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import useCalculatorSchema from '@/components/seo/useCalculatorSchema';
import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import ExportActions from '@/components/calculators/ExportActions';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getRelatedCalculators } from '@/utils/getRelatedCalculators';
import ResultBreakdownChart from '@/components/calculators/ResultBreakdownChart.jsx';

const keywords = ['currency converter', 'money converter', 'exchange rate calculator'];

const metaDescription =
  'Convert currencies using mid-market exchange rates. Enter an amount and see the converted value for popular GBP pairs.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/currency-converter';
const pagePath = '/calculators/currency-converter';
const pageTitle = 'Currency Converter | Mid-Market FX Calculator';

const faqItems = [
  {
    question: 'Where do the exchange rates come from?',
    answer:
      'Rates are mid-market reference values refreshed weekly against GBP. Always check with your card issuer or bank for live dealing rates before transferring money.',
  },
  {
    question: 'Why does my bank quote a different rate?',
    answer:
      'Banks include a markup or fee on top of the mid-market rate. Use the converter for budgeting, then confirm the exact rate during your transaction.',
  },
  {
    question: 'How can I reduce FX fees?',
    answer:
      'Compare providers, consider multi-currency accounts, and keep an eye on transaction limits. Budgeting with this calculator helps you decide the best time and method to convert.',
  },
];

const emotionalMessage =
  'Whether you are paying overseas suppliers or planning a trip, quick conversions keep cash flow predictable.';

const emotionalQuote = {
  text: 'The way to get started is to quit talking and begin doing.',
  author: 'Walt Disney',
};

const SUPPORTED_CURRENCIES = [
  { code: 'GBP', label: 'GBP – British Pound' },
  { code: 'USD', label: 'USD – United States Dollar' },
  { code: 'EUR', label: 'EUR – Euro' },
  { code: 'JPY', label: 'JPY – Japanese Yen' },
  { code: 'AUD', label: 'AUD – Australian Dollar' },
  { code: 'CAD', label: 'CAD – Canadian Dollar' },
  { code: 'CHF', label: 'CHF – Swiss Franc' },
  { code: 'INR', label: 'INR – Indian Rupee' },
  { code: 'NZD', label: 'NZD – New Zealand Dollar' },
];

// Rates relative to GBP (mid-market snapshot, April 2025).
const FX_RATES = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
  JPY: 191.2,
  AUD: 1.92,
  CAD: 1.72,
  CHF: 1.11,
  INR: 105.4,
  NZD: 2.07,
};

const ZERO_DECIMAL = new Set(['JPY']);

const formatCurrency = (code, amount) => {
  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: code,
    minimumFractionDigits: ZERO_DECIMAL.has(code) ? 0 : 2,
    maximumFractionDigits: ZERO_DECIMAL.has(code) ? 0 : 2,
  });
  return formatter.format(amount);
};

const parseNumber = (value) => {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const numeric = Number.parseFloat(cleaned);
  return Number.isFinite(numeric) ? numeric : 0;
};

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1,000');
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('USD');
  const [hasCalculated, setHasCalculated] = useState(false);
  const [result, setResult] = useState(null);
  const [csvData, setCsvData] = useState(null);

  const relatedCalculators = useMemo(() => getRelatedCalculators(pagePath), []);

  const schema = useCalculatorSchema({
    origin: 'https://www.calcmymoney.co.uk',
    path: pagePath,
    name: 'Currency Converter',
    description: metaDescription,
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Utilities & Tools Calculators', url: '/calculators#utilities-tools' },
      { name: 'Currency Converter', url: pagePath },
    ],
    faq: faqItems,
  });

  const chartData = useMemo(() => {
    if (!result || !hasCalculated) return [];
    return [
      { name: `Amount in ${fromCurrency}`, value: result.baseAmount, color: '#0ea5e9' },
      { name: `Converted to ${toCurrency}`, value: result.convertedAmount, color: '#22c55e' },
      { name: 'Indicative rate', value: result.rate, color: '#6366f1' },
    ];
  }, [result, hasCalculated, fromCurrency, toCurrency]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const baseAmount = parseNumber(amount);
    const fromRate = FX_RATES[fromCurrency];
    const toRate = FX_RATES[toCurrency];

    if (!fromRate || !toRate || baseAmount < 0) {
      setHasCalculated(false);
      setResult(null);
      setCsvData(null);
      return;
    }

    const gbpValue = fromCurrency === 'GBP' ? baseAmount : baseAmount / fromRate;
    const convertedAmount = toRate * gbpValue;
    const rate = toRate / fromRate;

    const computed = {
      baseAmount,
      convertedAmount,
      rate,
    };
    setHasCalculated(true);
    setResult(computed);

    setCsvData([
      ['Amount entered', baseAmount],
      ['From currency', fromCurrency],
      ['To currency', toCurrency],
      ['Indicative rate', rate],
      ['Converted amount', convertedAmount],
    ]);
  };

  const handleReset = () => {
    setAmount('1,000');
    setFromCurrency('GBP');
    setToCurrency('USD');
    setHasCalculated(false);
    setResult(null);
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
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200">
                <Calculator className="h-6 w-6" aria-hidden="true" />
              </span>
              <Heading as="h1" size="h1" className="!mb-0">
                Currency Converter
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Convert between GBP and popular currencies using mid-market reference rates. Ideal for budgeting and expense planning.
            </p>
          </header>

          <section className="rounded-xl border border-indigo-100 bg-white p-6 shadow-sm dark:border-indigo-900/40 dark:bg-slate-950/40">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2 max-w-2xl">
                <Heading as="h2" size="h3" className="text-slate-900 dark:text-slate-100 !mb-0">
                  Plan conversions with confidence
                </Heading>
                <p className="text-sm text-slate-600 dark:text-slate-300">{emotionalMessage}</p>
              </div>
              <blockquote className="max-w-sm rounded-lg border border-indigo-200 bg-indigo-50/70 p-4 text-sm text-indigo-900 shadow-sm dark:border-indigo-800/60 dark:bg-indigo-950/40 dark:text-indigo-100">
                <div className="flex items-start gap-2">
                  <Quote className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <p className="italic leading-relaxed">“{emotionalQuote.text}”</p>
                </div>
                <footer className="mt-3 text-right text-xs font-medium uppercase tracking-wide text-indigo-700 dark:text-indigo-300">
                  — {emotionalQuote.author}
                </footer>
              </blockquote>
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <ArrowRightLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                  Conversion inputs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount to convert</Label>
                    <Input
                      id="amount"
                      inputMode="decimal"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="e.g. 1,000"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>From currency</Label>
                      <Select value={fromCurrency} onValueChange={setFromCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>To currency</Label>
                      <Select value={toCurrency} onValueChange={setToCurrency}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          {SUPPORTED_CURRENCIES.map((currency) => (
                            <SelectItem key={currency.code} value={currency.code}>
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button type="submit" className="flex-1">
                      Convert
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
                    Choose currencies, enter an amount, and press <span className="font-semibold">Convert</span> to see the mid-market conversion and CSV download.
                  </CardContent>
                </Card>
              )}

              {hasCalculated && result && (
                <>
                  <Card className="border border-indigo-200 bg-white shadow-sm dark:border-indigo-900 dark:bg-indigo-900/30 dark:text-indigo-50">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ArrowRightLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-200" aria-hidden="true" />
                        Conversion summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Converted amount</p>
                        <p className="text-2xl font-semibold">
                          {formatCurrency(toCurrency, result.convertedAmount)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-indigo-900 dark:text-indigo-200">Indicative rate</p>
                        <p className="text-2xl font-semibold">{result.rate.toFixed(4)}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <ExportActions
                          csvData={csvData}
                          fileName="currency-conversion"
                          title="Currency converter results"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <ArrowRightLeft className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
                        Amount comparison
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResultBreakdownChart data={chartData} title="Currency conversion comparison" />
                    </CardContent>
                  </Card>
                </>
              )}

              <Alert variant="secondary">
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm text-slate-600 dark:text-slate-300">
                  Rates updated: 12 April 2025. Treat as indicative values; live deals may differ.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BookOpen className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden="true" />
              <Heading as="h2" size="h3" className="!mb-0">
                Plan every transfer
              </Heading>
            </div>
            <p className="text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Combine these conversions with your budget or travel plan so you know exactly how exchange rate changes impact costs.
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

