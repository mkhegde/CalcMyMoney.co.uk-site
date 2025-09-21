import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator, Briefcase, AlertTriangle } from "lucide-react";

// Statutory limits for 2024/2025 - check gov.uk for latest figures
const MAX_WEEKLY_PAY = 700;
const MAX_SERVICE_YEARS = 20;

export default function RedundancyPayCalculator() {
  const [age, setAge] = useState('');
  const [yearsOfService, setYearsOfService] = useState('');
  const [weeklyPay, setWeeklyPay] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const currentAge = Number(age) || 0;
    const service = Math.min(Number(yearsOfService) || 0, MAX_SERVICE_YEARS);
    const pay = Number(weeklyPay) || 0;
    const cappedPay = Math.min(pay, MAX_WEEKLY_PAY);

    if (currentAge < 18 || service < 2) {
      setResults({ redundancyPay: 0, message: "You must have at least 2 years of continuous service." });
      setHasCalculated(true);
      return;
    }

    let totalWeeks = 0;
    for (let i = 0; i < service; i++) {
      const ageAtYearOfService = currentAge - i;
      if (ageAtYearOfService >= 41) {
        totalWeeks += 1.5;
      } else if (ageAtYearOfService >= 22) {
        totalWeeks += 1.0;
      } else {
        totalWeeks += 0.5;
      }
    }
    
    // The number of weeks is capped at 20 years of service, but the calculation method above implicitly handles this by iterating up to `service` which is capped at 20. Total weeks can exceed 20 (e.g. 20 years at 1.5 weeks/year = 30 weeks).

    const redundancyPay = totalWeeks * cappedPay;

    setResults({ redundancyPay, cappedPay, totalWeeks, message: null });
    setHasCalculated(true);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [age, yearsOfService, weeklyPay]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Statutory Redundancy Pay Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              If you're facing redundancy, know your rights. Calculate your estimated statutory redundancy entitlement.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader><CardTitle>Your Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="age">Age at Redundancy</Label>
                  <Input id="age" type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 45" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsOfService">Full Years of Service</Label>
                  <Input id="yearsOfService" type="number" value={yearsOfService} onChange={(e) => setYearsOfService(e.target.value)} placeholder="e.g. 10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weeklyPay">Average Weekly Pay (before tax)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="weeklyPay" type="number" value={weeklyPay} onChange={(e) => setWeeklyPay(e.target.value)} className="pl-10" placeholder="e.g. 600" />
                  </div>
                  <p className="text-xs text-gray-500">Weekly pay is capped at £{MAX_WEEKLY_PAY} for this calculation.</p>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Pay
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <Card className="bg-blue-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                      <Briefcase className="w-6 h-6" />
                      Estimated Statutory Pay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-4xl font-bold text-blue-900">
                      £{results.redundancyPay.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                    </p>
                    {results.message && <p className="text-red-600 mt-2">{results.message}</p>}
                    {!results.message && (
                      <p className="text-gray-600 mt-2">
                        Based on {results.totalWeeks.toFixed(1)} weeks at a capped weekly pay of £{results.cappedPay.toLocaleString()}.
                      </p>
                    )}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Important Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-gray-700">
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        This is an estimate of your <strong>statutory</strong> redundancy pay only. Your employer may offer a more generous contractual redundancy package.
                      </div>
                    </div>
                    <ul className="list-disc list-inside space-y-2">
                      <li>You must have at least 2 years of continuous service to qualify for statutory redundancy pay.</li>
                      <li>The first £30,000 of redundancy pay is usually tax-free.</li>
                      <li>This calculator uses the rates for England, Scotland, and Wales.</li>
                      <li>Always check your contract and consult with ACAS or a legal professional for advice.</li>
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Calculate Your Entitlement</h3>
                  <p>Fill in your details to get an estimate of your statutory redundancy pay.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}