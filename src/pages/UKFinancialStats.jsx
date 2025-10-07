// src/pages/UKFinancialStats.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Home, Landmark, Zap, ExternalLink } from 'lucide-react';
import Heading from '@/components/common/Heading';

// Formatters
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

function fmtValue(stat) {
  if (!stat) return null;
  const { value, unit } = stat;
  if (typeof value !== 'number' || Number.isNaN(value)) return null;
  if (unit === 'percent') return `${percentFormatter.format(value)}%`;
  if (unit === 'gbp') return currencyFormatter.format(value);
  return percentFormatter.format(value);
}
function fmtChange(change) {
  if (!change || typeof change.value !== 'number' || Number.isNaN(change.value)) return null;
  const { unit } = change;
  if (unit === 'percent') return `${percentFormatter.format(change.value)}%`;
  if (unit === 'percentagePoints') return `${percentFormatter.format(change.value)} pp`;
  if (unit === 'gbp' || unit === 'currency') return currencyFormatter.format(change.value);
  return percentFormatter.format(change.value);
}

// Cards config (link + description builder)
const STAT_CONFIG = [
  {
    id: 'bankRate',
    title: 'BoE Bank Rate',
    icon: Landmark,
    link: 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp',
    buildDescription: (stat) => {
      const d = stat?.period?.start ? new Date(stat.period.start) : null;
      return d && !Number.isNaN(d)
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
      return d && !Number.isNaN(d)
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
      return d && !Number.isNaN(d)
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
      const s = stat?.period?.label;
      return s ? `Cap for ${s}.` : 'Typical household annualised cap published quarterly by Ofgem.';
    },
  },
];

// Small fetchers for each stat
async function getBankRate() {
  const r = await fetch('/api/boe/bank-rate');
  if (!r.ok) throw new Error(`BoE ${r.status}`);
  const { stat } = await r.json();
  return stat;
}
async function getCpih() {
  const r = await fetch('/api/ons/cpih');
  if (!r.ok) throw new Error(`ONS CPIH ${r.status}`);
  const { stat } = await r.json();
  return stat;
}
async function getUkHpi() {
  const r = await fetch('/api/ukhpi/average-price');
  if (!r.ok) throw new Error(`UKHPI ${r.status}`);
  const { stat } = await r.json();
  return stat;
}
async function getOfgemCap() {
  const r = await fetch('/api/ofgem/price-cap');
  if (!r.ok) throw new Error(`Ofgem ${r.status}`);
  const { stat } = await r.json();
  return stat;
}

// Presentational card
const StatCard = ({ title, icon: Icon, link, status, stat, error }) => {
  const formattedValue = status === 'ready' ? fmtValue(stat) : null;
  const formattedChange = status === 'ready' ? fmtChange(stat?.change) : null;
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

export default function UKFinancialStats() {
  const [state, setState] = useState({
    bankRate: { status: 'loading', stat: null, error: null },
    cpih: { status: 'loading', stat: null, error: null },
    housePrice: { status: 'loading', stat: null, error: null },
    ofgemCap: { status: 'loading', stat: null, error: null },
  });

  useEffect(() => {
    let cancelled = false;

    async function run() {
      // Kick off in parallel
      const tasks = {
        bankRate: getBankRate(),
        cpih: getCpih(),
        housePrice: getUkHpi(),
        ofgemCap: getOfgemCap(),
      };

      for (const key of Object.keys(tasks)) {
        tasks[key]
          .then((stat) => {
            if (cancelled) return;
            setState((s) => ({
              ...s,
              [key]: {
                status: 'ready',
                stat: stat
                  ? {
                      ...stat,
                      description:
                        STAT_CONFIG.find((c) => c.id === key)?.buildDescription(stat) ||
                        stat?.period?.label,
                    }
                  : null,
                error: null,
              },
            }));
          })
          .catch((err) => {
            if (cancelled) return;
            setState((s) => ({
              ...s,
              [key]: { status: 'error', stat: null, error: err?.message || 'Fetch error' },
            }));
          });
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  // Derived banner: show warning if any stat is an error
  const anyError = useMemo(() => Object.values(state).some((x) => x.status === 'error'), [state]);

  const cards = useMemo(
    () =>
      STAT_CONFIG.map((cfg) => ({
        ...cfg,
        ...state[cfg.id],
      })),
    [state]
  );

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
        {anyError && (
          <div className="mb-6 text-sm text-amber-700 bg-amber-100 border border-amber-200 rounded-md p-3">
            One or more sources are temporarily unavailable. Showing what we could fetch.
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
