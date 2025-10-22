import { generatedCalculatorCatalog } from './calculatorCatalog.generated.js';
import { MAPPED_KEYWORDS } from '../seo/keywordMappings.js';

const ensureLeadingSlash = (value = '') => {
  if (typeof value !== 'string') return '/';
  const trimmed = value.trim();
  if (!trimmed) return '/';
  const normalised = trimmed.replace(/^\/+/, '');
  return normalised ? `/${normalised}` : '/';
};

const normalisePublicUrl = (value = '') => {
  if (typeof value !== 'string') return '/';
  const trimmed = value.trim();
  if (!trimmed) return '/';

  let normalised = trimmed.startsWith('/') ? trimmed : `/${trimmed.replace(/^\/+/, '')}`;
  if (normalised !== '/' && normalised.endsWith('/')) {
    normalised = normalised.replace(/\/+$/, '');
    if (!normalised) {
      normalised = '/';
    }
  }

  if (normalised === '/calculators') {
    return '/';
  }

  if (normalised.startsWith('/calculators/')) {
    const withoutPrefix = normalised.slice('/calculators'.length);
    return withoutPrefix ? ensureLeadingSlash(withoutPrefix) : '/';
  }

  return normalised;
};

const normalisePagePath = (value = '') => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim().replace(/^\/+/, '');
  if (!trimmed) return '';
  return trimmed.startsWith('calculators/') ? trimmed : `calculators/${trimmed}`;
};

const mergeKeywords = (name, keywords = []) => {
  const base = Array.isArray(keywords) ? keywords : [];
  const mapped = Array.isArray(MAPPED_KEYWORDS[name]) ? MAPPED_KEYWORDS[name] : [];
  return Array.from(new Set([...base, ...mapped]));
};

const addCategoryTag = (categorySlug, tags = []) => {
  const tagSet = new Set(Array.isArray(tags) ? tags : []);
  if (categorySlug) {
    tagSet.add(categorySlug);
  }
  return Array.from(tagSet);
};

const normaliseCalculator = (categorySlug, calculator) => {
  const name = calculator?.name?.trim() || 'Calculator';
  const slug = calculator?.slug || '';
  const url = normalisePublicUrl(calculator?.url || calculator?.page || slug);
  const page = normalisePagePath(calculator?.page || calculator?.slug || url.replace(/^\//, ''));
  return {
    ...calculator,
    name,
    url,
    page,
    description:
      calculator?.description?.trim() || `Use the ${name} to make informed UK money decisions.`,
    keywords: mergeKeywords(name, calculator?.keywords),
    status: calculator?.status || 'active',
    tags: addCategoryTag(categorySlug, calculator?.tags),
  };
};

const dedupeByUrl = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?.url || item?.page || item?.slug;
    if (!key) return false;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const calculatorCategories = generatedCalculatorCatalog.map((category) => {
  const calculators = dedupeByUrl(
    (category?.calculators || []).map((calc) => normaliseCalculator(category.slug, calc))
  );
  return {
    name: category.name,
    slug: category.slug,
    description: category.description,
    icon: null,
    iconSlug: category.slug,
    calculators,
    subCategories: [
      {
        name: `${category.name} Tools`,
        calculators,
      },
    ],
  };
});

export const allCalculators = calculatorCategories.flatMap((category) =>
  (category.subCategories || []).flatMap((sub) => sub.calculators || [])
);

export const totalCalculatorCount = allCalculators.length;

export const getAllCalculators = () => calculatorCategories;

export const getCalculatorStats = () => {
  const total = allCalculators.length;
  const active = allCalculators.filter((calc) => calc.status === 'active').length;
  const pending = total - active;
  return { total, active, pending };
};

export const getCalculatorsByStatus = (status) =>
  allCalculators.filter((calc) => calc.status === status);

export const searchCalculators = (query) => {
  const term = String(query || '').toLowerCase();
  if (!term) return [];
  return allCalculators.filter((calc) => {
    const inName = calc.name.toLowerCase().includes(term);
    const inDescription = calc.description.toLowerCase().includes(term);
    const inKeywords = calc.keywords.some((keyword) => keyword.toLowerCase().includes(term));
    return inName || inDescription || inKeywords;
  });
};
