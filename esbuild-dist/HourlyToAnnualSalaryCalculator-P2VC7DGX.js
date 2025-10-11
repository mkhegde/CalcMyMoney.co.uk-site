import {
  getRelatedCalculators
} from "./chunk-PZGFNW2T.js";
import "./chunk-ROKYT3OR.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  useLocation
} from "./chunk-ZLF73IFG.js";
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
  ArrowRightLeft,
  Calculator,
  Clock,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/HourlyToAnnualSalaryCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function HourlyToAnnualSalaryCalculator() {
  const { pathname } = useLocation();
  const [hourlyRate, setHourlyRate] = (0, import_react.useState)("");
  const [hoursPerWeek, setHoursPerWeek] = (0, import_react.useState)("37.5");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = () => {
    const rate = Number(hourlyRate) || 0;
    const hours = Number(hoursPerWeek) || 0;
    if (rate <= 0 || hours <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const weekly = rate * hours;
    const monthly = weekly * 4.333;
    const annual = weekly * 52;
    setResults({ weekly, monthly, annual });
    setHasCalculated(true);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [hourlyRate, hoursPerWeek]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Hourly to Annual Salary Converter" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Quickly convert your hourly wage into weekly, monthly, and annual gross salary figures." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "hourlyRate", children: "Your Hourly Rate" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "hourlyRate",
                    type: "number",
                    value: hourlyRate,
                    onChange: (e) => setHourlyRate(e.target.value),
                    className: "pl-10",
                    placeholder: "e.g. 15.50"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "hoursPerWeek", children: "Hours Worked Per Week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "hoursPerWeek",
                    type: "number",
                    value: hoursPerWeek,
                    onChange: (e) => setHoursPerWeek(e.target.value),
                    className: "pl-10"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-5 h-5 mr-2" }),
              "Convert"
            ] })
          ] })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-800", children: "Your Salary Conversion" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-white rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Weekly Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [
                "\xA3",
                results.weekly.toLocaleString("en-GB", { minimumFractionDigits: 2 })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-white rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Monthly Salary (approx.)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [
                "\xA3",
                results.monthly.toLocaleString("en-GB", { minimumFractionDigits: 2 })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-6 bg-blue-100 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg font-medium text-blue-800", children: "Annual Gross Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-extrabold text-blue-900", children: [
                "\xA3",
                results.annual.toLocaleString("en-GB", { minimumFractionDigits: 2 })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "See the bigger picture" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your hourly rate to see your annual earnings." })
        ] }) }) })
      ] }),
      (() => {
        const related = getRelatedCalculators(pathname, { max: 3 });
        return Array.isArray(related) && related.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelatedCalculators, { calculators: related }) : null;
      })()
    ] })
  ] });
}
export {
  HourlyToAnnualSalaryCalculator as default
};
