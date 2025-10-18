import React, { useMemo, useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Calculator, Receipt, FileWarning, BadgeCheck } from 'lucide-react';

import Heading from '@/components/common/Heading';
import CalculatorWrapper from '@/components/calculators/CalculatorWrapper';
import FAQSection from '@/components/calculators/FAQSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const canonicalUrl = 'https://www.calcmymoney.co.uk/calculators/tax-refund-calculator';

const schemaKeywords = [
  'P800',
  'Tax Overpayment',
  'Expenses Claim',
  'HMRC Refund',
  'PAYE Tax',
];

const faqItems = [
  {
    question: 'When might I receive a tax refund?',
    answer:
      'Refunds are common if you overpaid tax due to an emergency tax code, a late-year pay rise, or expenses that HMRC did not process. HMRC usually issues a P800 calculation when you overpay.',
  },
  {
    question: 'What is a P800?',
    answer:
      'A P800 is a notice from HMRC detailing tax you overpaid or underpaid through PAYE. If it shows a refund, HMRC usually pays it automatically or lets you claim online.',
  },
  {
    question: 'Can I claim expenses for a refund?',
    answer:
      'Yes. Claim allowable expenses such as professional fees or mileage. If granted, HMRC adjusts your tax code or issues a refund for the relevant tax year.',
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

function annualTax(income, personalAllowance) {
  let allowance = personalAllowance;
  if (income > 100000) {
    const reduction = Math.floor((income - 100000) / 2);
    allowance = Math.max(0, allowance - reduction);
  }
  const taxable = Math.max(0, income - allowance);
  let tax = 0;
  const basicBand = Math.min(taxable, BASIC_RATE_LIMIT - allowance);
  tax += basicBand * 0.2;

  const higherBand = Math.min(
    Math.max(0, taxable - basicBand),
    HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT,
  );
  tax += higherBand * 0.4;

  const additionalBand = Math.max(0, taxable - basicBand - higherBand);
  tax += additionalBand * 0.45;

  return { tax, allowanceUsed: allowance };
}

export default function TaxRefundCalculator() {
  const [inputs, setInputs] = useState({
    yearToDatePay: '32000',
    yearToDateTaxPaid: '5200',
    expectedAnnualSalary: '42000',
    monthsWorked: '9',
    personalAllowance: '12570',
    allowableExpenses: '500',
  });

  const handleChange = useCallback((field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setInputs({
      yearToDatePay: '32000',
      yearToDateTaxPaid: '5200',
      expectedAnnualSalary: '42000',
      monthsWorked: '9',
      personalAllowance: '12570',
      allowableExpenses: '500',
    });
  }, []);

  const results = useMemo(() => {
    const yearToDatePay = Number(inputs.yearToDatePay) || 0;
    const yearToDateTaxPaid = Number(inputs.yearToDateTaxPaid) || 0;
    const expectedAnnualSalary = Number(inputs.expectedAnnualSalary) || 0;
    const monthsWorked = Math.min(12, Math.max(1, Number(inputs.monthsWorked) || 0));
    const personalAllowance = Math.max(0, Number(inputs.personalAllowance) || 0);
    const allowableExpenses = Math.max(0, Number(inputs.allowableExpenses) || 0);

    const adjustedAnnualIncome = Math.max(0, expectedAnnualSalary - allowableExpenses);
    const { tax: annualTaxDue } = annualTax(adjustedAnnualIncome, personalAllowance);
    const expectedTaxToDate = (annualTaxDue * monthsWorked) / 12;

    const overpayment = Math.max(0, yearToDateTaxPaid - expectedTaxToDate);
    const underpayment = Math.max(0, expectedTaxToDate - yearToDateTaxPaid);

    const projectedYearEndTax = annualTaxDue;
    const projectedYearEndPay = expectedAnnualSalary;

    const potentialRefundTriggers = [
      yearToDateTaxPaid > expectedTaxToDate ? 'Tax code emergency rate applied earlier in the year.' : null,
      allowableExpenses > 0 ? 'Claiming allowable expenses that reduce taxable income.' : null,
      expectedAnnualSalary < (yearToDatePay * 12) / monthsWorked
        ? 'Late-year pay rise led to tax calculated on higher monthly pay than annual salary.'
        : null,
    ].filter(Boolean);

    return {
      yearToDatePay,
      yearToDateTaxPaid,
      expectedAnnualSalary,
      monthsWorked,
      personalAllowance,
      allowableExpenses,
      annualTaxDue,
      expectedTaxToDate,
      overpayment,
      underpayment,
      projectedYearEndTax,
      projectedYearEndPay,
      potentialRefundTriggers,
    };
  }, [inputs]);

  return (
    <div className="bg-white dark:bg-gray-950">
      <Helmet>
        <title>Tax Refund &amp; Tax Rebate Calculator</title>
        <meta
          name="description"
          content="Tax Refund Calculator estimating how much tax you overpaid during the tax year. Model P800 outcomes, expenses claims, and HMRC refunds."
        />
        <meta
          name="keywords"
          content="Tax Refund Calculator, Overpaid Tax, Tax Year"
        />
        <link rel="canonical" href={canonicalUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FinancialProduct',
              name: 'Tax Refund Calculator',
              description:
                'Estimate PAYE tax overpayment using P800 style comparisons, tax overpayment scenarios, expenses claims, and HMRC refund guidance.',
              url: canonicalUrl,
              keywords: schemaKeywords,
            }),
          }}
        />
      </Helmet>

      <section className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Heading as="h1" size="h1" weight="bold" className="text-white">
            Tax Refund Calculator
          </Heading>
          <p className="text-lg md:text-xl text-blue-100">
            Calculate tax refund scenarios, assess rebate eligibility, and understand tax code errors
            to claim tax back through the HMRC process.
          </p>
        </div>
      </section>

      <CalculatorWrapper className="bg-white dark:bg-gray-950">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Calculator className="h-5 w-5 text-blue-500" />
                PAYE Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="yearToDatePay" className="text-sm font-medium">
                  Pay received this tax year (GBP)
                </Label>
                <Input
                  id="yearToDatePay"
                  inputMode="decimal"
                  value={inputs.yearToDatePay}
                  onChange={(event) => handleChange('yearToDatePay', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="yearToDateTaxPaid" className="text-sm font-medium">
                  Tax paid this tax year (GBP)
                </Label>
                <Input
                  id="yearToDateTaxPaid"
                  inputMode="decimal"
                  value={inputs.yearToDateTaxPaid}
                  onChange={(event) => handleChange('yearToDateTaxPaid', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="expectedAnnualSalary" className="text-sm font-medium">
                  Expected annual salary (GBP)
                </Label>
                <Input
                  id="expectedAnnualSalary"
                  inputMode="decimal"
                  value={inputs.expectedAnnualSalary}
                  onChange={(event) => handleChange('expectedAnnualSalary', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="monthsWorked" className="text-sm font-medium">
                  Months worked so far
                </Label>
                <Input
                  id="monthsWorked"
                  inputMode="numeric"
                  value={inputs.monthsWorked}
                  onChange={(event) => handleChange('monthsWorked', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="personalAllowance" className="text-sm font-medium">
                  Personal allowance (GBP)
                </Label>
                <Input
                  id="personalAllowance"
                  inputMode="decimal"
                  value={inputs.personalAllowance}
                  onChange={(event) => handleChange('personalAllowance', event.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="allowableExpenses" className="text-sm font-medium">
                  Allowable expenses to claim (GBP)
                </Label>
                <Input
                  id="allowableExpenses"
                  inputMode="decimal"
                  value={inputs.allowableExpenses}
                  onChange={(event) => handleChange('allowableExpenses', event.target.value)}
                />
              </div>
              <Button type="button" variant="outline" onClick={reset}>
                Reset inputs
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Receipt className="h-5 w-5 text-blue-500" />
                  Refund Result
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Expected tax to date</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.expectedTaxToDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Tax paid to date</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.yearToDateTaxPaid)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Estimated refund</p>
                    <p
                      className={`text-lg font-semibold ${
                        results.overpayment > 0 ? 'text-blue-600' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {currencyFormatter.format(results.overpayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Possible underpayment</p>
                    <p
                      className={`text-lg font-semibold ${
                        results.underpayment > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {currencyFormatter.format(results.underpayment)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projected year-end tax</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.projectedYearEndTax)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Projected year-end income</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {currencyFormatter.format(results.projectedYearEndPay)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-blue-200 dark:border-blue-900 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <FileWarning className="h-5 w-5 text-blue-500" />
                  Refund Triggers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {results.potentialRefundTriggers.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-1">
                    {results.potentialRefundTriggers.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>
                    No obvious overpayment signals detected. Double-check tax code notices or contact
                    HMRC if you believe an error exists.
                  </p>
                )}
                <p>
                  Keep your payslips and P60/P45 records. HMRC may request evidence when processing a
                  PAYE tax refund or adjusting your tax code.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        <section className="mt-12 space-y-6">
          <Heading as="h2" size="h2" className="text-slate-900 dark:text-slate-100">
            Calculate Tax Refund Eligibility with Confidence
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Use this tool to assess rebate eligibility after a tax code error or late-year pay rise.
            Understanding your position prepares you for the HMRC process.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Spot Tax Code Error Quickly
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            Compare expected tax against PAYE deductions to see if an emergency tax code caused an
            overpayment. Correcting the code prevents future P800 adjustments.
          </p>

          <Heading as="h3" size="h3" className="text-slate-900 dark:text-slate-100">
            Claim Tax Back Using HMRC Process
          </Heading>
          <p className="text-base text-muted-foreground leading-relaxed">
            If the calculator shows a refund, claim tax back through your Personal Tax Account or wait
            for HMRC to issue instructions. Provide expenses claims to maximise your tax rebate.
          </p>
        </section>

        <section className="mt-12">
          <FAQSection faqs={faqItems} />
        </section>
      </CalculatorWrapper>
    </div>
  );
}
