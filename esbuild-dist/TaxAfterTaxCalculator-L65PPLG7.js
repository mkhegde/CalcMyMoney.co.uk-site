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

// src/pages/TaxAfterTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function TaxAfterTaxCalculator() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tax Calculators Hub",
        item: `${origin}/TaxCalculatorsUK`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Tax After Tax Calculator",
        item: `${origin}/TaxAfterTaxCalculator`
      }
    ]
  };
  const faqs = [
    {
      question: "What tax year is used?",
      answer: "2025/26 by default; updated when HMRC changes are published."
    },
    {
      question: "Does it include Scottish bands?",
      answer: "Yes, where applicable the calculator supports Scottish tax bands."
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "Tax After Tax Calculator UK" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600 mt-2", children: "Work out your UK tax after tax for 2025/26." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("TaxCalculatorsUK"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Tax Hub"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("TaxAndNICalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Tax + NI Calculator"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("NetIncomeUKCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Net Income Calculator"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-6 bg-gray-50 border rounded", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "Calculator coming soon. In the meantime, visit our Income Tax Calculator for a detailed breakdown." }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          RelatedCalculators,
          {
            calculators: [
              {
                name: "Back to Tax Calculators Hub",
                url: createPageUrl("TaxCalculatorsUK"),
                description: "Explore all UK tax tools."
              },
              {
                name: "Tax + NI Calculator (combined)",
                url: createPageUrl("TaxAndNICalculator"),
                description: "See combined deductions."
              },
              {
                name: "Net Income (after tax & NI)",
                url: createPageUrl("NetIncomeUKCalculator"),
                description: "Estimate take-home pay."
              }
            ]
          }
        ) })
      ] })
    ] })
  ] });
}
export {
  TaxAfterTaxCalculator as default
};
