import {
  __toESM,
  require_jsx_runtime,
  require_react
} from "./chunk-PPOFLZEG.js";

// src/components/general/AnimatedNumber.jsx
var import_react = __toESM(require_react(), 1);
var import_jsx_runtime = __toESM(require_jsx_runtime(), 1);
function AnimatedNumber({
  value,
  className,
  locale = "en-GB",
  options = { minimumFractionDigits: 1, maximumFractionDigits: 1 }
}) {
  const [currentValue, setCurrentValue] = (0, import_react.useState)(0);
  (0, import_react.useEffect)(() => {
    let startTimestamp = null;
    const startValue = currentValue;
    const duration = 800;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const nextValue = progress * (value - startValue) + startValue;
      setCurrentValue(nextValue);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCurrentValue(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className, children: currentValue.toLocaleString(locale, options) });
}

export {
  AnimatedNumber
};
