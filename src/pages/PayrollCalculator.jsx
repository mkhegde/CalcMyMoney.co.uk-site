
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PoundSterling, Calculator, Building2, User, Percent, Shield } from "lucide-react";
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";

const payrollFAQs = [
  {
    question: "What are an employer's main payroll costs?",
    answer: "Besides the employee's gross salary, the main costs for an employer are Employer's National Insurance contributions and mandatory employer pension contributions."
  },
  {
    question: "How much is Employer's National Insurance?",
    answer: "For the 2025/26 tax year, Employer's NI is 13.8% on all earnings above the Secondary Threshold, which is £9,100 per year (£175 per week)."
  },
  {
    question: "What are the minimum employer pension contributions?",
    answer: "Under auto-enrolment rules, the minimum employer contribution is 3% of the employee's 'qualifying earnings' (between £6,240 and £50,270 per year)."
  }
];

// 2025/26 Tax Year Data
const employeeNIThresholds = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12571, max: 50270, rate: 0.08 },
  { min: 50271, max: Infinity, rate: 0.02 }
];

const employerNIThreshold = 9100; // Secondary Threshold
const employerNIRate = 0.138;

const pensionQualifyingMin = 6240;
const pensionQualifyingMax = 50270;
const employerPensionMinRate = 0.03;
const employeePensionMinRate = 0.05;

