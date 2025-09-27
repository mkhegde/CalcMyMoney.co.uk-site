import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Calculator, Percent, Calendar } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const personalLoanFAQs = [
  {
    question: 'What is an APR on a personal loan?',
    answer:
      'The Annual Percentage Rate (APR) represents the total cost of borrowing over a year, including the interest rate and any other fees. A lower APR means a cheaper loan.',
  },
  {
    question: 'How can I get a better interest rate on a personal loan?',
    answer:
      'Improving your credit score is the most effective way. You can also get better rates by securing the loan against an asset (though this is riskier), choosing a shorter loan term, or shopping around and comparing offers from different lenders.',
  },
  {
    question: "What's the difference between a personal loan and a credit card?",
    answer:
      'A personal loan gives you a fixed lump sum that you repay in fixed monthly instalments over a set term. A credit card offers a revolving line of credit that you can use, repay, and reuse. Loans typically have lower interest rates than credit cards, making them better for large, planned purchases.',
  },
];

const generateAmortizationSchedule = (loanAmount, monthlyRate, term) => {
  const schedule = [];
  let balance = loanAmount;
  const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

  for (let month = 1; month <= term; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    schedule.push({
      month,
      'Remaining Balance': balance > 0 ? balance : 0,
      'Interest Paid': interestPayment,
      'Principal Paid': principalPayment,
    });
  }
  return schedule;
};

export default function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('5.5');
  const [loanTerm, setLoanTerm] = useState('60'); // in months
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = useCallback(() => {
    const amount = Number(loanAmount) || 0;
    const rate = Number(interestRate) / 100;
    const term = Number(loanTerm) || 0;

    if (amount <= 0 || rate <= 0 || term <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const monthlyRate = rate / 12;
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    const totalRepayment = monthlyPayment * term;
    const totalInterest = totalRepayment - amount;
    const amortizationData = generateAmortizationSchedule(amount, monthlyRate, term);

    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      loanAmount: amount,
      amortizationData,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Loan Amount', `£${amount.toFixed(2)}`],
      ['Interest Rate (APR)', `${interestRate}%`],
      ['Loan Term', `${term} months`],
      ['Monthly Payment', `£${monthlyPayment.toFixed(2)}`],
      ['Total Interest Paid', `£${totalInterest.toFixed(2)}`],
      ['Total Amount Repaid', `£${totalRepayment.toFixed(2)}`],
      ['---'],
      ['Month', 'Principal Paid', 'Interest Paid', 'Remaining Balance'],
      ...amortizationData.map((row) => [
        row.month,
        `£${row['Principal Paid'].toFixed(2)}`,
        `£${row['Interest Paid'].toFixed(2)}`,
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Personal Loan Calculator UK
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your monthly payments, total interest, and see a full repayment schedule for
              any personal loan.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Personal Loan Calculation</div>
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
                  <div className="relative mt-2">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="loanAmount"
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Slider
                    value={[Number(loanAmount)]}
                    onValueChange={(value) => setLoanAmount(String(value[0]))}
                    max={50000}
                    step={500}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate" className="flex justify-between">
                    <span>Interest Rate (APR)</span>
                    <span className="font-semibold">{Number(interestRate).toFixed(1)}%</span>
                  </Label>
                  <div className="relative mt-2">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Slider
                    value={[Number(interestRate)]}
                    onValueChange={(value) => setInterestRate(String(value[0]))}
                    max={25}
                    step={0.1}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="loanTerm" className="flex justify-between">
                    <span>Loan Term (Months)</span>
                    <span className="font-semibold">{loanTerm} months</span>
                  </Label>
                  <div className="relative mt-2">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="loanTerm"
                      type="number"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Slider
                    value={[Number(loanTerm)]}
                    onValueChange={(value) => setLoanTerm(String(value[0]))}
                    max={120}
                    step={12}
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
                  <h2 className="text-2xl font-bold text-gray-800">Your Loan Repayment Summary</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="personal-loan-summary"
                    title="Personal Loan Summary"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle>Monthly Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-blue-800">
                        £{results.monthlyPayment.toFixed(2)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50">
                    <CardHeader>
                      <CardTitle>Total Interest</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-red-800">
                        £
                        {results.totalInterest.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gray-100">
                    <CardHeader>
                      <CardTitle>Total Repayment</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold text-gray-800">
                        £
                        {results.totalRepayment.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Loan Balance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={results.amortizationData}>
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
                        <Line
                          type="monotone"
                          dataKey="Remaining Balance"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Amortization Schedule</CardTitle>
                  </CardHeader>
                  <CardContent className="max-h-96 overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
                        <tr>
                          <th className="px-4 py-2">Month</th>
                          <th className="px-4 py-2">Principal Paid</th>
                          <th className="px-4 py-2">Interest Paid</th>
                          <th className="px-4 py-2">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.amortizationData.map((row) => (
                          <tr key={row.month} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-4 py-2">{row.month}</td>
                            <td className="px-4 py-2">£{row['Principal Paid'].toFixed(2)}</td>
                            <td className="px-4 py-2 text-red-600">
                              £{row['Interest Paid'].toFixed(2)}
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
                  <h3 className="text-xl font-semibold">Enter your loan details</h3>
                  <p>Calculate your monthly payments and see your repayment schedule.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={personalLoanFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
