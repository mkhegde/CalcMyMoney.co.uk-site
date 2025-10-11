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
  ArrowRight,
  Calculator,
  PoundSterling,
  Wallet
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SalarySacrificeCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var calculateTakeHome = (salary) => {
  const personalAllowance = 12570;
  const niThreshold = 12570;
  let tax = 0;
  let ni = 0;
  const taxableIncome = Math.max(0, salary - personalAllowance);
  if (taxableIncome > 0) {
    if (taxableIncome <= 50270 - personalAllowance) {
      tax = taxableIncome * 0.2;
    } else if (taxableIncome <= 125140 - personalAllowance) {
      tax = (50270 - personalAllowance) * 0.2 + (taxableIncome - (50270 - personalAllowance)) * 0.4;
    } else {
      tax = (50270 - personalAllowance) * 0.2 + (125140 - 50270) * 0.4 + (taxableIncome - (125140 - personalAllowance)) * 0.45;
    }
  }
  const niableIncome = Math.max(0, salary - niThreshold);
  if (niableIncome > 0) {
    if (niableIncome <= 50270 - niThreshold) {
      ni = niableIncome * 0.08;
    } else {
      ni = (50270 - niThreshold) * 0.08 + (niableIncome - (50270 - niThreshold)) * 0.02;
    }
  }
  return salary - tax - ni;
};
function SalarySacrificeCalculator() {
  const [grossSalary, setGrossSalary] = (0, import_react.useState)("");
  const [sacrificeAmount, setSacrificeAmount] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const salary = Number(grossSalary) || 0;
    const sacrifice = Number(sacrificeAmount) || 0;
    if (salary <= 0 || sacrifice <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const originalTakeHome = calculateTakeHome(salary);
    const originalPension = 0;
    const newSalary = salary - sacrifice;
    const newTakeHome = calculateTakeHome(newSalary);
    const newPension = sacrifice;
    const takeHomeDifference = originalTakeHome - newTakeHome;
    const taxSaving = takeHomeDifference < sacrifice ? sacrifice - takeHomeDifference : 0;
    const newResults = {
      originalTakeHome,
      newTakeHome,
      newPension,
      takeHomeDifference,
      taxSaving
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Before Sacrifice", "After Sacrifice"],
      ["Gross Salary", `\xA3${salary.toFixed(2)}`, `\xA3${newSalary.toFixed(2)}`],
      ["Pension Contribution", "\xA30.00", `\xA3${newPension.toFixed(2)}`],
      ["Take-Home Pay", `\xA3${originalTakeHome.toFixed(2)}`, `\xA3${newTakeHome.toFixed(2)}`],
      ["", "", ""],
      ["Reduction in Take-Home", `\xA3${takeHomeDifference.toFixed(2)}`, ""],
      ["Tax & NI Saving", `\xA3${taxSaving.toFixed(2)}`, ""]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [grossSalary, sacrificeAmount]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Salary Sacrifice Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Pay less tax and boost your pension pot. See how sacrificing a portion of your salary can increase your overall wealth." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossSalary", children: "Annual Gross Salary" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "grossSalary",
                  type: "number",
                  value: grossSalary,
                  onChange: (e) => setGrossSalary(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 50000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "sacrificeAmount", children: "Annual Pension Sacrifice Amount" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "sacrificeAmount",
                  type: "number",
                  value: sacrificeAmount,
                  onChange: (e) => setSacrificeAmount(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 3000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Impact"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Sacrifice Summary" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "salary-sacrifice",
              title: "Salary Sacrifice Summary"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Impact on Your Pay" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-around text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Original Take-Home" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold", children: [
                  "\xA3",
                  results.originalTakeHome.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-6 h-6 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "New Take-Home" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-blue-700", children: [
                  "\xA3",
                  results.newTakeHome.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-red-50 rounded-lg text-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-red-800", children: "Your take-home pay is reduced by:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-red-900", children: [
                "\xA3",
                results.takeHomeDifference.toLocaleString("en-GB", {
                  maximumFractionDigits: 2
                })
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900", children: "Benefit of Sacrificing" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-green-800", children: [
              "Your pension pot increases by \xA3",
              results.newPension.toLocaleString(),
              ", but your take-home only reduces by \xA3",
              results.takeHomeDifference.toLocaleString(),
              "."
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "mt-2 text-3xl font-bold text-green-800", children: [
              "Effective saving of \xA3",
              results.taxSaving.toLocaleString("en-GB", { maximumFractionDigits: 2 })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-700", children: "in tax and National Insurance." })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wallet, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Boost your pension, tax-efficiently" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to see the benefits." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  SalarySacrificeCalculator as default
};
