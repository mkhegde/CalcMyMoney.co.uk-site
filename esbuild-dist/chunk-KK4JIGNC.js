import {
  __toESM,
  cn,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/components/ui/input.jsx
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    "input",
    {
      type,
      className: cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ref,
      ...props
    }
  );
});
Input.displayName = "Input";

export {
  Input
};
