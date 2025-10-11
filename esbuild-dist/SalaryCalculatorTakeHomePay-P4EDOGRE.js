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

// src/pages/SalaryCalculatorTakeHomePay.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function SalaryCalculatorTakeHomePay() {
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
      question: "How do I calculate UK take-home pay for 2025/26?",
      answer: "Enter your gross salary, select pay frequency, and add pension and student loan options. The calculator applies 2025/26 HMRC thresholds to estimate tax, NI and your net pay."
    },
    {
      question: "Does this include Scottish or rUK tax bands?",
      answer: "Yes. Where applicable, the tool uses the correct UK or Scottish income tax bands for the 2025/26 tax year."
    },
    {
      question: "Can I export or print the results?",
      answer: "You can save or print your results for your records or to share with HR and recruiters."
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "UK Take-Home Pay Calculator (2025/26)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto mt-3", children: "Estimate UK take-home pay after tax, NI, pension and student loans for the 2025/26 tax year." }),
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
              to: createPageUrl("SalaryCalculatorPaycheck"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Paycheck"
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900", children: "Calculate Your Take-Home Pay" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "For the most accurate take-home estimate (including tax, NI, pension, and student loan options), use our main Salary Calculator hub below." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorUK"),
              className: "inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700",
              children: "Open Salary Calculator Hub"
            }
          ) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-12", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs, title: "Take\u2011Home Pay FAQs" }),
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
            description: "Full take\u2011home breakdown with tax, NI, pension and student loan options."
          },
          {
            name: "Paycheck Calculator UK (After Tax & NI)",
            url: createPageUrl("SalaryCalculatorPaycheck"),
            description: "See weekly, fortnightly or monthly net pay after deductions."
          },
          {
            name: "Gross to Net Income Calculator (UK)",
            url: createPageUrl("GrossToNetCalculator"),
            description: "Convert a gross annual figure to monthly net pay after deductions."
          }
        ]
      }
    )
  ] });
}
export {
  SalaryCalculatorTakeHomePay as default
};
