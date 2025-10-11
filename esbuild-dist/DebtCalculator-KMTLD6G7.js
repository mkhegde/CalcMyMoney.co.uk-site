import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
import "./chunk-ZLF73IFG.js";
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
  CreditCard,
  Plus,
  PoundSterling,
  Trash2,
  TrendingDown
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/DebtCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var debtCalculatorFAQs = [
  {
    question: "What's the difference between debt avalanche and debt snowball?",
    answer: "Debt avalanche focuses on paying off the highest interest rate debts first, saving you the most money overall. Debt snowball targets the smallest balances first, providing quicker psychological wins to build momentum."
  },
  {
    question: "Should I pay off debt or build savings first?",
    answer: "Generally, pay off high-interest debt (above 6-8%) before building large savings. However, maintain a small emergency fund (\xA31,000) first, then focus on debt, then build a full 3-6 month emergency fund."
  },
  {
    question: "How can I find extra money to pay off debt faster?",
    answer: "Review your budget for unnecessary expenses, consider a side hustle, sell unused items, negotiate lower bills, use windfalls (tax refunds, bonuses), or temporarily reduce retirement contributions to focus on high-interest debt."
  },
  {
    question: "Should I consolidate my debts?",
    answer: "Debt consolidation can help if you qualify for a lower interest rate than your current average. Consider personal loans, balance transfer cards, or remortgaging. However, ensure you don't just extend the repayment period without saving on interest."
  },
  {
    question: "Will paying off debt early hurt my credit score?",
    answer: "No, paying off debt early generally improves your credit score by reducing your credit utilization ratio. The only minor impact might be from closing very old credit accounts, but the benefits of being debt-free outweigh this."
  },
  {
    question: "What if I can't afford my minimum payments?",
    answer: "Contact your creditors immediately to discuss hardship options like payment holidays, reduced payments, or interest freezes. Consider free debt advice from charities like StepChange, Citizens Advice, or National Debtline."
  }
];
function DebtCalculator() {
  const [debts, setDebts] = (0, import_react.useState)([]);
  const [strategy, setStrategy] = (0, import_react.useState)("avalanche");
  const [extraPayment, setExtraPayment] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const createPageUrl = (componentName) => {
    const slug = componentName.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
    return `/calculators/${slug}`;
  };
  const addDebt = () => {
    setDebts([
      ...debts,
      {
        name: "",
        // Changed to empty string
        balance: "",
        // Changed to empty string
        apr: "",
        // Changed to empty string
        minimumPayment: "",
        // Changed to empty string
        type: "credit_card"
      }
    ]);
  };
  const updateDebt = (index, field, value) => {
    const newDebts = [...debts];
    newDebts[index] = { ...newDebts[index], [field]: value };
    setDebts(newDebts);
  };
  const removeDebt = (index) => {
    setDebts(debts.filter((_, i) => i !== index));
  };
  const handleCalculate = () => {
    const currentDebts = debts.map((d) => ({
      ...d,
      balance: Number(d.balance) || 0,
      apr: Number(d.apr) || 0,
      minimumPayment: Number(d.minimumPayment) || 0
    })).filter((d) => d.balance > 0);
    const currentExtraPayment = Number(extraPayment) || 0;
    if (currentDebts.length === 0) {
      setResults(null);
      setHasCalculated(false);
      setCsvData(null);
      return;
    }
    const newResults = calculatePayoffSchedule(currentDebts, strategy, currentExtraPayment);
    const finalInterestSavings = calculateInterestSavings(currentDebts, newResults);
    const finalResults = { ...newResults, interestSavings: finalInterestSavings };
    setResults(finalResults);
    setHasCalculated(true);
    if (finalResults && finalResults.totalBalance !== void 0) {
      const csvExportData = [
        ["Metric", "Value", "Unit"],
        [
          "Payoff Time",
          `${Math.floor(finalResults.totalMonths / 12)}y ${finalResults.totalMonths % 12}m`,
          ""
        ],
        ["Total Interest Paid", finalResults.totalInterestPaid.toFixed(2), "GBP"],
        ["Interest Saved", finalInterestSavings.toFixed(2), "GBP"],
        ["Total Debt", finalResults.totalBalance.toFixed(2), "GBP"],
        ["Total Monthly Payment", finalResults.totalPayment.toFixed(2), "GBP"],
        ["Strategy", strategy, ""],
        ["Extra Monthly Payment", currentExtraPayment.toFixed(2), "GBP"],
        ["", "", ""],
        ["Payoff Schedule", "Payoff Month", "Payoff Date (Years from now)", "Original Balance"],
        ...(finalResults.payoffOrder || []).map((debt) => [
          debt.name,
          debt.month,
          `${Math.floor(debt.month / 12)}y ${debt.month % 12}m`,
          debt.originalBalance.toFixed(2)
        ])
      ];
      setCsvData(csvExportData);
    }
  };
  const calculatePayoffSchedule = (debtsToCalculate, strategyToUse, extraPaymentAmount) => {
    if (debtsToCalculate.length === 0) {
      return {
        totalMonths: 0,
        totalInterestPaid: 0,
        totalBalance: 0,
        totalPayment: 0,
        payoffOrder: [],
        interestSavings: 0
      };
    }
    let debtsCopy = debtsToCalculate.map((debt) => ({ ...debt }));
    const initialTotalBalance = debtsCopy.reduce((sum, debt) => sum + debt.balance, 0);
    const initialTotalMinimum = debtsCopy.reduce((sum, debt) => sum + debt.minimumPayment, 0);
    const totalMonthlyPaymentInitial = initialTotalMinimum + extraPaymentAmount;
    if (strategyToUse === "avalanche") {
      debtsCopy.sort((a, b) => b.apr - a.apr);
    } else {
      debtsCopy.sort((a, b) => a.balance - b.balance);
    }
    let month = 0;
    let totalInterestPaid = 0;
    let payoffOrder = [];
    let remainingExtraPaymentFunds = extraPaymentAmount;
    const workingDebts = debtsCopy.map((debt, idx) => ({
      ...debt,
      id: idx,
      originalBalance: debt.balance
    }));
    const paidOffDebtIds = /* @__PURE__ */ new Set();
    while (workingDebts.some((debt) => debt.balance > 0) && month < 600) {
      month++;
      workingDebts.forEach((debt) => {
        if (debt.balance > 0) {
          const monthlyInterest = debt.balance * debt.apr / (100 * 12);
          totalInterestPaid += monthlyInterest;
          debt.balance += monthlyInterest;
          const payment = Math.min(debt.minimumPayment, debt.balance);
          debt.balance -= payment;
        }
      });
      const currentSortedDebts = [...workingDebts].filter(
        (debt) => debt.balance > 0 && !paidOffDebtIds.has(debt.id)
      );
      if (strategyToUse === "avalanche") {
        currentSortedDebts.sort((a, b) => b.apr - a.apr);
      } else {
        currentSortedDebts.sort((a, b) => a.balance - b.balance);
      }
      for (const debt of currentSortedDebts) {
        if (remainingExtraPaymentFunds <= 0) break;
        const amountToPay = Math.min(remainingExtraPaymentFunds, debt.balance);
        debt.balance -= amountToPay;
        remainingExtraPaymentFunds -= amountToPay;
      }
      workingDebts.forEach((debt) => {
        if (debt.balance <= 0 && !paidOffDebtIds.has(debt.id)) {
          payoffOrder.push({
            name: debt.name,
            month,
            originalBalance: debt.originalBalance
          });
          paidOffDebtIds.add(debt.id);
          remainingExtraPaymentFunds += debt.minimumPayment;
        }
      });
      if (workingDebts.every((debt) => debt.balance <= 0)) {
        break;
      }
    }
    return {
      totalMonths: month,
      totalInterestPaid,
      totalBalance: initialTotalBalance,
      // Total initial debt
      totalPayment: totalMonthlyPaymentInitial,
      // Total initial monthly payment (min + extra)
      payoffOrder,
      interestSavings: 0
      // Will be calculated by calculateInterestSavings
    };
  };
  const calculateInterestSavings = (debtsForMinPayment, currentResults) => {
    if (!currentResults || !currentResults.totalInterestPaid || debtsForMinPayment.length === 0)
      return 0;
    let minPaymentInterest = 0;
    let debtsCopyMin = debtsForMinPayment.map((debt) => ({ ...debt }));
    let monthMin = 0;
    while (debtsCopyMin.some((debt) => debt.balance > 0) && monthMin < 600) {
      monthMin++;
      debtsCopyMin.forEach((debt) => {
        if (debt.balance > 0) {
          const monthlyInterest = debt.balance * debt.apr / (100 * 12);
          minPaymentInterest += monthlyInterest;
          debt.balance += monthlyInterest;
          const payment = Math.min(debt.minimumPayment, debt.balance);
          debt.balance -= payment;
        }
      });
    }
    return Math.max(0, minPaymentInterest - currentResults.totalInterestPaid);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, [debts, strategy, extraPayment]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900", children: "UK Debt Repayment Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto", children: "The best way out is always through. Create a clear debt-free plan and see how much interest you can save with a focused strategy." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Debt Repayment Plan" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-1 space-y-6 non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "w-5 h-5" }),
              "Your Debts"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              debts.map((debt, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 border rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      value: debt.name,
                      onChange: (e) => updateDebt(index, "name", e.target.value),
                      placeholder: "e.g. Credit Card",
                      className: "flex-1"
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => removeDebt(index),
                      className: "text-red-500 hover:text-red-700",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-xs", children: "Balance" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          type: "number",
                          value: debt.balance,
                          onChange: (e) => updateDebt(index, "balance", e.target.value),
                          className: "pl-7 text-sm",
                          placeholder: "e.g. 5000"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-xs", children: "APR (%)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        type: "number",
                        value: debt.apr,
                        onChange: (e) => updateDebt(index, "apr", e.target.value),
                        step: "0.1",
                        className: "text-sm",
                        placeholder: "e.g. 18.9"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { className: "text-xs", children: "Minimum Payment" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        type: "number",
                        value: debt.minimumPayment,
                        onChange: (e) => updateDebt(index, "minimumPayment", e.target.value),
                        className: "pl-7 text-sm",
                        placeholder: "e.g. 125"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  Select,
                  {
                    value: debt.type,
                    onValueChange: (value) => updateDebt(index, "type", value),
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "text-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "credit_card", children: "Credit Card" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "personal_loan", children: "Personal Loan" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "car_loan", children: "Car Loan" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "student_loan", children: "Student Loan" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "other", children: "Other" })
                      ] })
                    ]
                  }
                )
              ] }, index)),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  variant: "outline",
                  onClick: addDebt,
                  className: "w-full flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4" }),
                    "Add Debt"
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Repayment Strategy" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Strategy" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: strategy, onValueChange: setStrategy, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "avalanche", children: "Debt Avalanche (Highest Interest First)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "snowball", children: "Debt Snowball (Smallest Balance First)" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Extra Monthly Payment" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      type: "number",
                      value: extraPayment,
                      onChange: (e) => setExtraPayment(e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 200"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                "Calculate Plan"
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-100", children: "Your Repayment Plan" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "debt-repayment-plan",
                title: "Debt Repayment Plan"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-blue-800 dark:text-blue-200", children: "Payoff Time" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-blue-900 dark:text-blue-100", children: [
                  Math.floor(results.totalMonths / 12),
                  "y ",
                  results.totalMonths % 12,
                  "m"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-8 h-8 text-blue-600 dark:text-blue-400" })
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/50 dark:to-red-800/50 border-red-200 dark:border-red-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-red-800 dark:text-red-200", children: "Total Interest" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-red-900 dark:text-red-100", children: [
                  "\xA3",
                  results.totalInterestPaid?.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-8 h-8 text-red-600 dark:text-red-400" })
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-green-800 dark:text-green-200", children: "Interest Saved" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-green-900 dark:text-green-100", children: [
                  "\xA3",
                  results.interestSavings?.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "w-8 h-8 text-green-600 dark:text-green-400" })
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Current Debt Overview" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
              debts.map((debt, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 border rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-start mb-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold", children: debt.name || "Unnamed Debt" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-lg font-bold", children: [
                    "\xA3",
                    (Number(debt.balance) || 0).toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "APR: " }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                      Number(debt.apr) || 0,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Min Payment: " }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                      "\xA3",
                      Number(debt.minimumPayment) || 0
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Type: " }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium capitalize", children: debt.type.replace("_", " ") })
                  ] })
                ] })
              ] }, index)),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border-t pt-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-lg font-semibold", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Debt:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-red-600", children: [
                    "\xA3",
                    results.totalBalance?.toLocaleString()
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mt-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Monthly Payment:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.totalPayment?.toLocaleString()
                  ] })
                ] })
              ] })
            ] }) })
          ] }),
          results.payoffOrder && results.payoffOrder.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
              "Payoff Schedule (",
              strategy === "avalanche" ? "Debt Avalanche" : "Debt Snowball",
              ")"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-3", children: results.payoffOrder.map((debt, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: "flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg",
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-medium", children: debt.name || "Unnamed Debt" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                      "Original balance: \xA3",
                      debt.originalBalance?.toLocaleString()
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-right", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "font-semibold", children: [
                      "Month ",
                      debt.month
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
                      Math.floor(debt.month / 12),
                      "y ",
                      debt.month % 12,
                      "m"
                    ] })
                  ] })
                ]
              },
              index
            )) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Strategy Benefits" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-blue-900 dark:text-blue-100 mb-2", children: "Debt Avalanche" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "text-sm text-blue-800 dark:text-blue-200 space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Saves the most money in interest" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Mathematically optimal" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Focus on highest interest rates" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 May take longer to see progress" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-50 dark:bg-green-900/30 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-green-900 dark:text-green-100 mb-2", children: "Debt Snowball" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "text-sm text-green-800 dark:text-green-200 space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Quick psychological wins" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Builds momentum" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Focus on smallest balances" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 May cost slightly more in interest" })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-yellow-800 dark:text-yellow-200", children: "Debt Repayment Tips" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-sm text-yellow-800 dark:text-yellow-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                "\u{1F4B0} ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Find extra money:" }),
                " Review your budget for areas to cut spending"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                "\u{1F4DE} ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Call creditors:" }),
                " Ask about hardship programs or lower interest rates"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                "\u{1F4B3} ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Stop using credit:" }),
                " Avoid adding to your debt while paying it off"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                "\u{1F3AF} ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Stay motivated:" }),
                " Celebrate milestones and track your progress"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
                "\u2696\uFE0F ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Consider consolidation:" }),
                " Lower interest loans might help"
              ] })
            ] }) })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to see your plan?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: 'Add your debts and click "Calculate Plan" to become debt-free.' })
        ] }) }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: debtCalculatorFAQs }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RelatedCalculators,
      {
        calculators: [
          {
            name: "Budget Planner",
            url: createPageUrl("BudgetCalculator"),
            description: "Find money for debt payoff by optimising your monthly budget."
          },
          {
            name: "Credit Card Repayment Calculator",
            url: createPageUrl("CreditCardRepaymentCalculator"),
            description: "See how long it takes to clear your credit card."
          },
          {
            name: "Loan Repayment Calculator",
            url: createPageUrl("LoanRepaymentCalculator"),
            description: "Estimate payments for personal or car loans."
          }
        ]
      }
    )
  ] });
}
export {
  DebtCalculator as default
};
