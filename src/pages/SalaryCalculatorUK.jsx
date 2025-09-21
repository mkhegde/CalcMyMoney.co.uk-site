
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PoundSterling, Calculator, TrendingDown, TrendingUp, HelpCircle, ChevronsUpDown, Settings2 } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import ExportActions from "../components/calculators/ExportActions";
import FAQSection from "../components/calculators/FAQSection";
import AnimatedNumber from "../components/general/AnimatedNumber";
import CalculatorWrapper from "../components/calculators/CalculatorWrapper"; // New component for content
import RelatedCalculators from "../components/calculators/RelatedCalculators"; // New component for internal linking
import Breadcrumbs from "../components/general/Breadcrumbs";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom"; // Added Link import

// Adding structured data for better rich snippets
const salaryCalculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "UK Salary Calculator 2025/26",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web Browser",
  "description": "Free UK salary calculator for 2025/26 tax year. Calculate take-home pay from gross salary and vice versa with accurate tax and National Insurance calculations.",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "GBP"
  }
};

const breadcrumbJsonLd = {
  "@context":"https://schema.org",
  "@type":"BreadcrumbList",
  "itemListElement":[
    {"@type":"ListItem","position":1,"name":"Home","item":"https://calcmymoney.co.uk/"},
    {"@type":"ListItem","position":2,"name":"Salary & Income","item":"https://calcmymoney.co.uk/salary-calculator-uk/"}
  ]
};

const taxData = {
  "2025-26": { // This is the new current year, based on the previous 2025-26 data
    name: "2025/26",
    taxBracketsEngland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 50270, rate: 0.20, name: "Basic Rate" },
      { min: 50271, max: 125140, rate: 0.40, name: "Higher Rate" },
      { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
    ],
    taxBracketsScotland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 14876, rate: 0.19, name: "Starter Rate" },
      { min: 14877, max: 26561, rate: 0.20, name: "Basic Rate" },
      { min: 26562, max: 43662, rate: 0.21, name: "Intermediate Rate" },
      { min: 43663, max: 75000, rate: 0.42, name: "Higher Rate" },
      { min: 75001, max: 125140, rate: 0.45, name: "Advanced Rate" }, // Changed from "Top Rate" as per common data
      { min: 125141, max: Infinity, rate: 0.48, name: "Top Rate" }
    ],
    niThresholds: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12571, max: 50270, rate: 0.08 },
      { min: 50271, max: Infinity, rate: 0.02 }
    ],
    studentLoanRates: {
      none: { threshold: 0, rate: 0 },
      plan1: { threshold: 24990, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 31395, rate: 0.09 },
      plan5: { threshold: 25000, rate: 0.09 },
      postgraduate: { threshold: 21000, rate: 0.06 }
    },
    defaultTaxCode: "1257L",
    basePersonalAllowance: 12570
  },
  "2024-25": { 
    name: "2024/25",
    taxBracketsEngland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 50270, rate: 0.20, name: "Basic Rate" },
      { min: 50271, max: 125140, rate: 0.40, name: "Higher Rate" },
      { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
    ],
    taxBracketsScotland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 14732, rate: 0.19, name: "Starter Rate" },
      { min: 14733, max: 25688, rate: 0.20, name: "Basic Rate" },
      { min: 25689, max: 43662, rate: 0.21, name: "Intermediate Rate" },
      { min: 43663, max: 125140, rate: 0.42, name: "Higher Rate" },
      { min: 125141, max: Infinity, rate: 0.47, name: "Top Rate" }
    ],
    niThresholds: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12571, max: 50270, rate: 0.10 }, // Note: Rate was higher for part of the year, using an average representation
      { min: 50271, max: Infinity, rate: 0.02 }
    ],
    studentLoanRates: {
      none: { threshold: 0, rate: 0 },
      plan1: { threshold: 22015, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 27660, rate: 0.09 },
      plan5: { threshold: 25000, rate: 0.09 },
      postgraduate: { threshold: 21000, rate: 0.06 }
    },
    defaultTaxCode: "1257L",
    basePersonalAllowance: 12570
  }
};

const salaryCalculatorFAQs = [
  {
    question: "What is the difference between gross and net salary?",
    answer: "Gross salary is your total earnings before any deductions. Net salary (take-home pay) is what you receive after tax, National Insurance, pension contributions, and other deductions are removed."
  },
  {
    question: "How is UK income tax calculated?",
    answer: "UK income tax is calculated using a progressive system with different rates: 0% (Personal Allowance up to £12,570), 20% (Basic Rate £12,571-£50,270), 40% (Higher Rate £50,271-£125,140), and 45% (Additional Rate above £125,140). Scotland has different rates."
  },
  {
    question: "What is National Insurance and how much do I pay?",
    answer: "National Insurance funds state benefits like the NHS and state pension. For 2025/26, you pay 8% on earnings between £12,570-£50,270, then 2% on earnings above £50,270."
  },
  {
    question: "What should I include in 'Other Tax-Free Allowances'?",
    answer: "This field is for additional tax-free allowances you're entitled to beyond the standard Personal Allowance. Common examples include: Marriage Allowance (£1,260 if your spouse transfers their unused Personal Allowance), Blind Person's Allowance (£3,070 for registered blind individuals), Property Allowance (up to £1,000 for rental income), and Trading Allowance (up to £1,000 for small business income). Only include amounts you're already aware you're entitled to. If unsure, consult HMRC guidance or a tax advisor."
  },
  {
    question: "Can I reduce my tax through pension contributions?",
    answer: "Yes! Pension contributions are deducted from your gross salary before tax is calculated, reducing your taxable income. The annual allowance is typically £40,000 (or £10,000 if you're a high earner already drawing pension benefits)."
  },
  {
    question: "What does my tax code mean?",
    answer: "Your tax code tells your employer how much tax-free income you're entitled to. The standard code 1257L gives you the full £12,570 personal allowance. Different codes reflect your personal circumstances."
  },
  {
    question: "Are these calculations accurate for my payslip?",
    answer: "Our calculations use official HMRC rates and provide estimates. Your actual deductions may vary based on your specific tax code, benefits in kind, student loans, or other personal circumstances."
  }
];

// Add color constants for charts
const CHART_COLORS = {
  takeHome: '#10b981', // green
  tax: '#ef4444', // red
  nationalInsurance: '#8b5cf6', // purple
  pension: '#f59e0b', // amber
  studentLoan: '#f97316', // orange
};

