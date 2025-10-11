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
  PoundSterling,
  Shield
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/PensionContributionCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var pensionFAQs = [
  {
    question: "What is the minimum pension contribution in the UK?",
    answer: "Under auto-enrolment, the minimum total contribution is 8% of qualifying earnings (between \xA36,240 and \xA350,270 for 2024/25). The employer must contribute at least 3%, with the employee contributing at least 5%."
  },
  {
    question: "How much tax relief do I get on pension contributions?",
    answer: "You get tax relief at your marginal rate. Basic rate taxpayers get 20% relief, higher rate taxpayers get 40%, and additional rate taxpayers get 45%. This effectively reduces the cost of your pension contributions."
  },
  {
    question: "What is the annual allowance for pension contributions?",
    answer: "For 2024/25, the annual allowance is \xA360,000. This is the maximum amount you can contribute to pensions in a tax year while still receiving tax relief. High earners may have a reduced allowance (tapered annual allowance)."
  }
];
function PensionContributionCalculator() {
  const [salary, setSalary] = (0, import_react.useState)("");
  const [employeeContribution, setEmployeeContribution] = (0, import_react.useState)("5");
  const [employerContribution, setEmployerContribution] = (0, import_react.useState)("3");
  const [taxBand, setTaxBand] = (0, import_react.useState)("basic");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const annualSalary = Number(salary) || 0;
    const empContrib = Number(employeeContribution) || 0;
    const emplerContrib = Number(employerContribution) || 0;
    if (annualSalary <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const lowerThreshold = 6240;
    const upperThreshold = 50270;
    const qualifyingEarnings = Math.max(0, Math.min(annualSalary, upperThreshold) - lowerThreshold);
    const employeeContribAmount = qualifyingEarnings * empContrib / 100;
    const employerContribAmount = qualifyingEarnings * emplerContrib / 100;
    const totalContribution = employeeContribAmount + employerContribAmount;
    const taxReliefRates = { basic: 0.2, higher: 0.4, additional: 0.45 };
    const taxRelief = employeeContribAmount * taxReliefRates[taxBand];
    const netCostToEmployee = employeeContribAmount - taxRelief;
    const monthlyEmployeeContrib = employeeContribAmount / 12;
    const monthlyEmployerContrib = employerContribAmount / 12;
    const monthlyNetCost = netCostToEmployee / 12;
    const newResults = {
      qualifyingEarnings,
      employeeContribAmount,
      employerContribAmount,
      totalContribution,
      taxRelief,
      netCostToEmployee,
      monthlyEmployeeContrib,
      monthlyEmployerContrib,
      monthlyNetCost
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Annual", "Monthly"],
      ["Qualifying Earnings", `\xA3${newResults.qualifyingEarnings.toFixed(2)}`, ""],
      [
        "Employee Contribution",
        `\xA3${newResults.employeeContribAmount.toFixed(2)}`,
        `\xA3${newResults.monthlyEmployeeContrib.toFixed(2)}`
      ],
      [
        "Employer Contribution",
        `\xA3${newResults.employerContribAmount.toFixed(2)}`,
        `\xA3${newResults.monthlyEmployerContrib.toFixed(2)}`
      ],
      ["Total Contribution", `\xA3${newResults.totalContribution.toFixed(2)}`, ""],
      ["Tax Relief", `\xA3${newResults.taxRelief.toFixed(2)}`, ""],
      [
        "Net Cost to You",
        `\xA3${newResults.netCostToEmployee.toFixed(2)}`,
        `\xA3${newResults.monthlyNetCost.toFixed(2)}`
      ]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [salary, employeeContribution, employerContribution, taxBand]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Pension Contribution Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your pension contributions, tax relief, and the real cost of building your retirement savings." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Pension Contribution Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "salary", children: "Annual Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "salary",
                    type: "number",
                    value: salary,
                    onChange: (e) => setSalary(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 40000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "employeeContribution", children: "Your Contribution (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "employeeContribution",
                    type: "number",
                    value: employeeContribution,
                    onChange: (e) => setEmployeeContribution(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 5"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Minimum 5% under auto-enrolment" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "employerContribution", children: "Employer Contribution (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "employerContribution",
                    type: "number",
                    value: employerContribution,
                    onChange: (e) => setEmployerContribution(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 3"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Minimum 3% under auto-enrolment" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Your Tax Band" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: taxBand, onValueChange: setTaxBand, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "basic", children: "Basic Rate (20%)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "higher", children: "Higher Rate (40%)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "additional", children: "Additional Rate (45%)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Contributions"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Pension Contributions" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "pension-contributions",
                title: "Pension Contributions"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-green-800 mb-2", children: "Net Monthly Cost to You" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-green-900", children: [
              "\xA3",
              results.monthlyNetCost.toLocaleString("en-GB", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-700", children: [
              "After ",
              taxBand === "basic" ? "20%" : taxBand === "higher" ? "40%" : "45%",
              " tax relief"
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Contributions" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-blue-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-600", children: "Gross Monthly Contribution" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.monthlyEmployeeContrib.toLocaleString("en-GB", {
                      minimumFractionDigits: 2
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-green-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-600", children: "Annual Tax Relief" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.taxRelief.toLocaleString("en-GB", { maximumFractionDigits: 0 })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Employer Contributions" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-purple-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-purple-600", children: "Monthly Employer Contribution" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.monthlyEmployerContrib.toLocaleString("en-GB", {
                      minimumFractionDigits: 2
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-3 bg-gray-50 rounded", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Total Annual Pension Growth" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.totalContribution.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Plan your pension future" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to see contribution costs and tax relief." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: pensionFAQs }) }) })
    ] })
  ] });
}
export {
  PensionContributionCalculator as default
};
