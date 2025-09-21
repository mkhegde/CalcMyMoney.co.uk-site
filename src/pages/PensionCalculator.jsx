import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator, Shield, TrendingUp } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";

export default function PensionCalculator() {
  const [currentAge, setCurrentAge] = useState('');
  const [retirementAge, setRetirementAge] = useState('');
  const [currentPension, setCurrentPension] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [employerContribution, setEmployerContribution] = useState('');
  const [annualGrowth, setAnnualGrowth] = useState('');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const age = Number(currentAge) || 0;
    const retAge = Number(retirementAge) || 0;
    const current = Number(currentPension) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const employer = Number(employerContribution) || 0;
    const growth = Number(annualGrowth) || 0;

    if (retAge <= age) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const yearsToRetirement = retAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyGrowthRate = growth / 100 / 12;
    const totalMonthlyContribution = monthly + employer;

    // Future value of current pension
    const futureValueCurrent = current * Math.pow(1 + growth / 100, yearsToRetirement);

    // Future value of monthly contributions
    let futureValueContributions = 0;
    if (monthlyGrowthRate > 0) {
      futureValueContributions = totalMonthlyContribution * 
        ((Math.pow(1 + monthlyGrowthRate, monthsToRetirement) - 1) / monthlyGrowthRate);
    } else {
      futureValueContributions = totalMonthlyContribution * monthsToRetirement;
    }

    const totalPensionPot = futureValueCurrent + futureValueContributions;
    const totalContributions = current + (totalMonthlyContribution * monthsToRetirement);
    const totalGrowth = totalPensionPot - totalContributions;

    // Rough annual income estimate (4% rule)
    const estimatedAnnualIncome = totalPensionPot * 0.04;

    const newResults = {
      yearsToRetirement,
      totalPensionPot,
      totalContributions,
      totalGrowth,
      estimatedAnnualIncome,
      monthlyIncome: estimatedAnnualIncome / 12
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ["Metric", "Value"],
      ["Years to Retirement", yearsToRetirement.toString()],
      ["Total Pension Pot", `£${totalPensionPot.toFixed(2)}`],
      ["Total Contributions", `£${totalContributions.toFixed(2)}`],
      ["Investment Growth", `£${totalGrowth.toFixed(2)}`],
      ["Estimated Annual Income", `£${estimatedAnnualIncome.toFixed(2)}`],
      ["Estimated Monthly Income", `£${(estimatedAnnualIncome / 12).toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [currentAge, retirementAge, currentPension, monthlyContribution, employerContribution, annualGrowth]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              UK Pension Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The best time to plant a tree was 20 years ago. The second best time is now. Start planning your retirement today.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader><CardTitle>Your Pension Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentAge">Current Age</Label>
                    <Input id="currentAge" type="number" value={currentAge} onChange={e => setCurrentAge(e.target.value)} placeholder="e.g. 35" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retirementAge">Retirement Age</Label>
                    <Input id="retirementAge" type="number" value={retirementAge} onChange={e => setRetirementAge(e.target.value)} placeholder="e.g. 65" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPension">Current Pension Pot</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="currentPension" type="number" value={currentPension} onChange={e => setCurrentPension(e.target.value)} className="pl-10" placeholder="e.g. 25000" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Your Monthly Contribution</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="monthlyContribution" type="number" value={monthlyContribution} onChange={e => setMonthlyContribution(e.target.value)} className="pl-10" placeholder="e.g. 300" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerContribution">Employer Contribution (Monthly)</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="employerContribution" type="number" value={employerContribution} onChange={e => setEmployerContribution(e.target.value)} className="pl-10" placeholder="e.g. 200" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="annualGrowth">Expected Annual Growth (%)</Label>
                  <Input id="annualGrowth" type="number" value={annualGrowth} onChange={e => setAnnualGrowth(e.target.value)} step="0.1" placeholder="e.g. 5" />
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Pension
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Retirement Forecast</h2>
                  <ExportActions csvData={csvData} fileName="pension-forecast" title="Pension Forecast" />
                </div>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardHeader><CardTitle className="text-blue-900">Projected Pension Pot</CardTitle></CardHeader>
                  <CardContent>
                    <div className="text-center p-4">
                      <Shield className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                      <p className="text-4xl font-bold text-blue-800">
                        £{results.totalPensionPot.toLocaleString()}
                      </p>
                      <p className="text-blue-700 mt-2">At retirement in {results.yearsToRetirement} years</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Estimated Retirement Income</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">Annual Income (4% rule)</p>
                      <p className="text-3xl font-bold text-green-900">£{results.estimatedAnnualIncome.toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="text-sm text-purple-800">Monthly Income</p>
                      <p className="text-2xl font-bold text-purple-900">£{results.monthlyIncome.toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Contribution Breakdown</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Contributions:</span>
                      <span className="font-semibold">£{results.totalContributions.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Investment Growth:</span>
                      <span className="font-semibold text-green-600">£{results.totalGrowth.toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Plan your retirement</h3>
                  <p>Enter your details to forecast your pension.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}