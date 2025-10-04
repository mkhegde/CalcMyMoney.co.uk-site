import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Calculator, Home } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import {
import Heading from '@/components/common/Heading';
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export default function MortgageRepaymentCalculator() {
  const [loanAmount, setLoanAmount] = useState('250000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [results, setResults] = useState(null);
  const [csvData, setCsvData] = useState(null);

  // Updated to accept monthlyPayment as an argument and handle final payment precision
  const generateAmortizationSchedule = (loanAmount, monthlyRate, term, monthlyPayment) => {
    const schedule = [];
    let balance = loanAmount;

    for (let month = 1; month <= term; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;

      // Adjust for floating point inaccuracies and ensure last payment zeroes out balance
      if (month === term) {
        principalPayment = balance; // On the last month, principal should be exactly the remaining balance
      } else if (principalPayment > balance) {
        // In case of slight floating point error making principal payment larger than remaining balance
        principalPayment = balance;
      }

      balance -= principalPayment;

      // Ensure remaining balance doesn't show tiny negative numbers due to floating point
      const remainingBalance = balance < 0.01 && balance > -0.01 ? 0 : balance;

      schedule.push({
        month,
        'Remaining Balance': remainingBalance,
        'Principal Payment': principalPayment,
        'Interest Payment': interestPayment,
      });
    }
    return schedule;
  };

  const handleCalculate = useCallback(() => {
    const amount = Number(loanAmount) || 0;
    const rate = Number(interestRate) / 100;
    const termYears = Number(loanTerm) || 0;
    const termMonths = termYears * 12;

    if (amount <= 0 || rate <= 0 || termMonths <= 0) {
      setResults(null); // Clear results if inputs are invalid
      return;
    }

    const monthlyRate = rate / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));

    // Pass monthlyPayment to generateAmortizationSchedule to avoid recalculation and ensure consistency
    const schedule = generateAmortizationSchedule(amount, monthlyRate, termMonths, monthlyPayment);

    // Calculate total interest from the generated schedule
    const totalInterest = schedule.reduce((acc, row) => acc + row['Interest Payment'], 0);

    setResults({ monthlyPayment, schedule, totalInterest });
    setCsvData([
      ['Month', 'Principal', 'Interest', 'Balance'],
      ...schedule.map((r) => [
        r.month,
        r['Principal Payment'].toFixed(2),
        r['Interest Payment'].toFixed(2),
        r['Remaining Balance'].toFixed(2),
      ]),
    ]);
  }, [loanAmount, interestRate, loanTerm]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Mortgage Repayment Schedule Calculator</Heading>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Mortgage Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Mortgage Amount (£{Number(loanAmount).toLocaleString()})</Label>
                  <Slider
                    value={[Number(loanAmount)]}
                    onValueChange={(v) => setLoanAmount(String(v[0]))}
                    max={1000000}
                    step={10000}
                  />
                </div>
                <div>
                  <Label>Interest Rate ({Number(interestRate).toFixed(2)}%)</Label>
                  <Slider
                    value={[Number(interestRate)]}
                    onValueChange={(v) => setInterestRate(String(v[0]))}
                    max={20}
                    step={0.1}
                  />
                </div>
                <div>
                  <Label>Term ({loanTerm} years)</Label>
                  <Slider
                    value={[Number(loanTerm)]}
                    onValueChange={(v) => setLoanTerm(String(v[0]))}
                    max={40}
                    step={1}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            {results ? (
              <div className="space-y-6 printable-area">
                <div className="non-printable">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">Repayment Schedule</h2>
                  </div>
                </div>
                <Card>
                  <CardContent className="p-4 grid md:grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-sm">Monthly Payment</p>
                      <p className="text-2xl font-bold">£{results.monthlyPayment.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm">Total Interest</p>
                      <p className="text-2xl font-bold text-red-600">
                        £
                        {results.totalInterest.toLocaleString('en-GB', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Loan Balance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={results.schedule}>
                        <CartesianGrid />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="Remaining Balance"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <div className="non-printable pt-6">
                  <ExportActions
                    csvData={csvData}
                    fileName="mortgage-amortization-schedule"
                    title="Mortgage Amortization Schedule"
                  />
                </div>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <CardContent className="text-center p-4">
                  <p className="text-gray-500">
                    Enter your mortgage details to see the repayment schedule.
                  </p>
                  <Calculator className="w-12 h-12 text-gray-400 mx-auto mt-4" />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
