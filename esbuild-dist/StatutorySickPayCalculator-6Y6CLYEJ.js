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
  Shield,
  TriangleAlert
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/StatutorySickPayCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var SSP_WEEKLY_RATE = 116.75;
var SSP_MIN_WEEKLY_EARNINGS = 123;
function StatutorySickPayCalculator() {
  const [averageWeeklyEarnings, setAverageWeeklyEarnings] = (0, import_react.useState)("");
  const [daysOff, setDaysOff] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const awe = Number(averageWeeklyEarnings) || 0;
    const sickDays = Number(daysOff) || 0;
    if (awe < SSP_MIN_WEEKLY_EARNINGS || sickDays < 4) {
      setResults({ eligible: false, totalSSP: 0 });
      setHasCalculated(true);
      return;
    }
    const payableDays = Math.max(0, sickDays - 3);
    const weeklyRateForDays = SSP_WEEKLY_RATE / 5 * Math.min(payableDays, 5);
    const weeksOff = Math.floor(payableDays / 5);
    const remainingDays = payableDays % 5;
    const totalSSP = weeksOff * SSP_WEEKLY_RATE + remainingDays * (SSP_WEEKLY_RATE / 5);
    setResults({
      eligible: true,
      totalSSP: Math.min(totalSSP, SSP_WEEKLY_RATE * 28)
      // Max 28 weeks
    });
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [averageWeeklyEarnings, daysOff]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Statutory Sick Pay (SSP) Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "If you're too ill to work, you may be entitled to SSP. Check your eligibility and estimate your pay." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "awe", children: "Average Weekly Earnings (AWE)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "awe",
                  type: "number",
                  value: averageWeeklyEarnings,
                  onChange: (e) => setAverageWeeklyEarnings(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "daysOff", children: "Number of sick days" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "daysOff",
                type: "number",
                value: daysOff,
                onChange: (e) => setDaysOff(e.target.value),
                placeholder: "e.g. 10"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate SSP"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: results.eligible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your SSP Entitlement" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-100 rounded-lg border-2 border-green-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-bold text-green-800", children: "Total Estimated SSP" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-green-900", children: [
              "\xA3",
              results.totalSSP.toLocaleString("en-GB", { maximumFractionDigits: 2 })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-600 pt-4 mt-4 border-t", children: "SSP is paid for up to 28 weeks. The first 3 days are unpaid 'waiting days'." })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-yellow-50 border-yellow-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { className: "flex-row items-center gap-3", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-6 h-6 text-yellow-700" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-yellow-800", children: "Not Eligible for SSP" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-yellow-800", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Based on the details provided, you may not be eligible for SSP. This is usually because:" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside mt-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
              "Your average weekly earnings are below \xA3",
              SSP_MIN_WEEKLY_EARNINGS,
              "."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "You have been off sick for less than 4 days in a row." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "mt-2", children: "You may be able to apply for Universal Credit or Employment and Support Allowance (ESA)." })
        ] })
      ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Check your sick pay" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to estimate your SSP." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  StatutorySickPayCalculator as default
};
