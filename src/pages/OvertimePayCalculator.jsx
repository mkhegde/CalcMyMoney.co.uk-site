import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PoundSterling, Clock, TrendingUp } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const overtimeFAQs = [
  {
    question: 'Is my employer required to pay me for overtime?',
    answer:
      'In the UK, there is no automatic legal right to be paid for working extra hours. Your contract of employment should state whether you will be paid for overtime and at what rate. However, your average pay for the total hours you work must not fall below the National Minimum Wage.',
  },
  {
    question: 'What are typical overtime rates?',
    answer:
      "Common overtime rates are 'time-and-a-half' (1.5x your normal rate) and 'double time' (2x your normal rate). The specific rate depends on your employment contract and when the overtime is worked (e.g., weekends or bank holidays often have higher rates).",
  },
  {
    question: 'Does this calculator include tax?',
    answer:
      'No, this calculator shows your gross pay (before tax and other deductions). Overtime pay is taxed in the same way as your regular wages. You can use our main Salary Calculator to see the impact on your take-home pay.',
  },
];

export default function OvertimePayCalculator() {
  const [hourlyRate, setHourlyRate] = useState('15');
  const [standardHours, setStandardHours] = useState('40');
  const [overtimeHours, setOvertimeHours] = useState('10');
  const [overtimeMultiplier, setOvertimeMultiplier] = useState('1.5');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const rate = Number(hourlyRate) || 0;
    const stdHours = Number(standardHours) || 0;
    const otHours = Number(overtimeHours) || 0;
    const otMulti = Number(overtimeMultiplier) || 1;

    if (rate <= 0 || stdHours < 0 || otHours < 0) {
      setResults(null);
      return;
    }

    const standardPay = rate * stdHours;
    const overtimeRate = rate * otMulti;
    const overtimePay = overtimeRate * otHours;
    const totalPay = standardPay + overtimePay;

    setResults({ standardPay, overtimePay, totalPay, overtimeRate });
  }, [hourlyRate, standardHours, overtimeHours, overtimeMultiplier]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Overtime Pay Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Calculate your total gross pay including standard hours and overtime earnings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Work Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="hourlyRate">Standard Hourly Rate (£)</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="standardHours">Standard Hours per Week</Label>
                  <Input
                    id="standardHours"
                    type="number"
                    value={standardHours}
                    onChange={(e) => setStandardHours(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeHours">Overtime Hours per Week</Label>
                  <Input
                    id="overtimeHours"
                    type="number"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="overtimeMultiplier">
                    Overtime Rate Multiplier (e.g., 1.5 for time-and-a-half)
                  </Label>
                  <Input
                    id="overtimeMultiplier"
                    type="number"
                    value={overtimeMultiplier}
                    onChange={(e) => setOvertimeMultiplier(e.target.value)}
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
                    <CardTitle className="text-green-900">Total Gross Pay</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-5xl font-bold text-green-900">
                      £{results.totalPay.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-green-700 mt-1">for the week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Pay Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span>Standard Pay ({standardHours} hrs):</span>
                      <span className="font-semibold">
                        £{results.standardPay.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span>
                        Overtime Pay ({overtimeHours} hrs at £{results.overtimeRate}/hr):
                      </span>
                      <span className="font-semibold text-blue-700">
                        £{results.overtimePay.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-gray-500">Enter details to calculate your pay.</p>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-12 non-printable">
          <FAQSection faqs={overtimeFAQs} />
        </div>
      </div>
    </div>
  );
}
