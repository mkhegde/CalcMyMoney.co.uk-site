import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
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
  Car,
  Crown,
  Gem,
  House,
  Plane,
  Plus,
  Sparkles,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/DreamLifestyleCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var dreamItems = {
  property: {
    icon: House,
    items: [
      { name: "Penthouse in Mayfair", value: 25e6 },
      { name: "Country Estate with 500 Acres", value: 15e6 },
      { name: "Luxury Villa in the Cotswolds", value: 8e6 }
    ]
  },
  vehicles: {
    icon: Car,
    items: [
      { name: "Rolls-Royce Phantom", value: 4e5 },
      { name: "Private Jet (Gulfstream G650)", value: 7e7 },
      { name: "Luxury Yacht (100ft)", value: 15e6 }
    ]
  },
  investments: {
    icon: TrendingUp,
    items: [
      { name: "S&P 500 Portfolio", value: 75e4 },
      { name: "Bitcoin (10 BTC)", value: 35e4 },
      { name: "Art Collection (Banksy, Hockney)", value: 5e6 }
    ]
  },
  luxury: {
    icon: Gem,
    items: [
      { name: "Patek Philippe Nautilus", value: 8e4 },
      { name: "Diamond Engagement Ring (5 carat)", value: 15e4 },
      { name: "Herm\xE8s Birkin Bag Collection", value: 2e5 }
    ]
  },
  experiences: {
    icon: Plane,
    items: [
      { name: "Space Tourism Ticket", value: 45e4 },
      { name: "Private Safari in Africa", value: 75e3 },
      { name: "Formula 1 VIP Experience", value: 15e3 }
    ]
  }
};
var getFunResponse = (total) => {
  if (total >= 1e8) {
    return {
      title: "\u{1F3F0} Royalty Status Achieved!",
      message: "You're not just rich, you're 'buy a small country' rich! Even the Queen would be impressed. Time to start practicing your royal wave! \u{1F451}",
      tip: "With great wealth comes great responsibility... and amazing tax planning opportunities!"
    };
  } else if (total >= 5e7) {
    return {
      title: "\u{1F6E9}\uFE0F Private Jet Lifestyle",
      message: "You've entered the stratosphere of wealth! At this level, you probably have people who have people. Don't forget us little people! \u2708\uFE0F",
      tip: "Pro tip: This level of wealth requires serious financial planning. Our pension calculator suddenly seems quite modest!"
    };
  } else if (total >= 25e6) {
    return {
      title: "\u{1F3D6}\uFE0F Island Owner Status",
      message: "Welcome to the 'I own my own island' club! You're so rich, your money has money. Time to start your own currency! \u{1F3DD}\uFE0F",
      tip: "Reality check: Even billionaires started with budgeting. Check out our budget calculator for the journey!"
    };
  } else if (total >= 1e7) {
    return {
      title: "\u{1F3A9} Definitely Not Average",
      message: "You're living like a character from a Jane Austen novel, but with better plumbing! Society parties and fox hunting await! \u{1F98A}",
      tip: "Your fantasy lifestyle is enviable! Want to make some of it reality? Start with our compound interest calculator."
    };
  } else if (total >= 5e6) {
    return {
      title: "\u{1F37E} Champagne Problems",
      message: "You've got 99 problems, but money ain't one! Your biggest worry is which yacht to take to Monaco. Life is tough! \u26F5",
      tip: "Living the dream! But even dreams need planning. Check out our investment calculators to get started."
    };
  } else if (total >= 2e6) {
    return {
      title: "\u{1F3E1} Fancy Pants Territory",
      message: "You're officially in 'I have arrived' territory! Time to practice saying 'my people will call your people' with a straight face! \u{1F3AD}",
      tip: "This lifestyle is achievable with smart planning! Our pension calculator shows how compound growth works magic."
    };
  } else if (total >= 1e6) {
    return {
      title: "\u{1F48E} Millionaire Mindset",
      message: "Welcome to the millionaire's club! You can now afford to be 'eccentric' instead of 'weird'. Embrace your quirkiness! \u{1F3AA}",
      tip: "Being a millionaire is more achievable than you think! Our savings goal calculator can show you the path."
    };
  } else if (total >= 5e5) {
    return {
      title: "\u{1F697} Living Comfortably",
      message: "You're in the 'comfortable' zone! You can afford the good stuff without checking your bank balance first. Living the dream! \u{1F60C}",
      tip: "This level of wealth is definitely within reach! Start with our budget planner to see how to get there."
    };
  } else {
    return {
      title: "\u{1F331} Everyone Starts Somewhere",
      message: "Hey, we all have to start somewhere! Even Jeff Bezos once worried about student loans. Your empire awaits! \u{1F680}",
      tip: "Turn dreams into plans! Our salary calculator and budget planner are perfect places to start your wealth journey."
    };
  }
};
function DreamLifestyleCalculator() {
  const [selectedItems, setSelectedItems] = (0, import_react.useState)({});
  const [customEntries, setCustomEntries] = (0, import_react.useState)({});
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const addItem = (category, item) => {
    const key = `${category}_${item.name}`;
    setSelectedItems((prev) => ({
      ...prev,
      [key]: { ...item, category, quantity: (prev[key]?.quantity || 0) + 1 }
    }));
  };
  const removeItem = (key) => {
    setSelectedItems((prev) => {
      const newItems = { ...prev };
      if (newItems[key].quantity > 1) {
        newItems[key] = { ...newItems[key], quantity: newItems[key].quantity - 1 };
      } else {
        delete newItems[key];
      }
      return newItems;
    });
  };
  const addCustomItem = (e, category) => {
    e.preventDefault();
    const name = e.target.name.value;
    const value = e.target.value.value;
    if (!name || !value || value <= 0) return;
    setCustomEntries((prev) => ({
      ...prev,
      [category]: [...prev[category] || [], { name, value: Number(value) }]
    }));
    e.target.reset();
  };
  const removeCustomItem = (category, index) => {
    setCustomEntries((prev) => ({
      ...prev,
      [category]: prev[category].filter((_, i) => i !== index)
    }));
  };
  const calculateTotal = () => {
    let total = 0;
    Object.values(selectedItems).forEach((item) => {
      total += item.value * item.quantity;
    });
    Object.values(customEntries).forEach((categoryItems) => {
      categoryItems.forEach((item) => {
        total += item.value;
      });
    });
    return total;
  };
  const isItemSelected = (category, item) => {
    const key = `${category}_${item.name}`;
    return selectedItems[key] ? true : false;
  };
  const handleCalculate = () => {
    const total = calculateTotal();
    const response = getFunResponse(total);
    setResults({
      total,
      response,
      itemCount: Object.keys(selectedItems).length + Object.values(customEntries).flat().length
    });
    setHasCalculated(true);
    const csvExportData = [
      ["Category", "Item", "Quantity", "Value"],
      ...Object.values(selectedItems).map((item) => [
        item.category,
        item.name,
        item.quantity,
        item.value * item.quantity
      ]),
      ...Object.entries(customEntries).flatMap(
        ([category, items]) => items.map((item) => [category, item.name, 1, item.value])
      ),
      [],
      ["Summary", "Total Dream Value", "", total.toFixed(2)]
    ];
    setCsvData(csvExportData);
  };
  const clearAll = () => {
    setSelectedItems({});
    setCustomEntries({});
    setResults(null);
    setHasCalculated(false);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        .print-only {
            display: none;
        }
        @media print {
            body {
                background-color: white !important;
            }
            .non-printable {
                display: none !important;
            }
            .printable-area {
                display: block !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 !important;
                width: 100% !important;
                max-width: 100% !important;
            }
            .printable-grid-cols-1 {
                grid-template-columns: 1fr !important;
            }
            .print-title {
                display: block !important;
                text-align: center;
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 2rem;
            }
            .print-only {
                display: block;
                margin-top: 2rem;
            }
            .print-images {
                display: grid !important;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-top: 1.5rem;
                page-break-before: auto;
            }
            .print-images img {
                width: 100%;
                border-radius: 8px;
                aspect-ratio: 16 / 10;
                object-fit: cover;
            }
        }
      ` }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gradient-to-br from-purple-50 to-pink-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-12 h-12 mx-auto text-purple-600 mb-4" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Dream Lifestyle Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: [
        "Go on, live a little in your imagination! Build your fantasy empire and see just how wealthy your dreams really are.",
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-purple-600 font-medium", children: [
          " ",
          "Warning: May cause excessive daydreaming!"
        ] })
      ] })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 printable-grid-cols-1 grid lg:grid-cols-5 gap-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-2 space-y-6 non-printable", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center mb-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Build Your Fantasy Empire" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-600", children: "Click to add pre-defined items or add your own!" })
        ] }),
        Object.entries(dreamItems).map(([category, data]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "hover:shadow-lg transition-shadow", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-3 capitalize", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(data.icon, { className: "w-6 h-6 text-purple-600" }),
            category
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid md:grid-cols-2 gap-3", children: data.items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Button,
              {
                variant: isItemSelected(category, item) ? "default" : "outline",
                onClick: () => addItem(category, item),
                className: `h-auto p-4 text-left justify-start transition-all duration-200 ${isItemSelected(category, item) ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600" : "hover:bg-purple-50 hover:border-purple-300"}`,
                children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-medium", children: item.name }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "div",
                    {
                      className: `text-sm ${isItemSelected(category, item) ? "text-purple-100" : "text-gray-500"}`,
                      children: [
                        "\xA3",
                        item.value.toLocaleString()
                      ]
                    }
                  )
                ] })
              },
              index
            )) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t my-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", { onSubmit: (e) => addCustomItem(e, category), className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-medium", children: "Add a custom item" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid sm:grid-cols-3 gap-2 items-end", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "sm:col-span-2 space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: `${category}-name`, className: "text-xs", children: "Item Name" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: `${category}-name`,
                      name: "name",
                      placeholder: "e.g. My Beach House"
                    }
                  )
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: `${category}-value`, className: "text-xs", children: "Value (\xA3)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: `${category}-value`,
                      name: "value",
                      type: "number",
                      placeholder: "1500000"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { type: "submit", variant: "secondary", size: "sm", className: "w-full", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "w-4 h-4 mr-2" }),
                " Add Custom ",
                category.slice(0, -1)
              ] })
            ] })
          ] })
        ] }, category))
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "My Dream Lifestyle Vision Board" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-purple-800", children: "Your Dream Empire" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: Object.keys(selectedItems).length > 0 || Object.values(customEntries).flat().length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
            Object.entries(selectedItems).map(([key, item]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-sm", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pr-2", children: [
                item.name,
                " ",
                item.quantity > 1 && `(x${item.quantity})`
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                  "\xA3",
                  (item.value * item.quantity).toLocaleString()
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Button,
                  {
                    size: "sm",
                    variant: "ghost",
                    onClick: () => removeItem(key),
                    className: "h-6 w-6 p-0 text-red-500 non-printable",
                    children: "\xD7"
                  }
                )
              ] })
            ] }, key)),
            Object.entries(customEntries).flatMap(
              ([category, items]) => items.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "flex justify-between items-center text-sm",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "pr-2", children: [
                      item.name,
                      " ",
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { className: "text-xs text-purple-600", children: "(Custom)" })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 flex-shrink-0", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                        "\xA3",
                        item.value.toLocaleString()
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Button,
                        {
                          size: "sm",
                          variant: "ghost",
                          onClick: () => removeCustomItem(category, index),
                          className: "h-6 w-6 p-0 text-red-500 non-printable",
                          children: "\xD7"
                        }
                      )
                    ] })
                  ]
                },
                `${category}-${index}`
              ))
            ),
            hasCalculated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "border-t pt-3", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center font-bold text-lg", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Dream Value:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-purple-800", children: [
                "\xA3",
                calculateTotal().toLocaleString()
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2 pt-2 non-printable", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  onClick: handleCalculate,
                  className: "flex-1 bg-purple-600 hover:bg-purple-700",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "w-4 h-4 mr-2" }),
                    "Calculate My Empire!"
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { variant: "outline", onClick: clearAll, children: "Clear All" })
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500 py-8 non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "w-12 h-12 mx-auto mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Start building your dream lifestyle by selecting items above!" })
          ] }) })
        ] }),
        hasCalculated && results && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "text-center text-orange-800 flex items-center justify-between", children: [
              results.response.title,
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExportActions,
                {
                  csvData,
                  fileName: "dream-lifestyle",
                  title: "My Dream Lifestyle Vision Board"
                }
              ) })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-orange-900 mb-2", children: [
                  "\xA3",
                  results.total.toLocaleString()
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-sm text-orange-700", children: "Your total fantasy net worth" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-white rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 mb-3", children: results.response.message }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-blue-600 font-medium", children: results.response.tip })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2 pt-4 border-t non-printable", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-800", children: "Ready to turn dreams into reality?" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: createPageUrl("SalaryCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { size: "sm", variant: "outline", children: "Start with Salary Planning" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: createPageUrl("BudgetCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { size: "sm", variant: "outline", children: "Create a Budget" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: createPageUrl("CompoundInterestCalculator"), children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, { size: "sm", variant: "outline", children: "See Investment Growth" }) })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "print-only", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-6 border-y-2 border-dashed border-gray-300", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg italic text-gray-800", children: '"Imagination is more powerful than knowledge."' }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-md font-semibold text-gray-600 mt-1", children: "- Albert Einstein" })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "print-images", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=800",
                  alt: "Luxury modern home"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: "https://images.unsplash.com/photo-1599793323219-ce4e708f1b13?q=80&w=800",
                  alt: "Yacht on the ocean"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: "https://images.unsplash.com/photo-1555215695-300494945849?q=80&w=800",
                  alt: "Luxury sports car"
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                "img",
                {
                  src: "https://images.unsplash.com/photo-1507525428034-b723a9ce6890?q=80&w=800",
                  alt: "Tropical beach destination"
                }
              )
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  DreamLifestyleCalculator as default
};
