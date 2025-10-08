/* eslint-env node */
export const config = { runtime: 'nodejs' };

const SOURCE = 'https://www.ofgem.gov.uk/energy-price-cap';

const POUND = '(?:£|&pound;|&#163;)';
const PRICE_RE = new RegExp(`${POUND}\\s*([\\d,]+)`, 'i');
const WINDOW_RE = /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}\s*[–-]\s*(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4}/i;

const MONTHS = {
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function monthStartIso(label) {
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
      },
    });
    if (!r.ok) throw new Error(`Ofgem page ${r.status}`);
    const html = await r.text();

    const priceMatch = PRICE_RE.exec(html);
    if (!priceMatch) throw new Error('Price not found');

    const value = Number(String(priceMatch[1]).replace(/,/g, ''));

    let label = null;
    let start = null;
    let end = null;
    const windowMatch = WINDOW_RE.exec(html);
    if (windowMatch) {
      const l1 = `${windowMatch[1]} ${new Date().getUTCFullYear()}`;
      const l2 = `${windowMatch[2]} ${new Date().getUTCFullYear()}`;
      start = monthStartIso(l1);
      end = monthStartIso(l2);
      label = `${windowMatch[1]} – ${windowMatch[2]}`;
    }

    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');
    return res.status(200).json({
      id: 'ofgemCap',
      title: 'Ofgem Energy Price Cap',
      unit: 'gbp',
      value,
      period: { label, start, end },
      change: null,
      source: { name: 'Ofgem', url: SOURCE },
    });
  } catch (e) {
    return res.status(502).json({ error: `Ofgem fetch failed: ${e.message}` });
  }
}

