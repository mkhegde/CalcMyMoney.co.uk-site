import {
  Switch
} from "./chunk-O66MWXRB.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
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
import "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/InheritanceTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var iFAQs = [
  {
    question: "What is Inheritance Tax (IHT)?",
    answer: "IHT is a tax on the estate (the property, money, and possessions) of someone who has died. It's also sometimes payable on gifts made during a person's lifetime."
  },
  {
    question: "What is the Nil-Rate Band (NRB)?",
    answer: "Most estates can pass on up to \xA3325,000 without any IHT being due. This is the Nil-Rate Band."
  },
  {
    question: "What is the Residence Nil-Rate Band (RNRB)?",
    answer: "The RNRB is an additional threshold of up to \xA3175,000 if you give away your main residence to your children or other direct descendants."
  },
  {
    question: "A Note on Trustworthiness",
    answer: "This is a simplified calculator based on 2024/25 tax rules. IHT is extremely complex, involving gifts, trusts, and exemptions not covered here. This tool is for educational purposes only. Always consult a qualified legal or financial advisor for estate planning."
  }
];
function InheritanceTaxCalculator() {
  const [estateValue, setEstateValue] = (0, import_react.useState)("750000");
  const [passToDirectDescendant, setPassToDirectDescendant] = (0, import_react.useState)(true);
  const [results, setResults] = (0, import_react.useState)(null);
  const NRB = 325e3;
  const RNRB = 175e3;
  const IHT_RATE = 0.4;
  const handleCalculate = (0, import_react.useCallback)(() => {
    const value = Number(estateValue) || 0;
    let totalThreshold = NRB;
    if (passToDirectDescendant) {
      totalThreshold += RNRB;
    }
    const taxableAmount = Math.max(0, value - totalThreshold);
    const ihtPayable = taxableAmount * IHT_RATE;
    setResults({ ihtPayable, taxableAmount, totalThreshold });
  }, [estateValue, passToDirectDescendant]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Inheritance Tax Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estate Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Total Estate Value (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: estateValue,
                  onChange: (e) => setEstateValue(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Passing main home to direct descendants?" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Switch,
                {
                  checked: passToDirectDescendant,
                  onCheckedChange: setPassToDirectDescendant
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-red-50 border-red-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-red-900", children: "Estimated IHT Payable" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-red-900", children: [
              "\xA3",
              results.ihtPayable.toLocaleString("en-GB", { maximumFractionDigits: 0 })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-4 text-sm space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total tax-free threshold:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  "\xA3",
                  results.totalThreshold.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Taxable estate value:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  "\xA3",
                  results.taxableAmount.toLocaleString()
                ] })
              ] })
            ] })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: iFAQs }) })
    ] })
  ] });
}
export {
  InheritanceTaxCalculator as default
};
