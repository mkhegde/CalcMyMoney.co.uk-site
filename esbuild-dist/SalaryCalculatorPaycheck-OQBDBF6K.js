import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-JJ75DWPY.js";
import "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SalaryCalculatorPaycheck.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function SalaryCalculatorPaycheck() {
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salary & Income",
        item: `${origin}${createPageUrl("SalaryCalculatorUK")}`
      }
    ]
  };
  const faqs = [
    {
      question: "Can I see weekly, fortnightly or monthly net pay?",
      answer: "Yes. Choose your pay frequency to calculate the paycheck amount after tax, NI, pension and student loans."
    },
    {
      question: "Does this handle overtime or bonuses?",
      answer: "You can add extra gross pay (like overtime or a bonus) and the calculator will estimate the deductions for that period."
    },
    {
      question: "How accurate are paycheck estimates?",
      answer: "Figures are estimates based on HMRC 2025/26 rules. Actual payroll can vary with tax codes, benefits, and employer-specific settings."
    }
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
  const LAST_UPDATED_ISO = "2025-04-06";
  const LAST_UPDATED_DISPLAY = "6 April 2025";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(faqJson) }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "Paycheck Calculator UK" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto mt-3", children: "Work out your UK paycheck after tax and NI. Supports weekly, fortnightly and monthly pay." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorUK"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Salary Hub"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorTakeHomePay"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Take\u2011Home Pay"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("GrossToNetCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Gross\u2011to\u2011Net"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900", children: "Check Your Net Paycheck" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "Use the hub calculator for precise paycheck breakdowns per pay period, with pension and student loan options." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-12", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs, title: "Paycheck FAQs" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-gray-500 mt-6", children: [
            "Last updated: ",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { dateTime: LAST_UPDATED_ISO, children: LAST_UPDATED_DISPLAY })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RelatedCalculators,
      {
        calculators: [
          {
            name: "UK Salary Calculator (Take-Home Pay 2025/26)",
            url: createPageUrl("SalaryCalculatorUK"),
            description: "Comprehensive salary breakdown for 2025/26."
          },
          {
            name: "Take-Home Pay Calculator UK (2025/26)",
            url: createPageUrl("SalaryCalculatorTakeHomePay"),
            description: "Estimate your take\u2011home pay using HMRC thresholds."
          },
          {
            name: "Gross to Net Income Calculator (UK)",
            url: createPageUrl("GrossToNetCalculator"),
            description: "Convert gross to net figures accurately."
          }
        ]
      }
    )
  ] });
}
export {
  SalaryCalculatorPaycheck as default
};
