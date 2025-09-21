
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PoundSterling, Calculator } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import CalculatorWrapper from "../components/calculators/CalculatorWrapper";
import FAQSection from "../components/calculators/FAQSection";
import RelatedCalculators from "../components/calculators/RelatedCalculators";
import AnimatedNumber from "../components/general/AnimatedNumber";
import Breadcrumbs from "../components/general/Breadcrumbs";
import { createPageUrl } from "@/utils";

const niThresholds = {
    '2025-26': {
        primaryThreshold: 12570,
        upperEarningsLimit: 50270,
        mainRate: 0.08,
        upperRate: 0.02,
    }
};

const nationalInsuranceFAQs = [
    {
        question: "What are the different classes of National Insurance?",
        answer: "There are several classes of National Insurance. Class 1 is paid by employees. Class 2 (a flat weekly rate) and Class 4 (a percentage of profits) are paid by self-employed people. Our calculator focuses on Class 1 contributions for employees."
    },
    {
        question: "Do I pay National Insurance on my entire salary?",
        answer: "No. You only start paying National Insurance once your earnings go above the 'Primary Threshold'. You then pay a main rate on earnings between this threshold and the 'Upper Earnings Limit', and a lower rate on any earnings above that."
    },
    {
        question: "How does my age affect National Insurance contributions?",
        answer: "You stop paying Class 1 National Insurance once you reach the State Pension age, even if you continue working. You will need to show your employer proof of your age to ensure they stop deducting it."
    },
    {
        question: "Is National Insurance the same as Income Tax?",
        answer: "No, they are two separate taxes. Income Tax is paid on most types of income, while National Insurance contributions build your entitlement to certain state benefits, such as the State Pension and Employment and Support Allowance."
    }
];

