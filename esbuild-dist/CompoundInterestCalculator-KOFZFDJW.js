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
  Percent,
  PoundSterling,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/CompoundInterestCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function CompoundInterestCalculator() {
  const [principal, setPrincipal] = (0, import_react.useState)("");
  const [monthlyContribution, setMonthlyContribution] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [years, setYears] = (0, import_react.useState)("");
  const [compoundFrequency, setCompoundFrequency] = (0, import_react.useState)("12");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const p = Number(principal) || 0;
    const pmt = Number(monthlyContribution) || 0;
    const r = Number(interestRate) / 100;
    const t = Number(years) || 0;
    const n = Number(compoundFrequency);
    if (t <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const futureValuePrincipal = p * Math.pow(1 + r / n, n * t);
    let futureValueContributions = 0;
    if (pmt > 0 && r > 0) {
      const monthlyRate = r / 12;
      const months = t * 12;
      futureValueContributions = pmt * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
    } else if (pmt > 0) {
      futureValueContributions = pmt * t * 12;
    }
    const totalAmount = futureValuePrincipal + futureValueContributions;
    const totalContributions = p + pmt * 12 * t;
    const totalInterest = totalAmount - totalContributions;
    const newResults = {
      totalAmount,
      totalContributions,
      totalInterest,
      finalBalance: totalAmount
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Initial Investment", `\xA3${p.toFixed(2)}`],
      ["Monthly Contribution", `\xA3${pmt.toFixed(2)}`],
      ["Interest Rate", `${interestRate}%`],
      ["Time Period", `${t} years`],
      ["", ""],
      ["Total Contributions", `\xA3${totalContributions.toFixed(2)}`],
      ["Interest Earned", `\xA3${totalInterest.toFixed(2)}`],
      ["Final Amount", `\xA3${totalAmount.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [principal, monthlyContribution, interestRate, years, compoundFrequency]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Compound Interest Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: '"Compound interest is the eighth wonder of the world" - Einstein. Discover the magic of time and compounding.' })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Investment Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "principal", children: "Initial Investment" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "principal",
                  type: "number",
                  value: principal,
                  onChange: (e) => setPrincipal(e.target.value),
                  className: "pl-10",
                  placeholder: "e.g. 10000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyContribution", children: "Monthly Contribution" }),
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
                  placeholder: "e.g. 500"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "interestRate", children: "Annual Interest Rate (%)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "interestRate",
                type: "number",
                value: interestRate,
                onChange: (e) => setInterestRate(e.target.value),
                step: "0.1",
                placeholder: "e.g. 7"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "years", children: "Time Period (Years)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                id: "years",
                type: "number",
                value: years,
                onChange: (e) => setYears(e.target.value),
                placeholder: "e.g. 20"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "compound", children: "Compound Frequency" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: compoundFrequency, onValueChange: setCompoundFrequency, children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "1", children: "Annually" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "4", children: "Quarterly" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "12", children: "Monthly" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "365", children: "Daily" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Growth"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Investment Growth" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 border-green-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900", children: "Final Amount" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-12 h-12 mx-auto text-green-600 mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-green-800", children: [
              "\xA3",
              results.finalBalance.toLocaleString()
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-green-700 mt-2", children: [
              "After ",
              years,
              " years"
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Contributions:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                "\xA3",
                results.totalContributions.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interest Earned:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-600", children: [
                "\xA3",
                results.totalInterest.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Growth:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold text-lg", children: results.totalContributions > 0 ? `${(results.totalInterest / results.totalContributions * 100).toFixed(1)}%` : "N/A" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          ExportActions,
          {
            csvData,
            fileName: "compound-interest",
            title: "Compound Interest Calculation"
          }
        ) })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "See the power of compounding" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to watch your money grow." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  CompoundInterestCalculator as default
};
