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
  PoundSterling,
  User
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/StudentLoanCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var loanPlans = {
  plan1: { threshold: 24990, rate: 0.09 },
  plan2: { threshold: 27295, rate: 0.09 },
  plan4: { threshold: 31395, rate: 0.09 },
  plan5: { threshold: 25e3, rate: 0.09 },
  postgraduate: { threshold: 21e3, rate: 0.06 }
};
var studentLoanFAQs = [
  {
    question: "Which student loan plan am I on?",
    answer: "It generally depends on when and where you took out your loan. Plan 1 is for English/Welsh students who started before 2012. Plan 2 is for English/Welsh students who started after 2012. Plan 4 is for Scottish students. Plan 5 is for students who started courses from 1 August 2023 onwards. Postgraduate loans are separate. Always check with the Student Loans Company (SLC) if you're unsure."
  },
  {
    question: "How is the repayment amount calculated?",
    answer: "You repay a percentage of your income *above* a certain threshold. For most plans (1, 2, 4, 5), this is 9% of your income over the threshold. For Postgraduate loans, it's 6%. If your income drops below the threshold, you stop making repayments."
  },
  {
    question: "When is my student loan written off?",
    answer: "The loan is cancelled after a certain period, even if you haven't paid it all back. This varies by plan: Plan 1 is written off when you're 65 or 25-30 years after you were first due to repay. Plan 2 is written off 30 years after. Plan 5 is written off 40 years after. This means many people will never repay the full amount."
  },
  {
    question: "Does the interest rate matter?",
    answer: "While interest is added, for many people the total amount they repay is determined by their earnings over the repayment period, not the total loan balance. Because the debt is written off after a set time, you may never repay the full amount plus interest. Higher earners are more likely to be affected by the interest rate."
  },
  {
    question: "Does this calculator account for the full loan balance and interest?",
    answer: "No, this is a simplified calculator designed to show you your estimated *monthly repayment* based on your current salary. It does not forecast the total interest or the full payoff journey, as that depends on future salary changes and fluctuating interest rates."
  }
];
function StudentLoanCalculator() {
  const [loanPlan, setLoanPlan] = (0, import_react.useState)("plan1");
  const [annualSalary, setAnnualSalary] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const salary = Number(annualSalary) || 0;
    const plan = loanPlans[loanPlan];
    if (salary <= plan.threshold) {
      setResults({
        monthlyRepayment: 0,
        annualRepayment: 0
      });
      setHasCalculated(true);
      return;
    }
    const annualRepayment = (salary - plan.threshold) * plan.rate;
    const monthlyRepayment = annualRepayment / 12;
    const newResults = {
      monthlyRepayment,
      annualRepayment
    };
    setResults(newResults);
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [loanPlan, annualSalary]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Student Loan Repayment Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Understand the true cost of your education and plan your path to being loan-free." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Student Loan Plan" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: loanPlan, onValueChange: setLoanPlan, children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan1", children: "Plan 1" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan2", children: "Plan 2" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan4", children: "Plan 4 (Scotland)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "plan5", children: "Plan 5" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "postgraduate", children: "Postgraduate Loan" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "annualSalary", children: "Your Annual Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "annualSalary",
                    type: "number",
                    value: annualSalary,
                    onChange: (e) => setAnnualSalary(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 35000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate Repayment"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Estimated Repayments" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-lg p-4 bg-blue-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Monthly Repayment:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-blue-800", children: [
                "\xA3",
                results.monthlyRepayment.toLocaleString("en-GB", {
                  maximumFractionDigits: 2
                })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Repayment:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                "\xA3",
                results.annualRepayment.toLocaleString("en-GB", {
                  maximumFractionDigits: 2
                })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-gray-600 pt-4 border-t", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Note:" }),
              " This is a simplified calculation based on your current salary and does not account for interest accumulation or salary changes. Your repayments are taken from income over the threshold for your plan."
            ] }) })
          ] })
        ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "See your estimated repayments" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to calculate your repayment schedule." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: studentLoanFAQs }) })
    ] })
  ] });
}
export {
  StudentLoanCalculator as default
};
