// /api/ofgem/price-cap.js
// Source: Ofgem “Energy price cap” page; extract typical annual bill.
// Ofgem updates quarterly (Jan–Mar, Apr–Jun, Jul–Sep, Oct–Dec).

export const config = { runtime: 'edge' };

const OFGEM_CAP = 'https://www.ofgem.gov.uk/energy-price-cap';

export default async function handler() {
  try {
    const r = await fetch(OFGEM_CAP, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`Ofgem page ${r.status}`);
    const html = await r.text();

    // Pull the first £n,nnn figure near "per year" or “typical household”
    const moneyNear = html
      .replace(/\s+/g, ' ')
      .match(/£\s?([\d,]{3,})\s*(?:per\s*year|a\s*year|typical)/i);
    if (!moneyNear) throw new Error('Could not find cap annual amount');

    const value = Number(moneyNear[1].replace(/,/g, ''));
    if (!Number.isFinite(value)) throw new Error('Cap value not numeric');

    // Try to infer quarter window like “1 October to 31 December 2025”
    let periodLabel = 'current cap';
    const qMatch = html.match(/(\d{1,2}\s+[A-Z][a-z]+)\s+to\s+(\d{1,2}\s+[A-Z][a-z]+)\s+(\d{4})/);
    if (qMatch) {
      periodLabel = `${qMatch[1]} – ${qMatch[2]} ${qMatch[3]}`;
    }

    const stat = {
      id: 'ofgemCap',
      title: 'Ofgem Energy Price Cap',
      unit: 'gbp',
      value,
      period: { label: periodLabel, start: null, end: null },
      change: null,
    };

    return new Response(JSON.stringify({ stat }), {
      headers: {
        'content-type': 'application/json',
        'cache-control': 's-maxage=21600, stale-while-revalidate=86400',
      }, // 6h
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: `Ofgem cap fetch failed: ${e.message}` }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
