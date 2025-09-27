import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, TrendingUp, Wallet, ArrowRight } from 'lucide-react';

// Simplified tax/NI calculation, should be replaced with a robust shared function in a real app
const calculateTakeHome = (salary) => {
  const personalAllowance = 12570;
  let tax = 0;
  let ni = 0;
  const taxableIncome = Math.max(0, salary - personalAllowance);
  if (taxableIncome > 0) {
    if (taxableIncome <= 37700) tax += taxableIncome * 0.2;
    else if (taxableIncome <= 125140) tax += 37700 * 0.2 + (taxableIncome - 37700) * 0.4;
    else tax += 37700 * 0.2 + (125140 - 37700) * 0.4 + (taxableIncome - 125140) * 0.45;
  }
  const niableIncome = Math.max(0, salary - 12570);
  if (niableIncome > 0) {
    if (niableIncome <= 37700) ni += niableIncome * 0.08;
    else ni += 37700 * 0.08 + (niableIncome - 37700) * 0.02;
  }
  return salary - tax - ni;
};

export default function OvertimeBonusCalculator() {
  const [baseSalary, setBaseSalary] = useState('');
  const [extraPay, setExtraPay] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const salary = Number(baseSalary) || 0;
    const bonus = Number(extraPay) || 0;

    if (salary <= 0 || bonus <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const originalTakeHome = calculateTakeHome(salary);
    const newGrossSalary = salary + bonus;
    const newTakeHome = calculateTakeHome(newGrossSalary);

    const actualBonusReceived = newTakeHome - originalTakeHome;
    const deductionsOnBonus = bonus - actualBonusReceived;
    const effectiveTaxRateOnBonus = (deductionsOnBonus / bonus) * 100;

    setResults({
      actualBonusReceived,
      deductionsOnBonus,
      effectiveTaxRateOnBonus,
      bonus,
    });
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [baseSalary, extraPay]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Overtime & Bonus Tax Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Worked extra hours or got a bonus? Find out how much you'll actually take home after
              tax and NI.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Pay</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="baseSalary">Your Normal Annual Salary</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="baseSalary"
                      type="number"
                      value={baseSalary}
                      onChange={(e) => setBaseSalary(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extraPay">Overtime/Bonus Amount (Gross)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="extraPay"
                      type="number"
                      value={extraPay}
                      onChange={(e) => setExtraPay(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 5000"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Net Gain
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                      <Wallet className="w-6 h-6" />
                      Your Net Gain
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-green-700">
                      From a £{results.bonus.toLocaleString()} bonus, you take home:
                    </p>
                    <p className="text-4xl font-bold text-green-900 mt-2">
                      £
                      {results.actualBonusReceived.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Breakdown of Your Extra Pay</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Gross Bonus/Overtime:</span>
                      <span className="font-semibold text-lg">
                        £{results.bonus.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Estimated Tax & NI on this amount:</span>
                      <span className="font-semibold text-lg text-red-600">
                        -£
                        {results.deductionsOnBonus.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-3 mt-3">
                      <span className="font-bold">Net Amount in Your Pocket:</span>
                      <span className="font-bold text-lg text-green-700">
                        £
                        {results.actualBonusReceived.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-800">
                        This represents an effective tax rate of
                        <span className="font-bold">
                          {' '}
                          {results.effectiveTaxRateOnBonus.toFixed(1)}%{' '}
                        </span>
                        on your extra pay.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">How much do you keep?</h3>
                  <p>Enter your salary and extra pay to find out.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
