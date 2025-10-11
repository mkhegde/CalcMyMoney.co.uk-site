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
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SimpleInterestCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var simpleInterestFAQs = [
  {
    question: "What is simple interest?",
    answer: "Simple interest is a quick method of calculating the interest charge on a loan or principal amount. It is determined by multiplying the daily interest rate by the principal by the number of days that elapse between payments."
  },
  {
    question: "What's the difference between simple and compound interest?",
    answer: "Simple interest is calculated only on the initial principal amount. In contrast, compound interest is calculated on the principal amount and also on the accumulated interest of previous periods. This 'interest on interest' effect makes compound interest grow much faster over time."
  },
  {
    question: "When is simple interest typically used?",
    answer: "Simple interest is often used for short-term loans, such as car loans or certain personal loans. Most savings accounts and long-term investments use compound interest because it is much more powerful for wealth growth."
  },
  {
    question: "A Note on Calculations",
    answer: "This calculator applies the standard `I = P * R * T` formula. It's a useful tool for understanding the basic concept of interest but may not reflect the complex terms of a real-world financial product. Always check the terms and conditions provided by your financial institution."
  }
];
function SimpleInterestCalculator() {
  const [principal, setPrincipal] = (0, import_react.useState)("10000");
  const [rate, setRate] = (0, import_react.useState)("5");
  const [term, setTerm] = (0, import_react.useState)("10");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const p = Number(principal) || 0;
    const r = Number(rate) / 100;
    const t = Number(term) || 0;
    if (p <= 0 || r < 0 || t <= 0) {
      setResults(null);
      return;
    }
    const interest = p * r * t;
    const finalAmount = p + interest;
    setResults({
      totalInterest: interest,
      finalAmount
    });
  }, [principal, rate, term]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Simple Interest Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate interest earned on a principal amount without the effect of compounding." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Calculation Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "principal", children: "Principal Amount (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "principal",
                    type: "number",
                    value: principal,
                    onChange: (e) => setPrincipal(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "rate", children: "Annual Interest Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    id: "rate",
                    value: [parseFloat(rate)],
                    onValueChange: ([val]) => setRate(val.toString()),
                    max: 25,
                    step: 0.1,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: rate,
                    onChange: (e) => setRate(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "term", children: "Time Period (Years)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    id: "term",
                    value: [parseFloat(term)],
                    onValueChange: ([val]) => setTerm(val.toString()),
                    max: 50,
                    step: 1,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: term,
                    onChange: (e) => setTerm(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3", children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Simple Interest Results" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4 text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "p-6 bg-blue-50", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-sm font-medium text-blue-800", children: "Total Interest Earned" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-blue-900 mt-2", children: [
                  "\xA3",
                  results.totalInterest.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "p-6 bg-green-50", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-sm font-medium text-green-800", children: "Final Amount" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-green-900 mt-2", children: [
                  "\xA3",
                  results.finalAmount.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-gray-600 p-4 bg-gray-50 rounded-lg", children: [
              "After ",
              term,
              " years, your initial principal of \xA3",
              Number(principal).toLocaleString(),
              " would earn \xA3",
              results.totalInterest.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
              " ",
              "in simple interest, resulting in a total amount of \xA3",
              results.finalAmount.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
              "."
            ] })
          ] })
        ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter your details to see the results." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: simpleInterestFAQs }) })
    ] })
  ] });
}
export {
  SimpleInterestCalculator as default
};
