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
import { PoundSterling, Calculator, Briefcase, Calendar } from 'lucide-react';
import ExportActions from '../components/calculators/ExportActions';
import FAQSection from '../components/calculators/FAQSection';

const freelancerFAQs = [
  {
    question: 'How should I set my freelance day rate?',
    answer:
      'Consider your desired annual income, working days per year, business expenses, tax obligations, and market rates. A good rule of thumb is to add 20-30% to the equivalent employee salary to account for additional costs and risks of freelancing.',
  },
  {
    question: 'What expenses should I factor into my day rate?',
    answer:
      'Include business expenses like equipment, software, insurance, training, marketing, office costs, and accountancy fees. Also factor in non-billable time spent on administration, business development, and potential gaps between contracts.',
  },
  {
    question: 'How many working days should I assume per year?',
    answer:
      'Most freelancers work 220-240 billable days per year, accounting for holidays, sick days, and time spent on business development. New freelancers might start with 200 days to be conservative.',
  },
];

export default function FreelancerDayRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState('');
  const [workingDays, setWorkingDays] = useState('220');
  const [businessExpenses, setBusinessExpenses] = useState('');
  const [taxRate, setTaxRate] = useState('30');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = () => {
    const targetIncome = Number(desiredIncome) || 0;
    const billableDays = Number(workingDays) || 0;
    const expenses = Number(businessExpenses) || 0;
    const taxRatePercent = Number(taxRate) || 0;

    if (targetIncome <= 0 || billableDays <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Calculate gross revenue needed
    const taxAmount = (targetIncome * taxRatePercent) / 100;
    const grossRevenueNeeded = targetIncome + taxAmount + expenses;

    // Calculate day rate
    const dayRate = grossRevenueNeeded / billableDays;
    const hourlyRate = dayRate / 8; // Assuming 8-hour days

    // Calculate what this means annually
    const annualRevenue = dayRate * billableDays;
    const netAfterTaxAndExpenses = annualRevenue - taxAmount - expenses;

    const newResults = {
      dayRate,
      hourlyRate,
      annualRevenue,
      netAfterTaxAndExpenses,
      taxAmount,
      expenses,
      workingDays: billableDays,
    };

    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
      ['Metric', 'Value'],
      ['Recommended Day Rate', `£${newResults.dayRate.toFixed(2)}`],
      ['Equivalent Hourly Rate', `£${newResults.hourlyRate.toFixed(2)}`],
      ['Annual Revenue', `£${newResults.annualRevenue.toFixed(2)}`],
      ['Less: Estimated Tax', `-£${newResults.taxAmount.toFixed(2)}`],
      ['Less: Business Expenses', `-£${newResults.expenses.toFixed(2)}`],
      ['Net Income', `£${newResults.netAfterTaxAndExpenses.toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
    setResults(null);
  }, [desiredIncome, workingDays, businessExpenses, taxRate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Freelancer Day Rate Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate the optimal day rate for your freelance work, factoring in taxes, expenses,
              and desired take-home income.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Freelancer Day Rate Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Freelance Goals</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="desiredIncome">Desired Net Annual Income</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="desiredIncome"
                      type="number"
                      value={desiredIncome}
                      onChange={(e) => setDesiredIncome(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 50000"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    What you want to take home after all costs
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workingDays">Billable Days Per Year</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="workingDays"
                      type="number"
                      value={workingDays}
                      onChange={(e) => setWorkingDays(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 220"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Excluding holidays, sick days, and admin time
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="businessExpenses">Annual Business Expenses</Label>
                  <div className="relative">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="businessExpenses"
                      type="number"
                      value={businessExpenses}
                      onChange={(e) => setBusinessExpenses(e.target.value)}
                      className="pl-10"
                      placeholder="e.g. 5000"
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Equipment, software, insurance, training, etc.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Estimated Tax Rate (%)</Label>
                  <Select value={taxRate} onValueChange={setTaxRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="20">20% (Basic rate taxpayer)</SelectItem>
                      <SelectItem value="30">30% (Inc. NI & some corp tax)</SelectItem>
                      <SelectItem value="40">40% (Higher rate taxpayer)</SelectItem>
                      <SelectItem value="50">50% (Additional rate + NI)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCalculate} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate Day Rate
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Recommended Rates</h2>
                  <ExportActions
                    csvData={csvData}
                    fileName="freelancer-day-rate"
                    title="Freelancer Day Rate"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-blue-800 mb-2">Day Rate</h3>
                      <div className="text-3xl font-bold text-blue-900">
                        £{results.dayRate.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-purple-800 mb-2">Hourly Rate</h3>
                      <div className="text-3xl font-bold text-purple-900">
                        £
                        {results.hourlyRate.toLocaleString('en-GB', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span>Annual Revenue ({results.workingDays} days)</span>
                      <span className="font-semibold text-green-800">
                        £{results.annualRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-red-50 rounded">
                      <span>Less: Estimated Tax</span>
                      <span className="font-semibold text-red-800">
                        -£{results.taxAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-3 bg-yellow-50 rounded">
                      <span>Less: Business Expenses</span>
                      <span className="font-semibold text-yellow-800">
                        -£{results.expenses.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-green-100 rounded font-bold">
                      <span>Net Take-Home Income</span>
                      <span className="text-green-900">
                        £{results.netAfterTaxAndExpenses.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Ready to price your services?</h3>
                  <p>Enter your financial goals to calculate optimal rates.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={freelancerFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
