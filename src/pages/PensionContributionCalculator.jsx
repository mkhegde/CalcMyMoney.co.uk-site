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
import { PoundSterling, Calculator, Shield, TrendingUp } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

import Heading from '@/components/common/Heading';
const pensionFAQs = [
  {
    question: 'What is the minimum pension contribution in the UK?',
    answer:
      'Under auto-enrolment, the minimum total contribution is 8% of qualifying earnings (between £6,240 and £50,270 for 2024/25). The employer must contribute at least 3%, with the employee contributing at least 5%.',
  },
  {
    question: 'How much tax relief do I get on pension contributions?',
    answer:
      'You get tax relief at your marginal rate. Basic rate taxpayers get 20% relief, higher rate taxpayers get 40%, and additional rate taxpayers get 45%. This effectively reduces the cost of your pension contributions.',
  },
  {
    question: 'What is the annual allowance for pension contributions?',
    answer:
      'For 2024/25, the annual allowance is £60,000. This is the maximum amount you can contribute to pensions in a tax year while still receiving tax relief. High earners may have a reduced allowance (tapered annual allowance).',
  },
];

export default function PensionContributionCalculator() {
  const [salary, setSalary] = useState('');
  const [employeeContribution, setEmployeeContribution] = useState('5');
  const [employerContribution, setEmployerContribution] = useState('3');
  const [taxBand, setTaxBand] = useState('basic');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const annualSalary = Number(salary) || 0;
    const empContrib = Number(employeeContribution) || 0;
    const emplerContrib = Number(employerContribution) || 0;

    if (annualSalary <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Qualifying earnings band for auto-enrolment
    const lowerThreshold = 6240;
    const upperThreshold = 50270;
    const qualifyingEarnings = Math.max(0, Math.min(annualSalary, upperThreshold) - lowerThreshold);

    // Calculate contributions
    const employeeContribAmount = (qualifyingEarnings * empContrib) / 100;
    const employerContribAmount = (qualifyingEarnings * emplerContrib) / 100;
    const totalContribution = employeeContribAmount + employerContribAmount;

    // Tax relief calculation
    const taxReliefRates = { basic: 0.2, higher: 0.4, additional: 0.45 };
    const taxRelief = employeeContribAmount * taxReliefRates[taxBand];
    const netCostToEmployee = employeeContribAmount - taxRelief;

    // Monthly figures
    const monthlyEmployeeContrib = employeeContribAmount / 12;
    const monthlyEmployerContrib = employerContribAmount / 12;
    const monthlyNetCost = netCostToEmployee / 12;

    const newResults = {
      qualifyingEarnings,
      employeeContribAmount,
      employerContribAmount,
      totalContribution,
      taxRelief,
      netCostToEmployee,
      monthlyEmployeeContrib,
      monthlyEmployerContrib,
      monthlyNetCost,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Annual', 'Monthly'],
      ['Qualifying Earnings', `£${newResults.qualifyingEarnings.toFixed(2)}`, ''],
      [
        'Employee Contribution',
        `£${newResults.employeeContribAmount.toFixed(2)}`,
        `£${newResults.monthlyEmployeeContrib.toFixed(2)}`,
      ],
      [
        'Employer Contribution',
        `£${newResults.employerContribAmount.toFixed(2)}`,
        `£${newResults.monthlyEmployerContrib.toFixed(2)}`,
      ],
      ['Total Contribution', `£${newResults.totalContribution.toFixed(2)}`, ''],
      ['Tax Relief', `£${newResults.taxRelief.toFixed(2)}`, ''],
      [
        'Net Cost to You',
        `£${newResults.netCostToEmployee.toFixed(2)}`,
        `£${newResults.monthlyNetCost.toFixed(2)}`,
      ],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [salary, employeeContribution, employerContribution, taxBand]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading as="h1" size="h1" weight="bold" className="text-gray-900 dark:text-gray-100 mb-4">
              UK Pension Contribution Calculator
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate your pension contributions, tax relief, and the real cost of building your
              retirement savings.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Pension Contribution Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="salary">Annual Salary</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="salary"
                      type="number"
                      value={salary}
                      onChange={(e) => setSalary(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 40000"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeContribution">Your Contribution (%)</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="employeeContribution"
                      type="number"
                      value={employeeContribution}
                      onChange={(e) => setEmployeeContribution(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum 5% under auto-enrolment</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employerContribution">Employer Contribution (%)</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="employerContribution"
                      type="number"
                      value={employerContribution}
                      onChange={(e) => setEmployerContribution(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 3"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Minimum 3% under auto-enrolment</p>
                </div>
                <div className="space-y-2">
                  <Label>Your Tax Band</Label>
                  <Select value={taxBand} onValueChange={setTaxBand}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic Rate (20%)</SelectItem>
                      <SelectItem value="higher">Higher Rate (40%)</SelectItem>
                      <SelectItem value="additional">Additional Rate (45%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Contributions
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <Heading as="h2" size="h2" weight="bold" className="text-gray-800">Your Pension Contributions</Heading>
                  <ExportActions
                    csvData={csvData}
                    fileName="pension-contributions"
                    title="Pension Contributions"
                  />
                </div>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-green-800 mb-2">Net Monthly Cost to You</h3>
                    <div className="text-4xl font-bold text-green-900">
                      £
                      {results.monthlyNetCost.toLocaleString('en-GB', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <p className="text-sm text-green-700">
                      After {taxBand === 'basic' ? '20%' : taxBand === 'higher' ? '40%' : '45%'} tax
                      relief
                    </p>
                  </CardContent>
                </Card>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Contributions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded">
                        <p className="text-sm text-blue-600">Gross Monthly Contribution</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.monthlyEmployeeContrib.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded">
                        <p className="text-sm text-green-600">Annual Tax Relief</p>
                        <p className="text-lg font-semibold">
                          £{results.taxRelief.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Employer Contributions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="p-3 bg-purple-50 rounded">
                        <p className="text-sm text-purple-600">Monthly Employer Contribution</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.monthlyEmployerContrib.toLocaleString('en-GB', {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <p className="text-sm text-gray-600">Total Annual Pension Growth</p>
                        <p className="text-lg font-semibold">
                          £
                          {results.totalContribution.toLocaleString('en-GB', {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Plan your pension future</h3>
                  <p>Enter your details to see contribution costs and tax relief.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={pensionFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
