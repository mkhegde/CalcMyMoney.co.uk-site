export const isNum = (n) => typeof n === 'number' && Number.isFinite(n);
export const parseMoney = (s) => Number(String(s ?? '').replace(/[, ]+/g, '')) || 0;
export const safeFixed = (n, d = 2) => (isNum(n) ? n : 0).toFixed(d);
export const safeGBP = (n, opts = {}) =>
  (isNum(n) ? n : 0).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...opts,
  });
