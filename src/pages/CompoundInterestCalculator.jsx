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
import { PoundSterling, Calculator, TrendingUp, Percent } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [interestRate, setInterestRate] = useState('');
  const [years, setYears] = useState('');
  const [compoundFrequency, setCompoundFrequency] = useState('12'); // Monthly by default
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const p = Number(principal) || 0;
    const pmt = Number(monthlyContribution) || 0;
    const r = Number(interestRate) / 100;
    const t = Number(years) || 0;
    const n = Number(compoundFrequency);

    if (t <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Compound interest formula for principal
    const futureValuePrincipal = p * Math.pow(1 + r / n, n * t);

    // Future value of monthly contributions (annuity)
    let futureValueContributions = 0;
    if (pmt > 0 && r > 0) {
      const monthlyRate = r / 12;
      const months = t * 12;
      futureValueContributions = pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (pmt > 0) {
      futureValueContributions = pmt * t * 12;
    }

    const totalAmount = futureValuePrincipal + futureValueContributions;
    const totalContributions = p + pmt * 12 * t;
    const totalInterest = totalAmount - totalContributions;

    const newResults = {
      totalAmount,
      totalContributions,
      totalInterest,
      finalBalance: totalAmount,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Initial Investment', `£${p.toFixed(2)}`],
      ['Monthly Contribution', `£${pmt.toFixed(2)}`],
      ['Interest Rate', `${interestRate}%`],
      ['Time Period', `${t} years`],
      ['', ''],
      ['Total Contributions', `£${totalContributions.toFixed(2)}`],
      ['Interest Earned', `£${totalInterest.toFixed(2)}`],
      ['Final Amount', `£${totalAmount.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [principal, monthlyContribution, interestRate, years, compoundFrequency]);

  return (
    <div className="bg-white">
      <div className="bg-gray-50 border-b border-gray-200 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compound Interest Calculator
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              "Compound interest is the eighth wonder of the world" - Einstein. Discover the magic
              of time and compounding.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="principal">Initial Investment</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="principal"
                      type="number"
                      value={principal}
                      onChange={(e) => setPrincipal(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 10000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <Input
                    id="interestRate"
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.1"
                    placeholder="e.g. 7"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="years">Time Period (Years)</Label>
                  <Input
                    id="years"
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="e.g. 20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="compound">Compound Frequency</Label>
                  <Select value={compoundFrequency} onValueChange={setCompoundFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Annually</SelectItem>
                      <SelectItem value="4">Quarterly</SelectItem>
                      <SelectItem value="12">Monthly</SelectItem>
                      <SelectItem value="365">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Growth
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {hasCalculated && results ? (
              <>
                <div className="non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Investment Growth</h2>
                </div>
                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Final Amount</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-4">
                      <TrendingUp className="w-12 h-12 mx-auto text-green-600 mb-4" />
                      <p className="text-4xl font-bold text-green-800">
                        £{results.finalBalance.toLocaleString()}
                      </p>
                      <p className="text-green-700 mt-2">After {years} years</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Contributions:</span>
                      <span className="font-semibold">
                        £{results.totalContributions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Earned:</span>
                      <span className="font-semibold text-green-600">
                        £{results.totalInterest.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-3">
                      <span>Total Growth:</span>
                      <span className="font-bold text-lg">
                        {results.totalContributions > 0
                          ? `${((results.totalInterest / results.totalContributions) * 100).toFixed(1)}%`
                          : 'N/A'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                <div className="non-printable pt-6">
                  <ExportActions
                    csvData={csvData}
                    fileName="compound-interest"
                    title="Compound Interest Calculation"
                  />
                </div>
              </>
            ) : (
              <Card className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center text-gray-500">
                  <Percent className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">See the power of compounding</h3>
                  <p>Enter your details to watch your money grow.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
