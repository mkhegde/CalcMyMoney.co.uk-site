import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoundSterling, Calculator, Briefcase, Building, HelpCircle, ArrowRightLeft } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";
import AnimatedNumber from "../components/general/AnimatedNumber";

const contractorFAQs = [
  {
    question: "What is IR35?",
    answer: "IR35 (or the 'off-payroll working rules') is UK tax legislation designed to identify 'disguised employees' – contractors who work in a similar way to permanent employees but operate through their own limited company to pay less tax. If your contract is 'inside IR35', you're treated as an employee for tax purposes."
  },
  {
    question: "What's the difference between 'Inside IR35' and 'Outside IR35'?",
    answer: "'Inside IR35' means you are a deemed employee, and your income is subject to PAYE (Income Tax and National Insurance) just like a regular employee. 'Outside IR35' means you are a genuine business-to-business service provider, and your company pays Corporation Tax on profits. You then draw funds via a mix of salary and dividends."
  },
  {
    question: "Who pays Employer's National Insurance for Inside IR35 roles?",
    answer: "The 'fee payer' (usually the recruitment agency or the end client) is responsible for paying Employer's NI. However, they often deduct this cost from the day rate offered to the contractor, effectively reducing the contractor's gross income."
  },
  {
    question: "What are common business expenses for an Outside IR35 contractor?",
    answer: "Allowable expenses can include professional indemnity insurance, accountancy fees, software subscriptions, office costs, business travel, and a portion of home-as-office costs. These reduce your company's profit and therefore its Corporation Tax bill."
  },
  {
    question: "Why take a small salary and dividends when Outside IR35?",
    answer: "This is a tax-efficient way to extract profit. A small salary is usually set at or below the National Insurance threshold, so little to no NI or income tax is paid. The remaining profit, after Corporation Tax, is then drawn as dividends, which have lower tax rates than income tax."
  }
];

// --- Tax Data for 2025/26 ---
const taxYearData = {
    taxBracketsEngland: [
      { min: 0, max: 12570, rate: 0 }, { min: 12571, max: 50270, rate: 0.20 },
      { min: 50271, max: 125140, rate: 0.40 }, { min: 125141, max: Infinity, rate: 0.45 }
    ],
    taxBracketsScotland: [
      { min: 0, max: 12570, rate: 0 }, { min: 12571, max: 14876, rate: 0.19 },
      { min: 14877, max: 26561, rate: 0.20 }, { min: 26562, max: 43662, rate: 0.21 },
      { min: 43663, max: 75000, rate: 0.42 }, { min: 75001, max: 125140, rate: 0.45 },
      { min: 125141, max: Infinity, rate: 0.48 }
    ],
    employeeNiThresholds: [
      { min: 0, max: 12570, rate: 0 }, { min: 12571, max: 50270, rate: 0.08 },
      { min: 50271, max: Infinity, rate: 0.02 }
    ],
    employerNiRate: 0.138,
    employerNiThreshold: 9100,
    corporationTax: { mainRate: 0.25, smallProfitRate: 0.19, lowerThreshold: 50000, upperThreshold: 250000 },
    dividendAllowance: 500,
    dividendRates: { basic: 0.0875, higher: 0.3375, additional: 0.3935 },
    personalAllowance: 12570
};

