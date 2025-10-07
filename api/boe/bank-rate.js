export const config = { runtime: 'nodejs' };

const SRC = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36';

function pickPercentFrom(html) {
  // Collect all numeric tokens (e.g. 4, 4.0, 400)
  const nums = [...html.matchAll(/(\d{1,4}(?:\.\d+)?)/g)]
    .map((m) => parseFloat(m[1]))
    .filter((n) => Number.isFinite(n));

  if (!nums.length) return null;

  // Prefer a value that already looks like a percent (0–20)
  const pct = nums.find((n) => n >= 0 && n <= 20);
  if (typeof pct === 'number') return pct;

  // Otherwise, if something looks like basis points (25–2000), convert
  const bps = nums.find((n) => n > 20 && n <= 2000);
  if (typeof bps === 'number') return bps / 100;

  // Nothing usable
  return null;
}

function pickPreviousFrom(html) {
  // Try to find a "previous" number near relevant labels
  const m =
    html.match(/Previous[^0-9]{0,40}(\d{1,4}(?:\.\d+)?)/i) ||
    html.match(/Change[^0-9]{0,40}(\d{1,4}(?:\.\d+)?)/i);
  if (!m) return null;
  let n = parseFloat(m[1]);
  if (!Number.isFinite(n)) return null;
  if (n > 20 && n <= 2000) n = n / 100; // basis points → percent
  return n;
}

export default async function handler(req, res) {
  try {
    const resp = await fetch(SRC, {
      headers: { 'user-agent': UA, accept: 'text/html' },
    });
    if (!resp.ok) throw new Error(`BoE fetch ${resp.status}`);
    const html = await resp.text();

    const rate = pickPercentFrom(html);
    if (rate == null) throw new Error('Could not find a plausible Bank Rate');

    const prev = pickPreviousFrom(html);
    const change = typeof prev === 'number' ? Number((rate - prev).toFixed(2)) : null;

    // Build response your dashboard expects
    res.status(200).json({
      value: Number(rate.toFixed(2)),
      unit: 'percent',
      period: {
        start: new Date().toISOString(), // we don't get an exact effective date here
        label: null,
      },
      change:
        change == null
          ? null
          : {
              value: change,
              unit: 'percentagePoints',
              direction: change > 0 ? 'up' : change < 0 ? 'down' : 'flat',
              label: 'vs previous setting',
            },
      source: { name: 'Bank of England', url: SRC },
    });
  } catch (err) {
    // Return 200 with an empty payload so the aggregator can keep other cards alive
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
