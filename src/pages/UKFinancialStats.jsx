import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Home, Landmark, Zap, ExternalLink } from 'lucide-react';
import Heading from '@/components/common/Heading';

/* ---------------------------
   Formatters
---------------------------- */
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

/* ---------------------------
   Config for cards
---------------------------- */
const STAT_CONFIG = [
  {
    id: 'bankRate',
    title: 'BoE Bank Rate',
    icon: Landmark,
    link: 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp',
    buildDescription: (stat) => {
      if (stat?.period?.start) {
        const date = new Date(stat.period.start);
        if (!Number.isNaN(date.getTime())) {
          return `Official Bank Rate as at ${monthFormatter.format(date)}.`;
        }
      }
      return 'Official rate set by the Bank of England.';
    },
  },
  {
    id: 'cpih',
    title: 'Inflation (CPIH)',
    icon: Percent,
    link: 'https://www.ons.gov.uk/economy/inflationandpriceindices',
    buildDescription: (stat) => {
      if (stat?.period?.start) {
        const date = new Date(stat.period.start);
        if (!Number.isNaN(date.getTime())) {
          return `12-month CPIH rate for ${monthFormatter.format(date)}.`;
        }
      }
      return '12-month growth rate published by the ONS.';
    },
  },
  {
    id: 'housePrice',
    title: 'Average UK House Price',
    icon: Home,
    link: 'https://landregistry.data.gov.uk/app/hpi/',
    buildDescription: (stat) => {
      if (stat?.period?.start) {
        const date = new Date(stat.period.start);
        if (!Number.isNaN(date.getTime())) {
          return `UK HPI average for ${monthFormatter.format(date)}.`;
        }
      }
      return 'UK House Price Index nationwide average.';
    },
  },
  {
    id: 'ofgemCap',
    title: 'Ofgem Energy Price Cap',
    icon: Zap,
    link: 'https://www.ofgem.gov.uk/energy-price-cap',
    buildDescription: (stat) => {
      if (stat?.period?.start) {
        const start = new Date(stat.period.start);
        const end = stat?.period?.end ? new Date(stat.period.end) : null;
        if (!Number.isNaN(start.getTime())) {
          const startLabel = monthFormatter.format(start);
          if (end && !Number.isNaN(end.getTime())) {
            const endLabel = monthFormatter.format(end);
            return `Cap for ${startLabel} – ${endLabel}.`;
          }
          return `Cap effective from ${startLabel}.`;
        }
      }
      return 'Typical household annualised cap published quarterly by Ofgem.';
    },
  },
];

/* ---------------------------
   Helpers
---------------------------- */
function formatValue(stat) {
  if (!stat) return null;
  const { value, unit } = stat;
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (unit === 'percent') return `${percentFormatter.format(value)}%`;
  if (unit === 'gbp') return currencyFormatter.format(value);
  return percentFormatter.format(value);
}

function formatChange(change) {
  if (!change || typeof change.value !== 'number' || Number.isNaN(change.value)) return null;
  const { unit } = change;
  if (unit === 'percent') return `${percentFormatter.format(change.value)}%`;
  if (unit === 'percentagePoints') return `${percentFormatter.format(change.value)} pp`;
  if (unit === 'gbp' || unit === 'currency') return currencyFormatter.format(change.value);
  return percentFormatter.format(change.value);
}

