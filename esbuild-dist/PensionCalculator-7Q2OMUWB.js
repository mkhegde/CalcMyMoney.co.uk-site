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
  PoundSterling,
  Shield
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/PensionCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function PensionCalculator() {
  const [currentAge, setCurrentAge] = (0, import_react.useState)("");
  const [retirementAge, setRetirementAge] = (0, import_react.useState)("");
  const [currentPension, setCurrentPension] = (0, import_react.useState)("");
  const [monthlyContribution, setMonthlyContribution] = (0, import_react.useState)("");
  const [employerContribution, setEmployerContribution] = (0, import_react.useState)("");
  const [annualGrowth, setAnnualGrowth] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const age = Number(currentAge) || 0;
    const retAge = Number(retirementAge) || 0;
    const current = Number(currentPension) || 0;
    const monthly = Number(monthlyContribution) || 0;
    const employer = Number(employerContribution) || 0;
    const growth = Number(annualGrowth) || 0;
    if (retAge <= age) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const yearsToRetirement = retAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyGrowthRate = growth / 100 / 12;
    const totalMonthlyContribution = monthly + employer;
    const futureValueCurrent = current * Math.pow(1 + growth / 100, yearsToRetirement);
    let futureValueContributions = 0;
    if (monthlyGrowthRate > 0) {
      futureValueContributions = totalMonthlyContribution * ((Math.pow(1 + monthlyGrowthRate, monthsToRetirement) - 1) / monthlyGrowthRate);
    } else {
      futureValueContributions = totalMonthlyContribution * monthsToRetirement;
    }
    const totalPensionPot = futureValueCurrent + futureValueContributions;
    const totalContributions = current + totalMonthlyContribution * monthsToRetirement;
    const totalGrowth = totalPensionPot - totalContributions;
    const estimatedAnnualIncome = totalPensionPot * 0.04;
    const newResults = {
      yearsToRetirement,
      totalPensionPot,
      totalContributions,
      totalGrowth,
      estimatedAnnualIncome,
      monthlyIncome: estimatedAnnualIncome / 12
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Years to Retirement", yearsToRetirement.toString()],
      ["Total Pension Pot", `\xA3${totalPensionPot.toFixed(2)}`],
      ["Total Contributions", `\xA3${totalContributions.toFixed(2)}`],
      ["Investment Growth", `\xA3${totalGrowth.toFixed(2)}`],
      ["Estimated Annual Income", `\xA3${estimatedAnnualIncome.toFixed(2)}`],
      ["Estimated Monthly Income", `\xA3${(estimatedAnnualIncome / 12).toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    currentAge,
    retirementAge,
    currentPension,
    monthlyContribution,
    employerContribution,
    annualGrowth
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "UK Pension Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "The best time to plant a tree was 20 years ago. The second best time is now. Start planning your retirement today." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Pension Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "currentAge", children: "Current Age" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "currentAge",
                  type: "number",
                  value: currentAge,
                  onChange: (e) => setCurrentAge(e.target.value),
                  placeholder: "e.g. 35"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "retirementAge", children: "Retirement Age" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "retirementAge",
                  type: "number",
                  value: retirementAge,
                  onChange: (e) => setRetirementAge(e.target.value),
                  placeholder: "e.g. 65"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "currentPension", children: "Current Pension Pot" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "currentPension",
                  type: "number",
                  value: currentPension,
                  onChange: (e) => setCurrentPension(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 25000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyContribution", children: "Your Monthly Contribution" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "monthlyContribution",
                  type: "number",
                  value: monthlyContribution,
                  onChange: (e) => setMonthlyContribution(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 300"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "employerContribution", children: "Employer Contribution (Monthly)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "employerContribution",
                  type: "number",
                  value: employerContribution,
                  onChange: (e) => setEmployerContribution(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 200"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "annualGrowth", children: "Expected Annual Growth (%)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "annualGrowth",
                type: "number",
                value: annualGrowth,
                onChange: (e) => setAnnualGrowth(e.target.value),
                step: "0.1",
                placeholder: "e.g. 5"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Pension"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Retirement Forecast" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "pension-forecast",
              title: "Pension Forecast"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Projected Pension Pot" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-12 h-12 mx-auto text-blue-600 mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-blue-800", children: [
              "\xA3",
              results.totalPensionPot.toLocaleString()
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-blue-700 mt-2", children: [
              "At retirement in ",
              results.yearsToRetirement,
              " years"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estimated Retirement Income" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-green-800", children: "Annual Income (4% rule)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-green-900", children: [
                "\xA3",
                results.estimatedAnnualIncome.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-purple-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-purple-800", children: "Monthly Income" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-purple-900", children: [
                "\xA3",
                results.monthlyIncome.toLocaleString()
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Contribution Breakdown" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Contributions:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                "\xA3",
                results.totalContributions.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Investment Growth:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-600", children: [
                "\xA3",
                results.totalGrowth.toLocaleString()
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Plan your retirement" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to forecast your pension." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  PensionCalculator as default
};
