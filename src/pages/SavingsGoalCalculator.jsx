import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Target, TrendingUp } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';

import Heading from '@/components/common/Heading';
export default function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const goal = Number(goalAmount) || 0;
    const current = Number(currentSavings) || 0;
    const monthly = Number(monthlySavings) || 0;
    const rate = Number(interestRate) || 0;

    if (goal <= current) {
      setResults({
        monthsToGoal: 0,
        yearsToGoal: 0,
        totalContributions: current,
        totalInterest: 0,
        achievable: true,
      });
      setHasCalculated(true);
      return;
    }

    if (monthly <= 0) {
      setResults({ achievable: false });
      setHasCalculated(true);
      return;
    }

    const monthlyRate = rate / 100 / 12;
    let balance = current;
    let months = 0;
    let totalContributions = current;

    while (balance < goal && months < 1200) {
      // Max 100 years
      months++;
      balance = balance * (1 + monthlyRate) + monthly;
      totalContributions += monthly;
    }

    const totalInterest = balance - totalContributions;
    const yearsToGoal = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const newResults = {
      monthsToGoal: months,
      yearsToGoal,
      remainingMonths,
      totalContributions,
      totalInterest,
      finalAmount: balance,
      achievable: true,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Goal Amount', `£${goal.toFixed(2)}`],
      ['Current Savings', `£${current.toFixed(2)}`],
      ['Monthly Savings', `£${monthly.toFixed(2)}`],
      ['Interest Rate', `${rate}%`],
      ['', ''],
      ['Time to Goal', `${yearsToGoal}y ${remainingMonths}m`],
      ['Total Contributions', `£${totalContributions.toFixed(2)}`],
      ['Total Interest Earned', `£${totalInterest.toFixed(2)}`],
      ['Final Amount', `£${balance.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [goalAmount, currentSavings, monthlySavings, interestRate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Savings Goal Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Dreams without goals are just wishes. Set a target, make a plan, and watch your
              savings grow.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Savings Goal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal Amount</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="goal"
                      type="number"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 20000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current">Current Savings</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="current"
                      type="number"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 2000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthly">Monthly Savings</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="monthly"
                      type="number"
                      value={monthlySavings}
                      onChange={(e) => setMonthlySavings(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interest">Annual Interest Rate (%)</Label>
                  <Input
                    id="interest"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.1"
                    placeholder="e.g. 4.5"
                  />
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Timeline
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                {results.achievable ? (
                  <>
                    <div className="flex justify-between items-center non-printable">
                      <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Your Savings Plan</Heading>
                      <ExportActions
                        csvData={csvData}
                        fileName="savings-goal-plan"
                        title="Savings Goal Plan"
                      />
                    </div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Time to Goal</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                          <Target className="w-12 h-12 mx-auto text-green-600 mb-4" />
                          <p className="text-4xl font-bold text-green-800">
                            {results.yearsToGoal}y {results.remainingMonths}m
                          </p>
                          <p className="text-green-700 mt-2">Time to reach your goal</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span>Total Contributions:</span>
                          <span className="font-semibold">
                            £{results.totalContributions.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Earned:</span>
                          <span className="font-semibold text-green-600">
                            £{results.totalInterest.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span>Final Amount:</span>
                          <span className="font-bold text-lg">
                            £{results.finalAmount.toLocaleString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Goal Not Achievable</CardTitle>
                    </CardHeader>
                    <CardContent className="text-yellow-800">
                      <p>
                        With the current monthly savings amount, this goal cannot be reached.
                        Consider:
                      </p>
                      <ul className="list-disc list-inside mt-2">
                        <li>Increasing your monthly savings</li>
                        <li>Extending your timeline</li>
                        <li>Looking for higher interest rates</li>
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Target className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Plan your savings goal</h3>
                  <p>Enter your details to see how long it will take.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