export default function PayrollCalculator() {
  const [grossSalary, setGrossSalary] = useState('35000');
  const [employerPension, setEmployerPension] = useState('3');
  const [employeePension, setEmployeePension] = useState('5');
  const [results, setResults] = useState(null);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [csvData, setCsvData] = useState(null);

  const handleCalculate = useCallback(() => {
    const salary = Number(grossSalary) || 0;
    const employerPensionRate = (Number(employerPension) || 0) / 100;
    const employeePensionRate = (Number(employeePension) || 0) / 100;

    if (salary <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }

    // Employer Costs
    const employerNI = salary > employerNIThreshold ? (salary - employerNIThreshold) * employerNIRate : 0;
    const qualifyingEarnings = Math.max(0, Math.min(salary, pensionQualifyingMax) - pensionQualifyingMin);
    const employerPensionContribution = qualifyingEarnings * employerPensionRate;
    const totalCostToEmployer = salary + employerNI + employerPensionContribution;

    // Employee Deductions & Take-home
    const employeePensionContribution = qualifyingEarnings * employeePensionRate;
    const salaryAfterPension = salary - employeePensionContribution;
    
    // Employee tax calculation
    let personalAllowance = 12570;
    if (salaryAfterPension > 100000) {
        personalAllowance = Math.max(0, 12570 - (salaryAfterPension - 100000) / 2);
    }
    const taxableIncome = Math.max(0, salaryAfterPension - personalAllowance);
    
    let tax = 0;
    if (taxableIncome > 0) { // Only calculate if there's taxable income
        const basicRateBand = 50270 - personalAllowance; // 20% rate up to 50270
        const higherRateBand = 125140 - 50270; // 40% rate between 50270 and 125140

        if (taxableIncome <= basicRateBand) {
            tax = taxableIncome * 0.20;
        } else {
            tax = basicRateBand * 0.20;
            const remainingTaxable = taxableIncome - basicRateBand;

            if (remainingTaxable <= higherRateBand) {
                tax += remainingTaxable * 0.40;
            } else {
                tax += higherRateBand * 0.40;
                const additionalRateTaxable = remainingTaxable - higherRateBand;
                tax += additionalRateTaxable * 0.45;
            }
        }
    }
    
    let employeeNI = 0;
    for (const threshold of employeeNIThresholds) {
        if (salary > threshold.min) {
            const niableAmount = Math.min(salary, threshold.max) - threshold.min;
            if (niableAmount > 0) {
                employeeNI += niableAmount * threshold.rate;
            }
        }
    }

    const totalDeductions = tax + employeeNI + employeePensionContribution;
    const netPay = salary - totalDeductions;

    const newResults = {
      grossSalary: salary,
      employerNI,
      employerPensionContribution,
      totalCostToEmployer,
      employeePensionContribution,
      tax,
      employeeNI,
      netPay
    };
    
    setResults(newResults);
    setHasCalculated(true);

    const csvExportData = [
        ["Category", "Description", "Annual", "Monthly"],
        ["Employer Costs", "Gross Salary", `£${salary.toFixed(2)}`, `£${(salary / 12).toFixed(2)}`],
        ["Employer Costs", "Employer's NI", `£${employerNI.toFixed(2)}`, `£${(employerNI / 12).toFixed(2)}`],
        ["Employer Costs", "Employer Pension", `£${employerPensionContribution.toFixed(2)}`, `£${(employerPensionContribution / 12).toFixed(2)}`],
        ["Employer Costs", "Total Cost to Employ", `£${totalCostToEmployer.toFixed(2)}`, `£${(totalCostToEmployer / 12).toFixed(2)}`],
        ["---"],
        ["Employee's Payslip", "Gross Salary", `£${salary.toFixed(2)}`, `£${(salary / 12).toFixed(2)}`],
        ["Employee's Payslip", "Income Tax", `-£${tax.toFixed(2)}`, `-£${(tax / 12).toFixed(2)}`],
        ["Employee's Payslip", "Employee's NI", `-£${employeeNI.toFixed(2)}`, `-£${(employeeNI / 12).toFixed(2)}`],
        ["Employee's Payslip", "Employee Pension", `-£${employeePensionContribution.toFixed(2)}`, `-£${(employeePensionContribution / 12).toFixed(2)}`],
        ["Employee's Payslip", "Net Take-Home Pay", `£${netPay.toFixed(2)}`, `£${(netPay / 12).toFixed(2)}`],
    ];
    setCsvData(csvExportData);
  }, [grossSalary, employerPension, employeePension]);

  useEffect(() => {
    handleCalculate();
  }, [handleCalculate]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              UK Payroll Calculator for Employers
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Estimate the total cost of hiring an employee and see a breakdown of their take-home pay. Updated for 2025/26 tax year.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="print-title hidden">Payroll Calculation</div>
        <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
          <div className="lg:col-span-2 non-printable">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Employee Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                  <Label htmlFor="grossSalary">Employee Gross Annual Salary</Label>
                  <div className="relative mt-2">
                    <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input id="grossSalary" type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="pl-10" />
                  </div>
                </div>
                 <div>
                  <Label htmlFor="employerPension" className="flex justify-between">
                    <span>Employer Pension Contribution</span>
                    <span className="font-semibold">{employerPension}%</span>
                  </Label>
                  <Slider value={[Number(employerPension)]} onValueChange={(value) => setEmployerPension(String(value[0]))} max={15} step={0.5} className="mt-2" />
                  <p className="text-xs text-gray-500 mt-1">Minimum is 3% of qualifying earnings.</p>
                </div>
                <div>
                  <Label htmlFor="employeePension" className="flex justify-between">
                    <span>Employee Pension Contribution</span>
                    <span className="font-semibold">{employeePension}%</span>
                  </Label>
                  <Slider value={[Number(employeePension)]} onValueChange={(value) => setEmployeePension(String(value[0]))} max={15} step={0.5} className="mt-2" />
                   <p className="text-xs text-gray-500 mt-1">Minimum is 5% of qualifying earnings.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3 space-y-6 printable-area">
            {hasCalculated && results ? (
              <>
                <div className="flex justify-between items-center non-printable">
                  <h2 className="text-2xl font-bold text-gray-800">Payroll Summary</h2>
                  <ExportActions csvData={csvData} fileName="payroll-summary" title="Payroll Summary" />
                </div>
                
                <Card className="bg-blue-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                        <Building2 className="w-5 h-5"/>
                        Employer's Costs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-lg"><p>Gross Salary</p> <p>£{results.grossSalary.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-lg"><p>Employer's NI</p> <p>£{results.employerNI.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-lg"><p>Employer Pension</p> <p>£{results.employerPensionContribution.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-xl font-bold pt-2 border-t mt-2"><p>Total Cost to Employ</p> <p>£{results.totalCostToEmployer.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                  </CardContent>
                </Card>
                
                 <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="w-5 h-5"/>
                        Employee's Take-Home Pay
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                     <div className="flex justify-between"><p>Gross Salary</p> <p>£{results.grossSalary.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-red-600"><p>Income Tax</p> <p>- £{results.tax.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-red-600"><p>Employee's NI</p> <p>- £{results.employeeNI.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-red-600"><p>Employee Pension</p> <p>- £{results.employeePensionContribution.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t mt-2"><p>Net Take-Home Pay</p> <p>£{results.netPay.toLocaleString('en-GB', {maximumFractionDigits:2})}</p></div>
                  </CardContent>
                </Card>

              </>
            ) : (
              <Card className="flex items-center justify-center h-[400px]">
                <div className="text-center text-gray-500">
                  <Calculator className="w-12 h-12 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Calculate payroll costs</h3>
                  <p>Enter an employee's salary to see the full breakdown.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="bg-gray-50 py-12 non-printable mt-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={payrollFAQs} />
          </div>
        </div>
      </div>
    </div>
  );
}
