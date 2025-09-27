import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PoundSterling, Calculator, Scale, AlertCircle, CheckCircle } from 'lucide-react';

// Rates for 2024/2025 - check gov.uk for latest figures
const wageRates = {
  '21+': 11.44,
  '18-20': 8.6,
  'under-18': 6.4,
  apprentice: 6.4,
};

export default function MinimumWageCalculator() {
  const [ageGroup, setAgeGroup] = useState('21+');
  const [pay, setPay] = useState('');
  const [hours, setHours] = useState('');
  const [payPeriod, setPayPeriod] = useState('weekly');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const currentPay = Number(pay) || 0;
    const currentHours = Number(hours) || 0;

    if (currentPay <= 0 || currentHours <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    let effectiveHourlyRate = 0;
    if (payPeriod === 'hourly') {
      effectiveHourlyRate = currentPay;
    } else if (payPeriod === 'weekly') {
      effectiveHourlyRate = currentPay / currentHours;
    } else if (payPeriod === 'monthly') {
      // Approximate weekly hours from monthly
      effectiveHourlyRate = currentPay / (currentHours * 4.333);
    }

    const minimumRate = wageRates[ageGroup];
    const difference = effectiveHourlyRate - minimumRate;
    const weeklyDifference =
      difference *
      (payPeriod === 'weekly' || payPeriod === 'monthly'
        ? currentHours
        : payPeriod === 'hourly'
          ? 40
          : 0); // Assume 40h week for hourly rate comparison

    setResults({
      effectiveHourlyRate,
      minimumRate,
      difference,
      weeklyDifference,
    });
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [ageGroup, pay, hours, payPeriod]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              UK Minimum Wage Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Are you being paid correctly? Check your wage against the UK's National Minimum Wage
              and National Living Wage rates.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Pay Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Your Age Group</Label>
                  <Select value={ageGroup} onValueChange={setAgeGroup}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="21+">21 and over (National Living Wage)</SelectItem>
                      <SelectItem value="18-20">18 to 20</SelectItem>
                      <SelectItem value="under-18">Under 18</SelectItem>
                      <SelectItem value="apprentice">Apprentice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Pay (before tax)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      type="number"
                      value={pay}
                      onChange={(e) => setPay(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Hours Worked</Label>
                  <Input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="e.g. 40"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pay Period</Label>
                  <Select value={payPeriod} onValueChange={setPayPeriod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Per Hour</SelectItem>
                      <SelectItem value="weekly">Per Week</SelectItem>
                      <SelectItem value="monthly">Per Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Check My Wage
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <Card
                  className={
                    results.difference >= 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                  }
                >
                  <CardHeader>
                    <CardTitle
                      className={`flex items-center gap-2 ${results.difference >= 0 ? 'text-green-800' : 'text-red-800'}`}
                    >
                      {results.difference >= 0 ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : (
                        <AlertCircle className="w-6 h-6" />
                      )}
                      Pay Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    {results.difference >= 0 ? (
                      <div>
                        <p className="text-green-700">
                          Your effective hourly rate appears to be above the minimum wage.
                        </p>
                        <p className="text-4xl font-bold text-green-900 mt-2">
                          £{results.effectiveHourlyRate.toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          Minimum for your age: £{results.minimumRate.toFixed(2)} per hour
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-red-700">
                          Your effective hourly rate appears to be <strong>below</strong> the
                          minimum wage.
                        </p>
                        <p className="text-4xl font-bold text-red-900 mt-2">
                          £{results.effectiveHourlyRate.toFixed(2)}
                        </p>
                        <p className="text-gray-600">
                          Minimum for your age: £{results.minimumRate.toFixed(2)} per hour
                        </p>
                        <p className="text-red-800 font-semibold mt-4">
                          You may be underpaid by approximately £
                          {Math.abs(results.weeklyDifference).toFixed(2)} per week.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>What to do next</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-700 space-y-3">
                    <p>
                      This calculator provides an estimate. Certain deductions can affect the
                      calculation.
                    </p>
                    <p>If you believe you are being underpaid:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Speak to your employer first. It could be a simple mistake.</li>
                      <li>
                        Contact ACAS (Advisory, Conciliation and Arbitration Service) for free,
                        impartial advice.
                      </li>
                      <li>
                        You can make a confidential complaint to HMRC, who can investigate on your
                        behalf.
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Scale className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Check your pay</h3>
                  <p>Enter your details to see if you're being paid the correct minimum wage.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
