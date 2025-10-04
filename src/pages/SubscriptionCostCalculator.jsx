import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Repeat, Calculator } from 'lucide-react';

import Heading from '@/components/common/Heading';
export default function SubscriptionCostCalculator() {
  const [subs, setSubs] = useState([{ id: 1, name: '', amount: '' }]);
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleSubChange = (id, field, value) => {
    const newSubs = subs.map((sub) => (sub.id === id ? { ...sub, [field]: value } : sub));
    setSubs(newSubs);
  };

  const addSub = () => setSubs([...subs, { id: Date.now(), name: '', amount: '' }]);
  const removeSub = (id) => setSubs(subs.filter((sub) => sub.id !== id));

  const handleCalculate = useCallback(() => {
    const monthlyTotal = subs.reduce((acc, sub) => acc + (Number(sub.amount) || 0), 0);
    setResults({ monthly: monthlyTotal, annual: monthlyTotal * 12 });
    setHasCalculated(true);
  }, [subs]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Subscription Cost Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Monthly Subscriptions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {subs.map((sub) => (
                <div key={sub.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="e.g. Netflix"
                    value={sub.name}
                    onChange={(e) => handleSubChange(sub.id, 'name', e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="e.g. 10.99"
                    value={sub.amount}
                    onChange={(e) => handleSubChange(sub.id, 'amount', e.target.value)}
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeSub(sub.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" onClick={addSub}>
                <Plus className="w-4 h-4 mr-2" />
                Add Subscription
              </Button>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate Total
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && results ? (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardHeader>
                  <CardTitle>Total Subscription Cost</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p>Monthly Total</p>
                  <p className="text-4xl font-bold text-yellow-800">
                    £{results.monthly.toFixed(2)}
                  </p>
                  <p className="pt-4">Annual Total</p>
                  <p className="text-3xl font-bold">£{results.annual.toFixed(2)}</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Repeat className="w-10 h-10 mx-auto mb-2" />
                  <p>Add your subscriptions to see the total.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
