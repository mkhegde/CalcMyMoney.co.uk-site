// /api/ukhpi/average-price.js
export const config = { runtime: 'nodejs' };

const SRC =
  'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex/latest';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

// Match variants like:
// "average UK house price was £288,000" or
// "UK average house price was £288,000" or
// "the average house price in the UK was £288,000"
const PRICE_PATTERNS = [
  /average\s+UK\s+house\s+price\s+was\s+£\s*([\d,]+)/i,
  /UK\s+average\s+house\s+price\s+was\s+£\s*([\d,]+)/i,
  /average\s+house\s+price\s+in\s+the\s+UK\s+was\s+£\s*([\d,]+)/i,
  /average\s+house\s+price[^£]{0,50}£\s*([\d,]+)/i,
];

function extractPrice(html) {
  for (const re of PRICE_PATTERNS) {
    const m = html.match(re);
    if (m) {
      const n = parseInt(m[1].replace(/,/g, ''), 10);
      if (Number.isFinite(n) && n > 20000 && n < 2000000) return n;
    }
  }
  return null;
}

function extractMonth(html) {
  const m = html.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/
  );
  return m ? m[0] : null;
}

export default async function handler(req, res) {
  try {
    const r = await fetch(SRC, {
      headers: { 'user-agent': UA, accept: 'text/html', 'accept-language': 'en-GB,en;q=0.9' },
      cache: 'no-store',
    });
    if (!r.ok) throw new Error(`ONS fetch ${r.status}`);
    const html = await r.text();

    const price = extractPrice(html);
    if (price == null) throw new Error('Could not find UK average house price');

    const label = extractMonth(html);

    res.status(200).json({
      value: price,
      unit: 'gbp',
      period: { start: new Date().toISOString(), label },
      change: null,
      source: { name: 'ONS HPI (latest bulletin)', url: SRC },
    });
  } catch (err) {
    res.status(200).json({
      value: null,
      unit: 'gbp',
      period: null,
      change: null,
      error: String(err?.message || err),
      source: { name: 'ONS HPI (latest bulletin)', url: SRC },
    });
  }
}
