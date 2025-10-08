import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Home, Landmark, Zap, ExternalLink } from 'lucide-react';
import Heading from '@/components/common/Heading';

/* --------------------------- formatters --------------------------- */
const percentFormatter = new Intl.NumberFormat('en-GB', {
  style: 'decimal',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const currencyFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
const monthFormatter = new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' });

/* --------------------------- config --------------------------- */
const STAT_CONFIG = [
  {
    id: 'bankRate',
    title: 'BoE Bank Rate',
    icon: Landmark,
    link: 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp',
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d.getTime())
        ? `Official Bank Rate as at ${monthFormatter.format(d)}.`
        : 'Official rate set by the Bank of England.';
    },
  },
  {
    id: 'cpih',
    title: 'Inflation (CPIH)',
    icon: Percent,
    link: 'https://www.ons.gov.uk/economy/inflationandpriceindices',
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d.getTime())
        ? `12-month CPIH rate for ${monthFormatter.format(d)}.`
        : '12-month growth rate published by the ONS.';
    },
  },
  {
    id: 'housePrice',
    title: 'Average UK House Price',
    icon: Home,
    link: 'https://landregistry.data.gov.uk/app/hpi/',
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d.getTime())
        ? `UK HPI average for ${monthFormatter.format(d)}.`
        : 'UK House Price Index nationwide average.';
    },
  },
  {
    id: 'ofgemCap',
    title: 'Ofgem Energy Price Cap',
    icon: Zap,
    link: 'https://www.ofgem.gov.uk/energy-price-cap',
    buildDescription: (stat) => {
      const s = stat?.period?.start ? new Date(stat.period.start) : null;
      const e = stat?.period?.end ? new Date(stat.period.end) : null;
      if (s && !Number.isNaN(s.getTime())) {
        const sL = monthFormatter.format(s);
        if (e && !Number.isNaN(e.getTime())) return `Cap for ${sL} - ${monthFormatter.format(e)}.`;
        return `Cap effective from ${sL}.`;
      }
      return 'Typical household annualised cap published quarterly by Ofgem.';
    },
  },
];

/* --------------------------- helpers --------------------------- */
const isNum = (n) => typeof n === 'number' && Number.isFinite(n);

