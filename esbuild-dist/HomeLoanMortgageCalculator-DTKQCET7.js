import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
import "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/HomeLoanMortgageCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function HomeLoanMortgageCalculator() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Mortgage Calculators Hub",
        item: `${origin}/MortgageCalculatorUK`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Home Loan Mortgage Calculator",
        item: `${origin}/HomeLoanMortgageCalculator`
      }
    ]
  };
  const faqs = [
    {
      question: "How is the payment calculated?",
      answer: "Based on the loan amount, term and interest rate entered."
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(faqJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-gray-50 border-b border-gray-200 text-center py-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "Home Loan Mortgage Calculator" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600 mt-2", children: "Quickly estimate payments for common mortgage scenarios." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("MortgageCalculatorUK"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Mortgage Hub"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("MortgageLoanRepayment"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Mortgage Repayment"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("MortgageComparison"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Mortgage Comparison"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-6 bg-gray-50 border rounded", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "Calculator coming soon. Meanwhile, use the main Mortgage Calculator for a detailed breakdown." }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          RelatedCalculators,
          {
            calculators: [
              {
                name: "Back to Mortgage Hub",
                url: createPageUrl("MortgageCalculatorUK"),
                description: "Explore all mortgage tools."
              },
              {
                name: "Mortgage Loan Repayment",
                url: createPageUrl("MortgageLoanRepayment"),
                description: "See monthly payments."
              },
              {
                name: "Mortgage Comparison",
                url: createPageUrl("MortgageComparison"),
                description: "Compare deals."
              }
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  HomeLoanMortgageCalculator as default
};
