import {
  Slider
} from "./chunk-SFFJNVBD.js";
import "./chunk-V5SP5FAB.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
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
  Calendar,
  PoundSterling,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/AnnuityCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var annuityFAQs = [
  {
    question: "What is an annuity?",
    answer: "An annuity is a financial product, typically sold by insurance companies, that you purchase with a lump sum (often from your pension pot). In return, it provides you with a guaranteed regular income for a set period or for the rest of your life."
  },
  {
    question: "What's the difference between a lifetime and fixed-term annuity?",
    answer: "A lifetime annuity pays out for the rest of your life, providing certainty that you won't outlive your savings. A fixed-term annuity pays out for a specific number of years, after which you may receive a lump sum. This calculator models a fixed-term annuity payout."
  },
  {
    question: "How are annuity rates determined?",
    answer: "Annuity rates are influenced by several factors, including your age, your health, the size of your pension pot, prevailing interest rates (including government bond yields), and the type of annuity you choose (e.g., whether it increases with inflation or provides for a spouse after your death)."
  },
  {
    question: "A Note on Trustworthiness",
    answer: "This calculator uses standard financial formulas to estimate annuity payouts. The results are for illustrative purposes only. The actual annuity rate you are offered will depend on the provider and market conditions at the time of purchase. For precise quotes and financial advice, please consult a regulated financial advisor and compare offerings from multiple providers."
  }
];
function AnnuityCalculator() {
  const [annuityPot, setAnnuityPot] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("5");
  const [annuityTerm, setAnnuityTerm] = (0, import_react.useState)("20");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const pot = Number(annuityPot) || 0;
    const rate = Number(interestRate) / 100;
    const term = Number(annuityTerm) || 0;
    if (pot <= 0 || rate <= 0 || term <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const monthlyRate = rate / 12;
    const numberOfPayments = term * 12;
    const monthlyPayout = pot / ((1 - Math.pow(1 + monthlyRate, -numberOfPayments)) / monthlyRate);
    const totalPayout = monthlyPayout * numberOfPayments;
    const totalInterest = totalPayout - pot;
    setResults({
      monthlyPayout,
      annualPayout: monthlyPayout * 12,
      totalPayout,
      totalInterest
    });
    setHasCalculated(true);
  }, [annuityPot, interestRate, annuityTerm]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Annuity Calculator UK" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Estimate the regular income you could receive from your pension pot with an annuity." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Annuity Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "annuityPot", children: "Annuity Pot (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "annuityPot",
                    type: "number",
                    value: annuityPot,
                    onChange: (e) => setAnnuityPot(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 100000"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Estimated Annual Rate (%)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    id: "interestRate",
                    value: [parseFloat(interestRate)],
                    onValueChange: ([val]) => setInterestRate(val.toString()),
                    max: 10,
                    step: 0.1,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: interestRate,
                    onChange: (e) => setInterestRate(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "annuityTerm", children: "Annuity Term (Years)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-4 mt-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Slider,
                  {
                    id: "annuityTerm",
                    value: [parseFloat(annuityTerm)],
                    onValueChange: ([val]) => setAnnuityTerm(val.toString()),
                    max: 40,
                    step: 1,
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    value: annuityTerm,
                    onChange: (e) => setAnnuityTerm(e.target.value),
                    className: "w-24 text-center"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
              "Calculate"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Estimated Annual Income" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-blue-900", children: [
                "\xA3",
                results.annualPayout.toLocaleString("en-GB", { maximumFractionDigits: 0 })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-700 mt-1", children: "per year" })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-sm font-medium", children: "Monthly Payout" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "w-4 h-4 text-gray-500" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-2xl font-bold", children: [
                "\xA3",
                results.monthlyPayout.toLocaleString("en-GB", {
                  maximumFractionDigits: 2
                })
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { className: "flex flex-row items-center justify-between pb-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-sm font-medium", children: "Total Payout" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-4 h-4 text-gray-500" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-2xl font-bold", children: [
                "\xA3",
                results.totalPayout.toLocaleString("en-GB", { maximumFractionDigits: 0 })
              ] }) })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-gray-600 p-4 bg-gray-50 rounded-lg", children: [
            "Based on a pot of \xA3",
            Number(annuityPot).toLocaleString(),
            " and an estimated rate of",
            " ",
            interestRate,
            "%, you could receive \xA3",
            results.annualPayout.toLocaleString("en-GB", { maximumFractionDigits: 0 }),
            " per year for ",
            annuityTerm,
            " years. The total interest portion of this payout would be \xA3",
            results.totalInterest.toLocaleString("en-GB", { maximumFractionDigits: 0 }),
            "."
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Estimate your annuity income" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-500", children: "Enter your pot details to get started." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: annuityFAQs }) })
    ] })
  ] });
}
export {
  AnnuityCalculator as default
};
