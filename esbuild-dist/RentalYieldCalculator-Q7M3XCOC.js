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
  Building,
  Calculator,
  Percent,
  PiggyBank,
  TrendingDown,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/RentalYieldCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var rentalYieldCalculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "FinancialProduct",
  name: "UK Rental Yield Calculator",
  description: "Free UK rental yield calculator to measure gross and net yield, cash flow and cash-on-cash return for buy-to-let properties.",
  applicationCategory: "RealEstateApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP"
  },
  url: "https://www.calcMyMoney.co.uk/rental-yield-calculator",
  keywords: [
    "rental yield calculator",
    "buy-to-let yield",
    "property investment calculator",
    "cash on cash return"
  ]
};
var formatCurrency = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value);
var formatPercent = (value) => `${value.toFixed(2)}%`;
function RentalYieldCalculator() {
  const [propertyValue, setPropertyValue] = (0, import_react.useState)("");
  const [monthlyRent, setMonthlyRent] = (0, import_react.useState)("");
  const [monthlyMortgage, setMonthlyMortgage] = (0, import_react.useState)("");
  const [monthlyMaintenance, setMonthlyMaintenance] = (0, import_react.useState)("");
  const [otherMonthlyCosts, setOtherMonthlyCosts] = (0, import_react.useState)("");
  const [annualInsurance, setAnnualInsurance] = (0, import_react.useState)("");
  const [annualGroundRent, setAnnualGroundRent] = (0, import_react.useState)("");
  const [managementFeePercent, setManagementFeePercent] = (0, import_react.useState)("10");
  const [voidMonths, setVoidMonths] = (0, import_react.useState)("1");
  const [cashInvested, setCashInvested] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const handleCalculate = () => {
    const value = Number(propertyValue) || 0;
    const rent = Number(monthlyRent) || 0;
    const mortgage = Number(monthlyMortgage) || 0;
    const maintenance = Number(monthlyMaintenance) || 0;
    const otherCosts = Number(otherMonthlyCosts) || 0;
    const insurance = Number(annualInsurance) || 0;
    const groundRent = Number(annualGroundRent) || 0;
    const managementRate = Number(managementFeePercent) || 0;
    const voids = Math.min(Math.max(Number(voidMonths) || 0, 0), 12);
    const investedCash = Number(cashInvested) || 0;
    if (value <= 0 || rent <= 0) {
      setResults(null);
      setHasCalculated(true);
      setCsvData(null);
      return;
    }
    const annualRent = rent * 12;
    const effectiveMonths = 12 - voids;
    const rentAfterVoids = rent * effectiveMonths;
    const managementFees = rentAfterVoids * (managementRate / 100);
    const annualMortgage = mortgage * 12;
    const annualMaintenance = maintenance * 12;
    const annualOtherCosts = otherCosts * 12;
    const totalAnnualCosts = annualMortgage + annualMaintenance + annualOtherCosts + insurance + groundRent + managementFees;
    const netAnnualIncome = rentAfterVoids - totalAnnualCosts;
    const grossYield = annualRent / value * 100;
    const netYield = netAnnualIncome / value * 100;
    const cashOnCashReturn = investedCash > 0 ? netAnnualIncome / investedCash * 100 : 0;
    const occupancyRate = effectiveMonths / 12 * 100;
    const breakEvenMonthlyRent = effectiveMonths > 0 ? totalAnnualCosts / effectiveMonths : 0;
    const paybackPeriodYears = netAnnualIncome > 0 && investedCash > 0 ? investedCash / netAnnualIncome : null;
    const newResults = {
      value,
      annualRent,
      rentAfterVoids,
      totalAnnualCosts,
      netAnnualIncome,
      monthlyNetIncome: netAnnualIncome / 12,
      grossYield,
      netYield,
      occupancyRate,
      cashOnCashReturn,
      breakEvenMonthlyRent,
      managementFees,
      voids: effectiveMonths,
      paybackPeriodYears,
      investedCash
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExport = [
      ["Metric", "Value"],
      ["Property Value", formatCurrency(value)],
      ["Monthly Rent (before voids)", formatCurrency(rent)],
      ["Annual Rent (before voids)", formatCurrency(annualRent)],
      ["Void Months Per Year", `${voids}`],
      ["Effective Occupied Months", `${effectiveMonths}`],
      ["Rent Received After Voids", formatCurrency(rentAfterVoids)],
      ["Total Annual Costs", formatCurrency(totalAnnualCosts)],
      ["Net Annual Income", formatCurrency(netAnnualIncome)],
      ["Monthly Net Income", formatCurrency(netAnnualIncome / 12)],
      ["Gross Yield", formatPercent(grossYield)],
      ["Net Yield", formatPercent(netYield)],
      ["Cash-on-Cash Return", investedCash > 0 ? formatPercent(cashOnCashReturn) : "n/a"],
      ["Break-even Monthly Rent", formatCurrency(breakEvenMonthlyRent)],
      [
        "Payback Period (years)",
        paybackPeriodYears ? paybackPeriodYears.toFixed(1) : netAnnualIncome <= 0 ? "Not reached" : "n/a"
      ]
    ];
    setCsvData(csvExport);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
    setCsvData(null);
  }, [
    propertyValue,
    monthlyRent,
    monthlyMortgage,
    monthlyMaintenance,
    otherMonthlyCosts,
    annualInsurance,
    annualGroundRent,
    managementFeePercent,
    voidMonths,
    cashInvested
  ]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 border-b border-gray-200 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700 mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "w-4 h-4 mr-1" }),
        " Rental Investment Tool"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 mb-4", children: "Rental Yield Calculator" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 max-w-3xl mx-auto", children: "Work out gross and net rental yields, monthly cash flow and the cash-on-cash return for your buy-to-let property. Enter your rent, costs and investment details to see whether the numbers stack up." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-2 gap-10", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Property Details" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "propertyValue", children: "Property Purchase Price" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "propertyValue",
                  type: "number",
                  value: propertyValue,
                  onChange: (e) => setPropertyValue(e.target.value),
                  placeholder: "e.g. 275000",
                  min: "0"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyRent", children: "Monthly Rent" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "monthlyRent",
                  type: "number",
                  value: monthlyRent,
                  onChange: (e) => setMonthlyRent(e.target.value),
                  placeholder: "e.g. 1350",
                  min: "0"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "voidMonths", children: "Expected Void Months Per Year" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "voidMonths",
                  type: "number",
                  value: voidMonths,
                  onChange: (e) => setVoidMonths(e.target.value),
                  placeholder: "e.g. 1",
                  min: "0",
                  max: "12",
                  step: "0.5"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Annual Costs" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyMortgage", children: "Monthly Mortgage Payment" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "monthlyMortgage",
                    type: "number",
                    value: monthlyMortgage,
                    onChange: (e) => setMonthlyMortgage(e.target.value),
                    placeholder: "e.g. 650",
                    min: "0"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "monthlyMaintenance", children: "Monthly Maintenance Budget" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "monthlyMaintenance",
                    type: "number",
                    value: monthlyMaintenance,
                    onChange: (e) => setMonthlyMaintenance(e.target.value),
                    placeholder: "e.g. 120",
                    min: "0"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "otherMonthlyCosts", children: "Other Monthly Costs" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "otherMonthlyCosts",
                    type: "number",
                    value: otherMonthlyCosts,
                    onChange: (e) => setOtherMonthlyCosts(e.target.value),
                    placeholder: "e.g. 80",
                    min: "0"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "annualInsurance", children: "Annual Insurance & Compliance" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "annualInsurance",
                    type: "number",
                    value: annualInsurance,
                    onChange: (e) => setAnnualInsurance(e.target.value),
                    placeholder: "e.g. 450",
                    min: "0"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid sm:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "annualGroundRent", children: "Annual Ground Rent / Service Charges" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "annualGroundRent",
                    type: "number",
                    value: annualGroundRent,
                    onChange: (e) => setAnnualGroundRent(e.target.value),
                    placeholder: "e.g. 320",
                    min: "0"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "managementFeePercent", children: "Management Fee (% of collected rent)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "managementFeePercent",
                    type: "number",
                    value: managementFeePercent,
                    onChange: (e) => setManagementFeePercent(e.target.value),
                    placeholder: "e.g. 12",
                    min: "0",
                    max: "100",
                    step: "0.5"
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Cash Invested" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-5", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Include your deposit, refurbishment costs and purchase fees to measure cash-on-cash return and the payback period." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "cashInvested", children: "Total Cash Invested" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                Input,
                {
                  id: "cashInvested",
                  type: "number",
                  value: cashInvested,
                  onChange: (e) => setCashInvested(e.target.value),
                  placeholder: "e.g. 75000",
                  min: "0"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
          "Calculate Rental Yield"
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
        hasCalculated ? results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Investment Summary" }),
            csvData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportActions, { csvData, fileName: "rental-yield-results", title: "Rental Yield Summary" }) : null
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Yield & Profitability" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid sm:grid-cols-2 gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 rounded-lg bg-green-50 border border-green-100", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-6 h-6 text-green-600 mb-2" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Gross Yield" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-3xl font-bold text-green-700", children: formatPercent(results.grossYield) })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 rounded-lg bg-blue-50 border border-blue-100", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "w-6 h-6 text-blue-600 mb-2" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Net Yield" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-3xl font-bold text-blue-700", children: formatPercent(results.netYield) })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid sm:grid-cols-2 gap-4 mt-6", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 rounded-lg bg-amber-50 border border-amber-100", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PiggyBank, { className: "w-6 h-6 text-amber-600 mb-2" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Net Annual Income" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-2xl font-semibold text-amber-700", children: formatCurrency(results.netAnnualIncome) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-amber-700 mt-1", children: [
                    "Monthly: ",
                    formatCurrency(results.monthlyNetIncome)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 rounded-lg bg-purple-50 border border-purple-100", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "w-6 h-6 text-purple-600 mb-2" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Occupancy Rate" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-2xl font-semibold text-purple-700", children: formatPercent(results.occupancyRate) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-purple-700 mt-1", children: [
                    "Break-even rent: ",
                    formatCurrency(results.breakEvenMonthlyRent),
                    " / month"
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Detailed Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Annual rent (before voids)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: formatCurrency(results.annualRent) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Rent received after voids" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: formatCurrency(results.rentAfterVoids) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Management fees" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: formatCurrency(results.managementFees) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Total annual costs" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: formatCurrency(results.totalAnnualCosts) })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Cash invested" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: results.investedCash ? formatCurrency(results.investedCash) : "Not provided" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Cash-on-cash return" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: results.investedCash > 0 ? formatPercent(results.cashOnCashReturn) : "Add cash invested to see" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between text-sm sm:text-base", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "text-gray-600", children: "Payback period" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-semibold", children: results.paybackPeriodYears ? `${results.paybackPeriodYears.toFixed(1)} years` : results.investedCash > 0 && results.netAnnualIncome <= 0 ? "Not reached" : "Add cash invested to see" })
              ] })
            ] })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "py-10 text-center text-gray-600", children: "Enter your property value and monthly rent to see the rental yield breakdown." }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "py-10 text-center text-gray-600", children: "Fill in the details and click calculate to evaluate your property investment." }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "How to Use This Calculator" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3 text-gray-600", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Gross yield helps compare properties quickly, while net yield and cash-on-cash return show the true earnings after costs. Adjust the void months and management fee to reflect your local market." }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-1", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Include maintenance and compliance costs to avoid overstating returns." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Management fee is applied only to rent actually collected after voids." }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Enter your cash invested to reveal the payback period and cash-on-cash return." })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-500", children: "Figures exclude income tax and mortgage interest relief caps. Always seek professional advice before making investment decisions." })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(rentalYieldCalculatorJsonLd) })
  ] });
}
export {
  RentalYieldCalculator as default
};
