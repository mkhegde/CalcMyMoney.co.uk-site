import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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
  ArrowRight,
  Calculator,
  PoundSterling,
  Repeat
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/RemortgageCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var remortgageFAQs = [
  {
    question: "When should I consider remortgaging?",
    answer: "You should typically start looking to remortgage 3-6 months before your current fixed, tracker, or discount deal ends to avoid moving onto your lender's expensive Standard Variable Rate (SVR). You might also remortgage to release equity or consolidate debt."
  },
  {
    question: "What is Loan to Value (LTV)?",
    answer: "LTV is the size of your mortgage in relation to the value of your property. For example, if you have a \xA3150,000 mortgage on a \xA3200,000 property, your LTV is 75%. A lower LTV generally gives you access to better mortgage rates."
  },
  {
    question: "Are there fees involved in remortgaging?",
    answer: "Yes, there can be. These might include arrangement fees for the new mortgage, legal fees, and valuation fees. Sometimes 'fee-free' deals are available, but the interest rate may be slightly higher."
  }
];
function RemortgageCalculator() {
  const [currentPropertyValue, setCurrentPropertyValue] = (0, import_react.useState)("300000");
  const [outstandingMortgage, setOutstandingMortgage] = (0, import_react.useState)("150000");
  const [currentMonthlyPayment, setCurrentMonthlyPayment] = (0, import_react.useState)("800");
  const [newInterestRate, setNewInterestRate] = (0, import_react.useState)("4.5");
  const [newMortgageTerm, setNewMortgageTerm] = (0, import_react.useState)("25");
  const [newMortgageFees, setNewMortgageFees] = (0, import_react.useState)("999");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const propVal = Number(currentPropertyValue) || 0;
    const outstanding = Number(outstandingMortgage) || 0;
    const currentPayment = Number(currentMonthlyPayment) || 0;
    const newRate = Number(newInterestRate) / 100;
    const newTermYears = Number(newMortgageTerm) || 0;
    const fees = Number(newMortgageFees) || 0;
    if (propVal <= 0 || outstanding <= 0 || currentPayment <= 0 || newRate <= 0 || newTermYears <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const equity = propVal - outstanding;
    const ltv = outstanding / propVal * 100;
    const monthlyRate = newRate / 12;
    const numberOfPayments = newTermYears * 12;
    const newMonthlyPayment = outstanding * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numberOfPayments));
    const monthlySaving = currentPayment - newMonthlyPayment;
    const firstYearSaving = monthlySaving * 12 - fees;
    setResults({
      equity,
      ltv,
      newMonthlyPayment,
      monthlySaving,
      firstYearSaving
    });
    setHasCalculated(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Remortgage & Equity Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "See how much you could save by switching to a new deal, and calculate the equity in your home." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Your Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-8", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold mb-4", children: "Current Situation" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estimated Property Value" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        value: currentPropertyValue,
                        onChange: (e) => setCurrentPropertyValue(e.target.value),
                        className: "pl-10"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Outstanding Mortgage" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        value: outstandingMortgage,
                        onChange: (e) => setOutstandingMortgage(e.target.value),
                        className: "pl-10"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current Monthly Payment" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        value: currentMonthlyPayment,
                        onChange: (e) => setCurrentMonthlyPayment(e.target.value),
                        className: "pl-10"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold mb-4", children: "New Mortgage Deal" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New Interest Rate (%)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      value: newInterestRate,
                      onChange: (e) => setNewInterestRate(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New Mortgage Term (Years)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      value: newMortgageTerm,
                      onChange: (e) => setNewMortgageTerm(e.target.value)
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "New Mortgage Fees" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        value: newMortgageFees,
                        onChange: (e) => setNewMortgageFees(e.target.value),
                        className: "pl-10"
                      }
                    )
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Savings"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "text-center bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Potential Monthly Saving" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "p",
                {
                  className: `text-5xl font-bold ${results.monthlySaving > 0 ? "text-green-800" : "text-red-700"}`,
                  children: [
                    "\xA3",
                    Math.abs(results.monthlySaving).toFixed(2)
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: results.monthlySaving > 0 ? "per month saving" : "per month increase" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Remortgage Summary" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Payment" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                  "\xA3",
                  Number(currentMonthlyPayment).toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Payment" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-5 h-5 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-700", children: [
                  "\xA3",
                  results.newMonthlyPayment.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between border-t pt-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "First Year Saving (after fees)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "span",
                  {
                    className: `font-bold ${results.firstYearSaving > 0 ? "text-green-700" : "text-red-700"}`,
                    children: [
                      "\xA3",
                      results.firstYearSaving.toFixed(2)
                    ]
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Equity Position" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Home Equity:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  results.equity.toLocaleString()
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
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 pt-2 border-t", children: "A lower LTV ratio often gives you access to better interest rates from lenders." })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[400px] bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Could you save by switching?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to find out." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: remortgageFAQs }) })
    ] })
  ] });
}
export {
  RemortgageCalculator as default
};
