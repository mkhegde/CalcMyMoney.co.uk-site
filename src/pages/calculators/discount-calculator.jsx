import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Tags, Receipt, Trash2, PieChart } from 'lucide-react';

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

const CALCULATOR_NAME = 'Discount Calculator';
const canonicalUrl = 'https://www.calcmymoney.co.uk/discount-calculator';
const keywords = getCalculatorKeywords('Discount Calculator');

const metaDescription =
  'Stack voucher codes, calculate percentage savings, and compare basket totals with this UK discount calculator before you head to checkout.';

const defaultInputs = {
  price: '120',
  quantity: '1',
};

const defaultDiscountRows = [
  { id: 'discount-1', type: 'percentage', value: '15', enabled: true },
];

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

const discountFaqs = [
  {
    question: 'How are multiple discounts applied?',
    answer:
      'Discounts are applied in order. Percentage reductions are calculated on the running price, then fixed amounts are deducted. This mirrors how UK retailers typically stack voucher codes online.',
  },
  {
    question: 'Can I work out the saving per item when buying in bulk?',
    answer:
      'Yes. Enter the total quantity and apply any promotional codes. The calculator shows both the total basket saving and the discounted unit price so you can compare retailers.',
  },
  {
    question: 'How do I compare a fixed amount saving with a percentage code?',
    answer:
      'Add both offers to the list and enable them one at a time. The effective discount rate will update instantly, helping you see which code saves more on your basket.',
  },
];

const directoryLinks = [
  {
    label: 'Browse the full calculator directory',
    url: '/#calculator-directory',
    description: 'Jump into every UK calculator available on Calc My Money.',
  },
  {
    label: 'Budgeting & planning tools',
    url: '/#budgeting-planning',
    description: 'Balance your spending with savings goals before the next sale.',
  },
  {
    label: 'Utilities & household savings',
    url: '/#utilities-tools',
    description: 'Compare energy, transport, and subscription costs in one place.',
  },
];

