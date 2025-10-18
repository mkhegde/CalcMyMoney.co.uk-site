import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, FileSignature, ClipboardList, Coins } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/self-assessment-calculator';

const schemaKeywords = [
  'Trading Income',
  'Allowable Expenses',
  'Class 2 NI',
  'Tax Liability',
  'HMRC Tax Return',
];

const faqItems = [
  {
    question: 'Who needs to file a Self Assessment tax return?',
    answer:
      'Self-employed sole traders earning over £1,000, partners in business partnerships, and individuals with untaxed income typically must file. HMRC will confirm your specific obligations.',
  },
  {
    question: 'Which expenses can I deduct?',
    answer:
      'Allowable expenses include costs wholly, exclusively, and necessarily for business—such as office supplies, travel, and certain utilities. Keep receipts for HMRC review.',
  },
  {
    question: 'How are Class 2 and Class 4 NI calculated?',
    answer:
      'Self-employed individuals pay Class 2 NI if profits exceed the Small Profits Threshold and Class 4 NI on profits above the Lower Profits Limit. Rates vary by band.',
  },
];

const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
});

const PERSONAL_ALLOWANCE = 12570;
const BASIC_RATE_LIMIT = 50270;
const HIGHER_RATE_LIMIT = 125140;

const CLASS2_WEEKLY = 3.45; // illustrative 2025/26 value
const CLASS2_THRESHOLD = 12570;

const CLASS4_LOWER_LIMIT = 12570;
const CLASS4_UPPER_LIMIT = 50270;
const CLASS4_MAIN_RATE = 0.09;
const CLASS4_UPPER_RATE = 0.02;

function computeIncomeTax(profits) {
  let personalAllowance = PERSONAL_ALLOWANCE;
  if (profits > 100000) {
    const reduction = Math.floor((profits - 100000) / 2);
    personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - reduction);
  }

  const taxable = Math.max(0, profits - personalAllowance);
  let tax = 0;

  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - personalAllowance);
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT,
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, personalAllowance };
}

function computeClass2NI(profits) {
  if (profits <= CLASS2_THRESHOLD) return 0;
  return CLASS2_WEEKLY * 52;
}

function computeClass4NI(profits) {
  const band1 = Math.max(0, Math.min(profits, CLASS4_UPPER_LIMIT) - CLASS4_LOWER_LIMIT);
  const band2 = Math.max(0, profits - CLASS4_UPPER_LIMIT);
  return band1 * CLASS4_MAIN_RATE + band2 * CLASS4_UPPER_RATE;
}

export default function SelfAssessmentCalculator() {
  const [inputs, setInputs] = useState({
    tradingIncome: '42000',
    allowableExpenses: '8000',
    otherIncome: '0',
    paymentsOnAccount: '1500',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      tradingIncome: '42000',
      allowableExpenses: '8000',
      otherIncome: '0',
      paymentsOnAccount: '1500',
    });
  }, []);

  const results = useMemo(() => {
    const tradingIncome = Number(inputs.tradingIncome) || 0;
    const expenses = Math.min(tradingIncome, Number(inputs.allowableExpenses) || 0);
    const otherIncome = Number(inputs.otherIncome) || 0;
    const paymentsOnAccount = Number(inputs.paymentsOnAccount) || 0;

    const profits = Math.max(0, tradingIncome - expenses);
    const totalIncome = profits + otherIncome;

    const { tax, personalAllowance } = computeIncomeTax(totalIncome);
    const class2 = computeClass2NI(profits);
    const class4 = computeClass4NI(profits);
    const totalLiability = tax + class2 + class4;
    const remainingBill = Math.max(0, totalLiability - paymentsOnAccount);

    return {
      tradingIncome,
      expenses,
      profits,
      otherIncome,
      totalIncome,
      personalAllowance,
      tax,
      class2,
      class4,
      totalLiability,
      paymentsOnAccount,
      remainingBill,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Self Assessment &amp; Tax Return Estimate Calculator</title>
        <meta
          name="description"
          content="Self Assessment Calculator estimating UK tax return liability, income tax due, and deadlines for HMRC submissions."
        />
        <meta
          name="keywords"
          content="Self Assessment Calculator, Income Tax Due, Deadline"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Self Assessment Calculator',
              description:
                'Calculate trading income, allowable expenses, Class 2 NI, and overall tax liability for HMRC tax return planning.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-rose-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Self Assessment Calculator
          </Heading>
          <p className="text-lg md:text-xl text-rose-100">
            Calculate self assessment liabilities, estimate your tax bill, and prepare for HMRC
            submissions covering sole trader tax and freelance tax considerations.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-rose-500" />
                Income &amp; Expenses
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="tradingIncome" className="text-sm font-medium">
                  Trading income (GBP)
                </Label>
                <Input
                  id="tradingIncome"
                  inputMode="decimal"
                  value={inputs.tradingIncome}
                  onChange={(event) => handleChange('tradingIncome', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="allowableExpenses" className="text-sm font-medium">
                  Allowable expenses (GBP)
                </Label>
                <Input
                  id="allowableExpenses"
                  inputMode="decimal"
                  value={inputs.allowableExpenses}
                  onChange={(event) => handleChange('allowableExpenses', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="otherIncome" className="text-sm font-medium">
                  Other taxable income (GBP)
                </Label>
                <Input
                  id="otherIncome"
                  inputMode="decimal"
                  value={inputs.otherIncome}
                  onChange={(event) => handleChange('otherIncome', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="paymentsOnAccount" className="text-sm font-medium">
                  Payments on account (GBP)
                </Label>
                <Input
                  id="paymentsOnAccount"
                  inputMode="decimal"
                  value={inputs.paymentsOnAccount}
                  onChange={(event) => handleChange('paymentsOnAccount', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileSignature className="h-5 w-5 text-rose-500" />
                  Tax Return Estimate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Profits (after expenses)</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.profits)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total taxable income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.totalIncome)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Income tax</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.tax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Class 2 NI</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.class2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Class 4 NI</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.class4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total liability</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.totalLiability)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payments on account</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.paymentsOnAccount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Remaining bill</p>
                    <p className="text-lg font-semibold text-rose-600">
                      {currencyFormatter.format(results.remainingBill)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-rose-200 dark:border-rose-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Coins className="h-5 w-5 text-rose-500" />
                  Self Assessment Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  Set aside funds for the tax bill throughout the year. A dedicated savings account
                  prevents cash-flow shocks at HMRC deadlines.
                </p>
                <p>
                  Keep detailed records of sole trader tax receipts, mileage logs, and invoices.
                  Accurate records ease HMRC submissions and reduce errors.
                </p>
                <p>
                  Consider payments on account for the next tax year. Understanding how HMRC calculates
                  instalments helps with freelance tax budgeting.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Self Assessment to Estimate Your Tax Bill
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Combine trading income, allowable expenses, and National Insurance to forecast HMRC
            submissions. Planning ahead makes tax return season less stressful.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Manage Tax Bill for Sole Trader Tax Confidence
          </Heading>
        ...