export default function NationalInsuranceCalculator() {
    const [salary, setSalary] = useState('');
    const [results, setResults] = useState(null);
    const [hasCalculated, setHasCalculated] = useState(false);
    const [csvData, setCsvData] = useState(null);

    const breadcrumbPath = [
        { name: "Home", url: createPageUrl("Home") },
        { name: "Tax Calculators", url: `${createPageUrl("Home")}#tax-calculators` },
        { name: "National Insurance Calculator" }
    ];

    const handleCalculate = () => {
        const grossSalary = Number(salary) || 0;
        const year = '2025-26';
        const thresholds = niThresholds[year];

        let niContribution = 0;
        let niBreakdown = [];

        if (grossSalary > thresholds.primaryThreshold) {
            const earningsInMainBand = Math.min(grossSalary, thresholds.upperEarningsLimit) - thresholds.primaryThreshold;
            if (earningsInMainBand > 0) {
                const mainBandNI = earningsInMainBand * thresholds.mainRate;
                niContribution += mainBandNI;
                niBreakdown.push({ band: `Main Rate (${thresholds.mainRate * 100}%)`, amount: mainBandNI });
            }
        }

        if (grossSalary > thresholds.upperEarningsLimit) {
            const earningsInUpperBand = grossSalary - thresholds.upperEarningsLimit;
            const upperBandNI = earningsInUpperBand * thresholds.upperRate;
            niContribution += upperBandNI;
            niBreakdown.push({ band: `Upper Rate (${thresholds.upperRate * 100}%)`, amount: upperBandNI });
        }
        
        const newResults = {
            totalNI: niContribution,
            breakdown: niBreakdown,
            salary: grossSalary
        };

        setResults(newResults);
        setHasCalculated(true);

        const csvExportData = [
            ["Description", "Annual", "Monthly", "Weekly"],
            ["Gross Salary", `£${grossSalary.toFixed(2)}`, `£${(grossSalary/12).toFixed(2)}`, `£${(grossSalary/52).toFixed(2)}`],
            ...niBreakdown.map(item => [item.band, `£${item.amount.toFixed(2)}`, `£${(item.amount/12).toFixed(2)}`, `£${(item.amount/52).toFixed(2)}`]),
            ["Total National Insurance", `£${niContribution.toFixed(2)}`, `£${(niContribution/12).toFixed(2)}`, `£${(niContribution/52).toFixed(2)}`],
        ];
        setCsvData(csvExportData);
    };

    useEffect(() => {
        setHasCalculated(false);
    }, [salary]);

    return (
        <div className="bg-white dark:bg-gray-900">
            <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Breadcrumbs path={breadcrumbPath} />
                    <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            UK National Insurance Calculator 2025/26
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Estimate your employee National Insurance contributions for the 2025/26 tax year. See exactly how much you'll pay based on your gross salary.
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="non-printable">
                        <Card className="bg-white dark:bg-gray-800">
                            <CardHeader><CardTitle>Enter Your Salary</CardTitle></CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="salary">Gross Annual Salary</Label>
                                    <div className="relative">
                                        <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input id="salary" type="number" value={salary} onChange={e => setSalary(e.target.value)} className="pl-10 dark:bg-gray-700" placeholder="e.g. 35000" />
                                    </div>
                                </div>
                                <Button onClick={handleCalculate} className="w-full text-lg">
                                    <Calculator className="w-5 h-5 mr-2" />
                                    Calculate NI
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        {hasCalculated && results ? (
                            <>
                                <div className="flex justify-between items-center non-printable">
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your NI Breakdown</h2>
                                    <ExportActions csvData={csvData} fileName="national-insurance-calculation" title="National Insurance Calculation" />
                                </div>
                                <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/50 dark:to-indigo-800/50 border-indigo-200 dark:border-indigo-700">
                                    <CardHeader>
                                        <CardTitle className="text-indigo-900 dark:text-indigo-200">Total Annual NI Contribution</CardTitle>
                                    </CardHeader>
                                    <CardContent className="text-center">
                                        <p className="text-4xl font-bold text-indigo-800 dark:text-indigo-100">
                                            £<AnimatedNumber value={results.totalNI} />
                                        </p>
                                        <p className="text-indigo-700 dark:text-indigo-300 mt-2">
                                            £{(results.totalNI / 12).toFixed(2)} per month
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-white dark:bg-gray-800">
                                    <CardHeader><CardTitle>How it's calculated</CardTitle></CardHeader>
                                    <CardContent className="space-y-3">
                                        {results.breakdown.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                                <span className="font-medium text-gray-800 dark:text-gray-200">{item.band}</span>
                                                <span className="font-semibold text-gray-900 dark:text-gray-100">£{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-gray-900 dark:text-gray-100">
                                            <span>Total</span>
                                            <span>£{results.totalNI.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </>
                        ) : (
                            <Card className="flex items-center justify-center h-full min-h-[300px] bg-white dark:bg-gray-800">
                                <div className="text-center text-gray-500 dark:text-gray-400">
                                    <Calculator className="w-12 h-12 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold">Ready to calculate?</h3>
                                    <p>Enter your salary to see your NI contributions.</p>
                                </div>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            <CalculatorWrapper>
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">What is National Insurance?</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        National Insurance (NI) is a fundamental tax in the United Kingdom paid by employees, employers, and the self-employed. It plays a crucial role in funding key public services and state benefits. Your NI contributions help to build your entitlement to benefits such as the State Pension, Jobseeker's Allowance, Employment and Support Allowance, and Maternity Allowance. It is a separate deduction from Income Tax, and both are typically taken from your payslip before you receive your net pay.
                    </p>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">When to Use This Calculator</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Our National Insurance calculator is a vital tool for understanding your personal finances. You should use it when:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li><b>Starting a new job:</b> To understand how much NI will be deducted from your new salary.</li>
                        <li><b>Considering a pay rise:</b> See how an increase in your gross pay affects your NI contributions, especially if it pushes you into a different NI band.</li>
                        <li><b>Budgeting:</b> To get an accurate picture of your monthly deductions for better financial planning.</li>
                        <li><b>Reviewing your payslip:</b> To check that the NI deductions on your payslip are accurate.</li>
                    </ul>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Example Use Case</h3>
                    <p className="text-gray-700 dark:text-gray-300">
                        Let's say you earn a gross annual salary of £40,000. Using the 2025/26 tax year rates, you don't pay NI on the first £12,570 of your earnings. On the portion of your salary between £12,570 and £40,000 (which is £27,430), you pay the main rate of 8%. This results in an annual NI contribution of £2,194.40. Our calculator breaks this down for you instantly, showing you the exact amounts and how they correspond to the official thresholds.
                    </p>
                </div>
            </CalculatorWrapper>
            
            <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <FAQSection faqs={nationalInsuranceFAQs} />
                </div>
            </div>

            <RelatedCalculators
                calculators={[
                    { name: "Salary Calculator", url: "/SalaryCalculator", description: "See your full take-home pay after all deductions." },
                    { name: "Income Tax Calculator", url: "/IncomeTaxCalculator", description: "Calculate your income tax liability separately." },
                    { name: "PAYE Calculator", url: "/PAYECalculator", description: "A comprehensive tool for PAYE employees." }
                ]}
            />
        </div>
    );
}
