/* eslint-env node */
export const config = { runtime: 'nodejs' };

const SOURCE = 'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex/latest';

// Support literal £ (\u00A3), mis-encoded replacement, and HTML entities
const POUND = '(?:\u00A3|�|&pound;|&#163;)';
// Phrase-anchored patterns around the headline wording
const PHRASE_PATTERNS = [
  new RegExp(`average\\s+UK\\s+house\\s+price[^£]*${POUND}\\s*([\\d,]{5,7})`, 'i'),
  new RegExp(`UK\\s+average\\s+house\\s+price[^£]*${POUND}\\s*([\\d,]{5,7})`, 'i'),
  new RegExp(`average\\s+house\\s+price[^£]{0,120}${POUND}\\s*([\\d,]{5,7})`, 'i'),
];
const MONTH_LABEL_RE = /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/i;

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function labelToStartIso(label) {
  const m = label.match(/([A-Za-z]+)\s+(\d{4})/);
  if (!m) return null;
  const month = MONTHS[m[1].toLowerCase()];
  const year = Number(m[2]);
  if (month == null || !Number.isFinite(year)) return null;
  return new Date(Date.UTC(year, month, 1, 0, 0, 0)).toISOString();
}

export default async function handler(req, res) {
  try {
    const r = await fetch(SOURCE, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'accept-language': 'en-GB,en;q=0.9',
      },
    });
    if (!r.ok) throw new Error(`ONS HPI page ${r.status}`);
    const html = (await r.text()).replace(/\s+/g, ' ');

    // 1) Try phrase-anchored patterns first
    let value = null;
    for (const re of PHRASE_PATTERNS) {
      const m = re.exec(html);
      if (m) {
        const v = Number(String(m[1]).replace(/,/g, ''));
        if (Number.isFinite(v) && v >= 50000 && v <= 2000000) {
          value = v;
          break;
        }
      }
    }

    // 2) Fallback: scan all £ amounts and pick one with nearby context mentioning house/price
    if (!Number.isFinite(value)) {
      const all = [...html.matchAll(new RegExp(`${POUND}\\s*([\\d,]{5,7})`, 'gi'))];
      for (const m of all) {
        const v = Number(String(m[1]).replace(/,/g, ''));
        if (!Number.isFinite(v) || v < 50000 || v > 2000000) continue;
        const idx = m.index ?? 0;
        const ctx = html.slice(Math.max(0, idx - 120), idx + 120).toLowerCase();
        if (ctx.includes('house') && ctx.includes('price')) {
          value = v;
          break;
        }
      }
      // 3) Last resort: use the largest plausible amount
      if (!Number.isFinite(value) && all.length) {
        const nums = all
          .map((m) => Number(String(m[1]).replace(/,/g, '')))
          .filter((n) => Number.isFinite(n) && n >= 50000 && n <= 2000000);
        if (nums.length) value = Math.max(...nums);
      }
    }

    if (!Number.isFinite(value)) throw new Error('Price not found in ONS HPI page');

    const labelMatch = MONTH_LABEL_RE.exec(html);
    const label = labelMatch ? labelMatch[0] : 'latest';
    const start = labelToStartIso(label) || null;

    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');
    return res.status(200).json({
      id: 'housePrice',
      title: 'Average UK House Price',
      unit: 'gbp',
      value,
      period: { label, start },
      change: null,
      source: { name: 'ONS HPI (latest bulletin)', url: SOURCE },
    });
  } catch (e) {
    return res.status(502).json({ error: `UKHPI fetch failed: ${e.message}` });
  }
}

