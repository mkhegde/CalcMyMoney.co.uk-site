/* eslint-env node */
/* eslint no-console: "off" */
/* global fetch */

const USER_AGENT = 'CalcMyMoney.co.uk/uk-financial-stats (+https://www.calcmymoney.co.uk)';

const BANK_OF_ENGLAND_URL = 'https://www.bankofengland.co.uk/boeapps/database/_iadb-download.aspx';
const ONS_CPIH_URL = 'https://api.beta.ons.gov.uk/v1/timeseries/L55O/dataset/mm23/data';
const LAND_REGISTRY_URL =
  'https://landregistry.data.gov.uk/app/ukhpi/download?format=json&geography=country&regionName=united-kingdom&propertyType=all-property-types';
const OFGEM_CAP_URL =
  'https://www.ofgem.gov.uk/energy-data-and-research/data-portal/price-cap-results?format=json';

function cleanCsvValue(value) {
  if (typeof value !== 'string') return value;
  return value.trim().replace(/^"|"$/g, '');
}

function tryParseDate(value) {
  if (!value) return null;
  const cleaned = value.replace(/"/g, '').trim();
  if (!cleaned) return null;

  const direct = new Date(cleaned);
  if (!Number.isNaN(direct.getTime())) {
    return direct.toISOString().slice(0, 10);
  }

  const monthYear = cleaned.match(/^(\d{4})[-\/]?\s*([A-Za-z]{3,})$/);
  if (monthYear) {
    const [, year, month] = monthYear;
    const date = new Date(`${month} 1 ${year}`);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  const dayMonthYear = cleaned.match(/^([0-9]{1,2})\s+([A-Za-z]{3,})\s+(\d{4})$/);
  if (dayMonthYear) {
    const [, day, month, year] = dayMonthYear;
    const date = new Date(`${month} ${day} ${year}`);
    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().slice(0, 10);
    }
  }

  return null;
}

function formatPeriodLabel(isoDate, fallback) {
  if (!isoDate) return fallback ?? null;
  try {
    return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(new Date(isoDate));
  } catch (err) {
    return fallback ?? null;
  }
}

export function parseBankRateCsv(csvText) {
  if (typeof csvText !== 'string') {
    throw new Error('bank_rate_not_csv');
  }

  const lines = csvText.split(/\r?\n/).map((line) => line.trim());
  const dataRows = [];

  for (const line of lines) {
    if (!line || /^[A-Za-z ]+:/.test(line)) continue;
    const parts = line
      .split(',')
      .map(cleanCsvValue)
      .filter((part) => part !== '');

    if (parts.length < 2) continue;

    const dateRaw = parts[0];
    const numericRaw = parts[parts.length - 1];
    const value = Number.parseFloat(numericRaw);

    if (Number.isFinite(value)) {
      dataRows.push({
        date: tryParseDate(dateRaw),
        label: dateRaw,
        value,
      });
    }
  }

  if (!dataRows.length) {
    throw new Error('bank_rate_no_rows');
  }

  const sorted = dataRows.sort((a, b) => {
    if (!a.date) return -1;
    if (!b.date) return 1;
    return a.date.localeCompare(b.date);
  });

  const latest = sorted[sorted.length - 1];
  const previous = sorted.length > 1 ? sorted[sorted.length - 2] : null;

  return {
    value: latest.value,
    period: {
      start: latest.date,
      label: formatPeriodLabel(latest.date, latest.label),
    },
    change: previous
      ? {
          value: +(latest.value - previous.value).toFixed(2),
          direction: latest.value > previous.value ? 'up' : latest.value < previous.value ? 'down' : 'flat',
          unit: 'percentagePoints',
          label: 'vs previous rate',
        }
      : null,
  };
}

export function parseOnsResponse(json) {
  if (!json || typeof json !== 'object') {
    throw new Error('cpih_not_json');
  }

  const observations = json.observations;
  if (!observations || typeof observations !== 'object') {
    throw new Error('cpih_no_observations');
  }

  const entries = Object.values(observations)
    .map((entry) => {
      if (!entry || typeof entry !== 'object') return null;
      const value = Number.parseFloat(entry.observation ?? entry.value ?? entry.measure ?? null);
      const timeLabel = entry?.metadata?.time ?? entry?.time ?? null;
      const date = tryParseDate(timeLabel);
      return value != null && Number.isFinite(value)
        ? {
            value,
            date,
            label: timeLabel ?? null,
          }
        : null;
    })
    .filter(Boolean);

  if (!entries.length) {
    throw new Error('cpih_no_entries');
  }

  const sorted = entries.sort((a, b) => {
    if (!a.date) return -1;
    if (!b.date) return 1;
    return a.date.localeCompare(b.date);
  });

  const latest = sorted[sorted.length - 1];
  const previousYear = sorted.findLast
    ? sorted.findLast((entry) => entry !== latest && entry.label === latest.label?.replace(/(\d{4})/, (y) => `${Number(y) - 1}`))
    : [...sorted]
        .reverse()
        .find((entry) => entry !== latest && entry.label === latest.label?.replace(/(\d{4})/, (y) => `${Number(y) - 1}`));

  const previous = previousYear ?? (sorted.length > 1 ? sorted[sorted.length - 2] : null);

  return {
    value: latest.value,
    period: {
      start: latest.date,
      label: formatPeriodLabel(latest.date, latest.label),
    },
    change: previous
      ? {
          value: +(latest.value - previous.value).toFixed(2),
          direction: latest.value > previous.value ? 'up' : latest.value < previous.value ? 'down' : 'flat',
          unit: 'percentagePoints',
          label: 'vs same month last year',
        }
      : null,
  };
}

export function parseHousePriceResponse(json) {
  if (!json || typeof json !== 'object') {
    throw new Error('hpi_not_json');
  }

  const series = Array.isArray(json) ? json : json?.result ?? json?.data ?? json?.items ?? null;
  if (!Array.isArray(series)) {
    throw new Error('hpi_no_series');
  }

  const entries = series
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const price = Number.parseFloat(item.averagePrice ?? item.average_price ?? item.value ?? null);
      if (!Number.isFinite(price)) return null;
      const change = Number.parseFloat(
        item.annualPercentageChange ?? item.annualChange ?? item.percentageAnnualChange ?? item.change ?? null,
      );
      const period = item.period ?? item.date ?? item.referencePeriod ?? null;
      const date = tryParseDate(period);
      return {
        value: price,
        change,
        period: date,
        label: period,
      };
    })
    .filter(Boolean);

  if (!entries.length) {
    throw new Error('hpi_no_entries');
  }

  const sorted = entries.sort((a, b) => {
    if (!a.period) return -1;
    if (!b.period) return 1;
    return a.period.localeCompare(b.period);
  });

  const latest = sorted[sorted.length - 1];

  return {
    value: latest.value,
    period: {
      start: latest.period,
      label: formatPeriodLabel(latest.period, latest.label),
    },
    change:
      latest.change != null && Number.isFinite(latest.change)
        ? {
            value: +latest.change.toFixed(2),
            direction: latest.change > 0 ? 'up' : latest.change < 0 ? 'down' : 'flat',
            unit: 'percent',
            label: 'annual change',
          }
        : null,
  };
}

