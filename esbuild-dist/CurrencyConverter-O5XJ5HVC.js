import {
  Alert,
  AlertDescription,
  AlertTitle
} from "./chunk-C5XTUF76.js";
import {
  AnimatedNumber
} from "./chunk-YHKA3VCH.js";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./chunk-7UAJR5DL.js";
import "./chunk-V5SP5FAB.js";
import "./chunk-2DGHTBXQ.js";
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
  ArrowRightLeft,
  CircleAlert,
  Info,
  LoaderCircle,
  TrendingUp
} from "./chunk-UDMZXLZ4.js";
import {
  Heading_default,
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/pages/CurrencyConverter.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var BASE = "GBP";
var SUPPORTED = ["GBP", "USD", "EUR", "JPY", "AUD", "CAD", "CHF", "INR", "NZD"];
var CURRENCIES_PARAM = SUPPORTED.filter((c) => c !== BASE).join(",");
var ONE_DAY_MS = 24 * 60 * 60 * 1e3;
var LS_KEY = `fx:${BASE}:${CURRENCIES_PARAM}`;
var ZERO_DEC_CURRENCIES = ["JPY", "KRW", "VND"];
var currencyNames = {
  GBP: "GBP - British Pound",
  USD: "USD - United States Dollar",
  EUR: "EUR - Euro",
  JPY: "JPY - Japanese Yen",
  AUD: "AUD - Australian Dollar",
  CAD: "CAD - Canadian Dollar",
  CHF: "CHF - Swiss Franc",
  INR: "INR - Indian Rupee",
  NZD: "NZD - New Zealand Dollar"
};
var currencyFAQs = [
  {
    question: "How often are these rates updated?",
    answer: "The exchange rates on this page are updated once per day. For time-sensitive transactions, always confirm with a real-time provider."
  },
  {
    question: "What is an exchange rate?",
    answer: "An exchange rate is how much one currency is worth in another. If GBP/USD is 1.25, \xA31 buys $1.25."
  },
  {
    question: "What influences exchange rates?",
    answer: "Interest rates, inflation, economic stability, government debt, and trade balances all impact exchange rates."
  },
  {
    question: "Why might this rate differ from my bank's rate?",
    answer: "Banks and FX services usually add a markup to the mid-market rate. Your actual rate will be slightly different."
  }
];
function getCached(maxAgeMs) {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const { t, data } = JSON.parse(raw);
    if (Date.now() - t < maxAgeMs) return data;
  } catch {
  }
  return null;
}
function setCached(data) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ t: Date.now(), data }));
  } catch {
  }
}
function toEpochSeconds(d) {
  if (!d) return null;
  if (typeof d === "number") return Math.floor(d);
  if (typeof d === "string") {
    const ts = Date.parse(d);
    if (!Number.isNaN(ts)) return Math.floor(ts / 1e3);
  }
  return Math.floor(Date.now() / 1e3);
}
function CurrencyConverter() {
  const [amount, setAmount] = (0, import_react.useState)("1000");
  const [fromCurrency, setFromCurrency] = (0, import_react.useState)("GBP");
  const [toCurrency, setToCurrency] = (0, import_react.useState)("USD");
  const [ratesMap, setRatesMap] = (0, import_react.useState)(null);
  const [result, setResult] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [error, setError] = (0, import_react.useState)(null);
  const [lastUpdated, setLastUpdated] = (0, import_react.useState)(null);
  (0, import_react.useEffect)(() => {
    try {
      const loc = navigator.language || Intl.DateTimeFormat().resolvedOptions().locale || "";
      if (loc.includes("en-IN")) setToCurrency("INR");
      else if (loc.includes("ja")) setToCurrency("JPY");
      else if (loc.includes("en-AU")) setToCurrency("AUD");
      else if (loc.includes("en-NZ")) setToCurrency("NZD");
      else if (loc.includes("en-CA")) setToCurrency("CAD");
      else if (loc.includes("de") || loc.includes("fr") || loc.includes("es") || loc.includes("it") || loc.includes("nl")) {
        setToCurrency("EUR");
      }
    } catch {
    }
  }, []);
  (0, import_react.useEffect)(() => {
    const cached = getCached(ONE_DAY_MS);
    if (cached?.rates) {
      setRatesMap(cached.rates);
      setLastUpdated(toEpochSeconds(cached.date));
      setLoading(false);
    }
    (async () => {
      try {
        const res = await fetch(
          `/api/rates?base=${encodeURIComponent(BASE)}&currencies=${encodeURIComponent(
            CURRENCIES_PARAM
          )}`
        );
        if (!res.ok) throw new Error("api_error");
        const json = await res.json();
        if (!json?.rates || typeof json.rates !== "object") {
          throw new Error("invalid_response");
        }
        const withBase = { GBP: 1, ...json.rates };
        const normalized = {
          base: json.base || BASE,
          date: json.date || (/* @__PURE__ */ new Date()).toISOString(),
          rates: withBase,
          provider: json.provider || "forexrateapi"
        };
        setRatesMap(normalized.rates);
        setLastUpdated(toEpochSeconds(normalized.date));
        setCached(normalized);
        setError(null);
      } catch (e) {
        if (!cached) setError("Failed to fetch valid currency rates. Please try again later.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  const calculateConversion = (0, import_react.useCallback)(() => {
    if (!ratesMap || !amount) {
      setResult(null);
      return;
    }
    const rateFrom = ratesMap[fromCurrency];
    const rateTo = ratesMap[toCurrency];
    const numericAmount = parseFloat(amount);
    if (rateFrom && rateTo && !Number.isNaN(numericAmount)) {
      const amountInGbp = numericAmount / rateFrom;
      const convertedAmount = amountInGbp * rateTo;
      setResult(convertedAmount);
    } else {
      setResult(null);
    }
  }, [amount, fromCurrency, toCurrency, ratesMap]);
  (0, import_react.useEffect)(() => {
    calculateConversion();
  }, [calculateConversion]);
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  const exchangeRate = ratesMap && ratesMap[toCurrency] && ratesMap[fromCurrency] ? ratesMap[toCurrency] / ratesMap[fromCurrency] : 0;
  const fractionDigits = ZERO_DEC_CURRENCIES.includes(toCurrency) ? 0 : 2;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "bg-white dark:bg-gray-900", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "text-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heading_default, { as: "h1", size: "h1", weight: "bold", className: "text-gray-900 dark:text-gray-100 mb-4", children: "Live Currency Converter" }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto", children: "Check the latest foreign exchange rates for major currencies against the Pound." })
    ] }) }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "grid lg:grid-cols-2 gap-8 items-start", children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { className: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Convert Currency" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "space-y-4", children: [
            loading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-center p-4", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "w-6 h-6 animate-spin text-blue-600" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "ml-2 text-gray-600 dark:text-gray-300", children: "Fetching latest rates..." })
            ] }),
            error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, { variant: "destructive", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, { children: "Error" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertDescription, { children: error })
            ] }),
            !loading && !error && ratesMap && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "space-y-1", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { htmlFor: "amount", children: "Amount" }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Input,
                  {
                    id: "amount",
                    type: "number",
                    inputMode: "decimal",
                    value: amount,
                    onChange: (e) => setAmount(e.target.value),
                    className: "dark:bg-gray-700 dark:text-gray-50 dark:border-gray-600",
                    placeholder: "e.g. 100"
                  }
                )
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex flex-col sm:flex-row items-stretch gap-4", children: [
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "From" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: fromCurrency, onValueChange: setFromCurrency, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "w-full max-w-full truncate dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select currency" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { className: "max-h-72 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: SUPPORTED.filter((c) => ratesMap[c]).map((curr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: curr, className: "truncate", children: currencyNames[curr] || curr }, curr)) })
                  ] })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "sm:self-end", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  Button,
                  {
                    variant: "ghost",
                    size: "icon",
                    onClick: handleSwapCurrencies,
                    className: "mt-2 sm:mt-6 hover:bg-gray-100 dark:hover:bg-gray-700",
                    title: "Swap currencies",
                    "aria-label": "Swap currencies",
                    children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRightLeft, { className: "w-5 h-5 text-gray-500" })
                  }
                ) }),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex-1 space-y-1", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "To" }),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, { value: toCurrency, onValueChange: setToCurrency, children: [
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { className: "w-full max-w-full truncate dark:text-gray-50", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select currency" }) }),
                    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { className: "max-h-72 dark:bg-gray-800 dark:text-gray-50 dark:border-gray-700", children: SUPPORTED.filter((c) => ratesMap[c]).map((curr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, { value: curr, className: "truncate", children: currencyNames[curr] || curr }, curr)) })
                  ] })
                ] })
              ] })
            ] })
          ] })
        ] }),
        result !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { className: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50 border-blue-200 dark:border-blue-700", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { className: "p-6", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "min-w-0", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm font-medium text-blue-800 dark:text-blue-300", children: [
                amount,
                " ",
                fromCurrency,
                " equals"
              ] }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "text-4xl font-bold text-blue-900 dark:text-blue-100", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                AnimatedNumber,
                {
                  value: result,
                  options: {
                    minimumFractionDigits: fractionDigits,
                    maximumFractionDigits: fractionDigits,
                    currency: toCurrency,
                    style: "currency"
                  }
                }
              ) })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "w-6 h-6 text-white" }) })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { className: "text-sm text-blue-700 dark:text-blue-300 mt-2", children: [
            "Exchange Rate: 1 ",
            fromCurrency,
            " =",
            " ",
            exchangeRate.toFixed(Math.max(4, fractionDigits)),
            " ",
            toCurrency
          ] }),
          lastUpdated && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center gap-2 mt-4 text-xs text-gray-500 dark:text-gray-400", children: [
              /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "w-3.5 h-3.5" }),
              /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
                "Rates last updated:",
                " ",
                new Date(lastUpdated * 1e3).toLocaleString("en-GB", {
                  dateStyle: "medium",
                  timeStyle: "short"
                })
              ] })
            ] }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-xs text-gray-500 mt-1", children: "Source: mid-market rates \u2022 cached daily at edge and in your browser." })
          ] })
        ] }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FAQSection, { faqs: currencyFAQs }) })
    ] })
  ] });
}
export {
  CurrencyConverter as default
};
