import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PoundSterling, Calculator, ArrowRightLeft, Calendar, Clock } from 'lucide-react';
import Heading from '@/components/common/Heading';

export default function HourlyToAnnualSalaryCalculator() {
  const [hourlyRate, setHourlyRate] = useState('');
  const [hoursPerWeek, setHoursPerWeek] = useState('37.5');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const rate = Number(hourlyRate) || 0;
    const hours = Number(hoursPerWeek) || 0;

    if (rate <= 0 || hours <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const weekly = rate * hours;
    const monthly = weekly * 4.333; // Average weeks in a month
    const annual = weekly * 52;

    setResults({ weekly, monthly, annual });
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [hourlyRate, hoursPerWeek]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Hourly to Annual Salary Converter
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Quickly convert your hourly wage into weekly, monthly, and annual gross salary
              figures.
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
                  <Label htmlFor="hourlyRate">Your Hourly Rate</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 15.50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek">Hours Worked Per Week</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="hoursPerWeek"
                      type="number"
                      value={hoursPerWeek}
                      onChange={(e) => setHoursPerWeek(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <ArrowRightLeft className="w-5 h-5 mr-2" />
                  Convert
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Your Salary Conversion</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Weekly Salary</p>
                    <p className="text-2xl font-bold text-gray-900">
                      £{results.weekly.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <p className="text-sm text-gray-500">Monthly Salary (approx.)</p>
                    <p className="text-2xl font-bold text-gray-900">
                      £{results.monthly.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="text-center p-6 bg-blue-100 rounded-lg">
                    <p className="text-lg font-medium text-blue-800">Annual Gross Salary</p>
                    <p className="text-4xl font-extrabold text-blue-900">
                      £{results.annual.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">See the bigger picture</h3>
                  <p>Enter your hourly rate to see your annual earnings.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
