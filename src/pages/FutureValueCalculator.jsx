import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PoundSterling, Percent, Calendar, TrendingUp } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

const fvFAQs = [
  {
    question: 'What is Future Value (FV)?',
    answer:
      'Future Value is a financial formula used to determine the value of a current asset at a specified date in the future, based on an assumed rate of growth. It helps you understand the power of compounding over time.',
  },
  {
    question: 'How is this different from the Compound Interest Calculator?',
    answer:
      'They are very similar! Both use the core principles of compounding. The Compound Interest Calculator is designed to show you the growth of regular savings over time. This Future Value calculator focuses on calculating the future worth of a single, one-time investment.',
  },
  {
    question: 'What can I use Future Value for?',
    answer:
      "It's great for financial planning. For example, you can use it to estimate how much a single investment of £10,000 today might be worth when you retire, helping you make informed decisions about your investment strategy.",
  },
];

export default function FutureValueCalculator() {
  const [presentValue, setPresentValue] = useState('10000');
  const [interestRate, setInterestRate] = useState('7');
  const [years, setYears] = useState('10');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const pv = Number(presentValue) || 0;
    const r = Number(interestRate) / 100;
    const t = Number(years) || 0;

    if (pv <= 0 || r < 0 || t <= 0) {
      setResults(null);
      return;
    }

    const futureValue = pv * Math.pow(1 + r, t);
    const totalInterest = futureValue - pv;

    setResults({ futureValue, totalInterest });
  }, [presentValue, interestRate, years]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Future Value Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calculate the future value of a single sum investment with compound interest.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="presentValue">Present Value (Current Investment) (£)</Label>
                  <Input
                    id="presentValue"
                    type="number"
                    value={presentValue}
                    onChange={(e) => setPresentValue(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="years">Number of Years</Label>
                  <Input
                    id="years"
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {results ? (
              <div className="space-y-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Future Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {' '}
                    {/* Removed text-center */}
                    <p className="text-5xl font-bold text-green-900">
                      £
                      {results.futureValue.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      {' '}
                      {/* Changed mt-1 to mt-2, text-blue-700 to text-green-700 */}
                      Total value after {years} years. {/* Updated text */}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Initial Investment:</span>
                      <span className="font-semibold">
                        £{Number(presentValue).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>Total Interest Earned:</span>
                      <span className="font-semibold text-green-700">
                        £
                        {results.totalInterest.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-gray-500">Enter details to calculate future value.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-8 non-printable">
          {' '}
          {/* Changed mt-12 to mt-8 */}
          <FAQSection faqs={fvFAQs} />
        </div>
      </div>
    </div>
  );
}
