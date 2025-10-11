import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
import "./chunk-ICMCGXKF.js";
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
  TrendingUp,
  Zap
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/EnergyBillCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var energyRates = {
  electricity: {
    standingCharge: 60.1,
    // pence per day
    unitRate: 24.5
    // pence per kWh
  },
  gas: {
    standingCharge: 31.43,
    // pence per day
    unitRate: 6.24
    // pence per kWh
  }
};
var propertyTypes = {
  flat: { electricityUsage: 2e3, gasUsage: 8e3 },
  terrace: { electricityUsage: 2900, gasUsage: 12e3 },
  semi: { electricityUsage: 3300, gasUsage: 13500 },
  detached: { electricityUsage: 4200, gasUsage: 18e3 },
  bungalow: { electricityUsage: 3100, gasUsage: 13e3 }
};
function EnergyBillCalculator() {
  const [propertyType, setPropertyType] = (0, import_react.useState)("");
  const [bedrooms, setBedrooms] = (0, import_react.useState)("2");
  const [occupants, setOccupants] = (0, import_react.useState)("2");
  const [electricityUsage, setElectricityUsage] = (0, import_react.useState)("");
  const [gasUsage, setGasUsage] = (0, import_react.useState)("");
  const [useCustomUsage, setUseCustomUsage] = (0, import_react.useState)(false);
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    if (propertyType && !useCustomUsage) {
      const baseUsage = propertyTypes[propertyType];
      const bedroomMultiplier = Number(bedrooms) * 0.15 + 0.7;
      const occupantMultiplier = Number(occupants) * 0.2 + 0.6;
      setElectricityUsage(
        Math.round(baseUsage.electricityUsage * bedroomMultiplier * occupantMultiplier).toString()
      );
      setGasUsage(
        Math.round(baseUsage.gasUsage * bedroomMultiplier * occupantMultiplier).toString()
      );
    }
  }, [propertyType, bedrooms, occupants, useCustomUsage]);
  const handleCalculate = () => {
    const currentElectricityUsage = Number(electricityUsage) || 0;
    const currentGasUsage = Number(gasUsage) || 0;
    if (currentElectricityUsage <= 0 && currentGasUsage <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const electricityStandingCharges = energyRates.electricity.standingCharge / 100 * 365;
    const electricityUnitCosts = currentElectricityUsage * energyRates.electricity.unitRate / 100;
    const totalElectricityCost = electricityStandingCharges + electricityUnitCosts;
    const gasStandingCharges = energyRates.gas.standingCharge / 100 * 365;
    const gasUnitCosts = currentGasUsage * energyRates.gas.unitRate / 100;
    const totalGasCost = gasStandingCharges + gasUnitCosts;
    const totalAnnualCost = totalElectricityCost + totalGasCost;
    const monthlyAverageCost = totalAnnualCost / 12;
    const newResults = {
      electricity: {
        usage: currentElectricityUsage,
        standingCharges: electricityStandingCharges,
        unitCosts: electricityUnitCosts,
        totalCost: totalElectricityCost
      },
      gas: {
        usage: currentGasUsage,
        standingCharges: gasStandingCharges,
        unitCosts: gasUnitCosts,
        totalCost: totalGasCost
      },
      totalAnnualCost,
      monthlyAverageCost
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Energy Type", "Usage", "Standing Charges", "Unit Costs", "Total"],
      [
        "Electricity",
        `${currentElectricityUsage} kWh`,
        `\xA3${electricityStandingCharges.toFixed(2)}`,
        `\xA3${electricityUnitCosts.toFixed(2)}`,
        `\xA3${totalElectricityCost.toFixed(2)}`
      ],
      [
        "Gas",
        `${currentGasUsage} kWh`,
        `\xA3${gasStandingCharges.toFixed(2)}`,
        `\xA3${gasUnitCosts.toFixed(2)}`,
        `\xA3${totalGasCost.toFixed(2)}`
      ],
      ["", "", "", "", ""],
      ["Total Annual Cost", "", "", "", `\xA3${totalAnnualCost.toFixed(2)}`],
      ["Average Monthly Cost", "", "", "", `\xA3${monthlyAverageCost.toFixed(2)}`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [electricityUsage, gasUsage]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Energy Bill Calculator 2025" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your annual electricity and gas costs based on current Ofgem price cap rates. Get accurate estimates for your household energy bills." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Energy Bill Calculation Results" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-3 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-1 space-y-6 non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-5 h-5" }),
              "Property Details"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Property Type" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: propertyType, onValueChange: setPropertyType, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select property type" }) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "flat", children: "Flat/Apartment" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "terrace", children: "Terraced House" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "semi", children: "Semi-Detached House" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "detached", children: "Detached House" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "bungalow", children: "Bungalow" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Number of Bedrooms" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: bedrooms, onValueChange: setBedrooms, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "1", children: "1 Bedroom" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "2", children: "2 Bedrooms" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "3", children: "3 Bedrooms" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "4", children: "4 Bedrooms" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "5", children: "5+ Bedrooms" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Number of Occupants" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: occupants, onValueChange: setOccupants, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "1", children: "1 Person" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "2", children: "2 People" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "3", children: "3 People" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "4", children: "4 People" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "5", children: "5+ People" })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-5 h-5" }),
              "Annual Energy Usage"
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center space-x-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  "input",
                  {
                    type: "checkbox",
                    id: "useCustomUsage",
                    checked: useCustomUsage,
                    onChange: (e) => setUseCustomUsage(e.target.checked),
                    className: "rounded"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "useCustomUsage", className: "text-sm", children: "Use custom usage values" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "electricityUsage", children: "Electricity Usage (kWh per year)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "electricityUsage",
                    type: "number",
                    value: electricityUsage,
                    onChange: (e) => setElectricityUsage(e.target.value),
                    placeholder: "e.g. 3000",
                    disabled: !useCustomUsage && propertyType
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Average UK household: 2,700 kWh" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "gasUsage", children: "Gas Usage (kWh per year)" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "gasUsage",
                    type: "number",
                    value: gasUsage,
                    onChange: (e) => setGasUsage(e.target.value),
                    placeholder: "e.g. 12000",
                    disabled: !useCustomUsage && propertyType
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500", children: "Average UK household: 11,500 kWh" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                "Calculate Energy Bill"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-blue-900 dark:text-blue-400 text-base", children: "Current Ofgem Rates (2025)" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-sm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-semibold", children: "Electricity:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "Standing charge: ",
                  energyRates.electricity.standingCharge,
                  "p/day"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "Unit rate: ",
                  energyRates.electricity.unitRate,
                  "p/kWh"
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-semibold", children: "Gas:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "Standing charge: ",
                  energyRates.gas.standingCharge,
                  "p/day"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
                  "Unit rate: ",
                  energyRates.gas.unitRate,
                  "p/kWh"
                ] })
              ] })
            ] }) })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800 dark:text-gray-200", children: "Your Energy Bill Breakdown" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "energy-bill-calculation",
                title: "Energy Bill Calculation"
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-blue-800", children: "Annual Energy Bill" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-blue-900", children: [
                  "\xA3",
                  results.totalAnnualCost.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-8 h-8 text-blue-600" })
            ] }) }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/50 dark:to-green-800/50 border-green-200 dark:border-green-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm font-medium text-green-800", children: "Monthly Average" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-3xl font-bold text-green-900", children: [
                  "\xA3",
                  results.monthlyAverageCost.toLocaleString("en-GB", {
                    maximumFractionDigits: 0
                  })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-8 h-8 text-green-600" })
            ] }) }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-yellow-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-5 h-5" }),
                "Electricity Costs"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Usage:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    results.electricity.usage.toLocaleString(),
                    " kWh"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Standing Charges:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.electricity.standingCharges.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unit Costs:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.electricity.unitCosts.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-bold", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Electricity:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.electricity.totalCost.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xs text-gray-500", children: [
                  "Monthly average: \xA3",
                  (results.electricity.totalCost / 12).toFixed(2)
                ] })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { className: "flex items-center gap-2 text-orange-700", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(House, { className: "w-5 h-5" }),
                "Gas Costs"
              ] }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Usage:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    results.gas.usage.toLocaleString(),
                    " kWh"
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Standing Charges:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.gas.standingCharges.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unit Costs:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.gas.unitCosts.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between border-t pt-2 font-bold", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total Gas:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                    "\xA3",
                    results.gas.totalCost.toFixed(2)
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-xs text-gray-500", children: [
                  "Monthly average: \xA3",
                  (results.gas.totalCost / 12).toFixed(2)
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { className: "text-green-900 dark:text-green-400", children: "Energy Saving Tips" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "text-sm text-green-800 dark:text-green-300", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold mb-2", children: "Electricity Savings:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-1 text-xs", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Switch to LED light bulbs" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Unplug devices when not in use" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Use energy-efficient appliances" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Wash clothes at 30\xB0C" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Air dry instead of tumble drying" })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", { className: "font-semibold mb-2", children: "Gas Savings:" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "space-y-1 text-xs", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Lower thermostat by 1\xB0C (saves ~10%)" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Improve home insulation" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Service boiler annually" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Use a smart thermostat" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Close curtains at dusk" })
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-4 flex items-start gap-3", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-5 h-5 text-amber-700 mt-0.5" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-sm text-amber-800", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "font-semibold", children: "Important Notes:" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "text-xs mt-1 space-y-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Based on current Ofgem price cap rates" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Actual bills may vary based on supplier and tariff" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Usage estimates are based on typical household patterns" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Consider seasonal variations in energy usage" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "\u2022 Check your actual meter readings for precise calculations" })
              ] })
            ] })
          ] }) })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "lg:col-span-2 flex items-center justify-center h-[400px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready to calculate your energy bill?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your property details and energy usage to get an estimate." }),
          hasCalculated && !results && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-red-500 mt-2", children: "Please enter valid energy usage values." })
        ] }) }) })
      ] })
    ] })
  ] });
}
export {
  EnergyBillCalculator as default
};
