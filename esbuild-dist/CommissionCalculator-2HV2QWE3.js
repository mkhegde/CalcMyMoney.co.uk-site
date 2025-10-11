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

// src/pages/CommissionCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var commissionFAQs = [
  {
    question: "What is a commission?",
    answer: "A commission is a form of variable-pay remuneration for services rendered or products sold. Commissions are a common way to reward sales staff and are typically a percentage of the revenue generated."
  },
  {
    question: "Is commission income taxable?",
    answer: "Yes, commission earnings are considered part of your total income and are subject to Income Tax and National Insurance contributions, just like a regular salary."
  },
  {
    question: "What are common commission structures?",
    answer: "Commission structures vary widely. They can be a straight percentage of sales, tiered (where the percentage increases as sales targets are met), or based on gross margin. This calculator uses a simple, straight percentage model."
  },
  {
    question: "A Note on Calculations",
    answer: "This tool calculates the gross commission amount before any deductions. To understand the impact on your net pay, you would need to add this commission amount to your salary and use the main UK Salary Calculator."
  }
];
function CommissionCalculator() {
  const [revenue, setRevenue] = (0, import_react.useState)("10000");
  const [commissionRate, setCommissionRate] = (0, import_react.useState)("10");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const rev = Number(revenue) || 0;
    const rate = Number(commissionRate) / 100;
    if (rev <= 0 || rate < 0) {
      setResults(null);
      return;
    }
    const commissionEarned = rev * rate;
    setResults({ commissionEarned });
  }, [revenue, commissionRate]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Commission Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Quickly calculate your commission earnings based on sales revenue and commission rate." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Your Figures" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "revenue", children: "Total Revenue / Sales Amount (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "revenue",
                    type: "number",
                    value: revenue,
                    onChange: (e) => setRevenue(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "commissionRate", children: "Commission Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    value: [parseFloat(commissionRate)],
                    onValueChange: ([val]) => setCommissionRate(val.toString()),
                    max: 100,
                    step: 0.5,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: commissionRate,
                    onChange: (e) => setCommissionRate(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900", children: "Commission Earned" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              " ",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-green-900", children: [
                "\xA3",
                results.commissionEarned.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-700 mt-2", children: [
                " ",
                "This is your gross commission before any tax deductions."
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-gray-600 p-4 bg-gray-50 rounded-lg", children: [
            "A ",
            commissionRate,
            "% commission on sales of \xA3",
            Number(revenue).toLocaleString(),
            " ",
            "results in gross earnings of \xA3",
            results.commissionEarned.toLocaleString("en-GB", { maximumFractionDigits: 2 }),
            "."
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter details to calculate commission." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: commissionFAQs }) })
    ] })
  ] });
}
export {
  CommissionCalculator as default
};
