/* eslint-env node */
// /api/ukhpi/average-price.js
// UK average house price (best-effort scrape of Land Registry UK HPI app page)

export const config = { runtime: 'nodejs20.x' };

const HPI_URL = 'https://landregistry.data.gov.uk/app/hpi/';

export default async function handler(req, res) {
  try {
    const r = await fetch(HPI_URL, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!r.ok) throw new Error(`HPI page ${r.status}`);
    const html = await r.text();

    // Try "Average price £xxx,xxx"
    const m = html.match(/Average\s+price[^£]*£([\d,]+)/i);
    const value = m ? Number(m[1].replace(/,/g, '')) : NaN;
    if (!Number.isFinite(value)) throw new Error('No average price value found');

    // Heuristic month context (often visible as "for <Month> <Year>")
    const mm = html.match(/for\s+([A-Z][a-z]+)\s+(\d{4})/i);
    const period =
      mm && mm[1] && mm[2]
        ? {
            label: `${mm[1]} ${mm[2]}`,
            start: new Date(`${mm[1]} 01, ${mm[2]}`).toISOString(),
          }
        : { label: 'latest', start: null };

    const stat = {
      id: 'housePrice',
      title: 'Average UK House Price',
      unit: 'gbp',
      value,
      period,
      change: null,
    };

    res.setHeader('Cache-Control', 's-maxage=21600, stale-while-revalidate=86400'); // 6h
    return res.status(200).json({ stat });
  } catch (e) {
    return res.status(502).json({ error: `UKHPI fetch failed: ${e.message}` });
  }
}
