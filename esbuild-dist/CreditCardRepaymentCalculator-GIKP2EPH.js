import {
  RadioGroup,
  RadioGroupItem
} from "./chunk-DQYKLSGU.js";
import "./chunk-QRWSZGZM.js";
import "./chunk-6QDB6RBQ.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
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
  PoundSterling,
  Target
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/CreditCardRepaymentCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var ccRepaymentFAQs = [
  {
    question: "Why does it take so long to pay off credit card debt with minimum payments?",
    answer: "Minimum payments are often set as a small percentage of your balance (e.g., 1-3%) or a fixed amount. Because the interest charges are high, most of your minimum payment goes towards interest, with very little reducing the actual debt (principal). This creates a cycle that can take decades to break."
  },
  {
    question: "What is the 'debt avalanche' vs 'debt snowball' method?",
    answer: "The 'debt avalanche' method involves paying off the debt with the highest interest rate first, which saves you the most money on interest. The 'debt snowball' method involves paying off the smallest debt first, which provides psychological wins and motivation. This calculator shows the impact of making fixed payments, which is similar to the avalanche strategy if you only have one card."
  },
  {
    question: "Is it a good idea to use a balance transfer card?",
    answer: "A 0% balance transfer card can be a great tool. You move your high-interest debt to a new card with a 0% introductory APR for a set period (e.g., 12-24 months). This allows all of your payments to go towards the principal, clearing the debt much faster. However, be aware of transfer fees and make sure you can pay it off before the 0% period ends."
  }
];
function CreditCardRepaymentCalculator() {
  const [balance, setBalance] = (0, import_react.useState)("5000");
  const [interestRate, setInterestRate] = (0, import_react.useState)("21.9");
  const [repaymentType, setRepaymentType] = (0, import_react.useState)("fixed");
  const [repaymentValue, setRepaymentValue] = (0, import_react.useState)("200");
  const [targetMonths, setTargetMonths] = (0, import_react.useState)("24");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const calculateRepayment = (0, import_react.useCallback)(() => {
    const bal = Number(balance) || 0;
    const rate = Number(interestRate) / 100 / 12;
    if (bal <= 0 || rate <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    let monthsToPayOff = 0;
    let totalInterestPaid = 0;
    let monthlyPayment = 0;
    let finalMessage = "";
    if (repaymentType === "fixed") {
      monthlyPayment = Number(repaymentValue) || 0;
      if (monthlyPayment <= bal * rate) {
        finalMessage = "Warning: Your payment is too low to cover the interest. The balance will increase.";
        monthsToPayOff = Infinity;
      } else {
        monthsToPayOff = -Math.log(1 - bal * rate / monthlyPayment) / Math.log(1 + rate);
        totalInterestPaid = monthlyPayment * monthsToPayOff - bal;
      }
    } else {
      const term = Number(targetMonths) || 0;
      if (term <= 0) {
        setResults(null);
        return;
      }
      monthlyPayment = bal * rate * Math.pow(1 + rate, term) / (Math.pow(1 + rate, term) - 1);
      monthsToPayOff = term;
      totalInterestPaid = monthlyPayment * term - bal;
    }
    const newResults = {
      monthsToPayOff: Math.ceil(monthsToPayOff),
      years: Math.floor(Math.ceil(monthsToPayOff) / 12),
      remainingMonths: Math.ceil(monthsToPayOff) % 12,
      totalInterestPaid,
      totalRepayment: bal + totalInterestPaid,
      monthlyPayment,
      finalMessage
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Initial Balance", `\xA3${bal.toFixed(2)}`],
      ["Interest Rate (APR)", `${interestRate}%`],
      [
        "Repayment Goal",
        repaymentType === "fixed" ? `Fixed payment of \xA3${monthlyPayment.toFixed(2)}/month` : `Pay off in ${targetMonths} months`
      ],
      ["Required Monthly Payment", `\xA3${newResults.monthlyPayment.toFixed(2)}`],
      ["Time to Pay Off", `${newResults.years} years, ${newResults.remainingMonths} months`],
      ["Total Interest Paid", `\xA3${newResults.totalInterestPaid.toFixed(2)}`],
      ["Total Amount Repaid", `\xA3${newResults.totalRepayment.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  }, [balance, interestRate, repaymentType, repaymentValue, targetMonths]);
  (0, import_react.useEffect)(() => {
    calculateRepayment();
  }, [calculateRepayment]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Credit Card Repayment Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "See how long it will take to pay off your credit card debt and how much interest you'll pay. Create a plan to become debt-free faster." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Credit Card Repayment Plan" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Credit Card Debt" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "balance", children: "Current Balance" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "balance",
                    type: "number",
                    value: balance,
                    onChange: (e) => setBalance(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Interest Rate (APR)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
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
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              RadioGroup,
              {
                value: repaymentType,
                onValueChange: setRepaymentType,
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "How do you want to repay?" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "fixed", id: "fixed" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "fixed", children: "Pay a fixed amount each month" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RadioGroupItem, { value: "target", id: "target" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "target", children: "Pay it off in a target time" })
                  ] })
                ]
              }
            ),
            repaymentType === "fixed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "repaymentValue", children: "Monthly Payment" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "repaymentValue",
                    type: "number",
                    value: repaymentValue,
                    onChange: (e) => setRepaymentValue(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "targetMonths", children: "Pay Off Within (Months)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "targetMonths",
                    type: "number",
                    value: targetMonths,
                    onChange: (e) => setTargetMonths(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Repayment Plan" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "credit-card-repayment-plan",
                title: "Credit Card Repayment Plan"
              }
            )
          ] }),
          results.finalMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-red-100 border-red-300", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-4 text-red-800 font-medium", children: results.finalMessage }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Target, { className: "w-5 h-5 text-blue-700" }),
              "Payoff Summary"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600", children: "It will take you" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-blue-800 my-2", children: [
                results.years > 0 && `${results.years} year${results.years > 1 ? "s" : ""}`,
                " ",
                results.years > 0 && results.remainingMonths > 0 && `and`,
                " ",
                results.remainingMonths > 0 && `${results.remainingMonths} month${results.remainingMonths > 1 ? "s" : ""}`,
                results.years === 0 && results.remainingMonths === 0 && `less than a month`
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600", children: "to become debt-free." })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monthly Payment" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold", children: [
                  "\xA3",
                  results.monthlyPayment.toFixed(2)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: repaymentType === "target" ? "Is required to meet your goal" : "Your fixed monthly payment" })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Interest Paid" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-semibold text-red-600", children: [
                  "\xA3",
                  results.totalInterestPaid.toLocaleString("en-GB", {
                    maximumFractionDigits: 2
                  })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "This is the total cost of borrowing." })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "font-medium", children: [
            "By paying \xA3",
            results.monthlyPayment.toFixed(0),
            " per month instead of a typical 3% minimum payment (~\xA3",
            (Number(balance) * 0.03).toFixed(0),
            "), you could save thousands in interest and be debt-free years sooner."
          ] }) }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to clear your debt?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to see your personalized repayment plan." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: ccRepaymentFAQs }) }) })
    ] })
  ] });
}
export {
  CreditCardRepaymentCalculator as default
};