const calculateDeductions = (grossSalary, options, taxYearData, useAdvancedOptions = false) => {
    const {
        location,
        taxCode,
        otherAllowances,
        pensionType,
        pensionValue,
        studentLoanPlan,
        seisInvestment,
        eisInvestment
     } = options;

    const { basePersonalAllowance, taxBracketsEngland, taxBracketsScotland, niThresholds, studentLoanRates } = taxYearData;

    // 1. Calculate Personal Allowance
    let personalAllowance = basePersonalAllowance;
    
    // Only apply tax code and other allowances if advanced options are used
    if (useAdvancedOptions) {
        if (taxCode && taxCode.match(/^\d+L$/)) {
            personalAllowance = parseInt(taxCode.slice(0, -1)) * 10;
        }
        personalAllowance += otherAllowances;
    }

    // Personal allowance reduction for high earners (always applies)
    if (grossSalary > 100000) {
        personalAllowance = Math.max(0, personalAllowance - (grossSalary - 100000) / 2);
    }
    
    // 2. Calculate Pension - ONLY if advanced options are used
    let pensionAmount = 0;
    if (useAdvancedOptions && pensionValue > 0) {
        if (pensionType === "percent") {
            pensionAmount = (grossSalary * pensionValue) / 100;
        } else {
            pensionAmount = pensionValue * 12; // Assuming fixed is monthly
        }
    }

    // 3. Calculate Income Tax
    const taxBrackets = (useAdvancedOptions && location === 'scotland') ? taxBracketsScotland : taxBracketsEngland;
    
    let calculatedTax = 0;
    let newTaxBreakdown = [];
    const incomeSubjectToTax = Math.max(0, grossSalary - personalAllowance - pensionAmount);

    for (const bracket of taxBrackets) {
        if (bracket.rate === 0) continue; // Skip personal allowance for breakdown

        // Determine how much of the taxable income falls into this bracket
        // We shift the bracket boundaries relative to the taxable income after PA
        const lowerBound = Math.max(0, bracket.min - personalAllowance);
        const upperBound = bracket.max === Infinity ? Infinity : bracket.max - personalAllowance;
        
        const taxableInThisBand = Math.max(0, Math.min(incomeSubjectToTax, upperBound) - lowerBound);

        if (taxableInThisBand > 0) {
            const taxForBand = taxableInThisBand * bracket.rate;
            calculatedTax += taxForBand;

            newTaxBreakdown.push({
                name: bracket.name,
                amount: taxForBand,
                rate: bracket.rate * 100,
                taxableAmount: taxableInThisBand,
                bracketMin: bracket.min,
                bracketMax: bracket.max === Infinity ? 'No limit' : bracket.max
            });
        }
    }
    
    let tax = calculatedTax;

    // 4. SEIS/EIS Relief - ONLY if advanced options are used
    let seisRelief = 0;
    let eisRelief = 0;
    if (useAdvancedOptions) {
        seisRelief = (seisInvestment || 0) * 0.50;
        eisRelief = (eisInvestment || 0) * 0.30;
        const totalRelief = seisRelief + eisRelief;
        tax = Math.max(0, tax - totalRelief);
    }

    // 5. Calculate National Insurance
    let nationalInsuranceTotal = 0;
    let niBreakdown = [];
    
    for (const threshold of niThresholds) {
        if (grossSalary > threshold.min) {
            const niableInThreshold = Math.min(grossSalary, threshold.max) - threshold.min;
            if (niableInThreshold > 0) {
                const niForThreshold = niableInThreshold * threshold.rate;
                nationalInsuranceTotal += niForThreshold;
                
                if (niForThreshold > 0) {
                    niBreakdown.push({
                        rate: threshold.rate * 100,
                        amount: niForThreshold,
                        niableAmount: niableInThreshold,
                        min: threshold.min,
                        max: threshold.max === Infinity ? 'No limit' : threshold.max
                    });
                }
            }
        }
    }

    // 6. Calculate Student Loan - ONLY if advanced options are used
    let studentLoan = 0;
    if (useAdvancedOptions && studentLoanPlan !== 'none') {
        const plan = studentLoanRates[studentLoanPlan];
        if (grossSalary > plan.threshold) {
          studentLoan = (grossSalary - plan.threshold) * plan.rate;
        }
    }

    const totalDeductions = tax + nationalInsuranceTotal + studentLoan + pensionAmount;
    const takeHome = grossSalary - totalDeductions;
    
    return {
        grossAnnual: grossSalary,
        tax: { total: tax, breakdown: newTaxBreakdown },
        nationalInsurance: { total: nationalInsuranceTotal, breakdown: niBreakdown },
        studentLoan,
        pension: pensionAmount,
        totalDeductions,
        takeHomeAnnual: takeHome,
        personalAllowance: personalAllowance,
        seisRelief,
        eisRelief
    };
};

// --- Net to Gross Calculator ---
const calculateGrossFromNet = (netSalary, options, taxYearData, useAdvancedOptions) => {
    let lowGuess = netSalary;
    let highGuess = netSalary * 2.5; 
    let guess = netSalary * 1.5;
    let iterations = 0;

    while (iterations < 50) {
        const calculatedNet = calculateDeductions(guess, options, taxYearData, useAdvancedOptions).takeHomeAnnual;
        const difference = calculatedNet - netSalary;

        if (Math.abs(difference) < 0.01) {
            return guess; // Found a close enough match
        }

        if (difference < 0) { // Our guess was too low
            lowGuess = guess;
        } else { // Our guess was too high
            highGuess = guess;
        }
        
        guess = (lowGuess + highGuess) / 2;
        iterations++;
    }
    return guess; // Return best guess after iterations
};


