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
  CardHeader,
  CardTitle
} from "./chunk-JJ75DWPY.js";
import {
  Plus,
  Trash2
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/HouseholdBillsSplitter.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function HouseholdBillsSplitter() {
  const [bills, setBills] = (0, import_react.useState)([
    { name: "Rent", amount: "1200" },
    { name: "Energy", amount: "150" }
  ]);
  const [people, setPeople] = (0, import_react.useState)(2);
  const [results, setResults] = (0, import_react.useState)(null);
  const handleBillChange = (index, field, value) => {
    const newBills = [...bills];
    newBills[index][field] = value;
    setBills(newBills);
  };
  const addBill = () => setBills([...bills, { name: "", amount: "" }]);
  const removeBill = (index) => setBills(bills.filter((_, i) => i !== index));
  const calculate = () => {
    const total = bills.reduce((acc, bill) => acc + (Number(bill.amount) || 0), 0);
    const perPerson = total / people;
    setResults({ total, perPerson });
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "Household Bills Splitter" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Bills & People" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
          bills.map((bill, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                placeholder: "Bill Name",
                value: bill.name,
                onChange: (e) => handleBillChange(index, "name", e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                placeholder: "Amount",
                value: bill.amount,
                onChange: (e) => handleBillChange(index, "amount", e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { variant: "ghost", size: "icon", onClick: () => removeBill(index), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" }) })
          ] }, index)),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { variant: "outline", onClick: addBill, children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }),
            "Add Bill"
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", { children: "Number of People:" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Input,
              {
                type: "number",
                value: people,
                onChange: (e) => setPeople(Number(e.target.value)),
                className: "w-20"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: calculate, className: "w-full", children: "Calculate Split" })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: results && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 border-green-200", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Split Result" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Total Bills" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold", children: [
            "\xA3",
            results.total.toLocaleString()
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "pt-4", children: "Cost Per Person" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-4xl font-bold text-green-700", children: [
            "\xA3",
            results.perPerson.toLocaleString("en-GB", { maximumFractionDigits: 2 })
          ] })
        ] })
      ] }) })
    ] }) })
  ] });
}
export {
  HouseholdBillsSplitter as default
};
