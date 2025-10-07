/* eslint-env node */
// /api/ons/cpih.js
// Latest CPIH 12-month rate (ONS). No API key required.

export const config = { runtime: 'nodejs20.x' };

// Candidate endpoints. We’ll try these in order.
const CANDIDATES = [
  // ONS Timeseries API (preferred)
  'https://api.ons.gov.uk/timeseries/L55O/dataset/cpih01/editions/time-series/observations?time=latest',
  // Legacy JSON on the public page (often works too)
  'https://www.ons.gov.uk/economy/inflationandpriceindices/timeseries/L55O/mm23/data',
];

function parseOnsJson(json) {
  // Shape 1: { observations: [{ observation: "3.2", dimensions: { time: { id, label }}}] }
  if (json && Array.isArray(json.observations) && json.observations.length) {
    const ob = json.observations[0];
    const val = Number(ob?.observation);
    const label = ob?.dimensions?.time?.label || ob?.dimensions?.time?.id || 'latest';
    const start =
      label && /\b([A-Z]{3,}|[A-Za-z]+)\s+\d{4}\b/.test(label)
        ? new Date(`${label} 01`).toISOString()
        : null;

    if (Number.isFinite(val)) {
      return {
        id: 'cpih',
        title: 'Inflation (CPIH)',
        unit: 'percent',
        value: val,
        period: { label, start },
        change: null,
      };
    }
  }

  // Shape 2 (legacy page JSON): look for deepest array with last value
  // e.g., { months: [{ date: "2025 AUG", value: "2.2" }, ...] }
  const arr =
    json?.months || json?.years || json?.quarters || json?.observations || json?.data || null;
  if (Array.isArray(arr) && arr.length) {
    const last = arr[arr.length - 1];
    const rawVal = last.value ?? last.observation ?? last?.v ?? last?.y;
    const val = Number(typeof rawVal === 'string' ? rawVal.replace(/[^\d.-]/g, '') : rawVal);
    const label = last.date || last.period || last.time || 'latest';
    const start =
      label && /\b([A-Z]{3,}|[A-Za-z]+)\s+\d{4}\b/.test(label)
        ? new Date(`${label} 01`).toISOString()
        : null;

    if (Number.isFinite(val)) {
      return {
        id: 'cpih',
        title: 'Inflation (CPIH)',
        unit: 'percent',
        value: val,
        period: { label, start },
        change: null,
      };
    }
  }

  return null;
}

export default async function handler(req, res) {
  try {
    let parsed = null;
    for (const url of CANDIDATES) {
      const r = await fetch(url, {
        headers: {
          'user-agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
          accept: 'application/json, text/json, */*',
        },
      });
      if (!r.ok) continue;
      const json = await r.json().catch(() => null);
      if (!json) continue;
      parsed = parseOnsJson(json);
      if (parsed) break;
    }

    if (!parsed) throw new Error('Could not parse CPIH from ONS');

    res.setHeader('Cache-Control', 's-maxage=14400, stale-while-revalidate=86400');
    return res.status(200).json({ stat: parsed });
  } catch (e) {
    return res.status(502).json({ error: `CPIH fetch failed: ${e.message}` });
  }
}
