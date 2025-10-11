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
  Building,
  Calculator,
  Percent,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/BuyToLetMortgageCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var btlFAQs = [
  {
    question: "What is rental yield?",
    answer: "Rental yield is the return you get on a property investment from rent, expressed as an an annual percentage of the property's value. A higher yield means a better return."
  },
  {
    question: "What is an Interest Coverage Ratio (ICR)?",
    answer: "ICR is a test used by buy-to-let lenders to ensure the expected rental income will cover the mortgage interest payments by a certain margin. A common requirement is for rent to be at least 125% to 145% of the monthly mortgage payment."
  },
  {
    question: "How much deposit do I need for a buy-to-let mortgage?",
    answer: "Typically, you need a larger deposit for a buy-to-let mortgage than for a residential one. Most lenders require a minimum of 25% of the property's value, but a larger deposit can get you better interest rates."
  }
];
function BuyToLetMortgageCalculator() {
  const [propertyValue, setPropertyValue] = (0, import_react.useState)("");
  const [deposit, setDeposit] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [monthlyRent, setMonthlyRent] = (0, import_react.useState)("");
  const [otherCosts, setOtherCosts] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const pv = Number(propertyValue) || 0;
    const dep = Number(deposit) || 0;
    const rate = Number(interestRate) || 0;
    const rent = Number(monthlyRent) || 0;
    const costs = Number(otherCosts) || 0;
    const loanAmount = pv - dep;
    if (pv <= 0 || rent <= 0 || loanAmount <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyInterest = loanAmount * (rate / 100) / 12;
    const monthlyProfit = rent - monthlyInterest - costs;
    const annualProfit = monthlyProfit * 12;
    const rentalYield = rent * 12 / pv * 100;
    const ltv = loanAmount / pv * 100;
    const icr = monthlyInterest !== 0 ? rent / monthlyInterest * 100 : 0;
    const newResults = {
      monthlyProfit,
      annualProfit,
      rentalYield,
      ltv,
      icr,
      monthlyInterest,
      loanAmount
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Property Value", `\xA3${pv.toFixed(2)}`],
      ["Deposit", `\xA3${dep.toFixed(2)}`],
      ["Loan Amount", `\xA3${loanAmount.toFixed(2)}`],
      ["Interest Rate", `${rate}%`],
      ["Expected Monthly Rent", `\xA3${rent.toFixed(2)}`],
      ["Other Monthly Costs", `\xA3${costs.toFixed(2)}`],
      ["---", "---"],
      ["Monthly Profit", `\xA3${monthlyProfit.toFixed(2)}`],
      ["Annual Profit", `\xA3${annualProfit.toFixed(2)}`],
      ["Rental Yield", `${rentalYield.toFixed(2)}%`],
      ["Loan to Value (LTV)", `${ltv.toFixed(2)}%`],
      ["Interest Coverage Ratio (ICR)", `${icr.toFixed(2)}%`]
    ];
    setCsvData(csvExportData);
  }, [propertyValue, deposit, interestRate, monthlyRent, otherCosts]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Buy-to-Let Mortgage & Rental Yield Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Analyse the profitability and viability of a UK property investment. Calculate rental yield, monthly profit, and key lender metrics like ICR." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investment Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "propertyValue", children: "Property Value" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "propertyValue",
                    type: "number",
                    value: propertyValue,
                    onChange: (e) => setPropertyValue(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 250000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "deposit", children: "Deposit Amount" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "deposit",
                    type: "number",
                    value: deposit,
                    onChange: (e) => setDeposit(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 62500"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Mortgage Interest Rate (APR)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "interestRate",
                    type: "number",
                    value: interestRate,
                    onChange: (e) => setInterestRate(e.target.value),
                    className: "pr-10",
                    placeholder: "e.g. 5.5"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyRent", children: "Expected Monthly Rent" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "monthlyRent",
                    type: "number",
                    value: monthlyRent,
                    onChange: (e) => setMonthlyRent(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 1200"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "otherCosts", children: "Other Monthly Costs" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "otherCosts",
                    type: "number",
                    value: otherCosts,
                    onChange: (e) => setOtherCosts(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 200 (insurance, repairs)"
                  }
                )
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
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Investment Analysis" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportActions, { csvData, fileName: "btl-summary", title: "BTL Summary" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "text-center bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estimated Monthly Profit" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "p",
                {
                  className: `text-5xl font-bold ${results.monthlyProfit > 0 ? "text-green-800" : "text-red-700"}`,
                  children: [
                    "\xA3",
                    results.monthlyProfit.toFixed(2)
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [
                "Annual Profit: \xA3",
                results.annualProfit.toFixed(2)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Key Ratios" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rental Yield:" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    results.rentalYield.toFixed(2),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan to Value (LTV):" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    results.ltv.toFixed(2),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interest Coverage (ICR):" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    results.icr.toFixed(2),
                    "%"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Financials" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan Amount:" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    "\xA3",
                    results.loanAmount.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Interest:" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-600", children: [
                    "\xA3",
                    results.monthlyInterest.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Rent:" }),
                  " ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-600", children: [
                    "\xA3",
                    Number(monthlyRent).toLocaleString()
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Lender Assessment" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              results.icr < 125 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-700", children: "Your Interest Coverage Ratio (ICR) is below the typical 125% minimum. You may struggle to get this mortgage." }) : results.icr < 145 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-amber-700", children: "Your ICR is acceptable for some lenders, but a higher ratio would provide more options and better rates." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-green-700", children: "Your ICR is strong, which should be attractive to most buy-to-let lenders." }),
              results.ltv > 75 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2 text-amber-700", children: "Your Loan-to-Value (LTV) is above 75%. You may need a larger deposit for most BTL products." })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px] bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Analyse your next property investment" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter the deal details to see the numbers." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: btlFAQs }) })
    ] })
  ] });
}
export {
  BuyToLetMortgageCalculator as default
};
