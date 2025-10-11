import {
  Link
} from "./chunk-ZLF73IFG.js";
import {
  ChevronRight,
  House
} from "./chunk-UDMZXLZ4.js";
import {
  __toESM,
  cn,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/components/calculators/CalculatorWrapper.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function CalculatorWrapper({ children, className = "" }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "non-printable bg-background py-12", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("rounded-lg border border-card-muted bg-card-muted p-8", className), children }) }) });
}

// src/components/general/Breadcrumbs.jsx
var import_react2 = __toESM(require_react(), 1);
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
function Breadcrumbs({ path }) {
  if (!path || path.length === 0) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("nav", { className: "text-sm text-gray-500 mb-4", "aria-label": "Breadcrumb", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("ol", { className: "list-none p-0 inline-flex flex-wrap items-center", children: [
    /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("li", { className: "flex items-center", children: /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)(
      Link,
      {
        to: path[0].url,
        className: "text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1",
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(House, { className: "w-4 h-4" }),
          path[0].name
        ]
      }
    ) }),
    path.slice(1).map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime2.jsxs)("li", { className: "flex items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(ChevronRight, { className: "w-4 h-4 mx-1" }),
      item.url ? /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Link, { to: item.url, className: "text-blue-600 hover:text-blue-800 hover:underline", children: item.name }) : /* @__PURE__ */ (0, import_jsx_runtime2.jsx)("span", { className: "text-gray-700 font-medium", "aria-current": "page", children: item.name })
    ] }, index + 1))
  ] }) });
}

export {
  CalculatorWrapper,
  Breadcrumbs
};
