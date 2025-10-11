import {
  Slider
} from "./chunk-SFFJNVBD.js";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "./chunk-32ETQDIX.js";
import "./chunk-V5SP5FAB.js";
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
  Calculator
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/MortgageRepaymentCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function MortgageRepaymentCalculator() {
  const [loanAmount, setLoanAmount] = (0, import_react.useState)("250000");
  const [interestRate, setInterestRate] = (0, import_react.useState)("5");
  const [loanTerm, setLoanTerm] = (0, import_react.useState)("30");
  const [results, setResults] = (0, import_react.useState)(null);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const generateAmortizationSchedule = (loanAmount2, monthlyRate, term, monthlyPayment) => {
    const schedule = [];
    let balance = loanAmount2;
    for (let month = 1; month <= term; month++) {
      const interestPayment = balance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment;
      if (month === term) {
        principalPayment = balance;
      } else if (principalPayment > balance) {
        principalPayment = balance;
      }
      balance -= principalPayment;
      const remainingBalance = balance < 0.01 && balance > -0.01 ? 0 : balance;
      schedule.push({
        month,
        "Remaining Balance": remainingBalance,
        "Principal Payment": principalPayment,
        "Interest Payment": interestPayment
      });
    }
    return schedule;
  };
  const handleCalculate = (0, import_react.useCallback)(() => {
    const amount = Number(loanAmount) || 0;
    const rate = Number(interestRate) / 100;
    const termYears = Number(loanTerm) || 0;
    const termMonths = termYears * 12;
    if (amount <= 0 || rate <= 0 || termMonths <= 0) {
      setResults(null);
      return;
    }
    const monthlyRate = rate / 12;
    const monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -termMonths));
    const schedule = generateAmortizationSchedule(amount, monthlyRate, termMonths, monthlyPayment);
    const totalInterest = schedule.reduce((acc, row) => acc + row["Interest Payment"], 0);
    setResults({ monthlyPayment, schedule, totalInterest });
    setCsvData([
      ["Month", "Principal", "Interest", "Balance"],
      ...schedule.map((r) => [
        r.month,
        r["Principal Payment"].toFixed(2),
        r["Interest Payment"].toFixed(2),
        r["Remaining Balance"].toFixed(2)
      ])
    ]);
  }, [loanAmount, interestRate, loanTerm]);
  (0, import_react.useEffect)(() => {
    handleCalculate();
  }, [handleCalculate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Mortgage Repayment Schedule Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Mortgage Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
              "Mortgage Amount (\xA3",
              Number(loanAmount).toLocaleString(),
              ")"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Slider,
              {
                value: [Number(loanAmount)],
                onValueChange: (v) => setLoanAmount(String(v[0])),
                max: 1e6,
                step: 1e4
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
              "Interest Rate (",
              Number(interestRate).toFixed(2),
              "%)"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Slider,
              {
                value: [Number(interestRate)],
                onValueChange: (v) => setInterestRate(String(v[0])),
                max: 20,
                step: 0.1
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
              "Term (",
              loanTerm,
              " years)"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Slider,
              {
                value: [Number(loanTerm)],
                onValueChange: (v) => setLoanTerm(String(v[0])),
                max: 40,
                step: 1
              }
            )
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3", children: results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6 printable-area", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex justify-between items-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Repayment Schedule" }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-4 grid md:grid-cols-2 gap-4 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm", children: "Monthly Payment" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold", children: [
              "\xA3",
              results.monthlyPayment.toFixed(2)
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm", children: "Total Interest" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-red-600", children: [
              "\xA3",
              results.totalInterest.toLocaleString("en-GB", {
                maximumFractionDigits: 0
              })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Loan Balance Over Time" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { width: "100%", height: 300, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, { data: results.schedule, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, { dataKey: "month" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Area,
              {
                type: "monotone",
                dataKey: "Remaining Balance",
                stroke: "#3b82f6",
                fill: "#3b82f6"
              }
            )
          ] }) }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ExportActions,
          {
            csvData,
            fileName: "mortgage-amortization-schedule",
            title: "Mortgage Amortization Schedule"
          }
        ) })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center p-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter your mortgage details to see the repayment schedule." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 text-gray-400 mx-auto mt-4" })
      ] }) }) })
    ] }) })
  ] });
}
export {
  MortgageRepaymentCalculator as default
};
