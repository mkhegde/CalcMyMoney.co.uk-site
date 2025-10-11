import {
  Breadcrumbs,
  CalculatorWrapper
} from "./chunk-U6RX6SVX.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  createPageUrl
} from "./chunk-5OFSEGYW.js";
import "./chunk-ZLF73IFG.js";
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
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/IncomeTaxCalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var incomeTaxJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "UK Income Tax Calculator 2025/26",
  description: "Calculate your UK Income Tax for the 2025/26 financial year. Understand how your income is taxed across different bands including Personal Allowance, Basic, Higher, and Additional Rates.",
  url: "https://www.yourdomain.com/income-tax-calculator",
  // Replace with actual URL
  mainEntity: {
    "@type": "Calculator",
    name: "UK Income Tax Calculator",
    description: "Calculates UK Income Tax for the 2025/26 tax year based on gross annual income.",
    applicationCategory: "Financial",
    accessMode: ["visual", "textual"],
    accessModeSufficient: ["visual"],
    operatingSystem: "Any",
    softwareRequirements: "Web browser",
    url: "https://www.yourdomain.com/income-tax-calculator",
    // Replace with actual URL
    citation: [
      {
        "@type": "WebSite",
        name: "GOV.UK - Income Tax rates and allowances",
        url: "https://www.gov.uk/guidance/rates-and-allowances-for-income-tax-on-employment-income"
        // Link to official source
      }
    ]
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: createPageUrl("Home")
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tax Calculators",
        item: `${createPageUrl("Home")}#tax-calculators`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Income Tax Calculator"
      }
    ]
  },
  about: [
    {
      "@type": "Thing",
      name: "Income Tax",
      description: "A tax levied directly on personal income."
    },
    {
      "@type": "Thing",
      name: "Tax Brackets",
      description: "Ranges of income that are taxed at a specific rate."
    }
  ],
  keywords: "UK Income Tax, Income Tax Calculator, 2025/26 Tax Year, Personal Allowance, Basic Rate, Higher Rate, Additional Rate, Tax Bands, UK Tax, HMRC Tax"
};
var taxBrackets = [
  { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
  { min: 12571, max: 50270, rate: 0.2, name: "Basic Rate" },
  { min: 50271, max: 125140, rate: 0.4, name: "Higher Rate" },
  { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
];
var incomeTaxFAQs = [
  {
    question: "What is the Personal Allowance?",
    answer: "The Personal Allowance is the amount of income you can earn each year before you have to pay any Income Tax. For the 2025/26 tax year, the standard Personal Allowance is \xA312,570. This allowance is reduced by \xA31 for every \xA32 you earn over \xA3100,000."
  },
  {
    question: "How do tax bands work?",
    answer: "Tax bands are the different levels of income on which you pay tax. In England, Wales, and Northern Ireland, once your income exceeds the Personal Allowance, you start paying the Basic Rate (20%). If your income is high enough, you'll move into the Higher Rate (40%) and then the Additional Rate (45%) bands. You only pay the higher rate on the portion of your income that falls within that specific band."
  },
  {
    question: "Is this calculator suitable for Scotland?",
    answer: "This calculator uses the tax bands for England, Wales, and Northern Ireland. Scotland has its own set of income tax bands and rates which are different. For precise calculations for Scotland, please use our main Salary Calculator and select 'Scotland' in the advanced options."
  },
  {
    question: "Does this include National Insurance?",
    answer: "No, this calculator focuses exclusively on Income Tax to give you a clear understanding of that specific deduction. To see a full breakdown including National Insurance, pension, and student loan, please use our comprehensive Salary Calculator."
  }
];
function IncomeTaxCalculator() {
  const [grossIncome, setGrossIncome] = (0, import_react.useState)("");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const breadcrumbPath = [
    { name: "Home", url: createPageUrl("Home") },
    { name: "Tax Calculators", url: `${createPageUrl("Home")}#tax-calculators` },
    { name: "Income Tax Calculator" }
  ];
  const handleCalculate = () => {
    const income = Number(grossIncome) || 0;
    if (income <= 0) {
      setResults(null);
      setHasCalculated(true);
      return;
    }
    let totalTax = 0;
    let taxBreakdown = [];
    let personalAllowance = 12570;
    if (income > 1e5) {
      personalAllowance = Math.max(0, personalAllowance - (income - 1e5) / 2);
    }
    let tempTotalTax = 0;
    let tempTaxBreakdown = [];
    let incomeRemainingForTax = income - personalAllowance;
    for (const bracket of taxBrackets) {
      if (bracket.rate === 0) continue;
      const lowerBound = bracket.min;
      const upperBound = bracket.max;
      const grossAboveLowerBound = Math.max(0, income - lowerBound + 1);
      const grossBelowUpperBound = Math.max(0, upperBound - income + 1);
      const effectiveBracketStart = Math.max(lowerBound, personalAllowance + 1);
      const effectiveBracketEnd = upperBound;
      let amountInThisBracket = 0;
      if (income > effectiveBracketStart - 1) {
        amountInThisBracket = Math.min(income, effectiveBracketEnd) - Math.max(personalAllowance, effectiveBracketStart - 1);
        amountInThisBracket = Math.max(0, amountInThisBracket);
      }
      const taxableAmountInBracket = Math.min(
        incomeRemainingForTax,
        Math.max(
          0,
          (upperBound === Infinity ? Infinity : upperBound) - Math.max(lowerBound, personalAllowance)
        )
        // Adjusted to handle Infinity correctly and for potential off-by-one, original logic was `upperBound - Math.max(lowerBound, personalAllowance)`
      );
      if (taxableAmountInBracket > 0) {
        const taxOnThisBand = taxableAmountInBracket * bracket.rate;
        tempTotalTax += taxOnThisBand;
        tempTaxBreakdown.push({
          name: bracket.name,
          amount: taxOnThisBand,
          rate: bracket.rate * 100,
          taxableAmount: taxableAmountInBracket
        });
        incomeRemainingForTax -= taxableAmountInBracket;
      }
    }
    const newResults = {
      totalTax: tempTotalTax,
      taxBreakdown: tempTaxBreakdown,
      grossIncome: income,
      personalAllowance
    };
    setResults(newResults);
    setHasCalculated(true);
    const csvExportData = [
      ["Band", "Taxable Amount", "Tax Rate", "Tax Paid"],
      ...newResults.taxBreakdown.map((item) => [
        item.name,
        `\xA3${item.taxableAmount.toFixed(2)}`,
        `${item.rate}%`,
        `\xA3${item.amount.toFixed(2)}`
      ]),
      ["", "", "", ""],
      ["Gross Income", `\xA3${newResults.grossIncome.toFixed(2)}`, "", ""],
      ["Personal Allowance", `\xA3${newResults.personalAllowance.toFixed(2)}`, "", ""],
      ["Total Tax", `\xA3${newResults.totalTax.toFixed(2)}`, "", ""]
    ];
    setCsvData(csvExportData);
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
  }, [grossIncome]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", { type: "application/ld+json", children: JSON.stringify(incomeTaxJsonLd) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumbs, { path: breadcrumbPath }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "UK Income Tax Calculator 2025/26" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Demystify your tax bill. See exactly how your income is taxed across the different UK tax bands for the 2025/26 financial year." })
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "Income Tax Breakdown 2025/26" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-8", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossIncome", children: "Annual Gross Income" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "grossIncome",
                      type: "number",
                      value: grossIncome,
                      onChange: (e) => setGrossIncome(e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 50000"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { onClick: handleCalculate, className: "w-full text-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                "Calculate Tax"
              ] })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your Tax Breakdown" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Tax Summary" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-3", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gross Income:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    "\xA3",
                    results.grossIncome.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center text-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Personal Allowance:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold", children: [
                    "\xA3",
                    results.personalAllowance.toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex justify-between items-center p-4 bg-red-100 rounded-lg text-xl", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "font-bold", children: "Total Estimated Tax:" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-bold text-red-700", children: [
                    "-\xA3",
                    results.totalTax.toLocaleString("en-GB", { maximumFractionDigits: 0 })
                  ] })
                ] })
              ] }) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Breakdown by Tax Band" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "space-y-3", children: results.taxBreakdown.map((bracket, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                "div",
                {
                  className: "flex justify-between items-center p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-medium", children: [
                        bracket.name,
                        " (",
                        bracket.rate,
                        "%)"
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-gray-600", children: [
                        "Taxable amount: \xA3",
                        bracket.taxableAmount.toLocaleString("en-GB", {
                          maximumFractionDigits: 0
                        })
                      ] })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { className: "font-semibold text-blue-800", children: [
                      "-\xA3",
                      bracket.amount.toLocaleString("en-GB", { maximumFractionDigits: 0 })
                    ] })
                  ]
                },
                index
              )) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable pt-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              ExportActions,
              {
                csvData,
                fileName: "income-tax-breakdown",
                title: "Income Tax Breakdown"
              }
            ) })
          ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-full min-h-[300px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready for your results?" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: 'Enter your income and click "Calculate Tax".' })
          ] }) }) })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorWrapper, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-6", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-900 dark:text-gray-100", children: "Understanding UK Income Tax" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "Income Tax is the UK government's primary source of revenue, levied on most forms of income including employment earnings, profits from self-employment, rental income, and some state benefits. This calculator is designed to provide a clear and focused breakdown of your potential Income Tax liability based on your annual gross income. It isolates this single, significant deduction to help you understand exactly how it's calculated using the UK's progressive tax band system. By entering your income, you can see how it is divided across the different tax bands\u2014from the tax-free Personal Allowance to the Basic, Higher, and Additional rates." }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Why Use a Dedicated Income Tax Calculator?" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Clarity and Focus:" }),
            " Unlike a full salary calculator, this tool strips away other deductions like National Insurance, focusing solely on the Income Tax calculation."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Educational Tool:" }),
            " It's perfect for students, those new to the UK tax system, or anyone wanting to understand the mechanics of the tax bands."
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: "Financial Scenarios:" }),
            " Quickly model how a change in income (like a bonus or a new job) will affect your tax liability without the noise of other deductions."
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Example Use Case" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-gray-700 dark:text-gray-300", children: "An individual earns \xA360,000 annually. They use this calculator to understand their tax. The tool shows that the first \xA312,570 is tax-free (Personal Allowance). The next portion of their income, from \xA312,571 to \xA350,270, is taxed at the Basic Rate of 20%. The remaining income, from \xA350,271 to \xA360,000, is taxed at the Higher Rate of 40%. The calculator clearly displays the tax paid within each band and provides a total tax figure, giving the user a precise understanding of where their money goes." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { id: "faq-section", className: "bg-gray-50 dark:bg-gray-800/50 py-12 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: incomeTaxFAQs }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        RelatedCalculators,
        {
          calculators: [
            {
              name: "Salary Calculator",
              url: createPageUrl("SalaryCalculator"),
              description: "Get a full breakdown of your take-home pay, including NI."
            },
            {
              name: "Capital Gains Tax Calculator",
              url: createPageUrl("CapitalGainsTaxCalculator"),
              description: "Calculate tax on profits from selling assets."
            },
            {
              name: "Dividend Tax Calculator",
              url: createPageUrl("DividendTaxCalculator"),
              description: "Understand tax on income from company shares."
            }
          ]
        }
      )
    ] })
  ] });
}
export {
  IncomeTaxCalculator as default
};
