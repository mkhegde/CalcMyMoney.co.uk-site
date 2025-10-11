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
  Briefcase,
  Calculator,
  PoundSterling,
  TriangleAlert
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/RedundancyPayCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var MAX_WEEKLY_PAY = 700;
var MAX_SERVICE_YEARS = 20;
function RedundancyPayCalculator() {
  const [age, setAge] = (0, import_react.useState)("");
  const [yearsOfService, setYearsOfService] = (0, import_react.useState)("");
  const [weeklyPay, setWeeklyPay] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const currentAge = Number(age) || 0;
    const service = Math.min(Number(yearsOfService) || 0, MAX_SERVICE_YEARS);
    const pay = Number(weeklyPay) || 0;
    const cappedPay = Math.min(pay, MAX_WEEKLY_PAY);
    if (currentAge < 18 || service < 2) {
      setResults({
        redundancyPay: 0,
        message: "You must have at least 2 years of continuous service."
      });
      setHasCalculated(true);
      return;
    }
    let totalWeeks = 0;
    for (let i = 0; i < service; i++) {
      const ageAtYearOfService = currentAge - i;
      if (ageAtYearOfService >= 41) {
        totalWeeks += 1.5;
      } else if (ageAtYearOfService >= 22) {
        totalWeeks += 1;
      } else {
        totalWeeks += 0.5;
      }
    }
    const redundancyPay = totalWeeks * cappedPay;
    setResults({ redundancyPay, cappedPay, totalWeeks, message: null });
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [age, yearsOfService, weeklyPay]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Statutory Redundancy Pay Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "If you're facing redundancy, know your rights. Calculate your estimated statutory redundancy entitlement." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "age", children: "Age at Redundancy" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "age",
                type: "number",
                value: age,
                onChange: (e) => setAge(e.target.value),
                placeholder: "e.g. 45"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "yearsOfService", children: "Full Years of Service" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "yearsOfService",
                type: "number",
                value: yearsOfService,
                onChange: (e) => setYearsOfService(e.target.value),
                placeholder: "e.g. 10"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "weeklyPay", children: "Average Weekly Pay (before tax)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "weeklyPay",
                  type: "number",
                  value: weeklyPay,
                  onChange: (e) => setWeeklyPay(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 600"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-gray-500", children: [
              "Weekly pay is capped at \xA3",
              MAX_WEEKLY_PAY,
              " for this calculation."
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Pay"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-blue-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "w-6 h-6" }),
            "Estimated Statutory Pay"
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-blue-900", children: [
              "\xA3",
              results.redundancyPay.toLocaleString("en-GB", { minimumFractionDigits: 2 })
            ] }),
            results.message && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-600 mt-2", children: results.message }),
            !results.message && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-gray-600 mt-2", children: [
              "Based on ",
              results.totalWeeks.toFixed(1),
              " weeks at a capped weekly pay of \xA3",
              results.cappedPay.toLocaleString(),
              "."
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Important Information" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3 text-sm text-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "w-5 h-5 text-yellow-600 mt-0.5" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                "This is an estimate of your ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "statutory" }),
                " redundancy pay only. Your employer may offer a more generous contractual redundancy package."
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "You must have at least 2 years of continuous service to qualify for statutory redundancy pay." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "The first \xA330,000 of redundancy pay is usually tax-free." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "This calculator uses the rates for England, Scotland, and Wales." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Always check your contract and consult with ACAS or a legal professional for advice." })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Calculate Your Entitlement" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Fill in your details to get an estimate of your statutory redundancy pay." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  RedundancyPayCalculator as default
};
