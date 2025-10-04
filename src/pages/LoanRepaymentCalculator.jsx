import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Calendar, Percent } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const loanFAQs = [
  {
    question: 'How is loan interest calculated?',
    answer:
      'Most personal loans use a method where interest is calculated on the remaining balance. Each monthly payment consists of two parts: one part pays down the principal (the amount you borrowed), and the other part pays the interest accrued for that month.',
  },
  {
    question: 'What is APR (Annual Percentage Rate)?',
    answer:
      "APR represents the total yearly cost of borrowing, including the interest rate and any mandatory fees. It provides a more complete picture of the loan's cost than the interest rate alone.",
  },
  {
    question: 'Can I pay off my loan early?',
    answer:
      "Yes, you can usually pay off a personal loan early, which can save you a significant amount in interest. However, some lenders may charge an early repayment fee, typically equivalent to 1-2 months' interest, so it's important to check your loan agreement.",
  },
];

export default function LoanRepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const P = Number(loanAmount) || 0;
    const r = (Number(interestRate) || 0) / 100 / 12; // Monthly interest rate
    const n = (Number(loanTerm) || 0) * 12; // Total number of payments

    if (P <= 0 || r <= 0 || n <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const monthlyPayment = (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
    const totalRepayment = monthlyPayment * n;
    const totalInterest = totalRepayment - P;

    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      loanAmount: P,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Monthly Payment', `£${newResults.monthlyPayment.toFixed(2)}`],
      ['Total Repayments', `£${newResults.totalRepayment.toFixed(2)}`],
      ['Total Interest Paid', `£${newResults.totalInterest.toFixed(2)}`],
      ['Loan Amount', `£${newResults.loanAmount.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [loanAmount, interestRate, loanTerm]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Personal Loan Repayment Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your monthly payments and the total interest you'll pay on a personal loan.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Loan Repayment Calculation</div>
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
                      placeholder="e.g. 10000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Interest Rate (APR %)</Label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 7.5"
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
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Your Loan Repayments</Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName="loan-repayment"
                    title="Loan Repayment"
                  />
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
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Repayments</p>
                      <p className="text-lg font-semibold">
                        £
                        {results.totalRepayment.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Interest Paid</p>
                      <p className="text-lg font-semibold text-red-800">
                        £
                        {results.totalInterest.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to see your repayments?</h3>
                  <p>Enter the loan details to calculate your monthly costs.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={loanFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
