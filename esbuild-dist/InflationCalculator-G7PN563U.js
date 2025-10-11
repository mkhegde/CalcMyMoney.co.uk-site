import {
  AnimatedNumber
} from "./chunk-YHKA3VCH.js";
import {
  Breadcrumbs,
  CalculatorWrapper
} from "./chunk-U6RX6SVX.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import "./chunk-ZLF73IFG.js";
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

// src/pages/InflationCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var historicalCPI = {
  1990: 55.6,
  2e3: 72,
  2010: 91.7,
  2015: 100,
  2020: 108.7,
  2024: 133.2
};
var inflationFAQs = [
  {
    question: "What is inflation and how is it measured in the UK?",
    answer: "Inflation is the rate at which the general level of prices for goods and services is rising, and subsequently, purchasing power is falling. In the UK, the most common measure is the Consumer Prices Index (CPI), which tracks the price of a 'basket' of common goods and services over time."
  },
  {
    question: "Why is some inflation considered good for the economy?",
    answer: "A small, stable amount of inflation (typically around 2%) is often seen as a sign of a healthy economy. It can encourage people and businesses to spend and invest rather than hoard cash (which loses value), and it makes it easier for wages and prices to adjust."
  },
  {
    question: "How can I protect my savings from inflation?",
    answer: "To prevent your savings from losing value, you need to earn a rate of return that is higher than the rate of inflation. This can involve investing in assets like stocks and shares, putting money into high-interest savings accounts, or using tax-efficient wrappers like ISAs and pensions."
  },
  {
    question: "Does this calculator use official data?",
    answer: "This calculator uses a simplified model based on historical CPI data for demonstration purposes. While it provides a good estimate of the effects of inflation, for precise financial decisions, you should refer to official sources like the Office for National Statistics (ONS)."
  }
];
function InflationCalculator() {
  const [amount, setAmount] = (0, import_react.useState)("");
  const [startYear, setStartYear] = (0, import_react.useState)("2000");
  const [endYear, setEndYear] = (0, import_react.useState)("2024");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const breadcrumbPath = [
    { name: "Home", url: createPageUrl("Home") },
    {
      name: "Personal Finance & Budgeting",
      url: `${createPageUrl("Home")}#personal-finance-budgeting`
    },
    { name: "Inflation Calculator" }
  ];
  const handleCalculate = () => {
    const startAmount = Number(amount) || 0;
    const startIndex = historicalCPI[startYear];
    const endIndex = historicalCPI[endYear];
    if (startAmount === 0 || !startIndex || !endIndex) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const inflationMultiplier = endIndex / startIndex;
    const futureValue = startAmount * inflationMultiplier;
    const changeInValue = futureValue - startAmount;
    const percentageChange = (futureValue - startAmount) / startAmount * 100;
    const newResults = {
      futureValue,
      startAmount,
      startYear,
      endYear,
      changeInValue,
      percentageChange
    };
    setResults(newResults);
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
  }, [amount, startYear, endYear]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { path: breadcrumbPath }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Inflation Calculator" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Discover the changing value of the pound over time. See how inflation affects purchasing power between different years." })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Calculate Value" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "amount", children: "Amount" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "amount",
                  type: "number",
                  value: amount,
                  onChange: (e) => setAmount(e.target.value),
                  className: "pl-10 dark:bg-gray-700",
                  placeholder: "e.g. 1000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "startYear", children: "Start Year" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "select",
                {
                  id: "startYear",
                  value: startYear,
                  onChange: (e) => setStartYear(e.target.value),
                  className: "w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600",
                  children: Object.keys(historicalCPI).map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: year, children: year }, year))
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "endYear", children: "End Year" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "select",
                {
                  id: "endYear",
                  value: endYear,
                  onChange: (e) => setEndYear(e.target.value),
                  className: "w-full p-2 border rounded-md bg-white dark:bg-gray-700 dark:border-gray-600",
                  children: Object.keys(historicalCPI).map((year) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: year, children: year }, year))
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Results" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/50 dark:to-teal-800/50 border-teal-200 dark:border-teal-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-center text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-lg text-teal-800 dark:text-teal-200", children: [
              "\xA3",
              results.startAmount.toLocaleString()
            ] }),
            " ",
            "in ",
            results.startYear,
            " has the same buying power as..."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-center text-5xl font-bold text-teal-800 dark:text-teal-100 mt-2", children: [
            "\xA3",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: results.futureValue })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-center text-lg font-semibold text-teal-800 dark:text-teal-200 mt-2", children: [
            "in ",
            results.endYear
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Change in Value" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Total Change:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "span",
                {
                  className: `font-bold ${results.changeInValue >= 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`,
                  children: [
                    "\xA3",
                    results.changeInValue.toLocaleString(void 0, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: "Percentage Change:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "span",
                {
                  className: `font-bold ${results.percentageChange >= 0 ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`,
                  children: [
                    results.percentageChange.toFixed(2),
                    "%"
                  ]
                }
              )
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px] bg-white dark:bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "See the power of inflation" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter an amount and years to see how its value has changed." })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorWrapper, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100", children: "What This Calculator Shows" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: `The Inflation Calculator is a tool that demonstrates the concept of "purchasing power." It shows how the value of money erodes over time due to inflation. By inputting an amount and selecting two different years, you can see how much money you would need in the second year to buy the same goods and services you could afford in the first year. It's a powerful way to visualize the real-world impact of economic changes on your personal finances.` }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "When to Use This Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Understanding History:" }),
          " To find out what a historical amount of money (like an inheritance or a salary from decades ago) would be worth today."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Financial Planning:" }),
          " To understand how the value of your savings might decrease over time if they are not growing at a rate higher than inflation."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Setting Savings Goals:" }),
          " When planning for a long-term goal like retirement, it helps to think about the future value of money you'll need, not just the nominal amount."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "General Knowledge:" }),
          " Simply out of curiosity to see how much prices have changed over your lifetime."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Example Use Case" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Suppose your parents bought their first house in 1990 for \xA350,000. You might wonder what that amount is equivalent to today. You can enter \xA350,000 as the amount, set the start year to 1990, and the end year to 2024. The calculator would show you that, due to cumulative inflation over those 34 years, you would need over \xA3119,000 in 2024 to have the same purchasing power as \xA350,000 did back in 1990. This illustrates just how significantly inflation can impact value over the long term." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: inflationFAQs }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RelatedCalculators,
      {
        calculators: [
          {
            name: "Compound Interest Calculator",
            url: "/CompoundInterestCalculator",
            description: "See how your savings can grow to beat inflation."
          },
          {
            name: "Savings Goal Calculator",
            url: "/SavingsGoalCalculator",
            description: "Plan for future goals with inflation in mind."
          },
          {
            name: "Pension Calculator",
            url: "/PensionCalculator",
            description: "Project your retirement pot's future value."
          }
        ]
      }
    )
  ] });
}
export {
  InflationCalculator as default
};
