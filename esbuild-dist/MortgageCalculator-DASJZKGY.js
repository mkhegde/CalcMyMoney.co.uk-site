import {
  Breadcrumbs,
  CalculatorWrapper
} from "./chunk-U6RX6SVX.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
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
  useLocation
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
  House,
  Percent,
  PoundSterling,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/MortgageCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var mortgageCalculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Mortgage Calculator 2025/26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  description: "Free UK mortgage calculator with stamp duty. Calculate monthly payments, affordability, and total costs for UK property purchases.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP"
  }
};
var mortgageCalculatorFAQs = [
  {
    question: "How much can I borrow for a mortgage?",
    answer: "UK lenders typically offer 4-4.5 times your annual income, but this depends on affordability assessments including your monthly expenses, credit score, and existing debts. Some lenders may offer up to 5-6 times income in certain circumstances."
  },
  {
    question: "What is Loan-to-Value (LTV) and why does it matter?",
    answer: "LTV is the percentage of the property value you're borrowing. A lower LTV (higher deposit) typically gets you better interest rates. For example, 90% LTV means a 10% deposit, while 75% LTV means a 25% deposit."
  },
  {
    question: "What is stamp duty and how much will I pay?",
    answer: "Stamp duty is a tax on property purchases in England and Wales. For 2025/26, you pay 5% on the portion between \xA3250k-\xA3925k, 10% on \xA3925k-\xA31.5m, and 12% above \xA31.5m. First-time buyers get relief up to \xA3425k."
  },
  {
    question: "Should I choose a fixed or variable rate mortgage?",
    answer: "Fixed rates provide payment certainty but may be higher initially. Variable rates can go up or down but offer potential savings if rates fall. Consider your risk tolerance and how long you plan to stay in the property."
  },
  {
    question: "What's the difference between capital repayment and interest-only mortgages?",
    answer: "Capital repayment mortgages pay off both the loan and interest, so you own the property outright at the end. Interest-only mortgages have lower monthly payments but you still owe the full loan amount at the end of the term."
  },
  {
    question: "What additional costs should I budget for when buying a home?",
    answer: "Beyond the deposit and stamp duty, budget for: legal fees (\xA31,000-\xA32,000), survey costs (\xA3400-\xA31,200), mortgage arrangement fees (\xA30-\xA32,000), buildings insurance, and moving costs. Allow 3-5% of purchase price for total costs."
  }
];
function MortgageCalculator() {
  const [propertyValue, setPropertyValue] = (0, import_react.useState)("");
  const [deposit, setDeposit] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [term, setTerm] = (0, import_react.useState)(25);
  const [repaymentType, setRepaymentType] = (0, import_react.useState)("repayment");
  const [income, setIncome] = (0, import_react.useState)("");
  const [monthlyExpenses, setMonthlyExpenses] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const location = useLocation();
  const breadcrumbPath = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "Property & Mortgages", url: `${createPageUrl("Home")}#property-mortgages` },
    { name: "Mortgage Calculator" }
  ];
  (0, import_react.useEffect)(() => {
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);
  const handleCalculate = () => {
    const currentPropertyValue = Number(propertyValue) || 0;
    const currentDeposit = Number(deposit) || 0;
    const currentInterestRate = Number(interestRate) || 0;
    const currentTerm = Number(term) || 0;
    const currentIncome = Number(income) || 0;
    const currentMonthlyExpenses = Number(monthlyExpenses) || 0;
    const loanAmount = currentPropertyValue - currentDeposit;
    if (currentPropertyValue <= 0 || currentDeposit < 0 || loanAmount <= 0 || currentInterestRate <= 0 || currentTerm <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyRate = currentInterestRate / 100 / 12;
    const numPayments = currentTerm * 12;
    const depositPercentage = currentDeposit / currentPropertyValue * 100;
    let monthlyPayment = 0;
    let totalInterest = 0;
    let totalPayable = 0;
    if (repaymentType === "repayment") {
      if (monthlyRate > 0) {
        monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      } else {
        monthlyPayment = loanAmount / numPayments;
      }
      totalPayable = monthlyPayment * numPayments;
      totalInterest = totalPayable - loanAmount;
    } else {
      monthlyPayment = loanAmount * currentInterestRate / 100 / 12;
      totalInterest = monthlyPayment * numPayments;
      totalPayable = totalInterest + loanAmount;
    }
    const maxAffordableMortgage = currentIncome * 4.5;
    const monthlyIncome = currentIncome / 12;
    const disposableIncome = monthlyIncome - currentMonthlyExpenses;
    const loanToValue = loanAmount / currentPropertyValue * 100;
    let stampDuty = 0;
    if (currentPropertyValue > 25e4) {
      stampDuty += Math.min(currentPropertyValue - 25e4, 925e3 - 25e4) * 0.05;
    }
    if (currentPropertyValue > 925e3) {
      stampDuty += Math.min(currentPropertyValue - 925e3, 15e5 - 925e3) * 0.1;
    }
    if (currentPropertyValue > 15e5) {
      stampDuty += (currentPropertyValue - 15e5) * 0.12;
    }
    const legalFees = 1500;
    const surveyFees = 600;
    const totalUpfrontCosts = currentDeposit + stampDuty + legalFees + surveyFees;
    const newResults = {
      loanAmount,
      monthlyPayment,
      totalInterest,
      totalPayable,
      depositPercentage,
      loanToValue,
      maxAffordableMortgage,
      disposableIncome,
      stampDuty,
      totalUpfrontCosts,
      affordabilityRatio: monthlyPayment / monthlyIncome * 100
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Property Value", `\xA3${currentPropertyValue.toFixed(2)}`],
      ["Deposit Amount", `\xA3${currentDeposit.toFixed(2)}`],
      ["Loan Amount", `\xA3${newResults.loanAmount.toFixed(2)}`],
      ["Interest Rate", `${currentInterestRate.toFixed(2)}%`],
      ["Mortgage Term", `${currentTerm} years`],
      ["", ""],
      ["Monthly Payment", `\xA3${newResults.monthlyPayment.toFixed(2)}`],
      ["Total Interest Paid", `\xA3${newResults.totalInterest.toFixed(2)}`],
      ["Total Payable", `\xA3${newResults.totalPayable.toFixed(2)}`],
      ["", ""],
      ["Stamp Duty", `\xA3${newResults.stampDuty.toFixed(2)}`],
      ["Estimated Legal & Survey Fees", `\xA32100.00`],
      ["Total Upfront Costs", `\xA3${newResults.totalUpfrontCosts.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, [propertyValue, deposit, interestRate, term, repaymentType, income, monthlyExpenses]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(mortgageCalculatorJsonLd) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { path: breadcrumbPath }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Mortgage Calculator" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate UK mortgage payments, affordability, and stamp duty costs. Free mortgage calculator for England, Wales, Scotland & Northern Ireland property purchases." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 text-sm text-gray-500 dark:text-gray-400 max-w-4xl mx-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Includes stamp duty calculator \u2022 Affordability assessment \u2022 Interest-only & repayment mortgages \u2022 Updated 2025/26 rates" }) })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Mortgage Calculation Results" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-1 space-y-6 non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-5 h-5" }),
                "Property Details"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "propertyValue", children: "Property Value" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        id: "propertyValue",
                        type: "number",
                        value: propertyValue,
                        onChange: (e) => setPropertyValue(e.target.value),
                        className: "pl-10",
                        placeholder: "e.g. 300000"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "deposit", children: "Deposit Amount" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        id: "deposit",
                        type: "number",
                        value: deposit,
                        onChange: (e) => setDeposit(e.target.value),
                        className: "pl-10",
                        placeholder: "e.g. 60000"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 h-4", children: propertyValue && deposit && Number(propertyValue) > 0 ? `${(Number(deposit) / Number(propertyValue) * 100).toFixed(1)}% of property value` : "" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5" }),
                "Mortgage Details"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Interest Rate (%)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        id: "interestRate",
                        type: "number",
                        value: interestRate,
                        onChange: (e) => setInterestRate(e.target.value),
                        className: "pl-10",
                        step: "0.1",
                        placeholder: "e.g. 4.5"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "term", children: "Mortgage Term (Years)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    Select,
                    {
                      value: term.toString(),
                      onValueChange: (value) => setTerm(Number(value)),
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "15", children: "15 years" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "20", children: "20 years" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "25", children: "25 years" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "30", children: "30 years" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "35", children: "35 years" })
                        ] })
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "repaymentType", children: "Repayment Type" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: repaymentType, onValueChange: setRepaymentType, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "repayment", children: "Capital & Interest" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "interest_only", children: "Interest Only" })
                    ] })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
                "Affordability Check"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "income", children: "Annual Gross Income" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        id: "income",
                        type: "number",
                        value: income,
                        onChange: (e) => setIncome(e.target.value),
                        className: "pl-10",
                        placeholder: "e.g. 50000"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyExpenses", children: "Monthly Expenses" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        id: "monthlyExpenses",
                        type: "number",
                        value: monthlyExpenses,
                        onChange: (e) => setMonthlyExpenses(e.target.value),
                        className: "pl-10",
                        placeholder: "e.g. 1500"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg !mt-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                  "Calculate Mortgage"
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 space-y-6 printable-area", children: hasCalculated && results ? (
            // Conditionally render results
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex justify-between items-center non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Mortgage Summary" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-blue-800", children: "Monthly Payment" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-blue-900", children: [
                        "\xA3",
                        results.monthlyPayment?.toLocaleString("en-GB", {
                          maximumFractionDigits: 0
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-8 h-8 text-blue-600" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-blue-700 mt-1", children: repaymentType === "repayment" ? "Capital & Interest" : "Interest Only" })
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-green-800", children: "Loan Amount" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-green-900", children: [
                        "\xA3",
                        results.loanAmount?.toLocaleString("en-GB", {
                          maximumFractionDigits: 0
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-8 h-8 text-green-600" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-green-700 mt-1", children: [
                    results.loanToValue?.toFixed(1),
                    "% Loan-to-Value"
                  ] })
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/50 dark:to-purple-800/50 border-purple-200 dark:border-purple-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-purple-800", children: "Total Interest" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-purple-900", children: [
                        "\xA3",
                        results.totalInterest?.toLocaleString("en-GB", {
                          maximumFractionDigits: 0
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-8 h-8 text-purple-600" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-purple-700 mt-1", children: [
                    "Over ",
                    term,
                    " years"
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Card,
                {
                  id: "affordability-assessment",
                  className: `${results.affordabilityRatio > 45 ? "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700" : results.affordabilityRatio > 35 ? "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700" : "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700"}`,
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
                      "Affordability Assessment"
                    ] }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Income:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                            "\xA3",
                            (income / 12).toLocaleString("en-GB", { maximumFractionDigits: 0 })
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Expenses:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                            "-\xA3",
                            monthlyExpenses.toLocaleString("en-GB", {
                              maximumFractionDigits: 0
                            })
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mortgage Payment:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                            "-\xA3",
                            results.monthlyPayment?.toLocaleString("en-GB", {
                              maximumFractionDigits: 0
                            })
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remaining:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "span",
                            {
                              className: `font-bold ${results.disposableIncome - results.monthlyPayment >= 0 ? "text-green-600" : "text-red-600"}`,
                              children: [
                                "\xA3",
                                (results.disposableIncome - results.monthlyPayment)?.toLocaleString(
                                  "en-GB",
                                  { maximumFractionDigits: 0 }
                                )
                              ]
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payment-to-Income Ratio:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "span",
                            {
                              className: `font-semibold ${results.affordabilityRatio > 45 ? "text-red-600" : results.affordabilityRatio > 35 ? "text-yellow-600" : "text-green-600"}`,
                              children: [
                                results.affordabilityRatio?.toFixed(1),
                                "%"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Max Affordable Loan:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                            "\xA3",
                            results.maxAffordableMortgage?.toLocaleString("en-GB", {
                              maximumFractionDigits: 0
                            })
                          ] })
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Loan Amount:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                            "span",
                            {
                              className: `font-semibold ${results.loanAmount > results.maxAffordableMortgage ? "text-red-600" : "text-green-600"}`,
                              children: [
                                "\xA3",
                                results.loanAmount?.toLocaleString("en-GB", {
                                  maximumFractionDigits: 0
                                })
                              ]
                            }
                          )
                        ] }),
                        results.affordabilityRatio > 45 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-red-100 rounded-lg mt-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-red-800", children: "\u26A0\uFE0F Payment ratio exceeds recommended 45% - consider a lower loan amount" }) }),
                        results.loanAmount > results.maxAffordableMortgage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-yellow-100 rounded-lg mt-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-yellow-800", children: "\u{1F4A1} Loan exceeds typical 4.5x income multiplier" }) })
                      ] })
                    ] }) })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Card,
                {
                  id: "cost-breakdown",
                  className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Cost Breakdown" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-900", children: "Upfront Costs" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2 text-sm", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "Deposit (",
                              results.depositPercentage?.toFixed(1),
                              "%):"
                            ] }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              Number(deposit).toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stamp Duty:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.stampDuty?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Legal Fees (est.):" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\xA31,500" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Survey Fees (est.):" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "\xA3600" })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-semibold", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Upfront:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.totalUpfrontCosts?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] })
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-900", children: "Lifetime Costs" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2 text-sm", children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan Amount:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.loanAmount?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Interest:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.totalInterest?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Payment:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.monthlyPayment?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] }),
                          repaymentType === "interest_only" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Final Balloon Payment:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.loanAmount?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-semibold", children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Payable:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              "\xA3",
                              results.totalPayable?.toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ] })
                          ] })
                        ] })
                      ] })
                    ] }) }) })
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Important Information" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-sm text-blue-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                    "\u{1F3E0} ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Stamp Duty:" }),
                    " Calculated for England & Wales. Scotland and Northern Ireland have different rates."
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                    "\u{1F4CA} ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "LTV Ratio:" }),
                    " Lower ratios typically qualify for better interest rates"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                    "\u{1F4B0} ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Affordability:" }),
                    " Lenders typically offer 4-4.5x annual income, subject to affordability tests"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                    "\u{1F4C8} ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Interest Only:" }),
                    " Remember you'll still owe the full loan amount at the end of the term"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                    "\u2696\uFE0F ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Additional Costs:" }),
                    " Consider buildings insurance, mortgage protection, and ongoing maintenance"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                    "\u{1F4DE} ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Professional Advice:" }),
                    " Consult a mortgage advisor for personalized recommendations"
                  ] })
                ] }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExportActions,
                {
                  csvData,
                  fileName: "mortgage-summary",
                  title: "Mortgage Summary"
                }
              ) })
            ] })
          ) : (
            // Placeholder if no calculation has occurred or results are null
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready for your mortgage estimate?" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: 'Fill in the details and click "Calculate Mortgage" to see your breakdown.' }),
              hasCalculated && !results && // Display error message if calculation was attempted but results are null
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-500 mt-2", children: "Please ensure all required fields are filled and valid (e.g., property value, deposit, interest rate, term, and loan amount is positive)." })
            ] }) })
          ) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorWrapper, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100", children: "How to Use the UK Mortgage Calculator" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "A mortgage is typically the largest financial commitment you'll ever make. Our UK Mortgage Calculator is a powerful tool designed to give you clarity and confidence by estimating your monthly mortgage repayments. By entering the property price, your deposit amount, the mortgage interest rate, and the loan term, you can instantly see your potential monthly costs. This allows you to assess the affordability of a property, compare different mortgage deals, and understand the long-term financial implications of your homeownership journey." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "When Should You Use This Calculator?" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Early-Stage House Hunting:" }),
            " Get a feel for what you can afford before you start viewing properties."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Comparing Mortgage Deals:" }),
            " Enter details from different lenders to see how a small change in interest rate can affect your monthly payment."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Considering Overpayments:" }),
            " See how much you could save on interest by paying more than the required amount each month."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Choosing a Mortgage Term:" }),
            " Understand the trade-off between a shorter term (higher monthly payments, less total interest) and a longer term (lower monthly payments, more total interest)."
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Example Use Case" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "A couple is looking to buy a house valued at \xA3300,000. They have saved a 15% deposit of \xA345,000, meaning they need to borrow \xA3255,000. They have been offered a mortgage with a 4.5% interest rate over a 30-year term. They enter these values into the calculator. The result shows a monthly repayment of approximately \xA31,292. The amortization chart reveals that in the early years, a large portion of their payment goes towards interest, but this gradually shifts towards paying down the principal loan amount over time. This information helps them confidently confirm that the property fits within their monthly budget." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "faq-section", className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: mortgageCalculatorFAQs }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        RelatedCalculators,
        {
          calculators: [
            {
              name: "Stamp Duty Calculator",
              url: createPageUrl("StampDutyCalculator"),
              description: "Calculate the property tax due on your purchase."
            },
            {
              name: "Rent vs Buy Calculator",
              url: createPageUrl("RentVsBuyCalculator"),
              description: "Compare the financial costs of renting versus buying a home."
            },
            {
              name: "Mortgage Affordability Calculator",
              url: createPageUrl("MortgageAffordabilityCalculator"),
              description: "Estimate how much you might be able to borrow."
            }
          ]
        }
      )
    ] })
  ] });
}
export {
  MortgageCalculator as default
};
