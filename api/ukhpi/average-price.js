export const config = { runtime: 'nodejs' };

// ONS latest bulletin (no key required)
const SRC =
  'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/housepriceindex/latest';
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36';

function extractPrice(html) {
  // Look for text like: "average UK house price was £288,000"
  const m = html.match(/average\s+UK\s+house\s+price\s+was\s+£\s*([\d,]+)/i);
  if (!m) return null;
  const n = parseInt(m[1].replace(/,/g, ''), 10);
  return Number.isFinite(n) ? n : null;
}

function extractMonth(html) {
  // Pull a Month Year near the top if present (e.g., "August 2025")
  const m = html.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\b/
  );
  return m ? m[0] : null;
}

export default async function handler(req, res) {
  try {
    const r = await fetch(SRC, { headers: { 'user-agent': UA, accept: 'text/html' } });
    if (!r.ok) throw new Error(`ONS fetch ${r.status}`);
    const html = await r.text();

    const price = extractPrice(html);
    if (price == null) throw new Error('Could not find a plausible UK average house price');

    const label = extractMonth(html);

    res.status(200).json({
      value: price,
      unit: 'gbp',
      period: { start: new Date().toISOString(), label },
      change: null, // could also parse YOY % from the same page if needed
      source: { name: 'ONS House Price Index (latest bulletin)', url: SRC },
    });
  } catch (err) {
    res.status(200).json({
      value: null,
      unit: 'gbp',
      period: null,
      change: null,
      error: String(err?.message || err),
      source: { name: 'ONS House Price Index (latest bulletin)', url: SRC },
    });
  }
}
