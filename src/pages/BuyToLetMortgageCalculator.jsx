
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator, Building, Percent } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";

const btlFAQs = [
    {
        question: "What is rental yield?",
        answer: "Rental yield is the return you get on a property investment from rent, expressed as an an annual percentage of the property's value. A higher yield means a better return."
    },
    {
        question: "What is an Interest Coverage Ratio (ICR)?",
        answer: "ICR is a test used by buy-to-let lenders to ensure the expected rental income will cover the mortgage interest payments by a certain margin. A common requirement is for rent to be at least 125% to 145% of the monthly mortgage payment."
    },
    {
        question: "How much deposit do I need for a buy-to-let mortgage?",
        answer: "Typically, you need a larger deposit for a buy-to-let mortgage than for a residential one. Most lenders require a minimum of 25% of the property's value, but a larger deposit can get you better interest rates."
    }
];

export default function BuyToLetMortgageCalculator() {
    const [propertyValue, setPropertyValue] = useState('');
    const [deposit, setDeposit] = useState('');
    const [interestRate, setInterestRate] = useState('');
    const [monthlyRent, setMonthlyRent] = useState('');
    const [otherCosts, setOtherCosts] = useState('');
    const [results, setResults] = useState(null);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [csvData, setCsvData] = useState(null);

    const handleCalculate = useCallback(() => {
        const pv = Number(propertyValue) || 0;
        const dep = Number(deposit) || 0;
        const rate = Number(interestRate) || 0;
        const rent = Number(monthlyRent) || 0;
        const costs = Number(otherCosts) || 0;

        const loanAmount = pv - dep;
        if (pv <= 0 || rent <= 0 || loanAmount <= 0) {
            setResults(null);
            setHasCalculated(true); // Indicate that a calculation attempt was made
            return;
        }

        const monthlyInterest = (loanAmount * (rate / 100)) / 12;
        const monthlyProfit = rent - monthlyInterest - costs;
        const annualProfit = monthlyProfit * 12;
        const rentalYield = (rent * 12 / pv) * 100;
        const ltv = (loanAmount / pv) * 100;
        
        // Ensure monthlyInterest is not zero to avoid division by zero
        const icr = monthlyInterest !== 0 ? (rent / monthlyInterest) * 100 : 0; 

        const newResults = {
            monthlyProfit,
            annualProfit,
            rentalYield,
            ltv,
            icr,
            monthlyInterest,
            loanAmount
        };

        setResults(newResults);
        setHasCalculated(true);

        const csvExportData = [
            ["Metric", "Value"],
            ["Property Value", `£${pv.toFixed(2)}`],
            ["Deposit", `£${dep.toFixed(2)}`],
            ["Loan Amount", `£${loanAmount.toFixed(2)}`],
            ["Interest Rate", `${rate}%`],
            ["Expected Monthly Rent", `£${rent.toFixed(2)}`],
            ["Other Monthly Costs", `£${costs.toFixed(2)}`],
            ["---", "---"],
            ["Monthly Profit", `£${monthlyProfit.toFixed(2)}`],
            ["Annual Profit", `£${annualProfit.toFixed(2)}`],
            ["Rental Yield", `${rentalYield.toFixed(2)}%`],
            ["Loan to Value (LTV)", `${ltv.toFixed(2)}%`],
            ["Interest Coverage Ratio (ICR)", `${icr.toFixed(2)}%`],
        ];
        setCsvData(csvExportData);
    }, [propertyValue, deposit, interestRate, monthlyRent, otherCosts]);
    
    // Removed: useEffect for auto-calculation

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            Buy-to-Let Mortgage &amp; Rental Yield Calculator
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Analyse the profitability and viability of a UK property investment. Calculate rental yield, monthly profit, and key lender metrics like ICR.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-2 non-printable">
                        <Card className="sticky top-24">
                            <CardHeader><CardTitle>Investment Details</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-1">
                                    <Label htmlFor="propertyValue">Property Value</Label>
                                    <div className="relative">
                                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input id="propertyValue" type="number" value={propertyValue} onChange={e => setPropertyValue(e.target.value)} className="pl-10" placeholder="e.g. 250000" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="deposit">Deposit Amount</Label>
                                    <div className="relative">
                                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input id="deposit" type="number" value={deposit} onChange={e => setDeposit(e.target.value)} className="pl-10" placeholder="e.g. 62500" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="interestRate">Mortgage Interest Rate (APR)</Label>
                                    <div className="relative">
                                        <Percent className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input id="interestRate" type="number" value={interestRate} onChange={e => setInterestRate(e.target.value)} className="pr-10" placeholder="e.g. 5.5" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="monthlyRent">Expected Monthly Rent</Label>
                                    <div className="relative">
                                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input id="monthlyRent" type="number" value={monthlyRent} onChange={e => setMonthlyRent(e.target.value)} className="pl-10" placeholder="e.g. 1200" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="otherCosts">Other Monthly Costs</Label>
                                    <div className="relative">
                                        <PoundSterling className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input id="otherCosts" type="number" value={otherCosts} onChange={e => setOtherCosts(e.target.value)} className="pl-10" placeholder="e.g. 200 (insurance, repairs)"/>
                                    </div>
                                </div>
                                <Button onClick={handleCalculate} className="w-full text-lg"><Calculator className="w-5 h-5 mr-2" />Calculate</Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-3 space-y-6 printable-area">
                        {hasCalculated && results ? (
                            <>
                                <div className="flex justify-between items-center non-printable">
                                    <h2 className="text-2xl font-bold text-gray-800">Investment Analysis</h2>
                                    <ExportActions csvData={csvData} fileName="btl-summary" title="BTL Summary" />
                                </div>
                                
                                <Card className="text-center bg-green-50 border-green-200">
                                    <CardHeader><CardTitle>Estimated Monthly Profit</CardTitle></CardHeader>
                                    <CardContent>
                                        <p className={`text-5xl font-bold ${results.monthlyProfit > 0 ? 'text-green-800' : 'text-red-700'}`}>
                                            £{results.monthlyProfit.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-600">Annual Profit: £{results.annualProfit.toFixed(2)}</p>
                                    </CardContent>
                                </Card>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <Card>
                                        <CardHeader><CardTitle>Key Ratios</CardTitle></CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between"><span>Rental Yield:</span> <span className="font-semibold">{results.rentalYield.toFixed(2)}%</span></div>
                                            <div className="flex justify-between"><span>Loan to Value (LTV):</span> <span className="font-semibold">{results.ltv.toFixed(2)}%</span></div>
                                            <div className="flex justify-between"><span>Interest Coverage (ICR):</span> <span className="font-semibold">{results.icr.toFixed(2)}%</span></div>
                                        </CardContent>
                                    </Card>
                                     <Card>
                                        <CardHeader><CardTitle>Financials</CardTitle></CardHeader>
                                        <CardContent className="space-y-3">
                                            <div className="flex justify-between"><span>Loan Amount:</span> <span className="font-semibold">£{results.loanAmount.toLocaleString()}</span></div>
                                            <div className="flex justify-between"><span>Monthly Interest:</span> <span className="font-semibold text-red-600">£{results.monthlyInterest.toFixed(2)}</span></div>
                                            <div className="flex justify-between"><span>Monthly Rent:</span> <span className="font-semibold text-green-600">£{Number(monthlyRent).toLocaleString()}</span></div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <Card>
                                    <CardHeader><CardTitle>Lender Assessment</CardTitle></CardHeader>
                                    <CardContent>
                                        {results.icr < 125 ? (
                                            <p className="text-red-700">Your Interest Coverage Ratio (ICR) is below the typical 125% minimum. You may struggle to get this mortgage.</p>
                                        ) : results.icr < 145 ? (
                                            <p className="text-amber-700">Your ICR is acceptable for some lenders, but a higher ratio would provide more options and better rates.</p>
                                        ) : (
                                            <p className="text-green-700">Your ICR is strong, which should be attractive to most buy-to-let lenders.</p>
                                        )}
                                        {results.ltv > 75 && (
                                            <p className="mt-2 text-amber-700">Your Loan-to-Value (LTV) is above 75%. You may need a larger deposit for most BTL products.</p>
                                        )}
                                    </CardContent>
                                </Card>

                            </>
                        ) : (
                            <Card className="flex items-center justify-center h-[400px] bg-gray-50">
                                <div className="text-center text-gray-500">
                                    <Building className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold">Analyse your next property investment</h3>
                                    <p>Enter the deal details to see the numbers.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
                <div className="mt-12 non-printable">
                    <FAQSection faqs={btlFAQs} />
                </div>
            </div>
        </div>
    );
}
