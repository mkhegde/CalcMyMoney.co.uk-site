import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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
  PoundSterling,
  TrendingDown
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/MortgageAffordabilityCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var affordabilityFAQs = [
  {
    question: "How do lenders calculate mortgage affordability?",
    answer: "Lenders typically use an income multiple, usually around 4 to 4.5 times your annual income. They then subtract existing financial commitments (like loans and credit card debt) and apply 'stress tests' to ensure you could afford repayments if interest rates were to rise."
  },
  {
    question: "What is a Loan-to-Income (LTI) ratio?",
    answer: "Loan-to-Income (LTI) is the ratio of the mortgage amount to your gross annual income. For example, borrowing \xA3200,000 on a \xA350,000 salary gives you an LTI of 4. This is a key metric for lenders."
  },
  {
    question: "How can I improve my mortgage affordability?",
    answer: "You can improve your chances by paying down existing debts, closing unused credit cards, saving for a larger deposit, and checking your credit report for errors. A stable employment history also helps."
  }
];
function MortgageAffordabilityCalculator() {
  const [applicant1Income, setApplicant1Income] = (0, import_react.useState)("");
  const [applicant2Income, setApplicant2Income] = (0, import_react.useState)("");
  const [deposit, setDeposit] = (0, import_react.useState)("");
  const [monthlyDebts, setMonthlyDebts] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const inc1 = Number(applicant1Income) || 0;
    const inc2 = Number(applicant2Income) || 0;
    const totalIncome = inc1 + inc2;
    const dep = Number(deposit) || 0;
    const debts = Number(monthlyDebts) || 0;
    if (totalIncome <= 0 || dep <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const annualDebt = debts * 12;
    const disposableForMortgage = Math.max(0, totalIncome - annualDebt * 2);
    const baseMultiplier = 4.5;
    const estimatedLTI = disposableForMortgage * baseMultiplier / totalIncome;
    let multiplier = baseMultiplier;
    if (estimatedLTI < 4) multiplier = 4.75;
    if (totalIncome > 1e5) multiplier = 5;
    const estimatedBorrowing = disposableForMortgage * multiplier;
    const maxPropertyPrice = estimatedBorrowing + dep;
    const loanToIncome = (estimatedBorrowing / totalIncome).toFixed(2);
    const newResults = {
      estimatedBorrowing,
      maxPropertyPrice,
      deposit: dep,
      loanToIncome
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Estimated Borrowing Amount", `\xA3${newResults.estimatedBorrowing.toFixed(2)}`],
      ["Maximum Property Price", `\xA3${newResults.maxPropertyPrice.toFixed(2)}`],
      ["Your Deposit", `\xA3${newResults.deposit.toFixed(2)}`],
      ["Loan-to-Income (LTI) Ratio", newResults.loanToIncome]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [applicant1Income, applicant2Income, deposit, monthlyDebts]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Mortgage Affordability Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Get a realistic estimate of how much you could borrow for a mortgage based on your income and outgoings." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Mortgage Affordability Estimate" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Financial Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "applicant1Income", children: "Applicant 1 Annual Income" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "applicant1Income",
                    type: "number",
                    value: applicant1Income,
                    onChange: (e) => setApplicant1Income(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 45000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "applicant2Income", children: "Applicant 2 Annual Income (optional)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "applicant2Income",
                    type: "number",
                    value: applicant2Income,
                    onChange: (e) => setApplicant2Income(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 30000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "deposit", children: "Your Deposit Amount" }),
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
                    placeholder: "e.g. 25000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyDebts", children: "Monthly Debt Repayments" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "monthlyDebts",
                    type: "number",
                    value: monthlyDebts,
                    onChange: (e) => setMonthlyDebts(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 300"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "e.g., loans, credit cards, car finance." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Affordability"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Affordability Estimate" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "mortgage-affordability",
                title: "Mortgage Affordability"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-green-800 mb-2", children: "You could borrow up to" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-green-900", children: [
              "\xA3",
              results.estimatedBorrowing.toLocaleString("en-GB", {
                maximumFractionDigits: 0
              })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Buying Power" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-600", children: "Maximum Property Price" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold text-blue-800", children: [
                  "\xA3",
                  results.maxPropertyPrice.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-blue-500", children: [
                  "(Based on your estimated borrowing plus your deposit of \xA3",
                  results.deposit.toLocaleString(),
                  ")"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Your Loan-to-Income (LTI) Ratio" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg font-semibold", children: results.loanToIncome }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Lenders typically cap this around 4.5 to 5.5." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "border-yellow-300 bg-yellow-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-yellow-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Disclaimer:" }),
            " This is an estimate for informational purposes only. Lenders use complex criteria and a full credit check. Always speak to a mortgage advisor for a precise figure."
          ] }) }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "How much can you borrow?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your financial details to get an estimate." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: affordabilityFAQs }) }) })
    ] })
  ] });
}
export {
  MortgageAffordabilityCalculator as default
};
