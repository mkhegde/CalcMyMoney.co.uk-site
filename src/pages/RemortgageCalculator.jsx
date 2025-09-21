import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator, Repeat, ArrowRight } from "lucide-react";
import FAQSection from "../components/calculators/FAQSection";

const remortgageFAQs = [
  {
    question: "When should I consider remortgaging?",
    answer: "You should typically start looking to remortgage 3-6 months before your current fixed, tracker, or discount deal ends to avoid moving onto your lender's expensive Standard Variable Rate (SVR). You might also remortgage to release equity or consolidate debt."
  },
  {
    question: "What is Loan to Value (LTV)?",
    answer: "LTV is the size of your mortgage in relation to the value of your property. For example, if you have a £150,000 mortgage on a £200,000 property, your LTV is 75%. A lower LTV generally gives you access to better mortgage rates."
  },
  {
    question: "Are there fees involved in remortgaging?",
    answer: "Yes, there can be. These might include arrangement fees for the new mortgage, legal fees, and valuation fees. Sometimes 'fee-free' deals are available, but the interest rate may be slightly higher."
  }
];

export default function RemortgageCalculator() {
  const [currentPropertyValue, setCurrentPropertyValue] = useState('300000');
  const [outstandingMortgage, setOutstandingMortgage] = useState('150000');
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = useState('800');
  
  const [newInterestRate, setNewInterestRate] = useState('4.5');
  const [newMortgageTerm, setNewMortgageTerm] = useState('25');
  const [newMortgageFees, setNewMortgageFees] = useState('999');

  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculate = () => {
    const propVal = Number(currentPropertyValue) || 0;
    const outstanding = Number(outstandingMortgage) || 0;
    const currentPayment = Number(currentMonthlyPayment) || 0;
    const newRate = Number(newInterestRate) / 100;
    const newTermYears = Number(newMortgageTerm) || 0;
    const fees = Number(newMortgageFees) || 0;
    
    if(propVal <= 0 || outstanding <= 0 || currentPayment <= 0 || newRate <= 0 || newTermYears <= 0) {
        setResults(null);
        setHasCalculated(true);
        return;
    }

    const equity = propVal - outstanding;
    const ltv = (outstanding / propVal) * 100;

    const monthlyRate = newRate / 12;
    const numberOfPayments = newTermYears * 12;
    const newMonthlyPayment = (outstanding * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));

    const monthlySaving = currentPayment - newMonthlyPayment;
    const firstYearSaving = (monthlySaving * 12) - fees;

    setResults({
        equity,
        ltv,
        newMonthlyPayment,
        monthlySaving,
        firstYearSaving
    });
    setHasCalculated(true);
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Remortgage &amp; Equity Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              See how much you could save by switching to a new deal, and calculate the equity in your home.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <div className="non-printable">
            <Card>
              <CardHeader><CardTitle>Enter Your Details</CardTitle></CardHeader>
              <CardContent className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-4">Current Situation</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label>Estimated Property Value</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input value={currentPropertyValue} onChange={e => setCurrentPropertyValue(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label>Outstanding Mortgage</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input value={outstandingMortgage} onChange={e => setOutstandingMortgage(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                     <div className="space-y-1">
                      <Label>Current Monthly Payment</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input value={currentMonthlyPayment} onChange={e => setCurrentMonthlyPayment(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">New Mortgage Deal</h3>
                  <div className="space-y-4">
                     <div className="space-y-1">
                      <Label>New Interest Rate (%)</Label>
                      <Input value={newInterestRate} onChange={e => setNewInterestRate(e.target.value)} />
                    </div>
                     <div className="space-y-1">
                      <Label>New Mortgage Term (Years)</Label>
                      <Input value={newMortgageTerm} onChange={e => setNewMortgageTerm(e.target.value)} />
                    </div>
                     <div className="space-y-1">
                      <Label>New Mortgage Fees</Label>
                      <div className="relative">
                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input value={newMortgageFees} onChange={e => setNewMortgageFees(e.target.value)} className="pl-10" />
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleCalculate} className="w-full text-lg"><Calculator className="w-5 h-5 mr-2" />Calculate Savings</Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            {hasCalculated && results ? (
                 <>
                <Card className="text-center bg-green-50 border-green-200">
                  <CardHeader><CardTitle>Potential Monthly Saving</CardTitle></CardHeader>
                  <CardContent>
                    <p className={`text-5xl font-bold ${results.monthlySaving > 0 ? 'text-green-800' : 'text-red-700'}`}>
                      £{Math.abs(results.monthlySaving).toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">{results.monthlySaving > 0 ? "per month saving" : "per month increase"}</p>
                  </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle>Remortgage Summary</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                         <div className="flex items-center justify-between">
                            <span>Current Payment</span>
                            <span className="font-medium">£{Number(currentMonthlyPayment).toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between text-lg">
                            <span>New Payment</span>
                            <ArrowRight className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-green-700">£{results.newMonthlyPayment.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center justify-between border-t pt-3">
                            <span>First Year Saving (after fees)</span>
                            <span className={`font-bold ${results.firstYearSaving > 0 ? 'text-green-700' : 'text-red-700'}`}>
                                £{results.firstYearSaving.toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Your Equity Position</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between"><span>Home Equity:</span> <span className="font-semibold">£{results.equity.toLocaleString()}</span></div>
                        <div className="flex justify-between"><span>Loan to Value (LTV):</span> <span className="font-semibold">{results.ltv.toFixed(2)}%</span></div>
                        <p className="text-xs text-gray-500 pt-2 border-t">A lower LTV ratio often gives you access to better interest rates from lenders.</p>
                    </CardContent>
                </Card>
                </>
            ) : (
                <Card className="flex items-center justify-center h-full min-h-[400px] bg-gray-50">
                <div className="text-center text-gray-500">
                  <Repeat className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Could you save by switching?</h3>
                  <p>Enter your details to find out.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
        <div className="mt-12 non-printable">
            <FAQSection faqs={remortgageFAQs} />
        </div>
      </div>
    </div>
  );
}