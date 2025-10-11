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
  TrendingUp,
  Wallet
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/OvertimeBonusCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var calculateTakeHome = (salary) => {
  const personalAllowance = 12570;
  let tax = 0;
  let ni = 0;
  const taxableIncome = Math.max(0, salary - personalAllowance);
  if (taxableIncome > 0) {
    if (taxableIncome <= 37700) tax += taxableIncome * 0.2;
    else if (taxableIncome <= 125140) tax += 37700 * 0.2 + (taxableIncome - 37700) * 0.4;
    else tax += 37700 * 0.2 + (125140 - 37700) * 0.4 + (taxableIncome - 125140) * 0.45;
  }
  const niableIncome = Math.max(0, salary - 12570);
  if (niableIncome > 0) {
    if (niableIncome <= 37700) ni += niableIncome * 0.08;
    else ni += 37700 * 0.08 + (niableIncome - 37700) * 0.02;
  }
  return salary - tax - ni;
};
function OvertimeBonusCalculator() {
  const [baseSalary, setBaseSalary] = (0, import_react.useState)("");
  const [extraPay, setExtraPay] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const salary = Number(baseSalary) || 0;
    const bonus = Number(extraPay) || 0;
    if (salary <= 0 || bonus <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const originalTakeHome = calculateTakeHome(salary);
    const newGrossSalary = salary + bonus;
    const newTakeHome = calculateTakeHome(newGrossSalary);
    const actualBonusReceived = newTakeHome - originalTakeHome;
    const deductionsOnBonus = bonus - actualBonusReceived;
    const effectiveTaxRateOnBonus = deductionsOnBonus / bonus * 100;
    setResults({
      actualBonusReceived,
      deductionsOnBonus,
      effectiveTaxRateOnBonus,
      bonus
    });
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [baseSalary, extraPay]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Overtime & Bonus Tax Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Worked extra hours or got a bonus? Find out how much you'll actually take home after tax and NI." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Pay" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "baseSalary", children: "Your Normal Annual Salary" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "baseSalary",
                  type: "number",
                  value: baseSalary,
                  onChange: (e) => setBaseSalary(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 50000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "extraPay", children: "Overtime/Bonus Amount (Gross)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "extraPay",
                  type: "number",
                  value: extraPay,
                  onChange: (e) => setExtraPay(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 5000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Net Gain"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 border-green-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-green-800", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-6 h-6" }),
            "Your Net Gain"
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-700", children: [
              "From a \xA3",
              results.bonus.toLocaleString(),
              " bonus, you take home:"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-green-900 mt-2", children: [
              "\xA3",
              results.actualBonusReceived.toLocaleString("en-GB", {
                minimumFractionDigits: 2
              })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown of Your Extra Pay" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Bonus/Overtime:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-lg", children: [
                "\xA3",
                results.bonus.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated Tax & NI on this amount:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-lg text-red-600", children: [
                "-\xA3",
                results.deductionsOnBonus.toLocaleString("en-GB", {
                  minimumFractionDigits: 2
                })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center border-t pt-3 mt-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold", children: "Net Amount in Your Pocket:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-lg text-green-700", children: [
                "\xA3",
                results.actualBonusReceived.toLocaleString("en-GB", {
                  minimumFractionDigits: 2
                })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-center p-3 bg-blue-50 rounded-lg", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-blue-800", children: [
              "This represents an effective tax rate of",
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold", children: [
                " ",
                results.effectiveTaxRateOnBonus.toFixed(1),
                "%",
                " "
              ] }),
              "on your extra pay."
            ] }) })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "How much do you keep?" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your salary and extra pay to find out." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  OvertimeBonusCalculator as default
};
