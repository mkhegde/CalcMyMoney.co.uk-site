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
  PoundSterling,
  Target
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SavingsGoalCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function SavingsGoalCalculator() {
  const [goalAmount, setGoalAmount] = (0, import_react.useState)("");
  const [currentSavings, setCurrentSavings] = (0, import_react.useState)("");
  const [monthlySavings, setMonthlySavings] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const goal = Number(goalAmount) || 0;
    const current = Number(currentSavings) || 0;
    const monthly = Number(monthlySavings) || 0;
    const rate = Number(interestRate) || 0;
    if (goal <= current) {
      setResults({
        monthsToGoal: 0,
        yearsToGoal: 0,
        totalContributions: current,
        totalInterest: 0,
        achievable: true
      });
      setHasCalculated(true);
      return;
    }
    if (monthly <= 0) {
      setResults({ achievable: false });
      setHasCalculated(true);
      return;
    }
    const monthlyRate = rate / 100 / 12;
    let balance = current;
    let months = 0;
    let totalContributions = current;
    while (balance < goal && months < 1200) {
      months++;
      balance = balance * (1 + monthlyRate) + monthly;
      totalContributions += monthly;
    }
    const totalInterest = balance - totalContributions;
    const yearsToGoal = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const newResults = {
      monthsToGoal: months,
      yearsToGoal,
      remainingMonths,
      totalContributions,
      totalInterest,
      finalAmount: balance,
      achievable: true
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Goal Amount", `\xA3${goal.toFixed(2)}`],
      ["Current Savings", `\xA3${current.toFixed(2)}`],
      ["Monthly Savings", `\xA3${monthly.toFixed(2)}`],
      ["Interest Rate", `${rate}%`],
      ["", ""],
      ["Time to Goal", `${yearsToGoal}y ${remainingMonths}m`],
      ["Total Contributions", `\xA3${totalContributions.toFixed(2)}`],
      ["Total Interest Earned", `\xA3${totalInterest.toFixed(2)}`],
      ["Final Amount", `\xA3${balance.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [goalAmount, currentSavings, monthlySavings, interestRate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Savings Goal Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Dreams without goals are just wishes. Set a target, make a plan, and watch your savings grow." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Savings Goal" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "goal", children: "Goal Amount" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "goal",
                  type: "number",
                  value: goalAmount,
                  onChange: (e) => setGoalAmount(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 20000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "current", children: "Current Savings" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "current",
                  type: "number",
                  value: currentSavings,
                  onChange: (e) => setCurrentSavings(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 2000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthly", children: "Monthly Savings" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "monthly",
                  type: "number",
                  value: monthlySavings,
                  onChange: (e) => setMonthlySavings(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 500"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interest", children: "Annual Interest Rate (%)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "interest",
                type: "number",
                value: interestRate,
                onChange: (e) => setInterestRate(e.target.value),
                step: "0.1",
                placeholder: "e.g. 4.5"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Timeline"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: results.achievable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Savings Plan" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "savings-goal-plan",
              title: "Savings Goal Plan"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Time to Goal" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-6 bg-green-50 rounded-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-12 h-12 mx-auto text-green-600 mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-green-800", children: [
              results.yearsToGoal,
              "y ",
              results.remainingMonths,
              "m"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-green-700 mt-2", children: "Time to reach your goal" })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Contributions:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                "\xA3",
                results.totalContributions.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interest Earned:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-600", children: [
                "\xA3",
                results.totalInterest.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Final Amount:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-lg", children: [
                "\xA3",
                results.finalAmount.toLocaleString()
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-yellow-50 border-yellow-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-yellow-800", children: "Goal Not Achievable" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-yellow-800", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "With the current monthly savings amount, this goal cannot be reached. Consider:" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside mt-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Increasing your monthly savings" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Extending your timeline" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Looking for higher interest rates" })
          ] })
        ] })
      ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Plan your savings goal" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to see how long it will take." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  SavingsGoalCalculator as default
};