/* ---------------------------
   Bank Rate (dedicated hook)
---------------------------- */
const BANKRATE_CACHE_KEY = 'boe:bankrate:v1';
const BANKRATE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function useBankRate() {
  const [stat, setStat] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error' | 'empty'
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fromCache = () => {
      try {
        const raw = localStorage.getItem(BANKRATE_CACHE_KEY);
        if (!raw) return null;
        const { ts, data } = JSON.parse(raw);
        if (!ts || !data) return null;
        if (Date.now() - ts > BANKRATE_TTL_MS) return null;
        if (typeof data?.rate !== 'number') return null;

        return {
          value: data.rate,
          unit: 'percent',
          period: { start: data.fetchedAt || new Date().toISOString() },
          change: null,
        };
      } catch {
        return null;
      }
    };

    const cached = fromCache();
    if (cached) {
      setStat(cached);
      setStatus('ready');
      return;
    }

    const load = async () => {
      setStatus('loading');
      setError(null);
      try {
        const resp = await fetch('/api/boe/bank-rate', { headers: { accept: 'application/json' } });
        const json = await resp.json();

        if (!resp.ok || typeof json?.rate !== 'number') {
          throw new Error(json?.error || `HTTP ${resp.status}`);
        }

        const mapped = {
          value: json.rate,
          unit: 'percent',
          period: { start: json.fetchedAt || new Date().toISOString() },
          change: null,
        };

        if (!cancelled) {
          setStat(mapped);
          setStatus('ready');
          try {
            localStorage.setItem(
              BANKRATE_CACHE_KEY,
              JSON.stringify({ ts: Date.now(), data: json })
            );
          } catch {}
        }
      } catch (e) {
        if (!cancelled) {
          setError('Bank Rate not available');
          setStatus('error');
          setStat(null);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { stat, status, error };
}

/* ---------------------------
   Card component
---------------------------- */
const StatCard = ({ title, icon: Icon, link, status, stat, error }) => {
  const formattedValue = status === 'ready' ? formatValue(stat) : null;
  const formattedChange = status === 'ready' ? formatChange(stat?.change) : null;
  const trend = stat?.change?.direction;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const trendColor =
    trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';

  let description = '';
  if (status === 'ready') {
    description = stat?.description ?? stat?.period?.label ?? '';
  } else if (status === 'loading') {
    description = 'Fetching latest figures…';
  } else if (status === 'error') {
    description = error ?? 'Unable to load data right now.';
  } else {
    description = 'No data available right now.';
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="w-5 h-5 text-gray-500" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center">
        <div className="text-3xl font-bold">
          {status === 'ready' && formattedValue}
          {status === 'loading' && <span className="text-gray-400">Loading…</span>}
          {status === 'error' && <span className="text-gray-400">—</span>}
          {status === 'empty' && <span className="text-gray-400">—</span>}
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

/* ---------------------------
   Page
---------------------------- */
export default function UKFinancialStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dedicated Bank Rate hook (independent of the aggregate API)
  const { stat: bankRateStat, status: bankRateStatus, error: bankRateError } = useBankRate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/uk-financial-stats', {
          headers: { accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
        const data = await response.json();
        if (!cancelled) setStats(data?.stats ?? null);
        if (data?.errors && Object.keys(data.errors).length && !cancelled) {
          setError('Some data sources are temporarily unavailable.');
        }
      } catch (err) {
        if (!cancelled) {
          setError('Unable to fetch the latest data.');
          setStats(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cards = useMemo(() => {
    return STAT_CONFIG.map((config) => {
      // Use the dedicated Bank Rate feed if this card is bankRate
      const isBankRate = config.id === 'bankRate';

      // Pull stat from aggregate API for others
      const aggregateStat = stats?.[config.id] || null;

      // Decide the stat/status for this card
      let statForCard = aggregateStat;
      let statusForCard = 'empty';
      let errorForCard = error;

      if (isBankRate) {
        statForCard = bankRateStat;
        statusForCard = bankRateStatus; // 'loading' | 'ready' | 'error' | 'empty'
        errorForCard = bankRateError || error;
      } else {
        if (loading) statusForCard = 'loading';
        else if (error && !aggregateStat) statusForCard = 'error';
        else if (aggregateStat) statusForCard = 'ready';
      }

      return {
        ...config,
        stat: statForCard
          ? {
              ...statForCard,
              description: config.buildDescription(statForCard),
            }
          : null,
        status: statusForCard,
        error: errorForCard,
      };
    });
  }, [stats, loading, error, bankRateStat, bankRateStatus, bankRateError]);

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
        {!loading && error && (
          <div className="mb-6 text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded-md p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <StatCard
              key={card.id}
              title={card.title}
              icon={card.icon}
              link={card.link}
              status={card.status}
              stat={card.stat}
              error={card.error}
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