// Move AdvancedOptions outside the main component to prevent re-creation
const AdvancedOptions = React.memo(({
  taxYear,
  onTaxYearChange,
  location,
  taxCode,
  otherAllowances,
  pensionValue,
  pensionType,
  studentLoanPlan,
  seisInvestment,
  eisInvestment,
  onValueChange
}) => (
  <div className="space-y-6 mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700">
    <div className="space-y-2">
      <Label className="text-gray-900 dark:text-gray-100">Tax Year</Label>
      <Select value={taxYear} onValueChange={onTaxYearChange}>
        <SelectTrigger className="dark:text-gray-50"><SelectValue /></SelectTrigger>
        <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
          <SelectItem value="2025-26">2025/26</SelectItem>
          <SelectItem value="2024-25">2024/25</SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div className="space-y-2">
        <Label className="text-gray-900 dark:text-gray-100">I live in</Label>
        <Select value={location} onValueChange={(val) => onValueChange('location', val)}>
            <SelectTrigger className="dark:text-gray-50"><SelectValue /></SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                <SelectItem value="england">England, Wales or Northern Ireland</SelectItem>
                <SelectItem value="scotland">Scotland</SelectItem>
            </SelectContent>
        </Select>
    </div>
    <div className="space-y-2">
        <Label className="text-gray-900 dark:text-gray-100">My Tax Code</Label>
        <Input value={taxCode} onChange={e => onValueChange('taxCode', e.target.value)} className="dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
        <p className="text-xs text-gray-500 dark:text-gray-400">Default for {taxData[taxYear].name} is {taxData[taxYear].defaultTaxCode}</p>
    </div>

    <div className="space-y-2">
        <Label className="text-gray-900 dark:text-gray-100">Pension Contribution</Label>
        <div className="flex gap-2">
            <Input type="number" value={pensionValue} onChange={e => onValueChange('pensionValue', e.target.value)} className="w-full dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
            <Select value={pensionType} onValueChange={(val) => onValueChange('pensionType', val)}>
                <SelectTrigger className="w-[180px] dark:text-gray-50"><SelectValue /></SelectTrigger>
                <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                    <SelectItem value="percent">%</SelectItem>
                    <SelectItem value="fixed">Fixed PM</SelectItem>
                </SelectContent>
            </Select>
        </div>
    </div>
    <div className="space-y-2">
        <Label className="text-gray-900 dark:text-gray-100">Student Loan Plan</Label>
        <Select value={studentLoanPlan} onValueChange={(val) => onValueChange('studentLoanPlan', val)}>
            <SelectTrigger className="dark:text-gray-50"><SelectValue /></SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                <SelectItem value="none">No Student Loan</SelectItem>
                <SelectItem value="plan1">Plan 1</SelectItem>
                <SelectItem value="plan2">Plan 2</SelectItem>
                <SelectItem value="plan4">Plan 4 (Scotland)</SelectItem>
                <SelectItem value="plan5">Plan 5</SelectItem>
                <SelectItem value="postgraduate">Postgraduate Loan</SelectItem>
            </SelectContent>
        </Select>
    </div>
    
    <div className="space-y-4">
        <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-100">SEIS Investment (50% Tax Relief)</Label>
            <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Input type="number" placeholder="e.g. 1000" value={seisInvestment} onChange={e => onValueChange('seisInvestment', e.target.value)} className="pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Annual investment limit: £200,000</p>
        </div>
        <div className="space-y-2">
            <Label className="text-gray-900 dark:text-gray-100">EIS Investment (30% Tax Relief)</Label>
            <div className="relative">
                <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                <Input type="number" placeholder="e.g. 1000" value={eisInvestment} onChange={e => onValueChange('eisInvestment', e.target.value)} className="pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Annual investment limit: £1,000,000</p>
        </div>
    </div>
    <div className="space-y-2">
        <div className="flex items-center gap-2">
            <Label className="text-gray-900 dark:text-gray-100">Other Tax-Free Allowances (Annual)</Label>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <HelpCircle className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs bg-gray-800 text-white p-3 rounded-lg">
                        <p className="text-sm">
                            <strong>Common allowances include:</strong>
                        </p>
                        <ul className="text-xs mt-1 space-y-1">
                            <li>• Marriage Allowance: £1,260</li>
                            <li>• Blind Person's Allowance: £3,070</li>
                            <li>• Property Allowance: up to £1,000</li>
                            <li>• Trading Allowance: up to £1,000</li>
                        </ul>
                        <p className="text-xs mt-2 italic">
                            Only include if you're already entitled to these allowances.
                        </p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
        <div className="relative">
            <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <Input type="number" value={otherAllowances} onChange={e => onValueChange('otherAllowances', e.target.value)} className="pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" placeholder="e.g. 1260" />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          e.g. Marriage Allowance, Blind Person's Allowance. 
          <a 
            href="#faq-section" 
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            See FAQ for details
          </a>.
        </p>
    </div>
  </div>
));

