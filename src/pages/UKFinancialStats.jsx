import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Percent, Home, Landmark, Zap, ExternalLink } from 'lucide-react';
import Heading from '@/components/common/Heading';
import FAQSection from '@/components/calculators/FAQSection';
import { JsonLd } from '@/components/seo/JsonLd';
import buildFaqJsonLd from '@/components/seo/buildFaqJsonLd';
import RelatedCalculators from '@/components/calculators/RelatedCalculators';
import SeoHead from '@/components/seo/SeoHead';
import buildDatasetsJsonLd from '@/components/seo/buildDatasetsJsonLd';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';

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

// Pound-safe helpers used for parsing and unit detection
function normalisePoundsSafe(s) {
  return String(s).replace(/&pound;|&#163;/gi, '£');
}

function sanitizeNumber(val) {
  if (typeof val === 'number') return Number.isFinite(val) ? val : NaN;
  if (typeof val === 'string') {
    const s = normalisePoundsSafe(val);
    const num = parseFloat(s.replace(/[£,%\s,]/g, ''));
    return Number.isFinite(num) ? num : NaN;
  }
  return NaN;
}

function normalizeUnitSafe(u) {
  if (!u) return undefined;
  const s = String(u).toLowerCase();
  if (s === 'percent' || s === 'percentage' || s === '%') return 'percent';
  if (s === 'percentagepoints' || s === 'percentage_points' || s === 'pp') return 'percentagePoints';
  if (s.includes('gbp') || s === 'currency' || s.includes('£')) return 'gbp';
  return s;
}

// Format an ISO date as Month YYYY (en-GB)
function formatMonthYearISO(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(d);
}

/* --------------------------- config --------------------------- */
const STAT_CONFIG = [
  {
    id: 'bankRate',
    title: 'BoE Bank Rate',
    icon: Landmark,
    link: 'https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp',
    endpoint: '/api/boe/bank-rate',
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
    endpoint: '/api/ons/cpih',
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
    endpoint: '/api/ukhpi/average-price',
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
    endpoint: '/api/ofgem/price-cap',
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

// FAQs for this page (concise)
const statsFaqs = [
  {
    question: 'How often are these figures updated?',
    answer:
      "We check sources daily and cache results for a few hours. Bank Rate is updated after MPC decisions; CPIH is monthly; UK HPI is monthly; Ofgem price cap is typically quarterly. Exact refresh depends on each publisher’s release schedule.",
  },
  {
    question: 'What is CPIH and how is it different from CPI?',
    answer:
      "CPIH is CPI including owner occupiers’ housing costs (OOH). It’s ONS’s preferred headline measure for consumer price inflation in the UK.",
  },
  {
    question: 'Does the Ofgem price cap limit my total bill?',
    answer:
      'No. The cap limits unit rates and standing charges for a “typical” dual-fuel household. Your bill depends on actual usage and tariff type.',
  },
  {
    question: 'Why might my mortgage costs track Bank Rate?',
    answer:
      "Tracker and variable-rate mortgages often move with Bank Rate; fixes do not change until the fixed term ends. Always check your product’s terms.",
  },
  {
    question: 'Where do these numbers come from?',
    answer:
      'Bank of England (Bank Rate), Office for National Statistics (CPIH), UK HPI (HM Land Registry & ONS), and Ofgem (energy price cap). We fetch directly from official pages or APIs.',
  },
  {
    question: 'Can I access the raw JSON used on this page?',
    answer:
      'Yes: /api/boe/bank-rate, /api/ons/cpih, /api/ukhpi/average-price, and /api/ofgem/price-cap. Endpoints return a simple, consistent shape for reuse.',
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

  const numericValue = sanitizeNumber(value);
  if (!Number.isFinite(numericValue)) return null;

  let unit =
    raw.unit ??
    raw.units ??
    (raw.currency ? 'gbp' : undefined) ??
    (raw.percentage ? 'percent' : undefined);

  unit = normalizeUnitSafe(unit);

  const period = raw.period ?? raw.dateRange ?? raw.dates ?? null;

  let change = raw.change ?? raw.delta ?? null;
  if (change && typeof change === 'object') {
    const cv = sanitizeNumber(change.value);
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
const StatCard = ({ title, icon: Icon, link, dataEndpoint, status, stat, error }) => {
  const formattedValue = status === 'ready' ? formatValue(stat) : null;
  const formattedChange = status === 'ready' ? formatChange(stat?.change) : null;
  const trend = stat?.change?.direction;
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : null;
  const trendColor =
    trend === 'up' ? 'text-red-600' : trend === 'down' ? 'text-green-600' : 'text-gray-600';

  const updatedISO = stat?.period?.start || null;
  const updatedLabel = updatedISO ? formatMonthYearISO(updatedISO) : (stat?.period?.label || null);

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
    <Card className="h-full flex flex-col" aria-busy={status === 'loading'}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <Icon className="w-5 h-5 text-gray-500" role="img" aria-label={title} />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center min-h-[132px]">
        <div className="text-3xl font-bold" aria-live="polite">
          {status === 'ready' && formattedValue}
          {status === 'loading' && (
            <span className="inline-block h-7 w-24 rounded bg-gray-100 animate-pulse" />
          )}
          {(status === 'error' || status === 'empty') && <span className="text-gray-400">-</span>}
        </div>
        {status === 'ready' && formattedChange && (
          <div className="text-sm text-gray-600 flex items-center gap-1">
            {TrendIcon && <TrendIcon className={`w-4 h-4 ${trendColor}`} />}
            <span className={trendColor}>{formattedChange}</span>
            <span>{stat?.change?.label ?? 'vs previous period'}</span>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">{description}</p>

        {/* Last updated line */}
        {status === 'ready' && (updatedISO || updatedLabel) && (
          <p className="text-[11px] text-gray-400 mt-2">
            Last updated:{' '}
            {updatedISO ? (
              <time dateTime={updatedISO}>
                {updatedLabel || formatMonthYearISO(updatedISO) || updatedISO}
              </time>
            ) : (
              updatedLabel
            )}
          </p>
        )}
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
          {dataEndpoint && (
            <div className="mt-1 text-xs">
              <a
                href={dataEndpoint}
                className="text-gray-500 hover:underline"
                aria-label={`Download ${title} as JSON`}
              >
                JSON
              </a>
            </div>
          )}
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

  // Build FAQ JSON-LD for SEO
  const faqJsonLd = useMemo(() => buildFaqJsonLd(statsFaqs), []);

  // Dataset JSON-LD context
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.calcmymoney.co.uk';
  const canonical = `${origin}/uk-financial-stats`;
  const datasetsJsonLd = useMemo(() => {
    return buildDatasetsJsonLd({ origin, canonical, stats });
  }, [origin, canonical, stats]);

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

  const lastUpdated = useMemo(() => {
    if (!stats) return null;
    const pick = (s) => s?.period?.end || s?.period?.start || null;
    const toDate = (v) => {
      if (!v) return null;
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? null : d;
    };
    const times = Object.values(stats)
      .map(pick)
      .map(toDate)
      .filter(Boolean)
      .map((d) => d.getTime());
    if (!times.length) return null;
    return new Date(Math.max(...times));
  }, [stats]);

  return (
    <div className="bg-white dark:bg-gray-900">
      <SeoHead
        title="UK Financial Statistics (Live) | CalcMyMoney"
        desc="Live UK Bank Rate, CPIH inflation, UK average house price and Ofgem energy price cap-pulled directly from official sources."
        canonical={canonical}
      />
      {datasetsJsonLd && datasetsJsonLd.length > 0 && <JsonLd data={datasetsJsonLd} />}
      <JsonLd data={faqJsonLd} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: 'UK Financial Statistics — Methodology',
          description:
            'How CalcMyMoney fetches, normalises, and caches official UK statistics (Bank Rate, CPIH, UK HPI, Ofgem).',
          url: `${canonical}#methodology`,
          dateModified: lastUpdated ? lastUpdated.toISOString() : undefined,
          publisher: { '@type': 'Organization', name: 'CalcMyMoney' },
          about: [
            { '@type': 'DefinedTerm', name: 'Bank Rate', url: 'https://www.bankofengland.co.uk/' },
            { '@type': 'DefinedTerm', name: 'CPIH', url: 'https://www.ons.gov.uk/' },
            { '@type': 'DefinedTerm', name: 'UK HPI', url: 'https://landregistry.data.gov.uk/app/hpi/' },
            { '@type': 'DefinedTerm', name: 'Ofgem price cap', url: 'https://www.ofgem.gov.uk/energy-price-cap' },
          ],
        }}
      />
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
            {lastUpdated && (
              <div className="flex justify-center">
                <Badge variant="secondary" className="text-xs">
                  Last updated: {lastUpdated.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </Badge>
              </div>
            )}
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
              dataEndpoint={c.endpoint}
              status={c.status}
              stat={c.stat}
              error={errorBanner}
            />
          ))}
        </div>

        <section aria-labelledby="sources" className="mt-10">
          <h2 id="sources" className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Sources & downloads
          </h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-600 dark:text-gray-300">
            <li>
              BoE Bank Rate —
              <a
                href="https://www.bankofengland.co.uk/boeapps/database/Bank-Rate.asp"
                target="_blank"
                rel="noopener"
                className="text-blue-600 hover:underline"
              >
                official page
              </a>{' '}
              ·{' '}
              <a href="/api/boe/bank-rate" className="text-gray-600 hover:underline">JSON</a>
            </li>
            <li>
              CPIH (ONS) —
              <a
                href="https://www.ons.gov.uk/economy/inflationandpriceindices"
                target="_blank"
                rel="noopener"
                className="text-blue-600 hover:underline"
              >
                official page
              </a>{' '}
              ·{' '}
              <a href="/api/ons/cpih" className="text-gray-600 hover:underline">JSON</a>
            </li>
            <li>
              UK House Price (UKHPI) —
              <a
                href="https://landregistry.data.gov.uk/app/hpi/"
                target="_blank"
                rel="noopener"
                className="text-blue-600 hover:underline"
              >
                official page
              </a>{' '}
              ·{' '}
              <a href="/api/ukhpi/average-price" className="text-gray-600 hover:underline">JSON</a>
            </li>
            <li>
              Ofgem Price Cap —
              <a
                href="https://www.ofgem.gov.uk/energy-price-cap"
                target="_blank"
                rel="noopener"
                className="text-blue-600 hover:underline"
              >
                official page
              </a>{' '}
              ·{' '}
              <a href="/api/ofgem/price-cap" className="text-gray-600 hover:underline">JSON</a>
            </li>
          </ol>
        </section>

        {/* Related calculators to act on these stats */}
        <div className="mt-16">
          <RelatedCalculators
            calculators={[
              {
                name: 'Mortgage Calculator',
                url: '/mortgage-calculator-uk',
                description: 'Estimate repayments and see how Bank Rate scenarios change costs.',
              },
              {
                name: 'Mortgage Affordability Calculator',
                url: '/mortgage-affordability-calculator',
                description: 'Model income, rates, and term to estimate what you can borrow.',
              },
              {
                name: 'Budget / Expense Calculator',
                url: '/budget-calculator',
                description: 'Plan monthly spending and stress-test energy/price inflation.',
              },
              {
                name: 'Inflation Calculator',
                url: '/inflation-calculator',
                description: 'See how purchasing power changes over time at different CPIH rates.',
              },
              {
                name: 'Energy Bill Calculator',
                url: '/energy-bill-calculator',
                description: 'Estimate bills from unit rates and standing charges.',
              },
            ]}
          />
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Financial stats: FAQs
          </h2>
          <FAQSection faqs={statsFaqs} />
        </div>

        {/* Methodology */}
        <div id="methodology" className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            How we fetch & cache these stats
          </h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="sources">
              <AccordionTrigger>Official sources & parsing</AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                We fetch directly from official sources:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li><strong>Bank Rate</strong>: Bank of England JSON/CSV fallbacks.</li>
                  <li><strong>CPIH</strong>: ONS time series endpoints with tolerant parsing.</li>
                  <li><strong>UK HPI</strong>: HM Land Registry/ONS UK House Price Index.</li>
                  <li><strong>Ofgem cap</strong>: Ofgem cap page (typical-use, unit rates).</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="normalization">
              <AccordionTrigger>Normalization & units</AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                Each endpoint is normalized to a simple shape: <code>{'{ id, title, unit, value, period, change }'}</code>.
                We sanity-check units (percent vs percentage points vs GBP) and coerce dates to ISO at the start of a period.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="caching">
              <AccordionTrigger>Caching & freshness</AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                We set <code>Cache-Control</code> headers (e.g., <code>s-maxage</code>, <code>stale-while-revalidate</code>)
                on API responses. The badge at the top shows the most recent period across all sources.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="limitations">
              <AccordionTrigger>Limitations</AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                Publishers may change page structures, release times, or data definitions. If a source is temporarily unavailable,
                we show partial results and a notice until the next refresh succeeds.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
