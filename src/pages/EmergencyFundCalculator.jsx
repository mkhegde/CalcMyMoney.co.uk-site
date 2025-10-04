import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, ShieldCheck } from 'lucide-react';
import Heading from '@/components/common/Heading';

export default function EmergencyFundCalculator() {
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const expenses = Number(monthlyExpenses) || 0;
    if (expenses <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    setResults({
      threeMonthFund: expenses * 3,
      sixMonthFund: expenses * 6,
      twelveMonthFund: expenses * 12,
    });
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [monthlyExpenses]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Emergency Fund Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Life is unpredictable. A financial safety net provides peace of mind when you need it
              most.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Expenses</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="monthlyExpenses">Essential Monthly Expenses</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="monthlyExpenses"
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 1800"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Include rent/mortgage, bills, groceries, and transport.
                  </p>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Fund Size
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {hasCalculated && results ? (
              <Card>
                <CardHeader>
                  <CardTitle>Your Emergency Fund Goal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">3 Months (Bare Minimum)</p>
                    <p className="text-2xl font-bold text-green-900">
                      £{results.threeMonthFund.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">6 Months (Recommended)</p>
                    <p className="text-2xl font-bold text-blue-900">
                      £{results.sixMonthFund.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">12 Months (Very Secure)</p>
                    <p className="text-2xl font-bold text-purple-900">
                      £{results.twelveMonthFund.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 pt-4 border-t">
                    Store your emergency fund in an easy-access savings account.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Build your safety net</h3>
                  <p>Enter your expenses to see your recommended fund size.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
