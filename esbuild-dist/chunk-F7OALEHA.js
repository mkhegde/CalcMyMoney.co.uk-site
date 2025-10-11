import {
  Button
} from "./chunk-RTS3GJRL.js";
import {
  Download,
  Printer
} from "./chunk-UDMZXLZ4.js";
import {
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/components/calculators/ExportActions.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function ExportActions({ csvData, fileName, title }) {
  const handlePrint = () => {
    const originalTitle = document.title;
    document.title = title || "Calculation Results";
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "result_print", {
        page_name: document.title,
        file_name: title || "Calculation Results"
      });
    }
    window.print();
    document.title = originalTitle;
  };
  const handleCSVExport = () => {
    if (!csvData) return;
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "result_download", {
        page_name: document.title,
        file_name: `${fileName}.csv`,
        format: "csv"
      });
    }
    const csvString = csvData.map((rowArray) => rowArray.map((item) => `"${String(item).replace(/"/g, '""')}"`).join(",")).join("\n");
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvString], {
      type: "text/csv;charset=utf-8;"
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, { variant: "outline", onClick: handlePrint, className: "flex-1 md:flex-none", children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "w-4 h-4 mr-2" }),
      "Print / Save PDF"
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      Button,
      {
        variant: "outline",
        onClick: handleCSVExport,
        className: "flex-1 md:flex-none",
        disabled: !csvData,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "w-4 h-4 mr-2" }),
          "Export to CSV"
        ]
      }
    )
  ] });
}

export {
  ExportActions
};
