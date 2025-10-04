import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, Shield, AlertTriangle } from 'lucide-react';

import Heading from '@/components/common/Heading';
const SSP_WEEKLY_RATE = 116.75;
const SSP_MIN_WEEKLY_EARNINGS = 123;

export default function StatutorySickPayCalculator() {
  const [averageWeeklyEarnings, setAverageWeeklyEarnings] = useState('');
  const [daysOff, setDaysOff] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const awe = Number(averageWeeklyEarnings) || 0;
    const sickDays = Number(daysOff) || 0;

    if (awe < SSP_MIN_WEEKLY_EARNINGS || sickDays < 4) {
      setResults({ eligible: false, totalSSP: 0 });
      setHasCalculated(true);
      return;
    }

    // SSP is not paid for the first 3 'waiting days'
    const payableDays = Math.max(0, sickDays - 3);
    const weeklyRateForDays = (SSP_WEEKLY_RATE / 5) * Math.min(payableDays, 5); // Assuming a 5-day work week
    const weeksOff = Math.floor(payableDays / 5);
    const remainingDays = payableDays % 5;

    const totalSSP = weeksOff * SSP_WEEKLY_RATE + remainingDays * (SSP_WEEKLY_RATE / 5);

    setResults({
      eligible: true,
      totalSSP: Math.min(totalSSP, SSP_WEEKLY_RATE * 28), // Max 28 weeks
    });
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [averageWeeklyEarnings, daysOff]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Statutory Sick Pay (SSP) Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              If you're too ill to work, you may be entitled to SSP. Check your eligibility and
              estimate your pay.
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="awe">Average Weekly Earnings (AWE)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="awe"
                      type="number"
                      value={averageWeeklyEarnings}
                      onChange={(e) => setAverageWeeklyEarnings(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daysOff">Number of sick days</Label>
                  <Input
                    id="daysOff"
                    type="number"
                    value={daysOff}
                    onChange={(e) => setDaysOff(e.target.value)}
                    placeholder="e.g. 10"
                  />
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate SSP
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                {results.eligible ? (
                  <Card>
                    <CardHeader>
                      <CardTitle>Your SSP Entitlement</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-green-100 rounded-lg border-2 border-green-200">
                        <p className="text-sm font-bold text-green-800">Total Estimated SSP</p>
                        <p className="text-3xl font-bold text-green-900">
                          £{results.totalSSP.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className="text-xs text-gray-600 pt-4 mt-4 border-t">
                        SSP is paid for up to 28 weeks. The first 3 days are unpaid 'waiting days'.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardHeader className="flex-row items-center gap-3">
                      <AlertTriangle className="w-6 h-6 text-yellow-700" />
                      <CardTitle className="text-yellow-800">Not Eligible for SSP</CardTitle>
                    </CardHeader>
                    <CardContent className="text-yellow-800">
                      <p>
                        Based on the details provided, you may not be eligible for SSP. This is
                        usually because:
                      </p>
                      <ul className="list-disc list-inside mt-2">
                        <li>Your average weekly earnings are below £{SSP_MIN_WEEKLY_EARNINGS}.</li>
                        <li>You have been off sick for less than 4 days in a row.</li>
                      </ul>
                      <p className="mt-2">
                        You may be able to apply for Universal Credit or Employment and Support
                        Allowance (ESA).
                      </p>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Check your sick pay</h3>
                  <p>Enter your details to estimate your SSP.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
