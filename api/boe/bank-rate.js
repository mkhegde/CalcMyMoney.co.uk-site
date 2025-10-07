// /api/boe/bank-rate.js
export const config = { runtime: 'nodejs' };

const SRC = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

// 1) Embedded chart-style series: ..."Date":"YYYY-MM-DD","Value":4.00
function pickFromEmbeddedSeries(html) {
  const m = [...html.matchAll(/"Date"\s*:\s*"(\d{4}-\d{2}-\d{2})"[^}]*?"Value"\s*:\s*([0-9.]+)/g)];
  if (!m.length) return null;
  const [, date, raw] = m[m.length - 1];
  const v = parseFloat(raw);
  if (!Number.isFinite(v) || v < 0 || v > 20) return null;
  return { value: v, date };
}

// 2) If the page links to a CSV, fetch and take the last numeric row
function extractCsvHref(html) {
  // any href ending .csv on the Bank Rate page
  const m = html.match(/href="([^"]+\.csv[^"]*)"/i);
  return m ? new URL(m[1], SRC).toString() : null;
}
async function pickFromCsv(csvUrl) {
  const r = await fetch(csvUrl, {
    headers: { 'user-agent': UA, 'accept-language': 'en-GB,en;q=0.9' },
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`CSV fetch ${r.status}`);
  const text = await r.text();
  const rows = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  // try last 10 lines to find a numeric value
  for (let i = rows.length - 1; i >= Math.max(0, rows.length - 10); i--) {
    const parts = rows[i].split(',').map((s) => s.trim());
    const last = parts[parts.length - 1];
    const v = parseFloat(last);
    if (Number.isFinite(v) && v >= 0 && v <= 20) {
      // try to pull a date from the line too
      const dateStr =
        parts.find((p) => /^\d{4}-\d{2}-\d{2}$/.test(p)) ||
        parts.find((p) => /^\d{1,2}\/[A-Za-z]{3}\/\d{4}$/.test(p)) ||
        null;
      const iso = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();
      return { value: v, date: iso };
    }
  }
  return null;
}

// 3) Heuristic text scan (percent or basis points near “Bank Rate”)
function pickHeuristic(html) {
  const near = html.match(/Bank\s*Rate[^%]{0,120}?(\d{1,3}(?:\.\d+)?)\s?%/i);
  if (near) {
    const v = parseFloat(near[1]);
    if (Number.isFinite(v) && v >= 0 && v <= 20) return v;
  }

  // scan all numbers; prefer 0–20; fallback 25–2000 bps ⇒ ÷100
  const nums = [...html.matchAll(/(\d{1,4}(?:\.\d+)?)/g)]
    .map((m) => parseFloat(m[1]))
    .filter((n) => Number.isFinite(n));
  const pct = nums.find((n) => n >= 0 && n <= 20);
  if (typeof pct === 'number') return pct;
  const bps = nums.find((n) => n > 20 && n <= 2000);
  if (typeof bps === 'number') return bps / 100;
  return null;
}

export default async function handler(req, res) {
  try {
    const resp = await fetch(SRC, {
      headers: {
        'user-agent': UA,
        accept: 'text/html',
        'accept-language': 'en-GB,en;q=0.9',
      },
      cache: 'no-store',
    });
    if (!resp.ok) throw new Error(`BoE fetch ${resp.status}`);
    const html = await resp.text();

    // 1) embedded JSON
    let series = pickFromEmbeddedSeries(html);

    // 2) CSV link fallback
    if (!series) {
      const csv = extractCsvHref(html);
      if (csv) {
        try {
          series = await pickFromCsv(csv);
        } catch {
          // ignore and try heuristic
        }
      }
    }

    // 3) heuristic
    let value = series?.value ?? pickHeuristic(html);
    if (value == null) throw new Error('Could not detect Bank Rate');

    value = clamp(value, 0, 20);

    res.status(200).json({
      value: Number(value.toFixed(2)),
      unit: 'percent',
      period: { start: series?.date || new Date().toISOString(), label: null },
      change: null,
      source: { name: 'Bank of England', url: SRC },
    });
  } catch (err) {
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
