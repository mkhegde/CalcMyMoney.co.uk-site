import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { PoundSterling, Percent, Calculator, TrendingUp } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const commissionFAQs = [
  {
    question: 'What is a commission?',
    answer:
      'A commission is a form of variable-pay remuneration for services rendered or products sold. Commissions are a common way to reward sales staff and are typically a percentage of the revenue generated.',
  },
  {
    question: 'Is commission income taxable?',
    answer:
      'Yes, commission earnings are considered part of your total income and are subject to Income Tax and National Insurance contributions, just like a regular salary.',
  },
  {
    question: 'What are common commission structures?',
    answer:
      'Commission structures vary widely. They can be a straight percentage of sales, tiered (where the percentage increases as sales targets are met), or based on gross margin. This calculator uses a simple, straight percentage model.',
  },
  {
    question: 'A Note on Calculations',
    answer:
      'This tool calculates the gross commission amount before any deductions. To understand the impact on your net pay, you would need to add this commission amount to your salary and use the main UK Salary Calculator.',
  },
];

export default function CommissionCalculator() {
  const [revenue, setRevenue] = useState('10000');
  const [commissionRate, setCommissionRate] = useState('10');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const rev = Number(revenue) || 0;
    const rate = Number(commissionRate) / 100;

    if (rev <= 0 || rate < 0) {
      setResults(null);
      return;
    }

    const commissionEarned = rev * rate;

    setResults({ commissionEarned });
  }, [revenue, commissionRate]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Commission Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quickly calculate your commission earnings based on sales revenue and commission rate.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Enter Your Figures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="revenue">Total Revenue / Sales Amount (£)</Label>
                  <div className="relative mt-1">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="revenue"
                      type="number"
                      value={revenue}
                      onChange={(e) => setRevenue(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider
                      value={[parseFloat(commissionRate)]}
                      onValueChange={([val]) => setCommissionRate(val.toString())}
                      max={100}
                      step={0.5}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      value={commissionRate}
                      onChange={(e) => setCommissionRate(e.target.value)}
                      className="w-24 text-center"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            {results ? (
              <div className="space-y-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Commission Earned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {' '}
                    {/* Removed className="text-center" */}
                    <p className="text-5xl font-bold text-green-900">
                      £
                      {results.commissionEarned.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-sm text-green-700 mt-2">
                      {' '}
                      {/* Changed text and mt-1 to mt-2 */}
                      This is your gross commission before any tax deductions.
                    </p>
                  </CardContent>
                </Card>
                <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                  A {commissionRate}% commission on sales of £{Number(revenue).toLocaleString()}{' '}
                  results in gross earnings of £
                  {results.commissionEarned.toLocaleString('en-GB', { maximumFractionDigits: 2 })}.
                </div>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-gray-500">Enter details to calculate commission.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={commissionFAQs} />
        </div>
      </div>
    </div>
  );
}
