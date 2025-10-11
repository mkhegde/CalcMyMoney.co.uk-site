import {
  ExportActions
} from "./chunk-F7OALEHA.js";
import "./chunk-AXLI4SNI.js";
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
  Banknote,
  Calculator,
  House,
  Plus,
  PoundSterling,
  Trash2,
  TrendingDown,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/NetWorthCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var defaultAssets = [
  { name: "Primary Property", amount: "", category: "property" },
  { name: "Savings Account", amount: "", category: "cash" },
  { name: "Investment Portfolio", amount: "", category: "investments" },
  { name: "Pension Fund", amount: "", category: "pension" }
];
var defaultLiabilities = [
  { name: "Mortgage", amount: "", category: "property" },
  { name: "Credit Cards", amount: "", category: "debt" },
  { name: "Personal Loan", amount: "", category: "debt" }
];
function NetWorthCalculator() {
  const [assets, setAssets] = (0, import_react.useState)(defaultAssets);
  const [liabilities, setLiabilities] = (0, import_react.useState)(defaultLiabilities);
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const updateAsset = (index, field, value) => {
    const newAssets = [...assets];
    newAssets[index] = { ...newAssets[index], [field]: value };
    setAssets(newAssets);
  };
  const updateLiability = (index, field, value) => {
    const newLiabilities = [...liabilities];
    newLiabilities[index] = { ...newLiabilities[index], [field]: value };
    setLiabilities(newLiabilities);
  };
  const addAsset = () => {
    setAssets([...assets, { name: "", amount: "", category: "other" }]);
  };
  const addLiability = () => {
    setLiabilities([...liabilities, { name: "", amount: "", category: "debt" }]);
  };
  const removeAsset = (index) => {
    setAssets(assets.filter((_, i) => i !== index));
  };
  const removeLiability = (index) => {
    setLiabilities(liabilities.filter((_, i) => i !== index));
  };
  const handleCalculate = () => {
    const totalAssets = assets.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalLiabilities = liabilities.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const netWorth = totalAssets - totalLiabilities;
    const assetCategories = {
      property: assets.filter((a) => a.category === "property").reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      cash: assets.filter((a) => a.category === "cash").reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      investments: assets.filter((a) => a.category === "investments").reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      pension: assets.filter((a) => a.category === "pension").reduce((sum, a) => sum + (Number(a.amount) || 0), 0),
      other: assets.filter((a) => a.category === "other").reduce((sum, a) => sum + (Number(a.amount) || 0), 0)
    };
    const newResults = {
      totalAssets,
      totalLiabilities,
      netWorth,
      assetCategories
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Type", "Item", "Amount"],
      ["", "ASSETS", ""],
      ...assets.filter((asset) => Number(asset.amount) > 0).map((asset) => [
        "Asset",
        asset.name || "Unnamed Asset",
        `\xA3${(Number(asset.amount) || 0).toFixed(2)}`
      ]),
      ["", "", ""],
      ["", "LIABILITIES", ""],
      ...liabilities.filter((liability) => Number(liability.amount) > 0).map((liability) => [
        "Liability",
        liability.name || "Unnamed Liability",
        `\xA3${(Number(liability.amount) || 0).toFixed(2)}`
      ]),
      ["", "", ""],
      ["Summary", "Total Assets", `\xA3${totalAssets.toFixed(2)}`],
      ["Summary", "Total Liabilities", `\xA3${totalLiabilities.toFixed(2)}`],
      ["Summary", "Net Worth", `\xA3${netWorth.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [assets, liabilities]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Net Worth Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Your net worth is your financial scorecard. Calculate the difference between what you own and what you owe." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Net Worth Calculation Results" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-2 grid md:grid-cols-2 gap-8 non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
              "Assets (What You Own)"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              assets.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      value: item.name,
                      onChange: (e) => updateAsset(index, "name", e.target.value),
                      className: "flex-1",
                      placeholder: "e.g. Primary Property"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => removeAsset(index),
                      className: "text-red-500 hover:text-red-700",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      type: "number",
                      value: item.amount,
                      onChange: (e) => updateAsset(index, "amount", e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 250000"
                    }
                  )
                ] })
              ] }, index)),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  variant: "outline",
                  onClick: addAsset,
                  className: "w-full flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
                    "Add Asset"
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-red-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-5 h-5" }),
                "Liabilities (What You Owe)"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                liabilities.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        value: item.name,
                        onChange: (e) => updateLiability(index, "name", e.target.value),
                        className: "flex-1",
                        placeholder: "e.g. Mortgage"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Button,
                      {
                        variant: "ghost",
                        size: "icon",
                        onClick: () => removeLiability(index),
                        className: "text-red-500 hover:text-red-700",
                        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        type: "number",
                        value: item.amount,
                        onChange: (e) => updateLiability(index, "amount", e.target.value),
                        className: "pl-10",
                        placeholder: "e.g. 180000"
                      }
                    )
                  ] })
                ] }, index)),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  Button,
                  {
                    variant: "outline",
                    onClick: addLiability,
                    className: "w-full flex items-center gap-2",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
                      "Add Liability"
                    ]
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Net Worth"
            ] }) }) }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your Net Worth" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "net-worth-calculation",
                title: "Net Worth Calculation"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Card,
            {
              className: `${results.netWorth >= 0 ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700" : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-center", children: "Your Net Worth" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "p",
                    {
                      className: `text-5xl font-bold ${results.netWorth >= 0 ? "text-green-700" : "text-red-700"}`,
                      children: [
                        results.netWorth >= 0 ? "\xA3" : "-\xA3",
                        Math.abs(results.netWorth).toLocaleString()
                      ]
                    }
                  ),
                  results.netWorth < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-red-600 mt-2", children: "Negative net worth means you owe more than you own" })
                ] }) })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Assets vs Liabilities" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-green-50 dark:bg-green-900/30 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-green-800 dark:text-green-200", children: "Total Assets:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-green-900 dark:text-green-100 text-xl", children: [
                  "\xA3",
                  results.totalAssets.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-red-50 dark:bg-red-900/30 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-red-800 dark:text-red-200", children: "Total Liabilities:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-red-900 dark:text-red-100 text-xl", children: [
                  "-\xA3",
                  results.totalLiabilities.toLocaleString()
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
              "Assets Breakdown"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-3", children: assets.filter((asset) => Number(asset.amount) > 0).map((asset, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                    asset.category === "property" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4 text-green-600" }),
                    asset.category === "cash" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "w-4 h-4 text-green-600" }),
                    asset.category === "investments" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-green-600" }),
                    asset.category === "pension" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-4 h-4 text-green-600" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: asset.name })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-700 dark:text-green-300", children: [
                    "\xA3",
                    (Number(asset.amount) || 0).toLocaleString()
                  ] })
                ]
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-red-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-5 h-5" }),
              "Liabilities Breakdown"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-3", children: liabilities.filter((liability) => Number(liability.amount) > 0).map((liability, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex justify-between items-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                    liability.category === "property" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-4 h-4 text-red-600" }),
                    liability.category === "debt" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-4 h-4 text-red-600" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: liability.name })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-700 dark:text-red-300", children: [
                    "-\xA3",
                    (Number(liability.amount) || 0).toLocaleString()
                  ] })
                ]
              },
              index
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Net Worth Insights" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3 text-sm", children: [
              results.netWorth > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-green-100 dark:bg-green-900/40 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-green-800 dark:text-green-200", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Positive Net Worth:" }),
                " You own more than you owe. Great foundation for building wealth!"
              ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-orange-100 dark:bg-orange-900/40 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-orange-800 dark:text-orange-200", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Negative Net Worth:" }),
                " Focus on paying down debt and building assets to improve your financial position."
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-blue-800 dark:text-blue-200", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Tip:" }),
                " Track your net worth quarterly to monitor your financial progress over time."
              ] }) })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate your net worth?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: 'Add your assets and liabilities, then click "Calculate Net Worth".' })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  NetWorthCalculator as default
};
