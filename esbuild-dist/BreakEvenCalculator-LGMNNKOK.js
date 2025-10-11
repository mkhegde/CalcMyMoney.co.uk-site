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

// src/pages/BreakEvenCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var breakEvenFAQs = [
  {
    question: "What is a break-even point?",
    answer: "The break-even point is where your total revenue equals your total costs, meaning you're making neither a profit nor a loss. It's a critical metric for business planning and pricing decisions."
  },
  {
    question: "What's the difference between fixed and variable costs?",
    answer: "Fixed costs remain constant regardless of sales volume (e.g., rent, insurance, salaries). Variable costs change with production or sales volume (e.g., materials, commission, delivery costs)."
  },
  {
    question: "How can I use break-even analysis for pricing?",
    answer: "Break-even analysis helps you set minimum prices to cover costs. You can also use it to evaluate the impact of price changes, cost reductions, or volume increases on profitability."
  }
];
function BreakEvenCalculator() {
  const [fixedCosts, setFixedCosts] = (0, import_react.useState)("");
  const [pricePerUnit, setPricePerUnit] = (0, import_react.useState)("");
  const [variableCostPerUnit, setVariableCostPerUnit] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const fixed = Number(fixedCosts) || 0;
    const price = Number(pricePerUnit) || 0;
    const variableCost = Number(variableCostPerUnit) || 0;
    if (fixed <= 0 || price <= 0 || variableCost < 0 || price <= variableCost) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const contributionMargin = price - variableCost;
    const contributionMarginPercent = contributionMargin / price * 100;
    const breakEvenUnits = Math.ceil(fixed / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;
    const scenarios = [
      { units: breakEvenUnits * 0.5, revenue: breakEvenUnits * 0.5 * price },
      { units: breakEvenUnits, revenue: breakEvenRevenue },
      { units: breakEvenUnits * 1.5, revenue: breakEvenUnits * 1.5 * price },
      { units: breakEvenUnits * 2, revenue: breakEvenUnits * 2 * price }
    ].map((scenario) => {
      const totalVariableCosts = scenario.units * variableCost;
      const totalCosts = fixed + totalVariableCosts;
      const profit = scenario.revenue - totalCosts;
      return { ...scenario, profit, totalCosts };
    });
    const newResults = {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginPercent,
      scenarios
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Break-Even Units", `${newResults.breakEvenUnits}`],
      ["Break-Even Revenue", `\xA3${newResults.breakEvenRevenue.toFixed(2)}`],
      ["Contribution Margin per Unit", `\xA3${newResults.contributionMargin.toFixed(2)}`],
      ["Contribution Margin %", `${newResults.contributionMarginPercent.toFixed(1)}%`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [fixedCosts, pricePerUnit, variableCostPerUnit]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Business Break-Even Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate how many units you need to sell to break even and start making profit. Essential for pricing and business planning." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Break-Even Analysis" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Business Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "fixedCosts", children: "Monthly Fixed Costs" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "fixedCosts",
                    type: "number",
                    value: fixedCosts,
                    onChange: (e) => setFixedCosts(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 5000"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Rent, salaries, insurance, etc." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "pricePerUnit", children: "Price per Unit/Service" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "pricePerUnit",
                    type: "number",
                    value: pricePerUnit,
                    onChange: (e) => setPricePerUnit(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 50"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "variableCostPerUnit", children: "Variable Cost per Unit" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "variableCostPerUnit",
                    type: "number",
                    value: variableCostPerUnit,
                    onChange: (e) => setVariableCostPerUnit(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 20"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Materials, commission, delivery, etc." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Break-Even"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Break-Even Analysis" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "break-even-analysis",
                title: "Break-Even Analysis"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-orange-50 border-orange-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-orange-800 mb-2", children: "Break-Even Units" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-4xl font-bold text-orange-900", children: results.breakEvenUnits.toLocaleString() }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-orange-700", children: "Units per month" })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-green-800 mb-2", children: "Break-Even Revenue" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-green-900", children: [
                "\xA3",
                results.breakEvenRevenue.toLocaleString("en-GB", {
                  maximumFractionDigits: 0
                })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-700", children: "Monthly revenue needed" })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Contribution Analysis" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-600", children: "Contribution Margin per Unit" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                "\xA3",
                results.contributionMargin.toFixed(2),
                " (",
                results.contributionMarginPercent.toFixed(1),
                "%)"
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Profit Scenarios" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-2", children: results.scenarios.map((scenario, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: `flex justify-between p-3 rounded ${scenario.profit >= 0 ? "bg-green-50" : "bg-red-50"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    scenario.units.toLocaleString(),
                    " units (\xA3",
                    scenario.revenue.toLocaleString(),
                    ")"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "span",
                    {
                      className: `font-semibold ${scenario.profit >= 0 ? "text-green-800" : "text-red-800"}`,
                      children: [
                        scenario.profit >= 0 ? "+" : "",
                        "\xA3",
                        scenario.profit.toLocaleString()
                      ]
                    }
                  )
                ]
              },
              index
            )) }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready for your break-even analysis?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your business costs and pricing to get started." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: breakEvenFAQs }) }) })
    ] })
  ] });
}
export {
  BreakEvenCalculator as default
};
