import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Crown, Landmark, Banknote } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/inheritance-tax-calculator';

const schemaKeywords = [
  'Tax Threshold',
  'Residence Nil-Rate Band',
  'Estate Value',
  'Taxable Amount',
  'IHT Rules UK',
];

const faqItems = [
  {
    question: 'What is the nil-rate band?',
    answer:
      'The nil-rate band (currently £325,000) is the portion of an estate exempt from Inheritance Tax. Anything above this threshold may be taxed at 40%, subject to reliefs and exemptions.',
  },
  {
    question: 'How does the residence nil-rate band work?',
    answer:
      'If you leave a qualifying residence to direct descendants, you may claim an additional allowance (£175,000 for 2025/26), tapering for estates over £2 million.',
  },
  {
    question: 'Can unused allowances be transferred?',
    answer:
      'Yes. Married couples and civil partners can transfer unused nil-rate band and residence nil-rate band to the surviving spouse, effectively doubling the allowances available.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function InheritanceTaxCalculator() {
  const [inputs, setInputs] = useState({
    estateValue: '850000',
    debts: '15000',
    charitableGifts: '20000',
    nilRateBandUsed: '325000',
    residenceNilRateBandUsed: '175000',
    taperThreshold: '2000000',
    spouseTransfer: '100%',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      estateValue: '850000',
      debts: '15000',
      charitableGifts: '20000',
      nilRateBandUsed: '325000',
      residenceNilRateBandUsed: '175000',
      taperThreshold: '2000000',
      spouseTransfer: '100%',
    });
  }, []);

  const results = useMemo(() => {
    const estateValue = Number(inputs.estateValue) || 0;
    const debts = Number(inputs.debts) || 0;
    const charitableGifts = Number(inputs.charitableGifts) || 0;
    const nrB = Number(inputs.nilRateBandUsed) || 0;
    const rnrB = Number(inputs.residenceNilRateBandUsed) || 0;
    const taperThreshold = Number(inputs.taperThreshold) || 0;
    const spouseTransferRate = Number(String(inputs.spouseTransfer).replace('%', '')) / 100 || 0;

    const transferableNRB = nrB * spouseTransferRate;
    const transferableRNRB = rnrB * spouseTransferRate;

    const netEstate = Math.max(0, estateValue - debts - charitableGifts);

    let residenceBandAvailable = transferableRNRB;
    if (netEstate > taperThreshold) {
      const excess = netEstate - taperThreshold;
      const taperReduction = Math.min(residenceBandAvailable, Math.floor(excess / 2));
      residenceBandAvailable = Math.max(0, residenceBandAvailable - taperReduction);
    }

    const taxableEstate = Math.max(
      0,
      netEstate - transferableNRB - residenceBandAvailable,
    );
    const ihtRate = taxableEstate > 0 ? 0.4 : 0;
    const ihtLiability = taxableEstate * ihtRate;
    const effectiveRate = netEstate > 0 ? (ihtLiability / netEstate) * 100 : 0;

    return {
      estateValue,
      netEstate,
      transferableNRB,
      residenceBandAvailable,
      taxableEstate,
      ihtLiability,
      effectiveRate,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Inheritance Tax Calculator &amp; IHT Liability Planner</title>
        <meta
          name="description"
          content="Inheritance Tax Calculator for UK estates. Estimate IHT liability using the nil-rate band, residence allowances, and estate planning strategies."
        />
        <meta
          name="keywords"
          content="Inheritance Tax Calculator, Nil-Rate Band, Estate Planning"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Inheritance Tax Calculator',
              description:
                'Estimate UK inheritance tax liability by modelling estate value, tax threshold, residence nil-rate band, and exemptions under current IHT rules.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Inheritance Tax Calculator
          </Heading>
          <p className="text-lg md:text-xl text-purple-100">
            Calculate IHT, review inheritance tax rate assumptions, and explore exemptions to model
            your estate tax bill and asset distribution strategy.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-purple-500" />
                Estate Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="estateValue" className="text-sm font-medium">
                  Total estate value (GBP)
                </Label>
                <Input
                  id="estateValue"
                  inputMode="decimal"
                  value={inputs.estateValue}
                  onChange={(event) => handleChange('estateValue', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="debts" className="text-sm font-medium">
                  Debts &amp; liabilities (GBP)
                </Label>
                <Input
                  id="debts"
                  inputMode="decimal"
                  value={inputs.debts}
                  onChange={(event) => handleChange('debts', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="charitableGifts" className="text-sm font-medium">
                  Charitable gifts (GBP)
                </Label>
                <Input
                  id="charitableGifts"
                  inputMode="decimal"
                  value={inputs.charitableGifts}
                  onChange={(event) => handleChange('charitableGifts', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nilRateBandUsed" className="text-sm font-medium">
                  Nil-rate band available (GBP)
                </Label>
                <Input
                  id="nilRateBandUsed"
                  inputMode="decimal"
                  value={inputs.nilRateBandUsed}
                  onChange={(event) => handleChange('nilRateBandUsed', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="residenceNilRateBandUsed" className="text-sm font-medium">
                  Residence nil-rate band available (GBP)
                </Label>
                <Input
                  id="residenceNilRateBandUsed"
                  inputMode="decimal"
                  value={inputs.residenceNilRateBandUsed}
                  onChange={(event) =>
                    handleChange('residenceNilRateBandUsed', event.target.value)
                  }
                />
              </div>
              <div>
                <Label htmlFor="taperThreshold" className="text-sm font-medium">
                  Taper threshold (GBP)
                </Label>
                <Input
                  id="taperThreshold"
                  inputMode="decimal"
                  value={inputs.taperThreshold}
                  onChange={(event) => handleChange('taperThreshold', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="spouseTransfer" className="text-sm font-medium">
                  Spouse allowance transfer (%)
                </Label>
                <Input
                  id="spouseTransfer"
                  inputMode="decimal"
                  value={inputs.spouseTransfer}
                  onChange={(event) => handleChange('spouseTransfer', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Crown className="h-5 w-5 text-purple-500" />
                  Inheritance Tax Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Net estate</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {currencyFormatter.format(results.netEstate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Transferrable nil-rate band</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.transferableNRB)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Residence nil-rate band</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.residenceBandAvailable)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Taxable estate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.taxableEstate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated IHT liability (40%)</p>
                    <p className="text-lg font-semibold text-purple-600">
                      {currencyFormatter.format(results.ihtLiability)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Effective tax rate</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {results.effectiveRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-purple-200 dark:border-purple-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Landmark className="h-5 w-5 text-purple-500" />
                  Estate Planning Notes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Consider lifetime gifts to reduce the taxable estate. Gifts made more than seven
                  years before death may be free of Inheritance Tax, subject to taper relief.
                </p>
                <p>
                  Review wills and trust arrangements regularly to ensure asset distribution matches
                  family needs and minimises tax.
                </p>
                <p>
                  Keep estate valuations up to date and document liabilities, exemptions, and reliefs
                  to simplify executor duties.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate IHT for Confident Asset Distribution
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Understand Inheritance Tax rate exposure by assessing estate value, exemptions, and
            nil-rate bands. Use the figures to inform estate planning decisions and conversations with
            professional advisers.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Inheritance Tax Rate and Exemptions
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Charitable donations can reduce the headline rate to 36% if at least 10% of the net
            estate is given to charity. Factor in reliefs carefully when estimating the tax bill.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Keep Asset Distribution Transparent
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Document asset distribution plans, including transfer of residence to direct
            descendants, to maximise nil-rate band usage and reduce uncertainty for beneficiaries.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
