import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Calculator, TrendingUp, Percent, ArrowRight } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const salaryIncreaseFAQs = [
  {
    question: 'What is a typical pay rise percentage in the UK?',
    answer:
      'Pay rises vary significantly by industry, company performance, and individual performance. As of early 2024, many UK employers were budgeting for pay rises in the range of 4-5%. However, this is just an average and not a guarantee.',
  },
  {
    question: 'How does inflation affect my pay rise?',
    answer:
      "If your pay rise percentage is higher than the rate of inflation, your 'real' buying power increases. If it's lower than inflation, your buying power has effectively decreased, even though you are earning more money. It's always useful to compare your raise to the current Consumer Price Index (CPI).",
  },
  {
    question: 'How can I negotiate a better pay rise?',
    answer:
      "To negotiate effectively, research industry salary benchmarks for your role and experience. Document your achievements and the value you've brought to the company. Practice your pitch and be prepared to discuss your performance and future contributions.",
  },
  {
    question: 'A Note on Calculations',
    answer:
      'This calculator provides a straightforward mathematical calculation. It does not account for tax, National Insurance, pension contributions, or other deductions. To see the impact on your take-home pay, you would need to use the new salary figure in our main Salary Calculator.',
  },
];

export default function SalaryIncreaseCalculator() {
  const [currentSalary, setCurrentSalary] = useState('50000');
  const [increasePercentage, setIncreasePercentage] = useState('5');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const salary = Number(currentSalary) || 0;
    const percentage = Number(increasePercentage) || 0;

    if (salary <= 0) {
      setResults(null);
      return;
    }

    const increaseAmount = salary * (percentage / 100);
    const newSalary = salary + increaseAmount;

    setResults({
      newSalary,
      annualIncrease: increaseAmount,
      monthlyIncrease: increaseAmount / 12,
    });
  }, [currentSalary, increasePercentage]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Salary Increase Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how a pay rise will affect your annual and monthly income before tax.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Enter Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="currentSalary">Current Annual Salary (£)</Label>
                  <div className="relative mt-1">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="currentSalary"
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="increasePercentage">Increase Percentage (%)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      id="increasePercentage"
                      value={[parseFloat(increasePercentage)]}
                      onValueChange={([val]) => setIncreasePercentage(val.toString())}
                      max={50}
                      step={0.5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={increasePercentage}
                      onChange={(e) => setIncreasePercentage(e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {results ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Your New Salary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center justify-center text-center gap-4">
                      <div className="p-4 rounded-lg bg-gray-100">
                        <p className="text-sm text-gray-600">Current Salary</p>
                        <p className="text-2xl font-semibold">
                          £{Number(currentSalary).toLocaleString()}
                        </p>
                      </div>
                      <ArrowRight className="text-gray-400 hidden sm:block" />
                      <div className="p-6 rounded-lg bg-green-100">
                        <p className="text-sm text-green-800">New Salary</p>
                        <p className="text-4xl font-bold text-green-900">
                          £{results.newSalary.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Annual Increase</CardTitle>
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        +£
                        {results.annualIncrease.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <p className="text-xs text-gray-500">before tax</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Monthly Increase</CardTitle>
                      <TrendingUp className="w-4 h-4 text-gray-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        +£
                        {results.monthlyIncrease.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </div>
                      <p className="text-xs text-gray-500">before tax</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-64">
                <p className="text-gray-500">Enter your details to see the results.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={salaryIncreaseFAQs} />
        </div>
      </div>
    </div>
  );
}
