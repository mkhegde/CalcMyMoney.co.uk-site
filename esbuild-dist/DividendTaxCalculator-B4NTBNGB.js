import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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

// src/pages/DividendTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var dividendTaxFAQs = [
  {
    question: "What is the Dividend Allowance?",
    answer: "The Dividend Allowance is the amount of dividend income you can receive each tax year without paying any tax. For the 2024/25 tax year, this allowance is \xA3500. You do not pay tax on any dividend income that falls within this allowance."
  },
  {
    question: "How is dividend tax calculated?",
    answer: "Dividend tax is calculated based on your Income Tax band. After using your Personal Allowance and Dividend Allowance, any further dividends are taxed at specific rates for basic, higher, and additional rate taxpayers. Your other income (like a salary) determines which tax band your dividends fall into."
  },
  {
    question: "Do I need to file a tax return for dividends?",
    answer: "If your dividend income is more than the \xA3500 allowance, you will usually need to declare it to HMRC, typically through a Self Assessment tax return."
  },
  {
    question: "A Note on Trustworthiness",
    answer: "This calculator is based on the 2024/25 tax rates for England, Wales, and Northern Ireland. Tax laws are complex and can change. This tool is for estimation purposes and should not be considered financial advice. For official guidance, refer to GOV.UK or consult a tax professional."
  }
];
var PERSONAL_ALLOWANCE = 12570;
var DIVIDEND_ALLOWANCE = 500;
var BASIC_RATE_LIMIT = 50270;
var HIGHER_RATE_LIMIT = 125140;
var DIVIDEND_TAX_RATES = {
  basic: 0.0875,
  higher: 0.3375,
  additional: 0.3935
};
function DividendTaxCalculator() {
  const [otherIncome, setOtherIncome] = (0, import_react.useState)("50000");
  const [dividendIncome, setDividendIncome] = (0, import_react.useState)("5000");
  const [results, setResults] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const otherInc = Number(otherIncome) || 0;
    const dividendInc = Number(dividendIncome) || 0;
    let personalAllowance = PERSONAL_ALLOWANCE;
    if (otherInc > 1e5) {
      personalAllowance = Math.max(0, PERSONAL_ALLOWANCE - (otherInc - 1e5) / 2);
    }
    const incomeAfterPA = Math.max(0, otherInc - personalAllowance);
    let taxableDividends = Math.max(0, dividendInc - DIVIDEND_ALLOWANCE);
    let tax = 0;
    let breakdown = [];
    let remainingTaxableDividends = taxableDividends;
    const basicRateBandAvailable = Math.max(
      0,
      BASIC_RATE_LIMIT - personalAllowance - incomeAfterPA
    );
    const higherRateBandAvailable = Math.max(0, HIGHER_RATE_LIMIT - BASIC_RATE_LIMIT);
    if (remainingTaxableDividends > 0 && basicRateBandAvailable > 0) {
      const amountInBand = Math.min(remainingTaxableDividends, basicRateBandAvailable);
      const taxInBand = amountInBand * DIVIDEND_TAX_RATES.basic;
      tax += taxInBand;
      remainingTaxableDividends -= amountInBand;
      if (taxInBand > 0)
        breakdown.push({
          name: "Basic Rate",
          amount: taxInBand,
          taxableAmount: amountInBand,
          rate: DIVIDEND_TAX_RATES.basic * 100
        });
    }
    if (remainingTaxableDividends > 0 && higherRateBandAvailable > 0) {
      const amountInBand = Math.min(remainingTaxableDividends, higherRateBandAvailable);
      const taxInBand = amountInBand * DIVIDEND_TAX_RATES.higher;
      tax += taxInBand;
      remainingTaxableDividends -= amountInBand;
      if (taxInBand > 0)
        breakdown.push({
          name: "Higher Rate",
          amount: taxInBand,
          taxableAmount: amountInBand,
          rate: DIVIDEND_TAX_RATES.higher * 100
        });
    }
    if (remainingTaxableDividends > 0) {
      const taxInBand = remainingTaxableDividends * DIVIDEND_TAX_RATES.additional;
      tax += taxInBand;
      if (taxInBand > 0)
        breakdown.push({
          name: "Additional Rate",
          amount: taxInBand,
          taxableAmount: remainingTaxableDividends,
          rate: DIVIDEND_TAX_RATES.additional * 100
        });
    }
    setResults({ taxPayable: tax, breakdown });
  }, [otherIncome, dividendIncome]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "UK Dividend Tax Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Estimate the tax you'll owe on your dividend income for the 2024/25 tax year." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Income Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "otherIncome", children: "Other Annual Income (e.g. Salary) (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "otherIncome",
                  type: "number",
                  value: otherIncome,
                  onChange: (e) => setOtherIncome(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "dividendIncome", children: "Total Annual Dividend Income (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "dividendIncome",
                  type: "number",
                  value: dividendIncome,
                  onChange: (e) => setDividendIncome(e.target.value)
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-red-50 border-red-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-red-900", children: "Estimated Dividend Tax" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-red-900", children: [
                "\xA3",
                results.taxPayable.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-red-700 mt-2", children: "Based on your total income and dividend allowance." })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tax Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "Within \xA3",
                  DIVIDEND_ALLOWANCE,
                  " Dividend Allowance:"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-green-700", children: "\xA30.00 tax" })
              ] }),
              results.breakdown.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "flex justify-between items-center text-sm p-2 bg-gray-50 rounded-md",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                      "Tax on \xA3",
                      item.taxableAmount.toLocaleString(),
                      " at ",
                      item.rate.toFixed(2),
                      "% (",
                      item.name,
                      ")"
                    ] }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                      "-\xA3",
                      item.amount.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                    ] })
                  ]
                },
                index
              )),
              results.taxPayable === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Your dividend income is within your tax-free allowances." })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter details to calculate tax." }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: dividendTaxFAQs }) })
    ] })
  ] });
}
export {
  DividendTaxCalculator as default
};
