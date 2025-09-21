import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PoundSterling, Calculator, Percent, Shield, Target } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const retirementFAQs = [
  {
    question: "How much do I need to save for retirement?",
    answer: "A common rule of thumb is to aim for a retirement pot of 25 times your desired annual income. For example, if you want £40,000 a year in retirement, you would aim for a £1 million pot. This calculator helps you see if you're on track."
  },
  {
    question: "What is a realistic annual return for investments?",
    answer: "Historically, the average stock market return has been around 7-10% per year. However, this is not guaranteed. A more conservative estimate of 5-7% is often used for long-term planning to account for inflation and fees."
  },
  {
    question: "Should my pension contributions be included in this calculation?",
    answer: "Yes, absolutely. Your current pension pot should be your 'Current Savings', and your monthly pension contributions (including your employer's contribution) should be your 'Monthly Contribution'. This gives you a complete picture of your retirement savings."
  }
];

const generateRetirementChartData = (currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn) => {
    const data = [];
    let savings = currentSavings;
    const monthlyRate = annualReturn / 12;

    for (let age = currentAge; age <= retirementAge; age++) {
        if ((age - currentAge) % 5 === 0 || age === retirementAge) {
             data.push({
                age: age,
                'Projected Savings': savings,
                'Your Contributions': currentSavings + monthlyContribution * 12 * (age - currentAge),
            });
        }
        for (let month = 0; month < 12; month++) {
            savings = (savings + monthlyContribution) * (1 + monthlyRate);
        }
    }
    return data;
};

export default function RetirementSavingsCalculator() {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('67');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = useCallback(() => {
    const age = Number(currentAge) || 0;
    const retireAge = Number(retirementAge) || 0;
    const savings = Number(currentSavings) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const rate = Number(annualReturn) / 100;

    const yearsToGrow = retireAge - age;
    if (yearsToGrow <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    const totalMonths = yearsToGrow * 12;
    const monthlyRate = rate / 12;

    const futureValueOfSavings = savings * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueOfContributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalPot = futureValueOfSavings + futureValueOfContributions;
    
    const totalContributions = savings + (monthly * totalMonths);
    const totalGrowth = totalPot - totalContributions;

    const chartData = generateRetirementChartData(age, retireAge, savings, monthly, rate);

    const newResults = {
      totalPot,
      totalContributions,
      totalGrowth,
      chartData
    };
    
    setResults(newResults);
    setHasCalculated(true);

     const csvExportData = [
      ["Metric", "Value"],
      ["Retirement Pot", `£${totalPot.toFixed(2)}`],
      ["Total Contributions", `£${totalContributions.toFixed(2)}`],
      ["Total Investment Growth", `£${totalGrowth.toFixed(2)}`],
      ["---"],
      ["Age", "Projected Savings", "Your Contributions"],
      ...chartData.map(row => [
          row.age,
          `£${row['Projected Savings'].toFixed(2)}`,
          `£${row['Your Contributions'].toFixed(2)}`,
      ])
    ];
    setCsvData(csvExportData);
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Retirement Savings Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Are you saving enough for retirement? Project your pension pot growth and see how much you could have when you retire.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Retirement Savings Projection</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Your Retirement Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                  <Label htmlFor="currentAge" className="flex justify-between">
                    <span>Current Age</span>
                    <span className="font-semibold">{currentAge}</span>
                  </Label>
                  <Slider value={[Number(currentAge)]} onValueChange={(value) => setCurrentAge(String(value[0]))} max={100} step={1} className="mt-2" />
                </div>
                 <div>
                  <Label htmlFor="retirementAge" className="flex justify-between">
                    <span>Target Retirement Age</span>
                    <span className="font-semibold">{retirementAge}</span>
                  </Label>
                  <Slider value={[Number(retirementAge)]} onValueChange={(value) => setRetirementAge(String(value[0]))} max={100} step={1} className="mt-2" />
                </div>
                <div>
                  <Label htmlFor="currentSavings">Current Savings / Pension Pot</Label>
                  <div className="relative mt-2">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="currentSavings" type="number" value={currentSavings} onChange={(e) => setCurrentSavings(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="monthlyContribution">Monthly Contribution (incl. employer)</Label>
                  <div className="relative mt-2">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="monthlyContribution" type="number" value={monthlyContribution} onChange={(e) => setMonthlyContribution(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="annualReturn" className="flex justify-between">
                    <span>Estimated Annual Return</span>
                    <span className="font-semibold">{Number(annualReturn).toFixed(1)}%</span>
                  </Label>
                  <Slider value={[Number(annualReturn)]} onValueChange={(value) => setAnnualReturn(String(value[0]))} max={15} step={0.5} className="mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Your Retirement Projection</h2>
                   <ExportActions csvData={csvData} fileName="retirement-projection" title="Retirement Projection" />
                </div>
                
                <Card className="bg-green-50">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-green-800">
                        <Target className="w-5 h-5"/>
                        Your Estimated Retirement Pot
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-5xl font-bold text-green-900">£{results.totalPot.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</p>
                    <p className="text-gray-600 mt-2">at age {retirementAge}</p>
                  </CardContent>
                </Card>

                <div className="grid md:grid-cols-2 gap-4">
                    <Card>
                        <CardHeader><CardTitle>Total Contributions</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold">£{results.totalContributions.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</p>
                            <p className="text-xs text-gray-500">The total amount you (and your employer) put in.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle>Total Investment Growth</CardTitle></CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold text-green-600">£{results.totalGrowth.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</p>
                             <p className="text-xs text-gray-500">The money your money made for you.</p>
                        </CardContent>
                    </Card>
                </div>
                
                <Card>
                    <CardHeader><CardTitle>Savings Growth Over Time</CardTitle></CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={results.chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" label={{ value: 'Age', position: 'insideBottom', offset: -5 }}/>
                                <YAxis tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`} />
                                <Tooltip formatter={(value) => `£${Number(value).toLocaleString()}`}/>
                                <Legend />
                                <Bar dataKey="Projected Savings" stackId="a" fill="#22c55e" name="Projected Savings" />
                                <Bar dataKey="Your Contributions" stackId="b" fill="#8884d8" name="Your Contributions" className="opacity-0"/>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Plan your future</h3>
                  <p>Enter your details to project your retirement savings.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={retirementFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}