export function parseOfgemResponse(payload) {
  if (!payload || (typeof payload !== 'object' && !Array.isArray(payload))) {
    throw new Error('ofgem_not_json');
  }

  const records = Array.isArray(payload)
    ? payload
    : payload?.result ?? payload?.data ?? payload?.items ?? payload?.records ?? null;

  if (!Array.isArray(records)) {
    throw new Error('ofgem_no_records');
  }

  const entries = records
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const cap = Number.parseFloat(item.cap ?? item.capLevel ?? item.cap_level ?? item.price_cap ?? item.value ?? null);
      if (!Number.isFinite(cap)) return null;
      const effectiveFrom = item.effectiveFrom ?? item.effective_from ?? item.valid_from ?? item.startDate ?? null;
      const effectiveTo = item.effectiveTo ?? item.effective_to ?? item.valid_to ?? item.endDate ?? null;
      const label = item.period ?? item.label ?? null;
      return {
        value: cap,
        effectiveFrom: tryParseDate(effectiveFrom),
        effectiveTo: tryParseDate(effectiveTo),
        label,
      };
    })
    .filter(Boolean);

  if (!entries.length) {
    throw new Error('ofgem_no_entries');
  }

  entries.sort((a, b) => {
    if (!a.effectiveFrom) return -1;
    if (!b.effectiveFrom) return 1;
    return a.effectiveFrom.localeCompare(b.effectiveFrom);
  });

  const latest = entries[entries.length - 1];

  return {
    value: latest.value,
    period: {
      start: latest.effectiveFrom,
      end: latest.effectiveTo,
      label: latest.label ?? formatPeriodLabel(latest.effectiveFrom, null),
    },
    change: null,
  };
}

