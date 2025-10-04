import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  PoundSterling,
  Calculator,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Wallet,
} from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import Heading from '@/components/common/Heading';

const calculateTakeHome = (salary) => {
  // Simplified tax/NI calculation for demonstration purposes
  // A real implementation would use the detailed logic from the main Salary Calculator
  const personalAllowance = 12570;
  const niThreshold = 12570;

  let tax = 0;
  let ni = 0;

  const taxableIncome = Math.max(0, salary - personalAllowance);

  if (taxableIncome > 0) {
    if (taxableIncome <= 50270 - personalAllowance) {
      tax = taxableIncome * 0.2;
    } else if (taxableIncome <= 125140 - personalAllowance) {
      tax = (50270 - personalAllowance) * 0.2 + (taxableIncome - (50270 - personalAllowance)) * 0.4;
    } else {
      tax =
        (50270 - personalAllowance) * 0.2 +
        (125140 - 50270) * 0.4 +
        (taxableIncome - (125140 - personalAllowance)) * 0.45;
    }
  }

  const niableIncome = Math.max(0, salary - niThreshold);
  if (niableIncome > 0) {
    if (niableIncome <= 50270 - niThreshold) {
      ni = niableIncome * 0.08;
    } else {
      ni = (50270 - niThreshold) * 0.08 + (niableIncome - (50270 - niThreshold)) * 0.02;
    }
  }

  return salary - tax - ni;
};

export default function SalarySacrificeCalculator() {
  const [grossSalary, setGrossSalary] = useState('');
  const [sacrificeAmount, setSacrificeAmount] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const salary = Number(grossSalary) || 0;
    const sacrifice = Number(sacrificeAmount) || 0;

    if (salary <= 0 || sacrifice <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const originalTakeHome = calculateTakeHome(salary);
    const originalPension = 0; // The sacrifice is the pension amount

    const newSalary = salary - sacrifice;
    const newTakeHome = calculateTakeHome(newSalary);
    const newPension = sacrifice;

    const takeHomeDifference = originalTakeHome - newTakeHome;
    const taxSaving = takeHomeDifference < sacrifice ? sacrifice - takeHomeDifference : 0;

    const newResults = {
      originalTakeHome,
      newTakeHome,
      newPension,
      takeHomeDifference,
      taxSaving,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Before Sacrifice', 'After Sacrifice'],
      ['Gross Salary', `£${salary.toFixed(2)}`, `£${newSalary.toFixed(2)}`],
      ['Pension Contribution', '£0.00', `£${newPension.toFixed(2)}`],
      ['Take-Home Pay', `£${originalTakeHome.toFixed(2)}`, `£${newTakeHome.toFixed(2)}`],
      ['', '', ''],
      ['Reduction in Take-Home', `£${takeHomeDifference.toFixed(2)}`, ''],
      ['Tax & NI Saving', `£${taxSaving.toFixed(2)}`, ''],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [grossSalary, sacrificeAmount]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 mb-4">
              Salary Sacrifice Calculator
            </Heading>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Pay less tax and boost your pension pot. See how sacrificing a portion of your salary
              can increase your overall wealth.
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
                  <Label htmlFor="grossSalary">Annual Gross Salary</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="grossSalary"
                      type="number"
                      value={grossSalary}
                      onChange={(e) => setGrossSalary(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 50000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sacrificeAmount">Annual Pension Sacrifice Amount</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="sacrificeAmount"
                      type="number"
                      value={sacrificeAmount}
                      onChange={(e) => setSacrificeAmount(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 3000"
                    />
                  </div>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Impact
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Sacrifice Summary</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="salary-sacrifice"
                    title="Salary Sacrifice Summary"
                  />
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Impact on Your Pay</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-around text-center">
                      <div>
                        <p className="text-sm text-gray-600">Original Take-Home</p>
                        <p className="text-2xl font-bold">
                          £
                          {results.originalTakeHome.toLocaleString('en-GB', {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">New Take-Home</p>
                        <p className="text-2xl font-bold text-blue-700">
                          £
                          {results.newTakeHome.toLocaleString('en-GB', {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <p className="text-sm text-red-800">Your take-home pay is reduced by:</p>
                      <p className="text-2xl font-bold text-red-900">
                        £
                        {results.takeHomeDifference.toLocaleString('en-GB', {
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Benefit of Sacrificing</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-sm text-green-800">
                      Your pension pot increases by £{results.newPension.toLocaleString()}, but your
                      take-home only reduces by £{results.takeHomeDifference.toLocaleString()}.
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-800">
                      Effective saving of £
                      {results.taxSaving.toLocaleString('en-GB', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-green-700">in tax and National Insurance.</p>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Wallet className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Boost your pension, tax-efficiently</h3>
                  <p>Enter your details to see the benefits.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
