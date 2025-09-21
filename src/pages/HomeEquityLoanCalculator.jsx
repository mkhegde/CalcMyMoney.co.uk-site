import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PoundSterling, Home, Banknote, Percent } from "lucide-react";
import FAQSection from "../components/calculators/FAQSection";

const homeEquityFAQs = [
  {
    question: "What is home equity?",
    answer: "Home equity is the portion of your home that you own outright. It's the difference between your property's current market value and the amount you still owe on your mortgage. Equity increases as you pay down your mortgage and as your property value appreciates."
  },
  {
    question: "What is Loan-to-Value (LTV)?",
    answer: "Loan-to-Value (LTV) is a percentage that represents the ratio of a loan to the value of the asset purchased. Lenders use LTV to assess risk. For a home equity loan, they will typically cap the total LTV (your original mortgage + new loan) at around 80-85% of the property's value."
  },
  {
    question: "What are the risks of a home equity loan?",
    answer: "The biggest risk is that a home equity loan is secured against your property. If you fail to make the repayments, your home could be at risk of repossession. Additionally, if property values fall, you could end up in negative equity, where you owe more than your house is worth."
  },
  {
    question: "A Note on Trustworthiness",
    answer: "This calculator provides an estimate of the equity you could potentially borrow against. The actual amount a lender will offer depends on their specific lending criteria, your credit history, income, and a formal property valuation. Always consult with a mortgage advisor before making any decisions."
  }
];

export default function HomeEquityLoanCalculator() {
  const [propertyValue, setPropertyValue] = useState('350000');
  const [outstandingMortgage, setOutstandingMortgage] = useState('150000');
  const [ltvLimit, setLtvLimit] = useState('85');
  const [results, setResults] = useState(null);

  const handleCalculate = useCallback(() => {
    const value = Number(propertyValue) || 0;
    const mortgage = Number(outstandingMortgage) || 0;
    const ltv = Number(ltvLimit) / 100;

    if (value <= 0 || mortgage < 0 || ltv <= 0) {
      setResults(null);
      return;
    }

    const currentEquity = value - mortgage;
    const totalBorrowingLimit = value * ltv;
    const maxAvailableToBorrow = Math.max(0, totalBorrowingLimit - mortgage);

    setResults({
      currentEquity,
      maxAvailableToBorrow,
    });
  }, [propertyValue, outstandingMortgage, ltvLimit]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Home Equity Loan Calculator
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Estimate how much you could potentially borrow against the equity in your home.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="non-printable">
            <Card>
              <CardHeader><CardTitle>Your Property Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="propertyValue">Estimated Property Value (£)</Label>
                  <div className="relative mt-1">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="propertyValue" type="number" value={propertyValue} onChange={e => setPropertyValue(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="outstandingMortgage">Outstanding Mortgage Balance (£)</Label>
                  <div className="relative mt-1">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="outstandingMortgage" type="number" value={outstandingMortgage} onChange={e => setOutstandingMortgage(e.target.value)} className="pl-10" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ltvLimit">Lender's LTV Limit (%)</Label>
                   <div className="flex items-center gap-4 mt-1">
                    <Slider id="ltvLimit" value={[parseFloat(ltvLimit)]} onValueChange={([val]) => setLtvLimit(val.toString())} min={50} max={95} step={1} className="flex-1" />
                    <Input type="number" value={ltvLimit} onChange={e => setLtvLimit(e.target.value)} className="w-24 text-center" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {results ? (
              <div className="space-y-6">
                <Card className="bg-green-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-green-900">Maximum Available to Borrow</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                     <p className="text-5xl font-bold text-green-900">£{results.maxAvailableToBorrow.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</p>
                  </CardContent>
                </Card>
                <Card>
                   <CardHeader><CardTitle>Equity Breakdown</CardTitle></CardHeader>
                   <CardContent className="space-y-3">
                     <div className="flex justify-between"><span>Property Value:</span> <span className="font-semibold">£{Number(propertyValue).toLocaleString()}</span></div>
                     <div className="flex justify-between text-red-600"><span>Mortgage Owed:</span> <span className="font-semibold">-£{Number(outstandingMortgage).toLocaleString()}</span></div>
                     <div className="flex justify-between border-t pt-2 font-bold text-lg text-blue-700"><span>Your Current Equity:</span> <span>£{results.currentEquity.toLocaleString()}</span></div>
                   </CardContent>
                </Card>
                 <div className="text-xs text-gray-500 p-3 bg-gray-100 rounded-lg">
                    This is an estimate. Lenders will conduct their own valuation and have specific criteria regarding income and credit history that will determine the final loan amount.
                 </div>
              </div>
            ) : (
              <Card className="flex items-center justify-center h-full">
                <p className="text-gray-500">Enter your details to calculate.</p>
              </Card>
            )}
          </div>
        </div>
        
        <div className="mt-12 non-printable">
            <FAQSection faqs={homeEquityFAQs} />
        </div>
      </div>
    </div>
  );
}