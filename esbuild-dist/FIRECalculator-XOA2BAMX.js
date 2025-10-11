import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from "./chunk-32ETQDIX.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
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
  Link
} from "./chunk-ZLF73IFG.js";
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
  Flame,
  PoundSterling,
  Target,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/FIRECalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var fireCalculatorFAQs = [
  {
    question: "What does FIRE mean?",
    answer: "FIRE stands for Financial Independence, Retire Early. It's a movement focused on extreme saving and investment to enable retirement much earlier than traditional retirement age."
  },
  {
    question: "How is the FIRE number calculated?",
    answer: "The FIRE number is typically calculated as 25 times your annual expenses, based on the 4% withdrawal rule. This means you can safely withdraw 4% of your portfolio each year in retirement."
  },
  {
    question: "What's the difference between Lean, Regular, and Fat FIRE?",
    answer: "Lean FIRE (~\xA325k-40k annually), Regular FIRE (~\xA340k-80k annually), and Fat FIRE (\xA380k+ annually) represent different lifestyle levels in early retirement, requiring different savings targets."
  },
  {
    question: "Is the 4% rule safe for early retirement?",
    answer: "The 4% rule is based on historical market performance and assumes a 30-year retirement. For very early retirement (40+ years), some prefer a 3.5% or 3.25% withdrawal rate for extra safety."
  },
  {
    question: "How realistic is FIRE in the UK?",
    answer: "FIRE is achievable in the UK with high savings rates (50%+ of income), smart investing in ISAs and pensions, and careful expense management. Property costs can make it more challenging in expensive areas."
  },
  {
    question: "Should I include my pension in FIRE calculations?",
    answer: "Yes, but remember UK pensions have access restrictions. Private pensions can typically be accessed from age 55 (rising to 57 in 2028), while the state pension starts much later."
  }
];
var CHART_COLORS = {
  currentSavings: "#10b981",
  futureContributions: "#3b82f6",
  investmentGrowth: "#f59e0b"
};
function FIRECalculator() {
  const [currentAge, setCurrentAge] = (0, import_react.useState)("");
  const [currentNetWorth, setCurrentNetWorth] = (0, import_react.useState)("");
  const [annualExpenses, setAnnualExpenses] = (0, import_react.useState)("");
  const [monthlySavings, setMonthlySavings] = (0, import_react.useState)("");
  const [expectedReturn, setExpectedReturn] = (0, import_react.useState)("7");
  const [withdrawalRate, setWithdrawalRate] = (0, import_react.useState)("4");
  const [targetAge, setTargetAge] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const age = Number(currentAge) || 0;
    const netWorth = Number(currentNetWorth) || 0;
    const expenses = Number(annualExpenses) || 0;
    const savings = Number(monthlySavings) || 0;
    const returnRate = Number(expectedReturn) / 100 || 0.07;
    const withdrawal = Number(withdrawalRate) / 100 || 0.04;
    const target = Number(targetAge) || 0;
    if (expenses <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const fireNumber = expenses / withdrawal;
    const leanFireNumber = 35e3 / withdrawal;
    const fatFireNumber = 8e4 / withdrawal;
    const annualSavings = savings * 12;
    let yearsToFire = 0;
    let balance = netWorth;
    if (annualSavings > 0) {
      const monthlyReturn = returnRate / 12;
      const monthlyGoal = fireNumber - netWorth * Math.pow(1 + returnRate, 50);
      if (monthlyReturn > 0) {
        const months = Math.log(
          1 + (fireNumber - netWorth * Math.pow(1 + returnRate, 50)) * monthlyReturn / savings
        ) / Math.log(1 + monthlyReturn);
        yearsToFire = Math.max(0, months / 12);
        balance = netWorth;
        yearsToFire = 0;
        while (balance < fireNumber && yearsToFire < 50) {
          balance = balance * (1 + returnRate) + annualSavings;
          yearsToFire++;
        }
      } else {
        yearsToFire = Math.max(0, (fireNumber - netWorth) / annualSavings);
      }
    }
    const futureValueCurrentSavings = netWorth * Math.pow(1 + returnRate, yearsToFire);
    const futureValueContributions = annualSavings > 0 ? annualSavings * ((Math.pow(1 + returnRate, yearsToFire) - 1) / returnRate) : 0;
    const totalPortfolio = futureValueCurrentSavings + futureValueContributions;
    const totalInvestmentGrowth = totalPortfolio - netWorth - annualSavings * yearsToFire;
    let targetScenario = null;
    if (target > age) {
      const yearsToTarget = target - age;
      const neededAtTarget = fireNumber - netWorth * Math.pow(1 + returnRate, yearsToTarget);
      const monthlyNeededForTarget = neededAtTarget > 0 ? neededAtTarget * (returnRate / 12) / (Math.pow(1 + returnRate / 12, yearsToTarget * 12) - 1) : 0;
      targetScenario = {
        yearsToTarget,
        monthlyNeededForTarget: monthlyNeededForTarget / 12,
        achievable: monthlyNeededForTarget <= savings * 12
      };
    }
    const newResults = {
      fireNumber,
      leanFireNumber,
      fatFireNumber,
      yearsToFire,
      fireAge: age + yearsToFire,
      currentSavingsRate: annualSavings > 0 ? annualSavings / (expenses + annualSavings) * 100 : 0,
      totalPortfolio,
      futureValueCurrentSavings,
      futureValueContributions,
      totalInvestmentGrowth,
      targetScenario,
      monthlyIncomeAtFire: fireNumber * withdrawal / 12
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Current Age", age.toString()],
      ["Current Net Worth", `\xA3${netWorth.toFixed(2)}`],
      ["Annual Expenses", `\xA3${expenses.toFixed(2)}`],
      ["Monthly Savings", `\xA3${savings.toFixed(2)}`],
      ["Expected Return", `${expectedReturn}%`],
      ["Withdrawal Rate", `${withdrawalRate}%`],
      ["", ""],
      ["FIRE Number", `\xA3${fireNumber.toFixed(2)}`],
      ["Years to FIRE", yearsToFire.toFixed(1)],
      ["FIRE Age", newResults.fireAge.toFixed(1)],
      ["Current Savings Rate", `${newResults.currentSavingsRate.toFixed(1)}%`],
      ["Final Portfolio Value", `\xA3${totalPortfolio.toFixed(2)}`],
      ["Monthly Income at FIRE", `\xA3${newResults.monthlyIncomeAtFire.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  const prepareChartData = () => {
    if (!results) return { pieData: [], scenarios: [] };
    const pieData = [
      {
        name: "Current Savings Growth",
        value: results.futureValueCurrentSavings,
        color: CHART_COLORS.currentSavings
      },
      {
        name: "Future Contributions",
        value: results.futureValueContributions,
        color: CHART_COLORS.futureContributions
      },
      {
        name: "Investment Growth",
        value: results.totalInvestmentGrowth,
        color: CHART_COLORS.investmentGrowth
      }
    ];
    const scenarios = [
      { name: "Lean FIRE", value: results.leanFireNumber, color: "#10b981" },
      { name: "Regular FIRE", value: results.fireNumber, color: "#3b82f6" },
      { name: "Fat FIRE", value: results.fatFireNumber, color: "#f59e0b" }
    ];
    return { pieData, scenarios };
  };
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-800 p-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-medium text-gray-900 dark:text-gray-100", children: data.name }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { style: { color: data.color }, children: [
          "\xA3",
          data.value.toLocaleString("en-GB", { maximumFractionDigits: 0 })
        ] })
      ] });
    }
    return null;
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    currentAge,
    currentNetWorth,
    annualExpenses,
    monthlySavings,
    expectedReturn,
    withdrawalRate,
    targetAge
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "\u{1F525} UK FIRE Calculator | Financial Independence Retire Early" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your path to Financial Independence and Early Retirement. Discover when you can retire, how much you need to save, and different FIRE scenarios for your lifestyle." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "FIRE Calculator Results" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-5 h-5 text-orange-500" }),
            "FIRE Calculator"
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current Age" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: currentAge,
                    onChange: (e) => setCurrentAge(e.target.value),
                    placeholder: "e.g. 30"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Target FIRE Age (optional)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: targetAge,
                    onChange: (e) => setTargetAge(e.target.value),
                    placeholder: "e.g. 50"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Current Net Worth" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  Link,
                  {
                    to: createPageUrl("NetWorthCalculator"),
                    className: "text-xs text-blue-600 hover:underline flex items-center gap-1",
                    target: "_blank",
                    children: [
                      "Calculate ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-3 h-3" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: currentNetWorth,
                    onChange: (e) => setCurrentNetWorth(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 50000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Living Expenses" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  Link,
                  {
                    to: createPageUrl("BudgetCalculator"),
                    className: "text-xs text-blue-600 hover:underline flex items-center gap-1",
                    target: "_blank",
                    children: [
                      "Calculate ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-3 h-3" })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: annualExpenses,
                    onChange: (e) => setAnnualExpenses(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 40000"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Your total annual spending needs in retirement" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly Savings" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: monthlySavings,
                    onChange: (e) => setMonthlySavings(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 2000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Expected Annual Return (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: expectedReturn,
                  onChange: (e) => setExpectedReturn(e.target.value),
                  step: "0.5"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Typical range: 6-8% for diversified portfolios" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Safe Withdrawal Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: withdrawalRate, onValueChange: setWithdrawalRate, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "3.25", children: "3.25% (Ultra Conservative)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "3.5", children: "3.5% (Conservative)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "4", children: "4% (Traditional Rule)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "4.5", children: "4.5% (Aggressive)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              Button,
              {
                onClick: handleCalculate,
                className: "w-full text-lg bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                  "Calculate My FIRE Plan"
                ]
              }
            )
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results && results.fireNumber ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your FIRE Plan" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "fire-calculation",
                title: "FIRE Calculation Results"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 border-orange-200 dark:border-orange-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-orange-800 dark:text-orange-300", children: "Your FIRE Number" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-3xl font-bold text-orange-900 dark:text-orange-100", children: [
                    "\xA3",
                    results.fireNumber.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-6 h-6 text-white" }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-orange-700 dark:text-orange-300 mt-2", children: [
                "Based on \xA3",
                Number(annualExpenses).toLocaleString(),
                " annual expenses"
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-green-800 dark:text-green-300", children: "Years to FIRE" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-3xl font-bold text-green-900 dark:text-green-100", children: results.yearsToFire.toFixed(1) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-green-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-6 h-6 text-white" }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-700 dark:text-green-300 mt-2", children: [
                "FIRE at age ",
                results.fireAge.toFixed(0)
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "FIRE Scenarios" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-50 dark:bg-green-900/30 rounded-lg text-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-green-800 dark:text-green-300", children: "Lean FIRE" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: [
                  "\xA3",
                  results.leanFireNumber.toLocaleString()
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-700 dark:text-green-300", children: "~\xA335k/year lifestyle" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg text-center border-2 border-blue-300 dark:border-blue-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-blue-800 dark:text-blue-300", children: "Your FIRE" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: [
                  "\xA3",
                  results.fireNumber.toLocaleString()
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-700 dark:text-blue-300", children: "Your target lifestyle" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-amber-800 dark:text-amber-300", children: "Fat FIRE" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-amber-900 dark:text-amber-100", children: [
                  "\xA3",
                  results.fatFireNumber.toLocaleString()
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-amber-700 dark:text-amber-300", children: "~\xA380k+/year lifestyle" })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6 non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Portfolio Growth Breakdown" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Pie,
                  {
                    data: prepareChartData().pieData,
                    cx: "50%",
                    cy: "50%",
                    outerRadius: 80,
                    dataKey: "value",
                    label: ({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`,
                    children: prepareChartData().pieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomTooltip, {}) })
              ] }) }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Key Metrics" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Savings Rate:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    results.currentSavingsRate.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Income at FIRE:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    "\xA3",
                    results.monthlyIncomeAtFire.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Final Portfolio Value:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    "\xA3",
                    results.totalPortfolio.toLocaleString()
                  ] })
                ] }),
                results.currentSavingsRate < 20 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-3 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-yellow-800 dark:text-yellow-300", children: "\u{1F4A1} Consider increasing your savings rate to reach FIRE faster. Most FIRE achievers save 50%+ of income." }) })
              ] })
            ] })
          ] }),
          results.targetScenario && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Target Age Scenario" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: results.targetScenario.achievable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-green-50 dark:bg-green-900/30 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-green-800 dark:text-green-300", children: [
              "\u2705 Great! You can reach FIRE by age ",
              targetAge,
              " with your current savings plan."
            ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-red-50 dark:bg-red-900/30 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-red-800 dark:text-red-300", children: [
              "\u26A0\uFE0F To reach FIRE by age ",
              targetAge,
              ", you'd need to save \xA3",
              results.targetScenario.monthlyNeededForTarget.toLocaleString(),
              " per month (vs your current \xA3",
              monthlySavings,
              ")."
            ] }) }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to ignite your FIRE journey?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to discover your path to financial independence." })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: fireCalculatorFAQs, title: "FIRE Calculator FAQ" }) }) })
  ] });
}
export {
  FIRECalculator as default
};
