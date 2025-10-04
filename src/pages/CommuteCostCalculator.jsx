import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Car, Train, Calculator } from 'lucide-react';

import Heading from '@/components/common/Heading';
export default function CommuteCostCalculator() {
  const [distance, setDistance] = useState('');
  const [mpg, setMpg] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [days, setDays] = useState('');
  const [publicTransport, setPublicTransport] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const dist = Number(distance) || 0;
    const vehicleMpg = Number(mpg) || 0;
    const pricePerLitre = Number(fuelPrice) || 0;
    const workDays = Number(days) || 0;
    const ptCost = Number(publicTransport) || 0;

    const LITRES_PER_GALLON = 4.54609;
    const dailyFuelLitres = (dist / vehicleMpg) * LITRES_PER_GALLON;
    const dailyFuelCost = dailyFuelLitres * pricePerLitre;
    const totalDriveCost = dailyFuelCost * workDays * 4.33; // 4.33 weeks in a month
    const totalPTCost = ptCost * workDays * 4.33;

    setResults({
      monthly: totalDriveCost + totalPTCost,
      weekly: (totalDriveCost + totalPTCost) / 4.33,
    });
    setHasCalculated(true);
  }, [distance, mpg, fuelPrice, days, publicTransport]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Commute Cost Calculator</Heading>
        </div>
      </div>
      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Your Commute</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Daily Round-Trip Distance (miles)</Label>
                <Input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 20"
                />
              </div>
              <div>
                <Label>Car MPG</Label>
                <Input
                  type="number"
                  value={mpg}
                  onChange={(e) => setMpg(e.target.value)}
                  placeholder="e.g. 45"
                />
              </div>
              <div>
                <Label>Fuel Price per Litre (£)</Label>
                <Input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="e.g. 1.50"
                />
              </div>
              <div>
                <Label>Daily Public Transport Cost (£)</Label>
                <Input
                  type="number"
                  value={publicTransport}
                  onChange={(e) => setPublicTransport(e.target.value)}
                  placeholder="e.g. 0"
                />
              </div>
              <div>
                <Label>Commute Days per Week</Label>
                <Input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  placeholder="e.g. 5"
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
              <Card className="bg-indigo-50 border-indigo-200">
                <CardHeader>
                  <CardTitle>Estimated Monthly Commute Cost</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-5xl font-bold text-indigo-700">
                    £{results.monthly.toFixed(2)}
                  </p>
                  <p className="text-sm mt-2">~£{results.weekly.toFixed(2)} per week</p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Car className="w-10 h-10 mx-auto mb-2" />
                  <p>Find out how much your commute costs.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
