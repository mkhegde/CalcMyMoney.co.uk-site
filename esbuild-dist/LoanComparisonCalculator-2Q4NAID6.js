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
  CircleCheck,
  CircleX,
  Repeat
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/LoanComparisonCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var loanComparisonFAQs = [
  {
    question: "What is APR?",
    answer: "APR stands for Annual Percentage Rate. It represents the yearly cost of a loan, including the interest rate and any extra fees. It's the most reliable way to compare the true cost of different loan offers."
  },
  {
    question: "Why is the total cost important?",
    answer: "While a lower monthly payment might seem attractive, a longer loan term can mean you pay significantly more in total interest over the life of the loan. The total cost gives you the complete picture."
  },
  {
    question: "What else should I consider besides the numbers?",
    answer: "Always check for early repayment charges (ERCs), flexibility in making overpayments, and the lender's customer service reputation. The 'best' loan isn't always the one with the lowest APR."
  }
];
var LoanInput = ({ id, loan, setLoan, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-lg", children: title }) }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: `amount-${id}`, children: "Loan Amount (\xA3)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Input,
        {
          id: `amount-${id}`,
          type: "number",
          value: loan.amount,
          onChange: (e) => setLoan({ ...loan, amount: e.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: `apr-${id}`, children: "APR (%)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Input,
        {
          id: `apr-${id}`,
          type: "number",
          value: loan.apr,
          onChange: (e) => setLoan({ ...loan, apr: e.target.value })
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: `term-${id}`, children: "Term (Years)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        Input,
        {
          id: `term-${id}`,
          type: "number",
          value: loan.term,
          onChange: (e) => setLoan({ ...loan, term: e.target.value })
        }
      )
    ] })
  ] })
] });
var calculateLoanDetails = (loan) => {
  const P = Number(loan.amount) || 0;
  const r = Number(loan.apr) / 100 / 12;
  const n = (Number(loan.term) || 0) * 12;
  if (P <= 0 || r <= 0 || n <= 0) return null;
  const M = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPaid = M * n;
  const totalInterest = totalPaid - P;
  return { monthlyPayment: M, totalPaid, totalInterest };
};
function LoanComparisonCalculator() {
  const [loan1, setLoan1] = (0, import_react.useState)({ amount: "10000", apr: "7.5", term: "5" });
  const [loan2, setLoan2] = (0, import_react.useState)({ amount: "10000", apr: "8.0", term: "4" });
  const [results1, setResults1] = (0, import_react.useState)(null);
  const [results2, setResults2] = (0, import_react.useState)(null);
  const handleCompare = () => {
    setResults1(calculateLoanDetails(loan1));
    setResults2(calculateLoanDetails(loan2));
  };
  (0, import_react.useState)(() => {
    handleCompare();
  }, []);
  const betterMonthly = results1 && results2 && results1.monthlyPayment < results2.monthlyPayment;
  const betterTotal = results1 && results2 && results1.totalPaid < results2.totalPaid;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Loan Comparison Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Compare two loan offers side-by-side to see which one is truly the better deal for you." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8 mb-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanInput, { id: "1", loan: loan1, setLoan: setLoan1, title: "Loan Offer 1" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoanInput, { id: "2", loan: loan2, setLoan: setLoan2, title: "Loan Offer 2" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center mb-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { size: "lg", onClick: handleCompare, children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "w-5 h-5 mr-2" }),
        "Compare Loans"
      ] }) }),
      results1 && results2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Comparison Results" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-3 gap-4 text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-lg", children: "Metric" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-blue-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-lg", children: "Loan 1" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-indigo-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-lg", children: "Loan 2" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 font-medium self-center", children: "Monthly Payment" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg flex items-center justify-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-2xl font-bold", children: [
              "\xA3",
              results1.monthlyPayment.toFixed(2)
            ] }),
            betterMonthly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-6 h-6 text-green-600 ml-2" }),
            !betterMonthly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-6 h-6 text-red-500 ml-2" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-indigo-50 rounded-lg flex items-center justify-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-2xl font-bold", children: [
              "\xA3",
              results2.monthlyPayment.toFixed(2)
            ] }),
            !betterMonthly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-6 h-6 text-green-600 ml-2" }),
            betterMonthly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-6 h-6 text-red-500 ml-2" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 font-medium self-center", children: "Total Interest Paid" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-blue-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xl font-bold", children: [
            "\xA3",
            results1.totalInterest.toFixed(2)
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 bg-indigo-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-xl font-bold", children: [
            "\xA3",
            results2.totalInterest.toFixed(2)
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "p-4 font-medium self-center", children: "Total Amount Paid" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg flex items-center justify-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-2xl font-bold", children: [
              "\xA3",
              results1.totalPaid.toFixed(2)
            ] }),
            betterTotal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-6 h-6 text-green-600 ml-2" }),
            !betterTotal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-6 h-6 text-red-500 ml-2" })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-indigo-50 rounded-lg flex items-center justify-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-2xl font-bold", children: [
              "\xA3",
              results2.totalPaid.toFixed(2)
            ] }),
            !betterTotal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "w-6 h-6 text-green-600 ml-2" }),
            betterTotal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "w-6 h-6 text-red-500 ml-2" })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: loanComparisonFAQs }) })
    ] })
  ] });
}
export {
  LoanComparisonCalculator as default
};
