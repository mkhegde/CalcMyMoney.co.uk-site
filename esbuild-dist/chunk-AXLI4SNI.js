import {
  Primitive
} from "./chunk-VKAPTTXR.js";
import {
  cva
} from "./chunk-DOIEHZ4R.js";
import {
  __toESM,
  cn,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/components/ui/label.jsx
var React2 = __toESM(require_react(), 1);

// node_modules/@radix-ui/react-label/dist/index.mjs
var React = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
var NAME = "Label";
var Label = React.forwardRef((props, forwardedRef) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    Primitive.label,
    {
      ...props,
      ref: forwardedRef,
      onMouseDown: (event) => {
        const target = event.target;
        if (target.closest("button, input, select, textarea")) return;
        props.onMouseDown?.(event);
        if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
      }
    }
  );
});
Label.displayName = NAME;
var Root = Label;

// src/components/ui/label.jsx
var import_jsx_runtime2 = __toESM(require_jsx_runtime(), 1);
var labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label2 = React2.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(Root, { ref, className: cn(labelVariants(), className), ...props }));
Label2.displayName = Root.displayName;

export {
  Label2 as Label
};
