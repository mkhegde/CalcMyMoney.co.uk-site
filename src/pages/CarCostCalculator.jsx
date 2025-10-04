import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Car, Calculator } from 'lucide-react';
import Heading from '@/components/common/Heading';

export default function CarCostCalculator() {
  const [price, setPrice] = useState('');
  const [years, setYears] = useState('');
  const [insurance, setInsurance] = useState('');
  const [tax, setTax] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [fuel, setFuel] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const p = Number(price) || 0;
    const y = Number(years) || 1;
    const ins = Number(insurance) || 0;
    const t = Number(tax) || 0;
    const maint = Number(maintenance) || 0;
    const f = Number(fuel) || 0;

    const depreciation = p * 0.6; // Simplified 60% over term
    const totalRunningCosts = (ins + t + maint) * y + f * 12 * y;
    const totalCost = depreciation + totalRunningCosts;

    setResults({
      total: totalCost,
      monthly: totalCost / (y * 12),
      annual: totalCost / y,
      years: y,
    });
    setHasCalculated(true);
  }, [price, years, insurance, tax, maintenance, fuel]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Total Car Cost Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Car Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Purchase Price (£)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g. 20000"
                />
              </div>
              <div>
                <Label>Ownership Term (Years)</Label>
                <Input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  placeholder="e.g. 5"
                />
              </div>
              <div>
                <Label>Annual Insurance (£)</Label>
                <Input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  placeholder="e.g. 800"
                />
              </div>
              <div>
                <Label>Annual Tax/MOT (£)</Label>
                <Input
                  type="number"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                  placeholder="e.g. 180"
                />
              </div>
              <div>
                <Label>Annual Maintenance (£)</Label>
                <Input
                  type="number"
                  value={maintenance}
                  onChange={(e) => setMaintenance(e.target.value)}
                  placeholder="e.g. 500"
                />
              </div>
              <div>
                <Label>Monthly Fuel Cost (£)</Label>
                <Input
                  type="number"
                  value={fuel}
                  onChange={(e) => setFuel(e.target.value)}
                  placeholder="e.g. 150"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Calculate True Cost
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && results ? (
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle>True Cost of Ownership</CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-sm">Total Cost over {results.years} years</p>
                  <p className="text-3xl font-bold">£{results.total.toLocaleString()}</p>
                  <p className="text-sm pt-2">Annual Cost</p>
                  <p className="text-2xl font-bold">
                    £{results.annual.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm pt-2">Monthly Cost</p>
                  <p className="text-4xl font-bold text-purple-700">
                    £{results.monthly.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Car className="w-10 h-10 mx-auto mb-2" />
                  <p>Discover the true cost of your car.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
