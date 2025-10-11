import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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
  PartyPopper,
  PoundSterling,
  Trash2
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/WeddingBudgetCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var weddingFAQs = [
  {
    question: "How should I estimate these costs?",
    answer: "Start by researching average prices in your area for each category. Use these figures as a baseline. It's always a good idea to add a 10-15% contingency fund for unexpected expenses."
  },
  {
    question: "What's a good way to save money on a wedding?",
    answer: "Consider an off-peak wedding date (avoiding Saturdays in summer), limiting your guest list, DIY-ing decorations, or choosing a venue that allows you to bring your own suppliers. Prioritise what's most important to you as a couple."
  },
  {
    question: "Should I include honeymoon costs here?",
    answer: "It's up to you! Some couples budget for the honeymoon as part of the overall wedding expenses, while others keep it separate. You can add it as a custom item if you'd like."
  }
];
var initialItems = [
  { id: 1, name: "Venue Hire", placeholder: "4500", value: "" },
  { id: 2, name: "Catering (per head)", placeholder: "75", value: "" },
  { id: 3, name: "Number of Guests", placeholder: "80", value: "" },
  { id: 4, name: "Attire (Dresses, Suits)", placeholder: "2000", value: "" },
  { id: 5, name: "Photography/Videography", placeholder: "1800", value: "" },
  { id: 6, name: "Entertainment (DJ/Band)", placeholder: "1000", value: "" },
  { id: 7, name: "Flowers & Decorations", placeholder: "1200", value: "" },
  { id: 8, name: "Cake", placeholder: "400", value: "" },
  {
    id: 9,
    name: "Contingency Fund (10%)",
    placeholder: "Calculated",
    value: "",
    isCalculated: true
  }
];
function WeddingBudgetCalculator() {
  const [items, setItems] = (0, import_react.useState)(initialItems);
  const [newItemName, setNewItemName] = (0, import_react.useState)("");
  const [newItemPlaceholder, setNewItemPlaceholder] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleItemChange = (id, value) => {
    setItems(items.map((item) => item.id === id ? { ...item, value } : item));
  };
  const handleAddItem = () => {
    if (!newItemName) return;
    const newItem = {
      id: Date.now(),
      name: newItemName,
      placeholder: newItemPlaceholder || "0",
      value: ""
    };
    setItems([...items, newItem]);
    setNewItemName("");
    setNewItemPlaceholder("");
  };
  const handleRemoveItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };
  const handleCalculate = () => {
    let subTotal = 0;
    const guestCount = Number(items.find((i) => i.name === "Number of Guests")?.value) || 0;
    const costPerHead = Number(items.find((i) => i.name === "Catering (per head)")?.value) || 0;
    items.forEach((item) => {
      if (item.name === "Catering (per head)" || item.name === "Number of Guests" || item.isCalculated) {
        return;
      }
      subTotal += Number(item.value) || 0;
    });
    const cateringTotal = guestCount * costPerHead;
    subTotal += cateringTotal;
    const contingency = subTotal * 0.1;
    const grandTotal = subTotal + contingency;
    setResults({
      subTotal,
      contingency,
      grandTotal,
      cateringTotal
    });
    setHasCalculated(true);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", children: "Wedding Budget Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 mt-2", children: "Plan and track your wedding expenses to stay on budget." })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Wedding Costs" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            items.map(
              (item) => !item.isCalculated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid grid-cols-3 gap-4 items-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: `item-${item.id}`, className: "col-span-1", children: item.name }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative col-span-2 flex items-center", children: [
                  !["Catering (per head)", "Number of Guests"].includes(item.name) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: `item-${item.id}`,
                      type: "number",
                      value: item.value,
                      onChange: (e) => handleItemChange(item.id, e.target.value),
                      placeholder: `e.g. ${item.placeholder}`,
                      className: !["Catering (per head)", "Number of Guests"].includes(item.name) ? "pl-10" : ""
                    }
                  ),
                  item.id > 9 && // Allow deleting custom items only
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      onClick: () => handleRemoveItem(item.id),
                      className: "ml-2 text-gray-400 hover:text-red-500",
                      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ] }, item.id)
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "border-t pt-4 space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-sm font-medium text-gray-500", children: "Add a custom expense" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    value: newItemName,
                    onChange: (e) => setNewItemName(e.target.value),
                    placeholder: "Expense name (e.g. Stationery)"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    value: newItemPlaceholder,
                    onChange: (e) => setNewItemPlaceholder(e.target.value),
                    placeholder: "Example cost (e.g. 250)"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { onClick: handleAddItem, children: "Add" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg py-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Calculate Total Budget"
          ] }) })
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sticky top-24 space-y-6", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 border-blue-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900", children: "Total Estimated Budget" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "text-center space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-5xl font-bold text-blue-800", children: [
              "\xA3",
              results.grandTotal.toLocaleString("en-GB", { maximumFractionDigits: 0 })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-left space-y-2 text-sm pt-4 border-t", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Catering Total:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                  "\xA3",
                  results.cateringTotal.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Other Costs Subtotal:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                  "\xA3",
                  (results.subTotal - results.cateringTotal).toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10% Contingency:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                  "\xA3",
                  results.contingency.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-64 bg-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PartyPopper, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to plan your big day?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your costs and click 'Calculate' to see your budget." })
        ] }) }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: weddingFAQs }) })
    ] })
  ] });
}
export {
  WeddingBudgetCalculator as default
};
