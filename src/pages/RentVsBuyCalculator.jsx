import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Home, Key, Calculator } from 'lucide-react';
import Heading from '@/components/common/Heading';

export default function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = useState('');
  const [propertyPrice, setPropertyPrice] = useState('');
  const [deposit, setDeposit] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [maintenance, setMaintenance] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = useCallback(() => {
    const rent = Number(monthlyRent) || 0;
    const price = Number(propertyPrice) || 0;
    const dep = Number(deposit) || 0;
    const rate = Number(interestRate) / 100;
    const maint = Number(maintenance) / 100;

    if (rent <= 0 || price <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const loan = price - dep;
    const monthlyMortgage =
      loan > 0 ? (loan * (rate / 12)) / (1 - Math.pow(1 + rate / 12, -30 * 12)) : 0;
    const monthlyMaintenance = (price * maint) / 12;
    const monthlyOwnershipCost = monthlyMortgage + monthlyMaintenance;

    setResults({ rent, ownershipCost: monthlyOwnershipCost });
    setHasCalculated(true);
  }, [monthlyRent, propertyPrice, deposit, interestRate, maintenance]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Heading as="h1" size="h1" weight="bold" className="text-center">Rent vs. Buy Calculator</Heading>
        </div>
      </div>
      <div className="max-w-7xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Renting Costs</CardTitle>
            </CardHeader>
            <CardContent>
              <Label>Monthly Rent (£)</Label>
              <Input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="e.g. 1200"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Buying Costs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label>Property Price (£)</Label>
              <Input
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="e.g. 250000"
              />
              <Label>Deposit (£)</Label>
              <Input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="e.g. 25000"
              />
              <Label>Mortgage Rate (%)</Label>
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="e.g. 5"
              />
              <Label>Annual Maintenance (%)</Label>
              <Input
                type="number"
                value={maintenance}
                onChange={(e) => setMaintenance(e.target.value)}
                placeholder="e.g. 1"
              />
            </CardContent>
            <CardFooter>
              <Button onClick={handleCalculate} className="w-full text-lg">
                <Calculator className="w-5 h-5 mr-2" />
                Compare Costs
              </Button>
            </CardFooter>
          </Card>
          <div>
            {hasCalculated && results ? (
              <Card className="bg-blue-50 border-blue-200 h-full">
                <CardHeader>
                  <CardTitle>Monthly Cost Comparison</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-lg">Renting</p>
                      <p className="text-3xl font-bold">£{results.rent.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-lg">Owning</p>
                      <p className="text-3xl font-bold">
                        £
                        {results.ownershipCost.toLocaleString('en-GB', {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`mt-4 font-bold ${results.ownershipCost < results.rent ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {results.ownershipCost < results.rent
                      ? 'Buying appears cheaper monthly.'
                      : 'Renting appears cheaper monthly.'}
                  </p>
                  <p className="text-xs mt-2 text-gray-500">
                    Note: This is a simplified comparison and does not include house price
                    appreciation or other investment factors.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[220px]">
                <div className="text-center text-gray-500">
                  <Key className="w-10 h-10 mx-auto mb-2" />
                  <p>Which path is cheaper per month?</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
