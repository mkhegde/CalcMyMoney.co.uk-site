import {
  Slider
} from "./chunk-SFFJNVBD.js";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
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
  Car,
  Percent,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/CarLoanCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var carLoanFAQs = [
  {
    question: "What is PCP vs HP?",
    answer: "Hire Purchase (HP) means you pay off the car in monthly instalments and own it at the end. Personal Contract Purchase (PCP) has lower monthly payments, but at the end you can either pay a large 'balloon' payment to own the car, trade it in for a new one, or hand it back."
  },
  {
    question: "How does my credit score affect my car loan?",
    answer: "A better credit score generally gets you access to lower Annual Percentage Rates (APR), which means you'll pay less interest over the life of the loan. Lenders see you as a lower risk."
  },
  {
    question: "Should I pay a deposit on a car loan?",
    answer: "Yes, paying a larger deposit is usually beneficial. It reduces the amount you need to borrow, which lowers your monthly payments and the total interest you'll pay. It can also improve your chances of being approved for the loan."
  }
];
var CHART_COLORS = {
  principal: "#3b82f6",
  // blue
  interest: "#ef4444"
  // red
};
function CarLoanCalculator() {
  const [vehiclePrice, setVehiclePrice] = (0, import_react.useState)("");
  const [deposit, setDeposit] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [loanTerm, setLoanTerm] = (0, import_react.useState)("48");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const price = Number(vehiclePrice) || 0;
    const dep = Number(deposit) || 0;
    const rate = Number(interestRate) / 100;
    const term = Number(loanTerm) || 0;
    const loanAmount = price - dep;
    if (loanAmount <= 0 || rate <= 0 || term <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyRate = rate / 12;
    const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
    const totalRepayment = monthlyPayment * term;
    const totalInterest = totalRepayment - loanAmount;
    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      loanAmount,
      vehiclePrice: price,
      deposit: dep
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Vehicle Price", `\xA3${price.toFixed(2)}`],
      ["Deposit", `\xA3${dep.toFixed(2)}`],
      ["Loan Amount", `\xA3${loanAmount.toFixed(2)}`],
      ["Interest Rate (APR)", `${interestRate}%`],
      ["Loan Term", `${term} months`],
      ["Monthly Payment", `\xA3${monthlyPayment.toFixed(2)}`],
      ["Total Interest Paid", `\xA3${totalInterest.toFixed(2)}`],
      ["Total Amount Repaid", `\xA3${totalRepayment.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  }, [vehiclePrice, deposit, interestRate, loanTerm]);
  const pieData = results ? [
    { name: "Principal", value: results.loanAmount, color: CHART_COLORS.principal },
    { name: "Interest", value: results.totalInterest, color: CHART_COLORS.interest }
  ] : [];
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Car Loan & Finance Calculator UK" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Work out your monthly payments and total interest for HP & PCP car finance deals." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Finance Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "vehiclePrice", children: "Vehicle Price" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "vehiclePrice",
                    type: "number",
                    value: vehiclePrice,
                    onChange: (e) => setVehiclePrice(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 20000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "deposit", children: "Deposit" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "deposit",
                    type: "number",
                    value: deposit,
                    onChange: (e) => setDeposit(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 2000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Interest Rate (APR)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "interestRate",
                    type: "number",
                    value: interestRate,
                    onChange: (e) => setInterestRate(e.target.value),
                    className: "pr-10",
                    placeholder: "e.g. 7.5"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "loanTerm", children: [
                "Loan Term (",
                loanTerm,
                " months)"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  id: "loanTerm",
                  value: [loanTerm],
                  onValueChange: (val) => setLoanTerm(val[0]),
                  min: 12,
                  max: 84,
                  step: 1
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Car Loan Results" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "car-loan-summary",
                title: "Car Loan Summary"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "text-center bg-blue-50 border-blue-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monthly Payment" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-blue-800", children: [
              "\xA3",
              results.monthlyPayment.toFixed(2)
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Summary" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Vehicle Price:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                    "\xA3",
                    results.vehiclePrice.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deposit:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                    "- \xA3",
                    results.deposit.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Loan Amount:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    "\xA3",
                    results.loanAmount.toLocaleString()
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Cost Breakdown" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Repayments:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                    "\xA3",
                    results.totalRepayment.toLocaleString(void 0, {
                      maximumFractionDigits: 2
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Interest:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium text-red-600", children: [
                    "\xA3",
                    results.totalInterest.toLocaleString(void 0, {
                      maximumFractionDigits: 2
                    })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Cost Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Pie,
                {
                  data: pieData,
                  dataKey: "value",
                  nameKey: "name",
                  cx: "50%",
                  cy: "50%",
                  outerRadius: 80,
                  label: true,
                  children: pieData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, `cell-${index}`))
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {})
            ] }) }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px] bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "See your car loan details" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your finance info to get started." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: carLoanFAQs }) })
    ] })
  ] });
}
export {
  CarLoanCalculator as default
};
