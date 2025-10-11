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

// src/pages/CapitalGainsTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var CGT_ANNUAL_EXEMPTION = 3e3;
var cgtFAQs = [
  {
    question: "What is Capital Gains Tax (CGT)?",
    answer: "Capital Gains Tax is a tax on the profit (or 'gain') you make when you sell or dispose of an asset that has increased in value. It's the gain you make that is taxed, not the total amount of money you receive."
  },
  {
    question: "What is the CGT annual exemption?",
    answer: `For the 2024/25 tax year, the annual exemption is \xA33,000. This means you can make gains up to this amount in a tax year without having to pay any Capital Gains Tax.`
  },
  {
    question: "How does my income tax band affect my CGT rate?",
    answer: "The rate of CGT you pay depends on your income tax band. Basic-rate taxpayers pay a lower rate of CGT than higher or additional-rate taxpayers. If your capital gain, when added to your income, pushes you into a higher tax band, part of the gain will be taxed at the higher rate."
  }
];
function CapitalGainsTaxCalculator() {
  const [sellingPrice, setSellingPrice] = (0, import_react.useState)("");
  const [purchasePrice, setPurchasePrice] = (0, import_react.useState)("");
  const [costs, setCosts] = (0, import_react.useState)("");
  const [assetType, setAssetType] = (0, import_react.useState)("property");
  const [income, setIncome] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const salePrice = Number(sellingPrice) || 0;
    const buyPrice = Number(purchasePrice) || 0;
    const totalCosts = Number(costs) || 0;
    const annualIncome = Number(income) || 0;
    if (salePrice <= 0 || buyPrice <= 0 || annualIncome <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const totalGain = salePrice - buyPrice - totalCosts;
    if (totalGain <= 0) {
      setResults({ totalGain, taxableGain: 0, cgtPayable: 0, breakdown: [] });
      setHasCalculated(true);
      return;
    }
    const taxableGain = Math.max(0, totalGain - CGT_ANNUAL_EXEMPTION);
    const basicRateLimit = 50270;
    const unusedBasicRateBand = Math.max(0, basicRateLimit - annualIncome);
    let cgtPayable = 0;
    let breakdown = [];
    let gainRemaining = taxableGain;
    const rates = assetType === "property" ? { basic: 0.18, higher: 0.24 } : { basic: 0.1, higher: 0.2 };
    if (unusedBasicRateBand > 0 && gainRemaining > 0) {
      const gainInBasicBand = Math.min(gainRemaining, unusedBasicRateBand);
      const taxInBasic = gainInBasicBand * rates.basic;
      cgtPayable += taxInBasic;
      breakdown.push({ rate: rates.basic * 100, amount: gainInBasicBand, tax: taxInBasic });
      gainRemaining -= gainInBasicBand;
    }
    if (gainRemaining > 0) {
      const taxInHigher = gainRemaining * rates.higher;
      cgtPayable += taxInHigher;
      breakdown.push({ rate: rates.higher * 100, amount: gainRemaining, tax: taxInHigher });
    }
    const newResults = {
      totalGain,
      taxableGain,
      cgtPayable,
      breakdown
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Total Gain", `\xA3${newResults.totalGain.toFixed(2)}`],
      ["Taxable Gain (after exemption)", `\xA3${newResults.taxableGain.toFixed(2)}`],
      ["Total CGT Payable", `\xA3${newResults.cgtPayable.toFixed(2)}`],
      ...newResults.breakdown.map((b) => [`Taxed at ${b.rate}%`, `on \xA3${b.amount.toFixed(2)}`])
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [sellingPrice, purchasePrice, costs, assetType, income]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Capital Gains Tax Calculator (UK)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Estimate your Capital Gains Tax (CGT) bill when selling assets like property, shares, or cryptocurrency." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Capital Gains Tax Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Asset & Income Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Asset Type" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: assetType, onValueChange: setAssetType, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "property", children: "Residential Property" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "other", children: "Shares & Other Assets" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "sellingPrice", children: "Selling Price" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "sellingPrice",
                    type: "number",
                    value: sellingPrice,
                    onChange: (e) => setSellingPrice(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 300000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "purchasePrice", children: "Purchase Price" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "purchasePrice",
                    type: "number",
                    value: purchasePrice,
                    onChange: (e) => setPurchasePrice(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 200000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "costs", children: "Purchase & Selling Costs" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "costs",
                    type: "number",
                    value: costs,
                    onChange: (e) => setCosts(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 8000"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "e.g., stamp duty, legal fees, broker fees." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "income", children: "Your Taxable Annual Income" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "income",
                    type: "number",
                    value: income,
                    onChange: (e) => setIncome(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 45000"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "This determines your CGT rate." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate CGT"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your CGT Estimate" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "cgt-estimate",
                title: "Capital Gains Tax Estimate"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-red-50 border-red-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-red-800 mb-2", children: "Estimated CGT Payable" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-red-900", children: [
              "\xA3",
              results.cgtPayable.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Calculation Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-gray-50 rounded", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Gain:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                  "\xA3",
                  results.totalGain.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-gray-50 rounded", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Exemption (2024/25):" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-green-600", children: [
                  "-\xA3",
                  CGT_ANNUAL_EXEMPTION.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-gray-100 rounded font-bold", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Taxable Gain:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "\xA3",
                  results.taxableGain.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2 pt-4 border-t", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-medium", children: "Tax on Gain:" }),
                results.breakdown.length > 0 ? results.breakdown.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    className: "flex justify-between items-center p-3 bg-blue-50 rounded",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: `\xA3${b.amount.toLocaleString()} @ ${b.rate}%` }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                        "\xA3",
                        b.tax.toLocaleString()
                      ] })
                    ]
                  },
                  i
                )) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600 text-sm", children: "No tax to pay on the gain." })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate your CGT?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter the details to estimate your potential tax bill." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: cgtFAQs }) }) })
    ] })
  ] });
}
export {
  CapitalGainsTaxCalculator as default
};
