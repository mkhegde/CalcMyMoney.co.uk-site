// /api/boe/bank-rate.js
export const config = { runtime: 'edge' };

const SOURCE = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';

/**
 * Returns JSON like: { rate: 5.25, unit: "%", source, fetchedAt }
 * Caches at the CDN for 12h, with 24h stale-while-revalidate.
 */
export default async function handler() {
  try {
    const resp = await fetch(SOURCE, {
      headers: {
        // A polite UA helps avoid certain anti-bot heuristics
        'user-agent': 'CalcMyMoney/1.0 (+https://www.calcmymoney.co.uk)',
      },
    });

    if (!resp.ok) {
      return new Response(JSON.stringify({ error: 'upstream_error', status: resp.status }), {
        status: 502,
        headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
      });
    }

    const html = await resp.text();

    // 1) Current headline (very stable on the official page)
    // e.g.: "Current official Bank Rate 5.25%"
    const m = html.match(/Current\s+official\s+Bank\s+Rate[^0-9]*([\d.]+)\s*%/i);
    const rate = m ? parseFloat(m[1]) : null;

    // Optional: best-effort grab the first date in the change table (may not always match)
    // const dm = html.match(/(\d{1,2}\s+[A-Za-z]{3,}\s+\d{4})/); // e.g. "1 Aug 2024"
    // const lastChanged = dm ? dm[1] : null;

    const data = {
      rate,
      unit: '%',
      source: SOURCE,
      fetchedAt: new Date().toISOString(),
      // lastChanged
    };

    return new Response(JSON.stringify(data), {
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        // CDN cache for 12h, allow 24h stale while it revalidates
        'cache-control': 's-maxage=43200, stale-while-revalidate=86400',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'fetch_failed', detail: String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json', 'access-control-allow-origin': '*' },
    });
  }
}
