import {
  Slider
} from "./chunk-SFFJNVBD.js";
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
  Calendar,
  Percent,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/PersonalLoanCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var personalLoanFAQs = [
  {
    question: "What is an APR on a personal loan?",
    answer: "The Annual Percentage Rate (APR) represents the total cost of borrowing over a year, including the interest rate and any other fees. A lower APR means a cheaper loan."
  },
  {
    question: "How can I get a better interest rate on a personal loan?",
    answer: "Improving your credit score is the most effective way. You can also get better rates by securing the loan against an asset (though this is riskier), choosing a shorter loan term, or shopping around and comparing offers from different lenders."
  },
  {
    question: "What's the difference between a personal loan and a credit card?",
    answer: "A personal loan gives you a fixed lump sum that you repay in fixed monthly instalments over a set term. A credit card offers a revolving line of credit that you can use, repay, and reuse. Loans typically have lower interest rates than credit cards, making them better for large, planned purchases."
  }
];
var generateAmortizationSchedule = (loanAmount, monthlyRate, term) => {
  const schedule = [];
  let balance = loanAmount;
  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
  for (let month = 1; month <= term; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    schedule.push({
      month,
      "Remaining Balance": balance > 0 ? balance : 0,
      "Interest Paid": interestPayment,
      "Principal Paid": principalPayment
    });
  }
  return schedule;
};
function PersonalLoanCalculator() {
  const [loanAmount, setLoanAmount] = (0, import_react.useState)("10000");
  const [interestRate, setInterestRate] = (0, import_react.useState)("5.5");
  const [loanTerm, setLoanTerm] = (0, import_react.useState)("60");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const amount = Number(loanAmount) || 0;
    const rate = Number(interestRate) / 100;
    const term = Number(loanTerm) || 0;
    if (amount <= 0 || rate <= 0 || term <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyRate = rate / 12;
    const monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
    const totalRepayment = monthlyPayment * term;
    const totalInterest = totalRepayment - amount;
    const amortizationData = generateAmortizationSchedule(amount, monthlyRate, term);
    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      loanAmount: amount,
      amortizationData
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Loan Amount", `\xA3${amount.toFixed(2)}`],
      ["Interest Rate (APR)", `${interestRate}%`],
      ["Loan Term", `${term} months`],
      ["Monthly Payment", `\xA3${monthlyPayment.toFixed(2)}`],
      ["Total Interest Paid", `\xA3${totalInterest.toFixed(2)}`],
      ["Total Amount Repaid", `\xA3${totalRepayment.toFixed(2)}`],
      ["---"],
      ["Month", "Principal Paid", "Interest Paid", "Remaining Balance"],
      ...amortizationData.map((row) => [
        row.month,
        `\xA3${row["Principal Paid"].toFixed(2)}`,
        `\xA3${row["Interest Paid"].toFixed(2)}`,
        `\xA3${row["Remaining Balance"].toFixed(2)}`
      ])
    ];
    setCsvData(csvExportData);
  }, [loanAmount, interestRate, loanTerm]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Personal Loan Calculator UK" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your monthly payments, total interest, and see a full repayment schedule for any personal loan." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Personal Loan Calculation" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "loanAmount", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan Amount" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  "\xA3",
                  Number(loanAmount).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "loanAmount",
                    type: "number",
                    value: loanAmount,
                    onChange: (e) => setLoanAmount(e.target.value),
                    className: "pl-10"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(loanAmount)],
                  onValueChange: (value) => setLoanAmount(String(value[0])),
                  max: 5e4,
                  step: 500,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "interestRate", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interest Rate (APR)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  Number(interestRate).toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "interestRate",
                    type: "number",
                    value: interestRate,
                    onChange: (e) => setInterestRate(e.target.value),
                    className: "pl-10"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(interestRate)],
                  onValueChange: (value) => setInterestRate(String(value[0])),
                  max: 25,
                  step: 0.1,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "loanTerm", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan Term (Months)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  loanTerm,
                  " months"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "loanTerm",
                    type: "number",
                    value: loanTerm,
                    onChange: (e) => setLoanTerm(e.target.value),
                    className: "pl-10"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(loanTerm)],
                  onValueChange: (value) => setLoanTerm(String(value[0])),
                  max: 120,
                  step: 12,
                  className: "mt-2"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Loan Repayment Summary" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "personal-loan-summary",
                title: "Personal Loan Summary"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monthly Payment" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-blue-800", children: [
                "\xA3",
                results.monthlyPayment.toFixed(2)
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-red-50", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Interest" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-red-800", children: [
                "\xA3",
                results.totalInterest.toLocaleString("en-GB", {
                  maximumFractionDigits: 2
                })
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gray-100", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Repayment" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-gray-800", children: [
                "\xA3",
                results.totalRepayment.toLocaleString("en-GB", {
                  maximumFractionDigits: 2
                })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Balance Over Time" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, { data: results.amortizationData, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, { strokeDasharray: "3 3" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                XAxis,
                {
                  dataKey: "month",
                  label: { value: "Month", position: "insideBottom", offset: -5 }
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tickFormatter: (value) => `\xA3${(value / 1e3).toFixed(0)}k` }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Tooltip,
                {
                  formatter: (value) => `\xA3${Number(value).toLocaleString(void 0, { maximumFractionDigits: 0 })}`
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Line,
                {
                  type: "monotone",
                  dataKey: "Remaining Balance",
                  stroke: "#3b82f6",
                  strokeWidth: 2,
                  dot: false
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Amortization Schedule" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "max-h-96 overflow-y-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "w-full text-sm text-left", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 sticky top-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Month" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Principal Paid" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Interest Paid" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Remaining Balance" })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: results.amortizationData.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "bg-white border-b hover:bg-gray-50", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-4 py-2", children: row.month }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "px-4 py-2", children: [
                  "\xA3",
                  row["Principal Paid"].toFixed(2)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "px-4 py-2 text-red-600", children: [
                  "\xA3",
                  row["Interest Paid"].toFixed(2)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "px-4 py-2 font-medium", children: [
                  "\xA3",
                  row["Remaining Balance"].toFixed(2)
                ] })
              ] }, row.month)) })
            ] }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Enter your loan details" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Calculate your monthly payments and see your repayment schedule." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: personalLoanFAQs }) }) })
    ] })
  ] });
}
export {
  PersonalLoanCalculator as default
};
