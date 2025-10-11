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

// src/pages/OvertimePayCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var overtimeFAQs = [
  {
    question: "Is my employer required to pay me for overtime?",
    answer: "In the UK, there is no automatic legal right to be paid for working extra hours. Your contract of employment should state whether you will be paid for overtime and at what rate. However, your average pay for the total hours you work must not fall below the National Minimum Wage."
  },
  {
    question: "What are typical overtime rates?",
    answer: "Common overtime rates are 'time-and-a-half' (1.5x your normal rate) and 'double time' (2x your normal rate). The specific rate depends on your employment contract and when the overtime is worked (e.g., weekends or bank holidays often have higher rates)."
  },
  {
    question: "Does this calculator include tax?",
    answer: "No, this calculator shows your gross pay (before tax and other deductions). Overtime pay is taxed in the same way as your regular wages. You can use our main Salary Calculator to see the impact on your take-home pay."
  }
];
function OvertimePayCalculator() {
  const [hourlyRate, setHourlyRate] = (0, import_react.useState)("15");
  const [standardHours, setStandardHours] = (0, import_react.useState)("40");
  const [overtimeHours, setOvertimeHours] = (0, import_react.useState)("10");
  const [overtimeMultiplier, setOvertimeMultiplier] = (0, import_react.useState)("1.5");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const rate = Number(hourlyRate) || 0;
    const stdHours = Number(standardHours) || 0;
    const otHours = Number(overtimeHours) || 0;
    const otMulti = Number(overtimeMultiplier) || 1;
    if (rate <= 0 || stdHours < 0 || otHours < 0) {
      setResults(null);
      return;
    }
    const standardPay = rate * stdHours;
    const overtimeRate = rate * otMulti;
    const overtimePay = overtimeRate * otHours;
    const totalPay = standardPay + overtimePay;
    setResults({ standardPay, overtimePay, totalPay, overtimeRate });
  }, [hourlyRate, standardHours, overtimeHours, overtimeMultiplier]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Overtime Pay Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Calculate your total gross pay including standard hours and overtime earnings." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Work Week" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "hourlyRate", children: "Standard Hourly Rate (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "hourlyRate",
                  type: "number",
                  value: hourlyRate,
                  onChange: (e) => setHourlyRate(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "standardHours", children: "Standard Hours per Week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "standardHours",
                  type: "number",
                  value: standardHours,
                  onChange: (e) => setStandardHours(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "overtimeHours", children: "Overtime Hours per Week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "overtimeHours",
                  type: "number",
                  value: overtimeHours,
                  onChange: (e) => setOvertimeHours(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "overtimeMultiplier", children: "Overtime Rate Multiplier (e.g., 1.5 for time-and-a-half)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "overtimeMultiplier",
                  type: "number",
                  value: overtimeMultiplier,
                  onChange: (e) => setOvertimeMultiplier(e.target.value)
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900", children: "Total Gross Pay" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-green-900", children: [
                "\xA3",
                results.totalPay.toLocaleString("en-GB", { maximumFractionDigits: 2 })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-700 mt-1", children: "for the week" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Pay Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "Standard Pay (",
                  standardHours,
                  " hrs):"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  results.standardPay.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "Overtime Pay (",
                  overtimeHours,
                  " hrs at \xA3",
                  results.overtimeRate,
                  "/hr):"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-blue-700", children: [
                  "\xA3",
                  results.overtimePay.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter details to calculate your pay." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: overtimeFAQs }) })
    ] })
  ] });
}
export {
  OvertimePayCalculator as default
};