export default function ContractorCalculator() {
  const [dayRate, setDayRate] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [weeksPerYear, setWeeksPerYear] = useState('48');
  const [businessExpenses, setBusinessExpenses] = useState('');
  const [pensionContribution, setPensionContribution] = useState('5');
  const [location, setLocation] = useState('england');
  
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const calculateTakeHome = () => {
    const rate = Number(dayRate) || 0;
    const days = Number(daysPerWeek) || 0;
    const weeks = Number(weeksPerYear) || 0;
    const expenses = Number(businessExpenses) || 0;
    const pensionPercent = Number(pensionContribution) / 100 || 0;

    const totalRevenue = rate * days * weeks;
    if (totalRevenue === 0) {
      setHasCalculated(true);
      setResults(null);
      return;
    }

    // --- Inside IR35 Calculation ---
    const employerNI = Math.max(0, (totalRevenue - taxYearData.employerNiThreshold) * taxYearData.employerNiRate);
    const grossSalaryInside = totalRevenue - employerNI; // Day rate is effectively reduced by Employer's NI
    const pensionInside = grossSalaryInside * pensionPercent;
    let personalAllowance = taxYearData.personalAllowance;
    if (grossSalaryInside > 100000) {
        personalAllowance = Math.max(0, personalAllowance - (grossSalaryInside - 100000) / 2);
    }
    const taxableIncomeInside = Math.max(0, grossSalaryInside - pensionInside - personalAllowance);

    const taxBrackets = location === 'scotland' ? taxYearData.taxBracketsScotland : taxYearData.taxBracketsEngland;
    let taxInside = 0;
    for (const bracket of taxBrackets) {
        if (taxableIncomeInside > bracket.min) {
            const amountInBracket = Math.min(taxableIncomeInside, bracket.max) - bracket.min;
            taxInside += amountInBracket * bracket.rate;
        }
    }

    let niInside = 0;
    for (const threshold of taxYearData.employeeNiThresholds) {
        if (grossSalaryInside > threshold.min) {
            const niableInThreshold = Math.min(grossSalaryInside, threshold.max) - threshold.min;
            niInside += niableInThreshold * threshold.rate;
        }
    }
    const takeHomeInside = grossSalaryInside - taxInside - niInside - pensionInside;


    // --- Outside IR35 Calculation ---
    const directorSalary = taxYearData.personalAllowance; // Common strategy
    const pensionOutside = (totalRevenue - directorSalary) * pensionPercent; // On remaining profit
    const companyProfitBeforeTax = totalRevenue - expenses - directorSalary - pensionOutside;
    
    let corporationTax = 0;
    if (companyProfitBeforeTax > taxYearData.corporationTax.lowerThreshold) {
        if (companyProfitBeforeTax > taxYearData.corporationTax.upperThreshold) {
            corporationTax = companyProfitBeforeTax * taxYearData.corporationTax.mainRate;
        } else {
            const marginalRelief = (taxYearData.corporationTax.upperThreshold - companyProfitBeforeTax) * (3/200);
            corporationTax = (companyProfitBeforeTax * taxYearData.corporationTax.mainRate) - marginalRelief;
        }
    } else {
        corporationTax = companyProfitBeforeTax * taxYearData.corporationTax.smallProfitRate;
    }
    corporationTax = Math.max(0, corporationTax);

    const profitAfterTax = companyProfitBeforeTax - corporationTax;
    const availableDividends = profitAfterTax;

    const dividendTaxableIncome = directorSalary + availableDividends;
    let personalAllowanceDividends = taxYearData.personalAllowance;
    if (dividendTaxableIncome > 100000) {
        personalAllowanceDividends = Math.max(0, personalAllowanceDividends - (dividendTaxableIncome - 100000) / 2);
    }
    const taxableDividends = Math.max(0, availableDividends - taxYearData.dividendAllowance);

    let dividendTax = 0;
    let remainingDividends = taxableDividends;
    
    const basicRateBand = taxBrackets[1].max - personalAllowanceDividends;
    const higherRateBand = taxBrackets[2].max - taxBrackets[1].max;

    const basicTaxable = Math.min(remainingDividends, basicRateBand);
    dividendTax += basicTaxable * taxYearData.dividendRates.basic;
    remainingDividends -= basicTaxable;

    const higherTaxable = Math.min(remainingDividends, higherRateBand);
    dividendTax += higherTaxable * taxYearData.dividendRates.higher;
    remainingDividends -= higherTaxable;

    dividendTax += remainingDividends * taxYearData.dividendRates.additional;
    
    const takeHomeOutside = directorSalary + availableDividends - dividendTax;

    const newResults = {
      inside: {
        takeHome: takeHomeInside,
        gross: grossSalaryInside,
        tax: taxInside,
        ni: niInside,
        pension: pensionInside,
        employerNI: employerNI
      },
      outside: {
        takeHome: takeHomeOutside,
        revenue: totalRevenue,
        corporationTax: corporationTax,
        dividendTax: dividendTax,
        directorSalary: directorSalary,
        dividends: availableDividends,
        expenses: expenses,
        pension: pensionOutside
      }
    };
    setResults(newResults);
    setHasCalculated(true);
    
    const csvExportData = [
        ["Metric", "Inside IR35", "Outside IR35"],
        ["Day Rate", `£${rate}`, `£${rate}`],
        ["Total Revenue", `£${totalRevenue.toFixed(2)}`, `£${totalRevenue.toFixed(2)}`],
        ["", "", ""],
        ["--- Deductions ---", "", ""],
        ["Employer's NI", `£${employerNI.toFixed(2)}`, "N/A"],
        ["Business Expenses", "N/A", `£${expenses.toFixed(2)}`],
        ["Corporation Tax", "N/A", `£${corporationTax.toFixed(2)}`],
        ["Income Tax", `£${taxInside.toFixed(2)}`, "N/A (covered by Dividend Tax)"],
        ["Employee's NI", `£${niInside.toFixed(2)}`, "N/A (on salary below threshold)"],
        ["Dividend Tax", "N/A", `£${dividendTax.toFixed(2)}`],
        ["Pension Contribution", `£${pensionInside.toFixed(2)}`, `£${pensionOutside.toFixed(2)}`],
        ["", "", ""],
        ["--- Take Home Pay ---", "", ""],
        ["Annual", `£${takeHomeInside.toFixed(2)}`, `£${takeHomeOutside.toFixed(2)}`],
        ["Monthly", `£${(takeHomeInside / 12).toFixed(2)}`, `£${(takeHomeOutside / 12).toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  };

  useEffect(() => {
    setHasCalculated(false);
  }, [dayRate, daysPerWeek, weeksPerYear, businessExpenses, pensionContribution, location]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Contractor Calculator (IR35) 2025/26
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Compare your take-home pay for contracts inside and outside IR35. Understand the tax implications of being a deemed employee vs. a limited company director.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader><CardTitle>Contract Details</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Day Rate (£)</Label>
                  <Input type="number" value={dayRate} onChange={e => setDayRate(e.target.value)} placeholder="e.g. 500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Days / Week</Label>
                    <Input type="number" value={daysPerWeek} onChange={e => setDaysPerWeek(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Weeks / Year</Label>
                    <Input type="number" value={weeksPerYear} onChange={e => setWeeksPerYear(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Annual Business Expenses (£)</Label>
                  <Input type="number" value={businessExpenses} onChange={e => setBusinessExpenses(e.target.value)} placeholder="e.g. 3000 (for Outside IR35)" />
                </div>
                <div className="space-y-2">
                  <Label>Pension Contribution (%)</Label>
                  <Input type="number" value={pensionContribution} onChange={e => setPensionContribution(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Tax Location</Label>
                   <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                          <SelectItem value="england">England, Wales or NI</SelectItem>
                          <SelectItem value="scotland">Scotland</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <Button onClick={calculateTakeHome} className="w-full text-lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Compare Scenarios
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-3 space-y-6">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Comparison</h2>
                  <ExportActions csvData={csvData} fileName="ir35-comparison" title="IR35 Comparison" />
                </div>

                {/* Summary Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300"><Briefcase /> Inside IR35</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Annual Take-Home</p>
                      <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">£<AnimatedNumber value={results.inside.takeHome} /></p>
                       <p className="text-sm text-orange-700 dark:text-orange-400 mt-2">£{(results.inside.takeHome / 12).toLocaleString()} / month</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800">
                     <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-300"><Building /> Outside IR35</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium text-green-700 dark:text-green-400">Annual Take-Home</p>
                      <p className="text-3xl font-bold text-green-900 dark:text-green-100">£<AnimatedNumber value={results.outside.takeHome} /></p>
                       <p className="text-sm text-green-700 dark:text-green-400 mt-2">£{(results.outside.takeHome / 12).toLocaleString()} / month</p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader><CardTitle>Comparison Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="grid grid-cols-3 items-center gap-2 text-center">
                        <span className="font-semibold text-left">Metric</span>
                        <span className="font-semibold text-orange-800 dark:text-orange-300">Inside IR35</span>
                        <span className="font-semibold text-green-800 dark:text-green-300">Outside IR35</span>
                      </div>

                      {[
                        { label: 'Total Revenue', inside: results.outside.revenue, outside: results.outside.revenue },
                        { label: 'Gross Income (after Employer NI)', inside: results.inside.gross, outside: 'N/A' },
                        { label: 'Corporation Tax', inside: 'N/A', outside: -results.outside.corporationTax },
                        { label: 'Income Tax', inside: -results.inside.tax, outside: 'N/A' },
                        { label: 'Dividend Tax', inside: 'N/A', outside: -results.outside.dividendTax },
                        { label: 'Employee NI', inside: -results.inside.ni, outside: 'N/A' },
                        { label: 'Pension', inside: -results.inside.pension, outside: -results.outside.pension },
                        { label: 'Expenses', inside: 'N/A', outside: -results.outside.expenses },
                      ].map(row => (
                        <div key={row.label} className="grid grid-cols-3 items-center gap-2 text-center p-2 rounded-md odd:bg-gray-50 dark:odd:bg-gray-800/50">
                          <span className="text-left text-sm">{row.label}</span>
                          <span className="text-sm font-mono">{typeof row.inside === 'number' ? `£${row.inside.toLocaleString(undefined, {maximumFractionDigits:0})}` : row.inside}</span>
                          <span className="text-sm font-mono">{typeof row.outside === 'number' ? `£${row.outside.toLocaleString(undefined, {maximumFractionDigits:0})}` : row.outside}</span>
                        </div>
                      ))}

                      <div className="grid grid-cols-3 items-center gap-2 text-center p-3 rounded-md bg-blue-50 dark:bg-blue-900/30 border-t-2 border-blue-200 dark:border-blue-700">
                          <span className="font-bold text-left">Net Take-Home (Annual)</span>
                          <span className="font-bold text-orange-800 dark:text-orange-300">£{results.inside.takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                          <span className="font-bold text-green-800 dark:text-green-300">£{results.outside.takeHome.toLocaleString(undefined, {maximumFractionDigits:0})}</span>
                      </div>
                       <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-center">
                          <p className="font-semibold text-yellow-900 dark:text-yellow-200">
                            Difference: 
                            <span className={results.outside.takeHome > results.inside.takeHome ? 'text-green-600' : 'text-red-600'}>
                              {' '}£{(results.outside.takeHome - results.inside.takeHome).toLocaleString(undefined, {maximumFractionDigits:0})}
                            </span>
                             {' '} annually when Outside IR35
                          </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <ArrowRightLeft className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Compare your contract scenarios</h3>
                  <p>Enter your contract details to see the financial difference between working inside and outside IR35.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FAQSection faqs={contractorFAQs} title="Contractor & IR35 FAQ" />
        </div>
      </div>
    </div>
  );
}