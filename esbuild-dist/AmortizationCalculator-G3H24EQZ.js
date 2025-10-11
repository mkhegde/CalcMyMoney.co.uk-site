import {
  Slider
} from "./chunk-SFFJNVBD.js";
import {
  Area,
  AreaChart,
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
import "./chunk-KK4JIGNC.js";
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
  FileSpreadsheet
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/AmortizationCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var amortizationFAQs = [
  {
    question: "What is a loan amortization schedule?",
    answer: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term."
  },
  {
    question: "How does amortization work?",
    answer: "With each payment, a portion goes towards paying off the interest accrued for that period, and the remaining portion goes towards reducing the principal loan balance. Early in the loan term, a larger portion of your payment goes to interest. As the loan matures, more of your payment goes towards the principal."
  },
  {
    question: "Why is an amortization schedule useful?",
    answer: "It's useful for understanding how your loan works, seeing the total interest you'll pay, and identifying opportunities to save money. For example, by making extra payments, you can see how much faster you'll pay off the loan and how much interest you'll save."
  }
];
var generateAmortizationSchedule = (loanAmount, monthlyRate, term) => {
  const schedule = [];
  let balance = loanAmount;
  let totalInterest = 0;
  const monthlyPayment = loanAmount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -term));
  for (let month = 1; month <= term; month++) {
    const interestPayment = balance * monthlyRate;
    totalInterest += interestPayment;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;
    schedule.push({
      month,
      "Remaining Balance": balance > 0 ? balance : 0,
      "Cumulative Interest": totalInterest,
      "Principal Paid": principalPayment
    });
  }
  return schedule;
};
function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = (0, import_react.useState)("250000");
  const [interestRate, setInterestRate] = (0, import_react.useState)("5");
  const [loanTerm, setLoanTerm] = (0, import_react.useState)("30");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const amount = Number(loanAmount) || 0;
    const rate = Number(interestRate) / 100;
    const termYears = Number(loanTerm) || 0;
    const termMonths = termYears * 12;
    if (amount <= 0 || rate <= 0 || termMonths <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyRate = rate / 12;
    const monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
    const totalRepayment = monthlyPayment * termMonths;
    const totalInterest = totalRepayment - amount;
    const schedule = generateAmortizationSchedule(amount, monthlyRate, termMonths);
    const newResults = {
      monthlyPayment,
      totalRepayment,
      totalInterest,
      schedule
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Loan Amount", `\xA3${amount.toFixed(2)}`],
      ["Interest Rate", `${interestRate}%`],
      ["Loan Term", `${termYears} years`],
      ["Monthly Payment", `\xA3${monthlyPayment.toFixed(2)}`],
      ["Total Interest Paid", `\xA3${totalInterest.toFixed(2)}`],
      ["---"],
      ["Month", "Principal Paid", "Cumulative Interest", "Remaining Balance"],
      ...schedule.map((row) => [
        row.month,
        `\xA3${row["Principal Paid"].toFixed(2)}`,
        `\xA3${row["Cumulative Interest"].toFixed(2)}`,
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
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Loan Amortization Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Generate a complete payment schedule for your mortgage or loan. See how much of each payment goes to principal vs. interest." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Loan Amortization Schedule" }),
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
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(loanAmount)],
                  onValueChange: (value) => setLoanAmount(String(value[0])),
                  max: 1e6,
                  step: 1e4,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "interestRate", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Interest Rate" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  Number(interestRate).toFixed(2),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(interestRate)],
                  onValueChange: (value) => setInterestRate(String(value[0])),
                  max: 20,
                  step: 0.1,
                  className: "mt-2"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { htmlFor: "loanTerm", className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan Term (Years)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                  loanTerm,
                  " years"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Slider,
                {
                  value: [Number(loanTerm)],
                  onValueChange: (value) => setLoanTerm(String(value[0])),
                  max: 40,
                  step: 1,
                  className: "mt-2"
                }
              )
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Amortization Schedule" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "amortization-schedule",
                title: "Amortization Schedule"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Summary" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "grid md:grid-cols-3 gap-4 text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Monthly Payment" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold", children: [
                  "\xA3",
                  results.monthlyPayment.toFixed(2)
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Total Interest Paid" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-red-600", children: [
                  "\xA3",
                  results.totalInterest.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Total Repayment" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold", children: [
                  "\xA3",
                  results.totalRepayment.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Principal vs. Interest" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, { data: results.schedule, children: [
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
                Area,
                {
                  type: "monotone",
                  dataKey: "Remaining Balance",
                  stackId: "1",
                  stroke: "#3b82f6",
                  fill: "#3b82f6"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Area,
                {
                  type: "monotone",
                  dataKey: "Cumulative Interest",
                  stackId: "2",
                  stroke: "#ef4444",
                  fill: "#ef4444"
                }
              )
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "w-5 h-5" }),
              "Full Payment Schedule"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "max-h-96 overflow-y-auto", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "w-full text-sm text-left", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { className: "text-xs text-gray-700 uppercase bg-gray-50 sticky top-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Month" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Interest" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Principal" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-2", children: "Balance" })
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: results.schedule.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "bg-white border-b hover:bg-gray-50", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "px-4 py-2", children: row.month }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "px-4 py-2 text-red-600", children: [
                  "\xA3",
                  (row["Cumulative Interest"] - (results.schedule[row.month - 2]?.["Cumulative Interest"] || 0)).toFixed(2)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "px-4 py-2 text-green-600", children: [
                  "\xA3",
                  row["Principal Paid"].toFixed(2)
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
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Generate your loan schedule" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your loan details to see the full breakdown." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: amortizationFAQs }) }) })
    ] })
  ] });
}
export {
  AmortizationCalculator as default
};
