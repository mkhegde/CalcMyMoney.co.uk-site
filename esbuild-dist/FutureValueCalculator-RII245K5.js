import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import {
  Label
} from "./chunk-AXLI4SNI.js";
import {
  Input
} from "./chunk-KK4JIGNC.js";
import "./chunk-VKAPTTXR.js";
import "./chunk-DOIEHZ4R.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/FutureValueCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var fvFAQs = [
  {
    question: "What is Future Value (FV)?",
    answer: "Future Value is a financial formula used to determine the value of a current asset at a specified date in the future, based on an assumed rate of growth. It helps you understand the power of compounding over time."
  },
  {
    question: "How is this different from the Compound Interest Calculator?",
    answer: "They are very similar! Both use the core principles of compounding. The Compound Interest Calculator is designed to show you the growth of regular savings over time. This Future Value calculator focuses on calculating the future worth of a single, one-time investment."
  },
  {
    question: "What can I use Future Value for?",
    answer: "It's great for financial planning. For example, you can use it to estimate how much a single investment of \xA310,000 today might be worth when you retire, helping you make informed decisions about your investment strategy."
  }
];
function FutureValueCalculator() {
  const [presentValue, setPresentValue] = (0, import_react.useState)("10000");
  const [interestRate, setInterestRate] = (0, import_react.useState)("7");
  const [years, setYears] = (0, import_react.useState)("10");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const pv = Number(presentValue) || 0;
    const r = Number(interestRate) / 100;
    const t = Number(years) || 0;
    if (pv <= 0 || r < 0 || t <= 0) {
      setResults(null);
      return;
    }
    const futureValue = pv * Math.pow(1 + r, t);
    const totalInterest = futureValue - pv;
    setResults({ futureValue, totalInterest });
  }, [presentValue, interestRate, years]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Future Value Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Calculate the future value of a single sum investment with compound interest." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investment Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "presentValue", children: "Present Value (Current Investment) (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "presentValue",
                  type: "number",
                  value: presentValue,
                  onChange: (e) => setPresentValue(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Annual Interest Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "interestRate",
                  type: "number",
                  value: interestRate,
                  onChange: (e) => setInterestRate(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "years", children: "Number of Years" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "years",
                  type: "number",
                  value: years,
                  onChange: (e) => setYears(e.target.value)
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900", children: "Future Value" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-green-900", children: [
                "\xA3",
                results.futureValue.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-700 mt-2", children: [
                " ",
                "Total value after ",
                years,
                " years. "
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Growth Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Initial Investment:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  Number(presentValue).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Interest Earned:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-700", children: [
                  "\xA3",
                  results.totalInterest.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter details to calculate future value." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-8 non-printable", children: [
        " ",
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: fvFAQs })
      ] })
    ] })
  ] });
}
export {
  FutureValueCalculator as default
};
