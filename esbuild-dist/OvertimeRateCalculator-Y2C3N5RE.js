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
  CardFooter,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  Calculator,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/OvertimeRateCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var overtimeRateFAQs = [
  {
    question: "What are common overtime multipliers?",
    answer: "The most common multipliers are 1.5 ('time-and-a-half') for standard overtime and 2.0 ('double time') for work on weekends or bank holidays. The exact rate is determined by your employment contract."
  },
  {
    question: "Is this my total overtime pay?",
    answer: "No, this calculator determines your hourly RATE for overtime work. To calculate your total pay for a period including overtime hours, please use our 'Overtime Pay Calculator'."
  },
  {
    question: "Is my employer required to offer a higher rate for overtime?",
    answer: "Not necessarily. In the UK, there's no legal obligation to pay workers for overtime. However, your average pay for the total hours you work must not fall below the National Minimum Wage. Your contract will specify your overtime pay details."
  }
];
function OvertimeRateCalculator() {
  const [hourlyRate, setHourlyRate] = (0, import_react.useState)("");
  const [multiplier, setMultiplier] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const rate = Number(hourlyRate) || 0;
    const multi = Number(multiplier) || 0;
    if (rate <= 0 || multi <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const overtimeRate = rate * multi;
    setResults({ overtimeRate });
    setHasCalculated(true);
  }, [hourlyRate, multiplier]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Overtime Rate Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Determine your specific hourly pay rate for working overtime hours." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Pay Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "hourlyRate", children: "Standard Hourly Rate (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "hourlyRate",
                  type: "number",
                  value: hourlyRate,
                  onChange: (e) => setHourlyRate(e.target.value),
                  placeholder: "e.g. 15"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "multiplier", children: "Overtime Multiplier (e.g., 1.5)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "multiplier",
                  type: "number",
                  value: multiplier,
                  onChange: (e) => setMultiplier(e.target.value),
                  placeholder: "e.g. 1.5"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Rate"
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Your Overtime Hourly Rate" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-6xl font-bold text-blue-900", children: [
              "\xA3",
              results.overtimeRate.toLocaleString("en-GB", { minimumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-700 mt-1", children: "per hour" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "w-10 h-10 mx-auto mb-2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter details to see your overtime rate." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: overtimeRateFAQs }) })
    ] })
  ] });
}
export {
  OvertimeRateCalculator as default
};
