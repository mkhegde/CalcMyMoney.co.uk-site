import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import {
  Link
} from "./chunk-ZLF73IFG.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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
  Clock,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/ProRataSalaryCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function ProRataSalaryCalculator() {
  const [fullTimeSalary, setFullTimeSalary] = (0, import_react.useState)("");
  const [fullTimeHours, setFullTimeHours] = (0, import_react.useState)("37.5");
  const [partTimeHours, setPartTimeHours] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const LAST_UPDATED_ISO = "2025-04-06";
  const LAST_UPDATED_DISPLAY = "6 April 2025";
  const handleCalculate = () => {
    const ftSalary = Number(fullTimeSalary) || 0;
    const ftHours = Number(fullTimeHours) || 0;
    const ptHours = Number(partTimeHours) || 0;
    if (ftSalary <= 0 || ftHours <= 0 || ptHours <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    const hourlyRate = ftSalary / (ftHours * 52);
    const proRataAnnual = ftSalary / ftHours * ptHours;
    const newResults = {
      proRataAnnual,
      proRataMonthly: proRataAnnual / 12,
      proRataWeekly: proRataAnnual / 52,
      // The original proRataDaily calculation was complex and potentially incorrect,
      // and not directly displayed or required by the outline. Removing to simplify
      // and avoid potential miscalculation if not used. If needed, a more robust
      // calculation based on annual/working days per year should be implemented.
      // proRataDaily: proRataAnnual / (ptHours * 52) * (ptHours / 5), // Assuming 5-day week
      hourlyRate,
      fullTimeSalary: ftSalary,
      fullTimeHours: ftHours,
      partTimeHours: ptHours
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Metric", "Value"],
      ["Pro-Rata Annual Salary", `\xA3${newResults.proRataAnnual.toFixed(2)}`],
      ["Pro-Rata Monthly Salary", `\xA3${newResults.proRataMonthly.toFixed(2)}`],
      ["Pro-Rata Weekly Salary", `\xA3${newResults.proRataWeekly.toFixed(2)}`],
      ["Equivalent Hourly Rate", `\xA3${newResults.hourlyRate.toFixed(2)}`],
      ["Full-Time Equivalent Salary", `\xA3${ftSalary.toFixed(2)}`],
      ["Full-Time Hours", `${ftHours} / week`],
      ["Part-Time Hours", `${ptHours} / week`]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [fullTimeSalary, fullTimeHours, partTimeHours]);
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const breadcrumbJson = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${origin}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Salary & Income",
        item: `${origin}${createPageUrl("SalaryCalculatorUK")}`
      }
    ]
  };
  const faqs = [
    {
      question: "How is pro-rata salary calculated?",
      answer: "We scale the full-time annual salary by your contracted days or hours to estimate the pro-rata amount for part-time or partial-year roles."
    },
    {
      question: "Can I compare part-time vs full-time pay?",
      answer: "Yes. Adjust hours or days to compare pro-rata pay against the full-time salary equivalent."
    },
    {
      question: "Does this show net (after tax) values too?",
      answer: "Use our Take-Home Pay or Gross-to-Net calculators to estimate the after-tax impact of your pro-rata salary."
    }
  ];
  const faqJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer }
    }))
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(breadcrumbJson) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(faqJson) }
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-2", children: "Pro-Rata Salary Calculator (UK)" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your part-time salary based on a full-time equivalent wage. Ensure you're getting paid fairly for the hours you work." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mt-4 flex flex-wrap justify-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorUK"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700",
              children: "Salary Hub"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            Link,
            {
              to: createPageUrl("SalaryCalculatorTakeHomePay"),
              className: "px-4 py-2 rounded-md border border-blue-200 text-blue-700 bg-white hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-300 dark:border-blue-700",
              children: "Take\u2011Home Pay"
            }
          )
        ] })
      ] }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Pro-Rata Salary Calculation" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-2 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Enter Details" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "fullTimeSalary", children: "Full-Time Annual Salary" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "fullTimeSalary",
                      type: "number",
                      value: fullTimeSalary,
                      onChange: (e) => setFullTimeSalary(e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 35000"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "fullTimeHours", children: "Full-Time Weekly Hours" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "fullTimeHours",
                      type: "number",
                      value: fullTimeHours,
                      onChange: (e) => setFullTimeHours(e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 37.5"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "partTimeHours", children: "Your Part-Time Weekly Hours" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "partTimeHours",
                      type: "number",
                      value: partTimeHours,
                      onChange: (e) => setPartTimeHours(e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 20"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                "Calculate"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center non-printable", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Pro-Rata Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExportActions,
                {
                  csvData,
                  fileName: "pro-rata-salary",
                  title: "Pro-Rata Salary"
                }
              )
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-green-800 mb-2", children: "Pro-Rata Annual Salary" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-green-900", children: [
                "\xA3",
                results.proRataAnnual.toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })
              ] })
            ] }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Salary Breakdown" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "grid grid-cols-2 gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Monthly Pay" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.proRataMonthly.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Weekly Pay" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.proRataWeekly.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg col-span-2", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600", children: "Equivalent Hourly Rate" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-lg font-semibold", children: [
                    "\xA3",
                    results.hourlyRate.toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })
                  ] })
                ] })
              ] })
            ] })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready for your calculation?" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter the details to see your pro-rata salary." })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, { to: createPageUrl("SalaryCalculatorUK"), className: "text-blue-600 hover:underline", children: "\u2190 Back to Salary & Income Hub" }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 py-10 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs, title: "Pro\u2011Rata Salary FAQs" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xs text-gray-500 mt-6", children: [
          "Last updated: ",
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", { dateTime: LAST_UPDATED_ISO, children: LAST_UPDATED_DISPLAY })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      RelatedCalculators,
      {
        calculators: [
          {
            name: "UK Salary Calculator (Take-Home Pay 2025/26)",
            url: createPageUrl("SalaryCalculatorUK"),
            description: "Primary hub for take\u2011home pay calculations."
          },
          {
            name: "Take-Home Pay Calculator UK (2025/26)",
            url: createPageUrl("SalaryCalculatorTakeHomePay"),
            description: "See net pay after tax and NI."
          },
          {
            name: "Paycheck Calculator UK (After Tax & NI)",
            url: createPageUrl("SalaryCalculatorPaycheck"),
            description: "Check your paycheck after deductions."
          }
        ]
      }
    )
  ] });
}
export {
  ProRataSalaryCalculator as default
};
