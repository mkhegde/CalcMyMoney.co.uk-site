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
import { PoundSterling, Calculator, HelpCircle } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import RelatedCalculators from '../components/calculators/RelatedCalculators'; // New import

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
    question: 'What is PAYE?',
    answer:
      "PAYE (Pay As You Earn) is the UK's system for collecting income tax and National Insurance contributions directly from your salary before you receive it. Your employer calculates and deducts these amounts each pay period.",
  },
  {
    question: 'How is PAYE calculated?',
    answer:
      'PAYE calculations use your tax code, salary, and pay frequency. Tax is calculated cumulatively from April to March, meaning each pay period accounts for the full tax year to date.',
  },
  {
    question: "What's the difference between Scottish and English PAYE rates?",
    answer:
      'Scotland has different income tax rates and bands from the rest of the UK, but National Insurance rates remain the same across all UK regions.',
  },
];

export default function PAYECalculator() {
  const [grossSalary, setGrossSalary] = useState('');
  const [payFrequency, setPayFrequency] = useState('monthly');
  const [location, setLocation] = useState('england');
  const [taxCode, setTaxCode] = useState('1257L');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  // Helper function to create page URLs. This would typically be part of a routing utility.
  // For this example, we'll assume a simple transformation to a relative path.
  const createPageUrl = (pageIdentifier) => {
    // Example: "SalaryCalculatorUK" -> "/calculators/salary-calculator-uk"
    // Adjust this logic based on your actual application's routing conventions.
    return `/calculators/${pageIdentifier.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
  };

  const calculatePAYE = () => {
    const annualSalary = Number(grossSalary) || 0;
    if (annualSalary <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Personal allowance from tax code
    let personalAllowance = 12570;
    if (taxCode.match(/^\d+L$/)) {
      personalAllowance = parseInt(taxCode.slice(0, -1)) * 10;
    }

    // Adjust for high earners
    if (annualSalary > 100000) {
      personalAllowance = Math.max(0, personalAllowance - (annualSalary - 100000) / 2);
    }

    // Calculate tax
    const taxBrackets = taxBrackets2025[location];
    let annualTax = 0;
    let taxBreakdown = [];
    const taxableIncome = Math.max(0, annualSalary - personalAllowance);

    for (const bracket of taxBrackets) {
      if (bracket.rate === 0) continue;

      const bracketMinAdjusted = Math.max(0, bracket.min - personalAllowance); // Ensure min is not negative if personalAllowance is higher
      const bracketMaxAdjusted = Math.max(0, bracket.max - personalAllowance); // Ensure max is not negative

      if (taxableIncome > bracketMinAdjusted) {
        const taxableInBracket = Math.min(taxableIncome, bracketMaxAdjusted) - bracketMinAdjusted;
        if (taxableInBracket > 0) {
          const taxInBracket = taxableInBracket * bracket.rate;
          annualTax += taxInBracket;
          taxBreakdown.push({
            name: bracket.name,
            rate: bracket.rate * 100,
            taxableAmount: taxableInBracket,
            amount: taxInBracket,
          });
        }
      }
    }

    // Calculate National Insurance
    let annualNI = 0;
    let niBreakdown = [];
    for (const threshold of niThresholds) {
      // NI is calculated on gross salary, not taxable income after PA
      if (annualSalary > threshold.min) {
        const niableAmount = Math.min(annualSalary, threshold.max) - threshold.min;
        if (niableAmount > 0) {
          const niAmount = niableAmount * threshold.rate;
          annualNI += niAmount;
          if (niAmount > 0) {
            // Only add to breakdown if NI is actually charged in this band
            niBreakdown.push({
              rate: threshold.rate * 100,
              niableAmount: niableAmount,
              amount: niAmount,
            });
          }
        }
      }
    }

    const totalDeductions = annualTax + annualNI;
    const netSalary = annualSalary - totalDeductions;

    // Convert to pay frequency
    let periods;
    switch (payFrequency) {
      case 'weekly':
        periods = 52;
        break;
      case 'fortnightly':
        periods = 26;
        break;
      case 'monthly':
      default:
        periods = 12;
        break;
    }

    const grossPerPeriod = annualSalary / periods;
    const taxPerPeriod = annualTax / periods;
    const niPerPeriod = annualNI / periods;
    const netPerPeriod = netSalary / periods;

    const newResults = {
      grossSalary: annualSalary,
      taxAmount: annualTax,
      niAmount: annualNI,
      totalDeductions,
      netSalary,
      grossPerPeriod,
      taxPerPeriod,
      niPerPeriod,
      netPerPeriod,
      taxBreakdown,
      niBreakdown,
      personalAllowance,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Item', 'Annual', `Per ${payFrequency.charAt(0).toUpperCase() + payFrequency.slice(1)}`],
      ['Gross Salary', `£${annualSalary.toFixed(2)}`, `£${grossPerPeriod.toFixed(2)}`],
      ['Income Tax', `-£${annualTax.toFixed(2)}`, `-£${taxPerPeriod.toFixed(2)}`],
      ['National Insurance', `-£${annualNI.toFixed(2)}`, `-£${niPerPeriod.toFixed(2)}`],
      ['Net Take-Home', `£${netSalary.toFixed(2)}`, `£${netPerPeriod.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [grossSalary, payFrequency, location, taxCode]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK PAYE Calculator 2025/26
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your exact take-home pay after income tax and National Insurance deductions
              using the latest UK rates.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">PAYE Calculation 2025/26</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="grossSalary">Annual Gross Salary</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="grossSalary"
                      type="number"
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
                      <SelectItem value="england">England, Wales & NI</SelectItem>
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
                <Button onClick={calculatePAYE} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate PAYE
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your PAYE Breakdown</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="paye-calculation"
                    title="PAYE Calculation"
                  />
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
                      Annual: £
                      {results.netSalary.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                    </p>
                  </CardContent>
                </Card>
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

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={payeCalculatorFAQs} />
          </div>
        </div>

        {/* NEW: Related calculators to strengthen contextual internal links */}
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
