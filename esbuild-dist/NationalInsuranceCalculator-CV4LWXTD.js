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

// src/pages/NationalInsuranceCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var niThresholds = {
  "2025-26": {
    primaryThreshold: 12570,
    upperEarningsLimit: 50270,
    mainRate: 0.08,
    upperRate: 0.02
  }
};
var nationalInsuranceFAQs = [
  {
    question: "What are the different classes of National Insurance?",
    answer: "There are several classes of National Insurance. Class 1 is paid by employees. Class 2 (a flat weekly rate) and Class 4 (a percentage of profits) are paid by self-employed people. Our calculator focuses on Class 1 contributions for employees."
  },
  {
    question: "Do I pay National Insurance on my entire salary?",
    answer: "No. You only start paying National Insurance once your earnings go above the 'Primary Threshold'. You then pay a main rate on earnings between this threshold and the 'Upper Earnings Limit', and a lower rate on any earnings above that."
  },
  {
    question: "How does my age affect National Insurance contributions?",
    answer: "You stop paying Class 1 National Insurance once you reach the State Pension age, even if you continue working. You will need to show your employer proof of your age to ensure they stop deducting it."
  },
  {
    question: "Is National Insurance the same as Income Tax?",
    answer: "No, they are two separate taxes. Income Tax is paid on most types of income, while National Insurance contributions build your entitlement to certain state benefits, such as the State Pension and Employment and Support Allowance."
  }
];
function NationalInsuranceCalculator() {
  const [salary, setSalary] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const breadcrumbPath = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "Tax Calculators", url: `${createPageUrl("Home")}#tax-calculators` },
    { name: "National Insurance Calculator" }
  ];
  const handleCalculate = () => {
    const grossSalary = Number(salary) || 0;
    const year = "2025-26";
    const thresholds = niThresholds[year];
    let niContribution = 0;
    let niBreakdown = [];
    if (grossSalary > thresholds.primaryThreshold) {
      const earningsInMainBand = Math.min(grossSalary, thresholds.upperEarningsLimit) - thresholds.primaryThreshold;
      if (earningsInMainBand > 0) {
        const mainBandNI = earningsInMainBand * thresholds.mainRate;
        niContribution += mainBandNI;
        niBreakdown.push({ band: `Main Rate (${thresholds.mainRate * 100}%)`, amount: mainBandNI });
      }
    }
    if (grossSalary > thresholds.upperEarningsLimit) {
      const earningsInUpperBand = grossSalary - thresholds.upperEarningsLimit;
      const upperBandNI = earningsInUpperBand * thresholds.upperRate;
      niContribution += upperBandNI;
      niBreakdown.push({
        band: `Upper Rate (${thresholds.upperRate * 100}%)`,
        amount: upperBandNI
      });
    }
    const newResults = {
      totalNI: niContribution,
      breakdown: niBreakdown,
      salary: grossSalary
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Description", "Annual", "Monthly", "Weekly"],
      [
        "Gross Salary",
        `\xA3${grossSalary.toFixed(2)}`,
        `\xA3${(grossSalary / 12).toFixed(2)}`,
        `\xA3${(grossSalary / 52).toFixed(2)}`
      ],
      ...niBreakdown.map((item) => [
        item.band,
        `\xA3${item.amount.toFixed(2)}`,
        `\xA3${(item.amount / 12).toFixed(2)}`,
        `\xA3${(item.amount / 52).toFixed(2)}`
      ]),
      [
        "Total National Insurance",
        `\xA3${niContribution.toFixed(2)}`,
        `\xA3${(niContribution / 12).toFixed(2)}`,
        `\xA3${(niContribution / 52).toFixed(2)}`
      ]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
  }, [salary]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { path: breadcrumbPath }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK National Insurance Calculator 2025/26" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Estimate your employee National Insurance contributions for the 2025/26 tax year. See exactly how much you'll pay based on your gross salary." })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Your Salary" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "salary", children: "Gross Annual Salary" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "salary",
                  type: "number",
                  value: salary,
                  onChange: (e) => setSalary(e.target.value),
                  className: "pl-10 dark:bg-gray-700",
                  placeholder: "e.g. 35000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate NI"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your NI Breakdown" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "national-insurance-calculation",
              title: "National Insurance Calculation"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/50 dark:to-indigo-800/50 border-indigo-200 dark:border-indigo-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-indigo-900 dark:text-indigo-200", children: "Total Annual NI Contribution" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-indigo-800 dark:text-indigo-100", children: [
              "\xA3",
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: results.totalNI })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-indigo-700 dark:text-indigo-300 mt-2", children: [
              "\xA3",
              (results.totalNI / 12).toFixed(2),
              " per month"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "How it's calculated" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
            results.breakdown.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium text-gray-800 dark:text-gray-200", children: item.band }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-gray-900 dark:text-gray-100", children: [
                    "\xA3",
                    item.amount.toLocaleString(void 0, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  ] })
                ]
              },
              index
            )),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg font-bold text-gray-900 dark:text-gray-100", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                "\xA3",
                results.totalNI.toLocaleString(void 0, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px] bg-white dark:bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate?" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your salary to see your NI contributions." })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorWrapper, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100", children: "What is National Insurance?" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "National Insurance (NI) is a fundamental tax in the United Kingdom paid by employees, employers, and the self-employed. It plays a crucial role in funding key public services and state benefits. Your NI contributions help to build your entitlement to benefits such as the State Pension, Jobseeker's Allowance, Employment and Support Allowance, and Maternity Allowance. It is a separate deduction from Income Tax, and both are typically taken from your payslip before you receive your net pay." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "When to Use This Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Our National Insurance calculator is a vital tool for understanding your personal finances. You should use it when:" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Starting a new job:" }),
          " To understand how much NI will be deducted from your new salary."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Considering a pay rise:" }),
          " See how an increase in your gross pay affects your NI contributions, especially if it pushes you into a different NI band."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Budgeting:" }),
          " To get an accurate picture of your monthly deductions for better financial planning."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Reviewing your payslip:" }),
          " To check that the NI deductions on your payslip are accurate."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Example Use Case" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Let's say you earn a gross annual salary of \xA340,000. Using the 2025/26 tax year rates, you don't pay NI on the first \xA312,570 of your earnings. On the portion of your salary between \xA312,570 and \xA340,000 (which is \xA327,430), you pay the main rate of 8%. This results in an annual NI contribution of \xA32,194.40. Our calculator breaks this down for you instantly, showing you the exact amounts and how they correspond to the official thresholds." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: nationalInsuranceFAQs }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RelatedCalculators,
      {
        calculators: [
          {
            name: "Salary Calculator",
            url: "/SalaryCalculator",
            description: "See your full take-home pay after all deductions."
          },
          {
            name: "Income Tax Calculator",
            url: "/IncomeTaxCalculator",
            description: "Calculate your income tax liability separately."
          },
          {
            name: "PAYE Calculator",
            url: "/paye-calculator",
            description: "A comprehensive tool for PAYE employees."
          }
        ]
      }
    )
  ] });
}
export {
  NationalInsuranceCalculator as default
};
