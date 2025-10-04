import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, TrendingUp, Percent, Calendar } from 'lucide-react';
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
import FAQSection from '../components/calculators/FAQSection';
import Heading from '@/components/common/Heading';

const investmentFAQs = [
  {
    question: 'What is compound growth?',
    answer:
      "Compound growth is the 'snowball effect' where your investment earnings start to generate their own earnings. Over time, this can lead to exponential growth.",
  },
  {
    question: 'What is a realistic annual return rate?',
    answer:
      'This varies greatly depending on the investment type. The S&P 500 has historically averaged around 10% annually, but past performance is not indicative of future results. A diversified portfolio might aim for 5-8%.',
  },
  {
    question: 'How do fees impact my investment returns?',
    answer:
      'Fees can significantly erode your returns over time. A 1% annual fee on a £100,000 portfolio costs you £1,000 per year, which could have been compounding and growing. Always look for low-cost investment options where possible.',
  },
];

const generateChartData = (initial, monthly, rate, term) => {
  const data = [];
  const monthlyRate = rate / 12;

  for (let year = 0; year <= term; year++) {
    // Calculate total value at the end of 'year'
    // This calculates it from scratch for each year, not cumulatively year over year
    const totalMonths = year * 12;
    const futureValueInitial = initial * Math.pow(1 + monthlyRate, totalMonths);
    // Handle monthly contribution for the given number of months
    const futureValueMonthly =
      monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalValue = futureValueInitial + futureValueMonthly;

    data.push({
      year: year,
      'Total Investment': totalValue.toFixed(0),
      Principal: (initial + monthly * totalMonths).toFixed(0),
    });
  }
  return data;
};

export default function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('250');
  const [years, setYears] = useState('20');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const initial = Number(initialInvestment) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const term = Number(years) || 0;
    const rate = Number(annualReturn) / 100;

    // Critical: Check for rate <= 0 to prevent division by zero in monthlyRate calculations
    if (term <= 0 || rate <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const monthlyRate = rate / 12;
    const totalMonths = term * 12;

    const futureValueInitial = initial * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueMonthly =
      monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalValue = futureValueInitial + futureValueMonthly;

    const totalPrincipal = initial + monthly * totalMonths;
    const totalInterest = totalValue - totalPrincipal;

    const chartData = generateChartData(initial, monthly, rate, term);

    setResults({
      totalValue,
      totalPrincipal,
      totalInterest,
      chartData,
    });
    setHasCalculated(true);
  }, [initialInvestment, monthlyContribution, years, annualReturn]); // Dependencies for useCallback

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]); // useEffect now depends on the memoized handleCalculate

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              Investment &amp; Savings Growth Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Visualise the power of compound growth. Project the future value of your investments
              with regular contributions.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Investment Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Initial Investment</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                      value={initialInvestment}
                      onChange={(e) => setInitialInvestment(e.target.value)}
                      className="pl-10"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>
                <div>
                  <Label>Monthly Contribution</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                    <Input
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="pl-10"
                      type="number"
                      inputMode="numeric"
                      pattern="[0-9]*"
                    />
                  </div>
                </div>
                <div>
                  <Label>Time in Years</Label>
                  <Input
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                </div>
                <div>
                  <Label>Estimated Annual Return (%)</Label>
                  <Input
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(e.target.value)}
                    type="number"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    step="0.1"
                  />
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Growth
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3 space-y-6">
            {hasCalculated && results ? (
              <>
                <Card className="text-center bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle>Projected Future Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-5xl font-bold text-green-800">
                      £{results.totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-sm text-gray-600">after {years} years</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contributions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">
                        £
                        {results.totalPrincipal.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-sm text-gray-500">Total amount you invested.</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Interest Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold">
                        £
                        {results.totalInterest.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                      <p className="text-sm text-gray-500">The power of compounding.</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Growth Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={results.chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="year"
                          label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                        />
                        <YAxis tickFormatter={(value) => `£${Number(value) / 1000}k`} />
                        <Tooltip formatter={(value) => `£${Number(value).toLocaleString()}`} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="Total Investment"
                          stroke="#16a34a"
                          strokeWidth={2}
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="Principal"
                          stroke="#6b7280"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[400px] bg-gray-50">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Project your investment growth</h3>
                  <p>Fill in your details to see the results.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12 non-printable">
          <FAQSection faqs={investmentFAQs} />
        </div>
      </div>
    </div>
  );
}
