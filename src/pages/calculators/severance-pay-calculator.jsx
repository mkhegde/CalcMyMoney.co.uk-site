// src/pages/calculators/severance-pay-calculator.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Briefcase, Shield, HandCoins } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/severance-pay-calculator';

const schemaKeywords = [
  'Severance Entitlement',
  'Contractual Pay',
  'Negotiation',
  'Gardening Leave',
  'Final Pay',
];

const faqItems = [
  {
    question: 'What is usually included in a severance package?',
    answer:
      'Severance packages may include salary continuation, payment in lieu of notice, accrued holiday pay, bonuses, and compensation for loss of employment. Terms depend on the contract and negotiations.',
  },
  {
    question: 'How do I negotiate the best severance package?',
    answer:
      'Document your contributions, understand contractual obligations, and consider seeking legal advice. Negotiations can cover gardening leave, confidentiality clauses, and non-compete terms.',
  },
  {
    question: 'Is severance pay taxed in the UK?',
    answer:
      'Contractual and non-statutory severance payments above £30,000 are taxable. Payments up to the £30,000 threshold can be tax-free, but holiday pay and salary are always taxable.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

export default function SeverancePayCalculator() {
  const [inputs, setInputs] = useState({
    baseSalary: '48000',
    monthsOfSeverance: '3',
    bonusAmount: '4000',
    holidayPay: '1500',
    noticePay: '2500',
    otherCompensation: '0',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const results = useMemo(() => {
    const baseSalary = Number(inputs.baseSalary) || 0;
    const monthsOfSeverance = Number(inputs.monthsOfSeverance) || 0;
    const bonusAmount = Number(inputs.bonusAmount) || 0;
    const holidayPay = Number(inputs.holidayPay) || 0;
    const noticePay = Number(inputs.noticePay) || 0;
    const otherCompensation = Number(inputs.otherCompensation) || 0;

    const monthlySalary = baseSalary / 12;
    const severancePay = monthlySalary * monthsOfSeverance;
    const nonStatutoryPay = severancePay + otherCompensation;
    const taxablePortion = Math.max(0, nonStatutoryPay - 30000);

    const totalPackage =
      severancePay + bonusAmount + holidayPay + noticePay + otherCompensation;
    const taxFreeAllowance = 30000;

    return {
      monthlySalary,
      severancePay,
      bonusAmount,
      holidayPay,
      noticePay,
      otherCompensation,
      taxablePortion,
      totalPackage,
      taxFreeAllowance,
    };
  }, [inputs]);

  const reset = useCallback(() => {
    setInputs({
      baseSalary: '48000',
      monthsOfSeverance: '3',
      bonusAmount: '4000',
      holidayPay: '1500',
      noticePay: '2500',
      otherCompensation: '0',
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Severance Pay & Severance Package Calculator</title>
        <meta
          name="description"
          content="Estimate severance pay, analyse severance package terms, and evaluate compensation amounts when negotiating an exit package."
        />
        <meta
          name="keywords"
          content="Severance Calculation, Termination Pay, Compensation Amount"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Severance Pay Calculator',
              description:
                'Assess severance entitlement, contractual pay, negotiation points, gardening leave, and final pay when evaluating severance packages.',
              url: canonicalUrl,
              keywords: schemaKeywords,
              potentialAction: {
                '@type': 'Action',
                name: 'Calculate severance pay',
                target: canonicalUrl,
              },
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Severance Pay Calculator
          </Heading>
          <p className="text-lg md:text-xl text-indigo-100">
            Calculate severance packages, review severance terms, and plan non-statutory pay for a fair
            employment settlement.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-indigo-500" />
                Severance Inputs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="baseSalary" className="text-sm font-medium">
                  Base salary (£ per year)
                </Label>
                <Input
                  id="baseSalary"
                  inputMode="decimal"
                  value={inputs.baseSalary}
                  onChange={(event) => handleChange('baseSalary', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthsOfSeverance" className="text-sm font-medium">
                  Months of severance
                </Label>
                <Input
                  id="monthsOfSeverance"
                  inputMode="decimal"
                  value={inputs.monthsOfSeverance}
                  onChange={(event) => handleChange('monthsOfSeverance', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bonusAmount" className="text-sm font-medium">
                  Bonus / performance payment (£)
                </Label>
                <Input
                  id="bonusAmount"
                  inputMode="decimal"
                  value={inputs.bonusAmount}
                  onChange={(event) => handleChange('bonusAmount', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="holidayPay" className="text-sm font-medium">
                  Accrued holiday pay (£)
                </Label>
                <Input
                  id="holidayPay"
                  inputMode="decimal"
                  value={inputs.holidayPay}
                  onChange={(event) => handleChange('holidayPay', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="noticePay" className="text-sm font-medium">
                  Payment in lieu of notice (£)
                </Label>
                <Input
                  id="noticePay"
                  inputMode="decimal"
                  value={inputs.noticePay}
                  onChange={(event) => handleChange('noticePay', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="otherCompensation" className="text-sm font-medium">
                  Other compensation (£)
                </Label>
                <Input
                  id="otherCompensation"
                  inputMode="decimal"
                  value={inputs.otherCompensation}
                  onChange={(event) => handleChange('otherCompensation', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <HandCoins className="h-5 w-5 text-indigo-500" />
                  Severance Package Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Monthly salary</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.monthlySalary)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Severance pay</p>
                    <p className="text-lg font-semibold text-indigo-600">
                      {currencyFormatter.format(results.severancePay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Bonus amount</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.bonusAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Holiday pay</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.holidayPay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Notice pay</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.noticePay)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Other compensation</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.otherCompensation)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-indigo-200 dark:border-indigo-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Shield className="h-5 w-5 text-indigo-500" />
                  Tax &amp; Negotiation Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  • Portion of non-statutory pay over £30,000 may be taxable. Track each element of the
                  exit package carefully.
                </p>
                <p>
                  • Consider gardening leave versus immediate payment in lieu of notice when
                  negotiating severance terms.
                </p>
                <p>
                  • Seek professional advice to assess confidentiality clauses, non-competes, and the
                  overall employment settlement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Severance for a Balanced Exit Package
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            This severance tool helps you calculate severance, understand severance terms, and plan
            an employment settlement that aligns with your exit package priorities.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Severance Terms and Non-Statutory Pay
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Non-statutory pay often includes salary continuation, bonuses, or additional compensation
            beyond statutory redundancy. Ensure the calculation captures every element offered.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Employment Settlement and Exit Package
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            A holistic view of the exit package lets you negotiate better severance terms—covering
            final pay, references, and post-employment restrictions for a smoother career transition.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
