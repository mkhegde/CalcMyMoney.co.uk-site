/* eslint-env node */
// /api/boe/bank-rate.js
// Fetch the latest BoE Bank Rate from the public page.

export const config = { runtime: 'nodejs20.x' };

const BOE_URL = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';

export default async function handler(req, res) {
  try {
    const r = await fetch(BOE_URL, {
      headers: {
        // Some publishers are picky about UA/accept
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!r.ok) throw new Error(`BoE page ${r.status}`);
    const html = await r.text();

    // Try to find a percentage near the words "Bank Rate"
    let value;
    let m = html.match(/Bank Rate[^%<]{0,160}?(\d+(?:\.\d+)?)\s?%/i);
    if (!m) m = html.match(/(\d+(?:\.\d+)?)\s?%/); // very last resort
    if (m) value = Number(m[1]);
    if (!Number.isFinite(value)) throw new Error('No percent value found');

    // Best-effort: derive a month context if present
    const mm = html.match(/(?:as at|as of|effective|from)\s+([A-Z][a-z]+)\s+(\d{4})/i);
    const period =
      mm && mm[1] && mm[2]
        ? {
            label: `${mm[1]} ${mm[2]}`,
            start: new Date(`${mm[1]} 01, ${mm[2]}`).toISOString(),
          }
        : { label: 'latest', start: null };

    const stat = {
      id: 'bankRate',
      title: 'BoE Bank Rate',
      unit: 'percent',
      value,
      period,
      change: null,
    };

    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400'); // 4h
    return res.status(200).json({ stat });
  } catch (e) {
    return res.status(502).json({ error: `Bank Rate fetch failed: ${e.message}` });
  }
}
