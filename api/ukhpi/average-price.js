// /api/ukhpi/average-price.js
// Source: ONS “UK House Price Index” latest bulletin page (robust text scrape).
// We look for the sentence “average UK house price was £xxx”.

export const config = { runtime: 'edge' };

const HPI_LATEST_BULLETIN =
  'https://www.ons.gov.uk/economy/inflationandpriceindices/bulletins/ukhousepriceindex/latest';

export default async function handler() {
  try {
    const r = await fetch(HPI_LATEST_BULLETIN, { headers: { 'user-agent': 'Mozilla/5.0' } });
    if (!r.ok) throw new Error(`ONS HPI bulletin ${r.status}`);
    const html = await r.text();

    // Find month context e.g., "in August 2025" (best effort).
    const monthMatch = html.match(
      /(?:in|for)\s+([A-Z][a-z]+)\s+(\d{4})/,
    );
    const monthLabel = monthMatch ? `${monthMatch[1]} ${monthMatch[2]}` : 'latest';
    const periodStart = monthMatch ? new Date(`${monthMatch[1]} 01, ${monthMatch[2]}`) : null;

    // Find “average UK house price was £abc,def”
    const priceMatch = html.match(/average UK house price (?:was|is)\s+£([\d,]+)/i);
    if (!priceMatch) throw new Error('Could not parse average price from bulletin');

    const value = Number(priceMatch[1].replace(/,/g, ''));
    if (!Number.isFinite(value)) throw new Error('Average price not numeric');

    const stat = {
      id: 'housePrice',
      title: 'Average UK House Price',
      unit: 'gbp',
      value,
      period: {
        label: monthLabel,
        start: periodStart ? periodStart.toISOString() : null,
      },
      change: null,
    };

    return new Response(JSON.stringify({ stat }), {
      headers: { 'content-type': 'application/json', 'cache-control': 's-maxage=43200, stale-while-revalidate=86400' }, // 12h
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: `UK HPI fetch failed: ${e.message}` }), {
      status: 502,
      headers: { 'content-type': 'application/json' },
    });
  }
}
