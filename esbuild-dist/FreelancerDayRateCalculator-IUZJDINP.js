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
  Calendar,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/FreelancerDayRateCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var freelancerFAQs = [
  {
    question: "How should I set my freelance day rate?",
    answer: "Consider your desired annual income, working days per year, business expenses, tax obligations, and market rates. A good rule of thumb is to add 20-30% to the equivalent employee salary to account for additional costs and risks of freelancing."
  },
  {
    question: "What expenses should I factor into my day rate?",
    answer: "Include business expenses like equipment, software, insurance, training, marketing, office costs, and accountancy fees. Also factor in non-billable time spent on administration, business development, and potential gaps between contracts."
  },
  {
    question: "How many working days should I assume per year?",
    answer: "Most freelancers work 220-240 billable days per year, accounting for holidays, sick days, and time spent on business development. New freelancers might start with 200 days to be conservative."
  }
];
function FreelancerDayRateCalculator() {
  const [desiredIncome, setDesiredIncome] = (0, import_react.useState)("");
  const [workingDays, setWorkingDays] = (0, import_react.useState)("220");
  const [businessExpenses, setBusinessExpenses] = (0, import_react.useState)("");
  const [taxRate, setTaxRate] = (0, import_react.useState)("30");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const targetIncome = Number(desiredIncome) || 0;
    const billableDays = Number(workingDays) || 0;
    const expenses = Number(businessExpenses) || 0;
    const taxRatePercent = Number(taxRate) || 0;
    if (targetIncome <= 0 || billableDays <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const taxAmount = targetIncome * taxRatePercent / 100;
    const grossRevenueNeeded = targetIncome + taxAmount + expenses;
    const dayRate = grossRevenueNeeded / billableDays;
    const hourlyRate = dayRate / 8;
    const annualRevenue = dayRate * billableDays;
    const netAfterTaxAndExpenses = annualRevenue - taxAmount - expenses;
    const newResults = {
      dayRate,
      hourlyRate,
      annualRevenue,
      netAfterTaxAndExpenses,
      taxAmount,
      expenses,
      workingDays: billableDays
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Recommended Day Rate", `\xA3${newResults.dayRate.toFixed(2)}`],
      ["Equivalent Hourly Rate", `\xA3${newResults.hourlyRate.toFixed(2)}`],
      ["Annual Revenue", `\xA3${newResults.annualRevenue.toFixed(2)}`],
      ["Less: Estimated Tax", `-\xA3${newResults.taxAmount.toFixed(2)}`],
      ["Less: Business Expenses", `-\xA3${newResults.expenses.toFixed(2)}`],
      ["Net Income", `\xA3${newResults.netAfterTaxAndExpenses.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [desiredIncome, workingDays, businessExpenses, taxRate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Freelancer Day Rate Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate the optimal day rate for your freelance work, factoring in taxes, expenses, and desired take-home income." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Freelancer Day Rate Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Freelance Goals" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "desiredIncome", children: "Desired Net Annual Income" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "desiredIncome",
                    type: "number",
                    value: desiredIncome,
                    onChange: (e) => setDesiredIncome(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 50000"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "What you want to take home after all costs" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "workingDays", children: "Billable Days Per Year" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "workingDays",
                    type: "number",
                    value: workingDays,
                    onChange: (e) => setWorkingDays(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 220"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Excluding holidays, sick days, and admin time" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "businessExpenses", children: "Annual Business Expenses" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "businessExpenses",
                    type: "number",
                    value: businessExpenses,
                    onChange: (e) => setBusinessExpenses(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 5000"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Equipment, software, insurance, training, etc." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Estimated Tax Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: taxRate, onValueChange: setTaxRate, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "20", children: "20% (Basic rate taxpayer)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "30", children: "30% (Inc. NI & some corp tax)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "40", children: "40% (Higher rate taxpayer)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "50", children: "50% (Additional rate + NI)" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Day Rate"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Recommended Rates" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "freelancer-day-rate",
                title: "Freelancer Day Rate"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-blue-50 border-blue-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-blue-800 mb-2", children: "Day Rate" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-3xl font-bold text-blue-900", children: [
                "\xA3",
                results.dayRate.toLocaleString("en-GB", { maximumFractionDigits: 0 })
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-purple-50 border-purple-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-purple-800 mb-2", children: "Hourly Rate" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-3xl font-bold text-purple-900", children: [
                "\xA3",
                results.hourlyRate.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Financial Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-green-50 rounded", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "Annual Revenue (",
                  results.workingDays,
                  " days)"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-800", children: [
                  "\xA3",
                  results.annualRevenue.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-red-50 rounded", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Less: Estimated Tax" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-800", children: [
                  "-\xA3",
                  results.taxAmount.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-3 bg-yellow-50 rounded", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Less: Business Expenses" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-yellow-800", children: [
                  "-\xA3",
                  results.expenses.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between p-4 bg-green-100 rounded font-bold", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net Take-Home Income" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-green-900", children: [
                  "\xA3",
                  results.netAfterTaxAndExpenses.toLocaleString()
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to price your services?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your financial goals to calculate optimal rates." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: freelancerFAQs }) }) })
    ] })
  ] });
}
export {
  FreelancerDayRateCalculator as default
};
