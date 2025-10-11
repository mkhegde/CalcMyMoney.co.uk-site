import {
  Slider
} from "./chunk-SFFJNVBD.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-ICMCGXKF.js";
import "./chunk-F7QU7XIU.js";
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
  CardFooter,
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  Calculator,
  HandCoins
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/TipCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function TipCalculator() {
  const [bill, setBill] = (0, import_react.useState)("");
  const [tipPercent, setTipPercent] = (0, import_react.useState)("12.5");
  const [people, setPeople] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const b = Number(bill) || 0;
    const t = Number(tipPercent) / 100;
    const p = Number(people) || 1;
    const tipAmount = b * t;
    const total = b + tipAmount;
    const perPerson = total / p;
    setResults({ tipAmount, total, perPerson });
    setHasCalculated(true);
  }, [bill, tipPercent, people]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "UK Tip Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Bill Details" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bill Amount (\xA3)" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: bill,
                onChange: (e) => setBill(e.target.value),
                placeholder: "e.g. 85.50"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, { children: [
              "Tip (",
              tipPercent,
              "%)"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Slider,
              {
                value: [Number(tipPercent)],
                onValueChange: (v) => setTipPercent(String(v[0])),
                max: 30,
                step: 0.5
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Number of People" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: people,
                onChange: (e) => setPeople(e.target.value),
                placeholder: "e.g. 4"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Split The Bill"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-lime-50 border-lime-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Split Amount" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Each Person Pays" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-lime-800", children: [
            "\xA3",
            results.perPerson.toFixed(2)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm pt-2", children: [
            "Total Bill: \xA3",
            results.total.toFixed(2),
            " (inc. \xA3",
            results.tipAmount.toFixed(2),
            " ",
            "tip)"
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandCoins, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Easily split the bill with a tip." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  TipCalculator as default
};
