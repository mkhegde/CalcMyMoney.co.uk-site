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
  Calendar,
  PoundSterling,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/BusinessLoanCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var businessLoanFAQs = [
  {
    question: "What types of business loans are available in the UK?",
    answer: "Common types include term loans, business overdrafts, asset finance, invoice finance, and government-backed loans like Start Up Loans or Bounce Back Loans. Each has different terms, rates, and eligibility criteria."
  },
  {
    question: "How do lenders assess business loan applications?",
    answer: "Lenders look at your business plan, cash flow forecasts, trading history, personal and business credit scores, collateral, and sometimes require personal guarantees. New businesses may need to provide more detailed projections."
  },
  {
    question: "Can I deduct business loan interest from my taxes?",
    answer: "Yes, interest payments on business loans are typically tax-deductible as a business expense. However, the principal repayment is not deductible. Always consult with an accountant for your specific situation."
  }
];
function BusinessLoanCalculator() {
  const [loanAmount, setLoanAmount] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [loanTerm, setLoanTerm] = (0, import_react.useState)("");
  const [loanType, setLoanType] = (0, import_react.useState)("term");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const P = Number(loanAmount) || 0;
    const r = (Number(interestRate) || 0) / 100 / 12;
    const n = (Number(loanTerm) || 0) * 12;
    if (P <= 0 || r <= 0 || n <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    let monthlyPayment;
    let totalRepayment;
    let totalInterest;
    if (loanType === "term") {
      monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      totalRepayment = monthlyPayment * n;
      totalInterest = totalRepayment - P;
    } else {
      monthlyPayment = P * r;
      totalInterest = monthlyPayment * n;
      totalRepayment = totalInterest + P;
    }
    const monthlyInterestCost = totalInterest / n;
    const annualInterestCost = monthlyInterestCost * 12;
    const taxSavings = annualInterestCost * 0.19;
    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      annualInterestCost,
      taxSavings,
      loanAmount: P,
      effectiveRate: totalInterest / P / (n / 12) * 100
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Monthly Payment", `\xA3${newResults.monthlyPayment.toFixed(2)}`],
      ["Total Repayment", `\xA3${newResults.totalRepayment.toFixed(2)}`],
      ["Total Interest", `\xA3${newResults.totalInterest.toFixed(2)}`],
      ["Annual Interest Cost", `\xA3${newResults.annualInterestCost.toFixed(2)}`],
      ["Tax Savings (19% Corp Tax)", `\xA3${newResults.taxSavings.toFixed(2)}`],
      ["Effective Interest Rate", `${newResults.effectiveRate.toFixed(2)}%`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [loanAmount, interestRate, loanTerm, loanType]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Business Loan Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate monthly payments and total costs for business loans, including the tax benefits of interest deductibility." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Business Loan Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "loanAmount", children: "Loan Amount" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "loanAmount",
                    type: "number",
                    value: loanAmount,
                    onChange: (e) => setLoanAmount(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 50000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Annual Interest Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "interestRate",
                    type: "number",
                    value: interestRate,
                    onChange: (e) => setInterestRate(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 6.5"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "loanTerm", children: "Loan Term (Years)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "loanTerm",
                    type: "number",
                    value: loanTerm,
                    onChange: (e) => setLoanTerm(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 5"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Loan Type" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: loanType, onValueChange: setLoanType, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "term", children: "Term Loan (Capital & Interest)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "interest_only", children: "Interest Only" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Business Loan Summary" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportActions, { csvData, fileName: "business-loan", title: "Business Loan" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-blue-50 border-blue-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-blue-800 mb-2", children: "Monthly Payment" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-blue-900", children: [
              "\xA3",
              results.monthlyPayment.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Costs" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-gray-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Total Interest" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.totalInterest.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-gray-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Total Repayment" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.totalRepayment.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tax Benefits" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-green-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-600", children: "Annual Tax Savings" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.taxSavings.toLocaleString("en-GB", { maximumFractionDigits: 0 })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-green-500", children: "Interest is tax-deductible" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-blue-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-600", children: "Effective Rate" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    results.effectiveRate.toFixed(2),
                    "%"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          loanType === "interest_only" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "border-yellow-300 bg-yellow-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-yellow-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Note:" }),
            " With interest-only loans, you'll still owe the full \xA3",
            results.loanAmount.toLocaleString(),
            " at the end of the term."
          ] }) }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your business loan details to see the costs." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: businessLoanFAQs }) }) })
    ] })
  ] });
}
export {
  BusinessLoanCalculator as default
};
