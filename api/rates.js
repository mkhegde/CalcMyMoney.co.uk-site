/* eslint-env node */
/* eslint no-console: "off" */
/* global process, console, fetch, URL */

// Vercel Node serverless function
export default async function handler(req, res) {
  const { base = 'GBP', currencies = 'USD,EUR,INR,JPY,CAD,AUD,NZD' } = req.query ?? {};
  const apiKey = process.env.FOREX_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'missing_api_key' });
  }

  try {
    const url = new URL('https://api.forexrateapi.com/v1/latest');
    url.searchParams.set('api_key', apiKey);
    url.searchParams.set('base', base);
    url.searchParams.set('currencies', currencies);

    const r = await fetch(url.toString(), { headers: { accept: 'application/json' } });
    if (!r.ok) {
      const txt = await r.text().catch(() => '');
      return res.status(502).json({ error: `upstream_${r.status}`, details: txt.slice(0, 200) });
    }

    const data = await r.json();

    // Normalise provider payloads defensively
    const rates = data?.rates ?? data?.data?.rates ?? data?.conversion_rates ?? null;
    if (!rates || typeof rates !== 'object') {
      return res.status(500).json({ error: 'bad_payload' });
    }

    const date = data?.date ?? data?.time_last_update_utc ?? new Date().toISOString();

    // Cache at the edge for 1 day; serve stale while revalidating
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');

    return res.status(200).json({
      base: data?.base ?? base,
      date,
      rates: { ...rates }, // plain object
      provider: 'forexrateapi',
    });
  } catch (err) {
    console.error('rates handler error:', err);
    return res.status(500).json({ error: 'failed_to_fetch_rates' });
  }
}
