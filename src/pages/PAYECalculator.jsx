import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PoundSterling, Calculator, Copy } from 'lucide-react';

import SeoHead from '@/components/seo/SeoHead';
import { JsonLd } from '@/components/seo/JsonLd';
import buildFaqJsonLd from '@/components/seo/buildFaqJsonLd';
import buildBreadcrumbs from '@/components/seo/buildBreadcrumbs';

import { createPageUrl } from '@/utils/createPageUrl';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators';

/* ==========================
   DATA (2025/26)
   ========================== */

const taxBrackets2025 = {
  england: [
    { min: 0, max: 12570, rate: 0, name: 'Personal Allowance' },
    { min: 12571, max: 50270, rate: 0.2, name: 'Basic Rate' },
    { min: 50271, max: 125140, rate: 0.4, name: 'Higher Rate' },
    { min: 125141, max: Infinity, rate: 0.45, name: 'Additional Rate' },
  ],
  scotland: [
    { min: 0, max: 12570, rate: 0, name: 'Personal Allowance' },
    { min: 12571, max: 14876, rate: 0.19, name: 'Starter Rate' },
    { min: 14877, max: 26561, rate: 0.2, name: 'Basic Rate' },
    { min: 26562, max: 43662, rate: 0.21, name: 'Intermediate Rate' },
    { min: 43663, max: 75000, rate: 0.42, name: 'Higher Rate' },
    { min: 75001, max: 125140, rate: 0.45, name: 'Advanced Rate' },
    { min: 125141, max: Infinity, rate: 0.48, name: 'Top Rate' },
  ],
};

const niThresholds = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12571, max: 50270, rate: 0.08 },
  { min: 50271, max: Infinity, rate: 0.02 },
];

const payeCalculatorFAQs = [
  {
    question: 'What is PAYE and how does it affect my payslip?',
    answer:
      "PAYE (Pay As You Earn) is the system where your employer deducts income tax and National Insurance from your pay before you receive it. You'll see the deductions clearly on your payslip each period.",
  },
  {
    question: 'How do my tax code and Personal Allowance work?',
    answer:
      'Your tax code (e.g., 1257L) determines your annual Personal Allowance (1257L → £12,570). Above £100,000 of income, this allowance is tapered until it reaches £0.',
  },
  {
    question: 'Why are Scottish income tax results different?',
    answer:
      'Scotland sets different income tax bands and rates. National Insurance remains the same across the UK, which is why NI figures match while tax figures can differ.',
  },
  {
    question: 'What is the difference between effective and marginal tax rates?',
    answer:
      'The effective rate is total tax+NI divided by your gross income. The marginal rate is what your next £1 is taxed at, combining the current income tax band and NI band.',
  },
  {
    question: 'Does this include student loans, pensions or benefits-in-kind?',
    answer:
      'This page focuses on income tax and employee NI. For full picture use our Student Loan Repayment and Pension Contribution calculators, and check with HR for any benefits-in-kind.',
  },
];

/* ==========================
   HELPERS
   ========================== */

function formatGBP(n, opts = {}) {
  const o = { minimumFractionDigits: 2, maximumFractionDigits: 2, ...opts };
  return n.toLocaleString('en-GB', o);
}

function calculateResults({ annualSalary, location, taxCode, payFrequency }) {
  // Personal allowance from tax code
  let personalAllowance = 12570;
  if (/^\d+L$/.test(taxCode)) personalAllowance = parseInt(taxCode.slice(0, -1), 10) * 10;

  // High earner taper
  if (annualSalary > 100000) {
    personalAllowance = Math.max(0, personalAllowance - (annualSalary - 100000) / 2);
  }

  // Income tax
  const brackets = taxBrackets2025[location] || taxBrackets2025.england;
  const taxableIncome = Math.max(0, annualSalary - personalAllowance);
  let annualTax = 0;
  const taxBreakdown = [];

  for (const b of brackets) {
    if (b.rate === 0) continue;
    const minAdj = Math.max(0, b.min - personalAllowance);
    const maxAdj = Math.max(0, b.max - personalAllowance);
    if (taxableIncome > minAdj) {
      const inBand = Math.min(taxableIncome, maxAdj) - minAdj;
      if (inBand > 0) {
        const tax = inBand * b.rate;
        annualTax += tax;
        taxBreakdown.push({
          name: b.name,
          rate: b.rate * 100,
          taxableAmount: inBand,
          amount: tax,
        });
      }
    }
  }

  // Employee NI (Class 1)
  let annualNI = 0;
  const niBreakdown = [];
  for (const t of niThresholds) {
    if (annualSalary > t.min) {
      const niable = Math.min(annualSalary, t.max) - t.min;
      if (niable > 0) {
        const amt = niable * t.rate;
        annualNI += amt;
        if (amt > 0) {
          niBreakdown.push({
            rate: t.rate * 100,
            niableAmount: niable,
            amount: amt,
          });
        }
      }
    }
  }

  const totalDeductions = annualTax + annualNI;
  const netSalary = annualSalary - totalDeductions;

  const periods = payFrequency === 'weekly' ? 52 : payFrequency === 'fortnightly' ? 26 : 12;

  return {
    personalAllowance,
    taxBreakdown,
    niBreakdown,
    taxAmount: annualTax,
    niAmount: annualNI,
    totalDeductions,
    netSalary,
    grossPerPeriod: annualSalary / periods,
    taxPerPeriod: annualTax / periods,
    niPerPeriod: annualNI / periods,
    netPerPeriod: netSalary / periods,
  };
}

