import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
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
  ChartPie,
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

// src/pages/BudgetCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var governmentBudget2025 = {
  // Using a realistic estimated value for UK government total revenue, in millions of GBP.
  // ~£1.1 trillion is 1,100,000 million.
  // The display text "£{(governmentBudget2025.totalRevenue / 1000).toFixed(0)}bn" means this value
  // should be in millions, so when divided by 1000, it becomes billions.
  totalRevenue: 11e5
};
var defaultIncomeCategories = [
  { name: "Primary Salary", amount: "" },
  { name: "Secondary Income", amount: "" }
];
var defaultExpenseCategories = [
  { name: "Housing (Rent/Mortgage)", amount: "", essential: true },
  { name: "Utilities", amount: "", essential: true },
  { name: "Groceries", amount: "", essential: true },
  { name: "Transport", amount: "", essential: true },
  { name: "Dining Out", amount: "", essential: false },
  { name: "Entertainment", amount: "", essential: false }
];
function BudgetCalculator() {
  const [incomeItems, setIncomeItems] = (0, import_react.useState)(defaultIncomeCategories);
  const [expenseItems, setExpenseItems] = (0, import_react.useState)(defaultExpenseCategories);
  const [savingsGoal, setSavingsGoal] = (0, import_react.useState)("");
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const updateIncomeItem = (index, field, value) => {
    const newItems = [...incomeItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setIncomeItems(newItems);
  };
  const updateExpenseItem = (index, field, value) => {
    const newItems = [...expenseItems];
    newItems[index] = { ...newItems[index], [field]: value };
    setExpenseItems(newItems);
  };
  const addIncomeItem = () => {
    setIncomeItems([...incomeItems, { name: "", amount: "" }]);
  };
  const addExpenseItem = () => {
    setExpenseItems([...expenseItems, { name: "", amount: "", essential: false }]);
  };
  const removeIncomeItem = (index) => {
    setIncomeItems(incomeItems.filter((_, i) => i !== index));
  };
  const removeExpenseItem = (index) => {
    setExpenseItems(expenseItems.filter((_, i) => i !== index));
  };
  const handleCalculate = () => {
    const totalIncome = incomeItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const totalExpenses = expenseItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const essentialExpenses = expenseItems.filter((item) => item.essential).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const nonEssentialExpenses = expenseItems.filter((item) => !item.essential).reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
    const remaining = totalIncome - totalExpenses;
    const currentSavingsGoal = Number(savingsGoal) || 0;
    const savingsShortfall = currentSavingsGoal - Math.max(0, remaining);
    const newResults = {
      totalIncome,
      totalExpenses,
      essentialExpenses,
      nonEssentialExpenses,
      remaining,
      savingsGoal: currentSavingsGoal,
      savingsShortfall
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Type", "Category", "Amount"],
      ...incomeItems.map((item) => [
        "Income",
        item.name,
        `\xA3${(Number(item.amount) || 0).toFixed(2)}`
      ]),
      ["", "", ""],
      ...expenseItems.map((item) => [
        "Expense",
        item.name,
        `\xA3${(Number(item.amount) || 0).toFixed(2)}`
      ]),
      ["", "", ""],
      ["Summary", "Total Income", `\xA3${totalIncome.toFixed(2)}`],
      ["Summary", "Total Expenses", `\xA3${totalExpenses.toFixed(2)}`],
      ["Summary", "Remaining", `\xA3${remaining.toFixed(2)}`],
      ["Summary", "Savings Goal", `\xA3${currentSavingsGoal.toFixed(2)}`],
      [
        "Summary",
        "Savings Shortfall",
        savingsShortfall > 0 ? `\xA3${savingsShortfall.toFixed(2)}` : "\xA30.00"
      ]
    ];
    setCsvData(csvExportData);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Budget Planner" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "A good budget is the foundation of financial freedom. Tell your money where to go, instead of wondering where it went." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Monthly Budget Results" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-2 grid md:grid-cols-2 gap-8 non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
              "Monthly Income"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              incomeItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      value: item.name,
                      onChange: (e) => updateIncomeItem(index, "name", e.target.value),
                      className: "flex-1",
                      placeholder: "e.g. Primary Salary"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => removeIncomeItem(index),
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
                      onChange: (e) => updateIncomeItem(index, "amount", e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 3000"
                    }
                  )
                ] })
              ] }, index)),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  variant: "outline",
                  onClick: addIncomeItem,
                  className: "w-full flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
                    "Add Income Source"
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-red-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-5 h-5" }),
              "Monthly Expenses"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              expenseItems.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      value: item.name,
                      onChange: (e) => updateExpenseItem(index, "name", e.target.value),
                      className: "flex-1",
                      placeholder: "e.g. Rent"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-1", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      "input",
                      {
                        type: "checkbox",
                        checked: item.essential,
                        onChange: (e) => updateExpenseItem(index, "essential", e.target.checked),
                        className: "w-4 h-4"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-gray-500", children: "Essential" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => removeExpenseItem(index),
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
                      onChange: (e) => updateExpenseItem(index, "amount", e.target.value),
                      className: `pl-10 ${item.essential ? "border-orange-200 bg-orange-50" : ""}`,
                      placeholder: "e.g. 1200"
                    }
                  )
                ] })
              ] }, index)),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  variant: "outline",
                  onClick: addExpenseItem,
                  className: "w-full flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
                    "Add Expense"
                  ]
                }
              )
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "md:col-span-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6 space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly Savings Target" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: savingsGoal,
                    onChange: (e) => setSavingsGoal(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 500"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Budget"
            ] })
          ] }) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your Budget Summary" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-blue-200 dark:border-blue-800 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-bold text-blue-900 dark:text-blue-100 mb-2", children: "\u{1F4A1} Budgeting Like the Government" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-blue-800 dark:text-blue-200 mb-4", children: [
              "Just as the UK government carefully plans its \xA3",
              (governmentBudget2025.totalRevenue / 1e3).toLocaleString(void 0, {
                maximumFractionDigits: 0
              }),
              "bn budget, you should manage your personal finances with the same discipline."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: createPageUrl("UKGovernmentBudget"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Button,
              {
                variant: "outline",
                className: "border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/50",
                children: "See How the Government Budgets \u2192"
              }
            ) })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
            Card,
            {
              className: `${results.remaining >= 0 ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700" : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"}`,
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartPie, { className: "w-5 h-5" }),
                  "Budget Summary"
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Income:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-600", children: [
                        "\xA3",
                        results.totalIncome.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Expenses:" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-600", children: [
                        "-\xA3",
                        results.totalExpenses.toLocaleString()
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "div",
                      {
                        className: `flex justify-between text-lg font-bold pt-2 border-t ${results.remaining >= 0 ? "text-green-700" : "text-red-700"}`,
                        children: [
                          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Remaining:" }),
                          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                            results.remaining >= 0 ? "\xA3" : "-\xA3",
                            Math.abs(results.remaining).toLocaleString()
                          ] })
                        ]
                      }
                    )
                  ] }),
                  results.remaining < 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-red-100 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-red-800", children: [
                    "\u26A0\uFE0F You're overspending by \xA3",
                    Math.abs(results.remaining).toLocaleString(),
                    " ",
                    "per month"
                  ] }) })
                ] })
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-5 h-5" }),
              "Income Breakdown"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-2", children: incomeItems.filter((item) => Number(item.amount) > 0).map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.name || "Unnamed Income" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-green-600", children: [
                "\xA3",
                (Number(item.amount) || 0).toLocaleString()
              ] })
            ] }, index)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-red-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-5 h-5" }),
              "Expense Breakdown"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-2", children: expenseItems.filter((item) => Number(item.amount) > 0).map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                item.name || "Unnamed Expense",
                " ",
                item.essential && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-xs text-orange-500", children: "(Essential)" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-red-600", children: [
                "-\xA3",
                (Number(item.amount) || 0).toLocaleString()
              ] })
            ] }, index)) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Savings Goal" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Savings Goal:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "\xA3",
                  results.savingsGoal.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Available to Save:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "span",
                  {
                    className: results.remaining >= 0 ? "text-green-600" : "text-red-600",
                    children: [
                      "\xA3",
                      Math.max(0, results.remaining).toLocaleString()
                    ]
                  }
                )
              ] }),
              results.savingsShortfall > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-yellow-100 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-yellow-800", children: [
                "\u{1F4A1} You need to save \xA3",
                results.savingsShortfall.toLocaleString(),
                " more to reach your goal"
              ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-green-100 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-800", children: [
                "\u2705 You can meet your savings goal with \xA3",
                (results.remaining - results.savingsGoal).toLocaleString(),
                " left over!"
              ] }) })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Budget Insights" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3 text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-blue-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-blue-800", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "50/30/20 Rule:" }),
                  " Aim for 50% needs, 30% wants, 20% savings"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-2 space-y-1 text-xs", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    "Needs: \xA3",
                    (results.totalIncome * 0.5).toLocaleString(),
                    " (Currently: \xA3",
                    results.essentialExpenses.toLocaleString(),
                    ")"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    "Wants: \xA3",
                    (results.totalIncome * 0.3).toLocaleString(),
                    " (Currently: \xA3",
                    results.nonEssentialExpenses.toLocaleString(),
                    ")"
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    "Savings: \xA3",
                    (results.totalIncome * 0.2).toLocaleString(),
                    " (Goal: \xA3",
                    results.savingsGoal.toLocaleString(),
                    ")"
                  ] })
                ] })
              ] }),
              results.nonEssentialExpenses > results.essentialExpenses && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-orange-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-orange-800", children: "\u{1F4B0} Your non-essential spending exceeds essential costs. Consider reviewing discretionary expenses." }) }),
              results.essentialExpenses > results.totalIncome * 0.6 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-red-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-800", children: "\u{1F3E0} Essential expenses are high. Consider ways to reduce housing, transport, or utility costs." }) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "budget-summary",
              title: "Budget Summary"
            }
          ) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to see your budget?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: 'Fill in your income and expenses, then click "Calculate Budget".' })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  BudgetCalculator as default
};
