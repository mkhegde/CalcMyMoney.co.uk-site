import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
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
  CircleAlert,
  CircleCheckBig,
  PoundSterling,
  Scale
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/MinimumWageCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var wageRates = {
  "21+": 11.44,
  "18-20": 8.6,
  "under-18": 6.4,
  apprentice: 6.4
};
function MinimumWageCalculator() {
  const [ageGroup, setAgeGroup] = (0, import_react.useState)("21+");
  const [pay, setPay] = (0, import_react.useState)("");
  const [hours, setHours] = (0, import_react.useState)("");
  const [payPeriod, setPayPeriod] = (0, import_react.useState)("weekly");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const currentPay = Number(pay) || 0;
    const currentHours = Number(hours) || 0;
    if (currentPay <= 0 || currentHours <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    let effectiveHourlyRate = 0;
    if (payPeriod === "hourly") {
      effectiveHourlyRate = currentPay;
    } else if (payPeriod === "weekly") {
      effectiveHourlyRate = currentPay / currentHours;
    } else if (payPeriod === "monthly") {
      effectiveHourlyRate = currentPay / (currentHours * 4.333);
    }
    const minimumRate = wageRates[ageGroup];
    const difference = effectiveHourlyRate - minimumRate;
    const weeklyDifference = difference * (payPeriod === "weekly" || payPeriod === "monthly" ? currentHours : payPeriod === "hourly" ? 40 : 0);
    setResults({
      effectiveHourlyRate,
      minimumRate,
      difference,
      weeklyDifference
    });
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [ageGroup, pay, hours, payPeriod]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "UK Minimum Wage Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Are you being paid correctly? Check your wage against the UK's National Minimum Wage and National Living Wage rates." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Pay Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Your Age Group" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: ageGroup, onValueChange: setAgeGroup, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "21+", children: "21 and over (National Living Wage)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "18-20", children: "18 to 20" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "under-18", children: "Under 18" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "apprentice", children: "Apprentice" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay (before tax)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: pay,
                  onChange: (e) => setPay(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 400"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hours Worked" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: hours,
                onChange: (e) => setHours(e.target.value),
                placeholder: "e.g. 40"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay Period" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: payPeriod, onValueChange: setPayPeriod, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "hourly", children: "Per Hour" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "weekly", children: "Per Week" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "monthly", children: "Per Month" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Check My Wage"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
          Card,
          {
            className: results.difference >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                CardTitle,
                {
                  className: `flex items-center gap-2 ${results.difference >= 0 ? "text-green-800" : "text-red-800"}`,
                  children: [
                    results.difference >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "w-6 h-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-6 h-6" }),
                    "Pay Assessment"
                  ]
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-center", children: results.difference >= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-green-700", children: "Your effective hourly rate appears to be above the minimum wage." }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-green-900 mt-2", children: [
                  "\xA3",
                  results.effectiveHourlyRate.toFixed(2)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-gray-600", children: [
                  "Minimum for your age: \xA3",
                  results.minimumRate.toFixed(2),
                  " per hour"
                ] })
              ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-red-700", children: [
                  "Your effective hourly rate appears to be ",
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "below" }),
                  " the minimum wage."
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-red-900 mt-2", children: [
                  "\xA3",
                  results.effectiveHourlyRate.toFixed(2)
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-gray-600", children: [
                  "Minimum for your age: \xA3",
                  results.minimumRate.toFixed(2),
                  " per hour"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-red-800 font-semibold mt-4", children: [
                  "You may be underpaid by approximately \xA3",
                  Math.abs(results.weeklyDifference).toFixed(2),
                  " per week."
                ] })
              ] }) })
            ]
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "What to do next" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-sm text-gray-700 space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This calculator provides an estimate. Certain deductions can affect the calculation." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "If you believe you are being underpaid:" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Speak to your employer first. It could be a simple mistake." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Contact ACAS (Advisory, Conciliation and Arbitration Service) for free, impartial advice." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "You can make a confidential complaint to HMRC, who can investigate on your behalf." })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Check your pay" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to see if you're being paid the correct minimum wage." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  MinimumWageCalculator as default
};
