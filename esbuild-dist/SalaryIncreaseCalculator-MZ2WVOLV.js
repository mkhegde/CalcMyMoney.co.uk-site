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
  ArrowRight,
  PoundSterling,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SalaryIncreaseCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var salaryIncreaseFAQs = [
  {
    question: "What is a typical pay rise percentage in the UK?",
    answer: "Pay rises vary significantly by industry, company performance, and individual performance. As of early 2024, many UK employers were budgeting for pay rises in the range of 4-5%. However, this is just an average and not a guarantee."
  },
  {
    question: "How does inflation affect my pay rise?",
    answer: "If your pay rise percentage is higher than the rate of inflation, your 'real' buying power increases. If it's lower than inflation, your buying power has effectively decreased, even though you are earning more money. It's always useful to compare your raise to the current Consumer Price Index (CPI)."
  },
  {
    question: "How can I negotiate a better pay rise?",
    answer: "To negotiate effectively, research industry salary benchmarks for your role and experience. Document your achievements and the value you've brought to the company. Practice your pitch and be prepared to discuss your performance and future contributions."
  },
  {
    question: "A Note on Calculations",
    answer: "This calculator provides a straightforward mathematical calculation. It does not account for tax, National Insurance, pension contributions, or other deductions. To see the impact on your take-home pay, you would need to use the new salary figure in our main Salary Calculator."
  }
];
function SalaryIncreaseCalculator() {
  const [currentSalary, setCurrentSalary] = (0, import_react.useState)("50000");
  const [increasePercentage, setIncreasePercentage] = (0, import_react.useState)("5");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const salary = Number(currentSalary) || 0;
    const percentage = Number(increasePercentage) || 0;
    if (salary <= 0) {
      setResults(null);
      return;
    }
    const increaseAmount = salary * (percentage / 100);
    const newSalary = salary + increaseAmount;
    setResults({
      newSalary,
      annualIncrease: increaseAmount,
      monthlyIncrease: increaseAmount / 12
    });
  }, [currentSalary, increasePercentage]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Salary Increase Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "See how a pay rise will affect your annual and monthly income before tax." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Your Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "currentSalary", children: "Current Annual Salary (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "currentSalary",
                    type: "number",
                    value: currentSalary,
                    onChange: (e) => setCurrentSalary(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "increasePercentage", children: "Increase Percentage (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    id: "increasePercentage",
                    value: [parseFloat(increasePercentage)],
                    onValueChange: ([val]) => setIncreasePercentage(val.toString()),
                    max: 50,
                    step: 0.5,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: increasePercentage,
                    onChange: (e) => setIncreasePercentage(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3", children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your New Salary" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row items-center justify-center text-center gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 rounded-lg bg-gray-100", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Current Salary" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold", children: [
                  "\xA3",
                  Number(currentSalary).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "text-gray-400 hidden sm:block" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-6 rounded-lg bg-green-100", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-800", children: "New Salary" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-green-900", children: [
                  "\xA3",
                  results.newSalary.toLocaleString("en-GB", { maximumFractionDigits: 0 })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-sm font-medium", children: "Annual Increase" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-gray-500" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-2xl font-bold text-green-600", children: [
                  "+\xA3",
                  results.annualIncrease.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "before tax" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-sm font-medium", children: "Monthly Increase" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-gray-500" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-2xl font-bold text-green-600", children: [
                  "+\xA3",
                  results.monthlyIncrease.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "before tax" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-64", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter your details to see the results." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: salaryIncreaseFAQs }) })
    ] })
  ] });
}
export {
  SalaryIncreaseCalculator as default
};
