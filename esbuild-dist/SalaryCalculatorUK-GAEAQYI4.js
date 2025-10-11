import {
  AnimatedNumber
} from "./chunk-YHKA3VCH.js";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "./chunk-TIYYSSOB.js";
import "./chunk-QRWSZGZM.js";
import {
  Breadcrumbs,
  CalculatorWrapper
} from "./chunk-U6RX6SVX.js";
import {
  Tooltip as Tooltip2,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./chunk-RAVJFG7Q.js";
import "./chunk-6QDB6RBQ.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "./chunk-32ETQDIX.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-XTM5LKOR.js";
import "./chunk-F7QU7XIU.js";
import "./chunk-G2D7ODQY.js";
import "./chunk-UYVYEFZE.js";
import "./chunk-66ZJ7JT3.js";
import "./chunk-RDJYUOP4.js";
import {
  ExportActions
} from "./chunk-F7OALEHA.js";
import {
  Label
} from "./chunk-AXLI4SNI.js";
import {
  Input
} from "./chunk-KK4JIGNC.js";
import {
  Button
} from "./chunk-RTS3GJRL.js";
import "./chunk-VKAPTTXR.js";
import "./chunk-DOIEHZ4R.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  Calculator,
  CircleHelp,
  PoundSterling,
  Settings2,
  TrendingDown,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SalaryCalculatorUK.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var salaryCalculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Salary Calculator 2025/26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  description: "Free UK salary calculator for 2025/26 tax year. Calculate take-home pay from gross salary and vice versa with accurate tax and National Insurance calculations.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP"
  }
};
var breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.calcmymoney.co.uk/" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Salary & Income",
      item: "https://www.calcmymoney.co.uk/salary-calculator-uk/"
    }
  ]
};
var taxData = {
  "2025-26": {
    // This is the new current year, based on the previous 2025-26 data
    name: "2025/26",
    taxBracketsEngland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 50270, rate: 0.2, name: "Basic Rate" },
      { min: 50271, max: 125140, rate: 0.4, name: "Higher Rate" },
      { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
    ],
    taxBracketsScotland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 14876, rate: 0.19, name: "Starter Rate" },
      { min: 14877, max: 26561, rate: 0.2, name: "Basic Rate" },
      { min: 26562, max: 43662, rate: 0.21, name: "Intermediate Rate" },
      { min: 43663, max: 75e3, rate: 0.42, name: "Higher Rate" },
      { min: 75001, max: 125140, rate: 0.45, name: "Advanced Rate" },
      // Changed from "Top Rate" as per common data
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
      plan5: { threshold: 25e3, rate: 0.09 },
      postgraduate: { threshold: 21e3, rate: 0.06 }
    },
    defaultTaxCode: "1257L",
    basePersonalAllowance: 12570
  },
  "2024-25": {
    name: "2024/25",
    taxBracketsEngland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 50270, rate: 0.2, name: "Basic Rate" },
      { min: 50271, max: 125140, rate: 0.4, name: "Higher Rate" },
      { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
    ],
    taxBracketsScotland: [
      { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
      { min: 12571, max: 14732, rate: 0.19, name: "Starter Rate" },
      { min: 14733, max: 25688, rate: 0.2, name: "Basic Rate" },
      { min: 25689, max: 43662, rate: 0.21, name: "Intermediate Rate" },
      { min: 43663, max: 125140, rate: 0.42, name: "Higher Rate" },
      { min: 125141, max: Infinity, rate: 0.47, name: "Top Rate" }
    ],
    niThresholds: [
      { min: 0, max: 12570, rate: 0 },
      { min: 12571, max: 50270, rate: 0.1 },
      // Note: Rate was higher for part of the year, using an average representation
      { min: 50271, max: Infinity, rate: 0.02 }
    ],
    studentLoanRates: {
      none: { threshold: 0, rate: 0 },
      plan1: { threshold: 22015, rate: 0.09 },
      plan2: { threshold: 27295, rate: 0.09 },
      plan4: { threshold: 27660, rate: 0.09 },
      plan5: { threshold: 25e3, rate: 0.09 },
      postgraduate: { threshold: 21e3, rate: 0.06 }
    },
    defaultTaxCode: "1257L",
    basePersonalAllowance: 12570
  }
};
var CHART_COLORS = {
  takeHome: "#10b981",
  // green
  tax: "#ef4444",
  // red
  nationalInsurance: "#8b5cf6",
  // purple
  pension: "#f59e0b",
  // amber
  studentLoan: "#f97316"
  // orange
};
var calculateDeductions = (grossSalary, options, taxYearData, useAdvancedOptions = false) => {
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
  const {
    basePersonalAllowance,
    taxBracketsEngland,
    taxBracketsScotland,
    niThresholds,
    studentLoanRates
  } = taxYearData;
  let personalAllowance = basePersonalAllowance;
  if (useAdvancedOptions) {
    if (taxCode && taxCode.match(/^\d+L$/)) {
      personalAllowance = parseInt(taxCode.slice(0, -1)) * 10;
    }
    personalAllowance += otherAllowances;
  }
  if (grossSalary > 1e5) {
    personalAllowance = Math.max(0, personalAllowance - (grossSalary - 1e5) / 2);
  }
  let pensionAmount = 0;
  if (useAdvancedOptions && pensionValue > 0) {
    if (pensionType === "percent") {
      pensionAmount = grossSalary * pensionValue / 100;
    } else {
      pensionAmount = pensionValue * 12;
    }
  }
  const taxBrackets = useAdvancedOptions && location === "scotland" ? taxBracketsScotland : taxBracketsEngland;
  let calculatedTax = 0;
  let newTaxBreakdown = [];
  const incomeSubjectToTax = Math.max(0, grossSalary - personalAllowance - pensionAmount);
  for (const bracket of taxBrackets) {
    if (bracket.rate === 0) continue;
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
        bracketMax: bracket.max === Infinity ? "No limit" : bracket.max
      });
    }
  }
  let tax = calculatedTax;
  let seisRelief = 0;
  let eisRelief = 0;
  if (useAdvancedOptions) {
    seisRelief = (seisInvestment || 0) * 0.5;
    eisRelief = (eisInvestment || 0) * 0.3;
    const totalRelief = seisRelief + eisRelief;
    tax = Math.max(0, tax - totalRelief);
  }
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
            max: threshold.max === Infinity ? "No limit" : threshold.max
          });
        }
      }
    }
  }
  let studentLoan = 0;
  if (useAdvancedOptions && studentLoanPlan !== "none") {
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
    personalAllowance,
    seisRelief,
    eisRelief
  };
};
var calculateGrossFromNet = (netSalary, options, taxYearData, useAdvancedOptions) => {
  let lowGuess = netSalary;
  let highGuess = netSalary * 2.5;
  let guess = netSalary * 1.5;
  let iterations = 0;
  while (iterations < 50) {
    const calculatedNet = calculateDeductions(
      guess,
      options,
      taxYearData,
      useAdvancedOptions
    ).takeHomeAnnual;
    const difference = calculatedNet - netSalary;
    if (Math.abs(difference) < 0.01) {
      return guess;
    }
    if (difference < 0) {
      lowGuess = guess;
    } else {
      highGuess = guess;
    }
    guess = (lowGuess + highGuess) / 2;
    iterations++;
  }
  return guess;
};
var AdvancedOptions = import_react.default.memo(
  ({
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
  }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6 mt-6 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border dark:border-gray-700", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "Tax Year" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: taxYear, onValueChange: onTaxYearChange, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { className: "dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "2025-26", children: "2025/26" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "2024-25", children: "2024/25" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "I live in" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: location, onValueChange: (val) => onValueChange("location", val), children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { className: "dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "england", children: "England, Wales or Northern Ireland" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "scotland", children: "Scotland" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "My Tax Code" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Input,
        {
          value: taxCode,
          onChange: (e) => onValueChange("taxCode", e.target.value),
          className: "dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "caption text-gray-500 dark:text-gray-400", children: [
        "Default for ",
        taxData[taxYear].name,
        " is ",
        taxData[taxYear].defaultTaxCode
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "Pension Contribution" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Input,
          {
            type: "number",
            value: pensionValue,
            onChange: (e) => onValueChange("pensionValue", e.target.value),
            className: "w-full dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: pensionType, onValueChange: (val) => onValueChange("pensionType", val), children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "w-[180px] dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { className: "dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "percent", children: "%" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "fixed", children: "Fixed PM" })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "Student Loan Plan" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
        Select,
        {
          value: studentLoanPlan,
          onValueChange: (val) => onValueChange("studentLoanPlan", val),
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { className: "dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "none", children: "No Student Loan" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan1", children: "Plan 1" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan2", children: "Plan 2" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan4", children: "Plan 4 (Scotland)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan5", children: "Plan 5" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "postgraduate", children: "Postgraduate Loan" })
            ] })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "SEIS Investment (50% Tax Relief)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              placeholder: "e.g. 1000",
              value: seisInvestment,
              onChange: (e) => onValueChange("seisInvestment", e.target.value),
              className: "pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500 dark:text-gray-400", children: "Annual investment limit: \xA3200,000" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "EIS Investment (30% Tax Relief)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              placeholder: "e.g. 1000",
              value: eisInvestment,
              onChange: (e) => onValueChange("eisInvestment", e.target.value),
              className: "pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500 dark:text-gray-400", children: "Annual investment limit: \xA31,000,000" })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-gray-900 dark:text-gray-100", children: "Other Tax-Free Allowances (Annual)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip2, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-300 cursor-help" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipContent, { className: "max-w-xs bg-gray-800 text-white p-3 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Common allowances include:" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "caption mt-1 space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Marriage Allowance: \xA31,260" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Blind Person's Allowance: \xA33,070" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Property Allowance: up to \xA31,000" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Trading Allowance: up to \xA31,000" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption mt-2 italic", children: "Only include if you're already entitled to these allowances." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          Input,
          {
            type: "number",
            value: otherAllowances,
            onChange: (e) => onValueChange("otherAllowances", e.target.value),
            className: "pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600",
            placeholder: "e.g. 1260"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "caption text-gray-500 dark:text-gray-400", children: [
        "e.g. Marriage Allowance, Blind Person's Allowance.",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "a",
          {
            href: "#faq-section",
            className: "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline ml-1",
            onClick: (e) => {
              e.preventDefault();
              document.getElementById("faq-section")?.scrollIntoView({ behavior: "smooth" });
            },
            children: "See FAQ for details"
          }
        ),
        "."
      ] })
    ] })
  ] })
);
function SalaryCalculatorUK() {
  const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
  const [payPeriod, setPayPeriod] = (0, import_react.useState)("annually");
  const [results, setResults] = (0, import_react.useState)(null);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const [activeTab, setActiveTab] = (0, import_react.useState)("grossToNet");
  const [taxYear, setTaxYear] = (0, import_react.useState)("2025-26");
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [grossSalary, setGrossSalary] = (0, import_react.useState)("");
  const [netSalary, setNetSalary] = (0, import_react.useState)("");
  const [location, setLocation] = (0, import_react.useState)("england");
  const [taxCode, setTaxCode] = (0, import_react.useState)(taxData["2025-26"].defaultTaxCode);
  const [pensionType, setPensionType] = (0, import_react.useState)("percent");
  const [pensionValue, setPensionValue] = (0, import_react.useState)(5);
  const [studentLoanPlan, setStudentLoanPlan] = (0, import_react.useState)("none");
  const [seisInvestment, setSeisInvestment] = (0, import_react.useState)("");
  const [eisInvestment, setEisInvestment] = (0, import_react.useState)("");
  const [otherAllowances, setOtherAllowances] = (0, import_react.useState)("");
  const breadcrumbPath = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "Salary & Income" }
  ];
  const handleTaxYearChange = import_react.default.useCallback((year) => {
    setTaxYear(year);
    const currentTaxYearData = taxData[year];
    setTaxCode(currentTaxYearData.defaultTaxCode);
  }, []);
  const handleAdvancedOptionChange = import_react.default.useCallback((field, value) => {
    switch (field) {
      case "taxCode":
        setTaxCode(value);
        break;
      case "otherAllowances":
        setOtherAllowances(value);
        break;
      case "pensionValue":
        setPensionValue(value);
        break;
      case "pensionType":
        setPensionType(value);
        break;
      case "studentLoanPlan":
        setStudentLoanPlan(value);
        break;
      case "seisInvestment":
        setSeisInvestment(value);
        break;
      case "eisInvestment":
        setEisInvestment(value);
        break;
      case "location":
        setLocation(value);
        break;
      default:
        break;
    }
  }, []);
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [activeTab]);
  const handleCalculate = () => {
    const currentTaxYearData = taxData[taxYear];
    const options = {
      location,
      taxCode,
      otherAllowances: Number(otherAllowances) || 0,
      pensionType,
      pensionValue: Number(pensionValue) || 0,
      // Ensure pensionValue is a number here
      studentLoanPlan,
      seisInvestment: Number(seisInvestment) || 0,
      eisInvestment: Number(eisInvestment) || 0
    };
    let annualSalaryInput;
    let newResults = {};
    if (activeTab === "grossToNet") {
      annualSalaryInput = Number(grossSalary) || 0;
    } else {
      annualSalaryInput = Number(netSalary) || 0;
    }
    let annualAmount;
    switch (payPeriod) {
      case "monthly":
        annualAmount = annualSalaryInput * 12;
        break;
      case "weekly":
        annualAmount = annualSalaryInput * 52;
        break;
      case "daily":
        annualAmount = annualSalaryInput * 260;
        break;
      default:
        annualAmount = annualSalaryInput;
    }
    if (activeTab === "grossToNet") {
      newResults = calculateDeductions(annualAmount, options, currentTaxYearData, showAdvanced);
    } else {
      const calculatedGross = calculateGrossFromNet(
        annualAmount,
        options,
        currentTaxYearData,
        showAdvanced
      );
      newResults = calculateDeductions(calculatedGross, options, currentTaxYearData, showAdvanced);
    }
    setResults(newResults);
    setHasCalculated(true);
    if (newResults.grossAnnual !== void 0) {
      const csvExportData = [
        ["Description", "Annual", "Monthly", "Weekly", "Daily"],
        [
          "Gross Salary",
          `\xA3${newResults.grossAnnual.toFixed(2)}`,
          `\xA3${(newResults.grossAnnual / 12).toFixed(2)}`,
          `\xA3${(newResults.grossAnnual / 52).toFixed(2)}`,
          `\xA3${(newResults.grossAnnual / 260).toFixed(2)}`
        ],
        ["Personal Allowance", `\xA3${newResults.personalAllowance.toFixed(2)}`, "", "", ""],
        [
          "Income Tax",
          `\xA3${(-newResults.tax.total).toFixed(2)}`,
          `\xA3${(-newResults.tax.total / 12).toFixed(2)}`,
          `\xA3${(-newResults.tax.total / 52).toFixed(2)}`,
          `\xA3${(-newResults.tax.total / 260).toFixed(2)}`
        ],
        [
          "National Insurance",
          `\xA3${(-newResults.nationalInsurance.total).toFixed(2)}`,
          `\xA3${(-newResults.nationalInsurance.total / 12).toFixed(2)}`,
          `\xA3${(-newResults.nationalInsurance.total / 52).toFixed(2)}`,
          `\xA3${(-newResults.nationalInsurance.total / 260).toFixed(2)}`
        ],
        [
          "Pension Contribution",
          `\xA3${(-newResults.pension).toFixed(2)}`,
          `\xA3${(-newResults.pension / 12).toFixed(2)}`,
          `\xA3${(-newResults.pension / 52).toFixed(2)}`,
          `\xA3${(-newResults.pension / 260).toFixed(2)}`
        ],
        [
          "Student Loan",
          `\xA3${(-newResults.studentLoan).toFixed(2)}`,
          `\xA3${(-newResults.studentLoan / 12).toFixed(2)}`,
          `\xA3${(-newResults.studentLoan / 52).toFixed(2)}`,
          `\xA3${(-newResults.studentLoan / 260).toFixed(2)}`
        ],
        [
          "Total Deductions",
          `\xA3${(-newResults.totalDeductions).toFixed(2)}`,
          `\xA3${(-newResults.totalDeductions / 12).toFixed(2)}`,
          `\xA3${(-newResults.totalDeductions / 52).toFixed(2)}`,
          `\xA3${(-newResults.totalDeductions / 260).toFixed(2)}`
        ],
        [
          "Net Take-Home Pay",
          `\xA3${newResults.takeHomeAnnual.toFixed(2)}`,
          `\xA3${(newResults.takeHomeAnnual / 12).toFixed(2)}`,
          `\xA3${(newResults.takeHomeAnnual / 52).toFixed(2)}`,
          `\xA3${(newResults.takeHomeAnnual / 260).toFixed(2)}`
        ]
      ];
      setCsvData(csvExportData);
    }
  };
  const prepareChartData = () => {
    if (!results) return { pieData: [], barData: [] };
    const pieData = [
      { name: "Take Home Pay", value: results.takeHomeAnnual, color: CHART_COLORS.takeHome },
      { name: "Income Tax", value: results.tax.total, color: CHART_COLORS.tax },
      {
        name: "National Insurance",
        value: results.nationalInsurance.total,
        color: CHART_COLORS.nationalInsurance
      }
    ];
    if (results.pension > 0) {
      pieData.push({ name: "Pension", value: results.pension, color: CHART_COLORS.pension });
    }
    if (results.studentLoan > 0) {
      pieData.push({
        name: "Student Loan",
        value: results.studentLoan,
        color: CHART_COLORS.studentLoan
      });
    }
    const pieDataFiltered = pieData.filter((item) => item.value > 0);
    const barData = [
      {
        period: "Annual",
        "Take Home": results.takeHomeAnnual,
        Tax: results.tax.total,
        "National Insurance": results.nationalInsurance.total,
        ...results.pension > 0 && { Pension: results.pension },
        ...results.studentLoan > 0 && { "Student Loan": results.studentLoan }
      },
      {
        period: "Monthly",
        "Take Home": results.takeHomeAnnual / 12,
        Tax: results.tax.total / 12,
        "National Insurance": results.nationalInsurance.total / 12,
        ...results.pension > 0 && { Pension: results.pension / 12 },
        ...results.studentLoan > 0 && { "Student Loan": results.studentLoan / 12 }
      },
      {
        period: "Weekly",
        "Take Home": results.takeHomeAnnual / 52,
        Tax: results.tax.total / 52,
        "National Insurance": results.nationalInsurance.total / 52,
        ...results.pension > 0 && { Pension: results.pension / 52 },
        ...results.studentLoan > 0 && { "Student Loan": results.studentLoan / 52 }
      },
      {
        period: "Daily",
        "Take Home": results.takeHomeAnnual / 260,
        Tax: results.tax.total / 260,
        "National Insurance": results.nationalInsurance.total / 260,
        ...results.pension > 0 && { Pension: results.pension / 260 },
        ...results.studentLoan > 0 && { "Student Loan": results.studentLoan / 260 }
      }
    ];
    return { pieData: pieDataFiltered, barData };
  };
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: `${label}` }),
        payload.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { style: { color: entry.color }, children: `${entry.name}: \xA3${entry.value.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` }, index))
      ] });
    }
    return null;
  };
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: data.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { color: data.color }, children: [
          "\xA3",
          data.value.toLocaleString("en-GB", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "caption text-gray-500 dark:text-gray-400", children: [
          results.grossAnnual > 0 ? (data.value / results.grossAnnual * 100).toFixed(1) : 0,
          "% of gross salary"
        ] })
      ] });
    }
    return null;
  };
  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "text",
      {
        x,
        y,
        fill: "currentColor",
        textAnchor: x > cx ? "start" : "end",
        dominantBaseline: "central",
        className: "caption text-gray-800 dark:text-gray-200",
        children: `${name} ${(percent * 100).toFixed(0)}%`
      }
    );
  };
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
      question: "What\u2019s the difference between take-home pay, paycheck, and gross-to-net?",
      answer: "Take-home pay shows net pay after tax and NI over your chosen period; paycheck focuses on weekly/fortnightly/monthly pay; gross-to-net converts an annual or gross figure into a net amount after deductions."
    }
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: salaryHubFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
  const LAST_UPDATED_ISO = "2025-04-06";
  const LAST_UPDATED_DISPLAY = "6 April 2025";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(salaryCalculatorJsonLd) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(faqJson) }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-background", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-hero border-b border-border/60 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { path: breadcrumbPath }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "title-hero mb-4 text-hero-foreground", children: "UK Salary Calculator \u2013 Take-Home Pay 2025/26" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "lead text-muted-foreground max-w-3xl mx-auto", children: "Calculate your UK take-home pay for the 2025/26 tax year. Free salary calculator with accurate income tax, National Insurance, and pension contributions. Works for England, Wales, Scotland & Northern Ireland." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Link,
              {
                to: createPageUrl("SalaryCalculatorTakeHomePay"),
                className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700",
                children: "Take\u2011Home Pay"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Link,
              {
                to: createPageUrl("SalaryCalculatorPaycheck"),
                className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700",
                children: "Paycheck"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Link,
              {
                to: createPageUrl("GrossToNetCalculator"),
                className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700",
                children: "Gross\u2011to\u2011Net"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Link,
              {
                to: createPageUrl("ProRataSalaryCalculator"),
                className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700",
                children: "Pro\u2011Rata"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 body text-muted-foreground max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Supports gross-to-net and net-to-gross calculations \u2022 Updated for 2025/26 tax rates \u2022 Includes student loan repayments \u2022 Scottish income tax rates supported" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "UK Salary Calculator Results" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, { value: activeTab, onValueChange: setActiveTab, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { className: "grid w-full grid-cols-2 bg-gray-100 dark:bg-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                TabsTrigger,
                {
                  value: "grossToNet",
                  className: "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-gray-50",
                  children: "Gross to Net"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                TabsTrigger,
                {
                  value: "netToGross",
                  className: "data-[state=active]:bg-white dark:data-[state=active]:bg-gray-600 dark:text-gray-50",
                  children: "Net to Gross"
                }
              )
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, { value: "grossToNet", className: "space-y-6 mt-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossSalary", className: "text-gray-900 dark:text-gray-100", children: "Your Gross Salary" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "grossSalary",
                      type: "number",
                      value: grossSalary,
                      onChange: (e) => setGrossSalary(e.target.value),
                      className: "pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600",
                      placeholder: "e.g. 50000"
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, { value: "netToGross", className: "space-y-6 mt-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "netSalary", className: "text-gray-900 dark:text-gray-100", children: "Your Desired Take-Home" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "netSalary",
                      type: "number",
                      value: netSalary,
                      onChange: (e) => setNetSalary(e.target.value),
                      className: "pl-10 dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600",
                      placeholder: "e.g. 35000"
                    }
                  )
                ] })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "payPeriod", className: "text-gray-900 dark:text-gray-100", children: "Pay Period" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: payPeriod, onValueChange: setPayPeriod, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { className: "dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "annually", children: "Annually" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "monthly", children: "Monthly" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "weekly", children: "Weekly" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "daily", children: "Daily (5 days/week)" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  variant: "outline",
                  onClick: () => setShowAdvanced(!showAdvanced),
                  className: "w-full",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Settings2,
                      {
                        className: `w-4 h-4 mr-2 transition-transform ${showAdvanced ? "rotate-90" : ""}`
                      }
                    ),
                    showAdvanced ? "Hide" : "Show",
                    " Advanced Options"
                  ]
                }
              ),
              showAdvanced && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                AdvancedOptions,
                {
                  taxYear,
                  onTaxYearChange: handleTaxYearChange,
                  location,
                  taxCode,
                  otherAllowances,
                  pensionValue,
                  pensionType,
                  studentLoanPlan,
                  seisInvestment,
                  eisInvestment,
                  onValueChange: handleAdvancedOptionChange
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                "Calculate"
              ] })
            ] })
          ] }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? (
            // Conditional rendering for results
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Heading_default,
                {
                  as: "h2",
                  size: "h2",
                  weight: "bold",
                  className: "text-foreground",
                  eyebrow: `Tax year ${taxData[taxYear].name}`,
                  children: "Your Results"
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body font-medium text-green-800 dark:text-green-300", children: "Annual Take-Home" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-3xl font-bold text-green-900 dark:text-green-100", children: [
                        "\xA3",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          AnimatedNumber,
                          {
                            value: results.takeHomeAnnual,
                            options: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-6 h-6 text-white" }) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-green-700 dark:text-green-300 mt-2", children: [
                    "\xA3",
                    (results.takeHomeAnnual / 12)?.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }),
                    " ",
                    "per month"
                  ] })
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border-red-200 dark:border-red-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body font-medium text-red-800 dark:text-red-300", children: "Total Deductions" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-3xl font-bold text-red-900 dark:text-red-100", children: [
                        "\xA3",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                          AnimatedNumber,
                          {
                            value: results.totalDeductions,
                            options: { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                          }
                        )
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-red-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-6 h-6 text-white" }) })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-red-700 dark:text-red-300 mt-2", children: [
                    results.grossAnnual > 0 ? (results.totalDeductions / results.grossAnnual * 100).toFixed(1) : 0,
                    "% effective rate"
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6 non-printable", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Salary Breakdown" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Pie,
                      {
                        data: prepareChartData().pieData,
                        cx: "50%",
                        cy: "50%",
                        labelLine: false,
                        label: renderCustomizedLabel,
                        outerRadius: 80,
                        dataKey: "value",
                        children: prepareChartData().pieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PieTooltip, {}) })
                  ] }) }) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Payment Periods" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, { data: prepareChartData().barData, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "period", tick: { fill: "currentColor" } }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      YAxis,
                      {
                        tickFormatter: (value) => `\xA3${(value / 1e3).toFixed(0)}k`,
                        tick: { fill: "currentColor" },
                        width: 40
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Legend,
                      {
                        formatter: (value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "caption", children: value })
                      }
                    ),
                    " ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { dataKey: "Take Home", stackId: "a", fill: CHART_COLORS.takeHome }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { dataKey: "Tax", stackId: "a", fill: CHART_COLORS.tax }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Bar,
                      {
                        dataKey: "National Insurance",
                        stackId: "a",
                        fill: CHART_COLORS.nationalInsurance
                      }
                    ),
                    results.pension > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, { dataKey: "Pension", stackId: "a", fill: CHART_COLORS.pension }),
                    results.studentLoan > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Bar,
                      {
                        dataKey: "Student Loan",
                        stackId: "a",
                        fill: CHART_COLORS.studentLoan
                      }
                    )
                  ] }) }) })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: activeTab === "netToGross" ? "Reverse Calculation Breakdown" : "Step-by-Step Calculation" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                  activeTab === "netToGross" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-300 dark:border-green-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-lg text-green-800 dark:text-green-200", children: "1. Your Target Net Take-Home" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-xl text-green-800 dark:text-green-200", children: [
                        "\xA3",
                        (Number(netSalary) * (payPeriod === "monthly" ? 12 : payPeriod === "weekly" ? 52 : payPeriod === "daily" ? 260 : 1))?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-lg text-blue-800 dark:text-blue-200", children: "2. Required Gross Salary" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-xl text-blue-800 dark:text-blue-200", children: [
                        "\xA3",
                        results.grossAnnual?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-yellow-800 dark:text-yellow-300", children: [
                        "\u{1F4A1}",
                        " ",
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                          "To earn \xA3",
                          (Number(netSalary) * (payPeriod === "monthly" ? 12 : payPeriod === "weekly" ? 52 : payPeriod === "daily" ? 260 : 1))?.toLocaleString("en-GB", { maximumFractionDigits: 0 }),
                          " ",
                          "net annually, you need a gross salary of \xA3",
                          results.grossAnnual?.toLocaleString("en-GB", {
                            maximumFractionDigits: 0
                          }),
                          "."
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-yellow-700 dark:text-yellow-400 mt-1", children: "Here's how that gross salary breaks down:" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "3. Personal Allowance (Tax-Free)" }),
                        showAdvanced && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                          "Tax code: ",
                          taxCode,
                          " ",
                          Number(otherAllowances) > 0 ? `+ \xA3${Number(otherAllowances).toLocaleString()} other allowances` : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-blue-700 dark:text-blue-300", children: [
                        "\xA3",
                        results.personalAllowance?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "1. Gross Annual Salary" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-lg text-gray-900 dark:text-gray-100", children: [
                        "\xA3",
                        results.grossAnnual?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "2. Personal Allowance (Tax-Free)" }),
                        showAdvanced && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                          "Tax code: ",
                          taxCode,
                          " ",
                          Number(otherAllowances) > 0 ? `+ \xA3${Number(otherAllowances).toLocaleString()} other allowances` : ""
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-blue-700 dark:text-blue-300", children: [
                        "\xA3",
                        results.personalAllowance?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] })
                  ] }),
                  showAdvanced && results.pension > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
                        activeTab === "netToGross" ? "4" : "3",
                        ". Pension Contribution (Pre-Tax)"
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                        pensionValue,
                        pensionType === "percent" ? "%" : " Fixed PM"
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-700 dark:text-green-300", children: [
                      "-\xA3",
                      results.pension.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
                      activeTab === "netToGross" ? showAdvanced && results.pension > 0 ? "5" : "4" : showAdvanced && results.pension > 0 ? "4" : "3",
                      ". Taxable Income"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-yellow-700 dark:text-yellow-300", children: [
                      "\xA3",
                      (results.grossAnnual - results.personalAllowance - results.pension).toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading_default, { as: "h4", size: "h3", weight: "medium", className: "text-foreground", children: [
                      activeTab === "netToGross" ? showAdvanced && results.pension > 0 ? "6" : "5" : showAdvanced && results.pension > 0 ? "5" : "4",
                      ". Income Tax Calculation:"
                    ] }),
                    results.tax?.breakdown?.map((bracket, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: "flex justify-between items-center p-3 border-l-4 border-red-400 bg-red-50 dark:bg-red-900/20 rounded-r-lg",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
                              bracket.name,
                              " (",
                              bracket.rate,
                              "%)"
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                              bracket.bracketMin !== void 0 ? `\xA3${bracket.bracketMin.toLocaleString()} - ` : "",
                              bracket.bracketMax !== "No limit" ? `\xA3${bracket.bracketMax.toLocaleString()}` : bracket.bracketMax,
                              bracket.taxableAmount > 0 ? ` | Taxed: \xA3${bracket.taxableAmount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-700 dark:text-red-300", children: [
                            "-\xA3",
                            bracket.amount.toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })
                          ] })
                        ]
                      },
                      index
                    )),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-2 bg-red-100 dark:bg-red-800/30 rounded", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium", children: "Total Income Tax:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-red-800 dark:text-red-200", children: [
                        "-\xA3",
                        results.tax.total.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Heading_default, { as: "h4", size: "h3", weight: "medium", className: "text-foreground", children: [
                      activeTab === "netToGross" ? showAdvanced && results.pension > 0 ? "7" : "6" : showAdvanced && results.pension > 0 ? "6" : "5",
                      ". National Insurance Calculation:"
                    ] }),
                    results.nationalInsurance?.breakdown?.map((bracket, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: "flex justify-between items-center p-3 border-l-4 border-purple-400 bg-purple-50 dark:bg-purple-900/20 rounded-r-lg",
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
                              bracket.rate,
                              "% Rate"
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                              bracket.min !== void 0 ? `\xA3${bracket.min.toLocaleString()} - ` : "",
                              bracket.max !== "No limit" ? `\xA3${bracket.max.toLocaleString()}` : bracket.max,
                              bracket.niableAmount > 0 ? ` | NI'able: \xA3${bracket.niableAmount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ""
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-purple-700 dark:text-purple-300", children: [
                            "-\xA3",
                            bracket.amount.toLocaleString("en-GB", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2
                            })
                          ] })
                        ]
                      },
                      index
                    )),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-2 bg-purple-100 dark:bg-purple-800/30 rounded", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium", children: "Total National Insurance:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-purple-800 dark:text-purple-200", children: [
                        "-\xA3",
                        results.nationalInsurance.total.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] })
                  ] }),
                  showAdvanced && results.studentLoan > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 border-l-4 border-orange-400 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: [
                        activeTab === "netToGross" ? showAdvanced && results.pension > 0 ? "8" : "7" : showAdvanced && results.pension > 0 ? "7" : "6",
                        ". Student Loan (",
                        studentLoanPlan.replace("plan", "Plan ").replace("postgraduate", "Postgraduate"),
                        ")"
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                        taxData[taxYear].studentLoanRates[studentLoanPlan]?.rate * 100,
                        "% on income above \xA3",
                        taxData[taxYear].studentLoanRates[studentLoanPlan]?.threshold?.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-orange-700 dark:text-orange-300", children: [
                      "-\xA3",
                      results.studentLoan.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  showAdvanced && results.seisRelief > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 border-l-4 border-teal-400 bg-teal-50 dark:bg-teal-900/20 rounded-r-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "SEIS Tax Relief (50%)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                        "On \xA3",
                        (Number(seisInvestment) || 0).toLocaleString("en-GB"),
                        " ",
                        "investment"
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-teal-700 dark:text-teal-300", children: [
                      "+\xA3",
                      results.seisRelief.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  showAdvanced && results.eisRelief > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 border-l-4 border-teal-400 bg-teal-50 dark:bg-teal-900/20 rounded-r-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "EIS Tax Relief (30%)" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-gray-600 dark:text-gray-300", children: [
                        "On \xA3",
                        (Number(eisInvestment) || 0).toLocaleString("en-GB"),
                        " ",
                        "investment"
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-teal-700 dark:text-teal-300", children: [
                      "+\xA3",
                      results.eisRelief.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-green-100 dark:bg-green-800/50 rounded-lg border-2 border-green-300 dark:border-green-700", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-lg text-green-800 dark:text-green-200", children: activeTab === "netToGross" ? "Confirmed: Your Target Achieved" : "Net Annual Take-Home" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-xl text-green-800 dark:text-green-200", children: [
                      "\xA3",
                      results.takeHomeAnnual?.toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })
                    ] })
                  ] }),
                  activeTab === "netToGross" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-green-50 dark:bg-green-900/20 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-green-800 dark:text-green-300", children: [
                    "\u2705 ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Perfect match!" }),
                    " A gross salary of \xA3",
                    results.grossAnnual?.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    }),
                    " ",
                    "will give you your target net pay of \xA3",
                    results.takeHomeAnnual?.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    }),
                    "."
                  ] }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-4 gap-4 mt-6 pt-6 border-t dark:border-gray-700", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-blue-800 dark:text-blue-300 font-medium", children: "Monthly Take-Home" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl font-bold text-blue-900 dark:text-blue-100", children: [
                        "\xA3",
                        (results.takeHomeAnnual / 12)?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-purple-800 dark:text-purple-300 font-medium", children: "Weekly Take-Home" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl font-bold text-purple-900 dark:text-purple-100", children: [
                        "\xA3",
                        (results.takeHomeAnnual / 52)?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-green-800 dark:text-green-300 font-medium", children: "Daily Take-Home" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl font-bold text-green-900 dark:text-green-100", children: [
                        "\xA3",
                        (results.takeHomeAnnual / 260)?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-green-600 dark:text-green-400", children: "(5days/week)" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-indigo-800 dark:text-indigo-300 font-medium", children: "Hourly Take-Home" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl font-bold text-indigo-900 dark:text-indigo-100", children: [
                        "\xA3",
                        (results.takeHomeAnnual / 2080)?.toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-indigo-600 dark:text-indigo-400", children: "(40hrs/week)" })
                    ] })
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExportActions,
                {
                  csvData,
                  fileName: `salary-calculation-${taxYear}`,
                  title: `Salary Calculation ${taxData[taxYear].name}`
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-amber-50 dark:bg-yellow-900/30 border-amber-200 dark:border-yellow-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-4 flex items-start gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleHelp, { className: "w-5 h-5 text-amber-700 dark:text-yellow-400 mt-0.5" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-amber-800 dark:text-yellow-300", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Disclaimer:" }),
                  " This calculator provides estimates based on UK tax rates for the selected tax year. Results are for guidance only and should not be considered as professional financial advice. Actual deductions may vary based on individual circumstances."
                ] })
              ] }) })
            ] })
          ) : (
            // Placeholder when no calculation has been made
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "lg:col-span-3 flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-muted-foreground", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "text-foreground", children: "Ready for your results?" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: 'Fill in your details and click "Calculate" to see your salary breakdown.' })
            ] }) })
          ) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CalculatorWrapper, { className: "space-y-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "mb-3 text-foreground", children: "Calculate Your Take-Home Pay" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "lead text-muted-foreground", children: "The UK Salary Calculator is an essential tool for anyone employed in the United Kingdom. It demystifies your payslip by translating your gross annual salary\u2014the headline figure offered in a job contract\u2014into your net take-home pay, which is the actual amount that arrives in your bank account. This calculation involves subtracting all mandatory deductions, including Income Tax, National Insurance, and, if applicable, pension contributions and student loan repayments. Our calculator is kept up-to-date with the latest tax thresholds for England, Scotland, Wales, and Northern Ireland, ensuring you receive an accurate and reliable estimate." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "mb-3 text-foreground", children: "Pro-Rata & Pay Frequency (weekly, monthly)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-muted-foreground", children: [
            "Our calculator seamlessly handles various pay frequencies. Whether you are paid annually, monthly, weekly, or daily, you can input your gross pay for that period, and the tool will annualize it to provide a complete tax breakdown. For part-time workers, our dedicated",
            " ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              "a",
              {
                href: createPageUrl("ProRataSalaryCalculator"),
                className: "text-blue-600 hover:underline",
                children: "Pro Rata Salary Calculator"
              }
            ),
            " ",
            "can help you determine your equivalent earnings."
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "mb-3 text-foreground", children: "Student Loan & Pension Options" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-muted-foreground", children: "Use the 'Advanced Options' to tailor the calculation to your specific circumstances. You can select your student loan plan (including Plan 1, 2, 4, 5, and Postgraduate) and specify your workplace pension contributions as either a percentage or a fixed monthly amount. These are factored into your take\u2011home pay." })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        RelatedCalculators,
        {
          calculators: [
            {
              name: "Income Tax Calculator",
              url: createPageUrl("IncomeTaxCalculator"),
              description: "Isolate and understand just your income tax liability."
            },
            {
              name: "National Insurance Calculator",
              url: createPageUrl("NationalInsuranceCalculator"),
              description: "See a detailed breakdown of your NI contributions."
            },
            {
              name: "Pension Calculator",
              url: createPageUrl("PensionCalculator"),
              description: "Project your retirement savings and contributions."
            }
          ]
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-background py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "mb-6 text-foreground", children: "Explore Salary Tools" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorTakeHomePay"),
              className: "block rounded-lg border border-card-muted bg-card p-5 transition hover:border-primary/40 hover:shadow-md",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "text-card-foreground", children: "Take-Home Pay Calculator" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-muted-foreground mt-1", children: "Estimate your net pay after tax & NI." })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorPaycheck"),
              className: "block rounded-lg border border-card-muted bg-card p-5 transition hover:border-primary/40 hover:shadow-md",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "text-card-foreground", children: "Paycheck Calculator" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-muted-foreground mt-1", children: "Weekly, fortnightly or monthly." })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Link,
            {
              to: createPageUrl("GrossToNetCalculator"),
              className: "block rounded-lg border border-card-muted bg-card p-5 transition hover:border-primary/40 hover:shadow-md",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "text-card-foreground", children: "Gross to Net Calculator" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-muted-foreground mt-1", children: "Convert gross salary to take-home." })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Link,
            {
              to: createPageUrl("ProRataSalaryCalculator"),
              className: "block rounded-lg border border-card-muted bg-card p-5 transition hover:border-primary/40 hover:shadow-md",
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "text-card-foreground", children: "Pro-Rata Salary Calculator" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-muted-foreground mt-1", children: "Part-time & pro-rata earnings." })
              ]
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-neutral-soft py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: salaryHubFaqs, title: "Salary Calculator FAQs" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "caption text-muted-foreground mt-6", children: [
          "Last updated: ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { dateTime: LAST_UPDATED_ISO, children: LAST_UPDATED_DISPLAY })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "faq-section", className: "bg-neutral-soft py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: salaryHubFaqs }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-neutral-soft py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center mb-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "mb-4 text-foreground", children: "UK Salary Calculator - Everything You Need to Know" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8 body text-muted-foreground", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "mb-3 text-foreground", children: "How Our UK Tax Calculator Works" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Accurate 2025/26 UK tax rates and thresholds" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Income tax calculation for all UK regions" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 National Insurance contributions (Classes 1 & 4)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Student loan repayment calculations (Plans 1-5)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Pension contribution tax relief" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Scottish income tax rates included" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h3", size: "h3", className: "mb-3 text-foreground", children: "Perfect for UK Employees & Contractors" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 PAYE employees and contractors" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Job offer salary comparisons" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Annual and monthly salary planning" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Gross to net pay calculations" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Net to gross salary requirements" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Tax code adjustments supported" })
            ] })
          ] })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  SalaryCalculatorUK as default
};
