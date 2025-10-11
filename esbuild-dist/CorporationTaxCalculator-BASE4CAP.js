import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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

// src/pages/CorporationTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var corpTaxFAQs = [
  {
    question: "What is Corporation Tax?",
    answer: "Corporation Tax is a tax that limited companies and some other organisations in the UK pay on their annual profits. If your company is based in the UK, it pays Corporation Tax on all its profits from the UK and abroad."
  },
  {
    question: "What are the current Corporation Tax rates?",
    answer: "From 1 April 2023, the main rate of Corporation Tax is 25% for companies with profits over \xA3250,000. A Small Profits Rate of 19% applies to companies with profits of \xA350,000 or less. Companies with profits between these two thresholds pay tax at the main rate but can claim Marginal Relief."
  },
  {
    question: "What is Marginal Relief?",
    answer: "Marginal Relief is a form of tax relief that provides a gradual increase in the Corporation Tax rate for companies with profits between \xA350,000 and \xA3250,000. This avoids a sudden jump from the 19% rate to the 25% rate."
  }
];
var SMALL_PROFITS_RATE = 0.19;
var MAIN_RATE = 0.25;
var SMALL_PROFITS_THRESHOLD = 5e4;
var MAIN_RATE_THRESHOLD = 25e4;
var MARGINAL_RELIEF_FRACTION = (MAIN_RATE - SMALL_PROFITS_RATE) / (MAIN_RATE_THRESHOLD - SMALL_PROFITS_THRESHOLD);
function CorporationTaxCalculator() {
  const [companyProfit, setCompanyProfit] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const profit = Number(companyProfit) || 0;
    if (profit <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    let taxDue = 0;
    let effectiveRate = 0;
    let relief = 0;
    if (profit <= SMALL_PROFITS_THRESHOLD) {
      taxDue = profit * SMALL_PROFITS_RATE;
    } else if (profit > MAIN_RATE_THRESHOLD) {
      taxDue = profit * MAIN_RATE;
    } else {
      const mainRateTax = profit * MAIN_RATE;
      relief = (MAIN_RATE_THRESHOLD - profit) * MARGINAL_RELIEF_FRACTION * profit / profit;
      taxDue = mainRateTax - relief;
    }
    effectiveRate = taxDue / profit * 100;
    const newResults = {
      profit,
      taxDue,
      effectiveRate,
      relief
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Company Profit", `\xA3${newResults.profit.toFixed(2)}`],
      ["Corporation Tax Due", `\xA3${newResults.taxDue.toFixed(2)}`],
      ["Effective Tax Rate", `${newResults.effectiveRate.toFixed(2)}%`],
      ["Marginal Relief Applied", `\xA3${newResults.relief.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [companyProfit]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Corporation Tax Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate the Corporation Tax liability for a UK limited company based on its annual profits." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Corporation Tax Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Company Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "companyProfit", children: "Annual Taxable Profit" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "companyProfit",
                    type: "number",
                    value: companyProfit,
                    onChange: (e) => setCompanyProfit(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 150000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Tax"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Corporation Tax Estimate" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "corporation-tax",
                title: "Corporation Tax"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-red-50 border-red-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-red-800 mb-2", children: "Corporation Tax Due" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-red-900", children: [
              "\xA3",
              results.taxDue.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Calculation Summary" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Company Profit" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                  "\xA3",
                  results.profit.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Effective Tax Rate" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                  results.effectiveRate.toFixed(2),
                  "%"
                ] })
              ] }),
              results.relief > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Marginal Relief Applied" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold text-green-700", children: [
                  "\xA3",
                  results.relief.toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate tax?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your company's profit to see the tax liability." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: corpTaxFAQs }) }) })
    ] })
  ] });
}
export {
  CorporationTaxCalculator as default
};