// Replace any HTML-encoded pound with a literal £ before parsing
function normalisePounds(s) {
  return String(s).replace(/&pound;|&#163;/gi, '£');
}

function coerceNumber(val) {
  if (typeof val === 'number') return Number.isFinite(val) ? val : NaN;
  if (typeof val === 'string') {
    const s = normalisePounds(val);
    const num = parseFloat(s.replace(/[£,%\s,]/g, ''));
    return Number.isFinite(num) ? num : NaN;
  }
  return NaN;
}

function normalizeUnit(u) {
  if (!u) return undefined;
  const s = String(u).toLowerCase();
  if (s === 'percent' || s === 'percentage' || s === '%') return 'percent';
  if (s === 'percentagepoints' || s === 'percentage_points' || s === 'pp')
    return 'percentagePoints';
  if (s.includes('gbp') || s === 'currency' || s.includes('£')) return 'gbp';
  return s;
}

// Normalise shapes coming from any of our endpoints.
function normalizeStat(raw) {
  if (!raw || typeof raw !== 'object') return null;

  let value =
    raw.value ??
    raw.amount ??
    raw.cap ??
    (raw.data && raw.data.value) ??
    (raw.metrics && raw.metrics.value);

  const numericValue = coerceNumber(value);
  if (!Number.isFinite(numericValue)) return null;

  let unit =
    raw.unit ??
    raw.units ??
    (raw.currency ? 'gbp' : undefined) ??
    (raw.percentage ? 'percent' : undefined);

  unit = normalizeUnit(unit);

  const period = raw.period ?? raw.dateRange ?? raw.dates ?? null;

  let change = raw.change ?? raw.delta ?? null;
  if (change && typeof change === 'object') {
    const cv = coerceNumber(change.value);
    change = Number.isFinite(cv)
      ? { ...change, value: cv, unit: normalizeUnit(change.unit) }
      : null;
  }

  const source = raw.source ?? null;
  return {
    value: numericValue,
    unit,
    period,
    change,
    source,
    label: raw.label ?? raw?.period?.label,
  };
}

function formatValue(stat) {
  if (!stat) return null;
  const { value, unit } = stat;
  if (!isNum(value)) return null;
  if (unit === 'percent') return `${percentFormatter.format(value)}%`;
  if (unit === 'gbp') return currencyFormatter.format(value);
  return percentFormatter.format(value);
}
function formatChange(change) {
  if (!change || !isNum(change.value)) return null;
  const u = change.unit;
  if (u === 'percent') return `${percentFormatter.format(change.value)}%`;
  if (u === 'percentagePoints') return `${percentFormatter.format(change.value)} pp`;
  if (u === 'gbp') return currencyFormatter.format(change.value);
  return percentFormatter.format(change.value);
}

async function fetchJSON(url) {
  const res = await fetch(url, { headers: { accept: 'application/json' }, cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

/* --------------------------- card --------------------------- */
const StatCard = ({ title, icon: Icon, link, status, stat, error }) => {
  const formattedValue = status === 'ready' ? formatValue(stat) : null;
  const formattedChange = status === 'ready' ? formatChange(stat?.change) : null;
  const trend = stat?.change?.direction;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const trendColor =
    trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';

  let description = '';
  if (status === 'ready')
    description = stat?.description ?? stat?.label ?? stat?.period?.label ?? '';
  else if (status === 'loading') description = 'Fetching latest figures.';
  else if (status === 'error') description = error ?? 'Unable to load data right now.';
  else description = 'No data available right now.';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="w-5 h-5 text-gray-500" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div className="text-3xl font-bold">
          {status === 'ready' && formattedValue}
          {status !== 'ready' && <span className="text-gray-400">-</span>}
        </div>
        {status === 'ready' && formattedChange && (
          <div className="text-sm text-gray-600 flex items-center gap-1">
            {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
            <span className={trendColor}>{formattedChange}</span>
            <span>{stat?.change?.label ?? 'vs previous period'}</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">{description}</p>
      </CardContent>
      {link && (
        <div className="p-4 pt-0 text-xs">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            Source <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </Card>
  );
};

/* --------------------------- page --------------------------- */
export default function UKFinancialStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorBanner, setErrorBanner] = useState(null);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    setDebug(new URLSearchParams(window.location.search).get('debug') === '1');
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErrorBanner(null);

      const endpoints = {
        bankRate: '/api/boe/bank-rate',
        cpih: '/api/ons/cpih',
        housePrice: '/api/ukhpi/average-price',
        ofgemCap: '/api/ofgem/price-cap',
      };

      const results = {};
      const errors = {};

      await Promise.all(
        Object.entries(endpoints).map(async ([key, url]) => {
          try {
            const raw = await fetchJSON(url);
            const norm = normalizeStat(raw);
            if (norm) results[key] = norm;
            else errors[key] = 'Invalid data shape';
          } catch (e) {
            errors[key] = e.message || 'Fetch failed';
          }
        })
      );

      if (!cancelled) {
        setStats(results);
        setErrorBanner(
          Object.values(errors).some(Boolean)
            ? 'One or more sources are temporarily unavailable. Showing what we could fetch.'
            : null
        );
        // expose for quick inspection
        if (debug) {
          // eslint-disable-next-line no-console
          console.table(
            Object.entries(results).map(([k, v]) => ({
              id: k,
              value: v?.value,
              unit: v?.unit,
              period: v?.period?.label || v?.period?.start || '',
            }))
          );
          // @ts-ignore
          window.__ukStats = { results, errors };
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [debug]);

  const cards = useMemo(() => {
    return STAT_CONFIG.map((cfg) => {
      const stat = stats?.[cfg.id];
      const ready = !!(stat && isNum(stat.value));
      const status = loading ? 'loading' : ready ? 'ready' : stats ? 'empty' : 'loading';
      return {
        ...cfg,
        stat: stat ? { ...stat, description: cfg.buildDescription(stat) } : null,
        status,
      };
    });
  }, [stats, loading]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Heading
              as="h1"
              size="h1"
              weight="bold"
              className="text-gray-900 dark:text-gray-100 mb-4"
            >
              UK Financial Statistics Dashboard
            </Heading>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Track key UK economic indicators. Data is sourced directly from official channels like
              the Bank of England and the Office for National Statistics.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!loading && errorBanner && (
          <div className="mb-6 text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded-md p-3">
            {errorBanner}
          </div>
        )}

        {debug && (
          <div className="mb-6 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-3">
            Debug on. Open console for table. `window.__ukStats` has raw data.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((c) => (
            <StatCard
              key={c.id}
              title={c.title}
              icon={c.icon}
              link={c.link}
              status={c.status}
              stat={c.stat}
              error={errorBanner}
            />
          ))}
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Disclaimer: Data shown here is for informational purposes only. Please consult the
            official sources linked in each card for the most current and accurate figures before
            making any financial decisions.
          </p>
        </div>
      </div>
    </div>
  );
}