export default function SalaryCalculatorUK() {
  // Common state
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [payPeriod, setPayPeriod] = useState("annually");
  const [results, setResults] = useState(null); // Changed to null for initial no-calculation state
  const [csvData, setCsvData] = useState(null);
  const [activeTab, setActiveTab] = useState("grossToNet");
  const [taxYear, setTaxYear] = useState("2025-26"); // Updated to 2025-26
  const [hasCalculated, setHasCalculated] = useState(false); // New state to control results display

  // Gross-to-Net state
  const [grossSalary, setGrossSalary] = useState(''); // Changed to empty string

  // Net-to-Gross state
  const [netSalary, setNetSalary] = useState(''); // Changed to empty string

  // Advanced options state
  const [location, setLocation] = useState("england");
  const [taxCode, setTaxCode] = useState(taxData["2025-26"].defaultTaxCode); // Initialize with default for 2025-26
  const [pensionType, setPensionType] = useState("percent");
  const [pensionValue, setPensionValue] = useState(5);
  const [studentLoanPlan, setStudentLoanPlan] = useState("none");
  const [seisInvestment, setSeisInvestment] = useState(''); // Changed to empty string
  const [eisInvestment, setEisInvestment] = useState(''); // Changed to empty string
  const [otherAllowances, setOtherAllowances] = useState(''); // Changed to empty string

  const breadcrumbPath = [
      { name: "Home", url: createPageUrl("Home") },
      { name: "Salary & Income" }
  ];

  const handleTaxYearChange = React.useCallback((year) => {
    setTaxYear(year);
    const currentTaxYearData = taxData[year];
    setTaxCode(currentTaxYearData.defaultTaxCode);
  }, []);

  const handleAdvancedOptionChange = React.useCallback((field, value) => {
    switch (field) {
        case 'taxCode':
            setTaxCode(value);
            break;
        case 'otherAllowances':
            setOtherAllowances(value);
            break;
        case 'pensionValue':
            setPensionValue(value); // Changed to keep as string, conversion handled at calculation
            break;
        case 'pensionType':
            setPensionType(value);
            break;
        case 'studentLoanPlan':
            setStudentLoanPlan(value);
            break;
        case 'seisInvestment':
            setSeisInvestment(value);
            break;
        case 'eisInvestment':
            setEisInvestment(value);
            break;
        case 'location':
            setLocation(value);
            break;
        default:
            break;
    }
  }, []);

  useEffect(() => {
    // Reset calculation when major options change
    setHasCalculated(false);
    setResults(null);
    // Removed taxYear from dependencies as its change is handled by handleTaxYearChange,
    // which also updates the tax code. This prevents unnecessary re-renders of AdvancedOptions.
  }, [activeTab]); // Dependencies simplified to trigger reset on major changes

  const handleCalculate = () => {
    const currentTaxYearData = taxData[taxYear];
    const options = {
        location,
        taxCode,
        otherAllowances: Number(otherAllowances) || 0,
        pensionType,
        pensionValue: Number(pensionValue) || 0, // Ensure pensionValue is a number here
        studentLoanPlan,
        seisInvestment: Number(seisInvestment) || 0,
        eisInvestment: Number(eisInvestment) || 0
    };
    
    let annualSalaryInput; // This will hold the user's input *before* annualization
    let newResults = {};

    if (activeTab === 'grossToNet') {
        annualSalaryInput = Number(grossSalary) || 0;
    } else { // netToGross
        annualSalaryInput = Number(netSalary) || 0;
    }

    let annualAmount; // This will be the annualized amount used in calculation
    switch(payPeriod) {
        case 'monthly':
            annualAmount = annualSalaryInput * 12;
            break;
        case 'weekly':
            annualAmount = annualSalaryInput * 52;
            break;
        case 'daily':
            annualAmount = annualSalaryInput * 260; // 5 days * 52 weeks
            break;
        default: // annually
            annualAmount = annualSalaryInput;
    }
    
    if (activeTab === 'grossToNet') {
        newResults = calculateDeductions(annualAmount, options, currentTaxYearData, showAdvanced);
    } else { // netToGross
        const calculatedGross = calculateGrossFromNet(annualAmount, options, currentTaxYearData, showAdvanced);
        newResults = calculateDeductions(calculatedGross, options, currentTaxYearData, showAdvanced);
    }
    
    setResults(newResults);
    setHasCalculated(true);

    // Prepare CSV Data
    if (newResults.grossAnnual !== undefined) {
        const csvExportData = [
          ["Description", "Annual", "Monthly", "Weekly", "Daily"],
          ["Gross Salary", `£${newResults.grossAnnual.toFixed(2)}`, `£${(newResults.grossAnnual / 12).toFixed(2)}`, `£${(newResults.grossAnnual / 52).toFixed(2)}`, `£${(newResults.grossAnnual / 260).toFixed(2)}`],
          ["Personal Allowance", `£${newResults.personalAllowance.toFixed(2)}`, "", "", ""],
          ["Income Tax", `£${(-newResults.tax.total).toFixed(2)}`, `£${(-newResults.tax.total / 12).toFixed(2)}`, `£${(-newResults.tax.total / 52).toFixed(2)}`, `£${(-newResults.tax.total / 260).toFixed(2)}`],
          ["National Insurance", `£${(-newResults.nationalInsurance.total).toFixed(2)}`, `£${(-newResults.nationalInsurance.total / 12).toFixed(2)}`, `£${(-newResults.nationalInsurance.total / 52).toFixed(2)}`, `£${(-newResults.nationalInsurance.total / 260).toFixed(2)}`],
          ["Pension Contribution", `£${(-newResults.pension).toFixed(2)}`, `£${(-newResults.pension / 12).toFixed(2)}`, `£${(-newResults.pension / 52).toFixed(2)}`, `£${(-newResults.pension / 260).toFixed(2)}`],
          ["Student Loan", `£${(-newResults.studentLoan).toFixed(2)}`, `£${(-newResults.studentLoan / 12).toFixed(2)}`, `£${(-newResults.studentLoan / 52).toFixed(2)}`, `£${(-newResults.studentLoan / 260).toFixed(2)}`],
          ["Total Deductions", `£${(-newResults.totalDeductions).toFixed(2)}`, `£${(-newResults.totalDeductions / 12).toFixed(2)}`, `£${(-newResults.totalDeductions / 52).toFixed(2)}`, `£${(-newResults.totalDeductions / 260).toFixed(2)}`],
          ["Net Take-Home Pay", `£${newResults.takeHomeAnnual.toFixed(2)}`, `£${(newResults.takeHomeAnnual / 12).toFixed(2)}`, `£${(newResults.takeHomeAnnual / 52).toFixed(2)}`, `£${(newResults.takeHomeAnnual / 260).toFixed(2)}`],
        ];
        setCsvData(csvExportData);
    }
  };

  const prepareChartData = () => {
    if (!results) return { pieData: [], barData: [] };

    const pieData = [
      { name: 'Take Home Pay', value: results.takeHomeAnnual, color: CHART_COLORS.takeHome },
      { name: 'Income Tax', value: results.tax.total, color: CHART_COLORS.tax },
      { name: 'National Insurance', value: results.nationalInsurance.total, color: CHART_COLORS.nationalInsurance },
    ];

    if (results.pension > 0) {
      pieData.push({ name: 'Pension', value: results.pension, color: CHART_COLORS.pension });
    }
    if (results.studentLoan > 0) {
      pieData.push({ name: 'Student Loan', value: results.studentLoan, color: CHART_COLORS.studentLoan });
    }

    const pieDataFiltered = pieData.filter(item => item.value > 0);

    const barData = [
      {
        period: 'Annual',
        'Take Home': results.takeHomeAnnual,
        'Tax': results.tax.total,
        'National Insurance': results.nationalInsurance.total,
        ...(results.pension > 0 && { 'Pension': results.pension }),
        ...(results.studentLoan > 0 && { 'Student Loan': results.studentLoan })
      },
      {
        period: 'Monthly',
        'Take Home': results.takeHomeAnnual / 12,
        'Tax': results.tax.total / 12,
        'National Insurance': results.nationalInsurance.total / 12,
        ...(results.pension > 0 && { 'Pension': results.pension / 12 }),
        ...(results.studentLoan > 0 && { 'Student Loan': results.studentLoan / 12 })
      },
      {
        period: 'Weekly',
        'Take Home': results.takeHomeAnnual / 52,
        'Tax': results.tax.total / 52,
        'National Insurance': results.nationalInsurance.total / 52,
        ...(results.pension > 0 && { 'Pension': results.pension / 52 }),
        ...(results.studentLoan > 0 && { 'Student Loan': results.studentLoan / 52 })
      },
      {
        period: 'Daily',
        'Take Home': results.takeHomeAnnual / 260,
        'Tax': results.tax.total / 260,
        'National Insurance': results.nationalInsurance.total / 260,
        ...(results.pension > 0 && { 'Pension': results.pension / 260 }),
        ...(results.studentLoan > 0 && { 'Student Loan': results.studentLoan / 260 })
      }
    ];

    return { pieData: pieDataFiltered, barData };
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: £${entry.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 dark:text-gray-100">{data.name}</p>
          <p style={{ color: data.color }}>
            £{data.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {results.grossAnnual > 0 ? ((data.value / results.grossAnnual) * 100).toFixed(1) : 0}% of gross salary
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label component for Pie Chart to ensure visibility in both modes
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // Distance of the label from the center
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="currentColor" // Use currentColor to pick up CSS text color
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs text-gray-800 dark:text-gray-200" // Tailwind classes for text color and size
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Salary Hub FAQs (visible and mirrored in JSON-LD)
  const salaryHubFaqs = [
    {
      question: "Which UK tax year do these salary tools use?",
      answer: "All salary and tax calculations default to the UK 2025/26 tax year and are updated when HMRC publishes new thresholds."
    },
    {
      question: "Can I include pension and student loan deductions?",
      answer: "Yes. You can add workplace pension contributions and select Student Loan Plan 1, 2, 4 or Postgraduate Loan to see the impact on your take-home pay."
    },
    {
      question: "What’s the difference between take-home pay, paycheck, and gross-to-net?",
      answer: "Take-home pay shows net pay after tax and NI over your chosen period; paycheck focuses on weekly/fortnightly/monthly pay; gross-to-net converts an annual or gross figure into a net amount after deductions."
    }
  ];

  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": salaryHubFaqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": { "@type": "Answer", "text": f.answer }
    }))
  };

  // Last updated meta
  const LAST_UPDATED_ISO = "2025-04-06";
  const LAST_UPDATED_DISPLAY = "6 April 2025";

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(salaryCalculatorJsonLd)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbJsonLd)}
      </script>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }} />
      
      <div className="bg-white dark:bg-gray-900">
        {/* Page Header - Optimized for SEO */}
        <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Breadcrumbs path={breadcrumbPath} />
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                UK Salary Calculator – Take-Home Pay 2025/26
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Calculate your UK take-home pay for the 2025/26 tax year. Free salary calculator with accurate income tax, National Insurance, and pension contributions. Works for England, Wales, Scotland & Northern Ireland.
              </p>

              {/* Quick links to child calculators (above the fold) */}
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <Link to={createPageUrl("SalaryCalculatorTakeHomePay")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700">
                  Take‑Home Pay
                </Link>
                <Link to={createPageUrl("SalaryCalculatorPaycheck")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700">
                  Paycheck
                </Link>
                <Link to={createPageUrl("GrossToNetCalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700">
                  Gross‑to‑Net
                </Link>
                <Link to={createPageUrl("ProRataSalaryCalculator")} className="px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700">
                  Pro‑Rata
                </Link>
              </div>

              {/* Additional keyword-rich content */}
              <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-4xl mx-auto">
                <p>Supports gross-to-net and net-to-gross calculations • Updated for 2025/26 tax rates • Includes student loan repayments • Scottish income tax rates supported</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Calculator Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="print-title hidden">UK Salary Calculator Results</div>

          <div className="grid lg:grid-cols-5 gap-8 printable-grid-cols-1">
            {/* Input Panel */}
            <div className="lg:col-span-2 non-printable">
              <Card className="sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <CardHeader>
                      <TabsList className="grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700">
                          <TabsTrigger value="grossToNet" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-gray-50">Gross to Net</TabsTrigger>
                          <TabsTrigger value="netToGross" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-gray-50">Net to Gross</TabsTrigger>
                      </TabsList>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <TabsContent value="grossToNet" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <Label htmlFor="grossSalary" className="text-gray-900 dark:text-gray-100">Your Gross Salary</Label>
                          <div className="relative">
                            <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <Input id="grossSalary" type="number" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className="pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" placeholder="e.g. 50000" />
                          </div>
                        </div>
                    </TabsContent>
                    <TabsContent value="netToGross" className="space-y-6 mt-0">
                        <div className="space-y-2">
                          <Label htmlFor="netSalary" className="text-gray-900 dark:text-gray-100">Your Desired Take-Home</Label>
                          <div className="relative">
                            <PoundSterling className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                            <Input id="netSalary" type="number" value={netSalary} onChange={(e) => setNetSalary(e.target.value)} className="pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600" placeholder="e.g. 35000" />
                          </div>
                        </div>
                    </TabsContent>
                    
                    <div className="space-y-2">
                      <Label htmlFor="payPeriod" className="text-gray-900 dark:text-gray-100">Pay Period</Label>
                      <Select value={payPeriod} onValueChange={setPayPeriod}>
                        <SelectTrigger className="dark:text-gray-50"><SelectValue /></SelectTrigger>
                        <SelectContent className="dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700">
                          <SelectItem value="annually">Annually</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="daily">Daily (5 days/week)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="w-full">
                        <Settings2 className={`w-4 h-4 mr-2 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                    </Button>

                    {showAdvanced && <AdvancedOptions 
                      taxYear={taxYear}
                      onTaxYearChange={handleTaxYearChange}
                      location={location}
                      taxCode={taxCode}
                      otherAllowances={otherAllowances}
                      pensionValue={pensionValue}
                      pensionType={pensionType}
                      studentLoanPlan={studentLoanPlan}
                      seisInvestment={seisInvestment}
                      eisInvestment={eisInvestment}
                      onValueChange={handleAdvancedOptionChange}
                    />}

                    <Button onClick={handleCalculate} className="w-full text-lg">
                      <Calculator className="w-5 h-5 mr-2" />
                      Calculate
                    </Button>
                  </CardContent>
                </Tabs>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-3 space-y-6 printable-area">
              {hasCalculated && results ? ( // Conditional rendering for results
                <>
                  <div className="non-printable">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Results for {taxData[taxYear].name}</h2>
                  </div>
                  {/* Summary Cards */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-800 dark:text-green-300">Annual Take-Home</p>
                            <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                              £<AnimatedNumber value={results.takeHomeAnnual} options={{minimumFractionDigits: 2, maximumFractionDigits: 2}} />
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                          £{(results.takeHomeAnnual / 12)?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per month
                        </p>
                      </CardContent>
                    </Card>
      
                    <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border-red-200 dark:border-red-700">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-red-800 dark:text-red-300">Total Deductions</p>
                            <div className="text-3xl font-bold text-red-900 dark:text-red-100">
                              £<AnimatedNumber value={results.totalDeductions} options={{minimumFractionDigits: 2, maximumFractionDigits: 2}} />
                            </div>
                          </div>
                          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                            <TrendingDown className="w-6 h-6 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-red-700 dark:text-red-300 mt-2">
                          {results.grossAnnual > 0 ? ((results.totalDeductions / results.grossAnnual) * 100).toFixed(1) : 0}% effective rate
                        </p>
                      </CardContent>
                    </Card>
                  </div>
      
                  {/* NEW: Visual Charts Section */}
                  <div className="grid md:grid-cols-2 gap-6 non-printable">
                    {/* Pie Chart - Salary Breakdown */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      <CardHeader>
                        <CardTitle>Salary Breakdown</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={prepareChartData().pieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel} // Use the custom label component
                              outerRadius={80}
                              dataKey="value"
                            >
                              {prepareChartData().pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <RechartsTooltip content={<PieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Bar Chart - Period Comparison */}
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">
                      <CardHeader>
                        <CardTitle>Payment Periods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={prepareChartData().barData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /> {/* Use CSS variable for border color */}
                            <XAxis dataKey="period" tick={{ fill: 'currentColor' }} />
                            <YAxis 
                              tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                              tick={{ fill: 'currentColor' }}
                              width={40}
                            />
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{fontSize: '14px'}} /> {/* Apply text color to legend */}
                            <Bar dataKey="Take Home" stackId="a" fill={CHART_COLORS.takeHome} />
                            <Bar dataKey="Tax" stackId="a" fill={CHART_COLORS.tax} />
                            <Bar dataKey="National Insurance" stackId="a" fill={CHART_COLORS.nationalInsurance} />
                            {results.pension > 0 && (
                              <Bar dataKey="Pension" stackId="a" fill={CHART_COLORS.pension} />
                            )}
                            {results.studentLoan > 0 && (
                              <Bar dataKey="Student Loan" stackId="a" fill={CHART_COLORS.studentLoan} />
                            )}
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
      
                  {/* Detailed Breakdown */}
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <CardTitle>
                        {activeTab === 'netToGross' ? 'Reverse Calculation Breakdown' : 'Step-by-Step Calculation'}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activeTab === 'netToGross' ? (
                          <>
                            {/* Net to Gross Flow */}
                            {/* Step 1: Target Net Salary */}
                            <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700">
                              <span className="font-bold text-lg text-green-800 dark:text-green-200">1. Your Target Net Take-Home</span>
                              <span className="font-bold text-xl text-green-800 dark:text-green-200">
                                £{(Number(netSalary) * (payPeriod === 'monthly' ? 12 : payPeriod === 'weekly' ? 52 : payPeriod === 'daily' ? 260 : 1))?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>

                            {/* Step 2: Required Gross Salary */}
                            <div className="flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                              <span className="font-bold text-lg text-blue-800 dark:text-blue-200">2. Required Gross Salary</span>
                              <span className="font-bold text-xl text-blue-800 dark:text-blue-200">
                                £{results.grossAnnual?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>

                            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                💡 <strong>To earn £{(Number(netSalary) * (payPeriod === 'monthly' ? 12 : payPeriod === 'weekly' ? 52 : payPeriod === 'daily' ? 260 : 1))?.toLocaleString('en-GB', { maximumFractionDigits: 0 })} net annually, you need a gross salary of £{results.grossAnnual?.toLocaleString('en-GB', { maximumFractionDigits: 0 })}.</strong>
                              </p>
                              <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1">
                                Here's how that gross salary breaks down:
                              </p>
                            </div>

                            {/* Step 3: Personal Allowance */}
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">3. Personal Allowance (Tax-Free)</span>
                                {showAdvanced && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Tax code: {taxCode} {Number(otherAllowances) > 0 ? `+ £${Number(otherAllowances).toLocaleString()} other allowances` : ''}
                                  </p>
                                )}
                              </div>
                              <span className="font-semibold text-blue-700 dark:text-blue-300">
                                £{results.personalAllowance?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Gross to Net Flow (original) */}
                            {/* Step 1: Gross Salary */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                              <span className="font-medium text-gray-900 dark:text-gray-100">1. Gross Annual Salary</span>
                              <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                                £{results.grossAnnual?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                            
                            {/* Step 2: Personal Allowance */}
                            <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">2. Personal Allowance (Tax-Free)</span>
                                {showAdvanced && (
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Tax code: {taxCode} {Number(otherAllowances) > 0 ? `+ £${Number(otherAllowances).toLocaleString()} other allowances` : ''}
                                  </p>
                                )}
                              </div>
                              <span className="font-semibold text-blue-700 dark:text-blue-300">
                                £{results.personalAllowance?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          </>
                        )}

                        {/* Step 3/4: Pension (if applicable) - same for both flows */}
                        {showAdvanced && results.pension > 0 && (
                          <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {activeTab === 'netToGross' ? '4' : '3'}. Pension Contribution (Pre-Tax)
                              </span>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {pensionValue}{pensionType === 'percent' ? '%' : ' Fixed PM'} 
                              </p>
                            </div>
                            <span className="font-semibold text-green-700 dark:text-green-300">
                              -£{results.pension.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}

                        {/* Taxable Income */}
                        <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <span className="font-medium text-gray-900 dark:text-gray-100">
                            {activeTab === 'netToGross' ? (showAdvanced && results.pension > 0 ? '5' : '4') : (showAdvanced && results.pension > 0 ? '4' : '3')}. Taxable Income
                          </span>
                          <span className="font-semibold text-yellow-700 dark:text-yellow-300">
                            £{(results.grossAnnual - results.personalAllowance - results.pension).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {/* Income Tax Breakdown */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {activeTab === 'netToGross' ? (showAdvanced && results.pension > 0 ? '6' : '5') : (showAdvanced && results.pension > 0 ? '5' : '4')}. Income Tax Calculation:
                          </h4>
                          {results.tax?.breakdown?.map((bracket, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20 rounded-r-lg">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {bracket.name} ({bracket.rate}%)
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {bracket.bracketMin !== undefined ? `£${bracket.bracketMin.toLocaleString()} - ` : ''}
                                  {bracket.bracketMax !== 'No limit' ? `£${bracket.bracketMax.toLocaleString()}` : bracket.bracketMax} 
                                  {bracket.taxableAmount > 0 ? ` | Taxed: £${bracket.taxableAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                                </p>
                              </div>
                              <span className="font-semibold text-red-700 dark:text-red-300">
                                -£{bracket.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center p-2 bg-red-100 dark:bg-red-800/30 rounded">
                            <span className="font-medium">Total Income Tax:</span>
                            <span className="font-bold text-red-800 dark:text-red-200">
                              -£{results.tax.total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* National Insurance Breakdown */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">
                            {activeTab === 'netToGross' ? (showAdvanced && results.pension > 0 ? '7' : '6') : (showAdvanced && results.pension > 0 ? '6' : '5')}. National Insurance Calculation:
                          </h4>
                          {results.nationalInsurance?.breakdown?.map((bracket, index) => (
                            <div key={index} className="flex justify-between items-center p-3 border-l-4 border-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg">
                              <div>
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  {bracket.rate}% Rate
                                </span>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {bracket.min !== undefined ? `£${bracket.min.toLocaleString()} - ` : ''}
                                  {bracket.max !== 'No limit' ? `£${bracket.max.toLocaleString()}` : bracket.max} 
                                  {bracket.niableAmount > 0 ? ` | NI'able: £${bracket.niableAmount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                                </p>
                              </div>
                              <span className="font-semibold text-purple-700 dark:text-purple-300">
                                -£{bracket.amount.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between items-center p-2 bg-purple-100 dark:bg-purple-800/30 rounded">
                            <span className="font-medium">Total National Insurance:</span>
                            <span className="font-bold text-purple-800 dark:text-purple-200">
                              -£{results.nationalInsurance.total.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>

                        {/* Student Loan (if applicable) */}
                        {showAdvanced && results.studentLoan > 0 && (
                          <div className="flex justify-between items-center p-3 border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">
                                {activeTab === 'netToGross' ? (showAdvanced && results.pension > 0 ? '8' : '7') : (showAdvanced && results.pension > 0 ? '7' : '6')}. Student Loan ({studentLoanPlan.replace('plan', 'Plan ').replace('postgraduate', 'Postgraduate')})
                              </span>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {taxData[taxYear].studentLoanRates[studentLoanPlan]?.rate * 100}% on income above £{taxData[taxYear].studentLoanRates[studentLoanPlan]?.threshold?.toLocaleString()}
                              </p>
                            </div>
                            <span className="font-semibold text-orange-700 dark:text-orange-300">
                              -£{results.studentLoan.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}

                        {/* SEIS Relief (if applicable) */}
                        {showAdvanced && results.seisRelief > 0 && (
                          <div className="flex justify-between items-center p-3 border-l-4 border-teal-400 bg-teal-50 dark:bg-teal-900/20 rounded-r-lg">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">SEIS Tax Relief (50%)</span>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                On £{(Number(seisInvestment) || 0).toLocaleString('en-GB')} investment
                              </p>
                            </div>
                            <span className="font-semibold text-teal-700 dark:text-teal-300">
                              +£{results.seisRelief.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}

                        {/* EIS Relief (if applicable) */}
                        {showAdvanced && results.eisRelief > 0 && (
                          <div className="flex justify-between items-center p-3 border-l-4 border-teal-400 bg-teal-50 dark:bg-teal-900/20 rounded-r-lg">
                            <div>
                              <span className="font-medium text-gray-900 dark:text-gray-100">EIS Tax Relief (30%)</span>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                On £{(Number(eisInvestment) || 0).toLocaleString('en-GB')} investment
                              </p>
                            </div>
                            <span className="font-semibold text-teal-700 dark:text-teal-300">
                              +£{results.eisRelief.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                          </div>
                        )}

                        {/* Final Result - different messaging for each tab */}
                        <div className="flex justify-between items-center p-4 bg-green-100 dark:bg-green-800/50 rounded-lg border-2 border-green-300 dark:border-green-700">
                          <span className="font-bold text-lg text-green-800 dark:text-green-200">
                            {activeTab === 'netToGross' ? 'Confirmed: Your Target Achieved' : 'Net Annual Take-Home'}
                          </span>
                          <span className="font-bold text-xl text-green-800 dark:text-green-200">
                            £{results.takeHomeAnnual?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>

                        {activeTab === 'netToGross' && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-300">
                              ✅ <strong>Perfect match!</strong> A gross salary of £{results.grossAnnual?.toLocaleString('en-GB', { maximumFractionDigits: 0 })} will give you your target net pay of £{results.takeHomeAnnual?.toLocaleString('en-GB', { maximumFractionDigits: 0 })}.
                            </p>
                          </div>
                        )}

                        <div className="grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t dark:border-gray-700">
                          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">Monthly Take-Home</p>
                            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
                              £{(results.takeHomeAnnual / 12)?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                            <p className="text-sm text-purple-800 dark:text-purple-300 font-medium">Weekly Take-Home</p>
                            <p className="text-xl font-bold text-purple-900 dark:text-purple-100">
                              £{(results.takeHomeAnnual / 52)?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div className="text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                            <p className="text-sm text-green-800 dark:text-green-300 font-medium">Daily Take-Home</p>
                            <p className="text-xl font-bold text-green-900 dark:text-green-100">
                              £{(results.takeHomeAnnual / 260)?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-green-600 dark:text-green-400">(5days/week)</p>
                          </div>
                          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
                            <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">Hourly Take-Home</p>
                            <p className="text-xl font-bold text-indigo-900 dark:text-indigo-100">
                              £{(results.takeHomeAnnual / 2080)?.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-indigo-600 dark:text-indigo-400">(40hrs/week)</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
      
                  {/* Disclaimer */}
                  <div className="non-printable pt-6">
                    <ExportActions csvData={csvData} fileName={`salary-calculation-${taxYear}`} title={`Salary Calculation ${taxData[taxYear].name}`} />
                  </div>
                  <Card className="bg-amber-50 dark:bg-yellow-900/30 border-amber-200 dark:border-yellow-700">
                    <CardContent className="p-4 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-700 dark:text-yellow-400 mt-0.5" />
                      <p className="text-sm text-amber-800 dark:text-yellow-300">
                        <strong>Disclaimer:</strong> This calculator provides estimates based on UK tax rates for the selected tax year. 
                        Results are for guidance only and should not be considered as professional financial advice. 
                        Actual deductions may vary based on individual circumstances.
                      </p>
                    </CardContent>
                  </Card>
                </>
              ) : ( // Placeholder when no calculation has been made
                <Card className="lg:col-span-3 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    <Calculator className="w-12 h-12 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold">Ready for your results?</h3>
                    <p>Fill in your details and click "Calculate" to see your salary breakdown.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>

        <CalculatorWrapper>
          <div className="space-y-8">
             <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Calculate Your Take-Home Pay</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  The UK Salary Calculator is an essential tool for anyone employed in the United Kingdom. It demystifies your payslip by translating your gross annual salary—the headline figure offered in a job contract—into your net take-home pay, which is the actual amount that arrives in your bank account. This calculation involves subtracting all mandatory deductions, including Income Tax, National Insurance, and, if applicable, pension contributions and student loan repayments. Our calculator is kept up-to-date with the latest tax thresholds for England, Scotland, Wales, and Northern Ireland, ensuring you receive an accurate and reliable estimate.
                </p>
             </section>
             <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Pro-Rata & Pay Frequency (weekly, monthly)</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Our calculator seamlessly handles various pay frequencies. Whether you are paid annually, monthly, weekly, or daily, you can input your gross pay for that period, and the tool will annualize it to provide a complete tax breakdown. For part-time workers, our dedicated <a href={createPageUrl("ProRataSalaryCalculator")} className="text-blue-600 hover:underline">Pro Rata Salary Calculator</a> can help you determine your equivalent earnings.
                </p>
             </section>
             <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Student Loan & Pension Options</h2>
                <p className="text-gray-700 dark:text-gray-300">
                    Use the 'Advanced Options' to tailor the calculation to your specific circumstances. You can select your student loan plan (including Plan 1, 2, 4, 5, and Postgraduate) and specify your workplace pension contributions as either a percentage or a fixed monthly amount. These are factored into your take‑home pay.
                </p>
             </section>
          </div>
        </CalculatorWrapper>

        <RelatedCalculators
          calculators={[
            { name: "Income Tax Calculator", url: createPageUrl("IncomeTaxCalculator"), description: "Isolate and understand just your income tax liability." },
            { name: "National Insurance Calculator", url: createPageUrl("NationalInsuranceCalculator"), description: "See a detailed breakdown of your NI contributions." },
            { name: "Pension Calculator", url: createPageUrl("PensionCalculator"), description: "Project your retirement savings and contributions." }
          ]}
        />

        {/* Added: Explore Salary Tools section */}
        <div className="bg-white dark:bg-gray-900 py-12 non-printable">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Explore Salary Tools</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to={createPageUrl("SalaryCalculatorTakeHomePay")} className="block p-5 border rounded-lg hover:shadow-md hover:border-blue-300 transition dark:border-gray-700 dark:hover:border-blue-700 dark:bg-gray-800 dark:text-gray-100">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Take-Home Pay Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Estimate your net pay after tax & NI.</p>
              </Link>
              <Link to={createPageUrl("SalaryCalculatorPaycheck")} className="block p-5 border rounded-lg hover:shadow-md hover:border-blue-300 transition dark:border-gray-700 dark:hover:border-blue-700 dark:bg-gray-800 dark:text-gray-100">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Paycheck Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Weekly, fortnightly or monthly.</p>
              </Link>
              <Link to={createPageUrl("GrossToNetCalculator")} className="block p-5 border rounded-lg hover:shadow-md hover:border-blue-300 transition dark:border-gray-700 dark:hover:border-blue-700 dark:bg-gray-800 dark:text-gray-100">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Gross to Net Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Convert gross salary to take-home.</p>
              </Link>
              <Link to={createPageUrl("ProRataSalaryCalculator")} className="block p-5 border rounded-lg hover:shadow-md hover:border-blue-300 transition dark:border-gray-700 dark:hover:border-blue-700 dark:bg-gray-800 dark:text-gray-100">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Pro-Rata Salary Calculator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Part-time & pro-rata earnings.</p>
              </Link>
            </div>
          </div>
        </div>

        {/* Visible FAQ section aligned with JSON-LD */}
        <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={salaryHubFaqs} title="Salary Calculator FAQs" />
            <p className="text-xs text-gray-500 mt-6">
              Last updated: <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>
            </p>
          </div>
        </div>

        {/* Replace the second FAQ section to keep alignment */}
        <div id="faq-section" className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <FAQSection faqs={salaryHubFaqs} />
          </div>
        </div>

        {/* Additional content section for keywords */}
        <div className="bg-gray-50 dark:bg-gray-800/50 py-12 non-printable">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">UK Salary Calculator - Everything You Need to Know</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">How Our UK Tax Calculator Works</h3>
                <ul className="space-y-2">
                  <li>• Accurate 2025/26 UK tax rates and thresholds</li>
                  <li>• Income tax calculation for all UK regions</li>
                  <li>• National Insurance contributions (Classes 1 & 4)</li>
                  <li>• Student loan repayment calculations (Plans 1-5)</li>
                  <li>• Pension contribution tax relief</li>
                  <li>• Scottish income tax rates included</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Perfect for UK Employees & Contractors</h3>
                <ul className="space-y-2">
                  <li>• PAYE employees and contractors</li>
                  <li>• Job offer salary comparisons</li>
                  <li>• Annual and monthly salary planning</li>
                  <li>• Gross to net pay calculations</li>
                  <li>• Net to gross salary requirements</li>
                  <li>• Tax code adjustments supported</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
