import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Percent, Tags, Receipt } from 'lucide-react';

import Heading from '@/components/common/Heading';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';

const keywords = [
  'discount calculator',
  'percentage discount calculator',
  'sale price calculator',
  'discount percentage calculator',
  'bulk discount calculator',
];

const metaDescription =
  'Use our discount calculator and percentage discount calculator to convert sale price calculator inputs, stack promotions, and check discount percentage calculator savings.';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/discount-calculator';
const schemaKeywords = keywords.slice(0, 5);

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const discountFaqs = [
  {
    question: 'How do I apply multiple discounts?',
    answer:
      'Enter the original price and add each code sequentially using the “Add discount” button. The percentage discount calculator applies discounts multiplicatively, matching how most retailers stack offers.',
  },
  {
    question: 'Can I compare bulk offers?',
    answer:
      'Yes. Toggle quantity to see the bulk discount calculator effect. Input the number of items to compute total and per-item savings before you commit.',
  },
  {
    question: 'How do I calculate the equivalent percentage from a fixed amount?',
    answer:
      'Switch to fixed amount mode and the sale price calculator will display the effective percentage. This helps you compare £ off coupons against percentage discounts.',
  },
];

const calculateDiscount = ({ price, quantity, discounts }) => {
  const basePrice = Math.max(price, 0);
  const qty = Math.max(quantity, 1);
  let runningPrice = basePrice;
  let totalDiscount = 0;

  discounts.forEach((discount) => {
    if (!discount.enabled) return;
    if (discount.type === 'percentage') {
      const reduction = runningPrice * Math.max(discount.value, 0) / 100;
      runningPrice -= reduction;
      totalDiscount += reduction;
    } else {
      const reduction = Math.min(Math.max(discount.value, 0), runningPrice);
      runningPrice -= reduction;
      totalDiscount += reduction;
    }
  });

  const unitPrice = Math.max(runningPrice, 0);
  const totalPrice = unitPrice * qty;
  const originalTotal = basePrice * qty;
  const totalSavings = Math.max(originalTotal - totalPrice, 0);
  const effectiveRate = originalTotal > 0 ? (totalSavings / originalTotal) * 100 : 0;

  return {
    unitPrice,
    totalPrice,
    totalSavings,
    effectiveRate,
  };
};

export default function DiscountCalculatorPage() {
  const [price, setPrice] = useState(120);
  const [quantity, setQuantity] = useState(1);
  const [discounts, setDiscounts] = useState([
    { id: 'discount-1', type: 'percentage', value: 15, enabled: true },
  ]);

  const results = useMemo(
    () =>
      calculateDiscount({
        price: Number(price) || 0,
        quantity: Number(quantity) || 1,
        discounts,
      }),
    [price, quantity, discounts]
  );

  const updateDiscount = (id, field, value) => {
    setDiscounts((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleDiscount = (id) => {
    setDiscounts((items) =>
      items.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  const addDiscountRow = () => {
    setDiscounts((items) => [
      ...items,
      { id: `discount-${items.length + 1}`, type: 'percentage', value: 10, enabled: true },
    ]);
  };

  const removeDiscountRow = (id) => {
    setDiscounts((items) => items.filter((item) => item.id !== id));
  };

  const resetAll = () => {
    setPrice(120);
    setQuantity(1);
    setDiscounts([{ id: 'discount-1', type: 'percentage', value: 15, enabled: true }]);
  };

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Discount Calculator | Percentage Discount Calculator</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Discount Calculator | Percentage Discount Calculator" />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Calc My Money" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Discount Calculator | Percentage Discount Calculator" />
        <meta name="twitter:description" content={metaDescription} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Discount Calculator',
              url: canonicalUrl,
              description: metaDescription,
              keywords: schemaKeywords,
              inLanguage: 'en-GB',
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate savings with a discount calculator',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-amber-900 via-slate-900 to-amber-900 py-16 text-white">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Discount Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Stack promotions, compare price drops, and share links so everyone knows the real saving before
            checkout.
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
                  Price details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Original price (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.1"
                    inputMode="decimal"
                    value={price}
                    onChange={(event) => setPrice(Number(event.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Slider
                    id="quantity"
                    className="mt-3"
                    value={[Number(quantity)]}
                    onValueChange={(value) => setQuantity(Number(value[0].toFixed(0)))}
                    min={1}
                    max={25}
                    step={1}
                  />
                  <div className="flex justify-between text-sm text-amber-700 dark:text-amber-200">
                    <span>1</span>
                    <span>{quantity}</span>
                    <span>25</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-amber-200 bg-white text-slate-900 shadow-md dark:border-amber-900 dark:bg-slate-950 dark:text-slate-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Tags className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  Discounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {discounts.map((discount) => (
                  <div
                    key={discount.id}
                    className="grid gap-2 md:grid-cols-[1fr_auto_auto_auto] md:items-center"
                  >
                    <select
                      className="rounded-md border border-amber-200 bg-white p-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none dark:border-amber-800 dark:bg-slate-900 dark:text-slate-100"
                      value={discount.type}
                      onChange={(event) =>
                        updateDiscount(discount.id, 'type', event.target.value)
                      }
                    >
                      <option value="percentage">Percentage</option>
                      <option value="amount">Amount</option>
                    </select>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      inputMode="decimal"
                      value={discount.value}
                      onChange={(event) =>
                        updateDiscount(discount.id, 'value', Number(event.target.value) || 0)
                      }
                    />
                    <Button
                      variant={discount.enabled ? 'default' : 'outline'}
                      onClick={() => toggleDiscount(discount.id)}
                    >
                      {discount.enabled ? 'Applied' : 'Skipped'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="justify-self-end text-amber-600 dark:text-amber-300"
                      onClick={() => removeDiscountRow(discount.id)}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addDiscountRow}>
                  Add discount
                </Button>
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={resetAll}>
              Reset calculator
            </Button>
          </div>

          <div className="space-y-6">
            <Card className="border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-slate-900">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Receipt className="h-5 w-5 text-amber-600 dark:text-amber-300" />
                  Sale price calculator summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center justify-between">
                  <span>Discounted price per item</span>
                  <span>{currencyFormatter.format(results.unitPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Total for {quantity} item(s)</span>
                  <span>{currencyFormatter.format(results.totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-200">
                  <span>Total savings</span>
                  <span>{currencyFormatter.format(results.totalSavings)}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Effective discount rate {results.effectiveRate.toFixed(2)}%
                </p>
              </CardContent>
            </Card>

            <section className="space-y-6 rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <Heading
                as="h2"
                size="h2"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Discount percentage calculator insights
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Check the discount percentage calculator before you head to the till. Many “50% off”
                promos combine with an extra percentage, and the calculator shows the real discount after
                stacking.
              </p>
              <Heading
                as="h3"
                size="h3"
                weight="semibold"
                className="text-slate-900 dark:text-slate-100"
              >
                Bulk discount calculator comparisons
              </Heading>
              <p className="text-base text-slate-600 dark:text-slate-300">
                Enter the quantity and add extra discounts to see if it is worth buying in bulk. Compare the
                per-item price with your usual retailer before committing to the haul.
              </p>
            </section>

            <section className="rounded-md border border-slate-200 bg-white p-6 shadow-md dark:border-slate-800 dark:bg-slate-900">
              <FAQSection faqs={discountFaqs} />
            </section>
          </div>
        </div>
      </CalculatorWrapper>
    </div>
  );
}
