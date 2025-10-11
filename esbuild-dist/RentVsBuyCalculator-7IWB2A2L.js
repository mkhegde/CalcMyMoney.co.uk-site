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
  Key
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/RentVsBuyCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function RentVsBuyCalculator() {
  const [monthlyRent, setMonthlyRent] = (0, import_react.useState)("");
  const [propertyPrice, setPropertyPrice] = (0, import_react.useState)("");
  const [deposit, setDeposit] = (0, import_react.useState)("");
  const [interestRate, setInterestRate] = (0, import_react.useState)("");
  const [maintenance, setMaintenance] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const rent = Number(monthlyRent) || 0;
    const price = Number(propertyPrice) || 0;
    const dep = Number(deposit) || 0;
    const rate = Number(interestRate) / 100;
    const maint = Number(maintenance) / 100;
    if (rent <= 0 || price <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const loan = price - dep;
    const monthlyMortgage = loan > 0 ? loan * (rate / 12) / (1 - Math.pow(1 + rate / 12, -30 * 12)) : 0;
    const monthlyMaintenance = price * maint / 12;
    const monthlyOwnershipCost = monthlyMortgage + monthlyMaintenance;
    setResults({ rent, ownershipCost: monthlyOwnershipCost });
    setHasCalculated(true);
  }, [monthlyRent, propertyPrice, deposit, interestRate, maintenance]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Rent vs. Buy Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Renting Costs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Monthly Rent (\xA3)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              value: monthlyRent,
              onChange: (e) => setMonthlyRent(e.target.value),
              placeholder: "e.g. 1200"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Buying Costs" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property Price (\xA3)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              value: propertyPrice,
              onChange: (e) => setPropertyPrice(e.target.value),
              placeholder: "e.g. 250000"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deposit (\xA3)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              value: deposit,
              onChange: (e) => setDeposit(e.target.value),
              placeholder: "e.g. 25000"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mortgage Rate (%)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              value: interestRate,
              onChange: (e) => setInterestRate(e.target.value),
              placeholder: "e.g. 5"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Annual Maintenance (%)" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Input,
            {
              type: "number",
              value: maintenance,
              onChange: (e) => setMaintenance(e.target.value),
              placeholder: "e.g. 1"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Compare Costs"
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200 h-full", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Monthly Cost Comparison" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg", children: "Renting" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
                "\xA3",
                results.rent.toLocaleString()
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg", children: "Owning" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
                "\xA3",
                results.ownershipCost.toLocaleString("en-GB", {
                  maximumFractionDigits: 0
                })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            "p",
            {
              className: `mt-4 font-bold ${results.ownershipCost < results.rent ? "text-green-600" : "text-red-600"}`,
              children: results.ownershipCost < results.rent ? "Buying appears cheaper monthly." : "Renting appears cheaper monthly."
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs mt-2 text-gray-500", children: "Note: This is a simplified comparison and does not include house price appreciation or other investment factors." })
        ] })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "w-10 h-10 mx-auto mb-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Which path is cheaper per month?" })
      ] }) }) })
    ] }) })
  ] });
}
export {
  RentVsBuyCalculator as default
};
