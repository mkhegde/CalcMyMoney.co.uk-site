import {
  AnimatedNumber
} from "./chunk-YHKA3VCH.js";
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
  ArrowRightLeft,
  Briefcase,
  Building,
  Calculator
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/ContractorCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var contractorFAQs = [
  {
    question: "What is IR35?",
    answer: "IR35 (or the 'off-payroll working rules') is UK tax legislation designed to identify 'disguised employees' \u2013 contractors who work in a similar way to permanent employees but operate through their own limited company to pay less tax. If your contract is 'inside IR35', you're treated as an employee for tax purposes."
  },
  {
    question: "What's the difference between 'Inside IR35' and 'Outside IR35'?",
    answer: "'Inside IR35' means you are a deemed employee, and your income is subject to PAYE (Income Tax and National Insurance) just like a regular employee. 'Outside IR35' means you are a genuine business-to-business service provider, and your company pays Corporation Tax on profits. You then draw funds via a mix of salary and dividends."
  },
  {
    question: "Who pays Employer's National Insurance for Inside IR35 roles?",
    answer: "The 'fee payer' (usually the recruitment agency or the end client) is responsible for paying Employer's NI. However, they often deduct this cost from the day rate offered to the contractor, effectively reducing the contractor's gross income."
  },
  {
    question: "What are common business expenses for an Outside IR35 contractor?",
    answer: "Allowable expenses can include professional indemnity insurance, accountancy fees, software subscriptions, office costs, business travel, and a portion of home-as-office costs. These reduce your company's profit and therefore its Corporation Tax bill."
  },
  {
    question: "Why take a small salary and dividends when Outside IR35?",
    answer: "This is a tax-efficient way to extract profit. A small salary is usually set at or below the National Insurance threshold, so little to no NI or income tax is paid. The remaining profit, after Corporation Tax, is then drawn as dividends, which have lower tax rates than income tax."
  }
];
var taxYearData = {
  taxBracketsEngland: [
    { min: 0, max: 12570, rate: 0 },
    { min: 12571, max: 50270, rate: 0.2 },
    { min: 50271, max: 125140, rate: 0.4 },
    { min: 125141, max: Infinity, rate: 0.45 }
  ],
  taxBracketsScotland: [
    { min: 0, max: 12570, rate: 0 },
    { min: 12571, max: 14876, rate: 0.19 },
    { min: 14877, max: 26561, rate: 0.2 },
    { min: 26562, max: 43662, rate: 0.21 },
    { min: 43663, max: 75e3, rate: 0.42 },
    { min: 75001, max: 125140, rate: 0.45 },
    { min: 125141, max: Infinity, rate: 0.48 }
  ],
  employeeNiThresholds: [
    { min: 0, max: 12570, rate: 0 },
    { min: 12571, max: 50270, rate: 0.08 },
    { min: 50271, max: Infinity, rate: 0.02 }
  ],
  employerNiRate: 0.138,
  employerNiThreshold: 9100,
  corporationTax: {
    mainRate: 0.25,
    smallProfitRate: 0.19,
    lowerThreshold: 5e4,
    upperThreshold: 25e4
  },
  dividendAllowance: 500,
  dividendRates: { basic: 0.0875, higher: 0.3375, additional: 0.3935 },
  personalAllowance: 12570
};
function ContractorCalculator() {
  const [dayRate, setDayRate] = (0, import_react.useState)("");
  const [daysPerWeek, setDaysPerWeek] = (0, import_react.useState)("5");
  const [weeksPerYear, setWeeksPerYear] = (0, import_react.useState)("48");
  const [businessExpenses, setBusinessExpenses] = (0, import_react.useState)("");
  const [pensionContribution, setPensionContribution] = (0, import_react.useState)("5");
  const [location, setLocation] = (0, import_react.useState)("england");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const calculateTakeHome = () => {
    const rate = Number(dayRate) || 0;
    const days = Number(daysPerWeek) || 0;
    const weeks = Number(weeksPerYear) || 0;
    const expenses = Number(businessExpenses) || 0;
    const pensionPercent = Number(pensionContribution) / 100 || 0;
    const totalRevenue = rate * days * weeks;
    if (totalRevenue === 0) {
      setHasCalculated(true);
      setResults(null);
      return;
    }
    const employerNI = Math.max(
      0,
      (totalRevenue - taxYearData.employerNiThreshold) * taxYearData.employerNiRate
    );
    const grossSalaryInside = totalRevenue - employerNI;
    const pensionInside = grossSalaryInside * pensionPercent;
    let personalAllowance = taxYearData.personalAllowance;
    if (grossSalaryInside > 1e5) {
      personalAllowance = Math.max(0, personalAllowance - (grossSalaryInside - 1e5) / 2);
    }
    const taxableIncomeInside = Math.max(0, grossSalaryInside - pensionInside - personalAllowance);
    const taxBrackets = location === "scotland" ? taxYearData.taxBracketsScotland : taxYearData.taxBracketsEngland;
    let taxInside = 0;
    for (const bracket of taxBrackets) {
      if (taxableIncomeInside > bracket.min) {
        const amountInBracket = Math.min(taxableIncomeInside, bracket.max) - bracket.min;
        taxInside += amountInBracket * bracket.rate;
      }
    }
    let niInside = 0;
    for (const threshold of taxYearData.employeeNiThresholds) {
      if (grossSalaryInside > threshold.min) {
        const niableInThreshold = Math.min(grossSalaryInside, threshold.max) - threshold.min;
        niInside += niableInThreshold * threshold.rate;
      }
    }
    const takeHomeInside = grossSalaryInside - taxInside - niInside - pensionInside;
    const directorSalary = taxYearData.personalAllowance;
    const pensionOutside = (totalRevenue - directorSalary) * pensionPercent;
    const companyProfitBeforeTax = totalRevenue - expenses - directorSalary - pensionOutside;
    let corporationTax = 0;
    if (companyProfitBeforeTax > taxYearData.corporationTax.lowerThreshold) {
      if (companyProfitBeforeTax > taxYearData.corporationTax.upperThreshold) {
        corporationTax = companyProfitBeforeTax * taxYearData.corporationTax.mainRate;
      } else {
        const marginalRelief = (taxYearData.corporationTax.upperThreshold - companyProfitBeforeTax) * (3 / 200);
        corporationTax = companyProfitBeforeTax * taxYearData.corporationTax.mainRate - marginalRelief;
      }
    } else {
      corporationTax = companyProfitBeforeTax * taxYearData.corporationTax.smallProfitRate;
    }
    corporationTax = Math.max(0, corporationTax);
    const profitAfterTax = companyProfitBeforeTax - corporationTax;
    const availableDividends = profitAfterTax;
    const dividendTaxableIncome = directorSalary + availableDividends;
    let personalAllowanceDividends = taxYearData.personalAllowance;
    if (dividendTaxableIncome > 1e5) {
      personalAllowanceDividends = Math.max(
        0,
        personalAllowanceDividends - (dividendTaxableIncome - 1e5) / 2
      );
    }
    const taxableDividends = Math.max(0, availableDividends - taxYearData.dividendAllowance);
    let dividendTax = 0;
    let remainingDividends = taxableDividends;
    const basicRateBand = taxBrackets[1].max - personalAllowanceDividends;
    const higherRateBand = taxBrackets[2].max - taxBrackets[1].max;
    const basicTaxable = Math.min(remainingDividends, basicRateBand);
    dividendTax += basicTaxable * taxYearData.dividendRates.basic;
    remainingDividends -= basicTaxable;
    const higherTaxable = Math.min(remainingDividends, higherRateBand);
    dividendTax += higherTaxable * taxYearData.dividendRates.higher;
    remainingDividends -= higherTaxable;
    dividendTax += remainingDividends * taxYearData.dividendRates.additional;
    const takeHomeOutside = directorSalary + availableDividends - dividendTax;
    const newResults = {
      inside: {
        takeHome: takeHomeInside,
        gross: grossSalaryInside,
        tax: taxInside,
        ni: niInside,
        pension: pensionInside,
        employerNI
      },
      outside: {
        takeHome: takeHomeOutside,
        revenue: totalRevenue,
        corporationTax,
        dividendTax,
        directorSalary,
        dividends: availableDividends,
        expenses,
        pension: pensionOutside
      }
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Inside IR35", "Outside IR35"],
      ["Day Rate", `\xA3${rate}`, `\xA3${rate}`],
      ["Total Revenue", `\xA3${totalRevenue.toFixed(2)}`, `\xA3${totalRevenue.toFixed(2)}`],
      ["", "", ""],
      ["--- Deductions ---", "", ""],
      ["Employer's NI", `\xA3${employerNI.toFixed(2)}`, "N/A"],
      ["Business Expenses", "N/A", `\xA3${expenses.toFixed(2)}`],
      ["Corporation Tax", "N/A", `\xA3${corporationTax.toFixed(2)}`],
      ["Income Tax", `\xA3${taxInside.toFixed(2)}`, "N/A (covered by Dividend Tax)"],
      ["Employee's NI", `\xA3${niInside.toFixed(2)}`, "N/A (on salary below threshold)"],
      ["Dividend Tax", "N/A", `\xA3${dividendTax.toFixed(2)}`],
      ["Pension Contribution", `\xA3${pensionInside.toFixed(2)}`, `\xA3${pensionOutside.toFixed(2)}`],
      ["", "", ""],
      ["--- Take Home Pay ---", "", ""],
      ["Annual", `\xA3${takeHomeInside.toFixed(2)}`, `\xA3${takeHomeOutside.toFixed(2)}`],
      ["Monthly", `\xA3${(takeHomeInside / 12).toFixed(2)}`, `\xA3${(takeHomeOutside / 12).toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
  }, [dayRate, daysPerWeek, weeksPerYear, businessExpenses, pensionContribution, location]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Contractor Calculator (IR35) 2025/26" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Compare your take-home pay for contracts inside and outside IR35. Understand the tax implications of being a deemed employee vs. a limited company director." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Contract Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Day Rate (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: dayRate,
                onChange: (e) => setDayRate(e.target.value),
                placeholder: "e.g. 500"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Days / Week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: daysPerWeek,
                  onChange: (e) => setDaysPerWeek(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Weeks / Year" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: weeksPerYear,
                  onChange: (e) => setWeeksPerYear(e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Business Expenses (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: businessExpenses,
                onChange: (e) => setBusinessExpenses(e.target.value),
                placeholder: "e.g. 3000 (for Outside IR35)"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pension Contribution (%)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: pensionContribution,
                onChange: (e) => setPensionContribution(e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tax Location" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: location, onValueChange: setLocation, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "england", children: "England, Wales or NI" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "scotland", children: "Scotland" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: calculateTakeHome, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Compare Scenarios"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your Comparison" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "ir35-comparison",
              title: "IR35 Comparison"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 border-orange-200 dark:border-orange-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-orange-800 dark:text-orange-300", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, {}),
              " Inside IR35"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-orange-700 dark:text-orange-400", children: "Annual Take-Home" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-orange-900 dark:text-orange-100", children: [
                "\xA3",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: results.inside.takeHome })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-orange-700 dark:text-orange-400 mt-2", children: [
                "\xA3",
                (results.inside.takeHome / 12).toLocaleString(),
                " / month"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-200 dark:border-green-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-800 dark:text-green-300", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, {}),
              " Outside IR35"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-green-700 dark:text-green-400", children: "Annual Take-Home" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-green-900 dark:text-green-100", children: [
                "\xA3",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: results.outside.takeHome })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-700 dark:text-green-400 mt-2", children: [
                "\xA3",
                (results.outside.takeHome / 12).toLocaleString(),
                " / month"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Comparison Breakdown" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-3 items-center gap-2 text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-left", children: "Metric" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-orange-800 dark:text-orange-300", children: "Inside IR35" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold text-green-800 dark:text-green-300", children: "Outside IR35" })
            ] }),
            [
              {
                label: "Total Revenue",
                inside: results.outside.revenue,
                outside: results.outside.revenue
              },
              {
                label: "Gross Income (after Employer NI)",
                inside: results.inside.gross,
                outside: "N/A"
              },
              {
                label: "Corporation Tax",
                inside: "N/A",
                outside: -results.outside.corporationTax
              },
              { label: "Income Tax", inside: -results.inside.tax, outside: "N/A" },
              {
                label: "Dividend Tax",
                inside: "N/A",
                outside: -results.outside.dividendTax
              },
              { label: "Employee NI", inside: -results.inside.ni, outside: "N/A" },
              {
                label: "Pension",
                inside: -results.inside.pension,
                outside: -results.outside.pension
              },
              { label: "Expenses", inside: "N/A", outside: -results.outside.expenses }
            ].map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "grid grid-cols-3 items-center gap-2 text-center p-2 rounded-md odd:bg-gray-50 dark:odd:bg-gray-800/50",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-left text-sm", children: row.label }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-mono", children: typeof row.inside === "number" ? `\xA3${row.inside.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : row.inside }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-sm font-mono", children: typeof row.outside === "number" ? `\xA3${row.outside.toLocaleString(void 0, { maximumFractionDigits: 0 })}` : row.outside })
                ]
              },
              row.label
            )),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-3 items-center gap-2 text-center p-3 rounded-md bg-blue-50 dark:bg-blue-900/30 border-t-2 border-blue-200 dark:border-blue-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-left", children: "Net Take-Home (Annual)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-orange-800 dark:text-orange-300", children: [
                "\xA3",
                results.inside.takeHome.toLocaleString(void 0, {
                  maximumFractionDigits: 0
                })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-green-800 dark:text-green-300", children: [
                "\xA3",
                results.outside.takeHome.toLocaleString(void 0, {
                  maximumFractionDigits: 0
                })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg text-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "font-semibold text-yellow-900 dark:text-yellow-200", children: [
              "Difference:",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "span",
                {
                  className: results.outside.takeHome > results.inside.takeHome ? "text-green-600" : "text-red-600",
                  children: [
                    " ",
                    "\xA3",
                    (results.outside.takeHome - results.inside.takeHome).toLocaleString(
                      void 0,
                      { maximumFractionDigits: 0 }
                    )
                  ]
                }
              ),
              " ",
              "annually when Outside IR35"
            ] }) })
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Compare your contract scenarios" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your contract details to see the financial difference between working inside and outside IR35." })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: contractorFAQs, title: "Contractor & IR35 FAQ" }) }) })
  ] });
}
export {
  ContractorCalculator as default
};
