export function sanitiseNumber(value, options = {}) {
  const { allowNegative = false, defaultValue = 0 } = options;
  if (value === null || value === undefined) return defaultValue;

  const cleaned = String(value).replace(/,/g, '');
  const parsed = Number.parseFloat(cleaned);

  if (!Number.isFinite(parsed)) {
    return defaultValue;
  }

  if (!allowNegative && parsed < 0) {
    return defaultValue;
  }

  return parsed;
}
