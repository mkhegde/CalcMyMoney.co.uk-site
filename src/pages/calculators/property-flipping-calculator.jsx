import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Home, Hammer, TrendingUp } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/property-flipping-calculator';

const schemaKeywords = [
  'Acquisition Price',
  'Holding Costs',
  'Selling Fees',
  'Gross Profit',
  'Real Estate Investment',
];

const defaultRenovationItems = [
  { id: 1, label: 'Kitchen refurbishment', amount: '8000' },
  { id: 2, label: 'Bathroom upgrade', amount: '4500' },
  { id: 3, label: 'Decor & staging', amount: '2200' },
];

let renovationId = 4;

const faqItems = [
  {
    question: 'What costs should I include in a flip analysis?',
    answer:
      'Include acquisition price, renovation budget, holding costs (mortgage interest, council tax, utilities), selling fees (estate agent, legal), and contingency funds.',
  },
  {
    question: 'How do I estimate property flipping ROI?',
    answer:
      'ROI is calculated by dividing net profit by total cash invested. This calculator shows ROI based on your projected sale price and all costs entered.',
  },
  {
    question: 'How much contingency should I set aside?',
    answer:
      'Many investors set aside 10-15% of the renovation budget for unexpected issues. Adjust based on property condition and contractor quotes.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function PropertyFlippingCalculator() {
  const [inputs, setInputs] = useState({
    purchasePrice: '210000',
    stampDuty: '7300',
    legalFees: '1500',
    holdingCostsPerMonth: '650',
    holdingMonths: '6',
    sellingFeesPercent: '2.5',
    desiredSalePrice: '285000',
    contingencyPercent: '10',
  });
  const [renovationItems, setRenovationItems] = useState(defaultRenovationItems);

  const updateRenovationItem = useCallback((id, value) => {
    setRenovationItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, amount: value } : item)),
    );
  }, []);

  const addRenovationItem = useCallback(() => {
    setRenovationItems((prev) => [
      ...prev,
      { id: renovationId++, label: 'New item', amount: '0' },
    ]);
  }, []);

  const removeRenovationItem = useCallback((id) => {
    setRenovationItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      purchasePrice: '210000',
      stampDuty: '7300',
      legalFees: '1500',
      holdingCostsPerMonth: '650',
      holdingMonths: '6',
      sellingFeesPercent: '2.5',
      desiredSalePrice: '285000',
      contingencyPercent: '10',
    });
    setRenovationItems(defaultRenovationItems);
  }, []);

  const results = useMemo(() => {
    const purchasePrice = Number(inputs.purchasePrice) || 0;
    const stampDuty = Number(inputs.stampDuty) || 0;
    const legalFees = Number(inputs.legalFees) || 0;
    const holdingCostsPerMonth = Number(inputs.holdingCostsPerMonth) || 0;
    const holdingMonths = Number(inputs.holdingMonths) || 0;
    const sellingFeesPercent = Number(inputs.sellingFeesPercent) / 100 || 0;
    const desiredSalePrice = Number(inputs.desiredSalePrice) || 0;
    const contingencyPercent = Number(inputs.contingencyPercent) / 100 || 0;

    const renovationCost = renovationItems.reduce(
      (sum, item) => sum + (Number(item.amount) || 0),
      0,
    );
    const contingency = renovationCost * contingencyPercent;
    const holdingCosts = holdingCostsPerMonth * holdingMonths;
    const acquisitionCosts = purchasePrice + stampDuty + legalFees;
    const totalInvestment =
      acquisitionCosts + renovationCost + contingency + holdingCosts;
    const sellingFees = desiredSalePrice * sellingFeesPercent;
    const netProceeds = desiredSalePrice - sellingFees;
    const grossProfit = netProceeds - totalInvestment;
    const roi =
      totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;

    return {
      purchasePrice,
      stampDuty,
      legalFees,
      renovationCost,
      contingency,
      holdingCosts,
      sellingFees,
      desiredSalePrice,
      totalInvestment,
      netProceeds,
      grossProfit,
      roi,
    };
  }, [inputs, renovationItems]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Property Flipping &amp; House Flipping ROI Calculator</title>
        <meta
          name="description"
          content="Property Flipping Calculator to evaluate return on investment (ROI), renovation costs, and gross profit for house flipping projects."
        />
        <meta
          name="keywords"
          content="Property Flipping Calculator, Return on Investment (ROI), Renovation Costs"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Property Flipping Calculator',
              description:
                'Calculate acquisition price, holding costs, selling fees, and gross profit to analyse real estate investment flips.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Property Flipping Calculator
          </Heading>
          <p className="text-lg md:text-xl text-amber-100">
            Calculate property flipping profit, estimate ROI, and refine your renovation budget for
            an investment strategy aligned with property market analysis.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-amber-500" />
                Flip Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="purchasePrice" className="text-sm font-medium">
                  Purchase price (GBP)
                </Label>
                <Input
                  id="purchasePrice"
                  inputMode="decimal"
                  value={inputs.purchasePrice}
                  onChange={(event) => handleChange('purchasePrice', event.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stampDuty" className="text-sm font-medium">
                    Stamp duty (GBP)
                  </Label>
                  <Input
                    id="stampDuty"
                    inputMode="decimal"
                    value={inputs.stampDuty}
                    onChange={(event) => handleChange('stampDuty', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="legalFees" className="text-sm font-medium">
                    Legal &amp; conveyancing (GBP)
                  </Label>
                  <Input
                    id="legalFees"
                    inputMode="decimal"
                    value={inputs.legalFees}
                    onChange={(event) => handleChange('legalFees', event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Renovation items</Label>
                <div className="space-y-3">
                  {renovationItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Input
                        value={item.label}
                        onChange={(event) =>
                          setRenovationItems((prev) =>
                            prev.map((ren) =>
                              ren.id === item.id ? { ...ren, label: event.target.value } : ren,
                            ),
                          )
                        }
                        className="flex-1"
                      />
                      <Input
                        value={item.amount}
                        inputMode="decimal"
                        onChange={(event) => updateRenovationItem(item.id, event.target.value)}
                        className="w-32"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeRenovationItem(item.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addRenovationItem}>
                    Add renovation item
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="holdingCostsPerMonth" className="text-sm font-medium">
                    Holding costs per month (GBP)
                  </Label>
                  <Input
                    id="holdingCostsPerMonth"
                    inputMode="decimal"
                    value={inputs.holdingCostsPerMonth}
                    onChange={(event) =>
                      handleChange('holdingCostsPerMonth', event.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="holdingMonths" className="text-sm font-medium">
                    Holding duration (months)
                  </Label>
                  <Input
                    id="holdingMonths"
                    inputMode="decimal"
                    value={inputs.holdingMonths}
                    onChange={(event) => handleChange('holdingMonths', event.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sellingFeesPercent" className="text-sm font-medium">
                    Selling fees (% of sale price)
                  </Label>
                  <Input
                    id="sellingFeesPercent"
                    inputMode="decimal"
                    value={inputs.sellingFeesPercent}
                    onChange={(event) => handleChange('sellingFeesPercent', event.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="contingencyPercent" className="text-sm font-medium">
                    Contingency (% of reno budget)
                  </Label>
                  <Input
                    id="contingencyPercent"
                    inputMode="decimal"
                    value={inputs.contingencyPercent}
                    onChange={(event) => handleChange('contingencyPercent', event.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="desiredSalePrice" className="text-sm font-medium">
                  Target sale price (GBP)
                </Label>
                <Input
                  id="desiredSalePrice"
                  inputMode="decimal"
                  value={inputs.desiredSalePrice}
                  onChange={(event) => handleChange('desiredSalePrice', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-amber-200 dark:border-amber-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Home className="h-5 w-5 text-amber-500" />
                  Flip Profit Summary
