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
import { PoundSterling, Calculator, Building2, Calendar, TrendingUp } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const businessLoanFAQs = [
  {
    question: 'What types of business loans are available in the UK?',
    answer:
      'Common types include term loans, business overdrafts, asset finance, invoice finance, and government-backed loans like Start Up Loans or Bounce Back Loans. Each has different terms, rates, and eligibility criteria.',
  },
  {
    question: 'How do lenders assess business loan applications?',
    answer:
      'Lenders look at your business plan, cash flow forecasts, trading history, personal and business credit scores, collateral, and sometimes require personal guarantees. New businesses may need to provide more detailed projections.',
  },
  {
    question: 'Can I deduct business loan interest from my taxes?',
    answer:
      'Yes, interest payments on business loans are typically tax-deductible as a business expense. However, the principal repayment is not deductible. Always consult with an accountant for your specific situation.',
  },
];

export default function BusinessLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [loanType, setLoanType] = useState('term');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const P = Number(loanAmount) || 0;
    const r = (Number(interestRate) || 0) / 100 / 12;
    const n = (Number(loanTerm) || 0) * 12;

    if (P <= 0 || r <= 0 || n <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    let monthlyPayment;
    let totalRepayment;
    let totalInterest;

    if (loanType === 'term') {
      // Standard term loan calculation
      monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
      totalRepayment = monthlyPayment * n;
      totalInterest = totalRepayment - P;
    } else {
      // Interest-only loan
      monthlyPayment = P * r;
      totalInterest = monthlyPayment * n;
      totalRepayment = totalInterest + P;
    }

    // Business impact calculations
    const monthlyInterestCost = totalInterest / n;
    const annualInterestCost = monthlyInterestCost * 12;
    const taxSavings = annualInterestCost * 0.19; // Corporation tax rate for small companies

    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      annualInterestCost,
      taxSavings,
      loanAmount: P,
      effectiveRate: (totalInterest / P / (n / 12)) * 100,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Monthly Payment', `£${newResults.monthlyPayment.toFixed(2)}`],
      ['Total Repayment', `£${newResults.totalRepayment.toFixed(2)}`],
      ['Total Interest', `£${newResults.totalInterest.toFixed(2)}`],
      ['Annual Interest Cost', `£${newResults.annualInterestCost.toFixed(2)}`],
      ['Tax Savings (19% Corp Tax)', `£${newResults.taxSavings.toFixed(2)}`],
      ['Effective Interest Rate', `${newResults.effectiveRate.toFixed(2)}%`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [loanAmount, interestRate, loanTerm, loanType]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Business Loan Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate monthly payments and total costs for business loans, including the tax
              benefits of interest deductibility.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Business Loan Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">Loan Amount</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 6.5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term (Years)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Loan Type</Label>
                  <Select value={loanType} onValueChange={setLoanType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="term">Term Loan (Capital & Interest)</SelectItem>
                      <SelectItem value="interest_only">Interest Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Business Loan Summary</Heading>
                  <ExportActions csvData={csvData} fileName="business-loan" title="Business Loan" />
                </div>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Monthly Payment</h3>
                    <div className="text-4xl font-bold text-blue-900">
                      £
                      {results.monthlyPayment.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                  </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Loan Costs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Total Interest</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.totalInterest.toLocaleString('en-GB', {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Total Repayment</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.totalRepayment.toLocaleString('en-GB', {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tax Benefits</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-sm text-green-600">Annual Tax Savings</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.taxSavings.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-green-500">Interest is tax-deductible</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-600">Effective Rate</p>
                        <p className="text-lg font-semibold">{results.effectiveRate.toFixed(2)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                {loanType === 'interest_only' && (
                  <Card className="border-yellow-300 bg-yellow-50">
                    <CardContent className="p-4">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> With interest-only loans, you'll still owe the full £
                        {results.loanAmount.toLocaleString()} at the end of the term.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to calculate?</h3>
                  <p>Enter your business loan details to see the costs.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={businessLoanFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
