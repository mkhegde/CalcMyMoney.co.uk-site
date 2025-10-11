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
  Percent,
  Plus,
  PoundSterling,
  Trash2,
  TrendingDown
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/DebtToIncomeRatioCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var dtiFAQs = [
  {
    question: "What is a Debt-to-Income (DTI) ratio?",
    answer: "Your DTI ratio is the percentage of your gross monthly income that goes towards paying your monthly debt payments. Lenders use it to assess your ability to manage monthly payments and repay debts."
  },
  {
    question: "What is a good DTI ratio?",
    answer: "Lenders generally prefer a DTI ratio of 36% or less. A ratio above 43% is often considered too high, making it difficult to get approved for a mortgage or other loans."
  },
  {
    question: "How can I lower my DTI ratio?",
    answer: "You can lower your DTI by either increasing your income or reducing your monthly debt payments. Focus on paying down high-interest loans or credit card balances first. Avoid taking on new debt before applying for a major loan."
  }
];
function DebtToIncomeRatioCalculator() {
  const [grossIncome, setGrossIncome] = (0, import_react.useState)("");
  const [debtItems, setDebtItems] = (0, import_react.useState)([
    { name: "Mortgage/Rent", amount: "" },
    { name: "Car Loan", amount: "" }
  ]);
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const updateDebtItem = (index, field, value) => {
    const newItems = [...debtItems];
    newItems[index][field] = value;
    setDebtItems(newItems);
  };
  const addDebtItem = () => setDebtItems([...debtItems, { name: "", amount: "" }]);
  const removeDebtItem = (index) => setDebtItems(debtItems.filter((_, i) => i !== index));
  const handleCalculate = () => {
    const income = Number(grossIncome) || 0;
    const totalDebts = debtItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    if (income <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const dtiRatio = totalDebts / income * 100;
    let status = "Healthy";
    let statusColor = "text-green-600";
    if (dtiRatio > 43) {
      status = "High Risk";
      statusColor = "text-red-600";
    } else if (dtiRatio > 36) {
      status = "Needs Improvement";
      statusColor = "text-amber-600";
    }
    const newResults = { dtiRatio, totalDebts, grossIncome: income, status, statusColor };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Gross Monthly Income", `\xA3${income.toFixed(2)}`],
      ...debtItems.map((item) => [
        `Monthly Debt: ${item.name}`,
        `\xA3${(Number(item.amount) || 0).toFixed(2)}`
      ]),
      ["Total Monthly Debts", `\xA3${totalDebts.toFixed(2)}`],
      ["DTI Ratio", `${dtiRatio.toFixed(2)}%`],
      ["Status", status]
    ];
    setCsvData(csvExportData);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Debt-to-Income (DTI) Ratio Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Understand a key metric lenders use to assess your financial health before approving you for a loan or mortgage." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Monthly Finances" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossIncome", children: "Gross Monthly Income" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "grossIncome",
                    type: "number",
                    value: grossIncome,
                    onChange: (e) => setGrossIncome(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 4000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly Debt Payments" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-2 mt-2", children: debtItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2 items-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    value: item.name,
                    onChange: (e) => updateDebtItem(index, "name", e.target.value),
                    placeholder: "e.g. Credit Card"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      type: "number",
                      value: item.amount,
                      onChange: (e) => updateDebtItem(index, "amount", e.target.value),
                      className: "pl-10 w-32"
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: () => removeDebtItem(index),
                    className: "text-red-500 hover:text-red-700",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
                  }
                )
              ] }, index)) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { variant: "outline", onClick: addDebtItem, className: "w-full mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }),
                "Add Debt"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate DTI"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your DTI Ratio Result" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "dti-ratio-summary",
                title: "DTI Ratio Summary"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex justify-center items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-6 h-6" }),
              "Your DTI Ratio"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: `text-6xl font-bold ${results.statusColor}`, children: [
                results.dtiRatio.toFixed(1),
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: `text-xl font-semibold mt-2 ${results.statusColor}`, children: [
                "(",
                results.status,
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Financial Summary" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Monthly Income:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  results.grossIncome.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Monthly Debts:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-600", children: [
                  "\xA3",
                  results.totalDebts.toLocaleString()
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "What This Means" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start gap-4 p-3 bg-green-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-bold text-green-700 w-24", children: "0-36%" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-green-800", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Healthy:" }),
                  " You likely have a good balance between debt and income and should be able to get new credit easily."
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start gap-4 p-3 bg-amber-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-bold text-amber-700 w-24", children: "37-43%" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-amber-800", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Needs Improvement:" }),
                  " You may have less room in your budget for unexpected costs. Lenders may see you as a higher risk."
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start gap-4 p-3 bg-red-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-bold text-red-700 w-24", children: "44%+" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-red-800", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "High Risk:" }),
                  " You have a limited amount of income available for new credit. It will be difficult to get approved for new loans."
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px] bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Discover your DTI ratio" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your income and debts to see where you stand." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: dtiFAQs }) })
    ] })
  ] });
}
export {
  DebtToIncomeRatioCalculator as default
};
