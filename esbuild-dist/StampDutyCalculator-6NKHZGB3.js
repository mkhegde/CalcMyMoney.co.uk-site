import {
  RadioGroup,
  RadioGroupItem
} from "./chunk-DQYKLSGU.js";
import "./chunk-QRWSZGZM.js";
import "./chunk-6QDB6RBQ.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
import "./chunk-UYVYEFZE.js";
import "./chunk-66ZJ7JT3.js";
import "./chunk-RDJYUOP4.js";
import {
  ExportActions
} from "./chunk-F7OALEHA.js";
import {
  Label
} from "./chunk-AXLI4SNI.js";
import {
  Input
} from "./chunk-KK4JIGNC.js";
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
  Calculator,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/StampDutyCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var sdltFAQs = [
  {
    question: "What is Stamp Duty Land Tax (SDLT)?",
    answer: "SDLT is a tax you might have to pay if you buy a residential property or piece of land in England or Northern Ireland over a certain price. The rules are different for Scotland (Land and Buildings Transaction Tax) and Wales (Land Transaction Tax)."
  },
  {
    question: "Do first-time buyers pay Stamp Duty?",
    answer: "First-time buyers receive relief. In England and NI, they pay no Stamp Duty on properties up to \xA3425,000, and a 5% rate on the portion from \xA3425,001 to \xA3625,000. If the property price is over \xA3625,000, they cannot claim the relief and pay the standard rates."
  },
  {
    question: "What is the additional rate for second homes?",
    answer: "If you are buying an additional residential property (e.g., a buy-to-let or a second home), you will usually have to pay a 3% surcharge on top of the standard SDLT rates."
  },
  {
    question: "When is SDLT due and how do I pay it?",
    answer: "SDLT must be filed and paid within 14 days of the effective date of the transaction (usually completion). Your solicitor or conveyancer typically submits the SDLT return and pays HMRC on your behalf as part of the completion process."
  },
  {
    question: "Does SDLT work differently for leasehold vs. freehold?",
    answer: "Yes. For leasehold purchases, SDLT can be due on both the purchase price (premium) and, in some cases, the net present value of the rent (ground rent). Freehold purchases are usually assessed solely on the purchase price. Always check your solicitor\u2019s advice for your specific contract terms."
  }
];
var standardRates = [
  { threshold: 25e4, rate: 0 },
  { threshold: 925e3, rate: 0.05 },
  { threshold: 15e5, rate: 0.1 },
  { threshold: Infinity, rate: 0.12 }
];
var ftbRates = [
  { threshold: 425e3, rate: 0 },
  { threshold: 625e3, rate: 0.05 },
  { threshold: Infinity, rate: -1 }
  // Indicates standard rates apply
];
var additionalRateSurcharge = 0.03;
function StampDutyCalculator() {
  const [propertyPrice, setPropertyPrice] = (0, import_react.useState)("");
  const [buyerType, setBuyerType] = (0, import_react.useState)("nextHome");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const calculateSDLT = () => {
    const price = Number(propertyPrice) || 0;
    if (price <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    let totalTax = 0;
    let taxBreakdown = [];
    let previousThreshold = 0;
    let ratesToUse = standardRates;
    if (buyerType === "firstTimeBuyer") {
      if (price <= 625e3) {
        ratesToUse = ftbRates;
      }
    }
    for (const band of ratesToUse) {
      if (band.rate === -1) {
        ratesToUse = standardRates;
        totalTax = 0;
        taxBreakdown = [];
        previousThreshold = 0;
        for (const stdBand of standardRates) {
          if (price > stdBand.threshold) {
            const taxInBand = (stdBand.threshold - previousThreshold) * stdBand.rate;
            if (taxInBand > 0) {
              taxBreakdown.push({
                band: `\xA3${previousThreshold.toLocaleString()} - \xA3${stdBand.threshold.toLocaleString()}`,
                rate: stdBand.rate * 100,
                tax: taxInBand
              });
              totalTax += taxInBand;
            }
          } else {
            const taxInBand = (price - previousThreshold) * stdBand.rate;
            if (taxInBand > 0) {
              taxBreakdown.push({
                band: `\xA3${previousThreshold.toLocaleString()} - \xA3${price.toLocaleString()}`,
                rate: stdBand.rate * 100,
                tax: taxInBand
              });
              totalTax += taxInBand;
            }
            break;
          }
          previousThreshold = stdBand.threshold;
        }
        break;
      }
      if (price > previousThreshold) {
        const taxableAmountInBand = Math.min(price, band.threshold) - previousThreshold;
        const taxInBand = taxableAmountInBand * band.rate;
        if (taxInBand > 0) {
          taxBreakdown.push({
            band: `\xA3${previousThreshold.toLocaleString()} to \xA3${Math.min(price, band.threshold).toLocaleString()}`,
            rate: band.rate * 100,
            tax: taxInBand
          });
          totalTax += taxInBand;
        }
      }
      previousThreshold = band.threshold;
    }
    if (buyerType === "additionalHome") {
      const surcharge = price * additionalRateSurcharge;
      totalTax += surcharge;
      taxBreakdown.push({ band: "Additional Property Surcharge", rate: 3, tax: surcharge });
    }
    const newResults = { totalTax, taxBreakdown, effectiveRate: totalTax / price * 100 };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Total Stamp Duty", `\xA3${newResults.totalTax.toFixed(2)}`],
      ["Effective Tax Rate", `${newResults.effectiveRate.toFixed(2)}%`],
      ...newResults.taxBreakdown.map((b) => [
        `Tax on ${b.band} @ ${b.rate}%`,
        `\xA3${b.tax.toFixed(2)}`
      ])
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [propertyPrice, buyerType]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Stamp Duty Calculator (England & NI)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate the Stamp Duty Land Tax (SDLT) for your property purchase." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Stamp Duty Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Purchase Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "propertyPrice", children: "Property Price" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "propertyPrice",
                    type: "number",
                    value: propertyPrice,
                    onChange: (e) => setPropertyPrice(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 350000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Buyer Status" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioGroup, { value: buyerType, onValueChange: setBuyerType, className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "firstTimeBuyer", id: "ftb" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "ftb", className: "w-full", children: "First-Time Buyer" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "nextHome", id: "nh" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "nh", className: "w-full", children: "Moving to a Next Home" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "additionalHome", id: "ah" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "ah", className: "w-full", children: "Additional Home (e.g. Buy-to-Let)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: calculateSDLT, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Stamp Duty"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "border-yellow-300 bg-yellow-50 text-yellow-800 text-sm p-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This calculator is for properties in England and Northern Ireland only. Scotland and Wales have different tax systems." }) })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Stamp Duty Result" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportActions, { csvData, fileName: "stamp-duty", title: "Stamp Duty" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-red-50 border-red-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-red-800 mb-2", children: "Total Stamp Duty Payable" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-red-900", children: [
              "\xA3",
              results.totalTax.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-red-700", children: [
              "Effective tax rate: ",
              results.effectiveRate.toFixed(2),
              "%"
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tax Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-2", children: results.taxBreakdown.map((band, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-gray-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                "Tax on ",
                band.band,
                " at ",
                band.rate,
                "%"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                "\xA3",
                band.tax.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] })
            ] }, index)) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate SDLT?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter property price and buyer type to see the tax." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { className: "mt-12 bg-white border border-gray-200 rounded-lg p-6 space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900", children: "How this Stamp Duty calculator works" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "This tool applies the current residential SDLT bands for England and Northern Ireland to your purchase price. If you select First-Time Buyer, the calculator applies relief up to the published threshold and then switches to standard rates where relief no longer applies. For Additional Homes, it adds the 3% surcharge to the relevant portions of the price. Your effective tax rate is the total SDLT divided by the purchase price." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900", children: "Important notes and exclusions" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc pl-6 text-gray-700 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Scotland and Wales use different taxes (LBTT and LTT). Rates and thresholds differ from England/NI." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Special rules may apply for shared ownership, leasehold ground rent, and mixed\u2011use or non\u2011residential property." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "This is guidance only and not financial or legal advice. Always confirm figures with your solicitor or HMRC." })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900", children: "Worked example" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700", children: "For a \xA3350,000 next\u2011home purchase, tax is calculated band\u2011by\u2011band. The portion within the 0% band is untaxed; the portion in the 5% band is charged at 5%, and so on. Our breakdown shows each band, rate and the tax due, helping you understand exactly how your total SDLT is derived." })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: sdltFAQs }) }) })
    ] })
  ] });
}
export {
  StampDutyCalculator as default
};