function getMarginalRate({ annualSalary, location, personalAllowance }) {
  const brackets = taxBrackets2025[location] || taxBrackets2025.england;
  const taxable = Math.max(0, annualSalary - personalAllowance);
  let taxMarginal = 0;

  for (const b of brackets) {
    const minAdj = Math.max(0, b.min - personalAllowance);
    const maxAdj = Math.max(0, b.max - personalAllowance);
    if (taxable >= minAdj && taxable <= maxAdj) {
      taxMarginal = b.rate;
      break;
    }
  }

  let niMarginal = 0;
  if (annualSalary >= 12571 && annualSalary <= 50270) niMarginal = 0.08;
  else if (annualSalary > 50270) niMarginal = 0.02;

  return { taxMarginal, niMarginal, combined: taxMarginal + niMarginal };
}

/* ==========================
   COMPONENT
   ========================== */

export default function PAYECalculator() {
  const [grossSalary, setGrossSalary] = useState('');
  const [payFrequency, setPayFrequency] = useState('monthly');
  const [location, setLocation] = useState('england');
  const [taxCode, setTaxCode] = useState('1257L');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  // ---------- SEO ----------
  const title = 'PAYE Tax & NI Calculator (2025/26) | CalcMyMoney';
  const desc =
    'Work out PAYE income tax, National Insurance and take-home pay for the 2025/26 UK tax year. Supports England, Wales, Northern Ireland and Scotland.';

  const origin =
    typeof window !== 'undefined' ? window.location.origin : 'https://www.calcmymoney.co.uk';
  const canonical = `${origin}/paye-calculator`;

  const faqJsonLd = buildFaqJsonLd(payeCalculatorFAQs);
  const breadcrumbs = buildBreadcrumbs([
    { name: 'Home', url: `${origin}/` },
    { name: 'Tax Calculators', url: `${origin}/tax-calculators-uk` },
    { name: 'PAYE Calculator', url: canonical },
  ]);

  const calculatePAYE = () => {
    const annualSalary = Number(grossSalary) || 0;
    if (annualSalary <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const r = calculateResults({ annualSalary, location, taxCode, payFrequency });
    setResults(r);
    setHasCalculated(true);

    setCsvData([
      ['Item', 'Annual', `Per ${payFrequency.charAt(0).toUpperCase() + payFrequency.slice(1)}`],
      ['Gross Salary', `£${formatGBP(annualSalary)}`, `£${formatGBP(r.grossPerPeriod)}`],
      ['Income Tax', `-£${formatGBP(r.taxAmount)}`, `-£${formatGBP(r.taxPerPeriod)}`],
      ['National Insurance', `-£${formatGBP(r.niAmount)}`, `-£${formatGBP(r.niPerPeriod)}`],
      ['Net Take-Home', `£${formatGBP(r.netSalary)}`, `£${formatGBP(r.netPerPeriod)}`],
    ]);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [grossSalary, payFrequency, location, taxCode]);

  return (
    <div className="bg-white dark:bg-gray-900">
      {/* SEO head + structured data */}
      <SeoHead
        title={title}
        desc={desc}
        canonical={canonical}
        ogImage="https://www.calcmymoney.co.uk/og-image.png"
      />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbs} />

      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              PAYE Tax &amp; National Insurance Calculator (2025/26)
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your take-home pay after income tax and National Insurance using the latest
              UK rates for England, Wales, Northern Ireland and Scotland.
            </p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">PAYE Calculation 2025/26</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          {/* Left: inputs */}
          <div className="lg:col-span-2 non-printable">
            {/* Common scenarios */}
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-500">Try a quick scenario:</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'New graduate (£28k)', salary: 28000, loc: 'england' },
                  { label: 'NHS nurse (£35k)', salary: 35000, loc: 'england' },
                  { label: 'Scotland (£45k)', salary: 45000, loc: 'scotland' },
                  { label: 'London tech (£75k)', salary: 75000, loc: 'england' },
                  { label: 'High earner (£120k)', salary: 120000, loc: 'england' },
                ].map((s) => (
                  <Button
                    key={s.label}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setGrossSalary(String(s.salary));
                      setLocation(s.loc);
                      setPayFrequency('monthly');
                      setHasCalculated(false);
                      setResults(null);
                    }}
                  >
                    {s.label}
                  </Button>
                ))}
              </div>
            </div>

            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Annual Gross Salary</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="grossSalary"
                      type="number"
                      inputMode="decimal"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 45000"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="england">England, Wales &amp; NI</SelectItem>
                      <SelectItem value="scotland">Scotland</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="taxCode">Tax Code</Label>
                  <Input
                    id="taxCode"
                    value={taxCode}
                    onChange={(e) => setTaxCode(e.target.value)}
                    placeholder="e.g. 1257L"
                  />
                  <p className="text-xs text-gray-500">Found on your payslip or P60</p>
                </div>

                <div className="space-y-2">
                  <Label>Pay Frequency</Label>
                  <Select value={payFrequency} onValueChange={setPayFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="fortnightly">Fortnightly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={calculatePAYE} className="w-full text-lg" aria-label="Calculate PAYE">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate PAYE
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: results */}
          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex flex-wrap gap-3 items-center justify-between non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your PAYE Breakdown</h2>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        const annualSalary = Number(grossSalary) || 0;
                        const eff =
                          annualSalary > 0
                            ? ((results.totalDeductions / annualSalary) * 100).toFixed(1)
                            : '0.0';
                        const summary =
                          `PAYE summary (${payFrequency}):\n` +
                          `Gross: £${formatGBP(annualSalary)}\n` +
                          `Income Tax: £${formatGBP(results.taxAmount)}\n` +
                          `NI: £${formatGBP(results.niAmount)}\n` +
                          `Net: £${formatGBP(results.netSalary)}\n` +
                          `Effective rate: ${eff}%`;
                        try {
                          navigator.clipboard?.writeText(summary);
                        } catch {}
                      }}
                      aria-label="Copy summary"
                      title="Copy summary to clipboard"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy summary
                    </Button>
                    <ExportActions
                      csvData={csvData}
                      fileName="paye-calculation"
                      title="PAYE Calculation"
                    />
                  </div>
                </div>

                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-800 mb-2">
                      Take-Home Pay ({payFrequency})
                    </h3>
                    <div className="text-4xl font-bold text-green-900">
                      £
                      {results.netPerPeriod.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-sm text-green-700">
                      Annual: £{results.netSalary.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>

                {/* Insights */}
                <Card>
                  <CardContent className="p-6">
                    {(() => {
                      const annualSalary = Number(grossSalary) || 0;
                      const eff = annualSalary > 0 ? results.totalDeductions / annualSalary : 0;
                      const { taxMarginal, niMarginal, combined } = getMarginalRate({
                        annualSalary,
                        location,
                        personalAllowance: results.personalAllowance,
                      });
                      return (
                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Effective tax + NI rate</p>
                            <p className="text-2xl font-bold text-gray-900">{(eff * 100).toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">Total deductions / gross</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Marginal tax rate</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {(taxMarginal * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-500">On your next £1 (income tax)</p>
                          </div>
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-xs text-gray-500">Combined marginal</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {(combined * 100).toFixed(0)}%
                            </p>
                            <p className="text-xs text-gray-500">Income tax + NI on next £1</p>
                          </div>
                        </div>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Threshold callouts */}
                {Number(grossSalary) > 100000 && (
                  <Card className="border-amber-300 bg-amber-50">
                    <CardContent className="p-4 text-sm text-amber-900">
                      Over £100,000 your Personal Allowance is tapered. For every £2 above £100k, you
                      lose £1 of allowance until it reaches £0. That’s why your effective rate rises
                      sharply here.
                    </CardContent>
                  </Card>
                )}
                {Number(grossSalary) <= 12570 && hasCalculated && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="p-4 text-sm text-blue-900">
                      You’re within the Personal Allowance. You won’t pay income tax, but NI may still
                      apply above the NI thresholds.
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Income Tax</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-sm text-red-600">Annual Tax</p>
                        <p className="text-xl font-bold text-red-800">
                          £{results.taxAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-red-500">
                          {payFrequency}: £{results.taxPerPeriod.toFixed(2)}
                        </p>
                      </div>
                      {results.taxBreakdown.map((bracket, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm p-2 border-l-2 border-red-300"
                        >
                          <span>
                            {bracket.name} ({bracket.rate}%)
                          </span>
                          <span>£{bracket.amount.toFixed(0)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>National Insurance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-600">Annual NI</p>
                        <p className="text-xl font-bold text-blue-800">
                          £{results.niAmount.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-blue-500">
                          {payFrequency}: £{results.niPerPeriod.toFixed(2)}
                        </p>
                      </div>
                      {results.niBreakdown.map((ni, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm p-2 border-l-2 border-blue-300"
                        >
                          <span>Class 1 NI ({ni.rate}%)</span>
                          <span>£{ni.amount.toFixed(0)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Scotland vs rUK comparison */}
                <Card>
                  <CardHeader>
                    <CardTitle>Compare Scotland vs England/Wales/NI</CardTitle>
                  </CardHeader>
                  <CardContent className="overflow-x-auto">
                    {(() => {
                      const annualSalary = Number(grossSalary) || 0;
                      if (!annualSalary)
                        return <p className="text-sm text-gray-500">Enter a salary to compare.</p>;
                      const rUK = calculateResults({
                        annualSalary,
                        location: 'england',
                        taxCode,
                        payFrequency,
                      });
                      const sco = calculateResults({
                        annualSalary,
                        location: 'scotland',
                        taxCode,
                        payFrequency,
                      });
                      return (
                        <table className="min-w-[520px] text-sm">
                          <thead>
                            <tr className="text-left border-b">
                              <th className="py-2 pr-4">Metric</th>
                              <th className="py-2 pr-4">England/Wales/NI</th>
                              <th className="py-2">Scotland</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Income Tax (annual)</td>
                              <td className="py-2 pr-4">
                                £{formatGBP(rUK.taxAmount, { maximumFractionDigits: 0 })}
                              </td>
                              <td className="py-2">
                                £{formatGBP(sco.taxAmount, { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">National Insurance (annual)</td>
                              <td className="py-2 pr-4">
                                £{formatGBP(rUK.niAmount, { maximumFractionDigits: 0 })}
                              </td>
                              <td className="py-2">
                                £{formatGBP(sco.niAmount, { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                            <tr className="border-b">
                              <td className="py-2 pr-4">Net Take-Home (annual)</td>
                              <td className="py-2 pr-4">
                                £{formatGBP(rUK.netSalary, { maximumFractionDigits: 0 })}
                              </td>
                              <td className="py-2">
                                £{formatGBP(sco.netSalary, { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      );
                    })()}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready for your PAYE calculation?</h3>
                  <p>Enter your salary details to see your exact take-home pay.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={payeCalculatorFAQs} />
          </div>
        </div>

        {/* Methodology & assumptions */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 non-printable">
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>How this calculator works (2025/26)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-6 text-gray-700">
              <ul className="list-disc pl-5 space-y-2">
                <li>Tax year: 6 April 2025 – 5 April 2026. Bands and rates reflect the latest public guidance.</li>
                <li>Personal Allowance defaults to tax code 1257L. Custom codes adjust the allowance (e.g., 1280L → £12,800).</li>
                <li>Personal Allowance taper: above £100,000, allowance reduces by £1 for every £2 of income.</li>
                <li>Scottish income tax bands differ from England/Wales/NI. National Insurance thresholds are UK-wide.</li>
                <li>Results are estimates for guidance only and may vary with benefits-in-kind, adjustments, or non-standard codes.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Related calculators */}
        <RelatedCalculators
          calculators={[
            {
              name: 'Salary Calculator',
              url: createPageUrl('SalaryCalculatorUK'),
              description: 'See full take-home pay including NI, pension and student loan.',
            },
            {
              name: 'Income Tax Calculator',
              url: createPageUrl('IncomeTaxCalculator'),
              description: 'Understand your tax by band for 2025/26.',
            },
            {
              name: 'National Insurance Calculator',
              url: createPageUrl('NationalInsuranceCalculator'),
              description: 'Calculate Class 1 NI contributions.',
            },
          ]}
        />
      </div>
    </div>
  );
}
