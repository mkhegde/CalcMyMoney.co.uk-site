import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Percent, Activity, Calculator } from 'lucide-react';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const ruleOf72FAQs = [
  {
    question: 'What is the Rule of 72?',
    answer:
      'The Rule of 72 is a simple mental shortcut to estimate the number of years required to double your money at a given annual rate of return. You just divide 72 by the interest rate.',
  },
  {
    question: 'How accurate is it?',
    answer:
      "It's an approximation, but it's remarkably accurate for interest rates typically found in investment scenarios (e.g., 5% to 12%). It's most accurate at around 8%.",
  },
  {
    question: 'Why is it useful?',
    answer:
      'It provides a quick way to understand the power of compound interest without needing a complex calculator. It helps you grasp how a small difference in your return rate can significantly change how quickly your money grows.',
  },
];

export default function RuleOf72Calculator() {
  const [rate, setRate] = useState('');
  const [years, setYears] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const r = Number(rate) || 0;
    if (r > 0) {
      setYears(72 / r);
    } else {
      setYears(0);
    }
    setHasCalculated(true);
  }, [rate]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Rule of 72 Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Enter Interest Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Annual Rate of Return (%)</Label>
              <Input
                type="number"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="e.g. 7"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && years !== null ? (
              <Card className="bg-teal-50 border-teal-200">
                <CardHeader>
                  <CardTitle>Years to Double Your Money</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-6xl font-bold text-teal-700">
                    {years > 0 ? years.toFixed(1) : '...'}
                  </p>
                  <p className="text-sm mt-2">years (approx.)</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Activity className="w-10 h-10 mx-auto mb-2" />
                  <p>How long will it take to double?</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12">
          <FAQSection faqs={ruleOf72FAQs} />
        </div>
      </div>
    </div>
  );
}
