import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-XTM5LKOR.js";
import "./chunk-F7QU7XIU.js";
import "./chunk-G2D7ODQY.js";
import "./chunk-UYVYEFZE.js";
import "./chunk-66ZJ7JT3.js";
import "./chunk-RDJYUOP4.js";
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
  BookOpen,
  Calculator
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/StudentLoanRepaymentCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var plans = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31395, rate: 0.09 },
  plan5: { threshold: 25e3, rate: 0.09 },
  postgraduate: { threshold: 21e3, rate: 0.06 }
};
function StudentLoanRepaymentCalculator() {
  const [salary, setSalary] = (0, import_react.useState)("");
  const [plan, setPlan] = (0, import_react.useState)("plan2");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const inc = Number(salary) || 0;
    const currentPlan = plans[plan];
    if (inc <= currentPlan.threshold) {
      setResults({ monthly: 0, annual: 0 });
      setHasCalculated(true);
      return;
    }
    const repayableIncome = inc - currentPlan.threshold;
    const annualRepayment = repayableIncome * currentPlan.rate;
    setResults({ monthly: annualRepayment / 12, annual: annualRepayment });
    setHasCalculated(true);
  }, [salary, plan]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Student Loan Repayment Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Salary (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: salary,
                onChange: (e) => setSalary(e.target.value),
                placeholder: "e.g. 45000"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Loan Plan" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: plan, onValueChange: setPlan, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan1", children: "Plan 1" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan2", children: "Plan 2" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan4", children: "Plan 4 (Scottish)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan5", children: "Plan 5" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "postgraduate", children: "Postgraduate Loan" })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Calculate Repayment"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-red-50 border-red-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estimated Repayment" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Monthly Repayment" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-red-700", children: [
            "\xA3",
            results.monthly.toFixed(2)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pt-4", children: "Annual Repayment" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
            "\xA3",
            results.annual.toFixed(2)
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Find out what you'll repay each month." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  StudentLoanRepaymentCalculator as default
};
