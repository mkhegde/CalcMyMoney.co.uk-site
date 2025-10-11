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
  Calculator,
  Car
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/CarCostCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function CarCostCalculator() {
  const [price, setPrice] = (0, import_react.useState)("");
  const [years, setYears] = (0, import_react.useState)("");
  const [insurance, setInsurance] = (0, import_react.useState)("");
  const [tax, setTax] = (0, import_react.useState)("");
  const [maintenance, setMaintenance] = (0, import_react.useState)("");
  const [fuel, setFuel] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const p = Number(price) || 0;
    const y = Number(years) || 1;
    const ins = Number(insurance) || 0;
    const t = Number(tax) || 0;
    const maint = Number(maintenance) || 0;
    const f = Number(fuel) || 0;
    const depreciation = p * 0.6;
    const totalRunningCosts = (ins + t + maint) * y + f * 12 * y;
    const totalCost = depreciation + totalRunningCosts;
    setResults({
      total: totalCost,
      monthly: totalCost / (y * 12),
      annual: totalCost / y,
      years: y
    });
    setHasCalculated(true);
  }, [price, years, insurance, tax, maintenance, fuel]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Total Car Cost Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Car Costs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase Price (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: price,
                onChange: (e) => setPrice(e.target.value),
                placeholder: "e.g. 20000"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ownership Term (Years)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: years,
                onChange: (e) => setYears(e.target.value),
                placeholder: "e.g. 5"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Insurance (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: insurance,
                onChange: (e) => setInsurance(e.target.value),
                placeholder: "e.g. 800"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Tax/MOT (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: tax,
                onChange: (e) => setTax(e.target.value),
                placeholder: "e.g. 180"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Maintenance (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: maintenance,
                onChange: (e) => setMaintenance(e.target.value),
                placeholder: "e.g. 500"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly Fuel Cost (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: fuel,
                onChange: (e) => setFuel(e.target.value),
                placeholder: "e.g. 150"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Calculate True Cost"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-purple-50 border-purple-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "True Cost of Ownership" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm", children: [
            "Total Cost over ",
            results.years,
            " years"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
            "\xA3",
            results.total.toLocaleString()
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm pt-2", children: "Annual Cost" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold", children: [
            "\xA3",
            results.annual.toLocaleString("en-GB", { maximumFractionDigits: 0 })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm pt-2", children: "Monthly Cost" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-purple-700", children: [
            "\xA3",
            results.monthly.toLocaleString("en-GB", { maximumFractionDigits: 0 })
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Discover the true cost of your car." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  CarCostCalculator as default
};
