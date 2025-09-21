
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Percent, PoundSterling, Calculator } from "lucide-react";
import FAQSection from "../components/calculators/FAQSection";

const overtimeRateFAQs = [
  {
    question: "What are common overtime multipliers?",
    answer: "The most common multipliers are 1.5 ('time-and-a-half') for standard overtime and 2.0 ('double time') for work on weekends or bank holidays. The exact rate is determined by your employment contract."
  },
  {
    question: "Is this my total overtime pay?",
    answer: "No, this calculator determines your hourly RATE for overtime work. To calculate your total pay for a period including overtime hours, please use our 'Overtime Pay Calculator'."
  },
  {
    question: "Is my employer required to offer a higher rate for overtime?",
    answer: "Not necessarily. In the UK, there's no legal obligation to pay workers for overtime. However, your average pay for the total hours you work must not fall below the National Minimum Wage. Your contract will specify your overtime pay details."
  }
];

export default function OvertimeRateCalculator() {
    const [hourlyRate, setHourlyRate] = useState('');
    const [multiplier, setMultiplier] = useState('');
    const [results, setResults] = useState(null);
    const [hasCalculated, setHasCalculated] = useState(false);

    const handleCalculate = useCallback(() => {
        const rate = Number(hourlyRate) || 0;
        const multi = Number(multiplier) || 0;

        if (rate <= 0 || multi <= 0) {
            setResults(null);
            setHasCalculated(true);
            return;
        }

        const overtimeRate = rate * multi;
        setResults({ overtimeRate });
        setHasCalculated(true);
    }, [hourlyRate, multiplier]);

    return (
        <div className="bg-white">
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Overtime Rate Calculator
                        </h1>
                        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                           Determine your specific hourly pay rate for working overtime hours.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Your Pay Details</CardTitle></CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="hourlyRate">Standard Hourly Rate (£)</Label>
                                <Input id="hourlyRate" type="number" value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} placeholder="e.g. 15" />
                            </div>
                            <div>
                                <Label htmlFor="multiplier">Overtime Multiplier (e.g., 1.5)</Label>
                                <Input id="multiplier" type="number" value={multiplier} onChange={e => setMultiplier(e.target.value)} placeholder="e.g. 1.5" />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleCalculate} className="w-full text-lg"><Calculator className="w-5 h-5 mr-2" />Calculate Rate</Button>
                        </CardFooter>
                    </Card>
                    <div>
                        {hasCalculated && results ? (
                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader><CardTitle className="text-blue-900">Your Overtime Hourly Rate</CardTitle></CardHeader>
                                <CardContent className="text-center">
                                    <p className="text-6xl font-bold text-blue-900">
                                        £{results.overtimeRate.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-blue-700 mt-1">per hour</p>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="flex items-center justify-center h-full">
                                <div className="text-center text-gray-500">
                                    <PoundSterling className="w-10 h-10 mx-auto mb-2"/>
                                    <p>Enter details to see your overtime rate.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
                <div className="mt-12">
                    <FAQSection faqs={overtimeRateFAQs} />
                </div>
            </div>
        </div>
    );
}
