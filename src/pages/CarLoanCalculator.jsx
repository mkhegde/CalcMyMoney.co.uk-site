import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Calculator, Car, Percent, Calendar } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

import Heading from '@/components/common/Heading';
const carLoanFAQs = [
  {
    question: 'What is PCP vs HP?',
    answer:
      "Hire Purchase (HP) means you pay off the car in monthly instalments and own it at the end. Personal Contract Purchase (PCP) has lower monthly payments, but at the end you can either pay a large 'balloon' payment to own the car, trade it in for a new one, or hand it back.",
  },
  {
    question: 'How does my credit score affect my car loan?',
    answer:
      "A better credit score generally gets you access to lower Annual Percentage Rates (APR), which means you'll pay less interest over the life of the loan. Lenders see you as a lower risk.",
  },
  {
    question: 'Should I pay a deposit on a car loan?',
    answer:
      "Yes, paying a larger deposit is usually beneficial. It reduces the amount you need to borrow, which lowers your monthly payments and the total interest you'll pay. It can also improve your chances of being approved for the loan.",
  },
];

const CHART_COLORS = {
  principal: '#3b82f6', // blue
  interest: '#ef4444', // red
};

export default function CarLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [loanTerm, setLoanTerm] = useState('48');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = useCallback(() => {
    const price = Number(vehiclePrice) || 0;
    const dep = Number(deposit) || 0;
    const rate = Number(interestRate) / 100;
    const term = Number(loanTerm) || 0;

    const loanAmount = price - dep;
    if (loanAmount <= 0 || rate <= 0 || term <= 0) {
      setResults(null);
      setHasCalculated(true); // Indicate that calculation attempt was made, even if inputs were invalid
      return;
    }

    const monthlyRate = rate / 12;
    const monthlyPayment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
    const totalRepayment = monthlyPayment * term;
    const totalInterest = totalRepayment - loanAmount;

    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      loanAmount,
      vehiclePrice: price,
      deposit: dep,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Vehicle Price', `£${price.toFixed(2)}`],
      ['Deposit', `£${dep.toFixed(2)}`],
      ['Loan Amount', `£${loanAmount.toFixed(2)}`],
      ['Interest Rate (APR)', `${interestRate}%`],
      ['Loan Term', `${term} months`],
      ['Monthly Payment', `£${monthlyPayment.toFixed(2)}`],
      ['Total Interest Paid', `£${totalInterest.toFixed(2)}`],
      ['Total Amount Repaid', `£${totalRepayment.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  }, [vehiclePrice, deposit, interestRate, loanTerm]);

  // Removed useEffect for auto-calculation as per instructions

  const pieData = results
    ? [
        { name: 'Principal', value: results.loanAmount, color: CHART_COLORS.principal },
        { name: 'Interest', value: results.totalInterest, color: CHART_COLORS.interest },
      ]
    : [];

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Car Loan &amp; Finance Calculator UK
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Work out your monthly payments and total interest for HP &amp; PCP car finance deals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Finance Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="vehiclePrice">Vehicle Price</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="vehiclePrice"
                      type="number"
                      value={vehiclePrice}
                      onChange={(e) => setVehiclePrice(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 20000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deposit">Deposit</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="deposit"
                      type="number"
                      value={deposit}
                      onChange={(e) => setDeposit(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (APR)</Label>
                  <div className="relative">
                    <Percent className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="interestRate"
                      type="number"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      className="pr-10"
                      placeholder="e.g. 7.5"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTerm">Loan Term ({loanTerm} months)</Label>
                  <Slider
                    id="loanTerm"
                    value={[loanTerm]}
                    onValueChange={(val) => setLoanTerm(val[0])}
                    min={12}
                    max={84}
                    step={1}
                  />
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
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Your Car Loan Results</Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName="car-loan-summary"
                    title="Car Loan Summary"
                  />
                </div>
                <Card className="text-center bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle>Monthly Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-5xl font-bold text-blue-800">
                      £{results.monthlyPayment.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Loan Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Vehicle Price:</span>
                        <span className="font-medium">
                          £{results.vehiclePrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Deposit:</span>
                        <span className="font-medium">- £{results.deposit.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span>Total Loan Amount:</span>
                        <span className="font-semibold">
                          £{results.loanAmount.toLocaleString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Cost Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Total Repayments:</span>
                        <span className="font-medium">
                          £
                          {results.totalRepayment.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-medium text-red-600">
                          £
                          {results.totalInterest.toLocaleString(undefined, {
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Total Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px] bg-gray-50">
                <div className="text-center text-gray-500">
                  <Car className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">See your car loan details</h3>
                  <p>Enter your finance info to get started.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={carLoanFAQs} />
        </div>
      </div>
    </div>
  );
}
