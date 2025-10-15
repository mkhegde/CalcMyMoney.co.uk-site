import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Receipt, ClipboardCheck } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'vat calculator',
  'online vat calculator',
  'tax calculator',
  'tax return calculator',
];

const metaDescription =
  'Use our VAT calculator and online VAT calculator to add or remove VAT, compare tax calculator results, and prepare your next tax return calculator submission.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/vat-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const defaultInputs = {
  netAmount: 120,
  vatRate: 20,
};

const vatFaqs = [
  {
    question: 'How do I change the VAT rate?',
    answer:
      'Use the slider or enter the rate manually. Common options are 20% (standard), 5% (reduced), and 0% (zero-rated). The online VAT calculator reflects the change instantly.',
  },
  {
    question: 'Can I remove VAT from a gross amount?',
    answer:
      'Yes. Enter the net amount and vat rate. The calculator shows both the VAT charged and the gross total. If you only know the gross price, divide the gross by (1 + VAT rate) to recover the net.',
  },
  {
    question: 'Does this help with VAT returns?',
    answer:
      'The results highlight the VAT portion you must remit. Pair the figures with your tax return calculator so you can reconcile VAT control accounts accurately each quarter.',
  },
];

const calculateVat = ({ netAmount, vatRate }) => {
  const net = Math.max(netAmount, 0);
  const rate = Math.max(vatRate, 0) / 100;
  const vat = net * rate;
  const gross = net + vat;
  return { net, vat, gross, rate };
};

export default function VATCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);

  const results = useMemo(
    () =>
      calculateVat({
        netAmount: Number(inputs.netAmount) || 0,
        vatRate: Number(inputs.vatRate) || 0,
      }),
    [inputs]
  );

  const resetAll = () => setInputs(defaultInputs);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>VAT Calculator | Online VAT Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="VAT Calculator | Online VAT Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="VAT Calculator | Online VAT Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'VAT Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate VAT using an online VAT calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            VAT Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Add or strip VAT instantly across multiple rates. Share precise VAT splits with clients or
            your accounting software in seconds.
          </p>
        </div>
      </section>

      <CalculatorWrapper>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div className="space-y-6">
            <Card className="border border-amber-200 bg-white text-slate-900 shadow-md dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  VAT inputs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="netAmount">Net amount (£)</Label>
                    <Input
                      id="netAmount"
                      type="number"
                      min="0"
                      step="1"
                      inputMode="decimal"
                      value={inputs.netAmount}
                      onChange={(event) =>
                        setInputs((prev) => ({
                          ...prev,
                          netAmount: Number(event.target.value) || 0,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vatRate">VAT rate (%)</Label>
                    <Slider
                      id="vatRate"
                      className="mt-3"
                      value={[Number(inputs.vatRate)]}
                      onValueChange={(value) =>
                        setInputs((prev) => ({
                          ...prev,
                          vatRate: Number(value[0].toFixed(1)),
                        }))
                      }
                      min={0}
                      max={25}
                      step={0.5}
                    />
                    <div className="flex justify-between text-sm text-amber-700 dark:text-amber-200">
                      <span>0%</span>
                      <span>{inputs.vatRate.toFixed(1)}%</span>
                      <span>25%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset to default VAT
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  VAT breakdown
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Net amount</span>
                  <span>{currencyFormatter.format(results.net)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>VAT ({inputs.vatRate.toFixed(1)}%)</span>
                  <span>{currencyFormatter.format(results.vat)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Gross total</span>
                  <span>{currencyFormatter.format(results.gross)}</span>
                </div>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Online VAT calculator guidance
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                The online vat calculator helps you produce professional invoices. Enter the net figure,
                share the VAT and gross totals, and attach the breakdown to your accounting system to
                streamline bookkeeping.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Tax calculator and tax return calculator checks
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Plug the VAT amount into your tax calculator or tax return calculator to reconcile Box 1
                (VAT due on sales) or reclaim VAT input tax. Adjust the rate to model reduced or zero-rated
                supplies when needed.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={vatFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
