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

// src/pages/GrossToNetCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function GrossToNetCalculator() {
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
      question: "What does gross to net mean?",
      answer: "Gross pay is before deductions. Net pay is what you take home after income tax, National Insurance, pension and student loan repayments where applicable."
    },
    {
      question: "Can I convert an annual salary to monthly net pay?",
      answer: "Yes. Enter your gross annual salary and select monthly as the output. The tool will show tax, NI and net pay per month."
    },
    {
      question: "Does this account for pension and student loans?",
      answer: "You can toggle pension contributions and choose a student loan plan to see their effect on your net pay."
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "Gross to Net Income Calculator (UK)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto mt-3", children: "Convert gross salary to net take\u2011home pay with UK tax and NI for 2025/26." }),
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
              to: createPageUrl("SalaryCalculatorPaycheck"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Paycheck"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", className: "text-gray-900", children: "Convert Gross to Net" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "Use the hub calculator to enter your gross pay and see an instant net figure after tax and NI." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs, title: "Gross\u2011to\u2011Net FAQs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-gray-500 mt-6", children: [
          "Last updated: ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { dateTime: LAST_UPDATED_ISO, children: LAST_UPDATED_DISPLAY })
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
            description: "Full breakdown of your net pay for 2025/26."
          },
          {
            name: "Take-Home Pay Calculator UK (2025/26)",
            url: createPageUrl("SalaryCalculatorTakeHomePay"),
            description: "HMRC\u2011based take\u2011home pay estimates."
          },
          {
            name: "Paycheck Calculator UK (After Tax & NI)",
            url: createPageUrl("SalaryCalculatorPaycheck"),
            description: "Net pay by pay period with deductions."
          }
        ]
      }
    )
  ] });
}
export {
  GrossToNetCalculator as default
};
