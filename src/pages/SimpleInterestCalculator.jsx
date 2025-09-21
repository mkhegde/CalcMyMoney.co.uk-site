import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PoundSterling, Calculator, TrendingUp, Percent, Calendar } from "lucide-react";
import FAQSection from "../components/calculators/FAQSection";

const simpleInterestFAQs = [
  {
    question: "What is simple interest?",
    answer: "Simple interest is a quick method of calculating the interest charge on a loan or principal amount. It is determined by multiplying the daily interest rate by the principal by the number of days that elapse between payments."
  },
  {
    question: "What's the difference between simple and compound interest?",
    answer: "Simple interest is calculated only on the initial principal amount. In contrast, compound interest is calculated on the principal amount and also on the accumulated interest of previous periods. This 'interest on interest' effect makes compound interest grow much faster over time."
  },
  {
    question: "When is simple interest typically used?",
    answer: "Simple interest is often used for short-term loans, such as car loans or certain personal loans. Most savings accounts and long-term investments use compound interest because it is much more powerful for wealth growth."
  },
  {
    question: "A Note on Calculations",
    answer: "This calculator applies the standard `I = P * R * T` formula. It's a useful tool for understanding the basic concept of interest but may not reflect the complex terms of a real-world financial product. Always check the terms and conditions provided by your financial institution."
  }
];

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [term, setTerm] = useState('10');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const p = Number(principal) || 0;
    const r = Number(rate) / 100;
    const t = Number(term) || 0;

    if (p <= 0 || r < 0 || t <= 0) {
      setResults(null);
      return;
    }

    const interest = p * r * t;
    const finalAmount = p + interest;

    setResults({
      totalInterest: interest,
      finalAmount,
    });
  }, [principal, rate, term]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Simple Interest Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Calculate interest earned on a principal amount without the effect of compounding.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader><CardTitle>Calculation Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="principal">Principal Amount (£)</Label>
                  <div className="relative mt-1">
                    <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="principal" type="number" value={principal} onChange={e => setPrincipal(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="rate">Annual Interest Rate (%)</Label>
                   <div className="flex items-center gap-4 mt-1">
                    <Slider id="rate" value={[parseFloat(rate)]} onValueChange={([val]) => setRate(val.toString())} max={25} step={0.1} className="flex-1" />
                    <Input type="number" value={rate} onChange={e => setRate(e.target.value)} className="w-24 text-center" />
                  </div>
                </div>
                 <div>
                  <Label htmlFor="term">Time Period (Years)</Label>
                  <div className="flex items-center gap-4 mt-1">
                    <Slider id="term" value={[parseFloat(term)]} onValueChange={([val]) => setTerm(val.toString())} max={50} step={1} className="flex-1" />
                    <Input type="number" value={term} onChange={e => setTerm(e.target.value)} className="w-24 text-center" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            {results ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader><CardTitle>Simple Interest Results</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid md:grid-cols-2 gap-4 text-center">
                       <Card className="p-6 bg-blue-50">
                         <CardTitle className="text-sm font-medium text-blue-800">Total Interest Earned</CardTitle>
                         <p className="text-3xl font-bold text-blue-900 mt-2">£{results.totalInterest.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>
                       </Card>
                       <Card className="p-6 bg-green-50">
                          <CardTitle className="text-sm font-medium text-green-800">Final Amount</CardTitle>
                          <p className="text-3xl font-bold text-green-900 mt-2">£{results.finalAmount.toLocaleString('en-GB', { maximumFractionDigits: 2 })}</p>
                       </Card>
                     </div>
                     <div className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg">
                        After {term} years, your initial principal of £{Number(principal).toLocaleString()} would earn £{results.totalInterest.toLocaleString('en-GB', { maximumFractionDigits: 2 })} in simple interest, resulting in a total amount of £{results.finalAmount.toLocaleString('en-GB', { maximumFractionDigits: 2 })}.
                     </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-64">
                <p className="text-gray-500">Enter your details to see the results.</p>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-12 non-printable">
            <FAQSection faqs={simpleInterestFAQs} />
        </div>
      </div>
    </div>
  );
}