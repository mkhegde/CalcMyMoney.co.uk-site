import {
  Alert,
  AlertDescription,
  AlertTitle
} from "./chunk-C5XTUF76.js";
import {
  JsonLd,
  SeoHead,
  breadcrumbSchema,
  faqSchema
} from "./chunk-YXSNPAEA.js";
import {
  createPageUrl
} from "./chunk-ROKYT3OR.js";
import {
  RelatedCalculators
} from "./chunk-HL3C2SFA.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
import "./chunk-ZLF73IFG.js";
import {
  FAQSection
} from "./chunk-KZKM7WHP.js";
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
  Copy,
  PoundSterling
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/PAYECalculator.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var taxBrackets2025 = {
  england: [
    { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
    { min: 12571, max: 50270, rate: 0.2, name: "Basic Rate" },
    { min: 50271, max: 125140, rate: 0.4, name: "Higher Rate" },
    { min: 125141, max: Infinity, rate: 0.45, name: "Additional Rate" }
  ],
  scotland: [
    { min: 0, max: 12570, rate: 0, name: "Personal Allowance" },
    { min: 12571, max: 14876, rate: 0.19, name: "Starter Rate" },
    { min: 14877, max: 26561, rate: 0.2, name: "Basic Rate" },
    { min: 26562, max: 43662, rate: 0.21, name: "Intermediate Rate" },
    { min: 43663, max: 75e3, rate: 0.42, name: "Higher Rate" },
    { min: 75001, max: 125140, rate: 0.45, name: "Advanced Rate" },
    { min: 125141, max: Infinity, rate: 0.48, name: "Top Rate" }
  ]
};
var niThresholds = [
  { min: 0, max: 12570, rate: 0 },
  { min: 12571, max: 50270, rate: 0.08 },
  { min: 50271, max: Infinity, rate: 0.02 }
];
var payeCalculatorFAQs = [
  {
    question: "What is PAYE and how does it affect my payslip?",
    answer: "PAYE (Pay As You Earn) is the system where your employer deducts income tax and National Insurance from your pay before you receive it. You'll see the deductions clearly on your payslip each period."
  },
  {
    question: "How do my tax code and Personal Allowance work?",
    answer: "Your tax code (e.g., 1257L) determines your annual Personal Allowance (1257L \u2192 \xA312,570). Above \xA3100,000 of income, this allowance is tapered until it reaches \xA30."
  },
  {
    question: "Why are Scottish income tax results different?",
    answer: "Scotland sets different income tax bands and rates. National Insurance remains the same across the UK, which is why NI figures match while tax figures can differ."
  },
  {
    question: "What is the difference between effective and marginal tax rates?",
    answer: "The effective rate is total tax+NI divided by your gross income. The marginal rate is what your next \xA31 is taxed at, combining the current income tax band and NI band."
  },
  {
    question: "Does this include student loans, pensions or benefits-in-kind?",
    answer: "This page focuses on income tax and employee NI. For full picture use our Student Loan Repayment and Pension Contribution calculators, and check with HR for any benefits-in-kind."
  }
];
var isNum = (n) => typeof n === "number" && Number.isFinite(n);
var safeFixed = (n, d = 2) => isNum(n) ? n.toFixed(d) : 0 .toFixed(d);
var safeGBP = (n, opts = {}) => (isNum(n) ? n : 0).toLocaleString("en-GB", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  ...opts
});
function calculateResults({ annualSalary, location, taxCode, payFrequency }) {
  let personalAllowance = 12570;
  if (/^\d+L$/.test(taxCode)) personalAllowance = parseInt(taxCode.slice(0, -1), 10) * 10;
  if (annualSalary > 1e5) {
    personalAllowance = Math.max(0, personalAllowance - (annualSalary - 1e5) / 2);
  }
  const brackets = taxBrackets2025[location] || taxBrackets2025.england;
  const taxableIncome = Math.max(0, annualSalary - personalAllowance);
  let annualTax = 0;
  const taxBreakdown = [];
  for (const b of brackets) {
    if (b.rate === 0) continue;
    const minAdj = Math.max(0, b.min - personalAllowance);
    const maxAdj = Math.max(0, b.max - personalAllowance);
    if (taxableIncome > minAdj) {
      const inBand = Math.min(taxableIncome, maxAdj) - minAdj;
      if (inBand > 0) {
        const tax = inBand * b.rate;
        annualTax += tax;
        taxBreakdown.push({ name: b.name, rate: b.rate * 100, taxableAmount: inBand, amount: tax });
      }
    }
  }
  let annualNI = 0;
  const niBreakdown = [];
  for (const t of niThresholds) {
    if (annualSalary > t.min) {
      const niable = Math.min(annualSalary, t.max) - t.min;
      if (niable > 0) {
        const amt = niable * t.rate;
        annualNI += amt;
        if (amt > 0) niBreakdown.push({ rate: t.rate * 100, niableAmount: niable, amount: amt });
      }
    }
  }
  const totalDeductions = annualTax + annualNI;
  const netSalary = annualSalary - totalDeductions;
  const periods = payFrequency === "weekly" ? 52 : payFrequency === "fortnightly" ? 26 : 12;
  return {
    personalAllowance,
    taxBreakdown,
    niBreakdown,
    taxAmount: annualTax,
    niAmount: annualNI,
    totalDeductions,
    netSalary,
    grossPerPeriod: annualSalary / periods,
    taxPerPeriod: annualTax / periods,
    niPerPeriod: annualNI / periods,
    netPerPeriod: netSalary / periods
  };
}
function getMarginalRate({ annualSalary, location, personalAllowance }) {
  const brackets = taxBrackets2025[location] || taxBrackets2025.england;
  const taxable = Math.max(0, annualSalary - personalAllowance);
  let taxMarginal = 0;
  for (const b of brackets) {
    const minAdj = Math.max(0, b.min - personalAllowance);
    const maxAdj = Math.max(0, b.max - personalAllowance);
    if (taxable >= minAdj && taxable <= maxAdj) {
      taxMarginal = b.rate;
      break;
    }
  }
  let niMarginal = 0;
  if (annualSalary >= 12571 && annualSalary <= 50270) niMarginal = 0.08;
  else if (annualSalary > 50270) niMarginal = 0.02;
  return { taxMarginal, niMarginal, combined: taxMarginal + niMarginal };
}
function PAYECalculator() {
  const [grossSalary, setGrossSalary] = (0, import_react.useState)("");
  const [payFrequency, setPayFrequency] = (0, import_react.useState)("monthly");
  const [location, setLocation] = (0, import_react.useState)("england");
  const [taxCode, setTaxCode] = (0, import_react.useState)("1257L");
  const [results, setResults] = (0, import_react.useState)(null);
  const [hasCalculated, setHasCalculated] = (0, import_react.useState)(false);
  const [csvData, setCsvData] = (0, import_react.useState)(null);
  const [fatalError, setFatalError] = (0, import_react.useState)(null);
  const title = "PAYE Tax & NI Calculator (2025/26) | CalcMyMoney";
  const description = "Work out PAYE income tax, National Insurance and take-home pay for the 2025/26 UK tax year. Supports England, Wales, Northern Ireland and Scotland.";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://www.calcmymoney.co.uk";
  const canonical = `${origin}/paye-calculator`;
  const breadcrumbLd = breadcrumbSchema([
    { name: "Home", item: `${origin}/` },
    { name: "Tax Calculators", item: `${origin}/tax-calculators-uk` },
    { name: "PAYE Calculator", item: canonical }
  ]);
  const faqLd = faqSchema(payeCalculatorFAQs);
  const calculatePAYE = () => {
    setFatalError(null);
    try {
      const annualSalary = Number(String(grossSalary).replace(/[, ]+/g, "")) || 0;
      if (annualSalary <= 0) {
        setResults(null);
        setHasCalculated(true);
        return;
      }
      const r = calculateResults({ annualSalary, location, taxCode, payFrequency });
      if (!r || !isNum(r.netSalary)) throw new Error("Calculation failed");
      setResults(r);
      setHasCalculated(true);
      setCsvData([
        ["Item", "Annual", `Per ${payFrequency.charAt(0).toUpperCase() + payFrequency.slice(1)}`],
        ["Gross Salary", `\xA3${safeGBP(annualSalary)}`, `\xA3${safeGBP(r.grossPerPeriod)}`],
        ["Income Tax", `-\xA3${safeGBP(r.taxAmount)}`, `-\xA3${safeGBP(r.taxPerPeriod)}`],
        ["National Insurance", `-\xA3${safeGBP(r.niAmount)}`, `-\xA3${safeGBP(r.niPerPeriod)}`],
        ["Net Take-Home", `\xA3${safeGBP(r.netSalary)}`, `\xA3${safeGBP(r.netPerPeriod)}`]
      ]);
    } catch (e) {
      console.error("PAYE calc error:", e);
      setFatalError(
        "Something went wrong while calculating PAYE. Please review your inputs and try again."
      );
    }
  };
  (0, import_react.useEffect)(() => {
    setHasCalculated(false);
    setResults(null);
    setFatalError(null);
  }, [grossSalary, payFrequency, location, taxCode]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      SeoHead,
      {
        title,
        description,
        canonical,
        ogImage: "https://www.calcmymoney.co.uk/og-image.png"
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: breadcrumbLd }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, { data: faqLd }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "PAYE Tax & National Insurance Calculator (2025/26)" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "lead text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Calculate your take-home pay after income tax and National Insurance using the latest UK rates for England, Wales, Northern Ireland and Scotland." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      fatalError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-6", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, { variant: "destructive", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Calculation error" }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: fatalError })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "print-title hidden", children: "PAYE Calculation 2025/26" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-5 gap-8 printable-grid-cols-1", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "lg:col-span-2 non-printable", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "mb-4 space-y-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-gray-500", children: "Try a quick scenario:" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "flex flex-wrap gap-2", children: [
              { label: "New graduate (\xA328k)", salary: 28e3, loc: "england" },
              { label: "NHS nurse (\xA335k)", salary: 35e3, loc: "england" },
              { label: "Scotland (\xA345k)", salary: 45e3, loc: "scotland" },
              { label: "London tech (\xA375k)", salary: 75e3, loc: "england" },
              { label: "High earner (\xA3120k)", salary: 12e4, loc: "england" }
            ].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => {
                  setGrossSalary(String(s.salary));
                  setLocation(s.loc);
                  setPayFrequency("monthly");
                },
                children: s.label
              },
              s.label
            )) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "sticky top-24", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your Details" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-6", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "grossSalary", children: "Annual Gross Salary" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "relative", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PoundSterling, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Input,
                    {
                      id: "grossSalary",
                      type: "text",
                      inputMode: "decimal",
                      value: grossSalary,
                      onChange: (e) => setGrossSalary(e.target.value),
                      className: "pl-10",
                      placeholder: "e.g. 45,000"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Location" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: location, onValueChange: setLocation, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "england", children: "England, Wales & NI" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "scotland", children: "Scotland" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "taxCode", children: "Tax Code" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "taxCode",
                    value: taxCode,
                    onChange: (e) => setTaxCode(e.target.value),
                    placeholder: "e.g. 1257L"
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "Found on your payslip or P60" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Pay Frequency" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: payFrequency, onValueChange: setPayFrequency, children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "weekly", children: "Weekly" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "monthly", children: "Monthly" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: "fortnightly", children: "Fortnightly" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  onClick: calculatePAYE,
                  className: "w-full text-lg",
                  "aria-label": "Calculate PAYE",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-5 h-5 mr-2" }),
                    "Calculate PAYE"
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "lg:col-span-3 space-y-6 printable-area", children: hasCalculated && results ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-wrap gap-3 items-center justify-between non-printable", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h2", size: "h2", weight: "bold", className: "text-gray-800", children: "Your PAYE Breakdown" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    const annualSalary = Number(String(grossSalary).replace(/[, ]+/g, "")) || 0;
                    const eff = annualSalary > 0 ? (results.totalDeductions / annualSalary * 100).toFixed(1) : "0.0";
                    const summary = `PAYE summary (${payFrequency}):
Gross: \xA3${safeGBP(annualSalary)}
Income Tax: \xA3${safeGBP(results.taxAmount)}
NI: \xA3${safeGBP(results.niAmount)}
Net: \xA3${safeGBP(results.netSalary)}
Effective rate: ${eff}%`;
                    try {
                      navigator.clipboard?.writeText(summary);
                    } catch {
                    }
                  },
                  "aria-label": "Copy summary",
                  title: "Copy summary to clipboard",
                  children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "w-4 h-4 mr-2" }),
                    "Copy summary"
                  ]
                }
              ),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                ExportActions,
                {
                  csvData,
                  fileName: "paye-calculation",
                  title: "PAYE Calculation"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-green-50 border-green-200", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", { className: "font-semibold text-green-800 mb-2", children: [
              "Take-Home Pay (",
              payFrequency,
              ")"
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-4xl font-bold text-green-900", children: [
              "\xA3",
              safeGBP(results.netPerPeriod)
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "body text-green-700", children: [
              "Annual: \xA3",
              (results.netSalary ?? 0).toLocaleString("en-GB", {
                maximumFractionDigits: 0
              })
            ] })
          ] }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-6", children: (() => {
            const annualSalary = Number(String(grossSalary).replace(/[, ]+/g, "")) || 0;
            const eff = annualSalary > 0 ? results.totalDeductions / annualSalary : 0;
            const { taxMarginal, niMarginal, combined } = getMarginalRate({
              annualSalary,
              location,
              personalAllowance: results.personalAllowance ?? 0
            });
            return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "Effective tax + NI rate" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [
                  safeFixed(eff * 100, 1),
                  "%"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "Total deductions / gross" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "Marginal tax rate" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [
                  safeFixed((taxMarginal || 0) * 100, 0),
                  "%"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "On your next \xA31 (income tax)" })
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "p-4 bg-gray-50 rounded-lg", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "Combined marginal" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-2xl font-bold text-gray-900", children: [
                  safeFixed((combined || 0) * 100, 0),
                  "%"
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "caption text-gray-500", children: "Income tax + NI on next \xA31" })
              ] })
            ] });
          })() }) }),
          Number(String(grossSalary).replace(/[, ]+/g, "")) > 1e5 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "border-amber-300 bg-amber-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-4 body text-amber-900", children: "Over \xA3100,000 your Personal Allowance is tapered. For every \xA32 above \xA3100k, you lose \xA31 of allowance until it reaches \xA30. That\u2019s why your effective rate rises sharply here." }) }),
          Number(String(grossSalary).replace(/[, ]+/g, "")) <= 12570 && hasCalculated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "border-blue-200 bg-blue-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "p-4 body text-blue-900", children: "You\u2019re within the Personal Allowance. You won\u2019t pay income tax, but NI may still apply above the NI thresholds." }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid md:grid-cols-2 gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Income Tax" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-red-50 rounded-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-red-600", children: "Annual Tax" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl font-bold text-red-800", children: [
                    "\xA3",
                    (results.taxAmount ?? 0).toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "caption text-red-500", children: [
                    payFrequency,
                    ": \xA3",
                    safeFixed(results.taxPerPeriod)
                  ] })
                ] }),
                (results.taxBreakdown ?? []).map((bracket, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    className: "flex justify-between body p-2 border-l-2 border-red-300",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                        bracket?.name,
                        " (",
                        safeFixed(bracket?.rate, 0),
                        "%)"
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                        "\xA3",
                        safeFixed(bracket?.amount, 0)
                      ] })
                    ]
                  },
                  index
                ))
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "National Insurance" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-2", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center p-4 bg-blue-50 rounded-lg", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-blue-600", children: "Annual NI" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-xl font-bold text-blue-800", children: [
                    "\xA3",
                    (results.niAmount ?? 0).toLocaleString("en-GB", {
                      maximumFractionDigits: 0
                    })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "caption text-blue-500", children: [
                    payFrequency,
                    ": \xA3",
                    safeFixed(results.niPerPeriod)
                  ] })
                ] }),
                (results.niBreakdown ?? []).map((ni, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
                  "div",
                  {
                    className: "flex justify-between body p-2 border-l-2 border-blue-300",
                    children: [
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                        "Class 1 NI (",
                        safeFixed(ni?.rate, 0),
                        "%)"
                      ] }),
                      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                        "\xA3",
                        safeFixed(ni?.amount, 0)
                      ] })
                    ]
                  },
                  index
                ))
              ] })
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Compare Scotland vs England/Wales/NI" }) }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "overflow-x-auto", children: (() => {
              const annualSalary = Number(String(grossSalary).replace(/[, ]+/g, "")) || 0;
              if (!annualSalary)
                return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "body text-gray-500", children: "Enter a salary to compare." });
              const rUK = calculateResults({
                annualSalary,
                location: "england",
                taxCode,
                payFrequency
              });
              const sco = calculateResults({
                annualSalary,
                location: "scotland",
                taxCode,
                payFrequency
              });
              return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", { className: "min-w-[520px] body", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "text-left border-b", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 pr-4", children: "Metric" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2 pr-4", children: "England/Wales/NI" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "py-2", children: "Scotland" })
                ] }) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-2 pr-4", children: "Income Tax (annual)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2 pr-4", children: [
                      "\xA3",
                      (rUK.taxAmount ?? 0).toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2", children: [
                      "\xA3",
                      (sco.taxAmount ?? 0).toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-2 pr-4", children: "National Insurance (annual)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2 pr-4", children: [
                      "\xA3",
                      (rUK.niAmount ?? 0).toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2", children: [
                      "\xA3",
                      (sco.niAmount ?? 0).toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] })
                  ] }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { className: "border-b", children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { className: "py-2 pr-4", children: "Net Take-Home (annual)" }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2 pr-4", children: [
                      "\xA3",
                      (rUK.netSalary ?? 0).toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { className: "py-2", children: [
                      "\xA3",
                      (sco.netSalary ?? 0).toLocaleString("en-GB", {
                        maximumFractionDigits: 0
                      })
                    ] })
                  ] })
                ] })
              ] });
            })() })
          ] })
        ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "flex items-center justify-center h-[400px]", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center text-gray-500", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "w-12 h-12 mx-auto mb-4" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "text-xl font-semibold", children: "Ready for your PAYE calculation?" }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enter your salary details to see your exact take-home pay." })
        ] }) }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 py-12 non-printable mt-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: payeCalculatorFAQs }) }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 non-printable", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "mt-8", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "How this calculator works (2025/26)" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { className: "body leading-6 text-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", { className: "list-disc pl-5 space-y-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Tax year: 6 April 2025 \u2013 5 April 2026. Bands and rates reflect the latest public guidance." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Personal Allowance defaults to tax code 1257L. Custom codes adjust the allowance (e.g., 1280L \u2192 \xA312,800)." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Personal Allowance taper: above \xA3100,000, allowance reduces by \xA31 for every \xA32 of income." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Scottish income tax bands differ from England/Wales/NI. National Insurance thresholds are UK-wide." }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Results are estimates for guidance only and may vary with benefits-in-kind, adjustments, or non-standard codes." })
        ] }) })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        RelatedCalculators,
        {
          calculators: [
            {
              name: "Salary Calculator",
              url: createPageUrl("SalaryCalculatorUK"),
              description: "See full take-home pay including NI, pension and student loan."
            },
            {
              name: "Income Tax Calculator",
              url: createPageUrl("IncomeTaxCalculator"),
              description: "Understand your tax by band for 2025/26."
            },
            {
              name: "National Insurance Calculator",
              url: createPageUrl("NationalInsuranceCalculator"),
              description: "Calculate Class 1 NI contributions."
            }
          ]
        }
      )
    ] })
  ] });
}
export {
  PAYECalculator as default
};
