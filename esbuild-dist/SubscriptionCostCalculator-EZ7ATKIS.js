import {
  Input
} from "./chunk-KK4JIGNC.js";
import {
  Button
} from "./chunk-RTS3GJRL.js";
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
  Plus,
  Repeat,
  Trash2
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/SubscriptionCostCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function SubscriptionCostCalculator() {
  const [subs, setSubs] = (0, import_react.useState)([{ id: 1, name: "", amount: "" }]);
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleSubChange = (id, field, value) => {
    const newSubs = subs.map((sub) => sub.id === id ? { ...sub, [field]: value } : sub);
    setSubs(newSubs);
  };
  const addSub = () => setSubs([...subs, { id: Date.now(), name: "", amount: "" }]);
  const removeSub = (id) => setSubs(subs.filter((sub) => sub.id !== id));
  const handleCalculate = (0, import_react.useCallback)(() => {
    const monthlyTotal = subs.reduce((acc, sub) => acc + (Number(sub.amount) || 0), 0);
    setResults({ monthly: monthlyTotal, annual: monthlyTotal * 12 });
    setHasCalculated(true);
  }, [subs]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Subscription Cost Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Monthly Subscriptions" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          subs.map((sub) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                placeholder: "e.g. Netflix",
                value: sub.name,
                onChange: (e) => handleSubChange(sub.id, "name", e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                placeholder: "e.g. 10.99",
                value: sub.amount,
                onChange: (e) => handleSubChange(sub.id, "amount", e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { variant: "ghost", size: "icon", onClick: () => removeSub(sub.id), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }) })
          ] }, sub.id)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { variant: "outline", onClick: addSub, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Subscription"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Calculate Total"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-yellow-50 border-yellow-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Total Subscription Cost" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center space-y-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Monthly Total" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-yellow-800", children: [
            "\xA3",
            results.monthly.toFixed(2)
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pt-4", children: "Annual Total" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
            "\xA3",
            results.annual.toFixed(2)
          ] })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Repeat, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Add your subscriptions to see the total." })
      ] }) }) })
    ] }) })
  ] });
}
export {
  SubscriptionCostCalculator as default
};
