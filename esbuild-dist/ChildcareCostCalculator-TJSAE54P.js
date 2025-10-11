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
  CardFooter,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  Baby,
  Calculator
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/ChildcareCostCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function ChildcareCostCalculator() {
  const [cost, setCost] = (0, import_react.useState)("");
  const [days, setDays] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const c = Number(cost) || 0;
    const d = Number(days) || 0;
    const weekly = c * d;
    const monthly = weekly * 4.33;
    const annual = monthly * 12;
    setResults({ weekly, monthly, annual });
    setHasCalculated(true);
  }, [cost, days]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Childcare Cost Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Childcare Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Daily Cost (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: cost,
                onChange: (e) => setCost(e.target.value),
                placeholder: "e.g. 60"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Days per Week" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: days,
                onChange: (e) => setDays(e.target.value),
                placeholder: "e.g. 4"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Calculate"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-pink-50 border-pink-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estimated Costs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Weekly" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
            "\xA3",
            results.weekly.toLocaleString()
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pt-2", children: "Monthly" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-pink-700", children: [
            "\xA3",
            results.monthly.toLocaleString("en-GB", { maximumFractionDigits: 0 })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pt-2", children: "Annual" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
            "\xA3",
            results.annual.toLocaleString("en-GB", { maximumFractionDigits: 0 })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Baby, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter details to see cost estimates." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  ChildcareCostCalculator as default
};
