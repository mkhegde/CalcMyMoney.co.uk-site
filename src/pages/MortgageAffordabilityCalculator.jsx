import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Users, Home, TrendingDown } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

const affordabilityFAQs = [
  {
    question: 'How do lenders calculate mortgage affordability?',
    answer:
      "Lenders typically use an income multiple, usually around 4 to 4.5 times your annual income. They then subtract existing financial commitments (like loans and credit card debt) and apply 'stress tests' to ensure you could afford repayments if interest rates were to rise.",
  },
  {
    question: 'What is a Loan-to-Income (LTI) ratio?',
    answer:
      'Loan-to-Income (LTI) is the ratio of the mortgage amount to your gross annual income. For example, borrowing £200,000 on a £50,000 salary gives you an LTI of 4. This is a key metric for lenders.',
  },
  {
    question: 'How can I improve my mortgage affordability?',
    answer:
      'You can improve your chances by paying down existing debts, closing unused credit cards, saving for a larger deposit, and checking your credit report for errors. A stable employment history also helps.',
  },
];

export default function MortgageAffordabilityCalculator() {
  const [applicant1Income, setApplicant1Income] = useState('');
  const [applicant2Income, setApplicant2Income] = useState('');
  const [deposit, setDeposit] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const inc1 = Number(applicant1Income) || 0;
    const inc2 = Number(applicant2Income) || 0;
    const totalIncome = inc1 + inc2;
    const dep = Number(deposit) || 0;
    const debts = Number(monthlyDebts) || 0;

    if (totalIncome <= 0 || dep <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // A more realistic calculation than a simple multiplier
    const annualDebt = debts * 12;
    const disposableForMortgage = Math.max(0, totalIncome - annualDebt * 2); // Lenders heavily weigh debt
    const baseMultiplier = 4.5;

    // Adjust multiplier based on LTI - simplified model
    const estimatedLTI = (disposableForMortgage * baseMultiplier) / totalIncome;
    let multiplier = baseMultiplier;
    if (estimatedLTI < 4) multiplier = 4.75;
    if (totalIncome > 100000) multiplier = 5.0;

    const estimatedBorrowing = disposableForMortgage * multiplier;
    const maxPropertyPrice = estimatedBorrowing + dep;
    const loanToIncome = (estimatedBorrowing / totalIncome).toFixed(2);

    const newResults = {
      estimatedBorrowing,
      maxPropertyPrice,
      deposit: dep,
      loanToIncome,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Estimated Borrowing Amount', `£${newResults.estimatedBorrowing.toFixed(2)}`],
      ['Maximum Property Price', `£${newResults.maxPropertyPrice.toFixed(2)}`],
      ['Your Deposit', `£${newResults.deposit.toFixed(2)}`],
      ['Loan-to-Income (LTI) Ratio', newResults.loanToIncome],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [applicant1Income, applicant2Income, deposit, monthlyDebts]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Mortgage Affordability Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get a realistic estimate of how much you could borrow for a mortgage based on your
              income and outgoings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Mortgage Affordability Estimate</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Financial Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="applicant1Income">Applicant 1 Annual Income</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="applicant1Income"
                      type="number"
                      value={applicant1Income}
                      onChange={(e) => setApplicant1Income(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 45000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicant2Income">Applicant 2 Annual Income (optional)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="applicant2Income"
                      type="number"
                      value={applicant2Income}
                      onChange={(e) => setApplicant2Income(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 30000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Your Deposit Amount</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="deposit"
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 25000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyDebts">Monthly Debt Repayments</Label>
                  <div className="relative">
                    <TrendingDown className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="monthlyDebts"
                      type="number"
                      value={monthlyDebts}
                      onChange={(e) => setMonthlyDebts(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 300"
                    />
                  </div>
                  <p className="text-xs text-gray-500">e.g., loans, credit cards, car finance.</p>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Affordability
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Affordability Estimate</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="mortgage-affordability"
                    title="Mortgage Affordability"
                  />
                </div>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-800 mb-2">You could borrow up to</h3>
                    <div className="text-4xl font-bold text-green-900">
                      £
                      {results.estimatedBorrowing.toLocaleString('en-GB', {
                        maximumFractionDigits: 0,
                      })}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Buying Power</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-600">Maximum Property Price</p>
                      <p className="text-2xl font-semibold text-blue-800">
                        £
                        {results.maxPropertyPrice.toLocaleString('en-GB', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-xs text-blue-500">
                        (Based on your estimated borrowing plus your deposit of £
                        {results.deposit.toLocaleString()})
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Your Loan-to-Income (LTI) Ratio</p>
                      <p className="text-lg font-semibold">{results.loanToIncome}</p>
                      <p className="text-xs text-gray-500">
                        Lenders typically cap this around 4.5 to 5.5.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-yellow-300 bg-yellow-50">
                  <CardContent className="p-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Disclaimer:</strong> This is an estimate for informational purposes
                      only. Lenders use complex criteria and a full credit check. Always speak to a
                      mortgage advisor for a precise figure.
                    </p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">How much can you borrow?</h3>
                  <p>Enter your financial details to get an estimate.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={affordabilityFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
