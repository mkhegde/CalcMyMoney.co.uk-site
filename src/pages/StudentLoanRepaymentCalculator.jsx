
import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Calculator } from "lucide-react";

const plans = {
    plan1: { threshold: 24990, rate: 0.09 },
    plan2: { threshold: 27295, rate: 0.09 },
    plan4: { threshold: 31395, rate: 0.09 },
    plan5: { threshold: 25000, rate: 0.09 },
    postgraduate: { threshold: 21000, rate: 0.06 }
};

export default function StudentLoanRepaymentCalculator() {
    const [salary, setSalary] = useState('');
    const [plan, setPlan] = useState('plan2');
    const [results, setResults] = useState(null);
    const [hasCalculated, setHasCalculated] = useState(false);

    const handleCalculate = useCallback(() => {
        const inc = Number(salary) || 0;
        const currentPlan = plans[plan];
        if (inc <= currentPlan.threshold) {
            setResults({ monthly: 0, annual: 0 });
            setHasCalculated(true);
            return;
        }
        const repayableIncome = inc - currentPlan.threshold;
        const annualRepayment = repayableIncome * currentPlan.rate;
        setResults({ monthly: annualRepayment / 12, annual: annualRepayment });
        setHasCalculated(true);
    }, [salary, plan]);

    return (
        <div className="bg-white">
            <div className="bg-gray-50 border-b"><div className="max-w-7xl mx-auto px-4 py-12"><h1 className="text-3xl font-bold text-center">Student Loan Repayment Calculator</h1></div></div>
            <div className="max-w-4xl mx-auto p-4 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader><CardTitle>Your Details</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label>Annual Salary (£)</Label><Input type="number" value={salary} onChange={e=>setSalary(e.target.value)} placeholder="e.g. 45000" /></div>
                            <div><Label>Loan Plan</Label>
                                <Select value={plan} onValueChange={setPlan}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>
                                    <SelectItem value="plan1">Plan 1</SelectItem>
                                    <SelectItem value="plan2">Plan 2</SelectItem>
                                    <SelectItem value="plan4">Plan 4 (Scottish)</SelectItem>
                                    <SelectItem value="plan5">Plan 5</SelectItem>
                                    <SelectItem value="postgraduate">Postgraduate Loan</SelectItem>
                                </SelectContent></Select>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={handleCalculate} className="w-full text-lg"><Calculator className="w-5 h-5 mr-2" />Calculate Repayment</Button>
                        </CardFooter>
                    </Card>
                    <div>
                        {hasCalculated && results ? (
                            <Card className="bg-red-50 border-red-200">
                                <CardHeader><CardTitle>Estimated Repayment</CardTitle></CardHeader>
                                <CardContent className="text-center">
                                    <p>Monthly Repayment</p><p className="text-4xl font-bold text-red-700">£{results.monthly.toFixed(2)}</p>
                                    <p className="pt-4">Annual Repayment</p><p className="text-3xl font-bold">£{results.annual.toFixed(2)}</p>
                                </CardContent>
                            </Card>
                        ) : (
                             <Card className="flex items-center justify-center h-full min-h-[220px]">
                                <div className="text-center text-gray-500">
                                    <BookOpen className="w-10 h-10 mx-auto mb-2"/>
                                    <p>Find out what you'll repay each month.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
