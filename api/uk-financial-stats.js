/* eslint-env node */
export const config = { runtime: 'nodejs' };

function buildOrigin(req) {
  const proto =
    req.headers['x-forwarded-proto'] ||
    (process.env.VERCEL ? 'https' : 'http');
  const host = req.headers.host;
  return `${proto}://${host}`;
}

async function fetchJson(url) {
  const r = await fetch(url, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`Fetch failed ${r.status} ${url}`);
  return r.json();
}

export default async function handler(req, res) {
  const origin = buildOrigin(req);

  const endpoints = {
    bankRate: new URL('/api/boe/bank-rate', origin).toString(),
    cpih: new URL('/api/ons/cpih', origin).toString(),
    housePrice: new URL('/api/ukhpi/average-price', origin).toString(),
    ofgemCap: new URL('/api/ofgem/price-cap', origin).toString(),
  };

  const stats = {};
  const errors = {};

  await Promise.all(
    Object.entries(endpoints).map(async ([key, url]) => {
      try {
        const data = await fetchJson(url);
        // Standardize: consider it an error if value is null/undefined/NaN
        const v = Number(data?.value);
        if (!Number.isFinite(v)) throw new Error('Empty or invalid value');
        stats[key] = data;
      } catch (e) {
        errors[key] = e.message || 'fetch failed';
      }
    })
  );

  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  return res.status(Object.keys(errors).length ? 206 : 200).json({ stats, errors });
}

