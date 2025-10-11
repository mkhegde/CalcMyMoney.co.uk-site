import {
  Slider
} from "./chunk-SFFJNVBD.js";
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
  Building2,
  Calculator,
  PoundSterling,
  User
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/PayrollCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var payrollFAQs = [
  {
    question: "What are an employer's main payroll costs?",
    answer: "Besides the employee's gross salary, the main costs for an employer are Employer's National Insurance contributions and mandatory employer pension contributions."
  },
  {
    question: "How much is Employer's National Insurance?",
    answer: "For the 2025/26 tax year, Employer's NI is 13.8% on all earnings above the Secondary Threshold, which is \xA39,100 per year (\xA3175 per week)."
  },
  {
    question: "What are the minimum employer pension contributions?",
    answer: "Under auto-enrolment rules, the minimum employer contribution is 3% of the employee's 'qualifying earnings' (between \xA36,240 and \xA350,270 per year)."
  }
];
var employeeNIThresholds = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12571, max: 50270, rate: 0.08 },
  { min: 50271, max: Infinity, rate: 0.02 }
];
var employerNIThreshold = 9100;
var employerNIRate = 0.138;
var pensionQualifyingMin = 6240;
var pensionQualifyingMax = 50270;
function PayrollCalculator() {
  const [grossSalary, setGrossSalary] = (0, import_react.useState)("35000");
  const [employerPension, setEmployerPension] = (0, import_react.useState)("3");
  const [employeePension, setEmployeePension] = (0, import_react.useState)("5");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const salary = Number(grossSalary) || 0;
    const employerPensionRate = (Number(employerPension) || 0) / 100;
    const employeePensionRate = (Number(employeePension) || 0) / 100;
    if (salary <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const employerNI = salary > employerNIThreshold ? (salary - employerNIThreshold) * employerNIRate : 0;
    const qualifyingEarnings = Math.max(
      0,
      Math.min(salary, pensionQualifyingMax) - pensionQualifyingMin
    );
    const employerPensionContribution = qualifyingEarnings * employerPensionRate;
    const totalCostToEmployer = salary + employerNI + employerPensionContribution;
    const employeePensionContribution = qualifyingEarnings * employeePensionRate;
    const salaryAfterPension = salary - employeePensionContribution;
    let personalAllowance = 12570;
    if (salaryAfterPension > 1e5) {
      personalAllowance = Math.max(0, 12570 - (salaryAfterPension - 1e5) / 2);
    }
    const taxableIncome = Math.max(0, salaryAfterPension - personalAllowance);
    let tax = 0;
    if (taxableIncome > 0) {
      const basicRateBand = 50270 - personalAllowance;
      const higherRateBand = 125140 - 50270;
      if (taxableIncome <= basicRateBand) {
        tax = taxableIncome * 0.2;
      } else {
        tax = basicRateBand * 0.2;
        const remainingTaxable = taxableIncome - basicRateBand;
        if (remainingTaxable <= higherRateBand) {
          tax += remainingTaxable * 0.4;
        } else {
          tax += higherRateBand * 0.4;
          const additionalRateTaxable = remainingTaxable - higherRateBand;
          tax += additionalRateTaxable * 0.45;
        }
      }
    }
    let employeeNI = 0;
    for (const threshold of employeeNIThresholds) {
      if (salary > threshold.min) {
        const niableAmount = Math.min(salary, threshold.max) - threshold.min;
        if (niableAmount > 0) {
          employeeNI += niableAmount * threshold.rate;
        }
      }
    }
    const totalDeductions = tax + employeeNI + employeePensionContribution;
    const netPay = salary - totalDeductions;
    const newResults = {
      grossSalary: salary,
      employerNI,
      employerPensionContribution,
      totalCostToEmployer,
      employeePensionContribution,
      tax,
      employeeNI,
      netPay
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Category", "Description", "Annual", "Monthly"],
      ["Employer Costs", "Gross Salary", `\xA3${salary.toFixed(2)}`, `\xA3${(salary / 12).toFixed(2)}`],
      [
        "Employer Costs",
        "Employer's NI",
        `\xA3${employerNI.toFixed(2)}`,
        `\xA3${(employerNI / 12).toFixed(2)}`
      ],
      [
        "Employer Costs",
        "Employer Pension",
        `\xA3${employerPensionContribution.toFixed(2)}`,
        `\xA3${(employerPensionContribution / 12).toFixed(2)}`
      ],
      [
        "Employer Costs",
        "Total Cost to Employ",
        `\xA3${totalCostToEmployer.toFixed(2)}`,
        `\xA3${(totalCostToEmployer / 12).toFixed(2)}`
      ],
      ["---"],
      [
        "Employee's Payslip",
        "Gross Salary",
        `\xA3${salary.toFixed(2)}`,
        `\xA3${(salary / 12).toFixed(2)}`
      ],
      ["Employee's Payslip", "Income Tax", `-\xA3${tax.toFixed(2)}`, `-\xA3${(tax / 12).toFixed(2)}`],
      [
        "Employee's Payslip",
        "Employee's NI",
        `-\xA3${employeeNI.toFixed(2)}`,
        `-\xA3${(employeeNI / 12).toFixed(2)}`
      ],
      [
        "Employee's Payslip",
        "Employee Pension",
        `-\xA3${employeePensionContribution.toFixed(2)}`,
        `-\xA3${(employeePensionContribution / 12).toFixed(2)}`
      ],
      [
        "Employee's Payslip",
        "Net Take-Home Pay",
        `\xA3${netPay.toFixed(2)}`,
        `\xA3${(netPay / 12).toFixed(2)}`
      ]
    ];
    setCsvData(csvExportData);
  }, [grossSalary, employerPension, employeePension]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Payroll Calculator for Employers" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Estimate the total cost of hiring an employee and see a breakdown of their take-home pay. Updated for 2025/26 tax year." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Payroll Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Employee Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossSalary", children: "Employee Gross Annual Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "grossSalary",
                    type: "number",
                    value: grossSalary,
                    onChange: (e) => setGrossSalary(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "employerPension", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employer Pension Contribution" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  employerPension,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(employerPension)],
                  onValueChange: (value) => setEmployerPension(String(value[0])),
                  max: 15,
                  step: 0.5,
                  className: "mt-2"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Minimum is 3% of qualifying earnings." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "employeePension", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employee Pension Contribution" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  employeePension,
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(employeePension)],
                  onValueChange: (value) => setEmployeePension(String(value[0])),
                  max: 15,
                  step: 0.5,
                  className: "mt-2"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Minimum is 5% of qualifying earnings." })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Payroll Summary" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "payroll-summary",
                title: "Payroll Summary"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-blue-800", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "w-5 h-5" }),
              "Employer's Costs"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gross Salary" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "\xA3",
                  results.grossSalary.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Employer's NI" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "\xA3",
                  results.employerNI.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Employer Pension" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "\xA3",
                  results.employerPensionContribution.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-xl font-bold pt-2 border-t mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Total Cost to Employ" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "\xA3",
                  results.totalCostToEmployer.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-5 h-5" }),
              "Employee's Take-Home Pay"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gross Salary" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "\xA3",
                  results.grossSalary.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Income Tax" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "- \xA3",
                  results.tax.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Employee's NI" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "- \xA3",
                  results.employeeNI.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-red-600", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Employee Pension" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "- \xA3",
                  results.employeePensionContribution.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-lg font-bold pt-2 border-t mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Net Take-Home Pay" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "\xA3",
                  results.netPay.toLocaleString("en-GB", { maximumFractionDigits: 2 })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Calculate payroll costs" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter an employee's salary to see the full breakdown." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: payrollFAQs }) }) })
    ] })
  ] });
}
export {
  PayrollCalculator as default
};
