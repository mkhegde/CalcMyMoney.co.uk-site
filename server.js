/* server.js */
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

const USER_AGENT = 'CalcMyMoney.co.uk/uk-financial-stats (+https://www.calcmymoney.co.uk)';
const TIMEOUT_MS = 12000;

const BOE_PAGE = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';
const BOE_CSV = 'https://www.bankofengland.co.uk/boeapps/database/_iadb-download.aspx';

function withTimeout(ms = TIMEOUT_MS) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(new Error('timeout')), ms);
  return { signal: controller.signal, clear: () => clearTimeout(t) };
}
function cleanCsvValue(v) {
  return typeof v === 'string' ? v.trim().replace(/^"|"$/g, '') : v;
}
function tryParseDate(v) {
  const s = (v || '').replace(/"/g, '').trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString().slice(0, 10);
}
function formatPeriodLabel(iso, fallback) {
  if (!iso) return fallback ?? null;
  try {
    return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(
      new Date(iso)
    );
  } catch {
    return fallback ?? null;
  }
}
async function fetchText(url, opts = {}) {
  const t = withTimeout();
  try {
    const res = await fetch(url, {
      headers: {
        'user-agent': USER_AGENT,
        accept: 'text/csv, text/html; q=0.9, */*; q=0.8',
        referer: 'https://www.bankofengland.co.uk/',
        ...(opts.headers || {}),
      },
      signal: t.signal,
      ...opts,
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`http_${res.status}:${text.slice(0, 200)}`);
    return text;
  } finally {
    t.clear();
  }
}
function parseBankRateCsv(csvText) {
  if (typeof csvText !== 'string') throw new Error('bank_rate_not_csv');
  const lines = csvText.split(/\r?\n/).map((l) => l.trim());
  const rows = [];
  for (const line of lines) {
    if (!line || /^[A-Za-z ]+:/.test(line)) continue;
    const parts = line
      .split(',')
      .map(cleanCsvValue)
      .filter((p) => p !== '');
    if (parts.length < 2) continue;
    const dateRaw = parts[0];
    const valRaw = parts[parts.length - 1];
    const value = parseFloat(valRaw);
    if (Number.isFinite(value)) rows.push({ date: tryParseDate(dateRaw), label: dateRaw, value });
  }
  if (!rows.length) throw new Error('bank_rate_no_rows');
  rows.sort((a, b) => (!a.date ? -1 : !b.date ? 1 : a.date.localeCompare(b.date)));
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
function parseBankRateFromHtml(html) {
  const normalized = html.replace(/\s+/g, ' ');
  const row =
    (normalized.match(/<tr[^>]*>(.*?)<\/tr>/gi) || []).find((r) => /bank rate/i.test(r)) || null;
  let value = null,
    dateIso = null;
  if (row) {
    const nums = row.match(/(\d+(?:[.,]\d+)?)/g) || [];
    const maybe = nums.map((n) => parseFloat(n.replace(',', '.'))).filter(Number.isFinite);
    if (maybe.length) value = maybe[0];
    const dateMatch = row.match(/\b(\d{1,2}\s+[A-Za-z]{3,9}\s+\d{4}|[A-Za-z]{3,9}\s+\d{4})\b/);
    if (dateMatch) dateIso = tryParseDate(dateMatch[0]);
  }
  if (value == null) {
    const m = normalized.match(/Bank Rate.*?(\d+(?:[.,]\d+)?)/i);
    if (m) value = parseFloat(m[1].replace(',', '.'));
  }
  if (!Number.isFinite(value)) throw new Error('bank_rate_html_not_found');
  return {
    value,
    period: { start: dateIso ?? null, label: dateIso ? formatPeriodLabel(dateIso) : null },
    change: null,
  };
}

app.get('/api/uk-financial-stats', async (req, res) => {
  const result = {
    generatedAt: new Date().toISOString(),
    stats: {},
    errors: {},
    status: 'error',
    partial: false,
  };
  try {
    // Try CSV first
    const url = new URL(BOE_CSV);
    url.searchParams.set('SeriesCodes', 'IUMABEDR');
    url.searchParams.set('CSVF', 'TN');
    url.searchParams.set('UsingCodes', 'Y');
    url.searchParams.set('VPD', 'Y');
    url.searchParams.set('VFD', 'N');

    let parsed;
    try {
      const csv = await fetchText(url.toString());
      parsed = parseBankRateCsv(csv);
    } catch (csvErr) {
      console.warn('[BoE] CSV failed, fallback to HTML:', csvErr?.message);
      const html = await fetchText(BOE_PAGE, {
        headers: { accept: 'text/html,application/xhtml+xml' },
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
  res.set('Cache-Control', 'public, max-age=0');
  res.status(200).json(result);
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
