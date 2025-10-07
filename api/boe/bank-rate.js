/* eslint-env node */
export const config = { runtime: 'nodejs' }; // <-- fixed

const BOE_URL = 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp';

export default async function handler(req, res) {
  try {
    const r = await fetch(BOE_URL, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
        accept: 'text/html,application/xhtml+xml',
      },
    });
    if (!r.ok) throw new Error(`BoE page ${r.status}`);
    const html = await r.text();

    let m =
      html.match(/Bank Rate[^%<]{0,160}?(\d+(?:\.\d+)?)\s?%/i) || html.match(/(\d+(?:\.\d+)?)\s?%/);
    const value = m ? Number(m[1]) : NaN;
    if (!Number.isFinite(value)) throw new Error('No percent value found');

    const mm = html.match(/(?:as at|as of|effective|from)\s+([A-Z][a-z]+)\s+(\d{4})/i);
    const period =
      mm && mm[1] && mm[2]
        ? { label: `${mm[1]} ${mm[2]}`, start: new Date(`${mm[1]} 01, ${mm[2]}`).toISOString() }
        : { label: 'latest', start: null };

    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');
    return res.status(200).json({
      stat: {
        id: 'bankRate',
        title: 'BoE Bank Rate',
        unit: 'percent',
        value,
        period,
        change: null,
      },
    });
  } catch (e) {
    return res.status(502).json({ error: `Bank Rate fetch failed: ${e.message}` });
  }
}
