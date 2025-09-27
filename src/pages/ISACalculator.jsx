import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Calendar, TrendingUp } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

const isaFAQs = [
  {
    question: 'What is an ISA?',
    answer:
      'An Individual Savings Account (ISA) is a tax-efficient way to save or invest. Any interest, capital gains, or dividends you earn from funds within an ISA are completely tax-free.',
  },
  {
    question: 'What is the annual ISA allowance?',
    answer:
      'For the 2024/25 tax year, the annual ISA allowance is £20,000. You can put this into one type of ISA or split it across several different types.',
  },
  {
    question: 'What are the main types of ISA?',
    answer:
      'The main types are: Cash ISAs (for risk-free cash savings), Stocks & Shares ISAs (for investing in the stock market), Lifetime ISAs (for first home or retirement), and Innovative Finance ISAs (for peer-to-peer lending).',
  },
];

export default function ISACalculator() {
  const [initialDeposit, setInitialDeposit] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const P = Number(initialDeposit) || 0;
    const PMT = Number(monthlyContribution) || 0;
    const r = (Number(interestRate) || 0) / 100;
    const t = Number(years) || 0;

    if (t <= 0 || r <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const n = 12; // Compounded monthly
    const nt = n * t;
    const monthlyRate = r / n;

    const finalBalance =
      P * Math.pow(1 + monthlyRate, nt) + PMT * ((Math.pow(1 + monthlyRate, nt) - 1) / monthlyRate);
    const totalContributions = P + PMT * 12 * t;
    const totalInterest = finalBalance - totalContributions;

    const newResults = {
      finalBalance,
      totalContributions,
      totalInterest,
      years: t,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Final Balance', `£${newResults.finalBalance.toFixed(2)}`],
      ['Total Contributions', `£${newResults.totalContributions.toFixed(2)}`],
      ['Total Interest Earned', `£${newResults.totalInterest.toFixed(2)}`],
      ['Investment Term', `${t} years`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [initialDeposit, monthlyContribution, interestRate, years]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              ISA Savings Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how your savings could grow in a tax-free ISA. Project your future balance based
              on your contributions and expected returns.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">ISA Savings Projection</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Enter Your ISA Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="initialDeposit">Initial Deposit</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="initialDeposit"
                      type="number"
                      value={initialDeposit}
                      onChange={(e) => setInitialDeposit(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 1000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 250"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Growth Rate (%)</Label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years">Investment Term (Years)</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="years"
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Growth
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your ISA Projection</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="isa-projection"
                    title="ISA Projection"
                  />
                </div>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-blue-800 mb-2">Projected Final Balance</h3>
                    <div className="text-4xl font-bold text-blue-900">
                      £
                      {results.finalBalance.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-sm text-blue-700">After {results.years} years</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Contributions</p>
                      <p className="text-lg font-semibold text-green-800">
                        £
                        {results.totalContributions.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Interest Earned</p>
                      <p className="text-lg font-semibold text-yellow-800">
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
                  <h3 className="text-xl font-semibold">Ready to see your ISA grow?</h3>
                  <p>Enter your savings details to project your future wealth.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={isaFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
