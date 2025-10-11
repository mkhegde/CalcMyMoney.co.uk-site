import {
  AnimatedNumber
} from "./chunk-YHKA3VCH.js";
import {
  Breadcrumbs,
  CalculatorWrapper
} from "./chunk-U6RX6SVX.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import "./chunk-ZLF73IFG.js";
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
  Baby,
  Calculator,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/MaternityPayCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var SMP_WEEKS_90_PERCENT = 6;
var SMP_WEEKS_FLAT_RATE = 33;
var SMP_FLAT_RATE_WEEKLY = 184.03;
var maternityPayFAQs = [
  {
    question: "Who is eligible for Statutory Maternity Pay (SMP)?",
    answer: "To be eligible for SMP, you must be an employee who has worked for your employer continuously for at least 26 weeks up to the 'qualifying week' (the 15th week before the expected week of childbirth). You must also earn, on average, at least \xA3123 a week."
  },
  {
    question: "What is the difference between Maternity Pay and Maternity Allowance?",
    answer: "Statutory Maternity Pay (SMP) is paid by your employer. Maternity Allowance (MA) is paid by the government if you don't qualify for SMP, for example, if you're self-employed or haven't been with your employer long enough. MA is a standard flat rate."
  },
  {
    question: "Can my employer offer more than the statutory amount?",
    answer: "Yes. Many employers offer 'enhanced' or 'contractual' maternity pay, which can be more generous than the statutory minimum. Check your employment contract or company handbook for details. Our calculator shows the statutory minimum you are entitled to."
  },
  {
    question: "When does Statutory Maternity Pay start and end?",
    answer: "You can start your maternity leave and pay any time from 11 weeks before the expected week of childbirth. The pay lasts for up to 39 weeks."
  }
];
function MaternityPayCalculator() {
  const [averageWeeklyEarnings, setAverageWeeklyEarnings] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const breadcrumbPath = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "Life & Events", url: `${createPageUrl("Home")}#life-events` },
    { name: "Maternity Pay Calculator" }
  ];
  const handleCalculate = () => {
    const awe = Number(averageWeeklyEarnings) || 0;
    if (awe === 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const first6WeeksPay = awe * 0.9 * SMP_WEEKS_90_PERCENT;
    const flatRatePay = Math.min(awe * 0.9, SMP_FLAT_RATE_WEEKLY);
    const remaining33WeeksPay = flatRatePay * SMP_WEEKS_FLAT_RATE;
    const totalSMP = first6WeeksPay + remaining33WeeksPay;
    const newResults = {
      first6WeeksTotal: first6WeeksPay,
      first6WeeksWeekly: awe * 0.9,
      remaining33WeeksTotal: remaining33WeeksPay,
      remaining33WeeksWeekly: flatRatePay,
      totalSMP
    };
    setResults(newResults);
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
  }, [averageWeeklyEarnings]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { path: breadcrumbPath }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Statutory Maternity Pay (SMP) Calculator" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Planning for a new arrival? Estimate your statutory maternity pay to help you budget during your maternity leave." })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Earnings" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "awe", children: "Average Weekly Earnings (before tax)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "awe",
                  type: "number",
                  value: averageWeeklyEarnings,
                  onChange: (e) => setAverageWeeklyEarnings(e.target.value),
                  className: "pl-10 dark:bg-gray-700",
                  placeholder: "e.g. 500"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 dark:text-gray-400", children: "This is your average gross pay over the 8 weeks before your qualifying week." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate SMP"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your SMP Estimate" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/50 dark:to-pink-800/50 border-pink-200 dark:border-pink-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-pink-900 dark:text-pink-200", children: "Total Estimated SMP (39 weeks)" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-pink-800 dark:text-pink-100", children: [
            "\xA3",
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnimatedNumber, { value: results.totalSMP })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Payment Breakdown" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-50 dark:bg-green-900/30 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-green-800 dark:text-green-200", children: "First 6 Weeks" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold text-green-900 dark:text-green-100", children: [
                "\xA3",
                results.first6WeeksWeekly.toFixed(2),
                " per week"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-700 dark:text-green-300", children: "(90% of your average weekly earnings)" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold text-purple-800 dark:text-purple-200", children: "Remaining 33 Weeks" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold text-purple-900 dark:text-purple-100", children: [
                "\xA3",
                results.remaining33WeeksWeekly.toFixed(2),
                " per week"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-purple-700 dark:text-purple-300", children: "(Statutory flat rate or 90% of earnings, whichever is lower)" })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px] bg-white dark:bg-gray-800", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Plan your maternity leave finances" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your earnings to estimate your pay." })
      ] }) }) })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorWrapper, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100", children: "Understanding Statutory Maternity Pay" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Statutory Maternity Pay (SMP) is the legal minimum your employer must pay you while you're on maternity leave, provided you meet the eligibility criteria. It's designed to provide financial support during the 39 weeks of your leave. Understanding your entitlement is a crucial first step in budgeting for your growing family." }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-gray-700 dark:text-gray-300", children: [
        "The payment structure is split into two parts. For the first 6 weeks, you receive 90% of your average weekly earnings (with no upper limit). For the following 33 weeks, you receive a flat statutory rate (currently \xA3",
        SMP_FLAT_RATE_WEEKLY,
        " per week for 2024/25) or 90% of your average weekly earnings, whichever amount is lower."
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "When to Use This Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "When you've just found out you're expecting:" }),
          " To get an early idea of your financial situation during leave."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "When planning your household budget:" }),
          " To accurately forecast your income for the months you'll be on leave."
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "When discussing leave with your employer:" }),
          " To understand the baseline statutory amount before finding out if your company offers enhanced pay."
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Example Use Case" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-gray-700 dark:text-gray-300", children: [
        "Imagine your average weekly earnings are \xA3600 before tax. For the first 6 weeks of your maternity leave, you would receive 90% of this, which is \xA3540 per week. For the next 33 weeks, since 90% of your earnings (\xA3540) is higher than the statutory flat rate (\xA3",
        SMP_FLAT_RATE_WEEKLY,
        "), you would receive the flat rate of \xA3",
        SMP_FLAT_RATE_WEEKLY,
        " per week. Our calculator totals this up to give you a full 39-week projection, helping you plan with confidence."
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: maternityPayFAQs }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RelatedCalculators,
      {
        calculators: [
          {
            name: "Salary Calculator",
            url: "/SalaryCalculator",
            description: "See how maternity pay affects your annual take-home projections."
          },
          {
            name: "Childcare Cost Calculator",
            url: "/ChildcareCostCalculator",
            description: "Plan for future childcare expenses."
          },
          {
            name: "Budget Planner",
            url: "/BudgetCalculator",
            description: "Create a detailed budget for your growing family."
          }
        ]
      }
    )
  ] });
}
export {
  MaternityPayCalculator as default
};
