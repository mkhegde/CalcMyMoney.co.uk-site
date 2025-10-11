import {
  Slider
} from "./chunk-SFFJNVBD.js";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "./chunk-32ETQDIX.js";
import "./chunk-V5SP5FAB.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
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
import "./chunk-RTS3GJRL.js";
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

// src/pages/RetirementSavingsCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var retirementFAQs = [
  {
    question: "How much do I need to save for retirement?",
    answer: "A common rule of thumb is to aim for a retirement pot of 25 times your desired annual income. For example, if you want \xA340,000 a year in retirement, you would aim for a \xA31 million pot. This calculator helps you see if you're on track."
  },
  {
    question: "What is a realistic annual return for investments?",
    answer: "Historically, the average stock market return has been around 7-10% per year. However, this is not guaranteed. A more conservative estimate of 5-7% is often used for long-term planning to account for inflation and fees."
  },
  {
    question: "Should my pension contributions be included in this calculation?",
    answer: "Yes, absolutely. Your current pension pot should be your 'Current Savings', and your monthly pension contributions (including your employer's contribution) should be your 'Monthly Contribution'. This gives you a complete picture of your retirement savings."
  }
];
var generateRetirementChartData = (currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn) => {
  const data = [];
  let savings = currentSavings;
  const monthlyRate = annualReturn / 12;
  for (let age = currentAge; age <= retirementAge; age++) {
    if ((age - currentAge) % 5 === 0 || age === retirementAge) {
      data.push({
        age,
        "Projected Savings": savings,
        "Your Contributions": currentSavings + monthlyContribution * 12 * (age - currentAge)
      });
    }
    for (let month = 0; month < 12; month++) {
      savings = (savings + monthlyContribution) * (1 + monthlyRate);
    }
  }
  return data;
};
function RetirementSavingsCalculator() {
  const [currentAge, setCurrentAge] = (0, import_react.useState)("30");
  const [retirementAge, setRetirementAge] = (0, import_react.useState)("67");
  const [currentSavings, setCurrentSavings] = (0, import_react.useState)("50000");
  const [monthlyContribution, setMonthlyContribution] = (0, import_react.useState)("500");
  const [annualReturn, setAnnualReturn] = (0, import_react.useState)("7");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const age = Number(currentAge) || 0;
    const retireAge = Number(retirementAge) || 0;
    const savings = Number(currentSavings) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const rate = Number(annualReturn) / 100;
    const yearsToGrow = retireAge - age;
    if (yearsToGrow <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const totalMonths = yearsToGrow * 12;
    const monthlyRate = rate / 12;
    const futureValueOfSavings = savings * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueOfContributions = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalPot = futureValueOfSavings + futureValueOfContributions;
    const totalContributions = savings + monthly * totalMonths;
    const totalGrowth = totalPot - totalContributions;
    const chartData = generateRetirementChartData(age, retireAge, savings, monthly, rate);
    const newResults = {
      totalPot,
      totalContributions,
      totalGrowth,
      chartData
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Retirement Pot", `\xA3${totalPot.toFixed(2)}`],
      ["Total Contributions", `\xA3${totalContributions.toFixed(2)}`],
      ["Total Investment Growth", `\xA3${totalGrowth.toFixed(2)}`],
      ["---"],
      ["Age", "Projected Savings", "Your Contributions"],
      ...chartData.map((row) => [
        row.age,
        `\xA3${row["Projected Savings"].toFixed(2)}`,
        `\xA3${row["Your Contributions"].toFixed(2)}`
      ])
    ];
    setCsvData(csvExportData);
  }, [currentAge, retirementAge, currentSavings, monthlyContribution, annualReturn]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Retirement Savings Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Are you saving enough for retirement? Project your pension pot growth and see how much you could have when you retire." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Retirement Savings Projection" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Retirement Plan" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "currentAge", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Current Age" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: currentAge })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(currentAge)],
                  onValueChange: (value) => setCurrentAge(String(value[0])),
                  max: 100,
                  step: 1,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "retirementAge", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Target Retirement Age" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: retirementAge })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(retirementAge)],
                  onValueChange: (value) => setRetirementAge(String(value[0])),
                  max: 100,
                  step: 1,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "currentSavings", children: "Current Savings / Pension Pot" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "currentSavings",
                    type: "number",
                    value: currentSavings,
                    onChange: (e) => setCurrentSavings(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyContribution", children: "Monthly Contribution (incl. employer)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "monthlyContribution",
                    type: "number",
                    value: monthlyContribution,
                    onChange: (e) => setMonthlyContribution(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "annualReturn", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated Annual Return" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  Number(annualReturn).toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(annualReturn)],
                  onValueChange: (value) => setAnnualReturn(String(value[0])),
                  max: 15,
                  step: 0.5,
                  className: "mt-2"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Retirement Projection" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "retirement-projection",
                title: "Retirement Projection"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-800", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-5 h-5" }),
              "Your Estimated Retirement Pot"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-green-900", children: [
                "\xA3",
                results.totalPot.toLocaleString("en-GB", { maximumFractionDigits: 0 })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-gray-600 mt-2", children: [
                "at age ",
                retirementAge
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Contributions" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold", children: [
                  "\xA3",
                  results.totalContributions.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "The total amount you (and your employer) put in." })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Investment Growth" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold text-green-600", children: [
                  "\xA3",
                  results.totalGrowth.toLocaleString("en-GB", { maximumFractionDigits: 0 })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "The money your money made for you." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Savings Growth Over Time" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, { data: results.chartData, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                XAxis,
                {
                  dataKey: "age",
                  label: { value: "Age", position: "insideBottom", offset: -5 }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tickFormatter: (value) => `\xA3${(value / 1e3).toFixed(0)}k` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => `\xA3${Number(value).toLocaleString()}` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Bar,
                {
                  dataKey: "Projected Savings",
                  stackId: "a",
                  fill: "#22c55e",
                  name: "Projected Savings"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Bar,
                {
                  dataKey: "Your Contributions",
                  stackId: "b",
                  fill: "#8884d8",
                  name: "Your Contributions",
                  className: "opacity-0"
                }
              )
            ] }) }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Plan your future" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to project your retirement savings." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: retirementFAQs }) }) })
    ] })
  ] });
}
export {
  RetirementSavingsCalculator as default
};
