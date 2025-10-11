import {
  Switch
} from "./chunk-O66MWXRB.js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./chunk-KMQ37Z57.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./chunk-RAVJFG7Q.js";
import "./chunk-6QDB6RBQ.js";
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
  House,
  Info,
  Percent,
  PoundSterling,
  Repeat,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/BRRRRCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var brrrCalculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Property Investment Calculator - BRRRR & Flip Strategy 2025/26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  description: "Free UK property investment calculator for BRRRR and flip strategies. Calculate rental yields, refinance returns, and property flip profits with accurate UK rates for 2025/26.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP"
  },
  featureList: [
    "Property flip profit calculation",
    "BRRRR strategy analysis",
    "Rental yield calculation",
    "70% rule checking",
    "Cash-on-cash return analysis",
    "Capital efficiency tracking"
  ]
};
function BRRRRCalculator() {
  const [purchasePrice, setPurchasePrice] = (0, import_react.useState)("");
  const [closingCosts, setClosingCosts] = (0, import_react.useState)("");
  const [rehabCosts, setRehabCosts] = (0, import_react.useState)("");
  const [arv, setArv] = (0, import_react.useState)("");
  const [sellingCosts, setSellingCosts] = (0, import_react.useState)("");
  const [includeRental, setIncludeRental] = (0, import_react.useState)(false);
  const [monthlyRent, setMonthlyRent] = (0, import_react.useState)("");
  const [monthlyExpenses, setMonthlyExpenses] = (0, import_react.useState)("");
  const [refinanceLTV, setRefinanceLTV] = (0, import_react.useState)("75");
  const [refinanceRate, setRefinanceRate] = (0, import_react.useState)("");
  const [refinanceTerm, setRefinanceTerm] = (0, import_react.useState)("25");
  const [refinanceClosingCosts, setRefinanceClosingCosts] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const pPrice = Number(purchasePrice) || 0;
    const cCosts = Number(closingCosts) || 0;
    const rCosts = Number(rehabCosts) || 0;
    const afterRepairValue = Number(arv) || 0;
    const sCosts = Number(sellingCosts) || 0;
    if (pPrice <= 0 || afterRepairValue <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const totalProjectCost = pPrice + cCosts + rCosts;
    const netSaleProceeds = afterRepairValue - sCosts;
    const flipProfit = netSaleProceeds - totalProjectCost;
    const flipROI = totalProjectCost > 0 ? flipProfit / totalProjectCost * 100 : 0;
    const seventyPercentRuleMaxPrice = afterRepairValue * 0.7 - rCosts;
    let brrrResults = null;
    if (includeRental) {
      const mRent = Number(monthlyRent) || 0;
      const mExpenses = Number(monthlyExpenses) || 0;
      const refiLTV = Number(refinanceLTV) / 100 || 0;
      const refiRate = Number(refinanceRate) / 100 || 0;
      const refiTerm = Number(refinanceTerm) || 0;
      const refiClosingCosts = Number(refinanceClosingCosts) || 0;
      const newLoanAmount = afterRepairValue * refiLTV;
      const cashOut = newLoanAmount - totalProjectCost - refiClosingCosts;
      const moneyLeftInDeal = Math.max(0, totalProjectCost - newLoanAmount + refiClosingCosts);
      const monthlyRefiRate = refiRate / 12;
      const numPayments = refiTerm * 12;
      let newMonthlyMortgage = 0;
      if (monthlyRefiRate > 0 && numPayments > 0) {
        newMonthlyMortgage = newLoanAmount * (monthlyRefiRate * Math.pow(1 + monthlyRefiRate, numPayments)) / (Math.pow(1 + monthlyRefiRate, numPayments) - 1);
      } else if (newLoanAmount > 0 && numPayments > 0) {
        newMonthlyMortgage = newLoanAmount / numPayments;
      }
      const monthlyCashFlow = mRent - mExpenses - newMonthlyMortgage;
      const annualCashFlow = monthlyCashFlow * 12;
      let cashOnCashROI;
      if (moneyLeftInDeal <= 0) {
        cashOnCashROI = "All Capital Returned";
      } else {
        cashOnCashROI = annualCashFlow / moneyLeftInDeal * 100;
      }
      brrrResults = {
        newLoanAmount,
        cashOut,
        moneyLeftInDeal,
        newMonthlyMortgage,
        monthlyCashFlow,
        annualCashFlow,
        cashOnCashROI
      };
    }
    const newResults = {
      // Flip results
      totalProjectCost,
      netSaleProceeds,
      flipProfit,
      flipROI,
      seventyPercentRuleMaxPrice,
      isDealGoodBy70Rule: pPrice <= seventyPercentRuleMaxPrice,
      // BRRRR results (if applicable)
      brrrrResults: brrrResults
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["FLIP ANALYSIS", ""],
      ["Metric", "Value"],
      ["Property Purchase Price", `\xA3${pPrice.toFixed(2)}`],
      ["Purchase Closing Costs", `\xA3${cCosts.toFixed(2)}`],
      ["Rehab/Repair Costs", `\xA3${rCosts.toFixed(2)}`],
      ["Total Project Cost", `\xA3${newResults.totalProjectCost.toFixed(2)}`],
      ["Property After Repair Value (ARV)", `\xA3${afterRepairValue.toFixed(2)}`],
      ["Selling Costs", `\xA3${sCosts.toFixed(2)}`],
      ["Net Sale Proceeds", `\xA3${newResults.netSaleProceeds.toFixed(2)}`],
      ["Flip Profit", `\xA3${newResults.flipProfit.toFixed(2)}`],
      ["Flip ROI", `${newResults.flipROI.toFixed(2)}%`],
      ["70% Rule Max Price", `\xA3${newResults.seventyPercentRuleMaxPrice.toFixed(2)}`]
    ];
    if (includeRental && brrrResults) {
      csvExportData.push(
        ["", ""],
        ["BRRRR ANALYSIS", ""],
        ["Refinance Loan Amount", `\xA3${brrrResults.newLoanAmount.toFixed(2)}`],
        ["Cash Back to You", `\xA3${brrrResults.cashOut.toFixed(2)}`],
        ["Money Left in Deal", `\xA3${brrrResults.moneyLeftInDeal.toFixed(2)}`],
        ["Monthly Cash Flow", `\xA3${brrrResults.monthlyCashFlow.toFixed(2)}`],
        ["Annual Cash Flow", `\xA3${brrrResults.annualCashFlow.toFixed(2)}`],
        [
          "Cash-on-Cash ROI",
          typeof brrrResults.cashOnCashROI === "string" ? brrrResults.cashOnCashROI : `${brrrResults.cashOnCashROI.toFixed(2)}%`
        ]
      );
    }
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    purchasePrice,
    closingCosts,
    rehabCosts,
    arv,
    sellingCosts,
    includeRental,
    monthlyRent,
    monthlyExpenses,
    refinanceLTV,
    refinanceRate,
    refinanceTerm,
    refinanceClosingCosts
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(brrrCalculatorJsonLd) }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Property Investment Calculator" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Analyse your property deal: Calculate flip profits or full BRRRR strategy returns. Perfect for UK property investors and developers." })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Property Investment Analysis Results" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-1 space-y-6 non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-5 h-5" }),
                " Property Deal"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  InputGroup,
                  {
                    label: "Property Purchase Price",
                    value: purchasePrice,
                    onChange: setPurchasePrice,
                    placeholder: "e.g. 150000"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  InputGroup,
                  {
                    label: "Purchase Closing Costs",
                    value: closingCosts,
                    onChange: setClosingCosts,
                    placeholder: "e.g. 5000"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  InputGroup,
                  {
                    label: "Rehab / Repair Costs",
                    value: rehabCosts,
                    onChange: setRehabCosts,
                    placeholder: "e.g. 20000"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  InputGroup,
                  {
                    label: "Property After Repair Value (ARV)",
                    value: arv,
                    onChange: setArv,
                    placeholder: "e.g. 250000"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  InputGroup,
                  {
                    label: "Selling Costs",
                    value: sellingCosts,
                    onChange: setSellingCosts,
                    placeholder: "e.g. 7500",
                    tooltip: "Estate agent fees, solicitor costs, etc."
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "w-5 h-5" }),
                "Also Analyse as Buy-to-Let?"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Switch,
                    {
                      id: "include-rental",
                      checked: includeRental,
                      onCheckedChange: setIncludeRental
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "include-rental", children: "Include rental & refinance analysis" })
                ] }),
                includeRental && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-4 space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    InputGroup,
                    {
                      label: "Monthly Rental Income",
                      value: monthlyRent,
                      onChange: setMonthlyRent,
                      placeholder: "e.g. 1200"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    InputGroup,
                    {
                      label: "Monthly Property Expenses",
                      value: monthlyExpenses,
                      onChange: setMonthlyExpenses,
                      placeholder: "e.g. 250",
                      tooltip: "Excluding mortgage. Include insurance, maintenance, management fees, etc."
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "pt-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "text-sm font-medium text-gray-700 mb-3", children: "Refinance Details" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        InputGroup,
                        {
                          label: "Refinance LTV",
                          value: refinanceLTV,
                          onChange: setRefinanceLTV,
                          placeholder: "e.g. 75",
                          isPercent: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        InputGroup,
                        {
                          label: "New Interest Rate",
                          value: refinanceRate,
                          onChange: setRefinanceRate,
                          placeholder: "e.g. 5.5",
                          isPercent: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        InputGroup,
                        {
                          label: "New Mortgage Term (Years)",
                          value: refinanceTerm,
                          onChange: setRefinanceTerm,
                          placeholder: "e.g. 25"
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        InputGroup,
                        {
                          label: "Refinance Closing Costs",
                          value: refinanceClosingCosts,
                          onChange: setRefinanceClosingCosts,
                          placeholder: "e.g. 3000"
                        }
                      )
                    ] })
                  ] })
                ] }) })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Analyse Deal"
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Property Deal Analysis" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExportActions,
                {
                  csvData,
                  fileName: "property-deal-analysis",
                  title: "Property Deal Analysis"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-r from-blue-50 to-green-50 border-blue-200", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
                " Flip Strategy Results"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    DetailRow,
                    {
                      label: "Total Project Cost",
                      value: results.totalProjectCost,
                      isCurrency: true
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    DetailRow,
                    {
                      label: "Net Sale Proceeds",
                      value: results.netSaleProceeds,
                      isCurrency: true
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t pt-2 mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    DetailRow,
                    {
                      label: "Flip Profit",
                      value: results.flipProfit,
                      isCurrency: true,
                      isBold: true,
                      isFinal: true
                    }
                  ) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-6 bg-white rounded-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-gray-600", children: "Return on Investment" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "p",
                    {
                      className: `text-4xl font-bold mt-2 ${results.flipROI >= 0 ? "text-green-700" : "text-red-700"}`,
                      children: [
                        results.flipROI.toFixed(1),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Based on total project cost" })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: results.isDealGoodBy70Rule ? "bg-green-50" : "bg-amber-50", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-5 h-5" }),
                " The 70% Rule Check"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm mb-4", children: "A common rule of thumb for investors is to pay no more than 70% of the ARV minus repair costs. This helps ensure profitability." }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    DetailRow,
                    {
                      label: "Max Offer Price by 70% Rule",
                      value: results.seventyPercentRuleMaxPrice,
                      isCurrency: true,
                      isBold: true
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    DetailRow,
                    {
                      label: "Your Purchase Price",
                      value: Number(purchasePrice),
                      isCurrency: true,
                      isBold: true
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "div",
                    {
                      className: `p-3 rounded-lg mt-4 ${results.isDealGoodBy70Rule ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`,
                      children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Verdict:" }),
                        " ",
                        results.isDealGoodBy70Rule ? "This deal meets the 70% rule. Good sign!" : "This deal does not meet the 70% rule. Proceed with caution."
                      ]
                    }
                  )
                ] })
              ] })
            ] }),
            includeRental && results.brrrrResults && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "w-5 h-5" }),
                  " BRRRR Strategy Results"
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4 mb-6", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      MetricCard,
                      {
                        title: "Cash Back to You",
                        value: Math.max(0, results.brrrrResults.cashOut),
                        isCurrency: true,
                        color: "green"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      MetricCard,
                      {
                        title: "Money Left in Deal",
                        value: results.brrrrResults.moneyLeftInDeal,
                        isCurrency: true,
                        color: "purple"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      MetricCard,
                      {
                        title: "Monthly Cash Flow",
                        value: results.brrrrResults.monthlyCashFlow,
                        isCurrency: true,
                        color: "blue"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-6 bg-white rounded-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg font-medium text-gray-600", children: "Cash-on-Cash ROI" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-4xl font-bold text-purple-700 mt-2", children: typeof results.brrrrResults.cashOnCashROI === "string" ? results.brrrrResults.cashOnCashROI : `${results.brrrrResults.cashOnCashROI.toFixed(1)}%` }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: typeof results.brrrrResults.cashOnCashROI === "string" ? "All your initial capital returned - any positive cash flow is pure profit!" : "Based on annual cash flow vs money left in the deal" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Capital Investment Analysis" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-700 mb-3", children: "Initial Capital Required" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Property Purchase Price",
                          value: Number(purchasePrice),
                          isCurrency: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Purchase Closing Costs",
                          value: Number(closingCosts),
                          isCurrency: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Rehab/Repair Costs",
                          value: Number(rehabCosts),
                          isCurrency: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Refinance Closing Costs",
                          value: Number(refinanceClosingCosts),
                          isCurrency: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t pt-2 mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Total Initial Investment",
                          value: results.totalProjectCost + Number(refinanceClosingCosts),
                          isCurrency: true,
                          isBold: true
                        }
                      ) })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-700 mb-3", children: "Capital Recovery Through Refinance" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Property After Repair Value (ARV)",
                          value: Number(arv),
                          isCurrency: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: `Refinance LTV (${refinanceLTV}%)`,
                          value: results.brrrrResults.newLoanAmount,
                          isCurrency: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Less: Remaining Project Cost",
                          value: -results.totalProjectCost,
                          isCurrency: true,
                          isNegative: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: "Less: Refinance Closing Costs",
                          value: -Number(refinanceClosingCosts),
                          isCurrency: true,
                          isNegative: true
                        }
                      ),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t pt-2 mt-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        DetailRow,
                        {
                          label: results.brrrrResults.cashOut >= 0 ? "Cash Returned to You" : "Additional Cash Needed",
                          value: Math.abs(results.brrrrResults.cashOut),
                          isCurrency: true,
                          isBold: true,
                          isFinal: true
                        }
                      ) })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-purple-50 p-4 rounded-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-purple-800 mb-2", children: "Capital Efficiency Summary" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4 text-sm", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-purple-600", children: "Money Left in Deal:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "font-bold text-purple-800", children: [
                          "\xA3",
                          results.brrrrResults.moneyLeftInDeal.toLocaleString(
                            "en-GB",
                            { maximumFractionDigits: 0 }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-purple-600", children: "Capital Efficiency:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-purple-800", children: results.totalProjectCost > 0 ? `${((results.totalProjectCost - results.brrrrResults.moneyLeftInDeal) / results.totalProjectCost * 100).toFixed(1)}%` : "0%" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-purple-600", children: "Capital recovered" })
                      ] })
                    ] })
                  ] }),
                  results.brrrrResults.cashOut > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-green-50 p-3 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-800", children: [
                    "\u{1F389} ",
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Excellent!" }),
                    " You'll receive \xA3",
                    results.brrrrResults.cashOut.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    }),
                    " ",
                    "back, which you can use for your next BRRRR deal while still owning this cash-flowing property!"
                  ] }) })
                ] }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Strategy Comparison" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-blue-800 mb-2", children: "Flip Strategy" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-blue-900", children: [
                      "\xA3",
                      results.flipProfit.toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-blue-700", children: [
                      "One-time profit (",
                      results.flipROI.toFixed(1),
                      "% ROI)"
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-purple-50 rounded-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-purple-800 mb-2", children: "BRRRR Strategy" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-purple-900", children: [
                      "\xA3",
                      results.brrrrResults.annualCashFlow.toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      }),
                      "/year"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-purple-700", children: [
                      "Recurring income +",
                      typeof results.brrrrResults.cashOnCashROI === "string" ? " all capital back" : ` ${results.brrrrResults.cashOnCashROI.toFixed(1)}% annual ROI`
                    ] })
                  ] })
                ] }) })
              ] })
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "lg:col-span-2 flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "w-12 h-12 mx-auto mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Analyse your property deal" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your deal numbers to see flip profits and optional BRRRR returns." })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        FAQSection,
        {
          faqs: propertyInvestmentFAQs,
          title: "Property Investment - Frequently Asked Questions"
        }
      ) }) })
    ] }) })
  ] });
}
var InputGroup = ({ label, value, onChange, placeholder, isPercent = false, tooltip }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: label, children: label }),
    tooltip && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3 h-3 text-gray-500 cursor-pointer" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: tooltip }) })
    ] })
  ] }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
    !isPercent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Input,
      {
        id: label,
        type: "number",
        value,
        onChange: (e) => onChange(e.target.value),
        className: isPercent ? "pr-10" : "pl-10",
        placeholder
      }
    ),
    isPercent && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" })
  ] })
] });
var MetricCard = ({ title, value, isCurrency = false, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-900",
    green: "bg-green-50 text-green-900",
    purple: "bg-purple-50 text-purple-900"
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: colors[color], children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium", children: title }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-2xl font-bold mt-1", children: isCurrency ? value.toLocaleString("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0
    }) : value })
  ] }) });
};
var DetailRow = ({
  label,
  value,
  isCurrency = false,
  isBold = false,
  isFinal = false,
  isNegative = false
}) => {
  const finalValue = isCurrency ? value.toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0
  }) : value;
  const valueColor = isFinal ? value >= 0 ? "text-green-700" : "text-red-700" : isNegative ? "text-red-600" : "text-gray-900";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: isBold ? "font-semibold" : "", children: [
      label,
      ":"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `${isBold ? "font-bold" : "font-semibold"} ${valueColor}`, children: finalValue })
  ] });
};
var FAQSection = ({ faqs, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "py-8", children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-6 text-center", children: title }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, { type: "single", collapsible: true, className: "w-full", children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, { value: `item-${index}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { className: "text-left", children: faq.question }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: faq.answer }) })
  ] }, `faq-${index}`)) })
] });
var propertyInvestmentFAQs = [
  {
    question: "What's the difference between a flip and BRRRR strategy?",
    answer: "A flip involves buying a property, renovating it, and selling it quickly for a profit. BRRRR (Buy, Rehab, Rent, Refinance, Repeat) involves buying and renovating a property, but then renting it out, refinancing to recover your capital, and using that capital for the next deal. Flipping gives immediate profit but no ongoing income, while BRRRR builds a portfolio of income-producing assets."
  },
  {
    question: "What is the 70% Rule in property investment?",
    answer: "The 70% Rule is a quick screening tool used by property investors. It states that you should pay no more than 70% of the After Repair Value (ARV) minus repair costs. For example, if a property will be worth \xA3200,000 after repairs and needs \xA320,000 in repairs, you shouldn't pay more than \xA3120,000 (70% of \xA3200,000 = \xA3140,000 - \xA320,000 repairs = \xA3120,000)."
  },
  {
    question: "How do I calculate After Repair Value (ARV)?",
    answer: "ARV is the estimated market value of a property after renovations are complete. Calculate it by researching comparable sales (comps) of similar properties in the same area that have been recently sold. Look at properties with similar size, condition, and features. You can also get a professional appraisal or BPO (Broker Price Opinion)."
  },
  {
    question: "What should I budget for selling costs when flipping?",
    answer: "Typical selling costs include estate agent fees (1-3% of sale price), solicitor fees (\xA3500-\xA31,500), Energy Performance Certificate (\xA3100-\xA3300), and potential capital gains tax. Budget around 3-5% of the sale price for total selling costs."
  },
  {
    question: "What Loan-to-Value (LTV) can I expect for a refinance?",
    answer: "Most UK buy-to-let mortgage lenders offer 75-80% LTV for refinancing, though some specialist lenders may go up to 85%. The exact LTV depends on the property type, location, rental income coverage, and your financial profile. Higher LTV ratios typically come with higher interest rates."
  },
  {
    question: "How much should I budget for rehab costs?",
    answer: "Rehab costs vary widely depending on the property's condition and your renovation scope. Get quotes from contractors for major work, add 10-20% contingency for unexpected issues, and budget for: structural repairs, plumbing/electrical updates, kitchen and bathroom renovations, flooring, painting, and any necessary safety/compliance work."
  },
  {
    question: "What expenses should I include in monthly property expenses for BRRRR?",
    answer: "Include all operating expenses except the mortgage payment: property insurance, property management fees (typically 8-12% of rent), regular maintenance and repairs, vacancy allowance (typically 5-10% of rent), and any service charges or ground rent for leasehold properties."
  },
  {
    question: "Which strategy is better - flipping or BRRRR?",
    answer: "It depends on your goals and situation. Flipping provides immediate cash profits but requires finding new deals constantly and pays income tax on profits. BRRRR builds long-term wealth through cash flow and appreciation, offers better tax advantages, but ties up capital longer and requires active property management. Many investors use both strategies depending on the specific deal and market conditions."
  },
  {
    question: "Are there tax implications with property investment strategies?",
    answer: "Yes, significant tax considerations apply. Flipping profits are typically subject to income tax (or corporation tax if through a company). BRRRR involves rental income tax, but with many allowable expenses. Stamp duty applies on purchase, and capital gains tax may apply when selling. Consider professional tax advice as the optimal structure depends on your circumstances and investment scale."
  }
];
export {
  BRRRRCalculator as default
};
