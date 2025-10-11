import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "./chunk-KMQ37Z57.js";
import {
  TooltipProvider
} from "./chunk-RAVJFG7Q.js";
import "./chunk-6QDB6RBQ.js";
import "./chunk-XTM5LKOR.js";
import "./chunk-F7QU7XIU.js";
import "./chunk-G2D7ODQY.js";
import "./chunk-UYVYEFZE.js";
import "./chunk-66ZJ7JT3.js";
import "./chunk-RDJYUOP4.js";
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
  Calculator,
  CircleAlert,
  House,
  Percent,
  PoundSterling,
  TrendingDown,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/RentalIncomeCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var rentalIncomeCalculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "UK Rental Income Calculator 2025/26",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web Browser",
  description: "Free UK rental income calculator for landlords. Calculate rental yield, profit/loss, and tax on rental income with accurate UK rates for 2025/26.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP"
  },
  featureList: [
    "Rental yield calculation",
    "Income tax estimation",
    "Cash flow analysis",
    "Expense tracking",
    "ROI calculation",
    "Cash-on-cash return analysis"
  ]
};
function RentalIncomeCalculator() {
  const [monthlyRent, setMonthlyRent] = (0, import_react.useState)("");
  const [propertyValue, setPropertyValue] = (0, import_react.useState)("");
  const [capitalInvested, setCapitalInvested] = (0, import_react.useState)("");
  const [mortgagePayment, setMortgagePayment] = (0, import_react.useState)("");
  const [insurance, setInsurance] = (0, import_react.useState)("");
  const [maintenance, setMaintenance] = (0, import_react.useState)("");
  const [managementFees, setManagementFees] = (0, import_react.useState)("");
  const [groundRent, setGroundRent] = (0, import_react.useState)("");
  const [serviceFees, setServiceFees] = (0, import_react.useState)("");
  const [voidPeriods, setVoidPeriods] = (0, import_react.useState)("1");
  const [taxRate, setTaxRate] = (0, import_react.useState)("20");
  const [otherAllowableExpenses, setOtherAllowableExpenses] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const currentMonthlyRent = Number(monthlyRent) || 0;
    const currentPropertyValue = Number(propertyValue) || 0;
    const currentCapitalInvested = Number(capitalInvested) || 0;
    if (currentMonthlyRent <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const annualRentBeforeVoids = currentMonthlyRent * 12;
    const voidLoss = currentMonthlyRent * (Number(voidPeriods) || 0);
    const annualRentAfterVoids = annualRentBeforeVoids - voidLoss;
    const annualMortgage = (Number(mortgagePayment) || 0) * 12;
    const annualInsurance = Number(insurance) || 0;
    const annualMaintenance = Number(maintenance) || 0;
    const annualManagementFees = (Number(managementFees) || 0) * 12;
    const annualGroundRent = Number(groundRent) || 0;
    const annualServiceFees = Number(serviceFees) || 0;
    const annualOtherExpenses = Number(otherAllowableExpenses) || 0;
    const totalExpenses = annualMortgage + annualInsurance + annualMaintenance + annualManagementFees + annualGroundRent + annualServiceFees + annualOtherExpenses;
    const profitBeforeTax = annualRentAfterVoids - totalExpenses;
    const taxOwed = profitBeforeTax > 0 ? profitBeforeTax * (Number(taxRate) / 100) : 0;
    const netProfit = profitBeforeTax - taxOwed;
    const grossYield = currentPropertyValue > 0 ? annualRentBeforeVoids / currentPropertyValue * 100 : 0;
    const netYield = currentPropertyValue > 0 ? netProfit / currentPropertyValue * 100 : 0;
    const cashOnCashReturn = currentCapitalInvested > 0 ? netProfit / currentCapitalInvested * 100 : 0;
    const newResults = {
      annualRentBeforeVoids,
      voidLoss,
      annualRentAfterVoids,
      totalExpenses,
      profitBeforeTax,
      taxOwed,
      netProfit,
      grossYield,
      netYield,
      cashOnCashReturn,
      // Add to results
      monthlyNetProfit: netProfit / 12,
      expenses: {
        mortgage: annualMortgage,
        insurance: annualInsurance,
        maintenance: annualMaintenance,
        management: annualManagementFees,
        groundRent: annualGroundRent,
        serviceFees: annualServiceFees,
        otherExpenses: annualOtherExpenses
      }
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Description", "Annual", "Monthly"],
      [
        "Rental Income (before voids)",
        `\xA3${newResults.annualRentBeforeVoids.toFixed(2)}`,
        `\xA3${currentMonthlyRent.toFixed(2)}`
      ],
      [
        "Void Periods Loss",
        `\xA3${(-newResults.voidLoss).toFixed(2)}`,
        `\xA3${(-newResults.voidLoss / 12).toFixed(2)}`
      ],
      [
        "Net Rental Income",
        `\xA3${newResults.annualRentAfterVoids.toFixed(2)}`,
        `\xA3${(newResults.annualRentAfterVoids / 12).toFixed(2)}`
      ],
      ["", "", ""],
      ["EXPENSES", "", ""],
      [
        "Mortgage Payments",
        `\xA3${(-newResults.expenses.mortgage).toFixed(2)}`,
        `\xA3${(-newResults.expenses.mortgage / 12).toFixed(2)}`
      ],
      [
        "Insurance",
        `\xA3${(-newResults.expenses.insurance).toFixed(2)}`,
        `\xA3${(-newResults.expenses.insurance / 12).toFixed(2)}`
      ],
      [
        "Maintenance",
        `\xA3${(-newResults.expenses.maintenance).toFixed(2)}`,
        `\xA3${(-newResults.expenses.maintenance / 12).toFixed(2)}`
      ],
      [
        "Management Fees",
        `\xA3${(-newResults.expenses.management).toFixed(2)}`,
        `\xA3${(-newResults.expenses.management / 12).toFixed(2)}`
      ],
      [
        "Ground Rent",
        `\xA3${(-newResults.expenses.groundRent).toFixed(2)}`,
        `\xA3${(-newResults.expenses.groundRent / 12).toFixed(2)}`
      ],
      [
        "Service Fees",
        `\xA3${(-newResults.expenses.serviceFees).toFixed(2)}`,
        `\xA3${(-newResults.expenses.serviceFees / 12).toFixed(2)}`
      ],
      [
        "Other Expenses",
        `\xA3${(-newResults.expenses.otherExpenses).toFixed(2)}`,
        `\xA3${(-newResults.expenses.otherExpenses / 12).toFixed(2)}`
      ],
      [
        "Total Expenses",
        `\xA3${(-newResults.totalExpenses).toFixed(2)}`,
        `\xA3${(-newResults.totalExpenses / 12).toFixed(2)}`
      ],
      ["", "", ""],
      [
        "Profit Before Tax",
        `\xA3${newResults.profitBeforeTax.toFixed(2)}`,
        `\xA3${(newResults.profitBeforeTax / 12).toFixed(2)}`
      ],
      [
        "Tax Owed",
        `\xA3${(-newResults.taxOwed).toFixed(2)}`,
        `\xA3${(-newResults.taxOwed / 12).toFixed(2)}`
      ],
      [
        "Net Profit After Tax",
        `\xA3${newResults.netProfit.toFixed(2)}`,
        `\xA3${newResults.monthlyNetProfit.toFixed(2)}`
      ],
      ["", "", ""],
      currentPropertyValue > 0 ? ["Gross Rental Yield", `${newResults.grossYield.toFixed(2)}%`, ""] : null,
      currentPropertyValue > 0 ? ["Net Rental Yield", `${newResults.netYield.toFixed(2)}%`, ""] : null,
      currentCapitalInvested > 0 ? ["Cash-on-Cash Return", `${newResults.cashOnCashReturn.toFixed(2)}%`, ""] : null
    ].filter(Boolean);
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [
    monthlyRent,
    propertyValue,
    capitalInvested,
    mortgagePayment,
    insurance,
    maintenance,
    managementFees,
    groundRent,
    serviceFees,
    voidPeriods,
    taxRate,
    otherAllowableExpenses
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(rentalIncomeCalculatorJsonLd) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TooltipProvider, { children: [
      " ",
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Rental Income Calculator 2025/26" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your rental property profit, tax obligations, and rental yield. Free calculator for UK landlords and property investors." })
        ] }) }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Rental Income Calculation Results" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-1 space-y-6 non-printable", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-5 h-5" }),
                  "Property Details"
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyRent", children: "Monthly Rental Income" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "monthlyRent",
                          type: "number",
                          value: monthlyRent,
                          onChange: (e) => setMonthlyRent(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 1500"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "propertyValue", children: "Property Value (Optional)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "propertyValue",
                          type: "number",
                          value: propertyValue,
                          onChange: (e) => setPropertyValue(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 300000"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "(for rental yield calculation)" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "capitalInvested", children: "Total Capital Invested (Optional)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "capitalInvested",
                          type: "number",
                          value: capitalInvested,
                          onChange: (e) => setCapitalInvested(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 50000"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "(for cash-on-cash return calculation - e.g., deposit, legal fees, stamp duty)" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "voidPeriods", children: "Void Periods (months per year)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                      Input,
                      {
                        id: "voidPeriods",
                        type: "number",
                        value: voidPeriods,
                        onChange: (e) => setVoidPeriods(e.target.value),
                        placeholder: "e.g. 1",
                        min: "0",
                        max: "12"
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Months property is empty annually" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-5 h-5" }),
                  "Monthly Expenses"
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "mortgagePayment", children: "Mortgage Payment" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "mortgagePayment",
                          type: "number",
                          value: mortgagePayment,
                          onChange: (e) => setMortgagePayment(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 800"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Monthly mortgage payment" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "managementFees", children: "Management Fees" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "managementFees",
                          type: "number",
                          value: managementFees,
                          onChange: (e) => setManagementFees(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 120"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Monthly agent fees (typically 8-12% of rent)" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Annual Expenses" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "insurance", children: "Buildings/Contents Insurance" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "insurance",
                          type: "number",
                          value: insurance,
                          onChange: (e) => setInsurance(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 400"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Annual insurance premium" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "maintenance", children: "Maintenance & Repairs" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "maintenance",
                          type: "number",
                          value: maintenance,
                          onChange: (e) => setMaintenance(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 1000"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Annual budget for repairs and maintenance" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "groundRent", children: "Ground Rent" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "groundRent",
                          type: "number",
                          value: groundRent,
                          onChange: (e) => setGroundRent(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 300"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Annual ground rent charge" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "serviceFees", children: "Service Charges" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "serviceFees",
                          type: "number",
                          value: serviceFees,
                          onChange: (e) => setServiceFees(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 500"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Annual service charge (leasehold properties)" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "otherAllowableExpenses", children: "Other Allowable Expenses" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "otherAllowableExpenses",
                          type: "number",
                          value: otherAllowableExpenses,
                          onChange: (e) => setOtherAllowableExpenses(e.target.value),
                          className: "pl-10",
                          placeholder: "e.g. 200"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Annual legal fees, accountancy, etc." })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tax Settings" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "taxRate", children: "Your Income Tax Rate (%)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Input,
                        {
                          id: "taxRate",
                          type: "number",
                          value: taxRate,
                          onChange: (e) => setTaxRate(e.target.value),
                          className: "pl-10",
                          placeholder: "20"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Basic: 20%, Higher: 40%, Additional: 45%" })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                    "Calculate Rental Income"
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Rental Income Analysis" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  ExportActions,
                  {
                    csvData,
                    fileName: "rental-income-calculation",
                    title: "Rental Income Calculation"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Card,
                  {
                    className: `${results.netProfit >= 0 ? "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700" : "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700"}`,
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium", children: "Monthly Net Profit" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          "p",
                          {
                            className: `text-2xl font-bold ${results.netProfit >= 0 ? "text-green-900" : "text-red-900"}`,
                            children: [
                              results.netProfit >= 0 ? "\xA3" : "-\xA3",
                              Math.abs(results.monthlyNetProfit).toLocaleString("en-GB", {
                                maximumFractionDigits: 0
                              })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        TrendingUp,
                        {
                          className: `w-8 h-8 ${results.netProfit >= 0 ? "text-green-600" : "text-red-600"}`
                        }
                      )
                    ] }) })
                  }
                ),
                propertyValue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-blue-800", children: "Gross Yield" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-blue-900", children: [
                        results.grossYield.toFixed(2),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-8 h-8 text-blue-600" })
                  ] }) }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-purple-800", children: "Net Yield" }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-purple-900", children: [
                        results.netYield.toFixed(2),
                        "%"
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-8 h-8 text-purple-600" })
                  ] }) }) })
                ] }),
                capitalInvested && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-orange-800", children: "Cash-on-Cash Return" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "p",
                      {
                        className: `text-2xl font-bold ${results.cashOnCashReturn >= 0 ? "text-green-900" : "text-red-900"}`,
                        children: [
                          results.cashOnCashReturn.toFixed(2),
                          "%"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    TrendingUp,
                    {
                      className: `w-8 h-8 ${results.cashOnCashReturn >= 0 ? "text-green-600" : "text-red-600"}`
                    }
                  )
                ] }) }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Income & Expense Breakdown" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-4", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-green-700 mb-3", children: "Annual Rental Income" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Rental Income:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-green-600", children: [
                          "\xA3",
                          results.annualRentBeforeVoids.toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "Less: Void Periods (",
                          voidPeriods,
                          " months):"
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-600", children: [
                          "-\xA3",
                          results.voidLoss.toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: "Net Rental Income:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-green-700", children: [
                          "\xA3",
                          results.annualRentAfterVoids.toLocaleString()
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-red-700 mb-3", children: "Annual Expenses" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2 text-sm", children: [
                      results.expenses.mortgage > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Mortgage Payments:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.mortgage.toLocaleString()
                        ] })
                      ] }),
                      results.expenses.management > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Management Fees:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.management.toLocaleString()
                        ] })
                      ] }),
                      results.expenses.insurance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Insurance:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.insurance.toLocaleString()
                        ] })
                      ] }),
                      results.expenses.maintenance > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Maintenance & Repairs:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.maintenance.toLocaleString()
                        ] })
                      ] }),
                      results.expenses.groundRent > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ground Rent:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.groundRent.toLocaleString()
                        ] })
                      ] }),
                      results.expenses.serviceFees > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Service Charges:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.serviceFees.toLocaleString()
                        ] })
                      ] }),
                      results.expenses.otherExpenses > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Other Expenses:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "-\xA3",
                          results.expenses.otherExpenses.toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-semibold", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Expenses:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "text-red-700", children: [
                          "-\xA3",
                          results.totalExpenses.toLocaleString()
                        ] })
                      ] })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold text-gray-700 mb-3", children: "Profit & Tax" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Profit Before Tax:" }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                          "span",
                          {
                            className: `font-semibold ${results.profitBeforeTax >= 0 ? "text-green-600" : "text-red-600"}`,
                            children: [
                              results.profitBeforeTax >= 0 ? "\xA3" : "-\xA3",
                              Math.abs(results.profitBeforeTax).toLocaleString()
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                          "Income Tax (",
                          taxRate,
                          "%):"
                        ] }),
                        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-red-600", children: [
                          "-\xA3",
                          results.taxOwed.toLocaleString()
                        ] })
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                        "div",
                        {
                          className: `flex justify-between border-t pt-2 font-bold text-lg ${results.netProfit >= 0 ? "text-green-700" : "text-red-700"}`,
                          children: [
                            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net Annual Profit:" }),
                            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                              results.netProfit >= 0 ? "\xA3" : "-\xA3",
                              Math.abs(results.netProfit).toLocaleString()
                            ] })
                          ]
                        }
                      )
                    ] })
                  ] })
                ] }) })
              ] }),
              propertyValue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Rental Yield Analysis" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold mb-2", children: "Gross Rental Yield" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-blue-700", children: [
                      results.grossYield.toFixed(2),
                      "%"
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600 mt-2", children: [
                      "Based on gross annual rent of \xA3",
                      results.annualRentBeforeVoids.toLocaleString(),
                      " and property value of \xA3",
                      Number(propertyValue).toLocaleString()
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold mb-2", children: "Net Rental Yield" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                      "p",
                      {
                        className: `text-3xl font-bold ${results.netYield >= 0 ? "text-green-700" : "text-red-700"}`,
                        children: [
                          results.netYield.toFixed(2),
                          "%"
                        ]
                      }
                    ),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600 mt-2", children: [
                      "After all expenses and tax, based on net profit of \xA3",
                      Math.abs(results.netProfit).toLocaleString()
                    ] })
                  ] })
                ] }) })
              ] }),
              capitalInvested && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Capital Invested Analysis" }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid md:grid-cols-1 gap-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold mb-2", children: "Cash-on-Cash Return" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                    "p",
                    {
                      className: `text-3xl font-bold ${results.cashOnCashReturn >= 0 ? "text-green-700" : "text-red-700"}`,
                      children: [
                        results.cashOnCashReturn.toFixed(2),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600 mt-2", children: [
                    "Annual net profit (\xA3",
                    Math.abs(results.netProfit).toLocaleString(),
                    ") as a percentage of your total cash invested (\xA3",
                    Number(capitalInvested).toLocaleString(),
                    ")."
                  ] })
                ] }) }) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-4 flex items-start gap-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 text-amber-700 mt-0.5" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-amber-800", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-semibold mb-2", children: "Important Tax Information:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-1 text-xs", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Rental income is added to your total income for tax purposes" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 You can claim tax relief on allowable expenses" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Mortgage interest relief is restricted (gradually being phased out)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Consider the impact on your overall tax position" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 This calculator provides estimates only - consult a tax advisor for accurate advice" })
                  ] })
                ] })
              ] }) })
            ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-12 h-12 mx-auto mb-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to analyze your rental income?" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your rental income and expenses to see your profit and yield calculations." }),
              hasCalculated && !results && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-500 mt-2", children: "Please enter a valid monthly rent amount." })
            ] }) }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          FAQSection,
          {
            faqs: rentalIncomeFAQs,
            title: "Rental Income - Frequently Asked Questions"
          }
        ) }) })
      ] })
    ] })
  ] });
}
var FAQSection = ({ faqs, title }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "py-8", children: [
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-6 text-center", children: title }),
  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Accordion, { type: "single", collapsible: true, className: "w-full", children: faqs.map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AccordionItem, { value: `item-${index}`, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionTrigger, { className: "text-left", children: faq.question }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccordionContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: faq.answer }) })
  ] }, `faq-${index}`)) })
] });
var rentalIncomeFAQs = [
  {
    question: "What is rental yield and why is it important?",
    answer: "Rental yield shows the annual return on your property investment as a percentage. Gross yield is annual rent divided by property value. Net yield considers expenses. In the UK, gross yields typically range from 3-8% depending on location. Higher yields often indicate higher risk areas or properties requiring more management."
  },
  {
    question: "What expenses can I claim against rental income?",
    answer: "You can claim legitimate business expenses including: mortgage interest (with restrictions for higher-rate taxpayers), insurance, maintenance and repairs, management fees, ground rent and service charges, accountancy fees, and advertising for tenants. You cannot claim capital improvements or your own time."
  },
  {
    question: "How do I account for void periods?",
    answer: "Void periods (empty property between tenants) are inevitable. Budget 1-2 weeks per year minimum, more in areas with high tenant turnover. Our calculator lets you specify void periods in months per year. Factor this into your cash flow projections as it directly impacts your actual rental income."
  },
  {
    question: "What's a good rental yield for UK property?",
    answer: "This varies by location and property type. Generally: 4-6% gross yield in expensive areas like London, 6-8% in most UK cities, 8%+ in cheaper areas (but often with higher management needs). Consider net yield after expenses - typically 2-4% lower than gross yield."
  },
  {
    question: "Should I use a letting agent or manage the property myself?",
    answer: "Letting agents typically charge 8-12% of rent plus setup fees, but provide tenant finding, rent collection, maintenance coordination, and legal compliance. Self-management saves money but requires time and knowledge of landlord obligations. Factor management costs into your calculations either way."
  },
  {
    question: "How much should I budget for maintenance and repairs?",
    answer: "Budget 10-15% of annual rent for maintenance and repairs, more for older properties. This covers regular maintenance, emergency repairs, safety checks (gas/electrical), and periodic updates. New-build properties may need less initially but will require more as they age."
  },
  {
    question: "What insurance do I need as a landlord?",
    answer: "You need buildings insurance (often required by mortgage lender) and should consider landlord insurance covering liability, loss of rent, and contents if furnished. Costs vary by property value, location, and coverage level - typically \xA3200-\xA3600 annually for standard properties."
  },
  {
    question: "How do taxes work on rental income?",
    answer: "Rental income is added to your other income and taxed at your marginal rate (20%, 40%, or 45%). You can deduct allowable expenses. Higher-rate taxpayers have restrictions on mortgage interest relief. Consider the \xA31,000 property allowance for small landlords. Seek professional advice for complex situations."
  }
];
export {
  RentalIncomeCalculator as default
};
