import { getAllCalculators } from '@/components/data/calculatorConfig.js';

// Curated overrides for edge cases. Keyed by canonical calculator URL.
// Each value: array of { name, url, description? }
export const OVERRIDES = {
  // Example:
  // '/some-calculator': [
  //   { name: 'Salary Calculator', url: '/salary-calculator-uk' },
  // ],
};

const normaliseUrlKey = (value) => {
  if (value == null) return '';
  let candidate = String(value).trim();
  if (!candidate) return '';

  // Strip origin if an absolute URL was provided
  if (/^https?:\/\//i.test(candidate)) {
    try {
      const parsed = new URL(candidate);
      candidate = parsed.pathname || '';
      if (parsed.search) {
        candidate += parsed.search;
      }
      if (parsed.hash) {
        candidate += parsed.hash;
      }
    } catch (error) {
      candidate = candidate.replace(/^https?:\/\/[^/]+/i, '');
    }
  }

  const [pathPart] = candidate.split('#');
  const [pathOnly] = pathPart.split('?');
  let normalised = pathOnly.replace(/^\/+|\/+$/g, '').toLowerCase();

  if (!normalised) return '';

  if (normalised.startsWith('calculators/')) {
    normalised = normalised.slice('calculators/'.length);
  }

  return normalised;
};

function flattenWithContext() {
  const out = [];
  const cats = getAllCalculators() || [];
  (cats || []).forEach((cat) => {
    (cat?.subCategories || []).forEach((sub) => {
      (sub?.calculators || []).forEach((calc) => {
        if (!calc) return;
        out.push({
          ...calc,
          category: cat?.name,
          subCategory: sub?.name,
          urlKey:
            normaliseUrlKey(calc?.url) ||
            normaliseUrlKey(calc?.page) ||
            normaliseUrlKey(calc?.slug),
        });
      });
    });
  });
  return out;
}

export function getRelatedCalculators(currentUrl, opts = {}) {
  const { max = 3 } = opts;
  const currentKey = normaliseUrlKey(currentUrl);
  // 1) If there is a curated override, prefer it
  let curated = Array.isArray(OVERRIDES[currentUrl]) ? OVERRIDES[currentUrl] : null;
  if (!curated && currentKey) {
    const prefixed = `/calculators/${currentKey}`;
    curated = Array.isArray(OVERRIDES[prefixed]) ? OVERRIDES[prefixed] : null;
    if (!curated) {
      const rooted = `/${currentKey}`;
      curated = Array.isArray(OVERRIDES[rooted]) ? OVERRIDES[rooted] : null;
    }
  }
  if (curated && curated.length) {
    return curated.slice(0, max);
  }
  const allRaw = flattenWithContext();
  const all = allRaw.filter((c) => c?.status === 'active' && c?.urlKey && c.urlKey !== currentKey);

  const me = allRaw.find((c) => c?.urlKey && c.urlKey === currentKey);
  if (!me) return all.slice(0, max);

  const meTags = new Set((me.tags || []).map((t) => String(t).toLowerCase()));
  const score = (c) => {
    let s = 0;
    if (c.category && c.category === me.category) s += 3;
    if (c.subCategory && c.subCategory === me.subCategory) s += 2;
    const t2 = new Set((c.tags || []).map((t) => String(t).toLowerCase()));
    for (const t of meTags) if (t2.has(t)) s += 1;
    return s;
  };

  const scored = all
    .map((c) => ({ c, s: score(c) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, max)
    .map((x) => {
      const { urlKey, ...rest } = x.c;
      return rest;
    });

  if (scored.length > 0) return scored;

  // 2) Fallback defaults (core calculators)
  const defaults = [
    { name: 'Salary Calculator (UK)', url: '/salary-calculator-uk', description: 'Estimate take‑home pay.' },
    { name: 'PAYE Calculator', url: '/paye-calculator', description: 'Break down tax and NI.' },
    { name: 'Income Tax Calculator', url: '/income-tax-calculator', description: 'Calculate UK income tax liability.' },
  ];
  return defaults.slice(0, max);
}
