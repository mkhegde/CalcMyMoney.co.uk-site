import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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

// src/pages/EffectiveTaxRateCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var effectiveTaxRateFAQs = [
  {
    question: "What is the difference between effective tax rate and marginal tax rate?",
    answer: "Your 'marginal tax rate' is the rate you pay on your *last* pound of earnings (e.g., 20%, 40%, 45%). Your 'effective tax rate' is the *average* rate you pay across all your earnings after accounting for your tax-free personal allowance. It's a truer reflection of your overall tax burden."
  },
  {
    question: "Why isn't my effective rate simply 20% or 40%?",
    answer: "The UK has a progressive tax system. You only pay the higher rates on the portion of your income that falls into those specific brackets. Your first \xA312,570 (for most people) is tax-free, which significantly lowers your overall average tax rate."
  },
  {
    question: "Does this calculator include National Insurance?",
    answer: "Yes, this calculator includes both Income Tax and National Insurance (Class 1 for employees) to give you a comprehensive view of your total deductions and your true effective tax rate."
  },
  {
    question: "A Note on Trustworthiness",
    answer: "The calculations are based on the 2024/2025 tax and National Insurance rates for England, Wales, and Northern Ireland. Scottish tax rates are different. This tool does not account for other deductions like student loans or pension contributions. For official guidance, refer to GOV.UK or consult a tax professional."
  }
];
var calculateIncomeTax = (income) => {
  let tax = 0;
  let personalAllowance = 12570;
  if (income > 1e5) {
    personalAllowance = Math.max(0, 12570 - (income - 1e5) / 2);
  }
  const taxableIncome = Math.max(0, income - personalAllowance);
  if (taxableIncome > 0) {
    if (taxableIncome <= 37700) {
      tax += taxableIncome * 0.2;
    } else {
      tax += 37700 * 0.2;
      if (taxableIncome <= 125140) {
        tax += (taxableIncome - 37700) * 0.4;
      } else {
        tax += (125140 - 37700) * 0.4;
        tax += (taxableIncome - 125140) * 0.45;
      }
    }
  }
  return tax;
};
var calculateNI = (income) => {
  let ni = 0;
  if (income > 12570) {
    if (income <= 50270) {
      ni += (income - 12570) * 0.08;
    } else {
      ni += (50270 - 12570) * 0.08;
      ni += (income - 50270) * 0.02;
    }
  }
  return ni;
};
function EffectiveTaxRateCalculator() {
  const [grossIncome, setGrossIncome] = (0, import_react.useState)("50000");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const income = Number(grossIncome) || 0;
    if (income <= 0) {
      setResults(null);
      return;
    }
    const totalTax = calculateIncomeTax(income);
    const totalNI = calculateNI(income);
    const totalDeductions = totalTax + totalNI;
    const netIncome = income - totalDeductions;
    const effectiveRate = income > 0 ? totalDeductions / income * 100 : 0;
    setResults({
      grossIncome: income,
      totalTax,
      totalNI,
      totalDeductions,
      netIncome,
      effectiveRate
    });
  }, [grossIncome]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Effective Tax Rate Calculator UK" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Find out your true tax burden by calculating the average tax rate you pay on your total income." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Income" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossIncome", children: "Annual Gross Income (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "grossIncome",
                  type: "number",
                  value: grossIncome,
                  onChange: (e) => setGrossIncome(e.target.value),
                  className: "pl-10"
                }
              )
            ] })
          ] }) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Your Effective Tax Rate" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-blue-900", children: [
                results.effectiveRate.toFixed(2),
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-700 mt-1", children: "This is the average rate you pay across all your income." })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Income:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  results.grossIncome.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Income Tax:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "-\xA3",
                  results.totalTax.toLocaleString(void 0, { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "National Insurance:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "-\xA3",
                  results.totalNI.toLocaleString(void 0, { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-bold", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Deductions:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "-\xA3",
                  results.totalDeductions.toLocaleString(void 0, {
                    maximumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-bold text-lg text-green-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net Income (Take-Home):" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "\xA3",
                  results.netIncome.toLocaleString(void 0, { maximumFractionDigits: 2 })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter your income to calculate." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: effectiveTaxRateFAQs }) })
    ] })
  ] });
}
export {
  EffectiveTaxRateCalculator as default
};
