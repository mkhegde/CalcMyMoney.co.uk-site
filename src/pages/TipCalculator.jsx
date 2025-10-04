import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { HandCoins, Calculator } from 'lucide-react';

import Heading from '@/components/common/Heading';
export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('12.5');
  const [people, setPeople] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const b = Number(bill) || 0;
    const t = Number(tipPercent) / 100;
    const p = Number(people) || 1;

    const tipAmount = b * t;
    const total = b + tipAmount;
    const perPerson = total / p;

    setResults({ tipAmount, total, perPerson });
    setHasCalculated(true);
  }, [bill, tipPercent, people]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">UK Tip Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Bill Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Bill Amount (£)</Label>
                <Input
                  type="number"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  placeholder="e.g. 85.50"
                />
              </div>
              <div>
                <Label>Tip ({tipPercent}%)</Label>
                <Slider
                  value={[Number(tipPercent)]}
                  onValueChange={(v) => setTipPercent(String(v[0]))}
                  max={30}
                  step={0.5}
                />
              </div>
              <div>
                <Label>Number of People</Label>
                <Input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(e.target.value)}
                  placeholder="e.g. 4"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Split The Bill
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && results ? (
              <Card className="bg-lime-50 border-lime-200">
                <CardHeader>
                  <CardTitle>Split Amount</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Each Person Pays</p>
                  <p className="text-5xl font-bold text-lime-800">
                    £{results.perPerson.toFixed(2)}
                  </p>
                  <p className="text-sm pt-2">
                    Total Bill: £{results.total.toFixed(2)} (inc. £{results.tipAmount.toFixed(2)}{' '}
                    tip)
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <HandCoins className="w-10 h-10 mx-auto mb-2" />
                  <p>Easily split the bill with a tip.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
