// /api/ons/cpih.js
// Source of truth: ONS CMD (beta) API. Falls back to time-series page scrape if needed.

export const config = { runtime: 'edge' };

const ONS_LATEST =
  'https://api.beta.ons.gov.uk/v1/datasets/cpih01/editions/time-series/versions/8/observations?geography=K02000001&aggregate=cpih1dim1G100000&time=latest';

// Fallback: CPIH 12-month rate time-series page (L55O)
const ONS_CPIH_PAGE =
  'https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/l55o/mm23';

async function fetchFromOnsJson() {
  const r = await fetch(ONS_LATEST, { headers: { accept: 'application/json' } });
  if (!r.ok) throw new Error(`ONS latest API ${r.status}`);
  const json = await r.json();

  // ONS observations payload: first observation is latest
  const obs = json?.observations?.[0];
  if (!obs) throw new Error('ONS observations missing');

  const value = Number(obs?.observation);
  if (!Number.isFinite(value)) throw new Error('ONS value not numeric');

  // Month label like "2025 AUG"
  const t = obs?.dimensions?.time?.label || obs?.dimensions?.time?.id;
  const monthLabel = t || 'latest';
  const periodStart = t ? new Date(`${t} 01`) : null;

  return {
    id: 'cpih',
    title: 'Inflation (CPIH)',
    unit: 'percent',
    value,
    period: {
      label: monthLabel,
      start: periodStart ? periodStart.toISOString() : null,
    },
    change: null,
  };
}

async function fallbackScrape() {
  const r = await fetch(ONS_CPIH_PAGE, { headers: { 'user-agent': 'Mozilla/5.0' } });
  if (!r.ok) throw new Error(`ONS page ${r.status}`);
  const html = await r.text();

  // Look for "... Latest figure ... 4.2%" or similar
  const re = /(\d+(?:\.\d)?)\s?%/;
  const m = html.match(re);
  if (!m) throw new Error('Could not parse CPIH % from ONS page');

  const value = Number(m[1]);
  return {
    id: 'cpih',
    title: 'Inflation (CPIH)',
    unit: 'percent',
    value,
    period: { label: 'latest', start: null },
    change: null,
    _note: 'Fallback parsed from ONS page',
  };
}

export default async function handler() {
  try {
    const stat = await fetchFromOnsJson();
    return new Response(JSON.stringify({ stat }), {
      headers: { 'content-type': 'application/json', 'cache-control': 's-maxage=43200, stale-while-revalidate=86400' }, // 12h
    });
  } catch (e) {
    try {
      const stat = await fallbackScrape();
      return new Response(JSON.stringify({ stat, warning: e.message }), {
        headers: { 'content-type': 'application/json', 'cache-control': 's-maxage=43200, stale-while-revalidate=86400' },
      });
    } catch (e2) {
      return new Response(JSON.stringify({ error: `CPIH fetch failed: ${e.message}; ${e2.message}` }), {
        status: 502,
        headers: { 'content-type': 'application/json' },
      });
    }
  }
}
