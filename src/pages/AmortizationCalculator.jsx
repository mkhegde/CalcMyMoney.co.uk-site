import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Calculator, Percent, Calendar, FileSpreadsheet } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import Heading from '@/components/common/Heading';
const amortizationFAQs = [
  {
    question: 'What is a loan amortization schedule?',
    answer:
      'An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term.',
  },
  {
    question: 'How does amortization work?',
    answer:
      'With each payment, a portion goes towards paying off the interest accrued for that period, and the remaining portion goes towards reducing the principal loan balance. Early in the loan term, a larger portion of your payment goes to interest. As the loan matures, more of your payment goes towards the principal.',
  },
  {
    question: 'Why is an amortization schedule useful?',
    answer:
      "It's useful for understanding how your loan works, seeing the total interest you'll pay, and identifying opportunities to save money. For example, by making extra payments, you can see how much faster you'll pay off the loan and how much interest you'll save.",
  },
];

const generateAmortizationSchedule = (loanAmount, monthlyRate, term) => {
  const schedule = [];
  let balance = loanAmount;
  let totalInterest = 0;
  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

  for (let month = 1; month <= term; month++) {
    const interestPayment = balance * monthlyRate;
    totalInterest += interestPayment;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    schedule.push({
      month,
      'Remaining Balance': balance > 0 ? balance : 0,
      'Cumulative Interest': totalInterest,
      'Principal Paid': principalPayment,
    });
  }
  return schedule;
};

export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState('250000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('30'); // in years
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = useCallback(() => {
    const amount = Number(loanAmount) || 0;
    const rate = Number(interestRate) / 100;
    const termYears = Number(loanTerm) || 0;
    const termMonths = termYears * 12;

    if (amount <= 0 || rate <= 0 || termMonths <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const monthlyRate = rate / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths));
    const totalRepayment = monthlyPayment * termMonths;
    const totalInterest = totalRepayment - amount;
    const schedule = generateAmortizationSchedule(amount, monthlyRate, termMonths);

    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      schedule,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Loan Amount', `£${amount.toFixed(2)}`],
      ['Interest Rate', `${interestRate}%`],
      ['Loan Term', `${termYears} years`],
      ['Monthly Payment', `£${monthlyPayment.toFixed(2)}`],
      ['Total Interest Paid', `£${totalInterest.toFixed(2)}`],
      ['---'],
      ['Month', 'Principal Paid', 'Cumulative Interest', 'Remaining Balance'],
      ...schedule.map((row) => [
        row.month,
        `£${row['Principal Paid'].toFixed(2)}`,
        `£${row['Cumulative Interest'].toFixed(2)}`,
        `£${row['Remaining Balance'].toFixed(2)}`,
      ]),
    ];
    setCsvData(csvExportData);
  }, [loanAmount, interestRate, loanTerm]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Loan Amortization Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Generate a complete payment schedule for your mortgage or loan. See how much of each
              payment goes to principal vs. interest.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Loan Amortization Schedule</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Loan Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="loanAmount" className="flex justify-between">
                    <span>Loan Amount</span>
                    <span className="font-semibold">£{Number(loanAmount).toLocaleString()}</span>
                  </Label>
                  <Slider
                    value={[Number(loanAmount)]}
                    onValueChange={(value) => setLoanAmount(String(value[0]))}
                    max={1000000}
                    step={10000}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate" className="flex justify-between">
                    <span>Annual Interest Rate</span>
                    <span className="font-semibold">{Number(interestRate).toFixed(2)}%</span>
                  </Label>
                  <Slider
                    value={[Number(interestRate)]}
                    onValueChange={(value) => setInterestRate(String(value[0]))}
                    max={20}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="loanTerm" className="flex justify-between">
                    <span>Loan Term (Years)</span>
                    <span className="font-semibold">{loanTerm} years</span>
                  </Label>
                  <Slider
                    value={[Number(loanTerm)]}
                    onValueChange={(value) => setLoanTerm(String(value[0]))}
                    max={40}
                    step={1}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Your Amortization Schedule</Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName="amortization-schedule"
                    title="Amortization Schedule"
                  />
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Loan Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-sm text-gray-500">Monthly Payment</p>
                      <p className="text-2xl font-bold">£{results.monthlyPayment.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Interest Paid</p>
                      <p className="text-2xl font-bold text-red-600">
                        £
                        {results.totalInterest.toLocaleString('en-GB', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Repayment</p>
                      <p className="text-2xl font-bold">
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
                    <CardTitle>Principal vs. Interest</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={results.schedule}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="month"
                          label={{ value: 'Month', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                        <Tooltip
                          formatter={(value) =>
                            `£${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                          }
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="Remaining Balance"
                          stackId="1"
                          stroke="#3b82f6"
                          fill="#3b82f6"
                        />
                        <Area
                          type="monotone"
                          dataKey="Cumulative Interest"
                          stackId="2"
                          stroke="#ef4444"
                          fill="#ef4444"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5" />
                      Full Payment Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2">Month</th>
                          <th className="px-4 py-2">Interest</th>
                          <th className="px-4 py-2">Principal</th>
                          <th className="px-4 py-2">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((row) => (
                          <tr key={row.month} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{row.month}</td>
                            <td className="px-4 py-2 text-red-600">
                              £
                              {(
                                row['Cumulative Interest'] -
                                (results.schedule[row.month - 2]?.['Cumulative Interest'] || 0)
                              ).toFixed(2)}
                            </td>
                            <td className="px-4 py-2 text-green-600">
                              £{row['Principal Paid'].toFixed(2)}
                            </td>
                            <td className="px-4 py-2 font-medium">
                              £{row['Remaining Balance'].toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Generate your loan schedule</h3>
                  <p>Enter your loan details to see the full breakdown.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={amortizationFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
