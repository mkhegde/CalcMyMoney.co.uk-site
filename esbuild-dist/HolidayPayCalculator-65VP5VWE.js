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
  CalendarDays
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/HolidayPayCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var STATUTORY_WEEKS = 5.6;
function HolidayPayCalculator() {
  const [calculationType, setCalculationType] = (0, import_react.useState)("days");
  const [daysPerWeek, setDaysPerWeek] = (0, import_react.useState)("");
  const [dailyRate, setDailyRate] = (0, import_react.useState)("");
  const [weeksWorked, setWeeksWorked] = (0, import_react.useState)("");
  const [hourlyRate, setHourlyRate] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    let holidayEntitlement = 0;
    let holidayPay = 0;
    if (calculationType === "days") {
      const days = Number(daysPerWeek) || 0;
      const rate = Number(dailyRate) || 0;
      if (days > 0 && days <= 7) {
        holidayEntitlement = Math.min(days * STATUTORY_WEEKS, 28);
        holidayPay = holidayEntitlement * rate;
      }
    } else {
      const weeks = Number(weeksWorked) || 0;
      const rate = Number(hourlyRate) || 0;
      if (weeks > 0 && rate > 0) {
        holidayEntitlement = weeks * 12.07 / 100;
        const avgWeeklyHours = weeks;
        const avgWeeklyPay = avgWeeklyHours * rate;
        holidayPay = avgWeeklyPay * STATUTORY_WEEKS;
      }
    }
    const newResults = {
      holidayEntitlement,
      holidayPay
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      [
        "Holiday Entitlement",
        `${newResults.holidayEntitlement.toFixed(2)} ${calculationType === "days" ? "days" : "hours"}`
      ],
      ["Estimated Holiday Pay", `\xA3${newResults.holidayPay.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [calculationType, daysPerWeek, dailyRate, weeksWorked, hourlyRate]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Holiday Pay & Entitlement Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Everyone needs a break. Make sure you're getting the paid time off you're entitled to." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Work Pattern" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: calculationType, onValueChange: setCalculationType, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "days", children: "I work a fixed number of days per week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "irregular", children: "I work irregular hours / am on a zero-hour contract" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
          calculationType === "days" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "daysPerWeek", children: "Days worked per week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "daysPerWeek",
                  type: "number",
                  value: daysPerWeek,
                  onChange: (e) => setDaysPerWeek(e.target.value),
                  placeholder: "e.g. 5"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "dailyRate", children: "Normal daily pay (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "dailyRate",
                  type: "number",
                  value: dailyRate,
                  onChange: (e) => setDailyRate(e.target.value),
                  placeholder: "e.g. 150"
                }
              )
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "weeksWorked", children: "Average hours worked per week" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "weeksWorked",
                  type: "number",
                  value: weeksWorked,
                  onChange: (e) => setWeeksWorked(e.target.value),
                  placeholder: "e.g. 30"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "hourlyRate", children: "Your hourly rate (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "hourlyRate",
                  type: "number",
                  value: hourlyRate,
                  onChange: (e) => setHourlyRate(e.target.value),
                  placeholder: "e.g. 11.50"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "For irregular hours, holiday pay is based on your average pay over the previous 52 weeks worked." })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Entitlement"
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Holiday Entitlement" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            ExportActions,
            {
              csvData,
              fileName: "holiday-entitlement",
              title: "Holiday Entitlement"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Annual Entitlement" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4 text-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-blue-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-blue-800", children: "Annual Holiday Days/Hours" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-blue-900", children: [
                results.holidayEntitlement.toFixed(1),
                " ",
                calculationType === "days" ? "days" : "hours"
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-green-50 rounded-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-green-800", children: "Total Holiday Pay" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-green-900", children: [
                "\xA3",
                results.holidayPay.toLocaleString("en-GB", { maximumFractionDigits: 2 })
              ] })
            ] })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "w-12 h-12 mx-auto mb-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Know your time off" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your details to calculate your holiday pay." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  HolidayPayCalculator as default
};
