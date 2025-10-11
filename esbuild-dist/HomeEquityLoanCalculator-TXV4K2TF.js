import {
  Slider
} from "./chunk-SFFJNVBD.js";
import "./chunk-V5SP5FAB.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
import "./chunk-66ZJ7JT3.js";
import "./chunk-RDJYUOP4.js";
import {
  Label
} from "./chunk-AXLI4SNI.js";
import {
  Input
} from "./chunk-KK4JIGNC.js";
import "./chunk-RTS3GJRL.js";
import "./chunk-VKAPTTXR.js";
import "./chunk-DOIEHZ4R.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  Banknote,
  House
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/HomeEquityLoanCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var homeEquityFAQs = [
  {
    question: "What is home equity?",
    answer: "Home equity is the portion of your home that you own outright. It's the difference between your property's current market value and the amount you still owe on your mortgage. Equity increases as you pay down your mortgage and as your property value appreciates."
  },
  {
    question: "What is Loan-to-Value (LTV)?",
    answer: "Loan-to-Value (LTV) is a percentage that represents the ratio of a loan to the value of the asset purchased. Lenders use LTV to assess risk. For a home equity loan, they will typically cap the total LTV (your original mortgage + new loan) at around 80-85% of the property's value."
  },
  {
    question: "What are the risks of a home equity loan?",
    answer: "The biggest risk is that a home equity loan is secured against your property. If you fail to make the repayments, your home could be at risk of repossession. Additionally, if property values fall, you could end up in negative equity, where you owe more than your house is worth."
  },
  {
    question: "A Note on Trustworthiness",
    answer: "This calculator provides an estimate of the equity you could potentially borrow against. The actual amount a lender will offer depends on their specific lending criteria, your credit history, income, and a formal property valuation. Always consult with a mortgage advisor before making any decisions."
  }
];
function HomeEquityLoanCalculator() {
  const [propertyValue, setPropertyValue] = (0, import_react.useState)("350000");
  const [outstandingMortgage, setOutstandingMortgage] = (0, import_react.useState)("150000");
  const [ltvLimit, setLtvLimit] = (0, import_react.useState)("85");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const value = Number(propertyValue) || 0;
    const mortgage = Number(outstandingMortgage) || 0;
    const ltv = Number(ltvLimit) / 100;
    if (value <= 0 || mortgage < 0 || ltv <= 0) {
      setResults(null);
      return;
    }
    const currentEquity = value - mortgage;
    const totalBorrowingLimit = value * ltv;
    const maxAvailableToBorrow = Math.max(0, totalBorrowingLimit - mortgage);
    setResults({
      currentEquity,
      maxAvailableToBorrow
    });
  }, [propertyValue, outstandingMortgage, ltvLimit]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Home Equity Loan Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Estimate how much you could potentially borrow against the equity in your home." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Property Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "propertyValue", children: "Estimated Property Value (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "propertyValue",
                    type: "number",
                    value: propertyValue,
                    onChange: (e) => setPropertyValue(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "outstandingMortgage", children: "Outstanding Mortgage Balance (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "outstandingMortgage",
                    type: "number",
                    value: outstandingMortgage,
                    onChange: (e) => setOutstandingMortgage(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "ltvLimit", children: "Lender's LTV Limit (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    id: "ltvLimit",
                    value: [parseFloat(ltvLimit)],
                    onValueChange: ([val]) => setLtvLimit(val.toString()),
                    min: 50,
                    max: 95,
                    step: 1,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: ltvLimit,
                    onChange: (e) => setLtvLimit(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900", children: "Maximum Available to Borrow" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-green-900", children: [
              "\xA3",
              results.maxAvailableToBorrow.toLocaleString("en-GB", {
                maximumFractionDigits: 0
              })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Equity Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Property Value:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  Number(propertyValue).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mortgage Owed:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "-\xA3",
                  Number(outstandingMortgage).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-bold text-lg text-blue-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Your Current Equity:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "\xA3",
                  results.currentEquity.toLocaleString()
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-xs text-gray-500 p-3 bg-gray-100 rounded-lg", children: "This is an estimate. Lenders will conduct their own valuation and have specific criteria regarding income and credit history that will determine the final loan amount." })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter your details to calculate." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: homeEquityFAQs }) })
    ] })
  ] });
}
export {
  HomeEquityLoanCalculator as default
};
