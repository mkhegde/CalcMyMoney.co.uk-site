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

// src/pages/CommuteCostCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function CommuteCostCalculator() {
  const [distance, setDistance] = (0, import_react.useState)("");
  const [mpg, setMpg] = (0, import_react.useState)("");
  const [fuelPrice, setFuelPrice] = (0, import_react.useState)("");
  const [days, setDays] = (0, import_react.useState)("");
  const [publicTransport, setPublicTransport] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const dist = Number(distance) || 0;
    const vehicleMpg = Number(mpg) || 0;
    const pricePerLitre = Number(fuelPrice) || 0;
    const workDays = Number(days) || 0;
    const ptCost = Number(publicTransport) || 0;
    const LITRES_PER_GALLON = 4.54609;
    const dailyFuelLitres = dist / vehicleMpg * LITRES_PER_GALLON;
    const dailyFuelCost = dailyFuelLitres * pricePerLitre;
    const totalDriveCost = dailyFuelCost * workDays * 4.33;
    const totalPTCost = ptCost * workDays * 4.33;
    setResults({
      monthly: totalDriveCost + totalPTCost,
      weekly: (totalDriveCost + totalPTCost) / 4.33
    });
    setHasCalculated(true);
  }, [distance, mpg, fuelPrice, days, publicTransport]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Commute Cost Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Commute" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Daily Round-Trip Distance (miles)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: distance,
                onChange: (e) => setDistance(e.target.value),
                placeholder: "e.g. 20"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Car MPG" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: mpg,
                onChange: (e) => setMpg(e.target.value),
                placeholder: "e.g. 45"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Fuel Price per Litre (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: fuelPrice,
                onChange: (e) => setFuelPrice(e.target.value),
                placeholder: "e.g. 1.50"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Daily Public Transport Cost (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: publicTransport,
                onChange: (e) => setPublicTransport(e.target.value),
                placeholder: "e.g. 0"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Commute Days per Week" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: days,
                onChange: (e) => setDays(e.target.value),
                placeholder: "e.g. 5"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Calculate"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-indigo-50 border-indigo-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Estimated Monthly Commute Cost" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-indigo-700", children: [
            "\xA3",
            results.monthly.toFixed(2)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm mt-2", children: [
            "~\xA3",
            results.weekly.toFixed(2),
            " per week"
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Car, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Find out how much your commute costs." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  CommuteCostCalculator as default
};
