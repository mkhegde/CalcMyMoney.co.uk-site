/* eslint-env node */
/* eslint no-console: "off" */
/* global fetch */

// ---------- Constants ----------
const USER_AGENT = 'CalcMyMoney.co.uk/uk-financial-stats (+https://www.calcmymoney.co.uk)';
const TIMEOUT_MS = 12000;

const BOE_PAGE = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';
const BOE_CSV = 'https://www.bankofengland.co.uk/boeapps/database/_iadb-download.aspx';

// ---------- Small utils ----------
function withTimeout(ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(new Error('timeout')), ms);
  return { signal: controller.signal, clear: () => clearTimeout(timer) };
}

function cleanCsvValue(v) {
  return typeof v === 'string' ? v.trim().replace(/^"|"$/g, '') : v;
}

function tryParseDate(value) {
  const cleaned = (value || '').replace(/"/g, '').trim();
  if (!cleaned) return null;
  const d = new Date(cleaned);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

function formatPeriodLabel(isoDate, fallback) {
  if (!isoDate) return fallback ?? null;
  try {
    return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(isoDate));
  } catch {
    return fallback ?? null;
  }
}

// ---------- Fetch helpers ----------
async function fetchText(url, params = {}) {
  const t = withTimeout();
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/csv, text/html; q=0.9, */*; q=0.8',
        referer: 'https://www.bankofengland.co.uk/',
        ...params.headers,
      },
      signal: t.signal,
      ...params,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`http_${res.status}:${text.slice(0, 200)}`);
    return text;
  } finally {
    t.clear();
  }
}

// ---------- Parsers ----------
function parseBankRateCsv(csvText) {
  if (typeof csvText !== 'string') throw new Error('bank_rate_not_csv');
  const lines = csvText.split(/\r?\n/).map((l) => l.trim());
  const rows = [];

  for (const line of lines) {
    if (!line || /^[A-Za-z ]+:/.test(line)) continue; // skip headings like "Frequency:"
    const parts = line.split(',').map(cleanCsvValue).filter((p) => p !== '');
    if (parts.length < 2) continue;
    const dateRaw = parts[0];
    const valRaw = parts[parts.length - 1];
    const value = Number.parseFloat(valRaw);
    if (Number.isFinite(value)) {
      rows.push({ date: tryParseDate(dateRaw), label: dateRaw, value });
    }
  }
  if (!rows.length) throw new Error('bank_rate_no_rows');

  rows.sort((a, b) => {
    if (!a.date) return -1;
    if (!b.date) return 1;
    return a.date.localeCompare(b.date);
  });

  const latest = rows[rows.length - 1];
  const prev = rows.length > 1 ? rows[rows.length - 2] : null;

  return {
    value: latest.value,
    period: { start: latest.date, label: formatPeriodLabel(latest.date, latest.label) },
    change: prev
      ? {
          value: +(latest.value - prev.value).toFixed(2),
          direction: latest.value > prev.value ? 'up' : latest.value < prev.value ? 'down' : 'flat',
          unit: 'percentagePoints',
          label: 'vs previous rate',
        }
      : null,
  };
}

// Very defensive HTML scrape (fallback) – no cheerio required.
function parseBankRateFromHtml(html) {
  // Look for patterns like: 5.25 or 5,25 optionally followed by % and a nearby date.
  const normalized = html.replace(/\s+/g, ' ');
  // First try to locate a table row containing "Bank Rate"
  const rowMatch =
    normalized.match(/<tr[^>]*>(.*?)<\/tr>/gi)?.find((row) => /bank rate/i.test(row)) || null;

  let value = null;
  let dateIso = null;
  if (rowMatch) {
    // grab numbers in the row
    const nums = rowMatch.match(/(\d+(?:[.,]\d+)?)/g) || [];
    const maybe = nums.map((n) => parseFloat(n.replace(',', '.'))).filter((x) => Number.isFinite(x));
    if (maybe.length) value = maybe[0];
    // try to pick a human-readable date in that row
    const dateTextMatch = rowMatch.match(
      /\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|\b[A-Za-z]{3,9}\s+\d{4}\b)/,
    );
    if (dateTextMatch) dateIso = tryParseDate(dateTextMatch[0]);
  }

  // fallback: search the entire page for first rate-like number if not found above
  if (value == null) {
    const m = normalized.match(/Bank Rate.*?(\d+(?:[.,]\d+)?)/i);
    if (m) value = parseFloat(m[1].replace(',', '.'));
  }

  if (!Number.isFinite(value)) throw new Error('bank_rate_html_not_found');

  return {
    value,
    period: { start: dateIso ?? null, label: dateIso ? formatPeriodLabel(dateIso) : null },
    change: null, // not easy from the page; CSV provides this if available
  };
}

// ---------- Handler (BoE only) ----------
export default async function handler(req, res) {
  const result = {
    generatedAt: new Date().toISOString(),
    stats: {},
    errors: {},
    status: 'error',
    partial: false,
  };

  try {
    // 1) Try the official CSV download (most stable for parsing)
    const url = new URL(BOE_CSV);
    url.searchParams.set('SeriesCodes', 'IUMABEDR'); // Official Bank Rate
    url.searchParams.set('CSVF', 'TN');               // tidy CSV
    url.searchParams.set('UsingCodes', 'Y');
    url.searchParams.set('VPD', 'Y');
    url.searchParams.set('VFD', 'N');

    let parsed;
    try {
      const csv = await fetchText(url.toString());
      parsed = parseBankRateCsv(csv);
    } catch (csvErr) {
      console.warn('[BoE] CSV failed, falling back to HTML:', csvErr?.message);

      // 2) Fallback to HTML page scrape
      const html = await fetchText(BOE_PAGE, {
        headers: {
          accept: 'text/html,application/xhtml+xml',
        },
      });
      parsed = parseBankRateFromHtml(html);
    }

    result.stats.bankRate = {
      ...parsed,
      title: 'BoE Bank Rate',
      unit: 'percent',
      source: { name: 'Bank of England', url: BOE_PAGE },
    };
    result.status = 'ok';
  } catch (err) {
    console.error('[BoE] scrape failed:', err);
    result.errors.bankRate = err?.message || 'unknown_error';
  }

  // Cache 1h, allow stale for 6h so the UI keeps last good value
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=21600');
  return res.status(200).json(result);
}
