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

// src/pages/MortgageCalculatorUK.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function MortgageCalculatorUK() {
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
      }
    ]
  };
  const faqs = [
    {
      question: "What inputs do the mortgage tools use?",
      answer: "Rate, term, deposit, and loan amount; some include fees and overpayments."
    },
    {
      question: "Where do rates come from?",
      answer: "We recommend cross-checking offers; refer to the Bank of England base rate for context."
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
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "UK Mortgage Calculators Hub" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto mt-3", children: "Explore UK mortgage tools: repayment, comparison, and home loan calculators." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("MortgageLoanRepayment"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Mortgage Loan Repayment"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("HomeLoanMortgageCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Home Loan Mortgage"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("MortgageComparison"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Mortgage Comparison"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("PersonalLoanCalculator"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50",
              children: "Personal Loan Calculator"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          "a",
          {
            href: "#",
            className: "inline-block px-5 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700",
            children: "Check partner mortgage rates (coming soon)"
          }
        ) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-6", children: [
        {
          name: "Mortgage Loan Repayment",
          url: createPageUrl("MortgageLoanRepayment"),
          desc: "Estimate monthly repayments across a range of interest rates."
        },
        {
          name: "Home Loan Mortgage Calculator",
          url: createPageUrl("HomeLoanMortgageCalculator"),
          desc: "Quick home loan estimates with deposit and term options."
        },
        {
          name: "Mortgage Comparison",
          url: createPageUrl("MortgageComparison"),
          desc: "Compare two mortgage offers side-by-side."
        },
        {
          name: "Personal Loan Calculator",
          url: createPageUrl("PersonalLoanCalculator"),
          desc: "Estimate payments for unsecured personal loans."
        }
      ].map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: c.url, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "hover:shadow-md transition", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-lg text-gray-900", children: c.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600 mt-2", children: c.desc })
      ] }) }) }, i)) })
    ] })
  ] });
}
export {
  MortgageCalculatorUK as default
};
