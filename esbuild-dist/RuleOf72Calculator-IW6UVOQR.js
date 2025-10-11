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
  Activity,
  Calculator
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/RuleOf72Calculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var ruleOf72FAQs = [
  {
    question: "What is the Rule of 72?",
    answer: "The Rule of 72 is a simple mental shortcut to estimate the number of years required to double your money at a given annual rate of return. You just divide 72 by the interest rate."
  },
  {
    question: "How accurate is it?",
    answer: "It's an approximation, but it's remarkably accurate for interest rates typically found in investment scenarios (e.g., 5% to 12%). It's most accurate at around 8%."
  },
  {
    question: "Why is it useful?",
    answer: "It provides a quick way to understand the power of compound interest without needing a complex calculator. It helps you grasp how a small difference in your return rate can significantly change how quickly your money grows."
  }
];
function RuleOf72Calculator() {
  const [rate, setRate] = (0, import_react.useState)("");
  const [years, setYears] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const r = Number(rate) || 0;
    if (r > 0) {
      setYears(72 / r);
    } else {
      setYears(0);
    }
    setHasCalculated(true);
  }, [rate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Rule of 72 Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Interest Rate" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Rate of Return (%)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: rate,
                onChange: (e) => setRate(e.target.value),
                placeholder: "e.g. 7"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate"
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && years !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-teal-50 border-teal-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Years to Double Your Money" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-6xl font-bold text-teal-700", children: years > 0 ? years.toFixed(1) : "..." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm mt-2", children: "years (approx.)" })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "w-10 h-10 mx-auto mb-2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "How long will it take to double?" })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: ruleOf72FAQs }) })
    ] })
  ] });
}
export {
  RuleOf72Calculator as default
};
