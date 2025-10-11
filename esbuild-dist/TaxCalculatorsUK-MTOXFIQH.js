import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
import {
  Card,
  CardContent
} from "./chunk-JJ75DWPY.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/TaxCalculatorsUK.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function TaxCalculatorsUK() {
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
      }
    ]
  };
  const faqs = [
    {
      question: "Which tax year do these tools use?",
      answer: "All tax calculators default to 2025/26 and are updated when HMRC publishes new thresholds."
    },
    {
      question: "Do you support Scottish and rUK bands?",
      answer: "Yes, where relevant we apply the appropriate Scottish or rUK bands."
    },
    {
      question: "Can I export or print results?",
      answer: "Yes, calculators include print or CSV export where applicable."
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "UK Tax Calculators Hub" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto mt-3", children: "Explore UK tax tools for 2025/26: income tax after tax, tax + NI and net income calculators." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("TaxAfterTaxCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Tax After Tax"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("TaxAndNICalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Tax + NI"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("NetIncomeUKCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Net Income"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("SelfAssessmentGuide"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Self Assessment Guide"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6", children: [
        {
          name: "Tax After Tax Calculator",
          url: createPageUrl("TaxAfterTaxCalculator"),
          desc: "Calculate your tax after tax for 2025/26 with clear band breakdowns."
        },
        {
          name: "Tax + NI Calculator",
          url: createPageUrl("TaxAndNICalculator"),
          desc: "See combined Income Tax and National Insurance contributions."
        },
        {
          name: "Net Income Calculator",
          url: createPageUrl("NetIncomeUKCalculator"),
          desc: "Estimate your net take-home pay after Tax and NI."
        },
        {
          name: "Self Assessment Guide",
          url: createPageUrl("SelfAssessmentGuide"),
          desc: "Understand deadlines, rates, allowances and tips."
        }
      ].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: c.url, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "hover:shadow-md transition", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-lg text-gray-900", children: c.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600 mt-2", children: c.desc })
      ] }) }) }, i)) })
    ] })
  ] });
}
export {
  TaxCalculatorsUK as default
};