async function fetchJson(url, params = {}) {
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'application/json,text/csv;q=0.9,*/*;q=0.8',
      ...params.headers,
    },
    ...params,
  });

  if (!res.ok) {
    const details = await res.text().catch(() => '');
    throw new Error(`http_${res.status}:${details.slice(0, 120)}`);
  }

  return res.json();
}

async function fetchText(url, params = {}) {
  const res = await fetch(url, {
    headers: {
      'user-agent': USER_AGENT,
      accept: 'text/csv,application/json;q=0.8,*/*;q=0.5',
      ...params.headers,
    },
    ...params,
  });

  if (!res.ok) {
    const details = await res.text().catch(() => '');
    throw new Error(`http_${res.status}:${details.slice(0, 120)}`);
  }

  return res.text();
}

export async function getUkFinancialStats() {
  const result = {
    generatedAt: new Date().toISOString(),
    stats: {},
    errors: {},
  };

  await Promise.allSettled([
    (async () => {
      try {
        const url = new URL(BANK_OF_ENGLAND_URL);
        url.searchParams.set('SeriesCodes', 'IUMABEDR');
        url.searchParams.set('CSVF', 'TN');
        url.searchParams.set('UsingCodes', 'Y');
        url.searchParams.set('VPD', 'Y');
        url.searchParams.set('VFD', 'N');
        const csv = await fetchText(url.toString());
        const parsed = parseBankRateCsv(csv);
        result.stats.bankRate = {
          ...parsed,
          title: 'BoE Bank Rate',
          unit: 'percent',
          source: {
            name: 'Bank of England',
            url: 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp',
          },
        };
      } catch (error) {
        result.errors.bankRate = error?.message ?? 'unknown_error';
      }
    })(),
    (async () => {
      try {
        const latestUrl = new URL(ONS_CPIH_URL);
        latestUrl.searchParams.set('time', 'latest');
        const latest = await fetchJson(latestUrl.toString());

        let combined = latest;
        try {
          const prevUrl = new URL(ONS_CPIH_URL);
          prevUrl.searchParams.set('time', 'latest-12');
          const prev = await fetchJson(prevUrl.toString());
          if (prev && prev.observations) {
            combined = {
              ...latest,
              observations: {
                ...latest.observations,
                ...prev.observations,
              },
            };
          }
        } catch (err) {
          // ignore secondary fetch failures
        }

        const parsed = parseOnsResponse(combined);
        result.stats.cpih = {
          ...parsed,
          title: 'Inflation (CPIH)',
          unit: 'percent',
          source: {
            name: 'Office for National Statistics',
            url: 'https://www.ons.gov.uk/economy/inflationandpriceindices',
          },
        };
      } catch (error) {
        result.errors.cpih = error?.message ?? 'unknown_error';
      }
    })(),
    (async () => {
      try {
        const payload = await fetchJson(LAND_REGISTRY_URL);
        const parsed = parseHousePriceResponse(payload);
        result.stats.housePrice = {
          ...parsed,
          title: 'Average UK House Price',
          unit: 'gbp',
          source: {
            name: 'HM Land Registry',
            url: 'https://landregistry.data.gov.uk/app/hpi/',
          },
        };
      } catch (error) {
        result.errors.housePrice = error?.message ?? 'unknown_error';
      }
    })(),
    (async () => {
      try {
        const payload = await fetchJson(OFGEM_CAP_URL);
        const parsed = parseOfgemResponse(payload);
        result.stats.ofgemCap = {
          ...parsed,
          title: 'Ofgem Energy Price Cap',
          unit: 'gbp',
          source: {
            name: 'Ofgem',
            url: 'https://www.ofgem.gov.uk/energy-price-cap',
          },
        };
      } catch (error) {
        result.errors.ofgemCap = error?.message ?? 'unknown_error';
      }
    })(),
  ]);

  return result;
}

export default async function handler(req, res) {
  try {
    const payload = await getUkFinancialStats();
    const hasData = Object.keys(payload.stats).length > 0;
    const hasErrors = Object.keys(payload.errors).length > 0;

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200');

    return res.status(hasData ? 200 : 502).json({
      ...payload,
      status: hasData ? 'ok' : 'error',
      partial: hasData && hasErrors,
    });
  } catch (error) {
    console.error('uk-financial-stats handler error', error);
    res.setHeader('Cache-Control', 's-maxage=600');
    return res.status(500).json({ error: 'uk_financial_stats_failed' });
  }
}
