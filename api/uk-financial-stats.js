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

export function parseBankRateCsv(csvText) {
  const rows = csvText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('Series Name'));

  if (rows.length === 0) {
    return { value: null, period: { start: null }, change: null };
  }

  const parseRow = (row) => {
    const [datePart, valuePart] = row.split(',');
    const value = Number.parseFloat(valuePart);
    if (!Number.isFinite(value)) {
      return null;
    }
    const start = datePart ? new Date(datePart.trim()).toISOString().slice(0, 10) : null;
    return { value: Number(value.toFixed(2)), start };
  };

  const latest = parseRow(rows[rows.length - 1]);
  const previous = parseRow(rows[rows.length - 2] ?? '');

  const changeValue =
    latest && previous && Number.isFinite(previous.value)
      ? Number((latest.value - previous.value).toFixed(2))
      : null;

  return {
    value: latest?.value ?? null,
    period: { start: latest?.start ?? null },
    change:
      changeValue === null
        ? null
        : {
            value: changeValue,
            direction: changeValue === 0 ? 'flat' : changeValue > 0 ? 'up' : 'down',
          },
  };
}

export function parseOnsResponse(payload) {
  const points = payload?.observations ? Object.values(payload.observations) : [];
  if (points.length === 0) {
    return { value: null, period: { label: null }, change: null };
  }

  const parsePoint = (entry) => {
    if (!entry || entry.observation == null) return null;
    const value = Number.parseFloat(entry.observation);
    if (!Number.isFinite(value)) return null;
    const rawLabel = entry.metadata?.time || null;
    let label = rawLabel;
    let start = null;

    const matchMonthFirst = rawLabel?.match(/([A-Z]{3,}|[A-Za-z]+)\s+(\d{4})/);
    const matchYearFirst = rawLabel?.match(/(\d{4})\s+([A-Z]{3,}|[A-Za-z]+)/);

    if (matchMonthFirst) {
      const monthName = matchMonthFirst[1];
      const year = matchMonthFirst[2];
      label = `${monthName[0]}${monthName.slice(1).toLowerCase()} ${year}`;
      start = new Date(`${monthName} ${year} 01`).toISOString().slice(0, 10);
    } else if (matchYearFirst) {
      const year = matchYearFirst[1];
      const monthName = matchYearFirst[2];
      label = `${monthName[0]}${monthName.slice(1).toLowerCase()} ${year}`;
      start = new Date(`${monthName} ${year} 01`).toISOString().slice(0, 10);
    }

    return { value: Number(value.toFixed(1)), label, start };
  };

  const latest = parsePoint(points[0]);
  const previous = parsePoint(points[1]);

  const changeValue =
    latest && previous
      ? Number((latest.value - previous.value).toFixed(1))
      : null;

  return {
    value: latest?.value ?? null,
    period: { label: latest?.label ?? null, start: latest?.start ?? null },
    change:
      changeValue === null
        ? null
        : {
            value: changeValue,
            direction: changeValue === 0 ? 'flat' : changeValue > 0 ? 'up' : 'down',
          },
  };
}

export function parseHousePriceResponse(payload) {
  const items = Array.isArray(payload?.data) ? payload.data : [];
  if (!items.length) {
    return { value: null, period: { label: null }, change: null };
  }

  const last = items[items.length - 1];
  const value = Number.parseFloat(last.averagePrice);
  const labelRaw = last.date || '';
  const [year, month] = labelRaw.split('-');
  const date = year && month ? new Date(`${labelRaw}-01T00:00:00Z`) : null;
  const label = date
    ? date.toLocaleString('en-GB', { month: 'long', year: 'numeric' })
    : labelRaw || null;

  const changeValue = Number.parseFloat(last.percentageAnnualChange);

  return {
    value: Number.isFinite(value) ? Number(value.toFixed(0)) : null,
    period: {
      label,
      start: date ? date.toISOString().slice(0, 10) : null,
    },
    change:
      Number.isFinite(changeValue)
        ? {
            value: Number(changeValue.toFixed(1)),
            direction: changeValue === 0 ? 'flat' : changeValue > 0 ? 'up' : 'down',
          }
        : null,
  };
}

export function parseOfgemResponse(payload) {
  const items = Array.isArray(payload) ? payload : [];
  if (!items.length) {
    return { value: null, period: { start: null, end: null } };
  }

  const latest = items[items.length - 1];
  const value = Number.parseFloat(latest.capLevel);

  return {
    value: Number.isFinite(value) ? Number(value.toFixed(0)) : null,
    period: {
      start: latest.effectiveFrom ?? null,
      end: latest.effectiveTo ?? null,
    },
    change: null,
  };
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


