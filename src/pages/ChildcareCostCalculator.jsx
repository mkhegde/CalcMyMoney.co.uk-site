import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Baby, Calculator } from 'lucide-react';
import Heading from '@/components/common/Heading';

export default function ChildcareCostCalculator() {
  const [cost, setCost] = useState('');
  const [days, setDays] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const c = Number(cost) || 0;
    const d = Number(days) || 0;

    const weekly = c * d;
    const monthly = weekly * 4.33;
    const annual = monthly * 12;

    setResults({ weekly, monthly, annual });
    setHasCalculated(true);
  }, [cost, days]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Childcare Cost Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Childcare Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Daily Cost (£)</Label>
                <Input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  placeholder="e.g. 60"
                />
              </div>
              <div>
                <Label>Days per Week</Label>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g. 4"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && results ? (
              <Card className="bg-pink-50 border-pink-200">
                <CardHeader>
                  <CardTitle>Estimated Costs</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Weekly</p>
                  <p className="text-3xl font-bold">£{results.weekly.toLocaleString()}</p>
                  <p className="pt-2">Monthly</p>
                  <p className="text-4xl font-bold text-pink-700">
                    £{results.monthly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="pt-2">Annual</p>
                  <p className="text-3xl font-bold">
                    £{results.annual.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Baby className="w-10 h-10 mx-auto mb-2" />
                  <p>Enter details to see cost estimates.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
