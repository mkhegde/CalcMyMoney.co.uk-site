import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "./chunk-32ETQDIX.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/InvestmentCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var investmentFAQs = [
  {
    question: "What is compound growth?",
    answer: "Compound growth is the 'snowball effect' where your investment earnings start to generate their own earnings. Over time, this can lead to exponential growth."
  },
  {
    question: "What is a realistic annual return rate?",
    answer: "This varies greatly depending on the investment type. The S&P 500 has historically averaged around 10% annually, but past performance is not indicative of future results. A diversified portfolio might aim for 5-8%."
  },
  {
    question: "How do fees impact my investment returns?",
    answer: "Fees can significantly erode your returns over time. A 1% annual fee on a \xA3100,000 portfolio costs you \xA31,000 per year, which could have been compounding and growing. Always look for low-cost investment options where possible."
  }
];
var generateChartData = (initial, monthly, rate, term) => {
  const data = [];
  const monthlyRate = rate / 12;
  for (let year = 0; year <= term; year++) {
    const totalMonths = year * 12;
    const futureValueInitial = initial * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueMonthly = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalValue = futureValueInitial + futureValueMonthly;
    data.push({
      year,
      "Total Investment": totalValue.toFixed(0),
      Principal: (initial + monthly * totalMonths).toFixed(0)
    });
  }
  return data;
};
function InvestmentCalculator() {
  const [initialInvestment, setInitialInvestment] = (0, import_react.useState)("10000");
  const [monthlyContribution, setMonthlyContribution] = (0, import_react.useState)("250");
  const [years, setYears] = (0, import_react.useState)("20");
  const [annualReturn, setAnnualReturn] = (0, import_react.useState)("7");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const initial = Number(initialInvestment) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const term = Number(years) || 0;
    const rate = Number(annualReturn) / 100;
    if (term <= 0 || rate <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyRate = rate / 12;
    const totalMonths = term * 12;
    const futureValueInitial = initial * Math.pow(1 + monthlyRate, totalMonths);
    const futureValueMonthly = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate);
    const totalValue = futureValueInitial + futureValueMonthly;
    const totalPrincipal = initial + monthly * totalMonths;
    const totalInterest = totalValue - totalPrincipal;
    const chartData = generateChartData(initial, monthly, rate, term);
    setResults({
      totalValue,
      totalPrincipal,
      totalInterest,
      chartData
    });
    setHasCalculated(true);
  }, [initialInvestment, monthlyContribution, years, annualReturn]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Investment & Savings Growth Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Visualise the power of compound growth. Project the future value of your investments with regular contributions." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investment Parameters" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Initial Investment" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    value: initialInvestment,
                    onChange: (e) => setInitialInvestment(e.target.value),
                    className: "pl-10",
                    type: "number",
                    inputMode: "numeric",
                    pattern: "[0-9]*"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly Contribution" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    value: monthlyContribution,
                    onChange: (e) => setMonthlyContribution(e.target.value),
                    className: "pl-10",
                    type: "number",
                    inputMode: "numeric",
                    pattern: "[0-9]*"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Time in Years" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  value: years,
                  onChange: (e) => setYears(e.target.value),
                  type: "number",
                  inputMode: "numeric",
                  pattern: "[0-9]*"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estimated Annual Return (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  value: annualReturn,
                  onChange: (e) => setAnnualReturn(e.target.value),
                  type: "number",
                  inputMode: "numeric",
                  pattern: "[0-9]*",
                  step: "0.1"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Growth"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "text-center bg-green-50 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Projected Future Value" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-green-800", children: [
                "\xA3",
                results.totalValue.toLocaleString(void 0, { maximumFractionDigits: 0 })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [
                "after ",
                years,
                " years"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Contributions" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold", children: [
                  "\xA3",
                  results.totalPrincipal.toLocaleString(void 0, {
                    maximumFractionDigits: 0
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Total amount you invested." })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Interest Earned" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold", children: [
                  "\xA3",
                  results.totalInterest.toLocaleString(void 0, {
                    maximumFractionDigits: 0
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "The power of compounding." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Growth Over Time" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, { data: results.chartData, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                XAxis,
                {
                  dataKey: "year",
                  label: { value: "Years", position: "insideBottom", offset: -5 }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tickFormatter: (value) => `\xA3${Number(value) / 1e3}k` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (value) => `\xA3${Number(value).toLocaleString()}` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Line,
                {
                  type: "monotone",
                  dataKey: "Total Investment",
                  stroke: "#16a34a",
                  strokeWidth: 2,
                  dot: false
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Line,
                {
                  type: "monotone",
                  dataKey: "Principal",
                  stroke: "#6b7280",
                  strokeWidth: 2,
                  dot: false
                }
              )
            ] }) }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[400px] bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Project your investment growth" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Fill in your details to see the results." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: investmentFAQs }) })
    ] })
  ] });
}
export {
  InvestmentCalculator as default
};
