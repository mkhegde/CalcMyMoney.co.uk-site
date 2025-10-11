import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-XTM5LKOR.js";
import "./chunk-F7QU7XIU.js";
import "./chunk-G2D7ODQY.js";
import "./chunk-UYVYEFZE.js";
import "./chunk-66ZJ7JT3.js";
import "./chunk-RDJYUOP4.js";
import {
  Button
} from "./chunk-RTS3GJRL.js";
import "./chunk-VKAPTTXR.js";
import "./chunk-DOIEHZ4R.js";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  House
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/CouncilTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var councilTaxFAQs = [
  {
    question: "What is Council Tax?",
    answer: "Council Tax is a locally-set tax in Great Britain charged on domestic properties. The amount is based on the property's valuation band and the local council's budget needs."
  },
  {
    question: "How are Council Tax bands determined?",
    answer: "Properties are assigned to a valuation band (A-H in England) based on their value on a specific date (1 April 1991 for England). This calculator uses a simplified model based on average Band D tax."
  },
  {
    question: "Can I get a discount?",
    answer: "Yes, various discounts and exemptions are available, such as the 25% single person discount, student exemptions, and Council Tax Reduction for those on low incomes. This calculator does not account for these discounts."
  },
  {
    question: "A Note on Accuracy",
    answer: "This is an ESTIMATION tool. Actual Council Tax varies significantly between local authorities. The figures are based on the average Band D tax for England and standard multipliers. Always check your local council's website for precise figures."
  }
];
var BAND_MULTIPLIERS = {
  A: 6 / 9,
  B: 7 / 9,
  C: 8 / 9,
  D: 1,
  E: 11 / 9,
  F: 13 / 9,
  G: 15 / 9,
  H: 18 / 9
};
var AVERAGE_BAND_D_ENGLAND = 2171;
function CouncilTaxCalculator() {
  const [band, setBand] = (0, import_react.useState)("D");
  const [tax, setTax] = (0, import_react.useState)(0);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const multiplier = BAND_MULTIPLIERS[band];
    const estimatedTax = AVERAGE_BAND_D_ENGLAND * multiplier;
    setTax(estimatedTax);
    setHasCalculated(true);
  }, [band]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Council Tax Estimator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-center text-gray-600 mt-2", children: "Get an estimate for your annual council tax bill based on your property band in England." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Property Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { className: "block mb-2", children: "Council Tax Band" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: band, onValueChange: setBand, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: Object.keys(BAND_MULTIPLIERS).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, { value: b, children: [
                  "Band ",
                  b
                ] }, b)) })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: handleCalculate, className: "w-full", children: "Estimate Tax" })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Estimated Annual Council Tax" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-blue-900", children: [
              "\xA3",
              tax.toLocaleString("en-GB", { maximumFractionDigits: 0 })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm mt-2", children: [
              "Monthly payment: ~\xA3",
              (tax / 12).toLocaleString("en-GB", { maximumFractionDigits: 0 })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-10 h-10 mx-auto mb-2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Select your band to see an estimate." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: councilTaxFAQs }) })
    ] })
  ] });
}
export {
  CouncilTaxCalculator as default
};
