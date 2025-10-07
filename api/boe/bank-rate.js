export const config = { runtime: 'nodejs' };

// Official landing page (no API key). We’ll mine embedded JSON or text.
const SRC = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

// Try to pull the latest point from embedded chart-style JSON:  ..."Date":"YYYY-MM-DD","Value":4.00 ...
function pickLastValueFromEmbeddedSeries(html) {
  const matches = [
    ...html.matchAll(/"Date"\s*:\s*"(\d{4}-\d{2}-\d{2})"[^}]*?"Value"\s*:\s*([0-9.]+)/g),
  ];
  if (matches.length === 0) return null;

  const [, date, rawVal] = matches[matches.length - 1];
  const v = parseFloat(rawVal);
  if (!Number.isFinite(v)) return null;
  if (v < 0 || v > 20) return null; // sanity clamp to 0–20%
  return { value: v, date };
}

// Generic finder: first plausible percent (0–20) or basis points (25–2000 → ÷100).
function pickPlausiblePercent(html) {
  // e.g., “… Bank Rate is 4.0% …”
  const nearLabel = html.match(/Bank\s*Rate[^%]{0,80}?(\d{1,3}(?:\.\d+)?)\s?%/i);
  if (nearLabel) {
    const v = parseFloat(nearLabel[1]);
    if (Number.isFinite(v) && v >= 0 && v <= 20) return v;
  }

  // Fallback: scan all numbers
  const nums = [...html.matchAll(/(\d{1,4}(?:\.\d+)?)/g)]
    .map((m) => parseFloat(m[1]))
    .filter((n) => Number.isFinite(n));

  // Prefer a percent-looking value
  const pct = nums.find((n) => n >= 0 && n <= 20);
  if (typeof pct === 'number') return pct;

  // Or basis points (bps)
  const bps = nums.find((n) => n > 20 && n <= 2000);
  if (typeof bps === 'number') return bps / 100;

  return null;
}

export default async function handler(req, res) {
  try {
    const resp = await fetch(SRC, { headers: { 'user-agent': UA, accept: 'text/html' } });
    if (!resp.ok) throw new Error(`BoE fetch ${resp.status}`);
    const html = await resp.text();

    // 1) Best-case: embedded JSON series (most reliable)
    const series = pickLastValueFromEmbeddedSeries(html);

    // 2) Fallback: heuristic scan of visible text
    const value = series?.value ?? pickPlausiblePercent(html);

    if (value == null) throw new Error('Could not find a plausible Bank Rate');

    const periodStart = series?.date
      ? new Date(series.date).toISOString()
      : new Date().toISOString();

    res.status(200).json({
      value: Number(value.toFixed(2)),
      unit: 'percent',
      period: { start: periodStart, label: null },
      change: null, // could be computed if you also extract the penultimate data point
      source: { name: 'Bank of England', url: SRC },
    });
  } catch (err) {
    // Return a soft error so the dashboard can still render other cards
    res.status(200).json({
      value: null,
      unit: 'percent',
      period: null,
      change: null,
      error: String(err?.message || err),
      source: { name: 'Bank of England', url: SRC },
    });
  }
}
