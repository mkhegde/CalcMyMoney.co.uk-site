import { getAllCalculators } from '@/components/data/calculatorConfig';

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
        });
      });
    });
  });
  return out;
}

export function getRelatedCalculators(currentUrl, opts = {}) {
  const { max = 3 } = opts;
  const allRaw = flattenWithContext();
  const all = allRaw.filter(
    (c) => c?.status === 'active' && typeof c.url === 'string' && c.url !== currentUrl
  );

  const me = allRaw.find((c) => c?.url === currentUrl);
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

  return all
    .map((c) => ({ c, s: score(c) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, max)
    .map((x) => x.c);
}

