import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
import "./chunk-AXLI4SNI.js";
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
  Plane,
  Plus,
  Trash2
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/TravelBudgetCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var travelFAQs = [
  {
    question: "How do I estimate costs accurately?",
    answer: "Research is key. Use flight comparison sites, check accommodation prices on booking platforms for your dates, and look up average meal costs at your destination. It's also wise to add a 10-15% contingency for unexpected expenses."
  },
  {
    question: "What are some common forgotten expenses?",
    answer: "Don't forget to budget for travel insurance, visa fees, local transport (taxis, buses), currency exchange fees, and tips. These small costs can add up."
  },
  {
    question: "Any tips for saving money on a trip?",
    answer: "Consider traveling during the 'shoulder seasons' (just outside of peak time) for better prices. Booking flights and accommodation in advance can also lead to significant savings. Eating at local markets or preparing some of your own meals can also cut down food costs."
  }
];
var initialItems = [
  { id: 1, category: "Flights", placeholder: "800", budget: "" },
  { id: 2, category: "Accommodation", placeholder: "1000", budget: "" },
  { id: 3, category: "Food & Drink", placeholder: "700", budget: "" },
  { id: 4, category: "Activities", placeholder: "400", budget: "" }
];
function TravelBudgetCalculator() {
  const [items, setItems] = (0, import_react.useState)(initialItems);
  const [total, setTotal] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };
  const addItem = () => setItems([...items, { id: Date.now(), category: "", placeholder: "e.g. 150", budget: "" }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const handleCalculate = (0, import_react.useCallback)(() => {
    const budgetTotal = items.reduce((acc, item) => acc + (Number(item.budget) || 0), 0);
    setTotal(budgetTotal);
    setHasCalculated(true);
  }, [items]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 py-12 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", children: "Travel & Holiday Budget Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 mt-2", children: "Plan your next holiday with our easy-to-use travel budget calculator. Estimate costs for flights, accommodation, food, and activities." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto p-4 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Trip Expenses" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-3 gap-4 items-center", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  placeholder: "Expense Category",
                  value: item.category,
                  onChange: (e) => handleItemChange(index, "category", e.target.value),
                  className: "col-span-1"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "col-span-2 flex items-center gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    type: "number",
                    placeholder: `e.g. ${item.placeholder}`,
                    value: item.budget,
                    onChange: (e) => handleItemChange(index, "budget", e.target.value),
                    className: "flex-1"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { variant: "ghost", size: "icon", onClick: () => removeItem(index), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4 text-gray-400 hover:text-red-500" }) })
              ] })
            ] }, item.id)),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t pt-4", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { variant: "outline", onClick: addItem, className: "w-full", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }),
              "Add Expense Item"
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg py-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Total Budget"
          ] }) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sticky top-24 space-y-6", children: hasCalculated && total !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-cyan-50 border-cyan-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-cyan-900", children: "Total Trip Budget" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-center", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-cyan-800", children: [
            "\xA3",
            total.toLocaleString()
          ] }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-64 bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready for an adventure?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your costs and click 'Calculate' to see your budget." })
        ] }) }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: travelFAQs, title: "Travel Budgeting Tips" }) })
    ] })
  ] });
}
export {
  TravelBudgetCalculator as default
};
