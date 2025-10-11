import {
  Link
} from "./chunk-ZLF73IFG.js";
import {
  ArrowRight
} from "./chunk-UDMZXLZ4.js";
import {
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/components/calculators/RelatedCalculators.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function RelatedCalculators({ calculators = [] }) {
  const list = Array.isArray(calculators) ? calculators.slice(0, 3) : [];
  const onClick = (url) => () => {
    try {
      if (typeof trackEvent === "function") trackEvent("related_calculator_click", { label: url });
      else window?.gtag?.("event", "related_calculator_click", { label: url });
    } catch {
    }
  };
  if (!list.length) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { "aria-labelledby": "related-tools", className: "bg-white dark:bg-gray-900 py-12 non-printable", "data-related-calculators": "1", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { id: "related-tools", className: "text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8", children: "Related Financial Tools" }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: list.map((calc, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Link,
      {
        to: calc.url,
        onClick: onClick(calc.url),
        className: "group block p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { className: "font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2", children: calc.name }),
          calc.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2", children: calc.description }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex items-center text-sm font-medium text-blue-600 dark:text-blue-400", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Use Calculator" }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" })
          ] })
        ]
      },
      index
    )) })
  ] }) });
}

export {
  RelatedCalculators
};
