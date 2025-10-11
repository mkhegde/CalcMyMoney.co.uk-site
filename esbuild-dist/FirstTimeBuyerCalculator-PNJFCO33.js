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
  House
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/FirstTimeBuyerCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var ftbFAQs = [
  {
    question: "What is Loan-to-Income (LTI)?",
    answer: "Lenders use LTI as a key affordability measure. It's a multiple of your annual gross income. Most lenders cap borrowing at 4.5x your income, though some may offer more under specific circumstances."
  },
  {
    question: "What is First-Time Buyer Stamp Duty relief?",
    answer: "In England & NI, first-time buyers pay 0% SDLT on the first \xA3425,000 of a property's value, and 5% on the portion between \xA3425,001 and \xA3625,000. No relief is available if the property costs more than \xA3625,000."
  },
  {
    question: "What other costs are involved?",
    answer: "Besides the deposit, you'll need to budget for solicitor's fees, mortgage arrangement fees, valuation fees, and moving costs. These can add several thousand pounds to your total upfront cost."
  }
];
function FirstTimeBuyerCalculator() {
  const [propertyPrice, setPropertyPrice] = (0, import_react.useState)("");
  const [deposit, setDeposit] = (0, import_react.useState)("");
  const [income, setIncome] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const handleCalculate = (0, import_react.useCallback)(() => {
    const price = Number(propertyPrice) || 0;
    const dep = Number(deposit) || 0;
    const inc = Number(income) || 0;
    if (price <= 0 || inc <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const mortgageNeeded = price - dep;
    const maxBorrowing = inc * 4.5;
    const lti = mortgageNeeded / inc;
    const depositPercent = dep / price * 100;
    const affordable = mortgageNeeded <= maxBorrowing;
    let sdlt = 0;
    if (price > 425e3 && price <= 625e3) {
      sdlt = (price - 425e3) * 0.05;
    } else if (price > 625e3) {
      const standardThreshold1 = 25e4;
      const standardThreshold2 = 925e3;
      const standardThreshold3 = 15e5;
      if (price > standardThreshold1) {
        sdlt += (Math.min(price, standardThreshold2) - standardThreshold1) * 0.05;
      }
      if (price > standardThreshold2) {
        sdlt += (Math.min(price, standardThreshold3) - standardThreshold2) * 0.1;
      }
      if (price > standardThreshold3) {
        sdlt += (price - standardThreshold3) * 0.12;
      }
    }
    setResults({ mortgageNeeded, maxBorrowing, lti, depositPercent, affordable, sdlt });
    setHasCalculated(true);
  }, [propertyPrice, deposit, income]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-center", children: "First-Time Buyer Calculator" }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto p-4 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property Price (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: propertyPrice,
                  onChange: (e) => setPropertyPrice(e.target.value),
                  placeholder: "e.g. 280000"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Deposit Amount (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: deposit,
                  onChange: (e) => setDeposit(e.target.value),
                  placeholder: "e.g. 30000"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Gross Annual Income (\xA3)" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  type: "number",
                  value: income,
                  onChange: (e) => setIncome(e.target.value),
                  placeholder: "e.g. 55000"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
            "Check Affordability"
          ] }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Affordability Check" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
              "div",
              {
                className: `p-4 rounded-lg ${results.affordable ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`,
                children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-bold", children: results.affordable ? "Looking Good!" : "May Be a Stretch" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm", children: results.affordable ? "The mortgage required is within the typical 4.5x income multiple." : "The mortgage required may exceed what lenders typically offer." })
                ]
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mortgage Needed:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  "\xA3",
                  results.mortgageNeeded.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Max Borrowing (est.):" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  "\xA3",
                  results.maxBorrowing.toLocaleString()
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loan-to-Income Ratio:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  results.lti.toFixed(2),
                  "x"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Deposit Percentage:" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  results.depositPercent.toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Stamp Duty (FTB rate):" }),
                " ",
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
                  "\xA3",
                  results.sdlt.toLocaleString()
                ] })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[220px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-10 h-10 mx-auto mb-2" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "See if you can afford your first home." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: ftbFAQs }) })
    ] })
  ] });
}
export {
  FirstTimeBuyerCalculator as default
};