const relatedCalculators = [
  {
    name: 'Budget Calculator',
    url: '/budget-calculator',
    description: 'See how discounts free up room in your monthly budget.',
  },
  {
    name: 'Savings Goal Calculator',
    url: '/savings-goal-calculator',
    description: 'Channel your sale savings into a future purchase or holiday.',
  },
  {
    name: 'Energy Bill Calculator',
    url: '/energy-bill-calculator',
    description: 'Reduce household costs alongside your shopping savings.',
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

const faqStructuredData = faqSchema(discountFaqs);

const evaluateDiscounts = ({ price, quantity, discounts }) => {
  const basePrice = Math.max(price, 0);
  const qty = Math.max(quantity, 1);

  if (basePrice <= 0) {
    return {
      valid: false,
      message: 'Enter the original price to compare savings accurately.',
    };
  }

  let runningPrice = basePrice;
  let totalSavingsPerItem = 0;
  const applied = [];

  discounts.forEach((discount, index) => {
    if (!discount.enabled) return;

    const value = Math.max(discount.value, 0);
    let reduction = 0;
    if (discount.type === 'percentage') {
      reduction = (runningPrice * value) / 100;
    } else {
      reduction = Math.min(value, runningPrice);
    }
    runningPrice = Math.max(runningPrice - reduction, 0);
    totalSavingsPerItem += reduction;
    applied.push({
      sequence: index + 1,
      type: discount.type,
      value,
      reduction,
      priceAfter: runningPrice,
    });
  });

  const discountedUnitPrice = runningPrice;
  const originalTotal = basePrice * qty;
  const discountedTotal = discountedUnitPrice * qty;
  const totalSavings = Math.max(originalTotal - discountedTotal, 0);
  const effectiveRate = originalTotal > 0 ? (totalSavings / originalTotal) * 100 : 0;

  return {
    valid: true,
    basePrice,
    qty,
    discountedUnitPrice,
    discountedTotal,
    totalSavings,
    effectiveRate,
    applied,
  };
};

export default function DiscountCalculatorPage() {
  const [inputs, setInputs] = useState(defaultInputs);
  const [discounts, setDiscounts] = useState(defaultDiscountRows);
  const [sequence, setSequence] = useState(defaultDiscountRows.length + 1);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleInputChange = (field) => (event) => {
    setInputs((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDiscountChange = (id, field, value) => {
    setDiscounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleDiscount = (id) => {
    setDiscounts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const removeDiscount = (id) => {
    setDiscounts((prev) => prev.filter((item) => item.id !== id));
  };

  const addDiscount = () => {
    setDiscounts((prev) => [
      ...prev,
      { id: `discount-${sequence}`, type: 'percentage', value: '10', enabled: true },
    ]);
    setSequence((prev) => prev + 1);
  };

  const handleReset = () => {
    setInputs(defaultInputs);
    setDiscounts(defaultDiscountRows);
    setSequence(defaultDiscountRows.length + 1);
    setResults(null);
    setHasCalculated(false);
  };

  const handleCalculate = (event) => {
    event.preventDefault();
    const payload = {
      price: sanitiseNumber(inputs.price),
      quantity: Math.max(1, Math.round(sanitiseNumber(inputs.quantity))),
      discounts: discounts.map((discount) => ({
        ...discount,
        value: sanitiseNumber(discount.value, { allowNegative: false }),
      })),
    };
    const outcome = evaluateDiscounts(payload);
    setResults(outcome);
    setHasCalculated(true);
  };

  const chartData = useMemo(() => {
    if (!results?.valid) return [];
    return [
      {
        name: 'Total you pay',
        value: results.discountedTotal,
        color: '#0ea5e9',
      },
      {
        name: 'Total savings',
        value: results.totalSavings,
        color: '#f97316',
      },
    ];
  }, [results]);

  const csvData = useMemo(() => {
    if (!results?.valid) return null;
    const summary = [
      ['Metric', 'Value'],
      ['Original price per item (£)', results.basePrice.toFixed(2)],
      ['Quantity', results.qty],
      ['Discounted price per item (£)', results.discountedUnitPrice.toFixed(2)],
      ['Total before discounts (£)', (results.basePrice * results.qty).toFixed(2)],
      ['Total after discounts (£)', results.discountedTotal.toFixed(2)],
      ['Total savings (£)', results.totalSavings.toFixed(2)],
      ['Effective discount (%)', results.effectiveRate.toFixed(2)],
    ];
    const discountRows = results.applied.length
      ? [
          [],
          ['Discount step', 'Type', 'Value', 'Amount saved (£)', 'Price after discount (£)'],
          ...results.applied.map((item) => [
            item.sequence,
            item.type === 'percentage' ? 'Percentage' : 'Fixed amount',
            item.type === 'percentage'
              ? `${percentageFormatter.format(item.value)}%`
              : `£${item.value.toFixed(2)}`,
            item.reduction.toFixed(2),
            item.priceAfter.toFixed(2),
          ]),
        ]
      : [];
    return [...summary, ...discountRows];
  }, [results]);

  const showResults = hasCalculated && results?.valid;

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>{`${CALCULATOR_NAME} | Percentage & Voucher Savings`}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={`${CALCULATOR_NAME} | Percentage & Voucher Savings`} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${CALCULATOR_NAME} | Percentage & Voucher Savings`} />
        <meta name="twitter:description" content={metaDescription} />
        {keywords.length > 0 ? <meta name="keywords" content={keywords.join(', ')} /> : null}
      </Helmet>
      <JsonLd data={webPageSchema} />
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqStructuredData} />

      <section className="calculator-hero">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="calculator-hero__title">
            Discount Calculator
          </Heading>
          <p className="calculator-hero__description">
            Stack promotion codes, compare seasonal sales, and make sure every basket is genuinely worth the spend.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <EmotionalHook
          title="Turn discounts into real savings"
          message="Every pound you shave off the bill is another pound available for goals that actually matter—holidays, debt freedom, or a rainy-day fund."
          quote="Beware of little expenses; a small leak will sink a great ship."
          author="Benjamin Franklin"
        />
      </div>

      <CalculatorWrapper>
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-amber-200 bg-white text-slate-900 shadow-sm dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                Basket details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-5" onSubmit={handleCalculate}>
                <div>
                  <Label htmlFor="price" className="text-sm font-medium">
                    Original price per item (£)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.01"
                    value={inputs.price}
                    onChange={handleInputChange('price')}
                    placeholder="e.g., 120"
                  />
                </div>
                <div>
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    step="1"
                    value={inputs.quantity}
                    onChange={handleInputChange('quantity')}
                    placeholder="e.g., 3"
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    Use whole numbers only. We round up any decimals to the nearest item.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <Tags className="h-4 w-4 text-amber-600 dark:text-amber-300" />
                      Discounts
                    </Label>
                    <Button type="button" variant="outline" size="sm" onClick={addDiscount}>
                      Add discount
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {discounts.map((discount) => (
                      <div
                        key={discount.id}
                        className="grid gap-2 rounded-md border border-amber-200 bg-white p-3 shadow-sm dark:border-amber-800 dark:bg-slate-900 md:grid-cols-[1fr_auto_auto]"
                      >
                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          <select
                            className="w-full rounded-md border border-amber-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none dark:border-amber-700 dark:bg-slate-950 dark:text-slate-100 md:w-40"
                            value={discount.type}
                            onChange={(event) =>
                              handleDiscountChange(discount.id, 'type', event.target.value)
                            }
                          >
                            <option value="percentage">Percentage</option>
                            <option value="amount">Fixed amount</option>
                          </select>
                          <Input
                            type="number"
                            inputMode="decimal"
                            min="0"
                            step="0.01"
                            value={discount.value}
                            onChange={(event) =>
                              handleDiscountChange(discount.id, 'value', event.target.value)
                            }
                            placeholder={discount.type === 'percentage' ? 'e.g., 15' : 'e.g., 20'}
                            className="md:w-32"
                          />
                        </div>
                        <Button
                          type="button"
                          variant={discount.enabled ? 'default' : 'outline'}
                          onClick={() => toggleDiscount(discount.id)}
                          className="md:w-28"
                        >
                          {discount.enabled ? 'Applied' : 'Skipped'}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeDiscount(discount.id)}
                          className="justify-self-end text-amber-600 hover:text-amber-700 dark:text-amber-300"
                          aria-label="Remove discount"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {!discounts.length ? (
                      <p className="rounded-md border border-dashed border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                        Add at least one discount to compare savings.
                      </p>
                    ) : null}
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
              <Card className="border border-amber-200 bg-amber-50 text-slate-900 shadow-sm dark:border-amber-900 dark:bg-amber-900/30 dark:text-amber-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                    <Receipt className="h-5 w-5 text-amber-700 dark:text-amber-100" />
                    Basket summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Discounted price per item
                      </p>
                      <p className="text-2xl font-bold">
                        {currencyFormatter.format(results.discountedUnitPrice)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Total to pay
                      </p>
                      <p className="text-2xl font-bold">
                        {currencyFormatter.format(results.discountedTotal)}
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-200">
                        Based on {results.qty} item(s)
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Total savings
                      </p>
                      <p className="text-2xl font-bold">
                        {currencyFormatter.format(results.totalSavings)}
                      </p>
                    </div>
                    <div className="rounded-md bg-white/80 dark:bg-amber-900/40 p-4 border border-amber-100 dark:border-amber-800">
                      <p className="text-xs uppercase tracking-wide text-amber-700 dark:text-amber-200">
                        Effective discount
                      </p>
                      <p className="text-2xl font-bold">
                        {percentageFormatter.format(results.effectiveRate)}%
                      </p>
                    </div>
                  </div>

                  <div className="rounded-md bg-white dark:bg-slate-900 border border-amber-100 dark:border-amber-900 p-4">
                    <h3 className="flex items-center gap-2 text-base font-semibold text-amber-800 dark:text-amber-100 mb-4">
                      <PieChart className="h-5 w-5" />
                      Savings breakdown
                    </h3>
                    <ResultBreakdownChart data={chartData} title="Discount savings chart" />
                  </div>

                  {results.applied.length ? (
                    <div className="space-y-3">
                      <h3 className="text-base font-semibold text-amber-800 dark:text-amber-100">
                        Applied discounts
                      </h3>
                      <ul className="space-y-2">
                        {results.applied.map((discount) => (
                          <li
                            key={`summary-${discount.sequence}`}
                            className="rounded-md border border-amber-100 bg-white p-3 text-sm text-slate-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-100"
                          >
                            <span className="font-medium">
                              Step {discount.sequence}:{' '}
                              {discount.type === 'percentage'
                                ? `${percentageFormatter.format(discount.value)}%`
                                : currencyFormatter.format(discount.value)}
                            </span>{' '}
                            saved {currencyFormatter.format(discount.reduction)} · price now{' '}
                            {currencyFormatter.format(discount.priceAfter)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}

                  <ExportActions
                    csvData={csvData}
                    fileName="discount-calculator-summary"
                    title="Discount calculator results"
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-6">
              <Card className="border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <CardContent className="flex items-center gap-3 text-slate-700 dark:text-slate-200 py-6">
                  <Percent className="h-5 w-5 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                  <p className="text-sm">
                    {hasCalculated && results?.message ? (
                      results.message
                    ) : (
                      <>
                        Add your basket price, quantity, and discount codes, then press{' '}
                        <strong>Calculate</strong> to see the genuine saving.
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
          <FAQSection faqs={discountFaqs} />
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pb-16">
        <DirectoryLinks links={directoryLinks} />
        <RelatedCalculators calculators={relatedCalculators} />
      </div>
    </div>
  );
}
